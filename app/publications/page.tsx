import styles from '@/app/ui/components/PublicationsPage.module.css';
import { fetchTenantData, tenantFilter } from '@/app/lib/sanity';
import {
  AnimatedPage,
  AnimatedHeader,
  ScrollRevealSection,
  StaggeredGrid,
} from '@/app/ui/components/AnimatedPage';

// --- Type Definition ---
type Publication = {
  _id: string;
  slug: { current: string };
  title: string;
  authors: string;
  journal: string;
  journalLink?: string;
  publicationDate: string;
};

// External Link Icon
const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// --- Data Fetching (Multi-tenant aware) ---
async function getPublications(): Promise<Publication[]> {
  const filter = tenantFilter();
  const publicationsQuery = `*[_type == "publication" ${filter}] | order(publicationDate desc) {
    _id,
    slug,
    title,
    authors,
    journal,
    journalLink,
    publicationDate
  }`;
  return fetchTenantData<Publication[]>(publicationsQuery);
}

const groupPublicationsByYear = (publications: Publication[]) => {
  return publications.reduce((acc: { [year: number]: Publication[] }, pub) => {
    const year = new Date(pub.publicationDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {});
};

export default async function PublicationsPage() {
  const publications = await getPublications();
  const groupedPublications = groupPublicationsByYear(publications);
  const sortedYears = Object.keys(groupedPublications).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <AnimatedPage className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        {/* Page Header */}
        <AnimatedHeader className={styles.pageHeader}>
          <h1 className={styles.title}>Publications</h1>
          <p className={styles.subtitle}>
            Our contributions to the scientific community.
          </p>
        </AnimatedHeader>

        {/* Main Content */}
        <main className={styles.main}>
          <div className={styles.publicationsList}>
            {sortedYears.map((year) => (
              <ScrollRevealSection key={year} className={styles.yearSection}>
                <h2 className={styles.yearHeader}>{year}</h2>
                <StaggeredGrid className={styles.publicationsGrid}>
                  {groupedPublications[parseInt(year)].map((pub) => (
                    <a
                      key={pub._id}
                      href={pub.journalLink || '#'}
                      target={pub.journalLink ? "_blank" : undefined}
                      rel={pub.journalLink ? "noopener noreferrer" : undefined}
                      className={styles.publicationLink}
                    >
                      <div className={styles.publicationContent}>
                        <h3 className={styles.publicationTitle}>{pub.title}</h3>
                        <p className={styles.authors}>{pub.authors}</p>
                        <p className={styles.journal}>
                          {pub.journal}, {new Date(pub.publicationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      {pub.journalLink && (
                        <span className={styles.externalIcon}>
                          <ExternalLinkIcon />
                        </span>
                      )}
                    </a>
                  ))}
                </StaggeredGrid>
              </ScrollRevealSection>
            ))}
          </div>
        </main>
      </div>
    </AnimatedPage>
  );
}
