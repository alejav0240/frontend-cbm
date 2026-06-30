import { motion } from "motion/react";
import {
  Search,
  BarChart3,
  PenTool,
  Trash2,
  Video,
  Music,
  Clock,
  User,
  CreditCard,
  Calendar,
  Hash,
  FolderOpen,
  Package,
  Activity,
  ChevronRight,
  ExternalLink,
  FileText,
} from "lucide-react";

// ============ TYPES & INTERFACES ============

// Tipos base de la API
interface ScaleValueType {
  label: string;
  value: number;
}

interface ScaleType {
  id: string;
  name: string;
  scaleType: string;
}

interface ScaleEvaluationValueResponseType {
  scaleValue: ScaleValueType;
}

interface ScaleEvaluationSubscaleResponseType {
  subscale?: {
    name: string;
  };
  value: number | string;
}

interface ScaleEvaluationType {
  id: string;
  evaluatedAt: string;
  totalScore: number;
  scale: ScaleType;
  subscaleResponses: ScaleEvaluationSubscaleResponseType[];
  valueResponses: ScaleEvaluationValueResponseType[];
}

interface DigitalResourceType {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface SessionResourceType {
  resource: DigitalResourceType;
}

interface InventoryItemType {
  name: string;
}

interface SessionInventoryType {
  id: string;
  item: InventoryItemType;
}

interface Therapist {
  fullname: string;
}

interface SessionType {
  __typename?: string;
  databaseId: number;
  durationMinutes: number | null;
  cycleNumber: number;
  createdAt: string;
  notes: string | null;
  videoUrl: string | null;
  sessionTypeDisplay: string;
  paymentStatusDisplay: string;
  sessionDate: string;
  sessionNumber: number;
  sessionStatus: string;
  sessionResources: SessionResourceType[];
  sessionInventory: SessionInventoryType[];
  scaleEvaluations: ScaleEvaluationType[];
  therapist?: Therapist;
  id?: string | number;
}

// Props del componente
interface SessionCardProps {
  session: SessionType;
  idx: number;
  onViewAIAnalysis: (id: string | number, type: "list" | "charts") => void;
  onEditSession: (session: SessionType) => void;
  onDeleteSession: (id: string | number) => void;
  onViewDetails?: (session: SessionType) => void;
  onExport?: (session: SessionType) => void;
}

// ============ COMPONENTE PRINCIPAL ============

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  idx,
  onViewAIAnalysis,
  onEditSession,
  onDeleteSession,
  onViewDetails,
  onExport,
}) => {
  // ============ HELPERS ============

  /**
   * Formatea una fecha en formato local español
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "No disponible";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  /**
   * Obtiene un emoji según el estado de la sesión
   */
  const getStatusIcon = (status: string | null): string => {
    if (!status) return "📌";
    switch (status.toLowerCase()) {
      case "completa":
      case "completed":
        return "✅";
      case "pendiente":
      case "pending":
        return "⏳";
      case "cancelada":
      case "cancelled":
        return "❌";
      default:
        return "📌";
    }
  };

  /**
   * Obtiene clases CSS según el estado de la sesión
   */
  const getStatusColor = (status: string | null): string => {
    if (!status)
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20";
    switch (status.toLowerCase()) {
      case "completa":
      case "completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20";
      case "pendiente":
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20";
      case "cancelada":
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20";
    }
  };

  /**
   * Obtiene clases CSS según el estado de pago
   */
  const getPaymentColor = (status: string | null): string => {
    if (!status) return "text-gray-600 dark:text-gray-400";
    switch (status.toLowerCase()) {
      case "pagada":
      case "paid":
        return "text-green-600 dark:text-green-400";
      case "pendiente":
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-red-600 dark:text-red-400";
    }
  };

  /**
   * Determina si un recurso es audio o video
   */
  const getResourceIcon = (type: string | null) => {
    if (!type) return <Music size={12} />;
    return type.toUpperCase() === "AUDIO" ? (
      <Music size={12} />
    ) : (
      <Video size={12} />
    );
  };

  /**
   * Determina el tipo de grabación
   */
  const isAudioRecording = (url: string | null): boolean => {
    if (!url) return false;
    return (
      url.toLowerCase().includes(".mp4") || url.toLowerCase().includes(".mp3")
    );
  };

  // ============ RENDER ============

  return (
    <motion.div
      key={session.databaseId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-gray-200 dark:bg-[#111] p-8 md:p-10 rounded-[48px] border border-gray-300 dark:border-white/5 shadow-xl shadow-black/5 relative overflow-hidden group"
    >
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#008080]/2 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />

      {/* ===== CABECERA ===== */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8 relative">
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-[10px] font-bold text-[#008080] uppercase tracking-[0.2em] bg-[#008080]/10 px-4 py-1.5 rounded-full flex items-center gap-2">
              <Hash size={12} />
              Sesión #{session.sessionNumber}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar size={12} />
              {formatDate(session.sessionDate)}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock size={12} />
              Ciclo #{session.cycleNumber}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h3 className="text-2xl md:text-3xl font-bold dark:text-white serif leading-tight">
              Sesión de <span className="text-[#008080]">Musicoterapia</span>
            </h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border inline-flex items-center gap-1.5 w-fit ${getStatusColor(
                session.sessionStatus,
              )}`}
            >
              {getStatusIcon(session.sessionStatus)}
              {session.sessionStatus || "Sin estado"}
            </span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <User size={14} />
            Creada: {formatDate(session.createdAt)}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(session)}
               className="p-3 bg-teal-50 dark:bg-[#008080]/10 rounded-2xl text-[#008080] hover:bg-teal-100 dark:hover:bg-[#008080]/20 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest flex-1 sm:flex-none font-sans"
              title="Ver más información"
            >
              <FolderOpen size={18} />
              <span>Detalles</span>
            </button>
          )}
          {onExport && (
            <button
              onClick={() => onExport(session)}
               className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest flex-1 sm:flex-none font-sans"
              title="Exportar informe"
            >
              <FileText size={18} />
               <span>Exportar</span>
            </button>
          )}
          <button
            onClick={() =>
              onViewAIAnalysis(session.id || session.databaseId, "list")
            }
            className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest flex-1 sm:flex-none"
            title="Ver Análisis de IA"
          >
            <Search size={18} />
            <span>Análisis DEMUCA</span>
          </button>
          <button
            onClick={() =>
              onViewAIAnalysis(session.id || session.databaseId, "charts")
            }
            className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest flex-1 sm:flex-none"
            title="Ver Gráficos de IA"
          >
            <BarChart3 size={18} />
            <span>Gráficos</span>
          </button>
          <button
            onClick={() => onEditSession(session)}
            className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-[#008080] transition-all"
            title="Editar Notas"
          >
            <PenTool size={20} />
          </button>
          <button
            onClick={() => onDeleteSession(session.databaseId)}
            className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-red-500 transition-all"
            title="Eliminar Sesión"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* ===== MÉTRICAS RÁPIDAS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mb-8 p-6 md:p-8 bg-gray-50/50 dark:bg-white/2 rounded-[32px] border border-gray-100 dark:border-white/5">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
            <Clock size={12} />
            Duración
          </p>
          <p className="text-sm md:text-base dark:text-white font-bold">
            {session?.durationMinutes
              ? `${session.durationMinutes} min`
              : "40 min"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
            <User size={12} />
            Terapeuta
          </p>
          <p className="text-sm md:text-base dark:text-white font-bold truncate">
            {session.therapist?.fullname ?? "No Asignado"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
            <Activity size={12} />
            Tipo
          </p>
          <p className="text-sm md:text-base dark:text-white font-bold">
            {session.sessionTypeDisplay || "Individual"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
            <CreditCard size={12} />
            Pago
          </p>
          <p
            className={`text-sm md:text-base font-bold ${getPaymentColor(
              session.paymentStatusDisplay,
            )}`}
          >
            {session.paymentStatusDisplay || "No especificado"}
          </p>
        </div>
      </div>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="grid lg:grid-cols-2 gap-8 relative">
        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* Notas de la sesión */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#008080] rounded-full" />
              <h4 className="text-xs font-bold dark:text-white uppercase tracking-[0.2em]">
                Notas de la Sesión
              </h4>
            </div>
            <div className="bg-gray-50/50 dark:bg-white/2 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {session.notes || "No hay notas registradas para esta sesión."}
              </p>
            </div>
          </div>

          {/* Recursos utilizados */}
          {session.sessionResources && session.sessionResources.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#008080] rounded-full" />
                <h4 className="text-xs font-bold dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <FolderOpen size={14} />
                  Recursos Utilizados
                </h4>
                <span className="text-[10px] text-gray-400">
                  ({session.sessionResources.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {session.sessionResources.map((resource, index) => (
                  <span
                    key={index}
                    className="text-xs bg-[#008080]/5 dark:bg-[#008080]/10 text-[#008080] px-3 py-1.5 rounded-full border border-[#008080]/10 flex items-center gap-1.5"
                  >
                    {getResourceIcon(resource.resource?.type)}
                    {resource.resource?.title || "Recurso"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Inventario utilizado */}
          {session.sessionInventory && session.sessionInventory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#008080] rounded-full" />
                <h4 className="text-xs font-bold dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Package size={14} />
                  Material Utilizado
                </h4>
                <span className="text-[10px] text-gray-400">
                  ({session.sessionInventory.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {session.sessionInventory.map((item, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/5"
                  >
                    {item.item?.name || "Ítem"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          {/* Evaluaciones de escala */}
          {session.scaleEvaluations && session.scaleEvaluations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#008080] rounded-full" />
                <h4 className="text-xs font-bold dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} />
                  Evaluaciones
                </h4>
                <span className="text-[10px] text-gray-400">
                  ({session.scaleEvaluations.length})
                </span>
              </div>
              <div className="space-y-3">
                {session.scaleEvaluations.map((evaluation, index) => (
                  <div
                    key={evaluation.id || index}
                    className="bg-gray-50/50 dark:bg-white/2 p-4 rounded-2xl border border-gray-100 dark:border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold dark:text-white">
                        {evaluation.scale?.name || "Escala"}
                      </span>
                      <span className="text-sm font-bold text-[#008080]">
                        {evaluation.totalScore !== null &&
                        evaluation.totalScore !== undefined
                          ? `${evaluation.totalScore}/10`
                          : "N/A"}
                      </span>
                    </div>
                    {evaluation.valueResponses &&
                      evaluation.valueResponses.length > 0 && (
                        <ul className="space-y-1">
                          {evaluation.valueResponses.map((response, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2"
                            >
                              <ChevronRight
                                size={12}
                                className="text-[#008080] mt-0.5 flex-shrink-0"
                              />
                              <span>
                                {response.scaleValue?.label || "Sin valor"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    {evaluation.subscaleResponses &&
                      evaluation.subscaleResponses.length > 0 && (
                        <ul className="space-y-1 mt-2">
                          {evaluation.subscaleResponses.map((response, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2"
                            >
                              <ChevronRight
                                size={12}
                                className="text-[#008080] mt-0.5 flex-shrink-0"
                              />
                              <span>
                                {response.subscale?.name || "Subescala"}:{" "}
                                {response.value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video/Audio si existe */}
          {session.videoUrl && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#008080] rounded-full" />
                <h4 className="text-xs font-bold dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  {isAudioRecording(session.videoUrl) ? (
                    <Music size={14} />
                  ) : (
                    <Video size={14} />
                  )}
                  Grabación
                </h4>
              </div>
              <div className="bg-black/5 dark:bg-white/2 p-4 rounded-[24px] border border-gray-200 dark:border-white/5">
                {isAudioRecording(session.videoUrl) ? (
                  <audio controls className="w-full accent-[#008080]">
                    <source src={session.videoUrl} type="audio/mpeg" />
                  </audio>
                ) : (
                  <video
                    controls
                    className="w-full rounded-xl shadow-lg bg-black aspect-video"
                  >
                    <source src={session.videoUrl} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Detalles adicionales */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#008080] rounded-full" />
              <h4 className="text-xs font-bold dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <ExternalLink size={14} />
                Detalles Adicionales
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <span className="block font-bold text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  ID
                </span>
                <span className="font-mono">#{session.databaseId}</span>
              </div>
              <div>
                <span className="block font-bold text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Ciclo
                </span>
                <span>#{session.cycleNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;
