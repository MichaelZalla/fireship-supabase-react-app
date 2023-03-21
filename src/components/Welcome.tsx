import React from "react"

import { redirect, useNavigate } from "react-router-dom"

import UserContext from "../contexts/UserContext"

import client from "../utils/client"

import Dialog from "./Dialog"

export async function welcomeLoader() {

	const { data: { user } } = await client
		.auth
		.getUser()

	if(!user) {
		return redirect('/')
	}

	const { data } = await client
		.from('user_profiles')
		.select('*')
		.eq('user_id', user?.id)
		.single()

	if(data?.username) {
		return redirect('/')
	}

	return null

}

export default function Welcome() {

	const navigate = useNavigate()

	const { session, profile } = React.useContext(UserContext)

	const [username, setUsername] = React.useState<string>('')
	const [serverError, setServerError] = React.useState<string>('')
	const [isFormDirty, setIsFormDirty] = React.useState<boolean>(false)

	const invalidUsernameMessage = React.useMemo(
		() => validateUsername(username),
		[username]
	)

	return (
		<Dialog
			allowClose={false}
			open={true}
			contents={
				<>

					<h2 className="welcome-header">
						Welcome to the app!
					</h2>

					<p className="text-center">
						To get started, enter a username in the form below:
					</p>

					<form className="welcome-name-form"
						onSubmit={e => {

							e.preventDefault()

							client.from('user_profiles')
								.insert([
									{
										user_id: session?.user.id || ``,
										username,
									}
								])
								.then(({ error }) => {

									if(error) {

										setServerError(error.message)

									} else {

										const redirectPath =
											localStorage.getItem(`returnPath`) ||
											`/`;

										localStorage.removeItem(`returnPath`);

										navigate(redirectPath);

									}

								})

						}}>

						<input type="text" name="username" placeholder="Username"
							className="welcome-name-input"
							onChange={({ target }) => {

								setUsername(target.value)

								setIsFormDirty(true)

								setServerError('')

							}}>
						</input>

						{
							isFormDirty &&
							(invalidUsernameMessage || serverError) &&
							<p className="welcome-form-error-message validation-feedback">
								{ invalidUsernameMessage || serverError }
							</p>
						}

						<p className="text-center">
							This is the name that people will see you as on the message board.
						</p>

						<button className="welcome-form-submit-button" type="submit">
							Submit
						</button>

					</form>

				</>
			} />
	)

}

const validateUsername = (
	username: string): string|undefined =>
{

	if(!username) {
		return 'Username is required';
	}

	const regex = /^[a-zA-Z0-9_]+$/;

	if(username.length < 4) {
		return 'Username must be at least 4 characters long';
	}

	if(username.length > 14) {
		return 'Username must be less than 15 characters long';
	}

	if(!regex.test(username)) {
		return 'Username can only contain letters, numbers, and underscores';
	}

	return undefined;

}
