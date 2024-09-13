import axios from "axios";

const config = {
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token")
			? localStorage.getItem("token")
			: null,
	},
};

export const createCompanyProfile = async ({
	name,
	email,
	telephone,
	isDistributor,
}) => {
	try {
		const { data } = await axios.post(
			"http://localhost:3001/api/companyprofiles/createcompanyprofile",
			{
				name,
				email,
				telephone,
				isDistributor,
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

export const getCompanyProfiles = async () => {
	try {
		const CompanyProfiles = await axios.get(
			"http://localhost:3001/api/companyprofiles/getcompanyprofiles",
			{
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": JSON.parse(localStorage.getItem("token")),
				},
			}
		);
		return CompanyProfiles.data;
	} catch (error) {
		console.log(error);
		return;
	}
};

export const getCompanyProfile = async () => {
	try {
		console.log(JSON.parse(localStorage.getItem("currentUser")));
		const CompanyProfile = await axios.get(
			"http://localhost:3001/api/companyprofiles/getcompanyprofile",
			{
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": JSON.parse(localStorage.getItem("token")),
				},
			}
		);
		return CompanyProfile.data;
	} catch (error) {
		console.log(error);
		return;
	}
};
export const getDistributors = async () => {
	try {
		console.log(JSON.parse(localStorage.getItem("currentUser")));
		const { data } = await axios.get(
			"http://localhost:3001/api/companyprofiles/getdistributors",
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
export const acceptDistributors = async ({
	email,
	name,
	group_name,
	erp_code,
	contact_name,
}) => {
	try {
		console.log(name);
		const { data } = await axios.put(
			"http://localhost:3001/api/companyprofiles/acceptdistributor",
			{ email, name, group_name, erp_code, contact_name },
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

export const removeCompany = async ({ email }) => {
	try {
		console.log("i came here ooo");
		const { data } = await axios.put(
			"http://localhost:3001/api/companyprofiles/deletecompanyprofile",
			{ email },
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
