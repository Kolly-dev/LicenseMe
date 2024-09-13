import { createTheme } from "@mui/material";

export default createTheme({
	palette: {
		primary: {
			main: "#BF40BF",
		},
		secondary: {
			main: "#A778A7",
		},
		text: {
			light: "#f5f5f5",
			primary: "#BF40BF",
		},
	},

	components: {
		MuiTextField: {
			defaultProps: {
				fontFamily: ["Poppins"].join(","),
				size: "small",
				variant: "outlined",
				margin: "dense",
				fullWidth: true,
				InputLabelProps: {
					shrink: true,
					color: "primary",
				},
			},
			styleOverrides: {
				root: {
					fontFamily: ["Poppins"].join(","),
				},
			},
		},
		MuiButton: {
			defaultProps: {
				size: "small",
				variant: "contained",
				fontFamily: ["Poppins"].join(","),
			},
			styleOverrides: {
				root: {
					textTransform: "none",
					color: "#fff",
					fontFamily: ["Poppins"].join(","),
				},
			},
		},
		MuiCard: {
			variants: [
				{
					props: { variant: "shaded" },
					style: {
						backgroundColor: "#E0E0D9",
						borderRadius: "10px",
					},
				},
			],
		},
		MuiTypography: {
			defaultProps: {
				align: "left",
				fontFamily: ["Poppins"].join(","),
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					padding: 8,
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					backgroundColor: "#E0E0D9",
				},
			},
		},
		MuiListItemText: {
			styleOverrides: {
				root: {
					color: "#1fbfc1",
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: {
					color: "#BF40BF",
					backgroundColor: "white",
					borderRadius: "50%",
				},
			},
		},
	},
});
