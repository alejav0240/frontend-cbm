import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

const getSupportedMimeType = (): string => {
  const types = [
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9,opus",
    "video/webm",
    "video/mp4",
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
};

const enumerarDispositivos = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === "videoinput");
  } catch {
    return [];
  }
};

export const useGrabacion = () => {
  const [estaGrabando, setEstaGrabando] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [dispositivos, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [dispositivoSeleccionado, setSelectedDeviceId] = useState<string>("");
  const [archivoGrabacion, setArchivoGrabacion] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const iniciarGrabacion = useCallback(
    async (deviceId?: string) => {
      try {
        recordedChunksRef.current = [];
        setArchivoGrabacion(null);
        const targetId = deviceId || dispositivoSeleccionado;

        const videoConstraints: MediaTrackConstraints = targetId
          ? {
              deviceId: { exact: targetId },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          : {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
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
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setEstaGrabando(true);
        toast.success("Grabación iniciada");
      } catch (err) {
        console.error(err);
        toast.error("Error: verifica permisos de cámara y micrófono");
      }
    },
    [dispositivoSeleccionado],
  );

  const construirArchivoGrabacion = useCallback(() => {
    if (recordedChunksRef.current.length === 0) return null;

    const blob = new Blob(recordedChunksRef.current, {
      type: recordedChunksRef.current[0]?.type || "video/webm",
    });
    const file = new File([blob], `sesion-${Date.now()}.webm`, {
      type: blob.type || "video/webm",
      lastModified: Date.now(),
    });

    setArchivoGrabacion(file);
    return file;
  }, []);

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
      const finalizar = () => {
        detenerStream();
        setEstaGrabando(false);
        const file = construirArchivoGrabacion();
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

  const cambiarCamara = useCallback(
    async (deviceId: string) => {
      setSelectedDeviceId(deviceId);
      if (estaGrabando || stream) {
        stream?.getTracks().forEach((t) => t.stop());
        await iniciarGrabacion(deviceId);
      }
    },
    [estaGrabando, stream, iniciarGrabacion],
  );

  return {
    estaGrabando,
    stream,
    dispositivos,
    dispositivoSeleccionado,
    iniciarGrabacion,
    detenerGrabacion,
    cambiarCamara,
    archivoGrabacion,
  };
};
