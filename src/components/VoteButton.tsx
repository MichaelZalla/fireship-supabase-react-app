import React from "react";

import { VoteType } from "../types/vote";

type VoteButtonProps = {
	direction: VoteType;
	enabled?: boolean;
	filled?: boolean|null;
	onClick?: () => void;
}

export function VoteButton({
	direction = `up`,
	enabled = true,
	filled = false,
	onClick = () => {},
}: VoteButtonProps) {

	const svgClasses = React.useMemo(
		() => {

			const classes = [];

			if(direction === `down`) {
				classes.push(`origin-center rotate-180`)
			}

			if(filled) {
				classes.push(direction === `up` ? `fill-green-400` : `fill-red-400`)
				classes.push(`glow`)
			}

			if(enabled === false) {
				classes.push(`opacity-50`)
			}

			return classes.join(` `)

		},
		[direction, enabled, filled]
	)

	return (
		<button role="button"
			data-e2e={`${direction}-vote-button`}
			data-filled={filled}
			disabled={!enabled}
			onClick={(e) => {

				e.preventDefault();

				onClick();

			}}>

			<svg className={svgClasses}
				width="24px"
				height="24px"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg">

				<path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />

			</svg>

		</button>
	)

}