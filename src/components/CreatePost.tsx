import React from "react";

import useSession from "../hooks/useSession";

import client from "../utils/client";

const createNewPost = (
	{
		userId,
		title,
		content,
	}: {
		userId: string,
		title: string,
		content: string,
	}) =>
{

	return client.rpc(`create_new_post`, {
		userId,
		title,
		content,
	})

}

type CreatePostProps = {
	onNewPostCreated?: () => void,
}

export function CreatePost({ onNewPostCreated = () => {} }: CreatePostProps) {

	const { session } = useSession()

	const [title, setTitle] = React.useState<string>('')
	const [content, setContent] = React.useState<string>('')

	const titleInputRef = React.useRef<HTMLInputElement>(null);
	const contentInputRef = React.useRef<HTMLTextAreaElement>(null);

	const resetForm = React.useCallback(
		() => {

			setTitle('')
			setContent('')

			if(titleInputRef.current) {
				titleInputRef.current.value = ''
			}

			if(contentInputRef.current) {
				contentInputRef.current.value = ''
			}

		},
		[setTitle, setContent, titleInputRef, contentInputRef]
	)

	return (
		<>
			<form className="create-post-form"
				data-e2e="create-post-form"
				onSubmit={e => {

					e.preventDefault()

					const postData = {
						userId: session?.user.id || '',
						title,
						content,
					};

					createNewPost(postData)
						.then(({ error }) => {

							if(error) {
								console.error(error)
								return
							}

							resetForm()

							onNewPostCreated();

						})

				}}>

				<h3>Create A New Post</h3>

				<input className="create-post-title-input" type="text" name="title"
					placeholder="Post title"
					ref={titleInputRef}
					onChange={({ target: { value } }) => {
						setTitle(value)
					}} />

				<textarea className="create-post-content-input" name="content"
					placeholder="Post content..."
					ref={contentInputRef}
					onChange={({ target: { value } }) => {
						setContent(value)
					}} />

				<div>
					<button className="create-post-submit-button" type="submit">
						Post
					</button>
				</div>

			</form>
		</>
	)

}
