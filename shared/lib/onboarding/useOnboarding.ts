"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CONSULTA_ONBOARDING_VISTA,
  MARCAR_ONBOARDING_VISTA,
} from "@/shared/api/onboarding";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { obtenerClaveOnboarding, obtenerPasosOnboarding } from "./config";
import type { PasoOnboarding, RolOnboarding } from "./tipos";

interface OnboardingViewQuery {
  onboardingView: {
    viewKey: string;
    completedAt: string;
  } | null;
}

const selectoresPorRol: Record<RolOnboarding, string> = {
  header: "[data-onboarding-header], h1, h2",
  stats: "[data-onboarding-stats], [data-kpi]",
  accion: "[data-onboarding-action]",
  busqueda:
    "[data-onboarding-search], input[type='search'], input[placeholder*='Buscar' i]",
  filtros: "[data-onboarding-filters], [role='combobox'], select",
  lista: "[data-onboarding-list], table, [role='table'], [role='list']",
  tabs: "[data-onboarding-tabs], [role='tablist'], [role='tab']",
  modal: "[data-onboarding-modal], [role='dialog'][aria-modal='true']",
  extra: "[data-onboarding-extra]",
};

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

  const anclas: Record<string, HTMLElement | undefined> = {
    header: primerElemento(["[data-onboarding-header]", "h1", "h2"]),
    stats: primerElemento(["[data-onboarding-stats]", "[data-kpi]"]),
    accion: primerElemento(["[data-onboarding-action]"]),
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
    tabs: primerElemento(["[data-onboarding-tabs]", "[role='tablist']"]),
    extra: primerElemento(["[data-onboarding-extra]"]),
    modal: primerElemento([
      "[data-onboarding-modal]",
      '[role="dialog"][aria-modal="true"]',
    ]),
  };

  Object.entries(anclas).forEach(([rol, elemento]) => {
    elemento?.setAttribute(`data-onboarding-step-${rol}`, "");
  });

  return pasos
    .filter((paso) => {
      const rol = paso.data?.rol as RolOnboarding | undefined;
      if (rol === "modal") return Boolean(anclas.accion);
      if (rol && paso.waitForElement) return true;
      if (rol) return Boolean(anclas[rol]);
      return Boolean(document.querySelector(paso.element));
    })
    .map((paso) => {
      const rol = paso.data?.rol as RolOnboarding | undefined;
      return {
        ...paso,
        element:
          rol && paso.waitForElement ? selectoresPorRol[rol] : paso.element,
        skipMissingElement: true,
      };
    });
};

export const useOnboarding = () => {
  const pathname = usePathname();
  const usuarioId = useAuthStore((estado) => estado.usuario?.id);
  const tourActivoRef = useRef(false);
  const rutaMarcadaRef = useRef<string | null>(null);
  const [vistaARepetir, setVistaARepetir] = useState<string | null>(null);
  const claveVista = useMemo(
    () => (pathname ? obtenerClaveOnboarding(pathname) : null),
    [pathname],
  );
  const pasos = useMemo(
    () => (pathname ? obtenerPasosOnboarding(pathname) : null),
    [pathname],
  );
  const habilitado = Boolean(claveVista && usuarioId && pasos);
  const { data, loading, error } = useQuery<OnboardingViewQuery>(
    CONSULTA_ONBOARDING_VISTA,
    {
      variables: { viewKey: claveVista || "" },
      skip: !habilitado,
      fetchPolicy: "network-only",
    },
  );
  const [marcarVista] = useMutation(MARCAR_ONBOARDING_VISTA);

  useEffect(() => {
    const repetirTour = () => {
      if (!claveVista) return;
      rutaMarcadaRef.current = null;
      setVistaARepetir(claveVista);
    };

    window.addEventListener("cbm:repetir-onboarding", repetirTour);
    return () =>
      window.removeEventListener("cbm:repetir-onboarding", repetirTour);
  }, [claveVista]);

  useEffect(() => {
    if (
      !habilitado ||
      !pathname ||
      !claveVista ||
      !usuarioId ||
      !pasos ||
      loading ||
      error ||
      (data?.onboardingView && vistaARepetir !== claveVista) ||
      rutaMarcadaRef.current === claveVista ||
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
          refresh: () => void;
        }
      | undefined;
    let limpiarInteraccion = () => {};
    let limpiarTimer = () => {};
    const tourFinalizado = { current: false };
    const destruido = { current: false };
    const modalAbiertoPorTour = { current: false };

    const destruirTour = () => {
      if (destruido.current) return;
      destruido.current = true;
      instancia?.destroy();
    };

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
          limpiarTimer();

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
            if (paso.data?.rol === "accion") {
              modalAbiertoPorTour.current = true;
            }
            limpiarInteraccion();
            opciones.driver.moveNext();
            // El click puede modificar el layout antes de que Driver.js mida el siguiente paso.
            const timer = window.setTimeout(() => opciones.driver.refresh(), 0);
            limpiarTimer = () => window.clearTimeout(timer);
          };
          document.addEventListener(tipo, evento, true);
          limpiarInteraccion = () =>
            document.removeEventListener(tipo, evento, true);
        },
        onNextClick: (_elemento, paso, opciones) => {
          if (paso.data?.interaccion) return;
          opciones.driver.moveNext();
        },
        onPrevClick: (_elemento, _paso, opciones) => {
          limpiarInteraccion();
          limpiarTimer();
          cerrarModalSeguro();
          opciones.driver.movePrevious();
        },
        onCloseClick: (_elemento, _paso, _opciones) => {
          limpiarInteraccion();
          limpiarTimer();
          cerrarModalSeguro();
          tourFinalizado.current = true;
          destruirTour();
        },
        onDoneClick: (_elemento, _paso, _opciones) => {
          tourFinalizado.current = true;
          cerrarModalSeguro();
          destruirTour();
        },
        onDeselected: (_elemento, paso) => {
          if (paso.data?.rol === "modal") cerrarModalSeguro();
        },
        onDestroyStarted: () => {
          // Driver.js también destruye el tour con Escape o al pulsar el fondo.
          // No guardamos esos cierres cuando el componente se desmonta al navegar.
          if (!cancelado) tourFinalizado.current = true;
          destruirTour();
        },
        onDestroyed: () => {
          limpiarInteraccion();
          limpiarTimer();
          cerrarModalSeguro();
          if (tourFinalizado.current) {
            rutaMarcadaRef.current = claveVista;
            setVistaARepetir(null);
            // Si falla la persistencia no reiniciamos el tour en esta sesión.
            // La siguiente visita volverá a consultar al backend.
            void marcarVista({ variables: { viewKey: claveVista } }).catch(
              () => undefined,
            );
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
      limpiarTimer();
      destruirTour();
      tourActivoRef.current = false;
    };
  }, [
    claveVista,
    data,
    error,
    habilitado,
    loading,
    marcarVista,
    pathname,
    pasos,
    usuarioId,
    vistaARepetir,
  ]);
};
