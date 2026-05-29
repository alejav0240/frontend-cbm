'use client';

import { motion } from 'motion/react';
import { Music } from 'lucide-react';
import { useEffect, useState } from 'react';

const Note = ({ delay, x, y, size, drift }: { delay: number; x: string; y: string; size: number; drift: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.5 }}
        animate={{
            opacity: [0, 0.4, 0],
            y: [-20, -100],
            x: [0, drift],
            rotate: [0, 45, -45, 0],
            scale: [0.5, 1, 0.5]
        }}
        transition={{
            duration: 5,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        style={{ left: x, top: y, position: 'absolute' }}
        className="text-[#008080]/20 pointer-events-none"
    >
        <Music size={size} />
    </motion.div>
);

export function MusicalNotes() {
    const [notes, setNotes] = useState<{ id: number; delay: number; x: string; y: string; size: number; drift: number }[]>([]);

    useEffect(() => {
        const newNotes = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 5,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            size: 16 + Math.random() * 24,
            drift: Math.random() * 40 - 20
        }));
        requestAnimationFrame(() => {
            setNotes(newNotes);
        });
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {notes.map((note) => (
                <Note key={note.id} {...note} />
            ))}
        </div>
    );
}

export default MusicalNotes;
