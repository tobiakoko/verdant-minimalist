import Link from 'next/link';
import styles from '../ui/components/LegalPage.module.css';
import { fetchTenantData, tenantFilter } from '@/app/lib/sanity';
import { PortableText } from '@portabletext/react';

// --- Types ---
type LegalPageContent = {
  title: string;
  lastUpdated?: string;
  content?: any[];
};

// --- Data Fetching (Multi-tenant aware) ---
async function getPrivacyContent(): Promise<LegalPageContent | null> {
  const filter = tenantFilter();
  const privacyQuery = `*[_type == "legalPage" && pageType == "privacy" ${filter}][0]{
    title,
    lastUpdated,
    content
  }`;
  return fetchTenantData<LegalPageContent | null>(privacyQuery);
}

export default async function PrivacyPage() {
  const data = await getPrivacyContent();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>{data?.title || 'Privacy Policy'}</h1>
          {data?.lastUpdated && (
            <p className={styles.lastUpdated}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </header>

        {/* Main Content */}
        <section className={styles.main}>
          <div className={styles.content}>
            {data?.content ? (
              <PortableText value={data.content} />
            ) : (
              <div className={styles.placeholder}>
                <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <h2 className={styles.placeholderTitle}>Privacy Policy</h2>
                <p className={styles.placeholderText}>
                  This page will display your privacy policy once it has been added to the content management system.
                </p>
                <p className={styles.placeholderNote}>
                  <strong>For administrators:</strong> Add your privacy policy content in Sanity Studio under &quot;Legal Pages&quot;.
                </p>
              </div>
            )}
          </div>

          <Link href="/" className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </section>
      </div>
    </div>
  );
}
