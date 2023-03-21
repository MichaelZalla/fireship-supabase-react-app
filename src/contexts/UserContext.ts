import React from "react"

import { IAppUserInfo } from "../hooks/useSession"

const UserContext = React.createContext<IAppUserInfo>({
	session: null,
	profile: null,
})

export default UserContext
