const DB_NAME = "cbm-subidas";
const DB_VERSION = 1;
const STORE = "pendientes";

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
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const transaccion = async <T>(
  modo: IDBTransactionMode,
  operacion: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await abrirDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, modo);
    const store = tx.objectStore(STORE);
    const request = operacion(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const guardarGrabacionPendiente = async (item: GrabacionPendiente) => {
  await transaccion("readwrite", (store) => store.put(item));
};

export const listarGrabacionesPendientes =
  async (): Promise<GrabacionPendiente[]> => {
    return transaccion("readonly", (store) => store.getAll());
  };

export const eliminarGrabacionPendiente = async (sessionId: string) => {
  await transaccion("readwrite", (store) => store.delete(sessionId));
};

const subirGrabacionAlServidor = (
  item: GrabacionPendiente,
  onProgreso?: (progreso: ProgresoSubida) => void,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/ingest");
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
