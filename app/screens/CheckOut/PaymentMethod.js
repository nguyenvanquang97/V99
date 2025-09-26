import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { formatVND } from "app/utils/helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { emptyCart } from "app/screens/Cart/action";
import axios from "axios";
import apiConfig from "app/config/api-config";
import { GetMe, LoadDataAction } from "app/screens/Auth/action";
import Spinner from 'react-native-loading-spinner-overlay';
import CheckoutCompleted from "app/screens/CheckOut/CheckoutCompleted";
import { showMessage } from "react-native-flash-message";

function PaymentMethod(props) {
	const dispatch = useDispatch();
	const settings = useSelector(state => state.SettingsReducer.options);
	const [refresh, setRefresh] = useState(false);
	const state = props.route && props.route.params;
	const [showSpinner, setShowSpinner] = useState(false);
	const [showDetail, setShowDetail] = useState(false)
	const currentUser = useSelector(state => state.memberAuth.user);
	const [paymentMethod, setPaymentMethod] = useState('Ví tiền')
	const [tieudungMethod, setTieudungMethod] = useState(false);

	const [cashAmount, setCashAmount] = useState(state && state.cashAmount);
	const [tieudungAmount, setTieudungAmount] = useState(0);
	const [discountPercent, setDiscountPercent] = useState(state && state.discountPercent);
	const [totalDiscount, setTotalDiscount] = useState(state && state.totalDiscount);

	useEffect(() => {
    if (state) {
        setCashAmount(state && state.cashAmount)
			setTieudungAmount(0)
			setDiscountPercent(state && state.discountPercent)
			setTotalDiscount(state && state.totalDiscount)
		}
		if (tieudungMethod) {
        // Apply consumer wallet on FINAL price (after discount + VAT)
        const finalPaymentAmount = Number(state && (state.price || (Number(state.subTotal) - Number(state.totalDiscount) + Number(state.vatAmount || 0))))
        const newTieudungAmount = Math.round(finalPaymentAmount * Number(settings && settings.consumer_wallet_percent) / 100)
        const newCashAmount = finalPaymentAmount - newTieudungAmount
        setCashAmount(newCashAmount)
        setTieudungAmount(newTieudungAmount)
        setDiscountPercent(state && state.discountPercent)
        setTotalDiscount(state && state.totalDiscount)
		} else {
        setCashAmount(state && (state.cashAmount || state.price))
			setTieudungAmount(0)
			setDiscountPercent(state && state.discountPercent)
			setTotalDiscount(state && state.totalDiscount)
		}
	}, [tieudungMethod, state, settings]);

	useEffect(() => {
		props.navigation.setOptions({
			title: 'Phương thức thanh toán',
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
		})
	}, [])

	async function handleCreateOrder() {
		setShowSpinner(true);
		const token = await AsyncStorage.getItem('v99_user_token')
		const data = {
			...state.checkoutParams,
			priceDetails: state && JSON.stringify(state.prices),
			//referrer: currentUser && currentUser.parent && currentUser.parent.id,
			paymentMethod: state && state.cashAmount > 0 ? paymentMethod : 'Ví điểm',
			tieudungMethod
		}

		if (state && state.type === 'Combo') {
			// append comboId when available
			if (state.comboId) {
				data.comboId = state.comboId;
			}
			axios.post(
				`${apiConfig.BASE_URL}/member/order/create-combo`,
				data,
				{headers: {Authorization: `Bearer ${token}`}}
			).then(function (response) {
				setShowSpinner(false);
				dispatch(emptyCart());
				dispatch(GetMe(token));
				props.navigation.navigate('ModalOverlay', {
					content: <CheckoutCompleted
						result={response.data}
						navigation={props.navigation}
					/>
				})
				showMessage({
					message: 'Đặt hàng thành công!',
					type: 'success',
					icon: 'success',
					duration: 3000,
				});
			}).catch(function (error) {
				console.log(error);
				showMessage({
					message: error.response.data.message,
					type: 'danger',
					icon: 'danger',
					duration: 3000,
				});
				setShowSpinner(false);
			})
		}

		if (state && state.type === 'Duy trì') {
			axios.post(
				`${apiConfig.BASE_URL}/member/order/create-keeping`,
				data,
				{headers: {Authorization: `Bearer ${token}`}}
			).then(function (response) {
				setShowSpinner(false);
				dispatch(emptyCart());
				dispatch(GetMe(token));
				props.navigation.navigate('ModalOverlay', {
					content: <CheckoutCompleted
						result={response.data}
						navigation={props.navigation}
					/>
				})
				showMessage({
					message: 'Đặt hàng thành công!',
					type: 'success',
					icon: 'success',
					duration: 3000,
				});
			}).catch(function (error) {
				console.log(error);
				showMessage({
					message: error.response.data.message,
					type: 'danger',
					icon: 'danger',
					duration: 3000,
				});
				setShowSpinner(false);
			})
		}

		if (state && state.type === 'Sản phẩm') {
			axios.post(
				`${apiConfig.BASE_URL}/member/order/create`,
				data,
				{headers: {Authorization: `Bearer ${token}`}}
			).then(function (response) {
				setShowSpinner(false);
				dispatch(emptyCart());
				dispatch(GetMe(token));
				/*props.navigation.navigate('CheckoutCompleted', {
                    result: response.data
                })*/
				props.navigation.navigate('ModalOverlay', {
					content: <CheckoutCompleted
						result={response.data}
						navigation={props.navigation}
					/>
				})
				showMessage({
					message: 'Đặt hàng thành công!',
					type: 'success',
					icon: 'success',
					duration: 3000,
				});
			}).catch(function (error) {
				console.log(error);
				showMessage({
					message: error.response.data.message,
					type: 'danger',
					icon: 'danger',
					duration: 3000,
				});
				setShowSpinner(false);
			})
		}

	}

	return (
		!state ? <Text  >Đang tải...</Text> :
			<>
				<Spinner
					visible={showSpinner}
					textContent={'Đang xác nhận đơn hàng...'}
					textStyle={{ color: '#FFF' }}
				/>
				<View style={tw`flex bg-white min-h-full content-between`}>

					<ScrollView
						showsVerticalScrollIndicator={false}
						overScrollMode={'never'}
						scrollEventThrottle={16}
					>
						<View style={tw`pb-52 pt-3 px-5`}>
							<View>
								<TouchableOpacity
									activeOpacity={1}
									onPress={() => setTieudungMethod(!tieudungMethod)}
									style={tw`border rounded px-5 py-3 mb-3 border-gray-200 ${tieudungMethod && 'bg-red-100 border-red-300'}`}
								>
									<View style={tw`flex flex-row items-center`}>
										<Icon name={tieudungMethod ? 'checkbox-marked' : 'checkbox-blank-outline'}
													size={18} style={tw`mr-1 text-red-500`} />
										<Text style={tw`font-bold`}>
											Sử dụng Ví tiêu dùng ({currentUser && formatVND(currentUser.consumerWallet)})
										</Text>
									</View>
									{tieudungMethod &&
										<Text style={tw`italic text-xs`}>
											Sử dụng ví tiêu dùng để thanh toán {settings && settings.consumer_wallet_percent}% giá trị đơn
											hàng ({formatVND(tieudungAmount)}).
										</Text>
									}
								</TouchableOpacity>
							</View>
							{state && state.pointAmount > 0 &&
								<View>
									<Text>Bạn cần có tối thiểu <Text>{formatVND(state.pointAmount)}</Text> trong ví điểm.</Text>
									<Text>Số dư trong ví <Text>{formatVND(currentUser && currentUser.pointWallet)}</Text>.</Text>
								</View>
							}
							{cashAmount > 0 &&
								<>
									<TouchableOpacity
										activeOpacity={1}
										onPress={() => setPaymentMethod('Ví tiền')}
										style={tw`border rounded px-5 py-3 mb-3 border-gray-200 ${paymentMethod === 'Ví tiền' && 'bg-blue-100 border-blue-300'}`}
									>
										<View style={tw`flex flex-row items-center`}>
											<Icon name={paymentMethod === 'Ví tiền' ? 'radiobox-marked' : 'radiobox-blank'}
											      size={18} style={tw`mr-1 text-blue-500`} />
											<Text style={tw`font-bold`}>
												Ví tiền thưởng ({currentUser && currentUser && formatVND(currentUser.rewardWallet)})
											</Text>
										</View>
										<Text style={tw`italic text-xs`}>
											Sử dụng ví tiền thưởng để thanh toán.
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										activeOpacity={1}
										onPress={() => setPaymentMethod('COD')}
										style={tw`border rounded px-5 py-3 mb-3 border-gray-200 ${paymentMethod === 'COD' && 'bg-blue-100 border-blue-300'}`}
									>
										<View style={tw`flex flex-row items-center`}>
											<Icon name={paymentMethod === 'COD' ? 'radiobox-marked' : 'radiobox-blank'} size={18} style={tw`mr-1 text-blue-500`} />
											<Text style={tw`font-bold`}>
												Thanh toán khi nhận hàng
											</Text>
										</View>
										<Text style={tw`italic text-xs`}>
											Quý khách sẽ thanh toán cho người vận chuyển sau khi nhận và kiểm tra hàng.
										</Text>

									</TouchableOpacity>

									<TouchableOpacity
										activeOpacity={1}
										onPress={() => setPaymentMethod('Chuyển khoản')}
										style={tw`border rounded px-5 py-3 mb-3 border-gray-200 ${paymentMethod === 'Chuyển khoản' && 'bg-blue-100 border-blue-300'}`}
									>
										<View style={tw`flex flex-row items-center`}>
											<Icon name={paymentMethod === 'Chuyển khoản' ? 'radiobox-marked' : 'radiobox-blank'} size={18} style={tw`mr-1 text-blue-500`} />
											<Text style={tw`font-bold`}>
												Chuyển khoản ngân hàng
											</Text>
										</View>
										<Text style={tw`italic text-xs`}>
											Thực hiện chuyển khoản vào tài khoản ngân hàng của chúng tôi.
										</Text>
									</TouchableOpacity>
								</>
							}

						</View>
					</ScrollView>

					<View style={tw`absolute bottom-0 android:bottom-14 bg-white w-full pb-5 pt-1 shadow-lg px-3`}>
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
									<View
										style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
										<Text  >Tạm tính</Text>
										<Text  >{formatVND(state.subTotal)}</Text>
									</View>
									{discountPercent > 0 &&
										<View
											style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
											<Text>Chiết khấu ({discountPercent}%)</Text>
											<Text style={tw`text-red-500`}>-{formatVND(totalDiscount)}</Text>
										</View>
									}
									{state.vatAmount > 0 &&
										<View
											style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
											<Text>VAT (8%)</Text>
											<Text  style={tw`text-blue-500`}>+{formatVND(state.vatAmount)}</Text>
										</View>
									}
									{state.btmReward > 0 &&
										<View
											style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
											<Text>Điểm thưởng BTM</Text>
											<Text  style={tw`text-purple-500 font-medium`}>+{state.btmReward} điểm</Text>
										</View>
									}
								</View>
							}
							{state && state.cashAmount > 0 &&
								<View style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
									<Text>Tổng tiền</Text>
									<Text style={tw`text-blue-500 font-bold`}>{formatVND(cashAmount)}</Text>
								</View>
							}
							{state && state.pointAmount > 0 &&
								<View style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
									<Text>Tổng điểm</Text>
									<Text style={tw`text-purple-500 font-bold`}>{formatVND(state.pointAmount)}</Text>
								</View>
							}
							{tieudungAmount > 0 &&
								<View style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
									<Text>Tổng điểm Tiêu dùng</Text>
									<Text style={tw`text-purple-500 font-bold`}>{formatVND(tieudungAmount)}</Text>
								</View>
							}
						</View>
						<TouchableOpacity
							style={tw`${showSpinner ? 'bg-blue-500': 'bg-orange-500'} px-5 py-3 rounded w-full flex items-center justify-between`}
							onPress={handleCreateOrder}
							disabled={showSpinner}
						>
							<Text style={tw`text-white font-bold uppercase`}>
								{showSpinner ? 'Đang đặt hàng...' : 'Đặt hàng'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</>

	);
}

export default PaymentMethod;
