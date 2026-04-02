'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, X, Settings, Info } from 'lucide-react';


export const HTW_DATA = [
  {
    id: 'car',
    title: 'Inside a Car',
    icon: '/images/htw-car.png', 
    color: 'bg-red-500',
    description: 'A car is like a giant metal horse! It uses controlled explosions in the engine to push itself forward.',
    parts: [
      { name: 'The Engine', detail: 'The heart of the car. It mixes fuel and air to create power.' },
      { name: 'Transmission', detail: 'The gears! It helps the car change speeds, like riding a bike.' },
      { name: 'Brakes', detail: 'Friction pads that squeeze the wheels to safely stop the car.' }
    ]
  },
  {
    id: 'computer',
    title: 'Computers & Internet',
    icon: '/images/htw-computers.png',
    color: 'bg-blue-500',
    description: 'Computers process billions of tiny electrical signals (1s and 0s) every second to play games, show videos, and do math!',
    parts: [
      { name: 'CPU (The Brain)', detail: 'The boss of the computer that does all the thinking and calculating.' },
      { name: 'Memory (RAM)', detail: 'The computer’s short-term memory for things it is working on right now.' },
      { name: 'The Internet', detail: 'A giant web of underwater cables connecting all computers globally!' }
    ]
  },
  {
    id: 'machines',
    title: 'Everyday Machines',
    icon: '/images/htw-machines.png',
    color: 'bg-green-500',
    description: 'Even the simplest things are machines! They are designed to make pushing, pulling, and lifting much easier.',
    parts: [
      { name: 'Levers', detail: 'Like a seesaw! Pushing down on one end makes the other end go up.' },
      { name: 'Pulleys', detail: 'A wheel with a rope. Pulling down lifts a heavy object up (like an elevator).' },
      { name: 'Gears', detail: 'Wheels with teeth that lock together to turn things (like inside a clock).' }
    ]
  },
  {
    id: 'flight',
    title: 'Flight & Planes',
    icon: '/images/htw-plane.png',
    color: 'bg-sky-500',
    description: 'How does a heavy metal tube fly? It’s all about the shape of the wings pushing the air down!',
    parts: [
      { name: 'Lift', detail: 'The wings are curved on top so air moves faster, pulling the plane up into the sky.' },
      { name: 'Thrust', detail: 'Giant jet engines push the plane forward super fast.' },
      { name: 'Aerodynamics', detail: 'A smooth shape so the plane slices through the wind without slowing down.' }
    ]
  },
  {
    id: 'water',
    title: 'Water & Pipes',
    icon: '/images/htw-water.png',
    color: 'bg-cyan-500',
    description: 'The journey of water from a river or lake, through giant filters, right to the tap in your house.',
    parts: [
      { name: 'Treatment Plant', detail: 'Giant pools where dirt and germs are cleaned out of the water.' },
      { name: 'Water Towers', detail: 'Tall towers that hold water up high so gravity can push it down into your pipes.' },
      { name: 'The Drain', detail: 'Used water travels to a wastewater plant to be cleaned before going back to nature.' }
    ]
  },
  {
    id: 'movies',
    title: 'How Movies are Made',
    icon: '/images/htw-movie.png',
    color: 'bg-purple-500',
    description: 'Movie magic is a mix of acting, super-fast pictures, and computers making things that aren’t really there!',
    parts: [
      { name: 'The Camera', detail: 'Records 24 pictures every single second. When played fast, it looks like movement!' },
      { name: 'Green Screen', detail: 'Actors pretend in front of a green wall. Computers later replace the green with space or monsters.' },
      { name: 'Editing', detail: 'Cutting all the best video clips together like a puzzle to tell the story.' }
    ]
  },
  {
    id: 'electricity',
    title: 'Electricity & Power',
    icon: '/images/htw-electricity.png',
    color: 'bg-yellow-500',
    description: 'Invisible energy made of tiny electrons moving through wires at the speed of light to power our world.',
    parts: [
      { name: 'Power Plants', detail: 'Giant spinning magnets (generators) pushed by wind, water, or steam to make electricity.' },
      { name: 'Transformers', detail: 'Machines on power poles that lower the electricity’s power so it is safe for your house.' },
      { name: 'Circuits', detail: 'A loop! Electricity only flows if it has a full circle to travel through.' }
    ]
  }
];


export default function HowThingsWork({ startItem, onBack }: { startItem?: string | null, onBack: () => void }) {
  const [selectedTopic, setSelectedTopic] = useState<typeof HTW_DATA[0] | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSoundRef.current = new Audio('/sounds/pop.mp3');
  }, []);

  const playPop = () => popSoundRef.current?.play().catch(() => {});

  // Handle direct opening from the homepage menu
  useEffect(() => {
    if (startItem) {
        const found = HTW_DATA.find(t => t.title === startItem);
        if (found) setSelectedTopic(found);
    }
  }, [startItem]);

  const handleSelect = (topic: typeof HTW_DATA[0]) => {
    playPop();
    setSelectedTopic(topic);
  };

  const handleClose = () => {
    playPop();
    setSelectedTopic(null);
  };

  return (
    <div className="fixed inset-0 z-100 bg-slate-900 font-sans select-none overflow-hidden">
        
        {/* Blueprint Background Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }} 
        />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
            <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition shadow-xl border border-white/20">
                <ArrowLeft size={28} />
            </button>
            <div className="bg-red-600 px-8 py-3 rounded-lg shadow-2xl border-2 border-red-400">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider uppercase drop-shadow-sm flex items-center gap-2">
                    <Settings className="animate-spin-slow" /> Discovery Lab
                </h1>
            </div>
            <div className="w-12" />
        </div>

        {/* Grid Container */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pt-24 pb-10 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl px-6 w-full">
                {HTW_DATA.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => handleSelect(topic)}
                        className={`group relative overflow-hidden rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-${topic.color.split('-')[1]}-500 p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                    >
                        {/* Glowing Accent Line */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${topic.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="flex items-center gap-4 mb-4">
                            {/* NEW: Custom PNG Icon for Grid */}
                            <div className={`w-16 h-16 rounded-xl ${topic.color} bg-opacity-20 flex items-center justify-center relative`}>
                                <Image src={topic.icon} alt={topic.title} fill className="object-contain p-2 drop-shadow-md transition-transform group-hover:scale-110" />
                            </div>
                            <h2 className="text-xl font-black text-white">{topic.title}</h2>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2">Click to discover how it works!</p>
                    </button>
                ))}
            </div>
        </div>

        {/* Detail Modal */}
        {selectedTopic && (
            <div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="relative w-full max-w-3xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-10 flex flex-col md:flex-row max-h-[90vh]">
                    
                    {/* Left Panel (Visual/Title) */}
                    <div className={`w-full md:w-2/5 ${selectedTopic.color} p-8 flex flex-col items-center justify-center text-center relative`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest relative z-10 mb-6 drop-shadow-md">
                            {selectedTopic.title}
                        </h2>
                        
                        {/* NEW: Custom PNG Icon for Modal */}
                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center relative z-10 border-4 border-white/30 backdrop-blur-sm">
                            <Image src={selectedTopic.icon} alt={selectedTopic.title} fill className="object-contain p-4 drop-shadow-2xl animate-in zoom-in duration-500" />
                        </div>
                        
                        <button onClick={handleClose} className="absolute top-4 left-4 md:hidden bg-black/20 text-white p-2 rounded-full z-20">
                            <X />
                        </button>
                    </div>

                    {/* Right Panel (Details) */}
                    <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto bg-slate-900">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-slate-300 flex items-center gap-2">
                                <Info className="text-slate-500" size={20} /> How It Works
                            </h3>
                            <button onClick={handleClose} className="hidden md:block text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <p className="text-lg text-white mb-8 leading-relaxed">
                            {selectedTopic.description}
                        </p>

                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Key Parts</h4>
                            {selectedTopic.parts.map((part, idx) => (
                                <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <span className={`font-bold text-${selectedTopic.color.split('-')[1]}-400 block mb-1`}>
                                        {part.name}
                                    </span>
                                    <span className="text-slate-300 text-sm">
                                        {part.detail}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        <style jsx global>{`
            @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        `}</style>
    </div>
  );
}