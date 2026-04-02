'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, X, GraduationCap, Lightbulb, BookOpen } from 'lucide-react';

export const CAREERS_DATA = [
  {
    id: 'doctors',
    title: 'Doctors & Healthcare',
    image: '/images/char-doctor.png',
    color: 'bg-blue-500',
    description: 'Healthcare heroes keep our bodies strong! They fix broken bones, cure diseases, and help babies enter the world safely.',
    path: 'Biology, Chemistry, Math',
    funFact: 'Your heart beats about 100,000 times every single day to pump blood around your body!'
  },
  {
    id: 'engineers',
    title: 'Engineers & Builders',
    image: '/images/char-engineer.png',
    color: 'bg-orange-500',
    description: 'Engineers turn ideas into reality. They design skyscrapers, build bridges, create robots, and make sure our cities are safe.',
    path: 'Mathematics, Physics, Design',
    funFact: 'The Eiffel Tower actually grows about 6 inches taller in the summer because the heat expands the iron!'
  },
  {
    id: 'scientists',
    title: 'Scientists & Tech',
    image: '/images/char-scientist.png',
    color: 'bg-purple-500',
    description: 'Innovators who solve mysteries! From coding video games to finding cures or exploring space, they build the future.',
    path: 'Computer Science, Logic, Science',
    funFact: 'The first computer "bug" was an actual moth stuck inside a computer in 1947!'
  },
  {
    id: 'artists',
    title: 'Artists & Creators',
    image: '/images/char-artist.png',
    color: 'bg-pink-500',
    description: 'Creators bring imagination to life. They paint masterpieces, design clothes, animate movies, and write the songs we love.',
    path: 'Art, Music, History, Literature',
    funFact: 'The color "Blue" used to be more expensive than gold to create in ancient paintings!'
  },
  {
    id: 'community',
    title: 'Community Helpers',
    image: '/images/char-community.png',
    color: 'bg-green-500',
    description: 'The guardians of our society. Police, Firefighters, and Teachers work every day to keep us safe, smart, and happy.',
    path: 'Social Studies, Physical Education (PE)',
    funFact: 'Firefighters use "Wet Water"—they add a special soap to water to make it soak into burning wood faster!'
  },
  {
    id: 'chefs',
    title: 'Chefs & Bakers',
    image: '/images/char-chef.png',
    color: 'bg-yellow-500',
    description: 'Culinary artists who make food taste like magic. They run busy kitchens and bake huge wedding cakes.',
    path: 'Math (Measurements), Chemistry (Cooking)',
    funFact: 'A traditional Chef’s hat has 100 folds, representing the 100 different ways to cook an egg!'
  },
  {
    id: 'pilots',
    title: 'Pilots & Astronauts',
    image: '/images/char-pilot.png',
    color: 'bg-indigo-600',
    description: 'Explorers of the sky and stars. They fly huge jets across oceans or pilot rockets to the Moon and Mars.',
    path: 'Geography, Physics, Astronomy',
    funFact: 'Astronauts can grow up to 2 inches taller in space because there is no gravity pushing down on their spines!'
  }
];

export default function CareerGuide({ startItem, onBack }: { startItem?: string | null, onBack: () => void }) {
  const [selectedCareer, setSelectedCareer] = useState<typeof CAREERS_DATA[0] | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);

  // AUTO-OPEN LOGIC
  useEffect(() => {
    if (startItem) {
        const found = CAREERS_DATA.find(c => c.title === startItem);
        if (found) {
            handleSelect(found); 
        }
    }
  }, [startItem]);

  // AUDIO SETUP 
  useEffect(() => {
    popSoundRef.current = new Audio('/sounds/pop.mp3');
  }, []);

  const playSound = () => {
      if (popSoundRef.current) {
          popSoundRef.current.currentTime = 0;
          popSoundRef.current.play().catch(() => {});
      }
  };

  const handleSelect = (career: typeof CAREERS_DATA[0]) => {
    playSound(); 
    setSelectedCareer(career);
  };

  const handleClose = () => {
      playSound(); 
      setSelectedCareer(null);
  };

  return (
    <div className="fixed inset-0 z-100 bg-slate-900 overflow-hidden font-sans select-none">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/bg-career-library.jpg" alt="Library" fill className="object-cover opacity-40" priority />
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/50 via-slate-900/80 to-slate-900" />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50">
         <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition">
            <ArrowLeft />
         </button>
         <h1 className="text-xl md:text-3xl font-black text-white tracking-wider uppercase drop-shadow-lg text-center">
             Future Career Guide
         </h1>
         <div className="w-12" />
      </div>

      {/* GRID */}
      <div className="absolute inset-0 overflow-y-auto pt-24 pb-10 z-40">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {CAREERS_DATA.map((career) => (
                <button
                    key={career.id}
                    onClick={() => handleSelect(career)}
                    className="group relative h-64 w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300"
                >
                    <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${career.color}`} />
                    <div className="absolute top-4 left-0 right-0 h-40 flex items-center justify-center">
                        <div className="relative w-32 h-32 filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300">
                             <Image src={career.image} alt={career.title} fill className="object-contain" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-bold text-sm md:text-lg leading-tight text-center">
                            {career.title}
                        </h3>
                        <div className="w-full h-1 mt-2 rounded-full bg-white/20 overflow-hidden">
                             <div className={`h-full w-1/3 ${career.color}`} />
                        </div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedCareer && (
          <div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh]">
                  
                  {/* LEFT SIDE */}
                  <div className={`w-full md:w-1/3 ${selectedCareer.color} p-8 flex items-center justify-center relative overflow-hidden shrink-0`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative w-32 h-32 md:w-full md:h-full z-10">
                          <Image src={selectedCareer.image} alt={selectedCareer.title} fill className="object-contain drop-shadow-2xl" />
                      </div>
                      <button onClick={handleClose} className="absolute top-4 left-4 md:hidden bg-black/20 text-white p-2 rounded-full">
                          <X />
                      </button>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="w-full md:w-2/3 p-6 md:p-10 bg-white overflow-y-auto">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <h2 className={`text-2xl md:text-3xl font-black mb-1 uppercase tracking-wide text-transparent bg-clip-text bg-linear-to-r from-slate-800 to-slate-500`}>
                                  {selectedCareer.title}
                              </h2>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${selectedCareer.color}`}>
                                  Career File
                              </span>
                          </div>
                          <button onClick={handleClose} className="hidden md:block text-slate-400 hover:text-slate-800 bg-slate-100 p-2 rounded-full transition">
                              <X size={24} />
                          </button>
                      </div>

                      <div className="space-y-6">
                          <div className="flex gap-4">
                              <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                  <BookOpen size={20} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900 uppercase text-sm mb-1">The Mission</h4>
                                  <p className="text-slate-600 leading-relaxed text-lg">
                                      {selectedCareer.description}
                                  </p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                  <GraduationCap size={20} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900 uppercase text-sm mb-1">School Subjects</h4>
                                  <p className="text-slate-600 font-medium">
                                      {selectedCareer.path}
                                  </p>
                              </div>
                          </div>
                          <div className={`p-4 rounded-xl ${selectedCareer.color.replace('bg-', 'bg-opacity-10 bg-')} border-l-4 ${selectedCareer.color.replace('bg-', 'border-')}`}>
                               <div className="flex gap-3">
                                   <Lightbulb className={`shrink-0 ${selectedCareer.color.replace('bg-', 'text-')}`} />
                                   <div>
                                       <h4 className={`font-bold uppercase text-xs mb-1 ${selectedCareer.color.replace('bg-', 'text-')}`}>Did You Know?</h4>
                                       <p className="text-slate-700 italic font-medium">
                                           "{selectedCareer.funFact}"
                                       </p>
                                   </div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}