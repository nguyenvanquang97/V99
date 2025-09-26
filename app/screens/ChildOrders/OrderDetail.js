import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Image,
	RefreshControl,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import apiConfig from "app/config/api-config";
import { PaymentMethod } from "app/models/commons/order.model";
import { formatDateTime, formatNumber, formatVND } from "app/utils/helper";
import DynamicWebView from "app/components/DynamicWebView";
import Clipboard from '@react-native-clipboard/clipboard';
import { showMessage } from "react-native-flash-message";
import BottomSheet from 'react-native-gesture-bottom-sheet';
import CanceledOrderForm from "app/screens/Orders/components/CanceledOrderForm";

function ChildOrderDetailScreen(props) {
	const isFocused = useIsFocused();
	const settings = useSelector(state => state.SettingsReducer.options)
	const orderId = props.route.params.id;
	const [refresh, setRefresh] = useState(false);
	const [showSpinner, setShowSpinner] = useState(true);
	const [result, setResult] = useState();

	const bottomSheet = useRef();
	function handleCloseBottomSheet() {
		bottomSheet.current.close()
	}

	useEffect(() => {
		props.navigation.setOptions({
			title: 'Thông tin đơn hàng',
			headerStyle: {
				backgroundColor: '#fff',
			},
			headerTintColor: '#000',
			headerLeft: () => (
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => props.navigation.goBack()}>
					<Icon name="chevron-left"
					      size={26}
					      style={tw`ml-3`}
					/>
				</TouchableOpacity>
			),
		})
	}, [])

	useEffect(() => {
		if (isFocused) {
			async function getData() {
				const Token = await AsyncStorage.getItem('v99_user_token');
				axios({
					method: 'get',
					url: `${apiConfig.BASE_URL}/member/order/child/${orderId}`,
					headers: { Authorization: `Bearer ${Token}` }
				}).then(function(response) {
					if (response.status === 200) {
						setResult(response.data)
						setRefresh(false)
						setShowSpinner(false)
					}
				}).catch(function(error) {
					//history.push('/404')
					console.log(error);
					setRefresh(false)
					setShowSpinner(false)
				})
			}

			getData();
		}
	}, [refresh, isFocused, orderId])

	const copyToClipboard = (value) => {
		Clipboard.setString(value)
		showMessage({
			message: 'Đã sao chép vào bộ nhớ tạm',
			type: 'success',
			icon: 'success',
			duration: 1500,
		});
	}

	let priceDetails = [];
	let receiver = {};
	if (result) {
		priceDetails = JSON.parse(result.order.priceDetails)
		receiver = JSON.parse(result.order.receiver)
	}

	async function handleCancelOrder(data){
		const Token = await AsyncStorage.getItem('v99_user_token');
		axios({
			method: 'put',
			url: `${apiConfig.BASE_URL}/member/order/canceled/${orderId}`,
			data,
			headers: {Authorization: `Bearer ${Token}`},
		}).then(function (response) {
			setRefresh(!refresh);
			handleCloseBottomSheet()
			message.success(`Đã cập nhật đơn hàng #${orderId}`)
		}).catch(function(error){
			console.log(error);
		})
	}

	async function handleApprovedOrder(data){
		const Token = await AsyncStorage.getItem('v99_user_token');
		axios({
			method: 'put',
			url: `${apiConfig.BASE_URL}/member/order/child-approved/${orderId}`,
			headers: {Authorization: `Bearer ${Token}`},
		}).then(function (response) {
			setRefresh(!refresh);
			handleCloseBottomSheet()
			message.success(`Đã duyệt đơn hàng #${orderId}`)
		}).catch(function(error){
			console.log(error);
		})
	}

	async function handleNhanHang() {
		const Token = await AsyncStorage.getItem('v99_user_token');
		axios({
			method: 'put',
			url: `${apiConfig.BASE_URL}/member/order/danhan/${orderId}`,
			headers: {Authorization: `Bearer ${Token}`},
		}).then(function (response) {
			setRefresh(!refresh);
			message.success(`Đã cập nhật đơn hàng #${orderId}`)
		}).catch(function(error){
			console.log(error);
		})
	}

	return (
		!result ? <ActivityIndicator /> :
		<View>
			<StatusBar barStyle={"dark-content"}/>
			<View style={tw`flex bg-gray-100 min-h-full content-between`}>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={refresh}
							onRefresh={() => setRefresh(true)}
							title="đang tải"
							titleColor="#000"
							tintColor="#000"
						/>
					}
					showsVerticalScrollIndicator={false}
					overScrollMode={'never'}
					scrollEventThrottle={16}
				>
					<View style={tw`pb-32`}>
						<View style={tw`mb-3 bg-white p-3`}>
							<View style={tw`flex items-center mb-3`}>
								<Text  style={tw`mb-3 text-gray-500`}>Mã đơn hàng: <Text style={tw`font-bold text-gray-800`}>#{result.order.id}</Text></Text>
								<Text>{result && result.order.status}</Text>
							</View>
							{result && result.order.status === 'Chờ xác nhận' &&
								<View style={tw`flex items-center mb-3`}>
									<TouchableOpacity
										onPress={() => handleApprovedOrder()}
										style={tw`bg-green-500 px-3 py-2 rounded`}
									>
										<Text style={tw`text-white font-bold`}>Duyệt đơn</Text>
									</TouchableOpacity>
								</View>
							}
							<View>
								<View style={tw`mb-2`}>
									<Text  style={tw`text-gray-500`}>
										Ngày tạo: <Text style={tw`text-gray-800`}>{formatDateTime(result.order.createdAt)}</Text>
									</Text>
								</View>
								{result.order.approvedAt &&
									<View style={tw`mb-2`}>
										<Text  style={tw`text-gray-500`}>
											Ngày cập nhật: <Text
											style={tw`text-gray-800`}>{formatDateTime(result.order.approvedAt)}</Text>
										</Text>
									</View>
								}
							</View>
						</View>
						<View style={tw`mb-3 bg-white p-3`}>
							<View style={tw`mb-5 flex items-center flex-row`}>
								<Icon name={"wallet-outline"} size={18} style={tw`text-red-600 mr-1`}/>
								<Text  style={tw`font-bold text-gray-600`}>Thông tin thanh toán</Text>
							</View>
							<View>
								<View style={tw`py-2 border-b border-gray-100`}>
									<Text>Phương thức thanh toán: <Text style={tw`font-medium`}>{result.order.paymentMethod}</Text></Text>
								</View>

								<View style={tw`py-2 border-b border-gray-100`}>
									<Text>Số tiền thanh toán: <Text
										style={tw`font-medium text-red-600`}>{result && formatVND(result.order.amount)}</Text></Text>
								</View>

								{result && result.order.paymentMethod === 'Chuyển khoản' && result.order.status === 'Chờ xác nhận' &&
									<View>
										<Text  style={tw`py-2 mb-2`}>Quý khách vui lòng thanh toán theo thông tin bên dưới:</Text>
										<View style={tw`mb-5 flex items-center`}>
											<Image source={{uri: `https://img.vietqr.io/image/${settings && settings.bank_code}-${settings && settings.bank_account}-${settings && settings.payment_qr_template}.jpg?amount=${result.order.cash}&addInfo=V99+${result.order.id}+${receiver.phone}`}} style={tw`w-32 h-32`} />
										</View>
										<View style={tw`mb-3 border-b border-gray-100 pb-2`}>
											<View style={tw`flex flex-row items-center justify-between mb-2`}>
												<Text>Ngân hàng</Text>
												<Text style={tw`font-medium`} numberOfLines={2}>{settings && settings.bank_name}</Text>
											</View>
											<View style={tw`flex flex-row items-center justify-between mb-2`}>
												<Text>Chủ tài khoản</Text>
												<Text style={tw`font-medium`} numberOfLines={2}>{settings && settings.bank_owner}</Text>
											</View>
											<View style={tw`flex flex-row items-center justify-between mb-2`}>
												<Text>Số tài khoản</Text>
												<View>
													<Text style={tw`font-medium`}>{settings && settings.bank_account}</Text>
													<TouchableOpacity
														onPress={() => copyToClipboard(settings && settings.bank_account)}
														style={tw`flex flex-row items-center`}
													>
														<Icon name="content-copy" style={tw`text-blue-400 mr-1`} />
														<Text style={tw`text-blue-400`}>Sao chép</Text>
													</TouchableOpacity>
												</View>
											</View>

											<View style={tw`flex flex-row items-center justify-between mb-2`}>
												<Text>Số tiền</Text>
												<View>
													<Text style={tw`font-medium`}>{result && formatVND(result.order.cash)}</Text>
													<TouchableOpacity
														onPress={() => copyToClipboard(result.order.cash)}
														style={tw`flex flex-row items-center`}
													>
														<Icon name="content-copy" style={tw`text-blue-400 mr-1`} />
														<Text style={tw`text-blue-400`}>Sao chép</Text>
													</TouchableOpacity>
												</View>
											</View>

											<View style={tw`flex flex-row items-center justify-between mb-2`}>
												<Text>Nội dung</Text>
												<View>
													<Text style={tw`font-medium`}>V99-{result.order.id}-{receiver.phone}</Text>
													<TouchableOpacity
														onPress={() => copyToClipboard(`V99-${result.order.id}-${receiver.phone}`)}
														style={tw`flex flex-row items-center`}
													>
														<Icon name="content-copy" style={tw`text-blue-400 mr-1`} />
														<Text style={tw`text-blue-400`}>Sao chép</Text>
													</TouchableOpacity>
												</View>
											</View>
										</View>
									</View>
								}

							</View>

						</View>
						<View style={tw`mb-3 bg-white p-3`}>
							<View style={tw`mb-5 flex items-center flex-row`}>
								<Icon name={"cart-outline"} size={18} style={tw`text-blue-500 mr-1`}/>
								<Text  style={tw`font-bold text-gray-600`}>Thông tin đơn hàng</Text>
							</View>
							<View>
								{priceDetails && priceDetails.length > 0 &&
									priceDetails.map((item) => (
										<View style={tw`pb-2 mb-2 border-b border-gray-100`}>
											<Text>
												{item.product.name} - {item.name}
												<Text> (x {item.quantity})</Text>
											</Text>
										</View>
									))
								}
								<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
									<Text>Tạm tính</Text>
									<Text  style={tw`font-medium`}>{formatVND(result && result.order.revenue)}</Text>
								</View>
								{Number(result && result.order.discount) > 0 &&
									<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
										<Text>Chiết khấu ({result.order.chietkhau}%)</Text>
										<Text  style={tw`text-red-500`}>- {formatVND(result && result.order.discount)}</Text>
									</View>
								}
								{result && result.order.vatAmount > 0 &&
									<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
										<Text>VAT (8%)</Text>
										<Text  style={tw`text-blue-500`}>+{formatVND(result.order.vatAmount)}</Text>
									</View>
								}
								{result && result.order.btmReward > 0 &&
									<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
										<Text>Điểm thưởng BTM</Text>
										<Text  style={tw`text-purple-500 font-medium`}>+{result.order.btmReward} điểm</Text>
									</View>
								}
								<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
									<Text>Tổng tiền</Text>
									<Text  style={tw`font-bold text-blue-500`}>{formatVND(result && result.order.amount)}</Text>
								</View>
								
								{/* Phương thức thanh toán */}
								{result && result.order.cash > 0 &&
									<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
										<Text>Tiền mặt</Text>
										<Text  style={tw`text-green-500 font-medium`}>-{formatVND(result.order.cash)}</Text>
									</View>
								}
								{result && result.order.point > 0 &&
									<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
										<Text>Ví điểm</Text>
										<Text  style={tw`text-purple-500 font-medium`}>-{formatVND(result.order.point)}</Text>
									</View>
								}
								{result && result.order.tieudungAmount > 0 &&
									<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
										<Text>Ví tiêu dùng</Text>
										<Text  style={tw`text-orange-500 font-medium`}>-{formatNumber(result.order.tieudungAmount)} BTM</Text>
									</View>
								}
								{result && result.order.paymentMethod && result.order.paymentMethod !== 'Ví tiền' && result.order.paymentMethod !== 'Ví điểm' &&
									<View style={tw`pb-2 mb-2 border-b border-gray-100 flex flex-row justify-between`}>
										<Text>Phương thức khác</Text>
										<Text  style={tw`text-blue-500 font-medium`}>{result.order.paymentMethod}</Text>
									</View>
								}
							</View>

						</View>
						<View style={tw`mb-3 bg-white p-3`}>
							<View style={tw`mb-5 flex items-center flex-row`}>
								<Icon name={"account-box-outline"} size={18} style={tw`text-purple-500 mr-1`}/>
								<Text  style={tw`font-bold text-gray-600`}>Thông tin nhận hàng</Text>
							</View>
							<View>
								<View style={tw`pb-2 mb-2 border-b border-gray-100`}>
									<Text  style={tw`text-gray-500`}>Họ tên: <Text style={tw`font-medium text-black`}>{receiver.name}</Text></Text>
								</View>
								<View style={tw`pb-2 mb-2 border-b border-gray-100`}>
									<Text  style={tw`text-gray-500`}>Số điện thoại: <Text style={tw`font-medium text-black`}>{receiver.phone}</Text></Text>
								</View>
								<View style={tw`pb-2 mb-2 border-b border-gray-100`}>
									<Text  style={tw`text-gray-500`}>Email: <Text style={tw`font-medium text-black`}>{receiver.email}</Text></Text>
								</View>
								<View>
									<Text  style={tw`text-gray-500`}>Địa chỉ: <Text style={tw`font-medium text-black`}>{receiver.address}</Text></Text>
								</View>
							</View>
						</View>
						<View style={tw`mb-3 bg-white p-3 mb-5`}>
							<View style={tw`mb-5 flex items-center flex-row`}>
								<Icon name={"note-edit-outline"} size={18} style={tw`text-yellow-500 mr-1`}/>
								<Text  style={tw`font-bold text-gray-600`}>Ghi chú cho đơn hàng</Text>
							</View>
							{result.order.note ?
								<Text>{result.order.note}</Text>
								:
								<Text>Không có ghi chú.</Text>
							}
						</View>

						{result && result.order.status === 'Chờ xác nhận' &&
							<View style={tw`flex items-center`}>
								<TouchableOpacity
									onPress={() => bottomSheet.current.show()}
									style={tw`border border-gray-600 px-4 py-2`}
								>
									<Text style={tw`text-gray-600`}>Xác nhận Huỷ đơn hàng</Text>
								</TouchableOpacity>
							</View>
						}
					</View>
				</ScrollView>
				{result && result.order.process === 'Đang giao' &&
					<View style={tw`absolute bottom-0 android:bottom-14 bg-white w-full py-3 shadow-lg px-3`}>
						<TouchableOpacity
							onPress={() => handleNhanHang()}
							style={tw`bg-orange-500 flex items-center w-full p-3 rounded`}
						>
							<Text style={tw`text-white font-medium uppercase`}>
								Đã nhận được hàng
							</Text>
						</TouchableOpacity>
					</View>
				}
			</View>
			<BottomSheet hasDraggableIcon ref={bottomSheet} height={300}>
				<View
					style={tw`p-5`}
				>
					<CanceledOrderForm
						onCancel={handleCancelOrder}
					/>
				</View>
			</BottomSheet>
		</View>
	);
}

export default ChildOrderDetailScreen;
