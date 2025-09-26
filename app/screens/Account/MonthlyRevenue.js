import React from "react";
import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TransactionItem from "app/components/TransactionItem";
import DatePicker from "react-native-neat-date-picker";
import MonthlyRevenueItem from "app/screens/Account/MonthlyRevenueItem";

function MonthlyRevenue(props) {
	return (
		<View>
			<View style={tw`bg-white ios:pt-4 android:pt-4 pb-4 flex-row items-center`}>
				<TouchableOpacity
					onPress={() => props.navigation.navigate(props.backScreen)}
					style={tw`mr-3 ml-3`}
				>
					<Icon name="close" size={26}/>
				</TouchableOpacity>
				<Text style={tw`font-medium uppercase`}>Thống kê doanh số tháng</Text>
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				overScrollMode={'never'}
				scrollEventThrottle={16}
			>
				<View style={tw`pb-64`}>
					<View>
						{props.list && props.list.length > 0 ?
							<FlatList
								data={props.list && props.list}
								renderItem={({item}) => <MonthlyRevenueItem item={item} navigation={props.navigation}/>}
								keyExtractor={(item) => item.id}
								//removeClippedSubviews={true} // Unmount components when outside of window
								initialNumToRender={4} // Reduce initial render amount
								maxToRenderPerBatch={1} // Reduce number in each render batch
								updateCellsBatchingPeriod={100} // Increase time between renders
								windowSize={7} // Reduce the window size
							/>
							:
							<View style={tw`flex items-center my-5`}>
								<Icon name={"reload-alert"} size={50} style={tw`mb-3 text-gray-300`} />
								<Text style={tw`text-gray-600`}>Chưa có thống kê</Text>
							</View>
						}
					</View>
				
				</View>
			</ScrollView>
		</View>
	);
}

export default MonthlyRevenue;