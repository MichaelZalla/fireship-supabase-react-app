import { Link } from "react-router-dom";

export default function NavBar() {
	return (
		<>
			<nav className="nav-bar">

				<Link className="nav-logo-link" to="/">
					<img src="https://supaship.io/supaship_logo_with_text.svg" alt="Logo"
						id="logo" className="nav-logo" />
				</Link>

				<ul className="nav-right-list">
					<li className="nav-message-board-list-item">
						<Link to="/1" className="nav-message-board-link">
							Message Board
						</Link>
					</li>
				</ul>

			</nav>
		</>
	)
}
