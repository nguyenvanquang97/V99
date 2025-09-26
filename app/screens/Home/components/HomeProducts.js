import React, { useEffect, useState } from "react";
import { apiClient } from "app/services/client";
import tw from "twrnc";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FlatGrid } from "react-native-super-grid";
import ProductItem from "app/components/ProductItem";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProjectItem from "app/components/ProjectItem";

function HomeProducts(props) {
	const [result, setResult] = useState();
	const [catId, setCatId] = useState('ALL');
	const [category, setCategory] = useState();
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		if (catId !== 'ALL') {
			setLoading(true)
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
	},[catId])
	
	useEffect(() => {
		setLoading(true)
		async function getProducts() {
			await apiClient.get('/product', {
				params: {
					category: catId === 'ALL' ? 'ALL' : [catId],
					limit: 8,
					page: 1,
					status: 'Đăng',
				}
			}).then(function (response) {
				if (response.status === 200) {
					setResult(response.data)
					setLoading(false)
				}
			}).catch(function(error){
				console.log(error);
				setLoading(false)
			})
		}
		getProducts();
	},[catId])
	
	return (
		<View style={tw`bg-white mb-5 py-5`}>
			<View style={tw`mx-3 mb-3 flex flex-row items-center justify-between`}>
				<View style={tw`flex flex-row items-center`}>
					<Icon name={"storefront"} style={tw`text-red-500 mr-2`} size={24}/>
					<Text  style={tw`uppercase font-bold text-red-500`}>Cửa hàng V99</Text>
				</View>
			</View>
			<View style={tw`bg-white mb-3 px-3`}>
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
					{props.categories && props.categories.length > 0 && props.categories.map((item, index) => (
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
			{result && result.list && result.list.length > 0 ?
				loading ?
					<SkeletonPlaceholder>
						<View style={tw`flex flex-row items-center justify-between mb-5 mx-3`}>
							<View>
								<View style={tw`h-46 w-40 mb-2`} />
								<View style={tw`w-32 h-3 mb-1`} />
								<View style={tw`w-20 h-3`} />
							</View>
							<View>
								<View style={tw`h-46 w-40 mb-2`} />
								<View style={tw`w-32 h-3 mb-1`} />
								<View style={tw`w-20 h-3`} />
							</View>
						</View>
						<View style={tw`flex flex-row items-center justify-between mb-5 mx-3`}>
							<View>
								<View style={tw`h-46 w-40 mb-2`} />
								<View style={tw`w-32 h-3 mb-1`} />
								<View style={tw`w-20 h-3`} />
							</View>
							<View>
								<View style={tw`h-46 w-40 mb-2`} />
								<View style={tw`w-32 h-3 mb-1`} />
								<View style={tw`w-20 h-3`} />
							</View>
						</View>
					</SkeletonPlaceholder>
					:
				<>
					<FlatGrid
						itemDimension={150}
						data={result.list}
						additionalRowStyle={tw`flex items-start`}
						spacing={10}
						renderItem={({ item }) => (
							item.type === 'Dự án' ?
							<ProjectItem item={item} navigation={props.navigation} />
								:
							<ProductItem item={item} navigation={props.navigation} />
						)} />
					<View style={tw`flex items-center content-center border-t border-gray-100 pt-3`}>
						<TouchableOpacity
							style={tw`flex flex-row items-center`}
							onPress={() => props.navigation.navigate(catId === 'ALL' ? 'Products' : "ProductCategory", {
								catId: category && category.detail.id,
								catSlug: category && category.detail.slug,
							})}
						>
							<Text  style={tw`mr-1 text-yellow-500 font-medium`}>Xem thêm</Text>
							<Icon name={"chevron-right"} style={tw`text-gray-500`} size={18} />
						</TouchableOpacity>
					</View>
				</>
				:
				<View style={tw`flex items-center content-center`}>
					<Icon name={"package-variant"} size={30} style={tw`text-gray-200`} />
					<Text  style={tw`text-gray-300`}>Chưa có sản phẩm</Text><Text style={tw`text-gray-400`}>trong danh mục</Text>
				</View>
			}
		</View>
	);
}

export default HomeProducts;