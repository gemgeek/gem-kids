'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Search, CheckCircle } from 'lucide-react';


const items = [
  { id: 'bird', label: 'Bird', x: 20, y: 15, width: 10, height: 10 },
  { id: 'dog', label: 'Dog', x: 50, y: 60, width: 12, height: 15 },
  { id: 'kite', label: 'Kite', x: 70, y: 10, width: 10, height: 15 },
  { id: 'ball', label: 'Ball', x: 30, y: 80, width: 8, height: 8 },
  { id: 'tree', label: 'Tree', x: 80, y: 40, width: 15, height: 40 },
];

export default function WordExplorer({ onBack }: { onBack: () => void }) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [lastFound, setLastFound] = useState<string | null>(null);

  const handleFind = (item: typeof items[0]) => {
      if (!foundIds.includes(item.id)) {
          setFoundIds(prev => [...prev, item.id]);
          new window.Audio('/sounds/pop.mp3').play().catch(() => {});
      }
      setLastFound(item.label);
      
      // Speak
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(item.label);
        window.speechSynthesis.speak(utterance);
      }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-green-100 overflow-hidden font-sans cursor-crosshair">
      
      
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
         <button onClick={onBack} className="pointer-events-auto bg-white hover:bg-slate-100 text-slate-800 p-3 rounded-full shadow-lg transition">
            <ArrowLeft />
         </button>
         
         <div className="bg-white/90 px-6 py-2 rounded-full shadow-xl border-2 border-green-400 flex items-center gap-3">
             <Search className="text-green-600" size={20} />
             <span className="font-bold text-green-800 uppercase tracking-widest">
                 Found: {foundIds.length} / {items.length}
             </span>
         </div>
      </div>

      <div className="relative w-full h-full md:w-[80vw] md:h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
          
          {/* Main Image */}
          <div className="absolute inset-0">
             <Image src="/images/bg-explorer-park1.png" alt="Scene" fill className="object-cover" />
          </div>

          {/* Hotspots */}
          {items.map((item) => {
              const isFound = foundIds.includes(item.id);

              return (
                  <button
                    key={item.id}
                    onClick={() => handleFind(item)}
                    className={`absolute border-2 border-transparent hover:border-white/50 rounded-xl transition-all group`}
                    style={{ 
                        left: `${item.x}%`, 
                        top: `${item.y}%`, 
                        width: `${item.width}%`, 
                        height: `${item.height}%` 
                    }}
                  >
                      
                      <div className={`
                          absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-4 py-1 rounded-full shadow-xl font-bold whitespace-nowrap
                          transition-all duration-300 flex items-center gap-2
                          ${isFound ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-100'}
                      `}>
                          {item.label} {isFound && <CheckCircle size={14} className="text-green-500"/>}
                      </div>

                      
                      {isFound && (
                          <div className="absolute inset-0 border-4 border-green-400 rounded-xl animate-pulse shadow-[0_0_20px_rgba(74,222,128,0.5)]" />
                      )}
                  </button>
              )
          })}
      </div>

    </div>
  );
}