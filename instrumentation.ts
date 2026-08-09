export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const {
    recuperarJobsColgados,
    procesarSubidasPendientes,
    limpiarSubidasVencidas,
  } = await import("@/app/api/upload/worker");

  void recuperarJobsColgados(true).then(() => {
    void procesarSubidasPendientes();
  });

  const interval = setInterval(() => {
    void procesarSubidasPendientes();
  }, 30_000);

  const limpieza = setInterval(() => {
    void limpiarSubidasVencidas();
  }, 6 * 60 * 60 * 1000);

  if (typeof interval.unref === "function") {
    interval.unref();
  }
  if (typeof limpieza.unref === "function") {
    limpieza.unref();
  }
}
