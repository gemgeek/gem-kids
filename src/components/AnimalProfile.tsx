import Image from 'next/image';
import { Volume2, MapPin, Utensils, Heart, ArrowLeft } from 'lucide-react';

interface AnimalProfileProps {
  onBack: () => void;
}

export default function AnimalProfile({ onBack }: AnimalProfileProps) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      
      
      <div className="relative w-full max-w-5xl h-125 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex border-4 border-[#84CC16]">
        
        
        <button 
            onClick={onBack}
            className="absolute top-4 left-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white hover:scale-110 transition-all shadow-md text-green-700"
        >
            <ArrowLeft size={32} />
        </button>

        
        <div className="w-1/2 relative bg-linear-to-b from-sky-300 to-green-400 overflow-visible flex items-center justify-center">
            
            <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full blur-xl opacity-60" />
            
            
            <div className="relative w-[120%] h-[80%] -ml-10 z-10 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <Image 
                    src="/images/lion.png" 
                    alt="Lion" 
                    fill 
                    className="object-contain"
                />
            </div>
        </div>

        
        <div className="w-1/2 p-8 flex flex-col justify-center gap-4 bg-[#F0FDF4]">
            
            
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-6xl font-black text-green-900 tracking-tight">LION</h1>
                    <span className="text-xl font-bold text-green-600 tracking-widest uppercase">Panthera Leo</span>
                </div>
                <button className="bg-green-100 p-3 rounded-full text-green-600 hover:bg-green-200 hover:scale-110 transition-all">
                    <Volume2 size={32} />
                </button>
            </div>

            
            <p className="text-lg text-gray-700 font-medium leading-snug">
                The Lion is known as the <span className="text-orange-600 font-bold">"King of the Jungle"</span> (even though they actually live in grasslands!). They are the only cats that live in groups called prides.
            </p>

            
            <div className="grid grid-cols-2 gap-3 mt-2">
                <StatBox icon={<MapPin size={20} />} label="Habitat" value="Savanna" color="bg-orange-100 text-orange-700" />
                <StatBox icon={<Utensils size={20} />} label="Diet" value="Carnivore (Meat)" color="bg-red-100 text-red-700" />
                <StatBox icon={<Heart size={20} />} label="Lifespan" value="10-14 Years" color="bg-blue-100 text-blue-700" />
                <StatBox icon={<Volume2 size={20} />} label="Sound" value="ROAR!" color="bg-yellow-100 text-yellow-700" />
            </div>

            
            <div className="mt-4 bg-[#FF9F1C] text-white p-4 rounded-xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform cursor-pointer">
                <div className="flex gap-2 items-center mb-1">
                    <span className="bg-white text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fun Fact</span>
                </div>
                <p className="font-bold text-lg leading-tight">
                    A lion's roar is so loud it can be heard from 5 miles (8 km) away! 🦁🔊
                </p>
            </div>

        </div>
      </div>
    </div>
  );
}


function StatBox({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl ${color}`}>
            <div className="bg-white/50 p-1.5 rounded-lg">{icon}</div>
            <div className="leading-none">
                <div className="text-xs opacity-70 font-bold uppercase mb-1">{label}</div>
                <div className="text-sm font-black">{value}</div>
            </div>
        </div>
    )
}