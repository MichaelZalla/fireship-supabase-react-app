import { PostDetailData, PostUrlParams } from "../types/post"
import { GetSinglePostWithCommentResponse } from "../types/rpc"

import { IAppUserInfo } from "../hooks/useSession"

import client from "./client"
import { getVoteMapFromVotes } from "./votes"

export const getPostDetails = async ({
	session,
	params: { postId }
}: {
	session: IAppUserInfo[`session`],
	params: PostUrlParams
}): Promise<PostDetailData> => {

	const { data: posts, error } = await client
		.rpc(`get_single_post_with_comments`, { post_id: postId })
		.select(`*`)

	if(error || !posts || posts.length === 0) {
		throw new Error(`Post not found.`)
	}

	const post = (posts as GetSinglePostWithCommentResponse[])[0]

	const comments: GetSinglePostWithCommentResponse[] = []

	if(!session?.user) {
		return { post, comments }
	}

	const { data: voteData } = await client
		.from(`post_votes`)
		.select(`*`)
		.eq(`user_id`, session.user.id);

	if(!voteData) {
		return { post, comments }
	}

	const userVotes = getVoteMapFromVotes(voteData)

	return { post, comments, userVotes }

}
