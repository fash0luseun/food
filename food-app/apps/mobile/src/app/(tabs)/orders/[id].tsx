import { useState, useEffect, useCallback } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import type { Order, OrderStatus } from '@food-app/shared'
import { useAuth } from '../../../context/AuthContext'
import { formatPrice, formatDate } from '../../../lib/utils'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

const STEPS: { status: OrderStatus; label: string; emoji: string }[] = [
  { status: 'placed', label: 'Placed', emoji: '✅' },
  { status: 'preparing', label: 'Preparing', emoji: '👨‍🍳' },
  { status: 'out_for_delivery', label: 'On the way', emoji: '🛵' },
  { status: 'delivered', label: 'Delivered', emoji: '🎉' },
]

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { token } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.order) setOrder(data.order)
  }, [id, token])

  useEffect(() => {
    fetchOrder().finally(() => setLoading(false))
  }, [fetchOrder])

  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return
    const interval = setInterval(fetchOrder, 5000)
    return () => clearInterval(interval)
  }, [order, fetchOrder])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Order not found</Text>
      </View>
    )
  }

  const stepIndex = STEPS.findIndex((s) => s.status === order.status)

  const canCancel = ['placed', 'preparing', 'out_for_delivery'].includes(order.status)
  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.order) {
        setOrder(data.order)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to cancel order')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="px-4 pt-6 pb-10">
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-orange-500 font-medium">← Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-gray-900">Order Tracking</Text>
        <Text className="text-sm text-gray-500 mt-1">
          #{order.id} · {order.restaurantName}
        </Text>

        {/* Status stepper */}
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mt-5">
          <View className="flex-row justify-between">
            {STEPS.map((step, i) => {
              const done = i <= stepIndex
              const active = i === stepIndex
              return (
                <View key={step.status} className="flex-1 items-center">
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      done ? 'bg-orange-100' : 'bg-gray-100'
                    } ${active ? 'border-2 border-orange-500' : ''}`}
                  >
                    <Text className="text-xl">{step.emoji}</Text>
                  </View>
                  <Text
                    className={`mt-1.5 text-xs text-center font-medium ${
                      done ? 'text-orange-600' : 'text-gray-400'
                    }`}
                    numberOfLines={2}
                  >
                    {step.label}
                  </Text>
                </View>
              )
            })}
          </View>

          {/* Connector lines */}
          <View className="absolute top-[3.2rem] left-[12%] right-[12%] flex-row">
            {STEPS.slice(0, -1).map((_, i) => (
              <View
                key={i}
                className={`flex-1 h-0.5 ${i < stepIndex ? 'bg-orange-400' : 'bg-gray-200'}`}
              />
            ))}
          </View>

          <Text className="mt-5 text-center text-sm text-gray-500">
            {order.status === 'delivered'
              ? '🎉 Your order was delivered!'
              : `Estimated delivery: ${formatDate(order.estimatedDelivery)}`}
          </Text>
        </View>

        {/* Items */}
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mt-4">
          <Text className="font-semibold text-gray-900 mb-3">Items</Text>
          {order.items.map((item) => (
            <View key={item.menuItemId} className="flex-row justify-between py-1.5">
              <Text className="text-sm text-gray-600">{item.name} × {item.quantity}</Text>
              <Text className="text-sm text-gray-600">{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
          <View className="h-px bg-gray-200 my-3" />
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Subtotal</Text>
            <Text className="text-sm text-gray-600">{formatPrice(order.subtotal)}</Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-sm text-gray-600">Delivery</Text>
            <Text className="text-sm text-gray-600">{formatPrice(order.deliveryFee)}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="font-semibold text-gray-900">Total</Text>
            <Text className="font-semibold text-gray-900">{formatPrice(order.total)}</Text>
          </View>
        </View>

        <Text className="text-xs text-gray-400 text-center mt-3">
          Placed {formatDate(order.placedAt)}
        </Text>

        <View className="flex-row gap-3 justify-center mt-6">
          <TouchableOpacity
            className="border border-gray-300 rounded-xl px-5 py-3"
            onPress={() => router.push('/(tabs)/orders')}
          >
            <Text className="text-gray-700 font-medium">All Orders</Text>
          </TouchableOpacity>
          {canCancel && (
            <TouchableOpacity
              className="bg-red-500 rounded-xl px-5 py-3"
              onPress={handleCancel}
            >
              <Text className="text-white font-medium">Cancel Order</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="bg-orange-500 rounded-xl px-5 py-3"
            onPress={() => router.push('/(tabs)/restaurants')}
          >
            <Text className="text-white font-medium">Order Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
