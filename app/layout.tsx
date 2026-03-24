import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maalify - Smart Personal Finance for UAE',
  description: 'Take control of your finances with AI-powered insights, budget tracking, and bank integration.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
