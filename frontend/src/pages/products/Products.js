import { Box, Button, Typography, TextField } from "@mui/material";
import React from "react";
import Sidenav from "../../components/Sidenav";
import Topbar from "../../components/TopBar";
import Header from "../../components/Header";
import { createProduct, getProducts } from "../../apis/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import { useStateValue } from "../../store";
import MaterialReactTable from "material-react-table";

function Products() {
	const { authstate } = useStateValue();
	const [product, setProduct] = useState({
		productName: "",
		duration: "",
		price: "",
		renewalPeriod: "",
	});
	const { productName, duration, price, renewalPeriod } = product;
	const productId = uuidV4();

	const onChange = (e) =>
		setProduct({ ...product, [e.target.name]: e.target.value });

	const { mutateAsync, isError, error } = useMutation(createProduct, {
		onSuccess: (data) => {
			console.log(data);
			queryClient.invalidateQueries(["products"]);
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
			duration: duration,
			price: price,
			renewalPeriod: renewalPeriod,
		});
	};

	const productsData = useQuery(["products"], getProducts);
	const Products = productsData.data;

	const queryClient = useQueryClient();

	const columns = useMemo(
		() => [
			{
				accessorKey: "productName",
				header: "Product Name",
			},
			{
				accessorKey: "duration",
				header: "Duration",
			},
			{
				accessorKey: "price",
				header: "Price",
			},
			{
				accessorKey: "renewalPeriod",
				header: "Renewal Period",
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
						headerTitle={"PRODUCTS"}
						headerSubtitle={"This page is for products"}
					/>
					{/* <Box
						sx={{
							padding: "20px",
						}}>
						<Box display='flex' justifyContent='space-around'>
							<TextField
								sx={{
									borderRadius: 2,
									p: 1,
									minWidth: 250,
								}}
								placeholder='Enter Product Name'
								name='productName'
								label='Product Name'
								value={productName}
								onChange={onChange}
							/>
							<TextField
								sx={{
									borderRadius: 2,
									p: 1,
									minWidth: 250,
								}}
								placeholder='Enter Price'
								name='price'
								label='Price'
								value={price}
								onChange={onChange}
							/>
							<TextField
								sx={{
									borderRadius: 2,
									p: 1,
									minWidth: 250,
								}}
								placeholder='Enter Duration'
								name='duration'
								label='Duration'
								value={duration}
								onChange={onChange}
							/>
							<TextField
								sx={{
									borderRadius: 2,
									p: 1,
									minWidth: 200,
								}}
								placeholder='Enter Renewal Period'
								name='renewalPeriod'
								label='Renewal Period'
								value={renewalPeriod}
								onChange={onChange}
							/>
						</Box>
						<Box
							display='flex'
							justifyContent='flex-end'
							sx={{
								p: 1,
							}}>
							<Button onClick={handleSubmit}> Add Products</Button>
						</Box>
					</Box> */}
					<Box
						sx={{
							padding: "20px",
						}}>
						{!Products ? (
							<Typography>I am loading</Typography>
						) : (
							<MaterialReactTable columns={columns} data={Products} />
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default Products;
