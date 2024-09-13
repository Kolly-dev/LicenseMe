import axios from "axios";

const config = {
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": JSON.parse(localStorage.getItem("token")),
	},
};

export const createCommission = async ({
	productName,
	companyName,
	amount,
	productId,
	companyProfileId,
}) => {
	try {
		const { data } = await axios.post(
			"http://localhost:3001/api/commissions/createcommission",
			{
				productName,
				companyName,
				amount,
				productId,
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

export const getCommissions = async () => {
	try {
		const commissionsRequest = await axios.get(
			"http://localhost:3001/api/commissions/getcommissions",
			{
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": JSON.parse(localStorage.getItem("token")),
				},
			}
		);
		return commissionsRequest.data;
	} catch (error) {
		console.log(error);
		return;
	}
};
