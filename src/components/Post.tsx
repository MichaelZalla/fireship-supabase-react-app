import { GetPostsResponse } from "../types/rpc";
import { VoteType } from "../types/vote";

import useSession from "../hooks/useSession";
import { usePostScore } from "../hooks/usePostScore";

import { VoteButton } from "./VoteButton";
import React from "react";
import { castVote } from "../utils/votes";

export function Post({
	postData,
	userVote,
	setBumper,
}: {
	postData: GetPostsResponse;
	userVote?: VoteType;
	setBumper: (bumper: React.SetStateAction<number>) => void;
})
{

	const { session } = useSession()

	const post = postData;

	const score = usePostScore(
		post?.id || ``,
		post?.score
	)

	const onClickUpvote = React.useCallback(
		async (voteType: VoteType) => {

			if(
				!post ||
				!session
			)
			{
				return;
			}

			const { error } = await castVote({
				postId: post.id,
				userId: session.user.id,
				voteType,
			})

			if(error) {
				return;
			}

			setBumper((bumper: number) => bumper + 1)

		},
		[post, session]
	)

	return (
		<div className="post-container">

			<div className="post-upvote-container">

				<VoteButton direction="up"
					filled={userVote === 'up'}
					enabled={!!(session)}
					onClick={() => onClickUpvote(`up`)} />

				<p className="text-center" data-e2e="upvote-count">
					{score}
				</p>

				<VoteButton direction="down"
					filled={userVote === 'down'}
					enabled={!!(session)}
					onClick={() => onClickUpvote(`down`)} />

			</div>

			 <p className="mt-4">
				Posted by {postData.username}
			 </p>

			 <h3 className="text-2xl">{postData.title}</h3>

		</div>
	)

}