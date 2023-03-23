import { PostComment, PostDetailData } from "../types/post"

import { RelativeDate } from "./RelativeDate";
import { CommentView } from "./CommentView";

type PostPresentationProps = {
	postDetailData: PostDetailData;
	nestedComments: PostComment[];
}

export function PostPresentation({
	postDetailData,
	nestedComments,
}: PostPresentationProps)
{

	return (
		<div className="post-detail-outer-container">
			<div className="post-detail-inner-container">

				<div className="post-detail-body">

					{/* OP */}
					<p>
						Posted by {postDetailData.post?.author_name}{' '}
						{
							postDetailData.post &&
							<RelativeDate date={postDetailData.post?.created_at} />
						}
					</p>

					{/* Post title */}
					<h3 className="text-2xl">{postDetailData.post?.title}</h3>

					{/* Post body */}
					<p className="post-detail-content" data-e2e="post-content">
						{postDetailData.post?.content}
					</p>

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
