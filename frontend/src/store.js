import { createContext, useReducer, useContext } from "react";
import { authReducer } from "./reducers/authReducer";
import { authInitialState } from "./initialStates/authInitialState";
import React from "react";

export const Store = createContext();

export function StoreProvider(props) {
	const [authState, dispatch] = useReducer(authReducer, authInitialState);

	console.log(authState);

	return (
		<Store.Provider value={{ authstate: authState, Dispatch: dispatch }}>
			{props.children}
		</Store.Provider>
	);
}

export const useStateValue = () => useContext(Store);
