import { GetSinglePostWithCommentResponse } from './rpc';

export type PostDetailData = {
	post: GetSinglePostWithCommentResponse|null;
	comments: GetSinglePostWithCommentResponse[];
	userVotes?: VoteMap;
}

export type PostUrlParams = { postId: string }
