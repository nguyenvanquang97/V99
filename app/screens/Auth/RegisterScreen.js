import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomInput from "app/components/CustomInput";
import { useSelector } from "react-redux";
import { apiClient } from "app/services/client";
import apiConfig from "app/config/api-config";
import { showMessage } from "react-native-flash-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function RegisterScreen(props) {
	const currentUser = useSelector(state => state.memberAuth.user);
	const settings = useSelector(state => state.SettingsReducer.options);
	if(currentUser) {
		props.navigation.navigate('Account')
	}

	const recaptcha = useRef();
	useEffect(() => {
		props.navigation.setOptions({
			title: 'Đăng ký',
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
					<Text style={tw`text-white`} allowFontScaling={false}>Đăng nhập</Text>
				</TouchableOpacity>
			),
			headerRight: () => (
				<View style={tw`flex flex-row items-center mr-3`}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => props.navigation.navigate('ForgotPassword')}
					>
						<Text style={tw`text-white`} allowFontScaling={false}>Quên mật khẩu</Text>
					</TouchableOpacity>
				</View>

			)
		})
	}, [])

	const LoginSchema = Yup.object().shape({
		name: Yup
			.string()
			.required('Vui lòng nhập thông tin'),
		password: Yup
			.string()
			.required('Vui lòng nhập mật khẩu'),
		refId: Yup
			.string()
			.required('Vui lòng nhập mã giới thiệu'),
		email: Yup
			.string()
			.email("Nhập đúng địa chỉ email")
			.required('Vui lòng nhập email'),
		phone: Yup
			.string()
			.max(10, ({max}) => 'Vui lòng nhập đúng số điện thoại')
			.min(10, ({min}) => 'Vui lòng nhập đúng số điện thoại')
			.required('Vui lòng nhập số điện thoại'),
	})

	async function handleLogin(values) {

		await apiClient.post(apiConfig.BASE_URL+'/member/register', { ...values }).then((response) => {
			showMessage({
				message: 'Tạo tài khoản thành công, bạn có thể đăng nhập ngay',
				type: 'success',
				icon: 'success',
				duration: 3000,
			});
			props.navigation.navigate('Login', {
				values
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
	//console.log(recaptchaToken);

	const [initialValues, setInitialValues] = useState({
		name: '',
		password: '',
		email: '',
		phone: '',
		idNumber: '',
		address: ''
	})

	let cccdData = null;
	if (props.route.params && props.route.params.cccdData) {
		cccdData = props.route.params.cccdData;
	}

	useEffect(() => {
		if (cccdData) {
			const QRResult = cccdData
			// Split the input string by the "|" character
			const parts = QRResult.split("|");

			// Extract each part and format as needed
			const internationalId = parts[0];
			const fullName = parts[2];
			const dateOfBirth = parts[3];
			const formattedDateOfBirth = `${dateOfBirth.slice(0, 2)}/${dateOfBirth.slice(2, 4)}/${dateOfBirth.slice(4)}`;
			const address = parts[5];
			const addressParts = address.split(", "); // Split the address into parts
			const city = addressParts.pop();
			const addressWithoutCity = addressParts.join(", ");

			// Format the date in DD/MM/YYYY
			const issuedDate = parts[6];
			const formattedIssuedDate = `${issuedDate.slice(0, 2)}/${issuedDate.slice(2, 4)}/${issuedDate.slice(4)}`;

			setInitialValues({
				...initialValues,
				name: fullName,
				idNumber: internationalId,
				address: addressWithoutCity
			})
		}
	}, [cccdData]);

	return (
		<View style={tw`flex bg-white min-h-full content-between`}>
			<Formik
				initialValues={initialValues}
				onSubmit={values => handleLogin(values)}
				validationSchema={LoginSchema}
				validateOnBlur={false}
				enableReinitialize={true}
			>
				{({handleSubmit,
					handleBlur= (e) => {
						recaptcha.current.open();
					}
					, values, setFieldValue, isValid}) => (
					<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"}>
						<View style={tw`bg-white p-3 mb-3`}>
							<View style={tw`mb-2 pb-10`}>
								<View style={tw`flex items-center`}>
									<TouchableOpacity
										onPress={() => props.navigation.navigate('QRScanner')}
										style={tw`flex items-center flex-row mb-5 bg-green-500 w-40 p-2 rounded-full`}
									>
										<Icon name={"qrcode-scan"} style={tw`text-white`}/>
										<Text style={tw`ml-2 text-white`}>Quét mã QR CCCD</Text>
									</TouchableOpacity>
								</View>
								<View>
									<Field
										component={CustomInput}
										required
										name="name"
										label="Họ và tên"
									/>
									<Field
										component={CustomInput}
										required
										name="email"
										label="Địa chỉ Email"
										autoCapitalize = 'none'
									/>
									<Field
										component={CustomInput}
										required
										name="phone"
										label="Số điện thoại"
										number
									/>
									<Field
										component={CustomInput}
										required
										name="idNumber"
										label="Số CCCD"
										number
									/>
									<Field
										component={CustomInput}
										required
										name="address"
										label="Địa chỉ"
									/>
									<Field
										component={CustomInput}
										required
										name="password"
										label="Mật khẩu"
										secureTextEntry
									/>
									<Field
										component={CustomInput}
										name="refId"
										label="Mã giới thiệu"
										number
										required
									/>
								</View>
								<TouchableOpacity
									style={tw`bg-orange-500 px-5 py-4 mt-3 rounded w-full flex items-center justify-between`}
									onPress={handleSubmit}
								>
									<Text  style={tw`text-white font-bold uppercase`}>Tạo tài khoản</Text>
								</TouchableOpacity>
							</View>
						</View>
					</KeyboardAwareScrollView>
				)}
			</Formik>
		</View>
	);
}

export default RegisterScreen;
