--
-- PostgreSQL database dump
--

\restrict 51vkxKI75MiI6CMgf2y62eXR92ieGCdzpHTxkHN7LwETgocVlkpE4GdWzmRFl2g

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hangfire; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hangfire;


ALTER SCHEMA hangfire OWNER TO postgres;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aggregatedcounter; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.aggregatedcounter (
    id bigint NOT NULL,
    key text NOT NULL,
    value bigint NOT NULL,
    expireat timestamp with time zone
);


ALTER TABLE hangfire.aggregatedcounter OWNER TO postgres;

--
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.aggregatedcounter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.aggregatedcounter_id_seq OWNER TO postgres;

--
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.aggregatedcounter_id_seq OWNED BY hangfire.aggregatedcounter.id;


--
-- Name: counter; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.counter (
    id bigint NOT NULL,
    key text NOT NULL,
    value bigint NOT NULL,
    expireat timestamp with time zone
);


ALTER TABLE hangfire.counter OWNER TO postgres;

--
-- Name: counter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.counter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.counter_id_seq OWNER TO postgres;

--
-- Name: counter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.counter_id_seq OWNED BY hangfire.counter.id;


--
-- Name: hash; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.hash (
    id bigint NOT NULL,
    key text NOT NULL,
    field text NOT NULL,
    value text,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.hash OWNER TO postgres;

--
-- Name: hash_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.hash_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.hash_id_seq OWNER TO postgres;

--
-- Name: hash_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.hash_id_seq OWNED BY hangfire.hash.id;


--
-- Name: job; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.job (
    id bigint NOT NULL,
    stateid bigint,
    statename text,
    invocationdata jsonb NOT NULL,
    arguments jsonb NOT NULL,
    createdat timestamp with time zone NOT NULL,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.job OWNER TO postgres;

--
-- Name: job_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.job_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.job_id_seq OWNER TO postgres;

--
-- Name: job_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.job_id_seq OWNED BY hangfire.job.id;


--
-- Name: jobparameter; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.jobparameter (
    id bigint NOT NULL,
    jobid bigint NOT NULL,
    name text NOT NULL,
    value text,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.jobparameter OWNER TO postgres;

--
-- Name: jobparameter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.jobparameter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.jobparameter_id_seq OWNER TO postgres;

--
-- Name: jobparameter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.jobparameter_id_seq OWNED BY hangfire.jobparameter.id;


--
-- Name: jobqueue; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.jobqueue (
    id bigint NOT NULL,
    jobid bigint NOT NULL,
    queue text NOT NULL,
    fetchedat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.jobqueue OWNER TO postgres;

--
-- Name: jobqueue_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.jobqueue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.jobqueue_id_seq OWNER TO postgres;

--
-- Name: jobqueue_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.jobqueue_id_seq OWNED BY hangfire.jobqueue.id;


--
-- Name: list; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.list (
    id bigint NOT NULL,
    key text NOT NULL,
    value text,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.list OWNER TO postgres;

--
-- Name: list_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.list_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.list_id_seq OWNER TO postgres;

--
-- Name: list_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.list_id_seq OWNED BY hangfire.list.id;


--
-- Name: lock; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.lock (
    resource text NOT NULL,
    updatecount integer DEFAULT 0 NOT NULL,
    acquired timestamp with time zone
);


ALTER TABLE hangfire.lock OWNER TO postgres;

--
-- Name: schema; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.schema (
    version integer NOT NULL
);


ALTER TABLE hangfire.schema OWNER TO postgres;

--
-- Name: server; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.server (
    id text NOT NULL,
    data jsonb,
    lastheartbeat timestamp with time zone NOT NULL,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.server OWNER TO postgres;

--
-- Name: set; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.set (
    id bigint NOT NULL,
    key text NOT NULL,
    score double precision NOT NULL,
    value text NOT NULL,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.set OWNER TO postgres;

--
-- Name: set_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.set_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.set_id_seq OWNER TO postgres;

--
-- Name: set_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.set_id_seq OWNED BY hangfire.set.id;


--
-- Name: state; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.state (
    id bigint NOT NULL,
    jobid bigint NOT NULL,
    name text NOT NULL,
    reason text,
    createdat timestamp with time zone NOT NULL,
    data jsonb,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.state OWNER TO postgres;

--
-- Name: state_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.state_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.state_id_seq OWNER TO postgres;

--
-- Name: state_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.state_id_seq OWNED BY hangfire.state.id;


--
-- Name: AntiCheatViolations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AntiCheatViolations" (
    "Id" uuid NOT NULL,
    "ContestId" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "ViolationType" integer NOT NULL,
    "Details" character varying(32768) NOT NULL,
    "OccurredAt" timestamp with time zone NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."AntiCheatViolations" OWNER TO postgres;

--
-- Name: AspNetRoleClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetRoleClaims" (
    "Id" integer NOT NULL,
    "RoleId" uuid NOT NULL,
    "ClaimType" text,
    "ClaimValue" text
);


ALTER TABLE public."AspNetRoleClaims" OWNER TO postgres;

--
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."AspNetRoleClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetRoleClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: AspNetRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetRoles" (
    "Id" uuid NOT NULL,
    "Name" character varying(256),
    "NormalizedName" character varying(256),
    "ConcurrencyStamp" text
);


ALTER TABLE public."AspNetRoles" OWNER TO postgres;

--
-- Name: AspNetUserClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserClaims" (
    "Id" integer NOT NULL,
    "UserId" uuid NOT NULL,
    "ClaimType" text,
    "ClaimValue" text
);


ALTER TABLE public."AspNetUserClaims" OWNER TO postgres;

--
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."AspNetUserClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetUserClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: AspNetUserLogins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" uuid NOT NULL
);


ALTER TABLE public."AspNetUserLogins" OWNER TO postgres;

--
-- Name: AspNetUserRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserRoles" (
    "UserId" uuid NOT NULL,
    "RoleId" uuid NOT NULL
);


ALTER TABLE public."AspNetUserRoles" OWNER TO postgres;

--
-- Name: AspNetUserTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserTokens" (
    "UserId" uuid NOT NULL,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text
);


ALTER TABLE public."AspNetUserTokens" OWNER TO postgres;

--
-- Name: AspNetUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUsers" (
    "Id" uuid NOT NULL,
    "UserName" character varying(256),
    "NormalizedUserName" character varying(256),
    "Email" character varying(256),
    "NormalizedEmail" character varying(256),
    "EmailConfirmed" boolean NOT NULL,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL,
    "TwoFactorEnabled" boolean NOT NULL,
    "LockoutEnd" timestamp with time zone,
    "LockoutEnabled" boolean NOT NULL,
    "AccessFailedCount" integer NOT NULL,
    "CreationTime" timestamp with time zone DEFAULT '-infinity'::timestamp with time zone NOT NULL,
    "IsDeleted" boolean DEFAULT false NOT NULL,
    "LastModificationTime" timestamp with time zone
);


ALTER TABLE public."AspNetUsers" OWNER TO postgres;

--
-- Name: CartItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItems" (
    "Id" uuid NOT NULL,
    "CartId" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."CartItems" OWNER TO postgres;

--
-- Name: Carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Carts" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Carts" OWNER TO postgres;

--
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    "Id" uuid NOT NULL,
    "Name" public.citext NOT NULL,
    "Description" public.citext NOT NULL,
    "IsActive" boolean NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- Name: Chapters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Chapters" (
    "Id" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "Position" character varying(1024) NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Chapters" OWNER TO postgres;

--
-- Name: ContestExercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContestExercises" (
    "Id" uuid NOT NULL,
    "ContestId" uuid NOT NULL,
    "ExerciseId" uuid NOT NULL,
    "ScoreWeight" integer NOT NULL,
    "Order" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."ContestExercises" OWNER TO postgres;

--
-- Name: ContestRegistrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContestRegistrations" (
    "Id" uuid NOT NULL,
    "ContestId" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "RegistrationTime" timestamp with time zone NOT NULL,
    "JoinTime" timestamp with time zone,
    "SubmitTime" timestamp with time zone,
    "IsDisqualified" boolean NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "DisqualifiedAt" timestamp with time zone,
    "DisqualifiedReason" character varying(32768) DEFAULT ''::character varying NOT NULL,
    "ViolationCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ContestRegistrations" OWNER TO postgres;

--
-- Name: ContestSubmissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContestSubmissions" (
    "Id" uuid NOT NULL,
    "ContestId" uuid NOT NULL,
    "ExerciseId" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "Language" character varying(1024) NOT NULL,
    "Code" character varying(32768) NOT NULL,
    "Score" integer NOT NULL,
    "TotalTime" real NOT NULL,
    "TotalMemory" integer NOT NULL,
    "IsFinal" boolean NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."ContestSubmissions" OWNER TO postgres;

--
-- Name: Contests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Contests" (
    "Id" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "Description" public.citext NOT NULL,
    "Status" integer NOT NULL,
    "StartTime" timestamp with time zone,
    "EndTime" timestamp with time zone,
    "DurationInMinutes" integer NOT NULL,
    "AllowedLanguages" character varying(1024) NOT NULL,
    "MemoryLimit" integer NOT NULL,
    "TimeLimit" integer NOT NULL,
    "AntiCheatLevel" integer NOT NULL,
    "CreatorId" uuid NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "MaxViolations" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Contests" OWNER TO postgres;

--
-- Name: Courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Courses" (
    "Id" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "Description" public.citext NOT NULL,
    "Price" numeric NOT NULL,
    "ImageUrl" public.citext NOT NULL,
    "IsPublished" boolean NOT NULL,
    "CategoryId" uuid NOT NULL,
    "InstructorId" uuid NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Courses" OWNER TO postgres;

--
-- Name: Enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Enrollments" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Enrollments" OWNER TO postgres;

--
-- Name: ExerciseDefaultCodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExerciseDefaultCodes" (
    "Id" uuid NOT NULL,
    "ExerciseId" uuid NOT NULL,
    "Language" character varying(1024) NOT NULL,
    "StarterCode" character varying(32768) NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."ExerciseDefaultCodes" OWNER TO postgres;

--
-- Name: ExerciseExamples; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExerciseExamples" (
    "Id" uuid NOT NULL,
    "Input" character varying(1024) NOT NULL,
    "Output" character varying(1024) NOT NULL,
    "Explanation" character varying(32768) NOT NULL,
    "ExerciseId" uuid NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."ExerciseExamples" OWNER TO postgres;

--
-- Name: ExerciseSubmissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExerciseSubmissions" (
    "Id" uuid NOT NULL,
    "ExerciseId" uuid NOT NULL,
    "Language" character varying(1024) NOT NULL,
    "Code" character varying(32768) NOT NULL,
    "IsPassed" boolean NOT NULL,
    "Score" double precision NOT NULL,
    "TotalTime" double precision NOT NULL,
    "TotalMemory" double precision NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."ExerciseSubmissions" OWNER TO postgres;

--
-- Name: ExerciseTestCases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExerciseTestCases" (
    "Id" uuid NOT NULL,
    "ExerciseId" uuid NOT NULL,
    "Input" character varying(1024) NOT NULL,
    "ExpectedOutput" character varying(1024) NOT NULL,
    "Description" character varying(1024) NOT NULL,
    "IsHidden" boolean NOT NULL,
    "Order" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."ExerciseTestCases" OWNER TO postgres;

--
-- Name: Exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Exercises" (
    "Id" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "Description" public.citext NOT NULL,
    "Difficulty" integer NOT NULL,
    "Category" character varying(1024) NOT NULL,
    "CreatorId" uuid NOT NULL,
    "Constraints" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "Hints" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "IsHidden" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Exercises" OWNER TO postgres;

--
-- Name: FileChunks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FileChunks" (
    "Id" uuid NOT NULL,
    "FileEntryId" uuid NOT NULL,
    "ChunkIndex" integer NOT NULL,
    "ChunkLocation" character varying(1024) NOT NULL,
    "ChunkSize" bigint NOT NULL,
    "IsUploaded" boolean NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."FileChunks" OWNER TO postgres;

--
-- Name: FileEntries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FileEntries" (
    "Id" uuid NOT NULL,
    "FileName" character varying(1024) NOT NULL,
    "FileSize" double precision NOT NULL,
    "FileLocation" character varying(1024) NOT NULL,
    "Status" integer NOT NULL,
    "TotalChunks" integer NOT NULL,
    "UploadedChunks" integer NOT NULL,
    "CompletedAt" timestamp with time zone,
    "FileType" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."FileEntries" OWNER TO postgres;

--
-- Name: FileEntryEmbeddings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FileEntryEmbeddings" (
    "Id" uuid NOT NULL,
    "FileEntryId" uuid NOT NULL,
    "FileChunkId" uuid NOT NULL,
    "StartIndex" integer NOT NULL,
    "EndIndex" integer NOT NULL,
    "ShortText" character varying(1024) NOT NULL,
    "Embedding" public.vector(768) NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."FileEntryEmbeddings" OWNER TO postgres;

--
-- Name: LessonCodings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonCodings" (
    "Id" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "ExerciseId" uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid NOT NULL
);


ALTER TABLE public."LessonCodings" OWNER TO postgres;

--
-- Name: LessonMaterials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonMaterials" (
    "Id" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "Outline" character varying(32768) NOT NULL,
    "DocumentFileId" uuid NOT NULL,
    "Status" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."LessonMaterials" OWNER TO postgres;

--
-- Name: LessonQuizAnswers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonQuizAnswers" (
    "Id" uuid NOT NULL,
    "LessonQuizQuestionId" uuid NOT NULL,
    "Text" character varying(32768) NOT NULL,
    "IsCorrect" boolean NOT NULL,
    "Position" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."LessonQuizAnswers" OWNER TO postgres;

--
-- Name: LessonQuizQuestions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonQuizQuestions" (
    "Id" uuid NOT NULL,
    "LessonQuizId" uuid NOT NULL,
    "Text" character varying(32768) NOT NULL,
    "Position" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."LessonQuizQuestions" OWNER TO postgres;

--
-- Name: LessonQuizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonQuizzes" (
    "Id" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "Description" public.citext NOT NULL,
    "PassingScore" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."LessonQuizzes" OWNER TO postgres;

--
-- Name: LessonReadings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonReadings" (
    "Id" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "Content" public.citext NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."LessonReadings" OWNER TO postgres;

--
-- Name: LessonVideos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonVideos" (
    "Id" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "VideoUrl" character varying(1024) NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."LessonVideos" OWNER TO postgres;

--
-- Name: Lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lessons" (
    "Id" uuid NOT NULL,
    "ChapterId" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "LessonType" integer NOT NULL,
    "Position" character varying(1024) NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Lessons" OWNER TO postgres;

--
-- Name: Notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notifications" (
    "Id" uuid NOT NULL,
    "ReceiverId" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "Message" public.citext NOT NULL,
    "IsRead" boolean NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Notifications" OWNER TO postgres;

--
-- Name: OrderItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItems" (
    "Id" uuid NOT NULL,
    "OrderId" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "Price" numeric NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."OrderItems" OWNER TO postgres;

--
-- Name: Orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Orders" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "TotalAmount" numeric NOT NULL,
    "Status" integer NOT NULL,
    "Description" character varying(32768) NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Orders" OWNER TO postgres;

--
-- Name: OutboxMessages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OutboxMessages" (
    "Id" uuid NOT NULL,
    "EventType" character varying(1024) NOT NULL,
    "TriggeredById" uuid NOT NULL,
    "ObjectId" character varying(1024) NOT NULL,
    "Payload" character varying(32768) NOT NULL,
    "Published" boolean NOT NULL,
    "ActivityId" character varying(1024) NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."OutboxMessages" OWNER TO postgres;

--
-- Name: PaymentTransactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentTransactions" (
    "Id" uuid NOT NULL,
    "Status" integer NOT NULL,
    "Currency" character varying(1024) NOT NULL,
    "Amount" numeric NOT NULL,
    "Provider" public.citext NOT NULL,
    "FailReason" character varying(1024) NOT NULL,
    "OrderId" uuid NOT NULL,
    "TransactionId" public.citext NOT NULL,
    "RawRequest" character varying(1024) NOT NULL,
    "RawResponse" character varying(1024) NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."PaymentTransactions" OWNER TO postgres;

--
-- Name: Reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reviews" (
    "Id" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "Rating" integer NOT NULL,
    "Comment" public.citext NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


ALTER TABLE public."Reviews" OWNER TO postgres;

--
-- Name: UserLessonProgresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserLessonProgresses" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "IsCompleted" boolean NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "Score" double precision DEFAULT 0.0 NOT NULL
);


ALTER TABLE public."UserLessonProgresses" OWNER TO postgres;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- Name: aggregatedcounter id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.aggregatedcounter ALTER COLUMN id SET DEFAULT nextval('hangfire.aggregatedcounter_id_seq'::regclass);


--
-- Name: counter id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.counter ALTER COLUMN id SET DEFAULT nextval('hangfire.counter_id_seq'::regclass);


--
-- Name: hash id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.hash ALTER COLUMN id SET DEFAULT nextval('hangfire.hash_id_seq'::regclass);


--
-- Name: job id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.job ALTER COLUMN id SET DEFAULT nextval('hangfire.job_id_seq'::regclass);


--
-- Name: jobparameter id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobparameter ALTER COLUMN id SET DEFAULT nextval('hangfire.jobparameter_id_seq'::regclass);


--
-- Name: jobqueue id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobqueue ALTER COLUMN id SET DEFAULT nextval('hangfire.jobqueue_id_seq'::regclass);


--
-- Name: list id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.list ALTER COLUMN id SET DEFAULT nextval('hangfire.list_id_seq'::regclass);


--
-- Name: set id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.set ALTER COLUMN id SET DEFAULT nextval('hangfire.set_id_seq'::regclass);


--
-- Name: state id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.state ALTER COLUMN id SET DEFAULT nextval('hangfire.state_id_seq'::regclass);


--
-- Data for Name: aggregatedcounter; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.aggregatedcounter (id, key, value, expireat) FROM stdin;
\.


--
-- Data for Name: counter; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.counter (id, key, value, expireat) FROM stdin;
\.


--
-- Data for Name: hash; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.hash (id, key, field, value, expireat, updatecount) FROM stdin;
\.


--
-- Data for Name: job; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.job (id, stateid, statename, invocationdata, arguments, createdat, expireat, updatecount) FROM stdin;
\.


--
-- Data for Name: jobparameter; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.jobparameter (id, jobid, name, value, updatecount) FROM stdin;
\.


--
-- Data for Name: jobqueue; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.jobqueue (id, jobid, queue, fetchedat, updatecount) FROM stdin;
\.


--
-- Data for Name: list; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.list (id, key, value, expireat, updatecount) FROM stdin;
\.


--
-- Data for Name: lock; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.lock (resource, updatecount, acquired) FROM stdin;
\.


--
-- Data for Name: schema; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.schema (version) FROM stdin;
23
\.


--
-- Data for Name: server; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.server (id, data, lastheartbeat, updatecount) FROM stdin;
laptop-km4uhqhf:20576:971b37ab-9208-4552-86ae-4471bdf6b2c0	{"Queues": ["default"], "StartedAt": "2026-05-25T09:34:20.2785204Z", "WorkerCount": 20}	2026-05-25 09:34:50.634296+00	0
\.


--
-- Data for Name: set; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.set (id, key, score, value, expireat, updatecount) FROM stdin;
\.


--
-- Data for Name: state; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.state (id, jobid, name, reason, createdat, data, updatecount) FROM stdin;
\.


--
-- Data for Name: AntiCheatViolations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AntiCheatViolations" ("Id", "ContestId", "StudentId", "ViolationType", "Details", "OccurredAt", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: AspNetRoleClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetRoleClaims" ("Id", "RoleId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- Data for Name: AspNetRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp") FROM stdin;
019ddd8c-f33c-7f58-afe8-f9f9121a2d87	Admin	ADMIN	150eb54d-4f56-48f8-a4db-c78a23cd7f0b
019ddd8c-f3bb-749e-a7f5-76ebe87e26c6	Instructor	INSTRUCTOR	4d903b0d-6896-499f-9529-04f99c2367e2
019ddd8c-f3c8-7353-a337-0db6205779ac	Student	STUDENT	334a1b72-1f3b-4783-a3d4-0ac6d33bc067
\.


--
-- Data for Name: AspNetUserClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserClaims" ("Id", "UserId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- Data for Name: AspNetUserLogins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserLogins" ("LoginProvider", "ProviderKey", "ProviderDisplayName", "UserId") FROM stdin;
\.


--
-- Data for Name: AspNetUserRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserRoles" ("UserId", "RoleId") FROM stdin;
019ddd8c-f426-7111-910a-6cb2e5c6a751	019ddd8c-f33c-7f58-afe8-f9f9121a2d87
019ddd8c-f4fa-7bde-85b5-838e03cde051	019ddd8c-f33c-7f58-afe8-f9f9121a2d87
019ddd8c-f558-7386-a796-18c878996313	019ddd8c-f3bb-749e-a7f5-76ebe87e26c6
019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	019ddd8c-f3bb-749e-a7f5-76ebe87e26c6
019ddd8c-f603-72ac-a914-255b7bfd9e64	019ddd8c-f3bb-749e-a7f5-76ebe87e26c6
019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb	019ddd8c-f3c8-7353-a337-0db6205779ac
019ddd8c-f6e1-7511-94bd-0a10582186a3	019ddd8c-f3c8-7353-a337-0db6205779ac
019ddd8c-f773-7d46-9bf6-03a520cda5da	019ddd8c-f3c8-7353-a337-0db6205779ac
\.


--
-- Data for Name: AspNetUserTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserTokens" ("UserId", "LoginProvider", "Name", "Value") FROM stdin;
\.


--
-- Data for Name: AspNetUsers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUsers" ("Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnd", "LockoutEnabled", "AccessFailedCount", "CreationTime", "IsDeleted", "LastModificationTime") FROM stdin;
019ddd8c-f426-7111-910a-6cb2e5c6a751	admin	ADMIN	admin@example.com	ADMIN@EXAMPLE.COM	t	AQAAAAIAAYagAAAAEEurpVw9O7P5Zdaj4ZYQfzOYRMw0+u1/dpgkfXZIQm3k+chZBofgmmQpCgyv++pgCg==	WAWEHN6HYMHT2HRHSOD62BKRKBK2UBRC	c58a3fc6-4f6b-484b-92e7-f08045d80024	\N	f	f	\N	t	0	-infinity	f	\N
019ddd8c-f4fa-7bde-85b5-838e03cde051	manager	MANAGER	manager@example.com	MANAGER@EXAMPLE.COM	t	AQAAAAIAAYagAAAAECaF56EvDFbemgisT4hSJbOz4rqHFdGFPx5RoxIplLE9zX2YvZRYyQysG/zJFgSzmg==	4AO2GXNI3LDIGRNWCRLSZOQYKR4NH4FC	9bbf4557-20a5-497a-ac8c-ec4d7e9af35c	\N	f	f	\N	t	0	-infinity	f	\N
019ddd8c-f558-7386-a796-18c878996313	instructor1	INSTRUCTOR1	instructor1@example.com	INSTRUCTOR1@EXAMPLE.COM	t	AQAAAAIAAYagAAAAECLEQG4R0lvdiQBVtSZHn/7HzUaa6nxckzrTEI5vRwx5YOnOU3l/hOlTmoEyyRat2w==	SQCSJXFSKXUB3QHMSFKD43HJFV4DHS7L	deceffae-c057-4718-b303-a8ae3b5301e3	\N	f	f	\N	t	0	-infinity	f	\N
019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	instructor2	INSTRUCTOR2	instructor2@example.com	INSTRUCTOR2@EXAMPLE.COM	t	AQAAAAIAAYagAAAAEM2OpN79n/LUE50XqZ0ClOBvajhvhHrrrBQnMagJRStWuVyTVpYFJElIvksXiWHQ6Q==	ELTWCHJVMM56QZK7KFAUGTX4OKOJNSSE	618d7b9a-7863-49df-bd2a-6dec54276444	\N	f	f	\N	t	0	-infinity	f	\N
019ddd8c-f603-72ac-a914-255b7bfd9e64	instructor3	INSTRUCTOR3	instructor3@example.com	INSTRUCTOR3@EXAMPLE.COM	t	AQAAAAIAAYagAAAAEPmCzlIKwseI3PcRHPxsdFGAsV7GVG6DSig445hirDxlMC7sSZgdEA30WCykUS+5Hg==	F3X624PI2QYP2JZXHIN6GI2KEV4J6MKM	6ffaa219-b558-4604-89a5-cd404da49119	\N	f	f	\N	t	0	-infinity	f	\N
019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb	student1	STUDENT1	student1@example.com	STUDENT1@EXAMPLE.COM	t	AQAAAAIAAYagAAAAELT5HrApghXkZWrUR9s96l77q86a+qc6WHJXp+5L8RaUAHSGCubUW+pHCOk7RRRQEA==	AQ2ACDW4WXI2VPWDEJ5NNCZPFF7PZFCA	a7c33d9d-6dec-414c-bde6-3165e418f750	\N	f	f	\N	t	0	-infinity	f	\N
019ddd8c-f6e1-7511-94bd-0a10582186a3	student2	STUDENT2	student2@example.com	STUDENT2@EXAMPLE.COM	t	AQAAAAIAAYagAAAAENUQpKP13GLVFbjCzauO/9LOS0t/e9QV0S6DzTMPrHASZHxaUwIMhGAUCDNHixBgVg==	HCF3OGSPWI5O3SKBWNHTTAAKPOBPQ5HL	caab734a-dfed-403b-81c9-e40559cb4997	\N	f	f	\N	t	0	-infinity	f	\N
019ddd8c-f773-7d46-9bf6-03a520cda5da	student3	STUDENT3	student3@example.com	STUDENT3@EXAMPLE.COM	t	AQAAAAIAAYagAAAAEEMicP44dHmYYPnEbZqR/vSiZ9vitVpv49w9awB74983wHoqicZXD1xW2NGK723I0A==	3NV43Z7PGAHBNI5LPLOXXPOZFB7YA752	b37678ab-96fc-4fcd-91bf-13b14447ecc7	\N	f	f	\N	t	0	-infinity	f	\N
\.


--
-- Data for Name: CartItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItems" ("Id", "CartId", "CourseId", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: Carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Carts" ("Id", "StudentId", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Categories" ("Id", "Name", "Description", "IsActive", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
01ebd503-5522-4871-81a4-ec12bd80cdf3	Kiến thức cơ sở	Description + 68568572-eccd-4042-ba1b-a04ca44d9daf	t	\N	2026-04-30 08:41:36.786279+00	\N	f
0240ee3a-0061-4483-a9d2-735d91233f00	EDN Academy	Description + 459cc1d6-5383-4411-b401-54a6d17ef4d7	t	\N	2026-04-30 08:41:36.786279+00	\N	f
087499f3-3cc2-4d25-8ad5-8c63c6b74c44	Giải quyết vấn đề	Description + de72109c-cf34-40cb-9369-9462282f7073	t	\N	2026-04-30 08:41:36.786279+00	\N	f
0da1e150-2e32-4264-845b-305a8840e2a7	EDN Team	Description + c3497a03-96bd-43a8-bf06-4a27d8cd177b	t	\N	2026-04-30 08:41:36.786279+00	\N	f
0ea5a97b-320a-4193-bca0-b964a22e3685	Lập trình ứng dụng web	Description + 8e00fb8a-c7e8-47b3-9da1-d8259b1cf4c2	t	\N	2026-04-30 08:41:36.786279+00	\N	f
246ae2be-a939-484c-9047-dfdf3bd05e08	EDN Testing	Description + 91b0d03d-f3ab-4f50-9493-8bd88955694e	t	\N	2026-04-30 08:41:36.786279+00	\N	f
26149d95-7274-487e-bb63-a8ea37218401	Mặc định	Description + e8a3a651-6343-4782-9345-c0e930af5f30	t	\N	2026-04-30 08:41:36.786279+00	\N	f
317641f0-a185-4c35-9637-4e965bf4b06e	Chương trình khung	Description + c5ac2601-1745-4287-a559-0bfd30ec706e	t	\N	2026-04-30 08:41:36.786279+00	\N	f
399afdd3-8313-41d8-8d15-cd3453bb6f47	Liên kết trường	Description + f29f9537-1d22-49fd-8311-c9ab3c5bf601	t	\N	2026-04-30 08:41:36.786279+00	\N	f
566e8bf1-4129-45ab-8831-abd162e23184	Fresher	Description + 73f9aad3-b22f-40e2-859b-5da6021a3516	t	\N	2026-04-30 08:41:36.786279+00	\N	f
5ac3586c-394f-45c2-b000-9332d118b498	Thuật toán	Description + 7b3d64fd-bbe0-47dc-b9cf-2a3cb335a7fa	t	\N	2026-04-30 08:41:36.786279+00	\N	f
69a051b3-727b-4b21-a49e-3111c43932e0	Fsoft Training with Fee	Description + 9645673c-17b0-451b-a24d-b36469001d69	t	\N	2026-04-30 08:41:36.786279+00	\N	f
80e95633-2022-4c78-ab94-57c9d3d51e2d	Lập trình nâng cao	Description + b78913ac-8eeb-48b0-bc17-4c7ebeb5409a	t	\N	2026-04-30 08:41:36.786279+00	\N	f
9483a3b6-2fc1-4536-9792-d998b843da73	Kỹ năng nâng cao	Description + 7aad55c9-1e16-4f51-87b5-9b49d0bcbbad	t	\N	2026-04-30 08:41:36.786279+00	\N	f
9ea850dd-96cb-4597-88d0-61e69eba6398	Khóa học chung FA	Description + 4d1775c9-0d21-467f-afc7-5d53d8deac28	t	\N	2026-04-30 08:41:36.786279+00	\N	f
b0522acc-c5e1-49b2-a340-440724cdeca8	Kiến thức khác	Description + a5e553ff-a7e9-44aa-86f2-3fd43c5db0d7	t	\N	2026-04-30 08:41:36.786279+00	\N	f
fbb5c2ee-0724-4bbc-a075-450004d1f20c	Lập trình cơ sở	Description + 094182d0-2f50-4d60-93c9-6b11cdd02161	t	\N	2026-04-30 08:41:36.786279+00	\N	f
\.


--
-- Data for Name: Chapters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Chapters" ("Id", "CourseId", "Title", "Position", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
00056a9e-d5ba-4913-b44e-db626b329749	961ac01c-382c-4aa5-bae1-d1429f27f06a	NAMESPACE , TEMPLATE	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
01f76acf-40d6-4601-92f5-c23bc6625a5f	3600145f-dbec-412b-94f1-08942f6afa16	Lập trình hướng đối tượng	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
045487cf-89ba-4503-b6e1-20e2e03144b7	743dd717-48b2-45b1-b9c0-8ded60965ecb	Cấu trúc rẽ nhánh	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
0673c3cb-8017-4f8e-aba4-b60f0ef797a1	3cfe0502-a9d6-4353-b87f-ed417a83124f	Các khái niệm cơ bản	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
07cc1c31-5bff-416c-9a73-ff7d44b0650b	d1839060-39f5-4877-a610-7036e35dbcaa	Cấu trúc điều khiển	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
0c187fb6-d795-4387-aa3f-21f1cbf01a7c	6097a7ef-548b-4542-8c60-5ee180d2dd96	Xây dựng game	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
0e36950e-fe57-40da-b564-9ef4866b2c24	743dd717-48b2-45b1-b9c0-8ded60965ecb	Vòng lặp	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
0f705c03-0eed-485b-a440-caf811670cb5	3cfe0502-a9d6-4353-b87f-ed417a83124f	Mảng	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
1056efbd-e7bc-4f8a-ad52-e9a317b88640	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Triển khai dự án	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Thuật toán căn bản	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
16dc7e8b-24cc-4338-bcde-f3532389ad36	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Chức năng quản lý người dùng	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
19f37cb6-945b-493e-8771-835627a148d0	737b5551-e148-4e64-aa54-2e85f82a30ff	Vòng lặp	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
1a75260f-329e-4b1a-963e-6f0856b59bcd	eef4fafb-022a-430f-aad0-9416d37d656c	Tổng kết	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
1aa80bc2-8195-4d96-b3c1-852a22d3c8cc	ce685ee8-dca7-4304-befd-139a5700bc68	Thư viện chuẩn C++	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
1d71ef9c-b28e-4f0b-8439-544d893fb0be	eef4fafb-022a-430f-aad0-9416d37d656c	Giới thiệu	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Phần cứng máy tính	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
233919f7-09cc-41bc-b45e-f5f4fdcd6e17	961ac01c-382c-4aa5-bae1-d1429f27f06a	CON TRỎ	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Tạo các trò chơi theo nhóm khối lệnh	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
255b3c07-c453-4783-96ef-ae10698fbabd	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Sản phẩm cuối khóa	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
2737e6c4-1a69-419a-9532-8914175c527d	743dd717-48b2-45b1-b9c0-8ded60965ecb	Mảng	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
27aa88e7-a021-49a0-82cb-32c2bfd28f02	743dd717-48b2-45b1-b9c0-8ded60965ecb	Nhập - xuất dữ liệu từ bàn phím	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
291d0934-6ac5-48ef-944d-cdc06b84b300	737b5551-e148-4e64-aa54-2e85f82a30ff	Hàm trong C#	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Điện toán đám mây	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
2f8f6d1a-4c46-40a8-a903-1bbadba79247	f996fe4f-4ab1-4979-9193-3881a8a806c9	C++ nâng cao	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	SQL nâng cao	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
32aa5bd2-27bf-4235-8887-ac9195a06a74	737b5551-e148-4e64-aa54-2e85f82a30ff	Xử lý xâu	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
32c7970e-d889-47c5-ba13-1bf59309402d	e79d99e5-6325-4f50-833d-ee7de5bc43c1	Ứng dụng AI trong công việc	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Python Automation Mastery	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
33b1eabc-e72c-44d1-9fc1-a5a9c6dab3dc	fa7b1920-a356-48af-b27e-46550a64a8dc	Tổng kết	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Python cơ bản	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
36860b84-ee67-4b15-9533-1c53d00c48b8	743dd717-48b2-45b1-b9c0-8ded60965ecb	String	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
4245ba29-529d-4739-bc2b-b774082f6c58	3600145f-dbec-412b-94f1-08942f6afa16	Modules và Packages	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Nhập môn SQL	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
434104ff-0f72-45b9-853d-dba6e936bea2	961ac01c-382c-4aa5-bae1-d1429f27f06a	LỚP TRONG C++	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
4cbd5ad7-d0d2-4994-99a9-d2d2afd7e645	d1839060-39f5-4877-a610-7036e35dbcaa	Các khái niệm cơ bản	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
4ebff68e-c0dd-43c1-a2a4-1aeb0f4ae5d2	eef4fafb-022a-430f-aad0-9416d37d656c	Đối tượng trong Javascript	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	CÁC THƯ VIỆN CHUẨN TRONG C++	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
55e1b573-f06f-421d-881f-9ba3575ddcec	3600145f-dbec-412b-94f1-08942f6afa16	Xử lý lỗi và ngoại lệ	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
579b2a4f-6031-4429-b244-2061c4e519e0	3ffa0664-7966-4aa4-9557-049c00d033b7	Thuật toán sắp xếp	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	JavaScript cơ bản	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
5e695d8e-500f-40cf-b5ac-2fd1501381d7	961ac01c-382c-4aa5-bae1-d1429f27f06a	ĐỌC GHI FILE	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
5f970759-175f-48ea-bcfe-c27c4409bb13	3cfe0502-a9d6-4353-b87f-ed417a83124f	Vòng lặp	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
603a9390-65b8-43fd-9678-42382611037b	d1839060-39f5-4877-a610-7036e35dbcaa	Chuỗi và phương thức chuỗi	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
60d3e2b3-b6e9-41c7-a44c-8139e7b1662d	3cfe0502-a9d6-4353-b87f-ed417a83124f	String	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Truyền thông và Mạng máy tính	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
63bed55c-0803-48b3-96fb-6cfcbb613ade	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Chức năng quản lý công việc	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
652b916f-f7aa-4fe9-b699-a3b563d1e3bf	737b5551-e148-4e64-aa54-2e85f82a30ff	Mảng	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
6724d6fa-d2b4-4a7d-9123-0fc06dab0123	961ac01c-382c-4aa5-bae1-d1429f27f06a	XỬ LÝ NGOẠI LỆ	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Lập trình hướng đối tượng trong C++	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
69b1070f-85d6-478e-912a-eb0188b372ec	737b5551-e148-4e64-aa54-2e85f82a30ff	Các toán tử	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
6f250039-b2e7-45ed-a610-01c4f9f2c518	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Bố cục hiện đại với Flexbox và Grid	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Cấu trúc dữ liệu và giải thuật	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
753659d3-4545-4b7e-a74c-6bdc7335fe3e	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Giới thiệu về HTML và Web	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Thực hành với SQL	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
77199784-d6bf-44b0-ba03-6da9d4198d33	eef4fafb-022a-430f-aad0-9416d37d656c	Làm việc với DOM & BOM	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
7e5584ec-4af7-405e-aa5b-7bac9149303a	3ffa0664-7966-4aa4-9557-049c00d033b7	Giới thiệu chung	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
82938d8a-fa31-4c7d-9122-12be8dce501e	fa7b1920-a356-48af-b27e-46550a64a8dc	C# cơ bản	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
84c29e11-da4c-472d-8034-527a88725a96	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Thực hành dự án	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
8a812c9d-4a4d-4c66-8e9b-6d0784ceba7f	743dd717-48b2-45b1-b9c0-8ded60965ecb	Toán tử trong Java	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
95b06f40-f331-47fc-be32-89793d374830	fa7b1920-a356-48af-b27e-46550a64a8dc	Cấu trúc điều khiển	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
a06f1f45-b23e-427c-b114-aa4444c4c111	3ffa0664-7966-4aa4-9557-049c00d033b7	Cấu trúc dữ liệu	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
a1f7c649-c30c-4be2-9541-d51de4712954	3cfe0502-a9d6-4353-b87f-ed417a83124f	Nhập - xuất dữ liệu từ bàn phím	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
a9a98c85-d92a-4980-a5fe-514d1b8b50a3	6097a7ef-548b-4542-8c60-5ee180d2dd96	Toán học	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
a9f074bb-55b6-4325-b93e-58eaefe41551	3600145f-dbec-412b-94f1-08942f6afa16	Xử lý File	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
ab47bae5-87c4-46ff-8959-2e40badedc8c	737b5551-e148-4e64-aa54-2e85f82a30ff	Các câu lệnh điều kiện	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
b1ba46fe-75f1-4447-8cb0-d4a6c81e1b51	eef4fafb-022a-430f-aad0-9416d37d656c	Cấu trúc điều khiển, hàm	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	C cho người mới bắt đầu	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
b7ccd7f8-b737-4d9b-9bd3-4faec5567b37	eef4fafb-022a-430f-aad0-9416d37d656c	Thao tác với dữ liệu	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Phần mềm máy tính	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
bd6222e5-280f-4779-b6b7-1a845f8d4495	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	CSS nâng cao và responsive	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
bda31c86-19c9-4da5-9a73-152e6c900589	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Làm quen với CSS	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
bfc8c9f6-6861-47e7-b8e9-7395048353a4	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Định dạng văn bản và bố cục cơ bản	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
c3bb7a1a-a6e1-4471-a71b-ff9a4eb042dd	3cfe0502-a9d6-4353-b87f-ed417a83124f	Hàm	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
cbabfde1-dc78-4d4b-8615-285b122b9937	737b5551-e148-4e64-aa54-2e85f82a30ff	Biến	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
cbb65694-0ff7-4070-9e58-999596582272	3cfe0502-a9d6-4353-b87f-ed417a83124f	Cấu trúc rẽ nhánh	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
d0d53c61-e27e-4450-960c-429ea63d5893	3600145f-dbec-412b-94f1-08942f6afa16	Cấu trúc dữ liệu tích hợp sẵn	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Làm quen với SQL	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
d4001112-3495-4491-8523-3a632ebb407b	d1839060-39f5-4877-a610-7036e35dbcaa	Hàm	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
d6a96253-4181-4a55-a304-1be89ba51175	737b5551-e148-4e64-aa54-2e85f82a30ff	C# cơ bản	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
d8e5d8e5-7b6c-4c5b-9209-821e9a533c7a	3cfe0502-a9d6-4353-b87f-ed417a83124f	Tổng quan về lập trình C++	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
dbadb58f-5618-4ab1-be7d-ab0067c665a2	3ffa0664-7966-4aa4-9557-049c00d033b7	Thuật toán quy hoạch động và quay lui	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Java cơ bản	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
e061903f-9d59-4a06-9953-7800b61be90a	fa7b1920-a356-48af-b27e-46550a64a8dc	Giới thiệu	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
e119e517-1a3c-4756-bc71-8124ede492e7	3cfe0502-a9d6-4353-b87f-ed417a83124f	Toán tử trong c++	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
e3aa1c57-0005-4713-8b26-9a125169bc56	743dd717-48b2-45b1-b9c0-8ded60965ecb	Tổng quan về lập trình Java	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
e4a52d5e-e0a5-458e-9eb7-252490f0dcc9	3600145f-dbec-412b-94f1-08942f6afa16	Ôn tập các kiến thức cơ bản	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
eaf42478-1f56-4402-9c5d-272beaa42f7c	961ac01c-382c-4aa5-bae1-d1429f27f06a	ĐỆ QUY	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
eb01ed8f-8fe0-40da-a6cf-db9d34076dd5	d1839060-39f5-4877-a610-7036e35dbcaa	Số và toán học	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
eb1f6aea-2cd3-4885-8897-a096ac15981f	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Giới thiệu chung	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
ee5bbb65-4634-4c64-b289-9229a42a313b	3ffa0664-7966-4aa4-9557-049c00d033b7	Thuật toán đồ thị	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
eea6930e-4a28-42b9-846f-80f642087f1d	fa7b1920-a356-48af-b27e-46550a64a8dc	Phương thức, lớp trong C#	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
ef55e99a-89af-4040-8547-3ce1ed99aeea	743dd717-48b2-45b1-b9c0-8ded60965ecb	Các khái niệm cơ bản	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	C++ cho người mới bắt đầu	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
f0fdd269-aacf-41ee-9086-c74c6337b50e	d1839060-39f5-4877-a610-7036e35dbcaa	Giới thiệu chung về Python	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
f5d36d9c-624b-4648-b875-190a2aa9f400	743dd717-48b2-45b1-b9c0-8ded60965ecb	Hàm	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
f7883cb8-eb35-47c0-a110-4fa5b40f4c1f	eef4fafb-022a-430f-aad0-9416d37d656c	Bất đồng bộ trong JavaScript	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
f80b3a58-34c2-4ae7-9d20-6ec19d70b402	acdafa98-5779-491b-b172-a6aeb14c5af1	Lập trình hướng đối tượng trong java	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
f867c55e-29ee-420a-8bcc-c45012ea43a9	eef4fafb-022a-430f-aad0-9416d37d656c	Biến và các kiểu dữ liệu	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
fc11ed6e-e4ae-480e-b12f-67aec809ce17	3ffa0664-7966-4aa4-9557-049c00d033b7	Thuật toán tìm kiếm và chia để trị	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
fc87a170-547a-4ced-81ae-3274a87caa0d	e2b33def-af48-4e4c-b6cd-863a630f8ee7	Thuật toán nâng cao	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
fe89c338-a561-45e8-be2e-6465e6ef8552	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Giới thiệu Scratch	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
ff613291-f29e-4aba-a90f-43566082e70f	961ac01c-382c-4aa5-bae1-d1429f27f06a	HÀM TOÁN HỌC	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:55:50.669166+00	f
\.


--
-- Data for Name: ContestExercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContestExercises" ("Id", "ContestId", "ExerciseId", "ScoreWeight", "Order", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: ContestRegistrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContestRegistrations" ("Id", "ContestId", "StudentId", "RegistrationTime", "JoinTime", "SubmitTime", "IsDisqualified", "UserId", "CreationTime", "LastModificationTime", "IsDeleted", "DisqualifiedAt", "DisqualifiedReason", "ViolationCount") FROM stdin;
\.


--
-- Data for Name: ContestSubmissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContestSubmissions" ("Id", "ContestId", "ExerciseId", "StudentId", "Language", "Code", "Score", "TotalTime", "TotalMemory", "IsFinal", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: Contests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Contests" ("Id", "Title", "Description", "Status", "StartTime", "EndTime", "DurationInMinutes", "AllowedLanguages", "MemoryLimit", "TimeLimit", "AntiCheatLevel", "CreatorId", "UserId", "CreationTime", "LastModificationTime", "IsDeleted", "MaxViolations") FROM stdin;
\.


--
-- Data for Name: Courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Courses" ("Id", "Title", "Description", "Price", "ImageUrl", "IsPublished", "CategoryId", "InstructorId", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
3600145f-dbec-412b-94f1-08942f6afa16	Python nâng cao	<p><span style="font-size: 18pt; color: #304090;"><strong>Kh&aacute;m ph&aacute; sức mạnh thực sự của Python với kh&oacute;a học n&acirc;ng cao!</strong></span></p>\n<p>Bạn đ&atilde; nắm vững c&aacute;c kiến thức cơ bản về Python v&agrave; đang t&igrave;m kiếm một cơ hội để n&acirc;ng cao kỹ năng lập tr&igrave;nh của m&igrave;nh?</p>\n<p>Kh&oacute;a học <strong>Python N&acirc;ng Cao</strong> của ch&uacute;ng t&ocirc;i ch&iacute;nh l&agrave; ch&igrave;a kh&oacute;a để bạn mở ra những tiềm năng mới, từ việc l&agrave;m chủ c&aacute;c kiểu dữ liệu phức hợp cho đến lập tr&igrave;nh hướng đối tượng, xử l&yacute; lỗi chuy&ecirc;n nghiệp, v&agrave; nhiều hơn thế nữa. Đ&acirc;y l&agrave; cơ hội để bạn n&acirc;ng tầm sự nghiệp lập tr&igrave;nh v&agrave; trở th&agrave;nh chuy&ecirc;n gia trong lĩnh vực n&agrave;y.</p>\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/3411109_cfeeb712309849c98b4ae03393792c50.jpg" width="501" height="501" /></p>\n<p><span style="font-size: 18pt; color: #304090;"><strong>Tại sao bạn n&ecirc;n chọn kh&oacute;a học n&agrave;y?</strong></span></p>\n<p><span style="color: #506cf0; font-size: 13pt;"><strong><span style="color: #000000; font-size: 13pt;">Giảng vi&ecirc;n gi&agrave;u kinh nghiệm:</span> </strong></span>Được giảng dạy bởi đội ngũ giảng vi&ecirc;n đ&atilde; c&oacute; nhiều năm kinh nghiệm trong lĩnh vực lập tr&igrave;nh Python.</p>\n<p><span style="color: #506cf0; font-size: 13pt;"><strong><span style="color: #000000;">T&agrave;i liệu học tập chất lượng cao:</span> </strong></span>Cung cấp c&aacute;c t&agrave;i liệu, v&iacute; dụ thực tế v&agrave; b&agrave;i tập thực h&agrave;nh phong ph&uacute;.</p>\n<p><span style="color: #506cf0; font-size: 13pt;"><strong><span style="color: #000000;">Hỗ trợ tận t&igrave;nh:</span> </strong></span>Đội ngũ hỗ trợ lu&ocirc;n sẵn s&agrave;ng gi&uacute;p đỡ bạn trong suốt qu&aacute; tr&igrave;nh học tập.</p>\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/2011.i039.022.web_hosting_isometric_9566a93788234e9ba9ee9dd05da526f7.jpg" width="470" height="419" /></p>\n<p>&nbsp;</p>\n<p><span style="font-size: 18pt; color: #304090;"><strong>Bạn sẽ được g&igrave; sau kh&oacute;a học?</strong></span></p>\n<p><span style="color: #506cf0; font-size: 13pt;"><strong><span style="color: #000000;">N&acirc;ng cao kỹ năng lập tr&igrave;nh:</span> </strong></span>Trở th&agrave;nh một lập tr&igrave;nh vi&ecirc;n th&agrave;nh thạo với khả năng xử l&yacute; c&aacute;c dự &aacute;n phức tạp.</p>\n<p><span style="color: #000000; font-size: 13pt;"><strong>Hiểu s&acirc;u về c&aacute;c c&ocirc;ng cụ mạnh mẽ của Python: </strong></span>L&agrave;m chủ lập tr&igrave;nh hướng đối tượng, xử l&yacute; lỗi hiệu quả, v&agrave; quản l&yacute; c&aacute;c module v&agrave; packages.</p>\n<p><span style="color: #000000; font-size: 13pt;"><strong>Tự tin ứng dụng Python v&agrave;o thực tế: </strong></span>Từ xử l&yacute; dữ liệu, ph&aacute;t triển web đến tự động h&oacute;a c&aacute;c t&aacute;c vụ - tất cả đều nằm trong tầm tay bạn.</p>\n<p><span style="color: #506cf0; font-size: 13pt;"><strong><span style="color: #000000;">Mở ra cơ hội nghề nghiệp mới:</span> </strong></span>Trở th&agrave;nh ứng vi&ecirc;n s&aacute;ng gi&aacute; cho c&aacute;c vị tr&iacute; lập tr&igrave;nh vi&ecirc;n cao cấp, nh&agrave; ph&aacute;t triển phần mềm, v&agrave; nhiều cơ hội kh&aacute;c trong lĩnh vực c&ocirc;ng nghệ.</p>\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/238_531639a76ea34387a9bca8a1a728eea7.jpg" width="501" height="318" /></p>\n<p>&nbsp;</p>\n<p><span style="font-size: 18pt; color: #304090;"><strong>Đừng bỏ lỡ cơ hội để</strong></span></p>\n<p><span style="color: #000000; font-size: 13pt;"><strong>Thể hiện bản th&acirc;n: </strong></span>Chứng minh khả năng của bạn trong c&aacute;c dự &aacute;n thực tế v&agrave; tạo ấn tượng với nh&agrave; tuyển dụng.</p>\n<p><span style="color: #000000; font-size: 13pt;"><strong>Tiến bộ kh&ocirc;ng ngừng: </strong></span>Tiếp cận với những kiến thức mới nhất v&agrave; lu&ocirc;n đi đầu trong xu hướng c&ocirc;ng nghệ.</p>\n<p><span style="color: #000000; font-size: 13pt;"><strong>Tham gia cộng đồng học vi&ecirc;n năng động: </strong></span>Kết nối, học hỏi v&agrave; chia sẻ kinh nghiệm với c&aacute;c lập tr&igrave;nh vi&ecirc;n kh&aacute;c.</p>\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/4380747_b33b0943c490448cb1e216c06ed02956.jpg" width="501" height="501" /></p>\n<p><span style="font-size: 18pt; color: #304090;"><strong>Đăng k&yacute; ngay</strong></span></p>\n<p>Đừng chần chừ! Mỗi ng&agrave;y tr&ocirc;i qua l&agrave; một cơ hội bị bỏ lỡ. H&atilde;y đăng k&yacute; ngay h&ocirc;m nay để kh&aacute;m ph&aacute; v&agrave; chinh phục những thử th&aacute;ch mới với Python N&acirc;ng Cao. C&ugrave;ng ch&uacute;ng t&ocirc;i bước v&agrave;o thế giới lập tr&igrave;nh hiện đại v&agrave; mở ra những cơ hội nghề nghiệp mới đầy triển vọng!</p>\n<p>Nắm bắt cơ hội, tiến tới th&agrave;nh c&ocirc;ng. Đăng k&yacute; ngay h&ocirc;m nay v&agrave; trở th&agrave;nh một lập tr&igrave;nh vi&ecirc;n Python thực thụ!</p>	900000.0	https://localhost:7071/coursemate-files/7aae509c-b9c5-4fa4-8dea-3048bceff53c.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
7e7c3458-5caa-43c3-84d7-383ac98097f1	Làm quen với SQL	<h3 data-start="191" data-end="211">Giới thiệu về SQL</h3>\n<p class="" data-start="213" data-end="430"><strong data-start="213" data-end="248">SQL (Structured Query Language)</strong> &ndash; hay c&ograve;n gọi l&agrave; <em data-start="266" data-end="297">Ng&ocirc;n ngữ truy vấn c&oacute; cấu tr&uacute;c</em> &ndash; l&agrave; ng&ocirc;n ngữ ti&ecirc;u chuẩn d&ugrave;ng để <strong data-start="331" data-end="373">truy xuất, quản l&yacute; v&agrave; thao t&aacute;c dữ liệu</strong> trong c&aacute;c <strong data-start="384" data-end="421">hệ quản trị cơ sở dữ liệu quan hệ</strong> (RDBMS).</p>\n<p class="" data-start="432" data-end="691">Nếu bạn đang t&igrave;m kiếm một c&aacute;ch tiếp cận nhanh ch&oacute;ng v&agrave; hiệu quả để bắt đầu với SQL, kh&oacute;a học n&agrave;y sẽ l&agrave; người bạn đồng h&agrave;nh l&yacute; tưởng. N&oacute; bao gồm những chủ đề quan trọng nhất gi&uacute;p bạn hiểu c&aacute;ch thức hoạt động của SQL v&agrave; ứng dụng thực tế của n&oacute; trong c&ocirc;ng việc.</p>\n<h3 data-start="698" data-end="724">🔍 Tại sao n&ecirc;n học SQL?</h3>\n<p class="" data-start="726" data-end="889">SQL l&agrave; nền tảng kh&ocirc;ng thể thiếu trong lĩnh vực dữ liệu. Đ&acirc;y l&agrave; c&ocirc;ng cụ ch&iacute;nh được sử dụng để <strong data-start="819" data-end="865">lưu trữ, truy vấn, cập nhật v&agrave; x&oacute;a dữ liệu</strong> trong c&aacute;c hệ thống như:</p>\n<ul data-start="891" data-end="981">\n<li class="" data-start="891" data-end="902">\n<p class="" data-start="893" data-end="902"><strong data-start="893" data-end="902">MySQL</strong></p>\n</li>\n<li class="" data-start="903" data-end="929">\n<p class="" data-start="905" data-end="929"><strong data-start="905" data-end="929">Microsoft SQL Server</strong></p>\n</li>\n<li class="" data-start="930" data-end="942">\n<p class="" data-start="932" data-end="942"><strong data-start="932" data-end="942">Oracle</strong></p>\n</li>\n<li class="" data-start="943" data-end="959">\n<p class="" data-start="945" data-end="959"><strong data-start="945" data-end="959">PostgreSQL</strong></p>\n</li>\n<li class="" data-start="960" data-end="981">\n<p class="" data-start="962" data-end="981"><strong data-start="962" data-end="975">MS Access</strong>, v.v.</p>\n</li>\n</ul>\n<p class="" data-start="983" data-end="1150">Mặc d&ugrave; mỗi hệ thống c&oacute; thể sử dụng một <strong data-start="1022" data-end="1050">phương ngữ ri&ecirc;ng của SQL</strong> (như T-SQL trong SQL Server, PL/SQL trong Oracle), tất cả đều dựa tr&ecirc;n c&ugrave;ng một ng&ocirc;n ngữ chuẩn SQL.</p>\n<h3 data-start="1157" data-end="1187">🌐 Ứng dụng thực tế của SQL</h3>\n<p class="" data-start="1189" data-end="1305">SQL được sử dụng rộng r&atilde;i trong c&aacute;c hoạt động li&ecirc;n quan đến dữ liệu, từ đơn giản đến phức tạp. Cụ thể, SQL cho ph&eacute;p:</p>\n<ul data-start="1307" data-end="1735">\n<li class="" data-start="1307" data-end="1361">\n<p class="" data-start="1309" data-end="1361">Truy xuất v&agrave; xử l&yacute; dữ liệu từ cơ sở dữ liệu quan hệ.</p>\n</li>\n<li class="" data-start="1362" data-end="1401">\n<p class="" data-start="1364" data-end="1401">M&ocirc; tả cấu tr&uacute;c v&agrave; định nghĩa dữ liệu.</p>\n</li>\n<li class="" data-start="1402" data-end="1443">\n<p class="" data-start="1404" data-end="1443">Th&ecirc;m, sửa, x&oacute;a, lọc v&agrave; sắp xếp dữ liệu.</p>\n</li>\n<li class="" data-start="1444" data-end="1521">\n<p class="" data-start="1446" data-end="1521">Tạo v&agrave; x&oacute;a bảng, cơ sở dữ liệu, chế độ xem (views), thủ tục lưu trữ v&agrave; h&agrave;m.</p>\n</li>\n<li class="" data-start="1522" data-end="1601">\n<p class="" data-start="1524" data-end="1601">G&aacute;n quyền truy cập cho người d&ugrave;ng đối với c&aacute;c th&agrave;nh phần trong cơ sở dữ liệu.</p>\n</li>\n<li class="" data-start="1602" data-end="1735">\n<p class="" data-start="1604" data-end="1735">Nh&uacute;ng truy vấn SQL v&agrave;o c&aacute;c ng&ocirc;n ngữ lập tr&igrave;nh kh&aacute;c như Python, Java, C#, v.v. th&ocirc;ng qua c&aacute;c thư viện v&agrave; tr&igrave;nh bi&ecirc;n dịch hỗ trợ SQL.</p>\n</li>\n</ul>\n<h3 data-start="1742" data-end="1775">🎯 Đối tượng hướng đến</h3>\n<p class="" data-start="1777" data-end="2019">Kh&oacute;a học n&agrave;y n&agrave;y được thiết kế đặc biệt cho <strong data-start="1817" data-end="1838">người mới bắt đầu</strong> hoặc những ai muốn x&acirc;y dựng nền tảng vững chắc về SQL. Bạn sẽ được l&agrave;m quen từ những kh&aacute;i niệm cơ bản đến c&aacute;c kỹ thuật n&acirc;ng cao th&ocirc;ng qua <strong data-start="1977" data-end="2018">c&aacute;c v&iacute; dụ minh họa r&otilde; r&agrave;ng v&agrave; dễ hiểu</strong>.</p>\n<h3 data-start="2026" data-end="2051">Điều kiện ti&ecirc;n quyết</h3>\n<p class="" data-start="2053" data-end="2105">Trước khi bắt đầu, bạn n&ecirc;n c&oacute; một ch&uacute;t kiến thức về:</p>\n<ul data-start="2107" data-end="2259">\n<li class="" data-start="2107" data-end="2177">\n<p class="" data-start="2109" data-end="2177"><strong data-start="2109" data-end="2142">Cơ sở dữ liệu quan hệ (RDBMS)</strong> &ndash; hiểu được bảng, h&agrave;ng, cột l&agrave; g&igrave;.</p>\n</li>\n<li class="" data-start="2178" data-end="2259">\n<p class="" data-start="2180" data-end="2259"><strong data-start="2180" data-end="2209">Ng&ocirc;n ngữ lập tr&igrave;nh cơ bản</strong> &ndash; kh&ocirc;ng bắt buộc nhưng sẽ gi&uacute;p bạn học nhanh hơn.</p>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/0d54acad-f2fc-48e4-b428-7ec6ea30a3a8.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
820b7ae8-fcf9-46f4-b206-36d3bc57a496	JavaScript cơ bản	<p>JavaScript l&agrave; một ng&ocirc;n ngữ gia th&ecirc;m khả năng tương t&aacute;c cho website của bạn&nbsp;(v&iacute; dụ: tr&ograve; chơi, c&aacute;c phản hồi khi c&aacute;c n&uacute;t được nhấn hoặc nhập dữ liệu tr&ecirc;n form, kiểu&nbsp;động, hoạt họa). B&agrave;i viết n&agrave;y sẽ gi&uacute;p bạn khởi động với&nbsp;ng&ocirc;n ngữ th&uacute; vị n&agrave;y v&agrave; cho bạn&nbsp;&yacute; tưởng về những g&igrave; c&oacute; thể xảy ra.</p>\n<h3><strong>JavaScript l&agrave; g&igrave; ?</strong></h3>\n<p>JavaScript&nbsp;(viết tắt l&agrave; "js") l&agrave; một ng&ocirc;n ngữ lập tr&igrave;nh mang đầy đủ t&iacute;nh năng&nbsp;của một&nbsp;ng&ocirc;n ngữ lập tr&igrave;nh động&nbsp;m&agrave; khi n&oacute; được &aacute;p dụng&nbsp;v&agrave;o một t&agrave;i liệu&nbsp;HTML, n&oacute;&nbsp;c&oacute; thể đem lại khả năng tương t&aacute;c động tr&ecirc;n c&aacute;c trang web. Cha đẻ của ng&ocirc;n ngữ n&agrave;y l&agrave;&nbsp;Brendan Eich, đồng s&aacute;ng lập dự &aacute;n&nbsp;Mozilla,&nbsp;quỹ&nbsp;Mozilla, v&agrave; tập đo&agrave;n&nbsp;Mozilla.</p>\n<p>JavaScript thật sự rất linh hoạt. Bạn c&oacute; thể bắt đầu với c&aacute;c bước nhỏ, với&nbsp;? viện&nbsp;ảnh, bố cục c&oacute; t&iacute;nh&nbsp;thay đổi v&agrave; phản hồi đến c&aacute;c&nbsp;n&uacute;t nhấn. Khi c&oacute; nhiều kinh nghiệm hơn, bạn c&oacute; thể tạo ra c&aacute;c tr&ograve; chơi, hoạt họa 2 chiều hoặc 3 chiều, ứng dụng&nbsp;cơ sở dữ liệu to&agrave;n diện&nbsp;v&agrave; nhiều thứ kh&aacute;c!</p>\n<p>Bản th&acirc;n Javascript l&agrave; một ng&ocirc;n ngữ linh động. C&aacute;c nh&agrave; ph&aacute;t triển đ&atilde; viết ra một số lượng lớn c&aacute;c&nbsp;c&ocirc;ng cụ&nbsp;thuộc&nbsp;top của&nbsp;core Javascript, mở ra một lượng lớn t&iacute;nh năng bổ sung với &iacute;t nỗ lực nhất. N&oacute; bao gồm:</p>\n<ul>\n<li>Giao diện lập tr&igrave;nh ứng dụng tr&ecirc;n tr&igrave;nh duyệt&nbsp;(API) &mdash; C&aacute;c&nbsp;API được x&acirc;y dựng b&ecirc;n trong c&aacute;c tr&igrave;nh duyệt web, cung cấp t&iacute;nh năng như tạo HTML động, c&agrave;i đặt CSS, thu tập v&agrave; điều khiển video trực tiếp từ webcam của người d&ugrave;ng hoặc sinh ra đồ dọa 3D v&agrave; c&aacute;c mẫu&nbsp;audio.</li>\n<li>C&aacute;c API b&ecirc;n thứ ba cho ph&eacute;p nh&agrave; ph&aacute;t triển&nbsp;kết hợp&nbsp;t&iacute;nh năng trong website của họ từ người cung cấp nội dung kh&aacute;c chẳng hạn như Twitter hay Facebook.</li>\n<li>Từ c&aacute;c framework&nbsp;v&agrave; thư viện b&ecirc;n thứ ba bạn c&oacute; thể &aacute;p dụng tới t&agrave;i liệu HTML của bạn, cho ph&eacute;p bạn nhanh ch&oacute;ng x&acirc;y dựng được c&aacute;c trang web v&agrave; c&aacute;c ứng dụng.</li>\n</ul>\n<p>V&igrave; kh&oacute;a học n&agrave;y chỉ giới thiệu về JavaScript, ch&uacute;ng t&ocirc;i sẽ kh&ocirc;ng l&agrave;m bạn bối rối khi n&oacute;i r&otilde; hơn về sự kh&aacute;c nhau giữa m&atilde; nguồn JavaScript căn bản v&agrave; những c&ocirc;ng cụ được liệt k&ecirc; ở tr&ecirc;n. Bạn c&oacute; thể t&igrave;m hiểu chi tiết trong Mục học JavaScript, v&agrave; MDN.</p>\n<p>Ở phần dưới ch&uacute;ng t&ocirc;i sẽ giới thiệu cho bạn một số kh&iacute;a cạnh cơ bản về JavaScript v&agrave; bạn cũng sẽ được l&agrave;m việc với một v&agrave;i API. Ch&uacute;c bạn học tốt!</p>\n<hr />\n<h3>Ứng dụng của JavaScript.</h3>\n<p><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/HaiZuka/js_web2.png" alt="" width="696" height="348" /></p>\n<ul>\n<li><strong>Ứng dụng trong lập tr&igrave;nh website</strong>:<br />Khi nhắc đến lập tr&igrave;nh web người ta kh&ocirc;ng thể kh&ocirc;ng nhắc đến bộ 03 HTML, CSS v&agrave;&nbsp;JavaScript. C&oacute; thể n&oacute;i kh&ocirc;ng phải l&agrave; tất cả, song hầu như c&aacute;c website đang chạy hiện nay đều sử dụng JavaScript v&agrave; c&aacute;c Front-end framework của n&oacute; như:&nbsp;Bootstrap, jQuery &nbsp;Foundation, UIKit,&hellip; &nbsp;Ở đ&oacute;&nbsp;JavaScript gi&uacute;p tạo c&aacute;c hiệu ứng hiển thị tr&ecirc;n website, c&aacute;c tương t&aacute;c với người d&ugrave;ng.</li>\n<li><strong>X&acirc;y dựng c&aacute;c ứng dụng web cho m&aacute;y chủ:</strong><br />Đ&acirc;y l&agrave; một xu hướng c&ocirc;ng nghệ c&oacute; thể n&oacute;i l&agrave; rất h&oacute;t hiện nay (từ 2016 đến giờ). C&aacute;c anh em lập tr&igrave;nh vi&ecirc;n kh&aacute; h&agrave;o hứng với c&aacute;c Frame work từ JavaScript như:&nbsp;Node.js,&nbsp;AngularJS,&hellip; Cụ thể những c&aacute;i n&agrave;y sẽ hỗ trợ tạo ra c&aacute;c ứng dụng web thi&ecirc;n về tương t&aacute;c thời gian thực của người d&ugrave;ng.&nbsp; Nếu c&ugrave;ng cấu h&igrave;nh m&aacute;y chủ tương tự th&igrave; điều đ&oacute; l&agrave; kh&ocirc;ng thể đối với PHP, Java, Python, .Net khi số lượng user tương t&aacute;c c&ugrave;ng l&uacute;c qu&aacute; nhiều. M&aacute;y chủ sẽ kh&ocirc;ng thể n&agrave;o g&aacute;nh nổi, nhưng với c&aacute;c Frame work của JavaScript th&igrave; mọi chuyện sẽ ho&agrave;n to&agrave;n kh&aacute;c.</li>\n<li><strong>X&acirc;y dựng c&aacute;c ứng dụng di động, tr&ograve; chơi v&agrave; ứng dụng tr&ecirc;n desktop.</strong></li>\n</ul>\n<hr />\n<h3>Học vi&ecirc;n nhận được những g&igrave; khi tham gia kh&oacute;a học.</h3>\n<ul>\n<li>C&aacute;c l&yacute; thuyết cơ bản về chương trinh JavaScript.</li>\n<li>Biết c&aacute;ch sử dụng c&aacute;c to&aacute;n tử trong JavaScript.</li>\n<li>L&agrave;m quen với c&aacute;c c&acirc;u lệnh v&agrave; c&aacute;c cấu tr&uacute;c dữ liệu trong JavaScrip:\n<ul>\n<li>C&acirc;u lệnh điều kiện.</li>\n<li>V&ograve;ng lặp.</li>\n<li>Phương thức mảng.</li>\n<li>Phương thức chuỗi.</li>\n<li>Phương thức dữ liệu.</li>\n</ul>\n</li>\n<li>Biết c&aacute;c thư viện li&ecirc;n quan đến thuật to&aacute;n.</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/a0b25773-a5c6-49f1-a624-ceb19de597d3.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
a4058b75-8386-431f-89a8-a28fa65ca6bf	Điện toán đám mây	<h3 data-start="221" data-end="314">Kh&oacute;a học <strong data-start="233" data-end="253">Cloud Essentials</strong> &ndash; Nền tảng vững chắc để bước v&agrave;o thế giới điện to&aacute;n đ&aacute;m m&acirc;y!</h3>\n<p class="" data-start="316" data-end="685">Trong thời đại số, <strong data-start="335" data-end="374">điện to&aacute;n đ&aacute;m m&acirc;y (cloud computing)</strong> đ&atilde; trở th&agrave;nh nền tảng kh&ocirc;ng thể thiếu cho mọi tổ chức v&agrave; c&aacute; nh&acirc;n trong việc ph&aacute;t triển ứng dụng, lưu trữ dữ liệu v&agrave; vận h&agrave;nh hệ thống. Kh&oacute;a học <strong data-start="519" data-end="539">Cloud Essentials</strong> sẽ gi&uacute;p bạn <strong data-start="552" data-end="585">hiểu r&otilde; c&aacute;c kh&aacute;i niệm cốt l&otilde;i</strong> về cloud, từ đ&oacute; sẵn s&agrave;ng cho h&agrave;nh tr&igrave;nh ứng dụng v&agrave; ph&aacute;t triển trong m&ocirc;i trường c&ocirc;ng nghệ hiện đại.</p>\n<h3 data-start="692" data-end="730">Bạn sẽ học được g&igrave; từ kh&oacute;a học n&agrave;y?</h3>\n<p class="" data-start="734" data-end="831">✅ <strong data-start="736" data-end="783">Hiểu tổng quan về kiến tr&uacute;c Cloud Computing</strong> v&agrave; c&aacute;c th&agrave;nh phần cốt l&otilde;i như IaaS, PaaS, SaaS.</p>\n<p class="" data-start="834" data-end="915">✅ <strong data-start="836" data-end="879">Nắm được c&aacute;c y&ecirc;u cầu v&agrave; kỹ thuật cơ bản</strong> để l&agrave;m việc với c&aacute;c hệ thống cloud.</p>\n<p class="" data-start="918" data-end="1024">✅ <strong data-start="920" data-end="956">Học c&aacute;ch tạo ứng dụng v&agrave; b&aacute;o c&aacute;o</strong> tr&ecirc;n nền tảng cloud, phục vụ cho nhiều đối tượng sử dụng kh&aacute;c nhau.</p>\n<p class="" data-start="1027" data-end="1123">✅ <strong data-start="1029" data-end="1071">L&agrave;m quen với Amazon Web Services (AWS)</strong> &ndash; nền tảng cloud phổ biến v&agrave; mạnh mẽ nhất hiện nay.</p>\n<p class="" data-start="1126" data-end="1227">✅ <strong data-start="1128" data-end="1191">T&igrave;m hiểu về bảo mật, Web API, v&agrave; c&aacute;c dịch vụ cloud phổ biến</strong> để &aacute;p dụng trong c&aacute;c dự &aacute;n thực tế.</p>\n<p class="" data-start="1126" data-end="1227">✅ <strong data-start="1232" data-end="1266">R&egrave;n luyện v&agrave; củng cố kiến thức</strong> với bộ c&acirc;u hỏi &ocirc;n tập cuối kh&oacute;a, gi&uacute;p bạn chuẩn bị tốt cho việc thi cử hoặc &aacute;p dụng thực tế.</p>\n<h3 data-start="1366" data-end="1396">Nội dung ch&iacute;nh của kh&oacute;a học</h3>\n<p class="" data-start="1398" data-end="1546">📌 <strong data-start="1401" data-end="1447">Kiến tr&uacute;c v&agrave; nguy&ecirc;n l&yacute; hoạt động của Cloud</strong><br data-start="1447" data-end="1450" />T&igrave;m hiểu c&aacute;c m&ocirc; h&igrave;nh triển khai (public, private, hybrid) v&agrave; m&ocirc; h&igrave;nh dịch vụ (IaaS, PaaS, SaaS).</p>\n<p class="" data-start="1548" data-end="1693">📌 <strong data-start="1551" data-end="1592">Kỹ thuật cơ bản trong cloud computing</strong><br data-start="1592" data-end="1595" />Giới thiệu c&aacute;c th&agrave;nh phần quan trọng như v&ugrave;ng (regions), instance, lưu trữ, mạng, cơ sở dữ liệu...</p>\n<p class="" data-start="1695" data-end="1858">📌 <strong data-start="1698" data-end="1750">X&acirc;y dựng ứng dụng v&agrave; b&aacute;o c&aacute;o tr&ecirc;n nền tảng Cloud</strong><br data-start="1750" data-end="1753" />Hướng dẫn c&aacute;ch tạo v&agrave; triển khai ứng dụng, thiết lập b&aacute;o c&aacute;o tự động phục vụ cho doanh nghiệp v&agrave; c&aacute; nh&acirc;n.</p>\n<p class="" data-start="1860" data-end="2000">📌 <strong data-start="1863" data-end="1884">Giới thiệu về AWS</strong><br data-start="1884" data-end="1887" />Tổng quan về Amazon Web Services, c&aacute;ch sử dụng giao diện AWS, thiết lập t&agrave;i nguy&ecirc;n v&agrave; sử dụng c&aacute;c dịch vụ cơ bản.</p>\n<p class="" data-start="2002" data-end="2138">📌 <strong data-start="2005" data-end="2027">Bảo mật v&agrave; Web API</strong><br data-start="2027" data-end="2030" />L&agrave;m quen với c&aacute;c kh&aacute;i niệm bảo mật tr&ecirc;n cloud, quyền truy cập, v&agrave; c&aacute;ch kết nối, giao tiếp th&ocirc;ng qua Web API.</p>\n<p class="" data-start="2140" data-end="2264">📌 <strong data-start="2143" data-end="2171">C&acirc;u hỏi &ocirc;n tập cuối kh&oacute;a</strong><br data-start="2171" data-end="2174" />Hệ thống c&acirc;u hỏi gi&uacute;p củng cố kiến thức v&agrave; tự đ&aacute;nh gi&aacute; khả năng tiếp thu sau mỗi phần học.</p>\n<h3 data-start="2271" data-end="2286">Kh&oacute;a học n&agrave;y d&agrave;nh cho ai?</h3>\n<p class="" data-start="2288" data-end="2330">Kh&oacute;a học <strong data-start="2297" data-end="2317">Cloud Essentials</strong> ph&ugrave; hợp với:</p>\n<ul data-start="2332" data-end="2613">\n<li class="" data-start="2332" data-end="2380">\n<p class="" data-start="2334" data-end="2380">Người mới bắt đầu t&igrave;m hiểu về cloud computing.</p>\n</li>\n<li class="" data-start="2381" data-end="2460">\n<p class="" data-start="2383" data-end="2460">Sinh vi&ecirc;n CNTT, kỹ thuật muốn c&oacute; nền tảng vững chắc trước khi học chuy&ecirc;n s&acirc;u.</p>\n</li>\n<li class="" data-start="2461" data-end="2547">\n<p class="" data-start="2463" data-end="2547">Lập tr&igrave;nh vi&ecirc;n, kỹ sư hệ thống muốn l&agrave;m quen với cloud để &aacute;p dụng v&agrave;o dự &aacute;n thực tế.</p>\n</li>\n<li class="" data-start="2548" data-end="2613">\n<p class="" data-start="2550" data-end="2613">Người l&agrave;m việc trong lĩnh vực dữ liệu, BI, quản trị hệ thống...</p>\n</li>\n</ul>\n<h3 data-start="2620" data-end="2665">Sẵn s&agrave;ng cho tương lai với nền tảng Cloud!</h3>\n<p>Nếu bạn muốn <strong data-start="2685" data-end="2713">nắm bắt xu thế c&ocirc;ng nghệ</strong> v&agrave; <strong data-start="2717" data-end="2762">ứng dụng cloud v&agrave;o c&ocirc;ng việc hoặc học tập</strong>, kh&oacute;a học n&agrave;y ch&iacute;nh l&agrave; lựa chọn l&yacute; tưởng để bạn bắt đầu.</p>	0.0	https://localhost:7071/coursemate-files/2614a6f0-bcce-456a-b7d0-eed74feac4b4.png	t	9483a3b6-2fc1-4536-9792-d998b843da73	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
a9238453-835c-4c08-96e3-7a6b41bb2b76	Phần mềm máy tính	<h3>Tổng quan về Phần mềm m&aacute;y t&iacute;nh</h3>\n<ul>\n<li>\n<p style="font-weight: 400;">Phần mềm m&aacute;y t&iacute;nh (Computer Software) hay gọi tắt l&agrave; Phần mềm (Software) l&agrave; một tập hợp những c&acirc;u lệnh hoặc chỉ thị được viết bằng một hoặc nhiều ng&ocirc;n ngữ lập tr&igrave;nh nhằm tự động thực hiện một số nhiệm vụ hay một vấn đề cụ thể n&agrave;o đ&oacute; tr&ecirc;n m&aacute;y t&iacute;nh hay n&oacute;i một c&aacute;c đơn giản ch&iacute;nh l&agrave; thao t&aacute;c với m&aacute;y t&iacute;nh.</p>\n</li>\n<li>\n<p style="font-weight: 400;">Phần mềm thực hiện c&aacute;c chức năng bằng c&aacute;ch gửi c&aacute;c chỉ thị trực tiếp đến phần cứng hoặc cung cấp dữ liệu để phục vụ c&aacute;c chương tr&igrave;nh hay phần mềm kh&aacute;c.</p>\n</li>\n<li>\n<p style="font-weight: 400;">Phần mềm l&agrave; một kh&aacute;i niệm trừu tượng, kh&ocirc;ng giống với phần cứng ở chỗ l&agrave; &ldquo;phần mềm kh&ocirc;ng thể bị t&aacute;c động vật l&yacute;&rdquo;, v&agrave; phần mềm cần phải c&oacute; phần cứng m&aacute;y t&iacute;nh mới c&oacute; thể thực thi được.</p>\n</li>\n<li>\n<p>Phần cứng thường được hướng dẫn (điều khiển) bởi phần mềm để thực hiện c&aacute;c lệnh.&nbsp;Sự kết hợp giữa phần cứng v&agrave; phần mềm một c&aacute;ch ph&ugrave; hợp tạo th&agrave;nh một hệ thống m&aacute;y t&iacute;nh c&oacute; thể sử dụng được.</p>\n</li>\n<li>\n<p>Lịch sử h&igrave;nh th&agrave;nh của m&aacute;y t&iacute;nh n&oacute;i chung cũng ch&iacute;nh l&agrave; lịch sử ph&aacute;t triển của Phần mềm m&aacute;y t&iacute;nh.&nbsp;</p>\n</li>\n<li>Ng&agrave;y nay m&aacute;y t&iacute;nh được cải tiến li&ecirc;n tục với tốc độ v&agrave; khả năng xử l&yacute; mạnh mẽ. Phần mềm qua đ&oacute; cũng được cải tiến về chức năng để phục vụ cho c&aacute;c c&ocirc;ng việc c&oacute; độ phức tạp ng&agrave;y c&agrave;ng cao.</li>\n</ul>\n<hr />\n<h3>Ứng dụng của Phần mềm m&aacute;y t&iacute;nh</h3>\n<p>Nếu phần cứng m&aacute;y t&iacute;nh ch&iacute;nh l&agrave; phần "th&acirc;n x&aacute;c" của m&aacute;y t&iacute;nh, th&igrave; phần mềm l&agrave; "khối &oacute;c". Phần cứng, kết hợp với phần mềm m&aacute;y t&iacute;nh tạo ra một chiếc m&aacute;y t&iacute;nh ho&agrave;n chỉnh c&oacute; thể chạy được. Phần mềm gi&uacute;p cho một chiếc m&aacute;y t&iacute;nh từ một khối những thiết bị m&aacute;y m&oacute;c v&ocirc; chi c&oacute; thể thực hiện những thao t&aacute;c, t&iacute;nh to&aacute;n, xử l&yacute; với độ ch&iacute;nh x&aacute;c v&agrave; tốc độ vượt xa con người. Tr&ecirc;n cơ sở tận dụng sức mạnh của phần cứng, phần mềm gi&uacute;p con người thực hiện gần như mọi c&ocirc;ng việc phức tạp m&agrave; trước đ&oacute; kh&ocirc;ng thể thực hiện. Sự ti&ecirc;n tiến về c&ocirc;ng nghệ của một c&ocirc;ng ty hay quốc gia, khu vực c&oacute; thể được đ&aacute;nh gi&aacute; bởi phần mềm họ sử dụng trong c&aacute;c c&ocirc;ng việc. Mọi thiết bị điện tử sẽ trở n&ecirc;n v&ocirc; dụng nếu kh&ocirc;ng c&oacute; phần mềm.</p>\n<h4>C&aacute;c c&ocirc;ng ty lớn về c&ocirc;ng nghệ đều ph&aacute;t triển phần mềm m&aacute;y t&iacute;nh.</h4>\n<p>Để gi&uacute;p c&aacute;c bạn thấy được phần mềm m&aacute;y t&iacute;nh c&oacute; vai tr&ograve; quan trọng như thế n&agrave;o, h&atilde;y xem danh s&aacute;ch c&aacute;c c&ocirc;ng ty c&ocirc;ng nghệ lớn nhất thế giới, tất cả đều ph&aacute;t triển c&aacute;c phần mềm m&aacute;y t&iacute;nh cho ri&ecirc;ng m&igrave;nh.</p>\n<figure id="attachment_1505" class="wp-caption aligncenter" aria-describedby="caption-attachment-1505"><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/Shanghaik/Pictures/hardware.png" alt="" width="797" height="405" /></figure>\n<p>Như bạn thấy, phần mềm m&aacute;y t&iacute;nh gắn liền mật thiết với c&aacute;c c&ocirc;ng ty c&ocirc;ng nghệ h&agrave;ng đầu, c&aacute;c thương hiệu m&aacute;y t&iacute;nh ứng với c&aacute;c doanh nghiệp tr&ecirc;n l&agrave; v&ocirc; c&ugrave;ng nổi tiếng. Sự li&ecirc;n hệ mật thiết giữa phần cứng v&agrave; phần mềm ch&iacute;nh l&agrave; l&yacute; do họ ph&aacute;t triển song song cả 2 để c&oacute; sự tương t&aacute;c tốt nhất tr&ecirc;n sản phầm của m&igrave;nh.</p>\n<h4>Ph&acirc;n loại phần mềm</h4>\n<p>Phần mềm m&aacute;y t&iacute;nh c&oacute; thể được ph&acirc;n loại theo nhiều c&aacute;ch thức kh&aacute;c nhau. Ta c&oacute; thể ph&acirc;n loại theo chức năng, ứng dụng hay thậm ch&iacute; về t&iacute;nh mở.</p>\n<hr />\n<h3>Học vi&ecirc;n sẽ nhận được những g&igrave; trong kh&oacute;a học:</h3>\n<ul>\n<li>Hiểu c&aacute;ch ph&acirc;n biệt v&agrave; c&ocirc;ng dụng của mềm m&aacute;y t&iacute;nh.\n<ul>\n<li>Biết c&aacute;ch x&aacute;c định x&aacute;c th&agrave;nh phần phần mềm m&aacute;y t&iacute;nh.</li>\n<li>Biết được ứng dụng của ch&uacute;ng trong thực tế.</li>\n<li>Biết c&aacute;ch m&agrave; phần mềm m&aacute;y t&iacute;nh điều khiển hoạt động của m&aacute;y t&iacute;nh.</li>\n</ul>\n</li>\n<li>Hiểu được c&aacute;ch hoạt động của phần mềm m&aacute;y t&iacute;nh.\n<ul>\n<li>Hiểu c&aacute;ch m&agrave; phần mềm tương t&aacute;c với phần cứng v&agrave; th&ocirc;ng tin.</li>\n<li>Phần mềm v&agrave; c&aacute;c t&iacute;nh năng đặc biệt.</li>\n</ul>\n</li>\n<li>T&igrave;m hiểu về c&aacute;c phần mềm cụ thể, t&iacute;nh năng v&agrave; ứng dụng thực tế\n<ul>\n<li>Nhu cầu cho giải tr&iacute;.</li>\n<li>Nhu cầu cho l&agrave;m việc.</li>\n<li>Nhu cầu cho học tập.</li>\n</ul>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/812f555c-ebf4-4db6-abfa-e8274b86778b.png	t	01ebd503-5522-4871-81a4-ec12bd80cdf3	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
acdafa98-5779-491b-b172-a6aeb14c5af1	Lập trình hướng đối tượng trong java	<h3 data-start="158" data-end="249">Kh&aacute;m ph&aacute; sức mạnh của "Lập tr&igrave;nh Hướng đối tượng" trong Java!</h3>\n<p class="" data-start="251" data-end="635">Trong kỷ nguy&ecirc;n c&ocirc;ng nghệ hiện nay, việc hiểu v&agrave; th&agrave;nh thạo lập tr&igrave;nh hướng đối tượng (OOP) l&agrave; <strong data-start="346" data-end="396">ch&igrave;a kh&oacute;a mở ra c&aacute;nh cửa s&aacute;ng tạo v&agrave; hiệu suất</strong> cho bất kỳ lập tr&igrave;nh vi&ecirc;n n&agrave;o. Java, với c&uacute; ph&aacute;p r&otilde; r&agrave;ng v&agrave; t&iacute;nh ổn định cao, kh&ocirc;ng chỉ l&agrave; một trong những ng&ocirc;n ngữ lập tr&igrave;nh phổ biến nhất thế giới m&agrave; c&ograve;n l&agrave; nền tảng mạnh mẽ để ph&aacute;t triển ứng dụng theo m&ocirc; h&igrave;nh lập tr&igrave;nh hướng đối tượng.</p>\n<h3 data-start="642" data-end="676">Bạn sẽ học được g&igrave; từ kh&oacute;a học?</h3>\n<p class="" data-start="678" data-end="710">Trong kh&oacute;a học n&agrave;y, bạn sẽ được:</p>\n<ul data-start="712" data-end="1195">\n<li class="" data-start="712" data-end="957">\n<p class="" data-start="714" data-end="957"><strong data-start="714" data-end="776">Kh&aacute;m ph&aacute; to&agrave;n diện về lập tr&igrave;nh hướng đối tượng trong Java</strong>, từ những kh&aacute;i niệm cơ bản như <em data-start="808" data-end="813">lớp</em>, <em data-start="815" data-end="826">đối tượng</em>, <em data-start="828" data-end="837">kế thừa</em> cho đến c&aacute;c kh&aacute;i niệm n&acirc;ng cao như <em data-start="873" data-end="882">đa h&igrave;nh</em>, <em data-start="884" data-end="894">đ&oacute;ng g&oacute;i</em>, <em data-start="896" data-end="919">giao diện (interface)</em> v&agrave; <em data-start="923" data-end="956">lớp trừu tượng (abstract class)</em>.</p>\n</li>\n<li class="" data-start="958" data-end="1058">\n<p class="" data-start="960" data-end="1058"><strong data-start="960" data-end="1018">L&agrave;m quen với c&aacute;ch tổ chức v&agrave; quản l&yacute; m&atilde; nguồn hiệu quả</strong> th&ocirc;ng qua việc sử dụng <em data-start="1042" data-end="1057">g&oacute;i (package)</em>.</p>\n</li>\n<li class="" data-start="1059" data-end="1195">\n<p class="" data-start="1061" data-end="1195"><strong data-start="1061" data-end="1127">Ph&aacute;t triển tư duy lập tr&igrave;nh hướng đối tượng một c&aacute;ch thực tiễn</strong> th&ocirc;ng qua c&aacute;c b&agrave;i tập, v&iacute; dụ minh họa v&agrave; dự &aacute;n &aacute;p dụng v&agrave;o thực tế.</p>\n</li>\n</ul>\n<h3 data-start="1202" data-end="1258">Tại sao n&ecirc;n học lập tr&igrave;nh hướng đối tượng trong Java?</h3>\n<p class="" data-start="1260" data-end="1327">Lập tr&igrave;nh hướng đối tượng l&agrave; một phương ph&aacute;p mạnh mẽ, cho ph&eacute;p bạn:</p>\n<ul data-start="1329" data-end="1527">\n<li class="" data-start="1329" data-end="1372">\n<p class="" data-start="1331" data-end="1372"><strong data-start="1331" data-end="1371">Tổ chức m&atilde; nguồn r&otilde; r&agrave;ng, dễ bảo tr&igrave;</strong>.</p>\n</li>\n<li class="" data-start="1373" data-end="1440">\n<p class="" data-start="1375" data-end="1440"><strong data-start="1375" data-end="1402">T&aacute;i sử dụng m&atilde; hiệu quả</strong>, gi&uacute;p tiết kiệm thời gian ph&aacute;t triển.</p>\n</li>\n<li class="" data-start="1441" data-end="1527">\n<p class="" data-start="1443" data-end="1527"><strong data-start="1443" data-end="1483">Mở rộng v&agrave; n&acirc;ng cấp hệ thống dễ d&agrave;ng</strong> nhờ t&iacute;nh linh hoạt v&agrave; khả năng mở rộng cao.</p>\n</li>\n</ul>\n<h3 data-start="1534" data-end="1588">C&aacute;c t&iacute;nh chất cốt l&otilde;i trong OOP m&agrave; bạn sẽ được học:</h3>\n<p class="" data-start="1590" data-end="1720">🔹 <strong data-start="1593" data-end="1623">T&iacute;nh kế thừa (Inheritance)</strong><br data-start="1623" data-end="1626" />Cho ph&eacute;p lớp con kế thừa thuộc t&iacute;nh v&agrave; phương thức từ lớp cha, gi&uacute;p t&aacute;i sử dụng v&agrave; mở rộng m&atilde;.</p>\n<p class="" data-start="1722" data-end="1848">🔹 <strong data-start="1725" data-end="1758">T&iacute;nh đ&oacute;ng g&oacute;i (Encapsulation)</strong><br data-start="1758" data-end="1761" />Gi&uacute;p bảo vệ dữ liệu, giới hạn quyền truy cập v&agrave; kiểm so&aacute;t c&aacute;ch c&aacute;c đối tượng tương t&aacute;c.</p>\n<p class="" data-start="1850" data-end="2022">🔹 <strong data-start="1853" data-end="1884">T&iacute;nh đa h&igrave;nh (Polymorphism)</strong><br data-start="1884" data-end="1887" />Cho ph&eacute;p đối tượng thuộc c&aacute;c lớp kh&aacute;c nhau phản hồi theo c&aacute;ch ri&ecirc;ng đối với c&ugrave;ng một phương thức, gi&uacute;p tăng t&iacute;nh linh hoạt trong xử l&yacute;.</p>\n<p class="" data-start="2024" data-end="2125">🔹 <strong data-start="2027" data-end="2044">G&oacute;i (Package)</strong><br data-start="2044" data-end="2047" />Tổ chức c&aacute;c lớp li&ecirc;n quan th&agrave;nh nh&oacute;m để dễ d&agrave;ng quản l&yacute; v&agrave; tr&aacute;nh xung đột t&ecirc;n.</p>\n<p class="" data-start="2127" data-end="2311">🔹 <strong data-start="2130" data-end="2190">Lớp trừu tượng v&agrave; giao diện (Abstract Class &amp; Interface)</strong><br data-start="2190" data-end="2193" />Định nghĩa c&aacute;c khung cấu tr&uacute;c (contract) cho c&aacute;c lớp kế thừa, gi&uacute;p x&acirc;y dựng hệ thống c&oacute; t&iacute;nh mở rộng v&agrave; linh hoạt cao.</p>\n<h3 data-start="2318" data-end="2356">Ứng dụng thực tế của OOP trong Java</h3>\n<p class="" data-start="2358" data-end="2467">Lập tr&igrave;nh hướng đối tượng kh&ocirc;ng chỉ l&agrave; l&yacute; thuyết, m&agrave; được <strong data-start="2416" data-end="2466">ứng dụng rộng r&atilde;i trong c&aacute;c lĩnh vực c&ocirc;ng nghệ</strong>:</p>\n<p class="" data-start="2471" data-end="2620">✅ <strong data-start="2473" data-end="2515">Ph&aacute;t triển ứng dụng desktop v&agrave; di động</strong><br data-start="2515" data-end="2518" />Sử dụng c&aacute;c lớp để đại diện cho kh&aacute;ch h&agrave;ng, đơn h&agrave;ng, sản phẩm&hellip; gi&uacute;p hệ thống dễ mở rộng v&agrave; bảo tr&igrave;.</p>\n<p class="" data-start="2624" data-end="2753">✅ <strong data-start="2626" data-end="2645">Ph&aacute;t triển game</strong><br data-start="2645" data-end="2648" />Mỗi nh&acirc;n vật, vật phẩm hay đối tượng trong game đều được m&ocirc; phỏng th&ocirc;ng qua c&aacute;c lớp v&agrave; kế thừa h&agrave;nh vi.</p>\n<p class="" data-start="2757" data-end="2925">✅ <strong data-start="2759" data-end="2801">Ph&aacute;t triển web (Java Web, Spring Boot)</strong><br data-start="2801" data-end="2804" />Tổ chức dự &aacute;n theo m&ocirc; h&igrave;nh MVC, sử dụng lớp để biểu diễn dữ liệu (Model), xử l&yacute; logic (Controller), v&agrave; hiển thị (View).</p>\n<p class="" data-start="2929" data-end="3082">✅ <strong data-start="2931" data-end="2974">X&acirc;y dựng hệ thống quản l&yacute; cơ sở dữ liệu</strong><br data-start="2974" data-end="2977" />Mỗi bảng, cột, h&agrave;ng trong CSDL được đại diện bằng đối tượng Java gi&uacute;p thao t&aacute;c với dữ liệu dễ d&agrave;ng hơn.</p>\n<p class="" data-start="3086" data-end="3250">✅ <strong data-start="3088" data-end="3115">Ph&aacute;t triển ứng dụng IoT</strong><br data-start="3115" data-end="3118" />C&aacute;c thiết bị như cảm biến, hệ thống điều khiển được m&ocirc; h&igrave;nh h&oacute;a bằng c&aacute;c lớp đại diện cho thiết bị v&agrave; h&agrave;nh vi tương t&aacute;c của ch&uacute;ng.</p>\n<h3 data-start="3257" data-end="3272">Kh&oacute;a học n&agrave;y d&agrave;nh cho ai?</h3>\n<p class="" data-start="3274" data-end="3299">Kh&oacute;a học n&agrave;y ph&ugrave; hợp với:</p>\n<ul data-start="3301" data-end="3546">\n<li class="" data-start="3301" data-end="3358">\n<p class="" data-start="3303" data-end="3358">Người mới l&agrave;m quen với Java muốn học lập tr&igrave;nh b&agrave;i bản.</p>\n</li>\n<li class="" data-start="3359" data-end="3414">\n<p class="" data-start="3361" data-end="3414">Lập tr&igrave;nh vi&ecirc;n muốn củng cố hoặc n&acirc;ng cao tư duy OOP.</p>\n</li>\n<li class="" data-start="3415" data-end="3481">\n<p class="" data-start="3417" data-end="3481">Sinh vi&ecirc;n IT chuẩn bị l&agrave;m đồ &aacute;n, thi phỏng vấn hoặc đi thực tập.</p>\n</li>\n<li class="" data-start="3482" data-end="3546">\n<p class="" data-start="3484" data-end="3546">Người đi l&agrave;m trong ng&agrave;nh kỹ thuật phần mềm, AI, Web, Mobile...</p>\n</li>\n</ul>\n<h3 data-start="3553" data-end="3581">H&atilde;y bắt đầu ngay h&ocirc;m nay!</h3>\n<p class="" data-start="3583" data-end="3733">Nếu bạn đang t&igrave;m kiếm cơ hội để <strong data-start="3615" data-end="3645">n&acirc;ng cao kỹ năng lập tr&igrave;nh</strong> v&agrave; <strong data-start="3649" data-end="3683">x&acirc;y dựng ứng dụng Java mạnh mẽ</strong>, đ&acirc;y ch&iacute;nh l&agrave; nơi khởi đầu l&yacute; tưởng d&agrave;nh cho bạn.</p>	0.0	https://localhost:7071/coursemate-files/0f7e6b72-1553-4910-863b-6806115a5502.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Truyền thông và Mạng máy tính	<h3 data-start="279" data-end="309">Giới thiệu về Mạng m&aacute;y t&iacute;nh</h3>\n<p class="" data-start="315" data-end="693"><strong data-start="315" data-end="332">Mạng m&aacute;y t&iacute;nh</strong> l&agrave; nền tảng cốt l&otilde;i cho c&aacute;c hệ thống th&ocirc;ng tin hiện đại, đ&oacute;ng vai tr&ograve; kết nối c&aacute;c thiết bị để chia sẻ t&agrave;i nguy&ecirc;n, dữ liệu v&agrave; dịch vụ. Kh&oacute;a học n&agrave;y cung cấp cho bạn c&aacute;i nh&igrave;n to&agrave;n diện về <strong data-start="519" data-end="569">c&aacute;c kh&aacute;i niệm, th&agrave;nh phần v&agrave; ứng dụng của mạng</strong>, từ cơ bản đến thực tế, gi&uacute;p bạn tự tin hơn khi sử dụng hoặc thiết lập mạng trong m&ocirc;i trường học tập, l&agrave;m việc v&agrave; gia đ&igrave;nh.</p>\n<h3 data-start="700" data-end="739">🔍 Tại sao n&ecirc;n học về Mạng m&aacute;y t&iacute;nh?</h3>\n<p class="" data-start="745" data-end="840">Việc hiểu biết về mạng kh&ocirc;ng chỉ gi&uacute;p bạn sử dụng c&ocirc;ng nghệ một c&aacute;ch hiệu quả, m&agrave; c&ograve;n gi&uacute;p bạn:</p>\n<ul data-start="842" data-end="1284">\n<li class="" data-start="842" data-end="951">\n<p class="" data-start="844" data-end="951"><strong data-start="844" data-end="903">Hiểu được c&aacute;ch c&aacute;c thiết bị kết nối v&agrave; trao đổi dữ liệu</strong>, từ mạng nội bộ (LAN) đến mạng diện rộng (WAN).</p>\n</li>\n<li class="" data-start="952" data-end="1056">\n<p class="" data-start="954" data-end="1056"><strong data-start="954" data-end="997">L&agrave;m chủ c&aacute;c kiến thức về truyền dữ liệu</strong>, băng th&ocirc;ng, tốc độ kết nối v&agrave; c&aacute;c phương tiện truyền dẫn.</p>\n</li>\n<li class="" data-start="1057" data-end="1177">\n<p class="" data-start="1059" data-end="1177"><strong data-start="1059" data-end="1132">Ph&acirc;n biệt v&agrave; lựa chọn đ&uacute;ng c&aacute;c loại h&igrave;nh v&agrave; thiết bị kết nối Internet</strong>, từ ADSL, FTTH cho tới kh&ocirc;ng d&acirc;y v&agrave; vệ tinh.</p>\n</li>\n<li class="" data-start="1178" data-end="1284">\n<p class="" data-start="1180" data-end="1284"><strong data-start="1180" data-end="1255">Biết c&aacute;ch tự cấu h&igrave;nh v&agrave; bảo tr&igrave; mạng trong gia đ&igrave;nh hoặc văn ph&ograve;ng nhỏ</strong> &ndash; một kỹ năng rất thực tiễn.</p>\n</li>\n</ul>\n<h3 data-start="1291" data-end="1326">🌐 Ứng dụng thực tế của kh&oacute;a học</h3>\n<p class="" data-start="1332" data-end="1380">Sau khi ho&agrave;n th&agrave;nh kh&oacute;a học, bạn sẽ c&oacute; khả năng:</p>\n<p class="" data-start="1384" data-end="1491">✅ Hiểu r&otilde; <strong data-start="1394" data-end="1446">kh&aacute;i niệm mạng m&aacute;y t&iacute;nh, vai tr&ograve;, ph&acirc;n loại mạng</strong> v&agrave; mối quan hệ giữa c&aacute;c thiết bị trong mạng.</p>\n<p class="" data-start="1494" data-end="1600">✅ Hiểu được <strong data-start="1506" data-end="1548">c&aacute;ch dữ liệu được truyền tải tr&ecirc;n mạng</strong>, c&aacute;c th&ocirc;ng số quan trọng như bps, kbps, Mbps, Gbps.</p>\n<p class="" data-start="1603" data-end="1720">✅ <strong data-start="1605" data-end="1647">Ph&acirc;n biệt c&aacute;c phương tiện truyền th&ocirc;ng</strong>, từ c&oacute; d&acirc;y như c&aacute;p quang, c&aacute;p đồng trục đến kh&ocirc;ng d&acirc;y như s&oacute;ng v&ocirc; tuyến.</p>\n<p class="" data-start="1723" data-end="1824">✅ <strong data-start="1725" data-end="1778">Ph&acirc;n biệt v&agrave; hiểu r&otilde; Internet, intranet, extranet</strong>, cũng như c&aacute;c thao t&aacute;c tải dữ liệu l&ecirc;n/xuống.</p>\n<p class="" data-start="1827" data-end="1918">✅ Biết được <strong data-start="1839" data-end="1884">c&aacute;c h&igrave;nh thức v&agrave; dịch vụ kết nối Internet</strong> ph&ugrave; hợp với từng nhu cầu sử dụng.</p>\n<p class="" data-start="1921" data-end="2014">✅ <strong data-start="1923" data-end="1973">Nhận diện v&agrave; đ&aacute;nh gi&aacute; c&aacute;c thiết bị mạng cơ bản</strong>: modem, router, switch, access point,...</p>\n<p class="" data-start="2017" data-end="2111">✅ <strong data-start="2019" data-end="2080">Thiết lập mạng LAN/WiFi trong gia đ&igrave;nh hoặc văn ph&ograve;ng nhỏ</strong>, đ&aacute;p ứng theo nhu cầu thực tế.</p>\n<p class="" data-start="2114" data-end="2177">✅ Xử l&yacute; sự cố mạng cơ bản, hiểu nguy&ecirc;n nh&acirc;n v&agrave; hướng khắc phục.</p>\n<p class="" data-start="2180" data-end="2282">✅ <strong data-start="2182" data-end="2218">Đ&aacute;nh gi&aacute; chất lượng dịch vụ mạng</strong> v&agrave; lựa chọn thiết bị ph&ugrave; hợp với ng&acirc;n s&aacute;ch v&agrave; mục đ&iacute;ch sử dụng.</p>\n<h3 data-start="2289" data-end="2317">🎯 Đối tượng của kh&oacute;a học</h3>\n<p class="" data-start="2323" data-end="2344">Kh&oacute;a học ph&ugrave; hợp với:</p>\n<ul data-start="2346" data-end="2677">\n<li class="" data-start="2346" data-end="2419">\n<p class="" data-start="2348" data-end="2419">Học sinh, sinh vi&ecirc;n, người mới bắt đầu t&igrave;m hiểu về c&ocirc;ng nghệ th&ocirc;ng tin.</p>\n</li>\n<li class="" data-start="2420" data-end="2492">\n<p class="" data-start="2422" data-end="2492">Người d&ugrave;ng phổ th&ocirc;ng muốn tự thiết lập v&agrave; bảo tr&igrave; mạng trong gia đ&igrave;nh.</p>\n</li>\n<li class="" data-start="2493" data-end="2576">\n<p class="" data-start="2495" data-end="2576">Nh&acirc;n vi&ecirc;n văn ph&ograve;ng, quản trị hệ thống nhỏ cần nắm vững kiến thức cơ bản về mạng.</p>\n</li>\n<li class="" data-start="2577" data-end="2677">\n<p class="" data-start="2579" data-end="2677">Người chuẩn bị học c&aacute;c chuy&ecirc;n ng&agrave;nh IT chuy&ecirc;n s&acirc;u như quản trị mạng, bảo mật hoặc cloud computing.</p>\n</li>\n</ul>\n<h3 data-start="2684" data-end="2709">Điều kiện ti&ecirc;n quyết</h3>\n<p class="" data-start="2715" data-end="2793">Kh&ocirc;ng y&ecirc;u cầu kiến thức chuy&ecirc;n s&acirc;u. Tuy nhi&ecirc;n, bạn sẽ học hiệu quả hơn nếu c&oacute;:</p>\n<ul data-start="2795" data-end="2929">\n<li class="" data-start="2795" data-end="2864">\n<p class="" data-start="2797" data-end="2864">Kiến thức cơ bản về sử dụng m&aacute;y t&iacute;nh, hệ điều h&agrave;nh (Windows/Linux).</p>\n</li>\n<li class="" data-start="2865" data-end="2929">\n<p class="" data-start="2867" data-end="2929">Tư duy logic v&agrave; sẵn s&agrave;ng thực h&agrave;nh qua c&aacute;c t&igrave;nh huống thực tế.</p>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/b89fc18f-c663-48ac-95e9-cb49fd66005e.png	t	01ebd503-5522-4871-81a4-ec12bd80cdf3	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
dc53780b-eb7a-4b88-8a8a-9aed47590056	Thực hành với SQL	<p>Sau khi ho&agrave;n th&agrave;nh kh&oacute;a học n&agrave;y, bạn sẽ c&oacute; c&aacute;c kỹ năng cần thiết để ph&acirc;n t&iacute;ch những b&agrave;i to&aacute;n dữ liệu một c&aacute;ch nhanh ch&oacute;ng v&agrave; dễ d&agrave;ng.</p>\n<p>- Bạn sẽ biết c&aacute;c sử dụng c&aacute;c c&acirc;u lệnh CASE, truy vấn con v&agrave; c&aacute;c h&agrave;m cửa sổ.<br />- Bạn sẽ biết đến một số kh&aacute;i niệm trong kh&oacute;a học n&agrave;y như xử l&yacute; dữ liệu bị thiếu, l&agrave;m việc với ng&agrave;y th&aacute;ng v&agrave; t&iacute;nh to&aacute;n thống k&ecirc; t&oacute;m tắt bằng c&aacute;c truy vấn n&acirc;ng cao.</p>\n<p><span style="text-decoration: underline;"><strong>Y&ecirc;u cầu:</strong></span> Bạn cần ho&agrave;n th&agrave;nh kh&oacute;a <a href="https://codelearn.io/learning/lam-quen-voi-sql"><strong>L&agrave;m quen với SQL</strong></a> để c&oacute; kiến thức cơ bản trước khi tham gia kh&oacute;a học n&agrave;y.</p>\n<h3><strong>SYLLABUS KH&Oacute;A HỌC</strong></h3>\n<table class="table table-striped table-condensed table-bordered table-hover" style="width: 100%; margin-top: 5px;">\n<thead class="thead-dark">\n<tr>\n<th style="padding: 5px;">Nội dung chương học</th>\n<th width="20%">#</th>\n<th width="50%">Nội dung b&agrave;i học</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<th rowspan="11" width="30%"><strong>C&aacute;c h&agrave;m to&aacute;n học</strong></th>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Round function" href="/learning/thuc-hanh-voi-sql/1856000">1</a></td>\n<td width="50%">SQL Round function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Power function" href="/learning/thuc-hanh-voi-sql/308060">2</a></td>\n<td width="50%">SQL Power function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Floor function" href="/learning/thuc-hanh-voi-sql/1617427">3</a></td>\n<td width="50%">SQL Floor function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Abs function" href="/learning/thuc-hanh-voi-sql/1553616">4</a></td>\n<td width="50%">SQL Abs function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Sqrt function" href="/learning/thuc-hanh-voi-sql/1604422">5</a></td>\n<td width="50%">SQL Sqrt function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Div function" href="/learning/thuc-hanh-voi-sql/1857421">6</a></td>\n<td width="50%">SQL Div function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Mod function" href="/learning/thuc-hanh-voi-sql/332862">7</a></td>\n<td width="50%">SQL Mod function</td>\n</tr>\n<tr>\n<td width="10%"><a title="Doing Math with aggregate function (1)" href="/learning/thuc-hanh-voi-sql/1862696">8</a></td>\n<td width="50%">Doing Math with aggregate function (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Doing Math with aggregate function (2)" href="/learning/thuc-hanh-voi-sql/1863100">9</a></td>\n<td width="50%">Doing Math with aggregate function (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Math functions review" href="/learning/thuc-hanh-voi-sql/308064">10</a></td>\n<td width="50%">SQL Math functions review</td>\n</tr>\n<tr>\n<th rowspan="14" width="30%"><strong>Thao t&aacute;c với văn bản</strong></th>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Length function" href="/learning/thuc-hanh-voi-sql/1603466">11</a></td>\n<td width="50%">SQL Length function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Left function" href="/learning/thuc-hanh-voi-sql/1603817">12</a></td>\n<td width="50%">SQL Left function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Substring function" href="/learning/thuc-hanh-voi-sql/297777">13</a></td>\n<td width="50%">SQL Substring function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Postion function" href="/learning/thuc-hanh-voi-sql/1846171">14</a></td>\n<td width="50%">SQL Postion function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Concat function" href="/learning/thuc-hanh-voi-sql/1553591">15</a></td>\n<td width="50%">SQL Concat function</td>\n</tr>\n<tr>\n<td width="10%"><a title="Case of string" href="/learning/thuc-hanh-voi-sql/1813435">16</a></td>\n<td width="50%">Case of string</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Reverse function" href="/learning/thuc-hanh-voi-sql/1813526">17</a></td>\n<td width="50%">SQL Reverse function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Replace function" href="/learning/thuc-hanh-voi-sql/1604363">18</a></td>\n<td width="50%">SQL Replace function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Lpad function" href="/learning/thuc-hanh-voi-sql/290020">19</a></td>\n<td width="50%">SQL Lpad function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Trim function (1)" href="/learning/thuc-hanh-voi-sql/1845514">20</a></td>\n<td width="50%">SQL Trim function (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Trim function (2)" href="/learning/thuc-hanh-voi-sql/1856352">21</a></td>\n<td width="50%">SQL Trim function (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Parsing and Manipulating Text Review (1)" href="/learning/thuc-hanh-voi-sql/332849">22</a></td>\n<td width="50%">Parsing and Manipulating Text Review (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Parsing and Manipulating Text Review (2)" href="/learning/thuc-hanh-voi-sql/297910">23</a></td>\n<td width="50%">Parsing and Manipulating Text Review (2)</td>\n</tr>\n<tr>\n<th rowspan="14" width="30%"><strong>L&agrave;m việc với ng&agrave;y/giờ</strong></th>\n</tr>\n<tr>\n<td width="10%"><a title="Date/time data types review" href="/learning/thuc-hanh-voi-sql/1617289">24</a></td>\n<td width="50%">Date/time data types review</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Current Date/Time functions" href="/learning/thuc-hanh-voi-sql/1603004">25</a></td>\n<td width="50%">SQL Current Date/Time functions</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Extract function" href="/learning/thuc-hanh-voi-sql/1858091">26</a></td>\n<td width="50%">SQL Extract function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Age function" href="/learning/thuc-hanh-voi-sql/1553413">27</a></td>\n<td width="50%">SQL Age function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Interval Data Type (1)" href="/learning/thuc-hanh-voi-sql/295332">28</a></td>\n<td width="50%">SQL Interval Data Type (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Interval Data type (2)" href="/learning/thuc-hanh-voi-sql/1553526">29</a></td>\n<td width="50%">SQL Interval Data Type (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL To_date function" href="/learning/thuc-hanh-voi-sql/286773">30</a></td>\n<td width="50%">SQL To_date function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Date_part function" href="/learning/thuc-hanh-voi-sql/286948">31</a></td>\n<td width="50%">SQL Date_part function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Date_trunc function" href="/learning/thuc-hanh-voi-sql/290117">32</a></td>\n<td width="50%">SQL Date_trunc function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Date function review (1)" href="/learning/thuc-hanh-voi-sql/332823">33</a></td>\n<td width="50%">SQL Date function review (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Date function review (2)" href="/learning/thuc-hanh-voi-sql/332830">34</a></td>\n<td width="50%">SQL Date function review (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Date function review (3)" href="/learning/thuc-hanh-voi-sql/1601596">35</a></td>\n<td width="50%">SQL Date function review (3)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Date function review (4)" href="/learning/thuc-hanh-voi-sql/1602161">36</a></td>\n<td width="50%">SQL Date function review (4)</td>\n</tr>\n<tr>\n<th rowspan="10" width="30%"><strong>C&aacute;c mệnh đề SET</strong></th>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Union Operator (1)" href="/learning/thuc-hanh-voi-sql/1090980">37</a></td>\n<td width="50%">SQL Union Operator (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Union Operator (2)" href="/learning/thuc-hanh-voi-sql/1099190">38</a></td>\n<td width="50%">SQL Union Operator (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Union All Operator (1)" href="/learning/thuc-hanh-voi-sql/278686">39</a></td>\n<td width="50%">SQL Union All Operator (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Union All Operator (2)" href="/learning/thuc-hanh-voi-sql/281923">40</a></td>\n<td width="50%">SQL Union All Operator (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Intersect Operator" href="/learning/thuc-hanh-voi-sql/281167">41</a></td>\n<td width="50%">SQL Intersect Operator</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Except Operator" href="/learning/thuc-hanh-voi-sql/1099977">42</a></td>\n<td width="50%">SQL Except Operator</td>\n</tr>\n<tr>\n<td width="10%"><a title="Set theory clauses review (1)" href="/learning/thuc-hanh-voi-sql/290777">43</a></td>\n<td width="50%">Set theory clauses review (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Set theory clauses review (2)" href="/learning/thuc-hanh-voi-sql/1100054">44</a></td>\n<td width="50%">Set theory clauses review (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Set theory challenge" href="/learning/thuc-hanh-voi-sql/1100589">45</a></td>\n<td width="50%">Set theory challenge</td>\n</tr>\n<tr>\n<th rowspan="13" width="30%"><strong>Biểu thức điều kiện</strong></th>\n</tr>\n<tr>\n<td width="10%"><a title="Basic CASE statement" href="/learning/thuc-hanh-voi-sql/286860">46</a></td>\n<td width="50%">Basic CASE statement</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statements comparing column values (1)" href="/learning/thuc-hanh-voi-sql/1306771">47</a></td>\n<td width="50%">CASE statements comparing column values (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statements comparing column values (2)" href="/learning/thuc-hanh-voi-sql/1307670">48</a></td>\n<td width="50%">CASE statements comparing column values (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="In CASE of rivalry (1)" href="/learning/thuc-hanh-voi-sql/1438459">49</a></td>\n<td width="50%">In CASE of rivalry (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="In CASE of rivalry (2)" href="/learning/thuc-hanh-voi-sql/1361203">50</a></td>\n<td width="50%">In CASE of rivalry (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statement with COUNT" href="/learning/thuc-hanh-voi-sql/1401740">51</a></td>\n<td width="50%">CASE statement with COUNT</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statement with SUM" href="/learning/thuc-hanh-voi-sql/1406986">52</a></td>\n<td width="50%">CASE statement with SUM</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statement with AVG" href="/learning/thuc-hanh-voi-sql/1423889">53</a></td>\n<td width="50%">CASE statement with AVG</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statement review (1)" href="/learning/thuc-hanh-voi-sql/318042">54</a></td>\n<td width="50%">CASE statement review (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statement review (2)" href="/learning/thuc-hanh-voi-sql/317928">55</a></td>\n<td width="50%">CASE statement review (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statement review (3)" href="/learning/thuc-hanh-voi-sql/308107">56</a></td>\n<td width="50%">CASE statement review (3)</td>\n</tr>\n<tr>\n<td width="10%"><a title="CASE statement review (4)" href="/learning/thuc-hanh-voi-sql/289668">57</a></td>\n<td width="50%">CASE statement review (4)</td>\n</tr>\n<tr>\n<th rowspan="13" width="30%"><strong>Truy vấn con</strong></th>\n</tr>\n<tr>\n<td width="10%"><a title="Building on subqueries review (1)" href="/learning/thuc-hanh-voi-sql/1438690">58</a></td>\n<td width="50%">Building on subqueries review (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Building on subqueries review (2)" href="/learning/thuc-hanh-voi-sql/1456986">59</a></td>\n<td width="50%">Building on subqueries review (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Building on subqueries review (3)" href="/learning/thuc-hanh-voi-sql/1771772">60</a></td>\n<td width="50%">Building on subqueries review (3)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Building on subqueries review (4)" href="/learning/thuc-hanh-voi-sql/1457042">61</a></td>\n<td width="50%">Building on subqueries review (4)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Building on subqueries review (5)" href="/learning/thuc-hanh-voi-sql/1457100">62</a></td>\n<td width="50%">Building on subqueries review (5)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Correlated subqueries (1)" href="/learning/thuc-hanh-voi-sql/1472347">63</a></td>\n<td width="50%">Correlated subqueries (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Correlated subqueries (2)" href="/learning/thuc-hanh-voi-sql/1472538">64</a></td>\n<td width="50%">Correlated subqueries (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Nested subqueries (1)" href="/learning/thuc-hanh-voi-sql/1472863">65</a></td>\n<td width="50%">Nested subqueries (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Nested subqueries (2)" href="/learning/thuc-hanh-voi-sql/1785645">66</a></td>\n<td width="50%">Nested subqueries (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Nested subqueries (3)" href="/learning/thuc-hanh-voi-sql/1472977">67</a></td>\n<td width="50%">Nested subqueries (3)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Subqueries review (1)" href="/learning/thuc-hanh-voi-sql/1740628">68</a></td>\n<td width="50%">Subqueries review (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Subqueries review (2)" href="/learning/thuc-hanh-voi-sql/1740647">69</a></td>\n<td width="50%">Subqueries review (2)</td>\n</tr>\n<tr>\n<th rowspan="16" width="30%"><strong>Biểu thức bảng chung</strong></th>\n</tr>\n<tr>\n<td width="10%"><a title="CTE syntax" href="/learning/thuc-hanh-voi-sql/1497217">70</a></td>\n<td width="50%">CTE syntax</td>\n</tr>\n<tr>\n<td width="10%"><a title="Creating CTE(s) (1)" href="/learning/thuc-hanh-voi-sql/319828">71</a></td>\n<td width="50%">Creating CTE(s) (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Creating CTE(s) (2)" href="/learning/thuc-hanh-voi-sql/322985">72</a></td>\n<td width="50%">Creating CTE(s) (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Simple CTE" href="/learning/thuc-hanh-voi-sql/1507396">73</a></td>\n<td width="50%">Simple CTE</td>\n</tr>\n<tr>\n<td width="10%"><a title="Multiple CTEs" href="/learning/thuc-hanh-voi-sql/1508422">74</a></td>\n<td width="50%">Multiple CTEs</td>\n</tr>\n<tr>\n<td width="10%"><a title="Clean up with CTEs" href="/learning/thuc-hanh-voi-sql/1825439">75</a></td>\n<td width="50%">Clean up with CTEs</td>\n</tr>\n<tr>\n<td width="10%"><a title="Recursive CTE (1)" href="/learning/thuc-hanh-voi-sql/1508690">76</a></td>\n<td width="50%">Recursive CTE (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Recursive CTE (2)" href="/learning/thuc-hanh-voi-sql/1794059">77</a></td>\n<td width="50%">Recursive CTE (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Recursive CTE (3)" href="/learning/thuc-hanh-voi-sql/1794846">78</a></td>\n<td width="50%">Recursive CTE (3)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Recursive CTE (4)" href="/learning/thuc-hanh-voi-sql/1798780">79</a></td>\n<td width="50%">Recursive CTE (4)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Recursive CTE (5)" href="/learning/thuc-hanh-voi-sql/1799483">80</a></td>\n<td width="50%">Recursive CTE (5)</td>\n</tr>\n<tr>\n<td width="10%"><a title="CTE Review (1)" href="/learning/thuc-hanh-voi-sql/1507559">81</a></td>\n<td width="50%">CTE Review (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="CTE Review (2)" href="/learning/thuc-hanh-voi-sql/1696342">82</a></td>\n<td width="50%">CTE Review (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="CTE Review (3)" href="/learning/thuc-hanh-voi-sql/1825287">83</a></td>\n<td width="50%">CTE Review (3)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Which technique to use?" href="/learning/thuc-hanh-voi-sql/1617345">84</a></td>\n<td width="50%">Which technique to use?</td>\n</tr>\n<tr>\n<th rowspan="15" width="30%"><strong>C&aacute;c h&agrave;m windown</strong></th>\n</tr>\n<tr>\n<td width="10%"><a title="Window functions vs GROUP BY" href="/learning/thuc-hanh-voi-sql/1523612">85</a></td>\n<td width="50%">Window functions vs GROUP BY</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Row_number function (1)" href="/learning/thuc-hanh-voi-sql/321143">86</a></td>\n<td width="50%">SQL Row_number function (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Row_number function (2)" href="/learning/thuc-hanh-voi-sql/1523699">87</a></td>\n<td width="50%">SQL Row_number function (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Row_number function (3)" href="/learning/thuc-hanh-voi-sql/1523741">88</a></td>\n<td width="50%">SQL Row_number function (3)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Lag function" href="/learning/thuc-hanh-voi-sql/1682988">89</a></td>\n<td width="50%">SQL Lag function</td>\n</tr>\n<tr>\n<td width="10%"><a title="PARTITION BY (1)" href="/learning/thuc-hanh-voi-sql/1683066">90</a></td>\n<td width="50%">PARTITION BY (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="PARTITION BY (2)" href="/learning/thuc-hanh-voi-sql/1683087">91</a></td>\n<td width="50%">PARTITION BY (2)</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Lead function" href="/learning/thuc-hanh-voi-sql/1696096">92</a></td>\n<td width="50%">SQL Lead function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL First_value function" href="/learning/thuc-hanh-voi-sql/1617465">93</a></td>\n<td width="50%">SQL First_value function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Rank function" href="/learning/thuc-hanh-voi-sql/317630">94</a></td>\n<td width="50%">SQL Rank function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Dense_rank function" href="/learning/thuc-hanh-voi-sql/1711035">95</a></td>\n<td width="50%">SQL Dense_rank function</td>\n</tr>\n<tr>\n<td width="10%"><a title="SQL Ntile function" href="/learning/thuc-hanh-voi-sql/1726470">96</a></td>\n<td width="50%">SQL Ntile function</td>\n</tr>\n<tr>\n<td width="10%"><a title="Windown function review (1)" href="/learning/thuc-hanh-voi-sql/1604177">97</a></td>\n<td width="50%">Windown function review (1)</td>\n</tr>\n<tr>\n<td width="10%"><a title="Windown function review (2)" href="/learning/thuc-hanh-voi-sql/1604451">98</a></td>\n<td width="50%">Windown function review (2)</td>\n</tr>\n</tbody>\n</table>	0.0	https://localhost:7071/coursemate-files/74f3a66f-93e5-4cc1-b162-eb4cdb5b856d.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
e166a9f1-6df5-4b31-86b6-66b419634bd9	C++ cho người mới bắt đầu	<h4>Giới thiệu về ng&ocirc;n ngữ lập tr&igrave;nh C++</h4>\n<p>C++ l&agrave; một ng&ocirc;n ngữ lập tr&igrave;nh bậc trung, được ph&aacute;t triển bởi&nbsp;<strong>Bjarne Stroustrup</strong>&nbsp;năm 1979 tại Bell Labs.&nbsp;Từ thập ni&ecirc;n 1990, C++ đ&atilde; trở th&agrave;nh một trong những ng&ocirc;n ngữ lập tr&igrave;nh phổ biến nhất tr&ecirc;n thế giới.</p>\n<p><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/Cpp_Basic_To_Advance/BjarneStroustrup.jpg" alt="" width="432" height="324" /></p>\n<p><em>T&aacute;c giả của ng&ocirc;n ngữ lập tr&igrave;nh C++.</em></p>\n<p>Một số ưu điểm của ng&ocirc;n ngữ lập tr&igrave;nh C++:</p>\n<ul>\n<li><strong>Đa nền tảng:</strong>&nbsp;chương tr&igrave;nh được viết bằng C++ c&oacute; thể chạy được tr&ecirc;n nhiều nền tảng kh&aacute;c nhau như Windows, Mac OS, Linux, ...</li>\n<li><strong>Cộng đồng lập tr&igrave;nh lớn:</strong>&nbsp;C++ l&agrave; một trong những ng&ocirc;n ngữ phổ biến nhất thế giới n&ecirc;n c&oacute; cộng đồng lập tr&igrave;nh vi&ecirc;n lớn, bạn c&oacute; thể dễ d&agrave;ng t&igrave;m kiếm c&aacute;c t&agrave;i liệu, c&aacute;c lỗi gặp phải khi lập tr&igrave;nh tr&ecirc;n mạng.</li>\n<li><strong>Bộ thư viện hỗ trợ mạnh mẽ:</strong>&nbsp;C++ c&oacute; bộ thư viện chuẩn v&agrave; bộ thư viện của b&ecirc;n thứ 3 với nhiều cấu tr&uacute;c dữ liệu, thuật to&aacute;n, ... để gi&uacute;p bạn dễ d&agrave;ng ph&aacute;t triển chương tr&igrave;nh một c&aacute;ch nhanh ch&oacute;ng (bạn sẽ được học v&agrave; hiểu về thư viện trong c&aacute;c b&agrave;i tiếp theo).</li>\n<li><strong>Đa năng:</strong>&nbsp;C++ c&oacute; thể được d&ugrave;ng để lập tr&igrave;nh nh&uacute;ng, lập tr&igrave;nh hệ thống, lập tr&igrave;nh ứng dụng,&nbsp; lập tr&igrave;nh game, ...</li>\n<li><strong>Hiệu năng cao:</strong>&nbsp;chương tr&igrave;nh được viết bằng C++ sẽ cho tốc độ thực thi nhanh hơn c&aacute;c chương tr&igrave;nh được viết bởi c&aacute;c ng&ocirc;n ngữ lập tr&igrave;nh kh&aacute;c như Java, C#, Python, ... V&igrave; thế với c&aacute;c ứng dụng nặng, cần c&oacute; tốc độ xử l&yacute; nhanh hay c&aacute;c game 3D thường được viết bằng C++.</li>\n<li><strong>Hỗ trợ lập tr&igrave;nh hướng đối tượng:</strong>&nbsp;C++ cho ph&eacute;p bạn lập tr&igrave;nh theo phương ph&aacute;p hướng đối tượng, gi&uacute;p cho chương tr&igrave;nh dễ ph&aacute;t triển v&agrave; bảo tr&igrave; hơn (bạn sẽ được học v&agrave; hiểu về lập tr&igrave;nh hướng đối tượng trong kh&oacute;a học n&agrave;y ở c&aacute;c chương sau).</li>\n</ul>\n<h4>Ứng dụng của ng&ocirc;n ngữ lập tr&igrave;nh C++</h4>\n<ul>\n<li><strong>Hệ điều h&agrave;nh:</strong>&nbsp;C++ được d&ugrave;ng trong việc ph&aacute;t triển c&aacute;c hệ điều h&agrave;nh m&agrave; bạn đang d&ugrave;ng như Windows, Mac OS, ...</li>\n<li><strong>Lập tr&igrave;nh game:</strong>&nbsp;hầu hết c&aacute;c game nổi tiếng hiện nay đều được viết bằng C++ hoặc c&aacute;c Game engine dựa tr&ecirc;n C++. V&iacute; dụ như c&aacute;c game Counter Strike, Warcraft III, Doom III, ... đều sử dụng C++<em><br /><br /></em><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/Cpp_Basic_To_Advance/half-life-1.1.jpg" alt="" height="auto" /><strong><em>Game Counter Strike<br /></em></strong></li>\n<li><strong>Lập tr&igrave;nh ứng dụng:</strong>&nbsp;đ&acirc;y l&agrave; một trong những mảng mạnh nhất của C++. C&oacute; rất nhiều ứng dụng lớn được tạo ra bởi C++ m&agrave; ch&uacute;ng ta đang sử dụng như Word, Excel, Powerpoint, Google Chrome, Firefox, Adobe Photoshop &amp; Illustrator, ...<img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/Cpp_Basic_To_Advance/chrome_firefox_logos.png" alt="" width="400" height="200" /><br /><em>Tr&igrave;nh duyệt Chrome v&agrave; Firefox.</em><em><br /></em><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/Cpp_Basic_To_Advance/500px-Su-dung-microsoft-office-mien-phi.png" alt="" width="500" height="254" /><br /><em>Bộ phần mềm của Microsoft Office.<br /><br /></em></li>\n<li><strong>Lập tr&igrave;nh nh&uacute;ng:</strong>&nbsp;C++ cũng được sử dụng nhiều trong c&aacute;c thiết bị như đồng hồ th&ocirc;ng minh, thiết bị y tế, ...<br /><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/Cpp_Basic_To_Advance/Best-Smartwatch-watches-Android-Apple-Xiaomi-and-Fitbit.jpg" alt="" width="320" height="208" /></li>\n<li>Ngo&agrave;i ra C++ c&ograve;n được d&ugrave;ng để tạo ra c&aacute;c t&igrave;nh bi&ecirc;n dịch, c&aacute;c hệ quản trị cơ sở dữ liệu, ...</li>\n</ul>\n<p>C&oacute; thể thấy C++ được sử dụng rất rộng r&atilde;i trong ng&agrave;nh c&ocirc;ng nghệ th&ocirc;ng tin, ngay cả hệ điều h&agrave;nh m&agrave; bạn đang sử dụng hay c&aacute;c thiết bị th&ocirc;ng minh đều c&oacute; thể đang sử dụng C++. Trong giới hạn của kh&oacute;a học n&agrave;y, bạn sẽ học v&agrave; hiểu được c&aacute;c kh&aacute;i niệm cơ bản trong C++, sau đ&oacute; tiếp tục t&igrave;m hiểu c&aacute;c kh&aacute;i niệm n&acirc;ng cao như con trỏ, lập tr&igrave;nh hướng đối tượng, c&aacute;c thư viện chuẩn, ...</p>\n<hr />\n<h3>Học vi&ecirc;n sẽ nhận được những g&igrave; trong kh&oacute;a học:</h3>\n<ul>\n<li>Hiểu c&aacute;ch sử dụng ng&ocirc;n ngữ C++:\n<ul>\n<li>Biết c&aacute;ch th&ecirc;m c&aacute;c thư viện.</li>\n<li>Biết r&otilde; c&aacute;ch khai b&aacute;o biến.</li>\n<li>Biết c&aacute;ch nhập xuất dữ liệu.</li>\n</ul>\n</li>\n<li>Hiểu được c&aacute;ch hoạt động của v&agrave;o lặp (Trong C++ cũng như c&aacute;c ng&ocirc;n ngữ kh&aacute;c):\n<ul>\n<li>V&ograve;ng lặp for.</li>\n<li>V&ograve;ng lặp while, do-while.</li>\n</ul>\n</li>\n<li>Hiểu r&otilde; c&aacute;ch cấu tr&uacute;c cơ bản của một ng&ocirc;n ngữ lập tr&igrave;nh:\n<ul>\n<li>Cấu tr&uacute;c mảng.</li>\n<li>Cấu tr&uacute;c chuỗi.</li>\n</ul>\n</li>\n<li>L&agrave;m quen với một số giải thuật cơ bản,\n<ul>\n<li>Biết c&aacute;ch viết c&aacute;c h&agrave;m.</li>\n<li>L&agrave;m quen với giải thuật đệ quy.</li>\n</ul>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/84ff6c2d-36b0-4ab7-b68f-838630ad04f6.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
e2b33def-af48-4e4c-b6cd-863a630f8ee7	Thuật toán nâng cao	<h3>Kh&oacute;a học Thuật to&aacute;n N&acirc;ng cao &ndash; L&agrave;m chủ tư duy thuật to&aacute;n hiện đại</h3>\n<p>Trong thời đại số, <strong>việc hiểu s&acirc;u v&agrave; vận dụng th&agrave;nh thạo c&aacute;c thuật to&aacute;n phức tạp</strong> ch&iacute;nh l&agrave; ch&igrave;a kh&oacute;a để giải quyết vấn đề kỹ thuật một c&aacute;ch hiệu quả, tối ưu h&oacute;a t&agrave;i nguy&ecirc;n v&agrave; ph&aacute;t triển c&aacute;c sản phẩm phần mềm chất lượng cao.<br />Kh&oacute;a học <strong>&ldquo;Thuật to&aacute;n N&acirc;ng cao&rdquo;</strong> được thiết kế nhằm trang bị cho bạn <strong>nền tảng vững chắc v&agrave; kỹ năng thực tiễn</strong>, gi&uacute;p bạn tự tin đối mặt với c&aacute;c th&aacute;ch thức trong học thuật, nghi&ecirc;n cứu v&agrave; ph&aacute;t triển sản phẩm c&ocirc;ng nghệ.</p>\n<h3>🌟 Tại sao bạn n&ecirc;n tham gia kh&oacute;a học n&agrave;y?</h3>\n<ul>\n<li>\n<p>Ph&aacute;t triển <strong>tư duy giải quyết vấn đề tối ưu</strong> trong lập tr&igrave;nh v&agrave; c&aacute;c t&igrave;nh huống thực tế.</p>\n</li>\n<li>\n<p>Chuẩn bị vững chắc để <strong>tham gia c&aacute;c cuộc thi lập tr&igrave;nh, phỏng vấn kỹ thuật hoặc c&aacute;c dự &aacute;n quy m&ocirc; lớn</strong>.</p>\n</li>\n<li>\n<p>Mở rộng g&oacute;c nh&igrave;n v&agrave; ứng dụng kiến thức trong <strong>AI, khoa học dữ liệu, kỹ thuật phần mềm</strong> v&agrave; nhiều lĩnh vực c&ocirc;ng nghệ kh&aacute;c.</p>\n</li>\n</ul>\n<h3>🎯 Mục ti&ecirc;u kh&oacute;a học</h3>\n<ul>\n<li>\n<p>Cung cấp <strong>kiến thức to&agrave;n diện v&agrave; hệ thống</strong> về c&aacute;c thuật to&aacute;n n&acirc;ng cao.</p>\n</li>\n<li>\n<p>Ph&aacute;t triển <strong>tư duy logic, khả năng ph&acirc;n t&iacute;ch v&agrave; kỹ năng giải quyết b&agrave;i to&aacute;n phức tạp</strong>.</p>\n</li>\n<li>\n<p>Gi&uacute;p học vi&ecirc;n <strong>tự tin &aacute;p dụng thuật to&aacute;n v&agrave;o c&aacute;c vấn đề thực tế v&agrave; nghi&ecirc;n cứu khoa học</strong>.</p>\n</li>\n</ul>\n<h3>📚 Nội dung kh&oacute;a học</h3>\n<h5>1. Thuật to&aacute;n tr&ecirc;n đồ thị</h5>\n<ul>\n<li>\n<p>L&yacute; thuyết cơ bản về đồ thị v&agrave; c&aacute;ch biểu diễn đồ thị</p>\n</li>\n<li>\n<p>C&acirc;y khung nhỏ nhất (MST): Kruskal, Prim</p>\n</li>\n<li>\n<p>Đường đi ngắn nhất: Dijkstra, Bellman-Ford, Floyd-Warshall</p>\n</li>\n</ul>\n<h5>2. Thuật to&aacute;n tối ưu</h5>\n<ul>\n<li>\n<p>Lập tr&igrave;nh động</p>\n</li>\n<li>\n<p>Thuật to&aacute;n tham lam</p>\n</li>\n<li>\n<p>C&aacute;c kỹ thuật tối ưu kết hợp</p>\n</li>\n</ul>\n<h5>3. H&igrave;nh học t&iacute;nh to&aacute;n</h5>\n<ul>\n<li>\n<p>Convex Hull (Bao lồi)</p>\n</li>\n<li>\n<p>B&agrave;i to&aacute;n giao nhau giữa c&aacute;c đoạn thẳng</p>\n</li>\n<li>\n<p>Ứng dụng trong xử l&yacute; ảnh v&agrave; m&ocirc; phỏng</p>\n</li>\n</ul>\n<h5>4. C&aacute;c thuật to&aacute;n n&acirc;ng cao</h5>\n<ul>\n<li>\n<p>Thuật to&aacute;n ngẫu nhi&ecirc;n</p>\n</li>\n<li>\n<p>Thuật to&aacute;n ph&acirc;n t&aacute;n</p>\n</li>\n<li>\n<p>T&iacute;nh to&aacute;n song song</p>\n</li>\n</ul>\n<h3>🔍 Phương ph&aacute;p học</h3>\n<ul>\n<li>\n<p><strong>B&agrave;i giảng l&yacute; thuyết</strong>: Gi&uacute;p bạn hiểu bản chất v&agrave; phương ph&aacute;p tiếp cận của từng nh&oacute;m thuật to&aacute;n.</p>\n</li>\n<li>\n<p><strong>Lập tr&igrave;nh thực h&agrave;nh</strong>: Củng cố kiến thức qua b&agrave;i tập ứng dụng v&agrave; c&aacute;c dự &aacute;n nhỏ.</p>\n</li>\n<li>\n<p><strong>Thảo luận nh&oacute;m &ndash; Hỏi đ&aacute;p với giảng vi&ecirc;n</strong>: Mở rộng kiến thức v&agrave; giải đ&aacute;p c&aacute;c kh&oacute; khăn trong qu&aacute; tr&igrave;nh học.</p>\n</li>\n</ul>\n<h3>👨&zwj;🎓 Đối tượng học vi&ecirc;n</h3>\n<ul>\n<li>\n<p>Sinh vi&ecirc;n CNTT mong muốn củng cố v&agrave; n&acirc;ng cao kiến thức về thuật to&aacute;n.</p>\n</li>\n<li>\n<p>Lập tr&igrave;nh vi&ecirc;n, kỹ sư phần mềm đang t&igrave;m c&aacute;ch tối ưu chương tr&igrave;nh v&agrave; giải quyết vấn đề phức tạp.</p>\n</li>\n<li>\n<p>Người học đang chuẩn bị cho <strong>c&aacute;c kỳ thi tin học hoặc tuyển dụng tại c&aacute;c c&ocirc;ng ty c&ocirc;ng nghệ</strong>.</p>\n</li>\n</ul>\n<p>Kh&oacute;a học <strong>&ldquo;Thuật to&aacute;n N&acirc;ng cao&rdquo;</strong> l&agrave; cầu nối giữa l&yacute; thuyết v&agrave; thực h&agrave;nh, giữa kiến thức học thuật v&agrave; ứng dụng thực tiễn. D&ugrave; bạn đang theo đuổi sự nghiệp nghi&ecirc;n cứu, giảng dạy hay ph&aacute;t triển phần mềm, đ&acirc;y sẽ l&agrave; một bước tiến lớn trong h&agrave;nh tr&igrave;nh học tập của bạn.</p>	0.0	https://localhost:7071/coursemate-files/b64fb7c9-1679-40d1-a6e3-00cd35bb20a3.png	t	5ac3586c-394f-45c2-b000-9332d118b498	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
3a705a75-7389-4e97-aeb8-58a58616032b	Lập trình hướng đối tượng trong C++	<div style="text-align: justify;"><strong>Khi nhắc tới lập tr&igrave;nh hướng đối tượng chắc bạn sẽ nghĩ ngay tới 4 t&iacute;nh chất l&agrave; t&iacute;nh đ&oacute;ng g&oacute;i, t&iacute;nh kế thừa, t&iacute;nh đa h&igrave;nh v&agrave; t&iacute;nh trừu tượng. Thực chất th&igrave; 4 t&iacute;nh chất n&agrave;y chỉ giống như c&aacute;c nguy&ecirc;n liệu để x&acirc;y dựng chương tr&igrave;nh theo phương ph&aacute;p hướng đối tượng, quan trọng nhất vẫn l&agrave; c&aacute;ch m&agrave; bạn sử dụng c&aacute;c nguy&ecirc;n liệu n&agrave;y để x&acirc;y dựng chương tr&igrave;nh như thế n&agrave;o.</strong></div>\n<h3 style="text-align: justify;">Vậy lập tr&igrave;nh hướng đối tượng l&agrave; g&igrave;?</h3>\n<div style="text-align: justify;">Lập tr&igrave;nh hướng đối tượng được hiểu đơn giản l&agrave; một phương ph&aacute;p để giải quyết b&agrave;i to&aacute;n lập tr&igrave;nh m&agrave; khi &aacute;p dụng th&igrave; code sẽ trở n&ecirc;n dễ ph&aacute;t triển v&agrave; dễ bảo tr&igrave; hơn. Phương ph&aacute;p n&agrave;y sẽ chia nhỏ chương tr&igrave;nh th&agrave;nh c&aacute;c đối tượng v&agrave; c&aacute;c mối quan hệ, mỗi đối tượng sẽ c&oacute; c&aacute;c thuộc t&iacute;nh (dữ liệu) v&agrave; h&agrave;nh vi (phương thức). Để c&oacute; thể lập tr&igrave;nh v&agrave; thiết kế chương tr&igrave;nh theo phương ph&aacute;p n&agrave;y th&igrave; chắc chắn bạn cần hiểu r&otilde; về 4 t&iacute;nh chất l&agrave; l&agrave; t&iacute;nh đ&oacute;ng g&oacute;i, t&iacute;nh kế thừa, t&iacute;nh đa h&igrave;nh v&agrave; t&iacute;nh trừu tượng.</div>\n<div><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/tuanlq7/Untitled-4.png" alt="" width="649" height="496" /></div>\n<div style="text-align: justify;">&nbsp;</div>\n<h3 style="text-align: justify;">1. T&iacute;nh đ&oacute;ng g&oacute;i (Encapsulation)</h3>\n<div style="text-align: justify;">Đ&acirc;y l&agrave; kỹ thuật gi&uacute;p bạn che giấu đi những th&ocirc;ng tin b&ecirc;n trong đối tượng bằng c&aacute;ch sử dụng phạm vi truy cập private cho c&aacute;c thuộc t&iacute;nh, muốn giao tiếp hay lấy ra c&aacute;c th&ocirc;ng tin của đối tượng th&igrave; phải th&ocirc;ng qua c&aacute;c phương thức public, từ đ&oacute; sẽ hạn chế được c&aacute;c lỗi khi ph&aacute;t triển chương tr&igrave;nh. T&iacute;nh chất n&agrave;y cũng giống với trong thực tế, bạn kh&ocirc;ng thể thấy được c&aacute;c thuộc t&iacute;nh thực của một người (t&iacute;nh c&aacute;ch, sở th&iacute;ch, c&aacute;c th&ocirc;ng tin ri&ecirc;ng tư kh&aacute;c, ...), những thứ m&agrave; bạn biết đều l&agrave; th&ocirc;ng qua c&aacute;c h&agrave;nh động của người đ&oacute;. V&iacute; dụ người đ&oacute; n&oacute;i cho bạn biết về sở th&iacute;ch, tuổi, ... nhưng c&aacute;c th&ocirc;ng tin n&agrave;y chưa chắc đ&atilde; thực sự l&agrave; thuộc t&iacute;nh thật của người đ&oacute; (giống với việc c&aacute;c getter kh&ocirc;ng trả về gi&aacute; trị thực của thuộc t&iacute;nh m&agrave; trả về một gi&aacute; trị kh&aacute;c).</div>\n<div><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/tuanlq7/lap-trinh-huong-doi-tuong-phan-5-63729265681.6431.jpg" alt="" width="513" height="321" /> <br />\n<p>C&aacute;c lợi &iacute;ch ch&iacute;nh m&agrave; t&iacute;nh đ&oacute;ng g&oacute;i đem lại:</p>\n<ul>\n<li>Hạn chế được c&aacute;c truy xuất kh&ocirc;ng hợp lệ tới c&aacute;c thuộc t&iacute;nh của đối tượng.</li>\n<li>Gi&uacute;p cho trạng th&aacute;i của c&aacute;c đối tượng lu&ocirc;n đ&uacute;ng. V&iacute; dụ nếu thuộc t&iacute;nh&nbsp;<code>gpa</code>&nbsp;của lớp&nbsp;<code>Student</code>&nbsp;l&agrave;&nbsp;<code>public</code>&nbsp;th&igrave; sẽ rất kh&oacute; kiểm so&aacute;t được gi&aacute; trị, bạn c&oacute; thể thay đổi&nbsp;<code>gpa</code>&nbsp;th&agrave;nh bất kỳ gi&aacute; trị n&agrave;o. Ngược lại, nếu bạn để thuộc t&iacute;nh&nbsp;<code>gpa</code>&nbsp;l&agrave;&nbsp;<code>private</code>&nbsp;v&agrave; cung cấp h&agrave;m&nbsp;<code>setGpa()</code>&nbsp;giống như sau:</li>\n</ul>\n<pre class="language-cpp"><code>void setGpa(double gpa) {\n\t\tif (gpa &gt;= 0 &amp;&amp; gpa &lt;= 4) {\n\t\t\tthis-&gt;gpa = gpa;\n\t\t} else {\n\t\t\tcout &lt;&lt; "gpa is invalid";\n\t\t}\n\t}​</code></pre>\n<p>th&igrave; l&uacute;c n&agrave;y gi&aacute; trị của thuộc t&iacute;nh&nbsp;<code>gpa</code>&nbsp;sẽ lu&ocirc;n được đảm bảo l&agrave; kh&ocirc;ng &acirc;m v&agrave; nhỏ hơn hoặc bằng&nbsp;<code>4</code>&nbsp;(do muốn thay đổi&nbsp;<code>gpa</code>&nbsp;th&igrave; phải th&ocirc;ng qua h&agrave;m&nbsp;<code>setGpa()</code>).</p>\n<ul>\n<li>Gi&uacute;p ẩn đi những th&ocirc;ng tin kh&ocirc;ng cần thiết về đối tượng.</li>\n<li>Cho ph&eacute;p bạn thay đổi cấu tr&uacute;c b&ecirc;n trong lớp m&agrave; kh&ocirc;ng ảnh hưởng tới lớp kh&aacute;c. V&iacute; dụ ban đầu bạn thiết kế lớp&nbsp;<code>Student</code>&nbsp;giống như sau:</li>\n</ul>\n<pre class="language-cpp"><code>class Student {\nprivate: \n\tstring firstName;\n\tstring lastName;\npublic:\n\tStudent() {\n\t\t...\n\t}\n\tstring getFullName() {\n\t\treturn firstName + lastName;\n\t}\n};</code></pre>\n<p>Sau n&agrave;y nếu bạn muốn gộp 2 thuộc t&iacute;nh&nbsp;<code>firstName</code>&nbsp;v&agrave;&nbsp;<code>lastName</code>&nbsp;th&agrave;nh&nbsp;<code>fullName</code>&nbsp;th&igrave; lớp&nbsp;<code>Student</code>&nbsp;sẽ&nbsp;giống như sau:</p>\n<pre class="language-cpp"><code>class Student {\nprivate:\n\tstring fullName;\npublic:\n\tStudent() {\n\t\t...\n\t}\n\tstring getFullName() {\n\t\treturn fullName;\n\t}\n};</code></pre>\n<p>L&uacute;c n&agrave;y cấu tr&uacute;c lớp&nbsp;<code>Student</code>&nbsp;đ&atilde; bị thay đổi nhưng c&aacute;c đối tượng sử dụng lớp n&agrave;y vẫn kh&ocirc;ng cần phải thay đổi do c&aacute;c đối tượng n&agrave;y chỉ quan t&acirc;m tới phương thức&nbsp;<code>getFullName()</code>. Nếu kh&ocirc;ng c&oacute; phương thức n&agrave;y th&igrave; bạn phải sửa tất cả những chỗ sử dụng thuộc t&iacute;nh&nbsp;<code>firstName</code>&nbsp;v&agrave;&nbsp;<code>lastName</code>&nbsp;của lớp&nbsp;<code>Student</code>.</p>\n<p>Lưu &yacute;:&nbsp;h&atilde;y lu&ocirc;n nhớ rằng mục đ&iacute;ch ch&iacute;nh của t&iacute;nh đ&oacute;ng g&oacute;i l&agrave; để hạn chế c&aacute;c lỗi khi ph&aacute;t triển chương tr&igrave;nh chứ kh&ocirc;ng phải l&agrave; bảo mật hay che giấu th&ocirc;ng tin.</p>\n</div>\n<h3 style="text-align: justify;">2. T&iacute;nh kế thừa (Inheritance)</h3>\n<p style="text-align: justify;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/Shanghaik/Pictures/dad.jpg" alt="" width="418" height="418" /></p>\n<div style="text-align: justify;">Khi lập tr&igrave;nh chắc chắn sẽ c&oacute; những trường hợp m&agrave; c&aacute;c đối tượng c&oacute; chung một số thuộc t&iacute;nh v&agrave; phương thức. V&iacute; dụ như khi bạn viết chương tr&igrave;nh lưu th&ocirc;ng tin về c&aacute;c học sinh v&agrave; gi&aacute;o vi&ecirc;n. Với học sinh th&igrave; cần lưu th&ocirc;ng tin về t&ecirc;n, tuổi, địa chỉ, điểm v&agrave; với gi&aacute;o vi&ecirc;n th&igrave; cần lưu th&ocirc;ng tin về t&ecirc;n, tuổi, địa chỉ, tiền lương =&gt; l&uacute;c n&agrave;y code sẽ bị tr&ugrave;ng lặp kh&aacute; nhiều (từ c&aacute;c thuộc t&iacute;nh cho tới c&aacute;c setter, getter, ...) v&agrave; n&oacute; vi phạm một trong những nguy&ecirc;n tắc cơ bản nhất khi lập tr&igrave;nh l&agrave; DRY (Don't Repeat Yourself - đừng bao giờ lặp lại code). Để thấy r&otilde; hơn th&igrave; bạn h&atilde;y xem sơ đồ lớp sau:</div>\n<div style="text-align: center;"><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/1_c1cffb641bc14b69958870dedbd2328b.png" /></div>\n<div style="text-align: justify;">Với kế thừa th&igrave; vấn đề n&agrave;y sẽ được giải quyết, kế thừa trong lập tr&igrave;nh hướng đối tượng ch&iacute;nh l&agrave; thừa hưởng lại những thuộc t&iacute;nh v&agrave; phương thức của một lớp. C&oacute; nghĩa l&agrave; nếu lớp A kế thừa lớp B th&igrave; lớp A sẽ c&oacute; những thuộc t&iacute;nh v&agrave; phương thức của lớp B. Do đ&oacute;, từ sơ đồ tr&ecirc;n bạn c&oacute; thể t&aacute;ch c&aacute;c thuộc t&iacute;nh v&agrave; phương thức tr&ugrave;ng nhau ra một lớp mới t&ecirc;n l&agrave;&nbsp;<code>Person</code>&nbsp;v&agrave; cho lớp&nbsp;<code>Student</code>&nbsp;v&agrave;&nbsp;<code>Teacher</code>&nbsp;kế thừa lớp n&agrave;y giống như sau:</div>\n<div style="text-align: justify;"><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/2_952c2cadf9d44245b93bdc389799597d.png" /></div>\n<div style="text-align: justify;">C&oacute; thể thấy với sơ đồ n&agrave;y th&igrave; lớp&nbsp;<code>Student</code>&nbsp;v&agrave;&nbsp;<code>Teacher</code>&nbsp;sẽ được thừa hưởng lại c&aacute;c thuộc t&iacute;nh chung từ lớp&nbsp;<code>Person</code>&nbsp;v&agrave; code sẽ kh&ocirc;ng c&ograve;n bị tr&ugrave;ng lặp. Đ&oacute; ch&iacute;nh l&agrave; lợi &iacute;ch của t&iacute;nh kế thừa.</div>\n<h3 style="text-align: justify;">3. T&iacute;nh đa h&igrave;nh (Polymorphism)</h3>\n<div style="text-align: justify;">Như bạn đ&atilde; biết, lập tr&igrave;nh hướng đối tượng l&agrave; phương ph&aacute;p tư duy v&agrave; giải quyết b&agrave;i to&aacute;n lập tr&igrave;nh theo hướng thực tế. Do đ&oacute;, c&aacute;c t&iacute;nh chất của n&oacute; cũng sẽ gắn liền với thực tế n&ecirc;n trước hết bạn cần hiểu về t&iacute;nh đa h&igrave;nh trong thực tế. Đa h&igrave;nh được hiểu l&agrave; trong từng ho&agrave;n cảnh, từng trường hợp kh&aacute;c nhau th&igrave; c&aacute;c đối tượng sẽ đ&oacute;ng c&aacute;c vai tr&ograve; kh&aacute;c nhau. V&iacute; dụ, c&ugrave;ng l&agrave; một người nhưng khi ở c&ocirc;ng ty th&igrave; c&oacute; vai tr&ograve; l&agrave; nh&acirc;n vi&ecirc;n, khi đi si&ecirc;u thị th&igrave; c&oacute; vai tr&ograve; l&agrave; kh&aacute;ch h&agrave;ng, hay khi ở trường th&igrave; lại c&oacute; vai tr&ograve; l&agrave; học sinh, ... =&gt; c&ugrave;ng l&agrave; một người nhưng c&oacute; nhiều vai tr&ograve; kh&aacute;c nhau n&ecirc;n đ&acirc;y ch&iacute;nh l&agrave; đa h&igrave;nh trong thực tế.</div>\n<div style="text-align: justify;">Trong lập tr&igrave;nh th&igrave; khi một đối tượng hay một phương thức c&oacute; nhiều hơn một h&igrave;nh th&aacute;i th&igrave; đ&oacute; ch&iacute;nh l&agrave; đa h&igrave;nh. T&iacute;nh đa h&igrave;nh được thể hiện dưới 3 h&igrave;nh thức:</div>\n<div style="text-align: justify;">\n<p><strong><em>3.1. Đa h&igrave;nh với nạp chồng phương thức</em></strong></p>\n<p>V&iacute; dụ: phương thức cộng sẽ c&oacute; c&aacute;c h&igrave;nh th&aacute;i l&agrave; cộng 2 số nguy&ecirc;n, cộng 2 số thực, cộng 3 số nguy&ecirc;n, v/v. C&oacute; thể thấy c&ugrave;ng l&agrave; phương thức cộng nhưng lại c&oacute; nhiều h&igrave;nh th&aacute;i kh&aacute;c nhau&nbsp;n&ecirc;n đ&acirc;y ch&iacute;nh l&agrave; biểu hiện của t&iacute;nh đa h&igrave;nh. V&iacute; dụ về đa h&igrave;nh với nạp chồng phương thức:&nbsp;</p>\n<pre class="language-cpp"><code>#include &lt;iostream&gt;\n\nusing namespace std;\n\nclass Calculator {\npublic:\n\tint add(int a, int b) {\n\t\treturn a + b;\n\t}\n\n\tdouble add(double a, double b) {\n\t\treturn a + b;\n\t}\n\n\tint add(int a, int b, int c) {\n\t\treturn a + b + c;\n\t}\n};\n\nint main() {\n\tCalculator c;\n\tcout &lt;&lt; c.add(1, 2) &lt;&lt; endl;\n\tcout &lt;&lt; c.add(3.3, 4.2) &lt;&lt; endl;\n\tcout &lt;&lt; c.add(1, 2, 3) &lt;&lt; endl;\n\treturn 0;\n}</code></pre>\n<p>Kết quả khi chạy chương tr&igrave;nh:</p>\n<pre class="language-markup"><code>3\n7.5\n6\n</code></pre>\n<p><strong><em>3.2. Đa h&igrave;nh với ghi đ&egrave; phương thức</em></strong></p>\n<p>V&iacute; dụ phương thức&nbsp;<code>getSalary()</code>&nbsp;d&ugrave;ng để t&iacute;nh lương sẽ c&oacute; c&aacute;c h&igrave;nh th&aacute;i l&agrave; t&iacute;nh lương cho quản l&yacute;, t&iacute;nh lương cho nh&acirc;n vi&ecirc;n:</p>\n<pre class="language-cpp"><code>class Employee {\nprivate:\n\tstring name;\n\tint salary;\n\npublic:\n\tEmployee(string name, int salary) {\n\t\tthis-&gt;name = name;\n\t\tthis-&gt;salary = salary;\n\t}\n\n\tstring getName() {\n\t\treturn name;\n\t}\n\n\tvoid setName(string name) {\n\t\tthis-&gt;name = name;\n\t}\n\n\tint getSalary() {\n\t\treturn salary;\n\t}\n\n\tvoid setSalary(int salary) {\n\t\tthis-&gt;salary = salary;\n\t}\n\n\tvoid display() {\n\t\tcout &lt;&lt; "Name: " &lt;&lt; getName() &lt;&lt; endl;\n\t\tcout &lt;&lt; "Salary: " &lt;&lt; getSalary() &lt;&lt; endl;\n\t}\n};\n\nclass Manager : Employee {\nprivate:\n\tint bonus;\npublic:\n\tManager(string name, int salary, int bonus) : Employee(name, salary) {\n\t\tthis-&gt;bonus = bonus;\n\t}\n\n\tint getBonus() {\n\t\treturn bonus;\n\t}\n\n\tvoid setBonus(int bonus) {\n\t\tthis-&gt;bonus = bonus;\n\t}\n\n\tint getSalary() {\n\t\treturn Employee::getSalary() + bonus;\n\t}\n};\n</code></pre>\n<p>Đều l&agrave; t&iacute;nh lương nhưng với mỗi đối tượng lại c&oacute; một c&aacute;ch t&iacute;nh kh&aacute;c nhau, đ&oacute; ch&iacute;nh l&agrave; t&iacute;nh đa h&igrave;nh.</p>\n<p><strong><em>3.3 Đa h&igrave;nh th&ocirc;ng qua c&aacute;c&nbsp;đối tượng đa h&igrave;nh (polymorphic objects)</em></strong></p>\n<p><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/tuanlq7/polymorphism.png" alt="" width="620" height="431" /></p>\n<p>Biến thuộc lớp cha c&oacute; thể tham chiếu tới đối tượng của c&aacute;c lớp con, vậy biến thuộc lớp cha cũng c&oacute; nhiều h&igrave;nh th&aacute;i n&ecirc;n đ&acirc;y cũng l&agrave; đa h&igrave;nh. V&iacute; dụ:</p>\n<pre class="language-cpp"><code>#include &lt;iostream&gt;\n\nusing namespace std;\n\nclass Animal {\npublic:\n\tvirtual void sound() {\n\t\tcout &lt;&lt; "some sound" &lt;&lt; endl;\n\t}\n};\n\nclass Dog : public Animal {\npublic:\n\tvoid sound() {\n\t\tcout &lt;&lt; "bow wow" &lt;&lt; endl;\n\t}\n};\n\nclass Cat : public Animal {\npublic:\n\tvoid sound() {\n\t\tcout &lt;&lt; "meow meow" &lt;&lt; endl;\n\t}\n};\n\nclass Duck : public Animal {\npublic:\n\tvoid sound() {\n\t\tcout &lt;&lt; "quack quack" &lt;&lt; endl;\n\t}\n};\n\nint main() {\n\tAnimal* animal = new Animal();\n\tanimal-&gt;sound();\n\tanimal = new Dog();\n\tanimal-&gt;sound();\n\tanimal = new Duck();\n\tanimal-&gt;sound();\n\tanimal = new Cat();\n\tanimal-&gt;sound();\n\treturn 0;\n}</code></pre>\n<p>Kết quả khi chạy chương tr&igrave;nh:</p>\n<pre class="language-java"><code>some sound\nbow wow\nquack quack\nmeow meow​</code></pre>\n</div>\n<h3 style="text-align: justify;"><br />4.T&iacute;nh trừu tượng (Abstraction)</h3>\n<div style="text-align: justify;">Trừu tượng l&agrave; t&iacute;nh chất m&agrave; đơn giản h&oacute;a đi những th&ocirc;ng tin b&ecirc;n trong đối tượng, n&oacute; cho ph&eacute;p ta giao tiếp với c&aacute;c th&agrave;nh phần của đối tượng m&agrave; kh&ocirc;ng cần phải biết về c&aacute;ch m&agrave; c&aacute;c th&agrave;nh phần n&agrave;y được x&acirc;y dựng (ch&iacute;nh x&aacute;c hơn l&agrave; kh&ocirc;ng cần biết c&aacute;c th&agrave;nh phần n&agrave;y được code như thế n&agrave;o m&agrave; chỉ cần biết c&aacute;c th&agrave;nh phần n&agrave;y được d&ugrave;ng để l&agrave;m g&igrave;). Trước hết, h&atilde;y c&ugrave;ng xem một v&iacute; dụ thực tế về t&iacute;nh trừu tượng:<br />Khi bạn đi r&uacute;t tiền ở c&acirc;y ATM th&igrave; bạn kh&ocirc;ng cần quan t&acirc;m tới c&aacute;ch m&agrave; c&acirc;y ATM hoạt động hay c&aacute;c th&agrave;nh phần c&oacute; trong c&acirc;y ATM, c&aacute;i m&agrave; bạn quan t&acirc;m duy nhất đ&oacute; l&agrave; t&iacute;nh năng r&uacute;t tiền. Trong trường hợp n&agrave;y c&aacute;c th&ocirc;ng tin kh&ocirc;ng cần thiết của c&acirc;y ATM như đếm tiền, trừ tiền trong t&agrave;i khoản, gửi dữ liệu về m&aacute;y chủ đ&atilde; được ẩn đi. C&aacute;i m&agrave; bạn nh&igrave;n thấy về đối tượng c&acirc;y ATM ch&iacute;nh l&agrave; r&uacute;t tiền =&gt; c&acirc;y ATM đ&atilde; ẩn đi những chi tiết kh&ocirc;ng cần thiết v&agrave; đ&oacute; ch&iacute;nh l&agrave; t&iacute;nh trừu tượng.<br />Tương tự trong lập tr&igrave;nh cũng vậy, khi gọi tới c&aacute;c phương thức của một đối tượng th&igrave; bạn chỉ cần quan t&acirc;m tới phương thức đ&oacute; được d&ugrave;ng để l&agrave;m g&igrave; chứ kh&ocirc;ng cần quan t&acirc;m tới phương thức đ&oacute; được code như thế n&agrave;o. T&iacute;nh chất n&agrave;y rất c&oacute; &iacute;ch khi l&agrave;m việc nh&oacute;m, bạn chỉ cần quan t&acirc;m tới chức năng của c&aacute;c phương thức m&agrave; đồng nghiệp code chứ kh&ocirc;ng cần biết n&oacute; được c&agrave;i đặt như thế n&agrave;o. Để thực hiện t&iacute;nh trừu tượng th&igrave; bạn c&oacute; thể sử dụng c&aacute;c abstract class v&agrave; interface v&igrave; n&oacute; chỉ chứa phần khai b&aacute;o chứ kh&ocirc;ng c&oacute; phần c&agrave;i đặt (ở một số ng&ocirc;n ngữ kh&ocirc;ng c&oacute; kh&aacute;i niệm về interface n&ecirc;n nếu bạn chưa biết về interface th&igrave; c&oacute; thể hiểu interface ch&iacute;nh l&agrave; abstract class với c&aacute;c phương thức đều l&agrave; trừu tượng).</div>\n<div style="text-align: justify;">Trong thực tế, khi đi l&agrave;m bạn sẽ sử dụng tới interface rất nhiều, với mỗi lớp bạn thường tạo ra 1 interface ri&ecirc;ng để thể hiện c&aacute;c t&iacute;nh năng của lớp đ&oacute; v&agrave; sử dụng interface n&agrave;y để giao tiếp với đối tượng. V&iacute; dụ lớp Customer sẽ c&oacute; interface ICustomer, c&aacute;c đối tượng kh&aacute;c muốn giao tiếp với lớp Customer th&igrave; đều phải th&ocirc;ng qua interface tr&ecirc;n..</div>\n<h3 style="text-align: justify;">Kết luận</h3>\n<div style="text-align: justify;">Lập tr&igrave;nh hướng đối tượng kh&ocirc;ng chỉ g&oacute;i gọn trong 4 t&iacute;nh chất tr&ecirc;n, để viết được một chương tr&igrave;nh tốt th&igrave; bạn c&ograve;n phải biết th&ecirc;m rất nhiều nguy&ecirc;n liệu kh&aacute;c như OOP design, Software Architecture, ... trong b&agrave;i n&agrave;y m&igrave;nh chỉ t&oacute;m tắt về lập tr&igrave;nh hướng đối tượng v&agrave; 4 t&iacute;nh chất ch&iacute;nh, nếu muốn học chi tiết hơn th&igrave; bạn c&oacute; thể tham khảo th&ecirc;m tại kh&oacute;a học <a href="https://codelearn.io/learning/lap-trinh-huong-doi-tuong-trong-cpp">C++ OOP</a> v&agrave; <a href="https://codelearn.io/learning/java-oop">Java OOP</a> tr&ecirc;n hệ thống. C&ograve;n về c&aacute;c chủ đề kh&aacute;c trong OOP th&igrave; m&igrave;nh sẽ giới thiệu trong c&aacute;c b&agrave;i viết tiếp theo.</div>	0.0	https://localhost:7071/coursemate-files/a2c82164-7fd7-4322-b7de-5c56ae6eef14.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
3a7e4e2a-395f-4213-81c5-03d945e1852f	Java cơ bản	<p>Ng&ocirc;n ngữ Java được lựa chọn để tạo ra c&aacute;c website, ứng dụng di động, phần mềm t&ugrave;y chỉnh, cổng th&ocirc;ng tin điện tử,&hellip; v&agrave; được coi như&nbsp;một trong những ng&ocirc;n ngữ lập tr&igrave;nh phổ biến nhất tr&ecirc;n thế giới hiện nay. Nhiều nh&agrave; ph&aacute;t triển phần mềm khởi đầu với Java v&agrave; đi theo n&oacute; qua rất nhiều dự &aacute;n cho đến tận b&acirc;y giờ. Java l&agrave; một chương tr&igrave;nh mặc định trong c&aacute;c hệ điều h&agrave;nh v&agrave; vai tr&ograve; của n&oacute; đối với ch&uacute;ng ta l&agrave; v&ocirc; c&ugrave;ng to lớn.</p>\n<h3><strong>Java l&agrave; g&igrave;?</strong></h3>\n<p>Java l&agrave;&nbsp;ng&ocirc;n ngữ lập tr&igrave;nh&nbsp;bậc cao, được ph&aacute;t triển bởi Sun Microsystems, do James Gosling khởi xướng v&agrave; ph&aacute;t h&agrave;nh v&agrave;o năm 1995 như l&agrave; một th&agrave;nh phần cốt l&otilde;i của nền tảng Java của Sun Microsystems (Java 1.0 [J2SE]).&nbsp;Java chạy tr&ecirc;n rất nhiều nền tảng kh&aacute;c nhau, như Windows, Mac v&agrave; c&aacute;c phi&ecirc;n bản kh&aacute;c nhau của UNIX.&nbsp;</p>\n<p>Java được hiểu l&agrave; một loại ng&ocirc;n ngữ lập tr&igrave;nh hướng đối tượng (OOP) v&agrave; dựa tr&ecirc;n c&aacute;c lớp. Kh&ocirc;ng giống với những ng&ocirc;n ngữ lập tr&igrave;nh th&ocirc;ng thường, thay v&igrave; việc bi&ecirc;n dịch m&atilde; nguồn trở th&agrave;nh m&atilde; nguồn m&aacute;y hoặc trực tiếp th&ocirc;ng dịch m&atilde; nguồn khi chạy th&igrave; Java được thiết kế để bi&ecirc;n dịch m&atilde; nguồn th&agrave;nh bytecode. Sau đ&oacute;, bytecode sẽ được m&ocirc;i trường thực thi (runtime environment).</p>\n<h3><strong>Đặc điểm của Java</strong></h3>\n<ul>\n<li><strong style="font-style: inherit;">Hướng đối tượng:&nbsp;</strong>Trong Java, mọi thứ đều l&agrave; Object. Java c&oacute; thể mở rộng v&igrave; n&oacute; dựa tr&ecirc;n m&ocirc; h&igrave;nh Object.</li>\n<li><strong style="font-style: inherit;">Nền tảng độc lập:&nbsp;</strong>Kh&ocirc;ng giống như nhiều&nbsp;ng&ocirc;n ngữ lập tr&igrave;nh&nbsp;kh&aacute;c (C, C++), khi Java được bi&ecirc;n dịch, n&oacute; kh&ocirc;ng bi&ecirc;n dịch sang một m&aacute;y t&iacute;nh cụ thể tr&ecirc;n nền tảng n&agrave;o, thay v&agrave;o đ&oacute; l&agrave; những byte code độc lập với nền tảng. Byte code n&agrave;y được ph&acirc;n phối tr&ecirc;n web v&agrave; được th&ocirc;ng dịch bằng Virtual Machine (JVM) tr&ecirc;n bất cứ nền tảng n&agrave;o m&agrave; n&oacute; đang chạy.</li>\n<li><strong style="font-style: inherit;">Đơn giản:&nbsp;</strong>Java được thiết kế để dễ học. Nếu bạn hiểu cơ bản về kh&aacute;i niệm lập tr&igrave;nh hướng đối tượng Java, th&igrave; c&oacute; thể nắm bắt ng&ocirc;n ngữ n&agrave;y rất nhanh.</li>\n<li><strong style="font-style: inherit;">Bảo mật:&nbsp;</strong>Với t&iacute;nh năng an to&agrave;n của Java, n&oacute; cho ph&eacute;p ph&aacute;t triển những hệ thống kh&ocirc;ng c&oacute; virus, giả mạo. C&aacute;c kỹ thuật x&aacute;c thực dựa tr&ecirc;n m&atilde; h&oacute;a c&ocirc;ng khai.</li>\n<li><strong style="font-style: inherit;">Kiến tr&uacute;c trung lập:&nbsp;</strong>Tr&igrave;nh bi&ecirc;n dịch của Java tạo ra một định dạng file object c&oacute; kiến tr&uacute;c trung lập, l&agrave;m cho code sau khi bi&ecirc;n dịch c&oacute; thể chạy tr&ecirc;n nhiều bộ vi xử l&yacute;, với sự hiện diện của&nbsp;Java runtime system.</li>\n<li><strong style="font-style: inherit;">Portable:&nbsp;</strong>L&agrave; kiến tr&uacute;c trung lập v&agrave; kh&ocirc;ng phụ thuộc v&agrave;o việc thực hiện l&agrave; những đặc điểm ch&iacute;nh nhất khi n&oacute;i về kh&iacute;a cạnh Portable của Java. Tr&igrave;nh bi&ecirc;n dịch trong Java được viết bằng ANSI C với một ranh giới portable gọn g&agrave;ng, đ&oacute; l&agrave; một subset POSIX (giao diện hệ điều h&agrave;nh linh động). Bạn c&oacute; thể mang byte code của Java l&ecirc;n bất cứ nền tảng n&agrave;o.</li>\n<li><strong style="font-style: inherit;">Mạnh mẽ:&nbsp;</strong>Java nỗ lực loại trừ những t&igrave;nh huống dễ bị lỗi bằng c&aacute;ch nhấn mạnh chủ yếu l&agrave; kiểm tra lỗi thời gian bi&ecirc;n dịch v&agrave; kiểm tra runtime.</li>\n<li><strong style="font-style: inherit;">Đa luồng:&nbsp;</strong>Với t&iacute;nh năng đa luồng của Java, bạn c&oacute; thể viết c&aacute;c chương tr&igrave;nh c&oacute; thể thực hiện nhiều t&aacute;c vụ đồng thời. T&iacute;nh năng n&agrave;y cho ph&eacute;p c&aacute;c nh&agrave; ph&aacute;t triển x&acirc;y dựng c&aacute;c ứng dụng tương t&aacute;c c&oacute; thể chạy trơn tru.</li>\n<li><strong style="font-style: inherit;">Th&ocirc;ng dịch:&nbsp;</strong>Byte code của Java được dịch trực tiếp tới c&aacute;c nền tảng gốc v&agrave; n&oacute; kh&ocirc;ng được lưu trữ ở bất cứ đ&acirc;u.&nbsp;</li>\n<li><strong style="font-style: inherit;">Hiệu suất cao:&nbsp;</strong>Với việc sử dụng tr&igrave;nh bi&ecirc;n dịch Just-In-Time, Java cho ph&eacute;p thực thi với hiệu suất cao, nhanh ch&oacute;ng ph&aacute;t hiện, gỡ lỗi.</li>\n<li><strong style="font-style: inherit;">Ph&acirc;n t&aacute;n:&nbsp;</strong>Java được thiết kế cho m&ocirc;i trường ph&acirc;n t&aacute;n của Internet.</li>\n<li><strong style="font-style: inherit;">Linh động:&nbsp;</strong>Java được coi l&agrave; năng động hơn C hay C++ v&igrave; n&oacute; được thiết kế để th&iacute;ch nghi với m&ocirc;i trường đang ph&aacute;t triển. C&aacute;c chương tr&igrave;nh Java c&oacute; thể mang theo một lượng lớn th&ocirc;ng tin run-time, được sử dụng để x&aacute;c minh v&agrave; giải quyết c&aacute;c truy cập đến đối tượng trong thời gian chạy.</li>\n</ul>\n<h3><strong>Ứng dụng của JAVA</strong></h3>\n<p>C&oacute; 4 loại ứng dụng ch&iacute;nh m&agrave; c&oacute; thể được tạo bởi sử dụng ng&ocirc;n ngữ lập tr&igrave;nh Java:</p>\n<ul>\n<li><strong>Standalone App<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/HaiZuka/Java_appp.png" alt="" width="638" height="555" /> <br /></strong>N&oacute; c&ograve;n được biết đến với t&ecirc;n gọi kh&aacute;c l&agrave; Destop App hoặc Windows-based App. Một ứng dụng m&agrave; ch&uacute;ng ta cần c&agrave;i đặt tr&ecirc;n mỗi thiết bị như media player, antivirus, &hellip; AWT v&agrave; Swing được sử dụng trong Java để tạo c&aacute;c Standalone App.</li>\n<li><strong>Web App<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/HaiZuka/java_web.gif" alt="" width="662" height="377" /> <img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/HaiZuka/java_web2.jpg" alt="" width="934" height="1085" /> </strong><br />Một ứng dụng m&agrave; chạy tr&ecirc;n Server Side v&agrave; tạo Dynamic Page, được gọi l&agrave; Web App. Hiện tại, c&aacute;c c&ocirc;ng nghệ Servlet, JSP, Struts, JSF, &hellip; được sử dụng để tạo Web App trong Java.</li>\n<li><strong>Enterprise App<br /></strong>Một ứng dụng dạng như Banking App, c&oacute; lợi thế l&agrave; t&iacute;nh bảo mật cao, c&acirc;n bằng tải (load balancing) v&agrave; clustering. Trong java, EJB được sử dụng để tạo c&aacute;c Enterprise App.</li>\n<li><strong>Mobile App<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/HaiZuka/Java_mobileApp.jpg" alt="" width="664" height="436" /> </strong><br />Đ&acirc;y l&agrave; loại ứng dụng được tạo cho thiết bị mobile. Hiện tại th&igrave; Android v&agrave; Java ME được sử dụng để tạo loại ứng dụng n&agrave;y.</li>\n</ul>\n<hr />\n<h3>Mục ti&ecirc;u của kh&oacute;a học.</h3>\n<ul>\n<li>L&agrave;m quen được ng&ocirc;n ngữ Java, biết viết chương tr&igrave;nh Java.</li>\n<li>Biết c&aacute;ch khai b&aacute;o v&agrave; sử dụng c&aacute;c biến v&agrave; kiểu dữ liệu.</li>\n<li>Sử dụng được c&aacute;c to&aacute;n tử trong Java.</li>\n<li>Biết r&otilde; v&agrave; sử dụng được một số kiến thức cơ bản của ng&ocirc;n ngữ Java như:\n<ul>\n<li>C&acirc;u lệnh điều kiện.</li>\n<li>V&ograve;ng lặp.</li>\n<li>Cấu tr&uacute;c mảng.</li>\n<li>Strings v&agrave; StringBuilder</li>\n<li>Collections</li>\n</ul>\n</li>\n<li>C&aacute;ch phương thức xử l&yacute; số học trong Java.</li>\n<li>Biết viết v&agrave; sử dụng h&agrave;m trong Java.</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/bb52f86b-198c-4d4c-994a-0df7b92edf43.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
3d68c61e-6eec-4416-8214-21930ae35f02	Cấu trúc dữ liệu và giải thuật	<h3 data-start="258" data-end="316">Giới thiệu về kh&oacute;a học "Cấu tr&uacute;c dữ liệu v&agrave; giải thuật"</h3>\n<p class="" data-start="318" data-end="658">Kh&oacute;a học n&agrave;y sẽ gi&uacute;p bạn <strong data-start="343" data-end="425">hiểu r&otilde; c&aacute;ch c&agrave;i đặt v&agrave; vận h&agrave;nh của c&aacute;c h&agrave;m trong c&aacute;c cấu tr&uacute;c dữ liệu cơ bản</strong>, đồng thời <strong data-start="437" data-end="499">nắm vững nguy&ecirc;n l&yacute; v&agrave; ứng dụng của c&aacute;c thuật to&aacute;n phổ biến</strong>. Đ&acirc;y l&agrave; nền tảng quan trọng cho mọi lập tr&igrave;nh vi&ecirc;n, đặc biệt l&agrave; những người muốn ph&aacute;t triển trong lĩnh vực kỹ thuật phần mềm, ph&acirc;n t&iacute;ch dữ liệu hoặc kỹ sư AI.</p>\n<h3 data-start="665" data-end="716">Tại sao phải học cấu tr&uacute;c dữ liệu v&agrave; giải thuật?</h3>\n<p class="" data-start="718" data-end="860">Cấu tr&uacute;c dữ liệu v&agrave; giải thuật l&agrave; xương sống của mọi chương tr&igrave;nh m&aacute;y t&iacute;nh. Khi bạn hiểu r&otilde; c&aacute;ch dữ liệu được lưu trữ v&agrave; thao t&aacute;c, bạn c&oacute; thể:</p>\n<ul data-start="862" data-end="1009">\n<li class="" data-start="862" data-end="885">\n<p class="" data-start="864" data-end="885">Viết m&atilde; hiệu quả hơn.</p>\n</li>\n<li class="" data-start="886" data-end="937">\n<p class="" data-start="888" data-end="937">Giải quyết c&aacute;c b&agrave;i to&aacute;n phức tạp một c&aacute;ch tối ưu.</p>\n</li>\n<li class="" data-start="938" data-end="1009">\n<p class="" data-start="940" data-end="1009">Th&agrave;nh c&ocirc;ng hơn trong c&aacute;c kỳ thi tuyển dụng tại c&aacute;c c&ocirc;ng ty c&ocirc;ng nghệ.</p>\n</li>\n</ul>\n<p class="" data-start="1011" data-end="1133">D&ugrave; bạn học Python, Java, C++ hay bất kỳ ng&ocirc;n ngữ n&agrave;o, tư duy về thuật to&aacute;n v&agrave; cấu tr&uacute;c dữ liệu l&agrave; kỹ năng kh&ocirc;ng thể thiếu.</p>\n<h3 data-start="1140" data-end="1174">C&aacute;c chủ đề ch&iacute;nh trong kh&oacute;a học</h3>\n<h4 data-start="1176" data-end="1199">🔹 Cấu tr&uacute;c dữ liệu</h4>\n<p class="" data-start="1201" data-end="1280">Bạn sẽ được t&igrave;m hiểu c&aacute;ch x&acirc;y dựng v&agrave; vận h&agrave;nh c&aacute;c cấu tr&uacute;c dữ liệu quan trọng:</p>\n<ul data-start="1282" data-end="1433">\n<li class="" data-start="1282" data-end="1302">\n<p class="" data-start="1284" data-end="1302"><strong data-start="1284" data-end="1300">Mảng (Array)</strong></p>\n</li>\n<li class="" data-start="1303" data-end="1327">\n<p class="" data-start="1305" data-end="1327"><strong data-start="1305" data-end="1325">Ngăn xếp (Stack)</strong></p>\n</li>\n<li class="" data-start="1328" data-end="1352">\n<p class="" data-start="1330" data-end="1352"><strong data-start="1330" data-end="1350">H&agrave;ng đợi (Queue)</strong></p>\n</li>\n<li class="" data-start="1353" data-end="1393">\n<p class="" data-start="1355" data-end="1393"><strong data-start="1355" data-end="1391">Danh s&aacute;ch li&ecirc;n kết (Linked List)</strong></p>\n</li>\n<li class="" data-start="1394" data-end="1412">\n<p class="" data-start="1396" data-end="1412"><strong data-start="1396" data-end="1410">C&acirc;y (Tree)</strong></p>\n</li>\n<li class="" data-start="1413" data-end="1433">\n<p class="" data-start="1415" data-end="1433"><strong data-start="1415" data-end="1433">Đồ thị (Graph)</strong></p>\n</li>\n</ul>\n<p class="" data-start="1435" data-end="1559">Mỗi cấu tr&uacute;c dữ liệu đều được giảng dạy c&ugrave;ng với c&aacute;c thao t&aacute;c cơ bản (th&ecirc;m, x&oacute;a, t&igrave;m kiếm...) v&agrave; c&aacute;c v&iacute; dụ ứng dụng thực tế.</p>\n<h4 data-start="1561" data-end="1585">🔹 Thuật to&aacute;n cơ bản</h4>\n<p class="" data-start="1587" data-end="1670">Kh&oacute;a học cũng trang bị cho bạn tư duy v&agrave; kỹ năng c&agrave;i đặt c&aacute;c thuật to&aacute;n thường gặp:</p>\n<ul data-start="1672" data-end="1905">\n<li class="" data-start="1672" data-end="1699">\n<p class="" data-start="1674" data-end="1699"><strong data-start="1674" data-end="1697">Thuật to&aacute;n t&igrave;m kiếm</strong></p>\n</li>\n<li class="" data-start="1700" data-end="1726">\n<p class="" data-start="1702" data-end="1726"><strong data-start="1702" data-end="1724">Thuật to&aacute;n sắp xếp</strong></p>\n</li>\n<li class="" data-start="1727" data-end="1752">\n<p class="" data-start="1729" data-end="1752"><strong data-start="1729" data-end="1750">Thuật to&aacute;n đệ quy</strong></p>\n</li>\n<li class="" data-start="1753" data-end="1808">\n<p class="" data-start="1755" data-end="1808"><strong data-start="1755" data-end="1806">Thuật to&aacute;n quy hoạch động (Dynamic Programming)</strong></p>\n</li>\n<li class="" data-start="1809" data-end="1855">\n<p class="" data-start="1811" data-end="1855"><strong data-start="1811" data-end="1853">Thuật to&aacute;n tham lam (Greedy Algorithm)</strong></p>\n</li>\n<li class="" data-start="1856" data-end="1905">\n<p class="" data-start="1858" data-end="1905"><strong data-start="1858" data-end="1905">Thuật to&aacute;n chia để trị (Divide and Conquer)</strong></p>\n</li>\n</ul>\n<h3 data-start="1912" data-end="1934">Đối tượng hướng đến</h3>\n<p class="" data-start="1936" data-end="1957">Kh&oacute;a học ph&ugrave; hợp với:</p>\n<ul data-start="1959" data-end="2154">\n<li class="" data-start="1959" data-end="2011">\n<p class="" data-start="1961" data-end="2011">Sinh vi&ecirc;n CNTT hoặc người đang theo học lập tr&igrave;nh.</p>\n</li>\n<li class="" data-start="2012" data-end="2090">\n<p class="" data-start="2014" data-end="2090">Người đ&atilde; biết lập tr&igrave;nh cơ bản v&agrave; muốn cải thiện khả năng tư duy giải thuật.</p>\n</li>\n<li class="" data-start="2091" data-end="2154">\n<p class="" data-start="2093" data-end="2154">Người chuẩn bị phỏng vấn lập tr&igrave;nh tại c&aacute;c c&ocirc;ng ty c&ocirc;ng nghệ.</p>\n</li>\n</ul>\n<h3 data-start="2161" data-end="2184">Điều kiện ti&ecirc;n quyết</h3>\n<p class="" data-start="2186" data-end="2225">Để tham gia kh&oacute;a học hiệu quả, bạn n&ecirc;n:</p>\n<ul data-start="2227" data-end="2373">\n<li class="" data-start="2227" data-end="2297">\n<p class="" data-start="2229" data-end="2297">C&oacute; kiến thức lập tr&igrave;nh cơ bản (biết sử dụng biến, h&agrave;m, v&ograve;ng lặp...).</p>\n</li>\n<li class="" data-start="2298" data-end="2373">\n<p class="" data-start="2300" data-end="2373">Biết c&aacute;ch sử dụng &iacute;t nhất một ng&ocirc;n ngữ lập tr&igrave;nh như Python, C++, Java...</p>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/38676548-14a7-4f13-a660-c3715c5cc21e.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
3ffa0664-7966-4aa4-9557-049c00d033b7	Giải thuật cho Python	<p style="line-height: 1.5;"><span style="font-size: 20pt; color: #304090;"><strong>Kh&aacute;m ph&aacute; sức mạnh của "Giải Thuật" trong Python!</strong></span></p>\n<p style="line-height: 1.5;"><span style="font-size: 14pt;"><strong>Bạn đ&atilde; sẵn s&agrave;ng để chinh phục thế giới của lập tr&igrave;nh với những giải thuật mạnh mẽ?</strong></span></p>\n<p style="line-height: 1.5;">Ch&agrave;o mừng bạn đến với kh&oacute;a học "<strong>Giải thuật cho Python"</strong>&nbsp;- nơi bạn sẽ kh&aacute;m ph&aacute; những b&iacute; mật đằng sau những d&ograve;ng m&atilde; lệnh kỳ diệu v&agrave; trở th&agrave;nh bậc thầy trong việc giải quyết c&aacute;c vấn đề phức tạp.</p>\n<p style="line-height: 1.5;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/A1_4c7c5f3532d041ceb43528852442ca5a.png" width="650" height="587" /></p>\n<p style="line-height: 1.5;"><span style="font-size: 20pt; color: #304090;"><strong>Tại sao bạn n&ecirc;n tham gia kh&oacute;a học n&agrave;y?</strong></span></p>\n<p style="line-height: 1.5;"><strong>Thực h&agrave;nh qua c&aacute;c b&agrave;i tập thực tế:</strong> Mỗi phần học đều đi k&egrave;m với c&aacute;c b&agrave;i tập thực h&agrave;nh gi&uacute;p bạn &aacute;p dụng ngay kiến thức đ&atilde; học.</p>\n<p style="line-height: 1.5;"><strong>Giảng vi&ecirc;n nhiệt huyết:</strong> Được hướng dẫn bởi những chuy&ecirc;n gia h&agrave;ng đầu với nhiều năm kinh nghiệm trong lĩnh vực.</p>\n<p style="line-height: 1.5;"><strong>Cộng đồng học tập s&ocirc;i nổi:</strong> Kết nối với h&agrave;ng ngh&igrave;n học vi&ecirc;n kh&aacute;c, c&ugrave;ng nhau thảo luận v&agrave; giải quyết c&aacute;c b&agrave;i to&aacute;n kh&oacute;.</p>\n<p style="line-height: 1.5;"><strong>Chứng chỉ uy t&iacute;n:</strong> Ho&agrave;n th&agrave;nh kh&oacute;a học v&agrave; nhận chứng chỉ c&ocirc;ng nhận, gi&uacute;p n&acirc;ng cao gi&aacute; trị bản th&acirc;n tr&ecirc;n thị trường lao động.</p>\n<p style="line-height: 1.5;"><strong>Hỗ trợ 24/7:</strong>&nbsp;Lu&ocirc;n c&oacute; đội ngũ hỗ trợ sẵn s&agrave;ng gi&uacute;p đỡ bạn vượt qua mọi kh&oacute; khăn trong qu&aacute; tr&igrave;nh học tập.</p>\n<p style="line-height: 1.5;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/A2_123aa699051d4ad28d66bb9c95a05739.png" width="651" height="423" /></p>\n<p style="line-height: 1.5;"><span style="font-size: 20pt; color: #304090;"><strong>Đừng bỏ lỡ cơ hội để</strong></span></p>\n<p style="line-height: 1.5;"><strong>Tăng cường kỹ năng lập tr&igrave;nh:</strong>&nbsp;Hiểu s&acirc;u hơn về c&aacute;ch c&aacute;c thuật to&aacute;n hoạt động v&agrave; l&agrave;m thế n&agrave;o để &aacute;p dụng ch&uacute;ng hiệu quả.</p>\n<p style="line-height: 1.5;"><strong>N&acirc;ng cao tư duy giải quyết vấn đề: </strong>Ph&aacute;t triển khả năng ph&acirc;n t&iacute;ch v&agrave; giải quyết c&aacute;c b&agrave;i to&aacute;n phức tạp một c&aacute;ch logic v&agrave; s&aacute;ng tạo.</p>\n<p style="line-height: 1.5;"><strong>Chuẩn bị cho tương lai:</strong>&nbsp;D&ugrave; bạn muốn trở th&agrave;nh nh&agrave; ph&aacute;t triển phần mềm, nh&agrave; khoa học dữ liệu hay chuy&ecirc;n gia AI, kiến thức về giải thuật l&agrave; nền tảng vững chắc cho mọi lĩnh vực.</p>\n<p style="line-height: 1.5;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/A3_3ce089ededfc4daab3907c20805cefde.png" width="651" height="522" /></p>\n<p style="line-height: 1.5;">&nbsp;</p>\n<p style="line-height: 1.5;"><span style="font-size: 20pt; color: #304090;"><strong>H&atilde;y bắt đầu h&agrave;nh tr&igrave;nh trở th&agrave;nh chuy&ecirc;n gia giải thuật ngay h&ocirc;m nay!</strong></span></p>\n<p style="line-height: 1.5;">Đăng k&yacute; ngay để kh&ocirc;ng bỏ lỡ cơ hội n&acirc;ng cao kỹ năng lập tr&igrave;nh v&agrave; mở rộng tư duy thuật to&aacute;n của bạn. Ch&uacute;ng t&ocirc;i tin rằng với kiến thức v&agrave; kỹ năng học được từ kh&oacute;a học, bạn sẽ tự tin đối mặt với mọi th&aacute;ch thức trong lập tr&igrave;nh.</p>	900000.0	https://localhost:7071/coursemate-files/ff2d50c5-12ce-43c1-b4ef-351ba0a61cec.png	t	5ac3586c-394f-45c2-b000-9332d118b498	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Game "ăn liền" cùng Scratch	<h2 class="" data-start="173" data-end="234">🚀 "Game "ăn liền" c&ugrave;ng Scratch" &ndash; Lập Tr&igrave;nh Game Dễ Như Chơi!</h2>\n<h3 class="" data-start="236" data-end="327">Khơi dậy đam m&ecirc; c&ocirc;ng nghệ &ndash; Khởi đầu h&agrave;nh tr&igrave;nh lập tr&igrave;nh từ những tr&ograve; chơi đầu ti&ecirc;n!</h3>\n<p class="" data-start="329" data-end="609">Bạn đang t&igrave;m kiếm một kh&oacute;a học th&uacute; vị gi&uacute;p trẻ vừa học vừa chơi m&agrave; vẫn ph&aacute;t triển tư duy logic v&agrave; s&aacute;ng tạo?<br data-start="436" data-end="439" /><strong data-start="439" data-end="459">&ldquo;Game "ăn liền" c&ugrave;ng Scratch&rdquo;</strong> ch&iacute;nh l&agrave; điểm khởi đầu l&yacute; tưởng để trẻ tiếp cận với thế giới lập tr&igrave;nh th&ocirc;ng qua việc <strong data-start="546" data-end="608">tự tay tạo ra những tr&ograve; chơi đơn giản nhưng cực kỳ hấp dẫn</strong>!</p>\n<hr class="" data-start="611" data-end="614" />\n<h3 class="" data-start="616" data-end="651">🎮 Kh&oacute;a học n&agrave;y c&oacute; g&igrave; đặc biệt?</h3>\n<ul data-start="653" data-end="1190">\n<li class="" data-start="653" data-end="833">\n<p class="" data-start="655" data-end="833"><strong data-start="658" data-end="686">Học m&agrave; chơi, chơi m&agrave; học</strong>: Trẻ sẽ kh&ocirc;ng chỉ học lập tr&igrave;nh m&agrave; c&ograve;n được thực h&agrave;nh x&acirc;y dựng <strong data-start="750" data-end="770">tr&ograve; chơi thực tế</strong> như m&egrave;o bắt c&aacute;, m&egrave;o đuổi chuột, thảm họa thi&ecirc;n thạch, g&agrave; qua đường,...</p>\n</li>\n<li class="" data-start="834" data-end="950">\n<p class="" data-start="836" data-end="950"><strong data-start="839" data-end="869">Kh&ocirc;ng cần kỹ năng trước đ&oacute;</strong>: Scratch l&agrave; ng&ocirc;n ngữ lập tr&igrave;nh k&eacute;o &ndash; thả, cực kỳ dễ hiểu, th&acirc;n thiện với trẻ em.</p>\n</li>\n<li class="" data-start="951" data-end="1068">\n<p class="" data-start="953" data-end="1068"><strong data-start="959" data-end="982">Hướng dẫn từng bước</strong>: Gi&aacute;o tr&igrave;nh được thiết kế r&otilde; r&agrave;ng, sinh động, c&oacute; video minh họa v&agrave; t&agrave;i liệu k&egrave;m theo.</p>\n</li>\n<li class="" data-start="951" data-end="1068"><strong data-start="1292" data-end="1316">Ph&aacute;t triển to&agrave;n diện</strong>: Trẻ kh&ocirc;ng chỉ học lập tr&igrave;nh m&agrave; c&ograve;n r&egrave;n luyện tư duy logic, s&aacute;ng tạo, kỹ năng giải quyết vấn đề v&agrave; ki&ecirc;n tr&igrave;.</li>\n<li class="" data-start="1069" data-end="1190">\n<p class="" data-start="1071" data-end="1190"><strong data-start="1074" data-end="1093">Kết quả r&otilde; r&agrave;ng</strong>: Sau kh&oacute;a học, học vi&ecirc;n c&oacute; thể tự tạo &iacute;t nhất 1 tr&ograve; chơi cơ bản v&agrave; chia sẻ với bạn b&egrave;, gia đ&igrave;nh.</p>\n</li>\n</ul>\n<hr class="" data-start="1192" data-end="1195" />\n<h3 class="" data-start="1197" data-end="1221">📚 Nội dung kh&oacute;a học</h3>\n<ul data-start="1223" data-end="1455">\n<li class="" data-start="1223" data-end="1259">\n<p class="" data-start="1225" data-end="1259">Giới thiệu về lập tr&igrave;nh v&agrave; Scratch</p>\n</li>\n<li class="" data-start="1260" data-end="1308">\n<p class="" data-start="1262" data-end="1308">L&agrave;m quen với giao diện v&agrave; c&aacute;c khối lệnh cơ bản</p>\n</li>\n<li class="" data-start="1309" data-end="1370">\n<p class="" data-start="1311" data-end="1370">C&aacute;ch di chuyển nh&acirc;n vật, tạo hiệu ứng &acirc;m thanh v&agrave; hoạt cảnh</p>\n</li>\n<li class="" data-start="1371" data-end="1411">\n<p class="" data-start="1373" data-end="1411">Tư duy logic: lặp lại, điều kiện, biến</p>\n</li>\n<li class="" data-start="1412" data-end="1455">\n<p class="" data-start="1414" data-end="1455">Dự &aacute;n thực tế: X&acirc;y dựng ho&agrave;n chỉnh tr&ograve; chơi từ A-Z</p>\n</li>\n</ul>\n<hr class="" data-start="1457" data-end="1460" />\n<h3 class="" data-start="1857" data-end="1885">🎯 Kết quả sau kh&oacute;a học</h3>\n<ul data-start="1887" data-end="2107">\n<li class="" data-start="1887" data-end="1944">\n<p class="" data-start="1889" data-end="1944">Trẻ <strong data-start="1893" data-end="1942">tự tin tạo ra tr&ograve; chơi cơ bản từ đầu đến cuối</strong></p>\n</li>\n<li class="" data-start="1945" data-end="2017">\n<p class="" data-start="1947" data-end="2017">Biết c&aacute;ch tư duy v&agrave; giải quyết vấn đề như một nh&agrave; s&aacute;ng tạo c&ocirc;ng nghệ</p>\n</li>\n<li class="" data-start="2018" data-end="2107">\n<p class="" data-start="2020" data-end="2107">C&oacute; thể tiếp tục ph&aacute;t triển với c&aacute;c kỹ năng n&acirc;ng cao sau n&agrave;y như AI, Robotics, Python...</p>\n</li>\n</ul>\n<hr class="" data-start="1683" data-end="1686" />\n<h3 class="" data-start="1688" data-end="1770">👉 Đăng k&yacute; ngay</h3>\n<p class="" data-start="1772" data-end="1877">Đừng bỏ lỡ cơ hội gi&uacute;p con bạn khởi đầu sớm với c&ocirc;ng nghệ &ndash; nơi mọi &yacute; tưởng đều c&oacute; thể biến th&agrave;nh tr&ograve; chơi tuyệt vời do ch&iacute;nh b&eacute; tạo n&ecirc;n!</p>	360000.0	https://localhost:7071/coursemate-files/e6e300e9-716b-4463-a5bf-0fdbd22795f1.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
eef4fafb-022a-430f-aad0-9416d37d656c	JavaScript cho người mới bắt đầu	<h2><strong>Kh&oacute;a học JavaScript: H&agrave;nh tr&igrave;nh kh&aacute;m ph&aacute; thế giới lập tr&igrave;nh</strong></h2>\n<p>Ch&agrave;o mừng bạn đến với <strong>kh&oacute;a học JavaScript</strong> - nơi m&agrave; những d&ograve;ng code trở th&agrave;nh c&ocirc;ng cụ quyền năng để bạn chinh phục thế giới số. JavaScript kh&ocirc;ng chỉ l&agrave; ng&ocirc;n ngữ lập tr&igrave;nh phổ biến nhất tr&ecirc;n h&agrave;nh tinh m&agrave; c&ograve;n l&agrave; "tr&aacute;i tim" của mọi trang web hiện đại. Từ việc tạo ra những hiệu ứng bắt mắt, những trang web tương t&aacute;c, đến việc x&acirc;y dựng c&aacute;c ứng dụng phức tạp - tất cả đều được hiện thực h&oacute;a qua JavaScript. Nhưng điều g&igrave; thực sự l&agrave;m n&ecirc;n sức hấp dẫn của ng&ocirc;n ngữ n&agrave;y?</p>\n<h3>Tại sao JavaScript l&agrave; ng&ocirc;n ngữ lập tr&igrave;nh đ&aacute;ng học nhất?</h3>\n<p>JavaScript kh&ocirc;ng chỉ l&agrave; một c&ocirc;ng cụ, n&oacute; l&agrave; một cầu nối, một chất x&uacute;c t&aacute;c giữa những &yacute; tưởng t&aacute;o bạo v&agrave; thực tế kỹ thuật số. Với sự linh hoạt v&agrave; mạnh mẽ, JavaScript đ&atilde; trở th&agrave;nh ng&ocirc;n ngữ lập tr&igrave;nh ch&iacute;nh yếu cho cả lập tr&igrave;nh front-end v&agrave; back-end. Nếu bạn từng ước mơ c&oacute; thể tự tay x&acirc;y dựng một trang web tuyệt đẹp, ph&aacute;t triển một ứng dụng web m&agrave; h&agrave;ng triệu người sử dụng mỗi ng&agrave;y, hay đơn giản l&agrave; muốn hiểu s&acirc;u hơn về c&aacute;ch thức hoạt động của internet - JavaScript ch&iacute;nh l&agrave; ch&igrave;a kh&oacute;a mở ra c&aacute;nh cửa đ&oacute;.</p>\n<h3>Kh&oacute;a học n&agrave;y d&agrave;nh cho ai?</h3>\n<ul>\n<li><strong>Người mới bắt đầu:</strong> Kh&ocirc;ng y&ecirc;u cầu bạn phải biết g&igrave; về lập tr&igrave;nh trước đ&oacute;. Ch&uacute;ng t&ocirc;i sẽ bắt đầu từ những kh&aacute;i niệm cơ bản nhất, dẫn dắt bạn từng bước v&agrave;o thế giới JavaScript.</li>\n<li><strong>Nh&agrave; ph&aacute;t triển web:</strong> Nếu bạn đ&atilde; quen thuộc với HTML v&agrave; CSS, kh&oacute;a học n&agrave;y sẽ gi&uacute;p bạn kết hợp JavaScript để tạo n&ecirc;n những trang web tương t&aacute;c v&agrave; sống động hơn.</li>\n<li><strong>Người học đam m&ecirc; c&ocirc;ng nghệ:</strong> D&ugrave; bạn đang l&agrave;m việc trong lĩnh vực kh&aacute;c nhưng c&oacute; đam m&ecirc; v&agrave; muốn chuyển hướng sang lập tr&igrave;nh, JavaScript l&agrave; một điểm khởi đầu tuyệt vời.</li>\n</ul>\n<h3>Bạn sẽ học được g&igrave;?</h3>\n<p>Kh&oacute;a học được thiết kế với nội dung phong ph&uacute;, mang t&iacute;nh thực tiễn cao, đảm bảo sau khi ho&agrave;n th&agrave;nh, bạn sẽ:</p>\n<ul>\n<li><strong>Nắm vững c&aacute;c kh&aacute;i niệm cơ bản:</strong> Biến, kiểu dữ liệu, v&ograve;ng lặp, h&agrave;m v&agrave; đối tượng trong JavaScript.</li>\n<li><strong>Hiểu r&otilde; c&aacute;ch hoạt động của DOM:</strong> C&aacute;ch tương t&aacute;c v&agrave; thao t&aacute;c với c&aacute;c phần tử HTML để tạo ra c&aacute;c trang web động v&agrave; tương t&aacute;c.</li>\n<li><strong>Ph&aacute;t triển c&aacute;c ứng dụng thực tế:</strong> Từ c&aacute;c ứng dụng nhỏ như m&aacute;y t&iacute;nh, đồng hồ đếm ngược, đến c&aacute;c ứng dụng web đầy đủ t&iacute;nh năng.</li>\n<li><strong>Lập tr&igrave;nh hướng đối tượng:</strong> T&igrave;m hiểu c&aacute;ch tổ chức v&agrave; quản l&yacute; code một c&aacute;ch khoa học với JavaScript.</li>\n</ul>\n<h3>Kh&oacute;a học n&agrave;y được thiết kế như thế n&agrave;o?</h3>\n<ul>\n<li><strong>Học đi đ&ocirc;i với h&agrave;nh:</strong> Mỗi b&agrave;i học l&yacute; thuyết sẽ đi k&egrave;m với v&iacute; dụ thực tế v&agrave; b&agrave;i tập thực h&agrave;nh để bạn c&oacute; thể &aacute;p dụng ngay kiến thức đ&atilde; học.</li>\n<li><strong>Hướng dẫn chi tiết:</strong> Với từng d&ograve;ng code được giải th&iacute;ch kỹ lưỡng, bạn sẽ kh&ocirc;ng chỉ học c&aacute;ch viết m&agrave; c&ograve;n hiểu s&acirc;u về c&aacute;ch hoạt động của ch&uacute;ng.</li>\n<li><strong>Dự &aacute;n cuối kh&oacute;a:</strong> Bạn sẽ c&oacute; cơ hội thực hiện một dự &aacute;n cuối kh&oacute;a để củng cố v&agrave; kiểm chứng lại to&agrave;n bộ kiến thức đ&atilde; học.</li>\n</ul>\n<h3>Điều g&igrave; l&agrave;m cho kh&oacute;a học n&agrave;y kh&aacute;c biệt?</h3>\n<ul>\n<li><strong>Giảng vi&ecirc;n nhiệt t&igrave;nh v&agrave; gi&agrave;u kinh nghiệm:</strong> Những chuy&ecirc;n gia đ&atilde; v&agrave; đang l&agrave;m việc trong ng&agrave;nh c&ocirc;ng nghệ sẽ chia sẻ kh&ocirc;ng chỉ kiến thức m&agrave; c&ograve;n cả những kinh nghiệm qu&yacute; b&aacute;u.</li>\n<li><strong>Cộng đồng hỗ trợ:</strong> Tham gia v&agrave;o một cộng đồng học vi&ecirc;n s&ocirc;i động, nơi bạn c&oacute; thể trao đổi, học hỏi v&agrave; ph&aacute;t triển c&ugrave;ng nhau.</li>\n<li><strong>Cập nhật li&ecirc;n tục:</strong> C&ocirc;ng nghệ kh&ocirc;ng ngừng ph&aacute;t triển v&agrave; kh&oacute;a học của ch&uacute;ng t&ocirc;i cũng vậy. Nội dung sẽ được cập nhật thường xuy&ecirc;n để bạn lu&ocirc;n bắt kịp với xu hướng mới nhất.</li>\n</ul>\n<h3>H&atilde;y bắt đầu h&agrave;nh tr&igrave;nh của bạn!</h3>\n<p>JavaScript kh&ocirc;ng chỉ l&agrave; một ng&ocirc;n ngữ lập tr&igrave;nh, n&oacute; l&agrave; một h&agrave;nh tr&igrave;nh đầy th&uacute; vị v&agrave; th&aacute;ch thức. D&ugrave; bạn bắt đầu từ con số kh&ocirc;ng hay đ&atilde; c&oacute; nền tảng, kh&oacute;a học n&agrave;y sẽ trang bị cho bạn mọi thứ cần thiết để tiến xa hơn trong sự nghiệp lập tr&igrave;nh của m&igrave;nh. H&atilde;y bắt đầu h&agrave;nh tr&igrave;nh kh&aacute;m ph&aacute; v&agrave; l&agrave;m chủ JavaScript ngay h&ocirc;m nay!</p>\n<p><strong>Đăng k&yacute; ngay</strong> v&agrave; c&ugrave;ng ch&uacute;ng t&ocirc;i biến những &yacute; tưởng s&aacute;ng tạo của bạn th&agrave;nh hiện thực!</p>	720000.0	https://localhost:7071/coursemate-files/220a8cf1-3bdd-496d-9cc2-76aae8243a7e.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Python cơ bản	<h2>Tổng quan về Python:</h2>\n<h3>Giới thiệu Python:</h3>\n<p>Python được s&aacute;ng tạo bởi&nbsp;<strong>Guido van Rossum</strong>&nbsp;v&agrave;o những năm cuối thập ni&ecirc;n 80, đầu thập ni&ecirc;n 90 tại Viện nghi&ecirc;n cứu Quốc gia về To&aacute;n học v&agrave; Khoa học m&aacute;y t&iacute;nh ở H&agrave; Lan.</p>\n<p>Python l&agrave; một ng&ocirc;n ngữ bậc cao, th&ocirc;ng dịch, ng&ocirc;n ngữ kịch bản tương t&aacute;c v&agrave; hướng đối tượng. Python được thiết kế để lập tr&igrave;nh vi&ecirc;n c&oacute; thể đọc hiểu dễ d&agrave;ng nhất. Python thưởng sử dụng c&aacute;c từ kh&oacute;a tiếng anh trong khi c&aacute;c ng&ocirc;n ngữ kh&aacute;c thường sử dụng c&aacute;c dấu c&acirc;u. Cấu trức c&uacute; ph&aacute;p của n&oacute; cũng dễ d&agrave;ng hơn sơ với c&aacute;c ng&ocirc;n ngữ kh&aacute;c. Python rất dễ học bởi v&igrave; t&agrave;i liệu li&ecirc;n quan c&oacute; thể t&igrave;m thấy ở bất cứ đ&acirc;u.</p>\n<h3>Ứng dụng của Python.</h3>\n<h4><strong>Python để viết ng&ocirc;n ngữ lập tr&igrave;nh kịch bản (scripting language).</strong></h4>\n<p>Nếu bạn đang c&oacute; &yacute; định viết một chương tr&igrave;nh mẫu (miniature) hay một chương tr&igrave;nh t&ugrave;y biến (ad-hoc) để tự động h&oacute;a những việc bạn l&agrave;m tr&ecirc;n m&aacute;y t&iacute;nh, h&atilde;y nghĩ tới việc ứng dụng Python! Người ta hay d&ugrave;ng n&oacute; với mục đ&iacute;ch n&agrave;y.</p>\n<p>Khả năng khai th&aacute;c những nguồn thư viện đa dạng của loại ng&ocirc;n ngữ n&agrave;y sẽ cho ph&eacute;p bạn l&agrave;m được rất nhiều thứ th&uacute; vị.</p>\n<p>Nhiều người đ&atilde; ứng dụng Python để viết ra một đoạn script m&agrave; bạn c&oacute; thể đưa v&agrave;o bất cứ một video n&agrave;o v&agrave; chương tr&igrave;nh sẽ cho ra h&agrave;ng loạt c&aacute;c bản ghi (transcript) đ&atilde; được chuyển ngữ ngẫu nhi&ecirc;n. Những bản n&agrave;y cũng kh&ocirc;ng mấy ho&agrave;n hảo nguy&ecirc;n nh&acirc;n l&agrave; do c&aacute;ch d&ugrave;ng từ v&agrave; ngữ điệu của người Ch&acirc;u &Aacute; ch&uacute;ng ta, tuy nhi&ecirc;n &iacute;t nhất th&igrave; n&oacute; cũng được miễn ph&iacute;.</p>\n<h4><strong>C&aacute;c ứng dụng web.</strong></h4>\n<p>Bạn c&oacute; biết rằng một số đơn vị đ&igrave;nh đ&aacute;m đ&atilde; được x&acirc;y dựng nhờ v&agrave;o ng&ocirc;n ngữ lập tr&igrave;nh Python kh&ocirc;ng?</p>\n<p><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/tuanlq7/1.jpg" alt="" width="850" height="425" /></p>\n<p>Dưới đ&acirc;y l&agrave; một danh s&aacute;ch lướt nhanh những c&ocirc;ng ty n&agrave;y:</p>\n<ul>\n<li>Dropbox.</li>\n<li>Netflix.</li>\n<li>Spotify.</li>\n<li>Instagram.</li>\n<li>21% cơ sở hạ tầng dữ liệu của Facebook.</li>\n<li>Youtube.</li>\n</ul>\n<p>Trong lĩnh vực ph&aacute;t triển ứng dụng web, khi n&oacute;i đến ng&ocirc;n ngữ Python, ta c&oacute; thể kể tới c&aacute;c framework như&nbsp;Django&nbsp;v&agrave;&nbsp;Flask. Nếu bạn c&oacute; một sự hiểu biết nhất định về lập tr&igrave;nh v&agrave; c&aacute;c framework cho web, bạn c&oacute; thể x&acirc;y dựng rất nhiều loại ứng dụng Python.</p>\n<h4><strong>Ng&agrave;nh khoa học dữ liệu (data science).</strong></h4>\n<p>Python đang l&agrave; ứng dụng đang đ&oacute;ng vai tr&ograve; một loại ng&ocirc;n ngữ lập tr&igrave;nh phổ biến nhất trong ng&agrave;nh khoa học dữ liệu v&agrave; n&oacute; đang dần nuốt chửng thị phần của c&aacute;c ng&ocirc;n ngữ kh&aacute;c.</p>\n<p><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/tuanlq7/2.jpeg" alt="" width="539" height="457" /></p>\n<p>C&oacute; rất nhiều thư viện Python m&agrave; bạn c&oacute; thể d&ugrave;ng cho c&aacute;c bộ dữ liệu lớn. Một số thư viện đ&aacute;ng ch&uacute; &yacute; như NumPy (cho những thứ thuộc về to&aacute;n học), SciPy (thư viện tin học kỹ thuật cao), Pandas (d&agrave;nh cho ph&acirc;n t&iacute;ch dữ liệu) v&agrave; Matplotlib (d&agrave;nh cho m&ocirc; h&igrave;nh h&oacute;a dữ liệu &ndash; data visualization)</p>\n<h4><strong>Machine Learning v&agrave; Tr&iacute; th&ocirc;ng minh nh&acirc;n tạo (AI).</strong></h4>\n<p><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/tuanlq7/3.png" alt="" width="720" height="302" /></p>\n<p>Rất nhiều thư viện Python c&oacute; thể v&agrave; đang được sử dụng cho lĩnh vực Machine Learning, Deep Learning v&agrave; AI. C&oacute; thể kể tới: Tensorflow, Theano v&agrave; PyTorce. C&agrave;ng nhiều lập tr&igrave;nh vi&ecirc;n l&agrave;m việc trong lĩnh vực n&agrave;y th&igrave; số lượng nguồn (resources) v&agrave; thư viện (libraries) lại c&agrave;ng tăng l&ecirc;n.</p>\n<h4><strong>Lĩnh vực IoT &ndash; Internet Vạn Vật.</strong></h4>\n<p>Bạn kh&ocirc;ng cần phải trả một khoản tiền qu&aacute; lớn hay mua từ cửa h&agrave;ng n&agrave;o cho việc ứng dụng Python v&agrave;o Internet Vạn Vật. Ng&agrave;y nay, người ta chỉ cần đầu tư một c&aacute;i m&aacute;y t&iacute;nh Raspberry Pi để khởi động những dự &aacute;n DIY IoT của ri&ecirc;ng m&igrave;nh.</p>\n<h4><strong>Lập tr&igrave;nh game.</strong></h4>\n<p>D&ugrave; Python kh&ocirc;ng mạnh như l&agrave; Unity trong lĩnh vực lập tr&igrave;nh game nhưng n&oacute; cho ph&eacute;p bạn x&acirc;y dựng dăm ba thứ kh&aacute; th&uacute; vị.</p>\n<p>Nhờ v&agrave;o Python ứng dụng v&agrave;o nhiều ng&agrave;nh nghề n&ecirc;n Python được nhiều c&ocirc;ng ty, trường học sử dụng để dạy lập tr&igrave;nh cho trẻ em v&agrave; những người mới lần đầu học lập tr&igrave;nh. B&ecirc;n cạnh những t&iacute;nh năng v&agrave; khả năng tuyệt vời th&igrave; c&uacute; ph&aacute;p đơn giản v&agrave; dễ sử dụng của n&oacute; l&agrave; l&yacute; do ch&iacute;nh cho việc n&agrave;y.</p>\n<p><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/tuanlq7/4.png" alt="" width="706" height="487" /></p>\n<hr />\n<h2>Mục ti&ecirc;u học tập của kh&oacute;a học n&agrave;y l&agrave;:</h2>\n<ul>\n<li>Để x&aacute;c định cấu tr&uacute;c v&agrave; c&aacute;c th&agrave;nh phần của chương tr&igrave;nh Python.</li>\n<li>Hiểu tại sao Python l&agrave; ng&ocirc;n ngữ hữu &iacute;ch cho c&aacute;c lập tr&igrave;nh vi&ecirc;n</li>\n<li>Hiểu c&aacute;ch thiết kế v&agrave; lập tr&igrave;nh c&aacute;c ứng dụng Python.</li>\n<li>Hiểu c&aacute;ch sử dụng list trong c&aacute;c chương tr&igrave;nh Python.</li>\n<li>Hiểu c&aacute;ch sử dụng indexing v&agrave; slicing để truy cập dữ liệu trong c&aacute;c chương tr&igrave;nh Python.</li>\n<li>Hiểu c&aacute;ch viết c&aacute;c v&ograve;ng lặp v&agrave; c&aacute;c c&acirc;u lệnh quyết định trong Python.</li>\n<li>Hiểu c&aacute;ch viết h&agrave;m v&agrave; truyền đối số trong Python.</li>\n<li>Hiểu c&aacute;ch x&acirc;y dựng v&agrave; đ&oacute;ng g&oacute;i c&aacute;c m&ocirc;-đun Python để sử dụng lại.</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/4c26fa1e-d7b9-4d34-8522-2ff981cb81ca.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
fa7b1920-a356-48af-b27e-46550a64a8dc	C# cho người mới bắt đầu	<p>Bạn đ&atilde; sẵn s&agrave;ng để n&acirc;ng cấp kỹ năng lập tr&igrave;nh của m&igrave;nh l&ecirc;n một tầm cao mới? Kh&oacute;a học n&agrave;y kh&ocirc;ng chỉ l&agrave; cơ hội để bạn l&agrave;m chủ ng&ocirc;n ngữ lập tr&igrave;nh C# m&agrave; c&ograve;n l&agrave; ch&igrave;a kh&oacute;a mở ra c&aacute;nh cửa dẫn đến những cơ hội v&ocirc; hạn trong thế giới c&ocirc;ng nghệ hiện đại.</p>\n<h2>L&yacute; do n&ecirc;n học C# .NET Core</h2>\n<h3>1. <strong>Nhu Cầu Tuyển Dụng Cao:</strong></h3>\n<p>C# .NET Core đang l&agrave; một trong những nền tảng ph&aacute;t triển phần mềm được c&aacute;c c&ocirc;ng ty c&ocirc;ng nghệ h&agrave;ng đầu săn đ&oacute;n. Với sự phổ biến của .NET Core, c&aacute;c doanh nghiệp kh&ocirc;ng ngừng t&igrave;m kiếm c&aacute;c lập tr&igrave;nh vi&ecirc;n th&agrave;nh thạo C# để ph&aacute;t triển c&aacute;c ứng dụng web, dịch vụ đ&aacute;m m&acirc;y, v&agrave; giải ph&aacute;p đa nền tảng. Học C# .NET Core sẽ gi&uacute;p bạn đ&aacute;p ứng được nhu cầu cao của thị trường lao động v&agrave; mở rộng cơ hội nghề nghiệp.</p>\n<h3>2. <strong>Đa Nền Tảng v&agrave; Linh Hoạt:</strong></h3>\n<p>Một trong những lợi thế lớn nhất của .NET Core l&agrave; khả năng chạy tr&ecirc;n nhiều hệ điều h&agrave;nh như Windows, Linux, v&agrave; macOS. Điều n&agrave;y c&oacute; nghĩa l&agrave; bạn c&oacute; thể x&acirc;y dựng c&aacute;c ứng dụng c&oacute; thể triển khai tr&ecirc;n bất kỳ nền tảng n&agrave;o, gi&uacute;p mở rộng phạm vi sử dụng v&agrave; tăng gi&aacute; trị của sản phẩm bạn ph&aacute;t triển.</p>\n<h3>3. <strong>Hiệu Suất Cao v&agrave; Tối Ưu:</strong></h3>\n<p>.NET Core được thiết kế với mục ti&ecirc;u tối ưu h&oacute;a hiệu suất, đặc biệt l&agrave; trong c&aacute;c ứng dụng web v&agrave; API. Điều n&agrave;y kh&ocirc;ng chỉ gi&uacute;p ứng dụng của bạn chạy mượt m&agrave; v&agrave; nhanh ch&oacute;ng, m&agrave; c&ograve;n gi&uacute;p tiết kiệm t&agrave;i nguy&ecirc;n hệ thống, đ&aacute;p ứng tốt hơn nhu cầu của người d&ugrave;ng.</p>\n<h3>4. <strong>Cộng Đồng Hỗ Trợ Mạnh Mẽ:</strong></h3>\n<p>Với sự hỗ trợ từ Microsoft v&agrave; cộng đồng lập tr&igrave;nh vi&ecirc;n to&agrave;n cầu, việc học C# .NET Core trở n&ecirc;n dễ d&agrave;ng v&agrave; th&uacute; vị hơn bao giờ hết. Bạn sẽ lu&ocirc;n c&oacute; nguồn t&agrave;i liệu phong ph&uacute;, c&aacute;c kh&oacute;a học trực tuyến, v&agrave; sự trợ gi&uacute;p nhiệt t&igrave;nh từ cộng đồng khi gặp kh&oacute; khăn trong qu&aacute; tr&igrave;nh học v&agrave; l&agrave;m việc.</p>\n<h3>5. <strong>Mở Rộng Kỹ Năng Lập Tr&igrave;nh:</strong></h3>\n<p>Học C# .NET Core kh&ocirc;ng chỉ gi&uacute;p bạn th&agrave;nh thạo một ng&ocirc;n ngữ lập tr&igrave;nh mạnh mẽ m&agrave; c&ograve;n gi&uacute;p mở rộng tư duy lập tr&igrave;nh, gi&uacute;p bạn dễ d&agrave;ng tiếp cận với c&aacute;c c&ocirc;ng nghệ v&agrave; ng&ocirc;n ngữ lập tr&igrave;nh kh&aacute;c. Sự linh hoạt v&agrave; mạnh mẽ của C# sẽ trang bị cho bạn nền tảng vững chắc để ph&aacute;t triển trong ng&agrave;nh c&ocirc;ng nghệ.</p>\n<h3>6. <strong>Tương Lai Rộng Mở với .NET 5 v&agrave; Sau N&agrave;y:</strong></h3>\n<p>Với sự ra đời của .NET 5 v&agrave; c&aacute;c phi&ecirc;n bản tiếp theo, Microsoft đ&atilde; hợp nhất .NET Core v&agrave; .NET Framework th&agrave;nh một nền tảng duy nhất. Điều n&agrave;y đảm bảo rằng C# .NET Core sẽ tiếp tục l&agrave; c&ocirc;ng nghệ cốt l&otilde;i trong tương lai, v&agrave; việc học n&oacute; ngay b&acirc;y giờ sẽ gi&uacute;p bạn đ&oacute;n đầu xu hướng c&ocirc;ng nghệ trong nhiều năm tới.</p>\n<h3>7. <strong>Tạo Ra C&aacute;c Ứng Dụng Đa Dạng:</strong></h3>\n<p>Với C# .NET Core, bạn c&oacute; thể tạo ra c&aacute;c ứng dụng web, dịch vụ đ&aacute;m m&acirc;y, ứng dụng m&aacute;y t&iacute;nh để b&agrave;n, ứng dụng di động, v&agrave; thậm ch&iacute; l&agrave; c&aacute;c giải ph&aacute;p IoT. Sự đa dạng n&agrave;y gi&uacute;p bạn c&oacute; thể đ&aacute;p ứng được nhiều y&ecirc;u cầu c&ocirc;ng việc kh&aacute;c nhau v&agrave; mở ra nhiều hướng ph&aacute;t triển sự nghiệp.</p>	720000.0	https://localhost:7071/coursemate-files/2f08efa2-b778-453d-8ddb-aa193c1e8cb9.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
00f1a774-5bca-44a5-b0ba-255b1d5047d3	Hoàn thiện ứng dụng web thực tế với C# và .NET Core	<p>Kh&oacute;a học n&agrave;y được thiết kế để hướng dẫn học vi&ecirc;n x&acirc;y dựng một ứng dụng web ho&agrave;n chỉnh từ đầu đến cuối bằng .NET Core, bao gồm tất cả c&aacute;c giai đoạn từ ph&acirc;n t&iacute;ch y&ecirc;u cầu, lập tr&igrave;nh cho đến triển khai tr&ecirc;n m&ocirc;i trường thực tế. D&ugrave; bạn l&agrave; người mới với những kiến thức cơ bản về C# v&agrave; c&aacute;c c&ocirc;ng nghệ web, hay đ&atilde; l&agrave; lập tr&igrave;nh vi&ecirc;n muốn n&acirc;ng cao kỹ năng, kh&oacute;a học sẽ mang lại trải nghiệm thực tiễn v&agrave; đầy đủ về ph&aacute;t triển ứng dụng hiện đại.</p>\n<h4><strong>Những g&igrave; bạn sẽ học được</strong></h4>\n<ol>\n<li>\n<p><strong>Ph&acirc;n t&iacute;ch v&agrave; lập kế hoạch y&ecirc;u cầu:</strong></p>\n<ul>\n<li>Hiểu c&aacute;ch ph&acirc;n t&iacute;ch y&ecirc;u cầu thực tế v&agrave; chuyển đổi th&agrave;nh c&aacute;c t&iacute;nh năng kỹ thuật cụ thể.</li>\n<li>Tạo user stories v&agrave; x&aacute;c định c&aacute;c chức năng ch&iacute;nh của ứng dụng.</li>\n</ul>\n</li>\n<li>\n<p><strong>Ph&aacute;t triển Backend với .NET Core:</strong></p>\n<ul>\n<li>X&acirc;y dựng API RESTful bằng .NET Core 8.</li>\n<li>Nắm vững hai phương ph&aacute;p l&agrave;m việc với cơ sở dữ liệu: <strong>Database First</strong> v&agrave; <strong>Code First</strong> với Entity Framework.</li>\n<li>Triển khai t&iacute;nh năng x&aacute;c thực v&agrave; ph&acirc;n quyền sử dụng <strong>JWT Tokens</strong>.</li>\n</ul>\n</li>\n<li>\n<p><strong>Ph&aacute;t triển Frontend:</strong></p>\n<ul>\n<li>Thiết kế giao diện người d&ugrave;ng (UI) linh hoạt với <strong>HTML</strong>, <strong>JavaScript</strong>&nbsp;v&agrave; <strong>CSS</strong>.</li>\n</ul>\n</li>\n<li>\n<p><strong>Quản l&yacute; cơ sở dữ liệu với PostgreSQL:</strong></p>\n<ul>\n<li>Thiết lập v&agrave; quản l&yacute; cơ sở dữ liệu PostgreSQL.</li>\n</ul>\n</li>\n<li>\n<p><strong>Tối ưu h&oacute;a hiệu năng:</strong></p>\n<ul>\n<li>T&iacute;ch hợp <strong>Redis</strong> để lưu trữ cache, cải thiện tốc độ v&agrave; khả năng mở rộng ứng dụng.</li>\n</ul>\n</li>\n<li>\n<p><strong>Triển khai v&agrave; sử dụng dịch vụ đ&aacute;m m&acirc;y:</strong></p>\n<ul>\n<li>Học c&aacute;ch triển khai ứng dụng tr&ecirc;n nền tảng <strong>AWS Cloud Services</strong>, đảm bảo hiệu suất v&agrave; t&iacute;nh ổn định.</li>\n</ul>\n</li>\n</ol>\n<h4><strong>Điểm nổi bật của kh&oacute;a học:</strong></h4>\n<ul>\n<li><strong>Dự &aacute;n thực tế:</strong> Học vi&ecirc;n sẽ tự tay x&acirc;y dựng một ứng dụng quản l&yacute; c&ocirc;ng việc đầy đủ chức năng.</li>\n<li>So s&aacute;nh v&agrave; &aacute;p dụng hai phương ph&aacute;p <strong>Code First</strong> v&agrave; <strong>Database First</strong> trong t&igrave;nh huống thực tế.</li>\n<li>Ph&aacute;t triển ứng dụng dựa tr&ecirc;n kiến tr&uacute;c <strong>Microservices.</strong></li>\n<li>Học c&aacute;ch quản l&yacute; v&agrave; triển khai ứng dụng tr&ecirc;n nền tảng đ&aacute;m m&acirc;y hiện đại.</li>\n<li><strong>Tương t&aacute;c với giảng vi&ecirc;n:</strong> C&aacute;c b&agrave;i tập giữa kh&oacute;a được thiết kế để bạn &aacute;p dụng kiến thức ngay lập tức. B&agrave;i l&agrave;m của bạn sẽ được đội ngũ chuy&ecirc;n gia đ&aacute;nh gi&aacute; v&agrave; nhận x&eacute;t chi tiết, gi&uacute;p bạn nhận ra ưu điểm cũng như cải thiện kỹ năng lập tr&igrave;nh.</li>\n</ul>\n<h4><strong>Kết quả sau kh&oacute;a học:</strong></h4>\n<p>Sau kh&oacute;a học, bạn sẽ c&oacute; khả năng tự x&acirc;y dựng v&agrave; triển khai một ứng dụng web thực tế bằng .NET Core, đồng thời nắm vững c&aacute;c c&ocirc;ng nghệ hiện đại để mở rộng v&agrave; ph&aacute;t triển dự &aacute;n trong tương lai.</p>	1000000.0	https://localhost:7071/coursemate-files/fe260b41-5370-4430-8c7e-587369dd573a.png	t	5ac3586c-394f-45c2-b000-9332d118b498	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
3cfe0502-a9d6-4353-b87f-ed417a83124f	Lập trình C++ cơ bản	<p>C++ l&agrave; một trong những ng&ocirc;n ngữ lập tr&igrave;nh phổ biến nhất, đặc biệt trong lập tr&igrave;nh thi đấu. Hiện nay, đa số c&aacute;c bạn trẻ đều ưu ti&ecirc;n chọn học C++ để x&acirc;y dựng nền tảng v&agrave; tư duy lập tr&igrave;nh khi mới bắt đầu kh&aacute;m ph&aacute; lập tr&igrave;nh. Kh&oacute;a học C++ cơ bản được thiết kế với những kiến thức cơ bản v&agrave; dễ hiểu nhất để gi&uacute;p c&aacute;c bạn tiếp cận dễ d&agrave;ng.</p>\n<h2><strong>Mục ti&ecirc;u của kh&oacute;a học:</strong></h2>\n<ul data-sourcepos="7:1-11:0">\n<li data-sourcepos="7:1-7:66">Gi&uacute;p bạn <strong>học C++ từ con số 0</strong> một c&aacute;ch nhanh ch&oacute;ng v&agrave; dễ hiểu.</li>\n<li data-sourcepos="8:1-8:91">Trang bị cho bạn kiến thức v&agrave; kỹ năng cần thiết để <strong>viết c&aacute;c chương tr&igrave;nh C++ đơn giản.</strong></li>\n<li data-sourcepos="9:1-9:131">Gi&uacute;p bạn <strong>hiểu v&agrave; sử dụng c&aacute;c kh&aacute;i niệm quan trọng</strong> trong C++.</li>\n<li data-sourcepos="10:1-11:0"><strong>Tạo nền tảng</strong> cho bạn để tự học v&agrave; ph&aacute;t triển c&aacute;c chương tr&igrave;nh C++ phức tạp hơn.</li>\n</ul>\n<h2 data-sourcepos="12:1-12:23"><strong>Đối tượng học vi&ecirc;n:</strong></h2>\n<ul data-sourcepos="14:1-17:0">\n<li style="text-align: left;" data-sourcepos="14:1-14:97">Kh&oacute;a học n&agrave;y d&agrave;nh cho những người mới bắt đầu ho&agrave;n to&agrave;n chưa c&oacute; kiến thức về lập tr&igrave;nh, hoặc những bạn mất căn bản muốn lấy lại kiến thức nền tảng lập tr&igrave;nh, cụ thể l&agrave; C++.</li>\n</ul>\n<h2 data-sourcepos="29:1-29:26"><strong>Phương ph&aacute;p giảng dạy:</strong></h2>\n<ul data-sourcepos="31:1-34:0">\n<li data-sourcepos="31:1-31:88">Kh&oacute;a học được kết hợp&nbsp;giữa <strong>l&yacute; thuyết</strong> v&agrave; <strong>thực h&agrave;nh</strong>.</li>\n<li data-sourcepos="32:1-32:146">Học vi&ecirc;n sẽ được học qua c&aacute;c video b&agrave;i giảng, b&agrave;i đọc l&yacute; thuyết, b&agrave;i tập thực h&agrave;nh v&agrave; b&agrave;i tập trắc nghiệm l&yacute; thuyết<strong>.</strong></li>\n<li data-sourcepos="32:1-32:146">Học vi&ecirc;n sẽ được trao đổi hỏi đ&aacute;p những thắc mắc trực tiếp với c&aacute;c bạn c&ugrave;ng kh&oacute;a v&agrave; với người quản l&yacute; kh&oacute;a học.</li>\n</ul>	720000.0	https://localhost:7071/coursemate-files/f106fadf-c661-4ed4-8d14-f073595f48c9.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
3dd82fcf-1316-40d6-85bb-a05fc30471db	Tự động hóa công việc hàng ngày với Python	<h2><strong>Kh&oacute;a học Tự động h&oacute;a c&ocirc;ng việc h&agrave;ng ng&agrave;y với Python: Biến Python th&agrave;nh c&ocirc;ng cụ tự động h&oacute;a mạnh mẽ!</strong></h2>\n<h3><strong>Lộ tr&igrave;nh học Python ho&agrave;n chỉnh</strong></h3>\n<p>Để đảm bảo h&agrave;nh tr&igrave;nh học tập hiệu quả, ch&uacute;ng t&ocirc;i đề xuất lộ tr&igrave;nh học như sau:</p>\n<ul>\n<li><a href="https://codelearn.io/learning/python-cho-nguoi-moi-bat-dau" target="_blank" rel="noopener">Python Cơ bản</a>: Nền tảng vững chắc cho người mới bắt đầu</li>\n<li><a href="https://codelearn.io/learning/python-nang-cao" target="_blank" rel="noopener">Python N&acirc;ng cao</a>: Đi s&acirc;u v&agrave;o c&aacute;c kh&aacute;i niệm phức tạp</li>\n</ul>\n<h3><strong>Sẵn s&agrave;ng n&acirc;ng cao kỹ năng Python của bạn?</strong></h3>\n<p>Kh&oacute;a học <strong>Tự động h&oacute;a c&ocirc;ng việc h&agrave;ng ng&agrave;y với Python</strong>&nbsp;l&agrave; bước tiến quan trọng cho những học vi&ecirc;n đ&atilde; ho&agrave;n th&agrave;nh c&aacute;c kh&oacute;a Python cơ bản v&agrave; n&acirc;ng cao. Kh&oacute;a học n&agrave;y tập trung v&agrave;o việc chuyển đổi kiến thức l&yacute; thuyết th&agrave;nh c&aacute;c ứng dụng thực tế, đặc biệt l&agrave; <strong>sử dụng Python để tạo ra c&aacute;c c&ocirc;ng cụ tự động h&oacute;a</strong> mạnh mẽ.</p>\n<h3><strong>Điểm nổi bật của kh&oacute;a học:</strong></h3>\n<ul>\n<li>\n<p><strong>Học thực tiễn</strong>: X&acirc;y dựng c&aacute;c dự &aacute;n tự động h&oacute;a thực tế như hệ thống gửi email tự động, quản l&yacute; dữ liệu, v&agrave; tối ưu h&oacute;a quy tr&igrave;nh l&agrave;m việc.</p>\n</li>\n<li>\n<p><strong>Tăng hiệu suất c&ocirc;ng việc</strong>: Tiết kiệm h&agrave;ng giờ l&agrave;m việc mỗi tuần th&ocirc;ng qua việc tự động h&oacute;a c&aacute;c t&aacute;c vụ lặp lại, giảm thiểu sai s&oacute;t v&agrave; tăng năng suất.</p>\n</li>\n<li>\n<p><strong>Chứng chỉ chuy&ecirc;n nghiệp</strong>: Nhận chứng chỉ c&oacute; gi&aacute; trị sau khi ho&agrave;n th&agrave;nh kh&oacute;a học, chứng minh khả năng tự động h&oacute;a với Python của bạn.</p>\n</li>\n</ul>\n<h3><strong>Đối tượng ph&ugrave; hợp:</strong></h3>\n<ul>\n<li>Học vi&ecirc;n đ&atilde; ho&agrave;n th&agrave;nh kh&oacute;a Python Cơ bản v&agrave; N&acirc;ng cao</li>\n<li>Chuy&ecirc;n gia v&agrave; lập tr&igrave;nh vi&ecirc;n muốn tối ưu h&oacute;a quy tr&igrave;nh l&agrave;m việc</li>\n<li>Người đang t&igrave;m kiếm giải ph&aacute;p tự động h&oacute;a cho c&ocirc;ng việc h&agrave;ng ng&agrave;y</li>\n</ul>\n<h3><strong>Phương ph&aacute;p đ&agrave;o tạo:</strong></h3>\n<ul>\n<li>\n<p><strong>Học tập to&agrave;n diện</strong>: Kết hợp l&yacute; thuyết với thực h&agrave;nh qua c&aacute;c dự &aacute;n thực tế</p>\n</li>\n<li>\n<p><strong>Hướng dẫn chuy&ecirc;n s&acirc;u</strong>: Được đ&agrave;o tạo bởi c&aacute;c chuy&ecirc;n gia c&oacute; nhiều năm kinh nghiệm trong lĩnh vực tự động h&oacute;a</p>\n</li>\n<li>\n<p><strong>Hỗ trợ li&ecirc;n tục</strong>: Được mentor hỗ trợ trong suốt qu&aacute; tr&igrave;nh học tập</p>\n</li>\n</ul>\n<h3><strong>Sẵn s&agrave;ng trở th&agrave;nh chuy&ecirc;n gia Python Automation?</strong></h3>\n<p>H&atilde;y tham gia kh&oacute;a học <strong>Tự động h&oacute;a c&ocirc;ng việc h&agrave;ng ng&agrave;y với Python</strong>&nbsp;ngay h&ocirc;m nay để n&acirc;ng cao kỹ năng lập tr&igrave;nh v&agrave; tạo ra sự kh&aacute;c biệt trong sự nghiệp của bạn. Với lộ tr&igrave;nh học được thiết kế chuy&ecirc;n nghiệp, ch&uacute;ng t&ocirc;i cam kết gi&uacute;p bạn l&agrave;m chủ kỹ năng tự động h&oacute;a với Python một c&aacute;ch hiệu quả nhất.</p>	1099000.0	https://localhost:7071/coursemate-files/824751d2-9552-4e43-a77c-ee5019e7b05a.jpg	t	087499f3-3cc2-4d25-8ad5-8c63c6b74c44	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
4cd5c8a1-4784-4e9d-a965-c8aed969e868	C cho người mới bắt đầu	<h3>Tổng quan về ng&ocirc;n ngữ C:</h3>\n<ul>\n<li>Ng&ocirc;n ngữ C l&agrave; một ng&ocirc;n ngữ đ&atilde; c&oacute; mặt từ rất l&acirc;u,&nbsp;l&agrave; ng&ocirc;n ngữ mệnh lệnh được ra đời từ đầu thập ni&ecirc;n 70.</li>\n<li>Ng&ocirc;n ngữ C l&agrave; một ng&ocirc;n ngữ cấu tr&uacute;c v&agrave; xếp v&agrave;o loại ng&ocirc;n ngữ bậc 3 (loại ng&ocirc;n ngữ cao cấp hơn ng&ocirc;n ngữ m&atilde; m&aacute;y v&agrave; thấp hơn ng&ocirc;n ngữ hướng đối tượng &ndash; bậc 4).</li>\n<li>Ng&ocirc;n ngữ C kh&ocirc;ng chỉ được ưa chuộng trong việc viết c&aacute;c ứng dụng. M&agrave; c&ograve;n l&agrave; ng&ocirc;n ngữ rất hiệu quả trong việc&nbsp;viết c&aacute;c&nbsp;phần mềm hệ thống.</li>\n<li>Được ph&aacute;t triển ban đầu bởi Dennis Ritchie để ph&aacute;t triển hệ thống lập tr&igrave;nh UNIX ở Bell Labs.</li>\n<li>Những&nbsp;hệ điều h&agrave;nh&nbsp;lớn Windows, Linux,&hellip;đều chịu ảnh hưởng từ ng&ocirc;n ngữ C.</li>\n</ul>\n<hr />\n<h3>Ứng dụng của ng&ocirc;n ngữ C:</h3>\n<h4><span id="He_dieu_hanh">Hệ điều h&agrave;nh.</span></h4>\n<p>Ng&ocirc;n ngữ lập tr&igrave;nh C c&oacute; thể được sử dụng để thiết kế phần mềm hệ thống. Như l&agrave; hệ điều h&agrave;nh v&agrave; Tr&igrave;nh bi&ecirc;n dịch.&nbsp;Viết kịch bản hệ điều h&agrave;nh UNIX l&agrave; mục đ&iacute;ch ch&iacute;nh của việc tạo ra C. Ng&ocirc;n ngữ C l&agrave; một phần kh&ocirc;ng thể thiếu trong qu&aacute; tr&igrave;nh ph&aacute;t triển của nhiều hệ điều h&agrave;nh. Unix-Kernel, c&aacute;c tiện &iacute;ch v&agrave; ứng dụng hệ điều h&agrave;nh Microsoft Windows v&agrave; một bộ phận lớn hệ điều h&agrave;nh Android đều đ&atilde; được viết kịch bản trong C.</p>\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/TuanLQ7/HaiZuka/C_HeDieuHanh.png" alt="" width="674" height="434" /></p>\n<h4><span id="Phat_trien_ngon_ngu_moi">Ph&aacute;t triển ng&ocirc;n ngữ mới</span></h4>\n<p>Ứng dụng thứ 2 của ng&ocirc;n ngữ c đ&oacute; l&agrave; n&oacute; l&agrave; cơ sở để ph&aacute;t triển ng&ocirc;n ngữ mới. Bởi n&oacute; c&oacute;&nbsp;ảnh hưởng trực tiếp hoặc gi&aacute;n tiếp đến sự ph&aacute;t triển của nhiều ng&ocirc;n ngữ bao gồm C ++ l&agrave; C với c&aacute;c lớp, C #, D, Java, Limbo, JavaScript, Perl, UNIX&rsquo;s C Shell, PHP v&agrave; Python v&agrave; Verilog.&nbsp;C&aacute;c ng&ocirc;n ngữ n&agrave;y sử dụng C trong khả năng biến đổi: v&iacute; dụ, trong Python. C được sử dụng để x&acirc;y dựng c&aacute;c thư viện chuẩn. Trong khi c&aacute;c ng&ocirc;n ngữ kh&aacute;c như C ++, Perl v&agrave; PHP c&oacute; cấu tr&uacute;c c&uacute; ph&aacute;p v&agrave; điều khiển dựa tr&ecirc;n C. Ch&iacute;nh v&igrave; vậy m&agrave; n&oacute; được mệnh danh l&agrave; &rdquo; &ocirc;ng nội&rdquo; của c&aacute;c ng&ocirc;n ngữ lập tr&igrave;nh.</p>\n<h4><span id="Nen_tang_tinh_toan">Nền tảng t&iacute;nh to&aacute;n</span></h4>\n<p>Ng&ocirc;n ngữ C thực hiện c&aacute;c thuật to&aacute;n v&agrave; cấu tr&uacute;c dữ liệu nhanh ch&oacute;ng. Tạo điều kiện cho việc t&iacute;nh to&aacute;n nhanh hơn trong c&aacute;c chương tr&igrave;nh.&nbsp;Điều n&agrave;y đ&atilde; cho ph&eacute;p sử dụng C trong c&aacute;c ứng dụng y&ecirc;u cầu mức độ t&iacute;nh to&aacute;n cao hơn như MATLAB v&agrave; Mathematica.</p>\n<h4><span id="He_thong_nhung">Hệ thống nh&uacute;ng</span></h4>\n<p>C&aacute;c t&iacute;nh năng của C bao như l&agrave; truy cập trực tiếp v&agrave;o API phần cứng của m&aacute;y, sự hiện diện của tr&igrave;nh bi&ecirc;n dịch C. Ngo&agrave;i ra&nbsp;<strong>lập tr&igrave;nh C</strong>&nbsp;c&ograve;n sử dụng t&agrave;i nguy&ecirc;n x&aacute;c định v&agrave; ph&acirc;n bổ bộ nhớ động Đ&atilde; l&agrave;m cho ng&ocirc;n ngữ C trở th&agrave;nh lựa chọn tối ưu cho c&aacute;c ứng dụng v&agrave; tr&igrave;nh điều khiển của c&aacute;c hệ thống nh&uacute;ng.</p>\n<h4><span id="Do_hoa_va_tro_choi">Đồ họa v&agrave; tr&ograve; chơi</span></h4>\n<p>Ngo&agrave;i c&aacute;c ứng dụng tr&ecirc;n th&igrave; ng&ocirc;n ngữ C c&ograve;n được d&ugrave;ng trong đồ họa v&agrave; lập tr&igrave;nh game. N&oacute; đ&atilde; được sử dụng để&nbsp;&nbsp;ph&aacute;t triển một loạt c&aacute;c ứng dụng đồ họa v&agrave; chơi game, như cờ vua, b&oacute;ng nảy, bắn cung, v.v.</p>\n<p>Như vậy ta c&oacute; thể thấy rằng ng&ocirc;n ngữ tuy đ&atilde; xuất hiện từ l&acirc;u, nhưng những ứng dụng v&agrave; sự phổ biến của n&oacute; c&ograve;n rất lớn. Với những t&iacute;nh năng v&agrave; ứng dụng rộng r&atilde;i,&nbsp;lập tr&igrave;nh C&nbsp;vẫn l&agrave; một &ldquo;l&atilde;o l&agrave;ng&rdquo; trong ng&agrave;nh lập tr&igrave;nh.</p>\n<hr />\n<h3>Học vi&ecirc;n sẽ nhận được những g&igrave; trong kh&oacute;a học:</h3>\n<ul>\n<li>Hiểu c&aacute;ch sử dụng ng&ocirc;n ngữ C:\n<ul>\n<li>Biết c&aacute;ch th&ecirc;m c&aacute;c thư viện.</li>\n<li>Biết r&otilde; c&aacute;ch khai b&aacute;o biến.</li>\n<li>Biết c&aacute;ch nhập xuất dữ liệu.</li>\n</ul>\n</li>\n<li>Hiểu được c&aacute;ch hoạt động của v&agrave;o lặp (Trong C cũng như c&aacute;c ng&ocirc;n ngữ kh&aacute;c):\n<ul>\n<li>V&ograve;ng lặp for.</li>\n<li>V&ograve;ng lặp while, do-while.</li>\n</ul>\n</li>\n<li>Hiểu r&otilde; c&aacute;ch cấu tr&uacute;c cơ bản của một ng&ocirc;n ngữ lập tr&igrave;nh:\n<ul>\n<li>Cấu tr&uacute;c mảng.</li>\n<li>Cấu tr&uacute;c chuỗi.</li>\n</ul>\n</li>\n<li>L&agrave;m quen với một số giải thuật cơ bản,\n<ul>\n<li>Biết c&aacute;ch viết c&aacute;c h&agrave;m.</li>\n<li>L&agrave;m quen với giải thuật đệ quy.</li>\n</ul>\n</li>\n</ul>\n<hr /><hr />\n<p>Bạn cũng c&oacute; thể t&igrave;m hiểu s&acirc;u v&agrave; ng&ocirc;n ngữ C v&agrave; ứng dụng của n&oacute; <a href="https://vi.wikipedia.org/wiki/C_(ng%C3%B4n_ng%E1%BB%AF_l%E1%BA%ADp_tr%C3%ACnh)" target="_blank" rel="noopener">Tại đ&acirc;y</a>.</p>	0.0	https://localhost:7071/coursemate-files/9869e6da-f8b5-4385-bf5c-d79eeca54f69.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Phần cứng máy tính	<h3>Tổng quan về Phần cứng m&aacute;y t&iacute;nh</h3>\n<ul>\n<li>Phần cứng m&aacute;y t&iacute;nh n&oacute;i chung c&oacute; thể tạm hiểu l&agrave; tất cả thiết bị cấu th&agrave;nh n&ecirc;n một chiếc m&aacute;y t&iacute;nh, chẳng hạn như m&agrave;n h&igrave;nh, bộ xử l&yacute;, card mạng, ổ cứng, b&agrave;n ph&iacute;m v&agrave; chuột.</li>\n<li>\n<p>Phần cứng thường được hướng dẫn (điều khiển) bởi phần mềm để thực hiện c&aacute;c lệnh. Sự kết hợp giữa phần cứng v&agrave; phần mềm một c&aacute;ch ph&ugrave; hợp tạo th&agrave;nh một hệ thống m&aacute;y t&iacute;nh c&oacute; thể sử dụng được.</p>\n</li>\n<li>\n<p>Lịch sử h&igrave;nh th&agrave;nh của m&aacute;y t&iacute;nh n&oacute;i chung cũng ch&iacute;nh l&agrave; lịch sử cải tiến của Phần cứng m&aacute;y t&iacute;nh. Cho tới nay c&oacute; thể được ph&acirc;n th&agrave;nh bốn thế hệ, mỗi thế hệ được đặc trưng bởi một sự thay đổi quan trọng về c&ocirc;ng nghệ.</p>\n</li>\n<li>Ng&agrave;y nay m&aacute;y t&iacute;nh được cải tiến li&ecirc;n tục với tốc độ v&agrave; khả năng xử l&yacute; mạnh mẽ. Sở dĩ vậy ch&iacute;nh l&agrave; nhờ sự ph&aacute;t triển kh&ocirc;ng ngừng về c&ocirc;ng nghệ sản xuất phần cứng.</li>\n</ul>\n<hr />\n<h3>Ứng dụng của Phần cứng m&aacute;y t&iacute;nh</h3>\n<p>Phần cứng m&aacute;y t&iacute;nh ch&iacute;nh l&agrave; phần "th&acirc;n x&aacute;c" của m&aacute;y t&iacute;nh, kh&ocirc;ng c&oacute; phần cứng m&aacute;y t&iacute;nh th&igrave; kh&ocirc;ng thể c&oacute; m&aacute;y t&iacute;nh. Phần cứng, kết hợp với phần mềm m&aacute;y t&iacute;nh tạo ra một chiếc m&aacute;y t&iacute;nh ho&agrave;n chỉnh c&oacute; thể chạy được. Số lượng m&aacute;y t&iacute;nh nhiều v&agrave; chất lượng ch&iacute;nh l&agrave; một trong c&aacute;c ti&ecirc;u ch&iacute; đ&aacute;nh gi&aacute; mức độ ph&aacute;t triển của c&aacute;c c&ocirc;ng ty, quốc gia...</p>\n<h4>C&aacute;c c&ocirc;ng ty lớn về c&ocirc;ng nghệ đều sản xuất phần cứng m&aacute;y t&iacute;nh.</h4>\n<p>Để gi&uacute;p c&aacute;c bạn thấy được phần cứng m&aacute;y t&iacute;nh c&oacute; vai tr&ograve; quan trọng như thế n&agrave;o, h&atilde;y xem danh s&aacute;ch c&aacute;c c&ocirc;ng ty c&ocirc;ng nghệ lớn nhất thế giới, tất cả đều sản xuất m&aacute;y t&iacute;nh v&agrave; phần cứng m&aacute;y t&iacute;nh.</p>\n<figure id="attachment_1505" class="wp-caption aligncenter" aria-describedby="caption-attachment-1505"><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/Shanghaik/Pictures/hardware.png" alt="" width="797" height="405" /></figure>\n<p>Như bạn thấy, phần cứng m&aacute;y t&iacute;nh gắn liền mật thiết với c&aacute;c c&ocirc;ng ty c&ocirc;ng nghệ h&agrave;ng đầu, c&aacute;c thương hiệu m&aacute;y t&iacute;nh ứng với c&aacute;c doanh nghiệp tr&ecirc;n l&agrave; v&ocirc; c&ugrave;ng nổi tiếng, chỉ cần n&oacute;i đến t&ecirc;n c&aacute;c thương hiệu ta sẽ nghĩ ngay đến m&aacute;y t&iacute;nh.</p>\n<h4>Ph&acirc;n loại phần cứng</h4>\n<p>Phần cứng m&aacute;y t&iacute;nh c&oacute; thể được ph&acirc;n loại theo nhiều c&aacute;ch thức kh&aacute;c nhau. Ta c&oacute; thể ph&acirc;n loại theo chức năng, hoặc theo c&aacute;c phần cụ thể, một m&aacute;y t&iacute;nh cơ bản thường c&oacute; c&aacute;c phần như sau</p>\n<p style="padding-left: 30px;"><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/Shanghaik/Pictures/hardware2.png" alt="" width="493" height="466" /></p>\n<h4><strong>Phần cứng mở rộng</strong></h4>\n<p>Kh&ocirc;ng chỉ ở mức sử dụng cơ bản, ng&agrave;y nay phần cứng m&aacute;y t&iacute;nh c&oacute; thể mở rộng theo nhu cầu sử dụng. Ch&uacute;ng ta sẽ được t&igrave;m hiểu về ch&uacute;ng trong c&aacute;c b&agrave;i học.</p>\n<p style="padding-left: 30px;"><img src="https://s3-hfx03.fptcloud.com/codelearnstorage/Media/Default/Users/Shanghaik/Pictures/hardware3.png" alt="" width="406" height="383" /></p>\n<hr />\n<h3>Học vi&ecirc;n sẽ nhận được những g&igrave; trong kh&oacute;a học:</h3>\n<ul>\n<li>Hiểu c&aacute;ch ph&acirc;n biệt v&agrave; c&ocirc;ng dụng của phần cứng m&aacute;y t&iacute;nh.\n<ul>\n<li>Biết c&aacute;ch x&aacute;c định x&aacute;c th&agrave;nh phần phần cứng m&aacute;y t&iacute;nh.</li>\n<li>Biết r&otilde; cấu tr&uacute;c của c&aacute;c th&agrave;nh phần phần cứng.</li>\n<li>Biết c&aacute;ch m&agrave; phần cứng m&aacute;y t&iacute;nh t&aacute;c động l&ecirc;n th&ocirc;ng tin.</li>\n</ul>\n</li>\n<li>Hiểu được c&aacute;ch hoạt động phần cứng m&aacute;y t&iacute;nh.\n<ul>\n<li>Hiểu c&aacute;ch m&agrave; phần cứng tương t&aacute;c với phần mềm v&agrave; th&ocirc;ng tin.</li>\n<li>Phần cứng v&agrave; cấu tr&uacute;c ho&agrave;n thiện của một m&aacute;y t&iacute;nh.</li>\n</ul>\n</li>\n<li>Biết c&aacute;ch chọn một chiếc m&aacute;y t&iacute;nh ph&ugrave; hợp cho m&igrave;nh.\n<ul>\n<li>Nhu cầu cho giải tr&iacute;.</li>\n<li>Nhu cầu cho l&agrave;m việc.</li>\n<li>Nhu cầu cho học tập.</li>\n</ul>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/3938c72f-fb6f-43c4-9e3a-5f0cc28f495c.png	t	01ebd503-5522-4871-81a4-ec12bd80cdf3	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
6097a7ef-548b-4542-8c60-5ee180d2dd96	Scratch Nâng Cao	<h3>GIỚI THIỆU KH&Oacute;A HỌC LẬP TR&Igrave;NH SCRATCH N&Acirc;NG CAO</h3>\n<p>Kh&oacute;a học lập tr&igrave;nh <strong>Scratch N&acirc;ng Cao</strong>&nbsp;l&agrave; bước tiếp theo để ph&aacute;t triển khả năng tư duy logic v&agrave; s&aacute;ng tạo qua việc lập tr&igrave;nh c&aacute;c dự &aacute;n phức tạp hơn. Th&ocirc;ng qua kh&oacute;a học n&agrave;y, c&aacute;c bạn nhỏ sẽ bước s&acirc;u hơn v&agrave;o thế giới lập tr&igrave;nh, học c&aacute;ch x&acirc;y dựng c&aacute;c tr&ograve; chơi ho&agrave;n chỉnh v&agrave; ứng dụng những kiến thức to&aacute;n học v&agrave;o lập tr&igrave;nh. Đ&acirc;y l&agrave; kh&oacute;a học gi&uacute;p c&aacute;c bạn trẻ kh&ocirc;ng chỉ r&egrave;n luyện kỹ năng lập tr&igrave;nh m&agrave; c&ograve;n k&iacute;ch th&iacute;ch tư duy t&iacute;nh to&aacute;n v&agrave; s&aacute;ng tạo, chuẩn bị cho c&aacute;c bước tiến xa hơn trong thế giới c&ocirc;ng nghệ.</p>\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/S1_864621c3042844e488dc13147b49941d.jpg" width="700" height="700" /></p>\n<h4>TẠI SAO N&Ecirc;N HỌC LẬP TR&Igrave;NH SCRATCH N&Acirc;NG CAO?</h4>\n<ul>\n<li><strong>X&acirc;y dựng game của ri&ecirc;ng bạn</strong>: Kh&oacute;a học n&agrave;y tập trung v&agrave;o việc hướng dẫn c&aacute;c bạn trẻ tự tay thiết kế, ph&aacute;t triển v&agrave; ho&agrave;n thiện tr&ograve; chơi của m&igrave;nh. Bạn sẽ kh&ocirc;ng chỉ lập tr&igrave;nh c&aacute;c khối lệnh đơn giản nữa m&agrave; sẽ kết hợp ch&uacute;ng để tạo ra những sản phẩm phức tạp v&agrave; hấp dẫn hơn.</li>\n<li><strong>Ứng dụng to&aacute;n học v&agrave;o lập tr&igrave;nh</strong>: Scratch n&acirc;ng cao gi&uacute;p bạn hiểu r&otilde; hơn về c&aacute;ch to&aacute;n học được ứng dụng trong lập tr&igrave;nh. Bạn sẽ học c&aacute;ch sử dụng c&aacute;c ph&eacute;p t&iacute;nh, h&agrave;m to&aacute;n học v&agrave; cấu tr&uacute;c điều kiện để x&acirc;y dựng c&aacute;c tr&ograve; chơi mang t&iacute;nh thử th&aacute;ch cao hơn.</li>\n<li><strong>Ph&aacute;t triển tư duy logic</strong>: Khi thực hiện c&aacute;c dự &aacute;n n&acirc;ng cao, bạn sẽ phải đối mặt với những b&agrave;i to&aacute;n lập tr&igrave;nh đ&ograve;i hỏi khả năng tư duy logic, c&aacute;ch ph&acirc;n t&iacute;ch v&agrave; giải quyết vấn đề hiệu quả. Điều n&agrave;y gi&uacute;p bạn trở th&agrave;nh những lập tr&igrave;nh vi&ecirc;n tiềm năng, sẵn s&agrave;ng đối mặt với c&aacute;c thử th&aacute;ch lớn hơn trong tương lai.</li>\n</ul>\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/S2_db30d1e5fce54c3fb3992d0cd22eb1bc.jpg" width="700" height="700" /></p>\n<h4>ƯU ĐIỂM CỦA KH&Oacute;A HỌC SCRATCH N&Acirc;NG CAO</h4>\n<ul>\n<li><strong>Đ&agrave;o s&acirc;u hơn v&agrave;o lập tr&igrave;nh</strong>: Kh&ocirc;ng c&ograve;n l&agrave; những thao t&aacute;c k&eacute;o thả đơn giản, bạn sẽ học c&aacute;ch kết hợp nhiều khối lệnh v&agrave; tư duy s&aacute;ng tạo để tạo ra những tr&ograve; chơi phức tạp.</li>\n<li><strong>Lập tr&igrave;nh dựa tr&ecirc;n to&aacute;n học</strong>: Th&ocirc;ng qua c&aacute;c b&agrave;i tập sử dụng to&aacute;n học, bạn sẽ thấy c&aacute;ch lập tr&igrave;nh c&oacute; thể được &aacute;p dụng v&agrave;o c&aacute;c kh&iacute;a cạnh kh&aacute;c nhau của cuộc sống, đặc biệt l&agrave; trong giải quyết c&aacute;c b&agrave;i to&aacute;n thực tế.</li>\n<li><strong>Ph&aacute;t triển khả năng giải quyết vấn đề</strong>: Mỗi b&agrave;i tập đều y&ecirc;u cầu bạn suy nghĩ, thử nghiệm v&agrave; t&igrave;m ra c&aacute;c giải ph&aacute;p thay thế khi gặp lỗi, từ đ&oacute; r&egrave;n luyện kỹ năng lập tr&igrave;nh chuy&ecirc;n nghiệp.</li>\n<li><strong>Tăng cường sự s&aacute;ng tạo</strong>: Kh&oacute;a học gi&uacute;p bạn kh&ocirc;ng chỉ lập tr&igrave;nh m&agrave; c&ograve;n s&aacute;ng tạo ra những thế giới tr&ograve; chơi mới, thể hiện &yacute; tưởng của ri&ecirc;ng m&igrave;nh qua từng dự &aacute;n.</li>\n</ul>\n<h4>ĐIỂM NỔI BẬT CỦA KH&Oacute;A HỌC</h4>\n<ul>\n<li><strong>Gi&aacute;o vi&ecirc;n nhiệt huyết</strong>: Đội ngũ gi&aacute;o vi&ecirc;n d&agrave;y dặn kinh nghiệm sẽ theo s&aacute;t, hướng dẫn bạn từng bước v&agrave; hỗ trợ bạn trong suốt kh&oacute;a học.</li>\n<li><strong>Cơ hội tham gia c&aacute;c cuộc thi lập tr&igrave;nh</strong>: Sau khi ho&agrave;n th&agrave;nh kh&oacute;a học, bạn sẽ c&oacute; cơ hội tham gia c&aacute;c cuộc thi lập tr&igrave;nh trẻ như Tin học trẻ, v&agrave; thậm ch&iacute; c&oacute; thể tiến xa hơn trong c&aacute;c cuộc thi quốc tế về lập tr&igrave;nh.</li>\n<li><strong>Ph&aacute;t triển dự &aacute;n thực tế</strong>: C&aacute;c bạn trẻ sẽ tự tay x&acirc;y dựng c&aacute;c tr&ograve; chơi v&agrave; ứng dụng học tập của ri&ecirc;ng m&igrave;nh, c&oacute; thể chia sẻ với bạn b&egrave; v&agrave; cộng đồng lập tr&igrave;nh tr&ecirc;n to&agrave;n thế giới.</li>\n</ul>\n<h3>MỤC TI&Ecirc;U KH&Oacute;A HỌC</h3>\n<ul>\n<li><strong>L&agrave;m chủ tư duy logic</strong>: Học c&aacute;ch giải quyết vấn đề th&ocirc;ng qua lập tr&igrave;nh, ph&aacute;t triển tư duy ph&acirc;n t&iacute;ch v&agrave; suy nghĩ hệ thống.</li>\n<li><strong>S&aacute;ng tạo kh&ocirc;ng giới hạn</strong>: Tự do s&aacute;ng tạo ra c&aacute;c tr&ograve; chơi của ri&ecirc;ng m&igrave;nh với nội dung v&agrave; c&aacute;ch chơi độc đ&aacute;o.</li>\n<li><strong>Học c&aacute;ch l&agrave;m việc độc lập v&agrave; theo nh&oacute;m</strong>: Bạn sẽ biết c&aacute;ch hợp t&aacute;c với bạn b&egrave; hoặc tự m&igrave;nh ho&agrave;n th&agrave;nh c&aacute;c dự &aacute;n lập tr&igrave;nh.</li>\n</ul>\n<p>Kh&oacute;a học Scratch n&acirc;ng cao sẽ đưa c&aacute;c bạn nhỏ đi xa hơn tr&ecirc;n h&agrave;nh tr&igrave;nh lập tr&igrave;nh, mở ra cơ hội để kh&aacute;m ph&aacute; những tiềm năng v&ocirc; tận trong thế giới số. Tham gia ngay để c&ugrave;ng ch&uacute;ng t&ocirc;i chinh phục c&aacute;c thử th&aacute;ch lập tr&igrave;nh v&agrave; kh&aacute;m ph&aacute; những điều kỳ diệu của c&ocirc;ng nghệ!</p>	600000.0	https://localhost:7071/coursemate-files/58f2dd1f-49f0-4d31-8617-2ce0d64d8b67.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
737b5551-e148-4e64-aa54-2e85f82a30ff	C# cơ bản	<p style="text-align: justify; line-height: 18.0pt; margin: 0in 2.4pt 12.0pt 2.4pt;">C# l&agrave; một ng&ocirc;n ngữ lập tr&igrave;nh đơn giản, hiện đại, mục đ&iacute;ch tổng qu&aacute;t, hướng đối tượng được ph&aacute;t triển bởi Microsoft b&ecirc;n trong phần khởi đầu .NET của họ, được ph&aacute;t triển chủ yếu bởi Anders Hejlsberg, một kiến tr&uacute;c sư phần mềm nổi tiếng với c&aacute;c sản phẩm Turbo Pascal, Delphi, J++, WFC. Kh&oacute;a học n&agrave;y sẽ cung cấp cho bạn kiến thức cơ bản về lập tr&igrave;nh C# qua c&aacute;c kh&aacute;i niệm từ cơ bản v&agrave; c&aacute;c b&agrave;i tập thực tế bằng ng&ocirc;n ngữ lập tr&igrave;nh C#.</p>\n<h3><strong>Đặc trưng cơ bản của ng&ocirc;n ngữ C#:</strong></h3>\n<ul>\n<li style="text-align: justify; line-height: 18pt;">L&agrave; một ng&ocirc;n ngữ&nbsp;thuần hướng đối tượng&nbsp;(hướng đối tượng l&agrave; g&igrave; sẽ được tr&igrave;nh b&agrave;y trong kh&oacute;a học C# Advance)</li>\n<li style="text-align: justify; line-height: 18pt;">L&agrave; ng&ocirc;n ngữ kh&aacute; đơn giản, chỉ c&oacute; khoảng 80 từ kh&oacute;a v&agrave; hơn mười kiểu dữ liệu được dựng sẵn.</li>\n<li style="text-align: justify; line-height: 18pt;">Cung cấp những đặc t&iacute;nh hướng th&agrave;nh phần (component-oriented) như l&agrave; Property, Event</li>\n<li style="text-align: justify; line-height: 18pt;">C# c&oacute; bộ&nbsp;Garbage Collector&nbsp;sẽ&nbsp;tự động thu gom v&ugrave;ng nhớ&nbsp;khi kh&ocirc;ng c&ograve;n sử dụng nữa.</li>\n</ul>\n<h3 style="text-align: justify; line-height: 18.0pt; margin: 0in 2.4pt 12.0pt 2.4pt;"><strong>Ứng dụng của C#</strong></h3>\n<ul>\n<li style="text-align: start; line-height: 18pt; box-sizing: border-box; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; widows: 2; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; word-spacing: 0px;"><strong>Ứng dụng tr&ecirc;n Windows:<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/A2_4a0918575fdb4a598759686cec0620ab.png" /><br /></strong>Với sự trợ gi&uacute;p của bộ khung .Net, &ldquo;C#&rdquo; được sử dụng để ph&aacute;t triển c&aacute;c ứng dụng dựa tr&ecirc;n c&aacute;c cửa sổ cho m&aacute;y t&iacute;nh để b&agrave;n. Nhiều ứng dụng Windows phổ biến như c&aacute;c c&ocirc;ng cụ Microsoft Office, Skype, Photoshop v&agrave; Visual Studio được ph&aacute;t triển bằng ng&ocirc;n ngữ n&agrave;y.</li>\n<li style="text-align: start; line-height: 18pt; box-sizing: border-box; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; widows: 2; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; word-spacing: 0px;"><strong>C&aacute;c th&agrave;nh phần v&agrave; điều khiển:<br /></strong>C&aacute;c th&agrave;nh phần v&agrave; điều khiển l&agrave; c&aacute;c thư viện c&oacute; thể được sử dụng để tạo ra một thứ dễ ph&acirc;n phối v&agrave; c&oacute; thể chia sẻ được. Thư viện GPS l&agrave; một v&iacute; dụ tuyệt vời cho một thư viện c&oacute; thể được một lập tr&igrave;nh vi&ecirc;n x&acirc;y dựng v&agrave; dễ d&agrave;ng ph&acirc;n phối cho c&aacute;c lập tr&igrave;nh vi&ecirc;n kh&aacute;c để sử dụng trong c&aacute;c ứng dụng của họ. N&oacute; cũng được sử dụng để x&acirc;y dựng c&aacute;c th&agrave;nh phần m&aacute;y chủ v&agrave; nhiều c&ocirc;ng việc kh&aacute;c nữa.</li>\n<li style="text-align: start; line-height: 18pt; box-sizing: border-box; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; widows: 2; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; word-spacing: 0px;"><strong>Ứng dụng Web:<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/A1_8a4efcbe8355487ebe053fa1a6313020.png" /><br /></strong>Với sự trợ gi&uacute;p của bộ khung .NET, C# c&oacute; khả năng tạo ra nhiều ứng dụng web bằng c&aacute;ch sử dụng asp.net. Đ&oacute; l&agrave; một ng&ocirc;n ngữ phổ biến kh&aacute;c m&agrave; ai ai c&oacute; thể học ngay lập tức khi muốn l&agrave;m cho ứng dụng web chạy trơn tru tr&ecirc;n một m&aacute;y chủ web. C&aacute;c ứng dụng Windows chạy tr&ecirc;n cả m&aacute;y chủ cũng như trong tr&igrave;nh duyệt của m&aacute;y kh&aacute;ch, t&ugrave;y thuộc v&agrave;o c&aacute;ch viết m&atilde;. Nếu C# được sử dụng dưới h&igrave;nh thức m&atilde; h&oacute;a ở backend, th&igrave; m&atilde; C# chạy tr&ecirc;n m&aacute;y chủ v&agrave; HTML frontend chạy trong tr&igrave;nh duyệt của m&aacute;y kh&aacute;ch.</li>\n</ul>\n<hr />\n<h3 style="text-align: justify; line-height: 18.0pt; margin: 0in 2.4pt 12.0pt 2.4pt;"><strong>Mục ti&ecirc;u của kh&oacute;a học.</strong></h3>\n<ul>\n<li>Viết th&agrave;nh thạo c&aacute;c chương tr&igrave;nh cơ bản bằng ng&ocirc;n ngữ C#.</li>\n<li>Hiểu r&otilde; c&aacute;ch kiểu dữ liệu của biến v&agrave; sử dụng n&oacute; một c&aacute;ch ph&ugrave; hợp.</li>\n<li>Sử dụng được c&aacute;c to&aacute;n tử trong C#.</li>\n<li>Hiểu r&otilde; bản chất một số c&aacute;c trong dữ lệnh cũng như c&aacute;c c&acirc;u lệnh trong C#:\n<ul>\n<li>Cấu tr&uacute;c mảng.</li>\n<li>Cấu tr&uacute;c chuỗi.</li>\n<li>C&acirc;u lệnh điều kiện.</li>\n<li>V&ograve;ng lặp.</li>\n</ul>\n</li>\n<li>T&igrave;m hiểu về class DateTime trong C#.</li>\n<li>Hiểu r&otilde; v&agrave; sử dụng cũng như viết được c&aacute;c h&agrave;m trong C#.</li>\n</ul>\n<hr />\n<h3 style="text-align: justify; line-height: 18.0pt; margin: 0in 2.4pt 12.0pt 2.4pt;"><strong>Lời kết: </strong></h3>\n<p style="text-align: justify; line-height: 18.0pt; margin: 0in 2.4pt 12.0pt 2.4pt;">Hướng tới mục đ&iacute;ch dạy lập tr&igrave;nh cho c&aacute;c đối tượng chưa biết, chưa t&igrave;m hiểu về lập tr&igrave;nh. Trong khu&ocirc;n khổ kh&oacute;a học n&agrave;y, ch&uacute;ng ta sẽ chỉ t&igrave;m hiểu kh&aacute;i niệm cơ bản nhất về lập tr&igrave;nh v&agrave; thực h&agrave;nh tr&ecirc;n ng&ocirc;n ngữ C#.</p>	0.0	https://localhost:7071/coursemate-files/e0a5b6bc-c25b-44b8-86dc-f06ef3744064.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
743dd717-48b2-45b1-b9c0-8ded60965ecb	Java cho người mới bắt đầu	<p class="first-token" data-sourcepos="1:1-1:147">Java l&agrave; một trong những ng&ocirc;n ngữ lập tr&igrave;nh phổ biến v&agrave; được ứng dụng rộng r&atilde;i nhất tr&ecirc;n thế giới, từ c&aacute;c ứng dụng di động đến hệ thống doanh nghiệp lớn. Với t&iacute;nh đa nền tảng v&agrave; cộng đồng hỗ trợ mạnh mẽ, Java l&agrave; lựa chọn l&yacute; tưởng cho những ai muốn x&acirc;y dựng sự nghiệp trong lĩnh vực ph&aacute;t triển phần mềm. Kh&oacute;a học Java cơ bản n&agrave;y được thiết kế đặc biệt để gi&uacute;p bạn l&agrave;m quen với ng&ocirc;n ngữ một c&aacute;ch dễ d&agrave;ng v&agrave; hiệu quả nhất.</p>\n<h2 data-sourcepos="3:1-3:26"><strong>Mục ti&ecirc;u của kh&oacute;a học:</strong></h2>\n<ul data-sourcepos="5:1-5:70">\n<li data-sourcepos="5:1-5:70">Gi&uacute;p bạn <strong>học Java từ con số 0</strong> một c&aacute;ch nhanh ch&oacute;ng v&agrave; dễ hiểu.</li>\n<li data-sourcepos="6:1-6:95">Trang bị cho bạn kiến thức v&agrave; kỹ năng cần thiết để <strong>viết c&aacute;c chương tr&igrave;nh Java đơn giản</strong>.</li>\n<li data-sourcepos="8:1-9:0">Tạo nền tảng vững chắc <strong>cho bạn để tự học v&agrave; ph&aacute;t triển c&aacute;c chương tr&igrave;nh Java phức tạp hơn</strong>.</li>\n</ul>\n<h2 data-sourcepos="10:1-10:23"><strong>Đối tượng học vi&ecirc;n:</strong></h2>\n<ul data-sourcepos="12:1-12:142">\n<li data-sourcepos="12:1-12:142">Kh&oacute;a học n&agrave;y d&agrave;nh cho những người <strong>mới bắt đầu ho&agrave;n to&agrave;n chưa c&oacute; kiến thức về lập tr&igrave;nh</strong>, hoặc những bạn <strong>mất căn bản muốn lấy lại kiến thức nền tảng lập tr&igrave;nh</strong>, cụ thể l&agrave; Java.</li>\n</ul>\n<h2 data-sourcepos="14:1-14:26"><strong>Phương ph&aacute;p giảng dạy:</strong></h2>\n<ul data-sourcepos="16:1-19:0">\n<li data-sourcepos="16:1-16:58">Kh&oacute;a học được kết hợp <strong>giữa l&yacute; thuyết v&agrave; thực h&agrave;nh</strong>.</li>\n<li data-sourcepos="17:1-17:136">Học vi&ecirc;n sẽ được học qua c&aacute;c <strong>video b&agrave;i giảng</strong>, <strong>b&agrave;i đọc l&yacute; thuyết</strong>, <strong>b&agrave;i tập thực h&agrave;nh</strong> v&agrave; <strong>b&agrave;i tập trắc nghiệm l&yacute; thuyết</strong>.</li>\n<li data-sourcepos="18:1-19:0">Học vi&ecirc;n sẽ được <strong>giải đ&aacute;p</strong> những thắc mắc trực tiếp qua phần b&igrave;nh luận.</li>\n</ul>\n<h2 data-sourcepos="20:1-20:38"><strong>Sau khi ho&agrave;n th&agrave;nh kh&oacute;a học, bạn sẽ c&oacute; thể:</strong></h2>\n<ul data-sourcepos="22:1-25:122">\n<li data-sourcepos="22:1-22:64">Hiểu r&otilde; về <strong>c&uacute; ph&aacute;p v&agrave; cấu tr&uacute;c cơ bản</strong> của ng&ocirc;n ngữ Java.</li>\n<li data-sourcepos="23:1-23:105">Sử dụng th&agrave;nh thạo c&aacute;c <strong>kiểu dữ liệu</strong>, <strong>biến</strong>, <strong>to&aacute;n tử</strong> v&agrave; <strong>c&acirc;u lệnh điều khiển</strong> trong Java.</li>\n<li data-sourcepos="24:1-24:78">Viết c&aacute;c <strong>chương tr&igrave;nh Java đơn giản</strong> để giải quyết c&aacute;c b&agrave;i to&aacute;n cơ bản.</li>\n<li data-sourcepos="25:1-25:122">C&oacute; <strong>nền tảng vững chắc</strong> để tiếp tục học c&aacute;c kh&oacute;a học Java n&acirc;ng cao v&agrave; ph&aacute;t triển sự nghiệp trong lĩnh vực lập tr&igrave;nh.</li>\n</ul>	720000.0	https://localhost:7071/coursemate-files/102e8f40-aa03-4834-81ef-6a735da57a4e.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
961ac01c-382c-4aa5-bae1-d1429f27f06a	Lập trình C++ nâng cao	<p>C++ l&agrave; một trong những ng&ocirc;n ngữ lập tr&igrave;nh mạnh mẽ v&agrave; linh hoạt nhất, được sử dụng rộng r&atilde;i trong c&aacute;c ứng dụng c&ocirc;ng nghiệp v&agrave; ph&aacute;t triển phần mềm cao cấp. Kh&oacute;a học C++ n&acirc;ng cao n&agrave;y được thiết kế để gi&uacute;p c&aacute;c lập tr&igrave;nh vi&ecirc;n đ&atilde; c&oacute; kiến thức cơ bản về C++ tiếp tục ph&aacute;t triển v&agrave; nắm vững c&aacute;c kỹ thuật n&acirc;ng cao. Kh&oacute;a học sẽ đi s&acirc;u v&agrave;o c&aacute;c chủ đề phức tạp hơn, gi&uacute;p bạn viết m&atilde; hiệu quả, tối ưu h&oacute;a v&agrave; &aacute;p dụng trong c&aacute;c dự &aacute;n thực tế.</p>\n<h1>Mục ti&ecirc;u của kh&oacute;a học</h1>\n<ul>\n<li><strong>Nắm vững c&aacute;c t&iacute;nh năng n&acirc;ng cao của C++:</strong> Hiểu r&otilde; v&agrave; &aacute;p dụng c&aacute;c kỹ thuật như quản l&yacute; bộ nhớ, cấp ph&aacute;t động, con trỏ v&agrave; xử l&yacute; ngoại lệ.</li>\n<li><strong>Thực h&agrave;nh v&agrave; n&acirc;ng cao khả năng lập tr&igrave;nh:</strong> &Aacute;p dụng kiến thức học được v&agrave;o c&aacute;c b&agrave;i to&aacute;n, n&acirc;ng cao kỹ năng lập tr&igrave;nh th&ocirc;ng qua việc thực h&agrave;nh li&ecirc;n tục.</li>\n<li><strong>Tăng cường khả năng giải quyết vấn đề:</strong> Ph&aacute;t triển khả năng tư duy logic v&agrave; giải quyết c&aacute;c vấn đề phức tạp trong lập tr&igrave;nh.</li>\n<li><strong>Sử dụng th&agrave;nh thạo c&aacute;c thư viện ti&ecirc;u chuẩn:</strong> Hiểu v&agrave; sử dụng c&aacute;c thư viện ti&ecirc;u chuẩn của C++ như STL v&agrave; c&aacute;c thư viện phổ biến kh&aacute;c.</li>\n</ul>\n<h1>Đối tượng học vi&ecirc;n</h1>\n<p>Kh&oacute;a học n&agrave;y d&agrave;nh cho những học vi&ecirc;n đ&atilde; ho&agrave;n th&agrave;nh kh&oacute;a học C++ cơ bản hoặc c&oacute; kiến thức tương đương. Những ai mong muốn n&acirc;ng cao kỹ năng lập tr&igrave;nh của m&igrave;nh, ứng dụng C++ v&agrave;o c&aacute;c dự &aacute;n thực tế v&agrave; muốn hiểu s&acirc;u hơn về c&aacute;c kh&iacute;a cạnh phức tạp của ng&ocirc;n ngữ n&agrave;y sẽ t&igrave;m thấy nhiều gi&aacute; trị từ kh&oacute;a học.</p>\n<h1>Phương ph&aacute;p giảng dạy</h1>\n<ul>\n<li><strong>Kết hợp giữa l&yacute; thuyết v&agrave; thực h&agrave;nh:</strong> Kh&oacute;a học bao gồm c&aacute;c b&agrave;i giảng l&yacute; thuyết, b&agrave;i tập thực h&agrave;nh v&agrave; c&aacute;c dự &aacute;n thực tế.</li>\n<li><strong>Học qua c&aacute;c video b&agrave;i giảng:</strong> Học vi&ecirc;n sẽ tiếp cận c&aacute;c kiến thức th&ocirc;ng qua video b&agrave;i giảng chi tiết v&agrave; dễ hiểu.</li>\n<li><strong>B&agrave;i tập thực h&agrave;nh v&agrave; trắc nghiệm:</strong> Để củng cố kiến thức, học vi&ecirc;n sẽ l&agrave;m c&aacute;c b&agrave;i tập thực h&agrave;nh v&agrave; trắc nghiệm l&yacute; thuyết.</li>\n<li><strong>Hỗ trợ v&agrave; trao đổi:</strong> Học vi&ecirc;n c&oacute; thể trao đổi, hỏi đ&aacute;p những thắc mắc với giảng vi&ecirc;n v&agrave; c&aacute;c bạn c&ugrave;ng kh&oacute;a th&ocirc;ng qua diễn đ&agrave;n.</li>\n</ul>\n<h1>Kỹ năng đạt được</h1>\n<ul>\n<li><strong>Quản l&yacute; bộ nhớ hiệu quả:</strong> Sử dụng c&aacute;c kỹ thuật quản l&yacute; bộ nhớ động, tr&aacute;nh r&ograve; rỉ bộ nhớ v&agrave; tối ưu h&oacute;a hiệu suất chương tr&igrave;nh.</li>\n<li><strong>Xử l&yacute; ngoại lệ:</strong> Nắm vững c&aacute;ch xử l&yacute; ngoại lệ trong C++ để viết m&atilde; an to&agrave;n v&agrave; dễ bảo tr&igrave;.</li>\n<li><strong>Sử dụng thư viện ti&ecirc;u chuẩn:</strong> Th&agrave;nh thạo việc sử dụng c&aacute;c thư viện ti&ecirc;u chuẩn v&agrave; mở rộng của C++ để tối ưu h&oacute;a qu&aacute; tr&igrave;nh ph&aacute;t triển phần mềm.</li>\n<li><strong>C&aacute;c kĩ thuật n&acirc;ng cao:&nbsp;</strong>stack,queue,list,set... ứng dụng v&agrave;o giải b&agrave;i tập.</li>\n</ul>\n<p>Kh&oacute;a học C++ n&acirc;ng cao n&agrave;y sẽ gi&uacute;p bạn n&acirc;ng cao kỹ năng lập tr&igrave;nh, sẵn s&agrave;ng đối mặt với những thử th&aacute;ch lớn trong ng&agrave;nh c&ocirc;ng nghệ th&ocirc;ng tin v&agrave; đạt được những th&agrave;nh tựu mới trong sự nghiệp lập tr&igrave;nh của m&igrave;nh. H&atilde;y đăng k&yacute; ngay để bắt đầu h&agrave;nh tr&igrave;nh học tập v&agrave; ph&aacute;t triển kỹ năng của bạn!</p>	900000.0	https://localhost:7071/coursemate-files/37b754c0-6f0d-463f-831f-df6b38f9d7dc.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
97f41add-6aa0-4c20-8ad1-aba7ce768046	SQL cho người mới bắt đầu	<p>Kh&oacute;a học "<strong>SQL cho người mới bắt đầu</strong>" được thiết kế đặc biệt d&agrave;nh cho c&aacute;c em học sinh từ lớp 6 trở l&ecirc;n, nhằm giới thiệu v&agrave; hướng dẫn c&aacute;c em những kiến thức cơ bản về SQL (Structured Query Language) - ng&ocirc;n ngữ truy vấn cấu tr&uacute;c d&ugrave;ng để quản l&yacute; v&agrave; thao t&aacute;c với cơ sở dữ liệu. Th&ocirc;ng qua kh&oacute;a học n&agrave;y, c&aacute;c em sẽ nắm bắt được c&aacute;ch tổ chức, truy vấn v&agrave; xử l&yacute; dữ liệu một c&aacute;ch hiệu quả v&agrave; th&uacute; vị.</p>\n<p>Với phương ph&aacute;p giảng dạy th&acirc;n thiện trực quan:</p>\n<ul>\n<li><strong>Học từ thực tế:</strong> C&aacute;c b&agrave;i học được thiết kế gần gũi với cuộc sống thực tiễn, gi&uacute;p c&aacute;c em hứng th&uacute; v&agrave; dễ d&agrave;ng tiếp thu kiến thức.</li>\n<li><strong>Thực h&agrave;nh trực tiếp:</strong> Mỗi buổi học đều c&oacute; b&agrave;i thực h&agrave;nh ngay tr&ecirc;n hệ thống, gi&uacute;p c&aacute;c em l&agrave;m quen với m&ocirc;i trường l&agrave;m việc thực tế của SQL.</li>\n<li><strong>Giảng vi&ecirc;n tận t&acirc;m:</strong> Đội ngũ giảng vi&ecirc;n gi&agrave;u kinh nghiệm, y&ecirc;u trẻ v&agrave; hiểu biết s&acirc;u rộng về SQL sẽ lu&ocirc;n sẵn s&agrave;ng hỗ trợ c&aacute;c em trong suốt qu&aacute; tr&igrave;nh học.</li>\n</ul>\n<p>Kh&oacute;a học sẽ đem lại lợi &iacute;ch to lớn:</p>\n<ul>\n<li><strong>Ph&aacute;t triển tư duy logic:</strong> Học SQL gi&uacute;p c&aacute;c em r&egrave;n luyện khả năng tư duy logic, giải quyết vấn đề một c&aacute;ch hệ thống v&agrave; c&oacute; tổ chức.</li>\n<li><strong>Kỹ năng tin học:</strong> Trang bị cho c&aacute;c em một kỹ năng quan trọng v&agrave; hữu &iacute;ch trong thời đại c&ocirc;ng nghệ hiện nay.</li>\n<li><strong>Chuẩn bị cho tương lai:</strong> SQL l&agrave; một ng&ocirc;n ngữ quan trọng trong lĩnh vực c&ocirc;ng nghệ th&ocirc;ng tin v&agrave; quản trị dữ liệu, gi&uacute;p c&aacute;c em c&oacute; nền tảng vững chắc cho c&aacute;c ng&agrave;nh nghề tương lai</li>\n</ul>\n<p>Ch&uacute;ng t&ocirc;i mong muốn được ch&agrave;o đ&oacute;n c&aacute;c em học sinh trong kh&oacute;a học "<strong>SQL cho người mới bắt đầu</strong>" v&agrave; c&ugrave;ng nhau kh&aacute;m ph&aacute; thế giới th&uacute; vị của cơ sở dữ liệu!</p>	720000.0	https://localhost:7071/coursemate-files/36662c9d-b23d-4113-86de-5fde7eb38502.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
b154a3c3-6727-4332-a637-07eb142657c8	Trọn bộ kiến thức Scratch cho học sinh	<p data-sourcepos="1:1-1:56"><span style="font-size: 18pt;"><strong>COMBO KH&Oacute;A HỌC SCRATCH S&Aacute;NG TẠO - TỪ CƠ BẢN ĐẾN N&Acirc;NG CAO</strong></span></p>\n<p data-sourcepos="3:1-3:295">Bạn muốn khơi dậy niềm đam m&ecirc; lập tr&igrave;nh cho con trẻ một c&aacute;ch th&uacute; vị v&agrave; trực quan? Bạn đang t&igrave;m kiếm một lộ tr&igrave;nh học Scratch b&agrave;i bản từ cơ bản đến n&acirc;ng cao? Combo kh&oacute;a học Scratch s&aacute;ng tạo của ch&uacute;ng t&ocirc;i sẽ l&agrave; người bạn đồng h&agrave;nh tuyệt vời tr&ecirc;n h&agrave;nh tr&igrave;nh kh&aacute;m ph&aacute; thế giới lập tr&igrave;nh đầy m&agrave;u sắc.</p>\n<p data-sourcepos="5:2-5:38"><strong>1. Game "ăn liền" c&ugrave;ng Scratch</strong></p>\n<ul>\n<li><strong>L&agrave;m quen với giao diện Scratch:</strong> T&igrave;m hiểu về c&aacute;c th&agrave;nh phần tr&ecirc;n m&agrave;n h&igrave;nh, c&aacute;ch sử dụng c&aacute;c c&ocirc;ng cụ v&agrave; l&agrave;m việc với c&aacute;c khối lệnh.</li>\n<li><strong>C&aacute;c khối lệnh cơ bản:&nbsp;</strong>C&aacute;c khối di chuyển hiển thị v&agrave; điều khiển</li>\n</ul>\n<p data-sourcepos="12:2-12:25"><strong>2. Scratch n&acirc;ng cao</strong></p>\n<ul>\n<li>Biến số v&agrave; to&aacute;n tử: Sử dụng to&aacute;n học để thực hiện c&aacute;c ph&eacute;p to&aacute;n trong chương tr&igrave;nh</li>\n<li>Khối lệnh t&ugrave;y chỉnh: Tạo ra c&aacute;c khối lệnh ri&ecirc;ng t&aacute;i sử dụng</li>\n<li>X&acirc;y dựng game ri&ecirc;ng cho bản th&acirc;n: Học về vẽ h&igrave;nh, &acirc;m thanh,.. kết hợp để trở th&agrave;nh một sản phẩm ho&agrave;n chỉnh</li>\n</ul>\n<p><strong>3.&nbsp;Lợi &iacute;ch khi tham gia Combo</strong></p>\n<ul>\n<li>Tiết kiệm chi ph&iacute; so với việc đăng k&yacute; từng kh&oacute;a ri&ecirc;ng lẻ.</li>\n<li>Lộ tr&igrave;nh học tập r&otilde; r&agrave;ng, b&agrave;i bản, từ cơ bản đến n&acirc;ng cao.</li>\n<li>M&ocirc;i trường học tập tương t&aacute;c, khuyến kh&iacute;ch sự s&aacute;ng tạo.</li>\n<li>Gi&uacute;p trẻ ph&aacute;t triển tư duy logic, khả năng giải quyết vấn đề v&agrave; kỹ năng l&agrave;m việc nh&oacute;m.</li>\n<li>Tạo nền tảng vững chắc cho việc học c&aacute;c ng&ocirc;n ngữ lập tr&igrave;nh kh&aacute;c trong tương lai.</li>\n</ul>	960000.0	https://localhost:7071/coursemate-files/6413a84b-3132-4ae5-93f5-854dccc93398.jpg	t	5ac3586c-394f-45c2-b000-9332d118b498	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
b5502f31-c785-439c-bd18-c15b25dab111	Hệ thống khóa học SQL (Cơ bản & Nâng cao)	<p data-sourcepos="14:1-14:59"><span style="font-size: 18pt;"><strong>Combo Kh&oacute;a học SQL Cơ bản v&agrave; N&acirc;ng cao bao gồm những g&igrave;?</strong></span></p>\n<p data-sourcepos="16:1-16:138">Combo n&agrave;y được thiết kế để cung cấp cho bạn một lộ tr&igrave;nh học tập to&agrave;n diện, từ những kh&aacute;i niệm cơ bản đến c&aacute;c kỹ thuật n&acirc;ng cao trong SQL.</p>\n<p data-sourcepos="18:1-18:27"><strong>1. Kh&oacute;a học SQL Cơ bản:</strong></p>\n<ul>\n<li><strong>Giới thiệu về cơ sở dữ liệu v&agrave; SQL</strong>: Kh&aacute;i niệm cơ bản về cơ sở dữ liệu quan hệ, c&aacute;c loại cơ sở dữ liệu, v&agrave; vai tr&ograve; của SQL.</li>\n<li><strong>C&aacute;c lệnh SQL cơ bản</strong>: SELECT, INSERT, UPDATE,...</li>\n<li><strong>C&aacute;c mệnh đề quan trọng</strong>: WHERE, ORDER BY,...</li>\n</ul>\n<p><strong>2. Kh&oacute;a học SQL N&acirc;ng cao:</strong></p>\n<ul>\n<li><strong>C&aacute;c h&agrave;m quan trọng</strong>: SUBSTRING, DATE, MONTH,...</li>\n<li><strong>Truy vấn con</strong>: Sử dụng truy vấn b&ecirc;n trong một truy vấn kh&aacute;c.</li>\n<li><strong>View v&agrave; bảng tạm: </strong>Tạo c&aacute;c đối tượng ảo để đơn giản h&oacute;a truy vấn phức tạp.</li>\n</ul>\n<p data-sourcepos="55:1-55:31"><strong>Lợi &iacute;ch khi tham gia Combo:</strong></p>\n<ul>\n<li><strong>Tiết kiệm chi ph&iacute;:</strong> So với việc đăng k&yacute; từng kh&oacute;a ri&ecirc;ng lẻ.</li>\n<li><strong>Lộ tr&igrave;nh học tập li&ecirc;n tục:</strong> Được thiết kế logic, gi&uacute;p bạn nắm vững kiến thức từ cơ bản đến n&acirc;ng cao một c&aacute;ch hệ thống.</li>\n<li><strong>Thực h&agrave;nh chuy&ecirc;n s&acirc;u:</strong> C&aacute;c b&agrave;i tập v&agrave; dự &aacute;n thực tế gi&uacute;p bạn &aacute;p dụng kiến thức v&agrave;o thực tiễn.</li>\n</ul>	1620000.0	https://localhost:7071/coursemate-files/fc61f9c7-2740-4ed1-89e3-b7b5ba868177.jpg	t	5ac3586c-394f-45c2-b000-9332d118b498	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
cb8d4b28-4c56-431f-b29a-e1f497c10175	Thành thạo C++ từ cơ bản đến nâng cao	<p data-sourcepos="1:1-2:138"><span style="font-size: 18pt;"><strong>Combo Kh&oacute;a học C++ Cơ bản v&agrave; N&acirc;ng cao bao gồm những g&igrave;? </strong></span></p>\n<p data-sourcepos="1:1-2:138">Combo n&agrave;y được thiết kế để cung cấp cho bạn một lộ tr&igrave;nh học tập to&agrave;n diện, từ những kh&aacute;i niệm cơ bản đến c&aacute;c kỹ thuật n&acirc;ng cao trong C++.</p>\n<p><strong>1. Kh&oacute;a học C++ Cơ bản:</strong></p>\n<ul>\n<li data-sourcepos="5:1-8:25"><strong>Giới thiệu về lập tr&igrave;nh v&agrave; C++</strong>: Kh&aacute;i niệm cơ bản về thuật to&aacute;n,...</li>\n<li data-sourcepos="5:1-8:25"><strong>Kiểu dữ liệu, biến v&agrave; to&aacute;n tử</strong>: C&aacute;c kiểu dữ liệu cơ bản (int, float,...),...</li>\n<li data-sourcepos="5:1-8:25"><strong>Cấu tr&uacute;c điều khiển</strong>: C&acirc;u lệnh điều kiện (if, else,...),...</li>\n</ul>\n<p data-sourcepos="5:1-8:25"><strong>2. Kh&oacute;a học C++ N&acirc;ng cao:</strong></p>\n<ul>\n<li data-sourcepos="10:1-13:27">C&aacute;c h&agrave;m quan trọng như to&aacute;n học, l&agrave;m tr&ograve;n,...</li>\n<li data-sourcepos="10:1-13:27">Con trỏ: sử dụng con trỏ để thao t&aacute;c với dữ liệu</li>\n<li data-sourcepos="10:1-13:27">Template: X&acirc;y dựng c&aacute;c h&agrave;m v&agrave; lớp tổng qu&aacute;t...</li>\n</ul>\n<p data-sourcepos="10:1-13:27"><strong>3. Lợi &iacute;ch khi tham gia Combo:</strong></p>\n<ul>\n<li data-sourcepos="15:1-18:35">Tiết kiệm chi ph&iacute;: So với việc đăng k&yacute; từng kh&oacute;a ri&ecirc;ng lẻ.</li>\n<li data-sourcepos="15:1-18:35">Lộ tr&igrave;nh học tập li&ecirc;n tục: Được thiết kế logic,...</li>\n<li data-sourcepos="15:1-18:35">Thực h&agrave;nh chuy&ecirc;n s&acirc;u: C&aacute;c b&agrave;i tập v&agrave; dự &aacute;n thực tế... viết t&oacute;m tắt ngắn gọn trong một c&acirc;u</li>\n</ul>	1620000.0	https://localhost:7071/coursemate-files/17dccc01-2c38-43c6-86c5-0836fea35adb.jpg	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
ce685ee8-dca7-4304-befd-139a5700bc68	Thư viện chuẩn C++	<h3 data-start="206" data-end="305">L&agrave;m chủ Standard Template Library (STL) trong C++ &ndash; Tối ưu ho&aacute; hiệu suất v&agrave; t&aacute;i sử dụng m&atilde; nguồn</h3>\n<p class="" data-start="307" data-end="619">Kh&oacute;a học n&agrave;y cung cấp kiến thức to&agrave;n diện về <strong data-start="352" data-end="387">STL (Standard Template Library)</strong> &ndash; một trong những c&ocirc;ng cụ mạnh mẽ v&agrave; thiết thực nhất trong lập tr&igrave;nh C++. Bạn sẽ được trang bị kỹ năng sử dụng c&aacute;c <strong data-start="503" data-end="530">cấu tr&uacute;c dữ liệu c&oacute; sẵn</strong>, <strong data-start="532" data-end="553">thuật to&aacute;n tối ưu</strong>, v&agrave; c&aacute;ch <strong data-start="563" data-end="587">mở rộng thư viện STL</strong> để ph&ugrave; hợp với y&ecirc;u cầu thực tế.</p>\n<h3 data-start="626" data-end="673">Sau khi ho&agrave;n th&agrave;nh kh&oacute;a học, bạn sẽ c&oacute; thể:</h3>\n<ul data-start="675" data-end="1168">\n<li class="" data-start="675" data-end="842">\n<p class="" data-start="677" data-end="842">✅ <strong data-start="679" data-end="730">Sử dụng th&agrave;nh thạo c&aacute;c cấu tr&uacute;c dữ liệu của STL</strong> như <code data-start="735" data-end="743">vector</code>, <code data-start="745" data-end="751">list</code>, <code data-start="753" data-end="758">map</code>, <code data-start="760" data-end="765">set</code>, v&agrave; c&aacute;c iterator để xử l&yacute; v&agrave; lưu trữ dữ liệu một c&aacute;ch linh hoạt v&agrave; hiệu quả.</p>\n</li>\n<li class="" data-start="844" data-end="1011">\n<p class="" data-start="846" data-end="1011">✅ <strong data-start="848" data-end="891">&Aacute;p dụng c&aacute;c thuật to&aacute;n c&oacute; sẵn trong STL</strong> như <code data-start="896" data-end="902">sort</code>, <code data-start="904" data-end="910">find</code>, <code data-start="912" data-end="919">count</code>, <code data-start="921" data-end="933">accumulate</code>, <code data-start="935" data-end="946">transform</code>... nhằm tăng tốc độ ph&aacute;t triển phần mềm v&agrave; tối ưu h&oacute;a hiệu suất.</p>\n</li>\n<li class="" data-start="1013" data-end="1168">\n<p class="" data-start="1015" data-end="1168">✅ <strong data-start="1017" data-end="1047">Tự thiết kế v&agrave; mở rộng STL</strong> bằng c&aacute;ch tạo c&aacute;c lớp v&agrave; thuật to&aacute;n t&ugrave;y chỉnh, t&iacute;ch hợp h&agrave;i h&ograve;a với hệ sinh th&aacute;i STL để giải quyết c&aacute;c b&agrave;i to&aacute;n đặc th&ugrave;.</p>\n</li>\n</ul>\n<h3 class="" data-start="1175" data-end="1197">Đối tượng ph&ugrave; hợp:</h3>\n<ul data-start="1199" data-end="1461">\n<li class="" data-start="1199" data-end="1290">\n<p class="" data-start="1201" data-end="1290">Lập tr&igrave;nh vi&ecirc;n C++ từ mức trung cấp trở l&ecirc;n muốn tối ưu h&oacute;a khả năng ph&aacute;t triển phần mềm.</p>\n</li>\n<li class="" data-start="1291" data-end="1384">\n<p class="" data-start="1293" data-end="1384">Người chuẩn bị tham gia c&aacute;c cuộc thi lập tr&igrave;nh hoặc phỏng vấn kỹ thuật y&ecirc;u cầu sử dụng STL.</p>\n</li>\n<li class="" data-start="1385" data-end="1461">\n<p class="" data-start="1387" data-end="1461">Sinh vi&ecirc;n CNTT cần củng cố v&agrave; n&acirc;ng cao kỹ năng sử dụng thư viện chuẩn C++.</p>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/220486a3-e4a2-4187-a07c-ec759f3ee7da.png	t	087499f3-3cc2-4d25-8ad5-8c63c6b74c44	019ddd8c-f5b5-756c-b9a4-759ab4ffa4cf	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
d1839060-39f5-4877-a610-7036e35dbcaa	Python cho người mới bắt đầu	<p><span style="font-size: 18pt; color: #304090;"><strong>Ng&ocirc;n ngữ lập tr&igrave;nh "B&Iacute; K&Iacute;P" vươn m&igrave;nh trong thời đại kỷ nguy&ecirc;n số</strong></span></p>\n<p style="text-align: justify;"><span style="color: #111928;">Sự b&ugrave;ng nổ của c&ocirc;ng nghệ Robot, tr&iacute; nh&acirc;n tạo Al dẫn đến sự thay đổi trong c&aacute;c lĩnh vực ng&agrave;nh nghề. CNTT trở th&agrave;nh lựa chọn số 1 gi&uacute;p con người kiểm so&aacute;t v&agrave; ph&aacute;t triển c&aacute;c c&ocirc;ng nghệ đỉnh cao. Để đ&aacute;p ứng được nhu cầu ph&aacute;t triển x&atilde; hội, Codelearn x&acirc;y dựng hệ thống học lập tr&igrave;nh trực tuyến nhằm gi&uacute;p c&aacute;c bạn trẻ &amp; người mới bắt đầu dễ d&agrave;ng tiếp cận với m&ocirc;n học, khơi dậy đam m&ecirc; c&ocirc;ng nghệ.</span></p>\n<p style="text-align: justify;">&nbsp;</p>\n<p><span style="font-size: 24pt; color: #250989;"><strong><img style="display: block; margin-left: auto; margin-right: auto;" src="https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/BieuDo_70a10bfe0e77473b85274f3c0e6353ce.png" width="592" height="322" /><br /></strong></span></p>\n<p style="text-align: center;">Độ phổ biến của c&aacute;c ng&ocirc;n ngữ lập tr&igrave;nh</p>\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="blob:https://codelearn.io/d6ccb77e-80bb-42c0-9747-98309e5bcfa9" alt="" /></p>\n<p style="text-align: justify;"><img style="display: block; margin-left: auto; margin-right: auto;" src="blob:https://codelearn.io/d6ccb77e-80bb-42c0-9747-98309e5bcfa9" alt="" /></p>\n<p style="text-align: justify;"><span style="font-size: 18pt; color: #304090;"><strong>L&yacute; do học sinh &amp; người mới bắt đầu n&ecirc;n học Python?</strong></span></p>\n<p><span style="color: #506cf0; font-size: 16pt;"><strong>Ng&ocirc;n ngữ lập tr&igrave;nh dễ học</strong></span></p>\n<p><span style="color: #111928;">Python được đ&aacute;nh gi&aacute; l&agrave; ng&ocirc;n ngữ lập tr&igrave;nh dễ học nhất hiện nay, c&uacute; ph&aacute;p đơn giản v&agrave; gần gũi với ng&ocirc;n ngữ tự nhi&ecirc;n.</span></p>\n<p><span style="color: #111928;">Đặc biệt, m&atilde; lệnh của python ngắn gọn, dễ đọc v&agrave; dễ ghi nhớ hơn. So với code Java, code Python ngắn hơn tới 3 - 5 lần, thậm ch&iacute; l&agrave; 5 - 10 lần so với code C++.</span></p>\n<p><span style="font-size: 16pt; color: #506cf0;"><strong>Ứng dụng rộng r&atilde;i v&agrave; linh hoạt</strong></span></p>\n<p><span style="color: #111928;">Python trở th&agrave;nh ng&ocirc;n ngữ lập tr&igrave;nh số 1 hiện tại với sự ứng dụng rộng r&atilde;i trong c&aacute;ch lĩnh vực:</span></p>\n<ul>\n<li><span style="color: #111928;">Tr&iacute; tuệ nh&acirc;n tạo (Al) &amp; M&aacute;y học (ML)</span></li>\n<li><span style="color: #111928;">Ph&acirc;n t&iacute;ch dữ liệu</span></li>\n<li><span style="color: #111928;">Lập tr&igrave;nh web</span></li>\n<li><span style="color: #111928;">Ph&aacute;t triển game</span></li>\n</ul>\n<p><span style="font-size: 16pt; color: #506cf0;"><strong>Giải ph&aacute;p tốt nhất cho mọi vấn đề</strong></span></p>\n<p><span style="color: #111928;">Python c&oacute; một thư viện ti&ecirc;u chuấn lớn, chứa nhiều d&ograve;ng m&atilde; c&oacute; thể t&aacute;i sử dụng cho hầu hết mọi t&aacute;c vụ. Nhờ đ&oacute;, c&aacute;c nh&agrave; ph&aacute;t triển sẽ kh&ocirc;ng cần phải viết mă từ đầu.</span></p>\n<p><span style="color: #506cf0; font-size: 16pt;"><strong>Cộng đồng mạnh mẽ</strong></span></p>\n<p>Cộng đồng Python nhiệt t&igrave;nh với nhiều c&ocirc;ng cụ hỗ trợ, s&atilde;̃n s&agrave;ng gi&uacute;p c&aacute;c em học sinh &amp; người mới bắt đầu th&aacute;o gỡ thắc mắc trong qu&aacute; tr&igrave;nh tiếp cận, học tập v&agrave; thực h&agrave;nh.</p>	722000.0	https://localhost:7071/coursemate-files/107349db-edd5-4da5-b785-5d991b0dfeb3.png	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
d1c12cca-e6b1-40a0-b899-d19e62f3fa84	HTML & CSS cho người mới bắt đầu	<h3>Kh&oacute;a Học HTML &amp; CSS &ndash; Tạo Nền Tảng Vững Chắc Cho Thiết Kế Web</h3>\n<p data-start="165" data-end="348"><span data-teams="true">Kh&oacute;a học n&agrave;y d&agrave;nh cho người mới bắt đầu, gi&uacute;p bạn từng bước đạt đến tr&igrave;nh độ trung cấp, đồng thời trang bị kiến thức nền tảng c&ugrave;ng kỹ năng thực h&agrave;nh cần thiết để x&acirc;y dựng v&agrave; thiết kế c&aacute;c trang web chuy&ecirc;n nghiệp.</span></p>\n<h3 data-start="350" data-end="444"><strong data-start="354" data-end="442">Ch&agrave;o mừng bạn đến với kh&oacute;a học HTML &amp; CSS &ndash; nơi bạn l&agrave;m chủ thiết kế web!</strong></h3>\n<p data-start="446" data-end="711">Trong thời đại số, một website chuy&ecirc;n nghiệp kh&ocirc;ng chỉ l&agrave; bộ mặt của doanh nghiệp m&agrave; c&ograve;n l&agrave; c&ocirc;ng cụ mạnh mẽ để kết nối với thế giới. Việc nắm vững HTML &amp; CSS gi&uacute;p bạn kiểm so&aacute;t giao diện trang web, tối ưu trải nghiệm người d&ugrave;ng v&agrave; tạo n&ecirc;n những thiết kế ấn tượng.</p>\n<h3 data-start="446" data-end="711">Tại sao n&ecirc;n học HTML &amp; CSS?</h3>\n<ul>\n<li><strong data-start="754" data-end="778">Kiến thức to&agrave;n diện:</strong> Từ những kh&aacute;i niệm cơ bản đến kỹ năng thực tế trong thiết kế v&agrave; quản l&yacute; giao diện web.</li>\n<li><strong data-start="872" data-end="895">Cơ hội nghề nghiệp:</strong> Kỹ năng thiết kế web gi&uacute;p bạn mở rộng cơ hội l&agrave;m việc trong lĩnh vực lập tr&igrave;nh, thiết kế giao diện v&agrave; ph&aacute;t triển sản phẩm số.</li>\n<li><strong data-start="1028" data-end="1050">Tiết kiệm chi ph&iacute;:</strong> Tự thiết kế v&agrave; chỉnh sửa website của m&igrave;nh m&agrave; kh&ocirc;ng cần thu&ecirc; lập tr&igrave;nh vi&ecirc;n.</li>\n<li><strong data-start="1133" data-end="1157">Khơi nguồn s&aacute;ng tạo:</strong> Kiến thức về HTML &amp; CSS gi&uacute;p bạn thiết kế giao diện chuy&ecirc;n nghiệp, s&aacute;ng tạo v&agrave; tối ưu trải nghiệm người d&ugrave;ng.</li>\n</ul>\n<h3>Ai n&ecirc;n tham gia kh&oacute;a học n&agrave;y?</h3>\n<ul>\n<li><strong data-start="1317" data-end="1339">Người mới bắt đầu:</strong> Kh&ocirc;ng y&ecirc;u cầu kiến thức trước đ&oacute;, kh&oacute;a học sẽ hướng dẫn từ những bước cơ bản nhất.</li>\n<li><strong data-start="1430" data-end="1449">Lập tr&igrave;nh vi&ecirc;n:</strong> Mở rộng hiểu biết về HTML &amp; CSS để tối ưu giao diện v&agrave; hiệu suất trang web.</li>\n<li><strong data-start="1532" data-end="1560">Nh&agrave; thiết kế &amp; Marketer:</strong> Học c&aacute;ch chỉnh sửa, tối ưu h&oacute;a nội dung v&agrave; thiết kế web hiệu quả.</li>\n<li><strong data-start="1633" data-end="1657">Người y&ecirc;u c&ocirc;ng nghệ:</strong> Chuyển hướng sang lĩnh vực thiết kế web v&agrave; quản l&yacute; nội dung số.</li>\n</ul>\n<h3>Điều g&igrave; l&agrave;m kh&oacute;a học n&agrave;y đặc biệt?</h3>\n<ul>\n<li data-start="2496" data-end="2592"><strong data-start="2499" data-end="2521">Học qua thực h&agrave;nh:</strong> Nhiều b&agrave;i tập, dự &aacute;n thực tế gi&uacute;p bạn &aacute;p dụng ngay kiến thức đ&atilde; học.</li>\n<li data-start="2496" data-end="2592"><strong data-start="2597" data-end="2634">Hỗ trợ từ giảng vi&ecirc;n &amp; cộng đồng:</strong> Kết nối với những người học c&ugrave;ng ch&iacute; hướng v&agrave; nhận phản hồi từ chuy&ecirc;n gia.</li>\n<li data-start="2496" data-end="2592"><strong data-start="2716" data-end="2738">Nội dung cập nhật:</strong> Kiến thức li&ecirc;n tục được l&agrave;m mới để ph&ugrave; hợp với xu hướng ph&aacute;t triển web hiện đại.</li>\n</ul>\n<p>Bắt đầu ngay h&ocirc;m nay v&agrave; l&agrave;m chủ kỹ năng thiết kế web với HTML &amp; CSS! <em><strong>Đăng k&yacute; ngay!</strong></em></p>	720000.0	https://localhost:7071/coursemate-files/9513d3dc-9467-4c02-af27-fc0977575f03.jpg	t	01ebd503-5522-4871-81a4-ec12bd80cdf3	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
e79d99e5-6325-4f50-833d-ee7de5bc43c1	Ứng dụng AI trong công việc	<h3>Giới thiệu chung</h3>\n<p>Kh&oacute;a học<strong> <em>Ứng dụng AI trong c&ocirc;ng việc</em> </strong>cung cấp cho người học những kiến thức v&agrave; kỹ năng cơ bản về tr&iacute; tuệ nh&acirc;n tạo (AI), từ đ&oacute; khai th&aacute;c AI để n&acirc;ng cao hiệu quả v&agrave; tối ưu h&oacute;a quy tr&igrave;nh l&agrave;m việc. AI đang thay đổi c&aacute;ch ch&uacute;ng ta l&agrave;m việc, gi&uacute;p tự động h&oacute;a c&aacute;c nhiệm vụ thường ng&agrave;y, hỗ trợ ra quyết định dựa tr&ecirc;n dữ liệu v&agrave; mang lại c&aacute;c c&ocirc;ng cụ mạnh mẽ để cải thiện năng suất v&agrave; chất lượng c&ocirc;ng việc.</p>\n<p>Kh&oacute;a học sẽ gi&uacute;p bạn hiểu được tiềm năng ứng dụng của AI trong nhiều lĩnh vực, từ quản l&yacute; c&ocirc;ng việc h&agrave;ng ng&agrave;y, ph&acirc;n t&iacute;ch dữ liệu, đến s&aacute;ng tạo nội dung v&agrave; ra quyết định chiến lược.</p>\n<h3>Mục ti&ecirc;u kh&oacute;a học</h3>\n<ul>\n<li>Giới thiệu c&aacute;c kh&aacute;i niệm cơ bản về tr&iacute; tuệ nh&acirc;n tạo (AI) v&agrave; ứng dụng của n&oacute; trong c&ocirc;ng việc.</li>\n<li>Hướng dẫn c&aacute;ch sử dụng AI để tự động h&oacute;a c&aacute;c nhiệm vụ lặp lại v&agrave; tiết kiệm thời gian.</li>\n<li>Gi&uacute;p người học cải thiện kỹ năng tổ chức c&ocirc;ng việc, n&acirc;ng cao năng suất v&agrave; đưa ra quyết định dựa tr&ecirc;n dữ liệu.</li>\n<li>Ph&aacute;t triển khả năng s&aacute;ng tạo nội dung v&agrave; giải quyết vấn đề th&ocirc;ng qua c&aacute;c c&ocirc;ng cụ AI hiện đại.</li>\n</ul>\n<h3>Đối tượng tham gia</h3>\n<p>Kh&oacute;a học n&agrave;y ph&ugrave; hợp cho:</p>\n<ul>\n<li>Những người quan t&acirc;m đến việc ứng dụng c&ocirc;ng nghệ v&agrave; AI v&agrave;o giảng dạy.</li>\n<li>Bất kỳ ai muốn t&igrave;m hiểu v&agrave; &aacute;p dụng c&ocirc;ng nghệ AI v&agrave;o c&ocirc;ng việc để n&acirc;ng cao hiệu quả v&agrave; năng suất.</li>\n</ul>\n<h3>Chứng chỉ v&agrave; cơ hội ph&aacute;t triển</h3>\n<p>Sau khi ho&agrave;n th&agrave;nh kh&oacute;a học, bạn sẽ nhận được <strong>chứng chỉ ho&agrave;n th&agrave;nh kh&oacute;a học</strong>. Chứng chỉ n&agrave;y kh&ocirc;ng chỉ l&agrave; minh chứng cho việc bạn đ&atilde; trang bị kiến thức v&agrave; kỹ năng về AI, m&agrave; c&ograve;n mở ra cơ hội ph&aacute;t triển sự nghiệp. Kh&oacute;a học gi&uacute;p bạn trở th&agrave;nh một nh&acirc;n vi&ecirc;n ti&ecirc;n tiến, biết c&aacute;ch &aacute;p dụng c&ocirc;ng nghệ hiện đại để cải thiện hiệu quả c&ocirc;ng việc.</p>\n<h3>Đăng k&yacute; ngay</h3>\n<p>Kh&oacute;a học <strong><em>Ứng dụng AI trong c&ocirc;ng việc</em></strong> sẽ trang bị cho bạn c&ocirc;ng cụ v&agrave; kiến thức cần thiết để đ&oacute;n đầu xu hướng c&ocirc;ng nghệ. Đăng k&yacute; ngay h&ocirc;m nay để tối ưu h&oacute;a c&ocirc;ng việc, n&acirc;ng cao năng suất v&agrave; sẵn s&agrave;ng chinh phục những cơ hội mới trong thời đại c&ocirc;ng nghệ số!</p>	720000.0	https://localhost:7071/coursemate-files/4fafbc40-6d32-4b74-916c-8cdbb59a277c.jpg	t	b0522acc-c5e1-49b2-a340-440724cdeca8	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
f9713740-694e-444f-98f3-d506f13c7914	SQL nâng cao	<p>Ch&agrave;o mừng bạn đến với kh&oacute;a học <strong>SQL n&acirc;ng cao</strong>! Đ&acirc;y l&agrave; kh&oacute;a học đặc biệt được thiết kế d&agrave;nh cho c&aacute;c học sinh lớp 6, những người đ&atilde; ho&agrave;n th&agrave;nh kh&oacute;a học cơ bản "Nhập M&ocirc;n SQL: Thế Giới Dữ Liệu" v&agrave; mong muốn n&acirc;ng cao kỹ năng của m&igrave;nh trong việc quản l&yacute; v&agrave; xử l&yacute; dữ liệu.</p>\n<p>Kh&oacute;a học n&agrave;y sẽ gi&uacute;p bạn mở rộng kiến thức về SQL, kh&aacute;m ph&aacute; c&aacute;c kỹ thuật truy vấn phức tạp. Bạn sẽ học c&aacute;c h&agrave;m xử l&yacute; với c&aacute;c kiểu dữ liệu kh&aacute;c nhau để ứng dụng SQL v&agrave;o c&aacute;c b&agrave;i to&aacute;n thực tế. Đồng thời gi&uacute;p c&aacute;c bạn ph&aacute;t triển tư duy logic v&agrave; kỹ năng ph&acirc;n t&iacute;ch. Chuẩn bị tốt cho tương lai trong c&aacute;c lĩnh vực li&ecirc;n quan đến dữ liệu.</p>\n<p><strong>Phương ph&aacute;p học:</strong> Kh&oacute;a học kết hợp l&yacute; thuyết v&agrave; thực h&agrave;nh, gi&uacute;p bạn hiểu s&acirc;u v&agrave; &aacute;p dụng ngay những kiến thức đ&atilde; học. B&agrave;i tập thực h&agrave;nh từ cơ bản đến n&acirc;ng cao sẽ gi&uacute;p củng cố v&agrave; mở rộng kiến thức của bạn. Dự &aacute;n cuối kh&oacute;a l&agrave; cơ hội để bạn &aacute;p dụng to&agrave;n bộ kỹ năng v&agrave;o một b&agrave;i to&aacute;n thực tế, n&acirc;ng cao khả năng giải quyết vấn đề.</p>\n<p>Kh&oacute;a học <strong>SQL n&acirc;ng cao</strong>&nbsp;sẽ mở ra c&aacute;nh cửa cho bạn kh&aacute;m ph&aacute; s&acirc;u hơn v&agrave;o thế giới dữ liệu, gi&uacute;p bạn trở th&agrave;nh những chuy&ecirc;n gia trong lĩnh vực cơ sở dữ liệu v&agrave; l&agrave;m chủ kỹ năng xử l&yacute; dữ liệu phức tạp. H&atilde;y c&ugrave;ng ch&uacute;ng t&ocirc;i bước v&agrave;o h&agrave;nh tr&igrave;nh th&uacute; vị n&agrave;y v&agrave; l&agrave;m chủ thế giới dữ liệu!</p>	900000.0	https://localhost:7071/coursemate-files/adceaf50-5cd8-4b6a-9504-d02c6e6845fa.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
f996fe4f-4ab1-4979-9193-3881a8a806c9	C++ nâng cao	<h3 data-start="170" data-end="266">C++ N&acirc;ng Cao -&gt; Kh&oacute;a học chuy&ecirc;n s&acirc;u về con trỏ v&agrave; quản l&yacute; bộ nhớ</h3>\n<p class="" data-start="268" data-end="580">Trong lập tr&igrave;nh hệ thống, hiểu r&otilde; <strong data-start="302" data-end="313">con trỏ</strong>, <strong data-start="315" data-end="325">bộ nhớ</strong>, v&agrave; c&aacute;c cấu tr&uacute;c dữ liệu cơ bản l&agrave; nền tảng kh&ocirc;ng thể thiếu để ph&aacute;t triển phần mềm hiệu quả v&agrave; tối ưu. Kh&oacute;a học n&agrave;y sẽ gi&uacute;p bạn <strong data-start="454" data-end="493">nắm vững từ l&yacute; thuyết đến thực h&agrave;nh</strong> c&aacute;c kh&aacute;i niệm cốt l&otilde;i trong lập tr&igrave;nh C/C++, từ đ&oacute; x&acirc;y dựng tư duy hệ thống vững chắc.</p>\n<h3 data-start="587" data-end="615">Qua kh&oacute;a học n&agrave;y, bạn sẽ:</h3>\n<p class="" data-start="619" data-end="766">✅ <strong data-start="621" data-end="666">Hiểu r&otilde; về con trỏ từ cơ bản đến n&acirc;ng cao</strong>: nắm được c&aacute;ch khai b&aacute;o, sử dụng con trỏ, con trỏ h&agrave;m, con trỏ trỏ tới con trỏ v&agrave; ứng dụng thực tế.</p>\n<p class="" data-start="772" data-end="889">✅ <strong data-start="774" data-end="830">Hiểu s&acirc;u về mảng v&agrave; mối li&ecirc;n hệ giữa mảng v&agrave; con trỏ</strong>: bao gồm mảng một chiều, hai chiều, mảng k&yacute; tự, mảng động.</p>\n<p class="" data-start="893" data-end="1023">✅ <strong data-start="895" data-end="950">Ph&acirc;n biệt được truyền tham trị v&agrave; truyền tham chiếu</strong>: l&yacute; giải r&otilde; bản chất hoạt động của từng phương thức v&agrave; ứng dụng ph&ugrave; hợp.</p>\n<p class="" data-start="1027" data-end="1088">✅ <strong data-start="1029" data-end="1087">Hiểu v&agrave; sử dụng th&agrave;nh thạo 3 h&igrave;nh thức cấp ph&aacute;t bộ nhớ</strong>:</p>\n<ul data-start="1091" data-end="1231">\n<li class="" data-start="1091" data-end="1125">\n<p class="" data-start="1093" data-end="1125">Cấp ph&aacute;t bộ nhớ tự động (stack),</p>\n</li>\n<li class="" data-start="1128" data-end="1167">Cấp ph&aacute;t bộ nhớ tĩnh (static memory),</li>\n<li class="" data-start="1170" data-end="1231">\n<p class="" data-start="1172" data-end="1231">Cấp ph&aacute;t bộ nhớ động (heap) với <code data-start="1204" data-end="1212">malloc</code>, <code data-start="1214" data-end="1222">calloc</code>, <code data-start="1224" data-end="1230">free</code>.</p>\n</li>\n</ul>\n<p class="" data-start="1172" data-end="1231">✅ <strong data-start="1237" data-end="1269">L&agrave;m chủ c&aacute;c to&aacute;n tử tr&ecirc;n bit</strong>: thao t&aacute;c bitwise để xử l&yacute; dữ liệu ở mức thấp, tối ưu bộ nhớ v&agrave; tốc độ.</p>\n<p class="" data-start="1345" data-end="1457">✅ <strong data-start="1347" data-end="1391">Hiểu v&agrave; sử dụng kiểu dữ liệu c&oacute; cấu tr&uacute;c</strong>: như <code data-start="1397" data-end="1405">struct</code>, <code data-start="1407" data-end="1414">union</code>, v&agrave; c&aacute;c kỹ thuật tổ chức dữ liệu n&acirc;ng cao.</p>\n<p class="" data-start="1461" data-end="1598">✅ <strong data-start="1463" data-end="1491">Hiểu về struct alignment</strong> v&agrave; <strong data-start="1495" data-end="1540">t&iacute;nh to&aacute;n ch&iacute;nh x&aacute;c k&iacute;ch thước của struct</strong> trong bộ nhớ, từ đ&oacute; tối ưu hiệu quả lưu trữ v&agrave; truy xuất.</p>\n<h3 data-start="1605" data-end="1629">Kh&oacute;a học d&agrave;nh cho ai?</h3>\n<ul data-start="1631" data-end="1950">\n<li class="" data-start="1631" data-end="1707">\n<p class="" data-start="1633" data-end="1707">Sinh vi&ecirc;n c&ocirc;ng nghệ th&ocirc;ng tin, kỹ thuật phần mềm đang học lập tr&igrave;nh C/C++.</p>\n</li>\n<li class="" data-start="1708" data-end="1790">\n<p class="" data-start="1710" data-end="1790">Người học lập tr&igrave;nh hệ thống, muốn hiểu r&otilde; c&aacute;ch hoạt động của bộ nhớ v&agrave; con trỏ.</p>\n</li>\n<li class="" data-start="1791" data-end="1867">\n<p class="" data-start="1793" data-end="1867">Người chuẩn bị học lập tr&igrave;nh nh&uacute;ng hoặc ph&aacute;t triển phần mềm hiệu năng cao.</p>\n</li>\n<li class="" data-start="1868" data-end="1950">\n<p class="" data-start="1870" data-end="1950">Bất kỳ ai muốn <strong data-start="1885" data-end="1949">đ&agrave;o s&acirc;u tư duy lập tr&igrave;nh v&agrave; kỹ năng thao t&aacute;c bộ nhớ hiệu quả</strong>.</p>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/4626cc6c-60e2-4b5b-b85c-ce1856dd21f6.png	t	80e95633-2022-4c78-ab94-57c9d3d51e2d	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
fbd63a54-b48e-417a-afd7-351c843d39f8	Thuật toán căn bản	<h3 data-start="164" data-end="204">Giới thiệu về Giải thuật (Thuật to&aacute;n)</h3>\n<p class="" data-start="210" data-end="613"><strong data-start="210" data-end="224">Giải thuật</strong> (hay <strong data-start="230" data-end="244">thuật to&aacute;n</strong>, tiếng Anh: <em data-start="257" data-end="269">Algorithms</em>) l&agrave; nền tảng cốt l&otilde;i trong lập tr&igrave;nh v&agrave; khoa học m&aacute;y t&iacute;nh. Đ&acirc;y l&agrave; <strong data-start="336" data-end="386">tập hợp c&aacute;c bước cụ thể, hữu hạn v&agrave; c&oacute; trật tự</strong> nhằm giải quyết một b&agrave;i to&aacute;n cụ thể.<br data-start="423" data-end="426" />D&ugrave; được triển khai bằng bất kỳ ng&ocirc;n ngữ lập tr&igrave;nh n&agrave;o (C++, Java, Python...), giải thuật vẫn lu&ocirc;n giữ nguy&ecirc;n bản chất &ndash; một chuỗi c&aacute;c hướng dẫn r&otilde; r&agrave;ng v&agrave; logic dẫn đến kết quả mong muốn.</p>\n<h3 data-start="620" data-end="657">🔍 Tại sao bạn n&ecirc;n học Giải thuật?</h3>\n<p class="" data-start="663" data-end="700">Việc học v&agrave; hiểu giải thuật gi&uacute;p bạn:</p>\n<p class="" data-start="704" data-end="783">🚀 <strong data-start="707" data-end="783">R&egrave;n luyện tư duy logic v&agrave; kỹ năng giải quyết vấn đề một c&aacute;ch c&oacute; hệ thống</strong></p>\n<p class="" data-start="786" data-end="848">💡 <strong data-start="789" data-end="848">Viết m&atilde; hiệu quả hơn, tiết kiệm thời gian v&agrave; t&agrave;i nguy&ecirc;n</strong></p>\n<p class="" data-start="851" data-end="936">🧠 <strong data-start="854" data-end="936">Chinh phục c&aacute;c kỳ thi lập tr&igrave;nh, phỏng vấn kỹ thuật v&agrave; dự &aacute;n c&ocirc;ng nghệ thực tế</strong></p>\n<p class="" data-start="939" data-end="1027">🌍 Mở rộng khả năng ứng dụng trong <strong data-start="974" data-end="1027">tr&iacute; tuệ nh&acirc;n tạo, xử l&yacute; dữ liệu, bảo mật, game...</strong></p>\n<h3 data-start="1034" data-end="1084">📚 Những đặc điểm quan trọng của một giải thuật</h3>\n<p class="" data-start="1090" data-end="1160">Một quy tr&igrave;nh chỉ được xem l&agrave; "giải thuật" nếu đảm bảo c&aacute;c yếu tố sau:</p>\n<p class="" data-start="1164" data-end="1220">✅ <strong data-start="1166" data-end="1183">T&iacute;nh x&aacute;c định</strong>: Mỗi bước phải r&otilde; r&agrave;ng, kh&ocirc;ng mơ hồ.</p>\n<p class="" data-start="1223" data-end="1294">✅ <strong data-start="1225" data-end="1253">Dữ liệu đầu v&agrave;o x&aacute;c định</strong>: C&oacute; thể c&oacute; 0 hoặc nhiều đầu v&agrave;o r&otilde; r&agrave;ng.</p>\n<p class="" data-start="1297" data-end="1368">✅ <strong data-start="1299" data-end="1326">Kết quả đầu ra x&aacute;c định</strong>: Tạo ra một hoặc nhiều kết quả mong muốn.</p>\n<p class="" data-start="1371" data-end="1433">✅ <strong data-start="1373" data-end="1386">T&iacute;nh dừng</strong>: Giải thuật phải kết th&uacute;c sau số bước hữu hạn.</p>\n<p class="" data-start="1436" data-end="1503">✅ <strong data-start="1438" data-end="1455">T&iacute;nh hiệu quả</strong>: C&oacute; thể thực hiện được với t&agrave;i nguy&ecirc;n giới hạn.</p>\n<p class="" data-start="1506" data-end="1564">✅ <strong data-start="1508" data-end="1525">T&iacute;nh phổ biến</strong>: &Aacute;p dụng cho nhiều b&agrave;i to&aacute;n c&ugrave;ng loại.</p>\n<p class="" data-start="1567" data-end="1639">✅ <strong data-start="1569" data-end="1580">Độc lập</strong>: Kh&ocirc;ng phụ thuộc v&agrave;o bất kỳ ng&ocirc;n ngữ lập tr&igrave;nh cụ thể n&agrave;o.</p>\n<h3 data-start="1646" data-end="1669">🧪 Nội dung kh&oacute;a học</h3>\n<p class="" data-start="1675" data-end="1765">Kh&oacute;a học tập trung v&agrave;o <strong data-start="1698" data-end="1737">giải quyết b&agrave;i to&aacute;n bằng giải thuật</strong>, chia th&agrave;nh nhiều nh&oacute;m như:</p>\n<p class="" data-start="1769" data-end="1804">✳️ <strong data-start="1772" data-end="1804">Thuật to&aacute;n t&igrave;m kiếm, sắp xếp</strong></p>\n<p class="" data-start="1807" data-end="1850">✳️ <strong data-start="1810" data-end="1850">Quy hoạch động (Dynamic Programming)</strong></p>\n<p class="" data-start="1853" data-end="1893">✳️ <strong data-start="1856" data-end="1893">Đệ quy v&agrave; quay lui (Backtracking)</strong></p>\n<p class="" data-start="1896" data-end="1925">✳️ <strong data-start="1899" data-end="1925">Thuật to&aacute;n đồ thị, c&acirc;y</strong></p>\n<p class="" data-start="1928" data-end="1996">✳️ <strong data-start="1931" data-end="1996">Thuật to&aacute;n tham lam, chia để trị (Greedy, Divide and Conquer)</strong></p>\n<p class="" data-start="1999" data-end="2057">✳️ <strong data-start="2002" data-end="2057">Ứng dụng thực tế trong lập tr&igrave;nh c&aacute;c b&agrave;i to&aacute;n logic</strong></p>\n<p class="" data-start="2059" data-end="2155">Mỗi phần đều đi k&egrave;m <strong data-start="2079" data-end="2121">b&agrave;i tập thực h&agrave;nh v&agrave; lời giải chi tiết</strong>, gi&uacute;p bạn &aacute;p dụng kiến thức ngay.</p>\n<h3 data-start="2162" data-end="2188">👨&zwj;🎓 Đối tượng ph&ugrave; hợp</h3>\n<p class="" data-start="2194" data-end="2212">Kh&oacute;a học d&agrave;nh cho:</p>\n<ul data-start="2214" data-end="2417">\n<li class="" data-start="2214" data-end="2270">\n<p class="" data-start="2216" data-end="2270">Học sinh, sinh vi&ecirc;n theo học c&aacute;c ng&agrave;nh CNTT hoặc STEM.</p>\n</li>\n<li class="" data-start="2271" data-end="2340">\n<p class="" data-start="2273" data-end="2340">Người học lập tr&igrave;nh muốn <strong data-start="2298" data-end="2339">n&acirc;ng cao khả năng giải quyết b&agrave;i to&aacute;n</strong>.</p>\n</li>\n<li class="" data-start="2341" data-end="2417">\n<p class="" data-start="2343" data-end="2417">Người chuẩn bị thi học sinh giỏi, thi Olympic tin học, phỏng vấn kỹ thuật.</p>\n</li>\n</ul>\n<h3 data-start="2424" data-end="2449">✅ Điều kiện ti&ecirc;n quyết</h3>\n<ul data-start="2455" data-end="2597">\n<li class="" data-start="2455" data-end="2532">\n<p class="" data-start="2457" data-end="2532">C&oacute; kiến thức cơ bản về lập tr&igrave;nh với một ng&ocirc;n ngữ như Python, C++, Java,...</p>\n</li>\n<li class="" data-start="2533" data-end="2597">\n<p class="" data-start="2535" data-end="2597">Biết c&aacute;ch khai b&aacute;o biến, h&agrave;m, cấu tr&uacute;c điều kiện, v&ograve;ng lặp,...</p>\n</li>\n</ul>	0.0	https://localhost:7071/coursemate-files/90302e29-5284-43f6-8607-e2f2ffcfb888.png	t	5ac3586c-394f-45c2-b000-9332d118b498	019ddd8c-f603-72ac-a914-255b7bfd9e64	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
fc632885-682d-40c5-8b20-23c4c1627995	Lộ trình Python A-Z	<p><span style="font-size: 18pt;"><strong>COMBO KH&Oacute;A HỌC PYTHON TO&Agrave;N DIỆN - TỪ CƠ BẢN ĐẾN N&Acirc;NG CAO</strong></span></p>\n<p><span data-teams="true">Bạn muốn học lập tr&igrave;nh bằng Python nhưng kh&ocirc;ng biết bắt đầu từ đ&acirc;u? Bạn đang t&igrave;m kiếm 1 lộ tr&igrave;nh học Python thống nhất từ cơ bản tới n&acirc;ng cao? Combo kh&oacute;a học Python to&agrave;n diện của ch&uacute;ng t&ocirc;i sẽ đồng h&agrave;nh c&ugrave;ng bạn trong h&agrave;nh tr&igrave;nh chinh phục ng&ocirc;n ngữ lập tr&igrave;nh phổ biến nhất hiện nay.</span></p>\n<p><strong>🔰 Kh&oacute;a 1: Python cho người mới bắt đầu</strong></p>\n<ul>\n<li>L&agrave;m quen với lập tr&igrave;nh v&agrave; Python từ con số 0</li>\n<li>Nắm vững c&uacute; ph&aacute;p cơ bản: biến, điều kiện, v&ograve;ng lặp, h&agrave;m</li>\n<li>Thực h&agrave;nh với c&aacute;c b&agrave;i tập từ đơn giản đến phức tạp</li>\n</ul>\n<p><strong>🚀 Kh&oacute;a 2: Python n&acirc;ng cao</strong></p>\n<ul>\n<li>Lập tr&igrave;nh hướng đối tượng (OOP) trong Python</li>\n<li>Xử l&yacute; tệp tin, thư mục</li>\n<li>L&agrave;m việc với c&aacute;c Module v&agrave; Packages</li>\n</ul>	1620000.0	https://localhost:7071/coursemate-files/f8fdac5e-932b-49ec-9f30-5baea1349e6c.jpg	t	fbb5c2ee-0724-4bbc-a075-450004d1f20c	019ddd8c-f558-7386-a796-18c878996313	\N	2026-04-30 08:41:36.786279+00	2026-05-07 15:00:07.530311+00	f
\.


--
-- Data for Name: Enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Enrollments" ("Id", "StudentId", "CourseId", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: ExerciseDefaultCodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExerciseDefaultCodes" ("Id", "ExerciseId", "Language", "StarterCode", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: ExerciseExamples; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExerciseExamples" ("Id", "Input", "Output", "Explanation", "ExerciseId", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: ExerciseSubmissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExerciseSubmissions" ("Id", "ExerciseId", "Language", "Code", "IsPassed", "Score", "TotalTime", "TotalMemory", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: ExerciseTestCases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExerciseTestCases" ("Id", "ExerciseId", "Input", "ExpectedOutput", "Description", "IsHidden", "Order", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: Exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Exercises" ("Id", "Title", "Description", "Difficulty", "Category", "CreatorId", "Constraints", "Hints", "UserId", "CreationTime", "LastModificationTime", "IsDeleted", "IsHidden") FROM stdin;
\.


--
-- Data for Name: FileChunks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FileChunks" ("Id", "FileEntryId", "ChunkIndex", "ChunkLocation", "ChunkSize", "IsUploaded", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: FileEntries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FileEntries" ("Id", "FileName", "FileSize", "FileLocation", "Status", "TotalChunks", "UploadedChunks", "CompletedAt", "FileType", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
37b754c0-6f0d-463f-831f-df6b38f9d7dc	37b754c0-6f0d-463f-831f-df6b38f9d7dc.png	274600	public\\37b754c0-6f0d-463f-831f-df6b38f9d7dc.png	2	0	0	2026-05-07 14:57:58.259255+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.589805+00	f
9513d3dc-9467-4c02-af27-fc0977575f03	9513d3dc-9467-4c02-af27-fc0977575f03.jpg	73432	public\\9513d3dc-9467-4c02-af27-fc0977575f03.jpg	2	0	0	2026-05-07 14:57:58.910826+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.746773+00	f
220486a3-e4a2-4187-a07c-ec759f3ee7da	220486a3-e4a2-4187-a07c-ec759f3ee7da.png	224823	public\\220486a3-e4a2-4187-a07c-ec759f3ee7da.png	2	0	0	2026-05-07 14:57:58.794359+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.694114+00	f
7aae509c-b9c5-4fa4-8dea-3048bceff53c	7aae509c-b9c5-4fa4-8dea-3048bceff53c.png	354705	public\\7aae509c-b9c5-4fa4-8dea-3048bceff53c.png	2	0	0	2026-05-07 14:57:57.442024+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:50.986688+00	f
b89fc18f-c663-48ac-95e9-cb49fd66005e	b89fc18f-c663-48ac-95e9-cb49fd66005e.png	273588	public\\b89fc18f-c663-48ac-95e9-cb49fd66005e.png	2	0	0	2026-05-07 14:57:58.709539+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.237347+00	f
a0b25773-a5c6-49f1-a624-ceb19de597d3	a0b25773-a5c6-49f1-a624-ceb19de597d3.png	208641	public\\a0b25773-a5c6-49f1-a624-ceb19de597d3.png	2	0	0	2026-05-07 14:57:58.205099+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.144856+00	f
2614a6f0-bcce-456a-b7d0-eed74feac4b4	2614a6f0-bcce-456a-b7d0-eed74feac4b4.png	281099	public\\2614a6f0-bcce-456a-b7d0-eed74feac4b4.png	2	0	0	2026-05-07 14:57:58.374582+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.167084+00	f
812f555c-ebf4-4db6-abfa-e8274b86778b	812f555c-ebf4-4db6-abfa-e8274b86778b.png	215842	public\\812f555c-ebf4-4db6-abfa-e8274b86778b.png	2	0	0	2026-05-07 14:57:58.420444+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.186293+00	f
0f7e6b72-1553-4910-863b-6806115a5502	0f7e6b72-1553-4910-863b-6806115a5502.png	144399	public\\0f7e6b72-1553-4910-863b-6806115a5502.png	2	0	0	2026-05-07 14:57:58.573085+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.216498+00	f
74f3a66f-93e5-4cc1-b162-eb4cdb5b856d	74f3a66f-93e5-4cc1-b162-eb4cdb5b856d.png	242860	public\\74f3a66f-93e5-4cc1-b162-eb4cdb5b856d.png	2	0	0	2026-05-07 14:57:58.963372+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.25449+00	f
84ff6c2d-36b0-4ab7-b68f-838630ad04f6	84ff6c2d-36b0-4ab7-b68f-838630ad04f6.png	52292	public\\84ff6c2d-36b0-4ab7-b68f-838630ad04f6.png	2	0	0	2026-05-07 14:57:58.993192+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.27322+00	f
b64fb7c9-1679-40d1-a6e3-00cd35bb20a3	b64fb7c9-1679-40d1-a6e3-00cd35bb20a3.png	220740	public\\b64fb7c9-1679-40d1-a6e3-00cd35bb20a3.png	2	0	0	2026-05-07 14:57:59.034429+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.306357+00	f
a2c82164-7fd7-4322-b7de-5c56ae6eef14	a2c82164-7fd7-4322-b7de-5c56ae6eef14.png	205355	public\\a2c82164-7fd7-4322-b7de-5c56ae6eef14.png	2	0	0	2026-05-07 14:57:57.488217+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.325348+00	f
bb52f86b-198c-4d4c-994a-0df7b92edf43	bb52f86b-198c-4d4c-994a-0df7b92edf43.png	137991	public\\bb52f86b-198c-4d4c-994a-0df7b92edf43.png	2	0	0	2026-05-07 14:57:57.533659+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.339311+00	f
38676548-14a7-4f13-a660-c3715c5cc21e	38676548-14a7-4f13-a660-c3715c5cc21e.png	257650	public\\38676548-14a7-4f13-a660-c3715c5cc21e.png	2	0	0	2026-05-07 14:57:57.68933+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.35385+00	f
e6e300e9-716b-4463-a5bf-0fdbd22795f1	e6e300e9-716b-4463-a5bf-0fdbd22795f1.png	266693	public\\e6e300e9-716b-4463-a5bf-0fdbd22795f1.png	2	0	0	2026-05-07 14:57:59.091294+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.390188+00	f
220a8cf1-3bdd-496d-9cc2-76aae8243a7e	220a8cf1-3bdd-496d-9cc2-76aae8243a7e.png	216153	public\\220a8cf1-3bdd-496d-9cc2-76aae8243a7e.png	2	0	0	2026-05-07 14:57:59.189508+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.412978+00	f
4c26fa1e-d7b9-4d34-8522-2ff981cb81ca	4c26fa1e-d7b9-4d34-8522-2ff981cb81ca.png	182966	public\\4c26fa1e-d7b9-4d34-8522-2ff981cb81ca.png	2	0	0	2026-05-07 14:57:59.230784+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.427114+00	f
2f08efa2-b778-453d-8ddb-aa193c1e8cb9	2f08efa2-b778-453d-8ddb-aa193c1e8cb9.png	146448	public\\2f08efa2-b778-453d-8ddb-aa193c1e8cb9.png	2	0	0	2026-05-07 14:57:59.401776+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.441303+00	f
fe260b41-5370-4430-8c7e-587369dd573a	fe260b41-5370-4430-8c7e-587369dd573a.png	384365	public\\fe260b41-5370-4430-8c7e-587369dd573a.png	2	0	0	2026-05-07 14:57:57.312953+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.45826+00	f
f106fadf-c661-4ed4-8d14-f073595f48c9	f106fadf-c661-4ed4-8d14-f073595f48c9.png	206040	public\\f106fadf-c661-4ed4-8d14-f073595f48c9.png	2	0	0	2026-05-07 14:57:57.595118+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.476499+00	f
824751d2-9552-4e43-a77c-ee5019e7b05a	824751d2-9552-4e43-a77c-ee5019e7b05a.jpg	153690	public\\824751d2-9552-4e43-a77c-ee5019e7b05a.jpg	2	0	0	2026-05-07 14:57:57.734716+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.491215+00	f
9869e6da-f8b5-4385-bf5c-d79eeca54f69	9869e6da-f8b5-4385-bf5c-d79eeca54f69.png	54789	public\\9869e6da-f8b5-4385-bf5c-d79eeca54f69.png	2	0	0	2026-05-07 14:57:57.914189+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.506748+00	f
3938c72f-fb6f-43c4-9e3a-5f0cc28f495c	3938c72f-fb6f-43c4-9e3a-5f0cc28f495c.png	261973	public\\3938c72f-fb6f-43c4-9e3a-5f0cc28f495c.png	2	0	0	2026-05-07 14:57:57.963278+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.520941+00	f
58f2dd1f-49f0-4d31-8617-2ce0d64d8b67	58f2dd1f-49f0-4d31-8617-2ce0d64d8b67.png	122613	public\\58f2dd1f-49f0-4d31-8617-2ce0d64d8b67.png	2	0	0	2026-05-07 14:57:58.000084+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.534919+00	f
e0a5b6bc-c25b-44b8-86dc-f06ef3744064	e0a5b6bc-c25b-44b8-86dc-f06ef3744064.png	314968	public\\e0a5b6bc-c25b-44b8-86dc-f06ef3744064.png	2	0	0	2026-05-07 14:57:58.075378+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.554181+00	f
102e8f40-aa03-4834-81ef-6a735da57a4e	102e8f40-aa03-4834-81ef-6a735da57a4e.png	253806	public\\102e8f40-aa03-4834-81ef-6a735da57a4e.png	2	0	0	2026-05-07 14:57:58.123739+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.571031+00	f
36662c9d-b23d-4113-86de-5fde7eb38502	36662c9d-b23d-4113-86de-5fde7eb38502.png	295582	public\\36662c9d-b23d-4113-86de-5fde7eb38502.png	2	0	0	2026-05-07 14:57:58.324566+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.611817+00	f
fc61f9c7-2740-4ed1-89e3-b7b5ba868177	fc61f9c7-2740-4ed1-89e3-b7b5ba868177.jpg	77602	public\\fc61f9c7-2740-4ed1-89e3-b7b5ba868177.jpg	2	0	0	2026-05-07 14:57:58.644841+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.660132+00	f
17dccc01-2c38-43c6-86c5-0836fea35adb	17dccc01-2c38-43c6-86c5-0836fea35adb.jpg	68652	public\\17dccc01-2c38-43c6-86c5-0836fea35adb.jpg	2	0	0	2026-05-07 14:57:58.750254+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.67882+00	f
107349db-edd5-4da5-b785-5d991b0dfeb3	107349db-edd5-4da5-b785-5d991b0dfeb3.png	82905	public\\107349db-edd5-4da5-b785-5d991b0dfeb3.png	2	0	0	2026-05-07 14:57:58.833802+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.731065+00	f
4fafbc40-6d32-4b74-916c-8cdbb59a277c	4fafbc40-6d32-4b74-916c-8cdbb59a277c.jpg	287851	public\\4fafbc40-6d32-4b74-916c-8cdbb59a277c.jpg	2	0	0	2026-05-07 14:57:59.137961+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.760703+00	f
adceaf50-5cd8-4b6a-9504-d02c6e6845fa	adceaf50-5cd8-4b6a-9504-d02c6e6845fa.png	280110	public\\adceaf50-5cd8-4b6a-9504-d02c6e6845fa.png	2	0	0	2026-05-07 14:57:59.284793+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.777498+00	f
4626cc6c-60e2-4b5b-b85c-ce1856dd21f6	4626cc6c-60e2-4b5b-b85c-ce1856dd21f6.png	305566	public\\4626cc6c-60e2-4b5b-b85c-ce1856dd21f6.png	2	0	0	2026-05-07 14:57:59.358338+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.796046+00	f
90302e29-5284-43f6-8607-e2f2ffcfb888	90302e29-5284-43f6-8607-e2f2ffcfb888.png	307656	public\\90302e29-5284-43f6-8607-e2f2ffcfb888.png	2	0	0	2026-05-07 14:57:59.46705+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.813952+00	f
f8fdac5e-932b-49ec-9f30-5baea1349e6c	f8fdac5e-932b-49ec-9f30-5baea1349e6c.jpg	129588	public\\f8fdac5e-932b-49ec-9f30-5baea1349e6c.jpg	2	0	0	2026-05-07 14:57:58.879771+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.83114+00	f
0d54acad-f2fc-48e4-b428-7ec6ea30a3a8	0d54acad-f2fc-48e4-b428-7ec6ea30a3a8.png	102919	public\\0d54acad-f2fc-48e4-b428-7ec6ea30a3a8.png	2	0	0	2026-05-07 14:57:58.159283+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.12394+00	f
ff2d50c5-12ce-43c1-b4ef-351ba0a61cec	ff2d50c5-12ce-43c1-b4ef-351ba0a61cec.png	711403	public\\ff2d50c5-12ce-43c1-b4ef-351ba0a61cec.png	2	0	0	2026-05-07 14:57:57.875517+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.37056+00	f
6413a84b-3132-4ae5-93f5-854dccc93398	6413a84b-3132-4ae5-93f5-854dccc93398.jpg	87817	public\\6413a84b-3132-4ae5-93f5-854dccc93398.jpg	2	0	0	2026-05-07 14:57:58.606661+00	1	\N	2026-05-07 14:57:59.509232+00	2026-05-08 07:42:51.64188+00	f
\.


--
-- Data for Name: FileEntryEmbeddings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FileEntryEmbeddings" ("Id", "FileEntryId", "FileChunkId", "StartIndex", "EndIndex", "ShortText", "Embedding", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: LessonCodings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonCodings" ("Id", "LessonId", "UserId", "CreationTime", "LastModificationTime", "IsDeleted", "ExerciseId") FROM stdin;
\.


--
-- Data for Name: LessonMaterials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonMaterials" ("Id", "LessonId", "Outline", "DocumentFileId", "Status", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: LessonQuizAnswers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonQuizAnswers" ("Id", "LessonQuizQuestionId", "Text", "IsCorrect", "Position", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: LessonQuizQuestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonQuizQuestions" ("Id", "LessonQuizId", "Text", "Position", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: LessonQuizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonQuizzes" ("Id", "LessonId", "Description", "PassingScore", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: LessonReadings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonReadings" ("Id", "LessonId", "Content", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: LessonVideos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonVideos" ("Id", "LessonId", "VideoUrl", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: Lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lessons" ("Id", "ChapterId", "CourseId", "Title", "LessonType", "Position", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
51c899f8-ba85-4835-bade-c3b33b811a71	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Chuỗi	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0016e09e-1d85-49ed-975c-4dfc9f6d31ee	00056a9e-d5ba-4913-b44e-db626b329749	961ac01c-382c-4aa5-bae1-d1429f27f06a	6.3 TỔNG KẾT	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
00b21956-0e1c-430a-b3b0-f301ae5c8034	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Security & IAM	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
01828aa7-1afa-4580-9e36-5ca2300e67ee	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Chương trình đầu tiên và chú thích	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
019ff171-4894-43d8-b3c9-048a5b456a69	33b1eabc-e72c-44d1-9fc1-a5a9c6dab3dc	fa7b1920-a356-48af-b27e-46550a64a8dc	Bài tập và kiểm tra cuối khóa	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
01ac974c-5fed-49b4-8186-2a47ec1154f4	d8e5d8e5-7b6c-4c5b-9209-821e9a533c7a	3cfe0502-a9d6-4353-b87f-ed417a83124f	1.5 Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
01dc635c-0f95-4162-b58b-c13b2de83d28	255b3c07-c453-4783-96ef-ae10698fbabd	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Giới thiệu game Gà qua đường	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
01de2986-c6a5-4631-97b1-ffedf0752b03	36860b84-ee67-4b15-9533-1c53d00c48b8	743dd717-48b2-45b1-b9c0-8ded60965ecb	8.2 Các thao tác trên chuỗi	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
01e9894c-3f8c-4dc0-8725-74786e1f578a	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Phân nhóm dữ liệu	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
02a56e01-4495-4984-a9c1-5d942bb3e12e	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Đơn vị xử lý trung tâm 	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
02dc8906-f417-4944-8f53-48eeaac0fb93	fc11ed6e-e4ae-480e-b12f-67aec809ce17	3ffa0664-7966-4aa4-9557-049c00d033b7	Thuật toán tìm kiếm	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0306e30d-d939-4220-83c7-c0cbc3197e39	4ebff68e-c0dd-43c1-a2a4-1aeb0f4ae5d2	eef4fafb-022a-430f-aad0-9416d37d656c	Sử dụng đối tượng trong Javascript	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
032bbbc8-9c31-4a9c-bd16-96f28ca52aba	cbb65694-0ff7-4070-9e58-999596582272	3cfe0502-a9d6-4353-b87f-ed417a83124f	5.1 Cấu trúc if-else	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
03b3a4a8-1fbf-4b61-90ae-20714380ab02	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Một số ứng dụng của network	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
04ce0acb-911e-47cf-9b3e-b7690d00f8b8	19f37cb6-945b-493e-8771-835627a148d0	737b5551-e148-4e64-aa54-2e85f82a30ff	Vòng lặp for	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0531df44-bbdd-4634-b5e9-4683e9685511	8a812c9d-4a4d-4c66-8e9b-6d0784ceba7f	743dd717-48b2-45b1-b9c0-8ded60965ecb	4.2 Sự khác biệt giữa i++ và ++i trong Java	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
07a0400c-a511-423a-b63c-71401bbf60fb	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Đóng gói và Release trên GitHub	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0818e0c7-efa9-4629-b900-3bac6b292c3f	8a812c9d-4a4d-4c66-8e9b-6d0784ceba7f	743dd717-48b2-45b1-b9c0-8ded60965ecb	4.3 Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0851307e-e5e1-421c-94af-feebc0e5ca88	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Lọc dữ liệu	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
08876f1d-ac07-42c1-8a5e-5fbaea8447e6	233919f7-09cc-41bc-b45e-f5f4fdcd6e17	961ac01c-382c-4aa5-bae1-d1429f27f06a	3.7 TỔNG KẾT	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
08f9606a-f132-4603-a759-e6d6add0e6cf	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Chuỗi	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0923d818-10f2-4e2a-b673-2cc54cff6c9a	16dc7e8b-24cc-4338-bcde-f3532389ad36	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Khai báo cấu hình, hằng số	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0aebd6d4-ace8-4d66-b33c-b71009b40b5e	32c7970e-d889-47c5-ba13-1bf59309402d	e79d99e5-6325-4f50-833d-ee7de5bc43c1	Ứng dụng AI trong tạo slide thuyết trình	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0b1e4421-19ee-4f01-9977-e2e3ef7a2dcf	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Công cụ tự động hóa 4: Thu thập dữ liệu từ web	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0b3cd112-5c29-4f6a-a632-4e1afb08b2c1	ff613291-f29e-4aba-a90f-43566082e70f	961ac01c-382c-4aa5-bae1-d1429f27f06a	2.2 CÁC HÀM LÀM TRÒN SỐ THỰC	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0bb28ee1-ff17-4ffd-9f49-25818c4ccc9b	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.5 LIST	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0c05ca66-b8c7-471e-b562-bd86f6076a18	434104ff-0f72-45b9-853d-dba6e936bea2	961ac01c-382c-4aa5-bae1-d1429f27f06a	5.2 UNION	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0ce89b43-243a-4612-b427-f8a9e744cfcb	7e5584ec-4af7-405e-aa5b-7bac9149303a	3ffa0664-7966-4aa4-9557-049c00d033b7	Các thuật ngữ cơ bản	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0d8c9c8a-bd6e-44ae-8661-36434ce780b4	eb01ed8f-8fe0-40da-a6cf-db9d34076dd5	d1839060-39f5-4877-a610-7036e35dbcaa	3.4 Hàm toán học phổ biến	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0e2de120-0a2d-41f2-b71c-0155ed693e1b	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Các cổng kết nối	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0e6ee047-b636-43ec-9fad-9f8f46b6a4b0	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Hàm	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0e778d35-4327-490d-b59e-8978aa1ca57b	16dc7e8b-24cc-4338-bcde-f3532389ad36	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Quản lý người dùng	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0ee43e2e-f4f2-47bf-9b49-5358b1dba4f3	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Các hàm toán học	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0f10883f-72fc-4cc6-abc1-150bc6751b01	cbb65694-0ff7-4070-9e58-999596582272	3cfe0502-a9d6-4353-b87f-ed417a83124f	5.3 Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
0f21feb0-f821-444f-979c-7d139896ef41	eaf42478-1f56-4402-9c5d-272beaa42f7c	961ac01c-382c-4aa5-bae1-d1429f27f06a	4.3 TỔNG KẾT	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
10276352-0e53-4e6e-b32f-254aa7e8ae44	fe89c338-a561-45e8-be2e-6465e6ef8552	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Giới thiệu chung về lập trình Scratch	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1168e948-58c5-4bd9-a976-84cc1da41434	a1f7c649-c30c-4be2-9541-d51de4712954	3cfe0502-a9d6-4353-b87f-ed417a83124f	3.3 In số thực trong C++	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
11bacde1-14fa-477f-8b91-f8d4236d97da	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Programmable Infrastructure	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
11e0874d-bfdd-49db-b0c0-6ced141e9285	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.9 TỔNG KẾT	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
12296772-f6a6-4c8b-9ea2-81b718b305e1	ee5bbb65-4634-4c64-b289-9229a42a313b	3ffa0664-7966-4aa4-9557-049c00d033b7	Graph	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
123ed5a7-f408-4292-b4ba-d7920bdd6b28	95b06f40-f331-47fc-be32-89793d374830	fa7b1920-a356-48af-b27e-46550a64a8dc	Cấu trúc rẽ nhánh	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
126e2196-84ba-4cc1-a178-b636585aae6b	0f705c03-0eed-485b-a440-caf811670cb5	3cfe0502-a9d6-4353-b87f-ed417a83124f	7.3 Hàm sort mảng 1 chiều	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
131fa31e-71e8-4917-a160-8f4c0a315589	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Đồ thị	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
13640e96-4e7f-4a64-ab70-277c49298e79	f0fdd269-aacf-41ee-9086-c74c6337b50e	d1839060-39f5-4877-a610-7036e35dbcaa	1.3 Chương trình đầu tiên "Hello World"	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1403be59-f42f-48e7-9552-2e1719f1b909	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Số học	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
16ee5481-fc68-400d-bfaf-0b6d60f5c40f	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.2 VECTOR	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
17b196e7-a5bf-4938-8bd8-135d52aeab5f	63bed55c-0803-48b3-96fb-6cfcbb613ade	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Tạo dự án	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
19f89650-e519-44da-a57f-ccb23715a3a4	fc87a170-547a-4ced-81ae-3274a87caa0d	e2b33def-af48-4e4c-b6cd-863a630f8ee7	Chia để trị	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1a33fdeb-aa9c-453e-848d-82780bd2ed82	67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Bài tập trắc nghiệm	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1b9ac7fa-0fd2-49f9-87e6-bee0f818cefd	07cc1c31-5bff-416c-9a73-ff7d44b0650b	d1839060-39f5-4877-a610-7036e35dbcaa	4.1 Toán tử so sánh	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1c381d5a-a8e2-414a-976d-7d7e6d812b22	eb01ed8f-8fe0-40da-a6cf-db9d34076dd5	d1839060-39f5-4877-a610-7036e35dbcaa	3.6 Tổng kết	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1c7d85dc-0745-4ea5-af1a-100249b4f3db	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Truy vấn con	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1ce422b8-0e3c-408f-8989-5dab23576c1d	d8e5d8e5-7b6c-4c5b-9209-821e9a533c7a	3cfe0502-a9d6-4353-b87f-ed417a83124f	1.1 Giới thiệu về Lập trình và C++	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1d7c96ea-e773-4153-a4e8-c584a6d69910	4cbd5ad7-d0d2-4994-99a9-d2d2afd7e645	d1839060-39f5-4877-a610-7036e35dbcaa	2.4 Nhập xuất dữ liệu	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1d8d616f-55fd-47cd-ad82-f650235fb17d	82938d8a-fa31-4c7d-9122-12be8dce501e	fa7b1920-a356-48af-b27e-46550a64a8dc	Chú thích	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b1c8c0b4-9f77-48d4-9684-761e637681fe	0f705c03-0eed-485b-a440-caf811670cb5	3cfe0502-a9d6-4353-b87f-ed417a83124f	7.2 Các thao tác cơ bản trên mảng	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1e16ec3f-d62a-42e0-b5cf-762f2266d1eb	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Cách tạo các ứng dụng và báo cáo cho các đối tượng	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1e4e0e2b-6d6d-4160-b91c-22793c8b1668	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Tổng kết	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
1eff1bd4-0e08-48b9-a2ab-e7ddfd6b1731	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Vòng lặp: while và do-while	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
20876edf-7c51-4659-b84a-1a9a01e34355	bd6222e5-280f-4779-b6b7-1a845f8d4495	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Pseudo element trong CSS	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
21efead8-e296-4758-bcbe-79c2c3ee2598	bfc8c9f6-6861-47e7-b8e9-7395048353a4	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Font chữ trong CSS	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
236d7e90-3505-4941-a1d2-5b3f9a77b064	bda31c86-19c9-4da5-9a73-152e6c900589	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Làm quen với CSS	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2485b4de-f4a2-4dbd-b072-d126bf1ed522	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Giới thiệu chi tiết về Amazon Web Services	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2533c33f-b76c-420b-8c9c-8eb43f5bd8db	07cc1c31-5bff-416c-9a73-ff7d44b0650b	d1839060-39f5-4877-a610-7036e35dbcaa	4.5 Thoát khỏi luồng điều khiển	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
269870c0-ecf6-4032-a227-0a0a49b45a65	f0fdd269-aacf-41ee-9086-c74c6337b50e	d1839060-39f5-4877-a610-7036e35dbcaa	1.2 Cài đặt môi trường lập trình	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
26b4e878-1c35-4aa1-a458-8c6adb4905ad	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Bo mạch chính 	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
26dcc773-62bd-438f-850f-e0a0ff5fcf8b	1d71ef9c-b28e-4f0b-8439-544d893fb0be	eef4fafb-022a-430f-aad0-9416d37d656c	Giới thiệu khóa học và nội dung	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
26fd855f-9d56-4e39-ad17-3158f1b95d79	bda31c86-19c9-4da5-9a73-152e6c900589	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Viền, đệm, lề trong CSS	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
274e46fd-8deb-4519-b37a-75efb71e087f	16dc7e8b-24cc-4338-bcde-f3532389ad36	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Kết nối cơ sở dữ liệu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
287bcf1f-7622-410f-8052-e64dfa4ed17e	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Thiết bị chuyển mạch, định tuyến và mô hình đấu nối	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2891a422-93ef-466a-ba9b-eb50ddfcc91f	2f8f6d1a-4c46-40a8-a903-1bbadba79247	f996fe4f-4ab1-4979-9193-3881a8a806c9	Kiểu cấu trúc	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
28afeeff-ebb8-4585-9319-8731e99b9f1a	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Hình học	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
28de1d51-e45d-4ef4-941e-90ace493ba67	4cbd5ad7-d0d2-4994-99a9-d2d2afd7e645	d1839060-39f5-4877-a610-7036e35dbcaa	2.1 Chú thích	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2939eab6-5bee-47dc-91db-1a20b330d606	0c187fb6-d795-4387-aa3f-21f1cbf01a7c	6097a7ef-548b-4542-8c60-5ee180d2dd96	Game mèo bắt chuột	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
29b23b29-83f2-4654-925a-c7aafce5ab7b	e119e517-1a3c-4756-bc71-8124ede492e7	3cfe0502-a9d6-4353-b87f-ed417a83124f	4.2 Sự khác biệt giữa i++ và ++i trong C++	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2aaa061e-376f-4ede-be62-7043c4bc035f	95b06f40-f331-47fc-be32-89793d374830	fa7b1920-a356-48af-b27e-46550a64a8dc	Toán tử trong C#	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2b182c80-a6ad-474d-b49a-d6a63f55604f	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Đầu vào	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2b7be4cb-3877-4192-8dd2-f9bbe62dbe55	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Công cụ tự động hóa 6: Tự động hóa lập lịch, thông báo	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2b8c54e1-655d-48d1-a072-9c9a9fb40ecf	77199784-d6bf-44b0-ba03-6da9d4198d33	eef4fafb-022a-430f-aad0-9416d37d656c	Giới thiệu về DOM	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2be0769b-fbb8-4802-8961-75dbc0f0d423	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Một số khái niệm về giải thuật	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2c132fa4-0b19-46d8-af93-ebafd0353493	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Các toán tử	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2ce9b03d-0b00-44ab-a660-c2880efe0a5c	a9f074bb-55b6-4325-b93e-58eaefe41551	3600145f-dbec-412b-94f1-08942f6afa16	Tệp tin và hệ thống tệp tin	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2d6c0b05-8e76-4ea2-884a-8bf11697e4a3	2737e6c4-1a69-419a-9532-8914175c527d	743dd717-48b2-45b1-b9c0-8ded60965ecb	7.2 Các thao tác cơ bản trên mảng	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2d7f1580-6089-4ae8-9abf-8ab6be102587	2f8f6d1a-4c46-40a8-a903-1bbadba79247	f996fe4f-4ab1-4979-9193-3881a8a806c9	Các phép toán thao tác bit	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2e8980af-dc52-4019-b5cb-240e20c48c1e	00056a9e-d5ba-4913-b44e-db626b329749	961ac01c-382c-4aa5-bae1-d1429f27f06a	6.2 FUNCTION TEMPLATE	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2e8fbf8d-6ed1-422b-b297-5d8d49db760d	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	AWS Services	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2ed609d4-5cd3-4077-b6e8-20701fbd7acb	1aa80bc2-8195-4d96-b3c1-852a22d3c8cc	ce685ee8-dca7-4304-befd-139a5700bc68	Set	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2fa53fcc-167c-485e-8732-75edf463983b	eaf42478-1f56-4402-9c5d-272beaa42f7c	961ac01c-382c-4aa5-bae1-d1429f27f06a	4.1 KỸ THUẬT ĐỆ QUY	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
2fe0467e-75b0-440b-b258-65333bf99c25	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Truy vấn con	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3029978c-9f96-47ce-93e6-f21228c7c968	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Các hàm	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
30efca14-6448-4ea3-9d12-7617e4f961e7	6724d6fa-d2b4-4a7d-9123-0fc06dab0123	961ac01c-382c-4aa5-bae1-d1429f27f06a	7.2 TỔNG KẾT	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
31136b30-c029-4ed5-bd81-2bbc5b7bf9f8	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Mảng và liệt kê	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3199beaf-27e5-4a9b-946e-4b16814c5845	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Hàm	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3327f3ad-6d0a-495a-8727-2e7e41495efd	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Phương thức chuỗi	0	aB	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
33756a76-ebfd-4268-82bf-0a44137c792c	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Câu hỏi cuối khóa	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
358738bc-b22f-4a7a-8a35-b9cf1e69a504	c3bb7a1a-a6e1-4471-a71b-ff9a4eb042dd	3cfe0502-a9d6-4353-b87f-ed417a83124f	9.2 Đối số và tham số, tham trị và tham chiếu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
35d53330-433d-4883-8919-9730ab31afa4	ef55e99a-89af-4040-8547-3ce1ed99aeea	743dd717-48b2-45b1-b9c0-8ded60965ecb	2.6 Tổng kết	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
35f2a3b4-afc1-4bbb-a589-c754871ad962	f0fdd269-aacf-41ee-9086-c74c6337b50e	d1839060-39f5-4877-a610-7036e35dbcaa	1.4 Kí tự thoát trong Python	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
369b89e6-a74a-4aa0-9adc-7ffaab56f103	b1ba46fe-75f1-4447-8cb0-d4a6c81e1b51	eef4fafb-022a-430f-aad0-9416d37d656c	Hàm trong Javascript	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
36ad1b85-f2b8-4ad0-8f1b-7b9988da0a6f	fc11ed6e-e4ae-480e-b12f-67aec809ce17	3ffa0664-7966-4aa4-9557-049c00d033b7	Thuật toán chia để trị	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
36f75757-9db4-4fb8-8bae-f56852a95d6c	f80b3a58-34c2-4ae7-9d20-6ec19d70b402	acdafa98-5779-491b-b172-a6aeb14c5af1	Biến tĩnh, phương thức tĩnh	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
37291ed6-1137-466d-9acf-a3c82edbaede	d4001112-3495-4491-8523-3a632ebb407b	d1839060-39f5-4877-a610-7036e35dbcaa	6.2 Tham số và đối số	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
39f56347-1b51-4695-ac49-0de2ef32495d	82938d8a-fa31-4c7d-9122-12be8dce501e	fa7b1920-a356-48af-b27e-46550a64a8dc	Kiểu dữ liệu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3a3d4cf9-605a-4f86-9221-319201c9e4a3	1aa80bc2-8195-4d96-b3c1-852a22d3c8cc	ce685ee8-dca7-4304-befd-139a5700bc68	Queue	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3acdda56-6bce-4569-b6c4-f36132d9aee7	5f970759-175f-48ea-bcfe-c27c4409bb13	3cfe0502-a9d6-4353-b87f-ed417a83124f	6.4 Tổng kết	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3ae9b60c-2e0a-49a3-ae36-5d55e74e817f	b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Phần mềm hệ thống	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3b49ea5d-d572-44c1-9d57-8ae6b512fa12	d4001112-3495-4491-8523-3a632ebb407b	d1839060-39f5-4877-a610-7036e35dbcaa	6.4 Phạm vi của biến	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3b6de845-4bb5-40cf-83bb-d6ced7d94f02	f80b3a58-34c2-4ae7-9d20-6ec19d70b402	acdafa98-5779-491b-b172-a6aeb14c5af1	Lớp và đối tượng	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3b95fbb7-49a7-460f-8f78-c26dfdccebec	fc87a170-547a-4ced-81ae-3274a87caa0d	e2b33def-af48-4e4c-b6cd-863a630f8ee7	DFS & BFS	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3c1226aa-01d5-412d-886a-a26293866431	e3aa1c57-0005-4713-8b26-9a125169bc56	743dd717-48b2-45b1-b9c0-8ded60965ecb	1.2 Thiết lập môi trường phát triển	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3c398f01-914b-4654-b2ff-2a4d7187be45	4245ba29-529d-4739-bc2b-b774082f6c58	3600145f-dbec-412b-94f1-08942f6afa16	Làm việc với Module	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3c8ad36f-8ebf-4e28-8497-8100f5a77adf	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Kiến trúc điện toán đám mây và các yêu cầu, kỹ thuật cơ bản	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3d1e8bcd-993e-4b8b-b31e-cd2dca09ab71	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Vòng lặp	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3d755c6a-1f60-4032-a5b1-35b1237fe752	cbabfde1-dc78-4d4b-8615-285b122b9937	737b5551-e148-4e64-aa54-2e85f82a30ff	Các kiểu dữ liệu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3dd96ff4-6fbb-4fa2-8333-4148b2ca92d7	b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Phần mềm ứng dụng: Trình duyệt web	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3ddb7e17-770e-4518-9cb2-84eb174d2832	a9a98c85-d92a-4980-a5fe-514d1b8b50a3	6097a7ef-548b-4542-8c60-5ee180d2dd96	Giải toán	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3fc72bcf-99a9-4267-bc41-2437caa31a83	e119e517-1a3c-4756-bc71-8124ede492e7	3cfe0502-a9d6-4353-b87f-ed417a83124f	4.1 Các loại toán tử trong C++	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3fedd13a-d120-48fe-93a6-18e2ddc9124c	d0d53c61-e27e-4450-960c-429ea63d5893	3600145f-dbec-412b-94f1-08942f6afa16	Tập hợp	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
3ffc1f7a-54a2-4244-94be-5a34b2238b96	753659d3-4545-4b7e-a74c-6bdc7335fe3e	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Khái niệm cơ bản về HTML	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
406f1880-6042-470d-a17e-3f95062b8489	55e1b573-f06f-421d-881f-9ba3575ddcec	3600145f-dbec-412b-94f1-08942f6afa16	Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4111f3ed-688a-4abd-b4c8-8b50869ebdce	16dc7e8b-24cc-4338-bcde-f3532389ad36	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Đăng nhập, đăng xuất	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
412fc311-7975-41da-9c17-f6c384fcdbff	761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Truy vấn con	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
42303f02-f809-4fdc-adbf-c3f590655747	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Bài tập và kiểm tra	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
43787a47-4fb7-47e4-8926-a7eb4ba63183	4245ba29-529d-4739-bc2b-b774082f6c58	3600145f-dbec-412b-94f1-08942f6afa16	Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
43cc142f-bdd0-4fb1-852c-9ecbd3550c9f	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.3 STACK	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
44090892-2049-4558-be67-18e033ef9a96	434104ff-0f72-45b9-853d-dba6e936bea2	961ac01c-382c-4aa5-bae1-d1429f27f06a	5.3 PAIR	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
46ab24f2-0725-4855-bd36-78a866ce42ec	a1f7c649-c30c-4be2-9541-d51de4712954	3cfe0502-a9d6-4353-b87f-ed417a83124f	3.1 Cú pháp nhập - xuất dữ liệu	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4777cd9b-81d1-4be1-be29-ffbb69a4aa37	0e36950e-fe57-40da-b564-9ef4866b2c24	743dd717-48b2-45b1-b9c0-8ded60965ecb	6.3 Câu lệnh break và continue	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
47c574ca-ab35-4845-85e0-285205012ca4	0673c3cb-8017-4f8e-aba4-b60f0ef797a1	3cfe0502-a9d6-4353-b87f-ed417a83124f	2.5 Phạm vi của biến	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
484d80c9-092b-45b9-a398-e78c86acdbbb	0c187fb6-d795-4387-aa3f-21f1cbf01a7c	6097a7ef-548b-4542-8c60-5ee180d2dd96	Game bảo vệ tổ quốc	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
493f4543-d6e8-47a0-be3f-2d47e68f435d	b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Giới thiệu về phần mềm	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4960a642-cf3b-41c7-9072-21ef1a03e377	36860b84-ee67-4b15-9533-1c53d00c48b8	743dd717-48b2-45b1-b9c0-8ded60965ecb	8.3 Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
49947184-23b9-482d-834b-decf990d37c3	1056efbd-e7bc-4f8a-ad52-e9a317b88640	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Triển khai ứng dụng	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
49cd67f8-ae9d-4785-a7ca-b156f9c2ed0d	233919f7-09cc-41bc-b45e-f5f4fdcd6e17	961ac01c-382c-4aa5-bae1-d1429f27f06a	3.5 CON TRỎ TRỎ TỚI CON TRỎ	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4a415d3e-747d-4450-8d77-f1d772a3b268	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Các thông số trong truyền tải mạng	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4a5d180c-a20d-4024-8d52-1137a9f0486c	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Cấu trúc dữ liệu mảng	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4a8d42a6-7320-4cc1-96ad-6f6cde8be9e0	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Các toán tử	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4a9de1ba-9f24-4c3d-b360-1531cc9219a5	f0fdd269-aacf-41ee-9086-c74c6337b50e	d1839060-39f5-4877-a610-7036e35dbcaa	1.5 Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4b73a9df-d4c0-42d3-bd1f-ca46645a7c8f	b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Phần mềm ứng dụng: Phần mềm tiện ích 1	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4b816608-1efb-472e-b494-fbf986570162	6f250039-b2e7-45ed-a610-01c4f9f2c518	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Flexbox trong CSS	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4c09fe87-2332-4258-b2db-6f4231dfabaf	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Phương thức số	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4c800036-3433-42c7-9b36-0d50684662e3	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Danh sách liên kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4c8e0046-52b1-4ebe-891d-fae57e025e68	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Trò chơi Thảm họa thiên thạch	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4caeb887-9fbb-44c2-8047-fa08230837d5	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Các công nghệ phổ biến trong truyền tải mạng	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4cc876b7-0360-4dee-ae29-32f8faef097f	5f970759-175f-48ea-bcfe-c27c4409bb13	3cfe0502-a9d6-4353-b87f-ed417a83124f	6.3 Câu lệnh break và continue	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4cdb0e92-f80f-460f-9688-0a160cb11171	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Ma trận	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4d956559-c16f-48a0-b961-cde525f97b2e	cbb65694-0ff7-4070-9e58-999596582272	3cfe0502-a9d6-4353-b87f-ed417a83124f	5.2 Switch case	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4d964775-64eb-49a0-9e31-c4e9f4c4ef47	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Các khái niệm và một số điều cần biết về mạng	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4f0bc72e-5a02-4437-b70e-bffc19bcded6	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Hàm đệ quy	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
4fcbd489-a620-4b12-8bcd-3165c6babdd9	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Bài luyện tập II	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
534d0cfe-1f45-4b7a-b96f-2d69b2869f8b	1aa80bc2-8195-4d96-b3c1-852a22d3c8cc	ce685ee8-dca7-4304-befd-139a5700bc68	List	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5375df11-bcad-48ff-a25b-48f02a8ce699	ff613291-f29e-4aba-a90f-43566082e70f	961ac01c-382c-4aa5-bae1-d1429f27f06a	2.3 TỔNG KẾT	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
53f28ffa-8f47-4918-b58a-ee837c2a065a	753659d3-4545-4b7e-a74c-6bdc7335fe3e	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Hình ảnh trong HTML	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
53fb6537-0c03-4fd6-8267-18c069ab99ae	a9f074bb-55b6-4325-b93e-58eaefe41551	3600145f-dbec-412b-94f1-08942f6afa16	Tổng kết	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
55f72234-28cd-426b-a23f-4a0f38e701e4	32c7970e-d889-47c5-ba13-1bf59309402d	e79d99e5-6325-4f50-833d-ee7de5bc43c1	Dự án cuối khóa	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
56d3ffcc-1cf4-4cad-8f58-e806262e0632	0673c3cb-8017-4f8e-aba4-b60f0ef797a1	3cfe0502-a9d6-4353-b87f-ed417a83124f	2.3 Biến	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
590a7adc-abf3-4228-a178-c0db16949848	16dc7e8b-24cc-4338-bcde-f3532389ad36	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Tạo dự án	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
593b64bc-d5f5-4056-91d3-a741c1d3d26e	01f76acf-40d6-4601-92f5-c23bc6625a5f	3600145f-dbec-412b-94f1-08942f6afa16	Kế thừa và đa hình	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
593e8264-f9e6-4d96-a107-677c6195e2a0	e3aa1c57-0005-4713-8b26-9a125169bc56	743dd717-48b2-45b1-b9c0-8ded60965ecb	1.4 Chương trình đầu tiên	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5994c332-b4f1-44bc-b108-62c09a08fdbe	16dc7e8b-24cc-4338-bcde-f3532389ad36	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Redis Cache	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5a2b1917-f8ab-4d51-b728-aa1ab1f89181	60d3e2b3-b6e9-41c7-a44c-8139e7b1662d	3cfe0502-a9d6-4353-b87f-ed417a83124f	8.3 Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5a4b3f60-2101-4fc4-a6a5-2837eab3871f	0c187fb6-d795-4387-aa3f-21f1cbf01a7c	6097a7ef-548b-4542-8c60-5ee180d2dd96	Game đua xe	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5ab509c9-0bc7-4150-b7a8-8f71c1d83712	67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Tính đa hình và trừu tượng	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5af12322-a94a-465c-8d1d-dc4280b480d8	32c7970e-d889-47c5-ba13-1bf59309402d	e79d99e5-6325-4f50-833d-ee7de5bc43c1	Ứng dụng AI trong việc xử lý âm thanh	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5b101808-929b-4602-a113-86962d06e021	b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Phần mềm ứng dụng: Phần mềm tiện ích 2	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5bc8ace7-621e-4ed0-8ee5-d130a3649220	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Compute Services	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5bd9133f-7d8e-48d1-949a-b70f0bf8ab1b	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Câu lệnh lựa chọn	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5bf8121e-3283-4ee5-b1e2-5c4cfdeb5871	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Kết hợp Bảng	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5c2114bf-d64f-406e-a24e-e5e01e2442dd	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Trò chơi Mèo chạy đua	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5cf23e1a-7b76-4966-b6c5-965fb4e2e3ea	b1ba46fe-75f1-4447-8cb0-d4a6c81e1b51	eef4fafb-022a-430f-aad0-9416d37d656c	Vòng lặp trong Javascript	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5d2a72e2-90b2-40ba-b5f3-d32f4790acb9	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Đếm	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5d53ae38-a645-4d6e-9841-353203d0f19c	579b2a4f-6031-4429-b244-2061c4e519e0	3ffa0664-7966-4aa4-9557-049c00d033b7	Thuật toán sắp xếp nâng cao	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5d8f5108-449f-41f4-9c37-0920ecad1915	5e695d8e-500f-40cf-b5ac-2fd1501381d7	961ac01c-382c-4aa5-bae1-d1429f27f06a	1.2 GHI FILE	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5e3a75c5-02e1-47a7-9dd3-50560ba9f5f3	eb1f6aea-2cd3-4885-8897-a096ac15981f	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Cấu trúc dự án	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5e7fc7ef-f0cc-43b7-b118-44a148cd379e	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.6 MAP	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5e8ee138-b7b1-4503-8f82-cd70fa10bf33	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Bài luyện tập I	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5e971f5b-d6d8-42c5-b5b0-24f335d73947	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Giải thuật sắp xếp	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5eb5086d-afd8-48d7-8956-4025686248b6	d4001112-3495-4491-8523-3a632ebb407b	d1839060-39f5-4877-a610-7036e35dbcaa	6.5 Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5eccfda7-e2c9-4723-9d00-ef37b6416bd3	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Phân nhóm dữ liệu	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5f43fed8-9acf-4c0c-afeb-dd6abff8d1da	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Xử lý chuỗi	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5f9abd65-4015-4556-80b9-a8158ea8aff3	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Tìm kiếm	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5fc396c7-d6d7-4025-993a-37980e22ef53	d8e5d8e5-7b6c-4c5b-9209-821e9a533c7a	3cfe0502-a9d6-4353-b87f-ed417a83124f	1.4 Chương trình đầu tiên	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5fe9881e-7563-499f-822c-06c10edde4cb	60d3e2b3-b6e9-41c7-a44c-8139e7b1662d	3cfe0502-a9d6-4353-b87f-ed417a83124f	8.2 Các thao tác trên chuỗi	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
5feecb0f-0c9e-4b0a-ae2b-23281718131b	ee5bbb65-4634-4c64-b289-9229a42a313b	3ffa0664-7966-4aa4-9557-049c00d033b7	Shortest Path	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
607e86db-4bce-4668-a145-a9c8a7bbf6c3	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Chuỗi	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
60b038b0-4e06-40bf-90e6-b8a5b72e514f	27aa88e7-a021-49a0-82cb-32c2bfd28f02	743dd717-48b2-45b1-b9c0-8ded60965ecb	3.3 In số thực trong Java	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
61161a73-a8b4-41b5-bf43-c41d7790cc50	63bed55c-0803-48b3-96fb-6cfcbb613ade	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Quản lý công việc	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
61174faf-bd94-4fd1-b0d0-6759882416bc	0e36950e-fe57-40da-b564-9ef4866b2c24	743dd717-48b2-45b1-b9c0-8ded60965ecb	6.2 Vòng lặp lồng nhau	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
616052bb-ec17-42c2-a9bf-71cb972609a6	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Truyền thông dữ liệu và mạng máy tính	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
622a742a-0808-4911-b327-e04f92f35677	761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Biểu thức bảng chung	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
62fd7cdd-019e-44a8-8f51-2d87e3f84574	77199784-d6bf-44b0-ba03-6da9d4198d33	eef4fafb-022a-430f-aad0-9416d37d656c	Giới thiệu về BOM	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
643fe4ee-1d84-4366-bb73-f3f394de0c60	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Sắp xếp	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
64434b35-31e1-44cf-8c1d-03cd034c2892	233919f7-09cc-41bc-b45e-f5f4fdcd6e17	961ac01c-382c-4aa5-bae1-d1429f27f06a	3.4 TRUYỀN CON TRỎ TỚI HÀM TRONG C++	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6450ef26-6a76-447f-928d-0d75eb7b7397	bda31c86-19c9-4da5-9a73-152e6c900589	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Background trong CSS	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
66c26548-7216-4afe-80d0-44ef5aac825e	07cc1c31-5bff-416c-9a73-ff7d44b0650b	d1839060-39f5-4877-a610-7036e35dbcaa	4.4 Vòng lặp	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
66ea63f5-3d34-4c2a-9de6-3618a82b2bb9	f80b3a58-34c2-4ae7-9d20-6ec19d70b402	acdafa98-5779-491b-b172-a6aeb14c5af1	Tính đóng gói	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6823f141-689b-4a33-b878-265a21e279a3	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.7 SET	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
682df2f4-961e-417d-bab0-6fb1838a8853	00056a9e-d5ba-4913-b44e-db626b329749	961ac01c-382c-4aa5-bae1-d1429f27f06a	6.1 NAMESPACE TRONG C++	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
68468e0b-ee66-4f1e-a6d8-865c835b11bd	5e695d8e-500f-40cf-b5ac-2fd1501381d7	961ac01c-382c-4aa5-bae1-d1429f27f06a	1.3 TỔNG KẾT	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
68d56178-e5f3-4a9e-ab9d-3c6c6a8aee13	1aa80bc2-8195-4d96-b3c1-852a22d3c8cc	ce685ee8-dca7-4304-befd-139a5700bc68	Stack	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
68faf6a2-04a3-402d-9ffa-81bb60f7c9fd	f867c55e-29ee-420a-8bcc-c45012ea43a9	eef4fafb-022a-430f-aad0-9416d37d656c	Các kiểu dữ liệu cơ bản của JavaScript	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
691a8cda-9583-42cc-ba0e-ce0d0935c110	603a9390-65b8-43fd-9678-42382611037b	d1839060-39f5-4877-a610-7036e35dbcaa	5.1 Chuỗi kí tự	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
69299fb1-ec72-49b3-8fd7-3674482e8f3f	82938d8a-fa31-4c7d-9122-12be8dce501e	fa7b1920-a356-48af-b27e-46550a64a8dc	Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
694dafe1-1db8-429c-987c-ce4d31298649	c3bb7a1a-a6e1-4471-a71b-ff9a4eb042dd	3cfe0502-a9d6-4353-b87f-ed417a83124f	9.3 Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
69743912-48f5-4a4f-adea-aaabe8e2ee49	5f970759-175f-48ea-bcfe-c27c4409bb13	3cfe0502-a9d6-4353-b87f-ed417a83124f	6.1 Giới thiệu vòng lặp	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
69ce12b4-3641-40fb-942d-1d4bff8bf997	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Hàm Python	0	aA	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
69ce6a56-e322-4f1e-acf9-457c8d9e7ce6	8a812c9d-4a4d-4c66-8e9b-6d0784ceba7f	743dd717-48b2-45b1-b9c0-8ded60965ecb	4.1 Các loại toán tử trong Java	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
69de0e4e-6dec-4ae3-af17-d08b37597abb	fc87a170-547a-4ced-81ae-3274a87caa0d	e2b33def-af48-4e4c-b6cd-863a630f8ee7	Tham lam	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6aae1c69-2d40-4bce-9df6-877768200001	b7ccd7f8-b737-4d9b-9bd3-4faec5567b37	eef4fafb-022a-430f-aad0-9416d37d656c	Toán tử trong Javascript	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6b04f379-3623-4d2e-9ec1-23d352250c1a	19f37cb6-945b-493e-8771-835627a148d0	737b5551-e148-4e64-aa54-2e85f82a30ff	Vòng lặp while, do-while	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6c085700-9abb-43f0-8032-7a2d1ea9b775	233919f7-09cc-41bc-b45e-f5f4fdcd6e17	961ac01c-382c-4aa5-bae1-d1429f27f06a	3.2 CÁCH SỬ DỤNG CON TRỎ	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6c23b6bd-7819-4668-ae2e-1dcf9b0aa805	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Vẽ lá cờ Việt Nam bằng Bút vẽ	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6c24411c-fb28-43c7-ba03-e981e82db7cb	d0d53c61-e27e-4450-960c-429ea63d5893	3600145f-dbec-412b-94f1-08942f6afa16	Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6d78f254-4d4c-47b8-a8a2-847323af0303	07cc1c31-5bff-416c-9a73-ff7d44b0650b	d1839060-39f5-4877-a610-7036e35dbcaa	4.3 Cấu trúc rẽ nhánh	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6d9a8c1e-778d-4043-af7a-8914554966a2	434104ff-0f72-45b9-853d-dba6e936bea2	961ac01c-382c-4aa5-bae1-d1429f27f06a	5.1 STRUCT	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
6df44e82-d5b7-4908-a8bb-c52751769e47	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Cáp mạng và phân loại	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
706c521d-e24a-4e4a-a811-69fc2f3b4e2c	84c29e11-da4c-472d-8034-527a88725a96	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Dự án cuối khóa	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
711613ca-2d50-4a72-a90e-7a018baff791	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Biến	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
71575290-6997-4fde-9ab1-73b40039c979	67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Mối quan hệ giữa các đối tượng	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
716f7e14-156b-4604-a676-863ce0cdb593	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Kết hợp dữ liệu	0	aB	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
719d5dfd-9a22-42f5-90c8-6cf3ca64d3a6	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Kiến thức cần chuẩn bị	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
71cf25c2-56b8-4d29-8e71-3265a322a74c	b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Phần mềm ứng dụng: Phần mềm văn phòng	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7209f59f-9429-484f-a64d-9b3828c9da84	0673c3cb-8017-4f8e-aba4-b60f0ef797a1	3cfe0502-a9d6-4353-b87f-ed417a83124f	2.4 Ép kiểu dữ liệu	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
72169d59-c215-4bc0-93ef-b00cfab2547a	0673c3cb-8017-4f8e-aba4-b60f0ef797a1	3cfe0502-a9d6-4353-b87f-ed417a83124f	2.2 Kiểu dữ liệu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
72ed15e4-1128-4040-9bca-735390031692	95b06f40-f331-47fc-be32-89793d374830	fa7b1920-a356-48af-b27e-46550a64a8dc	Tổng kết	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
73309000-d3f2-48ee-9297-a26e9b777506	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Biến	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
736ec45e-fa79-4aa5-a901-2d1c31f70b76	255b3c07-c453-4783-96ef-ae10698fbabd	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Làm game Gà qua đường	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
73707d27-e5df-4527-bac2-d1aa00963356	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Sửa đổi dữ liệu	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
73729b6a-fdb1-4dd9-822c-63212ba6c4f0	2737e6c4-1a69-419a-9532-8914175c527d	743dd717-48b2-45b1-b9c0-8ded60965ecb	7.1 Khái niệm và cách khai báo mảng một chiều	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
73923dbc-5bb9-4ec3-aa69-b81f8f1fa7b5	82938d8a-fa31-4c7d-9122-12be8dce501e	fa7b1920-a356-48af-b27e-46550a64a8dc	Nhập xuất dữ liệu	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
73f011c0-0be6-496b-8706-848fbdfb2b5f	dbadb58f-5618-4ab1-be7d-ab0067c665a2	3ffa0664-7966-4aa4-9557-049c00d033b7	Dynamic Programing	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
73f9fc2e-df41-4a8a-87eb-921b0f02d0d6	e061903f-9d59-4a06-9953-7800b61be90a	fa7b1920-a356-48af-b27e-46550a64a8dc	Giới thiệu khóa học và nội dung	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
74253e2f-1df6-40db-9ecd-37a8e62bbcac	7e5584ec-4af7-405e-aa5b-7bac9149303a	3ffa0664-7966-4aa4-9557-049c00d033b7	Giới thiệu khóa học	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
742f4b5a-e249-4864-8d25-6cca40dcb7e5	ef55e99a-89af-4040-8547-3ce1ed99aeea	743dd717-48b2-45b1-b9c0-8ded60965ecb	2.4 Ép kiểu dữ liệu	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
75137c2c-b141-43dc-8861-1f3ddc768508	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Các câu lệnh điều kiện	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
758a9c69-30fe-4632-a367-0a9510a78c7f	434104ff-0f72-45b9-853d-dba6e936bea2	961ac01c-382c-4aa5-bae1-d1429f27f06a	5.4 TỔNG KẾT	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
76344c2c-f1dd-46c4-8939-17646de8b485	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Chương trình C đầu tiên	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
764587b6-202c-4d20-8298-fc58d9f0a0b5	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Thao tác với văn bản	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7670b87e-2ebb-42f2-982d-3c7deff7c18c	cbabfde1-dc78-4d4b-8615-285b122b9937	737b5551-e148-4e64-aa54-2e85f82a30ff	Biến và cách khai báo	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
77391cc6-ae8b-4acd-979f-d6f9cd29304e	07cc1c31-5bff-416c-9a73-ff7d44b0650b	d1839060-39f5-4877-a610-7036e35dbcaa	4.6 Tổng kết	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
78195f92-a240-49a8-b370-c54834738f7e	603a9390-65b8-43fd-9678-42382611037b	d1839060-39f5-4877-a610-7036e35dbcaa	5.2 Các phép toán chuỗi cơ bản	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
781ad4a9-03b1-4e91-9c9b-b474c52d47a5	69b1070f-85d6-478e-912a-eb0188b372ec	737b5551-e148-4e64-aa54-2e85f82a30ff	Các toán tử	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
784f6911-2050-43d1-8093-6a24aa5bc059	0c187fb6-d795-4387-aa3f-21f1cbf01a7c	6097a7ef-548b-4542-8c60-5ee180d2dd96	Bài kiểm tra số 1	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
78f79366-a79d-442b-bb10-47afbc417569	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Vòng lặp: while và do-while	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7a724f0c-9f16-4632-a87c-5b92b5a184d0	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Giải thuật tìm kiếm	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7c3cf90b-fab1-49a4-9ed9-a748888ea469	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Trò chơi mèo bắt cá	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7c479a2a-fa8a-4df6-a575-8e10b9cb8629	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Chuẩn hóa cơ sở dữ liệu	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7cc44e4c-295f-4222-9010-3688c1a6f35e	d8e5d8e5-7b6c-4c5b-9209-821e9a533c7a	3cfe0502-a9d6-4353-b87f-ed417a83124f	1.2 Thiết lập môi trường phát triển	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7cfef930-ad4b-4df4-bf5a-90d2965694b4	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Nguồn điện	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7d3e353c-7b6f-4712-90c4-30e0c4d438ad	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Vòng lặp	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7d7e735c-342f-4cdb-8f10-ebe2e4129d18	d0d53c61-e27e-4450-960c-429ea63d5893	3600145f-dbec-412b-94f1-08942f6afa16	Từ điển	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7e80663f-307d-40cf-8b36-52419e3531f8	045487cf-89ba-4503-b6e1-20e2e03144b7	743dd717-48b2-45b1-b9c0-8ded60965ecb	5.1 Cấu trúc if-else	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
7fcd7339-ef1e-49c5-8076-5493d7bcd2d4	045487cf-89ba-4503-b6e1-20e2e03144b7	743dd717-48b2-45b1-b9c0-8ded60965ecb	5.3 Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
80b3478f-aab3-444a-9c1f-9625fa2ade60	e4a52d5e-e0a5-458e-9eb7-252490f0dcc9	3600145f-dbec-412b-94f1-08942f6afa16	Ôn tập kiến thức cơ bản	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
80eb9a93-6eaf-4155-b684-9a7ab092a3ae	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Giới thiệu về máy tính	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
817178a9-b383-4252-b450-fb8ea1384a17	fc87a170-547a-4ced-81ae-3274a87caa0d	e2b33def-af48-4e4c-b6cd-863a630f8ee7	Quay lui	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
818314f9-41ac-4076-a3dd-767ff7576491	eb01ed8f-8fe0-40da-a6cf-db9d34076dd5	d1839060-39f5-4877-a610-7036e35dbcaa	3.1 Kiểu dữ liệu số	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
81ae773e-088b-4ac2-bfaa-1de1f8457888	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Vòng lặp	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
81c0c8f2-4527-41b7-a15c-997ffa9102b5	ab47bae5-87c4-46ff-8959-2e40badedc8c	737b5551-e148-4e64-aa54-2e85f82a30ff	Mệnh đề if else phức tạp	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
825f43ff-c154-4d35-b742-5dd30f0fa16b	d0d53c61-e27e-4450-960c-429ea63d5893	3600145f-dbec-412b-94f1-08942f6afa16	Tuple	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
827cc3f3-3c78-4387-aa7e-1c89c31ed44b	ef55e99a-89af-4040-8547-3ce1ed99aeea	743dd717-48b2-45b1-b9c0-8ded60965ecb	2.1 Chú thích trong Java	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
83acc004-e8a1-48d3-a31b-2080790a7b25	32c7970e-d889-47c5-ba13-1bf59309402d	e79d99e5-6325-4f50-833d-ee7de5bc43c1	Giới thiệu AI và ứng dụng	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
847126be-39aa-4fb8-a293-64ae72d22b14	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Phương thức mảng	0	aA	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
84c8bcf9-95dd-4dc2-9ab6-f4c2c2978f69	a1f7c649-c30c-4be2-9541-d51de4712954	3cfe0502-a9d6-4353-b87f-ed417a83124f	3.2 Print newline	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
85435a7b-e93b-40df-ab85-872091554f54	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Giới thiệu khóa học và nội dung	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
864b64e2-9009-41f9-99eb-7eab9611a6c4	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Mảng	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8677d703-ec78-48fd-ae23-0705460eb04c	d4001112-3495-4491-8523-3a632ebb407b	d1839060-39f5-4877-a610-7036e35dbcaa	6.3 Các kiểu hàm	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
86e76471-25d1-47a4-8720-87764be9beb7	07cc1c31-5bff-416c-9a73-ff7d44b0650b	d1839060-39f5-4877-a610-7036e35dbcaa	4.2 Toán tử logic	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
86eab7b3-9231-438c-b4b9-5485c84d81a4	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Phương thức dữ liệu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
87b1a3d7-5d0d-47e7-b117-6c85a3dbda43	761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Thao tác với văn bản	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
88418e20-c4a5-4c62-92a1-61cb4a2cb38c	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Vòng lặp: while và do-while	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
89ca7e37-d3d8-457d-98f2-b4c20657587a	27aa88e7-a021-49a0-82cb-32c2bfd28f02	743dd717-48b2-45b1-b9c0-8ded60965ecb	3.4 Tổng kết	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8a38a878-9539-4ec9-b3c9-aef5874297fe	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Phương thức trong Java	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8ac35edd-07b9-4013-94b4-e224968b78be	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Phương thức object	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8afd5524-44b8-43f7-b881-9577cd92aa9d	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Ràng buộc trong SQL	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8b01a2e8-e683-4b0e-9487-284476cf5540	ff613291-f29e-4aba-a90f-43566082e70f	961ac01c-382c-4aa5-bae1-d1429f27f06a	2.1 GIỚI THIỆU VỀ MỘT SỐ HÀM TOÁN HỌC	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8bb9cf70-bf63-4cbe-b65c-5ea0a41157f4	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Hàm đệ quy	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8bc0b407-c1c1-489e-8095-c72289030a6d	f5d36d9c-624b-4648-b875-190a2aa9f400	743dd717-48b2-45b1-b9c0-8ded60965ecb	9.3 Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8c2d7584-6469-496a-bdd6-7cc91c5ca423	67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Lớp và đối tượng	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8d4bfeea-9d7b-4a9a-bbca-422501af77a4	0c187fb6-d795-4387-aa3f-21f1cbf01a7c	6097a7ef-548b-4542-8c60-5ee180d2dd96	Game Cá lớn nuốt cá bé	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8de4ac4f-1f47-4b85-a56e-7202017a7b99	761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Các hàm windown	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8e6360e3-c973-44ee-9375-7c4c36f9e061	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Cấu trúc dữ liệu đồ thị	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8e790b84-f89d-430a-9c72-48e8ea0ea29a	4cbd5ad7-d0d2-4994-99a9-d2d2afd7e645	d1839060-39f5-4877-a610-7036e35dbcaa	2.2 Biến	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8eccaa8b-f125-4a7a-a149-ad22abbba613	a06f1f45-b23e-427c-b114-aa4444c4c111	3ffa0664-7966-4aa4-9557-049c00d033b7	Stack	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
8ef663e4-545e-42d4-885a-a61babd7f7bb	82938d8a-fa31-4c7d-9122-12be8dce501e	fa7b1920-a356-48af-b27e-46550a64a8dc	Biến	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
90561466-4ef2-436f-b3d8-a563509578ed	a06f1f45-b23e-427c-b114-aa4444c4c111	3ffa0664-7966-4aa4-9557-049c00d033b7	Tree	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
91478ccb-f283-4bca-94ac-bd3700fafb7a	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Mở rộng	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9231558a-62b5-4a9d-a280-9216fe64b052	ee5bbb65-4634-4c64-b289-9229a42a313b	3ffa0664-7966-4aa4-9557-049c00d033b7	Graph Traversal	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
941e94a7-7c35-4a81-8502-c64b1c8f2bf1	2737e6c4-1a69-419a-9532-8914175c527d	743dd717-48b2-45b1-b9c0-8ded60965ecb	7.4 Mảng 2 chiều	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9446d7c4-cdd2-4be5-ac62-cb9960cad1e9	eaf42478-1f56-4402-9c5d-272beaa42f7c	961ac01c-382c-4aa5-bae1-d1429f27f06a	4.2 MỘT SỐ BÀI TẬP VỀ ĐỆ QUY	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9505d42b-baab-4dc2-a0d5-72cef8fd3215	652b916f-f7aa-4fe9-b699-a3b563d1e3bf	737b5551-e148-4e64-aa54-2e85f82a30ff	Mảng trong C#	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
953bdbba-2b4d-4896-882b-92af8a0cea85	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.1 KHÁI QUÁT VỀ TIME VÀ SPACE COMPLEXITY	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
96191de0-b04b-4106-a4bc-af8f0ae85352	f80b3a58-34c2-4ae7-9d20-6ec19d70b402	acdafa98-5779-491b-b172-a6aeb14c5af1	Mối quan hệ giữa các đối tượng	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
96380613-e3bf-4d25-97e6-e02fd347217c	233919f7-09cc-41bc-b45e-f5f4fdcd6e17	961ac01c-382c-4aa5-bae1-d1429f27f06a	3.6 THAM CHIẾU	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
96ca337e-20e7-45ea-bfa5-b1c3d2d83003	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Chuẩn hóa cơ sở dữ liệu	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
973fe404-138a-4636-9302-cf720f33ecce	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Các cú pháp SQL cơ bản	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
98a2f40f-8c33-46eb-9e6c-714fa4e47c44	e119e517-1a3c-4756-bc71-8124ede492e7	3cfe0502-a9d6-4353-b87f-ed417a83124f	4.3 Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9931641b-e9f4-4ee6-ab35-e3a0dfb32d45	0e36950e-fe57-40da-b564-9ef4866b2c24	743dd717-48b2-45b1-b9c0-8ded60965ecb	6.1 Giới thiệu vòng lặp	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
99316f9a-72eb-4c2c-9954-bc551d1c87db	b1ba46fe-75f1-4447-8cb0-d4a6c81e1b51	eef4fafb-022a-430f-aad0-9416d37d656c	Câu điều kiện trong Javascript	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
99d4096c-8128-4853-b812-e63197d0b9f7	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Mảng	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
99e3899d-9f18-4be3-92dc-c86211ccd7e2	603a9390-65b8-43fd-9678-42382611037b	d1839060-39f5-4877-a610-7036e35dbcaa	5.4 Chuỗi nằm trong chuỗi khác	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9a7932cb-7370-469b-8cbb-fd75361d2000	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Gộp nhiều bảng	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9b689cac-3bd9-4c96-bc97-2e26578ca681	761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Các hàm toán học	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9d616eec-4d04-4cda-a5e1-a1ae4ae37efc	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Chương trình C++ đầu tiên	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9ed392f4-7f4e-4f79-b4c9-dafcca590c7a	d8e5d8e5-7b6c-4c5b-9209-821e9a533c7a	3cfe0502-a9d6-4353-b87f-ed417a83124f	1.3 Cấu trúc chung chương trình C++	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9f678920-add5-4f08-b3aa-a9f3a88cb1f8	60d3e2b3-b6e9-41c7-a44c-8139e7b1662d	3cfe0502-a9d6-4353-b87f-ed417a83124f	8.1 Giới thiệu về string	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9facbecd-271f-4d4a-bfc1-fe9a85877f39	d0d53c61-e27e-4450-960c-429ea63d5893	3600145f-dbec-412b-94f1-08942f6afa16	Danh sách	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
9fcdcb53-eef7-4b64-b100-f0f3f837e16c	e3aa1c57-0005-4713-8b26-9a125169bc56	743dd717-48b2-45b1-b9c0-8ded60965ecb	1.1 Giới thiệu về lập trình và Java	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a01c7451-46a1-438d-98f2-2db6d9402c24	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Phương thức toán học	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a0fd1d26-9a4e-4d5b-a8a4-c7af00deb8d3	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Vòng lặp	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a1873476-920e-41ac-8036-dc82cf06a69f	a9a98c85-d92a-4980-a5fe-514d1b8b50a3	6097a7ef-548b-4542-8c60-5ee180d2dd96	Vẽ hình	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a23b65b5-404b-4e1c-a26f-cde72111c245	ef55e99a-89af-4040-8547-3ce1ed99aeea	743dd717-48b2-45b1-b9c0-8ded60965ecb	2.3 Biến	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a282a055-c98e-4052-81f8-097b1f61081c	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Các loại hình mạng và phân loại	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a473c34b-6186-48bb-af6a-d4806ed2fdd0	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Câu hỏi cuối khóa 1	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a50e7171-8d68-4b37-8cff-336e262eb54b	bfc8c9f6-6861-47e7-b8e9-7395048353a4	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Thuộc tính Position	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a50e9dc1-92f5-4c22-9dd3-3cccf1ea4322	c3bb7a1a-a6e1-4471-a71b-ff9a4eb042dd	3cfe0502-a9d6-4353-b87f-ed417a83124f	9.1 Giới thiệu về hàm trong C++	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a531d510-f9d5-4810-98cd-066b395b9abc	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Tổng quan về khóa học	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a54260f0-6dbc-4962-a24e-fad90d9db08c	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Giới thiệu về cơ sở dữ liệu	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a57f8d45-c3a8-4a5e-adcd-cf3a15f664c0	f5d36d9c-624b-4648-b875-190a2aa9f400	743dd717-48b2-45b1-b9c0-8ded60965ecb	9.1 Giới thiệu về hàm trong Java	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a5bdba44-9ed7-4165-9d31-39ce5917add1	bd6222e5-280f-4779-b6b7-1a845f8d4495	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Responsive trong CSS	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a5e7a5eb-0249-4840-a769-1240fab44348	f5d36d9c-624b-4648-b875-190a2aa9f400	743dd717-48b2-45b1-b9c0-8ded60965ecb	9.2 Đối số và tham số, tham trị và tham chiếu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a714a52f-a4e3-42ba-9c46-d557d8a2e662	2f8f6d1a-4c46-40a8-a903-1bbadba79247	f996fe4f-4ab1-4979-9193-3881a8a806c9	Mảng	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a721bf6a-edfa-44f5-b28b-2c93a2ef9585	a1f7c649-c30c-4be2-9541-d51de4712954	3cfe0502-a9d6-4353-b87f-ed417a83124f	3.4 Tổng kết	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a8cf0fa0-3337-4da9-8bd2-724be25a419e	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Công cụ tự động hóa 2: Tự động gửi mail	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a8f185e8-3386-4e78-859a-be8d65972c20	32aa5bd2-27bf-4235-8887-ac9195a06a74	737b5551-e148-4e64-aa54-2e85f82a30ff	Xử lý xâu	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
a9c65ccf-47f2-4083-8a0f-4b62af502b68	6724d6fa-d2b4-4a7d-9123-0fc06dab0123	961ac01c-382c-4aa5-bae1-d1429f27f06a	7.1 XỬ LÝ NGOẠI LỆ C++	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ab805c43-240b-4f58-bef2-b4a9c5c8dc48	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Các toán tử và đầu vào	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
acdb9840-62a1-4beb-a932-e82fa766c26f	bda31c86-19c9-4da5-9a73-152e6c900589	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	CSS selectors	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ad54ff08-4b4c-48ca-b770-966f6e5a5577	1aa80bc2-8195-4d96-b3c1-852a22d3c8cc	ce685ee8-dca7-4304-befd-139a5700bc68	Map	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ad95f5b5-63d3-45b5-8176-cf300b28a05e	ef55e99a-89af-4040-8547-3ce1ed99aeea	743dd717-48b2-45b1-b9c0-8ded60965ecb	2.5 Phạm vi của biến	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ae3a77ff-cd96-4598-8721-f5808ae4d40b	761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Biểu thức điều kiện	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
aea15717-ead4-4a3e-bd29-0a313cbe9a10	f867c55e-29ee-420a-8bcc-c45012ea43a9	eef4fafb-022a-430f-aad0-9416d37d656c	Chuyển đổi kiểu và ép kiểu dữ liệu	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
aede4e6f-e67d-4b57-a4b1-ab059af15f62	67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Tính kế thừa	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
affe9aa6-6397-4b10-9f18-01b34dab38b6	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Công cụ tự động hóa 1: Quản lý file và thư mục	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b1e9df5d-55f7-4f1d-89c1-29a0ff80d2a5	67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Tính đóng gói	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b254302b-b94e-4a1e-bd80-bf8809f64ae9	0f705c03-0eed-485b-a440-caf811670cb5	3cfe0502-a9d6-4353-b87f-ed417a83124f	7.4 Mảng 2 chiều	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b2be8018-5a40-4755-98bb-858f6af65e4b	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Vòng lặp: for	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b2e4ebaa-5732-40f6-9a83-b82d1dd3e9ba	2f8f6d1a-4c46-40a8-a903-1bbadba79247	f996fe4f-4ab1-4979-9193-3881a8a806c9	Con trỏ	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b435387a-67eb-48ef-bdc5-e452efa25dbc	d6a96253-4181-4a55-a304-1be89ba51175	737b5551-e148-4e64-aa54-2e85f82a30ff	First C# Program	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b6009807-c8bd-4366-a4df-4a39b0886a28	579b2a4f-6031-4429-b244-2061c4e519e0	3ffa0664-7966-4aa4-9557-049c00d033b7	Thuật toán sắp xếp	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b6ee040f-7ae2-435c-9945-bc928981af0d	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.4 QUEUE VÀ DEQUEUE	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b852b9dd-05ea-4462-a76c-270eb7477de4	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Thao tác với dữ liệu trong bảng	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b85c2dc7-6e72-4413-93a6-acebbb845916	4245ba29-529d-4739-bc2b-b774082f6c58	3600145f-dbec-412b-94f1-08942f6afa16	Làm việc với Package	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b89bb9af-077e-4799-8f1e-c946185453b7	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Toán tử cơ bản	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b96034cf-814b-4f81-9f29-4c8383fc017d	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Câu hỏi cuối khóa 2	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b9933d0c-cba1-4a90-b224-ca9ed10b1ce9	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Cấu trúc dữ liệu cây	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
b9e623c1-07bd-4526-9a17-e9e93e7b2e8d	67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Biến tĩnh, phương thức tĩnh	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ba5174cc-8be0-460e-9c10-198d62817a9a	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Trò chơi Chú gấu phiêu lưu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
bac94a08-f433-40f2-82c1-70cea2082cc2	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Biến và kiểu dữ liệu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
bb439488-93ef-4cd4-ad7f-9e4a35769e7f	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Khởi tạo bảng	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
bbf3bf6a-1f87-4c62-89d8-e637f8876df0	045487cf-89ba-4503-b6e1-20e2e03144b7	743dd717-48b2-45b1-b9c0-8ded60965ecb	5.2 Switch case	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
bd76b615-cb07-4368-9f2d-52c6b3cf2e87	0673c3cb-8017-4f8e-aba4-b60f0ef797a1	3cfe0502-a9d6-4353-b87f-ed417a83124f	2.1 Chú thích trong C++	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
bd9552da-aac8-4462-97a4-7bed797c43cf	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Quản lý bảng	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
beab2097-78fa-4d03-ad20-f8e19d466e0f	67b842a2-8bcc-45b6-ad31-73c0d0e09801	3a705a75-7389-4e97-aeb8-58a58616032b	Bài tập rèn luyện	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
bfdc274c-b6b9-4838-bdbd-e1f4a33c88d3	e3aa1c57-0005-4713-8b26-9a125169bc56	743dd717-48b2-45b1-b9c0-8ded60965ecb	1.5 Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
c1688351-a5b2-46d8-9397-5d8398fa713f	1a75260f-329e-4b1a-963e-6f0856b59bcd	eef4fafb-022a-430f-aad0-9416d37d656c	Bài tập và kiểm tra cuối khóa	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
c1827ae8-b659-4968-b518-7bd87d328e01	613cf8e9-fef7-4c87-8dbf-94eb65106cbe	beb4ad6a-76c6-4a1c-aad1-83e3aff6cdfc	Các vấn đề thường gặp	0	aA	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
c2477c02-14f8-431e-a586-097ec93c9969	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Thao tác với dữ liệu trong bảng	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
c25f41d9-abe4-42c5-b873-5f9d53b32b9a	32c7970e-d889-47c5-ba13-1bf59309402d	e79d99e5-6325-4f50-833d-ee7de5bc43c1	Ứng dụng AI trong việc tạo và xử lý ảnh	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
c50f6086-3717-4653-be84-de8139e8d6c1	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Trò chơi Chú gấu phiêu lưu (tiếp theo)	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
c694a863-f49b-4b3c-a727-ce5e49bf88c4	f867c55e-29ee-420a-8bcc-c45012ea43a9	eef4fafb-022a-430f-aad0-9416d37d656c	Biến trong Javascript	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
c923c0b3-c571-4a38-913c-3217b554b3ac	f80b3a58-34c2-4ae7-9d20-6ec19d70b402	acdafa98-5779-491b-b172-a6aeb14c5af1	Tính đa hình và trừu tượng	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
cb48fe05-39b7-432b-b5d5-943fe49e8083	32c7970e-d889-47c5-ba13-1bf59309402d	e79d99e5-6325-4f50-833d-ee7de5bc43c1	Ứng dụng AI trong việc xử lý video	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
cb529ab4-fe25-4824-aaf9-d0dd0172e2d5	291d0934-6ac5-48ef-944d-cdc06b84b300	737b5551-e148-4e64-aa54-2e85f82a30ff	Hàm trong C#	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
cbc5788d-9be6-469e-89c0-3eeaeb0fcb73	eea6930e-4a28-42b9-846f-80f642087f1d	fa7b1920-a356-48af-b27e-46550a64a8dc	Phương thức trong C#	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ccc7b344-9b8c-459b-9811-ff4add2b8f96	1d71ef9c-b28e-4f0b-8439-544d893fb0be	eef4fafb-022a-430f-aad0-9416d37d656c	Cấu trúc mã JavaScript	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
cd04a9ab-cc90-41fa-b25a-36babef6765b	b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Phần mềm ứng dụng: Trình soạn thảo và lập trình	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ce07cb6c-dd7d-41ba-af7a-85e5c9bc8329	2f98161f-7782-444c-aa95-799b88d59c60	f9713740-694e-444f-98f3-d506f13c7914	Làm việc với ngày/giờ	0	aA	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
cf40c5e3-28d2-42de-aab8-cc116bd14c03	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Ngăn xếp và hàng đợi	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
cf912b1a-f1ab-4c5f-bcb9-b0b5edf912fa	5e695d8e-500f-40cf-b5ac-2fd1501381d7	961ac01c-382c-4aa5-bae1-d1429f27f06a	1.1 ĐỌC FILE	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d0ab2e1b-57a7-4fdc-a324-57954779d576	761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Làm việc với ngày/giờ	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d0d5b935-3642-4627-86b2-5b37a842a730	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Dãy số	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d1ff77fa-ac5a-497a-aae0-81f9b6acacff	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Công cụ lập trình	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d2788b66-0224-4600-ad92-593bbda6fd6a	a9a98c85-d92a-4980-a5fe-514d1b8b50a3	6097a7ef-548b-4542-8c60-5ee180d2dd96	Bài kiểm tra số 2	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d2c05d3b-2245-4218-9b84-72f4d0e7b57e	0e36950e-fe57-40da-b564-9ef4866b2c24	743dd717-48b2-45b1-b9c0-8ded60965ecb	6.4 Tổng kết	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d2ceb872-55a3-4c64-9ffa-9996331e1e3b	b8cf0954-df72-4697-a3aa-c511c27460b4	a9238453-835c-4c08-96e3-7a6b41bb2b76	Giới thiệu về hệ điều hành	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d3337bd7-2312-4194-b5ca-baddb5cc7034	f0fdd269-aacf-41ee-9086-c74c6337b50e	d1839060-39f5-4877-a610-7036e35dbcaa	1.1 Giới thiệu chung	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d339d274-4ebf-4049-8b8c-39d4dbf5bace	4ee9c053-98a1-45c5-8422-1448d19346dc	961ac01c-382c-4aa5-bae1-d1429f27f06a	8.8 PRIORITY-QUEUE	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d36c42f5-09ff-4994-b7c8-9db5ebc8dec2	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Câu lệ rẽ nhánh	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d39278f6-e2c4-4ce0-bf5f-db9b198e5441	27aa88e7-a021-49a0-82cb-32c2bfd28f02	743dd717-48b2-45b1-b9c0-8ded60965ecb	3.1 Cú pháp nhập - xuất dữ liệu	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d3ec3646-af04-4a83-b451-49fab18cbcab	d4001112-3495-4491-8523-3a632ebb407b	d1839060-39f5-4877-a610-7036e35dbcaa	6.1 Tạo hàm đơn giản	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d45cdce9-8250-4fd2-94d3-b81c6aba45b3	5f970759-175f-48ea-bcfe-c27c4409bb13	3cfe0502-a9d6-4353-b87f-ed417a83124f	6.2 Vòng lặp lồng nhau	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d4c1cfeb-6222-49cd-b987-dbd3b1ca2873	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Quản lý Bảng	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d6e0a747-2889-43b8-bc9a-c11644d18404	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Bảo quản và sử dụng thiết bị	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d70d41cd-4c74-4ade-aae6-7144929b5a64	fc87a170-547a-4ced-81ae-3274a87caa0d	e2b33def-af48-4e4c-b6cd-863a630f8ee7	Đồ thị cây	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d736fa08-0717-4835-b04f-4cec548f3dc3	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Mảng	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d7a4bc94-15c1-495c-acdc-82c603abbf26	36860b84-ee67-4b15-9533-1c53d00c48b8	743dd717-48b2-45b1-b9c0-8ded60965ecb	8.1 Giới thiệu về String	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d80a1589-8edf-423c-992b-17e7f3a2618b	7e5584ec-4af7-405e-aa5b-7bac9149303a	3ffa0664-7966-4aa4-9557-049c00d033b7	Phân tích độ phức tạp	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d8faa4c0-5943-4c52-a0dd-51435e78a629	bda31c86-19c9-4da5-9a73-152e6c900589	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Đơn vị trong CSS	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
d9bbd15d-a3b7-4b7b-b037-aedaa4a534f0	f80b3a58-34c2-4ae7-9d20-6ec19d70b402	acdafa98-5779-491b-b172-a6aeb14c5af1	Bài tập trắc nghiệm	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
dc702f13-714b-4fad-b386-562beda4c058	b7ccd7f8-b737-4d9b-9bd3-4faec5567b37	eef4fafb-022a-430f-aad0-9416d37d656c	Mảng trong Javascript	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
dc7143b1-4fd0-41ed-b03f-5b33d1f9b2c5	eb01ed8f-8fe0-40da-a6cf-db9d34076dd5	d1839060-39f5-4877-a610-7036e35dbcaa	3.5 Định dạng kiểu số	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
dc7a9064-88de-4a0c-82ed-079f140a54cf	f0ab2743-49da-46c1-b881-2862ba77471a	e166a9f1-6df5-4b31-86b6-66b419634bd9	Biến và các kiểu dữ liệu	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
dda54e6c-e082-44be-8884-e2611b98d6f9	2737e6c4-1a69-419a-9532-8914175c527d	743dd717-48b2-45b1-b9c0-8ded60965ecb	7.5 Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ddc3f6f1-5abd-4760-a6b4-02f23389d543	eea6930e-4a28-42b9-846f-80f642087f1d	fa7b1920-a356-48af-b27e-46550a64a8dc	Lớp Math trong C#	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
de09e696-940e-4e60-86ff-30bfe3a897ad	761b448f-6f63-4f8a-914c-c5fb8fb69c7b	dc53780b-eb7a-4b88-8a8a-9aed47590056	Các mệnh đề SET	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
df4ca97a-613d-4208-8960-74f50e501de8	603a9390-65b8-43fd-9678-42382611037b	d1839060-39f5-4877-a610-7036e35dbcaa	5.3 Một số phương thức chuỗi	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
df7554ff-f7fa-4824-a7a7-d0d9e2f52663	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Công cụ tự động hóa 3: Tự động hóa trình duyệt	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
dfe3a7dd-f129-40c4-a653-44dabe5592a0	4cbd5ad7-d0d2-4994-99a9-d2d2afd7e645	d1839060-39f5-4877-a610-7036e35dbcaa	2.5 Định dạng chuỗi	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e0b66c7a-a24b-450d-bc80-94fbdc45eaea	233919f7-09cc-41bc-b45e-f5f4fdcd6e17	961ac01c-382c-4aa5-bae1-d1429f27f06a	3.1 GIỚI THIỆU VỀ CON TRỎ	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e0fa761b-311f-4a95-acb0-65198f5d375e	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Truy vấn dữ liệu	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e1c41720-4e7f-4089-b991-8716822b401b	0f705c03-0eed-485b-a440-caf811670cb5	3cfe0502-a9d6-4353-b87f-ed417a83124f	7.5 Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e273f84f-b9e1-44f9-a835-0c5f02c471be	ab47bae5-87c4-46ff-8959-2e40badedc8c	737b5551-e148-4e64-aa54-2e85f82a30ff	Mệnh đề if else	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e2a5d1e3-dbec-4442-9eb2-f520140628e0	2737e6c4-1a69-419a-9532-8914175c527d	743dd717-48b2-45b1-b9c0-8ded60965ecb	7.3 Hàm sort mảng một chiều	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e3676b44-c66d-4c26-a94d-cceecaa0be44	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Thiết bị nhập dữ liệu	0	a9	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e38cf5e1-3d09-475c-97e9-eea1327a0360	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Lập trình thuật toán tìm số nguyên tố	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e3cbd2ef-86f2-46f0-a24a-34ec1e2402de	603a9390-65b8-43fd-9678-42382611037b	d1839060-39f5-4877-a610-7036e35dbcaa	5.5 Tổng kết	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e46682fb-86ec-40e2-9126-1feb15debbe2	a06f1f45-b23e-427c-b114-aa4444c4c111	3ffa0664-7966-4aa4-9557-049c00d033b7	Queue	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e47ae315-381c-435d-8316-a6a6ce07dcc1	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Tổng quan, console.log và chú thích	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e52c22b6-1850-4873-954a-8bf2090ff768	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Các kiểu dữ liệu trong SQL	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e53be42f-7bd3-4696-b5ea-23a5a0852c8b	27aa88e7-a021-49a0-82cb-32c2bfd28f02	743dd717-48b2-45b1-b9c0-8ded60965ecb	3.2 Print Newline	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e55140ca-be71-40ba-be28-e2a82bfb9a8d	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Giới thiệu khóa học và nội dung	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e553fb7f-9b1c-4d2e-a8b3-53d039606a2b	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Ràng buộc trong SQL	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e5546e72-d56f-4f70-9d9c-f3361b650689	a06f1f45-b23e-427c-b114-aa4444c4c111	3ffa0664-7966-4aa4-9557-049c00d033b7	Array	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e56c9de2-9e33-4334-8f5e-555c4d20ac68	01f76acf-40d6-4601-92f5-c23bc6625a5f	3600145f-dbec-412b-94f1-08942f6afa16	Lớp và đối tượng	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e5a0ee2a-2097-4d1f-bd7c-3a3d432317f7	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Thiết bị lưu trữ dữ liệu	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e60f4586-f7dd-4a25-8840-d41a73f164ef	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Tổng quan về điện toán đám mây	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e68df09f-8a4d-499d-8095-95e70e156dab	32c7970e-d889-47c5-ba13-1bf59309402d	e79d99e5-6325-4f50-833d-ee7de5bc43c1	AI và tiện ích văn bản	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e6ad9e66-f65c-4516-8ba0-f45083b8fa07	eb01ed8f-8fe0-40da-a6cf-db9d34076dd5	d1839060-39f5-4877-a610-7036e35dbcaa	3.3 Toán tử gán	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
e9d5f308-0afc-4d47-9528-0be2597234b2	0f705c03-0eed-485b-a440-caf811670cb5	3cfe0502-a9d6-4353-b87f-ed417a83124f	7.1 Khái niệm và cách khai báo mảng 1 chiều	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
eb45bcba-5fa7-48c3-8104-6a1d79368f71	1aa80bc2-8195-4d96-b3c1-852a22d3c8cc	ce685ee8-dca7-4304-befd-139a5700bc68	bitset	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
eb6f4029-1471-4e20-a4d1-9c8a7e1cee5e	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Trò chơi Hái sao	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ec206af4-b9aa-4903-bb38-dd6a8e5417bf	1aa80bc2-8195-4d96-b3c1-852a22d3c8cc	ce685ee8-dca7-4304-befd-139a5700bc68	Vector	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ec616684-531b-4e0f-b1b0-6fa518e03fcb	e4a52d5e-e0a5-458e-9eb7-252490f0dcc9	3600145f-dbec-412b-94f1-08942f6afa16	Cài đặt môi trường lập trình Visual Studio Code	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ecf349d8-5c52-46a6-9bb9-3b21b74e3fd0	d29a8eb3-c15c-483a-8689-db85f3561079	7e7c3458-5caa-43c3-84d7-383ac98097f1	Hiểu biết về những ràng buộc	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ed486305-966d-471a-99ff-58024653706d	f7883cb8-eb35-47c0-a110-4fa5b40f4c1f	eef4fafb-022a-430f-aad0-9416d37d656c	Giới thiệu về bất đồng bộ	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
eeb7f5b5-8e33-4ded-b491-6276125ba1de	f80b3a58-34c2-4ae7-9d20-6ec19d70b402	acdafa98-5779-491b-b172-a6aeb14c5af1	Tính kế thừa	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
eefc111c-1158-4461-8f58-970b021446e7	753659d3-4545-4b7e-a74c-6bdc7335fe3e	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Làm việc với HTML	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
ef48d4df-6d34-4b01-b862-b8b4d985b8ff	95b06f40-f331-47fc-be32-89793d374830	fa7b1920-a356-48af-b27e-46550a64a8dc	Vòng lặp	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
efb82d7b-7d96-4f03-a436-8d61b0592528	eb1f6aea-2cd3-4885-8897-a096ac15981f	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Cài đặt môi trường	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f0a7e95d-ddd1-4aec-b685-ae69408aecd2	eb1f6aea-2cd3-4885-8897-a096ac15981f	00f1a774-5bca-44a5-b0ba-255b1d5047d3	Mục tiêu khóa học	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f1eee410-31e4-4fdf-91d3-ac04999bba18	ef55e99a-89af-4040-8547-3ce1ed99aeea	743dd717-48b2-45b1-b9c0-8ded60965ecb	2.2 Kiểu dữ liệu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f239d1d7-9ae5-4b79-b202-61370c264ab1	2e41e951-16a4-4ee6-b352-0f635f1e1fa5	a4058b75-8386-431f-89a8-a28fa65ca6bf	Câu hỏi cuối khóa	0	a8	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f2496cbc-71a3-4971-a960-38e43f3abe2e	752843c7-42af-4fb1-9dd8-a8f9398847c4	3d68c61e-6eec-4416-8214-21930ae35f02	Giải thuật đệ quy	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f262c84f-9de5-466a-a321-82736de980c9	59858042-cdb4-4568-a0cf-4d96777c7703	820b7ae8-fcf9-46f4-b206-36d3bc57a496	Lệnh If - Else và Switch - Case	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f29228ca-fabc-4600-b473-f9266c06df15	4cbd5ad7-d0d2-4994-99a9-d2d2afd7e645	d1839060-39f5-4877-a610-7036e35dbcaa	2.6 Tổng kết	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f2a5c2e3-87b0-4c12-a545-e73daedb3044	e3aa1c57-0005-4713-8b26-9a125169bc56	743dd717-48b2-45b1-b9c0-8ded60965ecb	1.3 Cấu trúc chung chương trình Java	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f378109a-73ef-479e-8efe-15e2a380adad	652b916f-f7aa-4fe9-b699-a3b563d1e3bf	737b5551-e148-4e64-aa54-2e85f82a30ff	Mảng 2 chiều	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f385e595-c77b-4456-85f4-b7521c3adc82	330b22e5-bd9d-4b61-bed6-aaab65c123cf	3dd82fcf-1316-40d6-85bb-a05fc30471db	Công cụ tự động hóa 5: Tích hợp API	0	a7	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f390f37d-7278-4585-bc86-d32acf68f2b1	6f250039-b2e7-45ed-a610-01c4f9f2c518	d1c12cca-e6b1-40a0-b899-d19e62f3fa84	Grid trong CSS	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f3c3f4d6-80e1-4097-9aa3-9cd58a8dcf9d	a06f1f45-b23e-427c-b114-aa4444c4c111	3ffa0664-7966-4aa4-9557-049c00d033b7	Linked List	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f3da57f4-a0b6-4219-8f9d-c481d30e91dd	b517837e-dbf8-444f-b273-a735897c1894	4cd5c8a1-4784-4e9d-a965-c8aed969e868	Cấu trúc rẽ nhánh	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f446571c-cb01-438e-90a0-cfd8b895b06c	55e1b573-f06f-421d-881f-9ba3575ddcec	3600145f-dbec-412b-94f1-08942f6afa16	Những lỗi phổ biến khi bắt đầu lập trình Python	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f5413ad6-2619-4a51-8313-6996a3da1d00	eb01ed8f-8fe0-40da-a6cf-db9d34076dd5	d1839060-39f5-4877-a610-7036e35dbcaa	3.2 Toán tử số học	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f722b76e-0bbc-42f5-86a0-9eb621427888	25171d97-2651-4502-bc58-40cbd572aadf	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Trò chơi Mèo và chuột	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f7ee32df-f774-413d-b51b-910ecc6b256c	dbadb58f-5618-4ab1-be7d-ab0067c665a2	3ffa0664-7966-4aa4-9557-049c00d033b7	Backtracking	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f7f447a0-6c28-4078-ae49-6f802ccd1720	01f76acf-40d6-4601-92f5-c23bc6625a5f	3600145f-dbec-412b-94f1-08942f6afa16	Tổng kết	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f85dfa98-943b-4576-84c7-a314f4dc11f3	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Đầu vào	0	a4	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f896854a-a680-4758-85ce-5b49a38f84cc	426c56a8-b491-42e1-a02a-2cb6f1a9b1cb	97f41add-6aa0-4c20-8ad1-aba7ce768046	Bài tập và kiểm tra	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f8bb80ba-0ded-4f44-88e6-fc44b2527769	fc87a170-547a-4ced-81ae-3274a87caa0d	e2b33def-af48-4e4c-b6cd-863a630f8ee7	Quy hoạch động	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f8ccca27-99eb-4cf7-888d-bba86c3d0865	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Bộ nhớ RAM/ROM	0	a6	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f8d5ae04-b8af-4b6d-9ba4-dd84eebef78c	e4a52d5e-e0a5-458e-9eb7-252490f0dcc9	3600145f-dbec-412b-94f1-08942f6afa16	Giới thiệu khóa học	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f8e5bd2b-8c1d-43bd-bc4c-d8942b78f251	4cbd5ad7-d0d2-4994-99a9-d2d2afd7e645	d1839060-39f5-4877-a610-7036e35dbcaa	2.3 Kiểu dữ liệu	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
f90fa342-36e0-44ad-9efd-bc7fd6f471a5	233919f7-09cc-41bc-b45e-f5f4fdcd6e17	961ac01c-382c-4aa5-bae1-d1429f27f06a	3.3 CON TRỎ TRỎ TỚI MẢNG	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
fa02ed1e-c741-4940-abb0-3d2882f71392	55e1b573-f06f-421d-881f-9ba3575ddcec	3600145f-dbec-412b-94f1-08942f6afa16	Xử lý ngoại lệ trong Python	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
fa228b43-9266-4fdc-ba1d-e4187575471b	34ecd2f4-c353-492a-8b7c-3f9be403f03d	efe114f7-dc5d-4059-a97b-4bbe5615ff4b	Kiểu dữ liệu, biến và ép kiểu	0	a3	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
face0c5b-b7e7-454b-b87c-31e7ac99b486	dcbad372-bc1b-409c-b580-36efeab930a2	3a7e4e2a-395f-4213-81c5-03d945e1852f	Chương trình đầu tiên và chú thích	0	a0	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
fb34af88-781a-43ec-9b5d-04eb15a5d1b0	fe89c338-a561-45e8-be2e-6465e6ef8552	e3e2c06a-408b-4330-a30f-6b9df6c5b61a	Giới thiệu về giao diện của Scratch	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
fbd387bb-e2d9-44b3-a8f2-128e65bf5e07	11c9763a-b933-4cd2-b044-23b0606040c3	fbd63a54-b48e-417a-afd7-351c843d39f8	Xử lý xâu	0	a1	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
fbda01ea-d838-449d-9817-954717429eb6	0673c3cb-8017-4f8e-aba4-b60f0ef797a1	3cfe0502-a9d6-4353-b87f-ed417a83124f	2.6 Tổng kết	0	a5	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
fc792b6b-1d92-474f-be2a-02724143e861	0c187fb6-d795-4387-aa3f-21f1cbf01a7c	6097a7ef-548b-4542-8c60-5ee180d2dd96	Đường lên đỉnh Olympia	0	a2	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
fda13868-16ed-4f54-8a89-b7facab5be53	1e0449c7-0839-4125-bf49-5f94c0267a03	5de9e63d-fd88-4f4a-9a99-cd2051fdcad4	Thiết bị xuất dữ liệu	0	aA	\N	2026-04-30 08:41:36.786279+00	2026-05-29 07:56:34.65382+00	f
\.


--
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notifications" ("Id", "ReceiverId", "Title", "Message", "IsRead", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: OrderItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItems" ("Id", "OrderId", "CourseId", "Price", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Orders" ("Id", "StudentId", "TotalAmount", "Status", "Description", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: OutboxMessages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OutboxMessages" ("Id", "EventType", "TriggeredById", "ObjectId", "Payload", "Published", "ActivityId", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: PaymentTransactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentTransactions" ("Id", "Status", "Currency", "Amount", "Provider", "FailReason", "OrderId", "TransactionId", "RawRequest", "RawResponse", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: Reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reviews" ("Id", "CourseId", "StudentId", "Rating", "Comment", "UserId", "CreationTime", "LastModificationTime", "IsDeleted") FROM stdin;
\.


--
-- Data for Name: UserLessonProgresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserLessonProgresses" ("Id", "StudentId", "LessonId", "IsCompleted", "UserId", "CreationTime", "LastModificationTime", "IsDeleted", "Score") FROM stdin;
\.


--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20260430083248_Initial	10.0.5
20260501070803_AddExerciseSubmissionTables	10.0.5
20260501073554_AddLessonQuizTables	10.0.5
20260507141016_AddContestAndRenameTempDirColumn	10.0.5
20260508073952_RenameFilePathToFileLocationColumn	10.0.5
20260515065735_AddAntiCheatViolationTable	10.0.5
20260525091520_AddAuditColumnsForAspNetUsers	10.0.5
20260529074047_UseStringPositionForChapterLesson	10.0.5
20260610035736_AddIsHiddenColumn	10.0.5
\.


--
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.aggregatedcounter_id_seq', 1, false);


--
-- Name: counter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.counter_id_seq', 1, false);


--
-- Name: hash_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.hash_id_seq', 1, false);


--
-- Name: job_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.job_id_seq', 1, false);


--
-- Name: jobparameter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.jobparameter_id_seq', 1, false);


--
-- Name: jobqueue_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.jobqueue_id_seq', 1, false);


--
-- Name: list_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.list_id_seq', 1, false);


--
-- Name: set_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.set_id_seq', 1, false);


--
-- Name: state_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.state_id_seq', 1, false);


--
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AspNetRoleClaims_Id_seq"', 1, false);


--
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AspNetUserClaims_Id_seq"', 1, false);


--
-- Name: aggregatedcounter aggregatedcounter_key_key; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.aggregatedcounter
    ADD CONSTRAINT aggregatedcounter_key_key UNIQUE (key);


--
-- Name: aggregatedcounter aggregatedcounter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.aggregatedcounter
    ADD CONSTRAINT aggregatedcounter_pkey PRIMARY KEY (id);


--
-- Name: counter counter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.counter
    ADD CONSTRAINT counter_pkey PRIMARY KEY (id);


--
-- Name: hash hash_key_field_key; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.hash
    ADD CONSTRAINT hash_key_field_key UNIQUE (key, field);


--
-- Name: hash hash_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.hash
    ADD CONSTRAINT hash_pkey PRIMARY KEY (id);


--
-- Name: job job_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);


--
-- Name: jobparameter jobparameter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobparameter
    ADD CONSTRAINT jobparameter_pkey PRIMARY KEY (id);


--
-- Name: jobqueue jobqueue_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobqueue
    ADD CONSTRAINT jobqueue_pkey PRIMARY KEY (id);


--
-- Name: list list_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.list
    ADD CONSTRAINT list_pkey PRIMARY KEY (id);


--
-- Name: lock lock_resource_key; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.lock
    ADD CONSTRAINT lock_resource_key UNIQUE (resource);

ALTER TABLE ONLY hangfire.lock REPLICA IDENTITY USING INDEX lock_resource_key;


--
-- Name: schema schema_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.schema
    ADD CONSTRAINT schema_pkey PRIMARY KEY (version);


--
-- Name: server server_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.server
    ADD CONSTRAINT server_pkey PRIMARY KEY (id);


--
-- Name: set set_key_value_key; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.set
    ADD CONSTRAINT set_key_value_key UNIQUE (key, value);


--
-- Name: set set_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.set
    ADD CONSTRAINT set_pkey PRIMARY KEY (id);


--
-- Name: state state_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


--
-- Name: AntiCheatViolations PK_AntiCheatViolations; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AntiCheatViolations"
    ADD CONSTRAINT "PK_AntiCheatViolations" PRIMARY KEY ("Id");


--
-- Name: AspNetRoleClaims PK_AspNetRoleClaims; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id");


--
-- Name: AspNetRoles PK_AspNetRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoles"
    ADD CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id");


--
-- Name: AspNetUserClaims PK_AspNetUserClaims; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id");


--
-- Name: AspNetUserLogins PK_AspNetUserLogins; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey");


--
-- Name: AspNetUserRoles PK_AspNetUserRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId");


--
-- Name: AspNetUserTokens PK_AspNetUserTokens; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name");


--
-- Name: AspNetUsers PK_AspNetUsers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUsers"
    ADD CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id");


--
-- Name: CartItems PK_CartItems; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "PK_CartItems" PRIMARY KEY ("Id");


--
-- Name: Carts PK_Carts; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "PK_Carts" PRIMARY KEY ("Id");


--
-- Name: Categories PK_Categories; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "PK_Categories" PRIMARY KEY ("Id");


--
-- Name: Chapters PK_Chapters; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chapters"
    ADD CONSTRAINT "PK_Chapters" PRIMARY KEY ("Id");


--
-- Name: ContestExercises PK_ContestExercises; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestExercises"
    ADD CONSTRAINT "PK_ContestExercises" PRIMARY KEY ("Id");


--
-- Name: ContestRegistrations PK_ContestRegistrations; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestRegistrations"
    ADD CONSTRAINT "PK_ContestRegistrations" PRIMARY KEY ("Id");


--
-- Name: ContestSubmissions PK_ContestSubmissions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestSubmissions"
    ADD CONSTRAINT "PK_ContestSubmissions" PRIMARY KEY ("Id");


--
-- Name: Contests PK_Contests; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contests"
    ADD CONSTRAINT "PK_Contests" PRIMARY KEY ("Id");


--
-- Name: Courses PK_Courses; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "PK_Courses" PRIMARY KEY ("Id");


--
-- Name: Enrollments PK_Enrollments; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "PK_Enrollments" PRIMARY KEY ("Id");


--
-- Name: ExerciseDefaultCodes PK_ExerciseDefaultCodes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExerciseDefaultCodes"
    ADD CONSTRAINT "PK_ExerciseDefaultCodes" PRIMARY KEY ("Id");


--
-- Name: ExerciseExamples PK_ExerciseExamples; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExerciseExamples"
    ADD CONSTRAINT "PK_ExerciseExamples" PRIMARY KEY ("Id");


--
-- Name: ExerciseSubmissions PK_ExerciseSubmissions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExerciseSubmissions"
    ADD CONSTRAINT "PK_ExerciseSubmissions" PRIMARY KEY ("Id");


--
-- Name: ExerciseTestCases PK_ExerciseTestCases; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExerciseTestCases"
    ADD CONSTRAINT "PK_ExerciseTestCases" PRIMARY KEY ("Id");


--
-- Name: Exercises PK_Exercises; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exercises"
    ADD CONSTRAINT "PK_Exercises" PRIMARY KEY ("Id");


--
-- Name: FileChunks PK_FileChunks; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileChunks"
    ADD CONSTRAINT "PK_FileChunks" PRIMARY KEY ("Id");


--
-- Name: FileEntries PK_FileEntries; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileEntries"
    ADD CONSTRAINT "PK_FileEntries" PRIMARY KEY ("Id");


--
-- Name: FileEntryEmbeddings PK_FileEntryEmbeddings; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileEntryEmbeddings"
    ADD CONSTRAINT "PK_FileEntryEmbeddings" PRIMARY KEY ("Id");


--
-- Name: LessonCodings PK_LessonCodings; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonCodings"
    ADD CONSTRAINT "PK_LessonCodings" PRIMARY KEY ("Id");


--
-- Name: LessonMaterials PK_LessonMaterials; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonMaterials"
    ADD CONSTRAINT "PK_LessonMaterials" PRIMARY KEY ("Id");


--
-- Name: LessonQuizAnswers PK_LessonQuizAnswers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonQuizAnswers"
    ADD CONSTRAINT "PK_LessonQuizAnswers" PRIMARY KEY ("Id");


--
-- Name: LessonQuizQuestions PK_LessonQuizQuestions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonQuizQuestions"
    ADD CONSTRAINT "PK_LessonQuizQuestions" PRIMARY KEY ("Id");


--
-- Name: LessonQuizzes PK_LessonQuizzes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonQuizzes"
    ADD CONSTRAINT "PK_LessonQuizzes" PRIMARY KEY ("Id");


--
-- Name: LessonReadings PK_LessonReadings; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonReadings"
    ADD CONSTRAINT "PK_LessonReadings" PRIMARY KEY ("Id");


--
-- Name: LessonVideos PK_LessonVideos; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonVideos"
    ADD CONSTRAINT "PK_LessonVideos" PRIMARY KEY ("Id");


--
-- Name: Lessons PK_Lessons; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "PK_Lessons" PRIMARY KEY ("Id");


--
-- Name: Notifications PK_Notifications; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "PK_Notifications" PRIMARY KEY ("Id");


--
-- Name: OrderItems PK_OrderItems; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "PK_OrderItems" PRIMARY KEY ("Id");


--
-- Name: Orders PK_Orders; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "PK_Orders" PRIMARY KEY ("Id");


--
-- Name: OutboxMessages PK_OutboxMessages; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OutboxMessages"
    ADD CONSTRAINT "PK_OutboxMessages" PRIMARY KEY ("Id");


--
-- Name: PaymentTransactions PK_PaymentTransactions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransactions"
    ADD CONSTRAINT "PK_PaymentTransactions" PRIMARY KEY ("Id");


--
-- Name: Reviews PK_Reviews; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "PK_Reviews" PRIMARY KEY ("Id");


--
-- Name: UserLessonProgresses PK_UserLessonProgresses; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserLessonProgresses"
    ADD CONSTRAINT "PK_UserLessonProgresses" PRIMARY KEY ("Id");


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: ix_hangfire_counter_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_counter_expireat ON hangfire.counter USING btree (expireat);


--
-- Name: ix_hangfire_counter_key; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_counter_key ON hangfire.counter USING btree (key);


--
-- Name: ix_hangfire_hash_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_hash_expireat ON hangfire.hash USING btree (expireat);


--
-- Name: ix_hangfire_job_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_job_expireat ON hangfire.job USING btree (expireat);


--
-- Name: ix_hangfire_job_statename; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_job_statename ON hangfire.job USING btree (statename);


--
-- Name: ix_hangfire_job_statename_is_not_null; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_job_statename_is_not_null ON hangfire.job USING btree (statename) INCLUDE (id) WHERE (statename IS NOT NULL);


--
-- Name: ix_hangfire_jobparameter_jobidandname; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_jobparameter_jobidandname ON hangfire.jobparameter USING btree (jobid, name);


--
-- Name: ix_hangfire_jobqueue_fetchedat_queue_jobid; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_jobqueue_fetchedat_queue_jobid ON hangfire.jobqueue USING btree (fetchedat NULLS FIRST, queue, jobid);


--
-- Name: ix_hangfire_jobqueue_jobidandqueue; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_jobqueue_jobidandqueue ON hangfire.jobqueue USING btree (jobid, queue);


--
-- Name: ix_hangfire_jobqueue_queueandfetchedat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_jobqueue_queueandfetchedat ON hangfire.jobqueue USING btree (queue, fetchedat);


--
-- Name: ix_hangfire_list_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_list_expireat ON hangfire.list USING btree (expireat);


--
-- Name: ix_hangfire_set_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_set_expireat ON hangfire.set USING btree (expireat);


--
-- Name: ix_hangfire_set_key_score; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_set_key_score ON hangfire.set USING btree (key, score);


--
-- Name: ix_hangfire_state_jobid; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_state_jobid ON hangfire.state USING btree (jobid);


--
-- Name: EmailIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EmailIndex" ON public."AspNetUsers" USING btree ("NormalizedEmail");


--
-- Name: IX_AntiCheatViolations_ContestId_StudentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AntiCheatViolations_ContestId_StudentId" ON public."AntiCheatViolations" USING btree ("ContestId", "StudentId");


--
-- Name: IX_AntiCheatViolations_StudentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AntiCheatViolations_StudentId" ON public."AntiCheatViolations" USING btree ("StudentId");


--
-- Name: IX_AspNetRoleClaims_RoleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON public."AspNetRoleClaims" USING btree ("RoleId");


--
-- Name: IX_AspNetUserClaims_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserClaims_UserId" ON public."AspNetUserClaims" USING btree ("UserId");


--
-- Name: IX_AspNetUserLogins_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserLogins_UserId" ON public."AspNetUserLogins" USING btree ("UserId");


--
-- Name: IX_AspNetUserRoles_RoleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON public."AspNetUserRoles" USING btree ("RoleId");


--
-- Name: IX_CartItems_CartId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_CartItems_CartId" ON public."CartItems" USING btree ("CartId");


--
-- Name: IX_CartItems_CourseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_CartItems_CourseId" ON public."CartItems" USING btree ("CourseId");


--
-- Name: IX_Carts_StudentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Carts_StudentId" ON public."Carts" USING btree ("StudentId");


--
-- Name: IX_Chapters_CourseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Chapters_CourseId" ON public."Chapters" USING btree ("CourseId");


--
-- Name: IX_ContestExercises_ContestId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ContestExercises_ContestId" ON public."ContestExercises" USING btree ("ContestId");


--
-- Name: IX_ContestExercises_ExerciseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ContestExercises_ExerciseId" ON public."ContestExercises" USING btree ("ExerciseId");


--
-- Name: IX_ContestRegistrations_ContestId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ContestRegistrations_ContestId" ON public."ContestRegistrations" USING btree ("ContestId");


--
-- Name: IX_ContestRegistrations_StudentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ContestRegistrations_StudentId" ON public."ContestRegistrations" USING btree ("StudentId");


--
-- Name: IX_ContestSubmissions_ContestId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ContestSubmissions_ContestId" ON public."ContestSubmissions" USING btree ("ContestId");


--
-- Name: IX_ContestSubmissions_ExerciseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ContestSubmissions_ExerciseId" ON public."ContestSubmissions" USING btree ("ExerciseId");


--
-- Name: IX_ContestSubmissions_StudentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ContestSubmissions_StudentId" ON public."ContestSubmissions" USING btree ("StudentId");


--
-- Name: IX_Contests_CreatorId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Contests_CreatorId" ON public."Contests" USING btree ("CreatorId");


--
-- Name: IX_Courses_CategoryId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Courses_CategoryId" ON public."Courses" USING btree ("CategoryId");


--
-- Name: IX_Courses_InstructorId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Courses_InstructorId" ON public."Courses" USING btree ("InstructorId");


--
-- Name: IX_Enrollments_CourseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Enrollments_CourseId" ON public."Enrollments" USING btree ("CourseId");


--
-- Name: IX_Enrollments_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Enrollments_UserId" ON public."Enrollments" USING btree ("UserId");


--
-- Name: IX_ExerciseDefaultCodes_ExerciseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ExerciseDefaultCodes_ExerciseId" ON public."ExerciseDefaultCodes" USING btree ("ExerciseId");


--
-- Name: IX_ExerciseExamples_ExerciseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ExerciseExamples_ExerciseId" ON public."ExerciseExamples" USING btree ("ExerciseId");


--
-- Name: IX_ExerciseSubmissions_ExerciseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ExerciseSubmissions_ExerciseId" ON public."ExerciseSubmissions" USING btree ("ExerciseId");


--
-- Name: IX_ExerciseTestCases_ExerciseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_ExerciseTestCases_ExerciseId" ON public."ExerciseTestCases" USING btree ("ExerciseId");


--
-- Name: IX_FileChunks_FileEntryId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_FileChunks_FileEntryId" ON public."FileChunks" USING btree ("FileEntryId");


--
-- Name: IX_FileEntryEmbeddings_FileChunkId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_FileEntryEmbeddings_FileChunkId" ON public."FileEntryEmbeddings" USING btree ("FileChunkId");


--
-- Name: IX_FileEntryEmbeddings_FileEntryId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_FileEntryEmbeddings_FileEntryId" ON public."FileEntryEmbeddings" USING btree ("FileEntryId");


--
-- Name: IX_LessonCodings_ExerciseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_LessonCodings_ExerciseId" ON public."LessonCodings" USING btree ("ExerciseId");


--
-- Name: IX_LessonCodings_LessonId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_LessonCodings_LessonId" ON public."LessonCodings" USING btree ("LessonId");


--
-- Name: IX_LessonMaterials_DocumentFileId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_LessonMaterials_DocumentFileId" ON public."LessonMaterials" USING btree ("DocumentFileId");


--
-- Name: IX_LessonMaterials_LessonId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_LessonMaterials_LessonId" ON public."LessonMaterials" USING btree ("LessonId");


--
-- Name: IX_LessonQuizAnswers_LessonQuizQuestionId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_LessonQuizAnswers_LessonQuizQuestionId" ON public."LessonQuizAnswers" USING btree ("LessonQuizQuestionId");


--
-- Name: IX_LessonQuizQuestions_LessonQuizId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_LessonQuizQuestions_LessonQuizId" ON public."LessonQuizQuestions" USING btree ("LessonQuizId");


--
-- Name: IX_LessonQuizzes_LessonId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_LessonQuizzes_LessonId" ON public."LessonQuizzes" USING btree ("LessonId");


--
-- Name: IX_LessonReadings_LessonId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_LessonReadings_LessonId" ON public."LessonReadings" USING btree ("LessonId");


--
-- Name: IX_LessonVideos_LessonId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_LessonVideos_LessonId" ON public."LessonVideos" USING btree ("LessonId");


--
-- Name: IX_Lessons_ChapterId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Lessons_ChapterId" ON public."Lessons" USING btree ("ChapterId");


--
-- Name: IX_Lessons_CourseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Lessons_CourseId" ON public."Lessons" USING btree ("CourseId");


--
-- Name: IX_Notifications_ReceiverId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Notifications_ReceiverId" ON public."Notifications" USING btree ("ReceiverId");


--
-- Name: IX_OrderItems_CourseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OrderItems_CourseId" ON public."OrderItems" USING btree ("CourseId");


--
-- Name: IX_OrderItems_OrderId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OrderItems_OrderId" ON public."OrderItems" USING btree ("OrderId");


--
-- Name: IX_Orders_StudentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Orders_StudentId" ON public."Orders" USING btree ("StudentId");


--
-- Name: IX_PaymentTransactions_OrderId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_PaymentTransactions_OrderId" ON public."PaymentTransactions" USING btree ("OrderId");


--
-- Name: IX_Reviews_CourseId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Reviews_CourseId" ON public."Reviews" USING btree ("CourseId");


--
-- Name: IX_Reviews_StudentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Reviews_StudentId" ON public."Reviews" USING btree ("StudentId");


--
-- Name: IX_UserLessonProgresses_LessonId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_UserLessonProgresses_LessonId" ON public."UserLessonProgresses" USING btree ("LessonId");


--
-- Name: IX_UserLessonProgresses_StudentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_UserLessonProgresses_StudentId" ON public."UserLessonProgresses" USING btree ("StudentId");


--
-- Name: RoleNameIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RoleNameIndex" ON public."AspNetRoles" USING btree ("NormalizedName");


--
-- Name: UserNameIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserNameIndex" ON public."AspNetUsers" USING btree ("NormalizedUserName");


--
-- Name: jobparameter jobparameter_jobid_fkey; Type: FK CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobparameter
    ADD CONSTRAINT jobparameter_jobid_fkey FOREIGN KEY (jobid) REFERENCES hangfire.job(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: state state_jobid_fkey; Type: FK CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.state
    ADD CONSTRAINT state_jobid_fkey FOREIGN KEY (jobid) REFERENCES hangfire.job(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AntiCheatViolations FK_AntiCheatViolations_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AntiCheatViolations"
    ADD CONSTRAINT "FK_AntiCheatViolations_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AntiCheatViolations FK_AntiCheatViolations_Contests_ContestId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AntiCheatViolations"
    ADD CONSTRAINT "FK_AntiCheatViolations_Contests_ContestId" FOREIGN KEY ("ContestId") REFERENCES public."Contests"("Id") ON DELETE CASCADE;


--
-- Name: AspNetRoleClaims FK_AspNetRoleClaims_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserClaims FK_AspNetUserClaims_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserLogins FK_AspNetUserLogins_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserTokens FK_AspNetUserTokens_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: CartItems FK_CartItems_Carts_CartId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "FK_CartItems_Carts_CartId" FOREIGN KEY ("CartId") REFERENCES public."Carts"("Id") ON DELETE CASCADE;


--
-- Name: CartItems FK_CartItems_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "FK_CartItems_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- Name: Carts FK_Carts_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "FK_Carts_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: Chapters FK_Chapters_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chapters"
    ADD CONSTRAINT "FK_Chapters_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- Name: ContestExercises FK_ContestExercises_Contests_ContestId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestExercises"
    ADD CONSTRAINT "FK_ContestExercises_Contests_ContestId" FOREIGN KEY ("ContestId") REFERENCES public."Contests"("Id") ON DELETE CASCADE;


--
-- Name: ContestExercises FK_ContestExercises_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestExercises"
    ADD CONSTRAINT "FK_ContestExercises_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- Name: ContestRegistrations FK_ContestRegistrations_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestRegistrations"
    ADD CONSTRAINT "FK_ContestRegistrations_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: ContestRegistrations FK_ContestRegistrations_Contests_ContestId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestRegistrations"
    ADD CONSTRAINT "FK_ContestRegistrations_Contests_ContestId" FOREIGN KEY ("ContestId") REFERENCES public."Contests"("Id") ON DELETE CASCADE;


--
-- Name: ContestSubmissions FK_ContestSubmissions_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestSubmissions"
    ADD CONSTRAINT "FK_ContestSubmissions_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: ContestSubmissions FK_ContestSubmissions_Contests_ContestId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestSubmissions"
    ADD CONSTRAINT "FK_ContestSubmissions_Contests_ContestId" FOREIGN KEY ("ContestId") REFERENCES public."Contests"("Id") ON DELETE CASCADE;


--
-- Name: ContestSubmissions FK_ContestSubmissions_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContestSubmissions"
    ADD CONSTRAINT "FK_ContestSubmissions_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- Name: Contests FK_Contests_AspNetUsers_CreatorId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contests"
    ADD CONSTRAINT "FK_Contests_AspNetUsers_CreatorId" FOREIGN KEY ("CreatorId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: Courses FK_Courses_AspNetUsers_InstructorId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "FK_Courses_AspNetUsers_InstructorId" FOREIGN KEY ("InstructorId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: Courses FK_Courses_Categories_CategoryId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "FK_Courses_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES public."Categories"("Id") ON DELETE CASCADE;


--
-- Name: Enrollments FK_Enrollments_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "FK_Enrollments_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id");


--
-- Name: Enrollments FK_Enrollments_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "FK_Enrollments_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- Name: ExerciseDefaultCodes FK_ExerciseDefaultCodes_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExerciseDefaultCodes"
    ADD CONSTRAINT "FK_ExerciseDefaultCodes_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- Name: ExerciseExamples FK_ExerciseExamples_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExerciseExamples"
    ADD CONSTRAINT "FK_ExerciseExamples_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- Name: ExerciseSubmissions FK_ExerciseSubmissions_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExerciseSubmissions"
    ADD CONSTRAINT "FK_ExerciseSubmissions_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- Name: ExerciseTestCases FK_ExerciseTestCases_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExerciseTestCases"
    ADD CONSTRAINT "FK_ExerciseTestCases_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- Name: FileChunks FK_FileChunks_FileEntries_FileEntryId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileChunks"
    ADD CONSTRAINT "FK_FileChunks_FileEntries_FileEntryId" FOREIGN KEY ("FileEntryId") REFERENCES public."FileEntries"("Id") ON DELETE CASCADE;


--
-- Name: FileEntryEmbeddings FK_FileEntryEmbeddings_FileChunks_FileChunkId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileEntryEmbeddings"
    ADD CONSTRAINT "FK_FileEntryEmbeddings_FileChunks_FileChunkId" FOREIGN KEY ("FileChunkId") REFERENCES public."FileChunks"("Id") ON DELETE CASCADE;


--
-- Name: FileEntryEmbeddings FK_FileEntryEmbeddings_FileEntries_FileEntryId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileEntryEmbeddings"
    ADD CONSTRAINT "FK_FileEntryEmbeddings_FileEntries_FileEntryId" FOREIGN KEY ("FileEntryId") REFERENCES public."FileEntries"("Id") ON DELETE CASCADE;


--
-- Name: LessonCodings FK_LessonCodings_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonCodings"
    ADD CONSTRAINT "FK_LessonCodings_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- Name: LessonCodings FK_LessonCodings_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonCodings"
    ADD CONSTRAINT "FK_LessonCodings_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- Name: LessonMaterials FK_LessonMaterials_FileEntries_DocumentFileId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonMaterials"
    ADD CONSTRAINT "FK_LessonMaterials_FileEntries_DocumentFileId" FOREIGN KEY ("DocumentFileId") REFERENCES public."FileEntries"("Id") ON DELETE CASCADE;


--
-- Name: LessonMaterials FK_LessonMaterials_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonMaterials"
    ADD CONSTRAINT "FK_LessonMaterials_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- Name: LessonQuizAnswers FK_LessonQuizAnswers_LessonQuizQuestions_LessonQuizQuestionId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonQuizAnswers"
    ADD CONSTRAINT "FK_LessonQuizAnswers_LessonQuizQuestions_LessonQuizQuestionId" FOREIGN KEY ("LessonQuizQuestionId") REFERENCES public."LessonQuizQuestions"("Id") ON DELETE CASCADE;


--
-- Name: LessonQuizQuestions FK_LessonQuizQuestions_LessonQuizzes_LessonQuizId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonQuizQuestions"
    ADD CONSTRAINT "FK_LessonQuizQuestions_LessonQuizzes_LessonQuizId" FOREIGN KEY ("LessonQuizId") REFERENCES public."LessonQuizzes"("Id") ON DELETE CASCADE;


--
-- Name: LessonQuizzes FK_LessonQuizzes_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonQuizzes"
    ADD CONSTRAINT "FK_LessonQuizzes_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- Name: LessonReadings FK_LessonReadings_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonReadings"
    ADD CONSTRAINT "FK_LessonReadings_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- Name: LessonVideos FK_LessonVideos_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonVideos"
    ADD CONSTRAINT "FK_LessonVideos_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- Name: Lessons FK_Lessons_Chapters_ChapterId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "FK_Lessons_Chapters_ChapterId" FOREIGN KEY ("ChapterId") REFERENCES public."Chapters"("Id") ON DELETE CASCADE;


--
-- Name: Lessons FK_Lessons_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "FK_Lessons_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- Name: Notifications FK_Notifications_AspNetUsers_ReceiverId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "FK_Notifications_AspNetUsers_ReceiverId" FOREIGN KEY ("ReceiverId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: OrderItems FK_OrderItems_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "FK_OrderItems_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- Name: OrderItems FK_OrderItems_Orders_OrderId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES public."Orders"("Id") ON DELETE CASCADE;


--
-- Name: Orders FK_Orders_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "FK_Orders_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: PaymentTransactions FK_PaymentTransactions_Orders_OrderId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransactions"
    ADD CONSTRAINT "FK_PaymentTransactions_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES public."Orders"("Id") ON DELETE CASCADE;


--
-- Name: Reviews FK_Reviews_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "FK_Reviews_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: Reviews FK_Reviews_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "FK_Reviews_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- Name: UserLessonProgresses FK_UserLessonProgresses_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserLessonProgresses"
    ADD CONSTRAINT "FK_UserLessonProgresses_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: UserLessonProgresses FK_UserLessonProgresses_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserLessonProgresses"
    ADD CONSTRAINT "FK_UserLessonProgresses_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 51vkxKI75MiI6CMgf2y62eXR92ieGCdzpHTxkHN7LwETgocVlkpE4GdWzmRFl2g

