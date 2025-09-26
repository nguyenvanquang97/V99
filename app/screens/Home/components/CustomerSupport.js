import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FlatGrid } from "react-native-super-grid";

function CustomerSupport(props) {
	const items = [
		{
			title: 'Câu hỏi thường gặp',
			link: null,
			faqCatId: props.settings && props.settings.faq_category_id
		},
		{
			title: 'Phản ánh góp ý',
			link: 'Support',
			faqCatId: null
		},
		{
			title: 'Hỗ trợ mua hàng',
			link: null,
			faqCatId: props.settings && props.settings.support_category_id
		},
		{
			title: 'Chính sách đại lý',
			link: null,
			faqCatId: props.settings && props.settings.policy_category_id
		},
	]

	return (
		<View style={tw`bg-white mb-5 py-5`}>
			<View style={tw`mx-3 mb-2 flex flex-row items-center justify-between`}>
				<View style={tw`flex flex-row items-center`}>
					<Icon name={"lifebuoy"} style={tw`text-blue-500 mr-2`} size={24}/>
					<Text  style={tw`uppercase font-bold text-blue-500`}>Hỗ trợ khách hàng</Text>
				</View>
			</View>

			<FlatGrid
				itemDimension={150}
				data={items}
				additionalRowStyle={tw`flex items-start`}
				spacing={10}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={tw`bg-white rounded-md shadow-lg`}
						activeOpacity={1}
						onPress={() => props.navigation.navigate(item.link ? 'Contact' : 'FAQScreen', item)}
					>
						<View style={tw`flex items-center py-2`}>
							<Text style={tw`uppercase text-gray-600 font-bold text-xs`}>{item.title}</Text>
						</View>
					</TouchableOpacity>
				)} />
		</View>
	);
}

export default CustomerSupport;
