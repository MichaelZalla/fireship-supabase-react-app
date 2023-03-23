import React from "react";

import { PostComment } from "../types/post";

import useSession from "../hooks/useSession";

import { RelativeDate } from "./RelativeDate";
import { CreateComment } from "./CreateComment";

type CommentViewProps = {
	comment: PostComment;
	onAddComment?: () => void;
}

export function CommentView({
	comment,
	onAddComment
}: CommentViewProps)
{

	const { session } = useSession()

	const [isCommenting, setIsCommenting] = React.useState<boolean>(false)

	return (
		<>
			<div className="post-detail-comment-container"
				data-e2e={`comment-${comment.id}`}>

				<div className="post-detail-commnet-inner-container">

					{/* OP and contents */}
					<div className="post-detail-comment-body">

						<p>
							{comment.author_name} - <RelativeDate date={comment.created_at} />
						</p>

						<div className="post-detail-comment-content"
							data-e2e="comment-content">
							{comment.content}
						</div>

					</div>

					{/* Toggle reply form */}
					{
						isCommenting === false &&
						<div className="ml-4">
							<button data-e2e="post-detail-comment-form-toggle-button"
								disabled={!session}
								onClick={() => setIsCommenting(!isCommenting)}>
								Reply
							</button>
						</div>
					}

					{/* Reply form */}
					{
						session?.user &&
						comment &&
						isCommenting &&
						<CreateComment
							parent={comment}
							onSuccess={() => {

								setIsCommenting(false);

								if(onAddComment) {
									onAddComment()
								}

							}}
							onCancel={() => setIsCommenting(false)} />
					}

					{/* Children */}
					{
						comment.comments &&
						<ul>
							{
								comment.comments.map(comment => (
									<li key={comment.id}>
										<CommentView
											comment={comment}
											onAddComment={onAddComment} />
									</li>
								))
							}
						</ul>
					}

				</div>

			</div>
		</>
	)

}
