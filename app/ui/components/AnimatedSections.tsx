'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerContainer, staggerItem, viewportSettings, fadeInUpShort } from '@/app/lib/animations';

type AnimatedGridProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedGrid({ children, className }: AnimatedGridProps) {
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={staggerContainer}
    >
      {childArray.map((child, index) => (
        <motion.div key={index} variants={staggerItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

type AnimatedStatsProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedStats({ children, className }: AnimatedStatsProps) {
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

type AnimatedSectionHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedSectionHeader({ children, className }: AnimatedSectionHeaderProps) {
  return (
    <motion.header
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={fadeInUpShort}
    >
      {children}
    </motion.header>
  );
}

type AnimatedListProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedList({ children, className }: AnimatedListProps) {
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
