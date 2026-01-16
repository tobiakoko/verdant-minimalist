import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { urlFor, fetchTenantData, tenantFilter } from './lib/sanity';
import ClientLayout from "@/app/ui/components/ClientLayout";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// --- Type Definitions ---
type SiteSettings = {
  labName?: string;
  labNameAccent?: string;
  labNameDescription?: string;
  footerText?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  socialImage?: any;
  twitterHandle?: string;
  colorTheme?: string;
  showPrivacyPolicy?: boolean;
  privacyPolicyUrl?: string;
  showTerms?: boolean;
  termsUrl?: string;
};

// --- Theme Presets with Light and Dark Mode Variants ---
type ThemeColors = {
  light: {
    primary: string;
    hover: string;
    muted: string;
  };
  dark: {
    primary: string;
    hover: string;
    muted: string;
  };
};

const themePresets: Record<string, ThemeColors> = {
  ocean: {
    light: {
      primary: '#2563EB',
      hover: '#1D4ED8',
      muted: 'rgba(37, 99, 235, 0.1)',
    },
    dark: {
      primary: '#60A5FA',
      hover: '#93C5FD',
      muted: 'rgba(96, 165, 250, 0.15)',
    },
  },
  verdant: {
    light: {
      primary: '#16A34A',
      hover: '#15803D',
      muted: 'rgba(22, 163, 74, 0.1)',
    },
    dark: {
      primary: '#4ADE80',
      hover: '#86EFAC',
      muted: 'rgba(74, 222, 128, 0.15)',
    },
  },
  sunset: {
    light: {
      primary: '#EA580C',
      hover: '#C2410C',
      muted: 'rgba(234, 88, 12, 0.1)',
    },
    dark: {
      primary: '#FB923C',
      hover: '#FDBA74',
      muted: 'rgba(251, 146, 60, 0.15)',
    },
  },
  violet: {
    light: {
      primary: '#7C3AED',
      hover: '#6D28D9',
      muted: 'rgba(124, 58, 237, 0.1)',
    },
    dark: {
      primary: '#A78BFA',
      hover: '#C4B5FD',
      muted: 'rgba(167, 139, 250, 0.15)',
    },
  },
  rose: {
    light: {
      primary: '#E11D48',
      hover: '#BE123C',
      muted: 'rgba(225, 29, 72, 0.1)',
    },
    dark: {
      primary: '#FB7185',
      hover: '#FDA4AF',
      muted: 'rgba(251, 113, 133, 0.15)',
    },
  },
  slate: {
    light: {
      primary: '#475569',
      hover: '#334155',
      muted: 'rgba(71, 85, 105, 0.1)',
    },
    dark: {
      primary: '#94A3B8',
      hover: '#CBD5E1',
      muted: 'rgba(148, 163, 184, 0.15)',
    },
  },
  copper: {
    light: {
      primary: '#B45309',
      hover: '#92400E',
      muted: 'rgba(180, 83, 9, 0.1)',
    },
    dark: {
      primary: '#FBBF24',
      hover: '#FCD34D',
      muted: 'rgba(251, 191, 36, 0.15)',
    },
  },
  forest: {
    light: {
      primary: '#166534',
      hover: '#14532D',
      muted: 'rgba(22, 101, 52, 0.1)',
    },
    dark: {
      primary: '#4ADE80',
      hover: '#86EFAC',
      muted: 'rgba(74, 222, 128, 0.15)',
    },
  },
};

// --- Data Fetching (Multi-tenant aware) ---
async function getSiteSettings(): Promise<SiteSettings> {
  const filter = tenantFilter();
  const settingsQuery = `*[_type == "siteSettings" ${filter}] | order(_updatedAt desc) [0]{
    labName,
    labNameAccent,
    labNameDescription,
    footerText,
    seoTitle,
    seoDescription,
    seoKeywords,
    socialImage,
    twitterHandle,
    colorTheme,
    showPrivacyPolicy,
    privacyPolicyUrl,
    showTerms,
    termsUrl
  }`;
  return fetchTenantData<SiteSettings>(settingsQuery);
}

// --- Viewport Configuration ---
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
};

// --- Dynamic Metadata ---
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const siteName = settings?.labName
    ? `${settings.labName} ${settings.labNameAccent || ''}`.trim()
    : 'Research Laboratory';

  const description = settings?.seoDescription
    || settings?.labNameDescription
    || 'Advancing the frontiers of scientific research.';

  const keywords = settings?.seoKeywords || [
    'research',
    'laboratory',
    'science',
    'publications',
    'academic',
  ];

  const socialImageUrl = settings?.socialImage
    ? urlFor(settings.socialImage).width(1200).height(630).url()
    : undefined;

  return {
    title: {
      default: settings?.seoTitle || siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,

    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName,
      title: settings?.seoTitle || siteName,
      description,
      images: socialImageUrl ? [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        }
      ] : [],
    },

    twitter: {
      card: 'summary_large_image',
      title: settings?.seoTitle || siteName,
      description,
      creator: settings?.twitterHandle,
      images: socialImageUrl ? [socialImageUrl] : [],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// --- Structured Data (JSON-LD) ---
function generateStructuredData(settings: SiteSettings) {
  const siteName = settings?.labName
    ? `${settings.labName} ${settings.labNameAccent || ''}`.trim()
    : 'Research Laboratory';

  return {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: siteName,
    description: settings?.labNameDescription || 'Research laboratory',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  };
}

// --- Dynamic Theme CSS Generator ---
function generateThemeCSS(settings: SiteSettings): string {
  const themeName = settings?.colorTheme || 'ocean';
  const theme = themePresets[themeName] || themePresets.ocean;

  return `
    :root {
      --accent-primary: ${theme.light.primary};
      --accent-hover: ${theme.light.hover};
      --accent-muted: ${theme.light.muted};
    }

    .dark,
    [data-theme="dark"] {
      --accent-primary: ${theme.dark.primary};
      --accent-hover: ${theme.dark.hover};
      --accent-muted: ${theme.dark.muted};
    }
  `;
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData(settings);
  const themeCSS = generateThemeCSS(settings);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Dynamic Theme Styles */}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <ClientLayout settings={settings}>
          <main id="main-content">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
