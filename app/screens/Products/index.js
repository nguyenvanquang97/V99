import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import CartIcon from "app/screens/Cart/components/cartIcon";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "app/services/client";
import CategoryHorizontalList from "app/screens/Home/components/CategoryHorizontalList";
import ProductItem from "app/components/ProductItem";
import { FlatGrid } from "react-native-super-grid";
import ProductPageLoading from "app/screens/Products/components/ProductPageLoading";
import ProjectItem from "app/components/ProjectItem";

function ProductsScreen(props) {
	const dispatch = useDispatch();
	const settings = useSelector(state => state.SettingsReducer.options)
	const categories = useSelector(state => state.SettingsReducer.productCategories)
	//const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState();
	const [catId, setCatId] = useState('ALL');
	const [featureProducts, setFeatureProducts] = useState([]);
	const [products, setProducts] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		props.navigation.setOptions({
			title: 'CỬA HÀNG',
			headerStyle: {
				backgroundColor: '#1e74e5',
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
				<View style={tw`mr-3 flex flex-row items-center`}>
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

	async function getProducts(catid) {
		await apiClient.get(`/product/`,
			{
				params: {
					status: 'Đăng',
					limit: 1000000,
					category: catId === 'ALL' ? 'ALL' : [catid],
				}
			}
		).then((result) => {
			setRefresh(false);
			setLoading(false);
			setProducts(result.data);
		}).catch(function(error){
			console.log(error);
			setLoading(false)
		})
	}

	useEffect(() => {
		setLoading(true)
		if (catId !== 'ALL') {
			async function getCategory() {
				await apiClient.get(`/product-category/${catId}`,
				).then(function (response) {
					if (response.status === 200) {
						setCategory(response.data)
						setLoading(false)
					}
				}).catch(function(error){
					console.log(error);
					setLoading(false)
				})
			}
			getCategory();
		}
		getProducts(catId)
	},[catId, refresh])

	return (
		<View style={tw`flex bg-gray-100 min-h-full`}>
			<StatusBar barStyle={"light-content"} backgroundColor={'#1e74e5'} />
			<View style={tw`bg-white py-3 px-3`}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => setCatId('ALL')}
						style={tw`mr-2 rounded border border-gray-200 px-3 py-2 ${catId === 'ALL' && 'bg-yellow-500'}`}
					>
						<Text style={tw`font-medium text-gray-500 ${catId === 'ALL' && 'text-white'}`}>Tất cả</Text>
					</TouchableOpacity>
					{categories && categories.length > 0 && categories.map((item, index) => (
						<TouchableOpacity
							activeOpacity={1}
							style={tw`mr-2 rounded border border-gray-200 px-3 py-2 ${catId === item.id && 'bg-yellow-500'}`}
							onPress={() => setCatId(item.id)}
						>
							<View>
								<Text  style={tw`font-medium text-gray-500 ${catId === item.id && 'text-white'}`}>{item.name}</Text>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
			{loading ? <ProductPageLoading /> :
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
					<View style={tw`pb-10`}>
						<View style={tw`bg-white py-3`}>
							{catId === 'ALL' ?
								<Text style={tw`font-bold uppercase text-yellow-500 ml-3`}>Tất cả sản phẩm</Text>
								:
								<Text style={tw`font-bold uppercase text-yellow-500 ml-3`}>{category && category.detail && category.detail.name}</Text>
							}
							<FlatGrid
								itemDimension={150}
								data={products && products.list}
								additionalRowStyle={tw`flex items-start`}
								spacing={10}
								renderItem={({ item, index }) => (
									item.type === 'Dự án' ?
										<ProjectItem item={item} navigation={props.navigation} key={index} /> :
									<ProductItem item={item} navigation={props.navigation} key={index} />
								)} />
						</View>
					</View>
				</ScrollView>
			}
		</View>
	);
}

export default ProductsScreen;
