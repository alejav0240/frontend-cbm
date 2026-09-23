import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  eliminarFragmentosGrabacion,
  guardarFragmentoGrabacion,
  listarFragmentosGrabacion,
} from "./colaSubida";

const getSupportedMimeType = (): string => {
  const types = [
    // Safari/iOS prefers MP4. Keep WebM as a fallback for Chromium/Firefox.
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9,opus",
    "video/webm",
  ];
  for (const type of types) {
    if (
      typeof MediaRecorder !== "undefined" &&
      typeof MediaRecorder.isTypeSupported === "function" &&
      MediaRecorder.isTypeSupported(type)
    ) {
      return type;
    }
  }
  return "";
};

const extensionForMimeType = (mimeType: string) =>
  mimeType.includes("mp4") ? "mp4" : "webm";

const enumerarDispositivos = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === "videoinput");
  } catch {
    return [];
  }
};

export const useGrabacion = (sessionId?: string) => {
  const [estaGrabando, setEstaGrabando] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [dispositivos, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [dispositivoSeleccionado, setSelectedDeviceId] = useState<string>("");
  const [archivoGrabacion, setArchivoGrabacion] = useState<File | null>(null);
  const [errorGrabacion, setErrorGrabacion] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const fragmentIndexRef = useRef(0);
  const fragmentWritesRef = useRef<Promise<void>[]>([]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const iniciarGrabacion = useCallback(
    async (deviceId?: string) => {
      try {
        setErrorGrabacion(null);
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
          throw new Error("La cámara requiere una conexión HTTPS segura.");
        }
        if (typeof MediaRecorder === "undefined") {
          throw new Error("Este navegador no permite grabar video.");
        }
        recordedChunksRef.current = [];
        fragmentIndexRef.current = 0;
        fragmentWritesRef.current = [];
        if (sessionId)
          void eliminarFragmentosGrabacion(sessionId).catch(() => undefined);
        setArchivoGrabacion(null);
        const targetId = deviceId || dispositivoSeleccionado;

        const videoConstraints: MediaTrackConstraints = targetId
          ? {
              deviceId: { exact: targetId },
              width: { ideal: 960, max: 1280 },
              height: { ideal: 540, max: 720 },
              frameRate: { ideal: 24, max: 30 },
            }
          : {
              facingMode: "user",
              width: { ideal: 960, max: 1280 },
              height: { ideal: 540, max: 720 },
              frameRate: { ideal: 24, max: 30 },
            };

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: true,
        });

        const videoInputs = await enumerarDispositivos();
        setVideoDevices(videoInputs);
        const activeTrack = mediaStream.getVideoTracks()[0];
        if (activeTrack) {
          const settings = activeTrack.getSettings();
          if (settings.deviceId) setSelectedDeviceId(settings.deviceId);
        }

        setStream(mediaStream);

        const mimeType = getSupportedMimeType();
        const recorderOptions: MediaRecorderOptions = {};
        if (mimeType) recorderOptions.mimeType = mimeType;

        const recorder = new MediaRecorder(mediaStream, recorderOptions);

        recorder.ondataavailable = (e) => {
          if (e.data.size === 0) return;
          const index = fragmentIndexRef.current++;
          if (sessionId) {
            const write = guardarFragmentoGrabacion({
              id: `${sessionId}-${index}`,
              sessionId,
              index,
              blob: e.data,
            }).catch(() => {
              recordedChunksRef.current.push(e.data);
            });
            fragmentWritesRef.current.push(write);
          } else {
            recordedChunksRef.current.push(e.data);
          }
        };
        recorder.onerror = () => {
          setErrorGrabacion(
            "La grabación fue interrumpida por el dispositivo.",
          );
          mediaStream.getTracks().forEach((track) => track.stop());
          setStream(null);
          setEstaGrabando(false);
        };
        mediaStream.getTracks().forEach((track) => {
          track.addEventListener("ended", () => {
            if (mediaRecorderRef.current?.state === "recording") {
              setErrorGrabacion("La cámara o el micrófono se desconectó.");
              recorder.stop();
            }
          });
        });

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setEstaGrabando(true);
        toast.success("Grabación iniciada");
      } catch (err) {
        console.error(err);
        const name = err instanceof DOMException ? err.name : "";
        const message =
          err instanceof Error ? err.message : "No se pudo iniciar la cámara.";
        const detail =
          name === "NotAllowedError"
            ? "Permite cámara y micrófono en Ajustes > Safari y vuelve a intentarlo."
            : name === "NotReadableError"
              ? "La cámara está siendo usada por otra aplicación."
              : name === "OverconstrainedError"
                ? "La cámara no admite esta resolución. Intenta nuevamente."
                : message;
        setErrorGrabacion(detail);
        toast.error(detail);
      }
    },
    [dispositivoSeleccionado, sessionId],
  );

  const construirArchivoGrabacion = useCallback(async () => {
    let chunks = recordedChunksRef.current;
    if (sessionId) {
      try {
        await Promise.all(fragmentWritesRef.current);
        const fragmentos = await listarFragmentosGrabacion(sessionId);
        if (fragmentos.length > 0)
          chunks = fragmentos.map((fragmento) => fragmento.blob);
      } catch {
        // Use the in-memory fallback when IndexedDB is unavailable.
      }
    }
    if (chunks.length === 0) return null;

    const blob = new Blob(chunks, {
      type: chunks[0]?.type || "video/webm",
    });
    const mimeType = blob.type || chunks[0]?.type || "video/webm";
    const extension = extensionForMimeType(mimeType);
    const file = new File([blob], `sesion-${Date.now()}.${extension}`, {
      type: mimeType,
      lastModified: Date.now(),
    });

    setArchivoGrabacion(file);
    if (sessionId)
      void eliminarFragmentosGrabacion(sessionId).catch(() => undefined);
    return file;
  }, [sessionId]);

  const detenerGrabacion = useCallback(async (): Promise<File | null> => {
    const recorder = mediaRecorderRef.current;

    const detenerStream = () => {
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
    };

    if (!recorder) {
      detenerStream();
      setEstaGrabando(false);
      return archivoGrabacion;
    }

    const archivo = await new Promise<File | null>((resolve) => {
      const finalizar = async () => {
        detenerStream();
        setEstaGrabando(false);
        const file = await construirArchivoGrabacion();
        mediaRecorderRef.current = null;
        resolve(file);
      };

      if (recorder.state === "inactive") {
        finalizar();
        return;
      }

      recorder.onstop = finalizar;
      recorder.stop();
    });

    toast.success("Grabación detenida");
    return archivo;
  }, [archivoGrabacion, construirArchivoGrabacion, stream]);

  const pausarGrabacion = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.pause();
      toast.info("Grabación en pausa");
    }
  }, []);

  const reanudarGrabacion = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      toast.success("Grabación reanudada");
    }
  }, []);

  const cambiarCamara = useCallback(
    async (deviceId: string) => {
      if (estaGrabando) {
        toast.warning("Detén la grabación antes de cambiar de cámara.");
        return;
      }
      setSelectedDeviceId(deviceId);
    },
    [estaGrabando],
  );

  return {
    estaGrabando,
    stream,
    dispositivos,
    dispositivoSeleccionado,
    iniciarGrabacion,
    detenerGrabacion,
    pausarGrabacion,
    reanudarGrabacion,
    cambiarCamara,
    archivoGrabacion,
    errorGrabacion,
  };
};
