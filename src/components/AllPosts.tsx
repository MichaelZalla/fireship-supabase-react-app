import React from "react"

import { useParams } from "react-router-dom"

import { GetPostsResponse } from "../types/rpc"
import { VoteMap } from "../types/vote"

import useSession from "../hooks/useSession"

import client from "../utils/client"

import { Post } from "./Post"
import { CreatePost } from "./CreatePost"

const getUserVotes = (
	userId: string) =>
{

	return client
		.from(`post_votes`)
		.select('*')
		.eq('user_id', userId)
		.then(({ data: votesData }) => {

			if (!votesData) {
				return;
			}

			const votes = votesData.reduce(
				(acc, vote) => {

					acc[vote.post_id] = vote.vote_type as any;

					return acc;

				},
				{} as VoteMap
			);

			return votes

		})

}

export default function AllPosts() {

	const { pageNumber } = useParams()

	const { session } = useSession()

	const [posts, setPosts] = React.useState<GetPostsResponse[]>([]);

	const [bumper, setBumper] = React.useState<number>(0);

	const [userVotes, setUserVotes] = React.useState<VoteMap|undefined>({});

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

					if(session?.user) {
						getUserVotes(session.user.id)
							.then(votes => setUserVotes(votes))
					}

				})

		},
		[session, setPosts, setUserVotes, pageNumber, bumper]
	)

	return (
		<>

			{
				session?.user &&
				<CreatePost onNewPostCreated={() => {
					setBumper(bumper + 1);
				}} />
			}

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
