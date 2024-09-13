import React from "react";
import { Navigate } from "react-router-dom";
import { useGetUser } from "../apis/auth";
import { useStateValue } from "../store";

export default function DistributorRoutes({ children }) {
	useGetUser();
	const { authstate } = useStateValue();

	// success if user is distributor
	if (
		Object.keys(authstate?.currentUser).length > 0 &&
		authstate?.currentUser?.companyProfileDetails?.isDistributor
	) {
		return children;
	}
	// fail if user is not distributor
	if (
		Object.keys(authstate?.currentUser).length > 0 &&
		!authstate?.currentUser?.companyProfileDetails?.isDistributor
	) {
		<Navigate to='/login' />;
	}

	if (Object.keys(authstate?.currentUser).length > 0) {
		<Navigate to='/login' />;
	}
}
