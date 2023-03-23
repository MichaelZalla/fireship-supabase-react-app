import React from "react";

import { RealtimeChannel } from "@supabase/supabase-js";

import client from "../utils/client";

export function usePostScore(
	postId: string,
	initialScore?: number)
{

	const [score, setScore] = React.useState<number|undefined>(initialScore);

	const [sub, setSub] = React.useState<RealtimeChannel|undefined>(undefined);

	React.useEffect(
		() => {

			if(
				typeof score === `undefined` &&
				typeof initialScore !== `undefined`
			)
			{
				setScore(initialScore)
			}

			if(!sub && postId)
			{
				setSub(
					client
						.channel(`post_${postId}_score`)
						.on(
							`postgres_changes`,
							{
								event: `*`,
								schema: `public`,
								table: `post_score`,
								filter: `post_id=eq.${postId}`
							},
							(payload) => {
								setScore(
									(payload.new as { score: number }).score
								);
							}
						)
						.subscribe()

				)
			}

			return () => {
				sub?.unsubscribe()
			}

		},
		[postId]
	)

	return score;

}
