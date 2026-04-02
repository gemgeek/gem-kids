'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Volume2, X } from 'lucide-react';

// THE LIBRARY
const books = [
  {
    id: 'cinderella',
    title: 'Cinderella',
    cover: '/images/cover-cinderella.png',
    color: 'bg-blue-600',
    pages: [
      { text: "Once upon a time, there was a kind girl named Cinderella. She lived with her mean stepmother.", img: '/images/story-cinderella-1.png' },
      { text: "One day, a Fairy Godmother appeared! 'Bibbidi-Bobbidi-Boo!' she waved her wand.", img: '/images/story-cinderella-2.png' },
      { text: "Cinderella went to the ball in a pumpkin carriage. She danced with the Prince all night!", img: '/images/story-cinderella-3.png' },
      { text: "But at midnight, she ran away and lost her glass slipper on the stairs.", img: '/images/story-cinderella-3.png' },
      { text: "The Prince found her, and they lived happily ever after. The End.", img: '/images/story-cinderella-1.png' }
    ]
  },
  {
    id: 'space',
    title: 'Max in Space',
    cover: '/images/cover-space.png',
    color: 'bg-indigo-900',
    pages: [
      { text: "Max was not an ordinary boy. He had a red rocket ship in his backyard!", img: '/images/story-space-1.png' },
      { text: "3... 2... 1... BLAST OFF! Max zoomed past the moon and the stars.", img: '/images/story-space-1.png' },
      { text: "He landed on Mars and met a green alien named Zog. Zog loved pizza!", img: '/images/story-space-2.png' },
    ]
  },
  {
    id: 'lion',
    title: 'The Lion & Mouse',
    cover: '/images/cover-lion.png',
    color: 'bg-orange-600',
    pages: [
      { text: "A mighty Lion was sleeping in the jungle. A little Mouse ran over his nose.", img: '/images/story-lion-1.png' },
      { text: "The Lion woke up! 'I will eat you!' he roared. 'Please let me go!' squeaked the Mouse.", img: '/images/story-lion-1.png' },
      { text: "Later, the Lion got caught in a net. The little Mouse chewed the ropes and saved him!", img: '/images/story-lion-2.png' },
    ]
  }
];

export default function StoryLibrary({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'intro' | 'shelf' | 'reading'>('intro');
  const [activeBook, setActiveBook] = useState<typeof books[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // AUDIO ENGINE 
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      }
  };

  useEffect(() => {
      return () => stopSpeech();
  }, [view]);

  // NAVIGATION 
  const openBook = (book: typeof books[0]) => {
      setActiveBook(book);
      setCurrentPage(0);
      setView('reading');
      new window.Audio('/sounds/paper-fold.mp3').play().catch(() => {});
  };

  const turnPage = (direction: 'next' | 'prev') => {
      if (!activeBook) return;
      stopSpeech();
      new window.Audio('/sounds/paper-fold.mp3').play().catch(() => {});

      if (direction === 'next') {
          if (currentPage < activeBook.pages.length - 1) {
              setCurrentPage(p => p + 1);
          } else {
              // Finish book
              stopSpeech();
              setView('shelf');
          }
      } else {
          if (currentPage > 0) setCurrentPage(p => p - 1);
      }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black overflow-hidden font-serif">
      
      {view === 'intro' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-20">
              
              <div className="absolute inset-0 z-0">
                  <Image src="/images/story-bg-intro.png" alt="Forest" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
              </div>

              
              <button onClick={onBack} className="absolute top-6 left-6 z-50 bg-white/20 text-white p-3 rounded-full hover:bg-white/40 backdrop-blur-md">
                  <ArrowLeft />
              </button>

              
              <div 
                onClick={() => setView('shelf')}
                className="relative z-10 w-100 h-85 md:w-125 md:h-105 cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-swing-slow mt-10"
              >
                  
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-2 h-24 bg-linear-to-b from-transparent to-yellow-800" />
                  
                  
                  <div className="relative w-full h-full drop-shadow-2xl">
                      <Image src="/images/wooden-sign.png" alt="Story Time" fill className="object-contain" />
                      
                     
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 py-6">
                           
                           
                           <span className="text-white/90 text-sm md:text-base font-bold uppercase tracking-widest drop-shadow-md">
                               Welcome to
                           </span>
                           
                           
                           <h1 className="text-3xl md:text-4xl font-black font-serif text-amber-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight mt-30">
                               Story<br/>Time
                           </h1>
                           
                           
                           <span className="mt-4 text-xs md:text-sm font-bold bg-[#3e2723] text-amber-100 px-6 py-2 md:px-8 md:py-3 rounded-full animate-pulse border-2 border-amber-500/50 shadow-xl">
                               Click to Enter
                           </span>
                      </div>
                  </div>
              </div>
          </div>
      )}


      {view === 'shelf' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center pt-24 pb-10 px-4">
              
              <div className="absolute inset-0 z-0">
                  <Image src="/images/library-shelf-bg.png" alt="Library" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
              </div>

              <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between">
                  <button onClick={() => setView('intro')} className="bg-white/20 text-white p-3 rounded-full hover:bg-white/40 backdrop-blur-md">
                      <ArrowLeft />
                  </button>
                  <div className="bg-[#5d4037] text-[#e3c099] px-6 py-2 rounded-xl shadow-lg border-2 border-[#8d6e63]">
                      <h2 className="text-xl font-bold uppercase tracking-widest">Select a Book</h2>
                  </div>
                  <div className="w-12"/>
              </div>

              
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl w-full">
                  {books.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => openBook(book)}
                        className="group relative aspect-3/4 rounded-r-lg shadow-2xl transition-all hover:-translate-y-4 hover:rotate-2 duration-300"
                      >
                          
                          <div className={`absolute left-0 top-1 bottom-1 w-4 ${book.color} brightness-75 rounded-l-sm z-0`} />
                          
                          
                          <div className="absolute left-3 top-0 bottom-0 right-0 rounded-r-md overflow-hidden border-l border-white/20">
                              <Image src={book.cover} alt={book.title} fill className="object-cover" />
                              
                              
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                                  <span className="text-white font-bold text-lg drop-shadow-md">{book.title}</span>
                              </div>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      )}


      {view === 'reading' && activeBook && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-8">
              
              
              <button onClick={() => setView('shelf')} className="absolute top-6 right-6 bg-white/10 text-white p-3 rounded-full hover:bg-red-500 hover:text-white transition z-50">
                  <X />
              </button>

              
              <div className="relative w-full max-w-6xl aspect-16/10 md:aspect-2/1 bg-[#fdf6e3] rounded-md shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden border-8 border-[#3e2723]">
                  
                  
                  <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-slate-200 border-b-4 md:border-b-0 md:border-r-4 border-[#d7ccc8] overflow-hidden">
                       <Image 
                          src={activeBook.pages[currentPage].img} 
                          alt="Story Scene" 
                          fill 
                          className="object-cover animate-in fade-in duration-700"
                       />
                       <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                           Page {currentPage + 1}
                       </div>
                  </div>

                  <div className="relative w-full md:w-1/2 h-1/2 md:h-full p-4 md:p-8 flex flex-col justify-center items-center">
                      
                      <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">

                      </div>

                      <div className="relative z-10 w-full max-w-md flex flex-col justify-center items-center">
                          <p className="text-base md:text-xl lg:text-2xl text-[#3e2723] leading-relaxed font-medium mb-6 text-center px-2">
                              {activeBook.pages[currentPage].text}
                          </p>

                          <button 
                            onClick={() => speak(activeBook.pages[currentPage].text)}
                            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base transition-all ${isSpeaking ? 'bg-orange-100 text-orange-600 scale-105 border-2 border-orange-400' : 'bg-[#5d4037] text-[#e3c099] hover:scale-105 shadow-md'}`}
                          >
                              <Volume2 size={18} className={isSpeaking ? 'animate-pulse' : ''} />
                              {isSpeaking ? 'Reading...' : 'Read to Me'}
                          </button>
                      </div>

                      <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 flex gap-2 md:gap-4 z-20">
                          {currentPage > 0 && (
                              <button onClick={() => turnPage('prev')} className="p-2 md:p-3 bg-[#d7ccc8] hover:bg-[#a1887f] text-[#3e2723] rounded-full transition">
                                  <ArrowLeft size={18} />
                              </button>
                          )}
                          <button onClick={() => turnPage('next')} className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-[#5d4037] hover:bg-[#4e342e] text-white rounded-full font-bold text-sm md:text-base shadow-lg transition transform hover:scale-105">
                              {currentPage < activeBook.pages.length - 1 ? 'Next' : 'Finish'} <ArrowRight size={16} />
                          </button>
                      </div>
                  </div>

                  <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-linear-to-r from-black/20 via-transparent to-black/10 pointer-events-none hidden md:block" />
              </div>

          </div>
      )}

      <style jsx global>{`
          @keyframes swing-slow {
              0%, 100% { transform: rotate(-2deg); }
              50% { transform: rotate(2deg); }
          }
          .animate-swing-slow {
              animation: swing-slow 4s ease-in-out infinite;
          }
      `}</style>
    </div>
  );
}