'use client';
import { useState, useEffect } from "react";
import Image from 'next/image';
import { Home, ArrowLeft, ArrowRight, Minimize, Maximize, X, Settings, Bookmark, Info, HelpCircle, Mail, Star } from 'lucide-react';
import MenuCard from '@/components/MenuCard';
import CategoryPopup from '@/components/CategoryPopup';
import { WindowBtn, NavCircleBtn } from '@/components/HeaderButtons';

// IMPORTS FOR CONTENT 
import AnimalBook from '@/components/AnimalBook';
import DragDropGame from '@/components/games/DragDropGame';
import Soundboard from '@/components/games/Soundboard'; 
import AnatomyBuilder from '@/components/games/AnatomyBuilder';
import ScienceLab from '@/components/games/ScienceLab';
import SimpleMachines from '@/components/games/SimpleMachines';
import Abacus from '@/components/games/Abacus';
import CodingLogic from '@/components/games/CodingLogic';
import SolarSystem from '@/components/games/SolarSystem';
import DrawStudio from '@/components/games/DrawStudio';
import ColoringBook from '@/components/games/ColoringBook';
import ShapesPatterns from '@/components/games/ShapesPatterns';
import CharacterCreator from '@/components/games/CharacterCreator';
import MusicRhythm from '@/components/games/MusicRhythm'; 
import CraftCorner from '@/components/games/CraftCorner';
import ArtWorld from '@/components/games/ArtWorld';
import LearnToRead from '@/components/games/LearnToRead';
import StoryLibrary from '@/components/games/StoryLibrary';
import WriteName from '@/components/games/WriteName';
import SpellingGame from '@/components/games/SpellingGame';
import SentenceBuilder from '@/components/games/SentenceBuilder';
import WordExplorer from '@/components/games/WordExplorer';
import CreateStory from '@/components/games/CreateStory';
import PersonProfile, { PEOPLE_DATA } from '@/components/games/PersonProfile';
import ContinentExplorer from '@/components/games/ContinentExplorer';
import HistoryTemple, { HISTORY_ITEMS } from '@/components/games/HistoryTemple';
import CareerGuide, { CAREERS_DATA } from '@/components/games/CareerGuide';
import GameArcade, { GAMES_DATA } from '@/components/games/GameArcade';
import SpellingBee from '@/components/games/SpellingBee';
import MatchPairs from '@/components/games/MatchPairs';
import GuessTheAnimal from '@/components/games/GuessTheAnimal';
import QuizTime from '@/components/games/QuizTime';
import MiniPuzzle from '@/components/games/MiniPuzzle';
import WordPlay from '@/components/games/WordPlay';
import WorldExplorer from '@/components/games/WorldExplorer';
import HowThingsWork, { HTW_DATA } from '@/components/games/HowThingsWork';

// IMPORTS FOR DATA 
import { animalHomesData } from '@/data/games/animalHomesData';
import { wildDomesticData } from '@/data/games/wildDomesticData';
import { animalDietsData } from '@/data/games/animalDietsData'; 
import { fastestBiggestData } from '@/data/fastestBiggestData';
import { reptilesList } from '@/data/reptilesList';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showContent, setShowContent] = useState<string | null>(null);
  
  // CUSTOM OS STATES
  const [osAlert, setOsAlert] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null); 
  const [showWelcome, setShowWelcome] = useState(false); 
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isPoweredOff, setIsPoweredOff] = useState(false);

  // NAVIGATION HISTORY STATE 
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // --- PWA INSTALL STATES ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
      // ONBOARDING CHECK
      const hasSeenWelcome = localStorage.getItem('gemkids_welcome');
      if (!hasSeenWelcome) {
          setShowWelcome(true);
      }

      // 1. Detect if the user is on an iPhone/iPad
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
      
      // 2. Check if the app is already installed
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

      if (isAppleDevice && !isStandalone) {
          setIsIOS(true);
          setTimeout(() => setShowInstallPrompt(true), 3000); 
      }

      // 3. Listen for Android/Chrome install event
      const handleBeforeInstall = (e: any) => {
          e.preventDefault(); 
          setDeferredPrompt(e); 
          setTimeout(() => setShowInstallPrompt(true), 3000); 
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      window.addEventListener('appinstalled', () => {
          setShowInstallPrompt(false);
      });

      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
      if (deferredPrompt) {
          deferredPrompt.prompt(); 
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
              setShowInstallPrompt(false);
          }
          setDeferredPrompt(null);
      }
  };

  const closeWelcomeScreen = () => {
      localStorage.setItem('gemkids_welcome', 'true');
      setShowWelcome(false);
  };

  const handleNav = (destination: string | null) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(destination);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setShowContent(destination);
      setActiveCategory(null);
  };

  const goBack = () => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setShowContent(history[newIndex]);
          setActiveCategory(null);
      }
  };

  const goForward = () => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setShowContent(history[newIndex]);
          setActiveCategory(null);
      }
  };

  const handleMaximize = () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {
              setOsAlert("Fullscreen isn't supported on this browser.");
          });
      } else {
          document.exitFullscreen();
      }
  };

  const handleMenuClick = (item: string) => {
      if (item === 'File' || item === 'Help') {
          setActiveMenu(activeMenu === item ? null : item);
      } else {
          setOsAlert(`The "${item}" menu is currently under construction in the GEM Lab!`);
          setActiveMenu(null);
      }
  };

  // --- SHUTDOWN SCREEN OVERRIDE ---
  if (isShuttingDown || isPoweredOff) {
      return (
          <div className="min-h-svh bg-[#0a0a0a] flex flex-col items-center justify-center text-white font-sans p-4 selection:bg-none">
              {!isPoweredOff ? (
                  <div className="flex flex-col items-center animate-in fade-in duration-500">
                      <div className="w-16 h-16 mb-6 relative opacity-30 grayscale">
                          <Image src="/images/gemkids-icon.png" alt="Icon" fill className="object-contain" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif italic mb-6 text-gray-400">GEM OS is shutting down...</h2>
                      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-400 animate-[pulse_1s_ease-in-out_infinite]" style={{width: '100%'}}></div>
                      </div>
                  </div>
              ) : (
                  <div className="text-center animate-in fade-in duration-1000">
                      <h2 className="text-lg sm:text-xl text-gray-500 mb-2">It is now safe to close your browser tab.</h2>
                      <button 
                          onClick={() => window.location.reload()} 
                          className="mt-8 px-6 py-3 border border-gray-700 text-gray-400 rounded-full text-sm font-bold tracking-wider uppercase hover:bg-gray-800 hover:text-white transition-colors"
                      >
                          Restart OS
                      </button>
                  </div>
              )}
          </div>
      );
  }

  // --- MAIN APP ---
  return (
    <div className="min-h-svh bg-zinc-900 flex items-center justify-center p-0 md:p-4 lg:p-8 overflow-hidden selection:bg-green-500/30">
        
        {/* THE DEVICE BORDER/TABLET */}
        <main className="w-full h-full max-w-400 max-h-250 flex flex-col font-sans bg-[#FF9F1C] overflow-hidden relative md:border-16 lg:border-20p border-[#84CC16] md:rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
          {/* BACKGROUND */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            >
                <source src="/images/bg-jungle-temple.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80" />
          </div>

          {/* INVISIBLE CLICK-AWAY BACKDROP FOR MENUS */}
          {activeMenu && (
            <div className="absolute inset-0 z-45" onClick={() => setActiveMenu(null)}></div>
          )}

          {!showContent && (
            <>
              <div className="bg-[#A5B4FC] border-b-2 border-white/50 px-3 py-1.5 flex justify-between items-center shadow-md z-50 relative shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 relative">
                       <Image src="/images/gemkids-icon.png" alt="Icon" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">GEM Kids 2026</span>
                </div>
                <div className="flex gap-1.5">
                  <WindowBtn icon={<Minimize size={12} />} onClick={() => setOsAlert('GEM OS minimized to taskbar!')} />
                  <WindowBtn icon={<Maximize size={12} />} onClick={handleMaximize} />
                  <WindowBtn icon={<X size={12} />} isRed onClick={() => setOsAlert('Are you sure you want to shut down GEM OS?')} />
                </div>
              </div>

              {/* NAVIGATION BAR */}
              <div className="relative z-100 shrink-0">
                 <div className="bg-[#84CC16] pt-1 pb-2 shadow-sm relative z-100">
                     <div className="flex gap-5 px-4 text-sm font-bold text-green-900 mb-2 relative">
                        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((item) => (
                            <div key={item} className="relative">
                                <span 
                                    onClick={() => handleMenuClick(item)} 
                                    className={`cursor-pointer hover:text-white drop-shadow-sm px-1.5 py-0.5 rounded transition-colors ${activeMenu === item ? 'bg-green-900/20 text-white' : ''}`}
                                >
                                    {item}
                                </span>
                                
                                {/* FILE DROPDOWN */}
                                {item === 'File' && activeMenu === 'File' && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 z-999">
                                        <div className="p-4 border-b border-gray-100 bg-orange-50">
                                            <div className="flex items-center gap-2 text-orange-600 font-black mb-1">
                                                <Info size={16} /> About GEM Kids
                                            </div>
                                            <p className="text-xs text-gray-600 font-normal leading-tight">
                                                GEM Kids is an interactive, digital encyclopedia built to make learning fun. Explore animals, science, arts, and history in a fully offline environment.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <div className="flex items-center gap-2 text-blue-600 font-black mb-1">
                                                <span>🎮</span> How to Play
                                            </div>
                                            <p className="text-xs text-gray-600 font-normal leading-tight">
                                                Click on any category on the home screen to open the app drawer. Select an activity to explore! Look out for "Coming Soon" tags for features arriving in Version 2.0.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* HELP DROPDOWN */}
                                {item === 'Help' && activeMenu === 'Help' && (
                                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 z-999">
                                        <a href="mailto:hello@gemstudio.com?subject=GEM Kids Inquiry" className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 group">
                                            <Mail size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">Contact Support</span>
                                                <span className="text-[10px] font-normal text-gray-500">Email GEM Studio</span>
                                            </div>
                                        </a>
                                        <a href="mailto:hello@gemstudio.com?subject=GEM Kids Review/Feedback" className="flex items-center gap-3 p-3 hover:bg-yellow-50 transition-colors group">
                                            <Star size={16} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">Leave a Review</span>
                                                <span className="text-[10px] font-normal text-gray-500">Help us improve the app!</span>
                                            </div>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                     <div className="flex items-center justify-between px-4 pb-2">
                         <div className="flex gap-2">
                              <NavCircleBtn icon={<Home size={24} />} onClick={() => handleNav(null)} />
                              <NavCircleBtn icon={<ArrowLeft size={24} className={historyIndex === 0 ? "opacity-30" : ""} />} onClick={goBack} />
                              <NavCircleBtn icon={<ArrowRight size={24} className={historyIndex === history.length - 1 ? "opacity-30" : ""} />} onClick={goForward} />
                              <NavCircleBtn icon={<Settings size={24} />} onClick={() => setOsAlert('Control Panel opening...')} />
                              <NavCircleBtn icon={<Bookmark size={24} />} onClick={() => setOsAlert('Added to favorites!')} />
                         </div>
                         <div className="flex-1 max-w-xl mx-4 sm:mx-8 relative group">
                            <input type="text" placeholder="Search GEM Kids..." className="w-full rounded-full border-2 border-gray-300 bg-white py-1.5 px-4 text-sm sm:text-lg text-gray-700 shadow-inner focus:outline-none" />
                         </div>
                         <div className="text-right leading-none select-none hidden sm:block">
                            <div className="text-xs font-bold text-green-900">GEM</div>
                            <div className="text-2xl font-black font-serif italic text-black/80">Kids</div>
                         </div>
                     </div>
                 </div>
                 {/* Wave SVG */}
                 <div className="absolute top-full left-0 w-full overflow-hidden leading-0 z-40 pointer-events-none">
                     <svg className="relative block w-[calc(100%+1.3px)] h-8 sm:h-12.5" viewBox="0 0 1200 120" preserveAspectRatio="none">
                         <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#84CC16" className="drop-shadow-lg"></path>
                     </svg>
                 </div>
              </div>
            </>
          )}

          {/* CONTENT AREA */}
          <div className="flex-1 relative flex items-center justify-center py-6 z-30 overflow-y-auto">
            
            {showContent === 'Meet the Animals' ? (
               <AnimalBook onBack={() => handleNav(null)} />
            
            ) : showContent === 'Animal Homes' ? (
               <DragDropGame 
                  title="Animal Homes" 
                  levelData={animalHomesData} 
                  onBack={() => handleNav(null)}
                  bgImage="/images/forest-bg.png"
               />

            ) : showContent === 'Wild vs Domestic' ? (
               <DragDropGame 
                  title="Wild vs Domestic" 
                  levelData={wildDomesticData} 
                  onBack={() => handleNav(null)}
                  bgImage="/images/forest-bg.png" 
               />

            ) : showContent === 'Animal Diets' ? (
               <DragDropGame 
                  title="Animal Diets" 
                  levelData={animalDietsData} 
                  onBack={() => handleNav(null)}
                  bgImage="/images/forest-bg.png" 
               />

            ) : showContent === 'Fastest & Biggest' ? (
               <AnimalBook 
                   onBack={() => handleNav(null)} 
                   data={fastestBiggestData} 
                   introTitle="RECORD BREAKERS!" 
               />

            ) : showContent === 'Animal Sounds' ? (
               <Soundboard onBack={() => handleNav(null)} />

            ) : showContent === 'Reptiles & Bugs' ? (
               <AnimalBook 
                   onBack={() => handleNav(null)} 
                   data={reptilesList} 
                   introTitle="CREEPY CRAWLIES..." 
               />

            ) : showContent === 'Human Body' ? (
               <AnatomyBuilder onBack={() => handleNav(null)} />

            ) : showContent === 'Science Lab' ? (
                 <ScienceLab onBack={() => handleNav(null)} />

            ) : showContent === 'Simple Machines' ? (
                 <SimpleMachines onBack={() => handleNav(null)} />

            ) : showContent === 'Math Playground' ? (
                 <Abacus onBack={() => handleNav(null)} />

            ) : showContent === 'Coding Logic' ? (
                 <CodingLogic onBack={() => handleNav(null)} />

            ) : showContent === 'Space & Planets' ? (
                 <SolarSystem onBack={() => handleNav(null)} />

            ) : showContent === 'Draw & Color Studio' ? (
                 <DrawStudio onBack={() => handleNav(null)} />

            ) : showContent === 'Paint with Colors' ? (
                 <ColoringBook onBack={() => handleNav(null)} />

            ) : showContent === 'Shapes & Patterns' ? (
                 <ShapesPatterns onBack={() => handleNav(null)} />

            ) : showContent === 'Create a Character' ? (
                 <CharacterCreator onBack={() => handleNav(null)} />

            ) : showContent === 'Music & Rhythm' ? (
                 <MusicRhythm onBack={() => handleNav(null)} />

            ) : showContent === 'Crafts & DIY Corner' ? (
                 <CraftCorner onBack={() => handleNav(null)} />

            ) : showContent === 'Art Around the World' ? (
                 <ArtWorld onBack={() => handleNav(null)} />
                 
            ) : showContent === 'Learn to Read' ? (
                 <LearnToRead onBack={() => handleNav(null)} />

            ) : showContent === 'Story Time Library' ? (
                 <StoryLibrary onBack={() => handleNav(null)} />

            ) : showContent === 'Write Your Name' ? (
                 <WriteName onBack={() => handleNav(null)} />

            ) : showContent === 'Spelling Games' ? (
                 <SpellingGame onBack={() => handleNav(null)} />

            ) : showContent === 'Build a Sentence' ? (
                 <SentenceBuilder onBack={() => handleNav(null)} />
                 
            ) : showContent === 'Word Explorer' ? (
                 <WordExplorer onBack={() => handleNav(null)} />

            ) : showContent === 'Create Your Own Story' ? (
                 <CreateStory onBack={() => handleNav('Reading & Writing')} />

            ) : PEOPLE_DATA.some(p => p.id === showContent) ? (
                <PersonProfile 
                 personId={showContent!} 
                 onBack={() => handleNav('People')} 
              />

            ) : ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'].includes(showContent || '') ? (
                 <ContinentExplorer 
                 continentId={showContent!} 
                 onBack={() => handleNav('Places')} 
              />

            ) : showContent === 'History' || HISTORY_ITEMS.some(h => h.label === showContent) ? (
                 <HistoryTemple 
                 startItem={showContent === 'History' ? null : showContent} 
                 onBack={() => handleNav(null)} 
              />

            ) : showContent === 'Careers' || CAREERS_DATA.some(c => c.title === showContent) ? (
                 <CareerGuide 
                 startItem={showContent === 'Careers' ? null : showContent} 
                 onBack={() => handleNav(null)} 
              />

            ) : showContent === 'Games & Fun' ? (
                <GameArcade 
                onBack={() => handleNav(null)} 
                onSelectGame={(gameLabel) => handleNav(gameLabel)} 
              />
            ) : showContent === 'Spelling Bee' ? (
                <SpellingBee onBack={() => handleNav('Games & Fun')} 
              />
            ) : showContent === 'Match Pairs' ? (
                <MatchPairs onBack={() => handleNav('Games & Fun')} 
              />

            ) : showContent === 'Guess The Animal' ? (
                <GuessTheAnimal onBack={() => handleNav('Games & Fun')} />

            ) : showContent === 'Quiz Time' ? (
                <QuizTime onBack={() => handleNav('Games & Fun')} />

            ) : showContent === 'Mini Puzzle' ? (
                <MiniPuzzle onBack={() => handleNav('Games & Fun')} />
                
            ) : showContent === 'Word Play' ? (
                <WordPlay onBack={() => handleNav('Games & Fun')} />

            ) : showContent === 'World Explorer' ? (
                <WorldExplorer onBack={() => handleNav('Games & Fun')} />

            ) : showContent === 'How things work' || HTW_DATA.some(item => item.title === showContent) ? (
                <HowThingsWork 
                    startItem={showContent === 'How things work' ? null : showContent} 
                    onBack={() => handleNav(null)} 
                />

            
            /* HOMEPAGE GRID */
            ) : (
               <div className="max-w-7xl w-full grid grid-cols-12 gap-x-0 px-2 md:px-4 h-full items-center">    

                
                {/* LEFT COLUMN */}
                <div className="col-span-4 flex flex-col justify-center gap-2 h-full py-4 pl-4 pr-1">
                  <MenuCard onClick={() => setActiveCategory('animals')} label="Animals" image="/images/lion.png" shape="wide-left" align="image-left" popOut />
                  <MenuCard onClick={() => setActiveCategory('stem')} label="STEM" image="/images/astronaut.png" shape="wide-right" align="image-right" popOut />
                  <MenuCard onClick={() => setActiveCategory('arts')} label="Arts" image="/images/palette.png" shape="wide-left" align="image-left" popOut />
                  <MenuCard onClick={() => setActiveCategory('reading')} label="Reading & Writing" image="/images/books.png" shape="wide-right" align="image-right" popOut />
                  <MenuCard onClick={() => setActiveCategory('people')} label="People" image="/images/statue.png" shape="wide-left" align="image-left" popOut />
                </div>

                {/* CENTER COLUMN */}
                <div className="col-span-4 flex flex-col items-center justify-center relative z-0 h-full">
                  {activeCategory ? (
                      <CategoryPopup 
                          categoryKey={activeCategory} 
                          onClose={() => setActiveCategory(null)} 
                          onItemClick={(label) => {
                              // COMING SOON 
                              const comingSoonItems = [
                                  'North America', 'South America', 'Australia', 'Antarctica', 
                                  'Build a Robot', 'Create a Character'
                              ];
                              if (comingSoonItems.includes(label)) {
                                  setOsAlert(`🚧 "${label}" is currently under construction in the GEM Lab! Check back in the next update. 🚧`);
                                  return;
                              }

                              // Use new handleNav system
                              if (label === 'Meet the Animals') {
                                  handleNav('Meet the Animals'); 
                              } else if (label === 'Animal Homes') {
                                  handleNav('Animal Homes');
                              } else if (label === 'Wild vs Domestic') { 
                                  handleNav('Wild vs Domestic');
                              } else if (label === 'Animal Diets') { 
                                  handleNav('Animal Diets');
                              } else if (label === 'Fastest & Biggest') {
                                  handleNav('Fastest & Biggest');
                              } else if (label === 'Animal Sounds') { 
                                  handleNav('Animal Sounds');
                              } else if (label === 'Reptiles & Bugs') { 
                                  handleNav('Reptiles & Bugs');
                              } else if (label === 'Human Body') { 
                                  handleNav('Human Body');
                              } else if (label === 'Science Lab') {
                                  handleNav('Science Lab');
                              } else if (label === 'Simple Machines') {
                                  handleNav('Simple Machines');
                              } else if (label === 'Math Playground') {
                                  handleNav('Math Playground');
                              } else if (label === 'Coding Logic') {
                                   handleNav('Coding Logic');
                              } else if (label === 'Space & Planets') {
                                   handleNav('Space & Planets');
                              } else if (label === 'Draw & Color Studio') {
                                   handleNav('Draw & Color Studio');
                              } else if (label === 'Paint with Colors') {
                                   handleNav('Paint with Colors');
                              } else if (label === 'Shapes & Patterns') {
                                   handleNav('Shapes & Patterns');
                              } else if (label === 'Create a Character') {
                                   handleNav('Create a Character');
                              } else if (label === 'Music & Rhythm') {
                                   handleNav('Music & Rhythm');
                              } else if (label === 'Crafts & DIY Corner') {
                                   handleNav('Crafts & DIY Corner');
                              } else if (label === 'Art Around the World') {
                                   handleNav('Art Around the World');
                              } else if (label === 'Learn to Read') {
                                   handleNav('Learn to Read');
                              } else if (label === 'Story Time Library') {
                                   handleNav('Story Time Library');
                              } else if (label === 'Write Your Name') {
                                   handleNav('Write Your Name');
                              } else if (label === 'Spelling Games') {
                                   handleNav('Spelling Games');
                              } else if (label === 'Build a Sentence') {
                                   handleNav('Build a Sentence');
                              } else if (label === 'Word Explorer') {
                                   handleNav('Word Explorer');
                              } else if (label === 'Create Your Own Story') {
                                   handleNav('Create Your Own Story');
                              } else if (PEOPLE_DATA.some(p => p.id === label)) {
                                   handleNav(label);
                              } else if (['Africa', 'Asia', 'Europe'].includes(label)) {
                                   handleNav(label); 
                              }  else if (HISTORY_ITEMS.some(item => item.label === label)) {
                                   handleNav(label); 
                              } else if (label === 'Careers' || CAREERS_DATA.some(item => item.title === label)) {
                                   handleNav(label);
                              } else if (label === 'Games & Fun' || GAMES_DATA.some(g => g.label === label)) {
                                   handleNav(label);
                              }  else if (label === 'How things work' || HTW_DATA.some(item => item.title === label)) {
                                   handleNav(label);
                              }
                          }}
                             />
                  ) : (
                      <div className="relative w-full h-48 sm:h-80 transform hover:scale-110 transition-transform duration-500 cursor-pointer drop-shadow-2xl">
                          <Image src="/images/gemkids-logo.png" alt="GEM Kids Logo" fill className="object-contain" priority onClick={() => setActiveCategory(null)} />
                      </div>
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-span-4 flex flex-col justify-center gap-2 h-full py-4 pr-4 pl-1">
                  <MenuCard onClick={() => setActiveCategory('places')} label="Places" image="/images/flags.png" shape="wide-right" align="image-right" popOut />
                  <MenuCard onClick={() => setActiveCategory('history')} label="History" image="/images/history.png" shape="wide-left" align="image-left" popOut />
                  <MenuCard onClick={() => setActiveCategory('careers')} label="Careers" image="/images/careers.png" shape="wide-right" align="image-right" popOut />
                  <MenuCard onClick={() => setActiveCategory('games')} label="Games & Fun" image="/images/controller.png" shape="wide-left" align="image-left" popOut />
                  
                  <div onClick={() => setActiveCategory('howThingsWork')} className="relative h-20 sm:h-28 w-full group cursor-pointer">
                      <div className="absolute inset-0 bg-[#D9F99D]/90 border-2 border-[#BEF264] transition-all duration-300 group-hover:bg-[#2563EB] group-hover:border-[#60A5FA]"
                          style={{ clipPath: 'polygon(0% 15%, 100% 0%, 100% 100%, 0% 85%)', filter: 'drop-shadow(-4px 4px 4px rgba(0,0,0,0.2))' }} />
                      <div className="relative h-full flex items-center justify-between px-2 flex-row-reverse">
                          <div className="relative shrink-0 z-10 w-24 h-24 sm:w-36 sm:h-36 -mr-6 sm:-mr-10 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
                              <Image src="/images/questions.png" alt="Help" fill className="object-contain" />
                          </div>
                          <span className="font-bold text-sm sm:text-xl md:text-2xl text-gray-900 group-hover:text-white leading-tight drop-shadow-sm flex-1 text-left pl-4">How things work</span>
                      </div>
                  </div>
                </div>

               </div>
            )}

          </div>

          {/* GEM KIDS WELCOME / ONBOARDING MODAL */}
          {showWelcome && (
              <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
                  <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-[90%] border-t-8 border-[#FF9F1C] relative flex flex-col max-h-[90vh]">
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white border-8 border-[#FF9F1C] items-center justify-center shadow-lg z-10 hidden sm:flex">
                          <span className="text-3xl">🌟</span>
                      </div>
                      
                      <div className="mt-4 sm:mt-8 text-center overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2 font-serif italic tracking-wide">Welcome to GEM Kids!</h2>
                          <p className="text-gray-500 font-bold mb-6 text-sm sm:text-base">Your interactive, offline-ready encyclopedia.</p>
                          
                          <div className="space-y-3 sm:space-y-4 text-left">
                              <div className="flex gap-4 items-start bg-orange-50 p-3 sm:p-4 rounded-2xl border border-orange-100">
                                  <div className="bg-orange-200 w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1"><span className="text-xl">📡</span></div>
                                  <div>
                                      <h4 className="font-black text-gray-800 text-base sm:text-lg">1. Let it Load</h4>
                                      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-snug">The app needs a few moments to download its data. Once it finishes, you can turn off your internet and play 100% offline!</p>
                                  </div>
                              </div>
                              
                              <div className="flex gap-4 items-start bg-lime-50 p-3 sm:p-4 rounded-2xl border border-lime-100">
                                  <div className="bg-lime-200 w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1"><span className="text-xl">🖱️</span></div>
                                  <div>
                                      <h4 className="font-black text-gray-800 text-base sm:text-lg">2. How to Play</h4>
                                      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-snug">Click on any of the category blocks (Animals, STEM, History, etc.) to open the app drawer and start exploring.</p>
                                  </div>
                              </div>

                              <div className="flex gap-4 items-start bg-blue-50 p-3 sm:p-4 rounded-2xl border border-blue-100">
                                  <div className="bg-blue-200 w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1"><span className="text-xl">🚀</span></div>
                                  <div>
                                      <h4 className="font-black text-gray-800 text-base sm:text-lg">3. More Coming Soon!</h4>
                                      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-snug">If you see a "Coming Soon" message, don't worry! New games and features are being built in the GEM Lab for Version 2.0.</p>
                                  </div>
                              </div>
                          </div>

                          <button 
                              onClick={closeWelcomeScreen} 
                              className="mt-6 sm:mt-8 bg-[#FF9F1C] hover:bg-orange-500 text-white w-full py-3 sm:py-4 rounded-full font-black text-lg sm:text-xl uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
                          >
                              Start Exploring!
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* SMART PWA INSTALL MODAL */}
          {showInstallPrompt && (
              <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-white p-6 md:p-8 rounded-4xl shadow-2xl max-w-sm w-[90%] text-center border-t-8 border-[#3B82F6] flex flex-col max-h-[90vh]">
                      <div className="overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4 shadow-inner shrink-0">
                              <span className="text-3xl">📲</span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-800 mb-2 font-serif italic">Get the App!</h3>
                          
                          {isIOS ? (
                              <div className="text-gray-600 font-bold mb-6 text-sm text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
                                  <p className="mb-2 text-center text-red-500">Apple requires a manual install:</p>
                                  <p>1. Tap the <b>Share</b> icon at the bottom of Safari.</p>
                                  <p>2. Scroll down and tap <b>&quot;Add to Home Screen&quot;</b>.</p>
                                  <p>3. Play offline anytime!</p>
                              </div>
                          ) : (
                              <p className="text-gray-600 font-bold mb-6 text-sm md:text-base">
                                  Install GEM Kids directly to your device for full offline access and a true OS experience!
                              </p>
                          )}

                          <div className="flex gap-4 justify-center shrink-0">
                              <button 
                                  onClick={() => setShowInstallPrompt(false)} 
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full font-black uppercase tracking-wider transition-transform active:scale-95 text-sm md:text-base"
                              >
                                  Later
                              </button>
                              
                              {!isIOS && (
                                  <button 
                                      onClick={handleInstallClick} 
                                      className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-full font-black uppercase tracking-wider shadow-lg transition-transform active:scale-95 text-sm md:text-base"
                                  >
                                      Install Now
                                  </button>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* PORTRAIT MODE WARNING FOR MOBILE */}
          <div className="hidden max-md:portrait:flex fixed inset-0 z-9999 bg-[#FF9F1C] flex-col items-center justify-center text-center p-8 text-white animate-in fade-in duration-300">
              <div className="text-7xl mb-6 flex items-center justify-center">
                  <span className="animate-[spin_3s_linear_infinite]">🔄</span>
              </div>
              <h2 className="text-4xl font-black font-serif italic mb-4 tracking-wide text-white drop-shadow-md">
                  Rotate Phone!
              </h2>
              <p className="text-xl font-bold text-white/90 drop-shadow-sm max-w-[80%] mx-auto">
                  Please turn your device sideways to launch the GEM Kids OS.
              </p>
          </div>

          {/* CUSTOM OS ALERT MODAL */}
          {osAlert && (
              <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in duration-200">
                  <div className="bg-white p-6 md:p-8 rounded-4xl shadow-2xl max-w-sm w-[90%] text-center border-t-8 border-[#84CC16] flex flex-col max-h-[90vh]">
                      <div className="overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner shrink-0 ${osAlert.includes('shut down') ? 'bg-red-100 text-red-500' : 'bg-lime-100 text-lime-600'}`}>
                              <Settings size={32} className={osAlert.includes('shut down') ? '' : 'animate-spin-slow'} />
                          </div>
                          <h3 className="text-2xl font-black text-gray-800 mb-2 font-serif italic">GEM System</h3>
                          <p className="text-gray-600 font-bold mb-8 text-sm md:text-base">{osAlert}</p>
                          
                          {osAlert.includes('shut down') ? (
                              <div className="flex gap-4 justify-center shrink-0">
                                  <button 
                                      onClick={() => setOsAlert(null)} 
                                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full font-black uppercase tracking-wider shadow-md transition-transform hover:scale-105 active:scale-95 text-sm md:text-base"
                                  >
                                      Cancel
                                  </button>
                                  <button 
                                      onClick={() => {
                                          setOsAlert(null);
                                          setIsShuttingDown(true);
                                          setTimeout(() => {
                                              setIsPoweredOff(true);
                                          }, 3000); // 3-second shutdown animation
                                      }} 
                                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-black uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm md:text-base"
                                  >
                                      Shut Down
                                  </button>
                              </div>
                          ) : (
                              <button 
                                  onClick={() => setOsAlert(null)} 
                                  className="bg-[#84CC16] hover:bg-lime-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm md:text-base shrink-0"
                              >
                                  Got it!
                              </button>
                          )}
                      </div>
                  </div>
              </div>
          )}
          
        </main>
    </div>
  );
}