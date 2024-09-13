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
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { register } from "../../apis/auth";
import { useStateValue } from "../../store";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "../../actions/authActions";
import { useMutation } from "@tanstack/react-query";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Register = () => {
	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const { firstName, lastName, email, password, confirmPassword } = user;
	const { Dispatch } = useStateValue();

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const [showPassword, setShowPassword] = useState({
		password: true,
		confirmPassword: true,
	});

	const { mutateAsync, isError } = useMutation(register, {
		onSuccess: (data) => {
			console.log(data);
			// Dispatch({
			// 	type: REGISTER_SUCCESS,
			// 	payload: data,
			// });
		},

		// onError: (error) => {
		// 	dispatch({
		// 		type: REGISTER_FAIL,
		// 		payload: error.response.data,
		// 	});
		// },
	});

	// if (isError) {
	// 	console.log("I am getting error");
	// }

	const handleSubmit = async (e) => {
		e.preventDefault();
		await mutateAsync({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
			confirmPassword: confirmPassword,
		});
		console.log(user);
		setUser({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
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
			<CssBaseline />
			<Paper
				elevation={5}
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

					<Typography variant='h5'>Register</Typography>

					<Grid container spacing={1} sx={{ mt: 1 }}>
						<Grid item xs={12} sm={6}>
							<TextField
								placeholder='Enter Your First Name'
								label='First Name'
								name='firstName'
								value={firstName}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								placeholder='Enter Your Last Name'
								name='lastName'
								label='Last Name'
								value={lastName}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								placeholder='Enter Your email'
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
						<Grid item xs={12}>
							<TextField
								placeholder='Enter to confirm Password'
								label='confirm password'
								name='confirmPassword'
								type={showPassword.confirmPassword ? "password" : "text"}
								value={confirmPassword}
								onChange={onChange}
								InputProps={{
									endAdornment: (
										<InputAdornment
											position='end'
											onClick={() =>
												setShowPassword({
													...showPassword,
													confirmPassword: !showPassword.confirmPassword,
												})
											}>
											{!showPassword.confirmPassword ? (
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
						Register
					</Button>
					<Typography>
						If you already have an account, please{" "}
						<Link to='/login'>login</Link>
					</Typography>
				</Box>
			</Paper>
		</Container>
	);
};

export default Register;
