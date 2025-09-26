import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { formatVND } from "app/utils/helper";
import { Field, Formik } from "formik";
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomInput from "app/components/CustomInput";
import { showMessage } from "react-native-flash-message";
import AddressField from "app/components/AddressField";
import axios from "axios";
import apiConfig from "app/config/api-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShowroomItem from "app/screens/CheckOut/ShowroomItem";
import { updateAccount } from "app/screens/Auth/action";

function CustomerInformation(props) {
	const dispatch = useDispatch();
	const [refresh, setRefresh] = useState(false);
	const [flag, setFlag] = useState(false);
	const state = props.route && props.route.params;
	const [showDetail, setShowDetail] = useState(false)
	const currentUser = useSelector(state => state.memberAuth.user);

	const [province, setProvince] = useState(currentUser && currentUser.province)
	const [district, setDistrict] = useState(currentUser && currentUser.district)
	const [ward, setWard] = useState(currentUser && currentUser.ward)

	const [provinceName, setProvinceName] = useState(currentUser && currentUser.provinceName)
	const [districtName, setDistrictName] = useState(currentUser && currentUser.districtName)
	const [wardName, setWardName] = useState(currentUser && currentUser.wardName)

	const [address, setAddress] = useState(currentUser && currentUser.address)

	const [kho, setKho] = useState();
	const [danhsachKho, setDanhsachkho] = useState();

	const map = useSelector(state => state.SettingsReducer.map)

	useEffect(() => {
		async function getKho() {
			const token = await AsyncStorage.getItem('v99_user_token');
			axios({
				method: 'get',
				url: `${apiConfig.BASE_URL}/user/danhsachkho`,
				params: {
					map_lat: map ? map.lat : null,
					map_lng: map ? map.lng : null,
				},
				headers: { Authorization: `Bearer ${token}` }
			}).then(function (response) {
				if (response.status === 200) {
					setDanhsachkho(response.data)
				}
			}).catch(function(error){
				console.log(error);
			})
		}
		getKho();
	}, [map]);

	useEffect(() => {
		props.navigation.setOptions({
			title: 'Thông tin đặt hàng',
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

	let initialValues;
	if (currentUser && currentUser) {
		initialValues = {
			name: currentUser && currentUser.name,
			email: currentUser && currentUser.email,
			phone: currentUser && currentUser.phone,
			address: currentUser && currentUser.address,
			referrer: currentUser && currentUser.parent && currentUser.parent.id,
		}
	} else {
		initialValues = {
			name: '',
			email: '',
			phone: '',
			address: '',
			referrer: null,
		}
	}

	const OrderSchema = Yup.object().shape({
		email: Yup
			.string()
			.email("Nhập đúng địa chỉ email")
			.required('Vui lòng nhập email'),
		name: Yup
			.string()
			.required('Vui lòng nhập tên'),
		phone: Yup
			.string(() => 'Vui lòng nhập đúng số điện thoại')
			.max(10, ({max}) => 'Vui lòng nhập đúng số điện thoại')
			.min(10, ({min}) => 'Vui lòng nhập đúng số điện thoại')
			.required('Vui lòng nhập số điện thoại'),
	})

	function handleCheckout(values) {
		console.log('run here')
		if (!district || !address || !ward || !province ) {
			showMessage({
				message: 'Vui lòng nhập đủ thông tin địa chỉ nhận hàng',
				type: 'danger',
				icon: 'danger',
				duration: 3000,
			});
			return;
		}
		const data = {
			...values,
			district,
			province,
			ward,
			districtName,
			provinceName,
			wardName,
			showroom: kho,
			orderItems: state && state.orderParams,
			name: values.name,
			phone: values.phone,
			email:values.email,
			address,
			note: values.note,
			type: state && state.type,
			referrer: state && state.referrer,
			shopType: state && state.shopType,
			orderItemArr: JSON.stringify(state && state.orderItemArr),
			comboNumber: state && state.comboNumber,
		}

		dispatch(updateAccount({
			district,
			province,
			ward,
			districtName,
			provinceName,
			wardName,
			address
		}))

		props.navigation.navigate('PaymentMethod', {
			checkoutParams: data,
			subTotal: Number(state.subTotal),
			totalDiscount: Number(state.totalDiscount),
			discountPercent: Number(state.discountPercent),
			vatAmount: Number(state.vatAmount || 0),
			price: Number(state.price || (Number(state.subTotal) - Number(state.totalDiscount))),
			cashAmount: Number(state.price || state.cashAmount),
			pointAmount: Number(state.pointAmount),
			totalAmount: Number(state.subTotal) - Number(state.totalDiscount),
			prices: state.prices,
			checkOutType: state && state.checkOutType,
			type: state && state.type,
			comboNumber: state && state.comboNumber,
			comboId: state && state.comboId,
			btmReward: state && state.btmReward
		})
	}

	return (
		!state ? <Text  >Đang tải</Text> :
		<View style={tw`flex bg-gray-100 min-h-full content-between`}>
			<Formik
				initialValues={initialValues}
				onSubmit={values => handleCheckout(values)}
				validationSchema={OrderSchema}
			>
				{({handleSubmit, values, setFieldValue, isValid}) => (
					<>
						<ScrollView
							showsVerticalScrollIndicator={false}
							overScrollMode={'never'}
							scrollEventThrottle={16}
						>
							<View style={tw`pb-52`}>
								<KeyboardAwareScrollView>
									<View style={tw`bg-white p-3 mb-3`}>
										<View style={tw`mb-2`}>
											<View>
												<Field
													component={CustomInput}
													required
													name="name"
													label="Họ tên"
												/>
												<Field
													component={CustomInput}
													required
													name="phone"
													label="Số điện thoại"
													keyboardType={'numeric'}
												/>
												<Field
													component={CustomInput}
													required
													name="email"
													label="Email"
													keyboardType={'email-address'}
												/>
												{!currentUser ? <ActivityIndicator /> :
													<View style={tw`mb-5 border-b border-gray-200`}>
														<Text style={tw`font-bold text-blue-500 mb-3 uppercase text-xs`}>
															Thông tin nhận hàng
														</Text>
														<AddressField
															navigation={props.navigation}
															onChangeProvince={(data) => setProvince(data)}
															onChangeDistrict={(data) => setDistrict(data)}
															onChangeWard={(data) => setWard(data)}
															onChangeWardName={(data) => setWardName(data)}
															onChangeDistrictName={(data) => setDistrictName(data)}
															onChangeProvinceName={(data) => setProvinceName(data)}
															onChangeAddress={(data) => setAddress(data)}
															currentData={{
																province,
																district,
																ward,
																provinceName,
																districtName,
																wardName,
																address
															}}
														/>
													</View>
												}
												<Field
													component={CustomInput}
													name="note"
													label="Ghi chú đơn hàng"
													textarea
													multiline={true}
													numberOfLines={12}
													textAlignVertical="top"
												/>
											</View>
										</View>
									</View>
									{danhsachKho && danhsachKho.length > 0 &&
										<View style={tw`bg-white p-3 mb-3`}>
											<View style={tw`mb-2`}>
												<Text style={tw`font-medium`}>Chọn Showroom</Text>
											</View>

											{danhsachKho.map((el) => (
												<ShowroomItem
													map={map && map}
													item={el}
													kho={kho}
													setKho={(kho) => setKho(kho)}
												/>
											))}
										</View>
									}
								</KeyboardAwareScrollView>
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
										{/*{state && state.prices && state.prices.length > 0 && state.prices.map((item, index) => (
											<View style={tw`flex flex-row justify-between border-b border-gray-100 pb-2 mb-2`} key={index}>
												<Text style={tw`text-gray-500 w-2/3`}>
													{item.priceDetail.product.name} - {item.priceDetail.name} <Text style={tw`font-bold`}>x {item.quantity}</Text>
												</Text>
												<Text  >{formatVND(item.price)}</Text>
											</View>
										))}*/}
										<View
											style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
											<Text>Tạm tính</Text>
											<Text>{formatVND(state.subTotal)}</Text>
										</View>
										{state.totalDiscount > 0 &&
											<View
												style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
												<Text>Chiết khấu ({state && state.discountPercent}%)</Text>
												<Text  style={tw`text-red-500`}>-{formatVND(state.totalDiscount)}</Text>
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
										{state.cashAmount > 0 &&
											<View
												style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
												<Text>Tổng tiền</Text>
												<Text  style={tw`text-blue-500 font-bold`}>{formatVND(state.cashAmount)}</Text>
											</View>
										}
										{state.pointAmount > 0 &&
											<View
												style={tw`flex flex-row items-center justify-between mb-2 border-b border-gray-100 pb-2`}>
												<Text>Tổng điểm</Text>
												<Text  style={tw`text-purple-500 font-bold`}>{formatVND(state.pointAmount)}</Text>
											</View>
										}
									</View>
								}
							</View>
							{state && state.checkOutType && state.checkOutType === 'buynow' &&
								<TouchableOpacity
									style={tw`bg-blue-500 px-5 py-3 mb-3 rounded w-full flex items-center justify-between`}
									onPress={() => props.navigation.navigate('ProductDetail', {id: state.prices[0] && state.prices[0].priceDetail && state.prices[0].priceDetail.product && state.prices[0].priceDetail.product.id})}
								>
									<Text style={tw`text-white font-bold uppercase`}>Thay đổi lựa chọn</Text>
								</TouchableOpacity>
							}
							<TouchableOpacity
								style={tw`bg-orange-500 px-5 py-3 rounded w-full flex items-center justify-between`}
								onPress={handleSubmit}
							>
								<Text style={tw`text-white font-bold uppercase`}>Thanh toán</Text>
							</TouchableOpacity>
						</View>
					</>
				)}
			</Formik>
		</View>
	);
}

export default CustomerInformation;
