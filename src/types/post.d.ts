import { GetSinglePostWithCommentResponse } from './rpc';

type Postlike = {
	id: string;
	author_name: string;
	content: string;
	score: number;
	created_at: string;
	path: string;
}

export type Post = Postlike & {
	title: string;
}

export type PostComment = Postlike & {
	comments?: PostComment[];
}

export type PostDetailData = {
	post: GetSinglePostWithCommentResponse|null;
	comments: GetSinglePostWithCommentResponse[];
	userVotes?: VoteMap;
}

export type PostUrlParams = { postId: string }

export type PostMap = Record<string, Post>
export type PostCommentMap = Record<string, PostComment>
