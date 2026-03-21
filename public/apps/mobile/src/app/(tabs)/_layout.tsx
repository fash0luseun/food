import { Tabs } from 'expo-router'
import { useCart } from '../../context/CartContext'
import { View, Text } from 'react-native'

function CartTabIcon({ focused }: { focused: boolean }) {
  const { totalItems } = useCart()
  return (
    <View className="items-center">
      <Text className="text-xl">🛒</Text>
      {totalItems > 0 && (
        <View className="absolute -top-1 -right-3 bg-orange-500 rounded-full w-4 h-4 items-center justify-center">
          <Text className="text-white text-xs font-bold">{totalItems}</Text>
        </View>
      )}
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { paddingBottom: 4 },
      }}
    >
      <Tabs.Screen
        name="restaurants"
        options={{
          title: 'Restaurants',
          tabBarIcon: ({ focused }) => (
            <Text className="text-xl">{focused ? '🏠' : '🏠'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ focused }) => <CartTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: () => <Text className="text-xl">📦</Text>,
        }}
      />
    </Tabs>
  )
}
