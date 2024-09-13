import { Box, Typography } from "@mui/material";
// import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
// import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import React from "react";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";
// import { useNavigate, Link } from "react-router-dom";

import { getLicenses, acceptLicense, rejectLicense } from "../../apis/licenses";
// import { useStateValue } from "../../store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useStateValue } from "../../store";

import MaterialReactTable from "material-react-table";

const Active = () => {
	const { authstate } = useStateValue();
	const { data } = useQuery(["licenses"], getLicenses);
	console.log(data);
	const [tableData, setTableData] = useState([]);
	console.log(tableData);

	useEffect(() => {
		const filtered = data?.filter(
			(license) => license.status.isActive === true
		);
		setTableData(filtered);
	}, [data]);

	// const [filtered, setFiltered] = useState([]);
	// const filtered = data?.filter(
	// 	(distributor) => distributor.isAccepted === false
	// );
	// console.log(filtered);

	const columns = useMemo(
		() => [
			{
				accessorKey: "requested_Date",
				header: "Requested Date",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
				Cell: ({ cell }) => (
					<span className=''>
						{cell.getValue()
							? cell.getValue().toString().substring(0, 10)
							: "--"}
					</span>
				),
			},
			{
				accessorKey: "type",
				header: "Type",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "userNames",
				header: "User",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "productName",
				header: "Product",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "companyName",
				header: "Company",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "companyEmail",
				header: "Company Email",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "parentCompanyUserNames",
				header: "Parent User",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "parentCompanyName",
				header: "Parent Company",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "group_name",
				header: "Group Name",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "ref_number",
				header: "Ref Number",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "price",
				header: "Price",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "rate",
				header: "Discount Rate",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "commission",
				header: "Commission",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
			{
				accessorKey: "expiry_Date",
				header: "Expiry Date",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
				Cell: ({ cell }) => (
					<span className=''>
						{cell.getValue()
							? cell.getValue().toString().substring(0, 10)
							: "--"}
					</span>
				),
			},
		],
		[]
	);

	return (
		<Box>
			<Topbar />

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
						headerTitle={"ACTIVE LICENSES"}
						headerSubtitle={"This page is to view active licenses"}
					/>
					<Box
						sx={{
							padding: "20px",
						}}>
						{!tableData ? (
							<Typography>I am loading</Typography>
						) : (
							<MaterialReactTable columns={columns} data={tableData} />
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Active;
