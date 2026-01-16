import Image from 'next/image';
import styles from '../ui/components/BookPage.module.css';
import { urlFor, fetchTenantData, tenantFilter } from '@/app/lib/sanity';

// --- Type Definition ---
type BookContent = {
  bookTitle: string;
  bookCover: any;
  amazonLink: string;
  cambridgeLink: string;
  description: string;
};

// --- Data Fetching (Multi-tenant aware) ---
async function getBookContent(): Promise<BookContent | null> {
  const filter = tenantFilter();
  const bookQuery = `*[_type == "bookPage" ${filter}][0]`;
  return fetchTenantData<BookContent | null>(bookQuery);
}

export default async function BookPage() {
  const book = await getBookContent();

  // This check prevents the page from crashing if no content is published.
  if (!book || !book.bookTitle) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Book</h1>
          <p className={styles.subtitle}>Content coming soon.</p>
        </header>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{book.bookTitle}</h1>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.purchaseSection}>
          <Image
            src={urlFor(book.bookCover).width(400).url()}
            alt={`Book cover for ${book.bookTitle}`}
            width={400}
            height={500}
            priority
            className={styles.bookImage}
          />
          <div className={styles.buttonGroup}>
            <a
              href={book.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.orderButton}
            >
              Order on Amazon
            </a>
            <a
              href={book.cambridgeLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.orderButton} ${styles.secondaryButton}`}
            >
              Order on Cambridge Press
            </a>
          </div>
        </div>

        <section className={styles.descriptionSection}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.descriptionText}>{book.description}</p>
        </section>
      </main>
    </div>
  );
}