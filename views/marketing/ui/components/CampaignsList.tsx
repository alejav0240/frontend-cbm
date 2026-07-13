"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Megaphone,
  Globe,
  Share2,
  MessageCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { MarketingCampaign } from "@/entities/marketing";
import { formatBs } from "@/shared/lib/utils/formatoMoneda";

interface CampaignsListProps {
  campaigns: MarketingCampaign[];
  onEdit: (campaign: MarketingCampaign) => void;
  onDelete: (id: string) => void;
}

export function CampaignsList({
  campaigns,
  onEdit,
  onDelete,
}: CampaignsListProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return <Globe className="text-blue-600" size={18} />;
      case "Instagram":
        return <Share2 className="text-pink-600" size={18} />;
      case "WhatsApp":
        return <MessageCircle className="text-green-600" size={18} />;
      default:
        return <Megaphone className="text-gray-600" size={18} />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return "bg-blue-500/10 text-blue-600 dark:bg-blue-500/10";
      case "Instagram":
        return "bg-pink-500/10 text-pink-600 dark:bg-pink-500/10";
      case "WhatsApp":
        return "bg-green-500/10 text-green-600 dark:bg-green-500/10";
      case "TikTok":
        return "bg-gray-800/10 text-gray-800 dark:bg-white/10 dark:text-white";
      case "Google":
        return "bg-red-500/10 text-red-600 dark:bg-red-500/10";
      default:
        return "bg-gray-500/10 text-gray-600 dark:bg-white/5";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-600 dark:bg-green-500/10";
      case "Pausado":
        return "bg-blue-100 text-blue-600 dark:bg-blue-500/10";
      case "Finalizado":
        return "bg-gray-100 text-gray-600 dark:bg-white/5";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-[#111] p-12 rounded-[32px] border border-dashed border-gray-200 dark:border-white/10 text-center">
        <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Megaphone size={32} />
        </div>
        <h3 className="text-lg font-bold dark:text-white">
          No hay campañas activas
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Comienza creando tu primera campaña publicitaria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#008080]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shadow-inner">
                {getPlatformIcon(campaign.platform)}
              </div>
              <div>
                <h3 className="text-lg font-bold dark:text-white group-hover:text-[#008080] transition-colors">
                  {campaign.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${getPlatformColor(campaign.platform)}`}
                  >
                    {campaign.platform}
                  </span>
                </div>
              </div>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${getStatusColor(campaign.status)}`}
            >
              {campaign.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
            <div className="p-4 bg-gray-50/50 dark:bg-white/2 rounded-3xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Presupuesto
              </p>
              <p className="text-xl font-light dark:text-white serif">
                {formatBs(campaign.budget)}
              </p>
            </div>
            <div className="p-4 bg-gray-50/50 dark:bg-white/2 rounded-3xl border border-transparent hover:border-[#008080]/20 transition-all">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Invertido
              </p>
              <p className="text-xl font-bold text-[#008080] serif">
                {formatBs(campaign.spent)}
              </p>
            </div>
            <div className="p-4 bg-gray-50/50 dark:bg-white/2 rounded-3xl border border-transparent hover:border-blue-500/20 transition-all">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Leads
              </p>
              <p className="text-xl font-light dark:text-white serif">
                {campaign.leadsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5 relative z-10">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 bg-gray-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-[#008080] h-full rounded-full shadow-[0_0_10px_rgba(0,128,128,0.3)]"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {Math.round((campaign.spent / campaign.budget) * 100)}%
              </span>
            </div>
            <div className="flex gap-1 ml-6">
              <button
                onClick={() => onEdit(campaign)}
                className="p-2.5 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/5 rounded-xl transition-all"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(campaign.id)}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
