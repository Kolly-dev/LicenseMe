import { Box, Typography } from "@mui/material";

import React from "react";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";
import { useStateValue } from "../../store";

import { getLicenses } from "../../apis/licenses";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";

import MaterialReactTable from "material-react-table";

const Expired = () => {
	const { authstate } = useStateValue();
	const { data } = useQuery(["licenses"], getLicenses);
	console.log(data);
	const [tableData, setTableData] = useState([]);
	console.log(tableData);

	useEffect(() => {
		const filtered = data?.filter(
			(license) => license.status.isDeactivated === true
		);
		setTableData(filtered);
	}, [data]);

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
				accessorKey: "parentCompanyName",
				header: "Parent Company",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},
		],
		[]
	);

	return (
		<Box>
			<Topbar />
			<Box >
				<Sidenav />
				<Box
					sx={{
						width: authstate.collapse ? "94%" : "83%",
						height: "100%",
						minHeight: "100vh",
						borderLeft: "1px solid #D5D5D5",
						marginLeft: authstate.collapse ? "90px" : "250px",
					}}>
					<Header
						headerTitle={"EXPIRED LICENSES"}
						headerSubtitle={"This page is to view expired licenses"}
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

export default Expired;
