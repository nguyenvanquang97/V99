import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { formatVND } from "app/utils/helper";
import SelectDropdownWithSearch from 'react-native-select-dropdown-with-search'
import BottomSheet from 'react-native-gesture-bottom-sheet';
import CanceledOrderForm from "app/screens/Orders/components/CanceledOrderForm";
import CustomInput from "app/components/CustomInput";
import { Field } from "formik";

function AddressField(props) {
	const settings = useSelector(state => state.SettingsReducer.options);
	const [wards, setWards] = useState([])
	const [districts, setDistricts] = useState([])
	const [provinces, setProvinces] = useState([])

	const [provinceId, setProvinceId] = useState(props.currentData.province && props.currentData.province)
	const [districtId, setDistrictId] = useState(props.currentData.district && props.currentData.district)
	const [wardId, setWardId] = useState(props.currentData.ward && props.currentData.ward)

	const [provinceName, setProvinceName] = useState(props.currentData.provinceName && props.currentData.provinceName)
	const [districtName, setDistrictName] = useState(props.currentData.districtName && props.currentData.districtName)
	const [wardName, setWardName] = useState(props.currentData.wardName && props.currentData.wardName)

	const [address, setAddress] = useState(props.currentData.address && props.currentData.address)

	const bottomSheetProvince = useRef();
	const bottomSheetWard = useRef();
	const bottomSheetDistrict = useRef();

	async function getProvinces() {
		axios({
			method: 'get',
			url: settings && settings.production_ghn_url+'/master-data/province',
			headers: {
				'token': settings && settings.production_ghn_token
			},
			data: ''
		}).then(function (response) {
			if (response.status === 200) {
				setProvinces(response.data.data);
			}
		}).catch(function(error){
			console.log(error);
		})
	}

	useEffect(() => {
		if (settings) {
			getProvinces()
		}
	},[])

	useEffect(() => {
		if (settings && provinceId) {
			async function getDistricts() {
				axios({
					method: 'get',
					url: settings && settings.production_ghn_url+'/master-data/district',
					headers: {
						'token': settings && settings.production_ghn_token,
						'Content-Type': 'application/json'
					},
					params: {
						province_id: provinceId
					}
				}).then(function (response) {
					if (response.status === 200) {
						setDistricts(response.data.data);
					}
				}).catch(function(error){
					console.log(error);
				})
			}
			getDistricts()
		}
	}, [provinceId])

	useEffect(() => {
		if (settings && districtId) {
			async function getDistricts() {
				axios({
					method: 'get',
					url: settings && settings.production_ghn_url+'/master-data/ward',
					headers: {
						'token': settings && settings.production_ghn_token,
						'Content-Type': 'application/json'
					},
					params: {
						district_id: districtId
					}
				}).then(function (response) {
					if (response.status === 200) {
						setWards(response.data.data);
					}
				}).catch(function(error){
					console.log(error);
				})
			}
			getDistricts()
		}
	}, [districtId])

	return (
		!props.currentData ? <ActivityIndicator />:
			<View>
				<View style={tw`mb-5`}>
					<View style={tw`mb-2`}>
						<Text style={tw`font-medium text-gray-600`}>Số nhà, Tên đường <Text style={tw`text-red-500 font-medium`}>*</Text></Text>
					</View>
					<TextInput
						defaultValue={address}
						onChangeText={(text) => {
							setAddress(text)
							props.onChangeAddress(text)
						}}
						style={tw`border border-gray-300 px-4 py-3 rounded`}
					/>
				</View>

				<View style={tw`mb-5`}>
					<View style={tw`mb-2`}>
						<Text style={tw`font-medium text-gray-600`}>Tỉnh/Thành phố <Text style={tw`text-red-500 font-medium`}>*</Text></Text>
					</View>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => bottomSheetProvince.current.show()}
						style={tw`border border-gray-300 px-4 py-3 rounded`}
					>
						<Text>{provinceName}</Text>
					</TouchableOpacity>
				</View>

				<View style={tw`mb-5`}>
					<View style={tw`mb-2`}>
						<Text style={tw`font-medium text-gray-600`}>Quận/Huyện <Text style={tw`text-red-500 font-medium`}>*</Text></Text>
					</View>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => bottomSheetDistrict.current.show()}
						style={tw`border border-gray-300 px-4 py-3 rounded`}
					>
						<Text>{districtName}</Text>
					</TouchableOpacity>
				</View>

				<View style={tw`mb-5`}>
					<View style={tw`mb-2`}>
						<Text style={tw`font-medium text-gray-600`}>Xã/Phường/Thị trấn <Text style={tw`text-red-500 font-medium`}>*</Text></Text>
					</View>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => bottomSheetWard.current.show()}
						style={tw`border border-gray-300 px-4 py-3 rounded`}
					>
						<Text>{wardName}</Text>
					</TouchableOpacity>
				</View>

				<BottomSheet hasDraggableIcon ref={bottomSheetProvince} height={350}>
					<View style={tw`my-3 mx-5 flex items-center`}>
						<Text style={tw`font-bold`}>Chọn Tỉnh/Thành phố</Text>
					</View>
					<ScrollView>
						<View
							style={tw`px-5 pb-5`}
						>
							{provinces && provinces.map((el, index) => (
								<TouchableOpacity
									style={tw`border-b border-gray-200 py-3 flex items-center justify-between flex-row`}
									onPress={() => {
										setProvinceId(provinces[index].ProvinceID);
										setProvinceName(provinces[index].ProvinceName);
										props.onChangeProvince(provinces[index].ProvinceID)
										props.onChangeProvinceName(provinces[index].ProvinceName)
										bottomSheetProvince.current.close()
									}}
								>
									<Text style={tw`text-base`}>{el.ProvinceName}</Text>
									{Number(provinces[index].ProvinceID) === Number(provinceId) &&
										<Icon name={"check-circle"} size={18} style={tw`text-blue-500`}/>
									}
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
				</BottomSheet>

				<BottomSheet hasDraggableIcon ref={bottomSheetDistrict} height={300}>
					<View style={tw`my-3 mx-5 flex items-center`}>
						<Text style={tw`font-bold`}>Chọn Quận/Huyện</Text>
					</View>
					<ScrollView>
						<View
							style={tw`px-5 pb-5`}
						>
							{districts && districts.map((el, index) => (
								<TouchableOpacity
									style={tw`border-b border-gray-200 py-3 flex items-center justify-between flex-row`}
									onPress={() => {
										setDistrictId(districts[index].DistrictID);
										setDistrictName(districts[index].DistrictName);
										props.onChangeDistrict(districts[index].DistrictID)
										props.onChangeDistrictName(districts[index].DistrictName)
										bottomSheetDistrict.current.close()
									}}
								>
									<Text style={tw`text-base`}>{el.DistrictName}</Text>
									{Number(districts[index].DistrictID) === Number(districtId) &&
										<Icon name={"check-circle"} size={18} style={tw`text-blue-500`}/>
									}
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
				</BottomSheet>

				<BottomSheet hasDraggableIcon ref={bottomSheetWard} height={300}>
					<View style={tw`my-3 mx-5 flex items-center`}>
						<Text style={tw`font-bold`}>Chọn Xã/Phường/Thị trấn</Text>
					</View>
					<ScrollView>
						<View
							style={tw`px-5 pb-5`}
						>
							{wards && wards.map((el, index) => (
								<TouchableOpacity
									style={tw`border-b border-gray-200 py-3 flex items-center justify-between flex-row`}
									onPress={() => {
										setWardId(wards[index].WardCode);
										setWardName(wards[index].WardName);
										props.onChangeWard(wards[index].WardCode)
										props.onChangeWardName(wards[index].WardName)
										bottomSheetWard.current.close()
									}}
								>
									<Text style={tw`text-base`}>{el.WardName}</Text>
									{Number(wards[index].WardCode) === Number(wardId) &&
										<Icon name={"check-circle"} size={18} style={tw`text-blue-500`}/>
									}
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
				</BottomSheet>
			</View>
	);
}

export default AddressField;
