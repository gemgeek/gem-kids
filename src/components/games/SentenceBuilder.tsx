'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Play, RefreshCw, Volume2 } from 'lucide-react';


const subjects = [
  { id: 'dog', text: 'Dog', emoji: '🐶', color: 'bg-blue-500' },
  { id: 'cat', text: 'Cat', emoji: '🐱', color: 'bg-blue-500' },
  { id: 'baby', text: 'Baby', emoji: '👶', color: 'bg-blue-500' },
  { id: 'alien', text: 'Alien', emoji: '👽', color: 'bg-blue-500' },
];

const verbs = [
  { id: 'ate', text: 'Ate', emoji: '🍽️', color: 'bg-red-500' },
  { id: 'kissed', text: 'Kissed', emoji: '💋', color: 'bg-red-500' },
  { id: 'tickled', text: 'Tickled', emoji: '🪶', color: 'bg-red-500' },
  { id: 'chased', text: 'Chased', emoji: '🏃', color: 'bg-red-500' },
];

const objects = [
  { id: 'pizza', text: 'Pizza', emoji: '🍕', color: 'bg-green-500' },
  { id: 'moon', text: 'Moon', emoji: '🌙', color: 'bg-green-500' },
  { id: 'shoe', text: 'Shoe', emoji: '👟', color: 'bg-green-500' },
  { id: 'bus', text: 'Bus', emoji: '🚌', color: 'bg-green-500' },
];

export default function SentenceBuilder({ onBack }: { onBack: () => void }) {
  
  const [slots, setSlots] = useState<any[]>([null, null, null]);
  const [isPlaying, setIsPlaying] = useState(false);

    // AUDIO ENGINE
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
  };

  const selectWord = (word: any, typeIdx: number) => {
      new window.Audio('/sounds/clank.mp3').play().catch(() => {});
      const newSlots = [...slots];
      newSlots[typeIdx] = word;
      setSlots(newSlots);
      speak(word.text);
  };

  const playSentence = () => {
      if (slots.includes(null)) return;
      setIsPlaying(true);
      new window.Audio('/sounds/train-whistle.mp3').play().catch(() => {});
      
      const sentence = `The ${slots[0].text} ${slots[1].text} the ${slots[2].text}`;
      setTimeout(() => speak(sentence), 1000); // Wait for whistle
  };

  const reset = () => {
      setSlots([null, null, null]);
      setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-sky-200 overflow-hidden font-sans">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Image src="/images/bg-train-station.png" alt="Station" fill className="object-cover" />
         <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full shadow-lg transition backdrop-blur-md">
            <ArrowLeft />
         </button>
         
         <div className="bg-white/90 px-8 py-3 rounded-full shadow-xl border-4 border-slate-700">
             <h1 className="text-slate-700 font-black uppercase tracking-widest text-lg">
                 Silly Sentence Train
             </h1>
         </div>
         <button onClick={reset} className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full shadow-lg transition backdrop-blur-md">
            <RefreshCw />
         </button>
      </div>

      
      <div className={`
          absolute top-[20%] w-full h-64 flex items-end justify-center gap-1 transition-transform duration-3000 ease-in
          ${isPlaying ? 'translate-x-[150vw]' : 'translate-x-0'}
      `}>
          
          <div className="relative w-40 h-40 md:w-56 md:h-56 z-20">
              <Image src="/images/train-engine.png" alt="Engine" fill className="object-contain" />
          </div>

          
          {[0, 1, 2].map((i) => (
              <div key={i} className="relative w-32 h-32 md:w-44 md:h-44 -ml-4 flex items-end">
                   
                   <div className="absolute inset-0 z-0">
                       <Image src="/images/train-car.png" alt="Car" fill className="object-contain" />
                   </div>
                   
                   
                   <div className="absolute bottom-10 left-0 right-0 top-0 flex items-center justify-center z-10">
                       {slots[i] ? (
                           <div className={`flex flex-col items-center animate-in zoom-in`}>
                               <span className="text-4xl md:text-5xl drop-shadow-md">{slots[i].emoji}</span>
                               <span className={`text-white font-black text-sm md:text-xl uppercase px-2 py-1 rounded-md shadow-sm ${slots[i].color} mt-1`}>
                                   {slots[i].text}
                               </span>
                           </div>
                       ) : (
                           <div className="w-16 h-16 border-4 border-dashed border-slate-400/50 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                               ?
                           </div>
                       )}
                   </div>
              </div>
          ))}
      </div>

      
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl rounded-t-[3rem] p-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-transform duration-500">
          
          {isPlaying ? (
               <div className="h-64 flex items-center justify-center">
                   <h2 className="text-4xl font-black text-green-500 animate-bounce">CHOO CHOO!</h2>
               </div>
          ) : (
              <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                  
                  
                  <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-bold uppercase text-xs w-16 text-right">Who?</span>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                          {subjects.map(w => <WordBtn key={w.id} word={w} onClick={() => selectWord(w, 0)} isSelected={slots[0]?.id === w.id} />)}
                      </div>
                  </div>

                  
                  <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-bold uppercase text-xs w-16 text-right">Action</span>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                          {verbs.map(w => <WordBtn key={w.id} word={w} onClick={() => selectWord(w, 1)} isSelected={slots[1]?.id === w.id} />)}
                      </div>
                  </div>

                  
                  <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-bold uppercase text-xs w-16 text-right">What?</span>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                          {objects.map(w => <WordBtn key={w.id} word={w} onClick={() => selectWord(w, 2)} isSelected={slots[2]?.id === w.id} />)}
                      </div>
                  </div>

                  
                  <div className="flex justify-center mt-2">
                      <button 
                        onClick={playSentence}
                        disabled={slots.includes(null)}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white px-12 py-4 rounded-full font-black text-xl shadow-xl transition transform active:scale-95 flex items-center gap-3"
                      >
                          <Play fill="currentColor" /> GO TRAIN!
                      </button>
                  </div>
              </div>
          )}
      </div>

    </div>
  );
}

function WordBtn({ word, onClick, isSelected }: any) {
    return (
        <button 
            onClick={onClick}
            className={`
                shrink-0 px-4 py-3 rounded-2xl border-b-4 transition-all flex flex-col items-center min-w-20
                ${isSelected 
                    ? 'translate-y-1 border-b-0 bg-slate-200 shadow-inner opacity-50' 
                    : `bg-white border-slate-200 hover:border-${word.color.split('-')[1]}-400 hover:-translate-y-1 shadow-md`
                }
            `}
        >
            <span className="text-2xl mb-1">{word.emoji}</span>
            <span className="text-xs font-bold text-slate-700 uppercase">{word.text}</span>
        </button>
    )
}