'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fdfcfb] dark:bg-background transition-colors duration-500">
            <div className="relative flex flex-col items-center">
                {/* Logo Container with subtle pulse and float */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: [1, 1.02, 1]
                    }}
                    transition={{
                        opacity: { duration: 1 },
                        y: { duration: 1 },
                        scale: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    className="relative w-72 h-36 mb-12"
                >
                    <Image
                        src="/logohorizontal.png"
                        alt="Centro Boliviano de Musicoterapia Logo"
                        fill
                        className="object-contain transition-all duration-500"
                        priority
                    />
                </motion.div>

                {/* Elegant Progress Indicator */}
                <div className="relative w-48 h-[2px] bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#008080] to-transparent"
                    />
                </div>

                {/* Subtle Text Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mt-8 flex flex-col items-center gap-2"
                >
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#008080] dark:text-[#00b2b2]">
                        Armonizando
                    </p>
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [4, 12, 4],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                                className="w-[2px] bg-[#008080]/40 dark:bg-[#00b2b2]/40 rounded-full"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.03, 0.06, 0.03]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#008080] rounded-full blur-[120px]"
                />
            </div>
        </div>
    );
}
