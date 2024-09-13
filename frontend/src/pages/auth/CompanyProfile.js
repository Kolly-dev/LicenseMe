import React from "react";
import { useState, useEffect } from "react";
import {
	Grid,
	TextField,
	Button,
	Typography,
	CssBaseline,
	Container,
	Box,
	Paper,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { createCompanyProfile } from "../../apis/companyProfiles";
import { useStateValue } from "../../store";
import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	COMPANY_SUCCESS,
} from "../../actions/authActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CompanyProfile = () => {
	const [company, setCompany] = useState({
		email: "",
		name: "",
		telephone: "",
	});
	const { email, name, telephone } = company;

	const [isDistributor, setIsDistributor] = useState(false);
	const handleIsDistributor = (e) => {
		setIsDistributor(e.target.checked);
	};
	console.log(isDistributor);

	const queryClient = useQueryClient();

	const onChange = (e) =>
		setCompany({ ...company, [e.target.name]: e.target.value });
	const navigate = useNavigate();

	const { mutateAsync, isError } = useMutation(createCompanyProfile, {
		onSuccess: (data) => {
			console.log(data);

			queryClient.invalidateQueries(["CompanyProfile"]);

			if (!data.userDetails.user.isCompanyLinked) {
				navigate("/companyprofile");
			}
			// navigation for distributors
			else if (
				data.userDetails?.user?.isCompanyLinked &&
				data.userDetails?.companyProfileDetails.isDistributor
			) {
				navigate("/dashboard");
				
			}
			//navigation for non-distributor
			else if (
				data?.userDetails?.user?.isCompanyLinked &&
				!data?.userDetails?.companyProfileDetails?.isDistributor
			) {
				navigate(`/mylicense/${data?.userDetails?.companyProfileDetails._id}`);
			}

			// login error
			else {
				navigate("/companyprofile");
			}
		},
		// onError: (error) => {
		// 	dispatch({
		// 		type: LOGIN_FAIL,
		// 		payload: error.response.data,
		// 	});
		// },
	});

	if (isError) {
		console.log("I am getting error");
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		await mutateAsync({
			email: email,
			name: name,
			telephone: telephone,
			isDistributor: isDistributor,
		});
		console.log(company);
		setCompany({
			email: "",
			name: "",
			telephone: "",
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
						mt: 5,
						display: "flex",
						mb: 5,
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Typography variant='h5'>Create Company Profile</Typography>

					<Grid container spacing={1} sx={{ mt: 1 }}>
						<Grid item xs={12}>
							<TextField
								placeholder='Enter Your Company Name'
								label='company name'
								name='name'
								value={name}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={<Checkbox />}
								label='I am a Distributor'
								onChange={handleIsDistributor}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								placeholder='Enter Your company email'
								label='email'
								name='email'
								value={email}
								onChange={onChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								placeholder='Enter Your company telephone'
								label='company telephone'
								name='telephone'
								value={telephone}
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
							fontSize: 15,
						}}
						onClick={handleSubmit}>
						Submit
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default CompanyProfile;
