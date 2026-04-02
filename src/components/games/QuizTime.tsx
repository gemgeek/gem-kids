'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Trophy, CheckCircle, XCircle } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    question: "What is the biggest planet in our solar system?",
    options: ["Mars", "Jupiter", "Earth", "Saturn"],
    correctAnswer: "Jupiter"
  },
  {
    question: "How many legs does a spider have?",
    options: ["6", "8", "10", "4"],
    correctAnswer: "8"
  },
  {
    question: "What sweet food is made by bees?",
    options: ["Sugar", "Syrup", "Honey", "Chocolate"],
    correctAnswer: "Honey"
  },
  {
    question: "Which animal is known as 'Man's Best Friend'?",
    options: ["Cat", "Dog", "Horse", "Bird"],
    correctAnswer: "Dog"
  },
  {
    question: "What do caterpillars turn into?",
    options: ["Worms", "Butterflies", "Beetles", "Spiders"],
    correctAnswer: "Butterflies"
  },
  {
    question: "How many colors are there in a rainbow?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7"
  },
  {
    question: "What is the tallest animal in the world?",
    options: ["Elephant", "Giraffe", "Kangaroo", "Camel"],
    correctAnswer: "Giraffe"
  },
  {
    question: "Which precious stone is green?",
    options: ["Ruby", "Emerald", "Sapphire", "Diamond"],
    correctAnswer: "Emerald"
  },
  {
    question: "What is a baby kangaroo called?",
    options: ["Cub", "Pup", "Joey", "Calf"],
    correctAnswer: "Joey"
  },
  {
    question: "What do pandas love to eat the most?",
    options: ["Apples", "Bamboo", "Fish", "Carrots"],
    correctAnswer: "Bamboo"
  }
];

export default function QuizTime({ onBack }: { onBack: () => void }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const popSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);
    const tadaSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popSoundRef.current = new Audio('/sounds/pop.mp3');
        winSoundRef.current = new Audio('/sounds/win2.mp3');
        tadaSoundRef.current = new Audio('/sounds/tada.mp3');
    }, []);

    const playPop = () => popSoundRef.current?.play().catch(() => {});
    const playWin = () => winSoundRef.current?.play().catch(() => {});
    const playTada = () => tadaSoundRef.current?.play().catch(() => {});

    const handleAnswerClick = (option: string) => {
        if (isAnswered) return;

        setSelectedAnswer(option);
        setIsAnswered(true);

        const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
        const isCorrect = option === currentQuestion.correctAnswer;

        if (isCorrect) {
            playWin();
            setScore(prev => prev + 1);
        } else {
            playPop(); // Simple pop for wrong answer
        }

        // Wait a moment to show the result, then move to next question
        setTimeout(() => {
            if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsAnswered(false);
            } else {
                setGameOver(true);
                playTada();
            }
        }, 2000);
    };

    const resetGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setGameOver(false);
    };

    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

    return (
        <div className="fixed inset-0 z-100 bg-yellow-500 font-sans select-none">
            <div className="absolute inset-0 z-0">
                <Image src="/images/bg-game-arcade.jpg" alt="Background" fill className="object-cover opacity-30 mix-blend-overlay" priority />
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition text-blue-600"><ArrowLeft size={28} /></button>
                <div className="bg-white px-6 py-2 rounded-full shadow-lg font-black text-xl text-blue-600">
                    Question: {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
                </div>
                <button onClick={resetGame} className="bg-white p-3 rounded-full shadow-lg text-blue-600 hover:scale-110 transition"><RefreshCw size={28} /></button>
            </div>

            {!gameOver ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-40 max-w-4xl mx-auto">
                    
                    {/* Score Tracker (Stars) */}
                    <div className="flex gap-2 mb-8">
                        {QUIZ_QUESTIONS.map((_, idx) => (
                            <div key={idx} className={`w-4 h-4 rounded-full ${idx < currentQuestionIndex ? 'bg-yellow-400' : 'bg-white/30'}`} />
                        ))}
                    </div>

                    {/* Question Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full text-center mb-8 transform transition-all duration-300">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
                            {currentQuestion.question}
                        </h2>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {currentQuestion.options.map((option, idx) => {
                            let buttonClass = "bg-white text-blue-600 hover:bg-blue-50 border-4 border-transparent";
                            let icon = null;

                            if (isAnswered) {
                                if (option === currentQuestion.correctAnswer) {
                                    buttonClass = "bg-green-500 text-white border-4 border-green-300 scale-105 shadow-[0_0_20px_rgba(34,197,94,0.5)]";
                                    icon = <CheckCircle className="absolute right-6 text-white" size={32} />;
                                } else if (option === selectedAnswer) {
                                    buttonClass = "bg-red-500 text-white border-4 border-red-300 scale-95 opacity-80";
                                    icon = <XCircle className="absolute right-6 text-white" size={32} />;
                                } else {
                                    buttonClass = "bg-gray-200 text-gray-400 opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerClick(option)}
                                    disabled={isAnswered}
                                    className={`relative flex items-center justify-center p-6 rounded-2xl shadow-xl font-black text-2xl md:text-3xl transition-all duration-300 ${buttonClass}`}
                                >
                                    {option}
                                    {icon}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Win Screen */
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/60 backdrop-blur-sm animate-in zoom-in">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md flex flex-col items-center border-t-8 border-blue-500">
                        <Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" />
                        <h2 className="text-4xl font-black text-blue-600 mb-2 uppercase">Quiz Complete!</h2>
                        <p className="text-xl text-gray-600 font-bold mb-8">
                            You scored <span className="text-3xl text-blue-600">{score}</span> out of {QUIZ_QUESTIONS.length}!
                        </p>
                        <div className="flex gap-4">
                            <button onClick={resetGame} className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                Try Again
                            </button>
                            <button onClick={onBack} className="bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition">
                                Arcade Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}