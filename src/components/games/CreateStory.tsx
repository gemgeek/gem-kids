'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Sparkles, Volume2, Play } from 'lucide-react';

// STORY FRAGMENTS
const heroes = [
  { id: 'robot', label: 'Bip-Bop the Robot', img: '/images/hero-robot.png', color: 'bg-blue-500' },
  { id: 'cat', label: 'Whiskers the Cat', img: '/images/hero-cat.png', color: 'bg-orange-500' },
  { id: 'knight', label: 'Sir Brave', img: '/images/hero-knight.png', color: 'bg-red-500' },
];

const places = [
  { id: 'space', label: 'The Moon', img: '/images/place-space.png', color: 'bg-indigo-900', text: 'flew all the way to the Moon' },
  { id: 'castle', label: 'The Magic Castle', img: '/images/place-castle.png', color: 'bg-purple-600', text: 'walked into a spooky Magic Castle' },
  { id: 'jungle', label: 'The Deep Jungle', img: '/images/place-jungle.png', color: 'bg-green-600', text: 'got lost in the Deep Jungle' },
];

const items = [
  { id: 'pizza', label: 'Giant Pizza', img: '/images/item-pizza.png', color: 'bg-yellow-500', text: 'a delicious, cheesy Giant Pizza' },
  { id: 'key', label: 'Golden Key', img: '/images/item-key.png', color: 'bg-amber-400', text: 'a shiny, mysterious Golden Key' },
  { id: 'wand', label: 'Magic Wand', img: '/images/item-wand.png', color: 'bg-pink-500', text: 'a sparkling Magic Wand' },
];

export default function CreateStory({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0); // 0=Hero, 1=Place, 2=Item, 3=Generating, 4=Result
  const [selections, setSelections] = useState<any>({ hero: null, place: null, item: null });
  const [generatedText, setGeneratedText] = useState('');

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

  const handleSelect = (category: string, item: any) => {
      new window.Audio('/sounds/pop.mp3').play().catch(() => {});
      setSelections((prev: any) => ({ ...prev, [category]: item }));
      
      // Move to next step
      if (step < 2) {
          setTimeout(() => setStep(s => s + 1), 500);
      } else {
          generateStory(item); 
      }
  };

  const generateStory = (lastItem: any) => {
      setStep(3); // Loading State
      new window.Audio('/sounds/machine-spin.mp3').play().catch(() => {});
      
      // Construct the Story
      const hero = selections.hero;
      const place = selections.place;
      const item = lastItem; 

      const story = `Once upon a time, ${hero.label} decided to go on an adventure. 
      
      So, ${hero.label} ${place.text}. It was very quiet there.
      
      Suddenly, ${hero.label} looked down and found... ${item.text}! 
      
      It began to glow with magic light! ${hero.label} was so happy, and they danced all the way home. The End.`;

      setGeneratedText(story);

      // Reveal after 2 seconds
      setTimeout(() => {
          setStep(4);
          new window.Audio('/sounds/tada.mp3').play().catch(() => {});
          speak("Your story is ready!");
      }, 2000);
  };

  const reset = () => {
      setStep(0);
      setSelections({ hero: null, place: null, item: null });
      setGeneratedText('');
      window.speechSynthesis.cancel();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Image src="/images/bg-story-machine.png" alt="Lab" fill className="object-cover opacity-60" />
         <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full border border-white/20 transition backdrop-blur-md">
            <ArrowLeft />
         </button>
         
         <div className="bg-slate-800/90 px-8 py-3 rounded-full shadow-xl border-2 border-purple-400">
             <h1 className="text-purple-300 font-black uppercase tracking-widest text-lg flex items-center gap-2">
                 <Sparkles size={18} /> Story Machine
             </h1>
         </div>
         <div className="w-12"/>
      </div>

      
      <div className="relative z-10 w-full max-w-4xl p-4 flex flex-col items-center">
          
          {/* STEP INDICATORS */}
          {step < 4 && (
              <div className="flex gap-4 mb-8">
                  <div className={`w-4 h-4 rounded-full transition-all ${step >= 0 ? 'bg-green-500 scale-125' : 'bg-slate-600'}`} />
                  <div className={`w-4 h-4 rounded-full transition-all ${step >= 1 ? 'bg-green-500 scale-125' : 'bg-slate-600'}`} />
                  <div className={`w-4 h-4 rounded-full transition-all ${step >= 2 ? 'bg-green-500 scale-125' : 'bg-slate-600'}`} />
              </div>
          )}

          {/* QUESTIONS & OPTIONS */}
          {step === 0 && (
              <div className="animate-in slide-in-from-right fade-in duration-500 w-full text-center">
                  <h2 className="text-4xl font-black text-white mb-8 drop-shadow-md">Who is the Hero?</h2>
                  <div className="grid grid-cols-3 gap-6">
                      {heroes.map(h => <OptionCard key={h.id} item={h} onClick={() => handleSelect('hero', h)} />)}
                  </div>
              </div>
          )}

          {step === 1 && (
              <div className="animate-in slide-in-from-right fade-in duration-500 w-full text-center">
                  <h2 className="text-4xl font-black text-white mb-8 drop-shadow-md">Where do they go?</h2>
                  <div className="grid grid-cols-3 gap-6">
                      {places.map(p => <OptionCard key={p.id} item={p} onClick={() => handleSelect('place', p)} />)}
                  </div>
              </div>
          )}

          {step === 2 && (
              <div className="animate-in slide-in-from-right fade-in duration-500 w-full text-center">
                  <h2 className="text-4xl font-black text-white mb-8 drop-shadow-md">What do they find?</h2>
                  <div className="grid grid-cols-3 gap-6">
                      {items.map(i => <OptionCard key={i.id} item={i} onClick={() => handleSelect('item', i)} />)}
                  </div>
              </div>
          )}

          {/* LOADING STATE */}
          {step === 3 && (
              <div className="flex flex-col items-center justify-center animate-pulse">
                  <div className="w-32 h-32 relative animate-spin-slow mb-6">
                      <div className="absolute inset-0 border-8 border-purple-500 border-t-transparent rounded-full" />
                  </div>
                  <h2 className="text-3xl font-black text-purple-300">WRITING STORY...</h2>
              </div>
          )}

          
          {step === 4 && (
              <div className="relative w-full max-w-2xl bg-[#fdf6e3] rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-in zoom-in duration-700 flex flex-col items-center p-8 border-y-8 border-[#5d4037]">
                  
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[110%] h-8 bg-[#8d6e63] rounded-full shadow-lg" />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[110%] h-8 bg-[#8d6e63] rounded-full shadow-lg" />

                  
                  <h2 className="text-3xl font-serif font-black text-[#5d4037] mb-6 border-b-2 border-[#5d4037]/20 pb-2">
                      The Adventure of {selections.hero.label.split(' ')[0]}
                  </h2>

                  
                  <p className="text-xl md:text-2xl text-slate-800 leading-relaxed text-center font-serif whitespace-pre-line mb-8">
                      {generatedText}
                  </p>

                  
                  <div className="flex gap-4 mb-8 opacity-80">
                      <div className="w-16 h-16 relative bg-slate-200 rounded-full border-2 border-[#5d4037] overflow-hidden">
                          <Image src={selections.hero.img} alt="Hero" fill className="object-contain p-1" />
                      </div>
                      <div className="w-16 h-16 relative bg-slate-200 rounded-full border-2 border-[#5d4037] overflow-hidden">
                          <Image src={selections.place.img} alt="Place" fill className="object-contain p-1" />
                      </div>
                      <div className="w-16 h-16 relative bg-slate-200 rounded-full border-2 border-[#5d4037] overflow-hidden">
                          <Image src={selections.item.img} alt="Item" fill className="object-contain p-1" />
                      </div>
                  </div>

                  
                  <div className="flex gap-4">
                      <button onClick={() => speak(generatedText)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition transform hover:scale-105">
                          <Volume2 /> Read to Me
                      </button>
                      <button onClick={reset} className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-full font-bold transition">
                          <RefreshCw size={20} /> New Story
                      </button>
                  </div>
              </div>
          )}

      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}


function OptionCard({ item, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`
                group relative aspect-square bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl 
                flex flex-col items-center justify-center p-4 transition-all hover:bg-white/20 hover:scale-105 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]
            `}
        >
            <div className={`relative w-24 h-24 mb-4 drop-shadow-xl transition-transform group-hover:scale-110`}>
                <Image src={item.img} alt={item.label} fill className="object-contain" />
            </div>
            <span className="text-white font-bold text-lg uppercase tracking-wide drop-shadow-md group-hover:text-purple-300">
                {item.label}
            </span>
        </button>
    )
}