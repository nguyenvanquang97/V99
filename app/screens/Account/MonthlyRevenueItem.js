import React from "react";
import { Text, View } from "react-native";
import { formatDate, formatVND } from "app/utils/helper";
import tw from "twrnc";

function MonthlyRevenueItem(props) {
	const item = props.item
	return (
		<View style={tw`bg-white my-2 p-3`}>
			<View>
				<Text style={tw`font-bold text-red-500 mb-2`}>Tháng {item.month}-{item.year}</Text>
			</View>
			<View style={tw`py-2 border-b border-gray-100 flex items-center flex-row justify-between`}>
				<Text style={tw`text-gray-500`}>Doanh số cá nhân:</Text>
				<Text>{formatVND(item.amount)}</Text>
			</View>
			<View style={tw`py-2 border-b border-gray-100 flex items-center flex-row justify-between`}>
				<Text style={tw`text-gray-500`}>Doanh số nhóm:</Text>
				<Text>{formatVND(item.groupRevenue)}</Text>
			</View>
			<View style={tw`${item.overAmount ? 'py-2 border-b border-gray-100 ' : 'pt-2'} flex items-center flex-row justify-between`}>
				<Text style={tw`text-gray-500`}>Tổng doanh số:</Text>
				<Text style={tw`font-bold text-blue-500`}>{formatVND(Number(item.groupRevenue)+Number(item.amount))}</Text>
			</View>
			{item.overAmount &&
				<View style={tw`pt-2 flex items-center flex-row justify-between`}>
					<Text style={tw`text-gray-500`}>Vượt doanh số:</Text>
					<Text style={tw`font-bold text-green-600`}>{formatVND(item.overAmount)}</Text>
				</View>
			}

		</View>
	);
}

export default MonthlyRevenueItem;
