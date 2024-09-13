import React from "react";
import { useState } from "react";
import {
	Grid,
	TextField,
	Button,
	Typography,
	CssBaseline,
	Container,
	Box,
	Avatar,
	InputAdornment,
	Paper,
	Alert,
	Snackbar,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useLogin } from "../../apis/auth";
import { getCompanyProfile } from "../../apis/companyProfiles";
import { useStateValue } from "../../store";
import { CLEAR_ERRORS } from "../../actions/authActions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Login = () => {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});

	const [company, setCompany] = useState({});
	const { email, password } = user;
	const { authstate, Dispatch } = useStateValue();
	const { loginFn } = useLogin();

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const [showPassword, setShowPassword] = useState({
		password: true,
	});
	const [open, setOpen] = useState(true);
	const onClose = () => {
		setOpen(false);
		Dispatch({
			type: CLEAR_ERRORS,
			payload: false,
		});
	};

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const CompanyProfile = useQuery({
		queryKey: ["CompanyProfile"],
		queryFn: getCompanyProfile,
	}).data;

	console.log(CompanyProfile);

	const { mutateAsync, isError, error } = useMutation(loginFn, {
		onSuccess: (data) => {
			localStorage.setItem("token", JSON.stringify(data.mytoken));
			// // localStorage.setItem("currentUser", JSON.stringify(data.userDetails));
			// Dispatch({
			// 	type: LOGIN_SUCCESS,
			// 	payload: data,
			// });

			console.log(data);

			// const CompanyProfile = queryClient.fetchQuery({
			// 	queryKey: ["CompanyProfile"],
			// 	queryFn: getCompanyProfile,
			// 	staleTime: Infinity,
			// });

			// test();

			// async function test() {
			// 	try {
			// 		const value = await CompanyProfile;
			// 		setCompany(value)
			// 		console.log(value);
			// 	} catch (err) {
			// 		console.log(err);
			// 	}
			// }

			// setTimeout(() => {
			// 	console.log(value);
			// }, "5000");

			// const companyprofile = data.userDetails.companyProfile;
			if (
				!data.userDetails.user.isCompanyLinked &&
				data.userDetails.user.isVerified
			) {
				navigate("/companyprofile");
			} else if (
				data?.userDetails?.user?.isCompanyLinked &&
				!data?.userDetails?.companyProfileDetails &&
				data.userDetails.user.isVerified
			) {
				navigate("/companyprofile");
			}
			// login for app admin
			else if (
				data.userDetails.user?.isAppAdmin &&
				data.userDetails.user.isVerified
			) {
				navigate("/admin-dashboard");
				// navigate(`/mylicense/${companyprofile}`);
			}

			// login for distributors
			else if (
				data.userDetails?.user?.isCompanyLinked &&
				data.userDetails?.companyProfileDetails.isDistributor &&
				data.userDetails.user.isVerified
			) {
				navigate("/dashboard");
				// navigate(`/mylicense/${companyprofile}`);
			}
			//login for non-distributor
			else if (
				data?.userDetails?.user?.isCompanyLinked &&
				data.userDetails.user.isVerified &&
				!data?.userDetails?.companyProfileDetails?.isDistributor
			) {
				navigate(`/mylicense/${data?.userDetails?.companyProfileDetails._id}`);
			}
			// login for linked account but

			// login error
			else {
				navigate("/login");
			}
		},

		// onError: (error) => {
		// 	dispatch({
		// 		type: LOGIN_FAIL,
		// 		payload: error.response.data,
		// 	});
		// },
	});
	console.log(error);
	if (isError) {
		console.log("I am getting error");
	}
	console.log(authstate.errors.errorMsg);
	const handleSubmit = async (e) => {
		e.preventDefault();
		await mutateAsync({
			email: email,
			password: password,
		});
		console.log(user);
		setUser({
			email: "",
			password: "",
		});
	};

	return (
		<Container
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}>
			<Snackbar
				open={authstate.errors.isOpen}
				autoHideDuration={2000}
				onClose={onClose}
				anchorOrigin={{ vertical: "top", horizontal: "left" }}>
				<Box>
					{authstate.errors.errorMsg.map((item) => {
						return <Alert severity='error'>{item}</Alert>;
					})}
				</Box>
			</Snackbar>

			<CssBaseline />
			<Paper
				elevation={10}
				sx={{
					width: 600,
				}}>
				<Box
					sx={{
						display: "flex",
						mb: 5,
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Avatar sx={{ backgroundColor: "secondary.main", margin: 2 }}>
						<LockOutlinedIcon />
					</Avatar>

					<Typography variant='h5'>Login</Typography>

					<Grid container spacing={1} sx={{ mt: 1 }}>
						<Grid item xs={12}>
							<TextField
								placeholder='Enter Your Email'
								label='email'
								name='email'
								value={email}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								placeholder='Enter Your Password'
								label='password'
								name='password'
								type={showPassword.password ? "password" : "text"}
								value={password}
								onChange={onChange}
								InputProps={{
									endAdornment: (
										<InputAdornment
											position='end'
											onClick={() =>
												setShowPassword({
													...showPassword,
													password: !showPassword.password,
												})
											}>
											{!showPassword.password ? (
												<VisibilityOutlinedIcon />
											) : (
												<VisibilityOffOutlinedIcon />
											)}
										</InputAdornment>
									),
								}}
							/>
						</Grid>
					</Grid>
					<Button
						fullWidth
						sx={{
							mt: 3,
							mb: 2,
							padding: 1,
							fontSize: 15,
						}}
						onClick={handleSubmit}>
						Login
					</Button>
					<Typography
						sx={{
							textDecoration: "none",
							"&:hover": {
								textDecoration: "underline #BF40BF",
							},
						}}>
						<Link
							style={{
								textDecoration: "none",
								color: "#BF40BF",
							}}
							to='/forgotpassword'>
							Forgotten password?
						</Link>
					</Typography>
					<Typography>
						If you don't have an account, please{" "}
						<Link to='/register'>register</Link>
					</Typography>
				</Box>
			</Paper>
		</Container>
	);
};

export default Login;
