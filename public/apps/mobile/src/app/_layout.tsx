import '../../../global.css'
import { Stack } from 'expo-router'
import { Providers } from '../context/Providers'

export default function RootLayout() {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }} />
    </Providers>
  )
}
