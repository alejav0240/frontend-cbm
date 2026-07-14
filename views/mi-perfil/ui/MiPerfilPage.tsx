"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import {
  User,
  Mail,
  CreditCard,
  Phone,
  Save,
  Key,
  Camera,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { useUpdateUser } from "@/entities/usuario";
import { useChangePassword } from "@/entities/usuario/api/useChangePassword";
import {
  esquemaEditarPerfil,
  esquemaCambiarContrasena,
  type DatosEditarPerfil,
  type DatosCambiarContrasena,
} from "@/entities/usuario/model/esquema";

export const MiPerfilPage = () => {
  const { usuario, setUsuario } = useAuthStore();
  const { actualizarUsuario, loading: guardando } = useUpdateUser();
  const { cambiarPassword, loading: cambiandoPassword } = useChangePassword();

  const [editando, setEditando] = React.useState(false);

  const {
    register: registerPerfil,
    handleSubmit: handleSubmitPerfil,
    formState: { errors: errorsPerfil },
    reset: resetPerfil,
  } = useForm<DatosEditarPerfil>({
    resolver: zodResolver(esquemaEditarPerfil),
    defaultValues: {
      firstName: usuario?.firstName ?? "",
      lastName: usuario?.lastName ?? "",
      email: usuario?.email ?? "",
      celular: usuario?.celular ?? "",
      ci: usuario?.ci ?? "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<DatosCambiarContrasena>({
    resolver: zodResolver(esquemaCambiarContrasena),
  });

  React.useEffect(() => {
    if (usuario) {
      resetPerfil({
        firstName: usuario.firstName ?? "",
        lastName: usuario.lastName ?? "",
        email: usuario.email ?? "",
        celular: usuario.celular ?? "",
        ci: usuario.ci ?? "",
      });
    }
  }, [usuario, resetPerfil]);

  const onGuardarPerfil = async (datos: DatosEditarPerfil) => {
    if (!usuario) return;
    try {
      const { data } = await actualizarUsuario({
        id: usuario.databaseId,
        firstName: datos.firstName,
        lastName: datos.lastName,
        email: datos.email,
        celular: datos.celular,
        ci: datos.ci,
      });
      const actualizado = data?.updateUser?.user;
      if (actualizado) {
        setUsuario({
          ...usuario,
          firstName: actualizado.firstName,
          lastName: actualizado.lastName,
          fullName: actualizado.fullName,
          email: actualizado.email,
          celular: actualizado.celular,
          ci: actualizado.ci,
        });
      }
      setEditando(false);
      toast.success("Perfil actualizado correctamente");
    } catch {
      toast.error("Error al actualizar el perfil");
    }
  };

  const onCambiarPassword = async (datos: DatosCambiarContrasena) => {
    try {
      const { data } = await cambiarPassword({
        oldPassword: datos.oldPassword,
        newPassword: datos.newPassword,
      });
      if (data?.changePassword?.success) {
        resetPassword();
        toast.success("Contraseña actualizada correctamente");
      } else {
        toast.error("No se pudo cambiar la contraseña");
      }
    } catch {
      toast.error(
        "Error al cambiar la contraseña. Verifica tu contraseña actual.",
      );
    }
  };

  if (!usuario) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Mi Perfil</h1>
        <p className="text-gray-400 text-sm">
          Visualiza y administra tu información personal
        </p>
      </div>

      {/* InformaciónPersonal */}
      <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5">
        <div className="flex items-start justify-between mb-8">
          <h3 className="text-lg font-bold dark:text-white">
            Información Personal
          </h3>
          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="px-5 py-2.5 bg-[#008080] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#008080]/20 hover:bg-[#006666] transition-colors"
            >
              Editar Perfil
            </button>
          )}
        </div>

        {editando ? (
          <form
            onSubmit={handleSubmitPerfil(onGuardarPerfil)}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Nombre
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...registerPerfil("firstName")}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${
                      errorsPerfil.firstName
                        ? "border-red-500"
                        : "border-transparent focus-visible:border-[#008080]"
                    }`}
                  />
                </div>
                {errorsPerfil.firstName && (
                  <p className="text-[10px] text-red-500 font-bold">
                    {errorsPerfil.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Apellido
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...registerPerfil("lastName")}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${
                      errorsPerfil.lastName
                        ? "border-red-500"
                        : "border-transparent focus-visible:border-[#008080]"
                    }`}
                  />
                </div>
                {errorsPerfil.lastName && (
                  <p className="text-[10px] text-red-500 font-bold">
                    {errorsPerfil.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...registerPerfil("email")}
                    type="email"
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${
                      errorsPerfil.email
                        ? "border-red-500"
                        : "border-transparent focus-visible:border-[#008080]"
                    }`}
                  />
                </div>
                {errorsPerfil.email && (
                  <p className="text-[10px] text-red-500 font-bold">
                    {errorsPerfil.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Celular
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    {...registerPerfil("celular")}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${
                      errorsPerfil.celular
                        ? "border-red-500"
                        : "border-transparent focus-visible:border-[#008080]"
                    }`}
                  />
                </div>
                {errorsPerfil.celular && (
                  <p className="text-[10px] text-red-500 font-bold">
                    {errorsPerfil.celular.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Carnet de Identidad
              </label>
              <div className="relative">
                <CreditCard
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  {...registerPerfil("ci")}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${
                    errorsPerfil.ci
                      ? "border-red-500"
                      : "border-transparent focus-visible:border-[#008080]"
                  }`}
                />
              </div>
              {errorsPerfil.ci && (
                <p className="text-[10px] text-red-500 font-bold">
                  {errorsPerfil.ci.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditando(false);
                  resetPerfil();
                }}
                className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="flex items-center gap-2 bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 text-sm"
              >
                <Save size={16} />
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start gap-8">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
              {usuario.foto ? (
                <Image
                  src={usuario.foto}
                  alt="Perfil"
                  fill
                  className="object-cover"
                />
              ) : (
                <User size={40} className="text-gray-300" />
              )}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#008080] rounded-full flex items-center justify-center">
                <Camera size={12} className="text-white" />
              </div>
            </div>

            <div className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              <InfoCampo label="Nombre" value={usuario.fullName} />
              <InfoCampo label="Usuario" value={usuario.username} />
              <InfoCampo label="Email" value={usuario.email} />
              <InfoCampo label="Carnet" value={usuario.ci ?? "—"} />
              <InfoCampo label="Celular" value={usuario.celular ?? "—"} />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Rol
                </p>
                <span className="inline-block px-3 py-1 text-xs font-bold bg-[#008080]/10 text-[#008080] rounded-full">
                  {usuario.role?.name ?? "—"}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Estado
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                  <CheckCircle size={12} />
                  {usuario.status ?? "Activo"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CambiarContraseña */}
      <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-3">
          <Key size={20} className="text-[#008080]" />
          Cambiar Contraseña
        </h3>

        <form
          onSubmit={handleSubmitPassword(onCambiarPassword)}
          className="space-y-6 max-w-lg"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Contraseña Actual
            </label>
            <input
              type="password"
              {...registerPassword("oldPassword")}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${
                errorsPassword.oldPassword
                  ? "border-red-500"
                  : "border-transparent focus-visible:border-[#008080]"
              }`}
              placeholder="Ingresa tu contraseña actual"
            />
            {errorsPassword.oldPassword && (
              <p className="text-[10px] text-red-500 font-bold">
                {errorsPassword.oldPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Nueva Contraseña
            </label>
            <input
              type="password"
              {...registerPassword("newPassword")}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${
                errorsPassword.newPassword
                  ? "border-red-500"
                  : "border-transparent focus-visible:border-[#008080]"
              }`}
              placeholder="Mínimo 6 caracteres"
            />
            {errorsPassword.newPassword && (
              <p className="text-[10px] text-red-500 font-bold">
                {errorsPassword.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              {...registerPassword("confirmarPassword")}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${
                errorsPassword.confirmarPassword
                  ? "border-red-500"
                  : "border-transparent focus-visible:border-[#008080]"
              }`}
              placeholder="Repite la nueva contraseña"
            />
            {errorsPassword.confirmarPassword && (
              <p className="text-[10px] text-red-500 font-bold">
                {errorsPassword.confirmarPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={cambiandoPassword}
              className="flex items-center gap-2 bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 text-sm"
            >
              <Key size={16} />
              {cambiandoPassword ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function InfoCampo({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-medium dark:text-white">{value}</p>
    </div>
  );
}
