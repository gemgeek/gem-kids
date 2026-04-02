'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, Map, Globe, Camera, Trash2 } from 'lucide-react';

// COUNTRIES & ASSETS
const destinations = [
  {
    id: 'ghana',
    name: 'Ghana',
    flag: '🇬🇭',
    description: 'Design Adinkra Cloth',
    baseImage: '/images/base-cloth.png',
    stamps: ['stamp-adinkra-1', 'stamp-adinkra-2', 'stamp-adinkra-3'],
    bgColor: 'bg-orange-100',
    accentColor: 'text-orange-600',
  },
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    description: 'Decorate a Fan',
    baseImage: '/images/base-fan.png',
    stamps: ['stamp-sakura', 'stamp-bamboo', 'stamp-koi'],
    bgColor: 'bg-pink-100',
    accentColor: 'text-pink-600',
  },
  {
    id: 'greece',
    name: 'Greece',
    flag: '🇬🇷',
    description: 'Paint Ancient Pottery',
    baseImage: '/images/base-pot.png',
    stamps: ['stamp-geo', 'stamp-horse', 'stamp-olive'],
    bgColor: 'bg-blue-100',
    accentColor: 'text-blue-600',
  }
];

export default function ArtWorld({ onBack }: { onBack: () => void }) {
  const [currentDest, setCurrentDest] = useState<number | null>(null);
  const [placedStamps, setPlacedStamps] = useState<{id: number, src: string, x: number, y: number}[]>([]);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);

  const activeCountry = currentDest !== null ? destinations[currentDest] : null;

  const handleTravel = (index: number) => {
    new window.Audio('/sounds/woosh.mp3').play().catch(() => {});
    setCurrentDest(index);
    setPlacedStamps([]);
    setSelectedStamp(destinations[index].stamps[0]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedStamp) return;

    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; 
    const y = ((e.clientY - rect.top) / rect.height) * 100; 

    const newStamp = {
        id: Date.now(),
        src: `/images/${selectedStamp}.png`,
        x, 
        y
    };

    setPlacedStamps(prev => [...prev, newStamp]);
    new window.Audio('/sounds/stamp.mp3').play().catch(() => {});
  };

  const undoLast = () => {
    setPlacedStamps(prev => prev.slice(0, -1));
  };

  const takePhoto = () => {
      new window.Audio('/sounds/camera.mp3').play().catch(() => {});
      
      const flash = document.getElementById('flash-overlay');
      if(flash) {
          flash.style.opacity = '1';
          setTimeout(() => { flash.style.opacity = '0'; }, 300);
      }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#f0f9ff]">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={activeCountry ? () => setCurrentDest(null) : onBack} className="bg-white hover:bg-slate-100 text-slate-800 p-3 rounded-full shadow-lg transition">
            <ArrowLeft />
         </button>
         
         <div className="bg-white/90 px-8 py-3 rounded-full shadow-xl border-2 border-blue-100 flex items-center gap-3">
             <Globe className="text-blue-500" />
             <h1 className="text-slate-700 font-black uppercase tracking-widest text-lg">
                 {activeCountry ? activeCountry.name : 'World Art Tour'}
             </h1>
         </div>
         <div className="w-12" />
      </div>

      
      {!activeCountry ? (
          <div className="relative z-10 w-full max-w-5xl h-full flex items-center justify-center p-4">
              
              <div className="absolute inset-0 z-0 opacity-20">
                  <Image src="/images/bg-world-map.png" alt="Map" fill className="object-contain" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 z-10 w-full">
                  {destinations.map((dest, idx) => (
                      <button 
                        key={dest.id}
                        onClick={() => handleTravel(idx)}
                        className="group relative bg-white rounded-4xl p-6 shadow-2xl border-4 border-white hover:border-blue-300 transition-all hover:-translate-y-4"
                      >
                          <div className={`absolute top-0 left-0 w-full h-32 ${dest.bgColor} rounded-t-[1.7rem] opacity-50`} />
                          
                          <div className="relative w-full h-40 mb-4 flex items-center justify-center">
                              <Image src={dest.baseImage} alt={dest.name} fill className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform" />
                          </div>
                          
                          <div className="text-center">
                              <span className="text-4xl mb-2 block">{dest.flag}</span>
                              <h2 className="text-2xl font-black text-slate-800">{dest.name}</h2>
                              <p className={`font-bold text-sm ${dest.accentColor}`}>{dest.description}</p>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      ) : (
          
          <div className={`relative w-full h-full flex flex-col md:flex-row items-center justify-center p-4 gap-8 ${activeCountry.bgColor}`}>
              
              
              <div id="flash-overlay" className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-300 z-100" />

              
              <div 
                onClick={handleCanvasClick}
                className="relative w-full max-w-xl aspect-square cursor-crosshair group"
              >
                  
                  <Image src={activeCountry.baseImage} alt="Artifact" fill className="object-contain drop-shadow-2xl" priority />
                  
                  
                  {placedStamps.map((stamp) => (
                      <div 
                        key={stamp.id}
                        className="absolute w-16 h-16 md:w-24 md:h-24 transition-transform hover:scale-110"
                        style={{ 
                            left: `${stamp.x}%`, 
                            top: `${stamp.y}%`, 
                            transform: 'translate(-50%, -50%)' 
                        }}
                      >
                          <Image src={stamp.src} alt="Stamp" fill className="object-contain drop-shadow-md" />
                      </div>
                  ))}

                  
                  {selectedStamp && (
                      <div className="hidden md:block absolute w-16 h-16 opacity-50 pointer-events-none z-50 group-hover:block" 
                           style={{ left: '50%', top: '50%' }} 
                      >
                          
                      </div>
                  )}
              </div>

              
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-4xl shadow-2xl border border-white/50 w-full md:w-80 flex flex-col gap-6">
                  
                  <div className="text-center">
                      <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Choose a Stamp</h3>
                      <div className="grid grid-cols-3 gap-4">
                          {activeCountry.stamps.map((stamp) => (
                              <button
                                key={stamp}
                                onClick={() => setSelectedStamp(stamp)}
                                className={`
                                    relative w-20 h-20 rounded-2xl border-2 flex items-center justify-center transition-all
                                    ${selectedStamp === stamp 
                                        ? 'bg-blue-50 border-blue-500 scale-110 shadow-lg' 
                                        : 'bg-slate-50 border-transparent hover:bg-slate-100'}
                                `}
                              >
                                  <div className="relative w-12 h-12">
                                      <Image src={`/images/${stamp}.png`} alt={stamp} fill className="object-contain" />
                                  </div>
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="h-px bg-slate-200 w-full" />

                  <div className="flex gap-3">
                      <button onClick={undoLast} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-4 rounded-xl font-bold flex flex-col items-center gap-1 transition">
                          <Trash2 size={20} />
                          <span className="text-[10px] uppercase">Undo</span>
                      </button>
                      <button onClick={takePhoto} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold flex flex-col items-center gap-1 shadow-lg transition transform hover:scale-105">
                          <Camera size={20} />
                          <span className="text-[10px] uppercase">Save</span>
                      </button>
                  </div>

              </div>

          </div>
      )}

    </div>
  );
}