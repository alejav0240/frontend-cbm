import { useState, useEffect, useCallback, useRef } from "react";

export const useTemporizador = (
  estaActivo: boolean = true,
  startTime?: Date,
) => {
  const [segundos, setSegundos] = useState(() => {
    if (startTime) {
      return Math.max(0, Math.floor((Date.now() - startTime.getTime()) / 1000));
    }
    return 0;
  });
  const ultimoTickRef = useRef<number | null>(null);

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | undefined;
    if (estaActivo) {
      ultimoTickRef.current = Date.now();
      intervalo = setInterval(() => {
        const ahora = Date.now();
        const transcurridos = Math.max(
          0,
          Math.floor((ahora - (ultimoTickRef.current ?? ahora)) / 1000),
        );
        if (transcurridos > 0) setSegundos((s) => s + transcurridos);
        ultimoTickRef.current = ahora;
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [estaActivo]);

  const formatearTiempo = useCallback((totalSegundos: number) => {
    const mins = Math.floor(totalSegundos / 60);
    const secs = totalSegundos % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  return {
    segundos,
    tiempoFormateado: formatearTiempo(segundos),
    formatearTiempo,
    reiniciar: () => setSegundos(0),
  };
};
