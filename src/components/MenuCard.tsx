import Image from 'next/image';

interface MenuCardProps {
  label: string;
  image: string;
  shape: 'wide-left' | 'wide-right';
  align: 'image-left' | 'image-right';
  isLarge?: boolean;
  popOut?: boolean;
  onClick?: () => void; 
}

export default function MenuCard({ label, image, shape, align, isLarge, popOut, onClick }: MenuCardProps) {
  // Shape Logic
  const clipPathValue = shape === 'wide-left' 
      ? 'polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)' 
      : 'polygon(0% 15%, 100% 0%, 100% 100%, 0% 85%)';

  const flexDir = align === 'image-left' ? 'flex-row' : 'flex-row-reverse';

  return (
    <div className="relative h-28 w-full group cursor-pointer mb-1" onClick={onClick}>
      {/* Background Shape */}
      <div 
        className="absolute inset-0 bg-[#D9F99D]/90 border-2 border-[#BEF264] transition-all duration-300 group-hover:bg-[#2563EB] group-hover:border-[#60A5FA]"
        style={{ 
            clipPath: clipPathValue,
            filter: 'drop-shadow(4px 4px 4px rgba(0,0,0,0.15))'
        }}
      />
      
      {/* Content */}
      <div className={`relative h-full flex items-center justify-between px-2 ${flexDir}`}>
        <div className={`
            relative shrink-0 z-10
            ${isLarge ? 'w-40 h-40' : 'w-36 h-36'} 
            ${popOut && align === 'image-left' ? '-ml-10' : ''} 
            ${popOut && align === 'image-right' ? '-mr-10' : ''}
            transform group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl
        `}>
            <Image src={image} alt={label} fill className="object-contain" />
        </div>
        <span className={`
            font-bold text-xl md:text-2xl text-gray-900 group-hover:text-white leading-tight drop-shadow-sm flex-1
            ${align === 'image-left' ? 'text-right' : 'text-left'}
        `}>
            {label}
        </span>
      </div>
    </div>
  );
}