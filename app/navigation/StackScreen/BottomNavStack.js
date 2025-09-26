import * as React from "react";
import { HomeStackScreen } from "app/navigation/StackScreen/HomeStackScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AccountStackScreen } from "app/navigation/StackScreen/AccountStackScreen";
import { ProductStackScreen } from "app/navigation/StackScreen/ProductStackScreen";
import { CartStackScreen } from "app/navigation/StackScreen/CartStackScreen";
import CartBottomIcon from "app/screens/Cart/components/cartBottomIcon";
import { View } from "react-native";
import tw from "twrnc";
import { StoreStackScreen } from "app/navigation/StackScreen/StoreStackScreen";

const AppTabs = createBottomTabNavigator()
export const AppTabsScreen = () => (
	<AppTabs.Navigator
		screenOptions={{
			tabBarActiveTintColor: '#e7a815',
			tabBarInactiveTintColor: 'rgba(38,38,38,0.56)',
			tabBarLabelStyle: {
				marginBottom: 5,
				fontWeight: '600'
			},
			tabBarIconStyle: {
				marginTop: 5,
			},
			tabBarStyle: [
				{
					display: 'flex'
				}
			],
		}}
	>
		<AppTabs.Screen
			name={"Khám phá"}
			component={HomeStackScreen}
			options={{
				unmountOnBlur:true,
				headerShown: false,
				tabBarIcon: ({ color, size }) => (
					<Icon name={"compass-outline"} size={size} color={color} />
				)
			}}
		/>
		<AppTabs.Screen
			name={"Giỏ hàng"}
			component={CartStackScreen}
			options={{
				unmountOnBlur:true,
				headerShown: false,
				tabBarIcon: ({ color, size }) => (
					<CartBottomIcon color={color} size={size}/>
				)
			}}
		/>
		<AppTabs.Screen
			name={"Cửa hàng"}
			component={ProductStackScreen}
			options={{
				unmountOnBlur:true,
				headerShown: false,
				tabBarIcon: ({ color, size }) => (
					<View style={tw`bg-yellow-500 rounded-full h-11 w-11 mb-4 flex items-center flex-row p-2 border-2 border-white`}>
						<Icon name={"store"} size={24} color={color} style={tw`text-white`} />
					</View>
				)
			}}
		/>
		<AppTabs.Screen
			name={"Gian hàng"}
			component={StoreStackScreen}
			options={{
				headerShown: false,
				unmountOnBlur:true,
				tabBarIcon: ({ color, size }) => (
					<Icon name={"storefront-outline"} size={size} color={color} />
				)
			}}
		/>
		<AppTabs.Screen
			name={"Tài khoản"}
			component={AccountStackScreen}
			options={{
				unmountOnBlur:true,
				headerShown: false,
				tabBarIcon: ({ color, size }) => (
					<Icon name={"account-circle-outline"} size={size} color={color} />
				)
			}}
		/>
	</AppTabs.Navigator>
)
