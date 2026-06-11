"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Music, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import MusicalNotes from "@/shared/ui/MusicalNotes";
import { useTheme } from "next-themes";
import { INICIO_SESION_MUTACION } from "@/shared/api/auth";
import { esquemaLogin, DatosFormularioLogin } from "@/shared/lib/esquemas-auth";
import { useAuthStore } from "@/shared/model/useAuthStore";

export default function Login() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const router = useRouter();
  const { setUsuario } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);

  const [login, { loading }] = useMutation(INICIO_SESION_MUTACION, {
    onCompleted: (data: any) => {
      if (data.tokenAuth?.token) {
        localStorage.setItem("token", data.tokenAuth.token);
        localStorage.setItem("refreshToken", data.tokenAuth.refreshToken);
        toast.success("¡Bienvenido de nuevo!");
        setIsNavigating(true);
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error("Error al iniciar sesión. Por favor, intenta de nuevo.");
    },
  });

  const isBusy = loading || isNavigating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioLogin>({
    resolver: zodResolver(esquemaLogin),
  });

  const onFormSubmit = useCallback(
    (data: DatosFormularioLogin) => {
      if (isBusy) return;
      login({
        variables: {
          username: data.username,
          password: data.password,
        },
      });
    },
    [isBusy, login],
  );

  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? "light" : "dark");
  }, [isDarkMode, setTheme]);

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      <MusicalNotes />

      {isNavigating && (
        <div className="fixed inset-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-[#008080] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#008080] font-bold text-sm uppercase tracking-widest">
            Cargando panel...
          </p>
        </div>
      )}

      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-accent rounded-2xl shadow-lg border border-black/5 dark:border-white/5 text-gray-400 hover:text-[#008080] transition-all"
          aria-label="Cambiar tema"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-accent rounded-[48px] p-10 lg:p-12 shadow-2xl border border-black/5 dark:border-white/5 transition-colors duration-500">
          <div className="text-center mb-10">
            <div className="relative w-48 h-12 mx-auto mb-8">
              <Image
                src="/logohorizontal.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="serif text-3xl mb-2 dark:text-white">
              Panel Administrativo
            </h1>
            <p className="text-gray-400 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">
                Usuario
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  {...register("username")}
                  className={`w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border focus:bg-white dark:focus:bg-white/10 outline-none transition-all dark:text-white ${errors.username ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
                  placeholder="usuario"
                  disabled={isBusy}
                />
                {errors.username && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-4">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  {...register("password")}
                  className={`w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border focus:bg-white dark:focus:bg-white/10 outline-none transition-all dark:text-white ${errors.password ? "border-red-500" : "border-transparent focus:border-[#008080]"}`}
                  placeholder="••••••••"
                  disabled={isBusy}
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-4">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full bg-[#008080] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#006666] transition-all shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {isNavigating ? "Cargando panel..." : "Iniciando sesión..."}
                  </span>
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 text-center">
            <div className="inline-flex items-center gap-2 text-[#008080]/40 text-xs font-bold uppercase tracking-widest">
              <Music size={14} />
              <span>Centro Boliviano de Musicoterapia</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
