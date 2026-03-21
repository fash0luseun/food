import { Redirect } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { View, ActivityIndicator } from 'react-native'

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />
  }

  return <Redirect href="/(tabs)/restaurants" />
}
