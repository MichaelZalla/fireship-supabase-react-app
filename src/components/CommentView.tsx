import React from "react";

import { PostComment } from "../types/post";
import { VoteMap, VoteType } from "../types/vote";

import useSession from "../hooks/useSession";
import { usePostScore } from "../hooks/usePostScore";

import { castVote } from "../utils/votes";

import { RelativeDate } from "./RelativeDate";
import { CreateComment } from "./CreateComment";
import { VoteButton } from "./VoteButton";

type CommentViewProps = {
	comment: PostComment;
	userVotes?: VoteMap;
	onAddComment?: () => void;
	onCastVote?: () => void;
}

export function CommentView({
	comment,
	userVotes,
	onAddComment,
	onCastVote,
}: CommentViewProps)
{

	const { session } = useSession()

	const score = usePostScore(
		comment?.id || ``,
		comment?.score
	)

	const [isCommenting, setIsCommenting] = React.useState<boolean>(false)

	const onClickUpvote = React.useCallback(
		(voteType: VoteType) => {

			if(
				!comment ||
				!session
			)
			{
				return;
			}

			castVote({
				postId: comment.id,
				userId: session.user.id,
				voteType,
			})
			.then(() => {

				if(onCastVote) {
					onCastVote()
				}

			})

		},
		[comment, session, onCastVote]
	)

	return (
		<>
			<div className="post-detail-comment-container"
				data-e2e={`comment-${comment.id}`}>

				<div className="post-detail-comment-inner-container">

					{/* Comment score and vote buttons */}
					<div className="post-detail-comment-upvote-container">

						<VoteButton direction="up"
							enabled={!!session}
							filled={
								comment &&
								userVotes &&
								userVotes[comment.id] === `up`
							}
							onClick={() => onClickUpvote(`up`)} />

						<p className="text-center" data-e2e="upvote-count">
							{score}
						</p>

						<VoteButton direction="down"
							enabled={!!session}
							filled={
								comment &&
								userVotes &&
								userVotes[comment.id] === `down`
							}
							onClick={() => onClickUpvote(`down`)} />

					</div>

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
											userVotes={userVotes}
											onAddComment={onAddComment}
											onCastVote={onCastVote} />
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
