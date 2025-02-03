/** @format */

const axios = require("axios");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Add a new species
const addSpecies = async (body) => {
	try {
		const { name, quantity, height, trunkSize, image } = body;

		// If there are selected images, convert them to a comma-separated string
		// let image = "";
		// if (selectedImages && selectedImages.length > 0) {
		// 	image = selectedImages.map((file) => file.name).join(","); // Get file names and join them
		// } else {
		// 	// If no images are selected, set it to an empty string or handle accordingly
		// 	image = "";
		// }

		// Prepare the data to send to the backend
		const newSpecies = {
			name,
			quantity,
			height,
			trunkSize,
			image, // A string of image file names
			lastUpdated: new Date(), // Set the current date for lastUpdated
		};

		// Make the API request
		const response = await axios.post(`${API_URL}/create-species`, newSpecies);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || "Internal Server Error.";
		throw new Error(errorMessage);
	}
};

// Get all species
const getAllSpecies = async () => {
	try {
		const response = await axios.get(`${API_URL}/species`);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || "Failed to fetch species.";
		throw new Error(errorMessage);
	}
};

const getAllVideo = async () => {
	try {
		const response = await axios.get(`${API_URL}/videos`);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || "Failed to fetch species.";
		throw new Error(errorMessage);
	}
};

// Get species by ID
const getSpeciesById = async (id) => {
	try {
		const response = await axios.get(`${API_URL}/species/${id}`);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || "Species not found.";
		throw new Error(errorMessage);
	}
};

const uploadVideo = async (body) => {
	try {
		console.log(body);
		const uploadVideo = {
			videoBase64: body, // Set the current date for lastUpdated
		};
		const response = await axios.post(`${API_URL}/upload-video`, uploadVideo);
		return response.data; // Return the response data after upload
	} catch (error) {
		throw new Error(error.message); // Handle any errors that occur during the upload
	}
};

const uploadImg = async (body) => {
	try {
		const response = await await axios.post(`${API_URL}/speciesImg`, body);
	} catch (error) {
		throw new Error(error.message);
	}
};

const updateSpecies = async (id, body) => {
	try {
		const { name, quantity, height, trunkSize } = body;

		const updatedSpecies = {
			name,
			quantity,
			height,
			trunkSize,
			lastUpdated: new Date(),
		};

		const response = await axios.put(`${API_URL}/species/${id}`, updatedSpecies);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || "Failed to update species.";
		throw new Error(errorMessage);
	}
};

// Delete species
const deleteSpecies = async (id) => {
	try {
		const response = await axios.delete(`${API_URL}/species/${id}`);
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message || "Failed to delete species.";
		throw new Error(errorMessage);
	}
};

module.exports = {
	addSpecies,
	getAllSpecies,
	getSpeciesById,
	updateSpecies,
	deleteSpecies,
	uploadImg,
	getAllVideo,
	uploadVideo,
};
