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
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import { forgotPassword } from "../../apis/auth";

import { useMutation } from "@tanstack/react-query";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");

	const onChange = (e) => setEmail(e.target.value);

	const navigate = useNavigate();

	const { mutateAsync, isError } = useMutation(forgotPassword, {
		onSuccess: (data) => {
			if (data) {
				navigate("/login");
			}
		},
		onError: (error) => {},
	});

	if (isError) {
		console.log("I am getting error");
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		await mutateAsync({
			email: email,
		});

		setEmail("");
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
					<Typography variant='h5'>Forgotten Password</Typography>

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

export default ForgotPassword;
