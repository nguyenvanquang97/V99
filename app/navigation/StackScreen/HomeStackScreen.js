import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "app/screens/Home";
import ProductsScreen from "app/screens/Products";
import AccountScreen from "app/screens/Account";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ProductDetailScreen from "app/screens/ProductDetail";
import { CartStackScreen } from "app/navigation/StackScreen/CartStackScreen";
import LoginScreen from "app/screens/Auth/LoginScreen";
import ProductCategoryScreen from "app/screens/Products/ProductCategory";
import PostsScreen from "app/screens/Posts";
import PostCategoryScreen from "app/screens/Posts/PostCategory";
import PostDetailScreen from "app/screens/Posts/PostDetail";
import RegisterScreen from "app/screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "app/screens/Auth/ForgotPasswordScreen";
import CustomerInformation from "app/screens/CheckOut/CustomerInformation";
import PaymentMethod from "app/screens/CheckOut/PaymentMethod";
import CheckoutCompleted from "app/screens/CheckOut/CheckoutCompleted";
import OrdersScreen from "app/screens/Orders";
import { AccountStackScreen } from "app/navigation/StackScreen/AccountStackScreen";
import VideosScreen from "app/screens/Videos";
import FAQPageScreen from "app/screens/FAQPage";
import SupportScreen from "app/screens/Support";
import { SupportStackScreen } from "app/navigation/StackScreen/SupportStackScreen";
import ContactScreen from "app/screens/Contact";
import OrderDetailScreen from "app/screens/Orders/OrderDetail";
import ProjectDetailScreen from "app/screens/ProjectDetail";
import InvestmentPaymentMethod from "app/screens/InvestmentCheckout/PaymentMethod";
import { StoreStackScreen } from "app/navigation/StackScreen/StoreStackScreen";
import ShopDetailScreen from "app/screens/ShopDetails";

const HomeStack = createStackNavigator()
export const HomeStackScreen = () => (
	<HomeStack.Navigator
		screenOptions={{
			headerShown: false
		}}
	>
		<HomeStack.Screen name={"Home"} component={HomeScreen}/>
		<HomeStack.Screen
			name={"Products"}
			options={{
				headerShown: true,
			}}
			component={ProductsScreen}
		/>
		<HomeStack.Screen
			name={"ProductDetail"}
			options={{
				headerShown: false,
			}}
			component={ProductDetailScreen}
		/>
		<HomeStack.Screen
			name={"ProjectDetail"}
			options={{
				headerShown: false,
			}}
			component={ProjectDetailScreen}
		/>
		<HomeStack.Screen
			name={"ProductCategory"}
			options={{
				headerShown: true,
			}}
			component={ProductCategoryScreen}
		/>

		<HomeStack.Screen
			name={"Videos"}
			options={{
				headerShown: true,
			}}
			component={VideosScreen}
		/>
		<HomeStack.Screen
			name={"FAQScreen"}
			options={{
				headerShown: true,
			}}
			component={FAQPageScreen}
		/>
		<HomeStack.Screen
			name={"Support"}
			options={{
				headerShown: false,
			}}
			component={SupportStackScreen}
		/>
		<HomeStack.Screen
			name={"Posts"}
			options={{
				headerShown: true,
			}}
			component={PostsScreen}
		/>
		<HomeStack.Screen
			name={"PostCategory"}
			options={{
				headerShown: true,
			}}
			component={PostCategoryScreen}
		/>
		<HomeStack.Screen
			name={"PostDetail"}
			options={{
				headerShown: true,
			}}
			component={PostDetailScreen}
		/>
		<HomeStack.Screen
			name={"Account"}
			options={{
				headerShown: false,
			}}
			component={AccountStackScreen}
		/>
		<HomeStack.Screen
			name={"CustomerInformation"}
			component={CustomerInformation}
			options={{
				headerShown: true,
				animationEnabled: true,
				gestureEnabled: true,
			}}
		/>
		<HomeStack.Screen
			name={"PaymentMethod"}
			component={PaymentMethod}
			options={{
				headerShown: true,
				animationEnabled: true,
				gestureEnabled: true,
			}}
		/>
		<HomeStack.Screen
			name={"InvestmentPaymentMethod"}
			component={InvestmentPaymentMethod}
			options={{
				headerShown: true,
				animationEnabled: true,
				gestureEnabled: true,
			}}
		/>
		<HomeStack.Screen
			name={"CheckoutCompleted"}
			component={CheckoutCompleted}
			options={{
				headerShown: false,
				animationEnabled: false,
				gestureEnabled: false,
			}}
		/>
		<HomeStack.Screen
			name={"Login"}
			options={{
				headerShown: true,
				animationEnabled: false,
				gestureEnabled: false,
			}}
			component={LoginScreen}
		/>
		<HomeStack.Screen
			name={"Register"}
			options={{
				headerShown: true,
				animationEnabled: false,
				gestureEnabled: false,
			}}
			component={RegisterScreen}
		/>
		<HomeStack.Screen
			name={"ForgotPassword"}
			options={{
				headerShown: true,
				animationEnabled: false,
				gestureEnabled: false,
			}}
			component={ForgotPasswordScreen}
		/>
		<HomeStack.Screen
			name={"Cart"}
			component={CartStackScreen}
		/>
		<HomeStack.Screen
			name={"Orders"}
			component={OrdersScreen}
			options={{
				headerShown: true,
			}}
		/>
		<HomeStack.Screen
			name={"Contact"}
			options={{
				headerShown: true,
			}}
			component={ContactScreen}
		/>
		<HomeStack.Screen name={"OrderDetail"}
		                  options={{
			                  headerShown: true,
		                  }} component={OrderDetailScreen}/>
		<HomeStack.Screen
			name={"Stores"}
			options={{
				headerShown: false,
			}}
			component={StoreStackScreen}
		/>
		<HomeStack.Screen
			name={"StoreDetail"}
			options={{
				headerShown: false,
			}}
			component={ShopDetailScreen}
		/>
	</HomeStack.Navigator>
)
