'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, Play, Square, Volume2, Mic2, Music, Zap, Speaker } from 'lucide-react';

// SOUND CONFIG 
const pads = [
  { id: 'kick', label: 'KICK', color: 'bg-rose-600', shadow: 'shadow-rose-500', sound: '/sounds/kick.mp3', icon: <Zap /> },
  { id: 'snare', label: 'SNARE', color: 'bg-amber-500', shadow: 'shadow-amber-500', sound: '/sounds/snare.mp3', icon: <Zap /> },
  { id: 'clap', label: 'CLAP', color: 'bg-orange-500', shadow: 'shadow-orange-500', sound: '/sounds/clap.mp3', icon: <Zap /> },
  { id: 'hihat', label: 'HI-HAT', color: 'bg-yellow-400', shadow: 'shadow-yellow-400', sound: '/sounds/hihat.mp3', icon: <Zap /> },
  
  { id: 'bass', label: 'BASS', color: 'bg-cyan-600', shadow: 'shadow-cyan-500', sound: '/sounds/bass.mp3', icon: <Music /> },
  { id: 'chord', label: 'CHORD', color: 'bg-blue-600', shadow: 'shadow-blue-500', sound: '/sounds/chord.mp3', icon: <Music /> },
  { id: 'piano', label: 'PIANO', color: 'bg-violet-600', shadow: 'shadow-violet-500', sound: '/sounds/piano.mp3', icon: <Music /> },
  { id: 'vox', label: 'HEY!', color: 'bg-fuchsia-500', shadow: 'shadow-fuchsia-500', sound: '/sounds/vox.mp3', icon: <Mic2 /> },
  
  { id: 'laser', label: 'LASER', color: 'bg-emerald-500', shadow: 'shadow-emerald-500', sound: '/sounds/laser.mp3', icon: <Volume2 /> },
  { id: 'scratch', label: 'SCRATCH', color: 'bg-green-600', shadow: 'shadow-green-500', sound: '/sounds/scratch.mp3', icon: <Volume2 /> },
  { id: 'airhorn', label: 'AIRHORN', color: 'bg-red-500', shadow: 'shadow-red-500', sound: '/sounds/airhorn.mp3', icon: <Speaker /> }, // YOUR AIRHORN!
  { id: 'boom', label: 'BOOM', color: 'bg-indigo-500', shadow: 'shadow-indigo-500', sound: '/sounds/boom.mp3', icon: <Volume2 /> },
];

export default function MusicRhythm({ onBack }: { onBack: () => void }) {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [isPlayingLoop, setIsPlayingLoop] = useState(false);
  const loopRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Loop Track
  useEffect(() => {
    loopRef.current = new window.Audio('/sounds/beat-loop.mp3');
    loopRef.current.loop = true;
    loopRef.current.volume = 0.4; 
    return () => { loopRef.current?.pause(); };
  }, []);

  const playSound = (pad: typeof pads[0]) => {
    setActivePad(pad.id);
    setTimeout(() => setActivePad(null), 150);

    const audio = new window.Audio(pad.sound);
    audio.volume = 1.0;
    audio.play().catch(() => {});
  };

  const toggleLoop = () => {
    if (!loopRef.current) return;
    if (isPlayingLoop) {
        loopRef.current.pause();
        loopRef.current.currentTime = 0;
    } else {
        loopRef.current.play().catch(() => {});
    }
    setIsPlayingLoop(!isPlayingLoop);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black overflow-hidden">
      
      
      <div className={`absolute inset-0 z-0 transition-transform duration-75 ${activePad === 'kick' ? 'scale-105' : 'scale-100'}`}>
         <Image src="/images/dj-bg.png" alt="DJ Stage" fill className="object-cover opacity-60" />
         <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/80" />
      </div>

      
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white/10 text-white hover:bg-white/20 p-3 rounded-full border border-white/10 transition backdrop-blur-md">
            <ArrowLeft />
         </button>
         
         <div className="flex flex-col items-center">
             <h1 className="text-white font-black uppercase tracking-[0.2em] text-2xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse">
                 Groove Station
             </h1>
             
             <div className="flex gap-1 mt-2 h-4 items-end">
                 {[...Array(8)].map((_, i) => (
                     <div key={i} 
                          className={`w-2 bg-linear-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-75 
                          ${activePad || isPlayingLoop ? 'h-full' : 'h-2'}`} 
                          style={{ 
                              height: activePad || isPlayingLoop ? `${Math.random() * 100}%` : '20%',
                              transitionDelay: `${i * 0.05}s` 
                          }} 
                     />
                 ))}
             </div>
         </div>
         <div className="w-12" /> 
      </div>

      
      <div className="relative w-full max-w-4xl h-full flex flex-col items-center justify-center gap-8 p-4 pt-20">
        
        
        <button 
            onClick={toggleLoop}
            className={`
                flex items-center gap-3 px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all border-2
                ${isPlayingLoop 
                    ? 'bg-green-500 text-black border-green-400 shadow-[0_0_50px_rgba(34,197,94,0.6)] scale-110 animate-bounce' 
                    : 'bg-black/50 text-white border-white/20 hover:bg-white/10 hover:border-white/50 backdrop-blur-md'
                }
            `}
        >
            {isPlayingLoop ? <Square fill="black" size={20} /> : <Play fill="currentColor" size={20} />}
            {isPlayingLoop ? 'STOP BEAT' : 'START BACKING TRACK'}
        </button>

        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-3xl perspective-[1000px]">
            {pads.map((pad) => {
                const isActive = activePad === pad.id;
                return (
                    <button
                        key={pad.id}
                        onMouseDown={() => playSound(pad)}
                        onTouchStart={(e) => { e.preventDefault(); playSound(pad); }}
                        className={`
                            group relative aspect-square rounded-2xl md:rounded-3xl flex flex-col items-center justify-center transition-all duration-75
                            ${pad.color} border-b-8 border-black/30
                            ${isActive 
                                ? `scale-95 border-b-0 brightness-150 ${pad.shadow} shadow-[0_0_50px_currentColor]` 
                                : 'hover:-translate-y-2 hover:brightness-110'
                            }
                        `}
                    >
                        
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-2xl pointer-events-none" />
                        
                        
                        <div className={`text-white mb-2 transition-transform duration-75 ${isActive ? 'scale-150 rotate-12' : 'scale-100 group-hover:scale-110'}`}>
                            {pad.icon}
                        </div>
                        
                        
                        <span className="text-[10px] md:text-sm font-black text-white/90 tracking-widest uppercase drop-shadow-md">
                            {pad.label}
                        </span>
                    </button>
                )
            })}
        </div>

      </div>
    </div>
  );
}