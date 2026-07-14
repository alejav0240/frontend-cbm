import React, { useRef } from "react";
import { Camera, X, Upload } from "lucide-react";
import Image from "next/image";

interface PhotoUploadProps {
  vistaPrevia: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const PhotoUpload = ({
  vistaPrevia,
  onUpload,
  onRemove,
}: PhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const manejarCambioFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      onUpload(archivo);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="photo-upload" className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        Fotografía
      </label>
      <input
        id="photo-upload"
        type="file"
        ref={fileInputRef}
        onChange={manejarCambioFoto}
        accept="image/*"
        className="hidden"
      />
      {vistaPrevia ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden group">
          <Image
            src={vistaPrevia}
            alt="Vista previa"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-white/20 rounded-lg text-white"
            >
              <Camera size={14} />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 bg-red-500/50 rounded-lg text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-3 text-center hover:border-[#008080] focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/20 cursor-pointer transition-all"
        >
          <Upload size={14} className="inline mr-2 text-gray-400" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Subir Foto
          </span>
        </button>
      )}
    </div>
  );
};
