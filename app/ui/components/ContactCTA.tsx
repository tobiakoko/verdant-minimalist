import Link from 'next/link';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  return (
    <section className={styles.ctaContainer}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaHeading}>
          Interested in Our Research?
        </h2>
        <p className={styles.ctaText}>
          Follow our work, explore our publications, or get in touch to discuss potential collaborations.
        </p>
        <Link href="/contact" className={styles.ctaButton}>
          Contact Us
        </Link>
      </div>
    </section>
  );
}
