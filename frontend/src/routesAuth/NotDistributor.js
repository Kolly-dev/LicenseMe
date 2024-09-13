import React from "react";
import { Navigate } from "react-router-dom";
import { useGetUser } from "../apis/auth";
import { useStateValue } from "../store";

export default function NotDistributorRoutes({ children }) {
	const { authstate } = useStateValue();
	console.log("I came here - NotDistributorRoutes");
	useGetUser();
	// success if user is not distributor
	if (
		Object.keys(authstate?.currentUser).length > 0 &&
		!authstate?.currentUser?.user?.isAppAdmin &&
		!authstate?.currentUser?.companyProfileDetails?.isDistributor
	) {
		return children;
	}

	// fail if user is not regular user ( Technicians and Wine Growers)

	if (
		(Object.keys(authstate?.currentUser).length > 0 &&
			authstate?.currentUser?.user?.isAppAdmin) ||
		authstate?.currentUser?.companyProfileDetails?.isDistributor
	) {
		return <Navigate to='/login' />;
	}
}
