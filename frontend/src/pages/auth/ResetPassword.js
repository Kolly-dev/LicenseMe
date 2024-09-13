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
	Paper,
	InputAdornment,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate, Link, useParams } from "react-router-dom";

import { resetPassword } from "../../apis/auth";

import { useMutation } from "@tanstack/react-query";

const ResetPassword = () => {
	const [resetPasswordData, setResetPasswordData] = useState({
		password: "",
		confirmPassword: "",
	});
	const { password, confirmPassword } = resetPasswordData;
	const { _id, token } = useParams();
	console.log(useParams());
	const onChange = (e) =>
		setResetPasswordData({
			...resetPasswordData,
			[e.target.name]: e.target.value,
		});
	const [showPassword, setShowPassword] = useState({
		password: true,
		confirmPassword: true,
	});

	const navigate = useNavigate();

	const { mutateAsync, isError } = useMutation(resetPassword, {
		onSuccess: (data) => {
			if (data) {
				navigate("/login");
			}
		},
		// onError: (error) => {},
	});

	if (isError) {
		console.log("I am getting error");
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		await mutateAsync({
			password: password,
			confirmPassword: confirmPassword,
			id: _id,
			token: token,
		});

		setResetPasswordData({
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
					<Typography variant='h5'>Reset Your Password</Typography>

					<Grid container spacing={1} sx={{ mt: 1 }}>
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
							fontSize: 20,
						}}
						onClick={handleSubmit}>
						Submit
					</Button>
					<Typography
						sx={{
							"&:hover": {
								textDecoration: "underline #BF40BF",
							},
						}}>
						<Link
							style={{
								textDecoration: "none",
								color: "#BF40BF",
							}}
							to='/login'>
							Return to Login
						</Link>
					</Typography>
				</Box>
			</Paper>
		</Container>
	);
};

export default ResetPassword;
