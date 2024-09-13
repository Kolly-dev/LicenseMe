import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { SET_CURRENT_USER, SET_ERROR_MESSAGE } from "../actions/authActions";
import { useStateValue } from "../store";

const config = {
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("currentUser"),
	},
};

export const register = async ({
	firstName,
	lastName,
	email,
	password,
	confirmPassword,
}) => {
	console.log("111action");
	try {
		const { data } = await axios.post(
			"http://localhost:3001/api/users/register",
			{
				firstName,
				lastName,
				email,
				password,
				confirmPassword,
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

export const useLogin = () => {
	const { Dispatch } = useStateValue();
	const login = async ({ email, password }) => {
		console.log("111action");
		try {
			const { data } = await axios.post(
				"http://localhost:3001/api/users/login",
				{
					email,
					password,
				}
			);

			return data;
		} catch (error) {
			// console.log(error);
			let errorMgs = [];
			if (error.response.data.length > 0) {
				for (const errorMsg of error.response.data) {
					errorMgs.push(errorMsg.message);
				}
				Dispatch({
					type: SET_ERROR_MESSAGE,
					payload: errorMgs,
				});
			}
			if (error.response.data.errors.length > 0) {
				let errorMgs = [];
				for (const errorMsg of error.response.data.errors) {
					errorMgs.push(errorMsg.msg);
				}
				Dispatch({
					type: SET_ERROR_MESSAGE,
					payload: errorMgs,
				});
			}
			return;
		}
	};
	return {
		loginFn: login,
	};
};

export const forgotPassword = async ({ email }) => {
	console.log("111action");
	try {
		const { data } = await axios.post(
			"http://localhost:3001/api/users/forgotpassword",
			{
				email,
			},
			config
		);

		return data;
	} catch (error) {
		console.log(error);
		return;
	}
};

export const resetPassword = async ({
	password,
	confirmPassword,
	id,
	token,
}) => {
	try {
		const { data } = await axios.post(
			"http://localhost:3001/api/users/resetpassword",
			{
				password,
				confirmPassword,
				id,
				token,
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

export const useGetUser = () => {
	const { Dispatch } = useStateValue();

	const getUser = async () => {
		console.log("heloo");
		try {
			const { data } = await axios.get(
				"http://localhost:3001/api/users/getuser",
				{
					headers: {
						"Content-Type": "application/json",
						"x-auth-token": JSON.parse(localStorage.getItem("token")),
					},
				}
			);

			Dispatch({
				type: SET_CURRENT_USER,
				payload: data,
			});

			return data;
		} catch (error) {
			if (error.response.data.length > 0) {
				for (const errorMsg of error.response.data) {
					console.log(errorMsg.message);
				}
			}
			console.log(error.response.data);
			return;
		}
	};
	const { data } = useQuery(["user"], getUser);

	return {
		user: data ?? [],
	};
};

// export const useGetUser = (type) => {
// 	const { Dispatch } = useStateValue();
// 	const useGettingData = (fun) =>{
// 		if (fun){
// 		useQuery(["user"], fun)
// 	}

// 	switch (type) {
// 		case "GET_USER": {
// 			const getUser = async () => {
// 				console.log("heloo");
// 				try {
// 					const { data } = await axios.get(
// 						"http://localhost:3001/api/users/getuser",
// 						{
// 							headers: {
// 								"Content-Type": "application/json",
// 								"x-auth-token": JSON.parse(localStorage.getItem("token")),
// 							},
// 						}
// 					);

// 					Dispatch({
// 						type: SET_CURRENT_USER,
// 						payload: data,
// 					});

// 					return data;
// 				} catch (error) {
// 					if (error.response.data.length > 0) {
// 						for (const errorMsg of error.response.data) {
// 							console.log(errorMsg.message);
// 						}
// 					}
// 					console.log(error.response.data);
// 					return;
// 				}

// 			};
// 			// const { data } = useQuery(["user"], getUser);
// 		}

// 		// return {
// 		// 	user: data ?? [],
// 		// };
// 	}
// 	// const getser = useQuery(["user"], getUser);

// 	// const { data } = useQuery(["user"], getUser);
// };
