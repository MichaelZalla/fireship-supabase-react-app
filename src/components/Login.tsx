import React from "react";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared'

import UserContext from "../contexts/UserContext";

import client from "../utils/client";

import Dialog from "./Dialog";

export function setStoredReturnPath(): void {
	localStorage.setItem(`returnPath`, window.location.pathname)
}

export function Login() {

	const { session } = React.useContext(UserContext)

	const [showModal, setShowModal] = React.useState<boolean>(false)
	const [authMode, setAuthMode] = React.useState<`sign_in`|`sign_up`>(`sign_in`)

	React.useEffect(
		() => {

			if(session?.user) {
				setShowModal(false)
			}

		},
		[session]
	)

	return (
		<>

			<div className="flex m-4 place-items-center">
				<button
					onClick={e => {
						setShowModal(true)
						setAuthMode(`sign_in`)
						setStoredReturnPath()
					}}>
					Login
				</button>{' '}
				<span className="p-2"> or </span>{' '}
				<button
					onClick={e => {
						setShowModal(true)
						setAuthMode(`sign_up`)
						setStoredReturnPath()
					}}>
					Sign Up
				</button>
			</div>

			<Dialog
				open={showModal}
				dialogStateChange={open => setShowModal(open)}
				contents={
					<>
						{
							<Auth
								supabaseClient={client}
								providers={
									import.meta.env.PROD ?
									[`google`] :
									[]
								}
								redirectTo={window.location.origin}
								view={authMode}
								appearance={{
									theme: ThemeSupa,
									className: {
										container: 'login-form-container',
										label: 'login-form-label',
										button: 'login-form-button',
										input: 'login-form-input',
									}
								}}
							/>
						}
						<button onClick={() => setShowModal(false)}>Close</button>
					</>
				} />

		</>
	)

}
