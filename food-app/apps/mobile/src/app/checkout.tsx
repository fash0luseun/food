import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
const DELIVERY_FEE = 1.99

export default function CheckoutScreen() {
  const { token } = useAuth()
  const { items, subtotal, restaurantId, clearCart } = useCart()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)

  const total = subtotal + DELIVERY_FEE

  async function handlePlaceOrder() {
    setPlacing(true)
    try {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          deliveryFee: DELIVERY_FEE,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      clearCart()
      router.replace(`/(tabs)/orders/${data.order.id}`)
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="px-4 pt-6 pb-10">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-orange-500 font-medium">← Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-gray-900 mb-5">Checkout</Text>

        {/* Delivery address */}
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <Text className="font-semibold text-gray-900 mb-3">Delivery Address</Text>
          <View className="flex-row gap-3 items-center">
            <Text className="text-2xl">📍</Text>
            <View>
              <Text className="font-medium text-gray-800">Home</Text>
              <Text className="text-sm text-gray-500">123 Demo Street, Apt 4B</Text>
            </View>
          </View>
        </View>

        {/* Order items */}
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <Text className="font-semibold text-gray-900 mb-3">Order Items</Text>
          {items.map((item) => (
            <View key={item.menuItemId} className="flex-row justify-between py-1.5">
              <Text className="text-sm text-gray-600">{item.name} × {item.quantity}</Text>
              <Text className="text-sm text-gray-600">{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <Text className="font-semibold text-gray-900 mb-3">Payment Summary</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Subtotal</Text>
            <Text className="text-sm text-gray-600">{formatPrice(subtotal)}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm text-gray-600">Delivery fee</Text>
            <Text className="text-sm text-gray-600">{formatPrice(DELIVERY_FEE)}</Text>
          </View>
          <View className="h-px bg-gray-200 mb-3" />
          <View className="flex-row justify-between">
            <Text className="font-semibold text-gray-900">Total</Text>
            <Text className="font-semibold text-gray-900">{formatPrice(total)}</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-orange-500 rounded-xl py-4 items-center shadow-lg"
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Place Order — {formatPrice(total)}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
