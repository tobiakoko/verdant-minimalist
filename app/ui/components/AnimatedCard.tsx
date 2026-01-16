'use client';

import { motion } from 'framer-motion';
import { fadeInUpShort, cardHover, imageZoom, viewportSettings } from '@/app/lib/animations';
import { ReactNode } from 'react';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      }}
      whileHover="hover"
    >
      {children}
    </motion.div>
  );
}

type AnimatedImageProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedImage({ children, className }: AnimatedImageProps) {
  return (
    <motion.div className={className} variants={imageZoom}>
      {children}
    </motion.div>
  );
}

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={fadeInUpShort}
    >
      {children}
    </motion.section>
  );
}
