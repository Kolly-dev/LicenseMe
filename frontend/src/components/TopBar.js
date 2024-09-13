import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCompanyProfile } from "../apis/companyProfiles";

const Topbar = () => {
	return (
		<Box
			sx={{
				display: "flex",
				height: "60px",
				justifyContent: "space-between",
				alignItems: "center",
				background: "#FFFFFF",
				borderBottom: "1px solid #D5D5D5",
				position: "sticky",
				top: "0px",
			}}>
			<Box
				sx={{
					color: "#5c2d86",
					marginLeft: "41px",
				}}>
				<Typography
					variant='h5'
					sx={{ fontWeight: "bold", letterSpacing: 5, fontStyle: "italic" }}>
					LICENSEME!
				</Typography>
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					padding: "0px 10px",
					marginRight: "41px",
				}}>
				<NotificationsNoneIcon
					sx={{
						marginRight: "10px",
					}}
				/>
			</Box>
		</Box>
	);
};

export default Topbar;
