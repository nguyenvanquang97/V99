import React, { useEffect, useState } from "react";
import {
	Image,
	Platform,
	RefreshControl,
	ScrollView,
	Share, StatusBar,
	Text,
	TextInput,
	TouchableOpacity, useWindowDimensions,
	View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "app/services/client";
import apiConfig from "app/config/api-config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import Slideshow from "app/screens/Home/components/Slideshow";
import ProductGallery from "app/screens/ProductDetail/components/ProductGallery";
import { formatVND } from "app/utils/helper";
import ProductItem from "app/components/ProductItem";
import { FlatGrid } from "react-native-super-grid";
import {WebView} from 'react-native-webview';
import InfoModalContent from "app/components/ModalContent";
import InputSpinner from "react-native-input-spinner";
import {Col, Grid, Row} from 'react-native-easy-grid';
import NumericInput from 'react-native-numeric-input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { addToCart } from "app/screens/Cart/action";
import { showMessage } from "react-native-flash-message";
import CartIcon from "app/screens/Cart/components/cartIcon";
import ProductDetailLoading from "app/screens/ProductDetail/components/ProductDetailLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import InfoBox from "app/components/InfoBox";
import RenderHtml from "react-native-render-html";
import ShopSmallItem from "app/components/ShopSmallItem";

function ProductDetailScreen(props) {
	const { width } = useWindowDimensions();
	const dispatch = useDispatch()
	const [result, setResult] = useState();
	const [quantity, setQuantity] = useState(1);
	const [refresh, setRefresh] = useState(false);
	const [variableChoosen, setVariableChoosen] = useState(null)
	const [productName, setProductName] = useState('')
	const slug = props.route.params.slug;
	const settings = useSelector(state => state.SettingsReducer.options)
	const currentUser = useSelector(state => state.memberAuth.user);
	const cart = useSelector(state => state.CartReducer);

	useEffect(() => {
		async function getProducts() {
			apiClient.get(apiConfig.BASE_URL+'/product/'+slug)
				.then(function (response) {
				if (response.status === 200) {
					setRefresh(false)
					setResult(response.data)
					setQuantity(1)
					setProductName(response.data && response.data.product && response.data.product.name)
				}
			}).catch(function(error){
				setRefresh(false)
				console.log(error);
			})
		}
		_scrollView.current?.scrollTo({y: 0, animated: true})
		getProducts();
	},[slug, refresh])

	let description;
	let gallery = [];
	let prices = [];
	let price = 0;
	let normalPrice = 0;
	let instock = 0;
	let giamgiaPercent = 0;
	let priceId = null;

	if (result) {
		gallery = JSON.parse(result.product.gallery)
		prices = result.product.prices
		giamgiaPercent = result.product.giamgiaPercent;

		if (prices.length > 0) {
			if (variableChoosen) {
				result.product.prices.map((item => {
					if(item.id === variableChoosen) {
						price = item.price * (100 - giamgiaPercent)/100;
						normalPrice = item.price;
						priceId = item.id;
						instock = item.inStock
					}
				}))
			} else {
				price = prices[0].price * (100 - giamgiaPercent)/100
				normalPrice = prices[0].price;
				priceId = prices[0].id
				instock = prices[0].inStock
			}
		}

		description = {
			html: `<head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        p, h1, h2, h3, h4, h5, h6, ul, li, a, strong, italic {
                       font-size: 16px;
                        }
                        li {
                        box-sizing: unset !important;;
                        line-height: unset !important;
                        }
                        img { display: block; max-width: 100%; height: auto; }
                    </style>
                    
                    </head>
                    <body>${result.product.description}</body>`
		}

		var source = result.product.description ?
			{
				html: `<head>
                    <link rel="preconnect" href="https://fonts.gstatic.com">
                    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body {
                          	color: grey;
                            font-size: 16px;
                        }
                        p, h1, h2, h3, h4, h5, h6, ul, li, a, strong, italic {
                          	color: grey;
                       font-size: 14px;
                        }
                        li {
                        box-sizing: unset !important;;
                        line-height: unset !important;
                        }
                        img { display: block; max-width: 100%; height: auto; }
                        p {
                          	color: grey;
                        margin-bottom: 0px !important;
                        }
                    </style>
                    </head>
                    <body>${result.product.description}</body>`
			}
			:
			{}

		var tagsStyles = {
			body: {
				color: '#292929',
				whiteSpace: 'normal',
				fontSize: 14,
			},
			a: {
				color: 'blue'
			},
			img: {
				marginTop: 10,
				marginBottom: 20,
				width: '100%'
			},
			ul: {
				marginTop: 50
			}
		};
	}

	const _scrollView = React.useRef(null);

	async function handleAddToCart(Item) {
		if (result && result.product && result.product.prices && result.product.prices.length > 1 && variableChoosen === null) {
			showMessage({
				message: 'Vui lòng chọn loại sản phẩm',
				type: 'danger',
				icon: 'info',
				duration: 3000,
			});
		} else {
			if (cart) {
				const index = cart.items.findIndex(item => Number(item.productPrice) === Number(Item.productPrice))
				if (index !== -1) {
					let currentItem = cart.items[index];
					if ((Number(currentItem.quantity) + Number(Item.quantity)) > Number(Item.inStock)) {
						showMessage({
							message: 'Giỏ hàng của bạn đã có đủ số lượng sản phẩm trong kho',
							type: 'danger',
							icon: 'info',
							duration: 3000,
						});
					} else {
						dispatch(addToCart(Item))
					}
				} else {
					dispatch(addToCart(Item))
				}
			} else {
				dispatch(addToCart(Item))
			}
		}
	}

	async function handleBuyNow(Item) {
		if (result && result.product && result.product.prices && result.product.prices.length > 1 && variableChoosen === null) {
			showMessage({
				message: 'Vui lòng chọn một loại sản phẩm!',
				type: 'danger',
				icon: 'info',
				duration: 3000,
			});
		}
		const token = await AsyncStorage.getItem('v99_user_token');
		await axios({
			method: 'post',
			url: `${apiConfig.BASE_URL}/member/order/calcPrice`,
			data: {
				orderItems: [Item]
			},
			headers: { Authorization: `Bearer ${token}` }
		}).then(function (response) {
			if (response.status === 201) {
				const checkoutParams = {
					subTotal: response.data.subTotal,
					totalDiscount: Number(response.data.discount),
					discountPercent: Number(response.data.discountPercent),
					cashAmount: Number(response.data.cashAmount),
					pointAmount: Number(response.data.pointAmount),
					totalAmount: Number(response.data.subTotal) - Number(response.data.discount),
					prices: response.data.prices,
					orderParams: [Item],
					vatAmount: Number(response.data.vatAmount),
					btmReward: Number(response.data.btmReward),
					price: Number(response.data.price),
					checkOutType: 'buynow',
					type: 'Sản phẩm'
				}
				props.navigation.navigate('CustomerInformation', checkoutParams)
			}
		}).catch(function(error) {
			console.log(error);
			showMessage({
				message: error.response.data.message,
				type: 'danger',
				icon: 'info',
				duration: 3000,
			});
		})
	}

	function handleShare() {
		let  text = productName ? productName + '\n' : '';
		if(Platform.OS === 'android')
			text = text.concat(`${settings && settings.website_url}/product/${slug}${currentUser ? '?ref='+currentUser.refId : ''}`)
		else
			text = text.concat(`${settings && settings.website_url}/product/${slug}${currentUser ? '?ref='+currentUser.refId : ''}`)

		Share.share({
			subject: 'Chia sẻ',
			title: 'Chia sẻ',
			message: text,
			url: text,

		}, {
			// Android only:
			dialogTitle: 'Chia sẻ',
			// iOS only:
			excludedActivityTypes: []
		})
	}
	return (
		!result ? <ProductDetailLoading /> :
		<View style={tw`flex bg-gray-100 min-h-full content-between`}>
			<StatusBar barStyle={"light-content"} backgroundColor={'#1e74e5'} />
			<View style={[tw`${Platform.OS === 'android' ? 'pt-4' : 'pt-10'} pb-3`, {backgroundColor: '#1e74e5'}]}>
				<View style={tw`flex flex-row items-center justify-between`}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => props.navigation.goBack()}>
						<Icon name="chevron-left"
						      size={28}
						      style={tw`text-white ml-3`}
						/>
					</TouchableOpacity>
					<View style={tw`flex flex-row items-center mr-3`}>
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => handleShare()}
						>
							<Icon name="share-variant"
							      size={23}
							      style={tw`text-white mr-5`}
							/>
						</TouchableOpacity>
						<CartIcon navigation={props.navigation} />
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => props.navigation.openDrawer()}
						>
							<Icon name={"menu"} size={30} style={tw`text-white ml-3`} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<ScrollView
				ref={_scrollView}
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
				<View style={tw`pb-40`}>
					{gallery && gallery.length > 0 ?
						<View>
							<ProductGallery gallery={gallery}/>
						</View>
						:
						<View>
							<Image
								source={{uri: result.product.featureImage}}
								style={tw`h-96 w-full`}
							/>
						</View>
					}

					<View style={tw`bg-white mb-3 p-3`}>
						<Text  style={tw`font-bold text-xl`} numberOfLines={2} ellipsizeMode={"tail"}>
							{result && result.product.name}
						</Text>
						<View style={tw`flex flex-row items-center justify-between`}>
							<View>
								{prices && prices.length > 1 ?
									variableChoosen ?
									<View>
										{prices.map((item, index) => (
											item.id === variableChoosen &&
											<Text  style={tw`text-red-600 font-bold text-lg`}>{formatVND(item.price)}</Text>
											))}
									</View>
									:
									<Text><Text style={tw`text-red-600 font-bold text-lg`}>{formatVND(prices[0].price)}</Text> - <Text style={tw`text-red-600 font-bold text-lg`}>{formatVND(prices[prices.length - 1].price)}</Text></Text>

								: prices && prices.length === 1 ?
									<Text  style={tw`text-red-600 font-bold text-lg`}>{formatVND(prices[0].price)}</Text>
										:
										<Text  style={tw`text-red-600 font-bold text-lg`}>Liên hệ</Text>
								}
							</View>
							<View>
								<Text>Kho: {instock}</Text>
							</View>
						</View>
						{result && result.product && result.product.description &&
							<View style={tw`my-2`}>
								<RenderHtml
									source={source}
									width={width}
									tagsStyles={tagsStyles}
									allowedStyles={[]}
								/>
							</View>
						}
					</View>
					{prices && prices.length > 1 &&
						<View style={tw`bg-white mb-3 p-3 flex flex-row items-center justify-between`}>
							<View>
								<Text  style={tw`font-medium mb-2`}>Chọn {prices[0].unit}</Text>
								<View style={tw`flex flex-row items-center`}>
									{prices.map((item, index) => (
										<TouchableOpacity
											disabled={Number(item.instock) <= 0}
											onPress={() => setVariableChoosen(item.id)}
											style={tw`px-4 py-2 rounded border border-gray-200 mr-3 ${variableChoosen === item.id && 'bg-blue-500'} ${Number(item.instock) <= 0 && 'bg-gray-100'}`}
											activeOpacity={1}
										>
											<Text>{Number(item.instock) <= 0 && <Icon name={"close-circle"} style={tw`text-gray-400`} />} <Text style={tw`${variableChoosen === item.id && 'text-white'} ${Number(item.instock) <= 0 && 'text-gray-400'}`}>{item.name}</Text></Text>
										</TouchableOpacity>
									))}
								</View>
							</View>
						</View>
					}
					{instock > 0 &&
						<View style={tw`bg-white mb-3 p-3 flex flex-row items-center justify-between`}>
							<View>
								<Text style={tw`font-medium`}>
									Chọn số lượng
								</Text>
								<Text style={tw`italic text-xs`}>Kho: {instock} {prices[0].unit}</Text>
							</View>

							<InputSpinner
								max={instock}
								min={1}
								step={1}
								height={40}
								width={140}
								style={tw`shadow-none border border-gray-200`}
								skin={"square"}
								colorMax={"#f04048"}
								colorMin={"#cbcbcb"}
								value={Number(quantity)}
								onChange={(num) => {
									setQuantity(num)
								}}
							/>
						</View>
					}

					{result && result.product && result.product.shop &&
						<ShopSmallItem
							navigation={props.navigation}
							shop={result.product.shop}
						/>
					}

					<View style={tw`bg-white mb-3`}>
						<View style={tw`px-3 pt-3`}>
							<Text  style={tw`uppercase text-gray-600 font-medium`}>Thông tin sản phẩm</Text>
						</View>
						{result && result.product && result.product.content ?
							<InfoBox slug={result && result.product.slug} content={result && result.product.content} title="Thông tin sản phẩm" navigation={props.navigation} backScreen={'ProductDetail'}/>
							:
							<View style={tw`mt-5 mb-5`}>
								<Text  style={tw`text-center`}>Đang cập nhật nội dung...</Text>
							</View>
						}
					</View>
					{result && result.relatedProducts && result.relatedProducts.length > 0 &&
						<View style={tw`bg-white mb-3`}>
							<View style={tw`px-3 pt-3`}>
								<Text  style={tw`uppercase text-gray-600 font-medium`}>Sản phẩm liên quan</Text>
							</View>

							<FlatGrid
								itemDimension={150}
								data={result.relatedProducts}
								additionalRowStyle={tw`flex items-start`}
								spacing={10}
								renderItem={({item}) => (
									<ProductItem item={item} navigation={props.navigation}/>
								)} />
						</View>
					}
				</View>
			</ScrollView>
			{currentUser ?
				<>
					{instock > 0 && result && !result.product.shop ?
						<View style={tw`absolute bottom-20 android:bottom-14 bg-white w-full pb-4 pt-2 shadow-lg px-3`}>
							<View style={tw`flex flex-row items-center justify-between`}>
								<TouchableOpacity
									style={tw`bg-blue-500 px-5 py-3 rounded flex flex-row items-center`}
									onPress={() => handleAddToCart({
										productPrice: priceId,
										quantity,
										inStock: Number(instock),
									})}
									disabled={instock <= 0}
								>
									<Icon name={"cart-plus"} style={tw`text-white mr-1`} size={18} />
									<Text style={tw`text-white font-bold uppercase`}>Thêm vào giỏ hàng</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={tw`bg-orange-500 px-5 py-3 rounded flex items-center flex-row`}
									onPress={() => handleBuyNow({
										productPrice: priceId,
										quantity,
										inStock: Number(instock)
									})}
									disabled={instock <= 0}
								>
									<Text style={tw`text-white font-bold uppercase`}>Mua ngay</Text>
									<Icon name={"arrow-right"} style={tw`text-white ml-1`} size={18} />
								</TouchableOpacity>
							</View>
						</View>
						:
						<View style={tw`absolute bottom-20 android:bottom-14 bg-white w-full pb-4 pt-2 shadow-lg px-3`}>
							<View style={tw`flex flex-row items-center justify-between`}>
								<TouchableOpacity
									style={tw`w-full bg-orange-500 px-5 py-3 rounded flex items-center flex-col`}
									onPress={() => handleBuyNow({
										productPrice: priceId,
										quantity,
										productId: result && result.product && result.product.id,
										inStock: Number(instock)
									})}
									disabled={instock <= 0}
								>
									<Text style={tw`text-white font-bold uppercase`}>Mua ngay</Text>
								</TouchableOpacity>
							</View>
						</View>
					}
				</>
				:
				<>
					<View style={tw`absolute bottom-20 android:bottom-14 bg-white w-full py-3 shadow-lg px-3`}>
						<TouchableOpacity
							onPress={() => props.navigation.navigate('Login')}
							style={tw`bg-orange-500 px-5 py-3 rounded flex items-center`}
						>
							<Text  style={tw`text-white uppercase font-medium`}>Đăng nhập để mua hàng</Text>
						</TouchableOpacity>
					</View>
				</>
			}



		</View>
	);
}

export default ProductDetailScreen;
