import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JOLIE TOURS ✦ - Recherche de vols de luxe',
  description: 'Réservez vos vols avec Jolie Tours - Expérience de voyage premium',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0B0B0B'
      }}>
        {children}
      </body>
    </html>
  )
}
