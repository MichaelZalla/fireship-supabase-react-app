import { Session } from "@supabase/supabase-js";

import { PostComment, PostDetailData } from "../types/post"

import { RelativeDate } from "./RelativeDate";
import { CommentView } from "./CommentView";
import { CreateComment } from "./CreateComment";

type PostPresentationProps = {
	postDetailData: PostDetailData;
	session: Session|null;
	nestedComments: PostComment[];
}

export function PostPresentation({
	postDetailData,
	session,
	nestedComments,
}: PostPresentationProps)
{

	const { post } = postDetailData

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

					{/* Comment form */}
					{
						session?.user &&
						post &&
						<CreateComment parent={post} />
					}

					{/* Nested comments */}
					<ul>
						{
							nestedComments.map(comment => (
								<li key={comment.id}>
									<CommentView comment={comment} />
								</li>
							))
						}
					</ul>

				</div>

			</div>
		</div>
	)

}
