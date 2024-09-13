import { Box, Typography, MenuItem, IconButton } from "@mui/material";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import React from "react";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";

import { getLicenses, acceptLicense, rejectLicense } from "../../apis/licenses";
import { getDiscounts } from "../../apis/discounts";
import { useStateValue } from "../../store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";

import MaterialReactTable from "material-react-table";

const Pending = () => {
	const { authstate } = useStateValue();

	// api call for licenses
	const { data } = useQuery(["licenses"], getLicenses);
	console.log(data);

	// api call for DIscounts
	const Discounts = useQuery(["discounts"], getDiscounts);
	console.log(data);

	// table state

	const [tableData, setTableData] = useState([]);
	console.log(tableData);

	// companies state
	const [companies, setCompanies] = useState([]);
	console.log(companies);

	// discount state
	const [discounts, setDiscounts] = useState([]);

	// rateID state
	const [rateId, setRateId] = useState("");

	useEffect(() => {
		const PendingFilter = data?.filter(
			(license) => license.status.isRequested === true
		);
		setTableData(PendingFilter);

		const ActiveFilter = data?.filter(
			(license) =>
				license.status.isActive === true && license.productName === "Technician"
		);
		setCompanies(ActiveFilter);
		console.log(ActiveFilter);

		const DiscountFilter = Discounts.data?.filter(
			(discount) => discount.status === "New"
		);
		setDiscounts(DiscountFilter);
	}, [data, Discounts.data]);

	const handleSaveCell = (cell, value) => {
		tableData[cell.row.index][cell.column.id] = value;
		//send/receive api updates here
		setTableData([...tableData]); //re-render with new data
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: "requested_Date",
				header: "Requested Date",
				enableEditing: false,
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
				enableEditing: false,
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
				enableEditing: false,
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
				enableEditing: false,
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
				enableEditing: false,
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
				enableEditing: false,
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
			},

			{
				accessorKey: "parentCompanyEmail",
				header: "Parent Email",
				editVariant: "select",
				enableEditing: (row) => row.original.productName.includes("Winer"),

				// editSelectOptions: company.map((item) => (
				// 	<MenuItem>{item.companyName}</MenuItem>
				// )),
				muiTableBodyCellEditTextFieldProps: ({ cell, row, column, table }) => ({
					children: companies.map((item) => (
						<MenuItem value={item.companyEmail}>{item.companyEmail}</MenuItem>
					)),
					select: true,
				}),
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
				accessorKey: "rate",
				header: "Discount Rate",
				muiTableBodyCellProps: {
					align: "center",
				},
				muiTableHeadCellProps: {
					align: "center",
				},
				muiTableBodyCellEditTextFieldProps: ({ cell, row, column, table }) => ({
					children: discounts.map((item) => (
						<MenuItem
							id={item._id}
							onClick={() => setRateId(item._id)}
							value={item.rate}>
							{item.rate}
						</MenuItem>
					)),
					select: true,
				}),
			},
		],
		[companies, discounts]
	);
	console.log(rateId);
	const queryClient = useQueryClient();

	const acceptLicenses = useMutation(acceptLicense, {
		onSuccess: (data) => {
			console.log(data);
			queryClient.invalidateQueries(["licenses"]);
		},
	});
	const rejectLicenses = useMutation(rejectLicense, {
		onSuccess: (data) => {
			console.log(data);
			queryClient.invalidateQueries(["licenses"]);
		},
	});

	return (
		<Box>
			<Topbar />
			<Box sx={{ display: "flex" }}>
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
						headerTitle={"PENDING LICENSES"}
						headerSubtitle={"This page is to manage pending licenses"}
					/>
					<Box
						sx={{
							padding: "20px",
						}}>
						{!tableData ? (
							<Typography>I am loading</Typography>
						) : (
							<MaterialReactTable
								columns={columns}
								data={tableData}
								enableRowActions
								positionActionsColumn='last'
								editingMode='cell'
								enableEditing
								displayColumnDefOptions={{
									"mrt-row-actions": {
										header: "Actions", //change header text
										size: 200, //make actions column wider
									},
								}}
								muiTableBodyCellEditTextFieldProps={({ cell }) => ({
									//onBlur is more efficient, but could use onChange instead
									variant: "outlined",
									onBlur: (event) => {
										handleSaveCell(cell, event.target.value);
									},
								})}
								renderRowActions={({ row }) => (
									<Box>
										<IconButton
											onClick={async (e) => {
												await acceptLicenses.mutateAsync({
													companyEmail: row.original.companyEmail,
													rateId: rateId,
													ref_number: row.original.ref_number,
													parentCompanyEmail: row.original.parentCompanyEmail,
												});
											}}>
											<PersonAddAlt1Icon />
										</IconButton>
										<IconButton
											onClick={async (e) => {
												await rejectLicenses.mutateAsync({
													companyEmail: row.original.companyEmail,
												});
											}}>
											<PersonRemoveAlt1Icon />
										</IconButton>
									</Box>
								)}
							/>
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Pending;
