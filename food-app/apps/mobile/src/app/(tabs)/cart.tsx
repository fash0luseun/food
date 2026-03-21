import {
  View, Text, FlatList, TouchableOpacity, Image, SafeAreaView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../lib/utils'

const DELIVERY_FEE = 1.99

export default function CartScreen() {
  const { isAuthenticated } = useAuth()
  const { items, totalItems, subtotal, increment, decrement, removeItem } = useCart()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Text className="text-4xl mb-3">🔒</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-1">Sign in required</Text>
        <Text className="text-sm text-gray-500 text-center mb-6">
          Please sign in to view your cart
        </Text>
        <TouchableOpacity
          className="bg-orange-500 rounded-xl px-6 py-3"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const total = subtotal + DELIVERY_FEE

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-6 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Your Cart</Text>
      </View>

      {totalItems === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-5xl mb-3">🛒</Text>
          <Text className="text-lg font-semibold text-gray-900 mb-1">Cart is empty</Text>
          <Text className="text-sm text-gray-500 text-center mb-6">Add some food to get started</Text>
          <TouchableOpacity
            className="bg-orange-500 rounded-xl px-6 py-3"
            onPress={() => router.push('/(tabs)/restaurants')}
          >
            <Text className="text-white font-semibold">Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.menuItemId}
          contentContainerClassName="px-4 pb-36"
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl border border-gray-200 mb-3 p-3 flex-row gap-3 items-center">
              <Image source={{ uri: item.imageUrl }} className="w-16 h-16 rounded-lg" resizeMode="cover" />
              <View className="flex-1">
                <Text className="font-medium text-gray-900" numberOfLines={1}>{item.name}</Text>
                <Text className="text-sm text-orange-600 mt-0.5">{formatPrice(item.price)}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  className="w-7 h-7 rounded-full border border-gray-300 items-center justify-center"
                  onPress={() => decrement(item.menuItemId)}
                >
                  <Text className="text-gray-600">−</Text>
                </TouchableOpacity>
                <Text className="text-sm font-bold w-4 text-center">{item.quantity}</Text>
                <TouchableOpacity
                  className="w-7 h-7 rounded-full bg-orange-500 items-center justify-center"
                  onPress={() => increment(item.menuItemId)}
                >
                  <Text className="text-white font-bold">+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.menuItemId)} className="ml-1">
                <Text className="text-gray-400 text-xl">×</Text>
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="bg-white rounded-xl border border-gray-200 p-4 mt-2">
              <Text className="font-semibold text-gray-900 mb-3">Order Summary</Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Subtotal</Text>
                  <Text className="text-sm text-gray-600">{formatPrice(subtotal)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Delivery fee</Text>
                  <Text className="text-sm text-gray-600">{formatPrice(DELIVERY_FEE)}</Text>
                </View>
                <View className="h-px bg-gray-200 my-1" />
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-gray-900">Total</Text>
                  <Text className="font-semibold text-gray-900">{formatPrice(total)}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {totalItems > 0 && (
        <View className="absolute bottom-6 left-0 right-0 px-4">
          <TouchableOpacity
            className="bg-orange-500 rounded-xl py-4 items-center shadow-lg"
            onPress={() => router.push('/checkout')}
          >
            <Text className="text-white font-semibold text-base">
              Proceed to Checkout — {formatPrice(subtotal + DELIVERY_FEE)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}
