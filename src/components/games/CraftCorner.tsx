'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Scissors, RotateCw, Smile, Sparkles } from 'lucide-react';

const crafts = [
  {
    id: 'boat',
    title: 'Paper Boat',
    color: 'bg-blue-500',
    steps: [
      { img: '/images/step-1.png', instruction: 'Start with a square paper.', action: 'fold' },
      { img: '/images/step-2.png', instruction: 'Fold the corners in.', action: 'fold' },
      { img: '/images/step-3.png', instruction: 'Fold up the bottom edges.', action: 'fold' },
      { img: '/images/boat-final.png', instruction: 'Pull the sides... and FLOAT!', action: 'finish' },
    ]
  },
  {
    id: 'fish',
    title: 'Origami Fish',
    color: 'bg-red-500',
    steps: [
      { img: '/images/step-1.png', instruction: 'Fold in half vertically.', action: 'fold' },
      { img: '/images/step-3.png', instruction: 'Fold wings down.', action: 'cut' },
      { img: '/images/fish-final.png', instruction: 'Ready to swim!', action: 'finish' },
    ]
  }
];

export default function CraftCorner({ onBack }: { onBack: () => void }) {
  const [selectedCraft, setSelectedCraft] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  
  const [decorations, setDecorations] = useState<{eyes: boolean, mouth: boolean}>({ eyes: false, mouth: false });

  const activeCraft = selectedCraft !== null ? crafts[selectedCraft] : null;

  const handleNextStep = () => {
    if (!activeCraft) return;

    // Play Sound
    if (activeCraft.steps[currentStep].action === 'cut') {
        new window.Audio('/sounds/scissor-snip.mp3').play().catch(() => {});
    } else {
        new window.Audio('/sounds/paper-fold.mp3').play().catch(() => {});
    }

    setIsAnimating(true);
    setTimeout(() => {
        setIsAnimating(false);
        if (currentStep < activeCraft.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsComplete(true);
            new window.Audio('/sounds/win.mp3').play().catch(() => {});
        }
    }, 600);
  };

  const toggleDecoration = (type: 'eyes' | 'mouth') => {
      new window.Audio('/sounds/pop.mp3').play().catch(() => {});
      setDecorations(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const reset = () => {
      setSelectedCraft(null);
      setCurrentStep(0);
      setIsComplete(false);
      setDecorations({ eyes: false, mouth: false });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fdf6e3]">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <Image src="/images/craft-table-bg.png" alt="Table" fill className="object-cover opacity-80" />
         <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <button onClick={selectedCraft === null ? onBack : reset} className="bg-white hover:bg-orange-50 text-slate-800 p-3 rounded-full shadow-lg transition transform hover:scale-105">
            <ArrowLeft />
         </button>
         
         <div className="bg-white/90 px-8 py-3 rounded-2xl shadow-xl rotate-1 border-2 border-orange-200">
             <h1 className="text-orange-500 font-black uppercase tracking-widest text-xl">
                 {activeCraft ? activeCraft.title : 'DIY Workshop'}
             </h1>
         </div>
         <div className="w-12" />
      </div>

      {selectedCraft === null ? (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl p-4">
              {crafts.map((craft, idx) => (
                  <button 
                    key={craft.id}
                    onClick={() => setSelectedCraft(idx)}
                    className="group relative bg-white rounded-3xl p-6 shadow-xl border-4 border-white hover:border-orange-300 transition-all hover:-translate-y-2 hover:rotate-1"
                  >
                      <div className={`absolute top-0 left-0 w-full h-4 ${craft.color} opacity-20`} />
                      <div className="relative h-48 w-full mb-4">
                          <Image src={craft.steps[craft.steps.length-1].img} alt={craft.title} fill className="object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase">{craft.title}</h2>
                      <p className="text-slate-500 font-bold text-sm">Tap to Build!</p>
                  </button>
              ))}
          </div>
      ) : (
          
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-2xl p-4">
              
              
              <div className="relative w-full aspect-square bg-white rounded-4xl shadow-2xl border-8 border-white p-8 mb-8 flex items-center justify-center overflow-hidden">
                  
                  
                  <div className={`relative w-full h-full transition-all duration-500 ${isAnimating ? 'scale-90 rotate-3 opacity-50 blur-sm' : 'scale-100'}`}>
                      <Image 
                        src={activeCraft?.steps[currentStep].img || ''} 
                        alt="Step" 
                        fill 
                        className="object-contain drop-shadow-xl" 
                      />
                      
                      
                      {isComplete && (
                          <div className="absolute inset-0 pointer-events-none animate-in fade-in">
                              {decorations.eyes && (
                                  <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-24 h-24">
                                      <Image src="/images/sticker-eyes.png" alt="Eyes" fill className="object-contain" />
                                  </div>
                              )}
                              {decorations.mouth && (
                                  <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-16 h-16">
                                      <Image src="/images/sticker-mouth.png" alt="Mouth" fill className="object-contain" />
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>

              
              <div className="bg-white/90 backdrop-blur px-8 py-4 rounded-xl shadow-lg mb-8 text-center max-w-md border-b-4 border-orange-200">
                  <p className="text-xl font-bold text-slate-700">
                      {isComplete ? "Bring it to life!" : activeCraft?.steps[currentStep].instruction}
                  </p>
                  
                  
                  {isComplete && (
                      <div className="flex gap-4 justify-center mt-4">
                          <button 
                            onClick={() => toggleDecoration('eyes')} 
                            className={`p-3 rounded-full border-2 transition-all ${decorations.eyes ? 'bg-orange-100 border-orange-400 scale-110' : 'bg-white border-slate-200'}`}
                          >
                             <div className="relative w-8 h-8">
                                <Image src="/images/sticker-eyes.png" alt="Eyes" fill className="object-contain" />
                             </div>
                          </button>
                          <button 
                            onClick={() => toggleDecoration('mouth')}
                            className={`p-3 rounded-full border-2 transition-all ${decorations.mouth ? 'bg-orange-100 border-orange-400 scale-110' : 'bg-white border-slate-200'}`}
                          >
                              <div className="relative w-8 h-8">
                                <Image src="/images/sticker-mouth.png" alt="Mouth" fill className="object-contain" />
                             </div>
                          </button>
                      </div>
                  )}
              </div>

              {/* ACTION BUTTON */}
              {!isComplete ? (
                  <button 
                    onClick={handleNextStep}
                    disabled={isAnimating}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full font-black text-2xl shadow-xl transition-transform active:scale-95 flex items-center gap-3"
                  >
                      {activeCraft?.steps[currentStep].action === 'cut' ? <Scissors className="animate-pulse" /> : <RotateCw />}
                      {activeCraft?.steps[currentStep].action === 'cut' ? 'SNIP!' : 'FOLD IT!'}
                  </button>
              ) : (
                  <button 
                    onClick={reset}
                    className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full font-black text-2xl shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
                  >
                      <Sparkles /> Done
                  </button>
              )}

          </div>
      )}

    </div>
  );
}