import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	COMPANY_SUCCESS,
	SET_CURRENT_USER,
	SIDEBAR_COLLAPSE,
	LICENSE_SUCCESS,
	LICENSE_FAIL,
	SET_ERROR_MESSAGE,
	CLEAR_ERRORS,
} from "../actions/authActions";

export const authReducer = (state, action) => {
	switch (action.type) {
		case REGISTER_FAIL:
		case LOGIN_FAIL:
			localStorage.removeItem("currentUser");
			return {
				...state,
				currentUser: null,
				isAuthenticated: false,
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
		case COMPANY_SUCCESS:
		case SET_CURRENT_USER:
		case LICENSE_SUCCESS:
			return {
				...state,
				currentUser: action.payload,
				loading: false,
				// isAuthenticated: true,
			};
		case SIDEBAR_COLLAPSE:
			return {
				...state,
				collapse: !action.payload,
			};
		case SET_ERROR_MESSAGE:
			return {
				...state,
				errors: {
					isOpen: true,
					errorMsg: action.payload,
				},
			};

		case CLEAR_ERRORS:
			return {
				...state,
				errors: {
					isOpen: false,
					errorMsg: [],
				},
			};

		default:
			return state;
	}
};
