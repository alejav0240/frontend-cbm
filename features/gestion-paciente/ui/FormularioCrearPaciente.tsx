"use client";

import React, {useMemo} from "react";
import {Loader2, TrendingUp} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {esquemaPaciente, DatosFormularioPaciente} from "@/entities/paciente";
import {SearchableSelect} from "@/shared/ui/components/SearchableSelect";
import {InputField} from "@/shared/ui/form/InputField";
import {FormSection} from "@/shared/ui/form/FormSection";
import {PhotoUpload} from "@/shared/ui/form/PhotoUpload";

interface FormularioCrearPacienteProps {
    alEnviar: (datos: DatosFormularioPaciente) => void;
    alCancelar: () => void;
    estaCreando?: boolean;
}

export const FormularioCrearPaciente = ({
                                            alEnviar,
                                            alCancelar,
                                            estaCreando = false,
                                        }: FormularioCrearPacienteProps) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: {errors},
    } = useForm<DatosFormularioPaciente>({
        resolver: zodResolver(esquemaPaciente),
        defaultValues: {
            selectedDay: "Lunes",
            selectedTime: "09:00",
            contactEmail: "",
            tutor: "",
            ciTutor: "",
            tutorPhone: "",
            residenciaActual: "",
            diagnostico: "",
            photo: null,
        },
    });

    const selectedDay = watch("selectedDay");
    const fechaNacimiento = watch("dob");

    const [vistaPreviaFoto, setVistaPreviaFoto] = React.useState<string | null>(
        null,
    );

    const edad = useMemo(() => {
        if (!fechaNacimiento) return null;
        const nacimiento = new Date(fechaNacimiento);
        const hoy = new Date();
        let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edadCalculada--;
        }
        return edadCalculada;
    }, [fechaNacimiento]);

    const manejarCambioFoto = (archivo: File) => {
        const url = URL.createObjectURL(archivo);
        setVistaPreviaFoto(url);
        setValue("photo", archivo as unknown);
    };

    const eliminarFoto = () => {
        setValue("photo", null);
        setVistaPreviaFoto(null);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(alEnviar)}>
            <div className="grid sm:grid-cols-2 gap-6">
                <InputField
                    label="Nombres"
                    placeholder="Ej. Juan"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                />
                <InputField
                    label="Apellidos"
                    placeholder="Ej. Pérez"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                <InputField
                    label="Fecha de Nacimiento"
                    type="date"
                    error={errors.dob?.message}
                    {...register("dob")}
                />
                <InputField
                    label="Edad (Auto)"
                    value={edad !== null ? `${edad} años` : ""}
                    readOnly
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                <InputField
                    label="Carnet / ID"
                    placeholder="Ej. 1234567"
                    error={errors.idCard?.message}
                    {...register("idCard")}
                />
                <PhotoUpload
                    vistaPrevia={vistaPreviaFoto}
                    onUpload={manejarCambioFoto}
                    onRemove={eliminarFoto}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                <InputField
                    label="Tutor / Responsable Legal"
                    placeholder="Ej. María Pérez (Madre)"
                    {...register("tutor")}
                />
                <InputField
                    label="Carnet del Tutor"
                    placeholder="Ej. 7654321"
                    error={errors.ciTutor?.message}
                    {...register("ciTutor")}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                <InputField
                    label="Teléfono del Tutor"
                    type="tel"
                    placeholder="Ej. 70012345"
                    {...register("tutorPhone")}
                />
                <InputField
                    label="Email del Tutor"
                    type="email"
                    placeholder="Ej. contacto@ejemplo.com"
                    error={errors.contactEmail?.message}
                    {...register("contactEmail")}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                <InputField
                    label="Residencia Actual"
                    placeholder="Ej. Zona Norte, Terminal"
                    {...register("residenciaActual")}
                />
                <InputField
                    label="Diagnóstico"
                    placeholder="Ej. TEA 2, TDAH"
                    {...register("diagnostico")}
                />
            </div>

            <FormSection
                title="Programación de Primer Ciclo (4 Sesiones)"
                icon={TrendingUp}
            >
                <SearchableSelect
                    label="Día de la Semana"
                    options={[
                        "Lunes",
                        "Martes",
                        "Miércoles",
                        "Jueves",
                        "Viernes",
                        "Sábado",
                        "Domingo",
                    ]}
                    value={selectedDay}
                    onChange={(val) => setValue("selectedDay", val)}
                />
                <InputField
                    label="Horario de Inicio"
                    type="time"
                    error={errors.selectedTime?.message}
                    {...register("selectedTime")}
                />
            </FormSection>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={alCancelar}
                    disabled={estaCreando}
                    className="px-6 py-3 rounded-2xl font-bold text-gray-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={estaCreando}
                    className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-70 flex items-center gap-2"
                >
                    {estaCreando ? (
                        <Loader2 className="animate-spin" size={18}/>
                    ) : (
                        "Crear Paciente"
                    )}
                </button>
            </div>
        </form>
    );
};
