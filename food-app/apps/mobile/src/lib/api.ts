import AsyncStorage from '@react-native-async-storage/async-storage'
import { setTokenGetter, setBaseUrl } from '@food-app/shared'

// In dev: use your LAN IP so Expo can reach the Next.js backend.
// Example: http://192.168.1.100:3000
// In production: set EXPO_PUBLIC_API_URL to your deployed URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

setBaseUrl(BASE_URL)
setTokenGetter(() => AsyncStorage.getItem('food_app_token'))

// Re-export all shared API functions for convenience
export * from '@food-app/shared'
