import axios from 'axios'

export const request = axios.create()

request.interceptors.response.use(
	res => {
		return res.data
	},
	err => {
		let response = {
			message: err.message,
			status: err.status,
		}
		if (err.response?.data) {
			response = err.response.data
		}
		return Promise.reject(response)
	}
)
