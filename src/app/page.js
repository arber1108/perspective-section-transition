'use client';
import { useEffect, useRef } from "react";
import { useScroll, useTransform, motion, useInView, spring, useAnimate } from 'framer-motion';
import Lenis from 'lenis';
import dynamic from 'next/dynamic'
import AnimatedBox from '@/components/Cards'
import Circle from '@/components/Circle'


const Scene2 = dynamic(() => import('@/components/Scene2/Poker3D'), {
    ssr: false,
})
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
})

export default function Home() {
  const { scrollYProgress } = useScroll(); // Page scroll progress


  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      console.log("Page scroll progress:", latest);
    });
  }, [scrollYProgress]);

  const container2 = useRef();

  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: container2,
    offset: ['start end', 'end start'],
  });
  
  useEffect( () => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

const circle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '100dvh',
  zIndex: 5,
  overflow: 'hidden',
  pointerEvents: 'none',
  color: '#fff',
}
  
  
  return (
    <main className="overflow-visible"> {/* or use inline style overflow: clip */}
      <div className="flex h-screen bg-black">
        <Scene />
      </div>
      <div className="relative  pt-[10vh]">
        <div className="sticky top-0  flex justify-center items-center">
            <AnimatedBox />
        </div>
      </div>
      <div ref={container2}>
        <Slide direction="left"  left="-40%" progress={scrollYProgress2}/>
        <Slide direction="right" left="-25%" progress={scrollYProgress2}/>
        <Slide direction="left"  left="-75%" progress={scrollYProgress2}/>
      </div>

      <Circle/>
      
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