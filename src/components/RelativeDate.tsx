import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

type RelativeDateProps = {
	date: Date | string | number;
}

export function RelativeDate({ date }: RelativeDateProps) {

	let normalizedDate = date;

	if(!(date instanceof Date)) {
		normalizedDate = new Date(date);
	}

	return (
		<span>{`${timeAgo.format(normalizedDate as Date)}`}</span>
	)

}