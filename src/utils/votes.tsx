import { VoteMap } from "../types/vote";

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