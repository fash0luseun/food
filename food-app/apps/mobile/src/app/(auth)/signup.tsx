import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function SignupScreen() {
  const { login } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!name || !email || !password) { Alert.alert('Error', 'Please fill in all fields'); return }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await login(data.token, data.user)
      router.replace('/(tabs)/restaurants')
    } catch (err) {
      Alert.alert('Signup failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6 py-12">
        <View className="items-center mb-8">
          <Text className="text-6xl">🍔</Text>
          <Text className="mt-4 text-2xl font-bold text-gray-900">Create your account</Text>
          <Text className="mt-1 text-sm text-gray-500">Join FoodDash and order in minutes</Text>
        </View>

        <View className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {[
            { label: 'Full name', value: name, setter: setName, placeholder: 'Jane Doe', type: undefined },
            { label: 'Email', value: email, setter: setEmail, placeholder: 'you@example.com', type: 'email-address' as const },
            { label: 'Password', value: password, setter: setPassword, placeholder: 'Min. 6 characters', secure: true },
          ].map(({ label, value, setter, placeholder, type, secure }) => (
            <View key={label} className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                placeholder={placeholder}
                value={value}
                onChangeText={setter}
                autoCapitalize={type ? 'none' : 'words'}
                keyboardType={type ?? 'default'}
                secureTextEntry={secure}
              />
            </View>
          ))}

          <TouchableOpacity
            className="bg-orange-500 rounded-xl py-3.5 items-center mt-1"
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">Create account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-5">
          <Text className="text-sm text-gray-600">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-medium text-orange-500">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
