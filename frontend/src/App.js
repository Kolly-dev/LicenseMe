import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CompanyProfile from "./pages/auth/CompanyProfile";
import ManageDistributors from "./pages/distributor/ManageDistributors";
import Pending from "./pages/license/Pending";
import Active from "./pages/license/Active";
import Expired from "./pages/license/Expired";
import Products from "./pages/products/Products";
import DistributorDashboard from "./pages/dashboard/DistributorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Commissions from "./pages/commissions/commissions";
import Discounts from "./pages/discounts/Discounts";
import MyLicense from "./pages/license/MyLicense";
import AdminRoutes from "./routesAuth/AdminRoutes";
import AdminDistributorRoutes from "./routesAuth/AdminDistributorRoutes";
import NotDistributorRoutes from "./routesAuth/NotDistributor";
import DistributorRoutes from "./routesAuth/DistributorRoutes";
import { ProSidebarProvider } from "react-pro-sidebar";
function App() {
	return (
		<div className='App'>
			<ProSidebarProvider>
				<Router>
					<Routes>
						<Route path='/register' element={<Register />} />

						<Route path='/login' element={<Login />} />

						<Route path='/logout' element={<Logout />} />

						<Route path='/forgotpassword' element={<ForgotPassword />} />

						<Route
							path='/resetpassword/:_id/:token'
							element={<ResetPassword />}
						/>

						{/* Admin pages */}

						<Route
							path='/companyprofile'
							element={
								<NotDistributorRoutes>
									<CompanyProfile />
								</NotDistributorRoutes>
							}
						/>

						<Route
							path='/companyprofile/managedistributors'
							element={
								<AdminRoutes>
									<ManageDistributors />
								</AdminRoutes>
							}
						/>

						<Route
							path='/licenses/pending'
							element={
								<DistributorRoutes>
									<Pending />
								</DistributorRoutes>
							}
						/>

						<Route
							path='/licenses/active'
							element={
								<AdminDistributorRoutes>
									<Active />
								</AdminDistributorRoutes>
							}
						/>

						<Route
							path='/licenses/expired'
							element={
								<AdminDistributorRoutes>
									<Expired />
								</AdminDistributorRoutes>
							}
						/>

						<Route
							path='/dashboard'
							element={
								<DistributorRoutes>
									<DistributorDashboard />
								</DistributorRoutes>
							}
						/>
						<Route
							path='/admin-dashboard'
							element={
								<AdminRoutes>
									<AdminDashboard />
								</AdminRoutes>
							}
						/>

						<Route
							path='/products'
							element={
								<AdminRoutes>
									<Products />
								</AdminRoutes>
							}
						/>

						<Route
							path='/commissions'
							element={
								<AdminRoutes>
									<Commissions />
								</AdminRoutes>
							}
						/>

						<Route
							path='/discounts'
							element={
								<AdminRoutes>
									<Discounts />
								</AdminRoutes>
							}
						/>

						{/* Normal user route */}

						<Route
							path='/mylicense/:companyid'
							element={
								<NotDistributorRoutes>
									<MyLicense />
								</NotDistributorRoutes>
							}
						/>
					</Routes>
				</Router>
			</ProSidebarProvider>
		</div>
	);
}

export default App;
