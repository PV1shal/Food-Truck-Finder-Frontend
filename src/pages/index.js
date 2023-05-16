import { Inter } from 'next/font/google'
import Homepage from './homepage'
import RootLayout from '../components/RootLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <RootLayout>
      <Homepage />
    </RootLayout>
  )
}
