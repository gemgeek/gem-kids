'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, XCircle, MapPin, Utensils, Heart, Volume2 } from 'lucide-react';
import { animalList as defaultList } from '../data/animalList'; 


type AnimalData = {
    name: string;
    scientific: string;
    desc: string;
    habitat: string;
    diet: string;
    lifespan: string;
    sound: string;
    funFact: string;
    image: string;
    bgImage?: string; 
    audio?: string;
}

interface AnimalBookProps {
  onBack: () => void;
  data?: AnimalData[]; 
  introTitle?: string; 
}

export default function AnimalBook({ onBack, data = defaultList, introTitle = "ENTERING THE WILD..." }: AnimalBookProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  
  const jungleSoundRef = useRef<HTMLAudioElement | null>(null);
  const animalSoundRef = useRef<HTMLAudioElement | null>(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
        setShowIntro(false);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    
    jungleSoundRef.current = new Audio('/sounds/jungle-ambient.mp3');
    jungleSoundRef.current.loop = true; 
    jungleSoundRef.current.volume = 0.2; 
    
    const playPromise = jungleSoundRef.current.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Audio play blocked:", error));
    }

    return () => {
        if (jungleSoundRef.current) {
            jungleSoundRef.current.pause();
            jungleSoundRef.current.currentTime = 0;
        }
    };
  }, []);

  
  const playAnimalSound = () => {
    const currentAnimal = data[currentIndex]; 
    
    if (currentAnimal.audio) {
        if (animalSoundRef.current) {
            animalSoundRef.current.pause();
            animalSoundRef.current.currentTime = 0;
        }
        animalSoundRef.current = new Audio(currentAnimal.audio);
        animalSoundRef.current.volume = 1.0; 
        animalSoundRef.current.play();
    }
  };

  const nextAnimal = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevAnimal = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const animal = data[currentIndex];

  
  if (showIntro) {
    return (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black animate-in fade-in duration-700">
            <div className="absolute inset-0 z-0">
                <Image src="/images/gif-bg.gif" alt="Intro" fill className="object-cover opacity-90" unoptimized />
            </div>
            <div className="relative z-10 flex flex-col items-center animate-pulse">
                <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-8 text-center leading-tight">
                    {introTitle}
                </h1>
                <div className="w-20 h-20 border-8 border-white/30 border-t-white rounded-full animate-spin backdrop-blur-sm" />
            </div>
        </div>
    )
  }

  
  return (
    <div className="w-full h-full flex items-center justify-center p-4 animate-in zoom-in-95 duration-500">
      
      <div className="relative w-full max-w-6xl h-150 bg-white rounded-3xl shadow-2xl overflow-hidden flex border-8 border-[#84CC16]">
        
        <button onClick={onBack} className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md">
            <XCircle size={32} />
        </button>

        
        <div className="w-1/2 relative flex items-end justify-center overflow-hidden pb-2">
             <div className="absolute inset-0 z-0">
                
                <Image 
                    src={animal.bgImage || "/images/forest-bg.png"} 
                    alt="Background" 
                    fill 
                    className="object-cover scale-110" 
                />
             </div>

             <div className="relative w-[85%] h-[65%] drop-shadow-2xl z-10 origin-bottom">
                <style jsx>{`
                    @keyframes breathe {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.03); }
                        100% { transform: scale(1); }
                    }
                `}</style>
                <div style={{ animation: 'breathe 4s ease-in-out infinite' }} className="w-full h-full relative">
                    <Image src={animal.image} alt={animal.name} fill className="object-contain" />
                </div>
             </div>
             
             <button onClick={prevAnimal} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white p-3 rounded-full shadow-lg z-20 backdrop-blur-sm transition-all border border-white/50 text-white hover:text-green-800">
                <ArrowLeft size={32} />
             </button>
        </div>

        
        <div className="w-1/2 p-12 flex flex-col justify-center bg-[#FDFCF0] relative"> 
            
            <button onClick={nextAnimal} className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-green-200 p-3 rounded-full shadow-lg z-10 transition-all">
                <ArrowRight size={32} />
            </button>

            <div className="space-y-6">
                <div>
                    <h1 className="text-6xl font-black text-gray-900 mb-2 tracking-tight leading-none">{animal.name}</h1>
                    <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">{animal.scientific}</p>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                    {animal.desc}
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <StatBox icon={<MapPin />} label="Habitat" value={animal.habitat} />
                    <StatBox icon={<Utensils />} label="Diet" value={animal.diet} />
                    <StatBox icon={<Heart />} label="Lifespan" value={animal.lifespan} />
                    
                    <div 
                        onClick={playAnimalSound} 
                        className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform cursor-pointer group hover:border-green-400 hover:bg-green-50"
                    >
                        <div className="text-green-600 group-hover:text-green-700 group-hover:animate-bounce"><Volume2 /></div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-gray-400">Sound</div>
                            <div className="font-bold text-gray-800 group-hover:text-green-700">{animal.sound}</div>
                        </div>
                    </div>
                </div>

                <div className="p-3 rounded-xl border-l-8 border-yellow-400 bg-yellow-50 shadow-sm">
                    <span className="text-xs font-bold uppercase text-gray-400">Did you know?</span>
                    <p className="text-md font-bold text-gray-800 italic">"{animal.funFact}"</p>
                </div>
            </div>

            <div className="absolute bottom-6 right-12 text-gray-400 font-bold font-mono">
                {currentIndex + 1} / {data.length}
            </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform">
            <div className="text-green-600">{icon}</div>
            <div>
                <div className="text-[10px] font-bold uppercase text-gray-400">{label}</div>
                <div className="font-bold text-gray-800 text-sm leading-tight">{value}</div>
            </div>
        </div>
    )
}