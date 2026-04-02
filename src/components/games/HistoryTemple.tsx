'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, X, Sparkles } from 'lucide-react';

export const HISTORY_ITEMS = [
  { id: 'ben-franklin', label: 'Benjamin Franklin', icon: '/images/icon-kite-gold.png' },
  { id: 'einstein', label: 'Albert Einstein', icon: '/images/icon-atom-gold.png' },
  { id: 'ancient-civ', label: 'Ancient Civilizations', icon: '/images/icon-pyramid-gold.png' },
  { id: 'inventions', label: 'Great Inventions', icon: '/images/icon-bulb-gold.png' },
  { id: 'events', label: 'Historical Events', icon: '/images/icon-calendar-gold.png' },
  { id: 'explorers', label: 'Explorers', icon: '/images/icon-map-gold.png' },
  { id: 'timeline', label: 'History Through Time', icon: '/images/icon-hourglass-gold.png' },
];

const STORY_DATA: Record<string, any> = {
  'ben-franklin': {
    name: 'Benjamin Franklin',
    year: '1752',
    bg: '/images/bg-franklin-lab.png', 
    character: '/images/char-franklin.png', 
    restoreObject: '/images/icon-kite-gold.png', 
    restoreMessage: 'Tap the Kite to discover Electricity!',
    color: 'bg-amber-500',
    hotspots: [
        { id: 'h1', x: 20, y: 30, icon: '/images/icon-kite-gold.png', label: 'The Experiment', title: 'Lightning is Electricity!', text: 'Ben flew a kite in a thunderstorm with a key attached. When lightning struck, sparks flew from the key! He proved nature has power.' },
        { id: 'h2', x: 80, y: 40, icon: '/images/icon-bulb-gold.png', label: 'Inventions', title: 'The Franklin Stove', text: 'He invented a metal-lined fireplace that stood in the middle of the room. It gave off more heat and less smoke!' },
        { id: 'h3', x: 50, y: 60, icon: '/images/icon-map-gold.png', label: 'The Writer', title: 'Poor Richard’s Almanack', text: 'Ben was a famous writer. He wrote wise sayings like "Early to bed and early to rise, makes a man healthy, wealthy, and wise."' }
    ]
  },
  'einstein': {
    name: 'Albert Einstein',
    year: '1905',
    bg: '/images/bg-einstein-classroom.png', 
    character: '/images/char-einstein.png',
    restoreObject: '/images/icon-atom-gold.png',
    restoreMessage: 'Tap the Atom to unlock Genius!',
    color: 'bg-purple-600',
    hotspots: [
        { id: 'h1', x: 30, y: 40, icon: '/images/icon-atom-gold.png', label: 'E = mc²', title: 'The Big Equation', text: 'This is the most famous math equation ever! It explains that energy (E) and mass (m) are actually the same thing.' },
        { id: 'h2', x: 70, y: 30, icon: '/images/icon-bulb-gold.png', label: 'Nobel Prize', title: 'A True Genius', text: 'Einstein won the Nobel Prize in Physics. His brain was so different that scientists studied it after he died!' }
    ]
  },
  'ancient-civ': {
    name: 'Ancient Egypt',
    year: '2500 BC',
    bg: '/images/bg-egypt-desert.png', 
    character: '/images/char-pharaoh.png',
    restoreObject: '/images/icon-pyramid-gold.png',
    restoreMessage: 'Restore the Pyramids!',
    color: 'bg-yellow-600',
    hotspots: [
        { id: 'h1', x: 50, y: 30, icon: '/images/icon-pyramid-gold.png', label: 'The Great Pyramid', title: 'Built by Hand', text: 'The Great Pyramid of Giza was the tallest man-made structure for 3,800 years! It was built as a giant tomb for the Pharaoh.' },
        { id: 'h2', x: 20, y: 60, icon: '/images/icon-sphinx.png', label: 'The Sphinx', title: 'The Guardian', text: 'This giant statue has the body of a lion and the head of a human. It guards the pyramids from evil spirits.' }
    ]
  },
  'inventions': {
    name: 'The Age of Invention',
    year: '1879',
    bg: '/images/bg-steampunk-lab.png',
    character: '/images/char-edison.png',
    restoreObject: '/images/icon-bulb-gold.png',
    restoreMessage: 'Turn on the Lights!',
    color: 'bg-blue-600',
    hotspots: [
        { id: 'h1', x: 40, y: 40, icon: '/images/icon-bulb-gold.png', label: 'Light Bulb', title: 'Let There Be Light', text: 'Thomas Edison failed 1,000 times before he made a light bulb that worked. He said "I just found 1,000 ways that wont work!"' },
        { id: 'h2', x: 75, y: 55, icon: '/images/icon-phonograph.png', label: 'Phonograph', title: 'Recorded Sound', text: 'Before Edison, you could not record music. He invented the phonograph, which could play back sound from a cylinder!' }
    ]
  },
  'events': {
    name: 'Moon Landing',
    year: '1969',
    bg: '/images/bg-moon-surface.png',
    character: '/images/char-astronaut.png',
    restoreObject: '/images/icon-calendar-gold.png', 
    restoreMessage: 'Launch the Rocket!',
    color: 'bg-slate-700',
    hotspots: [
        { id: 'h1', x: 30, y: 30, icon: '/images/icon-flag-us.png', label: 'The Flag', title: 'One Small Step', text: 'Neil Armstrong was the first human to walk on the moon. He said: "That is one small step for man, one giant leap for mankind."' },
        { id: 'h2', x: 70, y: 50, icon: '/images/icon-rocket.png', label: 'The Rocket', title: 'Apollo 11', text: 'The Saturn V rocket that took them to the moon is still the most powerful rocket ever successfully flown!' }
    ]
  },
  'explorers': {
    name: 'Age of Exploration',
    year: '1492',
    bg: '/images/bg-ocean-ship.png',
    character: '/images/char-captain.png',
    restoreObject: '/images/icon-map-gold.png',
    restoreMessage: 'Set Sail!',
    color: 'bg-green-700',
    hotspots: [
        { id: 'h1', x: 50, y: 50, icon: '/images/icon-compass.png', label: 'The Compass', title: 'Finding the Way', text: 'Sailors used the stars and a magnetic compass to find their way across the giant ocean without getting lost.' },
        { id: 'h2', x: 80, y: 30, icon: '/images/icon-anchor.png', label: 'New Worlds', title: 'Dangerous Journeys', text: 'Trips could take months! Sailors had to be brave because they faced huge storms and ran out of food.' }
    ]
  },
  'timeline': {
    name: 'The Time Vortex',
    year: 'Infinity',
    bg: '/images/bg-time-vortex.png',
    character: '/images/char-time-traveler.png',
    restoreObject: '/images/icon-hourglass-gold.png',
    restoreMessage: 'Unfreeze Time!',
    color: 'bg-indigo-600',
    hotspots: [
        { id: 'h1', x: 30, y: 50, icon: '/images/icon-dino.png', label: 'The Past', title: 'Dinosaurs', text: 'Millions of years ago, giant reptiles ruled the earth. We study their fossils to learn about history!' },
        { id: 'h2', x: 70, y: 50, icon: '/images/icon-robot.png', label: 'The Future', title: 'Robots & AI', text: 'History is not just the past. Every decision you make today creates the history of tomorrow!' }
    ]
  }
};

export default function HistoryTemple({ startItem, onBack }: { startItem?: string | null, onBack: () => void }) {
  const [view, setView] = useState<'menu' | 'glitch' | 'hub'>('menu');
  const [isWarping, setIsWarping] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<any>(null);

  // Audio Refs
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const warpSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (startItem) {
        const found = HISTORY_ITEMS.find(item => item.label === startItem);
        if (found) {
            handleSelect(found.id);
        }
    }
  }, [startItem]);

  // Audio
  useEffect(() => {
    ambienceRef.current = new Audio('/sounds/ambience-jungle.mp3');
    ambienceRef.current.loop = true;
    ambienceRef.current.volume = 0.4;
    ambienceRef.current.play().catch(() => {});

    popSoundRef.current = new Audio('/sounds/pop.mp3');
    warpSoundRef.current = new Audio('/sounds/win2.mp3'); 

    return () => {
      if (ambienceRef.current) ambienceRef.current.pause();
    };
  }, []);

  const handleSelect = (id: string) => {
    if (isWarping) return;
    setSelectedId(id);
    
    if (popSoundRef.current) {
        popSoundRef.current.currentTime = 0;
        popSoundRef.current.play().catch(() => {});
    }

    setTimeout(() => {
        setIsWarping(true);
        if (warpSoundRef.current) warpSoundRef.current.play().catch(() => {});
        
        setTimeout(() => {
            setIsWarping(false);
            setView('glitch');
        }, 3000); 
    }, 300); 
  };

  const handleHotspotClick = (spot: any) => {
      setActiveHotspot(spot);
      if (popSoundRef.current) {
          popSoundRef.current.currentTime = 0;
          popSoundRef.current.play().catch(() => {});
      }
  };

  const handleBackToMenu = () => {
      setView('menu');
      setSelectedId(null);
      setActiveHotspot(null);
  };

  const handleRestore = () => {
      new window.Audio('/sounds/tada.mp3').play().catch(() => {});
      setView('hub');
  };

  const currentStory = selectedId ? STORY_DATA[selectedId] : null;

  return (
    <div className="fixed inset-0 z-100 bg-black overflow-hidden font-sans select-none">
      {view === 'menu' && (
        <>
          <div className="absolute inset-0 z-0">
            {/* MP4 Video Background */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              >
                <source src="/videos/bg-jungle-temple.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80" />
            </div>

            {/* Torches */}
            <div className="absolute top-1/4 left-10 w-24 h-48 opacity-80 mix-blend-screen pointer-events-none">
              <Image src="/images/torch-fire.gif" alt="Fire" fill className="object-contain" unoptimized />
            </div>
            <div className="absolute top-1/4 right-10 w-24 h-48 opacity-80 mix-blend-screen pointer-events-none">
              <Image src="/images/torch-fire.gif" alt="Fire" fill className="object-contain" unoptimized />
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
              <button onClick={onBack} className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full border-2 border-amber-600/50 backdrop-blur-md transition transform hover:scale-110">
                <ArrowLeft />
              </button>
              <div className="bg-black/60 px-10 py-3 rounded-xl border-2 border-amber-600 shadow-2xl backdrop-blur-md">
                <h1 className="text-amber-500 font-black uppercase tracking-[0.2em] text-xl drop-shadow-md">Temple of Time</h1>
              </div>
              <div className="w-12"/>
            </div>

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vh] md:h-[60vh] transition-all duration-1000 ${isWarping ? 'scale-150 brightness-150' : 'scale-100'}`}>
              <div className={`absolute inset-[10%] z-10 transition-opacity duration-500 ${isWarping ? 'opacity-100' : 'opacity-40'}`}>
                <Image src="/images/swirl1.png" alt="Swirl" fill className={`object-contain ${isWarping ? 'animate-spin-fast' : 'animate-spin-slow'}`} />
              </div>
            </div>

            {/* Menu Grid */}
            <div className={`absolute inset-0 z-40 flex items-center justify-center transition-all duration-500 ${isWarping ? 'opacity-0 scale-150 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <div className="flex flex-wrap justify-center gap-6 max-w-5xl px-4 pt-20">
                {HISTORY_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className="relative group w-36 h-36 md:w-44 md:h-44 flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 z-0">
                      <Image src="/images/stone-tablet.png" alt="Stone" fill className="object-contain drop-shadow-2xl" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full pb-6 px-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 relative mb-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <Image src={item.icon} alt={item.label} fill className="object-contain" />
                      </div>
                      <span className="text-amber-400 font-black text-[10px] md:text-xs uppercase tracking-wide leading-tight drop-shadow-lg text-center max-w-[80%]">
                        {item.label}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-amber-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                  </button>
                ))}
              </div>
            </div>

            {/* BLACK Flash Transition */}
            <div className={`absolute inset-0 z-200 bg-black pointer-events-none transition-opacity duration-300 ${isWarping ? 'animate-flash' : 'opacity-0'}`} />
          </div>
        </>
      )}

      {view === 'glitch' && currentStory && (
        <div className="absolute inset-0 z-150 bg-black">
          <div className="absolute inset-0 grayscale brightness-50">
            <Image src={currentStory.bg} alt="Scene" fill className="object-cover" />
          </div>

          <button onClick={handleBackToMenu} className="absolute top-6 right-6 bg-black/50 hover:bg-black text-white p-3 rounded-full z-200">
            <X />
          </button>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40 p-4">
            <h2 className="text-white font-black text-3xl md:text-5xl mb-8 animate-pulse text-center drop-shadow-lg">
              TIME IS FROZEN! <br/> <span className="text-amber-400 text-2xl md:text-3xl">{currentStory.restoreMessage}</span>
            </h2>

            <button onClick={handleRestore} className="relative w-40 h-40 animate-bounce cursor-pointer hover:scale-110 transition">
              <div className="absolute inset-0 bg-white/50 blur-xl rounded-full animate-pulse" />
              <Image src={currentStory.restoreObject} alt="Magic Object" fill className="object-contain" />
            </button>
          </div>
        </div>
      )}

      {view === 'hub' && currentStory && (
        <div className="absolute inset-0 z-150 bg-black">
          <div className="absolute inset-0 animate-in fade-in duration-1000">
            <Image src={currentStory.bg} alt="Scene" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Character */}
          <div className="absolute bottom-0 left-0 w-[40vw] h-[60vh] md:w-[30vw] md:h-[70vh] z-30 animate-in slide-in-from-left duration-1000 pointer-events-none">
            <Image src={currentStory.character} alt="Character" fill className="object-contain object-bottom drop-shadow-2xl" priority />
          </div>

          {/* Header */}
          <div className="absolute top-0 left-0 p-6 z-40">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl ${currentStory.color}`}>
              <h2 className="text-white font-black text-xl md:text-2xl uppercase tracking-widest">{currentStory.name}</h2>
              <span className="bg-black/30 text-white font-bold px-2 py-1 rounded text-sm">{currentStory.year}</span>
            </div>
          </div>

          <button onClick={handleBackToMenu} className="absolute top-6 right-6 bg-black/50 hover:bg-black text-white p-3 rounded-full z-200">
            <X />
          </button>

          {/* Hotspots */}
          {currentStory.hotspots.map((spot: any) => (
            <button
              key={spot.id}
              onClick={() => handleHotspotClick(spot)}
              className="absolute z-50 group hover:scale-110 transition-transform duration-300"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
              <div className={`relative w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-amber-400 rounded-full shadow-2xl flex items-center justify-center overflow-hidden ${activeHotspot?.id === spot.id ? 'scale-125 ring-4 ring-white' : ''}`}>
                <div className="w-10 h-10 relative">
                  <Image src={spot.icon} alt={spot.label} fill className="object-contain" />
                </div>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {spot.label}
              </div>
            </button>
          ))}

          {/* Fact Modal */}
          {activeHotspot && (
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 flex justify-center z-100 animate-in slide-in-from-bottom duration-500">
              <div className="bg-white/95 backdrop-blur-xl border-t-8 border-amber-500 rounded-3xl p-6 md:p-8 max-w-3xl shadow-2xl relative w-full ml-auto md:ml-[30vw]">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-amber-100 p-4 rounded-2xl shrink-0 hidden md:block">
                    <Sparkles size={40} className="text-amber-600 fill-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-2">{activeHotspot.label}</h3>
                    <h2 className="text-3xl font-black text-slate-800 mb-3">{activeHotspot.title}</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {activeHotspot.text}
                    </p>
                  </div>
                </div>

                <button onClick={() => setActiveHotspot(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
                  <X size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ANIMATIONS */}
      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes spin-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-fast { animation: spin-fast 0.5s linear infinite; }
        @keyframes flash { 0% { opacity: 0; } 80% { opacity: 1; } 100% { opacity: 0; } }
        .animate-flash { animation: flash 3s ease-in-out forwards; }
      `}</style>
    </div>
  );
}