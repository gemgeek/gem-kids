import { GameLevel } from '@/components/games/DragDropGame';

export const animalDietsData: GameLevel = {
  id: 'diets-level-1',
  draggables: [
    { id: 'lion', name: 'Lion', img: '/images/lion.png', matchId: 'diet-meat' },
    { id: 'monkey', name: 'Monkey', img: '/images/monkey.png', matchId: 'diet-fruit' },
    { id: 'elephant', name: 'Elephant', img: '/images/elephant.png', matchId: 'diet-plants' },
    { id: 'penguin', name: 'Penguin', img: '/images/penguin.png', matchId: 'diet-fish' },
  ],
  targets: [
    { id: 'diet-meat', name: 'Meat Eater', img: '/images/meat.png' },     
    { id: 'diet-fruit', name: 'Fruit Eater', img: '/images/banana.png' }, 
    { id: 'diet-plants', name: 'Plant Eater', img: '/images/leaf.png' },   
    { id: 'diet-fish', name: 'Fish Eater', img: '/images/menu-fish.png' }, 
  ]
};