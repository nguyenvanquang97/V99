import moment from "moment";

export function formatVND(number) {
	return Number.parseFloat(Math.round(number)).toLocaleString(undefined) + 'đ'
}
export function formatNumber(number) {
	return Number.parseFloat(Math.round(number)).toLocaleString(undefined)
}

export const formatDateTime = x =>
	moment(x)
		.format('DD/MM/YYYY - HH:mm:ss');

export const formatDate = x =>
	moment(x)
		.format('DD/MM/YYYY');

export const formatDateUS = x =>
	moment(x).format("YYYY-MM-DD").toString()

export function checkRole(role, permissions) {
	return !!permissions.includes(role);
}
