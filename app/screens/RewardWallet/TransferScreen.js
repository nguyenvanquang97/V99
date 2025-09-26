import React, { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	RefreshControl,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { apiClient } from "app/services/client";
import { FlatGrid } from "react-native-super-grid";
import ProductItem from "app/components/ProductItem";
import FeatureProductList from "app/screens/Home/components/FeatureProductList";
import * as Yup from "yup";
import apiConfig from "app/config/api-config";
import { showMessage } from "react-native-flash-message";
import { Field, Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomInput from "app/components/CustomInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { formatNumber, formatVND } from "app/utils/helper";
import { useSelector } from "react-redux";
import SearchableDropdown from 'react-native-searchable-dropdown';
import { banks } from "app/utils/bankList";
import DropDownPicker from 'react-native-dropdown-picker';

function TransferScreen(props) {
	const currentUser = useSelector(state => state.memberAuth.user);
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const settings = useSelector(state => state.SettingsReducer.options);


	const InvestmentSchema = Yup.object().shape({
		amount: Yup
			.string()
			.min(1, ({min}) => 'Vui lòng nhập số lượng')
			.required('Vui lòng nhập số lượng'),
		receiver: Yup
			.string()
			.min(1, ({min}) => 'Vui lòng nhập thông tin')
			.required('Vui lòng nhập thông tin'),
		password: Yup
			.string()
			.min(1, ({min}) => 'Vui lòng nhập thông tin')
			.required('Vui lòng nhập thông tin'),
	})

	async function handleCreateInvest(values) {
		setDisabled(true);
		const token = await AsyncStorage.getItem('v99_user_token');
		axios.post(apiConfig.BASE_URL+'/member/transactions/transfer-internal', {
				...values,
				wallet: props.wallet
			},
			{headers: {Authorization: `Bearer ${token}`}})
			.then((response) => {
			showMessage({
				message: 'Tạo giao dịch thành công',
				type: 'success',
				icon: 'success',
				duration: 3000,
			});
			props.navigation.navigate('TransactionDetail', {id: response.data.id})
		}).catch(error => {
			setDisabled(false);
			showMessage({
				message: error.response.data.message,
				type: 'danger',
				icon: 'danger',
				duration: 3000,
			});
		})
	}

	if (currentUser) {
		var initialValues = {
			amount: 0,
		}
	}

	return (
		<View>
			<View style={tw`bg-white ios:pt-4 android:pt-4 pb-4 flex-row items-center`}>
				<TouchableOpacity
					onPress={() => props.navigation.navigate(props.backScreen)}
					style={tw`mr-3 ml-3`}
				>
					<Icon name="close" size={26}/>
				</TouchableOpacity>
				<Text  style={tw`font-medium uppercase`}>Chuyển tiền / điểm</Text>
			</View>
			<Formik
				initialValues={initialValues}
				onSubmit={values => handleCreateInvest(values)}
				validationSchema={InvestmentSchema}
			>
				{({handleSubmit, values, setFieldValue, isValid}) => (
					<KeyboardAwareScrollView
						keyboardShouldPersistTaps={"handled"}
					>
						<View style={tw`pb-32`}>
							<View style={tw`px-3 py-5 my-3 bg-white`}>
								<Field
									component={CustomInput}
									required
									name="amount"
									label="Số tiền/điểm muốn chuyển"
									keyboardType={"numeric"}
								/>
								<Field
									component={CustomInput}
									required
									name="receiver"
									label="Số điện thoại nhận"
									keyboardType={"numeric"}
								/>
								<Field
									component={CustomInput}
									required
									name="password"
									label="Xác nhận mật khẩu"
								/>
								<TouchableOpacity
									disabled={disabled}
									style={tw`bg-blue-500 px-5 py-4 mt-3 rounded w-full flex items-center justify-between`}
									onPress={handleSubmit}
								>
									<Text  style={tw`text-white font-bold uppercase`}>Đặt lệnh chuyển</Text>
								</TouchableOpacity>
							</View>
						</View>

					</KeyboardAwareScrollView>
				)}
			</Formik>
		</View>
	);
}

export default TransferScreen;
