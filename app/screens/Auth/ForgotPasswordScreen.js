import React, { useEffect } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { Field, Formik } from "formik";
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomInput from "app/components/CustomInput";
import { formatVND } from "app/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { memberLogin } from "app/screens/Auth/action";
import { apiClient } from "app/services/client";
import apiConfig from "app/config/api-config";
import { showMessage } from "react-native-flash-message";

function ForgotPasswordScreen(props) {
	const currentUser = useSelector(state => state.memberAuth.user);
	if(currentUser) {
		props.navigation.navigate('Account')
	}
	const dispatch = useDispatch()
	useEffect(() => {
		props.navigation.setOptions({
			title: 'Quên mật khẩu',
			headerStyle: {
				backgroundColor: '#1e74e5',
			},
			headerTintColor: '#fff',
			headerLeft: () => (
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => props.navigation.navigate('Login')}
					style={tw`ml-3`}
				>
					<Text  style={tw`text-white`}>Đăng nhập</Text>
				</TouchableOpacity>
			),
			headerRight: () => (
				<View style={tw`flex flex-row items-center mr-3`}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => props.navigation.navigate('Register')}
					>
						<Text  style={tw`text-white`}>Đăng ký</Text>
					</TouchableOpacity>
				</View>
			
			)
		})
	}, [])
	
	const ForgotPasswordSchema = Yup.object().shape({
		email: Yup
			.string()
			.email("Nhập đúng địa chỉ email")
			.required('Vui lòng nhập email'),
	})
	
	function handleForgotPassword(values) {
		apiClient.post(apiConfig.BASE_URL+'/member/forgot', {
			email: values.email
		}).then((response) => {
			showMessage({
				message: response.data.message,
				type: 'success',
				icon: 'success',
				duration: 3000,
			});
			props.navigation.navigate('ResetPassword', {email: values.email})
		}).catch(error => {
			showMessage({
				message: error.response.data.message,
				type: 'danger',
				icon: 'danger',
				duration: 3000,
			});
		})
	}
	
	return (
		<View style={tw`flex bg-white min-h-full content-between`}>
			<Formik
				initialValues={{
					email: '',
				}}
				onSubmit={values => handleForgotPassword(values)}
				validationSchema={ForgotPasswordSchema}
			>
				{({handleSubmit, values, setFieldValue, isValid}) => (
					<>
						<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"}>
							<View style={tw`bg-white p-3 mb-3`}>
								<View style={tw`mb-2`}>
									<Text  style={tw`mb-2`}>Nhập vào địa chỉ email đã dùng để tạo tài khoản.</Text>
									<View>
										<Field
											component={CustomInput}
											required
											name="email"
											label="Email"
											autoFocus
											autoCapitalize = 'none'
										/>
									</View>
									<TouchableOpacity
										style={tw`bg-red-600 px-5 py-4 mt-3 rounded w-full flex items-center justify-between`}
										onPress={handleSubmit}
									>
										<Text  style={tw`text-white font-bold uppercase`}>Tiếp tục</Text>
									</TouchableOpacity>
								</View>
							</View>
						</KeyboardAwareScrollView>
					</>
				)}
			</Formik>
		</View>
	);
}

export default ForgotPasswordScreen;
