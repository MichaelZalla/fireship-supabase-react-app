import React from "react";

import { RealtimeChannel, Session } from "@supabase/supabase-js";

import client from "../utils/client";

export interface IAppUserProfile {
	username: string;
	avatarUrl?: string;
}

export interface IAppUserInfo {
	session: Session|null;
	profile: IAppUserProfile|null;
}

const useSession = () => {

	const [userInfo, setUserInfo] = React.useState<IAppUserInfo>({
		session: null,
		profile: null,
	})

	const [channel, setChannel] = React.useState<RealtimeChannel|null>(null)

	// Initial side-effect

	React.useEffect(
		() => {

			client.auth
				.getSession()
				.then(({ data: { session } }) => {

					setUserInfo({ ...userInfo, session })

					client.auth
						.onAuthStateChange((_event, session) => {
							setUserInfo({ session, profile: null })
						})

				})

		},
		[]
	)

	// Sets up a realtime channel so we can listen to changes to user

	React.useEffect(
		() => {

			if(
				userInfo.session?.user &&
				!userInfo.profile
			) {

				listenToUserProfileChanges(userInfo.session.user.id)
					.then(newChannel => {

						if(channel) {
							channel.unsubscribe()
						}

						setChannel(newChannel)

					})

			} else if(!userInfo.session?.user) {

				channel?.unsubscribe()

				setChannel(null)

			}

		},
		[userInfo.session]
	)

	//

	const listenToUserProfileChanges = React.useCallback(
		async (userId: string): Promise<RealtimeChannel> => {

			const { data } = await client
				.from('user_profiles')
				.select('*')
				.filter('user_id', 'eq', userId)

			if(data?.[0]) {
				setUserInfo({
					...userInfo,
					profile: data?.[0]
				})
			}

			return client.channel(`public:user_profiles`)
				.on(
					'postgres_changes',
					{
						event: `*`,
						schema: `public`,
						table: `user_profiles`,
						filter: `user_id=eq.${userId}`,
					},
					payload => {
						setUserInfo({
							...userInfo,
							profile: payload.new as IAppUserProfile
						})
					}
				)
				.subscribe()

		},
		[userInfo, setUserInfo]
	)

	return userInfo

}

export default useSession
