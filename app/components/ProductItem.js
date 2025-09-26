import React from "react";
import tw from "twrnc";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ApiConfig from "app/config/api-config";
import { formatVND } from "app/utils/helper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function ProductItem(props) {
	const prices = props.item.prices;
	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={() => props.navigation.navigate('ProductDetail', {slug: props.item.slug})}
			style={tw`border border-gray-100 h-60 relative bg-white`}
		>
			<View>
				<Image source={{uri: props.item.featureImage}} style={tw`h-36 w-full`} />
			</View>
			<View style={tw`px-2 py-1 border-t border-gray-100`}>
				<Text  style={tw`font-medium`} numberOfLines={2} ellipsizeMode='tail'>{props.item.name}</Text>
			</View>
			<View style={tw`px-2 flex flex-row items-center`}>
				<Icon name={"storefront"} style={tw`text-gray-400 mr-1`} />
				<Text style={tw`text-gray-500 text-xs`} numberOfLines={1} ellipsizeMode='tail'>{props.item && props.item.shop ? props.item.shop.name : 'NutriV99'}</Text>
			</View>
			<View style={tw`absolute bottom-2 left-2`}>
				{prices && prices.length > 1 ?
					<Text style={tw`text-red-600 font-medium`}>{formatVND(prices[0].price)}</Text>
					:
					prices && prices.length === 1 ?
						<Text  style={tw`text-red-600 font-medium`}>{formatVND(prices[0].price)}</Text>
						:
						<Text  style={tw`text-red-600 font-medium`}>Liên hệ</Text>
				}
			</View>
		</TouchableOpacity>
	);
}

export default ProductItem;
