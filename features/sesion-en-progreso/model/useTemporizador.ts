import { useState, useEffect, useCallback } from "react";

export const useTemporizador = (estaActivo: boolean = true) => {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    let intervalo: any;
    if (estaActivo) {
      intervalo = setInterval(() => {
        setSegundos((s) => s + 1);
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
    reiniciar: () => setSegundos(0),
  };
};
