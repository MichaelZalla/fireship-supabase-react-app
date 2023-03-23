import React from "react";

import { Session } from "@supabase/supabase-js";

import { VoteType } from "../types/vote";
import { PostComment, PostDetailData } from "../types/post"

import { castVote } from "../utils/votes";

import { RelativeDate } from "./RelativeDate";
import { CommentView } from "./CommentView";
import { CreateComment } from "./CreateComment";
import { VoteButton } from "./VoteButton";

type PostPresentationProps = {
	postDetailData: PostDetailData;
	session: Session|null;
	nestedComments: PostComment[];
	setBumper: (bumper: number | ((value: number) => void)) => void;
}

export function PostPresentation({
	postDetailData,
	session,
	nestedComments,
	setBumper,
}: PostPresentationProps)
{

	const { post, userVotes } = postDetailData

	const [isCommenting, setIsCommenting] = React.useState<boolean>(false)

	const onClickUpvote = React.useCallback(
		(voteType: VoteType) => {

			if(
				!postDetailData.post ||
				!session
			)
			{
				return;
			}

			castVote({
				postId: postDetailData.post.id,
				userId: session.user.id,
				voteType,
			})
			.then(() => setBumper(bumper => bumper + 1))

		},
		[postDetailData, session, setBumper]
	)

	return (
		<div className="post-detail-outer-container">
			<div className="post-detail-inner-container">

				<div className="post-detail-upvote-container">

					<VoteButton direction="up"
						enabled={!!session}
						filled={
							post &&
							userVotes &&
							userVotes[post.id] === `up`
						}
						onClick={() => onClickUpvote(`up`)} />

					<VoteButton direction="down"
						enabled={!!session}
						filled={
							post &&
							userVotes &&
							userVotes[post.id] === `down`
						}
						onClick={() => onClickUpvote(`down`)} />

				</div>

				<div className="post-detail-body">

					{/* OP */}
					<p>
						Posted by {post?.author_name}{' '}
						{
							post &&
							<RelativeDate date={post?.created_at} />
						}
					</p>

					{/* Post title */}
					<h3 className="text-2xl">{post?.title}</h3>

					{/* Post body */}
					<p className="post-detail-content" data-e2e="post-content">
						{post?.content}
					</p>

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
						post &&
						isCommenting &&
						<CreateComment
							parent={post}
							onSuccess={() => setBumper((bumper: number) => bumper + 1 ) }
							onCancel={() => setIsCommenting(false)} />
					}

					{/* Nested comments */}
					<ul>
						{
							nestedComments.map(comment => (
								<li key={comment.id}>
									<CommentView
										comment={comment}
										onAddComment={
											() => setBumper((bumper: number) => bumper + 1 )
										} />
								</li>
							))
						}
					</ul>

				</div>

			</div>
		</div>
	)

}
