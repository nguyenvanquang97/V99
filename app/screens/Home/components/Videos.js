import React, { useEffect, useState } from "react";
import { Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { apiClient } from "app/services/client";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import YoutubePlayer from "react-native-youtube-iframe";
import TextTicker from 'react-native-text-ticker'

const height = (Dimensions.get("window").width / 16) * 9;

function Videos(props) {
	const [result, setResult] = useState();
	const [catId, setCatId] = useState('ALL');
	const [categories, setCategories] = useState();
	const [loading, setLoading] = useState(false)
	const [playing, setPlaying] = useState({
		index: 0, video: null, title: null, play: false
	});

	useEffect(() => {
		setLoading(true)
		async function getCategory() {
			await apiClient.get('/post-category', {
				params: {
					userOnly: 'FALSE',
					videoCat: 'TRUE'
				}
			}).then(function (response) {
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
	},[])

	useEffect(() => {
		setLoading(true)
		async function getCategory() {
			await apiClient.get('/post', {
				params: {
					catId: catId === 'ALL' ? 'ALL' : [catId],
					limit: 5,
					page: 1,
					status: 'ACTIVE',
					userOnly: 'FALSE',
					type: 'video'
				}
			})
			.then(function (response) {
				if (response.status === 200) {
					setResult(response.data)
					setPlaying({
						index: 0,
						video: response.data.posts[0].videoId,
						title: response.data.posts[0].title
					})
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
					<Icon name={"youtube"} style={tw`text-red-600 mr-2`} size={24}/>
					<Text  style={tw`uppercase font-bold text-red-600`}>Video clip</Text>
				</View>
				{/*<TouchableOpacity
					style={tw`flex flex-row items-center`}
					onPress={() => props.navigation.navigate("Videos")}
				>
					<Text  style={tw`mr-1 text-red-700 font-medium`}>Xem thêm video</Text>
					<Icon name={"chevron-right"} style={tw`text-red-700`} size={18} />
				</TouchableOpacity>*/}
			</View>
			<View style={tw`bg-white mb-5 px-3`}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => setCatId('ALL')}
						style={tw`mr-2 rounded border border-red-700 px-3 py-2 ${catId === 'ALL' && 'bg-red-700'}`}
					>
						<Text style={tw`font-medium ${catId === 'ALL' && 'text-white'}`}>Tất cả</Text>
					</TouchableOpacity>
					{categories && categories.length > 0 && categories.map((item, index) => (
						<TouchableOpacity
							activeOpacity={1}
							style={tw`mr-2 rounded border border-red-100 px-3 py-2 ${catId === item.id && 'bg-red-700'}`}
							onPress={() => setCatId(item.id)}
						>
							<View>
								<Text  style={tw`font-medium text-gray-600 ${catId === item.id && 'text-white'}`}>{item.name}</Text>
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
				<View style={tw`mx-3`}>
					<View style={tw`mb-3`}>
						<YoutubePlayer
							webViewStyle={{opacity: 0.99}}
							play={playing.play}
							//height={Platform.OS === 'android' ? 250 : 210}
							width={'100%'}
							height={height}
							videoId={playing.video}
						/>
						<View style={tw`flex flex-row items-center`}>
							<Icon name={"play"} size={20} style={tw`text-blue-500`} />
							<TextTicker
								style={tw`text-lg font-medium`}
								duration={4000}
								loop
								bounce={false}
								repeatSpacer={50}
								marqueeDelay={1000}
								shouldAnimateTreshold={40}
							>
								{playing.title}
							</TextTicker>
						</View>

					</View>
					<ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
						{result.posts.map((item, index) => (
							<TouchableOpacity
								onPress={() => setPlaying({index, video: item.videoId, title: item.title, play: true})}
								activeOpacity={1}
								style={tw`border-t border-gray-200 pt-2`}
							>
								<View style={tw`flex flex-row items-center justify-between mb-2`}>
									<View style={tw`flex flex-row items-center w-2/3`}>
										<Image source={{uri: item.featureImage}} style={tw`w-20 h-14 rounded mr-2`} />
										<Text numberOfLines={2} style={tw`font-medium`}>{item.title}</Text>
									</View>
									<View>
										<Icon name={"play-circle"} size={20} style={tw`text-gray-500 ${playing.index === index && 'text-red-600'}`}/>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
					<View style={tw`flex items-center content-center border-t border-gray-100 pt-3`}>
						<TouchableOpacity
							style={tw`flex flex-row items-center`}
							onPress={() => props.navigation.navigate("Videos")}
						>
							<Text  style={tw`mr-1 text-red-700 font-medium`}>Xem thêm video</Text>
							<Icon name={"chevron-right"} style={tw`text-red-700`} size={18} />
						</TouchableOpacity>
					</View>
				</View>
				:
				<View style={tw`flex items-center content-center`}>
					<Icon name={"youtube"} size={30} style={tw`text-gray-200`} />
					<Text  style={tw`text-gray-400 mb-1`}>chuyên mục này</Text><Text style={tw`text-gray-500`}>hiện chưa có video!</Text>
				</View>
			}
		</View>
	);
}

export default Videos;
