import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '@/app/ui/components/NewsArticlePage.module.css';
import { urlFor, fetchTenantData, tenantFilter } from '@/app/lib/sanity';
import { PortableText } from '@portabletext/react';

// --- Type Definitions ---
type NewsArticle = { _id: string; title: string; publicationDate: string; author: string; featuredImage?: any; content: any[]; };

// --- Data Fetching (Multi-tenant aware) ---
async function getArticle(slug: string): Promise<NewsArticle> {
  const filter = tenantFilter();
  const singleArticleQuery = `*[_type == "newsArticle" && slug.current == $slug ${filter}][0]`;
  return fetchTenantData<NewsArticle>(singleArticleQuery, { slug });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params Promise to get the slug
  const { slug } = await params;
  const article = await getArticle(slug);
  const placeholderImage = '/images/news-placeholder.jpg';

  if (!article) {
    notFound();
  }

  return (
    // 1. Add the main page wrapper
    <div className={styles.pageWrapper}>
      {/* 2. Add the max-width page container */}
      <div className={styles.pageContainer}>
        
        {/* 3. Use the "pageHeader" class (replaces "header") */}
        <header className={styles.pageHeader}>
          {/* We remove the "kicker" as it's not in the new design */}
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.meta}>
            Posted on {new Date(article.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by {article.author}
          </p>
        </header>

        {/* 4. Use "main" as the article container (replaces "container") */}
        <main className={styles.main}>
          <Image
            src={article.featuredImage ? urlFor(article.featuredImage).width(1200).height(600).url() : placeholderImage}
            alt={`Featured image for ${article.title}`}
            width={1200}
            height={600}
            priority
            className={styles.featuredImage}
          />
          <div className={styles.content}>
            <PortableText value={article.content} />
          </div>
          <div className={styles.backLinkWrapper}>
            <Link href="/news" className={styles.backLink}>
              &larr; Back to All News
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}