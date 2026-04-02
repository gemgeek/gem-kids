'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Volume2, Music } from 'lucide-react';


const soundList = [
  { id: 'lion', name: 'Lion', img: '/images/lion.png', audio: '/sounds/lion.mp3', color: 'bg-orange-400' },
  { id: 'elephant', name: 'Elephant', img: '/images/elephant.png', audio: '/sounds/elephant.mp3', color: 'bg-blue-400' },
  { id: 'monkey', name: 'Monkey', img: '/images/monkey.png', audio: '/sounds/monkey.mp3', color: 'bg-yellow-400' },
  { id: 'zebra', name: 'Zebra', img: '/images/zebra.png', audio: '/sounds/zebra.mp3', color: 'bg-gray-400' },
  { id: 'cheetah', name: 'Cheetah', img: '/images/cheetah.png', audio: '/sounds/cheetah.mp3', color: 'bg-yellow-500' },
  { id: 'wolf', name: 'Wolf', img: '/images/wolf.png', audio: '/sounds/wolf.mp3', color: 'bg-gray-600' }, 
  { id: 'frog', name: 'Frog', img: '/images/frog.png', audio: '/sounds/frog.mp3', color: 'bg-green-500' },
  { id: 'bird', name: 'Parrot', img: '/images/parrot.png', audio: '/sounds/parrot.mp3', color: 'bg-red-500' },
];

interface SoundboardProps {
  onBack: () => void;
}

export default function Soundboard({ onBack }: SoundboardProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const playSound = (id: string, audioPath: string) => {
    
    setPlayingId(id);
    setTimeout(() => setPlayingId(null), 500); 

    
    const audio = new Audio(audioPath);
    audio.play().catch(e => console.log(e));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in zoom-in-95">
      
      
      <div className="relative w-full max-w-6xl h-[85vh] bg-[#2D1B4E] rounded-3xl shadow-2xl overflow-hidden flex flex-col border-4 border-purple-500">
        
        
        <div className="bg-purple-600 p-4 flex justify-between items-center text-white shadow-md z-20">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition">
                    <ArrowLeft size={28} />
                </button>
                <div className="flex items-center gap-2">
                    <Music size={32} className="text-yellow-300" />
                    <h1 className="text-3xl font-black uppercase tracking-wider">Jungle Beats</h1>
                </div>
            </div>
        </div>

        
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-full content-center">
                {soundList.map((item) => {
                    const isPlaying = playingId === item.id;

                    return (
                        <div 
                            key={item.id}
                            onClick={() => playSound(item.id, item.audio)}
                            className={`
                                relative group cursor-pointer rounded-3xl p-4 flex flex-col items-center justify-center
                                transition-all duration-100 ease-in-out border-b-8 border-black/20
                                ${item.color}
                                ${isPlaying ? 'scale-90 border-b-0 translate-y-2' : 'hover:scale-105 hover:-translate-y-1'}
                            `}
                        >
                            
                            <div className="relative w-32 h-32 mb-2 drop-shadow-lg">
                                <Image 
                                    src={item.img} 
                                    alt={item.name} 
                                    fill 
                                    className={`object-contain transition-transform ${isPlaying ? 'animate-bounce' : ''}`} 
                                />
                            </div>
                            
                            
                            <div className="bg-black/20 px-4 py-1 rounded-full text-white font-bold uppercase tracking-wider">
                                {item.name}
                            </div>

                            
                            <div className="absolute top-2 right-2 text-white/50 group-hover:text-white">
                                <Volume2 size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
}