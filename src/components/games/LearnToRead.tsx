'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Volume2 } from 'lucide-react';

// ALPHABET DATA
const alphabet = [
  { id: 'A', word: 'Apple', img: '/images/card-a.png', color: 'bg-red-500', shadow: 'shadow-red-400' },
  { id: 'B', word: 'Ball', img: '/images/card-b.png', color: 'bg-blue-500', shadow: 'shadow-blue-400' },
  { id: 'C', word: 'Cat', img: '/images/cat.png', color: 'bg-orange-500', shadow: 'shadow-orange-400' },
  { id: 'D', word: 'Dog', img: '/images/dog.png', color: 'bg-green-500', shadow: 'shadow-green-400' },
  { id: 'E', word: 'Elephant', img: '/images/elephant.png', color: 'bg-yellow-500', shadow: 'shadow-yellow-400' },
  { id: 'F', word: 'Fish', img: '/images/fish.png', color: 'bg-teal-500', shadow: 'shadow-teal-400' },
  { id: 'G', word: 'Guitar', img: '/images/guitar.png', color: 'bg-purple-500', shadow: 'shadow-purple-400' },
  { id: 'H', word: 'Hat', img: '/images/hat.png', color: 'bg-pink-500', shadow: 'shadow-pink-400' },
  { id: 'I', word: 'Ink', img: '/images/ink.png', color: 'bg-red-500', shadow: 'shadow-red-400' },
  { id: 'J', word: 'Juice', img: '/images/juice.png', color: 'bg-yellow-500', shadow: 'shadow-yellow-400' },
  { id: 'K', word: 'Keyboard', img: '/images/keyboard.png', color: 'bg-blue-500', shadow: 'shadow-blue-400' },
  { id: 'L', word: 'Lamp', img: '/images/lamp.png', color: 'bg-orange-500', shadow: 'shadow-orange-400' },
  
];

export default function LearnToRead({ onBack }: { onBack: () => void }) {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  // AUDIO ENGINE 
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; 
        utterance.pitch = 1.1; 
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleCardClick = (item: typeof alphabet[0]) => {
      
      if (flippedCard === item.id) {
          setFlippedCard(null);
          return;
      }

      
      setFlippedCard(item.id);
      
      
      new window.Audio('/sounds/pop.mp3').play().catch(() => {});
      
      
      setTimeout(() => {
          speak(`${item.id}... ${item.word}`);
      }, 300); 
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fefce8] overflow-hidden font-sans">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Image src="/images/paper-texture.png" alt="Background" fill className="object-cover opacity-50" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-full shadow-lg transition transform hover:scale-110">
            <ArrowLeft />
         </button>
         
         <div className="bg-white/90 px-8 py-3 rounded-full shadow-xl border-2 border-yellow-300">
             <h1 className="text-yellow-600 font-black uppercase tracking-widest text-lg">
                 Alphabet Cards
             </h1>
         </div>
         <div className="w-12"/>
      </div>

      
      <div className="relative z-10 w-full max-w-5xl h-full p-8 pt-24 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-6 content-start pb-20">
          
          {alphabet.map((item) => {
              const isFlipped = flippedCard === item.id;

              return (
                  <div 
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className="relative aspect-3/4 cursor-pointer perspective-1000 group"
                  >
                      
                      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                          
                          
                          <div className={`
                              absolute inset-0 backface-hidden rounded-4xl shadow-2xl flex flex-col items-center justify-center border-b-8 border-white/20
                              ${item.color} ${item.shadow} shadow-[0_10px_0_rgba(0,0,0,0.1)]
                              group-hover:-translate-y-2 transition-transform
                          `}>
                              
                              <div className="absolute top-4 left-4 w-4 h-4 bg-white/30 rounded-full" />
                              <div className="absolute bottom-4 right-4 w-4 h-4 bg-white/30 rounded-full" />
                              
                              <span className="text-9xl font-black text-white drop-shadow-md">
                                  {item.id}
                              </span>
                              <span className="text-white/80 font-bold uppercase tracking-widest mt-4">
                                  Tap to Flip
                              </span>
                          </div>

                          
                          <div className={`
                              absolute inset-0 backface-hidden rounded-4xl shadow-xl bg-white flex flex-col items-center justify-center border-4
                              rotate-y-180 ${item.color.replace('bg-', 'border-')}
                          `}>
                              <div className="relative w-40 h-40 animate-bounce-slow">
                                  <Image src={item.img} alt={item.word} fill className="object-contain" />
                              </div>
                              <h2 className={`text-3xl font-black mt-4 ${item.color.replace('bg-', 'text-')} uppercase tracking-wider`}>
                                  {item.word}
                              </h2>
                              <button onClick={(e) => { e.stopPropagation(); speak(item.word); }} className="mt-4 bg-slate-100 p-2 rounded-full text-slate-400 hover:text-blue-500">
                                  <Volume2 size={20} />
                              </button>
                          </div>

                      </div>
                  </div>
              )
          })}
      </div>

        {/* GLOBAL STYLES */}   
      <style jsx global>{`
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
          
          @keyframes bounce-slow {
              0%, 100% { transform: translateY(-5%); }
              50% { transform: translateY(5%); }
          }
          .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}