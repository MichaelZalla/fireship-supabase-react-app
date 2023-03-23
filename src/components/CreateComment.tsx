import React from "react";

import { Session } from "@supabase/supabase-js";

import { Post, PostComment } from "../types/post";

import useSession from "../hooks/useSession";

import client from "../utils/client";

const submitComment = (
	session: Session|null,
	comment: string,
	parent: Post|PostComment) =>
{
	return client.rpc(`create_new_comment`, {
		user_id: session?.user.id || '',
		content: comment,
		path: `${parent.path}.${parent.id.replaceAll('-', '_')}`,
	})
}

type CreateCommentProps = {
	parent: Post|PostComment;
}

export function CreateComment({
	parent,
}: CreateCommentProps) {

	const { session } = useSession()

	const [comment, setComment] = React.useState<string>('')

	const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

	const onSubmit = React.useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {

			event.preventDefault();

			submitComment(session, comment, parent)
				.then(({ error }) => {

					if(error) {

						console.error(error)

					} else {

						if(textAreaRef.current?.value) {
							textAreaRef.current.value = ``
						}

					}

				});

		},
		[session, comment, parent, textAreaRef]
	)

	return (
		<>
			<form className="post-detail-create-comment-form"
				data-e2e="create-comment-form"
				onSubmit={e => onSubmit(e)} >

				<h3>Add a new comment</h3>

				<textarea className="post-detail-create-comment-form-content"
					name="comment" id="comment"
					placeholder="Your comment here..."
					ref={textAreaRef}
					onChange={({ target: { value }}) => setComment(value)}>
				</textarea>

				<div className="flex gap-2">

				<button type="submit"
					className="post-detail-create-comment-form-submit-button"
					disabled={!comment}>
					Submit
				</button>

				<button type="button"
					className="post-detail-create-comment-form-cancel-button">
					Cancel
				</button>

				</div>

			</form>
		</>
	)

}
