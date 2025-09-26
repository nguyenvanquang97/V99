import React, {useEffect, useState} from "react";
import {Image, Platform, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from "twrnc";
import {apiClient} from "app/services/client";
import Slideshow from "app/screens/Home/components/Slideshow";
import FeatureProductList from "app/screens/Home/components/FeatureProductList";
import News from "app/screens/Home/components/News";
import CartIcon from "app/screens/Cart/components/cartIcon";
import SearchProductScreen from "app/screens/Search/SearchProductScreen";
import HomePageLoading from "app/screens/Home/components/HomePageLoading";
import HomeProducts from "app/screens/Home/components/HomeProducts";
import ShopList from "app/screens/Home/components/FeatureShopList";
import ComboProduct from "app/screens/Home/components/ComboProduct";
import {GetSettings} from "app/store/actions/settingActions";
import KeepGoing from "app/screens/Home/KeepGoing";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = (props) => {
	const dispatch = useDispatch();
	const settings = useSelector(state => state.SettingsReducer.options)
	const categories = useSelector(state => state.SettingsReducer.productCategories)
	const [refresh, setRefresh] = useState(false);
	const [slideshows, setSlideshows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [textSearchHolder, setTextSearchHolder] = useState('NutriV99');
	const currentUser = useSelector(state => state.memberAuth.user);
	const [featuredProducts, setFeaturedProducts] = useState()
	const [shop, setShop] = useState();

	useEffect(() => {
		let timer1 = setTimeout(() => setTextSearchHolder('Tìm kiếm sản phẩm...'),3000);
		return () => {
			clearTimeout(timer1);
		};
	}, [dispatch])

	function getFeaturedProducts() {
		apiClient.get('/product', {
			params: {
				limit: 8,
				page: 1,
				type: 'Sản phẩm',
				featured: 'Có'
			}
		}).then(function (response) {
			setFeaturedProducts(response.data)
			setRefresh(false)
		}).catch(function (error) {
			console.log(error);
		})
	}

	function getShop() {
		apiClient.get('/user-shop', {
			params: {
				limit: 12,
				page: 1,
				featured: 'Có'
			}
		}).then(function (response) {
			setShop(response.data)
			setRefresh(false)
		}).catch(function (error) {
			console.log(error);
		})
	}

	function getSlideShow(id) {
		apiClient.get('/slideshow/'+id
		).then(function (response) {
			setSlideshows(response.data)
			setRefresh(false)
		}).catch(function (error) {
			console.log(error);
		})
	}

	useEffect(() => {
		getShop()
		getFeaturedProducts()
		if (settings) {
			getSlideShow(settings && settings.slideshow_id)
		}
	}, [refresh, dispatch, settings])

	useEffect(() => {
			dispatch(GetSettings());
	}, [refresh]);
	const insets = useSafeAreaInsets();
	return (
		<View style={{paddingTop:insets.top,...tw`flex bg-gray-100 min-h-full`}}>
			<StatusBar barStyle={"dark-content"}/>
			<View style={[tw`${Platform.OS === 'android' ? 'pt-4' : 'pt-14'} pb-2 px-3 bg-white shadow-lg`]}>
				<View style={tw`flex flex-row items-center justify-between`}>
					<View>
						<Image source={{uri: settings && settings.app_logo}} style={tw`h-10 w-10`} />
					</View>
					<TouchableOpacity
						activeOpacity={1}
						style={tw`flex flex-row items-center bg-white rounded w-3/5 p-2 mx-2 border border-gray-300`}
						onPress={() => props.navigation.navigate('Modal', {content: <SearchProductScreen featuredProducts={featuredProducts && featuredProducts} navigation={props.navigation} backScreen={'Home'} />})}
					>
						<Icon name={"magnify"} size={20} style={tw`mr-2`}/>
						<Text  style={tw`text-gray-600`}>{textSearchHolder}</Text>
					</TouchableOpacity>
					<CartIcon
						navigation={props.navigation}
						dark
					/>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => props.navigation.openDrawer()}
					>
						<Icon name={"menu"} size={30} style={tw`text-gray-600`} />
					</TouchableOpacity>
				</View>
			</View>
				<ScrollView
					showsVerticalScrollIndicator={false}
					overScrollMode={'never'}
					scrollEventThrottle={16}
					refreshControl={
						<RefreshControl
							refreshing={refresh}
							onRefresh={() => setRefresh(true)}
							title="đang tải"
							titleColor="#000"
							tintColor="#000"
						/>
					}
				>
					{loading ?
					<HomePageLoading />
					:
					<View style={tw`pb-20`}>
						<Slideshow
							items={slideshows && slideshows.items && JSON.parse(slideshows.items)}
							navigation={props.navigation}
						/>
						{settings && currentUser &&
							<KeepGoing
								navigation={props.navigation}
								settings={settings && settings}
								currentUser={currentUser && currentUser}
							/>
						}
						{settings &&
							<ComboProduct
								navigation={props.navigation}
								settings={settings && settings}
								currentUser={currentUser && currentUser}
							/>
						}
						<FeatureProductList
							title={"Sản phẩm Nổi bật"}
							icon={"brightness-percent"}
							iconColor={"text-red-500"}
							titleColor={"text-gray-800"}
							items={featuredProducts && featuredProducts}
							navigation={props.navigation}
							type={"Sản phẩm"}
						/>
						{!currentUser &&
							<View style={tw`mb-5 bg-gray-50 border border-green-600 rounded p-3 mx-3`}>
								<Text  style={tw`text-gray-800 text-center`}><Text style={tw`font-medium`}>Đăng nhập</Text> vào tài khoản của bạn để hưởng nhiều ưu đãi hơn khi mua hàng và quản lý đơn hàng dễ dàng hơn!</Text>
								<View style={tw`mt-2 flex items-center`}>
									<TouchableOpacity
										onPress={() => props.navigation.navigate('Login')}
										style={tw`bg-green-600 px-3 py-2 rounded flex items-center flex-row`}
									>
										<Text  style={tw`text-white uppercase`}>Đăng nhập ngay</Text>
										<Icon name={"chevron-right"} size={16} style={tw`text-white`} />
									</TouchableOpacity>
								</View>
							</View>
						}
						<HomeProducts
							settings={settings && settings}
							navigation={props.navigation}
							categories={categories && categories}
						/>
						<ShopList
							title={"Gian hàng Nổi bật"}
							icon={"storefront"}
							iconColor={"text-green-600"}
							titleColor={"text-gray-800"}
							items={shop && shop}
							navigation={props.navigation}
							type={"Sản phẩm"}
						/>
						<News
							horizontal={true}
							navigation={props.navigation}
						/>
					</View>
				}
			</ScrollView>
		</View>
	);
};

export default HomeScreen;
