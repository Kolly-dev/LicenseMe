import axios from "axios";

const config = {
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token"),
	},
};

export const createDiscount = async ({
	productName,
	companyName,
	amount,
	rate,
	productId,
	companyProfileId,
}) => {
	try {
		const { data } = await axios.post(
			"http://localhost:3001/api/discounts/creatediscount",
			{
				productName,
				companyName,
				amount,
				productId,
				rate,
				companyProfileId,
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
		console.log(error);
		return;
	}
};

export const getDiscounts = async () => {
	try {
		const { data } = await axios.get(
			"http://localhost:3001/api/discounts/getdiscounts",
			{
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": JSON.parse(localStorage.getItem("token")),
				},
			}
		);
		return data;
	} catch (error) {
		console.log(error);
		return;
	}
};
