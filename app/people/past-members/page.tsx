import styles from '@/app/ui/components/PastMembersPage.module.css';
import Link from 'next/link';
import { fetchTenantData, tenantFilter } from '@/app/lib/sanity';

// --- Type Definition ---
type PastPerson = {
  _id: string;
  name: string;
  currentPosition?: string;
};

// --- Data Fetching (Multi-tenant aware) ---
async function getPastPeople(): Promise<PastPerson[]> {
  const filter = tenantFilter();
  const pastPeopleQuery = `*[_type == "person" && status == "Past" ${filter}] | order(name asc) {
    _id,
    name,
    currentPosition
  }`;
  return fetchTenantData<PastPerson[]>(pastPeopleQuery);
}

export default async function PastMembersPage() {
  const pastMembers = await getPastPeople();

  return (
    // 1. Add the main page wrapper
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        {/* Page Header (This part was correct) */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>Lab Alumni</h1>
          <p className={styles.subtitle}>We are proud of our former members and their accomplishments.</p>
        </header>

        {/* Main Content */}
        <main className={styles.main}>
          {/* 2. Use the "membersCardsGrid" instead of a table */}
          <div className={styles.membersCardsGrid}>
            {pastMembers.map((member) => (
              // 3. Use the "memberCard" style
              <div key={member._id} className={styles.memberCard}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberDestination}>
                  {/* 4. Use "memberDestination" and the "strong" tag styled in your CSS */}
                  <strong>Current Position:</strong> {member.currentPosition || 'N/A'}
                </p>
              </div>
            ))}
          </div>

          {/* 5. This back link will now be styled correctly */}
          <div className={styles.backLinkWrapper}>
            <Link href="/people" className={styles.backLink}>
              &larr; Back to Current Team
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}