import React, { useRef } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {FlatGrid} from "react-native-super-grid";
import ApiConfig from "app/config/api-config";
import ProductItem from "app/components/ProductItem";
import Carousel from "react-native-reanimated-carousel";
import ProjectItem from "app/components/ProjectItem";

function ProductList(props) {
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
				{props.viewAllButton &&
					<TouchableOpacity
						style={tw`flex flex-row items-center`}
						onPress={() => props.navigation.navigate("Products")}
					>
						<Text style={tw`mr-1 text-gray-700`}>Xem thêm</Text>
						<Icon name={"chevron-right"} style={tw`text-gray-700`} size={16} />
					</TouchableOpacity>
				}
			</View>
			<View style={tw`mx-3 relative`}>
				<Carousel
					ref={carouselRef}
					width={ITEM_WIDTH}
					height={250}
					data={props.items && props.items.list || []}
					renderItem={({item}) => (
						<View style={tw`mr-2`}>
							<ProductItem item={item} navigation={props.navigation} />
						</View>
					)}
					autoPlay
					autoPlayInterval={4000}
					loop
				/>
			</View>
		</View>
	);
}

export default ProductList;
