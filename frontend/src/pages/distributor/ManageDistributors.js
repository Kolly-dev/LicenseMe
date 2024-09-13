import { Box, Typography, IconButton } from "@mui/material";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import React, { useEffect } from "react";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";

import {
	getDistributors,
	acceptDistributors,
	removeCompany,
} from "../../apis/companyProfiles";
import { useStateValue } from "../../store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";

import MaterialReactTable from "material-react-table";

const ManageDistributors = () => {
	const { authstate } = useStateValue();

	const { data } = useQuery(["distributor"], getDistributors);
	console.log(data);
	const [tableData, setTableData] = useState([]);
	console.log(tableData);

	useEffect(() => {
		const filtered = data?.filter(
			(distributor) => distributor.isAccepted === false
		);
		setTableData(filtered);
	}, [data]);

	const handleSaveCell = (cell, value) => {
		tableData[cell.row.index][cell.column.id] = value;
		//send/receive api updates here
		setTableData([...tableData]); //re-render with new data
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: "companyName",
				header: "Name",
				enableEditing: false,
			},
			{
				accessorKey: "companyEmail",
				header: "Email",
				enableEditing: false,
			},
			{
				accessorKey: "group_name",
				header: "Group Name",
			},

			{
				accessorKey: "erp_code",
				header: "ERP Number",
			},
			{
				accessorKey: "contact_name",
				header: "Contact Name",
			},
			{
				accessorKey: "CompanyUser",
				header: "Company User",
				enableEditing: false,
			},
		],
		[]
	);

	const queryClient = useQueryClient();

	const addDistributor = useMutation(acceptDistributors, {
		onSuccess: (data) => {
			console.log(data);
			queryClient.invalidateQueries(["distributor"]);
		},
	});
	const removeDistributor = useMutation(removeCompany, {
		onSuccess: (data) => {
			console.log(data);
			queryClient.invalidateQueries(["distributor"]);
		},
	});

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
						headerTitle={"MANAGE DISTRIBUTORS"}
						headerSubtitle={"This page is for Admin to manage new distributors"}
					/>

					<Box>
						{!tableData ? (
							<Typography>I am loading</Typography>
						) : (
							<MaterialReactTable
								columns={columns}
								data={tableData}
								editingMode='cell'
								enableEditing
								enableRowActions
								positionActionsColumn='last'
								displayColumnDefOptions={{
									"mrt-row-actions": {
										header: "Actions", //change header text
										size: 100, //make actions column wider
									},
								}}
								muiTableBodyCellEditTextFieldProps={({ cell }) => ({
									//onBlur is more efficient, but could use onChange instead
									onBlur: (event) => {
										handleSaveCell(cell, event.target.value);
									},
								})}
								renderRowActions={({ row }) => (
									<Box>
										<IconButton
											onClick={async (e) => {
												await addDistributor.mutateAsync({
													email: row.original.companyEmail,
													name: row.original.companyName,
													group_name: row.original.group_name,
													contact_name: row.original.contact_name,
													erp_code: row.original.erp_code,
												});
											}}>
											<PersonAddAlt1Icon />
										</IconButton>
										<IconButton
											onClick={async (e) => {
												await removeDistributor.mutateAsync({
													email: row.original.companyEmail,
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

export default ManageDistributors;
