import { execSync } from 'child_process'

import detect from 'detect-port'

export const setupE2ETests = async () => {

	await restartSupabase();

	reseedDatabase();

}

const restartSupabase = async () => {

	const port = await detect(64321);

	if (port !== 64321) {
		return;
	}

	console.warn(`Fould not locate running Supabase instance. Restarting Supabase...`);

	execSync(`npx supabase start`);

}

const reseedDatabase = () => {

	execSync(
		'PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 64322 -f supabase/clear-db-data.sql',
		{
			stdio: 'ignore',
		}
	)

}
