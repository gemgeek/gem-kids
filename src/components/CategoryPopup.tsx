import Image from 'next/image';
import { XCircle } from 'lucide-react';
import { categoriesData } from '../data/categories';


interface CategoryPopupProps {
  categoryKey: string;
  onClose: () => void;
  onItemClick?: (label: string) => void; 
}

export default function CategoryPopup({ categoryKey, onClose, onItemClick }: CategoryPopupProps) {
  const data = categoriesData[categoryKey];

  if (!data) return null;

  return (
    <div className={`relative w-full max-w-sm ${data.color} rounded-2xl border-4 border-white/50 shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200`}>
      
      <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg border-2 border-white z-50"
      >
          <XCircle size={24} />
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300 drop-shadow-md border-b-2 border-white/20 pb-2">
          {data.title}
      </h2>
      
      
      <ul className="space-y-3">
          {data.items.map((item, idx) => (
              <li 
                key={idx} 
                
                onClick={() => onItemClick && onItemClick(item.label)}
                className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/20 cursor-pointer transition-all group border border-transparent hover:border-white/30"
              >
                  <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                      <Image src={item.img} alt={item.label} fill className="object-contain" />
                  </div>
                  <span className="font-bold text-xl drop-shadow-sm">{item.label}</span>
              </li>
          ))}
      </ul>
    </div>
  );
}