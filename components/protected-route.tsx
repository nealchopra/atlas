"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (!session) {
        console.log('No session found, redirecting to login...')
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  return <>{children}</>
} 