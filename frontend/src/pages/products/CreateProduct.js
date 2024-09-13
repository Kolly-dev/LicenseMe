import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";

function CreateProduct() {
	return (
		<Box display='flex'>
			<Box sx={{ flex: "0.1" }}>
				<Sidenav />
			</Box>
			<Box sx={{ flex: "0.9" }}>
				<Topbar />
				<Header />
				<Box>
					<Box display='flex' justifyContent='flex-end'>
						<Button> Add Products</Button>
					</Box>
				</Box>
				<Box>
					Create Product
				</Box>
			</Box>
		</Box>
	);
}

export default CreateProduct;
