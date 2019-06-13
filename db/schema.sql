-- We assume there are existing tables from the EiFFeL app: users, jackets, and photos

drop table if exists oauth_tokens;
drop table if exists queue_items;
drop table if exists seen_jackets;

create table oauth_tokens (
    provider varchar(16) primary key,
    accessToken varchar(256) not null,
    expiry int8 not null,
    refreshToken varchar(256) not null,
    raw varchar(2048) not null
);

create table queue_items (
    qid int4 not null,
    jid int4 not null references jackets(jid),
    primary key(qid, jid)
);

create table seen_jackets (
    jid int4 primary key references jackets(jid),
    seen int8 not null
);
