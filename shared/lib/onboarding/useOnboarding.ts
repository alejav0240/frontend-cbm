"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CONSULTA_ONBOARDING_VISTA,
  MARCAR_ONBOARDING_VISTA,
} from "@/shared/api/onboarding";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { obtenerPasosOnboarding } from "./config";
import type { PasoOnboarding } from "./tipos";

interface OnboardingViewQuery {
  onboardingView: {
    viewKey: string;
    completedAt: string;
  } | null;
}

const prepararAnclasDeVista = (pasos: PasoOnboarding[]) => {
  const pagina = document.querySelector<HTMLElement>("[data-onboarding-page]");
  if (!pagina) return [];

  const primerElemento = (selectores: string[]): HTMLElement | undefined => {
    for (const selector of selectores) {
      const encontrado = pagina.querySelector<HTMLElement>(selector);
      if (encontrado && visible(encontrado)) return encontrado;
    }
    return undefined;
  };

  const visible = (elemento: HTMLElement) => {
    const estilo = window.getComputedStyle(elemento);
    const rect = elemento.getBoundingClientRect();
    return (
      estilo.display !== "none" &&
      estilo.visibility !== "hidden" &&
      rect.width > 0 &&
      rect.height > 0
    );
  };

  const grids = Array.from(pagina.querySelectorAll<HTMLElement>("div.grid"));
  const botones = Array.from(
    pagina.querySelectorAll<HTMLButtonElement>("button"),
  );
  const textoBoton = (boton: HTMLButtonElement) =>
    boton.textContent?.trim().toLowerCase() || "";
  const esAccionPrincipal = (boton: HTMLButtonElement) =>
    /crear|nuevo|iniciar|agregar|añadir|registrar|generar|guardar|inscribir/.test(
      textoBoton(boton),
    );

  const anclas: Record<string, HTMLElement | undefined> = {
    header: primerElemento(["[data-onboarding-header]", "h1", "h2"]),
    stats:
      primerElemento([
        "[data-onboarding-stats]",
        "[data-kpi]",
        "[class*='grid-cols-']",
      ]) || grids[0],
    accion:
      primerElemento(["[data-onboarding-action]"]) ||
      botones.find((boton) => visible(boton) && esAccionPrincipal(boton)),
    busqueda: primerElemento([
      "[data-onboarding-search]",
      "input[type='search']",
      "input[placeholder*='Buscar' i]",
    ]),
    filtros: primerElemento([
      "[data-onboarding-filters]",
      "[role='combobox']",
      "select",
    ]),
    lista: primerElemento([
      "[data-onboarding-list]",
      "table",
      "[role='table']",
      "[role='list']",
    ]),
    tabs:
      primerElemento([
        "[data-onboarding-tabs]",
        "[role='tablist']",
        "[role='tab']",
      ]) ||
      Array.from(pagina.querySelectorAll<HTMLElement>("div, nav")).find(
        (contenedor) => {
          if (!visible(contenedor)) return false;
          const botonesVisibles = Array.from(contenedor.children).filter(
            (hijo) => hijo instanceof HTMLButtonElement && visible(hijo),
          );
          return botonesVisibles.length >= 2 && botonesVisibles.length <= 6;
        },
      ),
    extra: primerElemento(["[data-onboarding-extra]"]),
    modal: primerElemento([
      "[data-onboarding-modal]",
      '[role="dialog"][aria-modal="true"]',
    ]),
  };

  Object.entries(anclas).forEach(([rol, elemento]) => {
    elemento?.setAttribute(`data-onboarding-step-${rol}`, "");
  });

  return pasos.map((paso) => ({ ...paso, skipMissingElement: true }));
};

export const useOnboarding = () => {
  const pathname = usePathname();
  const usuarioId = useAuthStore((estado) => estado.usuario?.id);
  const tourActivoRef = useRef(false);
  const rutaMarcadaRef = useRef<string | null>(null);
  const pasos = useMemo(
    () => (pathname ? obtenerPasosOnboarding(pathname) : null),
    [pathname],
  );
  const habilitado = Boolean(pathname && usuarioId && pasos);
  const { data, loading } = useQuery<OnboardingViewQuery>(
    CONSULTA_ONBOARDING_VISTA,
    {
      variables: { viewKey: pathname || "" },
      skip: !habilitado,
      fetchPolicy: "network-only",
    },
  );
  const [marcarVista] = useMutation(MARCAR_ONBOARDING_VISTA);

  useEffect(() => {
    if (
      !habilitado ||
      !pathname ||
      !usuarioId ||
      !pasos ||
      loading ||
      data?.onboardingView ||
      rutaMarcadaRef.current === pathname ||
      tourActivoRef.current
    ) {
      return;
    }

    let cancelado = false;
    let instancia:
      | {
          drive: () => void;
          destroy: () => void;
          moveNext: () => void;
        }
      | undefined;
    let limpiarInteraccion = () => {};
    let interaccionCompletada = false;
    const tourCompletado = { current: false };
    const modalAbiertoPorTour = { current: false };

    const cerrarModalSeguro = () => {
      if (!modalAbiertoPorTour.current) return;
      const modal = document.querySelector<HTMLElement>(
        '[role="dialog"][aria-modal="true"]',
      );
      const botonCerrar = modal?.querySelector<HTMLElement>(
        '[aria-label="Cerrar modal"], [aria-label="Close"]',
      );
      botonCerrar?.click();
      modalAbiertoPorTour.current = false;
    };

    const iniciar = async () => {
      const { driver } = await import("driver.js");
      if (cancelado) return;

      const pasosDisponibles = prepararAnclasDeVista(pasos);
      if (pasosDisponibles.length === 0) {
        tourActivoRef.current = false;
        return;
      }

      tourActivoRef.current = true;
      const modoOscuro = document.documentElement.classList.contains("dark");
      instancia = driver({
        animate: true,
        overlayColor: modoOscuro ? "#061414" : "#111827",
        overlayOpacity: modoOscuro ? 0.78 : 0.55,
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        popoverClass: "driverjs-theme",
        steps: pasosDisponibles,
        onHighlighted: (elemento, paso, opciones) => {
          limpiarInteraccion();
          interaccionCompletada = !paso.data?.interaccion;

          if (!elemento || !paso.data?.interaccion) return;

          const tipo = paso.data.interaccion as "click" | "input" | "change";
          const evento = (evento: Event) => {
            const objetivoActual = document.querySelector(
              paso.element as string,
            );
            const origen = evento.target;
            if (
              !objetivoActual ||
              !(origen instanceof Node) ||
              (origen !== objetivoActual && !objetivoActual.contains(origen))
            ) {
              return;
            }
            interaccionCompletada = true;
            if (paso.data?.rol === "accion") {
              modalAbiertoPorTour.current = true;
            }
            limpiarInteraccion();
            window.setTimeout(() => opciones.driver.moveNext(), 180);
          };
          document.addEventListener(tipo, evento, true);
          limpiarInteraccion = () =>
            document.removeEventListener(tipo, evento, true);
        },
        onNextClick: (_elemento, paso, opciones) => {
          if (paso.data?.interaccion && !interaccionCompletada) return;
          opciones.driver.moveNext();
        },
        onPrevClick: (_elemento, _paso, opciones) => {
          limpiarInteraccion();
          cerrarModalSeguro();
          opciones.driver.movePrevious();
        },
        onCloseClick: (_elemento, _paso, opciones) => {
          limpiarInteraccion();
          cerrarModalSeguro();
          opciones.driver.destroy();
        },
        onDoneClick: (_elemento, _paso, opciones) => {
          tourCompletado.current = true;
          cerrarModalSeguro();
          opciones.driver.destroy();
        },
        onDeselected: (_elemento, paso) => {
          if (paso.data?.rol === "modal") cerrarModalSeguro();
        },
        onDestroyed: () => {
          limpiarInteraccion();
          cerrarModalSeguro();
          if (tourCompletado.current) {
            rutaMarcadaRef.current = pathname;
            void marcarVista({ variables: { viewKey: pathname } });
          }
          tourActivoRef.current = false;
        },
      });
      instancia.drive();
    };

    void iniciar();

    return () => {
      cancelado = true;
      limpiarInteraccion();
      instancia?.destroy();
      tourActivoRef.current = false;
    };
  }, [data, habilitado, loading, marcarVista, pathname, pasos, usuarioId]);
};
