import { VoteMap, VoteType } from "../types/vote";

import client from "./client";

type VotesData = {
    id: string;
    post_id: string;
    user_id: string;
    vote_type: string;
}[] | null

export function getVoteMapFromVotes(
	data: VotesData): VoteMap
{

	if(!data) {
		return {}
	}

	return data.reduce(
		(voteMap, vote) => {

			voteMap[vote.post_id] = vote.vote_type as any;

			return voteMap;

		},
		{} as VoteMap
	)

}

export const castVote = async ({
	postId,
	userId,
	voteType
}: {
	postId: string,
	userId: string,
	voteType: VoteType,
}) =>
{

	return client
		.from(`post_votes`)
		.upsert(
			{
				post_id: postId,
				user_id: userId,
				vote_type: voteType
			},
			{
				onConflict: `post_id,user_id`
			}
		);

}
