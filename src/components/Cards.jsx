'use client';
import { useEffect, useRef } from "react";
import { useScroll, useTransform, motion, useInView, spring, useAnimate } from 'framer-motion';
import Lenis from 'lenis';
import dynamic from 'next/dynamic'

const box = {
    width: 300,
    height: 500,
    borderRadius: '24px',
    backgroundColor: 'white',
    position: "sticky",
    boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.25)',
    backfaceVisibility: 'hidden',
    border: '1px solid rgba(0,0,0,0.1)'
}

const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Generate a consistent set of cards with better distribution
const generateCards = (count) => {
  const cards = [];
  const usedIndices = new Set();
  
  // Create a pool of all possible cards
  const allCards = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      allCards.push({
        suit: suits[i],
        rank: ranks[j],
        color: (suits[i] === '♥' || suits[i] === '♦') ? 'text-red-600' : 'text-black'
      });
    }
  }
  
  // Shuffle the deck using a deterministic algorithm
  const seed = 42;
  for (let i = allCards.length - 1; i > 0; i--) {
    const j = (i * seed) % (i + 1);
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }
  
  // Return the requested number of cards
  return allCards.slice(0, count);
};

const Card = ({ card, isMiddle }) => {
  return (
    <div className="w-full h-full p-6 flex flex-col justify-between">
      <div className={`text-4xl ${card.color} ${isMiddle ? 'opacity-100' : 'opacity-70'}`}>
        {card.rank}
        <br />
        {card.suit}
      </div>
      <div className={`text-6xl text-center ${card.color} ${isMiddle ? 'opacity-100' : 'opacity-70'}`}>
        {card.suit}
      </div>
      <div className={`text-4xl rotate-180 ${card.color} ${isMiddle ? 'opacity-100' : 'opacity-70'}`}>
        {card.rank}
        <br />
        {card.suit}
      </div>
    </div>
  );
};

const AnimatedBox = () => {
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  const cards = generateCards(7);
  const total = cards.length;
  const middle = (total - 1) / 2;                // index 3

  const spreadStep  = 300;   // ⬅️ increase this (px) → cards move farther left / right
  const maxRotation = 45;    // ⬅️ increase this (deg) → outer cards tilt more
  const maxLift     = 120;    // ⬅️ increase this (px)  → centre card rises higher
  const [scope, animate] = useAnimate();
  const handleExpand = async () => {
    await animate(scope.current, {
      rotate:"180deg",
    }, { duration: 0.8, ease: 'easeInOut' });
  };

  return (
    <div ref={container} className="flex items-center justify-center w-full">
      <div className="relative w-full h-[600px] flex items-center justify-center">
        {cards.map((card, i) => {
          const rel           = i - middle;
          const targetX       =  rel * spreadStep;
          const targetRotate  = (rel / middle) * maxRotation;
          const targetY       = -(1 - Math.abs(rel)/middle) * maxLift;

          const x      = useTransform(scrollYProgress, [0, 1], ['0px',  `${targetX}px`]);
          const y      = useTransform(scrollYProgress, [0, 1], ['0px',  `${targetY}px`]);
          const rotate = useTransform(scrollYProgress, [0, 1], ['0deg', `${targetRotate}deg`]);

          const isMiddle = i === middle;

          return (
            <motion.div
              key={i}
              ref={isMiddle ? scope : undefined}     // only centre card needs the ref
              onTap={isMiddle ? handleExpand : undefined}
              style={{
                ...box,
                position : 'absolute',
                x,
                y,
                rotate,
                zIndex   : total - Math.abs(rel),
                cursor   : isMiddle ? 'pointer' : 'default',
              }}
              whileHover={{ scale: 1.05, zIndex: total + 1 }}
            >
              <Card card={card} isMiddle={isMiddle} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedBox;