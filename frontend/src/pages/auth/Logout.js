import React from "react";
import { Navigate, Link } from "react-router-dom";

function Logout() {
	localStorage.clear();
	return <Navigate to='/login' />;
}

export default Logout;
