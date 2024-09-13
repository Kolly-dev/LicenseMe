import axios from "axios";

const config = {
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": JSON.parse(localStorage.getItem("token")),
	},
};

export const createProduct = async ({
	productId,
	productName,
	duration,
	price,
	renewalPeriod,
}) => {
	try {
		const { data } = await axios.post(
			"http://localhost:3001/api/products/createproduct",
			{
				price,
				productName,
				duration,
				productId,
				renewalPeriod,
			},
			{
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": JSON.parse(localStorage.getItem("token")),
				},
			}
		);
		return data;
	} catch (error) {
		return error.message;
	}
};
export const getProducts = async () => {
	try {
		const productsRequest = await axios.get(
			"http://localhost:3001/api/products/getproducts",

			{
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": JSON.parse(localStorage.getItem("token")),
				},
			}
		);
		return productsRequest.data;
	} catch (error) {
		console.log(error);
		return;
	}
};
