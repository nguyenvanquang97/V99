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
import DynamicWebView from "app/components/DynamicWebView";

function LoginScreen(props) {
	const currentUser = useSelector(state => state.memberAuth.user);
	const settings = useSelector(state => state.SettingsReducer.options)
	
	if(currentUser) {
		props.navigation.navigate('Account')
	}
	const dispatch = useDispatch()
	useEffect(() => {
		props.navigation.setOptions({
			title: 'Đăng nhập',
			headerStyle: {
				backgroundColor: '#1e74e5',
			},
			headerTintColor: '#fff',
			headerLeft: () => (
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => props.navigation.navigate('Register')}
					style={tw`ml-3`}
				>
					<Text  style={tw`text-white`}>Đăng ký</Text>
				</TouchableOpacity>
			),
			headerRight: () => (
				<View style={tw`flex flex-row items-center mr-3`}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => props.navigation.navigate('ForgotPassword')}
					>
						<Text  style={tw`text-white`}>Quên mật khẩu</Text>
					</TouchableOpacity>
				</View>
			
			)
		})
	}, [])
	
	const LoginSchema = Yup.object().shape({
		username: Yup
			.string()
			.required('Vui lòng nhập thông tin'),
		password: Yup
			.string()
			.required('Vui lòng nhập mật khẩu'),
	})
	
	function handleLogin(values) {
		dispatch(memberLogin({...values, navigation: props.navigation, backScreen: 'Account'}))
	}
	
	return (
		<View style={tw`flex bg-white min-h-full content-between`}>
			<Formik
				enableReinitialize
				initialValues={{
					username: props && props.route && props.route.params && props.route.params.values && props.route.params.values.email,
					password: props && props.route && props.route.params && props.route.params.values && props.route.params.values.password,
				}}
				onSubmit={values => handleLogin(values)}
				validationSchema={LoginSchema}
			>
				{({handleSubmit, values, setFieldValue, isValid}) => (
					<>
						<KeyboardAwareScrollView keyboardShouldPersistTaps={"always"}>
							<View style={tw`pb-20`}>
								<View style={tw`bg-white p-3 mb-3`}>
									<View style={tw`mb-2`}>
										<View>
											<Field
												component={CustomInput}
												required
												name="username"
												label="Email hoặc Số điện thoại"
												autoFocus
												autoCapitalize = 'none'
											/>
											<Field
												component={CustomInput}
												required
												name="password"
												label="Mật khẩu"
												secureTextEntry
												autoCapitalize = 'none'
											/>
										</View>
										<TouchableOpacity
											style={tw`bg-blue-500 px-5 py-4 mt-3 rounded w-full flex items-center justify-between`}
											onPress={handleSubmit}
										>
											<Text  style={tw`text-white font-bold uppercase`}>Đăng nhập</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
							
						</KeyboardAwareScrollView>
					</>
				)}
			</Formik>
		</View>
	);
}

export default LoginScreen;
