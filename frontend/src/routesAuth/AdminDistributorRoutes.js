import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useStateValue } from "../store";
import { useGetUser } from "../apis/auth";
import { useState, useMemo } from "react";

export default function AdminRoutes({ children }) {
	useGetUser();
	const { authstate } = useStateValue();

	// success if user is admin
	if (
		Object.keys(authstate?.currentUser).length > 0 &&
		(authstate?.currentUser?.user?.isAppAdmin ||
			authstate?.currentUser?.companyProfileDetails?.isDistributor)
	) {
		return children;
	}
	// fail if user is not admin or distributor
	if (
		Object.keys(authstate?.currentUser).length > 0 &&
		(!authstate?.currentUser?.user?.isAppAdmin ||
			!authstate?.currentUser?.companyProfileDetails?.isDistributor)
	) {
		<Navigate to='/login' />;
	}

	if (Object.keys(authstate?.currentUser).length > 0) {
		<Navigate to='/login' />;
	}
}
