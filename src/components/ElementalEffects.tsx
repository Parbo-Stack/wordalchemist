import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ElementType } from '../types/game';

interface ElementalEffectProps {
  element: ElementType;
  position: { x: number; y: number };
  onComplete: () => void;
}

export const ElementalEffect: React.FC<ElementalEffectProps> = ({
  element,
  position,
  onComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = Array.from({ length: 10 }).map((_, i) => {
      const particle = document.createElement('div');
      particle.className = `absolute w-2 h-2 rounded-full ${getElementColor(element)}`;
      containerRef.current?.appendChild(particle);
      particlesRef.current[i] = particle;
      return particle;
    });

    particles.forEach((particle, i) => {
      gsap.fromTo(
        particle,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1
        },
        {
          x: (Math.random() - 0.5) * 100,
          y: -100 * Math.random(),
          scale: 0,
          opacity: 0,
          duration: 1 + Math.random(),
          ease: "power2.out",
          delay: i * 0.1,
          onComplete: i === particles.length - 1 ? onComplete : undefined
        }
      );
    });

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, [element, onComplete]);

  const getElementColor = (element: ElementType) => {
    switch (element) {
      case 'fire': return 'bg-red-500';
      case 'water': return 'bg-blue-500';
      case 'earth': return 'bg-amber-500';
      case 'air': return 'bg-slate-500';
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none w-20 h-20"
      style={{ left: position.x - 40, top: position.y - 40 }}
    />
  );
};