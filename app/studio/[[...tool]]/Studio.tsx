'use client'

import { Suspense, useEffect, useState } from 'react'

export default function Studio() {
  const [StudioComponent, setStudioComponent] = useState<any>(null)

  useEffect(() => {
    // Only load on client-side
    import('next-sanity/studio').then((mod) => {
      import('@/sanity/sanity.config').then((configMod) => {
        const NextStudio = mod.NextStudio
        const config = configMod.default

        setStudioComponent(() => () => <NextStudio config={config} />)
      })
    })
  }, [])

  if (!StudioComponent) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #059669',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#666', margin: 0 }}>Loading Sanity Studio...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return <StudioComponent />
}
