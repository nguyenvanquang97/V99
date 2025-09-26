import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import ApiConfig from "app/config/api-config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function CategoryHorizontalList(props) {
	
	return (
		<View style={tw`bg-white mb-5 py-3`}>
			{/*<View style={tw`mx-3 mb-5 flex flex-row items-center justify-between`}>
				<Text  style={tw`uppercase font-bold text-orange-500`}>Danh mục sản phẩm</Text>
			</View>*/}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{props.category && props.category.length > 0 && props.category.map((item, index) => (
					<TouchableOpacity
						activeOpacity={1}
						style={tw`flex items-center content-center mr-1`}
						onPress={() => props.navigation.navigate('ProductCategory', {catId: item.id, catSlug: item.slug})}
					>
						<View style={tw`rounded-full border border-gray-300`}>
							{item.featureImage ?
								<Image source={{ uri: item.featureImage }}
								       style={tw`w-12 h-12 rounded-full`} />
								: <Icon name={"check"} size={30} style={tw`p-2 text-blue-500`} />
							}
						</View>
						<View style={tw`mt-1 w-20`}>
							<Text  style={tw`text-center text-xs font-medium text-gray-600`}>{item.name}</Text>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}

export default CategoryHorizontalList;
