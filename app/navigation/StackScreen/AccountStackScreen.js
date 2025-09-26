import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "app/screens/Home";
import AccountScreen from "app/screens/Account";
import { useSelector } from "react-redux";
import LoginScreen from "app/screens/Auth/LoginScreen";
import { AuthStackScreen } from "app/navigation/StackScreen/AuthStackScreen";
import AccountSettingScreen from "app/screens/Account/AccountSettingScreen";
import RewardWalletScreen from "app/screens/RewardWallet";
import CashWalletScreen from "app/screens/PointWallet";
import ProductWalletScreen from "app/screens/InvestmentWallet";
import StockWalletScreen from "app/screens/StockWallet";
import TransactionDetailScreen from "app/screens/TransactionDetail";
import OrdersScreen from "app/screens/Orders/index";
import SearchOrdersScreen from "app/screens/Orders/SearchOrders";
import OrderDetailScreen from "app/screens/Orders/OrderDetail";
import CartScreen from "app/screens/Cart";
import ChildOrderListScreen from "app/screens/Affiliate/ChildOrderList";
import AffiliateProgramScreen from "app/screens/Affiliate";
import SocialSettingScreen from "app/screens/Account/SocialSettingScreen";
import PasswordSettingScreen from "app/screens/Account/PasswordSettingScreen";
import PaymentSettingScreen from "app/screens/Account/PaymentSettingScreen";
import AccountLevelScreen from "app/screens/Level";
import MonthlyRewardScreen from "app/screens/Rewards/MonthlyReward";
import YearlyRewardScreen from "app/screens/Rewards/YearlyReward";
import ProductsScreen from "app/screens/Products";
import ProductDetailScreen from "app/screens/ProductDetail";
import ProductCategoryScreen from "app/screens/Products/ProductCategory";
import PostsScreen from "app/screens/Posts";
import PostCategoryScreen from "app/screens/Posts/PostCategory";
import PostDetailScreen from "app/screens/Posts/PostDetail";
import VideosScreen from "app/screens/Videos";
import { SupportStackScreen } from "app/navigation/StackScreen/SupportStackScreen";
import ContactScreen from "app/screens/Contact";
import DeleteMeScreen from "app/screens/Account/DeleteMeScreen";
import ProjectDetailScreen from "app/screens/ProjectDetail";
import UserKindScreen from "app/screens/UserKind";
import ChildOrderScreen from "app/screens/ChildOrders";
import ChildOrderDetailScreen from "app/screens/ChildOrders/OrderDetail";
import AddressSettingScreen from "app/screens/Account/AddressSettingScreen";
import ConsumerWalletScreen from "app/screens/ConsumerWallet";
import WaitingWalletScreen from "app/screens/WaitingWallet";

const AccountStack = createStackNavigator()

export function AccountStackScreen() {
	const currentUser = useSelector(state => state.memberAuth.user);

	return <AccountStack.Navigator
		screenOptions={{
			headerShown: true
		}}
	>
		{!currentUser ?
			<AccountStack.Screen
				name={"Login"}
                component={AuthStackScreen}
				options={{
					headerShown: false,
					animationEnabled: false,
					gestureEnabled: false,
				}}
			/>
			:
			<>
				<AccountStack.Screen
					name={"Account"}
					component={AccountScreen}
					options={{
						headerShown: true,
						animationEnabled: false,
						gestureEnabled: false,
					}}
				/>
				<AccountStack.Screen
					name={"AccountSetting"}
					component={AccountSettingScreen}
					options={{
						headerShown: true,
					}}
				/>
				<AccountStack.Screen
					name={"ChangeSocialInfo"}
					component={SocialSettingScreen}
					options={{
						headerShown: true,
					}}
				/>
				<AccountStack.Screen
					name={"ChangePassword"}
					component={PasswordSettingScreen}
					options={{
						headerShown: true,
					}}
				/>
				<AccountStack.Screen
					name={"ChangePaymentInfo"}
					component={PaymentSettingScreen}
					options={{
						headerShown: true,
					}}
				/>
				<AccountStack.Screen
					name={"RewardWallet"}
					component={RewardWalletScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"UserKind"}
					component={UserKindScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"PointWallet"}
					component={CashWalletScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"ConsumerWallet"}
					component={ConsumerWalletScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"InvestmentWallet"}
					component={ProductWalletScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"WaitingWallet"}
					component={WaitingWalletScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"StockWallet"}
					component={StockWalletScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"TransactionDetail"}
					component={TransactionDetailScreen}
				/>
				<AccountStack.Screen
					name={"Orders"}
					component={OrdersScreen}
				/>
				<AccountStack.Screen
					name={"ChildOrders"}
					component={ChildOrderScreen}
				/>
				<AccountStack.Screen
					name={"SearchOrders"}
					component={SearchOrdersScreen}
				/>
				<AccountStack.Screen
					name={"OrderDetail"}
					component={OrderDetailScreen}
				/>
				<AccountStack.Screen
					name={"ChildOrderDetail"}
					component={ChildOrderDetailScreen}
				/>
				<AccountStack.Screen
					name={"Cart"}
					component={CartScreen}
				/>
				{/*<AccountStack.Screen
					name={"ChildOrders"}
					component={ChildOrderListScreen}
				/>*/}
				<AccountStack.Screen
					name={"AffiliateProgram"}
					component={AffiliateProgramScreen}
				/>
				<AccountStack.Screen
					name={"LevelInfo"}
					component={AccountLevelScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"MonthlyReward"}
					component={MonthlyRewardScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen
					name={"YearlyReward"}
					component={YearlyRewardScreen}
					options={{
						headerShown: false,
					}}
				/>
				<AccountStack.Screen name={"Products"} component={ProductsScreen}/>
				<AccountStack.Screen name={"ProductDetail"}
				                     options={{
					                     headerShown: false,
				                     }} component={ProductDetailScreen}/>
				<AccountStack.Screen name={"ProjectDetail"}
				                     options={{
					                     headerShown: false,
				                     }} component={ProjectDetailScreen}/>
				<AccountStack.Screen
					name={"ProductCategory"}
					component={ProductCategoryScreen}
				/>
				<AccountStack.Screen
					name={"Posts"}
					options={{
						headerShown: true,
					}}
					component={PostsScreen}
				/>
				<AccountStack.Screen
					name={"PostCategory"}
					options={{
						headerShown: true,
					}}
					component={PostCategoryScreen}
				/>
				<AccountStack.Screen
					name={"PostDetail"}
					options={{
						headerShown: true,
					}}
					component={PostDetailScreen}
				/>
				<AccountStack.Screen
					name={"Videos"}
					options={{
						headerShown: true,
					}}
					component={VideosScreen}
				/>
				<AccountStack.Screen
					name={"Support"}
					options={{
						headerShown: false,
					}}
					component={SupportStackScreen}
				/>
				<AccountStack.Screen
					name={"Contact"}
					options={{
						headerShown: true,
					}}
					component={ContactScreen}
				/>
				<AccountStack.Screen
					name={"DeleteMe"}
					options={{
						headerShown: true,
					}}
					component={DeleteMeScreen}
				/>
				<AccountStack.Screen
					name={"AddressSetting"}
					component={AddressSettingScreen}
					options={{
						headerShown: true,
					}}
				/>
			</>
		}
	</AccountStack.Navigator>
}
