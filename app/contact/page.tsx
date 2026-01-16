import styles from '@/app/ui/components/ContactPage.module.css';
import Link from 'next/link';
import { fetchTenantData, tenantFilter } from '../lib/sanity';
import { PortableText } from '@portabletext/react';
import { isValidExternalUrl, isValidGoogleMapsEmbedUrl } from '../lib/utils';

// --- Icon Components ---
const MailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> );
const LocationIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );

// --- Type Definition ---
type ContactContent = {
  piName: string;
  email: string;
  labAddress: string;
  googleMapsLink: string;
  googleMapsEmbedUrl: string;
  guidanceText: any[];
};

// --- Data Fetching (Multi-tenant aware) ---
async function getContactContent(): Promise<ContactContent | null> {
  const filter = tenantFilter();
  const contactQuery = `*[_type == "contactPage" ${filter}][0]`;
  return fetchTenantData<ContactContent | null>(contactQuery);
}

export default async function ContactPage() {
  const data = await getContactContent();

  if (!data) return <div style={{padding: '4rem', textAlign: 'center'}}>Contact page content is not available yet. Please publish it in the CMS.</div>;

  return (
    // 1. Add the main page wrapper
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        {/* Page Header (This part was correct) */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>
            We are always looking for passionate new students and collaborators.
          </p>
        </header>
        
        {/* 3. Re-structured Main Content */}
        <main className={styles.main}>
          
          {/* 4. Use the "contactGrid" for the info cards */}
          <div className={styles.contactGrid}>
            
            {/* PI Info Card */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><MailIcon /></div>
              <h2 className={styles.infoCardTitle}>Principal Investigator</h2>
              <div className={styles.infoCardContent}>
                <p>{data.piName}</p>
                <a href={`mailto:${data.email}`}>{data.email}</a>
              </div>
            </div>

            {/* Lab Address Info Card */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><LocationIcon /></div>
              <h2 className={styles.infoCardTitle}>Lab Address</h2>
              <div className={styles.infoCardContent}>
                <p style={{whiteSpace: 'pre-line'}}>{data.labAddress}</p>
                {isValidExternalUrl(data.googleMapsLink) && (
                  <a href={data.googleMapsLink} target="_blank" rel="noopener noreferrer">
                    View on Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 5. Use the "mapSection" for the map - only render if URL is valid */}
          {isValidGoogleMapsEmbedUrl(data.googleMapsEmbedUrl) && (
            <section className={styles.mapSection}>
              <h2 className={styles.mapHeading}>Our Location</h2>
              <div className={styles.mapContainer}>
                <iframe
                  src={data.googleMapsEmbedUrl}
                  width="100%" height="100%"
                  allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Lab Location Map"
                ></iframe>
              </div>
            </section>
          )}

          {/* 6. Use the "additionalInfo" section for guidance */}
          <section className={styles.additionalInfo}>
            <div className={styles.additionalInfoContent}>
              {/* This h3 is styled by .additionalInfoContent h3 */}
              <h3>Information for Applicants</h3>
              {/* PortableText will be styled by .additionalInfoContent :global(p) */}
              <PortableText value={data.guidanceText} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}