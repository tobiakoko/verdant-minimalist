import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ui/components/HomePage.module.css';
import { urlFor, fetchTenantData, tenantFilter } from './lib/sanity';
import {
  AnimatedPage,
  AnimatedHeader,
  ScrollRevealSection,
  StaggeredGrid,
  AnimatedItem
} from './ui/components/AnimatedPage';

// --- Type Definitions ---
type NewsArticle = {
  _id: string;
  slug: { current: string };
  title: string;
  summary: string;
  publicationDate: string;
  featuredImage?: any;
};

type ResearchArea = {
  _key: string;
  title: string;
  description: string;
  icon?: string;
};

type FeaturedPublication = {
  _id: string;
  slug: { current: string };
  title: string;
  authors: string;
  journal: string;
  journalLink?: string;
  publicationDate: string;
};

type HomePageContent = {
  heroTagline?: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroDescription: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroImage?: any;
  researchAreasTitle?: string;
  researchAreas?: ResearchArea[];
  statsEnabled?: boolean;
  stats?: Array<{ _key: string; value: string; label: string }>;
};

// --- Data Fetching (Multi-tenant aware) ---
async function getHomePageData() {
  const filter = tenantFilter();

  const homePageQuery = `*[_type == "homePage" ${filter}][0]{
    heroTagline,
    heroHeading,
    heroHeadingAccent,
    heroDescription,
    heroCtaText,
    heroCtaLink,
    heroImage,
    researchAreasTitle,
    researchAreas,
    statsEnabled,
    stats
  }`;

  const latestNewsQuery = `*[_type == "newsArticle" ${filter}] | order(publicationDate desc) [0...3] {
    _id,
    slug,
    title,
    summary,
    publicationDate,
    featuredImage
  }`;

  const featuredPublicationsQuery = `*[_type == "publication" ${filter}] | order(publicationDate desc) [0...4] {
    _id,
    slug,
    title,
    authors,
    journal,
    journalLink,
    publicationDate
  }`;

  const [content, news, publications] = await Promise.all([
    fetchTenantData<HomePageContent | null>(homePageQuery),
    fetchTenantData<NewsArticle[]>(latestNewsQuery),
    fetchTenantData<FeaturedPublication[]>(featuredPublicationsQuery),
  ]);
  return { content, news, publications };
}

// --- Icon Components ---
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// Research area icons mapped by key
const researchIcons: { [key: string]: React.JSX.Element } = {
  microscope: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" /><path d="M8 6h4" /><path d="M13 10V4.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V10" />
    </svg>
  ),
  atom: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </svg>
  ),
  dna: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" /><path d="m17 6-2.5-2.5" /><path d="m14 8-1-1" />
      <path d="m7 18 2.5 2.5" /><path d="m3.5 14.5.5.5" /><path d="m20 9 .5.5" /><path d="m6.5 12.5 1 1" /><path d="m16.5 10.5 1 1" /><path d="m10 16 1.5 1.5" />
    </svg>
  ),
  brain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  flask: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.31" /><path d="M14 9.3V2" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.58 16.5h12.85" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
};

// Default placeholder image
const placeholderImage = '/images/news-placeholder.jpg';

export default async function HomePage() {
  const { content, news, publications } = await getHomePageData();

  // Fallback content if CMS not configured
  const heroData = {
    heading: content?.heroHeading || 'Research Lab',
    headingAccent: content?.heroHeadingAccent || 'Name',
    description: content?.heroDescription || 'We specialize in quantum physics, atomic research, and material science, pushing the boundaries of knowledge in the physical sciences.',
    ctaText: content?.heroCtaText || 'Explore Research',
    ctaLink: content?.heroCtaLink || '/research',
  };

  const researchAreas = content?.researchAreas || [
    { _key: '1', title: 'Quantum Physics', description: 'Exploring quantum phenomena at the atomic and subatomic level.', icon: 'atom' },
    { _key: '2', title: 'Material Science', description: 'Developing novel materials with extraordinary properties.', icon: 'microscope' },
    { _key: '3', title: 'Computational Methods', description: 'Advanced simulations and data-driven discovery.', icon: 'chart' },
  ];

  const stats = content?.stats || [
    { _key: '1', value: '150+', label: 'Publications' },
    { _key: '2', value: '25+', label: 'Team Members' },
    { _key: '3', value: '12M+', label: 'Research Funding' },
    { _key: '4', value: '50+', label: 'Collaborations' },
  ];

  return (
    <AnimatedPage className={styles.pageWrapper}>
      {/* Minimal Text Header */}
      <section className={styles.headerSection}>
        <div className={styles.headerContainer}>
          <AnimatedHeader className={styles.headerContent}>
            <h1 className={styles.headerTitle}>
              {heroData.heading}{' '}
              <span className={styles.headerAccent}>{heroData.headingAccent}</span>
            </h1>
            <p className={styles.headerDescription}>{heroData.description}</p>
            <div className={styles.headerCtas}>
              <Link href={heroData.ctaLink} className={styles.primaryCta}>
                {heroData.ctaText}
                <ArrowRightIcon />
              </Link>
              <Link href="/people" className={styles.secondaryCta}>
                Meet the Team
              </Link>
            </div>
          </AnimatedHeader>
        </div>
      </section>

      {/* Inline Stats */}
      {(content?.statsEnabled !== false) && (
        <ScrollRevealSection className={styles.statsSection}>
          <div className={styles.statsContainer}>
            {stats.map((stat: { _key: string; value: string; label: string }) => (
              <div key={stat._key} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </ScrollRevealSection>
      )}

      {/* Research Areas */}
      <ScrollRevealSection className={styles.researchSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {content?.researchAreasTitle || 'Research Focus'}
            </h2>
          </div>
          <StaggeredGrid className={styles.researchGrid}>
            {researchAreas.map((area: ResearchArea) => (
              <div key={area._key} className={styles.researchCard}>
                <div className={styles.researchIcon}>
                  {researchIcons[area.icon || 'atom'] || researchIcons.atom}
                </div>
                <div className={styles.researchContent}>
                  <h3 className={styles.researchTitle}>{area.title}</h3>
                  <p className={styles.researchDescription}>{area.description}</p>
                </div>
              </div>
            ))}
          </StaggeredGrid>
          <AnimatedItem delay={0.2} className={styles.sectionCta}>
            <Link href="/research" className={styles.linkCta}>
              Learn More About Our Research
              <ArrowRightIcon />
            </Link>
          </AnimatedItem>
        </div>
      </ScrollRevealSection>

      {/* Publications - Direct Links */}
      {publications && publications.length > 0 && (
        <ScrollRevealSection className={styles.publicationsSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Publications</h2>
            </div>
            <StaggeredGrid className={styles.publicationsList}>
              {publications.map((pub: FeaturedPublication) => (
                <a
                  key={pub._id}
                  href={pub.journalLink || `/publications/${pub.slug?.current}`}
                  target={pub.journalLink ? "_blank" : undefined}
                  rel={pub.journalLink ? "noopener noreferrer" : undefined}
                  className={styles.publicationItem}
                >
                  <div className={styles.publicationContent}>
                    <span className={styles.publicationDate}>
                      {new Date(pub.publicationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <h3 className={styles.publicationTitle}>{pub.title}</h3>
                    <p className={styles.publicationAuthors}>{pub.authors}</p>
                    <p className={styles.publicationJournal}>{pub.journal}</p>
                  </div>
                  <span className={styles.publicationLink}>
                    {pub.journalLink ? <ExternalLinkIcon /> : <ArrowRightIcon />}
                  </span>
                </a>
              ))}
            </StaggeredGrid>
            <AnimatedItem delay={0.2} className={styles.sectionCta}>
              <Link href="/publications" className={styles.linkCta}>
                View All Publications
                <ArrowRightIcon />
              </Link>
            </AnimatedItem>
          </div>
        </ScrollRevealSection>
      )}

      {/* News - Compact */}
      {news && news.length > 0 && (
        <ScrollRevealSection className={styles.newsSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Latest News</h2>
            </div>
            <StaggeredGrid className={styles.newsGrid}>
              {news.map((article: NewsArticle) => (
                <Link
                  key={article._id}
                  href={`/news/${article.slug.current}`}
                  className={styles.newsCard}
                >
                  <div className={styles.newsImageWrapper}>
                    <Image
                      src={
                        article.featuredImage
                          ? urlFor(article.featuredImage).width(300).height(200).url()
                          : placeholderImage
                      }
                      alt={article.title}
                      width={300}
                      height={200}
                      className={styles.newsImage}
                    />
                  </div>
                  <div className={styles.newsContent}>
                    <span className={styles.newsDate}>
                      {new Date(article.publicationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <h3 className={styles.newsTitle}>{article.title}</h3>
                    <p className={styles.newsSummary}>{article.summary}</p>
                  </div>
                </Link>
              ))}
            </StaggeredGrid>
            <AnimatedItem delay={0.2} className={styles.sectionCta}>
              <Link href="/news" className={styles.linkCta}>
                View All News
                <ArrowRightIcon />
              </Link>
            </AnimatedItem>
          </div>
        </ScrollRevealSection>
      )}

      {/* Contact CTA - Simple */}
      <ScrollRevealSection className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Interested in Our Research?</h2>
          <p className={styles.ctaDescription}>
            We're always looking for talented researchers and collaborators.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.primaryCta}>
              Get in Touch
            </Link>
            <Link href="/people" className={styles.secondaryCta}>
              Meet Our Team
            </Link>
          </div>
        </div>
      </ScrollRevealSection>
    </AnimatedPage>
  );
}
