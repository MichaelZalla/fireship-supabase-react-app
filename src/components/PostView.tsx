import React from "react"

import { useParams } from "react-router-dom"

import { PostDetailData, PostUrlParams } from "../types/post"

import useSession from "../hooks/useSession"

import { getPostDetails } from "../utils/post"

export default function PostView() {

	const params = useParams() as PostUrlParams

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
