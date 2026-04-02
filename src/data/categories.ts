export type CategoryItem = {
  label: string;
  img: string;
};

export type Category = {
  title: string;
  color: string;
  items: CategoryItem[];
};

export const categoriesData: Record<string, Category> = {
  animals: {
    title: 'Animals',
    color: 'bg-green-600',
    items: [
      { label: 'Meet the Animals', img: '/images/guess-the-animal.png' },
      { label: 'Animal Homes', img: '/images/animal-homes.png' },
      { label: 'Wild vs Domestic', img: '/images/pet.png' },
      { label: 'Animal Diets', img: '/images/animal-diet.png' },
      { label: 'Fastest & Biggest', img: '/images/trophy.png' },
      { label: 'Animal Sounds', img: '/images/roar.png' },
      { label: 'Reptiles & Bugs', img: '/images/reptiles.png' },
    ]
  },
  stem: {
    title: 'S.T.E.M.',
    color: 'bg-blue-600',
    items: [
      { label: 'Human Body', img: '/images/menu-body.png' },
      { label: 'Science Lab', img: '/images/menu-flask.png' },
      { label: 'Simple Machines', img: '/images/menu-gears.png' },
      { label: 'Build a Robot', img: '/images/menu-robot.png' },
      { label: 'Math Playground', img: '/images/menu-math.png' },
      { label: 'Coding Logic', img: '/images/menu-code.png' },
      { label: 'Space & Planets', img: '/images/menu-rocket.png' },
    ]
  },
  arts: {
    title: 'Arts & Music',
    color: 'bg-pink-600',
    items: [
      { label: 'Draw & Color Studio', img: '/images/menu-draw.png' },
      { label: 'Paint with Colors', img: '/images/menu-paint.png' },
      { label: 'Shapes & Patterns', img: '/images/menu-shapes.png' },
      { label: 'Create a Character', img: '/images/menu-character.png' },
      { label: 'Music & Rhythm', img: '/images/menu-music.png' },
      { label: 'Crafts & DIY Corner', img: '/images/menu-crafts.png' },
      { label: 'Art Around the World', img: '/images/menu-world-art.png' },
    ]
  },
  reading: {
    title: 'Reading & Writing',
    color: 'bg-yellow-600',
    items: [
      { label: 'Learn to Read', img: '/images/menu-phonics.png' },
      { label: 'Story Time Library', img: '/images/menu-library.png' },
      { label: 'Write Your Name', img: '/images/menu-pencil.png' },
      { label: 'Spelling Games', img: '/images/menu-abc-blocks.png' },
      { label: 'Build a Sentence', img: '/images/menu-puzzle-words.png' },
      { label: 'Create Your Own Story', img: '/images/menu-story-book.png' },
      { label: 'Word Explorer', img: '/images/menu-magnify.png' },
    ]
  },
  people: {
    title: 'People',
    color: 'bg-purple-700',
    items: [
      { label: 'Dr. Kwame Nkrumah', img: '/images/menu-nkrumah.png' },
      { label: 'Nelson Mandela', img: '/images/menu-mandela.png' },
      { label: 'Funmilayo R. Kuti', img: '/images/menu-funmilayo.png' },
      { label: 'Nikola Tesla', img: '/images/menu-tesla.png' },
      { label: 'Maya Angelou', img: '/images/menu-angelou.png' },
      { label: 'Elon Musk', img: '/images/menu-musk.png' },
      { label: 'Marie Curie', img: '/images/menu-curie.png' },
    ]
  },
  places: {
    title: 'Places',
    color: 'bg-teal-600',
    items: [
      { label: 'Africa', img: '/images/menu-africa.png' },
      { label: 'Asia', img: '/images/menu-asia.png' },
      { label: 'Europe', img: '/images/menu-europe.png' },
      { label: 'North America', img: '/images/menu-north-america.png' },
      { label: 'South America', img: '/images/menu-south-america.png' },
      { label: 'Australia', img: '/images/menu-australia.png' },
      { label: 'Antarctica', img: '/images/menu-antarctica.png' },
    ]
  },
  history: {
    title: 'History',
    color: 'bg-amber-700',
    items: [
      { label: 'Benjamin Franklin', img: '/images/history.png' },
      { label: 'Albert Einstein', img: '/images/menu-einstein.png' },
      { label: 'Ancient Civilizations', img: '/images/menu-pyramid.png' },
      { label: 'Great Inventions', img: '/images/menu-bulb.png' },
      { label: 'Historical Events', img: '/images/menu-calendar.png' },
      { label: 'Explorers', img: '/images/menu-compass.png' },
      { label: 'History Through Time', img: '/images/menu-hourglass.png' },
    ]
  },
  careers: {
    title: 'Careers',
    color: 'bg-indigo-900',
    items: [
      { label: 'Doctors & Healthcare', img: '/images/menu-doctor.png' },
      { label: 'Engineers & Builders', img: '/images/menu-hardhat.png' },
      { label: 'Scientists & Tech', img: '/images/menu-scientist.png' },
      { label: 'Artists & Creators', img: '/images/menu-artist.png' },
      { label: 'Community Helpers', img: '/images/menu-badge.png' },
      { label: 'Chefs & Bakers', img: '/images/menu-chef.png' },
      { label: 'Pilots & Astronauts', img: '/images/menu-pilot.png' },
    ]
  },
  games: {
    title: 'Games & Fun',
    color: 'bg-lime-600',
    items: [
      { label: 'World Explorer', img: '/images/world-explorer.png' },
      { label: 'Spelling Bee', img: '/images/spelling-bee.png' },
      { label: 'Mini Puzzle', img: '/images/puzzle.png' },
      { label: 'Match Pairs', img: '/images/match-thepairs.png' },
      { label: 'Quiz Time', img: '/images/fun-quiz.png' },
      { label: 'Word Play', img: '/images/word-play.png' },
      { label: 'Guess The Animal', img: '/images/guess-the-animal.png' },
    ]
  },
  howThingsWork: {
    title: 'How Things Work',
    color: 'bg-red-700',
    items: [
      { label: 'Inside a Car', img: '/images/menu-car.png' },
      { label: 'Computers & Internet', img: '/images/menu-wifi.png' },
      { label: 'Everyday Machines', img: '/images/menu-toaster.png' },
      { label: 'Flight & Planes', img: '/images/menu-plane.png' },
      { label: 'Water & Pipes', img: '/images/menu-faucet.png' },
      { label: 'How Movies are Made', img: '/images/menu-camera.png' },
      { label: 'Electricity & Power', img: '/images/menu-bulb1.png' },
    ]
  },
};