--
-- PostgreSQL database dump
--

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 17.0

-- Started on 2026-04-30 15:11:33

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 44112)
-- Name: hangfire; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA hangfire;


--
-- TOC entry 2 (class 3079 OID 43230)
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- TOC entry 4204 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- TOC entry 3 (class 3079 OID 43335)
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- TOC entry 4205 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 274 (class 1259 OID 44404)
-- Name: aggregatedcounter; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.aggregatedcounter (
    id bigint NOT NULL,
    key text NOT NULL,
    value bigint NOT NULL,
    expireat timestamp with time zone
);


--
-- TOC entry 273 (class 1259 OID 44403)
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.aggregatedcounter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4206 (class 0 OID 0)
-- Dependencies: 273
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.aggregatedcounter_id_seq OWNED BY hangfire.aggregatedcounter.id;


--
-- TOC entry 256 (class 1259 OID 44119)
-- Name: counter; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.counter (
    id bigint NOT NULL,
    key text NOT NULL,
    value bigint NOT NULL,
    expireat timestamp with time zone
);


--
-- TOC entry 255 (class 1259 OID 44118)
-- Name: counter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.counter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4207 (class 0 OID 0)
-- Dependencies: 255
-- Name: counter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.counter_id_seq OWNED BY hangfire.counter.id;


--
-- TOC entry 258 (class 1259 OID 44127)
-- Name: hash; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.hash (
    id bigint NOT NULL,
    key text NOT NULL,
    field text NOT NULL,
    value text,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 257 (class 1259 OID 44126)
-- Name: hash_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.hash_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4208 (class 0 OID 0)
-- Dependencies: 257
-- Name: hash_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.hash_id_seq OWNED BY hangfire.hash.id;


--
-- TOC entry 260 (class 1259 OID 44138)
-- Name: job; Type: TABLE; Schema: hangfire; Owner: -
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


--
-- TOC entry 259 (class 1259 OID 44137)
-- Name: job_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.job_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4209 (class 0 OID 0)
-- Dependencies: 259
-- Name: job_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.job_id_seq OWNED BY hangfire.job.id;


--
-- TOC entry 271 (class 1259 OID 44198)
-- Name: jobparameter; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.jobparameter (
    id bigint NOT NULL,
    jobid bigint NOT NULL,
    name text NOT NULL,
    value text,
    updatecount integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 270 (class 1259 OID 44197)
-- Name: jobparameter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.jobparameter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4210 (class 0 OID 0)
-- Dependencies: 270
-- Name: jobparameter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.jobparameter_id_seq OWNED BY hangfire.jobparameter.id;


--
-- TOC entry 264 (class 1259 OID 44163)
-- Name: jobqueue; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.jobqueue (
    id bigint NOT NULL,
    jobid bigint NOT NULL,
    queue text NOT NULL,
    fetchedat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 263 (class 1259 OID 44162)
-- Name: jobqueue_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.jobqueue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4211 (class 0 OID 0)
-- Dependencies: 263
-- Name: jobqueue_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.jobqueue_id_seq OWNED BY hangfire.jobqueue.id;


--
-- TOC entry 266 (class 1259 OID 44171)
-- Name: list; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.list (
    id bigint NOT NULL,
    key text NOT NULL,
    value text,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 265 (class 1259 OID 44170)
-- Name: list_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.list_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4212 (class 0 OID 0)
-- Dependencies: 265
-- Name: list_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.list_id_seq OWNED BY hangfire.list.id;


--
-- TOC entry 272 (class 1259 OID 44212)
-- Name: lock; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.lock (
    resource text NOT NULL,
    updatecount integer DEFAULT 0 NOT NULL,
    acquired timestamp with time zone
);


--
-- TOC entry 254 (class 1259 OID 44113)
-- Name: schema; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.schema (
    version integer NOT NULL
);


--
-- TOC entry 267 (class 1259 OID 44179)
-- Name: server; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.server (
    id text NOT NULL,
    data jsonb,
    lastheartbeat timestamp with time zone NOT NULL,
    updatecount integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 269 (class 1259 OID 44187)
-- Name: set; Type: TABLE; Schema: hangfire; Owner: -
--

CREATE TABLE hangfire.set (
    id bigint NOT NULL,
    key text NOT NULL,
    score double precision NOT NULL,
    value text NOT NULL,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 268 (class 1259 OID 44186)
-- Name: set_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.set_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4213 (class 0 OID 0)
-- Dependencies: 268
-- Name: set_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.set_id_seq OWNED BY hangfire.set.id;


--
-- TOC entry 262 (class 1259 OID 44148)
-- Name: state; Type: TABLE; Schema: hangfire; Owner: -
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


--
-- TOC entry 261 (class 1259 OID 44147)
-- Name: state_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: -
--

CREATE SEQUENCE hangfire.state_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4214 (class 0 OID 0)
-- Dependencies: 261
-- Name: state_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: -
--

ALTER SEQUENCE hangfire.state_id_seq OWNED BY hangfire.state.id;


--
-- TOC entry 226 (class 1259 OID 43708)
-- Name: AspNetRoleClaims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetRoleClaims" (
    "Id" integer NOT NULL,
    "RoleId" uuid NOT NULL,
    "ClaimType" text,
    "ClaimValue" text
);


--
-- TOC entry 225 (class 1259 OID 43707)
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- TOC entry 219 (class 1259 OID 43663)
-- Name: AspNetRoles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetRoles" (
    "Id" uuid NOT NULL,
    "Name" character varying(256),
    "NormalizedName" character varying(256),
    "ConcurrencyStamp" text
);


--
-- TOC entry 228 (class 1259 OID 43721)
-- Name: AspNetUserClaims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUserClaims" (
    "Id" integer NOT NULL,
    "UserId" uuid NOT NULL,
    "ClaimType" text,
    "ClaimValue" text
);


--
-- TOC entry 227 (class 1259 OID 43720)
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
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
-- TOC entry 229 (class 1259 OID 43733)
-- Name: AspNetUserLogins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" uuid NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 43745)
-- Name: AspNetUserRoles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUserRoles" (
    "UserId" uuid NOT NULL,
    "RoleId" uuid NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 43760)
-- Name: AspNetUserTokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUserTokens" (
    "UserId" uuid NOT NULL,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text
);


--
-- TOC entry 220 (class 1259 OID 43670)
-- Name: AspNetUsers; Type: TABLE; Schema: public; Owner: -
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
    "AccessFailedCount" integer NOT NULL
);


--
-- TOC entry 241 (class 1259 OID 43883)
-- Name: CartItems; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 232 (class 1259 OID 43772)
-- Name: Carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Carts" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 43677)
-- Name: Categories; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 242 (class 1259 OID 43898)
-- Name: Chapters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Chapters" (
    "Id" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "Position" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 235 (class 1259 OID 43806)
-- Name: Courses; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 243 (class 1259 OID 43910)
-- Name: Enrollments; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 236 (class 1259 OID 43823)
-- Name: ExerciseDefaultCodes; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 237 (class 1259 OID 43835)
-- Name: ExerciseExamples; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 238 (class 1259 OID 43847)
-- Name: ExerciseTestCases; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 222 (class 1259 OID 43684)
-- Name: Exercises; Type: TABLE; Schema: public; Owner: -
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
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 239 (class 1259 OID 43859)
-- Name: FileChunks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FileChunks" (
    "Id" uuid NOT NULL,
    "FileEntryId" uuid NOT NULL,
    "ChunkIndex" integer NOT NULL,
    "ChunkPath" character varying(1024) NOT NULL,
    "ChunkSize" bigint NOT NULL,
    "IsUploaded" boolean NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 43693)
-- Name: FileEntries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FileEntries" (
    "Id" uuid NOT NULL,
    "FileName" character varying(1024) NOT NULL,
    "FileSize" double precision NOT NULL,
    "FilePath" character varying(1024) NOT NULL,
    "TempFilePath" character varying(1024) NOT NULL,
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


--
-- TOC entry 246 (class 1259 OID 43959)
-- Name: FileEntryEmbeddings; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 248 (class 1259 OID 43993)
-- Name: LessonCodings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LessonCodings" (
    "Id" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "ProblemStatement" public.citext NOT NULL,
    "StarterCode" public.citext NOT NULL,
    "ExpectedOutput" public.citext NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 249 (class 1259 OID 44005)
-- Name: LessonMaterials; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 250 (class 1259 OID 44022)
-- Name: LessonQuizzes; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 251 (class 1259 OID 44034)
-- Name: LessonReadings; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 252 (class 1259 OID 44046)
-- Name: LessonVideos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LessonVideos" (
    "Id" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "VideoUrl" public.citext NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 247 (class 1259 OID 43976)
-- Name: Lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Lessons" (
    "Id" uuid NOT NULL,
    "ChapterId" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "LessonType" integer NOT NULL,
    "Position" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 43782)
-- Name: Notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notifications" (
    "Id" uuid NOT NULL,
    "ReceiverId" uuid NOT NULL,
    "Title" public.citext NOT NULL,
    "Message" public.citext NOT NULL,
    "IsRead" boolean NOT NULL,
    "NotificationType" integer NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 244 (class 1259 OID 43925)
-- Name: OrderItems; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 234 (class 1259 OID 43794)
-- Name: Orders; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 224 (class 1259 OID 43700)
-- Name: OutboxMessages; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 240 (class 1259 OID 43871)
-- Name: PaymentTransactions; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 245 (class 1259 OID 43942)
-- Name: Reviews; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 253 (class 1259 OID 44058)
-- Name: UserLessonProgresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserLessonProgresses" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "LessonId" uuid NOT NULL,
    "IsCompleted" boolean NOT NULL,
    "UserId" uuid,
    "CreationTime" timestamp with time zone NOT NULL,
    "LastModificationTime" timestamp with time zone,
    "IsDeleted" boolean NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 43225)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


--
-- TOC entry 3809 (class 2604 OID 44407)
-- Name: aggregatedcounter id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.aggregatedcounter ALTER COLUMN id SET DEFAULT nextval('hangfire.aggregatedcounter_id_seq'::regclass);


--
-- TOC entry 3792 (class 2604 OID 44245)
-- Name: counter id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.counter ALTER COLUMN id SET DEFAULT nextval('hangfire.counter_id_seq'::regclass);


--
-- TOC entry 3793 (class 2604 OID 44254)
-- Name: hash id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.hash ALTER COLUMN id SET DEFAULT nextval('hangfire.hash_id_seq'::regclass);


--
-- TOC entry 3795 (class 2604 OID 44264)
-- Name: job id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.job ALTER COLUMN id SET DEFAULT nextval('hangfire.job_id_seq'::regclass);


--
-- TOC entry 3806 (class 2604 OID 44314)
-- Name: jobparameter id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.jobparameter ALTER COLUMN id SET DEFAULT nextval('hangfire.jobparameter_id_seq'::regclass);


--
-- TOC entry 3799 (class 2604 OID 44337)
-- Name: jobqueue id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.jobqueue ALTER COLUMN id SET DEFAULT nextval('hangfire.jobqueue_id_seq'::regclass);


--
-- TOC entry 3801 (class 2604 OID 44357)
-- Name: list id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.list ALTER COLUMN id SET DEFAULT nextval('hangfire.list_id_seq'::regclass);


--
-- TOC entry 3804 (class 2604 OID 44366)
-- Name: set id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.set ALTER COLUMN id SET DEFAULT nextval('hangfire.set_id_seq'::regclass);


--
-- TOC entry 3797 (class 2604 OID 44291)
-- Name: state id; Type: DEFAULT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.state ALTER COLUMN id SET DEFAULT nextval('hangfire.state_id_seq'::regclass);


--
-- TOC entry 4198 (class 0 OID 44404)
-- Dependencies: 274
-- Data for Name: aggregatedcounter; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4180 (class 0 OID 44119)
-- Dependencies: 256
-- Data for Name: counter; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4182 (class 0 OID 44127)
-- Dependencies: 258
-- Data for Name: hash; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4184 (class 0 OID 44138)
-- Dependencies: 260
-- Data for Name: job; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4195 (class 0 OID 44198)
-- Dependencies: 271
-- Data for Name: jobparameter; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4188 (class 0 OID 44163)
-- Dependencies: 264
-- Data for Name: jobqueue; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4190 (class 0 OID 44171)
-- Dependencies: 266
-- Data for Name: list; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4196 (class 0 OID 44212)
-- Dependencies: 272
-- Data for Name: lock; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4178 (class 0 OID 44113)
-- Dependencies: 254
-- Data for Name: schema; Type: TABLE DATA; Schema: hangfire; Owner: -
--

INSERT INTO hangfire.schema VALUES (23);


--
-- TOC entry 4191 (class 0 OID 44179)
-- Dependencies: 267
-- Data for Name: server; Type: TABLE DATA; Schema: hangfire; Owner: -
--

INSERT INTO hangfire.server VALUES ('laptop-km4uhqhf:34568:101a189b-f210-49ee-b7c9-d1022f95aea8', '{"Queues": ["default"], "StartedAt": "2026-04-27T10:25:49.5987185Z", "WorkerCount": 20}', '2026-04-27 10:26:49.925898+00', 0);


--
-- TOC entry 4193 (class 0 OID 44187)
-- Dependencies: 269
-- Data for Name: set; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4186 (class 0 OID 44148)
-- Dependencies: 262
-- Data for Name: state; Type: TABLE DATA; Schema: hangfire; Owner: -
--



--
-- TOC entry 4150 (class 0 OID 43708)
-- Dependencies: 226
-- Data for Name: AspNetRoleClaims; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4143 (class 0 OID 43663)
-- Dependencies: 219
-- Data for Name: AspNetRoles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4152 (class 0 OID 43721)
-- Dependencies: 228
-- Data for Name: AspNetUserClaims; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4153 (class 0 OID 43733)
-- Dependencies: 229
-- Data for Name: AspNetUserLogins; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4154 (class 0 OID 43745)
-- Dependencies: 230
-- Data for Name: AspNetUserRoles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4155 (class 0 OID 43760)
-- Dependencies: 231
-- Data for Name: AspNetUserTokens; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4144 (class 0 OID 43670)
-- Dependencies: 220
-- Data for Name: AspNetUsers; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4165 (class 0 OID 43883)
-- Dependencies: 241
-- Data for Name: CartItems; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4156 (class 0 OID 43772)
-- Dependencies: 232
-- Data for Name: Carts; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4145 (class 0 OID 43677)
-- Dependencies: 221
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4166 (class 0 OID 43898)
-- Dependencies: 242
-- Data for Name: Chapters; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4159 (class 0 OID 43806)
-- Dependencies: 235
-- Data for Name: Courses; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4167 (class 0 OID 43910)
-- Dependencies: 243
-- Data for Name: Enrollments; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4160 (class 0 OID 43823)
-- Dependencies: 236
-- Data for Name: ExerciseDefaultCodes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4161 (class 0 OID 43835)
-- Dependencies: 237
-- Data for Name: ExerciseExamples; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4162 (class 0 OID 43847)
-- Dependencies: 238
-- Data for Name: ExerciseTestCases; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4146 (class 0 OID 43684)
-- Dependencies: 222
-- Data for Name: Exercises; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4163 (class 0 OID 43859)
-- Dependencies: 239
-- Data for Name: FileChunks; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4147 (class 0 OID 43693)
-- Dependencies: 223
-- Data for Name: FileEntries; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4170 (class 0 OID 43959)
-- Dependencies: 246
-- Data for Name: FileEntryEmbeddings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4172 (class 0 OID 43993)
-- Dependencies: 248
-- Data for Name: LessonCodings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4173 (class 0 OID 44005)
-- Dependencies: 249
-- Data for Name: LessonMaterials; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4174 (class 0 OID 44022)
-- Dependencies: 250
-- Data for Name: LessonQuizzes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4175 (class 0 OID 44034)
-- Dependencies: 251
-- Data for Name: LessonReadings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4176 (class 0 OID 44046)
-- Dependencies: 252
-- Data for Name: LessonVideos; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4171 (class 0 OID 43976)
-- Dependencies: 247
-- Data for Name: Lessons; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4157 (class 0 OID 43782)
-- Dependencies: 233
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4168 (class 0 OID 43925)
-- Dependencies: 244
-- Data for Name: OrderItems; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4158 (class 0 OID 43794)
-- Dependencies: 234
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4148 (class 0 OID 43700)
-- Dependencies: 224
-- Data for Name: OutboxMessages; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4164 (class 0 OID 43871)
-- Dependencies: 240
-- Data for Name: PaymentTransactions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4169 (class 0 OID 43942)
-- Dependencies: 245
-- Data for Name: Reviews; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4177 (class 0 OID 44058)
-- Dependencies: 253
-- Data for Name: UserLessonProgresses; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4142 (class 0 OID 43225)
-- Dependencies: 218
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."__EFMigrationsHistory" VALUES ('20260426113645_Initial', '10.0.5');


--
-- TOC entry 4215 (class 0 OID 0)
-- Dependencies: 273
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.aggregatedcounter_id_seq', 1, false);


--
-- TOC entry 4216 (class 0 OID 0)
-- Dependencies: 255
-- Name: counter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.counter_id_seq', 1, false);


--
-- TOC entry 4217 (class 0 OID 0)
-- Dependencies: 257
-- Name: hash_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.hash_id_seq', 1, false);


--
-- TOC entry 4218 (class 0 OID 0)
-- Dependencies: 259
-- Name: job_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.job_id_seq', 1, false);


--
-- TOC entry 4219 (class 0 OID 0)
-- Dependencies: 270
-- Name: jobparameter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.jobparameter_id_seq', 1, false);


--
-- TOC entry 4220 (class 0 OID 0)
-- Dependencies: 263
-- Name: jobqueue_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.jobqueue_id_seq', 1, false);


--
-- TOC entry 4221 (class 0 OID 0)
-- Dependencies: 265
-- Name: list_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.list_id_seq', 1, false);


--
-- TOC entry 4222 (class 0 OID 0)
-- Dependencies: 268
-- Name: set_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.set_id_seq', 1, false);


--
-- TOC entry 4223 (class 0 OID 0)
-- Dependencies: 261
-- Name: state_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: -
--

SELECT pg_catalog.setval('hangfire.state_id_seq', 1, false);


--
-- TOC entry 4224 (class 0 OID 0)
-- Dependencies: 225
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."AspNetRoleClaims_Id_seq"', 1, false);


--
-- TOC entry 4225 (class 0 OID 0)
-- Dependencies: 227
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."AspNetUserClaims_Id_seq"', 1, false);


--
-- TOC entry 3957 (class 2606 OID 44413)
-- Name: aggregatedcounter aggregatedcounter_key_key; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.aggregatedcounter
    ADD CONSTRAINT aggregatedcounter_key_key UNIQUE (key);


--
-- TOC entry 3959 (class 2606 OID 44411)
-- Name: aggregatedcounter aggregatedcounter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.aggregatedcounter
    ADD CONSTRAINT aggregatedcounter_pkey PRIMARY KEY (id);


--
-- TOC entry 3919 (class 2606 OID 44247)
-- Name: counter counter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.counter
    ADD CONSTRAINT counter_pkey PRIMARY KEY (id);


--
-- TOC entry 3923 (class 2606 OID 44382)
-- Name: hash hash_key_field_key; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.hash
    ADD CONSTRAINT hash_key_field_key UNIQUE (key, field);


--
-- TOC entry 3925 (class 2606 OID 44256)
-- Name: hash hash_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.hash
    ADD CONSTRAINT hash_pkey PRIMARY KEY (id);


--
-- TOC entry 3931 (class 2606 OID 44266)
-- Name: job job_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);


--
-- TOC entry 3953 (class 2606 OID 44316)
-- Name: jobparameter jobparameter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.jobparameter
    ADD CONSTRAINT jobparameter_pkey PRIMARY KEY (id);


--
-- TOC entry 3939 (class 2606 OID 44339)
-- Name: jobqueue jobqueue_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.jobqueue
    ADD CONSTRAINT jobqueue_pkey PRIMARY KEY (id);


--
-- TOC entry 3942 (class 2606 OID 44359)
-- Name: list list_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.list
    ADD CONSTRAINT list_pkey PRIMARY KEY (id);


--
-- TOC entry 3955 (class 2606 OID 44238)
-- Name: lock lock_resource_key; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.lock
    ADD CONSTRAINT lock_resource_key UNIQUE (resource);

ALTER TABLE ONLY hangfire.lock REPLICA IDENTITY USING INDEX lock_resource_key;


--
-- TOC entry 3917 (class 2606 OID 44117)
-- Name: schema schema_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.schema
    ADD CONSTRAINT schema_pkey PRIMARY KEY (version);


--
-- TOC entry 3944 (class 2606 OID 44385)
-- Name: server server_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.server
    ADD CONSTRAINT server_pkey PRIMARY KEY (id);


--
-- TOC entry 3948 (class 2606 OID 44387)
-- Name: set set_key_value_key; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.set
    ADD CONSTRAINT set_key_value_key UNIQUE (key, value);


--
-- TOC entry 3950 (class 2606 OID 44368)
-- Name: set set_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.set
    ADD CONSTRAINT set_pkey PRIMARY KEY (id);


--
-- TOC entry 3934 (class 2606 OID 44293)
-- Name: state state_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


--
-- TOC entry 3829 (class 2606 OID 43714)
-- Name: AspNetRoleClaims PK_AspNetRoleClaims; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id");


--
-- TOC entry 3813 (class 2606 OID 43669)
-- Name: AspNetRoles PK_AspNetRoles; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetRoles"
    ADD CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id");


--
-- TOC entry 3832 (class 2606 OID 43727)
-- Name: AspNetUserClaims PK_AspNetUserClaims; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id");


--
-- TOC entry 3835 (class 2606 OID 43739)
-- Name: AspNetUserLogins PK_AspNetUserLogins; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey");


--
-- TOC entry 3838 (class 2606 OID 43749)
-- Name: AspNetUserRoles PK_AspNetUserRoles; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId");


--
-- TOC entry 3840 (class 2606 OID 43766)
-- Name: AspNetUserTokens PK_AspNetUserTokens; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name");


--
-- TOC entry 3817 (class 2606 OID 43676)
-- Name: AspNetUsers PK_AspNetUsers; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUsers"
    ADD CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id");


--
-- TOC entry 3872 (class 2606 OID 43887)
-- Name: CartItems PK_CartItems; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "PK_CartItems" PRIMARY KEY ("Id");


--
-- TOC entry 3843 (class 2606 OID 43776)
-- Name: Carts PK_Carts; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "PK_Carts" PRIMARY KEY ("Id");


--
-- TOC entry 3820 (class 2606 OID 43683)
-- Name: Categories PK_Categories; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "PK_Categories" PRIMARY KEY ("Id");


--
-- TOC entry 3875 (class 2606 OID 43904)
-- Name: Chapters PK_Chapters; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Chapters"
    ADD CONSTRAINT "PK_Chapters" PRIMARY KEY ("Id");


--
-- TOC entry 3853 (class 2606 OID 43812)
-- Name: Courses PK_Courses; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "PK_Courses" PRIMARY KEY ("Id");


--
-- TOC entry 3879 (class 2606 OID 43914)
-- Name: Enrollments PK_Enrollments; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "PK_Enrollments" PRIMARY KEY ("Id");


--
-- TOC entry 3856 (class 2606 OID 43829)
-- Name: ExerciseDefaultCodes PK_ExerciseDefaultCodes; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExerciseDefaultCodes"
    ADD CONSTRAINT "PK_ExerciseDefaultCodes" PRIMARY KEY ("Id");


--
-- TOC entry 3859 (class 2606 OID 43841)
-- Name: ExerciseExamples PK_ExerciseExamples; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExerciseExamples"
    ADD CONSTRAINT "PK_ExerciseExamples" PRIMARY KEY ("Id");


--
-- TOC entry 3862 (class 2606 OID 43853)
-- Name: ExerciseTestCases PK_ExerciseTestCases; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExerciseTestCases"
    ADD CONSTRAINT "PK_ExerciseTestCases" PRIMARY KEY ("Id");


--
-- TOC entry 3822 (class 2606 OID 43692)
-- Name: Exercises PK_Exercises; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exercises"
    ADD CONSTRAINT "PK_Exercises" PRIMARY KEY ("Id");


--
-- TOC entry 3865 (class 2606 OID 43865)
-- Name: FileChunks PK_FileChunks; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FileChunks"
    ADD CONSTRAINT "PK_FileChunks" PRIMARY KEY ("Id");


--
-- TOC entry 3824 (class 2606 OID 43699)
-- Name: FileEntries PK_FileEntries; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FileEntries"
    ADD CONSTRAINT "PK_FileEntries" PRIMARY KEY ("Id");


--
-- TOC entry 3891 (class 2606 OID 43965)
-- Name: FileEntryEmbeddings PK_FileEntryEmbeddings; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FileEntryEmbeddings"
    ADD CONSTRAINT "PK_FileEntryEmbeddings" PRIMARY KEY ("Id");


--
-- TOC entry 3898 (class 2606 OID 43999)
-- Name: LessonCodings PK_LessonCodings; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonCodings"
    ADD CONSTRAINT "PK_LessonCodings" PRIMARY KEY ("Id");


--
-- TOC entry 3902 (class 2606 OID 44011)
-- Name: LessonMaterials PK_LessonMaterials; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonMaterials"
    ADD CONSTRAINT "PK_LessonMaterials" PRIMARY KEY ("Id");


--
-- TOC entry 3905 (class 2606 OID 44028)
-- Name: LessonQuizzes PK_LessonQuizzes; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonQuizzes"
    ADD CONSTRAINT "PK_LessonQuizzes" PRIMARY KEY ("Id");


--
-- TOC entry 3908 (class 2606 OID 44040)
-- Name: LessonReadings PK_LessonReadings; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonReadings"
    ADD CONSTRAINT "PK_LessonReadings" PRIMARY KEY ("Id");


--
-- TOC entry 3911 (class 2606 OID 44052)
-- Name: LessonVideos PK_LessonVideos; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonVideos"
    ADD CONSTRAINT "PK_LessonVideos" PRIMARY KEY ("Id");


--
-- TOC entry 3895 (class 2606 OID 43982)
-- Name: Lessons PK_Lessons; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "PK_Lessons" PRIMARY KEY ("Id");


--
-- TOC entry 3846 (class 2606 OID 43788)
-- Name: Notifications PK_Notifications; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "PK_Notifications" PRIMARY KEY ("Id");


--
-- TOC entry 3883 (class 2606 OID 43931)
-- Name: OrderItems PK_OrderItems; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "PK_OrderItems" PRIMARY KEY ("Id");


--
-- TOC entry 3849 (class 2606 OID 43800)
-- Name: Orders PK_Orders; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "PK_Orders" PRIMARY KEY ("Id");


--
-- TOC entry 3826 (class 2606 OID 43706)
-- Name: OutboxMessages PK_OutboxMessages; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OutboxMessages"
    ADD CONSTRAINT "PK_OutboxMessages" PRIMARY KEY ("Id");


--
-- TOC entry 3868 (class 2606 OID 43877)
-- Name: PaymentTransactions PK_PaymentTransactions; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentTransactions"
    ADD CONSTRAINT "PK_PaymentTransactions" PRIMARY KEY ("Id");


--
-- TOC entry 3887 (class 2606 OID 43948)
-- Name: Reviews PK_Reviews; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "PK_Reviews" PRIMARY KEY ("Id");


--
-- TOC entry 3915 (class 2606 OID 44062)
-- Name: UserLessonProgresses PK_UserLessonProgresses; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLessonProgresses"
    ADD CONSTRAINT "PK_UserLessonProgresses" PRIMARY KEY ("Id");


--
-- TOC entry 3811 (class 2606 OID 43229)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 3920 (class 1259 OID 44414)
-- Name: ix_hangfire_counter_expireat; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_counter_expireat ON hangfire.counter USING btree (expireat);


--
-- TOC entry 3921 (class 1259 OID 44376)
-- Name: ix_hangfire_counter_key; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_counter_key ON hangfire.counter USING btree (key);


--
-- TOC entry 3926 (class 1259 OID 44415)
-- Name: ix_hangfire_hash_expireat; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_hash_expireat ON hangfire.hash USING btree (expireat);


--
-- TOC entry 3927 (class 1259 OID 44416)
-- Name: ix_hangfire_job_expireat; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_job_expireat ON hangfire.job USING btree (expireat);


--
-- TOC entry 3928 (class 1259 OID 44383)
-- Name: ix_hangfire_job_statename; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_job_statename ON hangfire.job USING btree (statename);


--
-- TOC entry 3929 (class 1259 OID 44451)
-- Name: ix_hangfire_job_statename_is_not_null; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_job_statename_is_not_null ON hangfire.job USING btree (statename) INCLUDE (id) WHERE (statename IS NOT NULL);


--
-- TOC entry 3951 (class 1259 OID 44388)
-- Name: ix_hangfire_jobparameter_jobidandname; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_jobparameter_jobidandname ON hangfire.jobparameter USING btree (jobid, name);


--
-- TOC entry 3935 (class 1259 OID 44450)
-- Name: ix_hangfire_jobqueue_fetchedat_queue_jobid; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_jobqueue_fetchedat_queue_jobid ON hangfire.jobqueue USING btree (fetchedat NULLS FIRST, queue, jobid);


--
-- TOC entry 3936 (class 1259 OID 44348)
-- Name: ix_hangfire_jobqueue_jobidandqueue; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_jobqueue_jobidandqueue ON hangfire.jobqueue USING btree (jobid, queue);


--
-- TOC entry 3937 (class 1259 OID 44417)
-- Name: ix_hangfire_jobqueue_queueandfetchedat; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_jobqueue_queueandfetchedat ON hangfire.jobqueue USING btree (queue, fetchedat);


--
-- TOC entry 3940 (class 1259 OID 44419)
-- Name: ix_hangfire_list_expireat; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_list_expireat ON hangfire.list USING btree (expireat);


--
-- TOC entry 3945 (class 1259 OID 44420)
-- Name: ix_hangfire_set_expireat; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_set_expireat ON hangfire.set USING btree (expireat);


--
-- TOC entry 3946 (class 1259 OID 44402)
-- Name: ix_hangfire_set_key_score; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_set_key_score ON hangfire.set USING btree (key, score);


--
-- TOC entry 3932 (class 1259 OID 44301)
-- Name: ix_hangfire_state_jobid; Type: INDEX; Schema: hangfire; Owner: -
--

CREATE INDEX ix_hangfire_state_jobid ON hangfire.state USING btree (jobid);


--
-- TOC entry 3815 (class 1259 OID 44078)
-- Name: EmailIndex; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EmailIndex" ON public."AspNetUsers" USING btree ("NormalizedEmail");


--
-- TOC entry 3827 (class 1259 OID 44073)
-- Name: IX_AspNetRoleClaims_RoleId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON public."AspNetRoleClaims" USING btree ("RoleId");


--
-- TOC entry 3830 (class 1259 OID 44075)
-- Name: IX_AspNetUserClaims_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUserClaims_UserId" ON public."AspNetUserClaims" USING btree ("UserId");


--
-- TOC entry 3833 (class 1259 OID 44076)
-- Name: IX_AspNetUserLogins_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUserLogins_UserId" ON public."AspNetUserLogins" USING btree ("UserId");


--
-- TOC entry 3836 (class 1259 OID 44077)
-- Name: IX_AspNetUserRoles_RoleId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON public."AspNetUserRoles" USING btree ("RoleId");


--
-- TOC entry 3869 (class 1259 OID 44080)
-- Name: IX_CartItems_CartId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CartItems_CartId" ON public."CartItems" USING btree ("CartId");


--
-- TOC entry 3870 (class 1259 OID 44081)
-- Name: IX_CartItems_CourseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CartItems_CourseId" ON public."CartItems" USING btree ("CourseId");


--
-- TOC entry 3841 (class 1259 OID 44082)
-- Name: IX_Carts_StudentId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Carts_StudentId" ON public."Carts" USING btree ("StudentId");


--
-- TOC entry 3873 (class 1259 OID 44083)
-- Name: IX_Chapters_CourseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Chapters_CourseId" ON public."Chapters" USING btree ("CourseId");


--
-- TOC entry 3850 (class 1259 OID 44084)
-- Name: IX_Courses_CategoryId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Courses_CategoryId" ON public."Courses" USING btree ("CategoryId");


--
-- TOC entry 3851 (class 1259 OID 44085)
-- Name: IX_Courses_InstructorId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Courses_InstructorId" ON public."Courses" USING btree ("InstructorId");


--
-- TOC entry 3876 (class 1259 OID 44086)
-- Name: IX_Enrollments_CourseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Enrollments_CourseId" ON public."Enrollments" USING btree ("CourseId");


--
-- TOC entry 3877 (class 1259 OID 44087)
-- Name: IX_Enrollments_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Enrollments_UserId" ON public."Enrollments" USING btree ("UserId");


--
-- TOC entry 3854 (class 1259 OID 44088)
-- Name: IX_ExerciseDefaultCodes_ExerciseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ExerciseDefaultCodes_ExerciseId" ON public."ExerciseDefaultCodes" USING btree ("ExerciseId");


--
-- TOC entry 3857 (class 1259 OID 44089)
-- Name: IX_ExerciseExamples_ExerciseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ExerciseExamples_ExerciseId" ON public."ExerciseExamples" USING btree ("ExerciseId");


--
-- TOC entry 3860 (class 1259 OID 44090)
-- Name: IX_ExerciseTestCases_ExerciseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ExerciseTestCases_ExerciseId" ON public."ExerciseTestCases" USING btree ("ExerciseId");


--
-- TOC entry 3863 (class 1259 OID 44091)
-- Name: IX_FileChunks_FileEntryId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_FileChunks_FileEntryId" ON public."FileChunks" USING btree ("FileEntryId");


--
-- TOC entry 3888 (class 1259 OID 44092)
-- Name: IX_FileEntryEmbeddings_FileChunkId; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_FileEntryEmbeddings_FileChunkId" ON public."FileEntryEmbeddings" USING btree ("FileChunkId");


--
-- TOC entry 3889 (class 1259 OID 44093)
-- Name: IX_FileEntryEmbeddings_FileEntryId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_FileEntryEmbeddings_FileEntryId" ON public."FileEntryEmbeddings" USING btree ("FileEntryId");


--
-- TOC entry 3896 (class 1259 OID 44094)
-- Name: IX_LessonCodings_LessonId; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_LessonCodings_LessonId" ON public."LessonCodings" USING btree ("LessonId");


--
-- TOC entry 3899 (class 1259 OID 44095)
-- Name: IX_LessonMaterials_DocumentFileId; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_LessonMaterials_DocumentFileId" ON public."LessonMaterials" USING btree ("DocumentFileId");


--
-- TOC entry 3900 (class 1259 OID 44096)
-- Name: IX_LessonMaterials_LessonId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_LessonMaterials_LessonId" ON public."LessonMaterials" USING btree ("LessonId");


--
-- TOC entry 3903 (class 1259 OID 44097)
-- Name: IX_LessonQuizzes_LessonId; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_LessonQuizzes_LessonId" ON public."LessonQuizzes" USING btree ("LessonId");


--
-- TOC entry 3906 (class 1259 OID 44098)
-- Name: IX_LessonReadings_LessonId; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_LessonReadings_LessonId" ON public."LessonReadings" USING btree ("LessonId");


--
-- TOC entry 3909 (class 1259 OID 44101)
-- Name: IX_LessonVideos_LessonId; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_LessonVideos_LessonId" ON public."LessonVideos" USING btree ("LessonId");


--
-- TOC entry 3892 (class 1259 OID 44099)
-- Name: IX_Lessons_ChapterId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Lessons_ChapterId" ON public."Lessons" USING btree ("ChapterId");


--
-- TOC entry 3893 (class 1259 OID 44100)
-- Name: IX_Lessons_CourseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Lessons_CourseId" ON public."Lessons" USING btree ("CourseId");


--
-- TOC entry 3844 (class 1259 OID 44102)
-- Name: IX_Notifications_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Notifications_UserId" ON public."Notifications" USING btree ("UserId");


--
-- TOC entry 3880 (class 1259 OID 44103)
-- Name: IX_OrderItems_CourseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_OrderItems_CourseId" ON public."OrderItems" USING btree ("CourseId");


--
-- TOC entry 3881 (class 1259 OID 44104)
-- Name: IX_OrderItems_OrderId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_OrderItems_OrderId" ON public."OrderItems" USING btree ("OrderId");


--
-- TOC entry 3847 (class 1259 OID 44105)
-- Name: IX_Orders_StudentId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Orders_StudentId" ON public."Orders" USING btree ("StudentId");


--
-- TOC entry 3866 (class 1259 OID 44106)
-- Name: IX_PaymentTransactions_OrderId; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_PaymentTransactions_OrderId" ON public."PaymentTransactions" USING btree ("OrderId");


--
-- TOC entry 3884 (class 1259 OID 44107)
-- Name: IX_Reviews_CourseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Reviews_CourseId" ON public."Reviews" USING btree ("CourseId");


--
-- TOC entry 3885 (class 1259 OID 44108)
-- Name: IX_Reviews_StudentId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Reviews_StudentId" ON public."Reviews" USING btree ("StudentId");


--
-- TOC entry 3912 (class 1259 OID 44109)
-- Name: IX_UserLessonProgresses_LessonId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserLessonProgresses_LessonId" ON public."UserLessonProgresses" USING btree ("LessonId");


--
-- TOC entry 3913 (class 1259 OID 44110)
-- Name: IX_UserLessonProgresses_StudentId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserLessonProgresses_StudentId" ON public."UserLessonProgresses" USING btree ("StudentId");


--
-- TOC entry 3814 (class 1259 OID 44074)
-- Name: RoleNameIndex; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "RoleNameIndex" ON public."AspNetRoles" USING btree ("NormalizedName");


--
-- TOC entry 3818 (class 1259 OID 44079)
-- Name: UserNameIndex; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UserNameIndex" ON public."AspNetUsers" USING btree ("NormalizedUserName");


--
-- TOC entry 3998 (class 2606 OID 44325)
-- Name: jobparameter jobparameter_jobid_fkey; Type: FK CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.jobparameter
    ADD CONSTRAINT jobparameter_jobid_fkey FOREIGN KEY (jobid) REFERENCES hangfire.job(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3997 (class 2606 OID 44302)
-- Name: state state_jobid_fkey; Type: FK CONSTRAINT; Schema: hangfire; Owner: -
--

ALTER TABLE ONLY hangfire.state
    ADD CONSTRAINT state_jobid_fkey FOREIGN KEY (jobid) REFERENCES hangfire.job(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3960 (class 2606 OID 43715)
-- Name: AspNetRoleClaims FK_AspNetRoleClaims_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- TOC entry 3961 (class 2606 OID 43728)
-- Name: AspNetUserClaims FK_AspNetUserClaims_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3962 (class 2606 OID 43740)
-- Name: AspNetUserLogins FK_AspNetUserLogins_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3963 (class 2606 OID 43750)
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- TOC entry 3964 (class 2606 OID 43755)
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3965 (class 2606 OID 43767)
-- Name: AspNetUserTokens FK_AspNetUserTokens_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3976 (class 2606 OID 43888)
-- Name: CartItems FK_CartItems_Carts_CartId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "FK_CartItems_Carts_CartId" FOREIGN KEY ("CartId") REFERENCES public."Carts"("Id") ON DELETE CASCADE;


--
-- TOC entry 3977 (class 2606 OID 43893)
-- Name: CartItems FK_CartItems_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "FK_CartItems_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 3966 (class 2606 OID 43777)
-- Name: Carts FK_Carts_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "FK_Carts_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3978 (class 2606 OID 43905)
-- Name: Chapters FK_Chapters_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Chapters"
    ADD CONSTRAINT "FK_Chapters_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 3969 (class 2606 OID 43813)
-- Name: Courses FK_Courses_AspNetUsers_InstructorId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "FK_Courses_AspNetUsers_InstructorId" FOREIGN KEY ("InstructorId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3970 (class 2606 OID 43818)
-- Name: Courses FK_Courses_Categories_CategoryId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "FK_Courses_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES public."Categories"("Id") ON DELETE CASCADE;


--
-- TOC entry 3979 (class 2606 OID 43915)
-- Name: Enrollments FK_Enrollments_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "FK_Enrollments_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id");


--
-- TOC entry 3980 (class 2606 OID 43920)
-- Name: Enrollments FK_Enrollments_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "FK_Enrollments_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 3971 (class 2606 OID 43830)
-- Name: ExerciseDefaultCodes FK_ExerciseDefaultCodes_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExerciseDefaultCodes"
    ADD CONSTRAINT "FK_ExerciseDefaultCodes_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- TOC entry 3972 (class 2606 OID 43842)
-- Name: ExerciseExamples FK_ExerciseExamples_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExerciseExamples"
    ADD CONSTRAINT "FK_ExerciseExamples_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- TOC entry 3973 (class 2606 OID 43854)
-- Name: ExerciseTestCases FK_ExerciseTestCases_Exercises_ExerciseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExerciseTestCases"
    ADD CONSTRAINT "FK_ExerciseTestCases_Exercises_ExerciseId" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"("Id") ON DELETE CASCADE;


--
-- TOC entry 3974 (class 2606 OID 43866)
-- Name: FileChunks FK_FileChunks_FileEntries_FileEntryId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FileChunks"
    ADD CONSTRAINT "FK_FileChunks_FileEntries_FileEntryId" FOREIGN KEY ("FileEntryId") REFERENCES public."FileEntries"("Id") ON DELETE CASCADE;


--
-- TOC entry 3985 (class 2606 OID 43966)
-- Name: FileEntryEmbeddings FK_FileEntryEmbeddings_FileChunks_FileChunkId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FileEntryEmbeddings"
    ADD CONSTRAINT "FK_FileEntryEmbeddings_FileChunks_FileChunkId" FOREIGN KEY ("FileChunkId") REFERENCES public."FileChunks"("Id") ON DELETE CASCADE;


--
-- TOC entry 3986 (class 2606 OID 43971)
-- Name: FileEntryEmbeddings FK_FileEntryEmbeddings_FileEntries_FileEntryId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FileEntryEmbeddings"
    ADD CONSTRAINT "FK_FileEntryEmbeddings_FileEntries_FileEntryId" FOREIGN KEY ("FileEntryId") REFERENCES public."FileEntries"("Id") ON DELETE CASCADE;


--
-- TOC entry 3989 (class 2606 OID 44000)
-- Name: LessonCodings FK_LessonCodings_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonCodings"
    ADD CONSTRAINT "FK_LessonCodings_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- TOC entry 3990 (class 2606 OID 44012)
-- Name: LessonMaterials FK_LessonMaterials_FileEntries_DocumentFileId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonMaterials"
    ADD CONSTRAINT "FK_LessonMaterials_FileEntries_DocumentFileId" FOREIGN KEY ("DocumentFileId") REFERENCES public."FileEntries"("Id") ON DELETE CASCADE;


--
-- TOC entry 3991 (class 2606 OID 44017)
-- Name: LessonMaterials FK_LessonMaterials_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonMaterials"
    ADD CONSTRAINT "FK_LessonMaterials_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- TOC entry 3992 (class 2606 OID 44029)
-- Name: LessonQuizzes FK_LessonQuizzes_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonQuizzes"
    ADD CONSTRAINT "FK_LessonQuizzes_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- TOC entry 3993 (class 2606 OID 44041)
-- Name: LessonReadings FK_LessonReadings_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonReadings"
    ADD CONSTRAINT "FK_LessonReadings_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- TOC entry 3994 (class 2606 OID 44053)
-- Name: LessonVideos FK_LessonVideos_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonVideos"
    ADD CONSTRAINT "FK_LessonVideos_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


--
-- TOC entry 3987 (class 2606 OID 43983)
-- Name: Lessons FK_Lessons_Chapters_ChapterId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "FK_Lessons_Chapters_ChapterId" FOREIGN KEY ("ChapterId") REFERENCES public."Chapters"("Id") ON DELETE CASCADE;


--
-- TOC entry 3988 (class 2606 OID 43988)
-- Name: Lessons FK_Lessons_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "FK_Lessons_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 3967 (class 2606 OID 43789)
-- Name: Notifications FK_Notifications_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "FK_Notifications_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id");


--
-- TOC entry 3981 (class 2606 OID 43932)
-- Name: OrderItems FK_OrderItems_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "FK_OrderItems_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 3982 (class 2606 OID 43937)
-- Name: OrderItems FK_OrderItems_Orders_OrderId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES public."Orders"("Id") ON DELETE CASCADE;


--
-- TOC entry 3968 (class 2606 OID 43801)
-- Name: Orders FK_Orders_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "FK_Orders_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3975 (class 2606 OID 43878)
-- Name: PaymentTransactions FK_PaymentTransactions_Orders_OrderId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentTransactions"
    ADD CONSTRAINT "FK_PaymentTransactions_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES public."Orders"("Id") ON DELETE CASCADE;


--
-- TOC entry 3983 (class 2606 OID 43949)
-- Name: Reviews FK_Reviews_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "FK_Reviews_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3984 (class 2606 OID 43954)
-- Name: Reviews FK_Reviews_Courses_CourseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT "FK_Reviews_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES public."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 3995 (class 2606 OID 44063)
-- Name: UserLessonProgresses FK_UserLessonProgresses_AspNetUsers_StudentId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLessonProgresses"
    ADD CONSTRAINT "FK_UserLessonProgresses_AspNetUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 3996 (class 2606 OID 44068)
-- Name: UserLessonProgresses FK_UserLessonProgresses_Lessons_LessonId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLessonProgresses"
    ADD CONSTRAINT "FK_UserLessonProgresses_Lessons_LessonId" FOREIGN KEY ("LessonId") REFERENCES public."Lessons"("Id") ON DELETE CASCADE;


-- Completed on 2026-04-30 15:11:33

--
-- PostgreSQL database dump complete
--

