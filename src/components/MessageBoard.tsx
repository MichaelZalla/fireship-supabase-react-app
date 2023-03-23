import React from "react";

import { Link, Outlet } from "react-router-dom";

import UserContext from "../contexts/UserContext";

export default function MessageBoard() {

	const { session } = React.useContext(UserContext)

	return (
		<div className="message-board-container">

			<Link to="/1">
				<h2 className="message-board-header-link">
					Message Board
				</h2>
			</Link>

			{
				session ?
					<></> :
					<h2 className="message-board-login-message" data-e2e="message-board-login">
						Yo dawg! You gotta log in to join the discussion.
					</h2>
			}

			<Outlet />

		</div>
	)

}
