import { GameLevel } from '@/components/games/DragDropGame';

export const animalHomesData: GameLevel = {
  id: 'homes-1',
  successMessage: "You did it! All animals are home safe.", 
  draggables: [
    { id: 'lion', name: 'Lion', img: '/images/lion.png', matchId: 'home-savanna' },
    { id: 'fish', name: 'Clownfish', img: '/images/fish.png', matchId: 'home-ocean' },
    { id: 'monkey', name: 'Monkey', img: '/images/monkey.png', matchId: 'home-jungle' },
    { id: 'camel', name: 'Camel', img: '/images/camel.png', matchId: 'home-desert' },
    { id: 'tarantula', name: 'Tarantula', img: '/images/Tarantula.png', matchId: 'home-cave' },
  ],
  targets: [
    { id: 'home-savanna', name: 'Savanna', img: '/images/savanna-icon.png' },
    { id: 'home-ocean', name: 'Ocean', img: '/images/ocean-icon.png' },
    { id: 'home-jungle', name: 'Jungle', img: '/images/bg-jungle-icon.png' },
    { id: 'home-desert', name: 'Desert', img: '/images/desert-icon.png' },
    { id: 'home-cave', name: 'Cave', img: '/images/cave-bg.png' },
  ]
};