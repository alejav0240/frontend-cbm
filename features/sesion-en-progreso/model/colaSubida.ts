const DB_NAME = "cbm-subidas";
const DB_VERSION = 2;
const STORE = "pendientes";
const FRAGMENT_STORE = "fragmentos";

export type GrabacionPendiente = {
  sessionId: string;
  archivo: File;
  pacienteId: string;
  pacienteNombre: string;
  grabadoEn: string;
  addedAt: number;
};

export type ProgresoSubida = {
  bytesCargados: number;
  bytesTotales: number;
};

export type ResultadoSubida = "ok" | "pendiente";

export type FragmentoGrabacion = {
  id: string;
  sessionId: string;
  index: number;
  blob: Blob;
};

const abrirDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB no disponible"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "sessionId" });
      }
      if (!db.objectStoreNames.contains(FRAGMENT_STORE)) {
        db.createObjectStore(FRAGMENT_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const transaccion = async <T>(
  modo: IDBTransactionMode,
  operacion: (store: IDBObjectStore) => IDBRequest<T>,
  storeName = STORE,
): Promise<T> => {
  const db = await abrirDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, modo);
    const store = tx.objectStore(storeName);
    const request = operacion(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const guardarGrabacionPendiente = async (item: GrabacionPendiente) => {
  try {
    await transaccion("readwrite", (store) => store.put(item));
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      throw new Error(
        "No hay espacio suficiente para respaldar la grabación en el dispositivo.",
      );
    }
    throw error;
  }
};

export const listarGrabacionesPendientes = async (): Promise<
  GrabacionPendiente[]
> => {
  return transaccion("readonly", (store) => store.getAll());
};

export const eliminarGrabacionPendiente = async (sessionId: string) => {
  await transaccion("readwrite", (store) => store.delete(sessionId));
};

export const guardarFragmentoGrabacion = async (
  fragmento: FragmentoGrabacion,
) => {
  await transaccion(
    "readwrite",
    (store) => store.put(fragmento),
    FRAGMENT_STORE,
  );
};

export const listarFragmentosGrabacion = async (sessionId: string) => {
  const fragmentos = await transaccion<FragmentoGrabacion[]>(
    "readonly",
    (store) => store.getAll(),
    FRAGMENT_STORE,
  );
  return fragmentos
    .filter((fragmento) => fragmento.sessionId === sessionId)
    .sort((a, b) => a.index - b.index);
};

export const eliminarFragmentosGrabacion = async (sessionId: string) => {
  const fragmentos = await listarFragmentosGrabacion(sessionId);
  await Promise.all(
    fragmentos.map((fragmento) =>
      transaccion(
        "readwrite",
        (store) => store.delete(fragmento.id),
        FRAGMENT_STORE,
      ),
    ),
  );
};

const subirGrabacionAlServidor = (
  item: GrabacionPendiente,
  onProgreso?: (progreso: ProgresoSubida) => void,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/ingest");
    xhr.timeout = 120_000;
    xhr.setRequestHeader("Content-Type", item.archivo.type || "video/webm");
    xhr.setRequestHeader("x-session-id", item.sessionId);
    xhr.setRequestHeader("x-paciente-id", item.pacienteId);
    xhr.setRequestHeader("x-paciente-nombre", item.pacienteNombre);
    xhr.setRequestHeader("x-numero-ciclo", "sin-ciclo");
    xhr.setRequestHeader("x-grabado-en", item.grabadoEn);

    xhr.upload.onprogress = (e) => {
      if (onProgreso && e.lengthComputable) {
        onProgreso({ bytesCargados: e.loaded, bytesTotales: e.total });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      try {
        const data = JSON.parse(xhr.responseText) as {
          message?: string;
        };
        reject(new Error(data.message || `Error ${xhr.status} al subir`));
      } catch {
        reject(new Error(`Error ${xhr.status} al subir la grabación`));
      }
    };
    xhr.onerror = () => reject(new Error("Error de red al subir la grabación"));
    xhr.ontimeout = () =>
      reject(new Error("Se agotó el tiempo al subir la grabación"));

    xhr.send(item.archivo);
  });

export const subirEnSegundoPlano = async (
  item: GrabacionPendiente,
  onProgreso?: (progreso: ProgresoSubida) => void,
): Promise<ResultadoSubida> => {
  try {
    await guardarGrabacionPendiente(item);
  } catch (error) {
    console.warn("No se pudo respaldar la grabación en IndexedDB:", error);
  }

  try {
    await subirGrabacionAlServidor(item, onProgreso);
    await eliminarGrabacionPendiente(item.sessionId);
    return "ok";
  } catch (error) {
    console.warn(
      "Subida en segundo plano quedó pendiente de reintento:",
      error,
    );
    return "pendiente";
  }
};

export const reanudarSubidasPendientes = async () => {
  try {
    const pendientes = await listarGrabacionesPendientes();
    for (const item of pendientes) {
      void subirEnSegundoPlano(item);
    }
  } catch (error) {
    console.warn("No se pudo reanudar las subidas pendientes:", error);
  }
};
