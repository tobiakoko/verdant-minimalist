import styles from '../ui/components/ResearchPage.module.css';
import { fetchTenantData, tenantFilter } from '@/app/lib/sanity';
import { PortableText } from '@portabletext/react';

// --- Types ---
type ResearchContent = {
  pageContent: any[];
};

// --- Data Fetching (Multi-tenant aware) ---
async function getResearchContent(): Promise<ResearchContent | null> {
  const filter = tenantFilter();
  const researchQuery = `*[_type == "researchPage" ${filter}][0]`;
  return fetchTenantData<ResearchContent | null>(researchQuery);
}

export default async function ResearchPage() {
  const data = await getResearchContent();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>Research</h1>
          <p className={styles.subtitle}>
            A description of our most current research that cuts across biophysics, chemistry, and more.
          </p>
        </header>

        {/* Main Content */}
        <section className={styles.main}>
          <div className={styles.content}>
            {data && data.pageContent ? (
              <PortableText value={data.pageContent} />
            ) : (
              <p>Content is being prepared and will be available soon.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
