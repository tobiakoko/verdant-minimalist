'use client';

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import styles from "./Layout.module.css";
import ThemeToggle from "./ThemeToggle";

type SiteSettings = {
  labName?: string;
  labNameAccent?: string;
};

const navLinks = [
  { href: '/research', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/people', label: 'People' },
  { href: '/news', label: 'News' },
  { href: '/pictures', label: 'Gallery' },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && menuOpen) {
      setMenuOpen(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link href="/" className={styles.navLogo} aria-label="Go to homepage">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 17L12 22L22 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 12L12 17L22 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span>
            {settings.labName || "Research"}
            {settings.labNameAccent && (
              <span className={styles.navLogoAccent}> {settings.labNameAccent}</span>
            )}
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA and Theme Toggle */}
        <div className={styles.navActions}>
          <ThemeToggle />
          <Link href="/contact" className={styles.navCta}>
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={styles.menuButtonLines}>
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen1 : ''}`} />
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen2 : ''}`} />
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen3 : ''}`} />
          </span>
        </button>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
          aria-hidden={!menuOpen}
        >
          <div 
            className={styles.mobileMenuOverlay} 
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav 
            className={styles.mobileMenuContent}
            aria-label="Mobile navigation"
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.mobileNavLinkActive : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={styles.mobileNavCta}
              style={{ animationDelay: `${navLinks.length * 50}ms` }}
              tabIndex={menuOpen ? 0 : -1}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
