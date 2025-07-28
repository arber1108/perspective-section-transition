'use client';
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useInView } from 'framer-motion';
import Lenis from 'lenis';
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/Scene'), {
    ssr: false,
})

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const box = {
    width: 280,  // Slightly narrower for better fan effect
    height: 400, // Standard playing card ratio
    borderRadius: '12px',
    backgroundColor: 'white',
    position: 'absolute',
    boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.3)',
    backfaceVisibility: 'hidden',
    willChange: 'transform, opacity',
    border: '1px solid rgba(0,0,0,0.1)',
    padding: '20px',
    boxSizing: 'border-box'
  }

  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  })


  useEffect( () => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  const AnimatedBox = ({ delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
  
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        style={box}
      />
    );
  };

  return (
    <main className="overflow-visible"> {/* or use inline style overflow: clip */}
      <div className="flex h-screen bg-black">
        <Scene />
      </div>
  
      <div ref={container}>
        <Slide direction="left"  left="-40%" progress={scrollYProgress}/>
        <Slide direction="right" left="-25%" progress={scrollYProgress}/>
        <Slide direction="left"  left="-75%" progress={scrollYProgress}/>
      </div>
  
      <div className="relative h-[300vh] pt-[10vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-visible">
          <div className="relative h-[450px] w-[1200px]">
            {[0, 1, 2, 3, 4].map((index) => {
              const totalCards = 5;
              const centerIndex = (totalCards - 1) / 2;
              const distanceFromCenter = index - centerIndex;
              
              // Wider rotation and spacing
              const rotation = distanceFromCenter * 12; // Increased rotation
              const xOffset = distanceFromCenter * 120; // Increased horizontal spread
              const yOffset = Math.abs(distanceFromCenter) * 5; // Slight vertical offset
              
              // Card values and suits
              const values = ['A', 'K', 'Q', 'J', '10'];
              const suits = ['♠', '♥', '♦', '♣'];
              const suit = suits[index % suits.length];
              const isRed = suit === '♥' || suit === '♦';
              
              return (
                <motion.div
                  key={index}
                  className="absolute inset-0 m-auto origin-bottom cursor-pointer"
                  initial={{ opacity: 0, y: 100, rotate: rotation }}
                  style={{
                    ...box,
                    opacity: useTransform(scrollYProgress, 
                      [index * 0.2, index * 0.2 + 0.2], 
                      [0, 1]
                    ),
                    y: useTransform(scrollYProgress, 
                      [index * 0.2, index * 0.2 + 0.2], 
                      [150, yOffset]
                    ),
                    x: xOffset,
                    rotate: rotation,
                    zIndex: hoveredCard === index ? 100 : index,
                    scale: useTransform(scrollYProgress, 
                      [index * 0.2, index * 0.2 + 0.2], 
                      [0.9, 1 - index * 0.01]
                    )
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 100, 
                    damping: 20,
                    delay: index * 0.1
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div 
                    className="w-full h-full flex flex-col justify-between p-4" 
                    style={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      color: isRed ? '#e53e3e' : 'black',
                      boxShadow: hoveredCard === index 
                        ? '0 20px 50px -10px rgba(0, 0, 0, 0.3)' 
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      transition: 'box-shadow 0.2s ease'
                    }}
                  >
                    <div className="text-3xl font-bold">{values[index % values.length]}</div>
                    <div className="text-5xl text-center my-4">{suit}</div>
                    <div className="text-3xl font-bold self-end transform rotate-180">
                      {values[index % values.length]}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

const Slide = (props) => {
  const direction = props.direction == 'left' ? -1 : 1;
  const translateX = useTransform(props.progress, [0, 1], [150 * direction, -150 * direction])
  return (
    <motion.div style={{x: translateX, left: props.left}} className="relative flex whitespace-nowrap">
      <Phrase text ="Fullstack Developer"/>
      <Phrase text ="Studying Computer Science"/>
      <Phrase text ="Arber Ademaj"/>
    </motion.div>
  )
}

const Phrase = ({text}) => {

  return (
    <div className={'px-5 flex gap-5 items-center'}>
      <p className='text-[7.5vw] text-white'>{text}</p>
    </div>
  )
}