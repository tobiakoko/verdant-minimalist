'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

type AnimatedPageProps = {
  children: ReactNode;
  className?: string;
};

// Hook to detect if component has mounted (prevents hydration mismatch)
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// Page wrapper - fades in on mount
export function AnimatedPage({ children, className }: AnimatedPageProps) {
  const mounted = useMounted();

  // Render without animation wrapper until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

type AnimatedHeaderProps = {
  children: ReactNode;
  className?: string;
};

// Page header - slides up with fade (subtle reveal)
export function AnimatedHeader({ children, className }: AnimatedHeaderProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <header className={className}>{children}</header>;
  }

  return (
    <motion.header
      className={className}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.header>
  );
}

type AnimatedMainProps = {
  children: ReactNode;
  className?: string;
};

// Main content - delayed slide up (subtle reveal)
export function AnimatedMain({ children, className }: AnimatedMainProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <main className={className}>{children}</main>;
  }

  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.main>
  );
}

type StaggeredGridProps = {
  children: ReactNode;
  className?: string;
};

// Grid with staggered children (subtle reveal)
export function StaggeredGrid({ children, className }: StaggeredGridProps) {
  const mounted = useMounted();
  const childArray = Array.isArray(children) ? children : [children];

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05,
          },
        },
      }}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: {
              opacity: 1,
              y: 0,
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

type AnimatedItemProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
};

// Individual animated item (for cards, list items, etc.) - subtle reveal
export function AnimatedItem({ children, className, delay = 0, index = 0 }: AnimatedItemProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: delay || index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

type ScrollRevealSectionProps = {
  children: ReactNode;
  className?: string;
};

// Section that reveals on scroll (subtle reveal)
export function ScrollRevealSection({ children, className }: ScrollRevealSectionProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.section>
  );
}

type AnimatedHeroContentProps = {
  children: ReactNode;
  className?: string;
};

// Hero/header content with staggered reveal (subtle reveal)
export function AnimatedHeroContent({ children, className }: AnimatedHeroContentProps) {
  const mounted = useMounted();
  const childArray = Array.isArray(children) ? children : [children];

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
          },
        },
      }}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
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
