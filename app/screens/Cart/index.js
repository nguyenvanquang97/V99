import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Image, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { emptyCart, removeFromCart, updateCart } from "app/screens/Cart/action";
import { apiClient } from "app/services/client";
import apiConfig from "app/config/api-config";
import { formatVND } from "app/utils/helper";
import NumericInput from "react-native-numeric-input";
import { useFocusEffect } from "@react-navigation/native";
import InputSpinner from "react-native-input-spinner";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CartScreen(props) {
	const dispatch = useDispatch();
	const cart = useSelector(state => state.CartReducer);
	const settings = useSelector(state => state.SettingsReducer.options);
	const currentUser = useSelector(state => state.memberAuth.user);
	const [result, setResult] = useState([])
	const [refresh, setRefresh] = useState(false)
	const [flag, setFlag] = useState(false)
	const [showDetail, setShowDetail] = useState(false)
	let cartQuantity = 0
	if (cart) {
		var listPrice = cart.items;
		cart.items.map((el) => (
			cartQuantity += el.quantity
		))
	}
	
	async function getPriceCalc(productPrice, quantity) {
		const token = await AsyncStorage.getItem('v99_user_token');
		return axios({
			method: 'post',
			url: `${apiConfig.BASE_URL}/member/order/calcPrice`,
			data: {
				orderItems: listPrice
			},
			headers: {Authorization: `Bearer ${token}`}
		}).then(function(response) {
			if (response.status === 201) {
				setResult(response.data)
			}
		}).catch((function(error) {
			console.log(error);
			dispatch(emptyCart())
		}))
	}
	
	useFocusEffect(
		React.useCallback(() => {
			if (currentUser) {
				getPriceCalc()
			}
		}, [dispatch, refresh, flag, cart])
	)
	
	function handleChangeQuantity(productPrice, quantity) {
		const Item = {
			productPrice,
			quantity
		}
		dispatch(updateCart(Item))
		setFlag(!flag)
	}
	
	useEffect(() => {
		props.navigation.setOptions({
			title: 'Giỏ hàng',
			headerStyle: {
				backgroundColor: '#1e74e5',
			},
			headerTintColor: '#fff',
			headerLeft: () => (
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => props.navigation.goBack()}>
					<Icon name="chevron-left"
					      size={26}
					      style={tw`text-white ml-3`}
					/>
				</TouchableOpacity>
			),
			headerRight: () => (
				<View style={tw`flex flex-row items-center`}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={handleEmptyCart}
					>
						<Icon name="delete-forever"
						      size={23}
						      style={tw`text-white mr-3`}
						/>
					</TouchableOpacity>
				</View>
			)
		})
	}, [])
	
	function handleEmptyCart() {
		Alert.alert(
			'Xoá tất cả sản phẩm trong giỏ hàng?',
			'',
			[
				{
					text: 'Huỷ',
					onPress: () => console.log('No, continue buying'),
				},
				{
					text: 'Xoá bỏ',
					onPress: () => dispatch(emptyCart()),
					style: 'cancel',
				},
			],
			{cancelable: false},
		)
	}
	
	return (
		<>
			<StatusBar barStyle={"light-content"} backgroundColor={'#1e74e5'} />
			{!result ? <Text>Đang tải</Text> :
				result && result.prices && result.prices.length > 0 ?
					<View style={tw`flex bg-gray-100 min-h-full content-between`}>
						<ScrollView
							showsVerticalScrollIndicator={false}
							overScrollMode={'never'}
							scrollEventThrottle={16}
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
							<View style={tw`pb-52 pt-3`}>
								{/*<View style={tw`m-3`}>
							<Text><Text>Đang có </Text>{Number(cartQuantity)} sản phẩm trong giỏ hàng</Text>
						</View>*/}
								<View>
									{result.prices.map((item, index) => (
											<View style={tw`relative rounded mx-3 mb-3 bg-white p-3 shadow`}>
												<View style={tw`flex flex-row items-center`} key={index}>
													<View style={tw`mr-3`}>
														<Image
															source={{ uri: item.product.featureImage }}
															style={tw`w-26 h-26`}
														/>
													</View>
													<View>
														<View style={tw`mb-3`}>
															<Text
																style={tw`font-medium mb-1 mr-26`}
																numberOfLines={2}
																ellipsizeMode={"tail"}
															>
																{item && item.product.name} - {item.name}
															</Text>
															<Text
																style={tw`font-medium text-red-600`}
															>
																{item.price && formatVND(item.price)}
															</Text>
															<Text
																style={tw`text-xs italic`}>Kho: {item.inStock} sản
																phẩm</Text>
														</View>
														<InputSpinner
															max={item.instock}
															min={1}
															step={1}
															height={40}
															width={140}
															style={tw`shadow-none border border-gray-200`}
															skin={"square"}
															colorMax={"#f04048"}
															colorMin={"#cbcbcb"}
															value={Number(item.quantity)}
															onChange={(num) => {
																handleChangeQuantity(item.id, num)
															}}
														/>
													
													</View>
												</View>
												<View style={tw`absolute top-0 left-0`}>
													<TouchableOpacity
														style={tw`flex flex-row items-center bg-red-600 p-1 rounded-tl rounded-br`}
														onPress={() => dispatch(removeFromCart(item.id))}
													>
														<Icon name={"minus-circle"} style={tw`text-white`} />
														<Text style={tw`text-white text-xs`}>Xoá</Text>
													</TouchableOpacity>
												</View>
											</View>
										))
									}
								</View>
							</View>
						</ScrollView>
						
						{
							currentUser && currentUser ?
								
								<>
									<View
										style={tw`absolute bottom-0 android:bottom-14 bg-white w-full pt-1 pb-5 shadow-lg px-3`}>
										<View style={tw`mb-2`}>
											<View style={tw`flex items-center content-center`}>
												<TouchableOpacity
													onPress={() => setShowDetail(!showDetail)}
												>
													<Icon name={showDetail ? 'chevron-down' : 'chevron-up'} size={30} />
												</TouchableOpacity>
											</View>
											{showDetail &&
												<View>
													{result.prices && result.prices.length > 0 && result.prices.map((item, index) => (
														<View
															style={tw`flex flex-row justify-between border-b border-gray-100 pb-2 mb-2`}
															key={index}>
															<Text style={tw`text-gray-500 w-2/3`}>
																{item.product.name} - {item.name}
																<Text style={tw`font-bold`}>x {item.quantity}</Text>
															</Text>
														</View>
													))}
													<View
														style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
														<Text>Tạm tính</Text>
														<Text>{formatVND(result.subTotal)}</Text>
													</View>
													{result.discount > 0 &&
														<View
															style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
															<Text>Chiết khấu ({result.discountPercent}%)</Text>
															<Text
																style={tw`text-red-500`}>-{formatVND(result.discount)}</Text>
														</View>
													}
													{result.vatAmount > 0 &&
														<View
															style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
															<Text>VAT (8%)</Text>
															<Text
																style={tw`text-blue-500`}>+{formatVND(result.vatAmount)}</Text>
														</View>
													}
													{result.btmReward > 0 &&
														<View
															style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
															<Text>Điểm thưởng BTM</Text>
															<Text
																style={tw`text-purple-500 font-medium`}>+{result.btmReward} điểm</Text>
														</View>
													}
												</View>
											}
											<View style={tw`flex flex-row items-center justify-between mb-1`}>
												<Text>Tổng tiền</Text>
												<Text
													style={tw`text-blue-500 text-base font-bold`}>{formatVND(result.price)}</Text>
											</View>
										</View>
										<View>
											<TouchableOpacity
												style={tw`bg-blue-500 px-5 py-3 rounded w-full flex items-center justify-between`}
												onPress={() => props.navigation.navigate('CustomerInformation', {
													subTotal: result && result.subTotal,
													totalAmount: result && Number(result.subTotal) - result && Number(result.discount),
													prices: result && result.prices,
													cashAmount: result && result.cashAmount,
													pointAmount: result && result.pointAmount,
													orderParams: listPrice,
													totalDiscount: result && Number(result.discount),
													discountPercent: result && Number(result.discountPercent),
													vatAmount: result && Number(result.vatAmount),
													btmReward: result && Number(result.btmReward),
													price: result && Number(result.price),
													type: 'Sản phẩm'
												})}
											>
												<Text style={tw`text-white font-bold uppercase`}>đặt hàng</Text>
											</TouchableOpacity>
										</View>
									</View>
								</>
								
								:
								<>
									<View style={tw`absolute bottom-0 bg-white w-full py-3 shadow-lg px-3`}>
										<TouchableOpacity
											onPress={() => props.navigation.navigate('Login')}
											style={tw`bg-orange-500 px-5 py-3 rounded flex items-center`}
										>
											<Text style={tw`text-white uppercase font-medium`}>Đăng nhập để đặt
												hàng</Text>
										</TouchableOpacity>
									</View>
								</>
						}
					
					</View>
					:
					<View style={tw`flex items-center content-center py-30`}>
						<Icon name={"shopping-outline"} size={50} style={tw`mb-5 text-gray-500`} />
						<Text style={tw`mb-5`}>Chưa có sản phẩm trong giỏ hàng</Text>
						<TouchableOpacity
							onPress={() => props.navigation.navigate('Products')}
							style={tw`bg-blue-500 px-5 py-2 rounded`}
						>
							<Text style={tw`text-white`}>Bắt đầu mua sắm</Text>
						</TouchableOpacity>
					</View>
			}
		</>
		
	);
}

export default CartScreen;
