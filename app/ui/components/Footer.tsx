import Link from 'next/link';
import styles from './Footer.module.css';
import { isValidExternalUrl } from '@/app/lib/utils';

type SiteSettings = {
    labName?: string;
    labNameAccent?: string;
    labNameDescription?: string;
    footerText?: string;
    showPrivacyPolicy?: boolean;
    privacyPolicyUrl?: string;
    showTerms?: boolean;
    termsUrl?: string;
};

const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
        {children}
    </a>
);

export default function Footer({ settings }: { settings: SiteSettings }) {
    const currentYear = new Date().getFullYear();

    // Default to showing legal links if not explicitly set to false
    const showPrivacy = settings?.showPrivacyPolicy !== false;
    const showTerms = settings?.showTerms !== false;
    const hasLegalLinks = showPrivacy || showTerms;

    return (
        <footer className={styles.footerWrapper}>
            <div className={styles.footerContainer}>
                <div className={styles.mainFooter}>
                    <div className={styles.footerAbout}>
                        <Link href="/" className={styles.footerLogo}>
                            {settings?.labName || 'Cavendish'} <span className={styles.logoAccent}>{settings?.labNameAccent || 'Lab'}</span>
                        </Link>
                        <p className={styles.footerDescription}>
                            {settings?.labNameDescription || 'Advancing the frontiers of physics and our understanding of the universe.'}
                        </p>
                        <div className={styles.socials}>
                            <SocialIcon href="#">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </SocialIcon>
                            <SocialIcon href="#">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.617l-5.21-6.817-6.044 6.817h-3.308l7.73-8.835-7.73-10.668h6.78l4.522 6.312 5.59-6.312z" /></svg>
                            </SocialIcon>
                        </div>
                    </div>

                    <div className={styles.footerLinksGrid}>
                        <div className={styles.footerColumn}>
                            <h4>Quick Links</h4>
                            <Link href="/research">Research</Link>
                            <Link href="/publications">Publications</Link>
                            <Link href="/pictures">Gallery</Link>
                        </div>
                        <div className={styles.footerColumn}>
                            <h4>About</h4>
                            <Link href="/news">News</Link>
                            <Link href="/people">Our Team</Link>
                            <Link href="/contact">Contact</Link>
                        </div>
                        <div className={styles.footerColumn}>
                            <h4>Resources</h4>
                            <Link href="https://www.cam.ac.uk/">University</Link>
                            <Link href="#">Careers</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottomBar}>
                    <p>{settings?.footerText || `© ${currentYear} The Research Group. All Rights Reserved.`}</p>
                    {hasLegalLinks && (
                        <div className={styles.legalLinks}>
                            {showPrivacy && (
                                settings?.privacyPolicyUrl && isValidExternalUrl(settings.privacyPolicyUrl) ? (
                                    <a href={settings.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
                                        Privacy Policy
                                    </a>
                                ) : (
                                    <Link href="/privacy">Privacy Policy</Link>
                                )
                            )}
                            {showTerms && (
                                settings?.termsUrl && isValidExternalUrl(settings.termsUrl) ? (
                                    <a href={settings.termsUrl} target="_blank" rel="noopener noreferrer">
                                        Terms & Conditions
                                    </a>
                                ) : (
                                    <Link href="/terms">Terms & Conditions</Link>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
