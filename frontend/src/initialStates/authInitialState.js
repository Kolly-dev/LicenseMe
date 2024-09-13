export const authInitialState = {
	token: localStorage.getItem("token")
		? JSON.parse(localStorage.getItem("token"))
		: null,
	currentUser: {},
	// localStorage.getItem("currentUser")
	// 	? JSON.parse(localStorage.getItem("currentUser"))
	// 	: null,
	// isAuthenticated: null,
	collapse: false,
	loading: true,
	errors: { isOpen: false, errorMsg: [] },
};
