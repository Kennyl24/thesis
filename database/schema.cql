DROP KEYSPACE IF EXISTS netflixevents;

CREATE KEYSPACE netflixevents with replication = {'class' : 'SimpleStrategy', 'replication_factor' : 3 };

USE netflixevents;

DROP TABLE IF EXISTS activeDrivers;

CREATE TABLE netflixevents.search (
    user_id uuid PRIMARY KEY,
    posted_date text,
    region text,
    search_term text
)
CREATE TABLE netflixevents.watched_videos (
    user_id uuid PRIMARY KEY,
    category text,
    minutes int,
    movie_id text,
    posted_date text,
    region text
)

CREATE TABLE netflixevents.logout (
    user_id uuid PRIMARY KEY,
    log text,
    posted_date text,
    region text
)
CREATE TABLE netflixevents.dailyratios (
    date uuid text PRIMARY KEY,
    ratiolog text
)
CREATE TABLE netflixevents.login (
    user_id uuid PRIMARY KEY,
    log text,
    posted_date text,
    region text
)
CREATE TABLE netflixevents.minutesWatched (
    date uuid text PRIMARY KEY,
    minutesLog text
)