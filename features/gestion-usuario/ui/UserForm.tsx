"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, CreditCard, Phone, Key, AlertCircle, Sparkles } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { useRoles } from "@/entities/rol";
import { generarUsername } from "@/entities/usuario";

const esquemaFormulario = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingrese un correo electrónico válido"),
  carnet: z.string().optional(),
  phone: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  roleId: z.string().min(1, "El tipo de usuario es requerido"),
  status: z.string(),
  visibility: z.string(),
});

type DatosFormulario = z.infer<typeof esquemaFormulario>;

interface UserFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  carnet: string;
  setCarnet: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  roleId: string;
  setRoleId: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  visibility: string;
  setVisibility: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function UserForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  carnet,
  setCarnet,
  phone,
  setPhone,
  username,
  setUsername,
  password,
  setPassword,
  roleId,
  setRoleId,
  status,
  setStatus,
  visibility,
  setVisibility,
  onSubmit,
  onCancel,
  isEditing,
}: UserFormProps) {
  const { roles } = useRoles();

  const rolOptions = roles.map((r) => ({ label: r.nombre, value: r.id }));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: zodErrors },
  } = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaFormulario),
    defaultValues: {
      firstName,
      lastName,
      email,
      carnet,
      phone,
      username,
      password,
      roleId,
      status,
      visibility,
    },
  });

  useEffect(() => { setValue("firstName", firstName); }, [firstName, setValue]);
  useEffect(() => { setValue("lastName", lastName); }, [lastName, setValue]);
  useEffect(() => { setValue("email", email); }, [email, setValue]);
  useEffect(() => { setValue("carnet", carnet); }, [carnet, setValue]);
  useEffect(() => { setValue("phone", phone); }, [phone, setValue]);
  useEffect(() => { setValue("username", username); }, [username, setValue]);
  useEffect(() => { setValue("password", password); }, [password, setValue]);
  useEffect(() => { setValue("roleId", roleId); }, [roleId, setValue]);
  useEffect(() => { setValue("status", status); }, [status, setValue]);
  useEffect(() => { setValue("visibility", visibility); }, [visibility, setValue]);

  const handleAutoGenerateUsername = () => {
    const sugerencia = generarUsername(firstName, lastName);
    setUsername(sugerencia);
    setValue("username", sugerencia, { shouldValidate: true, shouldDirty: true });
  };

  const onValidSubmit = () => {
    onSubmit(new Event("submit") as unknown as React.FormEvent);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onValidSubmit)}
      noValidate
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
              type="text"
              {...register("firstName", {
                onChange: (e) => setFirstName(e.target.value),
              })}
              defaultValue={firstName}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${zodErrors.firstName ? "border-red-500" : "border-transparent focus-visible:border-[#008080]"}`}
              placeholder="Ej. Juan"
            />
          </div>
          {zodErrors.firstName && (
            <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 flex items-center gap-1">
              <AlertCircle size={10} /> {zodErrors.firstName.message}
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
              type="text"
              {...register("lastName", {
                onChange: (e) => setLastName(e.target.value),
              })}
              defaultValue={lastName}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${zodErrors.lastName ? "border-red-500" : "border-transparent focus-visible:border-[#008080]"}`}
              placeholder="Ej. Pérez"
            />
          </div>
          {zodErrors.lastName && (
            <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 flex items-center gap-1">
              <AlertCircle size={10} /> {zodErrors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Correo Electrónico *
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              {...register("email", {
                onChange: (e) => setEmail(e.target.value),
              })}
              defaultValue={email}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white ${zodErrors.email ? "border-red-500" : "border-transparent focus-visible:border-[#008080]"}`}
              placeholder="ejemplo@correo.com"
            />
          </div>
          {zodErrors.email ? (
            <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 flex items-center gap-1">
              <AlertCircle size={10} /> {zodErrors.email.message}
            </p>
          ) : (
            <p className="text-[10px] text-gray-400 mt-1 ml-4">
              Se enviarán las credenciales de acceso a este correo.
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
              type="text"
              {...register("phone", {
                onChange: (e) => setPhone(e.target.value),
              })}
              defaultValue={phone}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white border-transparent focus-visible:border-[#008080]"
              placeholder="Ej. 70000000"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
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
              type="text"
              {...register("carnet", {
                onChange: (e) => setCarnet(e.target.value),
              })}
              defaultValue={carnet}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus-visible:bg-white dark:focus-visible:bg-white/10 outline-none transition-all text-sm dark:text-white border-transparent focus-visible:border-[#008080]"
              placeholder="Ej. 1234567 LP"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Usuario (Login)
            </label>
            {!isEditing && (
              <button
                type="button"
                onClick={handleAutoGenerateUsername}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008080] hover:text-[#006666] dark:text-teal-400 transition-colors cursor-pointer"
                title="Generar sugerencia de usuario (ej. ALECHIP123)"
              >
                <Sparkles size={13} />
                <span>Generar sugerencia</span>
              </button>
            )}
          </div>
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              {...register("username", {
                onChange: (e) => setUsername(e.target.value),
              })}
              defaultValue={username}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white border-2"
              placeholder="Ej. ALECHIP145 (opcional: se generará automáticamente)"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Contraseña
          </label>
          <div className="relative">
            <Key
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              {...register("password", {
                onChange: (e) => setPassword(e.target.value),
              })}
              defaultValue={password}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white border-2"
              placeholder="Opcional: se generará automáticamente"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <SearchableSelect
            label="Tipo de Usuario"
            options={rolOptions}
            value={roleId}
            onChange={setRoleId}
            placeholder="Seleccionar rol..."
          />
          {zodErrors.roleId && (
            <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 flex items-center gap-1">
              <AlertCircle size={10} /> {zodErrors.roleId.message}
            </p>
          )}
        </div>
        <SearchableSelect
          label="Estado"
          options={["ACTIVO", "INACTIVO"]}
          value={status}
          onChange={setStatus}
        />
        <SearchableSelect
          label="Visibilidad"
          options={["VISIBLE", "NO VISIBLE"]}
          value={visibility}
          onChange={setVisibility}
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
        >
          {isEditing ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </div>
    </form>
  );
}
