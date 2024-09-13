import axios from "axios";

const config = {
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token"),
	},
};

export const createLicense = async ({ email }) => {
	try {
		const { data } = await axios.post(
			"http://localhost:3001/api/licenses/createlicense",
			{
				email,
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
export const getLicenses = async () => {
	try {
		const productsRequest = await axios.get(
			"http://localhost:3001/api/licenses/getlicenses",
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

export const getLicense = async () => {
	try {
		const productsRequest = await axios.get(
			"http://localhost:3001/api/licenses/getlicenses",
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

export const acceptLicense = async ({
	companyEmail,
	rateId,
	ref_number,
	parentCompanyEmail,
}) => {
	try {
		const { data } = await axios.put(
			"http://localhost:3001/api/licenses/acceptlicense",
			{ companyEmail, rateId, ref_number, parentCompanyEmail },
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

export const rejectLicense = async ({ companyEmail }) => {
	try {
		const { data } = await axios.put(
			"http://localhost:3001/api/licenses/rejectlicense",
			{ companyEmail },
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
