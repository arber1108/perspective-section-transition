'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Circle.module.css';

export default function Circles() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start']
  });

  // Animation values based on scroll progress
  const circle1X = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['0%', '-20%', '20%']
  );
  
  const circle1Y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['0%', '-15%', '15%']
  );

  const circle2X = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['0%', '25%', '-25%']
  );
  
  const circle2Y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['0%', '20%', '-10%']
  );

  const circle3X = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['0%', '-15%', '30%']
  );
  
  const circle3Y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['0%', '25%', '-20%']
  );

  // Rotation based on scroll
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 360]
  );

  // Scale based on scroll
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.2, 0.9]
  );

  return (
    <div 
      ref={targetRef}
      className={styles.circles} 
      data-state="8" 
      style={{ '--c-rotate': '365.835deg', '--c-rotate-inverse': '-121.945deg' }}
    >
      {/* Circle 1 */}
      <motion.div 
        className={`${styles.circle} ${styles.circle1}`} 
        style={{ 
          x: circle1X,
          y: circle1Y,
          rotate: rotate,
          scale: scale,
          opacity: 1 
        }}>
        <div className={styles.circle_inner}>
          <div className={styles.circle_border}>
            <span className={styles.circle_plus}>
              <span className={styles.circle_value} data-dividor="17"></span>
            </span>
            <span className={styles.circle_plus}>
              <span className={styles.circle_value} data-dividor="12"></span>
            </span>
            <span className={styles.circle_plus}>
              <span className={styles.circle_value} data-dividor="7"></span>
            </span>
            <span className={styles.circle_plus}>
              <span className={styles.circle_value} data-dividor="19"></span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Circle 2 */}
      <motion.div 
        className={`${styles.circle} ${styles.circle2}`} 
        style={{ 
          x: circle2X,
          y: circle2Y,
          rotate: rotate,
          scale: scale,
          opacity: 1 
        }}>
        <div className={styles.circle_inner}>
          <div className={styles.circle_border}>
            <span className={styles.circle_plus}></span>
            <span className={styles.circle_plus}></span>
          </div>
        </div>
      </motion.div>

      {/* Circle 3 */}
      <motion.div 
        className={`${styles.circle} ${styles.circle3}`} 
        style={{ 
          x: circle3X,
          y: circle3Y,
          rotate: rotate,
          scale: scale,
          opacity: 0.7 
        }}>
        <div className={styles.circle_inner}>
          <div className={styles.circle_border}></div>
        </div>
      </motion.div>
    </div>
  );
}
