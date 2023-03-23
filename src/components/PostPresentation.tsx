import { PostComment, PostDetailData } from "../types/post"

import { RelativeDate } from "./RelativeDate";

type PostPresentationProps = {
	postDetailData: PostDetailData;
}

export function PostPresentation({
	postDetailData,
}: PostPresentationProps)
{

	return (
		<div className="post-detail-outer-container">
			<div className="post-detail-inner-container">

				<div className="post-detail-body">

					<p>
						Posted by {postDetailData.post?.author_name}{' '}
						{
							postDetailData.post &&
							<RelativeDate date={postDetailData.post?.created_at} />
						}
					</p>

					<h3 className="text-2xl">{postDetailData.post?.title}</h3>

					<p className="post-detail-content" data-e2e="post-content">
						{postDetailData.post?.content}
					</p>

				</div>

			</div>
		</div>
	)

}
