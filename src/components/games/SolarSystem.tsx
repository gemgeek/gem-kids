'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Star, Info } from 'lucide-react';

// PLANET DATA
interface PlanetData {
  id: string;
  name: string;
  img: string;
  size: number; 
  orbitRadius: number; 
  orbitSpeed: number; 
  fact: string;
}

const planets: PlanetData[] = [
  { id: 'mercury', name: 'Mercury', img: '/images/mercury.png', size: 30, orbitRadius: 80, orbitSpeed: 4, fact: 'Fastest planet!' },
  { id: 'venus', name: 'Venus', img: '/images/venus.png', size: 45, orbitRadius: 120, orbitSpeed: 7, fact: 'Hottest planet!' },
  { id: 'earth', name: 'Earth', img: '/images/earth.png', size: 48, orbitRadius: 170, orbitSpeed: 10, fact: 'Our home!' },
  { id: 'mars', name: 'Mars', img: '/images/mars.png', size: 40, orbitRadius: 220, orbitSpeed: 14, fact: 'The Red Planet' },
  { id: 'jupiter', name: 'Jupiter', img: '/images/jupiter.png', size: 80, orbitRadius: 290, orbitSpeed: 24, fact: 'Gas Giant' },
  { id: 'saturn', name: 'Saturn', img: '/images/saturn.png', size: 100, orbitRadius: 370, orbitSpeed: 30, fact: 'Has rings!' },
  { id: 'uranus', name: 'Uranus', img: '/images/uranus.png', size: 60, orbitRadius: 440, orbitSpeed: 40, fact: 'Ice Giant' },
  { id: 'neptune', name: 'Neptune', img: '/images/neptune.png', size: 58, orbitRadius: 510, orbitSpeed: 50, fact: 'Very windy!' },
];

export default function SolarSystem({ onBack }: { onBack: () => void }) {
  const [placedPlanets, setPlacedPlanets] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [showWin, setShowWin] = useState(false);
  
  // Audio helpers
  const playSound = (sound: string) => new Audio(`/sounds/${sound}.mp3`).play().catch(() => {});

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('planetId', id);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const planetId = e.dataTransfer.getData('planetId');
    
    const correctPlanet = planets[targetIndex];
    
    if (planetId === correctPlanet.id) {
        playSound('pop');
        setPlacedPlanets(prev => [...prev, planetId]);
    } else {
        playSound('wrong');
    }
    setDraggedId(null);
  };

  // Check Win
  useEffect(() => {
    if (placedPlanets.length === planets.length) {
        setTimeout(() => {
            setShowWin(true);
            playSound('win2');
        }, 1000);
    }
  }, [placedPlanets]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black overflow-hidden">
      
      
      <div className="absolute inset-0 z-0">
         <Image src="/images/space-bg.png" alt="Space" fill className="object-cover opacity-80" />
         
         <div className="absolute inset-0 bg-[url('/images/stars-pattern.png')] animate-pulse opacity-50" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
         <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full pointer-events-auto backdrop-blur-md border border-white/10 transition">
            <ArrowLeft />
         </button>
         <h1 className="text-white/80 font-black tracking-[0.3em] uppercase text-xl">Solar System Builder</h1>
         <div className="w-12" />
      </div>

      
      <div className="relative w-full h-full flex items-center justify-center scale-75 md:scale-100">
        
        
        <div className="absolute z-20 w-32 h-32 rounded-full animate-pulse shadow-[0_0_100px_rgba(253,186,116,0.6)]">
            <Image src="/images/sun.png" alt="Sun" fill className="object-contain" />
        </div>

        
        {planets.map((planet, index) => {
            const isPlaced = placedPlanets.includes(planet.id);
            const isTarget = draggedId === planet.id;
            
            
            const ringSize = planet.orbitRadius * 2; 

            return (
                <div 
                    key={planet.id}
                    className="absolute rounded-full flex items-center justify-center transition-all duration-500"
                    style={{ 
                        width: ringSize, 
                        height: ringSize, 
                        zIndex: 10 - index, 
                        border: isPlaced ? '1px solid rgba(255,255,255,0.1)' : '2px dashed rgba(255,255,255,0.15)'
                    }}
                    
                    onDragOver={!isPlaced ? handleDragOver : undefined}
                    onDrop={!isPlaced ? (e) => handleDrop(e, index) : undefined}
                >
                    
                    {!isPlaced && isTarget && (
                        <div className="absolute inset-0 rounded-full border-2 border-green-400 bg-green-400/5 animate-ping" />
                    )}

                    
                    {isPlaced && (
                        <div 
                            className="absolute w-full h-full animate-spin-orbit"
                            style={{ animationDuration: `${planet.orbitSpeed}s` }}
                        >
                            
                            <div 
                                className="absolute -top-[50%] left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                                style={{ top: `-${planet.size / 2}px` }}
                            >
                                <div style={{ width: planet.size, height: planet.size }} className="relative hover:scale-125 transition-transform">
                                    <Image src={planet.img} alt={planet.name} fill className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                                
                                <div className="absolute top-full mt-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                                    {planet.fact}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )
        })}
      </div>

      
      <div className="absolute bottom-0 md:right-0 md:top-0 md:bottom-auto w-full md:w-32 md:h-full bg-black/60 backdrop-blur-xl border-t md:border-l border-white/10 z-50 flex md:flex-col items-center p-4 gap-4 overflow-x-auto md:overflow-y-auto custom-scrollbar">
         
         <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2 md:mb-4 shrink-0">
            Planets
         </div>

         {planets.map(planet => {
             if (placedPlanets.includes(planet.id)) return null;
             
             return (
                 <div
                    key={planet.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, planet.id)}
                    className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 cursor-grab active:cursor-grabbing flex items-center justify-center transition-transform hover:scale-110"
                 >
                     <div className="relative w-12 h-12 md:w-16 md:h-16">
                         <Image src={planet.img} alt={planet.name} fill className="object-contain" />
                     </div>
                 </div>
             )
         })}
      </div>

      {/* WIN MODAL */}
      {showWin && (
         <div className="absolute inset-0 z-100 bg-black/80 flex items-center justify-center animate-in fade-in">
             <div className="bg-[#0f172a] border border-blue-500/50 p-10 rounded-3xl text-center max-w-lg shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                 <h2 className="text-4xl font-black text-white mb-2">SYSTEM ONLINE!</h2>
                 <p className="text-blue-300 mb-6">You built the whole solar system.</p>
                 <button onClick={onBack} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition">
                    Explore Universe
                 </button>
             </div>
         </div>
      )}

      
      <style jsx global>{`
        @keyframes spin-orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-orbit {
            animation: spin-orbit linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

    </div>
  );
}