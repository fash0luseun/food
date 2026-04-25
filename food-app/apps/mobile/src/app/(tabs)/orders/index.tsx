import { useState, useEffect } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Order } from '@food-app/shared'
import { useAuth } from '../../../context/AuthContext'
import { formatPrice, formatDate } from '../../../lib/utils'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

const STATUS_LABELS: Record<string, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersScreen() {
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return }
    fetch(`${BASE_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false))
  }, [isAuthenticated, token])

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Text className="text-4xl mb-3">🔒</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-1">Sign in to see orders</Text>
        <TouchableOpacity
          className="mt-4 bg-orange-500 rounded-xl px-6 py-3"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-6 pb-2">
        <Text className="text-2xl font-bold text-gray-900">My Orders</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-4 pt-2 gap-3"
          renderItem={({ item: order }) => (
            <TouchableOpacity
              className="bg-white rounded-xl border border-gray-200 p-4"
              onPress={() => router.push(`/(tabs)/orders/${order.id}`)}
              activeOpacity={0.8}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">{order.restaurantName}</Text>
                  <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                    {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">{formatDate(order.placedAt)}</Text>
                </View>
                <View className="items-end gap-2 ml-3">
                  <View className={`px-2.5 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                    <Text className={`text-xs font-medium ${STATUS_COLORS[order.status].split(' ')[1]}`}>
                      {STATUS_LABELS[order.status]}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</Text>
                </View>
              </View>
              {['placed', 'preparing', 'out_for_delivery'].includes(order.status) && (
                <TouchableOpacity
                  className="mt-2 bg-red-500 rounded-full px-3 py-1 self-start"
                  onPress={async (e) => {
                    e.stopPropagation()
                    Alert.alert('Cancel order', 'Are you sure?', [
                      { text: 'No', style: 'cancel' },
                      { text: 'Yes', onPress: async () => {
                          try {
                            const r = await fetch(`${BASE_URL}/api/orders/${order.id}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` },
                            })
                            const d = await r.json()
                            if (d.order) {
                              setOrders((prev) => prev.map((o) => (o.id === order.id ? d.order : o)))
                            }
                          } catch (err) {
                            console.error(err)
                            Alert.alert('Unable to cancel')
                          }
                        } }
                    ])
                  }}
                >
                  <Text className="text-white text-xs font-medium">Cancel</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="items-center py-16">
              <Text className="text-4xl mb-3">📦</Text>
              <Text className="font-medium text-gray-600 mb-1">No orders yet</Text>
              <Text className="text-sm text-gray-500">Place your first order!</Text>
              <TouchableOpacity
                className="mt-5 bg-orange-500 rounded-xl px-6 py-3"
                onPress={() => router.push('/(tabs)/restaurants')}
              >
                <Text className="text-white font-semibold">Order Now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}
