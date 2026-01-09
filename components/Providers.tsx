'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <Toaster 
        position="top-right"
        richColors
        expand={true}
        duration={3000}
      />
    </SessionProvider>
  )
}