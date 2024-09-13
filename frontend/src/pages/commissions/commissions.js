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
import { createCommission, getCommissions } from "../../apis/commissions";
import { getCompanyProfiles } from "../../apis/companyProfiles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import { useStateValue } from "../../store";
import MaterialReactTable from "material-react-table";

const Commissions = () => {
	const { authstate } = useStateValue();
	const productsData = useQuery(["products"], getProducts);
	const Products = productsData?.data?.filter(
		(product) => product.productName === "Winer"
	);

	const CompanyProfilesData = useQuery(["companyprofiles"], getCompanyProfiles);
	const CompanyProfiles = CompanyProfilesData?.data?.filter(
		(company) => company.isDistributor === true
	);
	console.log(CompanyProfiles);

	const [Commission, setCommission] = useState({
		productName: "",
		companyName: "",
		amount: "",
	});

	const [productId, setProductId] = useState("");
	console.log("Product id", productId);

	const [companyProfileId, setCompanyProfileId] = useState("");
	console.log("Company id", companyProfileId);
	// console.log(index);
	// const getindex = (id) => {
	// 	console.log(id);
	// };
	const { productName, companyName, amount } = Commission;
	const onChange = (e) => {
		setCommission({ ...Commission, [e.target.name]: e.target.value });
	};
	console.log(Commission);
	const queryClient = useQueryClient();
	const { mutateAsync, isError, error } = useMutation(createCommission, {
		onSuccess: (data) => {
			console.log(data);
			queryClient.invalidateQueries(["commissions"]);
		},
	});
	if (isError) {
		console.log(error);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		await mutateAsync({
			productId: productId,
			productName: productName,
			companyProfileId: companyProfileId,
			companyName: companyName,
			amount: amount,
		});

		setCommission({
			productName: "",
			companyName: "",
			amount: "",
			companyProfileId: "",
			productId: "",
		});
	};

	//table columns

	const columns = useMemo(
		() => [
			{
				accessorKey: "companyName",
				header: "Company Name",
			},
			{
				accessorKey: "productName",
				header: "Product Name",
				enableEditing: false,
			},
			{
				accessorKey: "amount",
				header: "Amount",
			},
		],
		[]
	);

	// Table data

	const [tableData, setTableData] = useState([]);
	const Commissions = useQuery(["commissions"], getCommissions);
	useEffect(() => {
		setTableData(Commissions.data);
	}, [Commissions.data]);

	return (
		<Box display='flex' maxWidth='100vw'>
			<Box sx={{ flex: "0.1" }}>
				<Sidenav />
			</Box>
			<Box
				sx={{
					width: authstate.collapse ? "94%" : "82%",
					height: "100%",
					minHeight: "100vh",
					borderLeft: "1px solid #D5D5D5",
					marginLeft: authstate.collapse ? "90px" : "250px",
				}}>
				<Topbar />
				<Header
					headerTitle={"COMMISSIONS"}
					headerSubtitle={"This page is for commission"}
				/>
				<Box
					sx={{
						padding: "20px",
					}}>
					<Box display='flex'>
						<TextField
							sx={{
								borderRadius: 2,
								width: "250px",
								padding: "10px 70px 10px 0px",
							}}
							placeholder='Enter Product Name'
							label='Product Name'
							value={productName}
							name='productName'
							onChange={onChange}
							select>
							{!Products ? (
								<MenuItem>I am loading</MenuItem>
							) : (
								Products.map((item, index) => {
									return (
										<MenuItem
											key={item._id}
											value={item.productName}
											id={item._id}
											onClick={() => setProductId(item._id)}>
											{item.productName}
										</MenuItem>
									);
								})
							)}
						</TextField>
						<TextField
							sx={{
								borderRadius: 2,
								width: "250px",
								padding: "10px 70px 10px 0px",
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
								padding: "10px 70px 10px 0px",
							}}
							placeholder='Enter the amount'
							name='amount'
							label='Amount'
							value={amount}
							onChange={onChange}
						/>
					</Box>
					<Box
						display='flex'
						justifyContent='flex-end'
						sx={{
							paddingRight: "260px",
						}}>
						<Button onClick={handleSubmit}> Add Commission</Button>
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
	);
};

export default Commissions;
