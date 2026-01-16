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
async function getTermsContent(): Promise<LegalPageContent | null> {
  const filter = tenantFilter();
  const termsQuery = `*[_type == "legalPage" && pageType == "terms" ${filter}][0]{
    title,
    lastUpdated,
    content
  }`;
  return fetchTenantData<LegalPageContent | null>(termsQuery);
}

export default async function TermsPage() {
  const data = await getTermsContent();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>{data?.title || 'Terms & Conditions'}</h1>
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h2 className={styles.placeholderTitle}>Terms & Conditions</h2>
                <p className={styles.placeholderText}>
                  This page will display your terms and conditions once they have been added to the content management system.
                </p>
                <p className={styles.placeholderNote}>
                  <strong>For administrators:</strong> Add your terms content in Sanity Studio under &quot;Legal Pages&quot;.
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
