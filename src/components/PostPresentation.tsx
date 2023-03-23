import React from "react";

import { Session } from "@supabase/supabase-js";

import { PostComment, PostDetailData } from "../types/post"

import { RelativeDate } from "./RelativeDate";
import { CommentView } from "./CommentView";
import { CreateComment } from "./CreateComment";

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

	const { post } = postDetailData

	const [isCommenting, setIsCommenting] = React.useState<boolean>(false)

	return (
		<div className="post-detail-outer-container">
			<div className="post-detail-inner-container">

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
