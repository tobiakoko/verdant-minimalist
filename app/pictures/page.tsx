import styles from '../ui/components/PicturesPage.module.css';
import { urlFor, fetchTenantData, tenantFilter } from '@/app/lib/sanity';
import { AnimatedGalleryHeader, AnimatedGalleryGrid } from '@/app/ui/components/AnimatedGallery';

// --- Type Definition ---
type GalleryImage = {
  _id: string;
  image: any;
  caption?: string;
  altText: string;
};

// --- Data Fetching (Multi-tenant aware) ---
async function getPictures(): Promise<GalleryImage[]> {
  const filter = tenantFilter();
  const picturesQuery = `*[_type == "galleryImage" ${filter}] | order(_createdAt desc)`;
  return fetchTenantData<GalleryImage[]>(picturesQuery);
}

export default async function PicturesPage() {
  const pictures = await getPictures();

  // Transform pictures for the animated component
  const transformedPictures = pictures.map((pic) => ({
    _id: pic._id,
    imageUrl: urlFor(pic.image).width(1000).quality(85).url(),
    altText: pic.altText || 'Gallery Image',
    caption: pic.caption,
    width: pic.image?.asset?.metadata?.dimensions?.width || 500,
    height: pic.image?.asset?.metadata?.dimensions?.height || 500,
  }));

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>

        {/* Animated Page Header */}
        <AnimatedGalleryHeader className={styles.pageHeader}>
          <h1 className={styles.title}>Gallery</h1>
          <p className={styles.subtitle}>A glimpse into our lab's life and work.</p>
        </AnimatedGalleryHeader>

        {/* Main Content with Animated Grid */}
        <main className={styles.main}>
          <AnimatedGalleryGrid images={transformedPictures} />
        </main>
      </div>
    </div>
  );
}
