import React from "react"

import { useParams } from "react-router-dom"

import { GetPostsResponse } from "../types/rpc"

import client from "../utils/client"

import { Post } from "./Post"
import { CreatePost } from "./CreatePost"

export default function AllPosts() {

	const { pageNumber } = useParams()

	const [posts, setPosts] = React.useState<GetPostsResponse[]>([])

	React.useEffect(
		() => {

			const queryPageNumber = pageNumber ?
				+pageNumber :
				1;

			client
				.rpc(`get_posts`, {
					page_number: queryPageNumber
				})
				.select('*')
				.then(({ data }) => {

					setPosts(data as GetPostsResponse[])

				})

		},
		[setPosts, pageNumber]
	)

	return (
		<>

			<CreatePost />

			<div className="posts-container">
				{
					posts.length ?
						<ul>
							{
								posts.map((post) => (
									<li key={post.id}>
										<Post postData={post} />
									</li>
								))
							}
						</ul> :
						<p>No one has created a post yet.</p>
				}
			</div>

		</>
	)

}
