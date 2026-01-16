'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomePage.module.css';
import { fadeInUp, scaleIn } from '@/app/lib/animations';

type AnimatedHeroProps = {
  heroData: {
    tagline: string;
    heading: string;
    headingAccent: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image: string | null;
  };
  ArrowRightIcon: React.ComponentType;
};

export default function AnimatedHero({ heroData, ArrowRightIcon }: AnimatedHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className={styles.heroSection} ref={ref}>
      <div className={styles.heroContainer}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.span
            className={styles.heroTagline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {heroData.tagline}
          </motion.span>

          <motion.h1
            className={styles.heroHeading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {heroData.heading}{' '}
            <span className={styles.heroHeadingAccent}>{heroData.headingAccent}</span>
          </motion.h1>

          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {heroData.description}
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href={heroData.ctaLink} className={styles.heroPrimaryCta}>
              {heroData.ctaText}
              <ArrowRightIcon />
            </Link>
            <Link href="/publications" className={styles.heroSecondaryCta}>
              View Publications
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.heroImageWrapper}
          style={{ y }}
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {heroData.image ? (
            <>
              <Image
                src={heroData.image}
                alt="Research lab"
                width={800}
                height={600}
                className={styles.heroImage}
                priority
              />
              <div className={styles.heroImageOverlay} />
            </>
          ) : (
            <div className={styles.heroImagePlaceholder}>
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
