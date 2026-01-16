'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode, useState, useEffect } from 'react';
import styles from './PicturesPage.module.css';

// Hook to detect if component has mounted (prevents hydration mismatch)
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

type AnimatedGalleryHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedGalleryHeader({ children, className }: AnimatedGalleryHeaderProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <header className={className}>{children}</header>;
  }

  return (
    <motion.header
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.header>
  );
}

type GalleryImage = {
  _id: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  width: number;
  height: number;
};

type AnimatedGalleryGridProps = {
  images: GalleryImage[];
};

export function AnimatedGalleryGrid({ images }: AnimatedGalleryGridProps) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className={styles.photosGrid}>
        {images.map((pic) => (
          <div key={pic._id} className={styles.photoCard}>
            <div className={styles.photoImageWrapper}>
              <Image
                src={pic.imageUrl}
                alt={pic.altText}
                width={pic.width}
                height={pic.height}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.photoImage}
              />
            </div>
            {pic.caption && <p className={styles.photoCaption}>{pic.caption}</p>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={styles.photosGrid}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {images.map((pic) => (
        <motion.div
          key={pic._id}
          className={styles.photoCard}
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.95 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
        >
          <div className={styles.photoImageWrapper}>
            <Image
              src={pic.imageUrl}
              alt={pic.altText}
              width={pic.width}
              height={pic.height}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.photoImage}
            />
          </div>
          {pic.caption && <p className={styles.photoCaption}>{pic.caption}</p>}
        </motion.div>
      ))}
    </motion.div>
  );
}
