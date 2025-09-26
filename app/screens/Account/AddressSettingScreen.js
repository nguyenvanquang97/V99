import React, { useEffect, useRef, useState } from "react";
import { Image, Keyboard, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import CartIcon from "app/screens/Cart/components/cartIcon";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "react-native-image-picker"
import ActionSheet from 'react-native-actionsheet';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as yup from 'yup';
import apiConfig from "app/config/api-config";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Field, Formik } from "formik";
import CustomInput from "app/components/CustomInput";
import { updateAccount } from "app/screens/Auth/action";
import AddressField from "app/components/AddressField";

function AddressSettingScreen(props) {
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(true);

	const currentUser = useSelector(state => state.memberAuth.user);

	const [province, setProvince] = useState(currentUser && currentUser.province)
	const [district, setDistrict] = useState(currentUser && currentUser.district)
	const [ward, setWard] = useState(currentUser && currentUser.ward)

	const [provinceName, setProvinceName] = useState(currentUser && currentUser.provinceName)
	const [districtName, setDistrictName] = useState(currentUser && currentUser.districtName)
	const [wardName, setWardName] = useState(currentUser && currentUser.wardName)

	const [address, setAddress] = useState(currentUser && currentUser.address)

	useEffect(() => {
		props.navigation.setOptions({
			title: 'Địa chỉ nhận hàng',
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

	function handleUpdate() {
		if (!district || !address || !ward || !province ) {
			showMessage({
				message: 'Vui lòng nhập đủ thông tin địa chỉ nhận hàng',
				type: 'danger',
				icon: 'danger',
				duration: 3000,
			});
			return;
		}
		Keyboard.dismiss();
		dispatch(updateAccount( {
			province,
			ward,
			district,
			provinceName,
			wardName,
			districtName,
			address
		}))
	}

	return (
		<View style={tw`flex bg-white p-2 h-full`}>
			<StatusBar barStyle={"dark-content"}/>
			<ScrollView
				showsVerticalScrollIndicator={false}
				scrollEnabled={true}
			>
				<View style={tw`mx-3`}>
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
					<TouchableOpacity
						onPress={() => handleUpdate()}
						style={tw`bg-blue-600 p-4 rounded`}
						//disabled={!isValid}
					>
						<Text  style={tw`text-white text-center font-medium uppercase`}>Lưu thay đổi</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

export default AddressSettingScreen;
