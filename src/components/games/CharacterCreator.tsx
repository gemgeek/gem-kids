'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Camera, Shirt, Scissors, Smile, Footprints, Image as ImageIcon } from 'lucide-react';


const assets = {
  hair: [
    { id: 'h1', src: '/images/char-hair-1.png' },
    { id: 'h2', src: '/images/char-hair-2.png' },
    { id: 'h3', src: '/images/char-hair-3.png' },
  ],
  top: [
    { id: 't1', src: '/images/char-top-1.png' },
    { id: 't2', src: '/images/char-top-2.png' },
    { id: 't3', src: '/images/char-top-3.png' },
  ],
  bottom: [
    { id: 'b1', src: '/images/char-bottom-1.png' },
    { id: 'b2', src: '/images/char-bottom-2.png' },
  ],
  shoes: [
    { id: 's1', src: '/images/char-shoes-1.png' },
    { id: 's2', src: '/images/char-shoes-2.png' },
  ],
  backgrounds: [
    { id: 'bg1', src: '/images/bg-studio.png', color: '#fca5a5' },
    { id: 'bg2', src: '/images/bg-park.png', color: '#86efac' }, 
  ]
};

type Category = 'hair' | 'top' | 'bottom' | 'shoes' | 'bg';

export default function CharacterCreator({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<Category>('hair');
  const [character, setCharacter] = useState({
    hair: assets.hair[0].id,
    top: assets.top[0].id,
    bottom: assets.bottom[0].id,
    shoes: assets.shoes[0].id,
    bg: assets.backgrounds[0].id,
  });
  const [flash, setFlash] = useState(false);

  // SELECTION HANDLER
  const handleSelect = (category: Category, id: string) => {
    new Audio('/sounds/pop.mp3').play().catch(() => {});
    setCharacter(prev => ({ ...prev, [category]: id }));
  };

  // SNAPSHOT EFFECT
  const takePhoto = () => {
    new Audio('/sounds/camera.mp3').play().catch(() => {});
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  };


  const getSrc = (cat: keyof typeof assets, id: string) => {
    // @ts-ignore
    return assets[cat].find(item => item.id === id)?.src || '';
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900">
      
      
      <div className="absolute inset-0 z-0 transition-all duration-500">
         <Image 
            src={getSrc('backgrounds', character.bg)} 
            alt="Background" 
            fill 
            className="object-cover opacity-100" 
         />
         {/* Flash Effect */}
         <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 ${flash ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white hover:bg-slate-100 text-slate-800 p-3 rounded-full shadow-lg transition">
            <ArrowLeft />
         </button>
         
         <div className="bg-white/90 px-6 py-2 rounded-full shadow-xl backdrop-blur-sm border-2 border-purple-200">
             <span className="font-black text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500 uppercase tracking-widest text-lg">
                 Avatar Studio
             </span>
         </div>
         
         <button onClick={takePhoto} className="bg-white hover:bg-slate-100 text-slate-800 p-3 rounded-full shadow-lg transition transform hover:scale-110 active:scale-95">
            <Camera className="text-purple-500" />
         </button>
      </div>

      
      <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center pt-20 pb-4 px-4 gap-4">
        
        
        <div className="relative w-full max-w-md h-[60vh] md:h-[70vh] flex items-center justify-center">
            
            
            <div className="absolute top-0 w-full h-full bg-linear-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

            
            <div className="relative w-75 h-125 md:w-100 md:h-150 animate-in zoom-in duration-500">
                
                
                <div className="absolute inset-0 z-10">
                    <Image src="/images/base-body.png" alt="Body" fill className="object-contain" priority />
                </div>

                
                <div className="absolute inset-0 z-20 transition-all duration-300">
                     <Image src={getSrc('shoes', character.shoes)} alt="Shoes" fill className="object-contain" />
                </div>

                
                <div className="absolute inset-0 z-30 transition-all duration-300">
                     <Image src={getSrc('bottom', character.bottom)} alt="Bottom" fill className="object-contain" />
                </div>

                
                <div className="absolute inset-0 z-40 transition-all duration-300">
                     <Image src={getSrc('top', character.top)} alt="Top" fill className="object-contain" />
                </div>

                
                <div className="absolute inset-0 z-50 transition-all duration-300">
                     <Image src={getSrc('hair', character.hair)} alt="Hair" fill className="object-contain" />
                </div>

            </div>
        </div>

        
        <div className="w-full md:w-100 bg-white/90 backdrop-blur-xl rounded-4xl shadow-2xl border border-white/50 flex flex-col overflow-hidden h-[30vh] md:h-[80vh]">
            
            
            <div className="flex p-2 gap-1 overflow-x-auto border-b border-slate-200">
                <TabBtn icon={<Scissors size={18} />} label="Hair" isActive={activeCategory === 'hair'} onClick={() => setActiveCategory('hair')} />
                <TabBtn icon={<Shirt size={18} />} label="Tops" isActive={activeCategory === 'top'} onClick={() => setActiveCategory('top')} />
                <TabBtn icon={<span className="w-4 h-4 border-2 border-current rounded-sm inline-block" />} label="Pants" isActive={activeCategory === 'bottom'} onClick={() => setActiveCategory('bottom')} />
                <TabBtn icon={<Footprints size={18} />} label="Shoes" isActive={activeCategory === 'shoes'} onClick={() => setActiveCategory('shoes')} />
                <TabBtn icon={<ImageIcon size={18} />} label="Scene" isActive={activeCategory === 'bg'} onClick={() => setActiveCategory('bg')} />
            </div>

            
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-3 content-start custom-scrollbar">
                {/* @ts-ignore */}
                {assets[activeCategory].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleSelect(activeCategory, item.id)}
                        className={`
                            relative aspect-square rounded-xl border-2 transition-all overflow-hidden bg-slate-100
                            ${character[activeCategory === 'bg' ? 'bg' : activeCategory] === item.id 
                                ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-105 bg-purple-50' 
                                : 'border-transparent hover:border-purple-300 hover:scale-105'
                            }
                        `}
                    >
                        <Image src={item.src} alt={item.id} fill className="object-contain p-2" />
                    </button>
                ))}
            </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d8b4fe; border-radius: 10px; }
      `}</style>
    </div>
  );
}


function TabBtn({ icon, label, isActive, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-w-15
                ${isActive ? 'bg-purple-500 text-white shadow-lg scale-105' : 'text-slate-500 hover:bg-slate-100'}
            `}
        >
            <div className="mb-1">{icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </button>
    )
}