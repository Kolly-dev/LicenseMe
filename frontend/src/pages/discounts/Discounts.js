import {
	Box,
	Button,
	Typography,
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import React from "react";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";
import { getProducts } from "../../apis/products";
import { createDiscount, getDiscounts } from "../../apis/discounts";
import { getCompanyProfiles } from "../../apis/companyProfiles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import { useStateValue } from "../../store";
import MaterialReactTable from "material-react-table";

const Discounts = () => {
	const { authstate } = useStateValue();
	const productsData = useQuery(["products"], getProducts);
	const Products = productsData.data;
	const CompanyProfilesData = useQuery(["companyprofiles"], getCompanyProfiles);
	const CompanyProfiles = CompanyProfilesData?.data?.filter(
		(Company) => Company.isDistributor && Company.isAccepted === true
	);
	console.log(CompanyProfiles);
	//console.log(data.filter((item) => item.isDistributor === true));

	const [Discount, setDiscount] = useState({
		rate: "",
		amount: "",
		companyName: "",
		productName: "",
	});

	const [productId, setProductId] = useState("");
	console.log("Product id", productId);

	const [companyProfileId, setCompanyProfileId] = useState("");
	console.log("Company id", companyProfileId);

	const { productName, companyName, amount, rate } = Discount;
	const onChange = (e) => {
		setDiscount({ ...Discount, [e.target.name]: e.target.value });
	};
	console.log(Discount);
	const queryClient = useQueryClient();
	const createDiscounts = useMutation(createDiscount, {
		onSuccess: (data) => {
			console.log(data);
			queryClient.invalidateQueries(["discounts"]);
		},
	});
	if (createDiscounts.isError) {
		console.log(createDiscounts.error);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		await createDiscounts.mutateAsync({
			productId: productId,
			productName: productName,
			companyProfileId: companyProfileId,
			companyName: companyName,
			amount: amount,
			rate: rate,
		});

		setDiscount({
			productName: "",
			companyName: "",
			amount: "",
			companyProfileId: "",
			productId: "",
			rate: "",
		});
	};
	//// Table
	const GetDiscounts = useQuery(["discounts"], getDiscounts);

	const [tableData, setTableData] = useState([]);
	console.log(tableData);

	useEffect(() => {
		setTableData(GetDiscounts.data);
	}, [GetDiscounts.data]);

	const handleSaveCell = (cell, value) => {
		tableData[cell.row.index][cell.column.id] = value;
		//send/receive api updates here
		setTableData([...tableData]); //re-render with new data
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: "companyName",
				header: "Company Name",
				// muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
				// 	//onBlur is more efficient, but could use onChange instead
				// 	onBlur: (event) => {
				// 		handleSaveCell(cell, event.target.value);
				// 	},
				// }),
				enableEditing: false,
			},
			{
				accessorKey: "productName",
				header: "Product Name",
				enableEditing: false,
			},
			{
				accessorKey: "rate",
				header: "Rate",
			},
			{
				accessorKey: "status",
				header: "Status",
			},
		],
		[]
	);

	// Table

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
						headerTitle={"DISCOUNTS"}
						headerSubtitle={"This page is for discounts"}
					/>
					<Box
						sx={{
							padding: "20px",
						}}>
						<Box display='flex' justifyContent='space-between'>
							<TextField
								sx={{
									borderRadius: 2,
									width: "250px",
									p: 1,
								}}
								placeholder='Enter Product Name'
								label='Company Name'
								onChange={onChange}
								value={companyName}
								name='companyName'
								select>
								{!CompanyProfiles ? (
									<Typography>I am loading</Typography>
								) : (
									CompanyProfiles.map((item) => {
										return (
											<MenuItem
												key={item._id}
												value={item.name}
												onClick={(e) => setCompanyProfileId(item._id)}>
												{item.name}
											</MenuItem>
										);
									})
								)}
							</TextField>
							<TextField
								sx={{
									borderRadius: 2,
									width: "250px",
									p: 1,
								}}
								placeholder='Enter Product Name'
								label='Product Name'
								value={productName}
								name='productName'
								onChange={onChange}
								select>
								{Products?.map((item, index) => {
									return (
										<MenuItem
											key={item._id}
											value={item.productName}
											id={item._id}
											onClick={() => setProductId(item._id)}>
											{item.productName}
										</MenuItem>
									);
								})}
							</TextField>

							<TextField
								sx={{
									borderRadius: 2,
									p: 1,
									width: "250px",
								}}
								placeholder='Enter the rate'
								name='rate'
								label='Rate'
								value={rate}
								onChange={onChange}
							/>
							<TextField
								sx={{
									borderRadius: 2,
									width: "250px",
									p: 1,
								}}
								placeholder='Enter the number of discount'
								label='Number of Discounts'
								value={amount}
								name='amount'
								onChange={onChange}
							/>
						</Box>

						<Box
							display='flex'
							justifyContent='flex-end'
							sx={{
								p: 1,
							}}>
							<Button onClick={handleSubmit}> Add Discount</Button>
						</Box>
					</Box>

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

export default Discounts;
