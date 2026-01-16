'use client';

import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import Header from './Header';
import Footer from './Footer';

// Type definitions
type SiteSettings = {
  labName?: string;
  labNameAccent?: string;
  footerText?: string;
  showPrivacyPolicy?: boolean;
  privacyPolicyUrl?: string;
  showTerms?: boolean;
  termsUrl?: string;
};

type ClientLayoutProps = {
  children: React.ReactNode;
  settings: SiteSettings;
};

// Component to sync theme class to body for CSS module compatibility
function ThemeBodySync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [resolvedTheme]);

  return null;
}

export default function ClientLayout({ children, settings }: ClientLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeBodySync />
      <div className="pageWrapper">
        <Header settings={settings} />
        <main>
          {children}
        </main>
        <Footer settings={settings} />
      </div>
    </ThemeProvider>
  );
}