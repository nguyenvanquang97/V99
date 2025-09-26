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

function ResetPasswordScreen(props) {
	const dispatch = useDispatch()
	useEffect(() => {
		props.navigation.setOptions({
			title: 'Đặt mật khẩu mới',
			headerStyle: {
				backgroundColor: '#1e74e5',
			},
			headerTintColor: '#fff',
		})
	}, [])
	
	const LoginSchema = Yup.object().shape({
		resetCode: Yup
			.string()
			.required('Vui lòng nhập thông tin'),
		password: Yup
			.string()
			.required('Vui lòng nhập mật khẩu mới'),
		passwordAgain: Yup
			.string()
			.required('Vui lòng xác nhận lại mật khẩu mới'),
	})
	
	function handleResetPassword(values) {
		apiClient.post(apiConfig.BASE_URL+'/member/reset', {
			email: props.route.params.email,
			resetCode: values.resetCode,
			password: values.password,
			passwordAgain: values.passwordAgain
		}).then((response) => {
			showMessage({
				message: response.data.message,
				type: 'success',
				icon: 'success',
				duration: 3000,
			});
			props.navigation.navigate('Login', {
				email: props.route.params.email,
				password: values.password
			})
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
					resetCode: '',
					password: '',
					passwordAgain: '',
				}}
				onSubmit={values => handleResetPassword(values)}
				validationSchema={LoginSchema}
			>
				{({handleSubmit, values, setFieldValue, isValid}) => (
					<>
						<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"}>
							<View style={tw`bg-white p-3 mb-3`}>
								<View style={tw`mb-2`}>
									<View>
										<Field
											component={CustomInput}
											required
											name="resetCode"
											label="Mã xác thực từ Email"
											keyboardType={"numeric"}
										/>
										<Field
											component={CustomInput}
											required
											name="password"
											label="Mật khẩu mới"
											secureTextEntry
										/>
										<Field
											component={CustomInput}
											required
											name="passwordAgain"
											label="Nhập lại mật khẩu mới"
											secureTextEntry
										/>
									</View>
									<TouchableOpacity
										style={tw`bg-blue-500 px-5 py-4 mt-3 rounded w-full flex items-center justify-between`}
										onPress={handleSubmit}
									>
										<Text  style={tw`text-white font-bold uppercase`}>Xác nhận</Text>
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

export default ResetPasswordScreen;
