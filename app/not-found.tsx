'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Music, Home, ArrowLeft } from 'lucide-react';
import MusicalNotes from "@/shared/ui/MusicalNotes";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#fdfcfb] dark:bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            <MusicalNotes />

            <div className="max-w-md w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-24 h-24 bg-[#008080]/10 rounded-full flex items-center justify-center text-[#008080] mx-auto mb-8">
                        <Music size={48} className="animate-pulse" />
                    </div>

                    <h1 className="serif text-6xl font-light mb-4 dark:text-white">404</h1>
                    <h2 className="serif text-2xl mb-6 dark:text-gray-200">Melodía no encontrada</h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                        Parece que la página que buscas ha cambiado de ritmo o ya no forma parte de nuestra armonía.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="bg-[#008080] text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#006666] transition-all shadow-lg group"
                        >
                            <Home size={18} />
                            Volver al Inicio
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="border border-[#008080] text-[#008080] px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#008080]/5 transition-all"
                        >
                            <ArrowLeft size={18} />
                            Regresar
                        </button>
                    </div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#008080]/5 rounded-full blur-3xl" />
            </div>
        </div>
    );
}
