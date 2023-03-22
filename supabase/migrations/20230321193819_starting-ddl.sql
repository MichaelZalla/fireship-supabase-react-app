create extension ltree;

-- Creates tables for our data model

create table user_profiles (
	user_id uuid primary key references auth.users (id) not null,
	username text unique not null
	CONSTRAINT proper_username CHECK (username ~* '^[a-zA-Z0-9_]+$')
	CONSTRAINT username_length CHECK (char_length(username) > 3 and char_length(username) < 15)
);

create table posts (
	id uuid primary key default uuid_generate_v4() not null,
	user_id uuid references auth.users (id) not null,
	created_at timestamp with time zone default now() not null,
	path ltree not null
);

create table post_score (
	post_id uuid primary key references posts (id) not null,
	score int not null
);

create table post_contents (
	id uuid primary key default uuid_generate_v4() not null,
	user_id uuid references auth.users (id) not null,
	post_id uuid references posts (id) not null,
	title text,
	content text,
	created_at timestamp with time zone default now() not null
);

create table post_votes (
	id uuid primary key default uuid_generate_v4() not null,
	user_id uuid references auth.users (id) not null,
	post_id uuid references posts (id) not null,
	vote_type text not null,
	unique (post_id, user_id)
);

-- Initialize post scores (function and function trigger)

create function initialize_post_score()
returns trigger
language plpgsql
security definer
set search_path = public
as $initialize_post_score$
begin
	insert into post_score (post_id, score)
	values (new.id, 0);
	return new;
end;$initialize_post_score$;

create trigger initialize_post_score
	after insert
	on posts
	for each row execute procedure initialize_post_score();

-- Enables RLS for tables

alter table user_profiles enable row level security;
alter table posts enable row level security;
alter table post_contents enable row level security;
alter table post_score enable row level security;
alter table post_votes enable row level security;

-- Creates security policies (user_profiles)

CREATE POLICY "everyone can read profiles" on "public"."user_profiles"
AS PERMISSIVE FOR SELECT
TO public
USING(true);

CREATE POLICY "users can only create their own profile" ON "public"."user_profiles"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profile owners can update their profile" ON "public"."user_profiles"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Creates security policies (posts)

CREATE POLICY "everyone can read posts" ON "public"."posts"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "users can only create their own posts" ON "public"."posts"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid()=user_id);

-- Creates security policies (post_contents)

CREATE POLICY "everyone can read post contents" ON "public"."post_contents"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "post authors can create contents for their post" ON "public"."post_contents"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid()=user_id);

-- Creates security policies (post_scores)

CREATE POLICY "everyone can read post scores" ON "public"."post_score"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Creates security policies (post_votes)

CREATE POLICY "everyone can read post votes" ON "public"."post_votes"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "users can only create their own votes" ON "public"."post_votes"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid()=user_id);

CREATE POLICY "vote owners can update their vote" ON "public"."post_votes"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid()=user_id)
WITH CHECK (auth.uid()=user_id);

-- Recreates publication (replication set) for post_score table;
-- See: https://www.postgresql.org/docs/current/logical-replication-publication.html

BEGIN;

DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;

CREATE PUBLICATION supabase_realtime WITH ( publish = 'insert, update, delete' );

ALTER PUBLICATION supabase_realtime ADD TABLE post_score;

COMMIT;
