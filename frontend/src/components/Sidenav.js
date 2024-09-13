import React, { useState, useEffect } from "react";

import {
	Sidebar,
	Menu,
	MenuItem,
	useProSidebar,
	SubMenu,
} from "react-pro-sidebar";
import { Box, Typography, Skeleton } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { Link } from "react-router-dom";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";

import StoreMallDirectoryOutlinedIcon from "@mui/icons-material/StoreMallDirectoryOutlined";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
// import { useStateValue } from "../store";
import { SIDEBAR_COLLAPSE } from "../actions/authActions";
import { useGetUser } from "../apis/auth";

import { useStateValue } from "../store";

const Sidenav = () => {
	const { collapseSidebar, collapsed } = useProSidebar();
	const { authstate, Dispatch } = useStateValue();

	//const { user } = useGetUser();
	// const [collapsed, setCollapsed] = useState(false);

	// const [{ currentUser }] = useStateValue();
	// const [Data, setData] = useState([currentUser]);

	// useEffect(() => {
	// 	console.log(currentUser);
	// 	if (currentUser) {
	// 		setData(currentUser);
	// 	}
	// }, [currentUser]);

	console.log(collapsed);

	return (
		<Box
			sx={{
				// border: "1px solid red",
				position: "fixed",
				minHeight: "90vh",
				height: "90vh",
			}}>
			<Sidebar backgroundColor='#FFFFFF' rootStyles={{}}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						paddingTop: "20px",
					}}>
					{!collapsed ? (
						<Box
							sx={{
								paddingLeft: "50px",
							}}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									color: "#BF40BF",
								}}>
								<Typography>Welcome</Typography>
							</Box>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									color: "#000000",
									paddingTop: "10px",
								}}>
								{authstate.currentUser?.user?.firstName ? (
									<Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
										{authstate.currentUser?.user?.firstName} {}
										{authstate.currentUser?.user?.lastName}
									</Typography>
								) : (
									<Skeleton variant='rounded' width={150} height={40} />
								)}
							</Box>
						</Box>
					) : (
						<Box></Box>
					)}
					{collapsed ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-end",
							}}>
							<ArrowForwardIosIcon
								onClick={() => {
									collapseSidebar();
									console.log(collapsed);
									Dispatch({
										type: SIDEBAR_COLLAPSE,
										payload: collapsed,
									});
								}}
								sx={{
									color: "#5c2d86",
									backgroundColor: "#FFFFFF",
									borderRadius: "0%",
								}}
							/>
						</Box>
					) : (
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-end",
							}}>
							<ArrowBackIosIcon
								onClick={() => {
									collapseSidebar();
									console.log(collapsed);
									Dispatch({
										type: SIDEBAR_COLLAPSE,
										payload: collapsed,
									});
								}}
								sx={{
									color: "#5c2d86",
									backgroundColor: "#FFFFFF",
								}}
							/>
						</Box>
					)}
				</Box>
				<Box sx={{ marginTop: "30px" }}>
					<Menu
						style={{
							color: "#BF40BF",
						}}>
						{authstate?.currentUser?.user?.isAppAdmin && (
							<MenuItem
								onClick={() => {
									console.log("hello");
								}}
								component={<Link to='/admin-dashboard' />}
								icon={
									<DashboardOutlinedIcon
										sx={{
											color: "#5c2d86",
											backgroundColor: "#FFFFF",
											borderRadius: "0%",
										}}
									/>
								}>
								Dashboard
							</MenuItem>
						)}

						{authstate?.currentUser?.companyProfileDetails?.isDistributor && (
							<MenuItem
								component={<Link to='/dashboard' />}
								icon={
									<DashboardOutlinedIcon
										sx={{
											color: "#5c2d86",
											backgroundColor: "#FFFFF",
											borderRadius: "0%",
										}}
									/>
								}>
								Dashboard
							</MenuItem>
						)}
						{!authstate?.currentUser?.companyProfileDetails?.isDistributor &&
							!authstate?.currentUser?.user?.isAppAdmin && (
								<MenuItem
									component={
										<Link
											to={`/mylicense/${authstate.currentUser?.user?.companyProfile}`}
										/>
									}
									icon={
										<DashboardOutlinedIcon
											sx={{
												color: "#5c2d86",
												backgroundColor: "#FFFFF",
												borderRadius: "0%",
											}}
										/>
									}>
									MyLicense
								</MenuItem>
							)}
						{!collapsed &&
							(authstate?.currentUser?.user?.isAppAdmin ||
								authstate?.currentUser?.companyProfileDetails
									?.isDistributor) && (
								<Typography
									sx={{
										padding: "0px 10px ",
										color: "#5c2d86",
										marginTop: "30px ",
										marginBottom: "10px",
									}}>
									View Licenses
								</Typography>
							)}
						{(authstate?.currentUser?.user?.isAppAdmin ||
							authstate?.currentUser?.companyProfileDetails?.isDistributor ||
							authstate?.currentUser?.licenseDetails?.productName ===
								"Technician") && (
							<SubMenu
								icon={
									<Inventory2OutlinedIcon
										sx={{
											color: "#5c2d86",
											backgroundColor: "#FFFFFF",
											borderRadius: "0%",
										}}
									/>
								}
								label='Licenses'>
								{!(
									authstate?.currentUser?.user?.isAppAdmin ||
									authstate?.currentUser?.licenseDetails?.productName ===
										"Technician"
								) && (
									<MenuItem component={<Link to='/licenses/pending' />}>
										{" "}
										Pending
									</MenuItem>
								)}
								<MenuItem component={<Link to='/licenses/active' />}>
									{" "}
									Active
								</MenuItem>
								<MenuItem component={<Link to='/licenses/expired' />}>
									Expired
								</MenuItem>
							</SubMenu>
						)}
						{!collapsed && authstate?.currentUser?.user?.isAppAdmin && (
							<Typography
								sx={{
									padding: "0px 10px ",
									color: "#5c2d86",
									marginTop: "30px ",
									marginBottom: "10px",
								}}>
								Admin
							</Typography>
						)}

						{authstate?.currentUser?.user?.isAppAdmin && (
							<Box>
								<SubMenu
									icon={
										<StoreMallDirectoryOutlinedIcon
											sx={{
												color: "#5c2d86",
												backgroundColor: "#FFFFFF",
												borderRadius: "0%",
											}}
										/>
									}
									label='Companies'>
									<MenuItem
										component={
											<Link to='/companyprofile/managedistributors' />
										}>
										{" "}
										Pending Distributor
									</MenuItem>
									<MenuItem> All Companies</MenuItem>
								</SubMenu>

								<MenuItem
									component={<Link to='/products' />}
									icon={
										<ProductionQuantityLimitsOutlinedIcon
											sx={{
												color: "#5c2d86",
												backgroundColor: "#FFFFF",
												borderRadius: "0%",
											}}
										/>
									}>
									Products
								</MenuItem>
								<MenuItem
									component={<Link to='/discounts' />}
									icon={
										<DiscountOutlinedIcon
											sx={{
												color: "#5c2d86",
												backgroundColor: "#FFFFFF",
												borderRadius: "0%",
											}}
										/>
									}>
									Discount %
								</MenuItem>
								<MenuItem
									component={<Link to='/commissions' />}
									icon={
										<PriceChangeOutlinedIcon
											sx={{
												color: "#5c2d86",
												backgroundColor: "#FFFFFF",
												borderRadius: "0%",
											}}
										/>
									}>
									Commissions
								</MenuItem>
							</Box>
						)}

						<Box>
							<MenuItem
								component={<Link to='/logout' />}
								icon={
									<LogoutOutlinedIcon
										sx={{
											color: "#5c2d86",
											backgroundColor: "#FFFFF",
											borderRadius: "0%",
										}}
									/>
								}>
								Logout
							</MenuItem>
						</Box>
					</Menu>
				</Box>
			</Sidebar>
		</Box>
	);
};

export default Sidenav;

// import React, { useState } from "react";
// import {
// 	ProSidebar,
// 	Menu,
// 	MenuItem,
// 	SidebarHeader,
// 	SidebarFooter,
// 	SidebarContent,
// } from "react-pro-sidebar";
// import { FaList, FaRegHeart } from "react-icons/fa";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

// import { Box, Typography, IconButton } from "@mui/material";
// import { grey } from "@mui/material/colors";

// function Sidebar() {
// 	const [menuCollapse, setMenuCollapse] = useState(false);
// 	const menuIconClick = () => {
// 		//condition checking to change state from true to false and vice versa
// 		menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
// 	};
// 	const greyColor = grey[100];

// 	return (
// 		<Box>
// 			<Sidebar defaultCollapsed={menuCollapse} backgroundColor={grey}>
// 				<Menu>
// 					<MenuItem
// 						onClick={menuIconClick}
// 						icon={menuCollapse ? <MenuOutlinedIcon /> : undefined}
// 						style={{
// 							margin: "10px 0 20px 0",
// 							color: { greyColor },
// 						}}>
// 						{!menuCollapse && (
// 							<Box
// 								display='flex'
// 								justifyContent='space-between'
// 								alignItems='center'
// 								ml='15px'>
// 								<Typography variant='h3' color={greyColor}>
// 									ADMINIS
// 								</Typography>
// 								<IconButton onClick={menuIconClick}>
// 									<MenuOutlinedIcon />
// 								</IconButton>
// 							</Box>
// 						)}
// 					</MenuItem>
// 					<MenuItem>
// 						<Typography>Annn</Typography>
// 					</MenuItem>
// 					<MenuItem>
// 						<Typography>Annn</Typography>
// 					</MenuItem>
// 					<MenuItem>
// 						<Typography>Annn</Typography>
// 					</MenuItem>
// 				</Menu>
// 			</Sidebar>
// 		</Box>
// 	);
// }

// export default Sidebar;
