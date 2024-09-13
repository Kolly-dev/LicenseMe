import React from "react";
import { Box, Typography } from "@mui/material";

function Header({ headerTitle, headerSubtitle }) {
	return (
		<Box
			sx={{
				backgroundColor:'#FFFFFF',
				height:'96px',
				borderBottom: "1px solid #D5D5D5",
				padding: "20px"
			}}>
			<Typography variant='h4'>{headerTitle}</Typography>
			<Typography variant='h6'>{headerSubtitle}</Typography>
		</Box>
	);
}

export default Header;
