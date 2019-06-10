-- We assume there are existing tables from the EiFFeL app: users, jackets, and photos

drop table if exists queue_items;
drop table if exists seen_jackets;

create table queue_items (
    qid int4 not null,
    jid int4 not null references jackets(jid),
    primary key(qid, jid)
);

create table seen_jackets (
    jid int4 primary key references jackets(jid),
    seen int8 not null
);
