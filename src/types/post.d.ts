import { GetSinglePostWithCommentResponse } from './rpc';

export type Post = {
	id: string;
	author_name: string;
	title: string;
	content: string;
	score: number;
	created_at: string;
	path: string;
}

export type PostDetailData = {
	post: GetSinglePostWithCommentResponse|null;
	comments: GetSinglePostWithCommentResponse[];
	userVotes?: VoteMap;
}

export type PostUrlParams = { postId: string }

export type PostMap = Record<string, Post>
