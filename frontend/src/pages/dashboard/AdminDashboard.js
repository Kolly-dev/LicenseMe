import { Box, z } from "@mui/material";
import React from "react";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";
import { useStateValue } from "../../store";

const AdminDashboard = () => {
	const { authstate } = useStateValue();
	const handleCompanyProfileData = (CompanyProfileData) => {
		console.log(CompanyProfileData);
		return CompanyProfileData;
	};

	return (
		<Box>
			<Topbar handleCompanyProfileData={handleCompanyProfileData} />

			<Box sx={{ display: "flex" }}>
				<Sidenav />
				<Box
					sx={{
						width: authstate.collapse ? "94%" : "82%",
						height: "100%",
						minHeight: "100vh",
						borderLeft: "1px solid #D5D5D5",
						marginLeft: authstate.collapse ? "90px" : "250px",
					}}>
					<Header
						headerTitle={"DASHBOARD"}
						headerSubtitle={"This dashboard page shows quick stats"}
					/>
					<Box
						sx={{
							width: "50%",
							padding: "20px",
						}}></Box>
				</Box>
			</Box>
		</Box>
	);
};

export default AdminDashboard;
