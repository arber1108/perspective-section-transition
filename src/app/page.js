'use client';
import { useEffect, useRef } from "react";
import { useScroll, useTransform, motion, useInView, spring } from 'framer-motion';
import Lenis from 'lenis';
import dynamic from 'next/dynamic'
import { useAnimate } from 'framer-motion';   // ⬅️ add this import

const Scene = dynamic(() => import('@/components/Scene'), {
    ssr: false,
})

export default function Home() {

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


  /* …your component boilerplate stays the same … */
  
  const AnimatedBox = () => {
    const cards   = [...Array(7).keys()];
    const total   = cards.length;
    const middle  = (total - 1) / 2;                // index 3

  /* --------------------------------------------------------------------------- */
    /* parameters – make the fan wider by turning up these three numbers           */
    const spreadStep  = 300;   // ⬅️ increase this (px) → cards move farther left / right
    const maxRotation = 45;    // ⬅️ increase this (deg) → outer cards tilt more
    const maxLift     = 120;    // ⬅️ increase this (px)  → centre card rises higher
    /* --------------------------------------------------------------------------- */
    const [scope, animate] = useAnimate();
    const handleExpand = async () => {
      await animate(scope.current, {
        x:          0,
        y:          0,
        rotate:     0,
        width:      '100vw',
        height:     '100vh',
        borderRadius: 0,
        zIndex:     999,
      }, { duration: 0.8, ease: 'easeInOut' });
    };
  
    return (
      <div ref={container} className="flex items-center justify-center w-full">
        <div className="relative w-full h-[600px] flex items-center justify-center">
          {cards.map((_, i) => {
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
                onClick={isMiddle ? handleExpand : undefined}
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
              />
            );
          })}
        </div>
      </div>
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

      <div className="relative  pt-[10vh]">
        <div className="sticky top-0 h-screen flex justify-center items-center">
            <AnimatedBox />
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