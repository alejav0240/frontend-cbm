"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  Music,
  Heart,
  Users,
  Calendar,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Play,
  Check,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/shared/ui/Navbar";
import MusicalNotes from "@/shared/ui/MusicalNotes";
import LoadingScreen from "@/shared/ui/LoadingScreen";
import { useForm } from "react-hook-form";
import { services } from "@/shared/data/services";
import { staff } from "@/shared/data/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContactFormData,
  contactSchema,
} from "@/shared/types/forms.home.schema";

// ===== COMPONENTES REUTILIZABLES =====

const SectionHeader = ({
  title,
  description,
  centered = true,
}: {
  title: string;
  description?: string;
  centered?: boolean;
}) => (
  <div className={`mb-16 ${centered ? "text-center" : ""}`}>
    <h2 className="serif text-4xl lg:text-5xl mb-4 dark:text-white">{title}</h2>
    {description && (
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {description}
      </p>
    )}
  </div>
);

const FloatingElement = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    animate={{ y: [0, -20, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute hidden md:block ${className}`}
  >
    {children}
  </motion.div>
);

const PricingCard = ({
  title,
  price,
  desc,
  features,
  popular = false,
}: {
  title: string;
  price: string;
  desc: string;
  features: string[];
  popular?: boolean;
}) => (
  <motion.div
    whileHover={{ y: -10 }}
    className={`relative p-8 rounded-[32px] border transition-all ${
      popular
        ? "border-[#008080] bg-[#008080]/5 shadow-xl"
        : "border-black/5 dark:border-white/5 bg-white dark:bg-accent shadow-sm"
    }`}
  >
    {popular && (
      <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#008080] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
        Más Popular
      </div>
    )}
    <h3 className="serif text-2xl mb-2 dark:text-white">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
      {desc}
    </p>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-gray-400 text-sm">Bs.</span>
      <span className="text-4xl font-bold dark:text-white">{price}</span>
      <span className="text-gray-400 text-sm">/mes</span>
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((feature, i) => (
        <li
          key={i}
          className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="w-5 h-5 bg-[#008080]/10 rounded-full flex items-center justify-center text-[#008080]">
            <Check size={12} />
          </div>
          {feature}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-4 rounded-2xl font-bold transition-all ${
        popular
          ? "bg-[#008080] text-white hover:bg-[#006666]"
          : "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10"
      }`}
    >
      Elegir Plan
    </button>
  </motion.div>
);

const ContactInfo = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-white/60 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-medium">{value}</p>
    </div>
  </div>
);

// ===== CONSTANTES =====

const GALLERY_IMAGES = [
  "/galeria/imagen6.jpg",
  "/galeria/imagen7.jpg",
  "/galeria/imagen8.jpg",
  "/galeria/imagen9.jpg",
  "/galeria/imagen1.jpg",
  "/galeria/imagen2.jpg",
];

const PRICING_PLANS = {
  individual: [
    {
      title: "Sesión Única",
      price: "250",
      desc: "Ideal para una primera experiencia o evaluación inicial.",
      features: [
        "Evaluación personalizada",
        "45 minutos de sesión",
        "Informe básico",
      ],
    },
    {
      title: "Pack Bienestar",
      price: "900",
      desc: "4 sesiones mensuales para un seguimiento continuo.",
      features: [
        "4 sesiones de 45 min",
        "Seguimiento evolutivo",
        "Material didáctico",
        "Descuento del 10%",
      ],
      popular: true,
    },
    {
      title: "Intensivo",
      price: "1600",
      desc: "8 sesiones mensuales para casos de rehabilitación activa.",
      features: [
        "8 sesiones de 45 min",
        "Prioridad de agenda",
        "Informe detallado",
        "Descuento del 20%",
      ],
    },
  ],
  grupal: [
    {
      title: "Sesión Grupal",
      price: "120",
      desc: "Participa en una sesión compartida con otros pacientes.",
      features: [
        "Interacción social",
        "60 minutos de sesión",
        "Material compartido",
      ],
    },
    {
      title: "Pack Grupal",
      price: "400",
      desc: "4 sesiones mensuales en grupo.",
      features: [
        "4 sesiones de 60 min",
        "Dinámicas colectivas",
        "Ambiente seguro",
        "Ahorro significativo",
      ],
      popular: true,
    },
    {
      title: "Talleres",
      price: "300",
      desc: "Talleres temáticos de fin de semana.",
      features: [
        "3 horas de taller",
        "Temáticas específicas",
        "Certificado de participación",
      ],
    },
  ],
};

// ===== COMPONENTE PRINCIPAL =====

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"individual" | "grupal">(
    "individual",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.",
      );
      reset();
    } catch {
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-background relative transition-colors duration-300">
      <MusicalNotes />
      <Navbar />

      <HeroSection />
      <HistorySection />
      <GallerySection />
      <StaffSection />
      <ServicesSection />
      <PricingSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContactSection
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
      <Footer />
    </div>
  );
}

// ===== SECCIONES =====

const HeroSection = () => (
  <section
    id="inicio"
    className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative z-10"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} /> Bienvenido al bienestar sonoro
          </motion.div>
          <h1 className="serif text-5xl lg:text-7xl font-light leading-tight mb-6 dark:text-white">
            Sana a través de la{" "}
            <span className="text-[#008080] italic">armonía</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
            En el Centro Boliviano de Musicoterapia, utilizamos el poder del
            sonido para mejorar la salud física, emocional y cognitiva de
            nuestros pacientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contacto"
              className="bg-[#008080] text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#006666] transition-all shadow-lg group"
            >
              Agendar mi primera cita{" "}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <button className="border border-[#008080] text-[#008080] px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#008080]/5 transition-all">
              <Play size={18} fill="currentColor" /> Ver video
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl">
            <Image
              src="/galeria/imagen1.jpg"
              alt="Musicoterapia en acción"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#008080]/40 to-transparent" />
          </div>
          <FloatingElement className="-top-6 -right-6 bg-white dark:bg-accent p-6 rounded-2xl shadow-xl border border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#008080]/10 rounded-full flex items-center justify-center text-[#008080]">
                <Music size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Terapia
                </p>
                <p className="font-serif text-lg dark:text-white">
                  Sonido Sanador
                </p>
              </div>
            </div>
          </FloatingElement>
        </motion.div>
      </div>
    </div>
  </section>
);

const HistorySection = () => (
  <section
    id="historia"
    className="py-24 bg-white dark:bg-background relative z-10 transition-colors duration-300"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/galeria/imagen2.jpg"
                  alt="Historia 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/galeria/imagen3.jpg"
                  alt="Historia 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/galeria/imagen4.jpg"
                  alt="Historia 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/galeria/imagen5.jpg"
                  alt="Historia 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#008080]/5 rounded-full blur-3xl" />
        </div>

        <div>
          <h2 className="serif text-4xl lg:text-5xl mb-8 dark:text-white">
            Nuestra Historia
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Fundado en 2010, el Centro Boliviano de Musicoterapia nació con la
            visión de integrar la ciencia y el arte para ofrecer alternativas
            terapéuticas innovadoras en el país. A lo largo de más de una
            década, hemos transformado la vida de cientos de familias
            bolivianas.
          </p>
          <div className="space-y-10">
            {[
              {
                icon: Sparkles,
                title: "Misión",
                text: "Brindar servicios de musicoterapia de alta calidad, basados en evidencia científica, para promover la salud y el bienestar integral de la sociedad boliviana.",
              },
              {
                icon: Play,
                title: "Visión",
                text: "Ser el centro de referencia líder en musicoterapia en Bolivia y la región, reconocido por nuestra excelencia clínica, calidez humana e innovación constante.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-14 h-14 bg-[#008080]/10 rounded-2xl flex items-center justify-center text-[#008080] flex-shrink-0">
                  <item.icon size={28} />
                </div>
                <div>
                  <h3 className="serif text-2xl mb-2 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const GallerySection = () => (
  <section
    id="galeria"
    className="py-24 bg-[#f5f2ed] dark:bg-white/5 relative z-10 transition-colors duration-300"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="Galería de Momentos"
        description="Un vistazo a nuestras sesiones, talleres y el ambiente de sanación que creamos."
      />
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {GALLERY_IMAGES.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
          >
            <Image
              src={src}
              alt={`Galería ${i}`}
              width={600}
              height={800}
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <Sparkles size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const StaffSection = () => (
  <section className="py-24 bg-white dark:bg-background relative z-10 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <h2 className="serif text-4xl lg:text-5xl mb-4 dark:text-white">
            Profesionales de Confianza
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Conoce al equipo multidisciplinario que te acompañará en tu proceso
            de sanación.
          </p>
        </div>
        <Link
          href="/equipo"
          className="flex items-center gap-2 text-[#008080] font-bold hover:gap-4 transition-all group"
        >
          Ver todo el plantel{" "}
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {staff.slice(0, 3).map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -10 }}
            className="group relative rounded-[32px] overflow-hidden aspect-[4/5]"
          >
            <Image
              src={member.img}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white serif text-2xl mb-1">{member.name}</h3>
              <p className="text-white/60 text-sm">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ServicesSection = () => (
  <section
    id="servicios"
    className="py-24 bg-[#f5f2ed] dark:bg-white/5 relative z-10 transition-colors duration-300"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="Nuestros Servicios"
        description="Programas diseñados para cada etapa de la vida, enfocados en la rehabilitación y el bienestar integral."
      />
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10 }}
            className="bg-white dark:bg-accent rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-black/5 dark:border-white/5"
          >
            <div className="relative h-48">
              <Image
                src={service.img}
                alt={service.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8">
              <div className="mb-4">
                <service.icon className={service.iconClass} />
              </div>
              <h3 className="serif text-2xl mb-3 dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                {service.desc}
              </p>
              <button className="text-[#008080] font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                Saber más <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "individual" | "grupal";
  setActiveTab: (tab: "individual" | "grupal") => void;
}) => (
  <section
    id="precios"
    className="py-24 bg-white dark:bg-background relative z-10 transition-colors duration-300"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="Inversión en tu Salud"
        description="Precios transparentes para que elijas la modalidad que mejor te convenga."
      />

      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-full flex">
          {(["individual", "grupal"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#008080] text-white shadow-md"
                  : "text-gray-500"
              }`}
            >
              {tab === "individual" ? "Individual" : "Grupal"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {PRICING_PLANS[activeTab].map((plan, i) => (
          <PricingCard key={i} {...plan} />
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = ({ register, errors, isSubmitting, onSubmit }: any) => (
  <section
    id="contacto"
    className="py-24 bg-white dark:bg-background relative z-10 transition-colors duration-300"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#008080] rounded-[40px] p-8 lg:p-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="grid lg:grid-cols-2 gap-12 relative z-10">
          <div>
            <h2 className="serif text-4xl lg:text-5xl mb-6">
              ¿Listo para comenzar tu viaje sonoro?
            </h2>
            <p className="text-white/80 text-lg mb-12">
              Estamos aquí para escucharte y diseñar el programa que mejor se
              adapte a tus necesidades.
            </p>
            <div className="space-y-6">
              <ContactInfo
                icon={Phone}
                label="Llámanos"
                value="+591 700 00000"
              />
              <ContactInfo
                icon={Mail}
                label="Escríbenos"
                value="info@musicoterapiabolivia.com"
              />
              <ContactInfo
                icon={MapPin}
                label="Visítanos"
                value="La Paz, Bolivia"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-accent rounded-3xl p-8 lg:p-10 text-gray-900 dark:text-white shadow-2xl transition-colors duration-300">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  label="Nombre"
                  register={register("name")}
                  error={errors.name}
                  placeholder="Tu nombre"
                  disabled={isSubmitting}
                />
                <FormField
                  label="Email"
                  register={register("email")}
                  error={errors.email}
                  placeholder="tu@email.com"
                  type="email"
                  disabled={isSubmitting}
                />
              </div>
              <FormField
                label="Mensaje"
                register={register("message")}
                error={errors.message}
                placeholder="¿En qué podemos ayudarte?"
                isTextarea
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#008080] text-white py-4 rounded-xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Enviando...
                  </>
                ) : (
                  "Enviar Mensaje"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FormField = ({
  label,
  register,
  error,
  placeholder,
  type = "text",
  isTextarea = false,
  disabled,
}: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
      {label}
    </label>
    {isTextarea ? (
      <textarea
        rows={4}
        {...register}
        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-white/5 focus:ring-0 transition-all outline-none resize-none ${
          error
            ? "border-red-500"
            : "border-gray-200 dark:border-white/10 focus:border-[#008080]"
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        {...register}
        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-white/5 focus:ring-0 transition-all outline-none ${
          error
            ? "border-red-500"
            : "border-gray-200 dark:border-white/10 focus:border-[#008080]"
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
    )}
    {error && (
      <p className="text-[10px] text-red-500 font-bold mt-1">{error.message}</p>
    )}
  </div>
);

const Footer = () => (
  <footer className="py-12 border-t border-black/5 dark:border-white/5 bg-white dark:bg-background relative z-10 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="relative w-48 h-12">
          <Image
            src="/logohorizontal.png"
            alt="Logo"
            fill
            className="object-contain opacity-80"
          />
        </div>
        <div className="flex gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-[#008080]">
            Privacidad
          </a>
          <a href="#" className="hover:text-[#008080]">
            Términos
          </a>
          <a href="#" className="hover:text-[#008080]">
            Cookies
          </a>
        </div>
        <p className="text-sm text-gray-400" suppressHydrationWarning>
          © {new Date().getFullYear()} Centro Boliviano de Musicoterapia.
        </p>
      </div>
    </div>
  </footer>
);
