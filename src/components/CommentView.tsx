import { PostComment } from "../types/post";
import { RelativeDate } from "./RelativeDate";

type CommentViewProps = {
	comment: PostComment;
}

export function CommentView({
	comment
}: CommentViewProps)
{

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

					{/* Children */}
					{
						comment.comments &&
						<ul>
							{
								comment.comments.map(comment => (
									<li key={comment.id}>
										<CommentView comment={comment} />
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
