import { Box, Button, Typography, TextField, Skeleton } from "@mui/material";
import React from "react";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";

import { createLicense } from "../../apis/licenses";
import { LICENSE_SUCCESS } from "../../actions/authActions";
import { useStateValue } from "../../store";
// import { useGetUser } from "../../apis/auth";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";

import MaterialReactTable from "material-react-table";

const MyLicense = () => {
	const [emailInput, setEmailInput] = useState("");
	const { authstate, Dispatch } = useStateValue();
	// const { user } = useGetUser();

	console.log(authstate.currentUser);

	const onChange = (e) => {
		setEmailInput(e.target.value);
	};

	const queryClient = useQueryClient();
	const { data, mutateAsync, isError, error } = useMutation(createLicense, {
		onSuccess: (data) => {
			console.log(typeof data);
			console.log(isError);
			console.log(error);
			if (typeof data === "object") {
				Dispatch({
					type: LICENSE_SUCCESS,
					payload: data.userDetails,
				});
			}
		},
	});
	if (isError) {
		console.log(error);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		await mutateAsync({
			email: emailInput,
		});

		setEmailInput("");
	};
	return (
		<Box>
			<Topbar />
			<Box sx={{ display: "flex" }}>
				<Sidenav />
				<Box
					sx={{
						width: "100%",
						height: "100%",
						minHeight: "100vh",
						borderLeft: "1px solid #D5D5D5",
						marginLeft: authstate.collapse ? "90px" : "250px",
					}}>
					<Header
						headerTitle={"LICENSE DETAILS PAGE"}
						headerSubtitle={
							"This page is for users to request for their license and find details of their license"
						}
					/>

					{!authstate?.loading ? (
						<Box>
							{!authstate?.currentUser?.licenseDetails?.status?.isRequested &&
								!authstate?.currentUser?.licenseDetails?.status?.isActive && (
									<Box
										sx={{
											width: "50%",
											padding: "20px",
										}}>
										<Box display='flex' justifyContent='space-around'>
											<TextField
												sx={{
													borderRadius: 5,
												}}
												placeholder='Enter the email'
												label='Email'
												value={emailInput}
												name='emailInput'
												onChange={onChange}
											/>
										</Box>

										<Box
											display='flex'
											justifyContent='flex-end'
											sx={{
												p: 2,
											}}>
											<Button onClick={handleSubmit}>Submit</Button>
										</Box>
									</Box>
								)}

							{authstate?.currentUser?.licenseDetails?.status?.isRequested && (
								<Box
									sx={{
										width: "50%",
										padding: "20px",
									}}>
									<Typography>
										You have requested your license and it is under review at
										the moment. Please be patient!{" "}
									</Typography>
								</Box>
							)}
							{authstate?.currentUser?.licenseDetails?.status?.isActive && (
								<Box
									sx={{
										width: "50%",
										padding: "20px",
									}}>
									<Typography>
										{`Your license is linked ${
											authstate?.currentUser?.licenseDetails
												.parentCompanyUserNames
										}. Your license costed £${
											authstate?.currentUser?.licenseDetails?.price
										}  and it will expire on ${authstate?.currentUser?.licenseDetails.expiry_Date
											.toString()
											.substring(0, 10)}.`}
									</Typography>
								</Box>
							)}
						</Box>
					) : (
						<Box>
							<Skeleton
								sx={{
									margin: "20px",
								}}
								variant='rounded'
								width={450}
								height={20}
							/>
							<Skeleton
								sx={{
									margin: "20px 0px 0px 20px",
								}}
								variant='rounded'
								width={100}
								height={20}
							/>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default MyLicense;
