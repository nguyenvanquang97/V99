import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import { formatDate, formatDateTime, formatDateUS, formatVND } from "app/utils/helper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import axios from "axios";
import { apiClient } from "app/services/client";
import apiConfig from "app/config/api-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransactionType } from "app/models/commons/transaction.model";
import TransactionItem from "app/components/TransactionItem";
import { useIsFocused } from "@react-navigation/native";
import RewardWithdrawScreen from "app/screens/RewardWallet/RewardWithdrawScreen";
import DatePicker from 'react-native-neat-date-picker'
import DateRangeSelect from "app/components/DateRangeSelect";
import { LoadDataAction } from "app/screens/Auth/action";
import WithdrawBankScreen from "app/screens/RewardWallet/WithdrawBankScreen";
import DepositScreen from "app/screens/RewardWallet/DepositScreen";
import TransferScreen from "app/screens/RewardWallet/TransferScreen";

function DepositHistoryScreen(props) {
	console.log(props);
	const isFocused = useIsFocused();
	const dispatch = useDispatch()
	const currentUser = useSelector(state => state.memberAuth.user);
	const settings = useSelector(state => state.SettingsReducer.options);
	const [refresh, setRefresh] = useState(false);
	const [flag, setFlag] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [transactions, setTransactions] = useState();
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [dateRange, setDateRange] = useState(
		[
			moment.utc(moment().clone().startOf('month').format('YYYY-MM-DD')),
			moment.utc(moment().clone().endOf('month').format("YYYY-MM-DD"))
		]
	)
	
	useEffect(() => {
		if (isFocused) {
			async function getPackageInfo() {
				const Token = await AsyncStorage.getItem('v99_user_token');
				axios({
					method: 'get',
					url: `${apiConfig.BASE_URL}/member/transactions`,
					params: {
						rangeStart: '2022-01-01',
						rangeEnd: '2050-01-01',
						type: 'Nạp tiền'
					},
					headers: { Authorization: `Bearer ${Token}` }
				}).then(function(response) {
					if (response.status === 200) {
						setTransactions(response.data)
						setRefresh(false)
					}
				}).catch(function(error) {
					//history.push('/404')
					console.log(error);
					setRefresh(false)
				})
			}
			
			getPackageInfo();
			async function getMe() {
				const token = await AsyncStorage.getItem('v99_user_token');
				axios({
					method: 'get',
					url: `${apiConfig.BASE_URL}/auth/customer/me`,
					headers: {Authorization: `Bearer ${token}`}
				}).then(function (response) {
					if (response.status === 200) {
						dispatch(LoadDataAction(response.data))
						setRefresh(false)
					}
				}).catch(function(error){
					console.log(error);
				})
			}
			getMe();
		}
	}, [dispatch, limit, page, dateRange, flag, refresh, isFocused])
	
	return (
		<View>
			<View style={tw`bg-white ios:pt-4 android:pt-4 pb-4 flex-row items-center`}>
				<TouchableOpacity
					onPress={() => props.navigation.navigate(props.backScreen)}
					style={tw`mr-3 ml-3`}
				>
					<Icon name="close" size={26}/>
				</TouchableOpacity>
				<Text style={tw`font-medium uppercase`}>Lịch sử nạp tiền</Text>
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				overScrollMode={'never'}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl
						refreshing={refresh}
						onRefresh={() => setRefresh(true)}
						title="đang tải"
					/>
				}
			>
				<View style={tw`pb-64`}>
					<View style={tw`px-3`}>
						{transactions && transactions.list && transactions.list.length > 0 ?
							<FlatList
								data={transactions && transactions.list}
								renderItem={({item}) => <TransactionItem white item={item} navigation={props.navigation} settings={settings}/>}
								keyExtractor={(item) => item.id}
								removeClippedSubviews={true} // Unmount components when outside of window
								initialNumToRender={4} // Reduce initial render amount
								maxToRenderPerBatch={1} // Reduce number in each render batch
								updateCellsBatchingPeriod={100} // Increase time between renders
								windowSize={7} // Reduce the window size
							/>
							:
							<View style={tw`flex items-center my-5`}>
								<Icon name={"reload-alert"} size={50} style={tw`mb-3 text-gray-300`} />
								<Text style={tw`text-gray-600`}>Không có giao dịch</Text>
							</View>
						}
					</View>
					
				</View>
			</ScrollView>
			<DatePicker
				isVisible={showDatePicker}
				mode={'range'}
				onCancel={() => setShowDatePicker(false)}
				onConfirm={(start, end) => console.log(start, end)}
			/>
		</View>
	);
}

export default DepositHistoryScreen;
