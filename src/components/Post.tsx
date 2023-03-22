import { GetPostsResponse } from "../types/rpc";

export function Post({
	postData
}: {
	postData: GetPostsResponse;
})
{

	return (
		<div className="post-container">
			 <p className="mt-4">
				Posted by {postData.username}
			 </p>
			 <h3 className="text-2xl">{postData.title}</h3>
		</div>
	)

}