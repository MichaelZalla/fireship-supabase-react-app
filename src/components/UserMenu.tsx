import React from "react";

import UserContext from "../contexts/UserContext";

import client from "../utils/client";

export function UserMenu() {

	const { profile } = React.useContext(UserContext);

	return (
		<>
			<div className="flex flex-col">

				<h2>Welcome, {profile?.username || 'dawg'}.</h2>

				<button
					onClick={() => client.auth.signOut()}
					className="user-menu-logout-button">
					Logout
				</button>

			</div>
		</>
	)

}
