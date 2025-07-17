--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-03 15:02:50

SET
statement_timeout = 0;
SET
lock_timeout = 0;
SET
idle_in_transaction_session_timeout = 0;
SET
transaction_timeout = 0;
SET
client_encoding = 'UTF8';
SET
standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET
check_function_bodies = false;
SET
xmloption = content;
SET
client_min_messages = warning;
SET
row_security = off;

DROP
DATABASE "CourseMate";
--
-- TOC entry 5314 (class 1262 OID 25713)
-- Name: CourseMate; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE
DATABASE "CourseMate" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER
DATABASE "CourseMate" OWNER TO postgres;

\connect
"CourseMate"

SET statement_timeout = 0;
SET
lock_timeout = 0;
SET
idle_in_transaction_session_timeout = 0;
SET
transaction_timeout = 0;
SET
client_encoding = 'UTF8';
SET
standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET
check_function_bodies = false;
SET
xmloption = content;
SET
client_min_messages = warning;
SET
row_security = off;

--
-- TOC entry 6 (class 2615 OID 25721)
-- Name: app; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA app;


ALTER
SCHEMA app OWNER TO postgres;

SET
default_tablespace = '';

SET
default_table_access_method = heap;

--
-- TOC entry 238 (class 1259 OID 25863)
-- Name: Books; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."Books"
(
    "Id"                   uuid                   NOT NULL,
    "Name"                 character varying(128) NOT NULL,
    "Type"                 integer                NOT NULL,
    "PublishDate"          timestamp without time zone NOT NULL,
    "Price"                real                   NOT NULL,
    "ExtraProperties"      text                   NOT NULL,
    "ConcurrencyStamp"     character varying(40)  NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid
);


ALTER TABLE app."Books" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 25870)
-- Name: Categories; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."Categories"
(
    "Id"                   uuid                    NOT NULL,
    "Name"                 character varying(1024) NOT NULL,
    "Description"          character varying(1024) NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false   NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE app."Categories" OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 26089)
-- Name: Chapters; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."Chapters"
(
    "Id"                   uuid                    NOT NULL,
    "Title"                character varying(1024) NOT NULL,
    "CourseId"             uuid                    NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false   NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE app."Chapters" OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 26029)
-- Name: Courses; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."Courses"
(
    "Id"                   uuid                    NOT NULL,
    "Title"                character varying(1024) NOT NULL,
    "Description"          character varying(1024) NOT NULL,
    "ThumbnailUrl"         character varying(1024) NOT NULL,
    "Price"                numeric                 NOT NULL,
    "Currency"             integer                 NOT NULL,
    "LevelType"            integer                 NOT NULL,
    "IsPublished"          boolean                 NOT NULL,
    "InstructorId"         uuid                    NOT NULL,
    "CategoryId"           uuid                    NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false   NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE app."Courses" OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 26102)
-- Name: Enrollments; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."Enrollments"
(
    "Id"                   uuid                  NOT NULL,
    "StudentId"            uuid                  NOT NULL,
    "CourseId"             uuid                  NOT NULL,
    "IsCompleted"          boolean               NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE app."Enrollments" OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 26170)
-- Name: Lessons; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."Lessons"
(
    "Id"                   uuid                    NOT NULL,
    "Title"                character varying(1024) NOT NULL,
    "ContentText"          character varying(1024) NOT NULL,
    "VideoUrl"             character varying(1024) NOT NULL,
    "Duration" interval NOT NULL,
    "ChapterId"            uuid                    NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false   NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE app."Lessons" OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 26153)
-- Name: OrderItems; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."OrderItems"
(
    "Id"       uuid    NOT NULL,
    "OrderId"  uuid    NOT NULL,
    "CourseId" uuid    NOT NULL,
    "Price"    numeric NOT NULL
);


ALTER TABLE app."OrderItems" OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 26059)
-- Name: Orders; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."Orders"
(
    "Id"                   uuid                  NOT NULL,
    "StudentId"            uuid                  NOT NULL,
    "TotalAmount"          numeric               NOT NULL,
    "Currency"             character varying(24) NOT NULL,
    "PaymentRequestId"     uuid                  NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE app."Orders" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 25894)
-- Name: PaymentRequests; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."PaymentRequests"
(
    "Id"                   uuid                    NOT NULL,
    "State"                integer                 NOT NULL,
    "Currency"             character varying(24)   NOT NULL,
    "Gateway"              character varying(1024) NOT NULL,
    "FailReason"           character varying(1024) NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false   NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE app."PaymentRequests" OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 26118)
-- Name: Reviews; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app."Reviews"
(
    "Id"                   uuid                    NOT NULL,
    "StudentId"            uuid                    NOT NULL,
    "CourseId"             uuid                    NOT NULL,
    "Rating"               integer                 NOT NULL,
    "Comment"              character varying(1024) NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false   NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE app."Reviews" OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 25902)
-- Name: AbpAuditLogActions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpAuditLogActions"
(
    "Id"                uuid    NOT NULL,
    "TenantId"          uuid,
    "AuditLogId"        uuid    NOT NULL,
    "ServiceName"       character varying(256),
    "MethodName"        character varying(128),
    "Parameters"        character varying(2000),
    "ExecutionTime"     timestamp without time zone NOT NULL,
    "ExecutionDuration" integer NOT NULL,
    "ExtraProperties"   text
);


ALTER TABLE public."AbpAuditLogActions" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25722)
-- Name: AbpAuditLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpAuditLogs"
(
    "Id"                     uuid                  NOT NULL,
    "ApplicationName"        character varying(96),
    "UserId"                 uuid,
    "UserName"               character varying(256),
    "TenantId"               uuid,
    "TenantName"             character varying(64),
    "ImpersonatorUserId"     uuid,
    "ImpersonatorUserName"   character varying(256),
    "ImpersonatorTenantId"   uuid,
    "ImpersonatorTenantName" character varying(64),
    "ExecutionTime"          timestamp without time zone NOT NULL,
    "ExecutionDuration"      integer               NOT NULL,
    "ClientIpAddress"        character varying(64),
    "ClientName"             character varying(128),
    "ClientId"               character varying(64),
    "CorrelationId"          character varying(64),
    "BrowserInfo"            character varying(512),
    "HttpMethod"             character varying(16),
    "Url"                    character varying(256),
    "Exceptions"             text,
    "Comments"               character varying(256),
    "HttpStatusCode"         integer,
    "ExtraProperties"        text                  NOT NULL,
    "ConcurrencyStamp"       character varying(40) NOT NULL
);


ALTER TABLE public."AbpAuditLogs" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25729)
-- Name: AbpBackgroundJobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpBackgroundJobs"
(
    "Id"               uuid                       NOT NULL,
    "ApplicationName"  character varying(96),
    "JobName"          character varying(128)     NOT NULL,
    "JobArgs"          character varying(1048576) NOT NULL,
    "TryCount"         smallint DEFAULT 0         NOT NULL,
    "CreationTime"     timestamp without time zone NOT NULL,
    "NextTryTime"      timestamp without time zone NOT NULL,
    "LastTryTime"      timestamp without time zone,
    "IsAbandoned"      boolean  DEFAULT false     NOT NULL,
    "Priority"         smallint DEFAULT 15        NOT NULL,
    "ExtraProperties"  text                       NOT NULL,
    "ConcurrencyStamp" character varying(40)      NOT NULL
);


ALTER TABLE public."AbpBackgroundJobs" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25739)
-- Name: AbpBlobContainers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpBlobContainers"
(
    "Id"               uuid                   NOT NULL,
    "TenantId"         uuid,
    "Name"             character varying(128) NOT NULL,
    "ExtraProperties"  text                   NOT NULL,
    "ConcurrencyStamp" character varying(40)  NOT NULL
);


ALTER TABLE public."AbpBlobContainers" OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 25926)
-- Name: AbpBlobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpBlobs"
(
    "Id"               uuid                   NOT NULL,
    "ContainerId"      uuid                   NOT NULL,
    "TenantId"         uuid,
    "Name"             character varying(256) NOT NULL,
    "Content"          bytea,
    "ExtraProperties"  text                   NOT NULL,
    "ConcurrencyStamp" character varying(40)  NOT NULL
);


ALTER TABLE public."AbpBlobs" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25746)
-- Name: AbpClaimTypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpClaimTypes"
(
    "Id"               uuid                   NOT NULL,
    "Name"             character varying(256) NOT NULL,
    "Required"         boolean                NOT NULL,
    "IsStatic"         boolean                NOT NULL,
    "Regex"            character varying(512),
    "RegexDescription" character varying(128),
    "Description"      character varying(256),
    "ValueType"        integer                NOT NULL,
    "CreationTime"     timestamp without time zone NOT NULL,
    "ExtraProperties"  text                   NOT NULL,
    "ConcurrencyStamp" character varying(40)  NOT NULL
);


ALTER TABLE public."AbpClaimTypes" OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 25914)
-- Name: AbpEntityChanges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpEntityChanges"
(
    "Id"                 uuid                   NOT NULL,
    "AuditLogId"         uuid                   NOT NULL,
    "TenantId"           uuid,
    "ChangeTime"         timestamp without time zone NOT NULL,
    "ChangeType"         smallint               NOT NULL,
    "EntityTenantId"     uuid,
    "EntityId"           character varying(128),
    "EntityTypeFullName" character varying(128) NOT NULL,
    "ExtraProperties"    text
);


ALTER TABLE public."AbpEntityChanges" OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 26077)
-- Name: AbpEntityPropertyChanges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpEntityPropertyChanges"
(
    "Id"                   uuid                   NOT NULL,
    "TenantId"             uuid,
    "EntityChangeId"       uuid                   NOT NULL,
    "NewValue"             character varying(512),
    "OriginalValue"        character varying(512),
    "PropertyName"         character varying(128) NOT NULL,
    "PropertyTypeFullName" character varying(64)  NOT NULL
);


ALTER TABLE public."AbpEntityPropertyChanges" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25753)
-- Name: AbpFeatureGroups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpFeatureGroups"
(
    "Id"              uuid                   NOT NULL,
    "Name"            character varying(128) NOT NULL,
    "DisplayName"     character varying(256) NOT NULL,
    "ExtraProperties" text
);


ALTER TABLE public."AbpFeatureGroups" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25767)
-- Name: AbpFeatureValues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpFeatureValues"
(
    "Id"           uuid                   NOT NULL,
    "Name"         character varying(128) NOT NULL,
    "Value"        character varying(128) NOT NULL,
    "ProviderName" character varying(64),
    "ProviderKey"  character varying(64)
);


ALTER TABLE public."AbpFeatureValues" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25760)
-- Name: AbpFeatures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpFeatures"
(
    "Id"                 uuid                   NOT NULL,
    "GroupName"          character varying(128) NOT NULL,
    "Name"               character varying(128) NOT NULL,
    "ParentName"         character varying(128),
    "DisplayName"        character varying(256) NOT NULL,
    "Description"        character varying(256),
    "DefaultValue"       character varying(256),
    "IsVisibleToClients" boolean                NOT NULL,
    "IsAvailableToHost"  boolean                NOT NULL,
    "AllowedProviders"   character varying(256),
    "ValueType"          character varying(2048),
    "ExtraProperties"    text
);


ALTER TABLE public."AbpFeatures" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25772)
-- Name: AbpLinkUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpLinkUsers"
(
    "Id"             uuid NOT NULL,
    "SourceUserId"   uuid NOT NULL,
    "SourceTenantId" uuid,
    "TargetUserId"   uuid NOT NULL,
    "TargetTenantId" uuid
);


ALTER TABLE public."AbpLinkUsers" OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 25938)
-- Name: AbpOrganizationUnitRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpOrganizationUnitRoles"
(
    "RoleId"             uuid NOT NULL,
    "OrganizationUnitId" uuid NOT NULL,
    "TenantId"           uuid,
    "CreationTime"       timestamp without time zone NOT NULL,
    "CreatorId"          uuid
);


ALTER TABLE public."AbpOrganizationUnitRoles" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25777)
-- Name: AbpOrganizationUnits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpOrganizationUnits"
(
    "Id"                   uuid                   NOT NULL,
    "TenantId"             uuid,
    "ParentId"             uuid,
    "Code"                 character varying(95)  NOT NULL,
    "DisplayName"          character varying(128) NOT NULL,
    "EntityVersion"        integer                NOT NULL,
    "ExtraProperties"      text                   NOT NULL,
    "ConcurrencyStamp"     character varying(40)  NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false  NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE public."AbpOrganizationUnits" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 25790)
-- Name: AbpPermissionGrants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpPermissionGrants"
(
    "Id"           uuid                   NOT NULL,
    "TenantId"     uuid,
    "Name"         character varying(128) NOT NULL,
    "ProviderName" character varying(64)  NOT NULL,
    "ProviderKey"  character varying(64)  NOT NULL
);


ALTER TABLE public."AbpPermissionGrants" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25795)
-- Name: AbpPermissionGroups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpPermissionGroups"
(
    "Id"              uuid                   NOT NULL,
    "Name"            character varying(128) NOT NULL,
    "DisplayName"     character varying(256) NOT NULL,
    "ExtraProperties" text
);


ALTER TABLE public."AbpPermissionGroups" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 25802)
-- Name: AbpPermissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpPermissions"
(
    "Id"               uuid                   NOT NULL,
    "GroupName"        character varying(128) NOT NULL,
    "Name"             character varying(128) NOT NULL,
    "ParentName"       character varying(128),
    "DisplayName"      character varying(256) NOT NULL,
    "IsEnabled"        boolean                NOT NULL,
    "MultiTenancySide" smallint               NOT NULL,
    "Providers"        character varying(128),
    "StateCheckers"    character varying(256),
    "ExtraProperties"  text
);


ALTER TABLE public."AbpPermissions" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 25953)
-- Name: AbpRoleClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpRoleClaims"
(
    "Id"         uuid                   NOT NULL,
    "RoleId"     uuid                   NOT NULL,
    "TenantId"   uuid,
    "ClaimType"  character varying(256) NOT NULL,
    "ClaimValue" character varying(1024)
);


ALTER TABLE public."AbpRoleClaims" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25809)
-- Name: AbpRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpRoles"
(
    "Id"               uuid                   NOT NULL,
    "TenantId"         uuid,
    "Name"             character varying(256) NOT NULL,
    "NormalizedName"   character varying(256) NOT NULL,
    "IsDefault"        boolean                NOT NULL,
    "IsStatic"         boolean                NOT NULL,
    "IsPublic"         boolean                NOT NULL,
    "EntityVersion"    integer                NOT NULL,
    "CreationTime"     timestamp without time zone NOT NULL,
    "ExtraProperties"  text                   NOT NULL,
    "ConcurrencyStamp" character varying(40)  NOT NULL
);


ALTER TABLE public."AbpRoles" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 25816)
-- Name: AbpSecurityLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpSecurityLogs"
(
    "Id"               uuid                  NOT NULL,
    "TenantId"         uuid,
    "ApplicationName"  character varying(96),
    "Identity"         character varying(96),
    "Action"           character varying(96),
    "UserId"           uuid,
    "UserName"         character varying(256),
    "TenantName"       character varying(64),
    "ClientId"         character varying(64),
    "CorrelationId"    character varying(64),
    "ClientIpAddress"  character varying(64),
    "BrowserInfo"      character varying(512),
    "CreationTime"     timestamp without time zone NOT NULL,
    "ExtraProperties"  text                  NOT NULL,
    "ConcurrencyStamp" character varying(40) NOT NULL
);


ALTER TABLE public."AbpSecurityLogs" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25823)
-- Name: AbpSessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpSessions"
(
    "Id"              uuid                   NOT NULL,
    "SessionId"       character varying(128) NOT NULL,
    "Device"          character varying(64)  NOT NULL,
    "DeviceInfo"      character varying(64),
    "TenantId"        uuid,
    "UserId"          uuid                   NOT NULL,
    "ClientId"        character varying(64),
    "IpAddresses"     character varying(2048),
    "SignedIn"        timestamp without time zone NOT NULL,
    "LastAccessed"    timestamp without time zone,
    "ExtraProperties" text
);


ALTER TABLE public."AbpSessions" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25830)
-- Name: AbpSettingDefinitions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpSettingDefinitions"
(
    "Id"                 uuid                   NOT NULL,
    "Name"               character varying(128) NOT NULL,
    "DisplayName"        character varying(256) NOT NULL,
    "Description"        character varying(512),
    "DefaultValue"       character varying(2048),
    "IsVisibleToClients" boolean                NOT NULL,
    "Providers"          character varying(1024),
    "IsInherited"        boolean                NOT NULL,
    "IsEncrypted"        boolean                NOT NULL,
    "ExtraProperties"    text
);


ALTER TABLE public."AbpSettingDefinitions" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25837)
-- Name: AbpSettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpSettings"
(
    "Id"           uuid                    NOT NULL,
    "Name"         character varying(128)  NOT NULL,
    "Value"        character varying(2048) NOT NULL,
    "ProviderName" character varying(64),
    "ProviderKey"  character varying(64)
);


ALTER TABLE public."AbpSettings" OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 25965)
-- Name: AbpUserClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpUserClaims"
(
    "Id"         uuid                   NOT NULL,
    "UserId"     uuid                   NOT NULL,
    "TenantId"   uuid,
    "ClaimType"  character varying(256) NOT NULL,
    "ClaimValue" character varying(1024)
);


ALTER TABLE public."AbpUserClaims" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 25844)
-- Name: AbpUserDelegations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpUserDelegations"
(
    "Id"           uuid NOT NULL,
    "TenantId"     uuid,
    "SourceUserId" uuid NOT NULL,
    "TargetUserId" uuid NOT NULL,
    "StartTime"    timestamp without time zone NOT NULL,
    "EndTime"      timestamp without time zone NOT NULL
);


ALTER TABLE public."AbpUserDelegations" OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 25977)
-- Name: AbpUserLogins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpUserLogins"
(
    "UserId"              uuid                   NOT NULL,
    "LoginProvider"       character varying(64)  NOT NULL,
    "TenantId"            uuid,
    "ProviderKey"         character varying(196) NOT NULL,
    "ProviderDisplayName" character varying(128)
);


ALTER TABLE public."AbpUserLogins" OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 25987)
-- Name: AbpUserOrganizationUnits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpUserOrganizationUnits"
(
    "UserId"             uuid NOT NULL,
    "OrganizationUnitId" uuid NOT NULL,
    "TenantId"           uuid,
    "CreationTime"       timestamp without time zone NOT NULL,
    "CreatorId"          uuid
);


ALTER TABLE public."AbpUserOrganizationUnits" OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 26002)
-- Name: AbpUserRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpUserRoles"
(
    "UserId"   uuid NOT NULL,
    "RoleId"   uuid NOT NULL,
    "TenantId" uuid
);


ALTER TABLE public."AbpUserRoles" OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 26017)
-- Name: AbpUserTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpUserTokens"
(
    "UserId"        uuid                   NOT NULL,
    "LoginProvider" character varying(64)  NOT NULL,
    "Name"          character varying(128) NOT NULL,
    "TenantId"      uuid,
    "Value"         text
);


ALTER TABLE public."AbpUserTokens" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 25849)
-- Name: AbpUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AbpUsers"
(
    "Id"                              uuid                   NOT NULL,
    "TenantId"                        uuid,
    "UserName"                        character varying(256) NOT NULL,
    "NormalizedUserName"              character varying(256) NOT NULL,
    "Name"                            character varying(64),
    "Surname"                         character varying(64),
    "Email"                           character varying(256) NOT NULL,
    "NormalizedEmail"                 character varying(256) NOT NULL,
    "EmailConfirmed"                  boolean DEFAULT false  NOT NULL,
    "PasswordHash"                    character varying(256),
    "SecurityStamp"                   character varying(256) NOT NULL,
    "IsExternal"                      boolean DEFAULT false  NOT NULL,
    "PhoneNumber"                     character varying(16),
    "PhoneNumberConfirmed"            boolean DEFAULT false  NOT NULL,
    "IsActive"                        boolean                NOT NULL,
    "TwoFactorEnabled"                boolean DEFAULT false  NOT NULL,
    "LockoutEnd"                      timestamp with time zone,
    "LockoutEnabled"                  boolean DEFAULT false  NOT NULL,
    "AccessFailedCount"               integer DEFAULT 0      NOT NULL,
    "ShouldChangePasswordOnNextLogin" boolean                NOT NULL,
    "EntityVersion"                   integer                NOT NULL,
    "LastPasswordChangeTime"          timestamp with time zone,
    "ExtraProperties"                 text                   NOT NULL,
    "ConcurrencyStamp"                character varying(40)  NOT NULL,
    "CreationTime"                    timestamp without time zone NOT NULL,
    "CreatorId"                       uuid,
    "LastModificationTime"            timestamp without time zone,
    "LastModifierId"                  uuid,
    "IsDeleted"                       boolean DEFAULT false  NOT NULL,
    "DeleterId"                       uuid,
    "DeletionTime"                    timestamp without time zone
);


ALTER TABLE public."AbpUsers" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 25878)
-- Name: OpenIddictApplications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OpenIddictApplications"
(
    "Id"                     uuid                  NOT NULL,
    "ApplicationType"        character varying(50),
    "ClientId"               character varying(100),
    "ClientSecret"           text,
    "ClientType"             character varying(50),
    "ConsentType"            character varying(50),
    "DisplayName"            text,
    "DisplayNames"           text,
    "JsonWebKeySet"          text,
    "Permissions"            text,
    "PostLogoutRedirectUris" text,
    "Properties"             text,
    "RedirectUris"           text,
    "Requirements"           text,
    "Settings"               text,
    "ClientUri"              text,
    "LogoUri"                text,
    "ExtraProperties"        text                  NOT NULL,
    "ConcurrencyStamp"       character varying(40) NOT NULL,
    "CreationTime"           timestamp without time zone NOT NULL,
    "CreatorId"              uuid,
    "LastModificationTime"   timestamp without time zone,
    "LastModifierId"         uuid,
    "IsDeleted"              boolean DEFAULT false NOT NULL,
    "DeleterId"              uuid,
    "DeletionTime"           timestamp without time zone
);


ALTER TABLE public."OpenIddictApplications" OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 26047)
-- Name: OpenIddictAuthorizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OpenIddictAuthorizations"
(
    "Id"               uuid                  NOT NULL,
    "ApplicationId"    uuid,
    "CreationDate"     timestamp without time zone,
    "Properties"       text,
    "Scopes"           text,
    "Status"           character varying(50),
    "Subject"          character varying(400),
    "Type"             character varying(50),
    "ExtraProperties"  text                  NOT NULL,
    "ConcurrencyStamp" character varying(40) NOT NULL
);


ALTER TABLE public."OpenIddictAuthorizations" OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 25886)
-- Name: OpenIddictScopes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OpenIddictScopes"
(
    "Id"                   uuid                  NOT NULL,
    "Description"          text,
    "Descriptions"         text,
    "DisplayName"          text,
    "DisplayNames"         text,
    "Name"                 character varying(200),
    "Properties"           text,
    "Resources"            text,
    "ExtraProperties"      text                  NOT NULL,
    "ConcurrencyStamp"     character varying(40) NOT NULL,
    "CreationTime"         timestamp without time zone NOT NULL,
    "CreatorId"            uuid,
    "LastModificationTime" timestamp without time zone,
    "LastModifierId"       uuid,
    "IsDeleted"            boolean DEFAULT false NOT NULL,
    "DeleterId"            uuid,
    "DeletionTime"         timestamp without time zone
);


ALTER TABLE public."OpenIddictScopes" OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 26136)
-- Name: OpenIddictTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OpenIddictTokens"
(
    "Id"               uuid                  NOT NULL,
    "ApplicationId"    uuid,
    "AuthorizationId"  uuid,
    "CreationDate"     timestamp without time zone,
    "ExpirationDate"   timestamp without time zone,
    "Payload"          text,
    "Properties"       text,
    "RedemptionDate"   timestamp without time zone,
    "ReferenceId"      character varying(100),
    "Status"           character varying(50),
    "Subject"          character varying(400),
    "Type"             character varying(50),
    "ExtraProperties"  text                  NOT NULL,
    "ConcurrencyStamp" character varying(40) NOT NULL
);


ALTER TABLE public."OpenIddictTokens" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25714)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory"
(
    "MigrationId"    character varying(150) NOT NULL,
    "ProductVersion" character varying(32)  NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- TOC entry 5284 (class 0 OID 25863)
-- Dependencies: 238
-- Data for Name: Books; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."Books" ("Id", "Name", "Type", "PublishDate", "Price", "ExtraProperties", "ConcurrencyStamp", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId") FROM stdin;
3a1ae17a
-90ad-602d-3595-d2aee5edf533	1984	3	1949-06-08 00:00:00	19.84	{}	99c6be5405154702b2f57c3eb9ebf252	2025-07-03 15:01:06.744682
\N
\N
\N
3a1ae17a-90c3-2e7a-395c-2c3e0625a4b0	The Hitchhiker's Guide to the Galaxy	7	1995-09-27 00:00:00	42	{}	07dd674404264901b60ae2c60891f314	2025-07-03 15:01:06.755986	\N	\N	\N
\.


--
-- TOC entry 5285 (class 0 OID 25870)
-- Dependencies: 239
-- Data for Name: Categories; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."Categories" ("Id", "Name", "Description", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5303 (class 0 OID 26089)
-- Dependencies: 257
-- Data for Name: Chapters; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."Chapters" ("Id", "Title", "CourseId", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5299 (class 0 OID 26029)
-- Dependencies: 253
-- Data for Name: Courses; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."Courses" ("Id", "Title", "Description", "ThumbnailUrl", "Price", "Currency", "LevelType", "IsPublished", "InstructorId", "CategoryId", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5304 (class 0 OID 26102)
-- Dependencies: 258
-- Data for Name: Enrollments; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."Enrollments" ("Id", "StudentId", "CourseId", "IsCompleted", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5308 (class 0 OID 26170)
-- Dependencies: 262
-- Data for Name: Lessons; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."Lessons" ("Id", "Title", "ContentText", "VideoUrl", "Duration", "ChapterId", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5307 (class 0 OID 26153)
-- Dependencies: 261
-- Data for Name: OrderItems; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."OrderItems" ("Id", "OrderId", "CourseId", "Price") FROM stdin;
\.


--
-- TOC entry 5301 (class 0 OID 26059)
-- Dependencies: 255
-- Data for Name: Orders; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."Orders" ("Id", "StudentId", "TotalAmount", "Currency", "PaymentRequestId", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5288 (class 0 OID 25894)
-- Dependencies: 242
-- Data for Name: PaymentRequests; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."PaymentRequests" ("Id", "State", "Currency", "Gateway", "FailReason", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5305 (class 0 OID 26118)
-- Dependencies: 259
-- Data for Name: Reviews; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app."Reviews" ("Id", "StudentId", "CourseId", "Rating", "Comment", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5289 (class 0 OID 25902)
-- Dependencies: 243
-- Data for Name: AbpAuditLogActions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpAuditLogActions" ("Id", "TenantId", "AuditLogId", "ServiceName", "MethodName", "Parameters", "ExecutionTime", "ExecutionDuration", "ExtraProperties") FROM stdin;
\.


--
-- TOC entry 5265 (class 0 OID 25722)
-- Dependencies: 219
-- Data for Name: AbpAuditLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpAuditLogs" ("Id", "ApplicationName", "UserId", "UserName", "TenantId", "TenantName", "ImpersonatorUserId", "ImpersonatorUserName", "ImpersonatorTenantId", "ImpersonatorTenantName", "ExecutionTime", "ExecutionDuration", "ClientIpAddress", "ClientName", "ClientId", "CorrelationId", "BrowserInfo", "HttpMethod", "Url", "Exceptions", "Comments", "HttpStatusCode", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
\.


--
-- TOC entry 5266 (class 0 OID 25729)
-- Dependencies: 220
-- Data for Name: AbpBackgroundJobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpBackgroundJobs" ("Id", "ApplicationName", "JobName", "JobArgs", "TryCount", "CreationTime", "NextTryTime", "LastTryTime", "IsAbandoned", "Priority", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
\.


--
-- TOC entry 5267 (class 0 OID 25739)
-- Dependencies: 221
-- Data for Name: AbpBlobContainers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpBlobContainers" ("Id", "TenantId", "Name", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
\.


--
-- TOC entry 5291 (class 0 OID 25926)
-- Dependencies: 245
-- Data for Name: AbpBlobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpBlobs" ("Id", "ContainerId", "TenantId", "Name", "Content", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
\.


--
-- TOC entry 5268 (class 0 OID 25746)
-- Dependencies: 222
-- Data for Name: AbpClaimTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpClaimTypes" ("Id", "Name", "Required", "IsStatic", "Regex", "RegexDescription", "Description", "ValueType", "CreationTime", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
\.


--
-- TOC entry 5290 (class 0 OID 25914)
-- Dependencies: 244
-- Data for Name: AbpEntityChanges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpEntityChanges" ("Id", "AuditLogId", "TenantId", "ChangeTime", "ChangeType", "EntityTenantId", "EntityId", "EntityTypeFullName", "ExtraProperties") FROM stdin;
\.


--
-- TOC entry 5302 (class 0 OID 26077)
-- Dependencies: 256
-- Data for Name: AbpEntityPropertyChanges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpEntityPropertyChanges" ("Id", "TenantId", "EntityChangeId", "NewValue", "OriginalValue", "PropertyName", "PropertyTypeFullName") FROM stdin;
\.


--
-- TOC entry 5269 (class 0 OID 25753)
-- Dependencies: 223
-- Data for Name: AbpFeatureGroups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpFeatureGroups" ("Id", "Name", "DisplayName", "ExtraProperties") FROM stdin;
\.


--
-- TOC entry 5271 (class 0 OID 25767)
-- Dependencies: 225
-- Data for Name: AbpFeatureValues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpFeatureValues" ("Id", "Name", "Value", "ProviderName", "ProviderKey") FROM stdin;
\.


--
-- TOC entry 5270 (class 0 OID 25760)
-- Dependencies: 224
-- Data for Name: AbpFeatures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpFeatures" ("Id", "GroupName", "Name", "ParentName", "DisplayName", "Description", "DefaultValue", "IsVisibleToClients", "IsAvailableToHost", "AllowedProviders", "ValueType", "ExtraProperties") FROM stdin;
\.


--
-- TOC entry 5272 (class 0 OID 25772)
-- Dependencies: 226
-- Data for Name: AbpLinkUsers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpLinkUsers" ("Id", "SourceUserId", "SourceTenantId", "TargetUserId", "TargetTenantId") FROM stdin;
\.


--
-- TOC entry 5292 (class 0 OID 25938)
-- Dependencies: 246
-- Data for Name: AbpOrganizationUnitRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpOrganizationUnitRoles" ("RoleId", "OrganizationUnitId", "TenantId", "CreationTime", "CreatorId") FROM stdin;
\.


--
-- TOC entry 5273 (class 0 OID 25777)
-- Dependencies: 227
-- Data for Name: AbpOrganizationUnits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpOrganizationUnits" ("Id", "TenantId", "ParentId", "Code", "DisplayName", "EntityVersion", "ExtraProperties", "ConcurrencyStamp", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
\.


--
-- TOC entry 5274 (class 0 OID 25790)
-- Dependencies: 228
-- Data for Name: AbpPermissionGrants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpPermissionGrants" ("Id", "TenantId", "Name", "ProviderName", "ProviderKey") FROM stdin;
3a1ae17a-8fa2-03ba-4275-7d8e0dbfa0a2	\N	CourseMate.Books.Edit	R	admin
3a1ae17a-8fa2-0876-26b9-68f417e227f7	\N	CourseMate.Orders.Edit	R	admin
3a1ae17a-8fa2-0935-0bfc-02c11747abe8	\N	CourseMate.Chapters	R	admin
3a1ae17a-8fa2-0991-ab42-ff82727571ec	\N	AbpIdentity.Roles	R	admin
3a1ae17a-8fa2-0b8d-6f06-df30f9fccdea	\N	AbpIdentity.Users.Update	R	admin
3a1ae17a-8fa2-0cc5-d8f0-cd46899d59de	\N	AbpIdentity.Roles.Delete	R	admin
3a1ae17a-8fa2-0e7e-c769-b68ea8904bf6	\N	CourseMate.Reviews	R	admin
3a1ae17a-8fa2-1297-a861-9270e828d5cc	\N	CourseMate.Enrollments.Edit	R	admin
3a1ae17a-8fa2-134a-9c91-79392758c3d5	\N	AbpIdentity.Users.ManagePermissions	R	admin
3a1ae17a-8fa2-1599-81d8-95b298c5396c	\N	CourseMate.Reviews.Create	R	admin
3a1ae17a-8fa2-16de-9e82-20161e5b79fe	\N	CourseMate.Enrollments.Delete	R	admin
3a1ae17a-8fa2-1cbc-4c60-7a99963d6f0d	\N	CourseMate.Chapters.Edit	R	admin
3a1ae17a-8fa2-2a3e-47bd-973a50afb5e1	\N	CourseMate.Categories.Create	R	admin
3a1ae17a-8fa2-2dcc-f713-55118e830177	\N	CourseMate.Orders	R	admin
3a1ae17a-8fa2-2e1f-0495-8b141e4e98e4	\N	AbpIdentity.Users.Update.ManageRoles	R	admin
3a1ae17a-8fa2-37a7-45ad-0199b0c7d32e	\N	CourseMate.Enrollments	R	admin
3a1ae17a-8fa2-3baf-a900-afe360b38deb	\N	CourseMate.Enrollments.Create	R	admin
3a1ae17a-8fa2-4daf-0493-7293a5e49db4	\N	AbpIdentity.Users	R	admin
3a1ae17a-8fa2-52c2-2a6f-717a886a29a3	\N	CourseMate.Categories	R	admin
3a1ae17a-8fa2-5824-138c-7b55f104b22a	\N	SettingManagement.Emailing	R	admin
3a1ae17a-8fa2-587d-5db0-6de3acbd36e4	\N	CourseMate.PaymentRequests	R	admin
3a1ae17a-8fa2-5cf3-1046-0f4ab5e8431f	\N	CourseMate.PaymentRequests.Create	R	admin
3a1ae17a-8fa2-5e06-6cee-b39eaf392718	\N	SettingManagement.Emailing.Test	R	admin
3a1ae17a-8fa2-6082-8454-0a383f6d6d68	\N	CourseMate.Courses	R	admin
3a1ae17a-8fa2-612d-b7f6-3b90f600ae77	\N	CourseMate.PaymentRequests.Edit	R	admin
3a1ae17a-8fa2-627a-ac91-93cc386fec17	\N	CourseMate.Chapters.Delete	R	admin
3a1ae17a-8fa2-66a4-11d9-3c4043401e99	\N	CourseMate.Lessons	R	admin
3a1ae17a-8fa2-68a5-f79f-bc06d05b8109	\N	AbpIdentity.Users.Create	R	admin
3a1ae17a-8fa2-6c2a-6b81-8ffc182a6571	\N	SettingManagement.TimeZone	R	admin
3a1ae17a-8fa2-6fea-4275-2934ddb4d799	\N	AbpIdentity.Roles.Update	R	admin
3a1ae17a-8fa2-6ff4-f4a0-dbf0a4160f25	\N	AbpIdentity.Users.Delete	R	admin
3a1ae17a-8fa2-735e-1d37-eb54097ede0a	\N	AbpIdentity.Roles.Create	R	admin
3a1ae17a-8fa2-7b01-02f6-7c3a3c48514e	\N	CourseMate.Categories.Delete	R	admin
3a1ae17a-8fa2-7cc0-baea-db4dcbbf9158	\N	CourseMate.Courses.Edit	R	admin
3a1ae17a-8fa2-7de1-564f-52db9fbdc75b	\N	CourseMate.Books.Create	R	admin
3a1ae17a-8fa2-8667-70be-2471265f98dd	\N	CourseMate.Reviews.Delete	R	admin
3a1ae17a-8fa2-8bd7-b989-a9f25064d434	\N	CourseMate.Courses.Create	R	admin
3a1ae17a-8fa2-8e0f-29b6-479d68766c26	\N	CourseMate.Orders.Create	R	admin
3a1ae17a-8fa2-92de-68a1-a89a83203c83	\N	CourseMate.Categories.Edit	R	admin
3a1ae17a-8fa2-9b3e-8fbb-c3191d561006	\N	CourseMate.Chapters.Create	R	admin
3a1ae17a-8fa2-a98e-fb14-e1c7b2e32035	\N	CourseMate.Books	R	admin
3a1ae17a-8fa2-b222-6df5-365bd6daeca3	\N	FeatureManagement.ManageHostFeatures	R	admin
3a1ae17a-8fa2-c859-1efb-c21d0c4bd88d	\N	CourseMate.Lessons.Create	R	admin
3a1ae17a-8fa2-d1a8-dabf-5c1efb11eafa	\N	CourseMate.Courses.Delete	R	admin
3a1ae17a-8fa2-d3d6-4cba-feba65e1bb91	\N	CourseMate.Lessons.Delete	R	admin
3a1ae17a-8fa2-d889-5062-87254001bd19	\N	CourseMate.Lessons.Edit	R	admin
3a1ae17a-8fa2-db04-bb00-5ad338c34ed4	\N	AbpIdentity.Roles.ManagePermissions	R	admin
3a1ae17a-8fa2-ecd7-6d95-80f7b66f91c1	\N	CourseMate.Reviews.Edit	R	admin
3a1ae17a-8fa2-f1e0-5b20-c1af476726db	\N	CourseMate.Books.Delete	R	admin
3a1ae17a-8fa2-f673-3b93-c8abb184f2aa	\N	CourseMate.PaymentRequests.Delete	R	admin
3a1ae17a-8fa2-f9fb-4925-e68eab9bdfe1	\N	CourseMate.Orders.Delete	R	admin
3a1ae17a-8fda-3522-fe0c-aec0d475b406	\N	CourseMate.Books	R	anonymous
3a1ae17a-8fdd-0419-8773-74ee56bd4c08	\N	CourseMate.Books.Create	R	anonymous
3a1ae17a-8fdf-3f6e-b372-76782e802f18	\N	CourseMate.Books.Edit	R	anonymous
3a1ae17a-8fe1-aba0-c706-d28fcededb6b	\N	CourseMate.Books.Delete	R	anonymous
3a1ae17a-8fe3-5fea-e65a-283f9505a0ea	\N	CourseMate.Categories	R	anonymous
3a1ae17a-8fe4-0ca7-2d5e-dfa47828584a	\N	CourseMate.Categories.Create	R	anonymous
3a1ae17a-8fe6-976d-b6c7-dbe837d70aae	\N	CourseMate.Categories.Edit	R	anonymous
3a1ae17a-8fe8-7228-67a1-a9f9db687c48	\N	CourseMate.Categories.Delete	R	anonymous
3a1ae17a-8fe9-8369-55cf-f352d8400fa3	\N	CourseMate.Chapters	R	anonymous
3a1ae17a-8feb-5369-a351-e2c37510d799	\N	CourseMate.Chapters.Create	R	anonymous
3a1ae17a-8fec-e3b3-2f7e-605721fa6cbc	\N	CourseMate.Chapters.Edit	R	anonymous
3a1ae17a-8fed-a2ec-e87f-1b45833bf49f	\N	CourseMate.Chapters.Delete	R	anonymous
3a1ae17a-8fef-0376-d974-13767287bfa3	\N	CourseMate.Courses	R	anonymous
3a1ae17a-8ff0-e928-ae11-46f4e4163804	\N	CourseMate.Courses.Create	R	anonymous
3a1ae17a-8ff2-d5de-6c94-57736e119bd1	\N	CourseMate.Courses.Edit	R	anonymous
3a1ae17a-8ff3-bc4e-075e-2392c517beac	\N	CourseMate.Courses.Delete	R	anonymous
3a1ae17a-8ff5-0552-b7a8-6666d4126db9	\N	CourseMate.Enrollments	R	anonymous
3a1ae17a-8ff6-e0e8-8c13-4653055fc97b	\N	CourseMate.Enrollments.Create	R	anonymous
3a1ae17a-8ff7-b010-247e-6ea479cdfbc3	\N	CourseMate.Enrollments.Edit	R	anonymous
3a1ae17a-8ff9-8360-a537-6279a5575295	\N	CourseMate.Enrollments.Delete	R	anonymous
3a1ae17a-8ffa-bc1e-3828-3fbd9918ecc4	\N	CourseMate.Lessons	R	anonymous
3a1ae17a-8ffc-1972-d5f0-f07f4d5ea7ab	\N	CourseMate.Lessons.Create	R	anonymous
3a1ae17a-8ffd-c83f-95a0-d44f11e4c0f8	\N	CourseMate.Lessons.Edit	R	anonymous
3a1ae17a-8ffe-81a6-bd22-f8645569cb2d	\N	CourseMate.Lessons.Delete	R	anonymous
3a1ae17a-9000-a9cf-9373-99c4f035e03b	\N	CourseMate.Orders	R	anonymous
3a1ae17a-9001-2e2e-1b46-521fcd3357a3	\N	CourseMate.Orders.Create	R	anonymous
3a1ae17a-9002-2945-3a6d-1016a3b9904f	\N	CourseMate.Orders.Edit	R	anonymous
3a1ae17a-9004-e503-c947-adba290ff784	\N	CourseMate.Orders.Delete	R	anonymous
3a1ae17a-9005-f771-d9ba-f0728bfb7e54	\N	CourseMate.PaymentRequests	R	anonymous
3a1ae17a-9007-6d48-a94d-9a7a79048070	\N	CourseMate.PaymentRequests.Create	R	anonymous
3a1ae17a-9008-77f8-555d-3059807599de	\N	CourseMate.PaymentRequests.Edit	R	anonymous
3a1ae17a-9009-f191-fe35-464d0c3ebcc3	\N	CourseMate.PaymentRequests.Delete	R	anonymous
3a1ae17a-900b-9e53-8058-575543c63124	\N	CourseMate.Reviews	R	anonymous
3a1ae17a-900c-b058-3ac5-08ebb4198a87	\N	CourseMate.Reviews.Create	R	anonymous
3a1ae17a-900d-686f-ec0d-7c2e283f99d5	\N	CourseMate.Reviews.Edit	R	anonymous
3a1ae17a-900e-18b9-67ee-3cdaf41099e3	\N	CourseMate.Reviews.Delete	R	anonymous
3a1ae17a-9014-9c0d-5ce1-db00fa3f8c64	\N	CourseMate.Books	R	student
3a1ae17a-9016-b546-c049-fc6790ea2a30	\N	CourseMate.Books.Create	R	student
3a1ae17a-9017-6fb5-1d4a-5b1b6af4b12d	\N	CourseMate.Books.Edit	R	student
3a1ae17a-9018-19b6-a77d-f953b2c79d79	\N	CourseMate.Books.Delete	R	student
3a1ae17a-901a-8375-854f-6936cbd584e9	\N	CourseMate.Categories	R	student
3a1ae17a-901b-235f-dc45-dda806b13b23	\N	CourseMate.Categories.Create	R	student
3a1ae17a-901c-27d9-ca4c-258b2a2594c4	\N	CourseMate.Categories.Edit	R	student
3a1ae17a-901e-1572-befc-e2a6140fda79	\N	CourseMate.Categories.Delete	R	student
3a1ae17a-901f-48b2-cd38-c8ddd4c47405	\N	CourseMate.Chapters	R	student
3a1ae17a-9020-697c-1bdd-cb9743479a5a	\N	CourseMate.Chapters.Create	R	student
3a1ae17a-9021-4362-2c03-226612863f8e	\N	CourseMate.Chapters.Edit	R	student
3a1ae17a-9023-128b-aec7-69e2386f8884	\N	CourseMate.Chapters.Delete	R	student
3a1ae17a-9025-1881-0ba0-e2b3ddac1374	\N	CourseMate.Courses	R	student
3a1ae17a-9026-9986-c7ba-0174e6c70184	\N	CourseMate.Courses.Create	R	student
3a1ae17a-9027-c7f8-6717-fb11ce33a6cd	\N	CourseMate.Courses.Edit	R	student
3a1ae17a-9029-ece5-dd7e-d57875fd14a1	\N	CourseMate.Courses.Delete	R	student
3a1ae17a-902a-f765-6cc3-1308c29ebc37	\N	CourseMate.Enrollments	R	student
3a1ae17a-902b-bc8c-92ae-a4a8d7f070e7	\N	CourseMate.Enrollments.Create	R	student
3a1ae17a-902c-452b-09d2-c9e7de98912e	\N	CourseMate.Enrollments.Edit	R	student
3a1ae17a-902e-de7b-a464-263d43e84fc1	\N	CourseMate.Enrollments.Delete	R	student
3a1ae17a-902f-de02-ab42-d77426bf2ba3	\N	CourseMate.Lessons	R	student
3a1ae17a-9031-4b5f-b3eb-59cc3bb028dc	\N	CourseMate.Lessons.Create	R	student
3a1ae17a-9033-e2f0-9595-82fa94bc4e74	\N	CourseMate.Lessons.Edit	R	student
3a1ae17a-9034-95e1-f53a-dcad29901afe	\N	CourseMate.Lessons.Delete	R	student
3a1ae17a-9036-c45f-f4c0-945bf0642cc7	\N	CourseMate.Orders	R	student
3a1ae17a-9037-e1fc-c6c3-fdff3065cea5	\N	CourseMate.Orders.Create	R	student
3a1ae17a-9038-c602-15d5-fed4f4445b93	\N	CourseMate.Orders.Edit	R	student
3a1ae17a-9039-418b-0ea0-24781479e84b	\N	CourseMate.Orders.Delete	R	student
3a1ae17a-903b-5584-5dff-2b047dd3c6d6	\N	CourseMate.PaymentRequests	R	student
3a1ae17a-903c-303c-f50c-4d4ad004952d	\N	CourseMate.PaymentRequests.Create	R	student
3a1ae17a-903e-4640-80da-90a7ed32380a	\N	CourseMate.PaymentRequests.Edit	R	student
3a1ae17a-903f-611f-a92a-4dd1e1f659f4	\N	CourseMate.PaymentRequests.Delete	R	student
3a1ae17a-9041-5315-a0ef-eca8695765f5	\N	CourseMate.Reviews	R	student
3a1ae17a-9044-c3cb-da74-8b3cd1477541	\N	CourseMate.Reviews.Create	R	student
3a1ae17a-9045-f4dc-6f61-54a691bca7d8	\N	CourseMate.Reviews.Edit	R	student
3a1ae17a-9047-7b61-785b-7bc0809ba208	\N	CourseMate.Reviews.Delete	R	student
3a1ae17a-904b-3365-d9f9-25ad2bac00b5	\N	CourseMate.Books	R	student
3a1ae17a-904c-4e73-80e1-d88255cb1091	\N	CourseMate.Books.Create	R	student
3a1ae17a-904d-a2c3-dbfe-d55d8cf147d5	\N	CourseMate.Books.Edit	R	student
3a1ae17a-904f-12a9-0dc9-0f75f9152ae2	\N	CourseMate.Books.Delete	R	student
3a1ae17a-9050-a209-5e63-56004812b5c4	\N	CourseMate.Categories	R	student
3a1ae17a-9051-e728-fcca-fb0d7339a753	\N	CourseMate.Categories.Create	R	student
3a1ae17a-9053-0b01-27f8-e0716817a3cc	\N	CourseMate.Categories.Edit	R	student
3a1ae17a-9055-0da8-3f55-f65cd00868ea	\N	CourseMate.Categories.Delete	R	student
3a1ae17a-9056-ad88-9ced-26e51df99505	\N	CourseMate.Chapters	R	student
3a1ae17a-9057-95b9-67b6-c6b4e6632010	\N	CourseMate.Chapters.Create	R	student
3a1ae17a-9059-1fc5-9852-e96467e9b467	\N	CourseMate.Chapters.Edit	R	student
3a1ae17a-905a-bfef-be3c-c552862e1af8	\N	CourseMate.Chapters.Delete	R	student
3a1ae17a-905b-aea1-190e-61398d62da2a	\N	CourseMate.Courses	R	student
3a1ae17a-905d-fdad-5422-480284e3d0cc	\N	CourseMate.Courses.Create	R	student
3a1ae17a-905e-4a11-b5a0-6407dc8ccaf1	\N	CourseMate.Courses.Edit	R	student
3a1ae17a-9060-b587-fc91-f034fe801dd5	\N	CourseMate.Courses.Delete	R	student
3a1ae17a-9061-aa27-9fcc-141dc8c5c018	\N	CourseMate.Enrollments	R	student
3a1ae17a-9070-524c-3bcc-484c02a9d459	\N	CourseMate.Enrollments.Create	R	student
3a1ae17a-9073-8737-a4dc-c11ef7ab7bfc	\N	CourseMate.Enrollments.Edit	R	student
3a1ae17a-9075-95e7-4ad0-6aad71087a7b	\N	CourseMate.Enrollments.Delete	R	student
3a1ae17a-9077-be03-2ffd-1aebed41c55a	\N	CourseMate.Lessons	R	student
3a1ae17a-9079-199a-e959-dd3dbbdf0eac	\N	CourseMate.Lessons.Create	R	student
3a1ae17a-907b-96cf-567a-5432f2ddf89d	\N	CourseMate.Lessons.Edit	R	student
3a1ae17a-907c-6af0-2121-c05e41008836	\N	CourseMate.Lessons.Delete	R	student
3a1ae17a-907e-d0a3-dde5-166da258fcca	\N	CourseMate.Orders	R	student
3a1ae17a-9080-f628-01e6-068cbdc0a35a	\N	CourseMate.Orders.Create	R	student
3a1ae17a-9082-ead9-50c2-1ac4e110699c	\N	CourseMate.Orders.Edit	R	student
3a1ae17a-9084-e090-3cc4-75c330f25fbf	\N	CourseMate.Orders.Delete	R	student
3a1ae17a-9086-937d-06eb-d0cdddcf04b9	\N	CourseMate.PaymentRequests	R	student
3a1ae17a-9088-232b-f790-0195812bdd2e	\N	CourseMate.PaymentRequests.Create	R	student
3a1ae17a-908a-a3e1-9299-bb2c80b05050	\N	CourseMate.PaymentRequests.Edit	R	student
3a1ae17a-908b-2dff-921a-57902fa072b9	\N	CourseMate.PaymentRequests.Delete	R	student
3a1ae17a-908d-dbce-a2ec-cb3ffcbe5a3a	\N	CourseMate.Reviews	R	student
3a1ae17a-908f-a90e-8644-c432c4011608	\N	CourseMate.Reviews.Create	R	student
3a1ae17a-9091-2b7c-172e-8a75f21dd61a	\N	CourseMate.Reviews.Edit	R	student
3a1ae17a-9093-1837-8d10-739092aacd3c	\N	CourseMate.Reviews.Delete	R	student
\.


--
-- TOC entry 5275 (class 0 OID 25795)
-- Dependencies: 229
-- Data for Name: AbpPermissionGroups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpPermissionGroups" ("Id", "Name", "DisplayName", "ExtraProperties") FROM stdin;
\.


--
-- TOC entry 5276 (class 0 OID 25802)
-- Dependencies: 230
-- Data for Name: AbpPermissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpPermissions" ("Id", "GroupName", "Name", "ParentName", "DisplayName", "IsEnabled", "MultiTenancySide", "Providers", "StateCheckers", "ExtraProperties") FROM stdin;
\.


--
-- TOC entry 5293 (class 0 OID 25953)
-- Dependencies: 247
-- Data for Name: AbpRoleClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpRoleClaims" ("Id", "RoleId", "TenantId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- TOC entry 5277 (class 0 OID 25809)
-- Dependencies: 231
-- Data for Name: AbpRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpRoles" ("Id", "TenantId", "Name", "NormalizedName", "IsDefault", "IsStatic", "IsPublic", "EntityVersion", "CreationTime", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
3a1ae17a-8ec8-8677-638d-2f8196a0fa7b	\N	admin	ADMIN	f	t	t	2	2025-07-03 15:01:06.264336	{}	4b9aa811a6634b90bcc2944a77f2e352
3846df90-0255-4084-9057-6148ce6e932b	\N	anonymous	ANONYMOUS	t	t	t	0	2025-07-03 15:01:06.510794	{}	b76ec7d6b93c4c268016583ac10ecdd7
21da0994-f1fa-4a1a-a488-9f448ab744e2	\N	student	STUDENT	f	t	t	0	2025-07-03 15:01:06.576743	{}	c40891d657214c8cb2bb4bfaee753422
79816d11-62d3-4ebf-9d5e-190822f1f066	\N	instructor	INSTRUCTOR	f	t	t	0	2025-07-03 15:01:06.632653	{}	837a8a8cd91749249d169ba9cd484354
\.


--
-- TOC entry 5278 (class 0 OID 25816)
-- Dependencies: 232
-- Data for Name: AbpSecurityLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpSecurityLogs" ("Id", "TenantId", "ApplicationName", "Identity", "Action", "UserId", "UserName", "TenantName", "ClientId", "CorrelationId", "ClientIpAddress", "BrowserInfo", "CreationTime", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
\.


--
-- TOC entry 5279 (class 0 OID 25823)
-- Dependencies: 233
-- Data for Name: AbpSessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpSessions" ("Id", "SessionId", "Device", "DeviceInfo", "TenantId", "UserId", "ClientId", "IpAddresses", "SignedIn", "LastAccessed", "ExtraProperties") FROM stdin;
\.


--
-- TOC entry 5280 (class 0 OID 25830)
-- Dependencies: 234
-- Data for Name: AbpSettingDefinitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpSettingDefinitions" ("Id", "Name", "DisplayName", "Description", "DefaultValue", "IsVisibleToClients", "Providers", "IsInherited", "IsEncrypted", "ExtraProperties") FROM stdin;
\.


--
-- TOC entry 5281 (class 0 OID 25837)
-- Dependencies: 235
-- Data for Name: AbpSettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpSettings" ("Id", "Name", "Value", "ProviderName", "ProviderKey") FROM stdin;
\.


--
-- TOC entry 5294 (class 0 OID 25965)
-- Dependencies: 248
-- Data for Name: AbpUserClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpUserClaims" ("Id", "UserId", "TenantId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- TOC entry 5282 (class 0 OID 25844)
-- Dependencies: 236
-- Data for Name: AbpUserDelegations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpUserDelegations" ("Id", "TenantId", "SourceUserId", "TargetUserId", "StartTime", "EndTime") FROM stdin;
\.


--
-- TOC entry 5295 (class 0 OID 25977)
-- Dependencies: 249
-- Data for Name: AbpUserLogins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpUserLogins" ("UserId", "LoginProvider", "TenantId", "ProviderKey", "ProviderDisplayName") FROM stdin;
\.


--
-- TOC entry 5296 (class 0 OID 25987)
-- Dependencies: 250
-- Data for Name: AbpUserOrganizationUnits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpUserOrganizationUnits" ("UserId", "OrganizationUnitId", "TenantId", "CreationTime", "CreatorId") FROM stdin;
\.


--
-- TOC entry 5297 (class 0 OID 26002)
-- Dependencies: 251
-- Data for Name: AbpUserRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpUserRoles" ("UserId", "RoleId", "TenantId") FROM stdin;
3a1ae17a-8d7a-6ecd-e52f-257feabe6030	3a1ae17a-8ec8-8677-638d-2f8196a0fa7b	\N
\.


--
-- TOC entry 5298 (class 0 OID 26017)
-- Dependencies: 252
-- Data for Name: AbpUserTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpUserTokens" ("UserId", "LoginProvider", "Name", "TenantId", "Value") FROM stdin;
\.


--
-- TOC entry 5283 (class 0 OID 25849)
-- Dependencies: 237
-- Data for Name: AbpUsers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AbpUsers" ("Id", "TenantId", "UserName", "NormalizedUserName", "Name", "Surname", "Email", "NormalizedEmail", "EmailConfirmed", "PasswordHash", "SecurityStamp", "IsExternal", "PhoneNumber", "PhoneNumberConfirmed", "IsActive", "TwoFactorEnabled", "LockoutEnd", "LockoutEnabled", "AccessFailedCount", "ShouldChangePasswordOnNextLogin", "EntityVersion", "LastPasswordChangeTime", "ExtraProperties", "ConcurrencyStamp", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
3a1ae17a-8d7a-6ecd-e52f-257feabe6030	\N	admin	ADMIN	admin	\N	admin@abp.io	ADMIN@ABP.IO	f	AQAAAAIAAYagAAAAEAWYn2f2uCzdgpcUc084ad5tLRIQn5cltzxkv+/6n7h1CTgQE2kaVCET6sDQNO2GBA==	YNYVCVTS374VQ4K2U3LAEBT6BKAPN3MZ	f	\N	f	t	f	\N	t	0	f	2	2025-07-03 15:01:05.973389+07	{}	084f0b6524424930a215b43257449c01	2025-07-03 15:01:06.067418	\N	2025-07-03 15:01:06.404822	\N	f	\N	\N
\.


--
-- TOC entry 5286 (class 0 OID 25878)
-- Dependencies: 240
-- Data for Name: OpenIddictApplications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OpenIddictApplications" ("Id", "ApplicationType", "ClientId", "ClientSecret", "ClientType", "ConsentType", "DisplayName", "DisplayNames", "JsonWebKeySet", "Permissions", "PostLogoutRedirectUris", "Properties", "RedirectUris", "Requirements", "Settings", "ClientUri", "LogoUri", "ExtraProperties", "ConcurrencyStamp", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
3a1ae17a-91bd-44bb-614c-2c2367d06e01	web	CourseMate_App	\N	public	implicit	Console Test / Angular Application	\N	\N	["ept:end_session","gt:authorization_code","rst:code","ept:authorization","ept:token","ept:revocation","ept:introspection","gt:password","gt:client_credentials","gt:refresh_token","gt:LinkLogin","gt:Impersonation","scp:address","scp:email","scp:phone","scp:profile","scp:roles","scp:CourseMate"]	["http://localhost:4200"]	\N	["http://localhost:4200"]	\N	\N	\N	\N	{}	35a01c10842845d8b4dbf343fe0b4f64	2025-07-03 15:01:07.035754	\N	\N	\N	f	\N	\N
3a1ae17a-91ea-0942-948c-ffe1336a9dd1	web	CourseMate_Swagger	\N	public	implicit	Swagger Application	\N	\N	["ept:end_session","gt:authorization_code","rst:code","ept:authorization","ept:token","ept:revocation","ept:introspection","scp:address","scp:email","scp:phone","scp:profile","scp:roles","scp:CourseMate"]	\N	\N	["https://localhost:44393/swagger/oauth2-redirect.html"]	\N	\N	\N	\N	{}	30c8a1b426634a6698ffc960d8c8592b	2025-07-03 15:01:07.051523	\N	\N	\N	f	\N	\N
\.


--
-- TOC entry 5300 (class 0 OID 26047)
-- Dependencies: 254
-- Data for Name: OpenIddictAuthorizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OpenIddictAuthorizations" ("Id", "ApplicationId", "CreationDate", "Properties", "Scopes", "Status", "Subject", "Type", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
\.


--
-- TOC entry 5287 (class 0 OID 25886)
-- Dependencies: 241
-- Data for Name: OpenIddictScopes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OpenIddictScopes" ("Id", "Description", "Descriptions", "DisplayName", "DisplayNames", "Name", "Properties", "Resources", "ExtraProperties", "ConcurrencyStamp", "CreationTime", "CreatorId", "LastModificationTime", "LastModifierId", "IsDeleted", "DeleterId", "DeletionTime") FROM stdin;
3a1ae17a-917b-0a42-2fd7-f28b95f74f41	\N	\N	CourseMate API	\N	CourseMate	\N	["CourseMate"]	{}	76e879aca14b4b1baa44605c93c349fa	2025-07-03 15:01:06.96223	\N	\N	\N	f	\N	\N
\.


--
-- TOC entry 5306 (class 0 OID 26136)
-- Dependencies: 260
-- Data for Name: OpenIddictTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OpenIddictTokens" ("Id", "ApplicationId", "AuthorizationId", "CreationDate", "ExpirationDate", "Payload", "Properties", "RedemptionDate", "ReferenceId", "Status", "Subject", "Type", "ExtraProperties", "ConcurrencyStamp") FROM stdin;
\.


--
-- TOC entry 5264 (class 0 OID 25714)
-- Dependencies: 218
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20250703080023_V1	9.0.4
\.


--
-- TOC entry 5009 (class 2606 OID 25869)
-- Name: Books PK_Books; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Books"
    ADD CONSTRAINT "PK_Books" PRIMARY KEY ("Id");


--
-- TOC entry 5011 (class 2606 OID 25877)
-- Name: Categories PK_Categories; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Categories"
    ADD CONSTRAINT "PK_Categories" PRIMARY KEY ("Id");


--
-- TOC entry 5068 (class 2606 OID 26096)
-- Name: Chapters PK_Chapters; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Chapters"
    ADD CONSTRAINT "PK_Chapters" PRIMARY KEY ("Id");


--
-- TOC entry 5055 (class 2606 OID 26036)
-- Name: Courses PK_Courses; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Courses"
    ADD CONSTRAINT "PK_Courses" PRIMARY KEY ("Id");


--
-- TOC entry 5072 (class 2606 OID 26107)
-- Name: Enrollments PK_Enrollments; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Enrollments"
    ADD CONSTRAINT "PK_Enrollments" PRIMARY KEY ("Id");


--
-- TOC entry 5088 (class 2606 OID 26177)
-- Name: Lessons PK_Lessons; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Lessons"
    ADD CONSTRAINT "PK_Lessons" PRIMARY KEY ("Id");


--
-- TOC entry 5085 (class 2606 OID 26159)
-- Name: OrderItems PK_OrderItems; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."OrderItems"
    ADD CONSTRAINT "PK_OrderItems" PRIMARY KEY ("Id");


--
-- TOC entry 5062 (class 2606 OID 26066)
-- Name: Orders PK_Orders; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Orders"
    ADD CONSTRAINT "PK_Orders" PRIMARY KEY ("Id");


--
-- TOC entry 5019 (class 2606 OID 25901)
-- Name: PaymentRequests PK_PaymentRequests; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."PaymentRequests"
    ADD CONSTRAINT "PK_PaymentRequests" PRIMARY KEY ("Id");


--
-- TOC entry 5076 (class 2606 OID 26125)
-- Name: Reviews PK_Reviews; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Reviews"
    ADD CONSTRAINT "PK_Reviews" PRIMARY KEY ("Id");


--
-- TOC entry 5023 (class 2606 OID 25908)
-- Name: AbpAuditLogActions PK_AbpAuditLogActions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpAuditLogActions"
    ADD CONSTRAINT "PK_AbpAuditLogActions" PRIMARY KEY ("Id");


--
-- TOC entry 4944 (class 2606 OID 25728)
-- Name: AbpAuditLogs PK_AbpAuditLogs; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpAuditLogs"
    ADD CONSTRAINT "PK_AbpAuditLogs" PRIMARY KEY ("Id");


--
-- TOC entry 4947 (class 2606 OID 25738)
-- Name: AbpBackgroundJobs PK_AbpBackgroundJobs; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpBackgroundJobs"
    ADD CONSTRAINT "PK_AbpBackgroundJobs" PRIMARY KEY ("Id");


--
-- TOC entry 4950 (class 2606 OID 25745)
-- Name: AbpBlobContainers PK_AbpBlobContainers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpBlobContainers"
    ADD CONSTRAINT "PK_AbpBlobContainers" PRIMARY KEY ("Id");


--
-- TOC entry 5031 (class 2606 OID 25932)
-- Name: AbpBlobs PK_AbpBlobs; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpBlobs"
    ADD CONSTRAINT "PK_AbpBlobs" PRIMARY KEY ("Id");


--
-- TOC entry 4952 (class 2606 OID 25752)
-- Name: AbpClaimTypes PK_AbpClaimTypes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpClaimTypes"
    ADD CONSTRAINT "PK_AbpClaimTypes" PRIMARY KEY ("Id");


--
-- TOC entry 5027 (class 2606 OID 25920)
-- Name: AbpEntityChanges PK_AbpEntityChanges; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpEntityChanges"
    ADD CONSTRAINT "PK_AbpEntityChanges" PRIMARY KEY ("Id");


--
-- TOC entry 5065 (class 2606 OID 26083)
-- Name: AbpEntityPropertyChanges PK_AbpEntityPropertyChanges; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpEntityPropertyChanges"
    ADD CONSTRAINT "PK_AbpEntityPropertyChanges" PRIMARY KEY ("Id");


--
-- TOC entry 4955 (class 2606 OID 25759)
-- Name: AbpFeatureGroups PK_AbpFeatureGroups; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpFeatureGroups"
    ADD CONSTRAINT "PK_AbpFeatureGroups" PRIMARY KEY ("Id");


--
-- TOC entry 4962 (class 2606 OID 25771)
-- Name: AbpFeatureValues PK_AbpFeatureValues; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpFeatureValues"
    ADD CONSTRAINT "PK_AbpFeatureValues" PRIMARY KEY ("Id");


--
-- TOC entry 4959 (class 2606 OID 25766)
-- Name: AbpFeatures PK_AbpFeatures; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpFeatures"
    ADD CONSTRAINT "PK_AbpFeatures" PRIMARY KEY ("Id");


--
-- TOC entry 4965 (class 2606 OID 25776)
-- Name: AbpLinkUsers PK_AbpLinkUsers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpLinkUsers"
    ADD CONSTRAINT "PK_AbpLinkUsers" PRIMARY KEY ("Id");


--
-- TOC entry 5034 (class 2606 OID 25942)
-- Name: AbpOrganizationUnitRoles PK_AbpOrganizationUnitRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpOrganizationUnitRoles"
    ADD CONSTRAINT "PK_AbpOrganizationUnitRoles" PRIMARY KEY ("OrganizationUnitId", "RoleId");


--
-- TOC entry 4969 (class 2606 OID 25784)
-- Name: AbpOrganizationUnits PK_AbpOrganizationUnits; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpOrganizationUnits"
    ADD CONSTRAINT "PK_AbpOrganizationUnits" PRIMARY KEY ("Id");


--
-- TOC entry 4972 (class 2606 OID 25794)
-- Name: AbpPermissionGrants PK_AbpPermissionGrants; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpPermissionGrants"
    ADD CONSTRAINT "PK_AbpPermissionGrants" PRIMARY KEY ("Id");


--
-- TOC entry 4975 (class 2606 OID 25801)
-- Name: AbpPermissionGroups PK_AbpPermissionGroups; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpPermissionGroups"
    ADD CONSTRAINT "PK_AbpPermissionGroups" PRIMARY KEY ("Id");


--
-- TOC entry 4979 (class 2606 OID 25808)
-- Name: AbpPermissions PK_AbpPermissions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpPermissions"
    ADD CONSTRAINT "PK_AbpPermissions" PRIMARY KEY ("Id");


--
-- TOC entry 5037 (class 2606 OID 25959)
-- Name: AbpRoleClaims PK_AbpRoleClaims; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpRoleClaims"
    ADD CONSTRAINT "PK_AbpRoleClaims" PRIMARY KEY ("Id");


--
-- TOC entry 4982 (class 2606 OID 25815)
-- Name: AbpRoles PK_AbpRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpRoles"
    ADD CONSTRAINT "PK_AbpRoles" PRIMARY KEY ("Id");


--
-- TOC entry 4988 (class 2606 OID 25822)
-- Name: AbpSecurityLogs PK_AbpSecurityLogs; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpSecurityLogs"
    ADD CONSTRAINT "PK_AbpSecurityLogs" PRIMARY KEY ("Id");


--
-- TOC entry 4993 (class 2606 OID 25829)
-- Name: AbpSessions PK_AbpSessions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpSessions"
    ADD CONSTRAINT "PK_AbpSessions" PRIMARY KEY ("Id");


--
-- TOC entry 4996 (class 2606 OID 25836)
-- Name: AbpSettingDefinitions PK_AbpSettingDefinitions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpSettingDefinitions"
    ADD CONSTRAINT "PK_AbpSettingDefinitions" PRIMARY KEY ("Id");


--
-- TOC entry 4999 (class 2606 OID 25843)
-- Name: AbpSettings PK_AbpSettings; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpSettings"
    ADD CONSTRAINT "PK_AbpSettings" PRIMARY KEY ("Id");


--
-- TOC entry 5040 (class 2606 OID 25971)
-- Name: AbpUserClaims PK_AbpUserClaims; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserClaims"
    ADD CONSTRAINT "PK_AbpUserClaims" PRIMARY KEY ("Id");


--
-- TOC entry 5001 (class 2606 OID 25848)
-- Name: AbpUserDelegations PK_AbpUserDelegations; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserDelegations"
    ADD CONSTRAINT "PK_AbpUserDelegations" PRIMARY KEY ("Id");


--
-- TOC entry 5043 (class 2606 OID 25981)
-- Name: AbpUserLogins PK_AbpUserLogins; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserLogins"
    ADD CONSTRAINT "PK_AbpUserLogins" PRIMARY KEY ("UserId", "LoginProvider");


--
-- TOC entry 5046 (class 2606 OID 25991)
-- Name: AbpUserOrganizationUnits PK_AbpUserOrganizationUnits; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserOrganizationUnits"
    ADD CONSTRAINT "PK_AbpUserOrganizationUnits" PRIMARY KEY ("OrganizationUnitId", "UserId");


--
-- TOC entry 5049 (class 2606 OID 26006)
-- Name: AbpUserRoles PK_AbpUserRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserRoles"
    ADD CONSTRAINT "PK_AbpUserRoles" PRIMARY KEY ("UserId", "RoleId");


--
-- TOC entry 5051 (class 2606 OID 26023)
-- Name: AbpUserTokens PK_AbpUserTokens; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserTokens"
    ADD CONSTRAINT "PK_AbpUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name");


--
-- TOC entry 5007 (class 2606 OID 25862)
-- Name: AbpUsers PK_AbpUsers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUsers"
    ADD CONSTRAINT "PK_AbpUsers" PRIMARY KEY ("Id");


--
-- TOC entry 5014 (class 2606 OID 25885)
-- Name: OpenIddictApplications PK_OpenIddictApplications; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenIddictApplications"
    ADD CONSTRAINT "PK_OpenIddictApplications" PRIMARY KEY ("Id");


--
-- TOC entry 5058 (class 2606 OID 26053)
-- Name: OpenIddictAuthorizations PK_OpenIddictAuthorizations; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenIddictAuthorizations"
    ADD CONSTRAINT "PK_OpenIddictAuthorizations" PRIMARY KEY ("Id");


--
-- TOC entry 5017 (class 2606 OID 25893)
-- Name: OpenIddictScopes PK_OpenIddictScopes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenIddictScopes"
    ADD CONSTRAINT "PK_OpenIddictScopes" PRIMARY KEY ("Id");


--
-- TOC entry 5081 (class 2606 OID 26142)
-- Name: OpenIddictTokens PK_OpenIddictTokens; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenIddictTokens"
    ADD CONSTRAINT "PK_OpenIddictTokens" PRIMARY KEY ("Id");


--
-- TOC entry 4940 (class 2606 OID 25718)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 5066 (class 1259 OID 26225)
-- Name: IX_Chapters_CourseId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Chapters_CourseId" ON app."Chapters" USING btree ("CourseId");


--
-- TOC entry 5052 (class 1259 OID 26226)
-- Name: IX_Courses_CategoryId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Courses_CategoryId" ON app."Courses" USING btree ("CategoryId");


--
-- TOC entry 5053 (class 1259 OID 26227)
-- Name: IX_Courses_InstructorId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Courses_InstructorId" ON app."Courses" USING btree ("InstructorId");


--
-- TOC entry 5069 (class 1259 OID 26228)
-- Name: IX_Enrollments_CourseId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Enrollments_CourseId" ON app."Enrollments" USING btree ("CourseId");


--
-- TOC entry 5070 (class 1259 OID 26229)
-- Name: IX_Enrollments_StudentId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Enrollments_StudentId" ON app."Enrollments" USING btree ("StudentId");


--
-- TOC entry 5086 (class 1259 OID 26230)
-- Name: IX_Lessons_ChapterId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Lessons_ChapterId" ON app."Lessons" USING btree ("ChapterId");


--
-- TOC entry 5082 (class 1259 OID 26237)
-- Name: IX_OrderItems_CourseId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_OrderItems_CourseId" ON app."OrderItems" USING btree ("CourseId");


--
-- TOC entry 5083 (class 1259 OID 26238)
-- Name: IX_OrderItems_OrderId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_OrderItems_OrderId" ON app."OrderItems" USING btree ("OrderId");


--
-- TOC entry 5059 (class 1259 OID 26239)
-- Name: IX_Orders_PaymentRequestId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE UNIQUE INDEX "IX_Orders_PaymentRequestId" ON app."Orders" USING btree ("PaymentRequestId");


--
-- TOC entry 5060 (class 1259 OID 26240)
-- Name: IX_Orders_StudentId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Orders_StudentId" ON app."Orders" USING btree ("StudentId");


--
-- TOC entry 5073 (class 1259 OID 26241)
-- Name: IX_Reviews_CourseId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Reviews_CourseId" ON app."Reviews" USING btree ("CourseId");


--
-- TOC entry 5074 (class 1259 OID 26242)
-- Name: IX_Reviews_StudentId; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX "IX_Reviews_StudentId" ON app."Reviews" USING btree ("StudentId");


--
-- TOC entry 5020 (class 1259 OID 26183)
-- Name: IX_AbpAuditLogActions_AuditLogId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpAuditLogActions_AuditLogId" ON public."AbpAuditLogActions" USING btree ("AuditLogId");


--
-- TOC entry 5021 (class 1259 OID 26184)
-- Name: IX_AbpAuditLogActions_TenantId_ServiceName_MethodName_Executio~; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpAuditLogActions_TenantId_ServiceName_MethodName_Executio~" ON public."AbpAuditLogActions" USING btree ("TenantId", "ServiceName", "MethodName", "ExecutionTime");


--
-- TOC entry 4941 (class 1259 OID 26185)
-- Name: IX_AbpAuditLogs_TenantId_ExecutionTime; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpAuditLogs_TenantId_ExecutionTime" ON public."AbpAuditLogs" USING btree ("TenantId", "ExecutionTime");


--
-- TOC entry 4942 (class 1259 OID 26186)
-- Name: IX_AbpAuditLogs_TenantId_UserId_ExecutionTime; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpAuditLogs_TenantId_UserId_ExecutionTime" ON public."AbpAuditLogs" USING btree ("TenantId", "UserId", "ExecutionTime");


--
-- TOC entry 4945 (class 1259 OID 26187)
-- Name: IX_AbpBackgroundJobs_IsAbandoned_NextTryTime; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpBackgroundJobs_IsAbandoned_NextTryTime" ON public."AbpBackgroundJobs" USING btree ("IsAbandoned", "NextTryTime");


--
-- TOC entry 4948 (class 1259 OID 26188)
-- Name: IX_AbpBlobContainers_TenantId_Name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpBlobContainers_TenantId_Name" ON public."AbpBlobContainers" USING btree ("TenantId", "Name");


--
-- TOC entry 5028 (class 1259 OID 26189)
-- Name: IX_AbpBlobs_ContainerId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpBlobs_ContainerId" ON public."AbpBlobs" USING btree ("ContainerId");


--
-- TOC entry 5029 (class 1259 OID 26190)
-- Name: IX_AbpBlobs_TenantId_ContainerId_Name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpBlobs_TenantId_ContainerId_Name" ON public."AbpBlobs" USING btree ("TenantId", "ContainerId", "Name");


--
-- TOC entry 5024 (class 1259 OID 26191)
-- Name: IX_AbpEntityChanges_AuditLogId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpEntityChanges_AuditLogId" ON public."AbpEntityChanges" USING btree ("AuditLogId");


--
-- TOC entry 5025 (class 1259 OID 26192)
-- Name: IX_AbpEntityChanges_TenantId_EntityTypeFullName_EntityId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpEntityChanges_TenantId_EntityTypeFullName_EntityId" ON public."AbpEntityChanges" USING btree ("TenantId", "EntityTypeFullName", "EntityId");


--
-- TOC entry 5063 (class 1259 OID 26193)
-- Name: IX_AbpEntityPropertyChanges_EntityChangeId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpEntityPropertyChanges_EntityChangeId" ON public."AbpEntityPropertyChanges" USING btree ("EntityChangeId");


--
-- TOC entry 4953 (class 1259 OID 26194)
-- Name: IX_AbpFeatureGroups_Name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpFeatureGroups_Name" ON public."AbpFeatureGroups" USING btree ("Name");


--
-- TOC entry 4960 (class 1259 OID 26197)
-- Name: IX_AbpFeatureValues_Name_ProviderName_ProviderKey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpFeatureValues_Name_ProviderName_ProviderKey" ON public."AbpFeatureValues" USING btree ("Name", "ProviderName", "ProviderKey");


--
-- TOC entry 4956 (class 1259 OID 26195)
-- Name: IX_AbpFeatures_GroupName; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpFeatures_GroupName" ON public."AbpFeatures" USING btree ("GroupName");


--
-- TOC entry 4957 (class 1259 OID 26196)
-- Name: IX_AbpFeatures_Name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpFeatures_Name" ON public."AbpFeatures" USING btree ("Name");


--
-- TOC entry 4963 (class 1259 OID 26198)
-- Name: IX_AbpLinkUsers_SourceUserId_SourceTenantId_TargetUserId_Targe~; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpLinkUsers_SourceUserId_SourceTenantId_TargetUserId_Targe~" ON public."AbpLinkUsers" USING btree ("SourceUserId", "SourceTenantId", "TargetUserId", "TargetTenantId");


--
-- TOC entry 5032 (class 1259 OID 26199)
-- Name: IX_AbpOrganizationUnitRoles_RoleId_OrganizationUnitId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpOrganizationUnitRoles_RoleId_OrganizationUnitId" ON public."AbpOrganizationUnitRoles" USING btree ("RoleId", "OrganizationUnitId");


--
-- TOC entry 4966 (class 1259 OID 26200)
-- Name: IX_AbpOrganizationUnits_Code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpOrganizationUnits_Code" ON public."AbpOrganizationUnits" USING btree ("Code");


--
-- TOC entry 4967 (class 1259 OID 26201)
-- Name: IX_AbpOrganizationUnits_ParentId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpOrganizationUnits_ParentId" ON public."AbpOrganizationUnits" USING btree ("ParentId");


--
-- TOC entry 4970 (class 1259 OID 26202)
-- Name: IX_AbpPermissionGrants_TenantId_Name_ProviderName_ProviderKey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpPermissionGrants_TenantId_Name_ProviderName_ProviderKey" ON public."AbpPermissionGrants" USING btree ("TenantId", "Name", "ProviderName", "ProviderKey");


--
-- TOC entry 4973 (class 1259 OID 26203)
-- Name: IX_AbpPermissionGroups_Name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpPermissionGroups_Name" ON public."AbpPermissionGroups" USING btree ("Name");


--
-- TOC entry 4976 (class 1259 OID 26204)
-- Name: IX_AbpPermissions_GroupName; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpPermissions_GroupName" ON public."AbpPermissions" USING btree ("GroupName");


--
-- TOC entry 4977 (class 1259 OID 26205)
-- Name: IX_AbpPermissions_Name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpPermissions_Name" ON public."AbpPermissions" USING btree ("Name");


--
-- TOC entry 5035 (class 1259 OID 26206)
-- Name: IX_AbpRoleClaims_RoleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpRoleClaims_RoleId" ON public."AbpRoleClaims" USING btree ("RoleId");


--
-- TOC entry 4980 (class 1259 OID 26207)
-- Name: IX_AbpRoles_NormalizedName; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpRoles_NormalizedName" ON public."AbpRoles" USING btree ("NormalizedName");


--
-- TOC entry 4983 (class 1259 OID 26208)
-- Name: IX_AbpSecurityLogs_TenantId_Action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpSecurityLogs_TenantId_Action" ON public."AbpSecurityLogs" USING btree ("TenantId", "Action");


--
-- TOC entry 4984 (class 1259 OID 26209)
-- Name: IX_AbpSecurityLogs_TenantId_ApplicationName; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpSecurityLogs_TenantId_ApplicationName" ON public."AbpSecurityLogs" USING btree ("TenantId", "ApplicationName");


--
-- TOC entry 4985 (class 1259 OID 26210)
-- Name: IX_AbpSecurityLogs_TenantId_Identity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpSecurityLogs_TenantId_Identity" ON public."AbpSecurityLogs" USING btree ("TenantId", "Identity");


--
-- TOC entry 4986 (class 1259 OID 26211)
-- Name: IX_AbpSecurityLogs_TenantId_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpSecurityLogs_TenantId_UserId" ON public."AbpSecurityLogs" USING btree ("TenantId", "UserId");


--
-- TOC entry 4989 (class 1259 OID 26212)
-- Name: IX_AbpSessions_Device; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpSessions_Device" ON public."AbpSessions" USING btree ("Device");


--
-- TOC entry 4990 (class 1259 OID 26213)
-- Name: IX_AbpSessions_SessionId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpSessions_SessionId" ON public."AbpSessions" USING btree ("SessionId");


--
-- TOC entry 4991 (class 1259 OID 26214)
-- Name: IX_AbpSessions_TenantId_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpSessions_TenantId_UserId" ON public."AbpSessions" USING btree ("TenantId", "UserId");


--
-- TOC entry 4994 (class 1259 OID 26215)
-- Name: IX_AbpSettingDefinitions_Name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpSettingDefinitions_Name" ON public."AbpSettingDefinitions" USING btree ("Name");


--
-- TOC entry 4997 (class 1259 OID 26216)
-- Name: IX_AbpSettings_Name_ProviderName_ProviderKey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_AbpSettings_Name_ProviderName_ProviderKey" ON public."AbpSettings" USING btree ("Name", "ProviderName", "ProviderKey");


--
-- TOC entry 5038 (class 1259 OID 26217)
-- Name: IX_AbpUserClaims_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpUserClaims_UserId" ON public."AbpUserClaims" USING btree ("UserId");


--
-- TOC entry 5041 (class 1259 OID 26218)
-- Name: IX_AbpUserLogins_LoginProvider_ProviderKey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpUserLogins_LoginProvider_ProviderKey" ON public."AbpUserLogins" USING btree ("LoginProvider", "ProviderKey");


--
-- TOC entry 5044 (class 1259 OID 26219)
-- Name: IX_AbpUserOrganizationUnits_UserId_OrganizationUnitId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpUserOrganizationUnits_UserId_OrganizationUnitId" ON public."AbpUserOrganizationUnits" USING btree ("UserId", "OrganizationUnitId");


--
-- TOC entry 5047 (class 1259 OID 26220)
-- Name: IX_AbpUserRoles_RoleId_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpUserRoles_RoleId_UserId" ON public."AbpUserRoles" USING btree ("RoleId", "UserId");


--
-- TOC entry 5002 (class 1259 OID 26221)
-- Name: IX_AbpUsers_Email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpUsers_Email" ON public."AbpUsers" USING btree ("Email");


--
-- TOC entry 5003 (class 1259 OID 26222)
-- Name: IX_AbpUsers_NormalizedEmail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpUsers_NormalizedEmail" ON public."AbpUsers" USING btree ("NormalizedEmail");


--
-- TOC entry 5004 (class 1259 OID 26223)
-- Name: IX_AbpUsers_NormalizedUserName; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpUsers_NormalizedUserName" ON public."AbpUsers" USING btree ("NormalizedUserName");


--
-- TOC entry 5005 (class 1259 OID 26224)
-- Name: IX_AbpUsers_UserName; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AbpUsers_UserName" ON public."AbpUsers" USING btree ("UserName");


--
-- TOC entry 5012 (class 1259 OID 26231)
-- Name: IX_OpenIddictApplications_ClientId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OpenIddictApplications_ClientId" ON public."OpenIddictApplications" USING btree ("ClientId");


--
-- TOC entry 5056 (class 1259 OID 26232)
-- Name: IX_OpenIddictAuthorizations_ApplicationId_Status_Subject_Type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OpenIddictAuthorizations_ApplicationId_Status_Subject_Type" ON public."OpenIddictAuthorizations" USING btree ("ApplicationId", "Status", "Subject", "Type");


--
-- TOC entry 5015 (class 1259 OID 26233)
-- Name: IX_OpenIddictScopes_Name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OpenIddictScopes_Name" ON public."OpenIddictScopes" USING btree ("Name");


--
-- TOC entry 5077 (class 1259 OID 26234)
-- Name: IX_OpenIddictTokens_ApplicationId_Status_Subject_Type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OpenIddictTokens_ApplicationId_Status_Subject_Type" ON public."OpenIddictTokens" USING btree ("ApplicationId", "Status", "Subject", "Type");


--
-- TOC entry 5078 (class 1259 OID 26235)
-- Name: IX_OpenIddictTokens_AuthorizationId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OpenIddictTokens_AuthorizationId" ON public."OpenIddictTokens" USING btree ("AuthorizationId");


--
-- TOC entry 5079 (class 1259 OID 26236)
-- Name: IX_OpenIddictTokens_ReferenceId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_OpenIddictTokens_ReferenceId" ON public."OpenIddictTokens" USING btree ("ReferenceId");


--
-- TOC entry 5109 (class 2606 OID 26097)
-- Name: Chapters FK_Chapters_Courses_CourseId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Chapters"
    ADD CONSTRAINT "FK_Chapters_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES app."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 5103 (class 2606 OID 26037)
-- Name: Courses FK_Courses_AbpUsers_InstructorId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Courses"
    ADD CONSTRAINT "FK_Courses_AbpUsers_InstructorId" FOREIGN KEY ("InstructorId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5104 (class 2606 OID 26042)
-- Name: Courses FK_Courses_Categories_CategoryId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Courses"
    ADD CONSTRAINT "FK_Courses_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES app."Categories"("Id") ON DELETE CASCADE;


--
-- TOC entry 5110 (class 2606 OID 26108)
-- Name: Enrollments FK_Enrollments_AbpUsers_StudentId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Enrollments"
    ADD CONSTRAINT "FK_Enrollments_AbpUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5111 (class 2606 OID 26113)
-- Name: Enrollments FK_Enrollments_Courses_CourseId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Enrollments"
    ADD CONSTRAINT "FK_Enrollments_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES app."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 5118 (class 2606 OID 26178)
-- Name: Lessons FK_Lessons_Chapters_ChapterId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Lessons"
    ADD CONSTRAINT "FK_Lessons_Chapters_ChapterId" FOREIGN KEY ("ChapterId") REFERENCES app."Chapters"("Id") ON DELETE CASCADE;


--
-- TOC entry 5116 (class 2606 OID 26160)
-- Name: OrderItems FK_OrderItems_Courses_CourseId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."OrderItems"
    ADD CONSTRAINT "FK_OrderItems_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES app."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 5117 (class 2606 OID 26165)
-- Name: OrderItems FK_OrderItems_Orders_OrderId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."OrderItems"
    ADD CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES app."Orders"("Id") ON DELETE CASCADE;


--
-- TOC entry 5106 (class 2606 OID 26067)
-- Name: Orders FK_Orders_AbpUsers_StudentId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Orders"
    ADD CONSTRAINT "FK_Orders_AbpUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5107 (class 2606 OID 26072)
-- Name: Orders FK_Orders_PaymentRequests_PaymentRequestId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Orders"
    ADD CONSTRAINT "FK_Orders_PaymentRequests_PaymentRequestId" FOREIGN KEY ("PaymentRequestId") REFERENCES app."PaymentRequests"("Id") ON DELETE CASCADE;


--
-- TOC entry 5112 (class 2606 OID 26126)
-- Name: Reviews FK_Reviews_AbpUsers_StudentId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Reviews"
    ADD CONSTRAINT "FK_Reviews_AbpUsers_StudentId" FOREIGN KEY ("StudentId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5113 (class 2606 OID 26131)
-- Name: Reviews FK_Reviews_Courses_CourseId; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app."Reviews"
    ADD CONSTRAINT "FK_Reviews_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES app."Courses"("Id") ON DELETE CASCADE;


--
-- TOC entry 5090 (class 2606 OID 25909)
-- Name: AbpAuditLogActions FK_AbpAuditLogActions_AbpAuditLogs_AuditLogId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpAuditLogActions"
    ADD CONSTRAINT "FK_AbpAuditLogActions_AbpAuditLogs_AuditLogId" FOREIGN KEY ("AuditLogId") REFERENCES public."AbpAuditLogs"("Id") ON DELETE CASCADE;


--
-- TOC entry 5092 (class 2606 OID 25933)
-- Name: AbpBlobs FK_AbpBlobs_AbpBlobContainers_ContainerId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpBlobs"
    ADD CONSTRAINT "FK_AbpBlobs_AbpBlobContainers_ContainerId" FOREIGN KEY ("ContainerId") REFERENCES public."AbpBlobContainers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5091 (class 2606 OID 25921)
-- Name: AbpEntityChanges FK_AbpEntityChanges_AbpAuditLogs_AuditLogId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpEntityChanges"
    ADD CONSTRAINT "FK_AbpEntityChanges_AbpAuditLogs_AuditLogId" FOREIGN KEY ("AuditLogId") REFERENCES public."AbpAuditLogs"("Id") ON DELETE CASCADE;


--
-- TOC entry 5108 (class 2606 OID 26084)
-- Name: AbpEntityPropertyChanges FK_AbpEntityPropertyChanges_AbpEntityChanges_EntityChangeId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpEntityPropertyChanges"
    ADD CONSTRAINT "FK_AbpEntityPropertyChanges_AbpEntityChanges_EntityChangeId" FOREIGN KEY ("EntityChangeId") REFERENCES public."AbpEntityChanges"("Id") ON DELETE CASCADE;


--
-- TOC entry 5093 (class 2606 OID 25943)
-- Name: AbpOrganizationUnitRoles FK_AbpOrganizationUnitRoles_AbpOrganizationUnits_OrganizationU~; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpOrganizationUnitRoles"
    ADD CONSTRAINT "FK_AbpOrganizationUnitRoles_AbpOrganizationUnits_OrganizationU~" FOREIGN KEY ("OrganizationUnitId") REFERENCES public."AbpOrganizationUnits"("Id") ON DELETE CASCADE;


--
-- TOC entry 5094 (class 2606 OID 25948)
-- Name: AbpOrganizationUnitRoles FK_AbpOrganizationUnitRoles_AbpRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpOrganizationUnitRoles"
    ADD CONSTRAINT "FK_AbpOrganizationUnitRoles_AbpRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AbpRoles"("Id") ON DELETE CASCADE;


--
-- TOC entry 5089 (class 2606 OID 25785)
-- Name: AbpOrganizationUnits FK_AbpOrganizationUnits_AbpOrganizationUnits_ParentId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpOrganizationUnits"
    ADD CONSTRAINT "FK_AbpOrganizationUnits_AbpOrganizationUnits_ParentId" FOREIGN KEY ("ParentId") REFERENCES public."AbpOrganizationUnits"("Id");


--
-- TOC entry 5095 (class 2606 OID 25960)
-- Name: AbpRoleClaims FK_AbpRoleClaims_AbpRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpRoleClaims"
    ADD CONSTRAINT "FK_AbpRoleClaims_AbpRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AbpRoles"("Id") ON DELETE CASCADE;


--
-- TOC entry 5096 (class 2606 OID 25972)
-- Name: AbpUserClaims FK_AbpUserClaims_AbpUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserClaims"
    ADD CONSTRAINT "FK_AbpUserClaims_AbpUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5097 (class 2606 OID 25982)
-- Name: AbpUserLogins FK_AbpUserLogins_AbpUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserLogins"
    ADD CONSTRAINT "FK_AbpUserLogins_AbpUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5098 (class 2606 OID 25992)
-- Name: AbpUserOrganizationUnits FK_AbpUserOrganizationUnits_AbpOrganizationUnits_OrganizationU~; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserOrganizationUnits"
    ADD CONSTRAINT "FK_AbpUserOrganizationUnits_AbpOrganizationUnits_OrganizationU~" FOREIGN KEY ("OrganizationUnitId") REFERENCES public."AbpOrganizationUnits"("Id") ON DELETE CASCADE;


--
-- TOC entry 5099 (class 2606 OID 25997)
-- Name: AbpUserOrganizationUnits FK_AbpUserOrganizationUnits_AbpUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserOrganizationUnits"
    ADD CONSTRAINT "FK_AbpUserOrganizationUnits_AbpUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5100 (class 2606 OID 26007)
-- Name: AbpUserRoles FK_AbpUserRoles_AbpRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserRoles"
    ADD CONSTRAINT "FK_AbpUserRoles_AbpRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AbpRoles"("Id") ON DELETE CASCADE;


--
-- TOC entry 5101 (class 2606 OID 26012)
-- Name: AbpUserRoles FK_AbpUserRoles_AbpUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserRoles"
    ADD CONSTRAINT "FK_AbpUserRoles_AbpUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5102 (class 2606 OID 26024)
-- Name: AbpUserTokens FK_AbpUserTokens_AbpUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AbpUserTokens"
    ADD CONSTRAINT "FK_AbpUserTokens_AbpUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AbpUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5105 (class 2606 OID 26054)
-- Name: OpenIddictAuthorizations FK_OpenIddictAuthorizations_OpenIddictApplications_Application~; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenIddictAuthorizations"
    ADD CONSTRAINT "FK_OpenIddictAuthorizations_OpenIddictApplications_Application~" FOREIGN KEY ("ApplicationId") REFERENCES public."OpenIddictApplications"("Id");


--
-- TOC entry 5114 (class 2606 OID 26143)
-- Name: OpenIddictTokens FK_OpenIddictTokens_OpenIddictApplications_ApplicationId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenIddictTokens"
    ADD CONSTRAINT "FK_OpenIddictTokens_OpenIddictApplications_ApplicationId" FOREIGN KEY ("ApplicationId") REFERENCES public."OpenIddictApplications"("Id");


--
-- TOC entry 5115 (class 2606 OID 26148)
-- Name: OpenIddictTokens FK_OpenIddictTokens_OpenIddictAuthorizations_AuthorizationId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OpenIddictTokens"
    ADD CONSTRAINT "FK_OpenIddictTokens_OpenIddictAuthorizations_AuthorizationId" FOREIGN KEY ("AuthorizationId") REFERENCES public."OpenIddictAuthorizations"("Id");


-- Completed on 2025-07-03 15:02:50

--
-- PostgreSQL database dump complete
--

