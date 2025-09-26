import React, { useEffect, useState } from "react";
import { Keyboard, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { apiClient } from "app/services/client";
import { FlatGrid } from "react-native-super-grid";
import ProductItem from "app/components/ProductItem";
import FeatureProductList from "app/screens/Home/components/FeatureProductList";
import Slider from '@react-native-community/slider';
import { updateAccount } from "app/screens/Auth/action";
import * as yup from "yup";
import CustomInput from "app/components/CustomInput";
import { Field, Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import apiConfig from "app/config/api-config";
import { showMessage } from "react-native-flash-message";

function RewardWithdrawScreen(props) {
	const [amountCash, setAmountCash] = useState(100);
	const [amountProduct, setAmountProduct] = useState(0);
	const [amountStock, setAmountStock] = useState(0);
	
	async function handleWithdraw(values) {
		Keyboard.dismiss();
		const token = await AsyncStorage.getItem('v99_user_token');
		axios.post(apiConfig.BASE_URL+'/customer/transaction/rewardwithdraw', {
				amountCash: amountCash.toFixed(0),
				amountProduct: amountProduct.toFixed(0),
				amountStock: amountStock.toFixed(0),
				loginPassword: values.loginPassword
			},
			{headers: {Authorization: `Bearer ${token}`}})
			.then((response) => {
				showMessage({
					message: 'Tạo giao dịch rút tiền thành công',
					type: 'success',
					icon: 'success',
					duration: 3000,
				});
				//props.navigation.navigate('TransactionDetail', {id: response.data.id})
			}).catch(error => {
			showMessage({
				message: error.response.data.message,
				type: 'danger',
				icon: 'danger',
				duration: 3000,
			});
		})
	}
	
	const withdrawValidationSchema = yup.object().shape({
		loginPassword: yup
			.string()
			.required('Vui lòng xác nhận mật khẩu'),
	})
	
	return (
		<View>
			<View style={tw`bg-white ios:pt-4 android:pt-4 pb-4 flex-row items-center`}>
				<TouchableOpacity
					onPress={() => props.navigation.navigate(props.backScreen)}
					style={tw`mr-3 ml-3`}
				>
					<Icon name="close" size={26}/>
				</TouchableOpacity>
				<Text style={tw`font-medium uppercase`}>Rút tiền từ Ví tiền thưởng</Text>
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				overScrollMode={'never'}
				scrollEventThrottle={16}
				keyboardShouldPersistTaps={"always"}
			>
				
				<KeyboardAwareScrollView
					showsVerticalScrollIndicator={false}
					scrollEnabled={true}
				>
				<View style={tw`bg-white my-3 p-3`}>
					<View style={tw`mb-5`}>
						<Text  >Rút về ví tiền mặt</Text>
						<View style={tw`flex flex-row items-center justify-between`}>
							<Slider
								style={{width: 250, height: 40}}
								minimumValue={0}
								maximumValue={100}
								step={1}
								value={amountCash}
								minimumTrackTintColor="green"
								maximumTrackTintColor="gray"
								onSlidingComplete={(value) => {
									setAmountCash(value)
									setAmountProduct(amountProduct > 0 ? amountProduct * (100 - value)/(amountProduct + amountStock) : 0);
									setAmountStock(amountStock > 0 ? amountStock * (100 - value)/(amountProduct + amountStock) : 0);
								}}
							/>
							<View>
								<Text  >
									{amountCash.toFixed(0)}%
								</Text>
							</View>
						</View>
					</View>
					<View style={tw`mb-5`}>
						<Text  >Rút về ví tiền hàng</Text>
						<View style={tw`flex flex-row items-center justify-between`}>
							<Slider
								style={{width: 250, height: 40}}
								minimumValue={0}
								maximumValue={100}
								step={1}
								value={amountProduct}
								minimumTrackTintColor="#3b6ae6"
								maximumTrackTintColor="gray"
								onSlidingComplete={(value) => {
									setAmountProduct(value)
									setAmountCash(amountCash > 0 ? amountCash * (100 - value)/(amountCash + amountStock) : 0);
									setAmountStock(amountStock > 0 ? amountStock * (100 - value)/(amountCash + amountStock) : 0);
								}}
							/>
							<View>
								<Text  >
									{amountProduct.toFixed(0)}%
								</Text>
							</View>
						</View>
					</View>
					<View style={tw`mb-5`}>
						<Text  >Rút về ví cổ phần</Text>
						<View style={tw`flex flex-row items-center justify-between`}>
							<Slider
								style={{width: 250, height: 40}}
								minimumValue={0}
								maximumValue={100}
								step={1}
								value={amountStock}
								minimumTrackTintColor="purple"
								maximumTrackTintColor="gray"
								onSlidingComplete={(value) => {
									setAmountStock(value)
									setAmountCash(amountCash > 0 ? amountCash * (100 - value)/(amountProduct + amountCash) : 0);
									setAmountProduct(amountProduct > 0 ? amountProduct * (100 - value)/(amountProduct + amountCash) : 0);
								}}
							/>
							<View>
								<Text  >
									{amountStock.toFixed(0)}%
								</Text>
							</View>
						</View>
					</View>
					<Formik
						initialValues={{}}
						onSubmit={values => handleWithdraw(values)}
						validationSchema={withdrawValidationSchema}
					>
						{({ handleSubmit, isValid }) => (
							<View>
								<Field
									component={CustomInput}
									required
									name="loginPassword"
									label="Xác nhận mật khẩu"
									secureTextEntry
								/>
								<TouchableOpacity
									style={tw`bg-blue-500 px-5 py-4 mt-3 rounded w-full flex items-center justify-between`}
									onPress={handleSubmit}
								>
									<Text style={tw`text-white font-bold uppercase`}>Đặt lệnh rút tiền</Text>
								</TouchableOpacity>
							</View>
						)}
						
					</Formik>
					
				</View>
				</KeyboardAwareScrollView>
			</ScrollView>
		</View>
	);
}

export default RewardWithdrawScreen;
