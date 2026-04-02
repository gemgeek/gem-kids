'use client';

import Image from 'next/image';
import { ArrowLeft, Quote, Star } from 'lucide-react';


export const PEOPLE_DATA = [
  {
    id: 'Dr. Kwame Nkrumah', 
    name: 'Dr. Kwame Nkrumah',
    title: 'The Star of Africa',
    flag: '/images/flag-ghana.png',
    country: 'Ghana',
    color: 'from-green-500 to-green-700',
    
    story: 'He was a teacher who became a powerful leader. He believed that Ghana should be free to rule itself, and he fought peacefully to make Ghana the first African country to gain independence! He wanted all of Africa to be united and strong together.',
    fact: 'He was voted "Man of the Millennium" by people all over Africa.',
    quote: 'Forward ever, backward never.',
    images: ['/images/nkrumah-portrait.png', '/images/nkrumah-speech.png', '/images/nkrumah-statue.png']
  },
  {
    id: 'Nelson Mandela',
    name: 'Nelson Mandela',
    title: 'The Peacemaker',
    flag: '/images/flag-south-africa.png',
    country: 'South Africa',
    color: 'from-yellow-500 to-yellow-700',
    story: 'He fought against unfair rules that separated people by color. He spent 27 years in prison but never gave up hope. When he finally got out, he became President and chose to forgive his enemies to bring peace to his country.',
    fact: 'His nickname "Madiba" is a sign of respect and love.',
    quote: 'It always seems impossible until it is done.',
    images: ['/images/mandela-portrait.png', '/images/mandela-smile.png', '/images/mandela-prison-cell.png']
  },
  {
    id: 'Funmilayo R. Kuti',
    name: 'Funmilayo R. Kuti',
    title: 'The Lioness of Lisabi',
    flag: '/images/flag-nigeria.png',
    country: 'Nigeria',
    color: 'from-green-600 to-green-800',
    story: 'She was a fearless teacher who fought for women’s rights. She believed women should be allowed to vote and go to school just like men. She was so brave that she once led thousands of women to protest against unfair taxes!',
    fact: 'She was the first woman in Nigeria to drive a car!',
    quote: 'As for me, I have no fear.',
    images: ['/images/funmilayo-portrait.png', '/images/funmilayo-car.png', '/images/funmilayo-rally.png']
  },
  {
    id: 'Nikola Tesla',
    name: 'Nikola Tesla',
    title: 'Master of Lightning',
    flag: '/images/flag-serbia.png',
    country: 'Serbia',
    color: 'from-blue-500 to-blue-700',
    story: 'He invented the type of electricity (AC) that powers our homes, lights, and fridges today! He loved science so much he wanted to give free energy to the whole world using giant towers.',
    fact: 'He could memorize entire books and do complex math in his head!',
    quote: 'The present is theirs; the future is mine.',
    images: ['/images/tesla-portrait.png', '/images/tesla-coil.png', '/images/tesla-lab.png']
  },
  {
    id: 'Maya Angelou',
    name: 'Maya Angelou',
    title: 'The Voice of Hope',
    flag: '/images/flag-usa.png',
    country: 'USA',
    color: 'from-pink-500 to-rose-600',
    story: 'When she was young, she stopped speaking for 5 years. But she loved books. She eventually used her voice to write poetry that healed people’s hearts and taught them to be kind to one another.',
    fact: 'Before she was a writer, she was a tram conductor and a dancer!',
    quote: 'Try to be a rainbow in someone’s cloud.',
    images: ['/images/maya-portrait.png', '/images/maya-speaking.png', '/images/maya-books.png']
  },
  {
    id: 'Elon Musk',
    name: 'Elon Musk',
    title: 'The Rocket Man',
    flag: '/images/flag-south-africa.png',
    country: 'South Africa / USA',
    color: 'from-slate-600 to-slate-800',
    story: 'He taught himself computer programming at age 10! Now, he builds electric cars and giant rockets because he wants humans to live on Mars one day. He dreams of the future.',
    fact: 'He sold his first video game code when he was just 12 years old.',
    quote: 'When something is important enough, you do it.',
    images: ['/images/elon-portrait.png', '/images/elon-rocket.png', '/images/elon-car.png']
  },
  {
    id: 'Marie Curie',
    name: 'Marie Curie',
    title: 'Science Superstar',
    flag: '/images/flag-poland.png',
    country: 'Poland / France',
    color: 'from-violet-500 to-purple-700',
    story: 'She discovered invisible energy called "radioactivity." She was very brave and carried science experiments in her pockets! Her work helped create the X-rays doctors use today.',
    fact: 'She is the only person to win Nobel Prizes in two different sciences.',
    quote: 'Nothing in life is to be feared, only understood.',
    images: ['/images/marie-portrait.png', '/images/marie-lab.png', '/images/marie-nobel.png']
  }
];


export default function PersonProfile({ personId, onBack }: { personId: string, onBack: () => void }) {
  const person = PEOPLE_DATA.find(p => p.id === personId);

  if (!person) return <div className="p-10 text-white">Person not found: {personId}</div>;

  return (
      <div className="fixed inset-0 z-200 bg-white overflow-y-auto animate-in zoom-in duration-300 flex flex-col md:flex-row font-sans">
          
          
          <button 
            onClick={onBack}
            className="absolute top-6 right-6 z-50 bg-black/10 hover:bg-black/20 text-slate-800 p-3 rounded-full transition cursor-pointer"
          >
              <ArrowLeft size={24} />
          </button>

          
          <div className={`relative w-full md:w-2/5 p-10 flex flex-col items-center justify-center text-center text-white bg-linear-to-br ${person.color}`}>
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white/20 shadow-2xl mb-6 overflow-hidden">
                  <Image src={person.images[0]} alt={person.name} fill className="object-cover" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-2 drop-shadow-md">{person.name}</h2>
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 mb-6">
                  <span className="font-bold tracking-widest uppercase text-sm">{person.title}</span>
              </div>
              
              
              <div className="flex items-center gap-3 bg-black/20 px-5 py-2 rounded-full border border-white/10">
                  <div className="relative w-8 h-5 shadow-sm overflow-hidden rounded-sm">
                       <Image src={person.flag} alt="Flag" fill className="object-cover" />
                  </div>
                  <span className="font-bold text-lg">{person.country}</span>
              </div>
          </div>

          
          <div className="w-full md:w-3/5 p-8 md:p-12 bg-slate-50">
              <div className="mb-8 relative pl-6 border-l-4 border-amber-400">
                  <Quote className="absolute -top-2 -left-2 text-amber-400 fill-amber-400 opacity-20 transform -scale-x-100" size={48} />
                  <p className="text-2xl font-serif italic text-slate-700 font-medium">"{person.quote}"</p>
              </div>
              <div className="mb-8">
                  <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Their Story</h3>
                  <p className="text-lg text-slate-800 leading-relaxed font-medium">{person.story}</p>
              </div>
              <div className="bg-amber-100 p-6 rounded-2xl border border-amber-200 mb-8 flex gap-4 items-start">
                  <div className="bg-amber-400 text-white p-2 rounded-full shrink-0">
                      <Star size={20} fill="white" />
                  </div>
                  <div>
                      <h4 className="font-black text-amber-800 uppercase text-sm mb-1">Did You Know?</h4>
                      <p className="text-amber-900 font-medium">{person.fact}</p>
                  </div>
              </div>
              
              
              <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                      <Image src={person.images[1]} alt="Action" fill className="object-cover transition duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white font-bold text-sm">In Action</span>
                      </div>
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                      <Image src={person.images[2]} alt="Legacy" fill className="object-cover transition duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white font-bold text-sm">Legacy</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}