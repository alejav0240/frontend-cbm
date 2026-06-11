import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

export const useGrabacion = () => {
  const [estaGrabando, setEstaGrabando] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [dispositivos, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [dispositivoSeleccionado, setSelectedDeviceId] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      setVideoDevices(videoInputs);
      if (videoInputs.length > 0) setSelectedDeviceId((prev) => prev || videoInputs[0].deviceId);
    }).catch(console.error);
  }, []);

  const iniciarGrabacion = useCallback(async (deviceId?: string) => {
    try {
      recordedChunksRef.current = [];
      const targetId = deviceId || dispositivoSeleccionado;
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: targetId ? { exact: targetId } : undefined, width: 1280, height: 720 },
        audio: true,
      });
      
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;

      const recorder = new MediaRecorder(mediaStream, { mimeType: "video/webm;codecs=vp8,opus" });
      
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
  }, [dispositivoSeleccionado]);

  const detenerGrabacion = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    stream?.getTracks().forEach((t) => t.stop());
    setEstaGrabando(false);
    toast.success("Grabación detenida");
  }, [stream]);

  const cambiarCamara = useCallback(async (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (estaGrabando || stream) {
      stream?.getTracks().forEach((t) => t.stop());
      await iniciarGrabacion(deviceId);
    }
  }, [estaGrabando, stream, iniciarGrabacion]);

  return {
    estaGrabando,
    stream,
    dispositivos,
    dispositivoSeleccionado,
    videoRef,
    iniciarGrabacion,
    detenerGrabacion,
    cambiarCamara,
    recordedChunks: recordedChunksRef.current,
  };
};
