import Image from 'next/image';
import Link from 'next/link';
import styles from '../ui/components/NewsPage.module.css';
import { urlFor, fetchTenantData, tenantFilter } from '@/app/lib/sanity';

// --- Type Definition ---
type NewsArticle = {
  _id: string;
  slug: { current: string };
  title: string;
  publicationDate: string;
  author: string;
  summary: string;
  featuredImage?: any;
};

// --- Data Fetching (Multi-tenant aware) ---
async function getNews(): Promise<NewsArticle[]> {
  const filter = tenantFilter();
  const newsQuery = `*[_type == "newsArticle" ${filter}] | order(publicationDate desc) {
    _id,
    slug,
    title,
    publicationDate,
    author,
    summary,
    featuredImage
  }`;
  return fetchTenantData<NewsArticle[]>(newsQuery);
}

export default async function NewsPage() {
  const articles = await getNews();
  const placeholderImage = '/images/news-placeholder.jpg';

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.newsSection}>
        <div className={styles.sectionContainer}>
          <header className={styles.pageHeader}>
            <h1 className={styles.sectionHeading}>Lab News</h1>
            <p className={styles.subtitle}>Updates on our research, publications, and people.</p>
          </header>

          <div className={styles.newsGrid}>
            {articles.map((article) => (
              <Link key={article._id} href={`/news/${article.slug.current}`} className={styles.newsCardLink}>
                <div className={styles.newsCard}>
                  <div className={styles.newsImageWrapper}>
                    <Image
                      src={article.featuredImage ? urlFor(article.featuredImage).width(400).height(250).url() : placeholderImage}
                      alt={`Image for ${article.title}`}
                      width={400}
                      height={250}
                      className={styles.newsImage}
                    />
                  </div>
                  <div className={styles.newsCardContent}>
                    <p className={styles.newsDate}>
                      {new Date(article.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | {article.author}
                    </p>
                    <h2 className={styles.newsTitle}>{article.title}</h2>
                    <p className={styles.newsExcerpt}>{article.summary}</p>
                    <span className={styles.readMore}>Read More &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
