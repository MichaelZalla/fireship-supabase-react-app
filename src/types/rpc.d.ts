export interface GetPostsResponse {
	created_at: string;
	id: string;
	score: number;
	title: string;
	user_id: string;
	username: string;
}

export interface GetSinglePostWithCommentResponse {
	author_name: string;
	content: string;
	created_at: string;
	id: string;
	path: string;
	score: number;
	title: string;
}
