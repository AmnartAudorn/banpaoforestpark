/** @format */

const axios = require("axios");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const login = async (body) => {
	try {
		const response = await axios.post(`${API_URL}/login`, body);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || "Internal Server Error.";
		throw new Error(errorMessage);
	}
};

module.exports = {
	login,
};
