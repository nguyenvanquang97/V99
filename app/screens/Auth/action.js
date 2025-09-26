import * as constants from './constant';

export const memberLogin = (data) => ({
	type: constants.LOGIN,
	payload: {
		data
	}
})

export const memberLoginSuccess = (data) => ({
	type: constants.LOGIN_SUCCESS,
	payload: {
		data
	}
})

export const memberLoginFailed = (error) => ({
	type: constants.LOGIN_FAILED,
	payload: {
		error,
	},
});

export const memberRegister = (data, navigation) => ({
	type: constants.REGISTER,
	payload: {
		data,
		navigation
	},
});

export const memberRegisterSuccess = data => ({
	type: constants.REGISTER_SUCCESS,
	payload: {
		data,
	},
});

export const memberRegisterFailed = error => ({
	type: constants.REGISTER_FAILED,
	payload: {
		error,
	},
});

export const memberLogout = (navigation) => ({
	type: constants.LOGOUT,
	payload: {navigation}
});
export const memberLogoutSuccess = data => ({
	type: constants.LOGOUT_SUCCESS,
	payload: {
		data
	},
});
export const memberLogoutFailed = error => ({
	type: constants.LOGOUT_FAILED,
	payload: {
		error
	},
});


export const GetMe = (token) => ({
	type: constants.GET_ME,
	payload: {
		token
	},
});
export const GetMeSuccess = data => ({
	type: constants.GET_ME_SUCCESS,
	payload: {
		data
	},
});
export const GetMeFailed = error => ({
	type: constants.GET_ME_FAILED,
	payload: {
		error
	},
});

export const LoadDataAction = user => ({
	type: constants.USER_DATA,
	user,
});

export const updateAccount = (body ) => ({
	type: constants.UPDATE_ACCOUNT,
	payload: {
		body
	},
});

export const updateAccountSuccess = data => ({
	type: constants.UPDATE_ACCOUNT_SUCCESS,
	payload: {
		data,
	},
});

export const updateAccountFailed = error => ({
	type: constants.UPDATE_ACCOUNT_FAILED,
	payload: {
		error,
	},
});
