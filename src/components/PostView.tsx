import React from "react"

import { useParams } from "react-router-dom"

import { PostDetailData, PostUrlParams } from "../types/post"

import useSession from "../hooks/useSession"

import { getNestedComments, getPostDetails } from "../utils/post"

import { PostPresentation } from "./PostPresentation"

export default function PostView() {

	const params = useParams() as PostUrlParams

	const { session } = useSession()

	const [postDetailData, setPostDetailData] = React.useState<PostDetailData>({
		post: null,
		comments: [],
	})

	const [bumper, setBumper] = React.useState<number>(0);

	// @TODO(mzalla) Perf profiling (check how many times this useMemo is invoked)

	const nestedComments = React.useMemo(
		() => {

			const { comments } = postDetailData

			const nestedComments = getNestedComments(comments);

			return nestedComments

		},
		[postDetailData]
	)

	React.useEffect(
		() => {

			getPostDetails({ session, params })
				.then(data => {
					if(data) {
						setPostDetailData(data)
					}
				})

		},
		[session, params, bumper]
	)

	return (
		<PostPresentation
			postDetailData={postDetailData}
			session={session}
			nestedComments={nestedComments}
			setBumper={setBumper} />
	)

}
