import {
	PostComment,
	PostCommentMap,
	PostDetailData,
	PostMap,
	PostUrlParams,
} from "../types/post"

import { GetSinglePostWithCommentResponse } from "../types/rpc"

import { IAppUserInfo } from "../hooks/useSession"

import client from "./client"
import { getVoteMapFromVotes } from "./votes"

export const getPostDetails = async ({
	session,
	params: { postId }
}: {
	session: IAppUserInfo[`session`],
	params: PostUrlParams
}): Promise<PostDetailData> => {

	const { data: posts, error } = await client
		.rpc(`get_single_post_with_comments`, { post_id: postId })
		.select(`*`)

	if(error || !posts || posts.length === 0) {
		throw new Error(`Post not found.`)
	}

	const postMap: PostMap = posts.reduce(
		(postMap, post) => {
			postMap[post.id] = post
			return postMap
		},
		{} as PostMap
	)

	const post = postMap[postId]

	const comments: GetSinglePostWithCommentResponse[] =
		(posts as GetSinglePostWithCommentResponse[])
			.filter(post => post.id !== postId)

	if(!session?.user) {
		return { post, comments }
	}

	const { data: voteData } = await client
		.from(`post_votes`)
		.select(`*`)
		.eq(`user_id`, session.user.id);

	if(!voteData) {
		return { post, comments }
	}

	const userVotes = getVoteMapFromVotes(voteData)

	return { post, comments, userVotes }

}

const convertToUuid = (
	path: string): string =>
{
	return path.replaceAll('_', '-')
}

const rootless = (
	path: string): string =>
{
	return path.replace('root.', '')
}

const getPathDepth = (
	path: string): number =>
{
	return rootless(path).split('.').filter(s => Boolean).length
}

const getParent = (
	path: string,
	map: PostCommentMap): PostComment =>
{

	const parentId = rootless(path).split('.').slice(-1)[0];

	const parent = map[convertToUuid(parentId)];

	if(!parent) {
		throw new Error(`Failed to find parent for path ${path}!`);
	}

	return parent

}

export const getNestedComments = (
	comments: PostComment[]): PostComment[] =>
{

	const result: PostComment[] = []

	const commentMap: PostCommentMap = comments.reduce(
		(commentMap, comment) => {

			commentMap[comment.id] = {
				...comment,
				comments: [],
			}

			return commentMap

		},
		{} as PostCommentMap
	)

	const commentsSorted = [
		...Object.values(commentMap)
	].sort(
		(a, b) => {

			const aDepth: number = getPathDepth(a.path);
			const bDepth: number = getPathDepth(b.path);

			return aDepth > bDepth ?
				1 :
				aDepth < bDepth ?
					-1 :
					(
						+(new Date(a.created_at)) - +(new Date(b.created_at))
					)

		}
	)

	for(const post of commentsSorted) {

		let parentComments = !!(getPathDepth(post.path) === 1) ?
			result :
			getParent(post.path, commentMap).comments;

		parentComments?.push(post)

	}

	return result

}
