import React from "react"

import { useParams } from "react-router-dom"

import { GetSinglePostWithCommentResponse } from "../types/rpc"

import useSession, { IAppUserInfo } from "../hooks/useSession"

import client from "../utils/client"

type PostDetailData = {
	post: GetSinglePostWithCommentResponse|null;
	comments: GetSinglePostWithCommentResponse[];
}

type PostViewParams = { postId: string }

const getPostDetails = async ({
	params: { postId }
}: {
	params: PostViewParams
}): Promise<PostDetailData> => {

	const { data, error } = await client
		.rpc(`get_single_post_with_comments`, { post_id: postId })
		.select(`*`)

	if(error || !data || data.length === 0) {
		throw new Error(`Post not found.`)
	}

	const post = (data as GetSinglePostWithCommentResponse[])[0]

	return {
		post,
		comments: [],
	}

}

export default function PostView() {

	const params = useParams() as PostViewParams

	const [postDetailData, setPostDetailData] = React.useState<PostDetailData>({
		post: null,
		comments: [],
	})

	React.useEffect(
		() => {

			getPostDetails({ params })
				.then(data => {
					if(data) {
						setPostDetailData(data)
					}
				})

		},
		[params]
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
