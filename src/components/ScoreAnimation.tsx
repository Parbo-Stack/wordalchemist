import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ElementType } from '../types/game';
import confetti from 'canvas-confetti';

interface ScoreAnimationProps {
  score: number;
  position: { x: number; y: number };
  element: ElementType;
  onComplete: () => void;
  combos?: string[];
}

const elementColors = {
  fire: 'text-red-400',
  water: 'text-blue-400',
  earth: 'text-amber-400',
  air: 'text-slate-400',
  star: 'text-yellow-400',
  lightning: 'text-purple-400',
  crystal: 'text-pink-400'
};

export const ScoreAnimation: React.FC<ScoreAnimationProps> = ({
  score,
  position,
  element,
  onComplete,
  combos = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const combosRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scoreRef.current || !particlesRef.current) return;

    // Create particles
    const particles = Array.from({ length: 10 }).map(() => {
      const particle = document.createElement('div');
      particle.className = `absolute w-2 h-2 rounded-full ${elementColors[element]}`;
      particlesRef.current?.appendChild(particle);
      return particle;
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        if (score >= 500) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { x: position.x / window.innerWidth, y: position.y / window.innerHeight },
            colors: ['#818CF8', '#F472B6', '#34D399'],
          });
        }
        onComplete();
      }
    });

    // Animate score
    timeline.fromTo(
      scoreRef.current,
      {
        opacity: 0,
        scale: 0.5,
        y: 0
      },
      {
        opacity: 1,
        scale: 1.5,
        y: -50,
        duration: 0.3,
        ease: "back.out(1.7)"
      }
    ).to(scoreRef.current, {
      opacity: 0,
      y: -100,
      duration: 0.7,
      ease: "power2.out"
    });

    // Animate particles
    particles.forEach((particle, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const radius = 50;
      
      gsap.fromTo(
        particle,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1
        },
        {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          delay: i * 0.02
        }
      );
    });

    // Animate combos
    if (combos.length > 0 && combosRef.current) {
      timeline.fromTo(
        combosRef.current,
        {
          opacity: 0,
          scale: 0.5,
          y: 30
        },
        {
          opacity: 1,
          scale: 1.2,
          y: 0,
          duration: 0.3,
          ease: "back.out(1.7)"
        },
        "-=0.8"
      ).to(combosRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power2.out"
      });
    }

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, [position.x, position.y, onComplete, combos, score, element]);

  return (
    <div 
      ref={containerRef}
      className="absolute pointer-events-none z-50"
      style={{ 
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%)`
      }}
    >
      <div
        ref={scoreRef}
        className={`relative font-bold text-3xl ${elementColors[element]} glow-text text-center`}
      >
        +{score}
      </div>
      {combos.length > 0 && (
        <div
          ref={combosRef}
          className="relative text-xl font-magical text-yellow-300 glow-text text-center whitespace-nowrap"
        >
          {combos.join(' + ')}!
        </div>
      )}
      <div
        ref={particlesRef}
        className="relative"
      />
    </div>
  );
};