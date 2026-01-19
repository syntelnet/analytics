import Script from 'next/script'

/**
 * Exemplo de implementação em Next.js (App Router)
 * Este componente deve ser inserido no RootLayout
 */
export default function AnalyticsProvider () {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
    const ENV = process.env.NODE_ENV

    return (
        <>
            <Script
                id="centralized-analytics"
                src="https://sua-cdn.com/analytics.js"
                data-ga-id={GA_ID}
                data-env={ENV}
                data-debug={ENV === 'development'}
                strategy="afterInteractive"
            />
        </>
    )
}

// Exemplo de uso em um componente de cliente
/*
'use client'
export function BuyButton() {
  const handleTrack = () => {
    if (typeof window !== 'undefined' && window.track) {
      window.track('add_to_cart', { id: 'prod_123' });
    }
  }
  return <button onClick={handleTrack}>Comprar</button>
}
*/
