import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import tw from "twrnc";
import CartIcon from "app/screens/Cart/components/cartIcon";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import supportImg from '../../assets/images/support.jpg'
import CustomerSupport from "app/screens/Home/components/CustomerSupport";
import { apiClient } from "app/services/client";
import { FlatGrid } from "react-native-super-grid";
import ProductItem from "app/components/ProductItem";

function SupportScreen(props) {
	const currentUser = useSelector(state => state.memberAuth.user);
	const settings = useSelector(state => state.SettingsReducer.options);
	const [products, setProducts] = useState();
	const [refresh, setRefresh] = useState();
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		props.navigation.setOptions({
			title: 'Hỗ trợ',
			headerStyle: {
				backgroundColor: '#ff0021',
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
			headerRight: () => (
				<View style={tw`flex flex-row items-center mr-3`}>
					<CartIcon
						navigation={props.navigation}
					/>
					
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => props.navigation.openDrawer()}
					>
						<Icon name={"menu"} size={30} style={tw`text-white ml-5`} />
					</TouchableOpacity>
				</View>
			)
		})
	}, [])
	
	return (
		<View>
			<StatusBar barStyle={"light-content"} backgroundColor={'#ff0021'} />
			<ScrollView
				showsVerticalScrollIndicator={false}
				overScrollMode={'never'}
				scrollEventThrottle={16}
			>
				<View>
					<View style={tw`bg-white px-5`}>
						<View>
							<Image source={supportImg} style={tw`w-full h-64`}/>
						</View>
						<View style={tw`my-5 flex items-center`}>
							<Text style={tw`mb-2`}>Đội ngũ hỗ trợ viên luôn sẵn sàng 24/7.</Text>
							<Text>Hãy liên hệ với chúng tôi bất cứ khi nào bạn cần!</Text>
						</View>
						<View style={tw`flex items-center justify-between flex-row border-t border-gray-100 py-3`}>
							<View>
								<TouchableOpacity
									style={tw`flex items-center`}
									onPress={() => Linking.openURL(`tel:${settings && settings.contact_hotline}`)}
								>
									<Icon name={"phone"} size={28} style={tw`mb-1 text-red-500`}/>
									<Text style={tw`text-gray-600`}>Gọi điện</Text>
								</TouchableOpacity>
							</View>
							{settings && settings.contact_whatsapp &&
								<View>
									<TouchableOpacity
										style={tw`flex items-center`}
										onPress={() => Linking.openURL(`https://wa.me/${settings && settings.contact_whatsapp}`)}
									>
										<Icon name={"whatsapp"} size={28} style={tw`mb-1 text-green-600`} />
										<Text   style={tw`text-gray-600`}>Whatsapp</Text>
									</TouchableOpacity>
								</View>
							}
							{settings && settings.contact_zalo &&
								<View>
									<TouchableOpacity
										style={tw`flex items-center`}
										onPress={() => Linking.openURL(`http://zalo.me/${settings && settings.contact_zalo}`)}
									>
										<Icon name={"chat-sleep"} size={28} style={tw`mb-1 text-blue-500`} />
										<Text   style={tw`text-gray-600`}>Chat Zalo</Text>
									</TouchableOpacity>
								</View>
							}
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

export default SupportScreen;
