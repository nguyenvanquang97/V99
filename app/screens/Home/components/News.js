import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {FlatGrid} from "react-native-super-grid";
import ApiConfig from "app/config/api-config";
import ProductItem from "app/components/ProductItem";
import NewsItem from "app/components/NewsItem";
import axios from "axios";
import { apiClient } from "app/services/client";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useDispatch } from "react-redux";

function News(props) {
	const dispatch = useDispatch()
	const [result, setResult] = useState();
	const [catId, setCatId] = useState('ALL');
	const [categories, setCategories] = useState();
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		async function getCategory() {
			await apiClient.get('/post-category'
			).then(function (response) {
				if (response.status === 200) {
					setCategories(response.data)
					setLoading(false)
				}
			}).catch(function(error){
				console.log(error);
				setLoading(false)
			})
		}
		getCategory();
	},[dispatch])

	useEffect(() => {
		setLoading(true)
		async function getCategory() {
			await apiClient.get('/post', {
				params: {
					catId: catId === 'ALL' ? 'ALL' : [catId],
					limit: 8,
					page: 1,
					status: 'Đăng',
				}
			})
			.then(function (response) {
				if (response.status === 200) {
					setResult(response.data)
					setLoading(false);
				}
			}).catch(function(error){
				console.log(error);
				setLoading(false);
			})
		}
		getCategory();
	},[catId])

	return (
		<View style={tw`bg-white mb-5 py-5`}>
			<View style={tw`mx-3 mb-4 flex flex-row items-center justify-between`}>
				<View style={tw`flex flex-row items-center`}>
					<Icon name={"alert-decagram"} style={tw`text-orange-600 mr-2`} size={24}/>
					<Text  style={tw`uppercase font-bold text-orange-500`}>Tin tức & Sự kiện</Text>
				</View>
				<TouchableOpacity
					style={tw`flex flex-row items-center`}
					onPress={() => props.navigation.navigate("Posts")}
				>
					<Text  style={tw`mr-1 text-orange-600 font-medium`}>Xem tất cả</Text>
					<Icon name={"chevron-right"} style={tw`text-orange-500`} size={18} />
				</TouchableOpacity>
			</View>
			<View style={tw`bg-white mb-5 px-3`}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => setCatId('ALL')}
						style={tw`mr-2 rounded border border-green-100 px-3 py-2 ${catId === 'ALL' && 'bg-blue-600'}`}
					>
						<Text style={tw`font-medium ${catId === 'ALL' && 'text-white'}`}>Tất cả</Text>
					</TouchableOpacity>
					{categories && categories.length > 0 && categories.map((item, index) => (
						<TouchableOpacity
							activeOpacity={1}
							style={tw`mr-2 rounded border border-green-100 px-3 py-2 ${catId === item.id && 'bg-blue-600'}`}
							onPress={() => setCatId(item.id)}
						>
							<View>
								<Text  style={tw`font-medium ${catId === item.id && 'text-white'}`}>{item.name}</Text>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
			{result && result.posts && result.posts.length > 0
				? loading ?
					<SkeletonPlaceholder>
						<View style={tw`mb-5 mx-3`}>
							<View>
								<View style={tw`h-52 w-full mb-2`} />
								<View style={tw`w-full h-3 mb-1`} />
							</View>
						</View>
						<View style={tw`flex flex-row items-center justify-between mb-5 mx-3`}>
							<View>
								<View style={tw`h-32 w-40 mb-2`} />
								<View style={tw`w-32 h-3 mb-1`} />
							</View>
							<View>
								<View style={tw`h-32 w-40 mb-2`} />
								<View style={tw`w-32 h-3 mb-1`} />
							</View>
						</View>
					</SkeletonPlaceholder>
					:
				<>
					{result.posts[0] &&
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => props.navigation.navigate('PostDetail', {postSlug: result.posts[0].slug})}
							style={tw`px-3 mb-5`}
						>
							<View>
								<Image
									source={{uri: result.posts[0].featureImage}}
									style={[tw`w-full h-52 rounded`, {resizeMode: 'cover'}]}
								/>
							</View>
							<View style={tw`p-2 border-t border-gray-100`}>
								<Text  style={tw`font-medium`} numberOfLines={2} ellipsizeMode='tail'>{result.posts[0].title}</Text>
							</View>
						</TouchableOpacity>
					}
					<ScrollView horizontal scrollEnabled={true} showsVerticalScrollIndicator={false}>
						{result.posts.slice(1).map((item, index) => (
							<NewsItem
								horizontal={props.horizontal}
								item={item}
								navigation={props.navigation}
								key={index}
							/>
						))}
						<View style={tw`h-full flex items-center flex-row mr-3 ml-5`}>
							<TouchableOpacity
								onPress={() => props.navigation.navigate(`Posts`)}
								style={tw`flex items-center justify-center`}
							>
								<View
									style={tw`bg-white flex flex-row items-center justify-center border border-blue-500 rounded-3xl h-10 w-10 mb-3`}>
									<Icon name="arrow-right" size={26} style={tw`text-blue-500 ml-1`} />
								</View>
								<Text  style={tw`text-blue-500`}>Xem thêm</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</>
				:
				<View style={tw`flex items-center content-center`}>
					<Icon name={"newspaper-check"} size={30} style={tw`text-gray-200`} />
					<Text  style={tw`text-gray-400 mb-1`}>Chuyên mục này</Text><Text style={tw`text-gray-500`}>hiện chưa có bài viết!</Text>
				</View>
			}
		</View>
	);
}

export default News;
