import { GameLevel } from '@/components/games/DragDropGame';

export const wildDomesticData: GameLevel = {
  id: 'wild-domestic-1',
  draggables: [
    { id: 'lion', name: 'Lion', img: '/images/lion.png', matchId: 'wild-savanna' },
    { id: 'dog', name: 'Dog', img: '/images/dog.png', matchId: 'domestic-house' },
    { id: 'cat', name: 'Cat', img: '/images/cat.png', matchId: 'domestic-sofa' },
    { id: 'zebra', name: 'Zebra', img: '/images/zebra.png', matchId: 'wild-plains' },
    { id: 'whale', name: 'Whale', img: '/images/whale.png', matchId: 'wild-ocean' },
  ],
  targets: [
    { id: 'wild-savanna', name: 'Wild (Savanna)', img: '/images/savanna-icon.png' },
    { id: 'wild-plains', name: 'Wild (Plains)', img: '/images/savanna-icon.png' }, 
    { id: 'domestic-house', name: 'Domestic (Dog House)', img: '/images/dog-house.png' },
    { id: 'domestic-sofa', name: 'Domestic (Home)', img: '/images/sofa.png' },
    { id: 'wild-ocean', name: 'Wild (Ocean)', img: '/images/underwater-bg.png' },
  ]
};