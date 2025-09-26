import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "app/services/client";
import apiConfig from "app/config/api-config";
import {all, call, delay, put, takeLatest} from 'redux-saga/effects';
import {
	GetMeFailed,
	GetMeSuccess,
	memberLoginFailed,
	memberLoginSuccess,
	memberLogoutFailed,
	memberLogoutSuccess, updateAccountSuccess,
} from "app/screens/Auth/action";
import axios from "axios";

async function storeToken(token) {
	try {
		await AsyncStorage.setItem('v99_user_token', token)
	} catch (e) {
		console.log(e);
	}
}
async function removeToken() {
	try {
		await AsyncStorage.removeItem('v99_user_token')
	} catch (e) {
		console.log(e);
	}
}

async function getMe(payload) {
	return await axios.get(
		`${apiConfig.BASE_URL}/auth/customer/me`,
		{headers: {Authorization: `Bearer ${payload}`}}
	)
}

function* getMeData(action) {
	try {
		const response = yield call(getMe, action.payload);
		const {data} = response;
		yield put(GetMeSuccess(data));
	} catch (e) {
		yield put(GetMeFailed(e.response))
	}
}

export const memberLoginCall = payload =>
	axios
		.post(`${apiConfig.BASE_URL}/auth/customer/login`, {
			username: payload.data.username,
			password: payload.data.password,
		})
		.then(response => ({response}))
		.catch(error => ({error}))


function * Login(action) {
	const {response, error} = yield call(memberLoginCall, action.payload);
	if (response) {
		yield call(storeToken, response.data.accessToken);
		const userData = yield call(getMe, response.data.accessToken);
		yield put(memberLoginSuccess(userData.data.data));
	} else {
		yield put(memberLoginFailed(error.response.data))
	}
}

function * Logout(action) {
	try {
		yield call(removeToken);
		yield put(memberLogoutSuccess({message: 'Đã đăng xuất tài khoản!'}))
		action.payload.navigation.navigate('Home')
	} catch (e) {
		yield put(memberLogoutFailed({message: 'Lỗi'}))
	}
}

// update account
async function updateAccountCall (payload){
	const Token = await AsyncStorage.getItem('v99_user_token');
	return axios.put(
		`${apiConfig.BASE_URL}/user/me`,
		payload.body,
		{headers: {Authorization: `Bearer ${Token}`}}
	).then(response => ({response})).catch(error => ({error}));
}

function* updateAccount(action) {
	const {response, error} = yield call(updateAccountCall, action.payload);
	if (response) {
		yield put(updateAccountSuccess(response.data));
	} else {
		console.log('Lỗi')
	}
}

export function* AuthSagas() {
	yield all([
		takeLatest('LOGIN', Login),
		takeLatest('GET_ME', getMeData),
		takeLatest('LOGOUT', Logout),
		takeLatest('UPDATE_ACCOUNT', updateAccount),
	])
}
