import { useState, useEffect } from 'react'
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  Image, ActivityIndicator, SafeAreaView,
} from 'react-native'
import { useRouter } from 'expo-router'
import type { Restaurant } from '@food-app/shared'
import { formatPrice } from '../../../lib/utils'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
const CUISINES = ['All', 'American', 'Italian', 'Japanese', 'Mexican']

export default function RestaurantsScreen() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('All')

  useEffect(() => {
    fetch(`${BASE_URL}/api/restaurants`)
      .then((r) => r.json())
      .then((data) => setRestaurants(data.restaurants ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = restaurants.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
    const matchCuisine = cuisine === 'All' || r.cuisine === cuisine
    return matchSearch && matchCuisine
  })

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900 mb-1">FoodDash 🍔</Text>
        <Text className="text-sm text-gray-500 mb-4">Order from the best restaurants near you</Text>

        <TextInput
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm mb-3"
          placeholder="Search restaurants or cuisines..."
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={CUISINES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCuisine(item)}
              className={`mr-2 px-4 py-1.5 rounded-full ${
                cuisine === item ? 'bg-orange-500' : 'bg-white border border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium ${cuisine === item ? 'text-white' : 'text-gray-700'}`}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-4 pt-2 gap-4"
          renderItem={({ item: r }) => (
            <TouchableOpacity
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
              onPress={() => router.push(`/(tabs)/restaurants/${r.id}`)}
              activeOpacity={0.8}
            >
              <View className="relative h-40">
                <Image source={{ uri: r.imageUrl }} className="w-full h-full" resizeMode="cover" />
                {!r.isOpen && (
                  <View className="absolute inset-0 bg-black/50 items-center justify-center">
                    <Text className="text-white font-semibold bg-white/20 px-3 py-1 rounded-full text-gray-800">
                      Closed
                    </Text>
                  </View>
                )}
              </View>
              <View className="p-3">
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-gray-900 text-base">{r.name}</Text>
                  <Text className="text-sm text-gray-500">⭐ {r.rating}</Text>
                </View>
                <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>{r.description}</Text>
                <View className="flex-row gap-3 mt-2">
                  <Text className="text-xs text-gray-500">🕐 {r.deliveryTime}</Text>
                  <Text className="text-xs text-gray-500">{formatPrice(r.deliveryFee)} delivery</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="items-center py-16">
              <Text className="text-4xl mb-2">🍽️</Text>
              <Text className="font-medium text-gray-600">No restaurants found</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}
