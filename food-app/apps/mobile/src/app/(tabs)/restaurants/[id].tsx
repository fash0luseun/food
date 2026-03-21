import { useState, useEffect } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, Image,
  ActivityIndicator, Alert, SectionList, SafeAreaView,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import type { Restaurant, MenuItem } from '@food-app/shared'
import { useCart } from '../../../context/CartContext'
import { formatPrice } from '../../../lib/utils'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const { addItem, items: cartItems, increment, decrement, pendingItem, confirmSwitch, cancelSwitch } = useCart()

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/restaurants/${id}`).then((r) => r.json()),
      fetch(`${BASE_URL}/api/restaurants/${id}/menu`).then((r) => r.json()),
    ])
      .then(([rData, mData]) => {
        setRestaurant(rData.restaurant)
        setCategories(mData.categories ?? [])
        setItems(mData.items ?? [])
        setActiveCategory(mData.categories?.[0] ?? '')
      })
      .finally(() => setLoading(false))
  }, [id])

  // Handle pending restaurant switch
  useEffect(() => {
    if (!pendingItem || !restaurant) return
    Alert.alert(
      'Start a new cart?',
      `Your cart has items from another restaurant. Clear it to add from ${restaurant.name}?`,
      [
        { text: 'Keep current', onPress: cancelSwitch, style: 'cancel' },
        { text: 'Clear & Add', onPress: confirmSwitch },
      ]
    )
  }, [pendingItem, restaurant, cancelSwitch, confirmSwitch])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  if (!restaurant) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Restaurant not found</Text>
      </View>
    )
  }

  const visibleItems = items.filter((i) => i.category === activeCategory)

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-24"
        ListHeaderComponent={() => (
          <View>
            {/* Hero image */}
            <View className="relative h-48">
              <Image source={{ uri: restaurant.imageUrl }} className="w-full h-full" resizeMode="cover" />
              <View className="absolute inset-0 bg-black/40 justify-end p-4">
                <Text className="text-white text-xl font-bold">{restaurant.name}</Text>
                <Text className="text-white/80 text-sm mt-0.5">{restaurant.description}</Text>
              </View>
              <TouchableOpacity
                className="absolute top-4 left-4 bg-white/90 rounded-full w-9 h-9 items-center justify-center"
                onPress={() => router.back()}
              >
                <Text className="text-lg">←</Text>
              </TouchableOpacity>
            </View>

            {/* Meta */}
            <View className="px-4 py-3 flex-row gap-4 flex-wrap">
              <Text className="text-sm text-gray-600">⭐ {restaurant.rating} ({restaurant.reviewCount})</Text>
              <Text className="text-sm text-gray-600">🕐 {restaurant.deliveryTime}</Text>
              <Text className="text-sm text-gray-600">{formatPrice(restaurant.deliveryFee)} delivery</Text>
              <Text className={`text-sm font-medium ${restaurant.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                {restaurant.isOpen ? '● Open' : '● Closed'}
              </Text>
            </View>

            {/* Category tabs */}
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4 gap-2 pb-3"
              keyExtractor={(item) => item}
              renderItem={({ item: cat }) => (
                <TouchableOpacity
                  onPress={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full ${
                    activeCategory === cat ? 'bg-orange-500' : 'bg-white border border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${activeCategory === cat ? 'text-white' : 'text-gray-700'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        renderItem={({ item }) => {
          const cartItem = cartItems.find((ci) => ci.menuItemId === item.id)
          const qty = cartItem?.quantity ?? 0
          return (
            <View className="mx-4 mb-3 bg-white rounded-xl border border-gray-200 p-3 flex-row gap-3">
              <Image
                source={{ uri: item.imageUrl }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1 gap-1">
                <Text className="font-medium text-gray-900">{item.name}</Text>
                <Text className="text-xs text-gray-500" numberOfLines={2}>{item.description}</Text>
                <Text className="text-sm font-semibold text-orange-600">{formatPrice(item.price)}</Text>
              </View>
              <View className="justify-center">
                {qty === 0 ? (
                  <TouchableOpacity
                    className="bg-orange-500 rounded-lg px-3 py-1.5"
                    onPress={() => addItem({ menuItemId: item.id, restaurantId: id!, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl })}
                    disabled={!item.isAvailable}
                  >
                    <Text className="text-white text-sm font-medium">{item.isAvailable ? 'Add' : 'N/A'}</Text>
                  </TouchableOpacity>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      className="w-7 h-7 rounded-full border border-orange-500 items-center justify-center"
                      onPress={() => decrement(item.id)}
                    >
                      <Text className="text-orange-500 font-bold">−</Text>
                    </TouchableOpacity>
                    <Text className="text-sm font-bold w-4 text-center">{qty}</Text>
                    <TouchableOpacity
                      className="w-7 h-7 rounded-full bg-orange-500 items-center justify-center"
                      onPress={() => increment(item.id)}
                    >
                      <Text className="text-white font-bold">+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )
        }}
      />

      {/* View Cart Button */}
      <View className="absolute bottom-6 left-0 right-0 items-center">
        <TouchableOpacity
          className="bg-orange-500 rounded-full px-8 py-3.5 shadow-lg"
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Text className="text-white font-semibold text-base">🛒 View Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
