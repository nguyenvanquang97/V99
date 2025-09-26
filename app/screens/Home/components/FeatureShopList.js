import React, { useRef } from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {FlatGrid} from "react-native-super-grid";
import ApiConfig from "app/config/api-config";
import ProductItem from "app/components/ProductItem";

import ProjectItem from "app/components/ProjectItem";
import ShopItem from "app/components/ShopItem";

function ShopList(props) {
	const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
	const SLIDE_WIDTH = Math.round(viewportWidth / (props.type === 'Dự án' ? 1.3 : 2.6));
	const ITEM_HORIZONTAL_MARGIN = 15;
	const ITEM_WIDTH = SLIDE_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
	const SLIDER_WIDTH = viewportWidth;
	const carouselRef = useRef(null);
	return (
		<View style={tw`bg-white mb-5 py-4`}>
			<View style={tw`mx-3 mb-3 flex flex-row items-center justify-between`}>
				<View style={tw`flex flex-row items-center`}>
					<Icon name={props.icon} style={tw`${props.iconColor} mr-2 -mt-1`} size={24}/>
					<Text  style={tw`uppercase font-bold ${props.titleColor ? props.titleColor : 'text-gray-800'}`}>{props.title}</Text>
				</View>
				<TouchableOpacity
					style={tw`flex flex-row items-center`}
					onPress={() => props.navigation.navigate("Stores")}
				>
					<Text style={tw`mr-1 text-gray-700`}>Xem tất cả</Text>
					<Icon name={"chevron-right"} style={tw`text-gray-700`} size={16} />
				</TouchableOpacity>
			</View>
			<View style={tw`mx-3 relative`}>
				{props.items && props.items.list && props.items.list.length > 0 ?
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						{props.items && props.items.list && props.items.list.map((el) => (
							<ShopItem item={el} navigation={props.navigation} />
							))}
					</ScrollView>
					:
					<View style={tw`flex items-center my-5`}>
						<Icon name={"store-off"} style={tw`text-gray-300 mb-2`} size={32}/>
						<Text style={tw`text-gray-400`}>Chưa có gian hàng!</Text>
					</View>
				}
				{/*<Carousel
					ref={(c) => this.carousel = c}
					sliderWidth={SLIDER_WIDTH}
					itemWidth={ITEM_WIDTH}
					activeSlideAlignment={'start'}
					inactiveSlideScale={1}
					inactiveSlideOpacity={1}
					data={props.items && props.items.list}
					renderItem={({item}) => (
						<View style={tw`mr-2`}>
							<ShopItem item={item} navigation={props.navigation} />
						</View>
					)}
					hasParallaxImages={false}
					autoplay
					autoplayInterval={4000}
					loop
				/>*/}
			</View>
		</View>
	);
}

export default ShopList;
