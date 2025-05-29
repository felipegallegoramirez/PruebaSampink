import dynamic from 'next/dynamic'
import ListPdfClient from './listpdfclient'
import { Suspense } from 'react'

export default function Page() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <ListPdfClient />
    </Suspense>
  )
}