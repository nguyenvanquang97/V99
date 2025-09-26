import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image, Platform,
	RefreshControl,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import apiConfig, { AppConfig } from "app/config/api-config";
import { GetMe, LoadDataAction, memberLogout } from "app/screens/Auth/action";
import { emptyCart } from "app/screens/Cart/action";
import CartIcon from "app/screens/Cart/components/cartIcon";
import { UserAffRoles, UserLevel } from "app/models/commons/member.model";
import { formatNumber, formatVND } from "app/utils/helper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { GetSettings } from "app/store/actions/settingActions";
import SearchProductScreen from "app/screens/Search/SearchProductScreen";
import ActiveCard from "app/screens/ActiveCard";
import UpgradeAccount from "app/screens/UpgradeAccount";
import QRCode from "react-native-qrcode-svg";
import DepositHistoryScreen from "app/screens/TransactionHistory/depositHistory";
import WithdrawHistoryScreen from "app/screens/TransactionHistory/withdrawHistory";
import TransferHistoryScreen from "app/screens/TransactionHistory/transferHistory";
import MonthlyReward from "app/screens/Rewards/MonthlyReward";
import MonthlyRevenue from "app/screens/Account/MonthlyRevenue";

function AccountScreen(props) {
	const isFocused = useIsFocused();
	const dispatch = useDispatch()
	const currentUser = useSelector(state => state.memberAuth.user);
	const settings = useSelector(state => state.SettingsReducer.options);
	const [refresh, setRefresh] = useState(false)
	const [quickStats, setQuickStats] = useState({})
	const [childQuickStats, setChildQuickStats] = useState({})
	const [monthlyStats, setMonthlyStats] = useState({})
	const [showQR, setShowQR] = useState(false)

	useEffect(() => {
		props.navigation.setOptions({
			title: 'Tài khoản',
			headerStyle: {
				backgroundColor: '#1e74e5',
			},
			headerTintColor: '#fff',
			/*headerLeft: () => (
				<View style={tw`flex flex-row items-center`}>
					<TouchableOpacity
						activeOpacity={1}
						//onPress={() => dispatch(memberLogout(props.navigation))}
					>
						<Icon name="cog"
						      size={23}
						      style={tw`text-white ml-3`}
						/>
					</TouchableOpacity>
				</View>
			),*/
			headerRight: () => (
			<View style={tw`mr-3 flex flex-row items-center`}>
				<CartIcon
					navigation={props.navigation}
				/>

				<TouchableOpacity
					activeOpacity={1}
					onPress={() => props.navigation.openDrawer()}
				>
					<Icon name={"menu"} size={30} style={tw`text-white ml-5`} />
				</TouchableOpacity>
			</View>
		)
		})
	}, [])

	useEffect(() => {
		if (isFocused) {
			//dispatch(GetSettings());
			async function getMe() {
				const token = await AsyncStorage.getItem('v99_user_token');
				axios({
					method: 'get',
					url: `${apiConfig.BASE_URL}/auth/customer/me`,
					headers: {Authorization: `Bearer ${token}`}
				}).then(function (response) {
					if (response.status === 200) {
						dispatch(LoadDataAction(response.data))
						setRefresh(false)
					}
				}).catch(function(error){
					console.log(error);
					setRefresh(false)
				})
			}
			getMe();

			async function getMonthlyRev() {
				const token = await AsyncStorage.getItem('v99_user_token');
				axios({
					method: 'get',
					url: `${apiConfig.BASE_URL}/member/revstats`,
					headers: {Authorization: `Bearer ${token}`}
				}).then(function (response) {
					if (response.status === 200) {
						setMonthlyStats(response.data)
						setRefresh(false)
					}
				}).catch(function(error){
					console.log(error);
					setRefresh(false)
				})
			}
			getMonthlyRev();

			async function getData() {
				const token = await AsyncStorage.getItem('v99_user_token');
				axios({
					method: 'get',
					url: `${apiConfig.BASE_URL}/member/order/quickstats`,
					params: {
						rangeStart: "2022-01-01",
						rangeEnd: "2050-01-01",
					},
					headers: {Authorization: `Bearer ${token}`}
				}).then(function (response) {
					if (response.status === 200) {
						setQuickStats(response.data)
						setRefresh(false)
					}
				}).catch(function(error){
					console.log(error);
					setRefresh(false)
				})
			}
			getData();

			async function getChildOrderQuickStats() {
				const token = await AsyncStorage.getItem('v99_user_token');
				axios({
					method: 'get',
					url: `${apiConfig.BASE_URL}/member/order/child-quickstats`,
					params: {
						rangeStart: "2022-01-01",
						rangeEnd: "2050-01-01",
					},
					headers: {Authorization: `Bearer ${token}`}
				}).then(function (response) {
					if (response.status === 200) {
						setChildQuickStats(response.data)
						setRefresh(false)
					}
				}).catch(function(error){
					console.log(error);
					setRefresh(false)
				})
			}
			getChildOrderQuickStats();
		}
	}, [dispatch, refresh, isFocused])

	const menu = [
		{
			id: 1,
			title: 'Tài khoản',
			child: [
				{
					id: 11,
					title: 'Cập nhật thông tin tài khoản',
					icon: 'account',
					link: 'AccountSetting'
				},
				{
					id: 16,
					title: 'Địa chỉ nhận hàng',
					icon: 'map-marker',
					link: 'AddressSetting'
				},
				{
					id: 14,
					title: 'Thông tin nhận Thanh toán',
					icon: 'bank',
					link: 'ChangePaymentInfo'
				},
				{
					id: 13,
					title: 'Thay đổi Mật khẩu',
					icon: 'key',
					link: 'ChangePassword'
				},
				{
					id: 15,
					title: 'Đóng tài khoản',
					icon: 'account-remove',
					link: 'DeleteMe',
					params: 'deleteRequest',
					iconColor: 'text-red-500',
				},
			]
		},
		{
			id: 2,
			title: 'Affiliate',
			child: [
				{
					id: 20,
					title: 'Chương trình giới thiệu',
					icon: 'sitemap',
					link: 'AffiliateProgram'
				},
			]
		},
		{
			id: 3,
			title: 'Giao dịch',
			child: [
				{
					id: 30,
					title: 'Lịch sử nạp tiền',
					icon: 'upload',
					link: 'DepositHistoryScreen',
					type: 'modal'
				},
				{
					id: 31,
					title: 'Lịch sử rút tiền',
					icon: 'download',
					link: 'WithdrawHistoryScreen',
					type: 'modal'
				},
				{
					id: 32,
					title: 'Lịch sử Chuyển/Nhận tiền',
					icon: 'repeat',
					link: 'TransferHistoryScreen',
					type: 'modal'
				},
			]
		},
	]

	return (
		!currentUser ? <Text>Đang tải...</Text> :
		<View style={tw`flex h-full`}>
			<StatusBar barStyle={"light-content"} backgroundColor={'#1e74e5'} />
			<View style={tw`bg-white shadow-lg p-3 border-b border-gray-200 flex items-center justify-between flex-row`}>
				<View style={tw`flex flex-row items-center`}>
					<View style={tw`mr-2`}>
						{currentUser && currentUser.avatar ?
							<Image
								source={{uri: currentUser.avatar}}
								resizeMode='stretch'
								style={[tw`w-16 h-16 rounded-full`, { resizeMode: 'cover' }]}
							/>
							:
							<Image
								source={{uri: settings && settings.app_logo}}
								resizeMode='stretch'
								style={[tw`w-16 h-16 rounded-full`, { resizeMode: 'cover' }]}
							/>
						}
					</View>

					<View>
						<Text  style={tw`font-bold text-gray-700`}>{currentUser && currentUser.name}</Text>
						<Text  style={tw`text-xs text-gray-500`}>Email: <Text style={tw`font-medium text-gray-600`}>{currentUser && currentUser.email}</Text></Text>
						<Text  style={tw`text-xs text-gray-500`}>Điện thoại: <Text style={tw`font-medium text-gray-600`}>{currentUser && currentUser.phone}</Text></Text>
                        <View style={tw`flex flex-row items-center`}>
                            {currentUser && currentUser.position &&
                                <View style={tw`flex flex-row items-center mt-2`}>
                                    <View style={tw`bg-orange-400 rounded-full px-1 flex flex-row items-center mr-2`}>
                                        <Icon name={"check-circle"} style={tw`text-white mr-1`} />
                                        <Text style={tw`text-white text-xs`}>
                                            {(() => {
                                                const pos = currentUser.position;
                                                switch (pos) {
                                                    case 'Khách hàng':
                                                        return (settings && settings.normal_customer_display_name) || pos;
                                                    case 'Khách hàng ưu tiên':
                                                        return (settings && settings.customer_display_name) || pos;
                                                    case 'Cộng tác viên':
                                                        return (settings && settings.ctv_display_name) || pos;
                                                    case 'Đại lý':
                                                        return (settings && settings.dl_display_name) || pos;
                                                    case 'Nhà phân phối':
                                                        return (settings && settings.npp_display_name) || pos;
                                                    case 'Tổng đại lý':
                                                        return (settings && settings.tdl_display_name) || pos;
                                                    case 'Giám đốc Kinh doanh':
                                                    case 'Giám đốc kinh doanh':
                                                        return (settings && settings.gdkd_display_name) || pos;
                                                    case 'Giám đốc Vùng':
                                                        return (settings && settings.gdv_display_name) || pos;
                                                    case 'Giám đốc Miền':
                                                        return (settings && settings.gdm_display_name) || pos;
                                                    default:
                                                        return pos;
                                                }
                                            })()}
                                        </Text>
                                    </View>
                                </View>
                            }
							{currentUser && currentUser.showroom === 'Có' &&
								<View style={tw`flex flex-row items-center mt-2`}>
									<View style={tw`bg-green-500 rounded-full px-1 flex flex-row items-center mr-2`}>
										<Icon name={"check-circle"} style={tw`text-white mr-1`} />
										<Text style={tw`text-white text-xs`}>
											Quản lý Showroom
										</Text>
									</View>
								</View>
							}
						</View>

					</View>
				</View>
			</View>
			<ScrollView
				style={tw`pb-20`}
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refresh}
						onRefresh={() => setRefresh(true)}
						title="đang tải"
						titleColor="#000"
						tintColor="#000"
					/>
				}
			>
				<View style={tw`flex pb-10 mt-3`}>
					<View>
						<View style={tw`mb-2 mx-3 bg-white shadow p-3 rounded-md`}>
							<TouchableOpacity
								style={tw`flex items-center justify-between flex-row`}
								activeOpacity={1}
								onPress={() => props.navigation.navigate('RewardWallet')}
							>
								<View style={tw`flex items-center flex-row`}>
									<Icon name={"cash-multiple"} size={32} style={tw`mr-2 text-blue-500`} />
									<View>
										<Text  style={tw`text-gray-500 text-xs -mb-1`}>Ví</Text>
										<Text  style={tw`font-medium text-base text-gray-700`}>Tiền</Text>
									</View>

								</View>
								<View style={tw`flex items-center flex-row`}>
									<Text
										style={tw`font-bold text-lg mr-2`}>{currentUser && formatVND(currentUser.rewardWallet)}</Text>
									<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
								</View>
							</TouchableOpacity>
						</View>

						<View style={tw`mb-3 mx-3 bg-white shadow p-3 rounded-md`}>
							<TouchableOpacity
								style={tw`flex items-center justify-between flex-row`}
								activeOpacity={1}
								onPress={() => props.navigation.navigate('PointWallet')}
							>
								<View style={tw`flex items-center flex-row`}>
									<Icon name={"star"} size={32} style={tw`mr-2 text-purple-500`} />
									<View>
										<Text  style={tw`text-gray-500 text-xs -mb-1`}>Ví</Text>
										<Text  style={tw`font-medium text-base text-gray-700`}>Điểm</Text>
									</View>

								</View>
								<View style={tw`flex items-center flex-row`}>
									<Text
										style={tw`font-bold text-lg mr-2`}>{currentUser && formatNumber(currentUser.pointWallet)}</Text>
									<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
								</View>
							</TouchableOpacity>
						</View>

						<View style={tw`mb-3 mx-3 bg-white shadow p-3 rounded-md`}>
							<TouchableOpacity
								style={tw`flex items-center justify-between flex-row`}
								activeOpacity={1}
								onPress={() => props.navigation.navigate('ConsumerWallet')}
							>
								<View style={tw`flex items-center flex-row`}>
									<Icon name={"shopping"} size={32} style={tw`mr-2 text-orange-500`} />
									<View>
										<Text  style={tw`text-gray-500 text-xs -mb-1`}>Ví</Text>
										<Text  style={tw`font-medium text-base text-gray-700`}>Tiêu dùng</Text>
									</View>

								</View>
								<View style={tw`flex items-center flex-row`}>
									<Text
										style={tw`font-bold text-lg mr-2`}>{currentUser && formatNumber(currentUser.consumerWallet)}</Text>
									<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
								</View>
							</TouchableOpacity>
						</View>

						<View style={tw`mb-3 mx-3 bg-white shadow p-3 rounded-md`}>
							<TouchableOpacity
								style={tw`flex items-center justify-between flex-row`}
								activeOpacity={1}
								onPress={() => props.navigation.navigate('WaitingWallet')}
							>
								<View style={tw`flex items-center flex-row`}>
									<Icon name={"timer-sand"} size={32} style={tw`mr-2 text-yellow-500`} />
									<View>
										<Text  style={tw`text-gray-500 text-xs -mb-1`}>Ví</Text>
										<Text  style={tw`font-medium text-base text-gray-700`}>Chờ</Text>
									</View>

								</View>
								<View style={tw`flex items-center flex-row`}>
									<Text
										style={tw`font-bold text-lg mr-2`}>{currentUser && formatVND(currentUser.waitingWallet)}</Text>
									<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
								</View>
							</TouchableOpacity>
						</View>

						{/* <View style={tw`mb-3 mx-3 bg-white shadow p-3 rounded-md`}>
							<TouchableOpacity
								style={tw`flex items-center justify-between flex-row`}
								activeOpacity={1}
								onPress={() => props.navigation.navigate('ComboCommissionWallet')}
							>
								<View style={tw`flex items-center flex-row`}>
									<Icon name={"wallet"} size={32} style={tw`mr-2 text-pink-500`} />
									<View>
										<Text  style={tw`text-gray-500 text-xs -mb-1`}>Ví</Text>
										<Text  style={tw`font-medium text-base text-gray-700`}>Thưởng Combo</Text>
									</View>

								</View>
								<View style={tw`flex items-center flex-row`}>
									<Text
										style={tw`font-bold text-lg mr-2`}>{currentUser && formatVND(currentUser.comboCommissionWallet)}</Text>
									<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
								</View>
							</TouchableOpacity>
						</View> */}

						{/* <View style={tw`mb-3 mx-3 bg-white shadow p-3 rounded-md`}>
							<TouchableOpacity
								style={tw`flex items-center justify-between flex-row`}
								// activeOpacity={1}
								//onPress={() => props.navigation.navigate('ComboCommissionWallet')}
							>
								<View style={tw`flex items-center flex-row`}>
									<Icon name={"folder"} size={32} style={tw`mr-2 text-pink-500`} />
									<View>
										<Text  style={tw`text-gray-500 text-xs -mb-1`}>Combo 4</Text>
										<Text  style={tw`font-medium text-base text-gray-700`}>MaxOut</Text>
									</View>

								</View>
								<View style={tw`flex items-center flex-row`}>
									<Text
										style={tw`font-bold text-lg mr-2`}>{currentUser && formatVND(currentUser.maxOutCombo4)}</Text>
									<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
								</View>
							</TouchableOpacity>
						</View> */}

						<View style={tw`mb-3 mx-3 bg-white shadow p-3 rounded-md`}>
							<TouchableOpacity
								style={tw`flex items-center justify-between flex-row`}
								activeOpacity={1}
								onPress={() => props.navigation.navigate('Modal', {
									content: <MonthlyRevenue
										navigation={props.navigation}
										backScreen={'Account'}
										list={monthlyStats && monthlyStats.list}
									/>
								})}
							>
								<View style={tw`flex items-center flex-row`}>
									<Icon name={"chart-box-plus-outline"} size={32} style={tw`mr-2 text-green-600`} />
									<View>
										<Text  style={tw`text-gray-500 text-xs -mb-1`}>Tháng {monthlyStats && monthlyStats.currentMonth}-{monthlyStats && monthlyStats.currentYear}</Text>
										<Text  style={tw`font-medium text-base text-gray-700`}>Doanh số</Text>
									</View>

								</View>
								<View style={tw`flex items-center flex-row`}>
									<Text
										style={tw`font-bold text-lg mr-2`}>{monthlyStats && formatVND(monthlyStats.monthlyRevenue)}</Text>
									<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={tw`mb-3 bg-white`}>
						<View style={tw`border-b border-gray-200 px-3 py-3 flex flex-row items-center justify-between`}>
							<View style={tw`flex flex-row items-center`}>
								<Icon name={"clipboard-text-outline"} size={18} style={tw`text-blue-500 mr-1`} />
								<Text  style={tw`font-medium text-gray-800`}>Đơn hàng</Text>
							</View>
							<TouchableOpacity style={tw`flex flex-row items-center`} onPress={() => props.navigation.navigate('Orders')}>
								<Text  style={tw`text-gray-500`}>Xem lịch sử mua hàng</Text>
								<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
							</TouchableOpacity>
						</View>

						<ScrollView
							style={tw`py-3`}
							horizontal
							showsHorizontalScrollIndicator={false}
						>
							<TouchableOpacity
								style={tw`mr-2 px-3 py-2 flex items-center`}
								onPress={() => props.navigation.navigate('Orders', {position: 1})}
							>
								<View style={tw`relative`}>
									{quickStats && quickStats.choxacnhan > 0 &&
										<View
											style={tw`absolute top-0 right-0 z-50`}
										>
											<View
												style={tw`bg-red-500 rounded-full px-1 ${quickStats && quickStats.choxacnhan > 10 && 'py-1'}`}>
												<Text style={tw`text-white text-xs`}>
													{quickStats && quickStats.choxacnhan}
												</Text>
											</View>
										</View>
									}
									<Icon name={"store-clock"} size={32} style={tw`text-yellow-400 mb-2`}/>
								</View>
								<Text  style={tw`text-gray-800`}>Chờ xác nhận</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => props.navigation.navigate('Orders', {position: 2})}
								style={tw`mr-2 px-3 py-2 flex items-center`}
							>
								<View style={tw`relative`}>
									{quickStats && quickStats.cholayhang > 0 &&
										<View
											style={tw`absolute top-0 right-0 z-50`}
										>
											<View
												style={tw`bg-red-500 rounded-full px-1 ${quickStats && quickStats.cholayhang > 10 && 'py-1'}`}>
												<Text style={tw`text-white text-xs`}>
													{quickStats && quickStats.cholayhang}
												</Text>
											</View>
										</View>
									}
									<Icon name={"package"} size={32} style={tw`text-blue-500 mb-2`} />
								</View>
								<Text  style={tw`text-gray-800`}>Chờ lấy hàng</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => props.navigation.navigate('Orders', {position: 3})}
								style={tw`mr-2 px-3 py-2 flex items-center`}
							>
								<View style={tw`relative`}>
									{quickStats && quickStats.danggiao > 0 &&
										<View
											style={tw`absolute top-0 right-0 z-50`}
										>
											<View
												style={tw`bg-red-500 rounded-full px-1 ${quickStats && quickStats.danggiao > 10 && 'py-1'}`}>
												<Text style={tw`text-white text-xs`}>
													{quickStats && quickStats.danggiao}
												</Text>
											</View>
										</View>
									}
									<Icon name={"truck-check"} size={32} style={tw`text-orange-500 mb-2`} />
								</View>
								<Text  style={tw`text-gray-800`}>Đang giao</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => props.navigation.navigate('Orders', {position: 4})}
								style={tw`mr-2 px-3 py-2 flex items-center`}
							>
								<View style={tw`relative`}>
									{quickStats && quickStats.danhanhang > 0 &&
										<View
											style={tw`absolute top-0 right-0 z-50`}
										>
											<View
												style={tw`bg-red-500 rounded-full px-1 ${quickStats && quickStats.danhanhang > 10 && 'py-1'}`}>
												<Text style={tw`text-white text-xs`}>
													{quickStats && quickStats.danhanhang}
												</Text>
											</View>
										</View>
									}
									<Icon name={"clipboard-check"} size={32} style={tw`text-green-600 mb-2`} />
								</View>
								<Text  style={tw`text-gray-800`}>Đã nhận hàng</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => props.navigation.navigate('Orders', {position: 5})}
								style={tw`mr-2 px-3 py-2 flex items-center`}
							>
								<View style={tw`relative`}>
									{quickStats && quickStats.dahuy > 0 &&
										<View
											style={tw`absolute top-0 right-0 z-50`}
										>
											<View
												style={tw`bg-red-500 rounded-full px-1 ${quickStats && quickStats.dahuy > 10 && 'py-1'}`}>
												<Text style={tw`text-white text-xs`}>
													{quickStats && quickStats.dahuy}
												</Text>
											</View>
										</View>
									}
									<Icon name={"archive-remove"} size={32} style={tw`text-red-500 mb-2`} />
								</View>
								<Text  style={tw`text-gray-800`}>Đã huỷ</Text>
							</TouchableOpacity>
						</ScrollView>
					</View>
					{currentUser && currentUser.showroom === 'Có' &&
						<View style={tw`mb-3 bg-white`}>
							<View
								style={tw`border-b border-gray-200 px-3 py-3 flex flex-row items-center justify-between`}>
								<View style={tw`flex flex-row items-center`}>
									<Icon name={"clipboard-text-outline"} size={18} style={tw`text-green-500 mr-1`} />
									<Text style={tw`font-medium text-gray-800`}>Đơn hàng Hệ thống</Text>
								</View>
								<TouchableOpacity style={tw`flex flex-row items-center`}
								                  onPress={() => props.navigation.navigate('ChildOrders')}>
									<Text style={tw`text-gray-500`}>Xem tất cả</Text>
									<Icon name={"chevron-right"} size={18} style={tw`text-gray-500`} />
								</TouchableOpacity>
							</View>

							<ScrollView
								style={tw`py-3`}
								horizontal
								showsHorizontalScrollIndicator={false}
							>
								<TouchableOpacity
									style={tw`mr-2 px-3 py-2 flex items-center`}
									onPress={() => props.navigation.navigate('ChildOrders', { position: 1 })}
								>
									<View style={tw`relative`}>
										{childQuickStats && childQuickStats.choxacnhan > 0 &&
											<View
												style={tw`absolute top-0 right-0 z-50`}
											>
												<View
													style={tw`bg-red-500 rounded-full px-1 ${childQuickStats && childQuickStats.choxacnhan > 10 && 'py-1'}`}>
													<Text style={tw`text-white text-xs`}>
														{childQuickStats && childQuickStats.choxacnhan}
													</Text>
												</View>
											</View>
										}
										<Icon name={"store-clock"} size={32} style={tw`text-yellow-400 mb-2`} />
									</View>
									<Text style={tw`text-gray-800`}>Chờ xác nhận</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => props.navigation.navigate('ChildOrders', { position: 2 })}
									style={tw`mr-2 px-3 py-2 flex items-center`}
								>
									<View style={tw`relative`}>
										{childQuickStats && childQuickStats.cholayhang > 0 &&
											<View
												style={tw`absolute top-0 right-0 z-50`}
											>
												<View
													style={tw`bg-red-500 rounded-full px-1 ${childQuickStats && childQuickStats.cholayhang > 10 && 'py-1'}`}>
													<Text style={tw`text-white text-xs`}>
														{childQuickStats && childQuickStats.cholayhang}
													</Text>
												</View>
											</View>
										}
										<Icon name={"package"} size={32} style={tw`text-blue-500 mb-2`} />
									</View>
									<Text style={tw`text-gray-800`}>Chờ lấy hàng</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => props.navigation.navigate('ChildOrders', { position: 3 })}
									style={tw`mr-2 px-3 py-2 flex items-center`}
								>
									<View style={tw`relative`}>
										{childQuickStats && childQuickStats.danggiao > 0 &&
											<View
												style={tw`absolute top-0 right-0 z-50`}
											>
												<View
													style={tw`bg-red-500 rounded-full px-1 ${childQuickStats && childQuickStats.danggiao > 10 && 'py-1'}`}>
													<Text style={tw`text-white text-xs`}>
														{childQuickStats && childQuickStats.danggiao}
													</Text>
												</View>
											</View>
										}
										<Icon name={"truck-check"} size={32} style={tw`text-orange-500 mb-2`} />
									</View>
									<Text style={tw`text-gray-800`}>Đang giao</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => props.navigation.navigate('ChildOrders', { position: 4 })}
									style={tw`mr-2 px-3 py-2 flex items-center`}
								>
									<View style={tw`relative`}>
										{childQuickStats && childQuickStats.danhanhang > 0 &&
											<View
												style={tw`absolute top-0 right-0 z-50`}
											>
												<View
													style={tw`bg-red-500 rounded-full px-1 ${childQuickStats && childQuickStats.danhanhang > 10 && 'py-1'}`}>
													<Text style={tw`text-white text-xs`}>
														{childQuickStats && childQuickStats.danhanhang}
													</Text>
												</View>
											</View>
										}
										<Icon name={"clipboard-check"} size={32} style={tw`text-green-600 mb-2`} />
									</View>
									<Text style={tw`text-gray-800`}>Đã nhận hàng</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => props.navigation.navigate('ChildOrders', { position: 5 })}
									style={tw`mr-2 px-3 py-2 flex items-center`}
								>
									<View style={tw`relative`}>
										{childQuickStats && childQuickStats.dahuy > 0 &&
											<View
												style={tw`absolute top-0 right-0 z-50`}
											>
												<View
													style={tw`bg-red-500 rounded-full px-1 ${childQuickStats && childQuickStats.dahuy > 10 && 'py-1'}`}>
													<Text style={tw`text-white text-xs`}>
														{childQuickStats && childQuickStats.dahuy}
													</Text>
												</View>
											</View>
										}
										<Icon name={"archive-remove"} size={32} style={tw`text-red-500 mb-2`} />
									</View>
									<Text style={tw`text-gray-800`}>Đã huỷ</Text>
								</TouchableOpacity>
							</ScrollView>
						</View>
					}

					{menu && menu.map((item, index) => (
						<View style={tw`bg-white mb-3 rounded-md pt-3 px-3 pb-2`}>
							<Text  style={tw`font-medium text-gray-800 mb-2`}>{item.title}</Text>
							<View>
								{item.child && item.child.map((child, index) => (
									<TouchableOpacity
										onPress={() => {
											child.type === 'modal' ?
												props.navigation.navigate('Modal', {
													content: child.link === 'DepositHistoryScreen' ?
														<DepositHistoryScreen
															backScreen={"Account"}
															navigation={props.navigation}
														/>
														:
														child.link === 'WithdrawHistoryScreen' ?
															<WithdrawHistoryScreen
																backScreen={"Account"}
																navigation={props.navigation}
															/>
															:
															child.link === 'TransferHistoryScreen' &&
															<TransferHistoryScreen
																backScreen={"Account"}
																navigation={props.navigation}
															/>
												})
												:
											props.navigation.navigate(child.link, child.params);
										}}
									>
										<View style={tw`flex flex-row items-center`}>
											<View style={tw`flex items-center bg-gray-100 w-10 h-10 rounded-xl mr-3`}>
												<Icon name={child.icon} size={20} style={tw`${child.iconColor ? child.iconColor : 'text-gray-500'} mt-2`} />
											</View>
											<View style={tw` px-3 pt-5 w-4/5 pb-5 ${index !== item.child.length - 1 && 'border-b border-gray-100' }`}>
												<Text  style={tw`text-base ${child.iconColor ? child.iconColor : 'text-gray-700'}`}>{child.title}</Text>
											</View>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</View>
					))}
					{settings && (settings.monthly_reward_status === 'TRUE' || settings.yearly_reward_status === 'TRUE') &&
						<View style={tw`bg-white mb-3 rounded-md pt-3 px-3 pb-2`}>
							<Text  style={tw`font-medium text-gray-800 mb-2`}>Thưởng</Text>
							<View>
								{settings.monthly_reward_status === 'TRUE' &&
									<TouchableOpacity
										onPress={() => props.navigation.navigate('MonthlyReward')}
									>
										<View style={tw`flex flex-row items-center`}>
											<View style={tw`flex items-center bg-gray-100 w-10 h-10 rounded-xl mr-3`}>
												<Icon name={'calendar-text'} size={20} style={tw`text-gray-500 mt-2`} />
											</View>
											<View style={tw` px-3 pt-5 w-4/5 pb-5 ${settings && settings.yearly_reward_status === 'TRUE' && 'border-b border-gray-100' }`}>
												<Text  style={tw`text-base`}>Thưởng doanh số tháng</Text>
											</View>
										</View>
									</TouchableOpacity>
								}
								{settings.yearly_reward_status === 'TRUE' &&
									<TouchableOpacity
										onPress={() => props.navigation.navigate('YearlyReward')}
									>
										<View style={tw`flex flex-row items-center`}>
											<View style={tw`flex items-center bg-gray-100 w-10 h-10 rounded-xl mr-3`}>
												<Icon name={'calendar-star'} size={20} style={tw`text-gray-500 mt-2`} />
											</View>
											<View style={tw` px-3 pt-5 w-4/5 pb-5`}>
												<Text  style={tw`text-base`}>Thưởng doanh số năm</Text>
											</View>
										</View>
									</TouchableOpacity>
								}
							</View>
						</View>
					}
					<View style={tw`my-3 flex items-center`}>
						<TouchableOpacity
							onPress={() =>
								Alert.alert(
									'Bạn chắc chắn muốn thoát tài khoản?',
									'',
									[
										{
											text: 'Không',
											onPress: () => console.log('No, continue buying'),
										},
										{
											text: 'Đúng vậy',
											onPress: () => {
												dispatch(memberLogout(props.navigation));
												dispatch(emptyCart())
											},
											style: 'cancel',
										},
									],
									{ cancelable: false },
								)
							}
							style={tw`bg-red-500 px-10 py-2`}
						>
							<Text  style={tw`text-white`}>Đăng xuất</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={tw`flex items-center pb-2`}>
					<Text style={tw`text-xs`}>Version: {Platform.OS === 'android' ? AppConfig.androidVersion : AppConfig.iosVersion}</Text>
				</View>
			</ScrollView>
		</View>
	);
}

export default AccountScreen;
