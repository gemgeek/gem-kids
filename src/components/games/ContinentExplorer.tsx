'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, MapPin, X, Plane, BookOpen, Info } from 'lucide-react';

// DATA 
const CONTINENT_DATA: Record<string, any> = {
  'Africa': {
    map: '/images/map-africa-illustrated.png',
    locations: [
      { 
        id: 'pyramids', 
        name: 'Great Pyramids', 
        x: 60, y: 15, 
        video: '/videos/place-pyramids.mp4',
        img: '/images/place-pyramids.png', 
        audio: '/sounds/ambience-wind.mp3', 
        weather: 'sun', 
        fact: 'These giant tombs were built over 4,500 years ago! They are guarded by the Sphinx.',
        country: 'Egypt 🇪🇬'
      },
      { 
        id: 'sahara', 
        name: 'Sahara Desert', 
        x: 35, y: 25,
        video: '/videos/place-sahara.mp4', 
        img: '/images/place-sahara.png',
        audio: '/sounds/ambience-wind.mp3', 
        weather: 'sun',
        fact: 'It is the hottest desert in the world and is as big as the entire United States!',
        country: 'Morocco / Mali 🇲🇦'
      },
      { 
        id: 'kilimanjaro', 
        name: 'Mt. Kilimanjaro', 
        x: 70, y: 55, 
        video: '/videos/place-kilimanjaro.mp4',
        img: '/images/place-kilimanjaro.png',
        audio: '/sounds/flight-loop.mp3', 
        weather: 'snow', 
        fact: 'The tallest mountain in Africa. It is so high that there is snow on top, even though it is near the equator!',
        country: 'Tanzania 🇹🇿'
      },
      { 
        id: 'victoria', 
        name: 'Victoria Falls', 
        x: 60, y: 75,
        video: '/videos/place-victoria-falls.mp4', 
        img: '/images/place-victoria-falls.png',
        audio: '/sounds/ambience-waterfall.mp3', 
        weather: 'rain', 
        fact: 'Locals call it "The Smoke That Thunders" because the water is so loud and creates a huge mist.',
        country: 'Zambia / Zimbabwe 🇿🇼'
      },
      { 
        id: 'table', 
        name: 'Table Mountain', 
        x: 50, y: 90,
        video: '/videos/place-table-mountain.mp4', 
        img: '/images/place-table-mountain.png',
        audio: '/sounds/jungle-ambient.mp3', 
        weather: 'clear',
        fact: 'This mountain is flat on top like a table! Clouds often cover it like a "tablecloth."',
        country: 'South Africa 🇿🇦'
      }
    ]
  },
  'Asia': {
    map: '/images/map-asia-illustrated.png',
    locations: [
      { 
        id: 'greatwall', 
        name: 'Great Wall of China', 
        x: 65, y: 35, 
        video: '/videos/place-great-wall.mp4',
        img: '/images/place-great-wall.png', 
        audio: '/sounds/ambience-wind.mp3',
        weather: 'clear',
        fact: 'It is so long that it stretches over 13,000 miles! It was built to protect the empire.',
        country: 'China 🇨🇳'
      },
      { 
        id: 'tajmahal', 
        name: 'Taj Mahal', 
        x: 45, y: 55, 
        video: '/videos/place-taj-mahal.mp4',
        img: '/images/place-taj-mahal.png', 
        audio: '/sounds/ambience-nature.mp3', 
        weather: 'sun',
        fact: 'This beautiful white palace was built by an emperor for his favorite wife. It changes color depending on the sun!',
        country: 'India 🇮🇳'
      },
      { 
        id: 'everest', 
        name: 'Mt. Everest', 
        x: 55, y: 45, 
        video: '/videos/place-everest.mp4',
        img: '/images/place-everest.png', 
        audio: '/sounds/flight-loop.mp3', 
        weather: 'snow', 
        fact: 'The highest point on Earth! It is so high that jets fly at the same level as the peak.',
        country: 'Nepal 🇳🇵'
      },
      { 
        id: 'sakura', 
        name: 'Cherry Blossoms', 
        x: 85, y: 35, 
        video: '/videos/place-japan-sakura.mp4',
        img: '/images/place-japan-sakura.png', 
        audio: '/sounds/ambience-nature.mp3',
        weather: 'sparkle', 
        fact: 'In spring, millions of pink flowers bloom across the country. People have picnics under the trees!',
        country: 'Japan 🇯🇵'
      },
      { 
        id: 'angkor', 
        name: 'Angkor Wat', 
        x: 70, y: 65, 
        video: '/videos/place-angkor-wat.mp4',
        img: '/images/place-angkor-wat.png', 
        audio: '/sounds/ambience-nature.mp3', 
        weather: 'clear',
        fact: 'The largest religious monument in the world! Giant tree roots have grown over the ancient stone walls.',
        country: 'Cambodia 🇰🇭'
      }
    ]
  },
  'Europe': {
    map: '/images/map-europe-illustrated.png',
    locations: [
      { 
        id: 'northernlights', 
        name: 'Northern Lights', 
        x: 25, y: 10, 
        video: '/videos/place-northern-lights.mp4',
        img: '/images/place-northern-lights.png', 
        audio: '/sounds/ambience-magic.mp3', 
        weather: 'sparkle', 
        fact: 'These dancing lights in the sky are natural magic! They happen when particles from the sun hit our atmosphere.',
        country: 'Iceland 🇮🇸'
      },
      { 
        id: 'bigben', 
        name: 'Big Ben', 
        x: 30, y: 45, 
        video: '/videos/place-big-ben.mp4',
        img: '/images/place-big-ben.png', 
        audio: '/sounds/ambience-clock.mp3', 
        weather: 'rain', 
        fact: 'Big Ben is actually the name of the giant bell inside the tower, not the tower itself!',
        country: 'United Kingdom 🇬🇧'
      },
      { 
        id: 'eiffel', 
        name: 'Eiffel Tower', 
        x: 40, y: 55, 
        video: '/videos/place-eiffel-tower.mp4',
        img: '/images/place-eiffel-tower.png', 
        audio: '/sounds/ambience-city.mp3', 
        weather: 'clear',
        fact: 'It was built for a World Fair and was supposed to be taken down after 20 years. Now it is the symbol of France!',
        country: 'France 🇫🇷'
      },
      { 
        id: 'colosseum', 
        name: 'The Colosseum', 
        x: 55, y: 65, 
        video: '/videos/place-colosseum.mp4',
        img: '/images/place-colosseum.png', 
        audio: '/sounds/ambience-wind.mp3', 
        weather: 'sun',
        fact: 'This ancient stadium could hold 50,000 people! They watched gladiator battles and even mock sea battles here.',
        country: 'Italy 🇮🇹'
      },
      { 
        id: 'santorini', 
        name: 'Santorini', 
        x: 75, y: 80, 
        video: '/videos/place-santorini.mp4',
        img: '/images/place-santorini.png', 
        audio: '/sounds/ambience-ocean.mp3', 
        weather: 'sun',
        fact: 'This island is actually the rim of a sleeping volcano! The houses are painted white to stay cool in the sun.',
        country: 'Greece 🇬🇷'
      }
    ]
  }
};

export default function ContinentExplorer({ continentId, onBack }: { continentId: string, onBack: () => void }) {
  const data = CONTINENT_DATA[continentId];
  
  const [balloonPos, setBalloonPos] = useState({ x: 10, y: 80 }); 
  const [isFlying, setIsFlying] = useState(false);
  const [view, setView] = useState<'map' | 'destination'>('map');
  const [currentLoc, setCurrentLoc] = useState<any>(null);
  const [activeInfo, setActiveInfo] = useState<'location' | 'fact' | null>(null);

  const flightSoundRef = useRef<HTMLAudioElement | null>(null);
  const ambienceSoundRef = useRef<HTMLAudioElement | null>(null);

  // Flight Audio
  useEffect(() => {
    if (isFlying) {
        if (!flightSoundRef.current) {
            flightSoundRef.current = new Audio('/sounds/flight-loop.mp3');
            flightSoundRef.current.loop = true; 
            flightSoundRef.current.volume = 0.5;
        }
        flightSoundRef.current.play().catch(() => {});
    } else {
        if (flightSoundRef.current) {
            flightSoundRef.current.pause();
            flightSoundRef.current.currentTime = 0;
        }
    }
  }, [isFlying]);

  // Destination Audio
  useEffect(() => {
      if (ambienceSoundRef.current) {
          ambienceSoundRef.current.pause();
          ambienceSoundRef.current = null;
      }

      if (view === 'destination' && currentLoc) {
          const landingSound = new Audio('/sounds/landing.mp3');
          landingSound.volume = 0.6;
          landingSound.play().catch(() => {});

          if (currentLoc.audio) {
              const ambience = new Audio(currentLoc.audio);
              ambience.loop = true; 
              ambience.volume = 0.4; 
              ambience.play().catch(() => {});
              ambienceSoundRef.current = ambience; 
          }
      }

      return () => {
          if (ambienceSoundRef.current) ambienceSoundRef.current.pause();
      };
  }, [view, currentLoc]);


  const travelTo = (loc: any) => {
    setIsFlying(true);
    setBalloonPos({ x: loc.x, y: loc.y });
    setActiveInfo(null);

    setTimeout(() => {
        setIsFlying(false);
        setCurrentLoc(loc);
        setView('destination'); 
    }, 3000); 
  };

  const closeDestination = () => {
      setView('map');
      setActiveInfo(null); 
      setTimeout(() => setCurrentLoc(null), 500); 
  };

  const toggleInfo = (type: 'location' | 'fact') => {
      if (activeInfo === type) {
          setActiveInfo(null); 
      } else {
          setActiveInfo(type);
          new window.Audio('/sounds/pop.mp3').play().catch(() => {});
      }
  };

  if (!data) return <div className="text-white p-10">Data not found for {continentId}</div>;

  return (
    <div className="fixed inset-0 z-100 bg-sky-300 overflow-hidden font-sans">
      
      {/* MAP VIEW */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${view === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0">
             <Image src={data.map} alt="Map" fill className="object-cover" priority />
          </div>

          <div className="absolute inset-0 pointer-events-none z-10 opacity-60">
             <div className="absolute top-[10%] left-[-20%] w-64 animate-float-slow"><Image src="/images/cloud.png" alt="cloud" width={300} height={150}/></div>
             <div className="absolute top-[40%] right-[-20%] w-48 animate-float-slower"><Image src="/images/cloud.png" alt="cloud" width={200} height={100}/></div>
          </div>

          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
             <button onClick={onBack} className="bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-xl transition transform hover:scale-110">
                <ArrowLeft />
             </button>
             <div className="bg-white/90 px-8 py-3 rounded-full shadow-2xl border-2 border-white backdrop-blur-md">
                 <h1 className="text-slate-800 font-black uppercase tracking-widest text-lg">
                     {continentId} Adventure
                 </h1>
             </div>
             <div className="w-12"/>
          </div>

          <div className="absolute top-1/4 right-6 flex flex-col gap-4 z-40">
              {data.locations.map((loc: any) => (
                  <button
                    key={loc.id}
                    onClick={() => travelTo(loc)}
                    disabled={isFlying}
                    className="group flex items-center gap-3 bg-white/90 hover:bg-yellow-400 text-slate-800 px-6 py-4 rounded-full shadow-xl transition-all transform hover:scale-105 hover:-translate-x-2"
                  >
                      <MapPin size={20} className="text-orange-500 group-hover:text-white" />
                      <span className="font-bold">{loc.name}</span>
                  </button>
              ))}
          </div>

          <div 
            className="absolute z-30 transition-all ease-in-out duration-3000"
            style={{ left: `${balloonPos.x}%`, top: `${balloonPos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
              <div className={`relative w-32 h-40 md:w-48 md:h-60 drop-shadow-2xl ${isFlying ? 'animate-bounce-gentle' : ''}`}>
                  <Image src="/images/hot-air-balloon.png" alt="Balloon" fill className="object-contain" />
              </div>
          </div>
      </div>
      
      {/* DESTINATION VIEW */}
      {currentLoc && (
          <div className={`absolute inset-0 z-200 bg-black transition-opacity duration-1000 ${view === 'destination' ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* VIDEO BACKGROUND */}
              <div className="absolute inset-0 overflow-hidden">
                  {currentLoc.video ? (
                      <video 
                        autoPlay loop muted playsInline 
                        poster={currentLoc.img} 
                        className="w-full h-full object-cover opacity-90"
                      >
                          <source src={currentLoc.video} type="video/mp4" />
                      </video>
                  ) : (
                      <div className="w-full h-full animate-slow-zoom">
                          <Image src={currentLoc.img} alt={currentLoc.name} fill className="object-cover opacity-90" />
                      </div>
                  )}
                  
                  {/* WOW FEATURE: WEATHER EFFECTS */}
                  {currentLoc.weather === 'snow' && (
                      <div className="absolute inset-0 pointer-events-none animate-snow opacity-80" />
                  )}
                  {currentLoc.weather === 'rain' && (
                      <div className="absolute inset-0 pointer-events-none animate-rain opacity-50" />
                  )}
                  {currentLoc.weather === 'sparkle' && (
                      <div className="absolute inset-0 pointer-events-none animate-sparkle" />
                  )}
                  {currentLoc.weather === 'sun' && (
                      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/20 blur-[100px] pointer-events-none animate-pulse" />
                  )}
                  {/* ================================== */}

                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
              </div>

              <div className="absolute top-10 right-10 w-24 h-32 md:w-32 md:h-48 animate-bounce-gentle opacity-90 z-10">
                   <Image src="/images/hot-air-balloon.png" alt="Balloon" fill className="object-contain" />
              </div>

              {/* CARD A: LOCATION */}
              {activeInfo === 'location' && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300 z-50 text-center border-4 border-yellow-400">
                       <div className="text-6xl mb-4">📍</div>
                       <h2 className="text-3xl font-black text-slate-800 mb-2">{currentLoc.name}</h2>
                       <div className="inline-block bg-slate-100 px-4 py-2 rounded-full">
                           <span className="text-lg font-bold text-slate-600">{currentLoc.country}</span>
                       </div>
                       <p className="mt-4 text-slate-500 text-sm">(Tap button again to close)</p>
                   </div>
              )}

              {/* CARD B: FACT */}
              {activeInfo === 'fact' && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300 z-50 border-4 border-blue-400">
                       <div className="flex items-start gap-4">
                           <div className="bg-blue-100 p-3 rounded-full shrink-0">
                               <BookOpen size={32} className="text-blue-600" />
                           </div>
                           <div>
                               <h3 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-2">Explorer's Notes</h3>
                               <p className="text-2xl font-medium text-slate-800 leading-relaxed">"{currentLoc.fact}"</p>
                           </div>
                       </div>
                   </div>
              )}
              
              {/* HUD */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-end gap-4 md:gap-8 px-4 z-60">
                  <button onClick={() => toggleInfo('location')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeInfo === 'location' ? 'scale-110 -translate-y-2' : 'hover:scale-105 opacity-90'}`}>
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl border-4 ${activeInfo === 'location' ? 'bg-yellow-400 border-white text-black' : 'bg-white/20 border-white/50 backdrop-blur-md text-white'}`}>
                          <MapPin size={32} fill={activeInfo === 'location' ? 'currentColor' : 'none'} />
                      </div>
                      <span className="text-white font-bold text-sm shadow-black drop-shadow-md">Location</span>
                  </button>

                  <button onClick={() => toggleInfo('fact')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeInfo === 'fact' ? 'scale-110 -translate-y-2' : 'hover:scale-105 opacity-90'}`}>
                      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-xl border-4 ${activeInfo === 'fact' ? 'bg-blue-500 border-white text-white' : 'bg-white/20 border-white/50 backdrop-blur-md text-white'}`}>
                          <Info size={40} />
                      </div>
                      <span className="text-white font-bold text-sm shadow-black drop-shadow-md">Learn More</span>
                  </button>

                  <button onClick={closeDestination} className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 opacity-90 group">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl border-4 bg-red-500 border-white text-white group-hover:bg-red-600">
                          <Plane size={32} className="transform -rotate-45" />
                      </div>
                      <span className="text-white font-bold text-sm shadow-black drop-shadow-md">Fly Away</span>
                  </button>
              </div>

              <button onClick={closeDestination} className="absolute top-6 right-6 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition backdrop-blur-md">
                  <X size={24} />
              </button>
          </div>
      )}

      {/* ANIMATIONS */}
      <style jsx global>{`
          @keyframes float-slow { 0% { transform: translateX(0px); } 100% { transform: translateX(100vw); } }
          .animate-float-slow { animation: float-slow 60s linear infinite; }
          .animate-float-slower { animation: float-slow 90s linear infinite; }
          
          @keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }

          @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
          .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite alternate; }

          /* WEATHER ANIMATIONS */
          @keyframes snowfall { from { background-position: 0 0; } to { background-position: 100px 500px; } }
          .animate-snow {
             background-image: radial-gradient(white 2px, transparent 3px);
             background-size: 50px 50px;
             animation: snowfall 5s linear infinite;
          }

          @keyframes rainfall { from { background-position: 0 0; } to { background-position: 20px 100px; } }
          .animate-rain {
             background-image: linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 20px);
             background-size: 20px 40px;
             animation: rainfall 0.5s linear infinite;
          }

          @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
          .animate-sparkle {
              background-image: radial-gradient(white 1px, transparent 2px);
              background-size: 80px 80px;
              animation: twinkle 3s ease-in-out infinite;
          }
      `}</style>

    </div>
  );
}