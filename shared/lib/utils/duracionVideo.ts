export const obtenerDuracionVideo = (archivo: Blob): Promise<number | null> =>
  new Promise((resolve) => {
    if (typeof document === "undefined" || typeof URL === "undefined") {
      resolve(null);
      return;
    }

    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(archivo);
    let resuelto = false;

    const finalizar = (duracion: number | null) => {
      if (resuelto) return;
      resuelto = true;
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute("src");
      video.load();
      resolve(duracion);
    };

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duracion = video.duration;
      finalizar(Number.isFinite(duracion) && duracion > 0 ? duracion : null);
    };
    video.onerror = () => finalizar(null);
    video.src = objectUrl;
  });

export const minutosDesdeSegundos = (segundos?: number | null): number | null => {
  if (typeof segundos !== "number" || !Number.isFinite(segundos) || segundos <= 0) {
    return null;
  }
  return Math.max(1, Math.round(segundos / 60));
};
