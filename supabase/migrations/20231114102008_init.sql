create sequence "public"."Song_id_seq";

create sequence "public"."TagMap_id_seq";

create sequence "public"."Tag_id_seq";

create table "public"."Song" (
    "id" integer not null default nextval('"Song_id_seq"'::regclass),
    "title" text not null,
    "artist" text not null,
    "rank" text not null,
    "memo" text,
    "key" text not null
);


create table "public"."Tag" (
    "id" integer not null default nextval('"Tag_id_seq"'::regclass),
    "name" text not null
);


create table "public"."TagMap" (
    "id" integer not null default nextval('"TagMap_id_seq"'::regclass),
    "songId" integer not null,
    "tagId" integer not null
);


create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
);


alter sequence "public"."Song_id_seq" owned by "public"."Song"."id";

alter sequence "public"."TagMap_id_seq" owned by "public"."TagMap"."id";

alter sequence "public"."Tag_id_seq" owned by "public"."Tag"."id";

CREATE UNIQUE INDEX "Song_pkey" ON public."Song" USING btree (id);

CREATE UNIQUE INDEX "TagMap_pkey" ON public."TagMap" USING btree (id);

CREATE UNIQUE INDEX "Tag_pkey" ON public."Tag" USING btree (id);

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

alter table "public"."Song" add constraint "Song_pkey" PRIMARY KEY using index "Song_pkey";

alter table "public"."Tag" add constraint "Tag_pkey" PRIMARY KEY using index "Tag_pkey";

alter table "public"."TagMap" add constraint "TagMap_pkey" PRIMARY KEY using index "TagMap_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";


