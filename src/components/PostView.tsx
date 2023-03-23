import React from "react"

import { useParams } from "react-router-dom"

import { VoteMap } from "../types/vote"
import { GetSinglePostWithCommentResponse } from "../types/rpc"

import useSession, { IAppUserInfo } from "../hooks/useSession"

import client from "../utils/client"
import { getVoteMapFromVotes } from "../utils/votes"

type PostDetailData = {
	post: GetSinglePostWithCommentResponse|null;
	comments: GetSinglePostWithCommentResponse[];
	userVotes?: VoteMap;
}

type PostViewParams = { postId: string }

const getPostDetails = async ({
	session,
	params: { postId }
}: {
	session: IAppUserInfo[`session`],
	params: PostViewParams
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

export default function PostView() {

	const params = useParams() as PostViewParams

	const { session } = useSession()

	const [postDetailData, setPostDetailData] = React.useState<PostDetailData>({
		post: null,
		comments: [],
	})

	React.useEffect(
		() => {

			getPostDetails({ session, params })
				.then(data => {
					if(data) {
						setPostDetailData(data)
					}
				})

		},
		[session, params]
	)

	return (
		<>
			{
				postDetailData.post &&
				<>
					<h2>{postDetailData.post.title}</h2>
					<span>{postDetailData.post.author_name} created at {postDetailData.post.created_at}</span>
					<p>{postDetailData.post.content}</p>
				</>
			}
		</>
	)

}
