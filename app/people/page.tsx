import Image from 'next/image';
import Link from 'next/link';
import styles from '../ui/components/PeoplePage.module.css';
import { urlFor, fetchTenantData, tenantFilter } from '@/app/lib/sanity';
import { isValidExternalUrl } from '@/app/lib/utils';

// --- Type Definition ---
type Person = {
  _id: string;
  name: string;
  role: string;
  image?: any;
  status: 'PI' | 'Current' | 'Past';
  websiteUrl?: string;
  googleScholarUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
};

// --- Data Fetching (Multi-tenant aware) ---
async function getPeople(): Promise<Person[]> {
  const filter = tenantFilter();
  const peopleQuery = `*[_type == "person" ${filter}] | order(name asc) {
    _id,
    name,
    role,
    image,
    status,
    websiteUrl,
    googleScholarUrl,
    twitterUrl,
    linkedinUrl
  }`;
  return fetchTenantData<Person[]>(peopleQuery);
}

export default async function PeoplePage() {
  const peopleData = await getPeople();

  const principalInvestigator = peopleData.find(p => p.status === 'PI');
  const currentMembers = peopleData.filter(p => p.status === 'Current');
  const placeholderImage = '/images/member-placeholder.jpg';

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>Our Team</h1>
          <p className={styles.subtitle}>Meet the researchers driving our work forward.</p>
        </header>

        <main className={styles.main}>
          {/* Principal Investigator Section */}
          {principalInvestigator && (
            <section className={styles.piSection}>
              <h2 className={styles.piHeading}>Principal Investigator</h2>
              <div className={styles.piContent}>
                <div className={styles.piImageWrapper}>
                  <Image
                    src={principalInvestigator.image ? urlFor(principalInvestigator.image).width(320).height(320).quality(90).url() : placeholderImage}
                    alt={`Portrait of ${principalInvestigator.name}`}
                    width={160}
                    height={160}
                    className={styles.piImage}
                  />
                </div>
                <div className={styles.piInfo}>
                  <h3 className={styles.piName}>{principalInvestigator.name}</h3>
                  <p className={styles.piTitle}>{principalInvestigator.role}</p>
                  {(isValidExternalUrl(principalInvestigator.websiteUrl) || isValidExternalUrl(principalInvestigator.googleScholarUrl) || isValidExternalUrl(principalInvestigator.twitterUrl) || isValidExternalUrl(principalInvestigator.linkedinUrl)) && (
                    <div className={styles.piSocials}>
                      {isValidExternalUrl(principalInvestigator.websiteUrl) && (
                        <a href={principalInvestigator.websiteUrl} target="_blank" rel="noopener noreferrer" className={styles.piSocialLink} title="Website">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>
                        </a>
                      )}
                      {isValidExternalUrl(principalInvestigator.googleScholarUrl) && (
                        <a href={principalInvestigator.googleScholarUrl} target="_blank" rel="noopener noreferrer" className={styles.piSocialLink} title="Google Scholar">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                          </svg>
                        </a>
                      )}
                      {isValidExternalUrl(principalInvestigator.twitterUrl) && (
                        <a href={principalInvestigator.twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.piSocialLink} title="X (Twitter)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                      {isValidExternalUrl(principalInvestigator.linkedinUrl) && (
                        <a href={principalInvestigator.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.piSocialLink} title="LinkedIn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Current Members Section */}
          <section className={styles.membersSection}>
            <h2 className={styles.sectionHeading}>Current Members</h2>
            <div className={styles.membersGrid}>
              {currentMembers.map((member) => {
                const hasLinks = isValidExternalUrl(member.websiteUrl) || isValidExternalUrl(member.googleScholarUrl) || isValidExternalUrl(member.twitterUrl) || isValidExternalUrl(member.linkedinUrl);
                return (
                  <div key={member._id} className={styles.memberCard}>
                    <div className={styles.memberImageWrapper}>
                      <Image
                          src={member.image ? urlFor(member.image).width(560).height(750).quality(85).url() : placeholderImage}
                          alt={`Portrait of ${member.name}`}
                          width={280}
                          height={375}
                          className={styles.memberImage}
                        />
                    </div>
                    <div className={styles.memberInfo}>
                      <h3 className={styles.memberName}>{member.name}</h3>
                      <p className={styles.memberRole}>{member.role}</p>
                      {hasLinks && (
                        <div className={styles.memberSocials}>
                          {isValidExternalUrl(member.websiteUrl) && (
                            <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Website">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                              </svg>
                            </a>
                          )}
                          {isValidExternalUrl(member.googleScholarUrl) && (
                            <a href={member.googleScholarUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Google Scholar">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                              </svg>
                            </a>
                          )}
                          {isValidExternalUrl(member.twitterUrl) && (
                            <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="X (Twitter)">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                            </a>
                          )}
                          {isValidExternalUrl(member.linkedinUrl) && (
                            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="LinkedIn">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Past Members Link */}
          <div className={styles.pastMembersSection}>
            <Link href="/people/past-members" className={styles.pastMembersLink}>
              View past members &rarr;
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
