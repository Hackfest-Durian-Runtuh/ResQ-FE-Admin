"use client"

import { CircularProgress } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  })

  return (
    <div className='h-screen flex justify-center items-center'>
      <CircularProgress />
    </div>
  )
}
