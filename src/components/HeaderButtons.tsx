export function WindowBtn({ icon, isRed, onClick }: { icon: any, isRed?: boolean, onClick?: () => void }) {
  return (
      <button 
          onClick={onClick} 
          className={`w-6 h-6 flex items-center justify-center border-2 border-white/50 rounded shadow-[1px_1px_2px_rgba(0,0,0,0.3)] ${isRed ? 'bg-red-400 hover:bg-red-500 text-white' : 'bg-gray-200 hover:bg-white text-gray-700'}`}
      >
          {icon}
      </button>
  );
}

export function NavCircleBtn({ icon, onClick }: { icon: any, onClick?: () => void }) {
  return (
      <button 
          onClick={onClick}
          className="w-11 h-11 bg-[#F3F4F6] hover:bg-white rounded-full flex items-center justify-center border-2 border-white/80 text-gray-700 shadow-md transition-all active:scale-95"
      >
          {icon}
      </button>
  );
}