--
-- PostgreSQL database dump
--

\restrict yufuqDqmPMkalNsBzHuZcap01e0XFX4nwJxspTqIfo1HLL8aMWjUe7H6U1RYky7

-- Dumped from database version 16.1
-- Dumped by pg_dump version 18.3 (Homebrew)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Availability; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Availability" AS ENUM (
    'AVAILABLE',
    'BUSY',
    'OFFLINE'
);


--
-- Name: ContractStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ContractStatus" AS ENUM (
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."JobStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'CLOSED'
);


--
-- Name: MilestoneStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MilestoneStatus" AS ENUM (
    'PENDING',
    'COMPLETED'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID'
);


--
-- Name: ProficiencyLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProficiencyLevel" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'EXPERT'
);


--
-- Name: ProposalStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProposalStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'CLIENT',
    'FREELANCER',
    'ADMIN'
);


--
-- Name: VerificationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VerificationType" AS ENUM (
    'EMAIL',
    'PHONE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AIRecommendation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AIRecommendation" (
    id text NOT NULL,
    job_id text NOT NULL,
    freelancer_id text NOT NULL,
    match_score double precision NOT NULL,
    reasoning text NOT NULL,
    generated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ClientProfile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClientProfile" (
    id text NOT NULL,
    user_id text NOT NULL,
    company_name text NOT NULL,
    industry text NOT NULL,
    total_jobs_posted integer NOT NULL,
    bio text,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Contract; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Contract" (
    id text NOT NULL,
    job_id text NOT NULL,
    freelancer_id text NOT NULL,
    client_id text NOT NULL,
    agreed_amount double precision NOT NULL,
    status public."ContractStatus" NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: FreelancerProfile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FreelancerProfile" (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    hourly_rate double precision NOT NULL,
    ai_score double precision NOT NULL,
    availability public."Availability" NOT NULL,
    bio text,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: FreelancerSkill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FreelancerSkill" (
    freelancer_id text NOT NULL,
    skill_id text NOT NULL,
    proficiency_level public."ProficiencyLevel" NOT NULL
);


--
-- Name: Job; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Job" (
    id text NOT NULL,
    client_id text NOT NULL,
    title text NOT NULL,
    budget_min double precision NOT NULL,
    budget_max double precision NOT NULL,
    status public."JobStatus" NOT NULL,
    deadline timestamp(3) without time zone NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    sender_id text NOT NULL,
    receiver_id text NOT NULL,
    job_id text NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Milestone; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Milestone" (
    id text NOT NULL,
    contract_id text NOT NULL,
    title text NOT NULL,
    amount double precision NOT NULL,
    status public."MilestoneStatus" NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    contract_id text NOT NULL,
    milestone_id text NOT NULL,
    amount double precision NOT NULL,
    status public."PaymentStatus" NOT NULL,
    paid_at timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Proposal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Proposal" (
    id text NOT NULL,
    job_id text NOT NULL,
    freelancer_id text NOT NULL,
    bid_amount double precision NOT NULL,
    status public."ProposalStatus" NOT NULL,
    ai_relevance_score double precision NOT NULL,
    cover_letter text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    contract_id text NOT NULL,
    reviewer_id text NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Skill" (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    full_name text NOT NULL,
    role public."Role" NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    "passwordHash" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    phone text NOT NULL,
    phone_verified boolean DEFAULT false NOT NULL
);


--
-- Name: VerificationCode; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VerificationCode" (
    id text NOT NULL,
    user_id text NOT NULL,
    code text NOT NULL,
    type public."VerificationType" NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: _JobToSkill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_JobToSkill" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: AIRecommendation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AIRecommendation" (id, job_id, freelancer_id, match_score, reasoning, generated_at) FROM stdin;
\.


--
-- Data for Name: ClientProfile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClientProfile" (id, user_id, company_name, industry, total_jobs_posted, bio, location, "createdAt") FROM stdin;
2ce8ef95-a026-439f-95e9-15cfd182d78d	33ef48b9-9c68-44a8-93b2-6087dcefa9f4			0	\N	\N	2026-04-16 21:01:06.577
0bd3b643-0529-4bc9-a497-a944d1e96dec	2efdd2b8-ea0d-44f8-b892-7633c1bdacbe	Г. Алтан Co., Ltd	IT	0	\N	Улаанбаатар	2026-04-22 21:21:20.317
bbc94da6-3848-43d2-990e-c155b7578af2	e0cef59a-b91d-4110-af56-83fee4c8e72c	А. Сүх Co., Ltd	Finance	0	\N	Улаанбаатар	2026-04-22 21:21:20.328
414abac8-0679-438e-9f44-496837e19df4	f380d2df-1e2c-4918-a1ad-91713210e1e5	М. Болд Co., Ltd	Construction	3	\N	Улаанбаатар	2026-04-22 21:21:20.339
be007b13-975e-45a2-8767-0b2bad3c49bf	910186ac-c9ff-42db-8e17-47818a2b1097	Ж. Сүх Co., Ltd	Design	2	\N	Улаанбаатар	2026-04-22 21:21:20.349
00759bc5-4b3e-4210-94ba-bcb6dceced50	970e7061-435e-4e56-b2f8-5d866947dfd7	Д. Наран Co., Ltd	Marketing	4	\N	Улаанбаатар	2026-04-22 21:21:20.36
5d1e18de-3949-49f6-9bda-276c9ed807b7	81b88d39-1c48-46bb-aff0-ccc813d84c40	Г. Бат Co., Ltd	Education	2	\N	Улаанбаатар	2026-04-22 21:21:20.372
b462324b-9f26-4f72-9514-c8958fe5301b	90d3a059-f35e-4d5a-83e9-9b8325ab42f1	А. Болд Co., Ltd	Retail	0	\N	Улаанбаатар	2026-04-22 21:21:20.383
4fcfd340-bf70-4053-878a-819a221c6098	1845349f-d986-4ef7-8bd6-7283eb15034e	М. Баяр Co., Ltd	IT	0	\N	Улаанбаатар	2026-04-22 21:21:20.394
0ea30c57-46fc-48a2-b0ea-9f421ff188a4	18c75f2f-2162-4d91-9755-3a92bd4c8033	Ж. Алтан Co., Ltd	Finance	0	\N	Улаанбаатар	2026-04-22 21:21:20.405
9f6157c2-fe88-458b-92cc-23af35f4c3a5	14f94cc4-6114-42bf-b2a6-48d8f1fd903d	Д. Гэрэл Co., Ltd	Construction	1	\N	Улаанбаатар	2026-04-22 21:21:20.417
88269fb7-6c89-4d79-bbbc-08c7e8579d96	2e802997-0d01-4739-98ba-64f0aa5e514f	Г. Тулга Co., Ltd	Design	0	\N	Улаанбаатар	2026-04-22 21:21:20.427
910e2f37-83d0-4509-8c12-49bb75bbe30d	93b5b039-b2d1-40d5-be39-5a651ae44a5a	А. Цэцэг Co., Ltd	Marketing	0	\N	Улаанбаатар	2026-04-22 21:21:20.436
fd57550f-96ad-4e99-8d0e-7887360982d8	091a1adf-5b90-433a-a594-2fa291317272	М. Бат Co., Ltd	Education	2	\N	Улаанбаатар	2026-04-22 21:21:20.447
f110771f-b8dd-4720-9868-be3c61205ed2	cc6bc3e7-751a-4d11-b6df-b7cfa177e099	Fintech Startup	Finance	0	\N	Улаанбаатар	2026-04-16 20:48:02.361
0194bda8-bba7-4e43-8bb5-f24f1ec8b384	e953a5a5-1724-4593-bcdd-3342953a88af	Global Reach SEO	Marketing	0	\N	Улаанбаатар	2026-04-22 20:34:44.199
225b756e-06d2-434b-8928-feb14ecf234c	32370eeb-812b-462f-b888-a0755f8feecf	WordCraft Solutions	Content & Translation	0	\N	Зайнаас	2026-04-22 20:34:44.203
e5d142ab-4e0a-4849-9ef7-51d837a64327	5f125b9e-af60-42e2-9f3b-67c4e48bfee8	Creative Agency	Design	0	\N	Зайнаас	2026-04-16 20:48:02.357
6afc642f-aba0-45b2-aed0-bf10290c50c6	06515955-961d-496b-9682-c710c4152922	Г. Наран Co., Ltd	Finance	0	\N	Улаанбаатар	2026-04-22 21:21:20.06
b60fb263-e089-4e35-84f6-17182a83e342	81991ca0-cd48-4577-bc48-e8c82462f28e	А. Баяр Co., Ltd	Construction	1	\N	Улаанбаатар	2026-04-22 21:21:20.073
6c1e6780-2045-4c82-aa41-6862708ec200	a4c4f060-7e2b-44b7-949e-538025e6b592	М. Тулга Co., Ltd	Design	3	\N	Улаанбаатар	2026-04-22 21:21:20.084
8a7caf1b-3086-4b1f-939a-897012ed3394	0d2171e1-e524-4d24-b75c-cf9518bd6f2a	Ж. Болд Co., Ltd	Marketing	4	\N	Улаанбаатар	2026-04-22 21:21:20.093
382c9c7a-4875-46f1-a29d-da55dadeaf4c	ee6e1ace-c4dd-49d8-8d91-c661cdbcfc58	Д. Болд Co., Ltd	Education	3	\N	Улаанбаатар	2026-04-22 21:21:20.103
bf3e0d80-9f33-443a-8c2c-e58334523660	bb37e90d-6798-4220-9487-e5fb53148430	Г. Алтан Co., Ltd	Retail	4	\N	Улаанбаатар	2026-04-22 21:21:20.114
a557c475-7da6-45f7-bf38-83c5ea605e2b	6e889351-bdb9-4992-863a-c4a19c06474b	А. Сүх Co., Ltd	IT	1	\N	Улаанбаатар	2026-04-22 21:21:20.154
39be1fb2-06ef-4328-8a41-47e7876c721c	c1dfe898-bd46-4fd3-8d9b-75fedc6b418c	М. Сүх Co., Ltd	Finance	4	\N	Улаанбаатар	2026-04-22 21:21:20.164
bee30239-efc3-4a93-a21a-acf530f72e2d	483df433-d14c-48ba-bf1b-12b537af67da	Ж. Наран Co., Ltd	Construction	0	\N	Улаанбаатар	2026-04-22 21:21:20.175
fa5fe1d0-abf8-423b-baf3-95fad15f2fb2	3d5d7fe4-33f7-4963-b8fc-b189b86e4b96	Д. Тулга Co., Ltd	Design	2	\N	Улаанбаатар	2026-04-22 21:21:20.187
980c59fb-70f1-46b6-b574-49e1a5f84572	68e0425a-1ab2-4c5f-8c7d-c9d60aab8297	Г. Баяр Co., Ltd	Marketing	0	\N	Улаанбаатар	2026-04-22 21:21:20.198
77293f64-670b-4033-8411-4a83d0140ed3	4b329983-44f7-4a74-a4cb-3250ee26eeb7	А. Бат Co., Ltd	Education	3	\N	Улаанбаатар	2026-04-22 21:21:20.209
8b9b8744-a768-45b4-bdad-52c08c6a0c73	976a7a06-d4fd-48fc-8d7d-8fc92306a20a	М. Цэцэг Co., Ltd	Retail	4	\N	Улаанбаатар	2026-04-22 21:21:20.221
b27135cb-16aa-466b-8277-ee06cee93d28	634ae2f5-d5cb-4fb8-b972-9022d6cbe956	Ж. Бат Co., Ltd	IT	1	\N	Улаанбаатар	2026-04-22 21:21:20.233
1da2bc88-1956-4d4d-8e52-b7489c5a7374	aeadca3f-60ab-472e-8ecd-e075fef2675a	Д. Бат Co., Ltd	Finance	3	\N	Улаанбаатар	2026-04-22 21:21:20.245
627810bc-9a98-4102-8584-9541e098ef0d	43d0f4e0-4535-4b6f-a254-0d932f73d61b	Г. Бат Co., Ltd	Construction	4	\N	Улаанбаатар	2026-04-22 21:21:20.256
1ac18cff-3b5a-45ac-a668-dc12d1581dde	0b9a37ce-bd78-4d52-80ea-4f8587a15c05	А. Алтан Co., Ltd	Design	0	\N	Улаанбаатар	2026-04-22 21:21:20.267
0c74968c-b4e0-4b44-a798-481cfe78adb4	63db5351-b4a4-4fbb-a757-3ef076349302	М. Баяр Co., Ltd	Marketing	0	\N	Улаанбаатар	2026-04-22 21:21:20.28
301680a1-dd8d-4bcd-b536-73978f7bdec2	c4a09a34-d4e5-4cf8-bd6b-9f965b9fb6c2	Ж. Гэрэл Co., Ltd	Education	3	\N	Улаанбаатар	2026-04-22 21:21:20.291
8582df55-c966-44e1-a00e-7bb60a5045bb	f49f05f2-c067-469a-b98f-ac455ff64e0f	Д. Цэцэг Co., Ltd	Retail	2	\N	Улаанбаатар	2026-04-22 21:21:20.306
c93e494d-d023-4f04-857b-cba497597733	a8a72d5a-4994-4547-bf42-694c7107ce3b	Ж. Алтан Co., Ltd	Retail	2	\N	Улаанбаатар	2026-04-22 21:21:20.458
3224d786-bd84-4bf1-9b86-e2bde020c884	089103ec-6a7a-4508-a939-88170b301827	Д. Гэрэл Co., Ltd	IT	3	\N	Улаанбаатар	2026-04-22 21:21:20.47
24ecf0ef-51df-4142-b235-216218fb1f52	ef90314d-6a95-4b1c-94d4-20bbcfa0210f	Г. Гэрэл Co., Ltd	Finance	4	\N	Улаанбаатар	2026-04-22 21:21:20.481
ac9c3a84-43ce-44fb-86fa-bd5c3c23d999	8ced4b58-1c74-40c3-8e56-3c222f2e84c5	А. Алтан Co., Ltd	Construction	3	\N	Улаанбаатар	2026-04-22 21:21:20.492
332b6beb-462e-4bbb-bf30-000a5bb8c4c2	ea305993-88f9-49e9-a583-02dd0887b3ee	М. Эрдэнэ Co., Ltd	Design	4	\N	Улаанбаатар	2026-04-22 21:21:20.504
8d244dc4-c5e4-4172-919f-d86353800b69	167436b8-067b-4c1d-b97c-f9d2da3836d2	Ж. Гэрэл Co., Ltd	Marketing	3	\N	Улаанбаатар	2026-04-22 21:21:20.516
7f027595-b70a-452a-b164-3fda8e10a450	aa8da7ec-2f27-4c30-9922-cd5ba3868a88	Д. Болд Co., Ltd	Education	2	\N	Улаанбаатар	2026-04-22 21:21:20.526
6715e6e0-89c9-493e-8ad8-304b2bd1589e	0cc861e9-8265-4c8d-a7d6-a6fc73cc2347	Г. Тулга Co., Ltd	Retail	2	\N	Улаанбаатар	2026-04-22 21:21:20.537
c5adc15a-1c21-47c4-86b9-7a775b380283	913ce84a-d1d0-49d7-b6b2-a2068a05baf2	А. Бат Co., Ltd	IT	0	\N	Улаанбаатар	2026-04-22 21:21:20.549
c91e1a17-d1d5-4659-8d69-198d09d23d85	8784dc9e-4718-410b-9917-fa223c021e98	М. Сүх Co., Ltd	Finance	4	\N	Улаанбаатар	2026-04-22 21:21:20.562
85461964-3e7b-4c11-8476-d60af5b92364	91107449-2c70-4994-b589-a0b091750764	Ж. Бат Co., Ltd	Construction	2	\N	Улаанбаатар	2026-04-22 21:21:20.574
36fb1d11-5e79-4efe-957a-b2797f5da51b	0d2810b1-f34f-4473-9956-640f1835b70b	Д. Болд Co., Ltd	Design	1	\N	Улаанбаатар	2026-04-22 21:21:20.585
74184b43-8fa0-4cce-bce0-87021d835136	4a48d314-45a9-4887-bdd8-ce5286f7b972	Г. Сүх Co., Ltd	Marketing	4	\N	Улаанбаатар	2026-04-22 21:21:20.597
c0b108bf-9f6c-45ef-a51e-94342025616a	0e058dfe-f709-4e1f-8a50-2a5da837a615	А. Алтан Co., Ltd	Education	0	\N	Улаанбаатар	2026-04-22 21:21:20.608
34452e20-26b5-4368-ad28-3fd0421e0bc7	f8d8c5b7-a0ee-469e-a2a1-a6a8717ea6f0	М. Сүх Co., Ltd	Retail	0	\N	Улаанбаатар	2026-04-22 21:21:20.62
a0384360-0a5f-4949-842a-1d69728b4195	794ad7fd-f8ed-46c8-be04-87dc63c0bae4	Ж. Наран Co., Ltd	IT	4	\N	Улаанбаатар	2026-04-22 21:21:20.631
b0f0be92-83d4-4ae1-a9fd-48effc9af811	29c63e57-c82a-4ed0-9c29-96b898ac26a4	Д. Бат Co., Ltd	Finance	4	\N	Улаанбаатар	2026-04-22 21:21:20.643
a0901ffa-b7a6-464f-8060-fb644499afc9	dfbdc6f0-fde2-4c6a-9885-b7dadc5817fb	TechStore LLC	E-Commerce	0	\N	Улаанбаатар	2026-04-16 20:48:02.346
29ee7936-ae15-4125-b9d8-72eef95a9ef2	df40c3f7-dd63-462b-b212-6e38f2a062a7	Global Solutions Tech	Human Resources & Technology	1	\N	Улаанбаатар	2026-04-22 22:00:57.351
\.


--
-- Data for Name: Contract; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Contract" (id, job_id, freelancer_id, client_id, agreed_amount, status, start_date, "createdAt") FROM stdin;
6494c484-b5bc-426d-a620-f25682bdc6c2	ca85a991-15bd-489e-850c-c313242585f6	88e8ea5c-7b07-4857-846b-82ad9cd2734e	a0901ffa-b7a6-464f-8060-fb644499afc9	2000000	COMPLETED	2025-10-01 00:00:00	2026-04-22 20:38:51.871
e6054ae0-4870-46c8-9622-a762d7f6cf23	0db2c14e-9068-4610-96a7-fa97f4c49843	5cc1e612-856a-4305-a0fe-2891ea27dff9	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	500000	COMPLETED	2025-12-01 00:00:00	2026-04-22 20:38:51.892
40357da6-33ef-493e-83f9-a3b8f0fbd844	5c7b1a44-89a3-45c4-b696-426c4cebc3d5	88e8ea5c-7b07-4857-846b-82ad9cd2734e	a0901ffa-b7a6-464f-8060-fb644499afc9	4000000	ACTIVE	2026-04-22 20:38:51.894	2026-04-22 20:38:51.895
5f3d9f30-845a-43dc-8a84-41e1a7b9e82c	d931884a-3bd0-4b15-bada-17709046b436	88e8ea5c-7b07-4857-846b-82ad9cd2734e	a0901ffa-b7a6-464f-8060-fb644499afc9	1500000	COMPLETED	2026-02-21 20:40:25.769	2026-04-22 20:40:25.77
513da87d-c425-4790-ac40-61b33b76e898	f62760be-62cb-4599-8982-f49d9b173342	5cc1e612-856a-4305-a0fe-2891ea27dff9	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	1500000	COMPLETED	2026-02-21 20:40:25.775	2026-04-22 20:40:25.775
3a30bd67-1f4c-4375-be41-06a651bfbfbe	427ca6ba-da09-4c0a-a8f5-44f8abddedd1	3fcb037f-ea13-44b4-a2b6-f7c4b4647408	225b756e-06d2-434b-8928-feb14ecf234c	1500000	COMPLETED	2026-02-21 20:40:25.778	2026-04-22 20:40:25.778
08606bc4-f1f6-49c0-8ae8-4e7fe4bf7c65	744b8ccf-4064-4f26-8d3a-02fe0be17388	27bbaba7-36b9-4377-96d3-95501f7888cd	f110771f-b8dd-4720-9868-be3c61205ed2	1500000	COMPLETED	2026-02-21 20:40:25.781	2026-04-22 20:40:25.782
cdad62b8-0b1d-46d6-bb41-9b0790aefdf9	d5c2d15f-0b06-4aa9-b670-22f22d0f70b6	88e8ea5c-7b07-4857-846b-82ad9cd2734e	f110771f-b8dd-4720-9868-be3c61205ed2	1500000	COMPLETED	2026-02-21 20:40:25.784	2026-04-22 20:40:25.785
0b35c742-b765-41c9-9ab6-da593f8f19ae	a22d7947-e926-4672-a7c2-056dd01895eb	ca32503f-1b13-40ec-bd41-cabe7d37aa4c	e5d142ab-4e0a-4849-9ef7-51d837a64327	1500000	COMPLETED	2026-02-21 20:40:25.787	2026-04-22 20:40:25.788
04952e61-6f82-483c-8b51-23b8591f5dfc	9efdca1f-0a98-49de-abd0-e4c9ec985cb8	88e8ea5c-7b07-4857-846b-82ad9cd2734e	a0901ffa-b7a6-464f-8060-fb644499afc9	5000000	ACTIVE	2026-04-22 20:40:25.791	2026-04-22 20:40:25.791
04c27987-813c-4193-921a-5861f1f3acf9	38d0557b-46a9-44eb-9f92-a15ec6c78d3c	5cc1e612-856a-4305-a0fe-2891ea27dff9	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	1500000	ACTIVE	2026-04-22 20:40:25.797	2026-04-22 20:40:25.797
11f6c6fa-ca47-43b0-961a-90c46aef1737	c7f78df7-d544-499a-b53e-609b58447d71	3fcb037f-ea13-44b4-a2b6-f7c4b4647408	225b756e-06d2-434b-8928-feb14ecf234c	800000	ACTIVE	2026-04-22 20:40:25.799	2026-04-22 20:40:25.799
c90f38fa-76d1-4080-927e-28f8369acc6f	902db69a-b778-43ee-baff-bc08ba510d2b	ca32503f-1b13-40ec-bd41-cabe7d37aa4c	e5d142ab-4e0a-4849-9ef7-51d837a64327	2000000	ACTIVE	2026-04-22 20:40:25.801	2026-04-22 20:40:25.802
c951ffc0-a6fb-47ad-9114-3e31a84fff79	b62d3a70-f3fb-4e33-b0fb-28464df5c72c	88e8ea5c-7b07-4857-846b-82ad9cd2734e	a0901ffa-b7a6-464f-8060-fb644499afc9	1500000	COMPLETED	2026-02-21 21:21:20.021	2026-04-22 21:21:20.022
0e8977d3-8007-4d44-8a2f-11c80b0a0b5e	1408eedf-2609-4a73-b558-ec59b3938bb9	5cc1e612-856a-4305-a0fe-2891ea27dff9	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	1500000	COMPLETED	2026-02-21 21:21:20.03	2026-04-22 21:21:20.03
2765f08a-f907-4822-9b17-dbd7d59dc7b6	f4a7b5a9-18cf-4090-8e1f-09e0caf64c9f	3fcb037f-ea13-44b4-a2b6-f7c4b4647408	225b756e-06d2-434b-8928-feb14ecf234c	1500000	COMPLETED	2026-02-21 21:21:20.034	2026-04-22 21:21:20.034
454bd4c8-1627-4eb3-b2a7-35402ff1a2e0	66051003-1fac-496f-aa14-6e95196ef3a9	27bbaba7-36b9-4377-96d3-95501f7888cd	f110771f-b8dd-4720-9868-be3c61205ed2	1500000	COMPLETED	2026-02-21 21:21:20.037	2026-04-22 21:21:20.038
9a2628e7-f58d-4dba-9d25-b5b0b9ce1ad6	af16cba1-7479-4e11-bca4-13cee0b343cb	88e8ea5c-7b07-4857-846b-82ad9cd2734e	f110771f-b8dd-4720-9868-be3c61205ed2	1500000	COMPLETED	2026-02-21 21:21:20.041	2026-04-22 21:21:20.042
783eb4af-f44b-499e-92ee-000bb9f42f8f	93e6846d-fc68-4006-9bf1-d2e503df8b93	ca32503f-1b13-40ec-bd41-cabe7d37aa4c	e5d142ab-4e0a-4849-9ef7-51d837a64327	1500000	COMPLETED	2026-02-21 21:21:20.045	2026-04-22 21:21:20.046
4759774b-3dd4-4391-917e-17efebebc96d	2adf7ef5-5e28-48ea-af50-3f71dcce1be8	88e8ea5c-7b07-4857-846b-82ad9cd2734e	a0901ffa-b7a6-464f-8060-fb644499afc9	1500000	COMPLETED	2026-02-21 22:00:56.778	2026-04-22 22:00:56.779
174fd7cd-6652-4f09-b988-cd7a7f72daab	df2a7a10-1818-444e-a98b-1ba1a421332c	5cc1e612-856a-4305-a0fe-2891ea27dff9	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	1500000	COMPLETED	2026-02-21 22:00:56.789	2026-04-22 22:00:56.789
b1eb8dcc-2cc3-4eb0-bfce-4c560bfb459f	991d8fd1-5cff-438a-87a5-5b4ac7ae1112	3fcb037f-ea13-44b4-a2b6-f7c4b4647408	225b756e-06d2-434b-8928-feb14ecf234c	1500000	COMPLETED	2026-02-21 22:00:56.793	2026-04-22 22:00:56.793
8e5c3178-fdfc-4065-920b-f5fc7ca50b01	37300fda-62ca-42cd-8c46-b146fcaadf29	27bbaba7-36b9-4377-96d3-95501f7888cd	f110771f-b8dd-4720-9868-be3c61205ed2	1500000	COMPLETED	2026-02-21 22:00:56.796	2026-04-22 22:00:56.797
f5468558-b5ab-4c3d-8ade-6a5c93035fe6	dd4f6751-b830-4bee-8e56-22b27797416e	88e8ea5c-7b07-4857-846b-82ad9cd2734e	f110771f-b8dd-4720-9868-be3c61205ed2	1500000	COMPLETED	2026-02-21 22:00:56.8	2026-04-22 22:00:56.8
5751fca5-1efc-4a59-8ac1-7922dbfd9c8a	6b58ab60-e8ba-4d53-86fa-1303cba568a3	ca32503f-1b13-40ec-bd41-cabe7d37aa4c	e5d142ab-4e0a-4849-9ef7-51d837a64327	1500000	COMPLETED	2026-02-21 22:00:56.804	2026-04-22 22:00:56.804
5ae6989a-b1ec-4e98-b101-cdffaf61a1e5	f0d82e85-1b7f-4ddb-828e-63a23cb7d447	88e8ea5c-7b07-4857-846b-82ad9cd2734e	a0901ffa-b7a6-464f-8060-fb644499afc9	1500000	COMPLETED	2026-02-21 22:02:45.99	2026-04-22 22:02:45.991
5e2af6f2-9e94-4c26-867b-444102b19702	9929fa08-1040-42c5-92da-3a6fe37ca9ba	5cc1e612-856a-4305-a0fe-2891ea27dff9	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	1500000	COMPLETED	2026-02-21 22:02:46	2026-04-22 22:02:46
5e2104de-7b7b-4e21-8d15-398d3b36265a	5bf1af1c-a9eb-4fe4-a2c3-b5201b420b92	3fcb037f-ea13-44b4-a2b6-f7c4b4647408	225b756e-06d2-434b-8928-feb14ecf234c	1500000	COMPLETED	2026-02-21 22:02:46.005	2026-04-22 22:02:46.005
916dfe10-22fa-4fcd-9c45-3cacf411cd5c	e3e91b77-b5e8-4cf9-83b5-b0a5bbb3a3d0	27bbaba7-36b9-4377-96d3-95501f7888cd	f110771f-b8dd-4720-9868-be3c61205ed2	1500000	COMPLETED	2026-02-21 22:02:46.008	2026-04-22 22:02:46.009
3591fc83-e97d-4453-82a4-1ca57a1a7175	06dfc947-2326-45e1-8d56-37c530b43284	88e8ea5c-7b07-4857-846b-82ad9cd2734e	f110771f-b8dd-4720-9868-be3c61205ed2	1500000	COMPLETED	2026-02-21 22:02:46.012	2026-04-22 22:02:46.012
31896db3-0aa1-45d8-9da8-8ce452ebe780	07080402-6c31-4729-a0f7-19e0d6c1330b	ca32503f-1b13-40ec-bd41-cabe7d37aa4c	e5d142ab-4e0a-4849-9ef7-51d837a64327	1500000	COMPLETED	2026-02-21 22:02:46.015	2026-04-22 22:02:46.015
97c0f56d-a7c5-47bd-88d1-ef1d6b65e8d6	7173b2da-5c28-43ba-a3a8-1f5046932d84	e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	29ee7936-ae15-4125-b9d8-72eef95a9ef2	3500000	ACTIVE	2026-04-22 22:02:46.762	2026-04-22 22:02:46.763
16de1580-a598-4d6b-a4f6-0b8f4984c1d8	d497745f-9bf9-4617-829f-8e8fbea6caf1	1ad783d9-ebb7-4d74-8c28-36c89613396a	29ee7936-ae15-4125-b9d8-72eef95a9ef2	800000	COMPLETED	2026-03-13 22:02:46.764	2026-04-22 22:02:46.764
\.


--
-- Data for Name: FreelancerProfile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FreelancerProfile" (id, user_id, title, hourly_rate, ai_score, availability, bio, location, "createdAt") FROM stdin;
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	0867486b-b93e-4a04-bd3d-8d1470481295	UI/UX Дизайнер	35000	4.656813581477916	AVAILABLE	UI/UX Дизайнер мэргэжилтэй, олон жилийн туршлагатай фрилансер.	Улаанбаатар	2026-04-16 20:48:02.383
661eb41c-127c-4538-b5f9-4ddc20fdc0d6	c9bf3a57-c929-4751-8707-36324aec12e5		0	0	AVAILABLE	\N	\N	2026-04-16 20:54:16.851
38e143c1-bc01-4b2b-8296-c3f6426d724d	be463e06-d274-48e9-9112-63064a9cb18c	Graphic Designer	55803.24912769514	4.112122105539979	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.051
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	294cc26c-d990-427d-9221-921e36ad47e0	Data Analyst	23382.54490984636	4.3196346252696	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.064
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	3a973a67-7565-418e-8eb9-cd1d1381a626	Web Dev	27049.74767056336	3.710009334802411	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.077
3b93c2a6-b614-4bda-a143-13971269d3db	27c65585-a3b7-4bef-bd0a-1a4c912542bc	Marketing Specialist	38543.44341380306	3.616503507805931	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.087
621a338a-1e6f-448b-b8c7-658753a8b91d	f19f76d4-4fe3-43c6-a9f9-ac0604bc47d5	Project Manager	39403.35566051157	4.691951440660631	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.096
d603073f-622f-4f2f-b959-f2f73bf5b647	7aa4e99c-796a-4c1f-913c-36a3067643ec	Graphic Designer	57528.04952406264	4.789333014031836	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.107
b5a7e94c-6d0d-4452-9418-09b310aacbb1	503a348f-4796-4ee4-8f7b-d83719ec5f0c	Data Analyst	53172.15801258315	4.292882085319222	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.145
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	576831d8-03ab-478e-b530-10328578e57f	Web Dev	31787.40063063173	3.868020182524974	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.157
a2de4664-a615-4f5d-b612-c1d45c4fac9d	b00be5cf-c184-4d50-9e18-530f5c377dfd	Graphic Designer	49012.87477654956	4.283795725695529	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.309
89e6429d-3c1c-4b41-b950-5da87b23b366	84c594db-f9f0-4429-a175-177ac67206c0	Data Analyst	29596.51390256329	3.807262518380816	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.32
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	efbb6ed9-e039-4ad1-a685-2abc35f1af5b	Mobile App Хөгжүүлэгч	40000	4.67044232337522	AVAILABLE	Mobile App Хөгжүүлэгч мэргэжилтэй, олон жилийн туршлагатай фрилансер.	Эрдэнэт	2026-04-16 20:48:02.392
5cc1e612-856a-4305-a0fe-2891ea27dff9	822fa309-1ecf-47b4-bb4a-71b31af6aae4	Дижитал Маркетинг Мэргэжилтэн	25000	4.938163010999919	AVAILABLE	Дижитал Маркетинг Мэргэжилтэн мэргэжилтэй, олон жилийн туршлагатай фрилансер.	Улаанбаатар	2026-04-22 20:34:44.243
08996435-aabf-4ddf-a431-78e082967750	ceade6e5-5dc1-44e9-98b4-f2c2ca38354b	Marketing Specialist	37326.91730498018	3.708362678598255	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.167
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	07639c23-a1ab-4320-a20b-9b468cb29beb	Project Manager	16651.14783822561	4.852557418440159	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.178
591ff74c-7ee6-4217-8aab-15d24502d67f	c016e9a1-7001-4555-bf79-23e3b2263d29	Graphic Designer	36243.43380715825	4.613591475722536	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.19
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	35bd7358-4fa7-48c4-8a50-7928e4a1a3a1	Контент бичигч & Орчуулагч	20000	4.583246677966692	AVAILABLE	Контент бичигч & Орчуулагч мэргэжилтэй, олон жилийн туршлагатай фрилансер.	Дархан	2026-04-22 20:34:44.25
27bbaba7-36b9-4377-96d3-95501f7888cd	b51e7748-282c-4fb3-812f-88a03afed012	Бизнес Аналитик	50000	4.839429104468237	AVAILABLE	Бизнес Аналитик мэргэжилтэй, олон жилийн туршлагатай фрилансер.	Улаанбаатар	2026-04-22 20:34:44.255
ac342902-6705-4421-9cff-f27504d9e840	142d4748-f6dd-4d84-ba0b-c1d579f0e879	Data Analyst	57955.70591552531	4.326923623555784	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.201
c7d79859-9002-4069-943f-aed4f43a52eb	bcdcc3bb-1f4e-4cc3-90bd-1c48f5e08f71	Web Dev	28703.38854836432	3.81862256488945	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.213
1834b356-7339-4ec7-9078-2a46f674d4a7	455c15dd-d46b-4a97-9224-54f47305bf5e	Marketing Specialist	38124.29657092224	3.789803552413402	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.224
617b2ec9-319d-4312-90ae-fa720d13fbdb	db4c3d70-971f-4225-8a31-176c4a85496e	Project Manager	30508.94593437209	3.540655681275039	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.236
51e45099-5ad4-4b03-bad9-5db5af98a2e8	b87698c0-de4a-4400-9150-04af75011956	Graphic Designer	15209.46671823225	4.576627921054873	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.248
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	2b2b0b4c-2340-4828-82f3-30b0e1a97c92	Data Analyst	17661.16428311724	4.474780421038037	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.259
6a37ea0b-39c8-442f-a4eb-b36e241c276c	c61ed029-dba6-42ce-91da-5289e15bf652	Web Dev	17729.39879552203	4.346105069000621	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.27
14f21e56-f343-40a1-b551-4db509af863b	39dd86fa-9f8a-4f0a-b3bf-42b4b4475e4a	Marketing Specialist	64579.4781949586	3.722051337053713	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.283
f83d795e-c21f-4e4e-bf20-9f26c37b8434	94f58c35-fe88-4f8b-8a94-5567ebc72bab	Project Manager	24987.93520929219	4.625492664135239	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.294
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	324acbb4-8d37-4d65-bd0d-4ddf4eeee4b2	Web Dev	52749.52480909944	4.554068266099081	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.331
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	c2d73db7-1df4-460e-8537-1b74fb8e224f	Marketing Specialist	61353.53999875174	3.663650019553731	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.342
1ad783d9-ebb7-4d74-8c28-36c89613396a	ef1b1d3c-662a-4bb3-ae17-f8e5fc6a15dc	Project Manager	30036.5854698288	3.566965122022825	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.352
d8543ef7-a973-4b55-9580-924c49d70164	d4db6937-3f90-4a43-b709-ce156fe21923	Graphic Designer	48344.24625831957	4.691892871740521	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.363
1d71f921-f884-4c85-a083-e1320e751e8c	c5ada1e9-5dc5-4c3c-a0df-66eb48b39599	Data Analyst	40613.41637996284	4.98791776803556	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.376
59ddf75b-e976-476b-adad-ca40b060a0e1	4e6f60fd-7a31-416d-8bf8-440cf7006857	Web Dev	24352.14150829773	4.141302531262776	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.386
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	25b2d246-60b7-4d46-bece-f1e8174bd1d3	Marketing Specialist	55921.55643873405	4.41263278421849	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.397
0704b660-ccda-41c1-a986-2f1a1c94b11d	626e8d3c-2191-4e4f-b961-2ffadb22b601	Project Manager	58241.09831881487	4.74228308317227	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.408
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	9565ce7e-8afe-457a-9415-6e570339b07d	Graphic Designer	15546.14960787527	3.8237772727647	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.421
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	406d0789-1aa5-425e-81db-4a096174d8b4	Data Analyst	63250.8379695553	4.667796375298621	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.429
bedf48ee-d5b7-489f-9871-3e335f57a29f	2bf21efa-271e-4271-9e9b-1effdbdc358e	Web Dev	48842.55920116013	4.980305895816286	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.439
b7627824-f738-462b-add9-edf6cab560ff	23e564d1-58fb-47bc-b265-9ba4846315f7	Marketing Specialist	35471.46741172332	4.374210543318025	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.45
912b5130-1e88-43ab-a581-1e0d596ec616	f4c2d1e4-5b38-4a22-a160-f42e1380096d	Project Manager	47226.7828645345	4.436354168773715	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.462
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	91b31a28-fde7-4a27-9860-06718c6863d0	Graphic Designer	62869.67245669607	3.812802735286168	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.474
2974c82e-241d-4f14-81ab-bb8056c02fec	6dcc6035-66ac-4de8-907e-b7ab90e08c2e	Data Analyst	37078.15807574514	3.885268898273288	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.484
38fb5d91-81f3-484e-be8e-782a907345bf	18062bd8-169e-4dbd-aef9-dbd6406d2b7b	Web Dev	30713.78909506392	4.747515485993593	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.495
bf4a3591-e1ed-4d2e-868a-af6512800329	46ffd2e3-1abf-490c-9acb-ee6a6473bdc8	Marketing Specialist	46529.10593720628	3.67815336160607	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.508
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	f8ae3f71-1cd6-48d6-a284-7a1fb0c10bbc	Project Manager	30699.51113775969	3.696037548787204	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.519
6d7e3226-ba54-46aa-a080-caf7921e26b9	66b54a53-2df6-45e3-823c-98058f334723	Graphic Designer	44651.07518108789	4.022468786640977	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.529
65da978f-e333-49ec-9fd5-aad7c97fc216	783270c4-592d-4d10-a930-951990b1b5a5	Data Analyst	52166.17923700596	4.213842883848088	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.54
64dda8b9-d046-42df-b275-2b18971bdc72	324192c3-c5a5-4642-aa5a-2a6d8ad11353	Web Dev	23734.12135545701	3.920095266959389	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.554
0ed0e027-ab78-4389-9da7-252039ef1968	79d75ca4-c70b-4235-99ea-f33f7c821e2d	Marketing Specialist	50456.19571663892	4.883433630845484	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.566
561a2aa8-b920-4a93-89ba-b92fe907dca3	d04d0171-4ec5-4c2e-8ac7-1b5baf5fe021	Project Manager	23814.83695907954	4.785645463355738	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.577
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	907aa2ad-1432-4689-bc36-7fe49dabe170	Graphic Designer	24716.54275529232	3.735357264197344	AVAILABLE	Туршлагатай Graphic Designer мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.589
84b5cf36-4d7a-42f2-b605-2583d68b4130	3716b2a4-202c-4670-bcff-972d9e9103c4	Data Analyst	22447.43244040755	3.691137442500162	AVAILABLE	Туршлагатай Data Analyst мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.6
5220293c-e122-4908-828a-9fd755e74c64	e20de5cf-76f0-47f9-bf8c-c8b544911786	Web Dev	21836.02979639138	3.924996753487559	AVAILABLE	Туршлагатай Web Dev мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.612
85ed4738-1910-4142-9045-009c38478e4e	ac976ac2-7ab4-4f82-89f7-07f8ae4183e9	Marketing Specialist	22143.63118079611	3.539235763244184	AVAILABLE	Туршлагатай Marketing Specialist мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.623
4f52f6f5-8124-4da2-b106-6521bb232714	8fc7dd1c-2ca6-4e39-98b0-98d010ab8026	Project Manager	35149.41987180154	4.270502791884904	AVAILABLE	Туршлагатай Project Manager мэргэжилтэн.	Улаанбаатар	2026-04-22 21:21:20.635
88e8ea5c-7b07-4857-846b-82ad9cd2734e	b48cf1ed-5c2f-480b-b108-1efab2e6b5db	Ахлах Full-Stack хөгжүүлэгч	45000	4.835553241339889	AVAILABLE	Ахлах Full-Stack хөгжүүлэгч мэргэжилтэй, олон жилийн туршлагатай фрилансер.	Улаанбаатар	2026-04-16 20:48:02.366
\.


--
-- Data for Name: FreelancerSkill; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FreelancerSkill" (freelancer_id, skill_id, proficiency_level) FROM stdin;
88e8ea5c-7b07-4857-846b-82ad9cd2734e	1f022262-9e5f-4ec8-8e29-caae4179d166	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	28eaab56-fd32-47c1-b872-7a88390c105f	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	57a68bdd-a27a-4b8e-82b0-36cb636028a6	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	9f2fa39a-7306-4f22-bf73-14a0b09a7d3a	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	a897c00c-c5c5-4757-810a-6d02f609c12c	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	8ca522ba-440f-45fc-9c85-b5d4d87d996a	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	2e0b4e82-f9c2-4ba8-808f-566fd4d1a8a5	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	bc93d903-647f-4039-84c2-42f4892a4b0c	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	cbff3da6-7074-479d-a047-9500146bdd9a	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	409e8ddf-5ed1-4acc-a203-66996baee3f9	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	394a650b-8fd8-4b3d-8712-cf3caa1f7c23	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	17a09a3d-cbab-4f1f-aaac-8b6fe10c0515	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	5ad36810-3926-4655-b4a0-1fc6d6037ac2	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	55175b7f-8f8b-4438-940a-6d42b4835e2d	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	7a013cbd-144c-4288-9900-402ea6923b39	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	93e4e4b8-78f4-40e0-9f03-02b1f73bccac	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	16bf7a71-f1dd-4bc3-badc-ca0a0c9f59a0	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	d34573b3-f7d0-4250-8e3d-a9746bf4b406	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	b6391643-b40d-4bcd-9e9c-9b3d2e356bc0	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	2b28dbfc-8ae8-43e3-9450-b429fa0a6dac	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	f15cdd72-dfe3-4cfa-8d75-ca66cb4de435	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	6b50e9f5-5548-484d-a529-183701be16cb	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	df1f1cbb-d4ef-4b57-a2f4-c9a3e0b00ee9	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	594e7a56-37da-41bc-8d4d-2ab3486e0477	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	9c95c54c-2537-44bc-b13b-ee63eb8e9a24	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	b4f982d6-ca74-42fe-ad93-d1f24912a9d3	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	4471d34b-d6ef-4101-8987-fcf44938f783	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	50b4ebc8-e5e9-43bd-8bc4-0f93338d8bb2	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	b64d706d-5fda-413d-98b2-2d30b384a723	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	a5307fe9-4486-4903-a90b-d84f3e0e45ef	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	f3aa8f89-1b03-4704-ba3d-61d723cd2ba3	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	54e0432c-7d78-462b-9d67-bede4570d1a5	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	2dcb1994-9dea-49c2-aea5-0bb006388454	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	9061676e-033a-48f8-b5c7-26f815106f3d	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	3804f6b1-a186-47f0-8863-3c96c5cfcd74	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	8116d10f-042a-49a3-bcde-794181f09461	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	c2302bf9-1294-479e-835e-074719494f6f	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	b22fee63-a3fe-45e1-9b97-6bd9072a476d	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	e858b0be-54d7-44a2-bc33-7e3563177ead	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	1b92c5da-1a14-4f1d-84bb-9cc4ba3f5b3d	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	cf4559f9-ae62-496d-9c0e-abb60c78a117	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	2d0f364f-1524-4751-bcbf-754b80364614	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	dd5cb862-f160-48ac-8402-0972e59d435a	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	7f484977-f8cc-45c3-b2b1-3137da7579d4	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	a3e0d6a0-92b2-4c57-8120-c071681d0f1e	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	d70a2749-6f34-4952-a036-51909b30ad83	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	02b43d5f-0352-47cb-9842-5482efafbe5b	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	58b2f127-f8ad-4da4-a9aa-c9095ea75654	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	abf6a284-934c-4b8e-babb-aeda572f0060	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	ac4987bc-a278-4970-9003-0f89d5d87bf1	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	af1b5221-14a0-437a-958c-45eec8cbc54a	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	56ffc152-3922-47f9-bc5a-4d14e8c7618b	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	e6b26b3e-f741-4d0f-9f55-90391b964c94	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	bfde4d22-9dbf-4ca2-be69-15c30f5e567c	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	b52b1876-54bf-47d3-b500-031d0c7b5c24	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	8882beb8-358a-4a1f-9028-2c4a8520e477	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	e9ac0d08-b2e3-48ee-8a75-5824942172fe	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	e3ad393e-956d-4d80-b3c6-91678d928792	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	dcf8b81c-857c-4e58-aadb-d43ef7773f41	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	c0e83862-a30a-48c4-8b22-fa56496eba51	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	9cc33714-73b9-4b5e-8307-d504fb5a7eb5	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	ba7cda3d-fa25-4f9b-9ea5-e341ecb11bb0	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	ea7bfe4b-395f-4b3c-9702-db580339c7ca	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	58756b23-051b-4edb-827c-0ba43dd9d52d	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	a5d74f2f-785e-4b5e-9923-1560f206e7e6	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	9eee99af-270d-4605-b01d-d30028490eb2	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	4c9518d2-e8ab-4e25-9ee2-6efdedfa28c3	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	c9477d97-80dd-48d1-b49f-1cf55fd1e644	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	9eee99af-270d-4605-b01d-d30028490eb2	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	0d83473d-8614-4b94-86d4-9de174f9758b	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	d7ab5769-ec43-4e01-ab86-2145e980e9b3	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	f1c0407e-d545-467c-b16c-d66940a39b4a	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	c3faa119-f073-4963-aa66-ede4237afe02	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	4ab6d4c9-3b4c-4420-a6f2-e8a358fe499c	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	5d4e6082-a6be-4d9c-a949-cf7b4070c4ea	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	d6535e56-cf6f-43f1-b0c7-4651ba5920f1	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	13294670-d674-45f2-b132-b7bc4e6e2650	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	ba8836d7-4503-4523-92ff-09663f691796	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	4395b95f-1829-4ce9-b1c1-b7dcdb3a8d77	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	3035eb4a-5bbb-4f43-8d6f-eb934ea3adbc	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	adfd85aa-badc-40e1-8908-91c54ad7e94b	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	52f00670-0d9e-41e4-96a5-e5280f43c1fe	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	2bfb0097-d209-49aa-afd9-fe641c8bddb2	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	dcb5645b-17c3-4adb-aee9-113ca99b193d	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	7d3ae1c0-49a5-4640-8b4d-174d39af4a82	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	c3189dd6-4f51-43e2-b93a-7fe813e4922b	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	dcb5645b-17c3-4adb-aee9-113ca99b193d	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	7882c621-8c4e-4d4d-86a6-5e77e9b04f3f	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	ff5be794-a9e7-48a0-b78e-3d3698fbeb2a	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	ff930333-279d-49ac-8172-af0809f732c4	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	93758b00-8168-47df-a9f3-e71110ef475c	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	0427e643-546c-4e9f-9b75-84e4ef3bd90e	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	da683bbe-f4f2-498e-9a5a-6f8bc418d402	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	f2b526c4-ce15-446e-ac42-a776fa4d3aa5	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	8b299e84-8e91-4525-96b2-8c4c474fd95e	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	fdfffbdd-f655-4645-9eb2-e100f71bc3cc	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	3b3125d6-e415-4719-b5c2-9552c3afc47b	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	f68e439b-61e0-47e1-967f-4fd94b944a59	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	7b4d8f2c-9375-4c2c-838b-cd9fc1642f1a	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	6acc7d76-7a46-4532-ae4d-191f9c34c5fd	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	cb0a6559-dfee-4de4-8bd7-a82fce9c528f	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	402db91d-dca6-4b69-92a4-8f468975e020	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	80723aee-e63a-4fe0-b91d-3d3f3ef9f68e	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	12b833b9-8087-4833-8675-b6d2961f07c3	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	402db91d-dca6-4b69-92a4-8f468975e020	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	dc2712b2-76c2-4df6-843a-ce1eff419289	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	7fe05b5d-ea64-44a9-a1df-c33e8a9061d5	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	813b7a53-f605-40b6-a907-e584496c4c19	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	f69b05ba-179b-4eab-b842-314672740305	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	0c785f45-95d9-481a-895e-a08237b625e0	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	1b88061c-c007-4363-8db6-6f48ea58345f	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	ae5545f9-ae8c-42cb-a832-28d424d00c58	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	21c7022b-9cd9-47b3-a267-f532c0428b59	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	8f30bd50-7d04-4e02-9639-b4858e023950	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	d125219d-3352-4b92-8f27-1c642fa86ca3	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	a2e23ce5-f928-4d71-a4b2-6b4ea8d13ef6	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	be18d06c-ff88-4e1a-843d-367d27c4b7f9	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	cda712cc-5f7c-471f-9cd1-224376c49087	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	3dbabd4b-f855-46bc-a336-9f4fb6f1bcc7	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	c0787ff7-72d0-452c-876b-f42cf369f768	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	4593d31a-56f1-447a-beef-98b5bcf437d7	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	b4566cc1-2a49-430e-8a08-c978d51ea7e9	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	c0787ff7-72d0-452c-876b-f42cf369f768	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	15996ad7-ed2e-43f8-b225-bab09f84b199	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	c1714667-c86a-4b4d-82d0-2e0a90d543ed	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	01a7d8f8-199c-4ddc-8780-7de2b326bfa9	EXPERT
38e143c1-bc01-4b2b-8296-c3f6426d724d	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
38e143c1-bc01-4b2b-8296-c3f6426d724d	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
38e143c1-bc01-4b2b-8296-c3f6426d724d	21c7022b-9cd9-47b3-a267-f532c0428b59	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	0c785f45-95d9-481a-895e-a08237b625e0	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	182e491d-e6c9-49f2-b3f3-e939929e0404	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	21c7022b-9cd9-47b3-a267-f532c0428b59	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	4593d31a-56f1-447a-beef-98b5bcf437d7	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	c0787ff7-72d0-452c-876b-f42cf369f768	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	8f30bd50-7d04-4e02-9639-b4858e023950	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	0c785f45-95d9-481a-895e-a08237b625e0	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	444a7fac-0b80-45d7-ae04-de96635332d9	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	d125219d-3352-4b92-8f27-1c642fa86ca3	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	a2e23ce5-f928-4d71-a4b2-6b4ea8d13ef6	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	444a7fac-0b80-45d7-ae04-de96635332d9	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	2b60fa30-e387-43ca-981d-527424d565f4	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	ae5545f9-ae8c-42cb-a832-28d424d00c58	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	ae5545f9-ae8c-42cb-a832-28d424d00c58	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	b4566cc1-2a49-430e-8a08-c978d51ea7e9	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	c0787ff7-72d0-452c-876b-f42cf369f768	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	3dbabd4b-f855-46bc-a336-9f4fb6f1bcc7	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	314ee414-46c0-489a-8be1-9e8b6f437956	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	d125219d-3352-4b92-8f27-1c642fa86ca3	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	c0787ff7-72d0-452c-876b-f42cf369f768	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	b4566cc1-2a49-430e-8a08-c978d51ea7e9	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	314ee414-46c0-489a-8be1-9e8b6f437956	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	182e491d-e6c9-49f2-b3f3-e939929e0404	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	b4566cc1-2a49-430e-8a08-c978d51ea7e9	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	d125219d-3352-4b92-8f27-1c642fa86ca3	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	4593d31a-56f1-447a-beef-98b5bcf437d7	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	444a7fac-0b80-45d7-ae04-de96635332d9	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	d125219d-3352-4b92-8f27-1c642fa86ca3	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	4593d31a-56f1-447a-beef-98b5bcf437d7	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	f69b05ba-179b-4eab-b842-314672740305	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	182e491d-e6c9-49f2-b3f3-e939929e0404	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	d125219d-3352-4b92-8f27-1c642fa86ca3	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	8f30bd50-7d04-4e02-9639-b4858e023950	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	f69b05ba-179b-4eab-b842-314672740305	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	ae5545f9-ae8c-42cb-a832-28d424d00c58	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	8f30bd50-7d04-4e02-9639-b4858e023950	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	b4566cc1-2a49-430e-8a08-c978d51ea7e9	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	444a7fac-0b80-45d7-ae04-de96635332d9	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	d125219d-3352-4b92-8f27-1c642fa86ca3	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	a2e23ce5-f928-4d71-a4b2-6b4ea8d13ef6	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	b4566cc1-2a49-430e-8a08-c978d51ea7e9	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	f69b05ba-179b-4eab-b842-314672740305	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	182e491d-e6c9-49f2-b3f3-e939929e0404	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	182e491d-e6c9-49f2-b3f3-e939929e0404	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	0c785f45-95d9-481a-895e-a08237b625e0	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	ae5545f9-ae8c-42cb-a832-28d424d00c58	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	182e491d-e6c9-49f2-b3f3-e939929e0404	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	3dbabd4b-f855-46bc-a336-9f4fb6f1bcc7	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	ae5545f9-ae8c-42cb-a832-28d424d00c58	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	b4566cc1-2a49-430e-8a08-c978d51ea7e9	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	f69b05ba-179b-4eab-b842-314672740305	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	15996ad7-ed2e-43f8-b225-bab09f84b199	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	c0787ff7-72d0-452c-876b-f42cf369f768	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	f69b05ba-179b-4eab-b842-314672740305	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	3dbabd4b-f855-46bc-a336-9f4fb6f1bcc7	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	be18d06c-ff88-4e1a-843d-367d27c4b7f9	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	314ee414-46c0-489a-8be1-9e8b6f437956	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	c0787ff7-72d0-452c-876b-f42cf369f768	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	21c7022b-9cd9-47b3-a267-f532c0428b59	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	314ee414-46c0-489a-8be1-9e8b6f437956	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	0c785f45-95d9-481a-895e-a08237b625e0	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	2b60fa30-e387-43ca-981d-527424d565f4	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	b4566cc1-2a49-430e-8a08-c978d51ea7e9	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	8f30bd50-7d04-4e02-9639-b4858e023950	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	314ee414-46c0-489a-8be1-9e8b6f437956	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	01a7d8f8-199c-4ddc-8780-7de2b326bfa9	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	d125219d-3352-4b92-8f27-1c642fa86ca3	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	be18d06c-ff88-4e1a-843d-367d27c4b7f9	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	15996ad7-ed2e-43f8-b225-bab09f84b199	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	a2e23ce5-f928-4d71-a4b2-6b4ea8d13ef6	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	a2e23ce5-f928-4d71-a4b2-6b4ea8d13ef6	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	0c785f45-95d9-481a-895e-a08237b625e0	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	4593d31a-56f1-447a-beef-98b5bcf437d7	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	b4566cc1-2a49-430e-8a08-c978d51ea7e9	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	314ee414-46c0-489a-8be1-9e8b6f437956	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	a2e23ce5-f928-4d71-a4b2-6b4ea8d13ef6	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	15996ad7-ed2e-43f8-b225-bab09f84b199	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	be18d06c-ff88-4e1a-843d-367d27c4b7f9	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	444a7fac-0b80-45d7-ae04-de96635332d9	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	0c785f45-95d9-481a-895e-a08237b625e0	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	15996ad7-ed2e-43f8-b225-bab09f84b199	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	21c7022b-9cd9-47b3-a267-f532c0428b59	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	c1714667-c86a-4b4d-82d0-2e0a90d543ed	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	3dbabd4b-f855-46bc-a336-9f4fb6f1bcc7	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	d125219d-3352-4b92-8f27-1c642fa86ca3	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	8f30bd50-7d04-4e02-9639-b4858e023950	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	be18d06c-ff88-4e1a-843d-367d27c4b7f9	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	4593d31a-56f1-447a-beef-98b5bcf437d7	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	ae5545f9-ae8c-42cb-a832-28d424d00c58	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	daa85f50-6e40-4a99-91e6-5bf046745e7e	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	314ee414-46c0-489a-8be1-9e8b6f437956	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	3dbabd4b-f855-46bc-a336-9f4fb6f1bcc7	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	34275cff-159e-4b57-854e-e87441d8d78a	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	1b88061c-c007-4363-8db6-6f48ea58345f	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	4593d31a-56f1-447a-beef-98b5bcf437d7	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	8f30bd50-7d04-4e02-9639-b4858e023950	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	be18d06c-ff88-4e1a-843d-367d27c4b7f9	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	cda712cc-5f7c-471f-9cd1-224376c49087	INTERMEDIATE
88e8ea5c-7b07-4857-846b-82ad9cd2734e	f8359f69-42d5-4517-818f-d59b2c8a6363	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	8fef30e9-ee6b-42a9-9d43-2258755ba7d2	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	5025c96f-1ef8-46d6-8dcd-267c606b01ee	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	efebb96e-f6df-41d7-a6eb-dfa02b537fe2	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	a482ed49-73e1-4ec2-9f82-58199e2fe0bb	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	94570165-ee15-4229-9e82-fb1f8473df3f	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	96ba7d3d-aac4-498a-af32-7006a7ceb277	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	060195bb-12b9-4497-be07-af219154f168	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	02a2a3cd-c8bf-4b85-a4ab-3aa71b1c681e	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	bee1ce19-6b8f-4380-93c8-571c7135d440	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	dea1d432-372b-4906-9f3d-364f0a772f0b	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	26acf9e0-32ed-433f-afc8-fea95da3a0e0	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	b7a9afe6-5689-4139-acaf-64834c54acc7	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	dea1d432-372b-4906-9f3d-364f0a772f0b	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	1f815584-d9c4-44fe-b5f6-580fbd656753	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	3602380e-2c13-49ba-9496-998250ff27c1	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	1e15b1ca-aedb-42e4-9dd5-94042f61c3b1	EXPERT
38e143c1-bc01-4b2b-8296-c3f6426d724d	5025c96f-1ef8-46d6-8dcd-267c606b01ee	INTERMEDIATE
38e143c1-bc01-4b2b-8296-c3f6426d724d	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
38e143c1-bc01-4b2b-8296-c3f6426d724d	1e15b1ca-aedb-42e4-9dd5-94042f61c3b1	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	a482ed49-73e1-4ec2-9f82-58199e2fe0bb	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	1f815584-d9c4-44fe-b5f6-580fbd656753	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	1e15b1ca-aedb-42e4-9dd5-94042f61c3b1	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	94570165-ee15-4229-9e82-fb1f8473df3f	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	efebb96e-f6df-41d7-a6eb-dfa02b537fe2	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	662e9840-89e7-4269-bdef-ec0dbf2f91ea	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	8fef30e9-ee6b-42a9-9d43-2258755ba7d2	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	a482ed49-73e1-4ec2-9f82-58199e2fe0bb	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	96ba7d3d-aac4-498a-af32-7006a7ceb277	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	662e9840-89e7-4269-bdef-ec0dbf2f91ea	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	bee1ce19-6b8f-4380-93c8-571c7135d440	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	b7a9afe6-5689-4139-acaf-64834c54acc7	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	bee1ce19-6b8f-4380-93c8-571c7135d440	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	5025c96f-1ef8-46d6-8dcd-267c606b01ee	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	f8359f69-42d5-4517-818f-d59b2c8a6363	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	96ba7d3d-aac4-498a-af32-7006a7ceb277	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	1e15b1ca-aedb-42e4-9dd5-94042f61c3b1	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	2f710c1d-3b35-4cd0-99f0-1c9f17852ed9	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	02a2a3cd-c8bf-4b85-a4ab-3aa71b1c681e	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	2f710c1d-3b35-4cd0-99f0-1c9f17852ed9	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	efebb96e-f6df-41d7-a6eb-dfa02b537fe2	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	96ba7d3d-aac4-498a-af32-7006a7ceb277	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	b7a9afe6-5689-4139-acaf-64834c54acc7	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	96ba7d3d-aac4-498a-af32-7006a7ceb277	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	3602380e-2c13-49ba-9496-998250ff27c1	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	94570165-ee15-4229-9e82-fb1f8473df3f	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	a482ed49-73e1-4ec2-9f82-58199e2fe0bb	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	5025c96f-1ef8-46d6-8dcd-267c606b01ee	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	f8359f69-42d5-4517-818f-d59b2c8a6363	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	dea1d432-372b-4906-9f3d-364f0a772f0b	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	26acf9e0-32ed-433f-afc8-fea95da3a0e0	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	662e9840-89e7-4269-bdef-ec0dbf2f91ea	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	2f710c1d-3b35-4cd0-99f0-1c9f17852ed9	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	3602380e-2c13-49ba-9496-998250ff27c1	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	f8359f69-42d5-4517-818f-d59b2c8a6363	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	dea1d432-372b-4906-9f3d-364f0a772f0b	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	f8359f69-42d5-4517-818f-d59b2c8a6363	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	8fef30e9-ee6b-42a9-9d43-2258755ba7d2	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	a482ed49-73e1-4ec2-9f82-58199e2fe0bb	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	efebb96e-f6df-41d7-a6eb-dfa02b537fe2	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	662e9840-89e7-4269-bdef-ec0dbf2f91ea	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	5025c96f-1ef8-46d6-8dcd-267c606b01ee	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	2f710c1d-3b35-4cd0-99f0-1c9f17852ed9	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	26acf9e0-32ed-433f-afc8-fea95da3a0e0	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	02a2a3cd-c8bf-4b85-a4ab-3aa71b1c681e	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	f8359f69-42d5-4517-818f-d59b2c8a6363	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	1e15b1ca-aedb-42e4-9dd5-94042f61c3b1	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	8fef30e9-ee6b-42a9-9d43-2258755ba7d2	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	94570165-ee15-4229-9e82-fb1f8473df3f	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	02a2a3cd-c8bf-4b85-a4ab-3aa71b1c681e	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	26acf9e0-32ed-433f-afc8-fea95da3a0e0	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	dea1d432-372b-4906-9f3d-364f0a772f0b	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	94570165-ee15-4229-9e82-fb1f8473df3f	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	96ba7d3d-aac4-498a-af32-7006a7ceb277	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	662e9840-89e7-4269-bdef-ec0dbf2f91ea	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	8fef30e9-ee6b-42a9-9d43-2258755ba7d2	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	3602380e-2c13-49ba-9496-998250ff27c1	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	1f815584-d9c4-44fe-b5f6-580fbd656753	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	a482ed49-73e1-4ec2-9f82-58199e2fe0bb	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	662e9840-89e7-4269-bdef-ec0dbf2f91ea	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	662e9840-89e7-4269-bdef-ec0dbf2f91ea	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	5025c96f-1ef8-46d6-8dcd-267c606b01ee	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	efebb96e-f6df-41d7-a6eb-dfa02b537fe2	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	96ba7d3d-aac4-498a-af32-7006a7ceb277	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	8fef30e9-ee6b-42a9-9d43-2258755ba7d2	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	a482ed49-73e1-4ec2-9f82-58199e2fe0bb	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	b7a9afe6-5689-4139-acaf-64834c54acc7	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	dea1d432-372b-4906-9f3d-364f0a772f0b	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	8481bae6-1b07-4963-9fd7-727320a4b314	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	efebb96e-f6df-41d7-a6eb-dfa02b537fe2	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	efebb96e-f6df-41d7-a6eb-dfa02b537fe2	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	f8359f69-42d5-4517-818f-d59b2c8a6363	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	bee1ce19-6b8f-4380-93c8-571c7135d440	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	1e15b1ca-aedb-42e4-9dd5-94042f61c3b1	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	5025c96f-1ef8-46d6-8dcd-267c606b01ee	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	bee1ce19-6b8f-4380-93c8-571c7135d440	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	5025c96f-1ef8-46d6-8dcd-267c606b01ee	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	3602380e-2c13-49ba-9496-998250ff27c1	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	b7a9afe6-5689-4139-acaf-64834c54acc7	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	1f815584-d9c4-44fe-b5f6-580fbd656753	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	02a2a3cd-c8bf-4b85-a4ab-3aa71b1c681e	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	b7a9afe6-5689-4139-acaf-64834c54acc7	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	96ba7d3d-aac4-498a-af32-7006a7ceb277	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	3602380e-2c13-49ba-9496-998250ff27c1	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	96ba7d3d-aac4-498a-af32-7006a7ceb277	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	a482ed49-73e1-4ec2-9f82-58199e2fe0bb	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	bee1ce19-6b8f-4380-93c8-571c7135d440	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	2f710c1d-3b35-4cd0-99f0-1c9f17852ed9	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	1f815584-d9c4-44fe-b5f6-580fbd656753	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	94570165-ee15-4229-9e82-fb1f8473df3f	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	060195bb-12b9-4497-be07-af219154f168	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	27fd690b-f139-4373-a567-281caf6d8b54	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	bee1ce19-6b8f-4380-93c8-571c7135d440	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	10cdefd1-2bf9-4b72-8549-66b49723433a	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	dea1d432-372b-4906-9f3d-364f0a772f0b	INTERMEDIATE
88e8ea5c-7b07-4857-846b-82ad9cd2734e	173e061b-352a-4ae6-93ad-049678677b18	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	b20f425c-4304-483e-8076-74af721024d8	EXPERT
88e8ea5c-7b07-4857-846b-82ad9cd2734e	23e07b13-3d4b-4899-8337-860c59c2e3b3	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	4bbf6e71-7961-41ec-80ab-16e0d94026b6	EXPERT
ca32503f-1b13-40ec-bd41-cabe7d37aa4c	b77ef587-0375-414d-85c9-023b917bc831	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	47388441-c157-4803-ba76-2dded27ad2d1	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	efafe33a-e133-44de-ac9b-6a10e10efbe8	EXPERT
d7bcee51-2305-4dd3-8a3d-69a3420ae37c	229292bf-eea8-4061-8e44-fc98adcea718	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	d2d9e7ef-5812-43ce-a8e3-3498f978efbd	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	99336148-5ced-4fc8-ae16-8bbdf09f69f9	EXPERT
5cc1e612-856a-4305-a0fe-2891ea27dff9	b07df9b2-fdfe-43e0-b4b2-4959b3028534	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	6035e8d3-c435-4e20-802e-05dca7c77989	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	cddbfca5-71f4-46c5-84e9-42ef5eb5b65f	EXPERT
3fcb037f-ea13-44b4-a2b6-f7c4b4647408	b07df9b2-fdfe-43e0-b4b2-4959b3028534	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	89b386e8-c6d5-4296-a592-9bb1e2a374d6	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	ce51a463-2ec2-40e9-9a82-4902162a4f3c	EXPERT
27bbaba7-36b9-4377-96d3-95501f7888cd	87e3d84d-85cf-403f-bb39-49747c1c482e	EXPERT
38e143c1-bc01-4b2b-8296-c3f6426d724d	b77ef587-0375-414d-85c9-023b917bc831	INTERMEDIATE
38e143c1-bc01-4b2b-8296-c3f6426d724d	b20f425c-4304-483e-8076-74af721024d8	INTERMEDIATE
38e143c1-bc01-4b2b-8296-c3f6426d724d	30bd7001-9922-439f-b937-fd156d7b8dd0	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	9926948f-7914-4d01-adf2-9f3a3fc21e31	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
edd0819c-adaa-4ea9-aed1-ed579e71bb6a	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	229292bf-eea8-4061-8e44-fc98adcea718	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	99336148-5ced-4fc8-ae16-8bbdf09f69f9	INTERMEDIATE
e2f53b37-691e-4e6f-8b8f-77459a0eb57a	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	cddbfca5-71f4-46c5-84e9-42ef5eb5b65f	INTERMEDIATE
3b93c2a6-b614-4bda-a143-13971269d3db	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	30bd7001-9922-439f-b937-fd156d7b8dd0	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	efafe33a-e133-44de-ac9b-6a10e10efbe8	INTERMEDIATE
621a338a-1e6f-448b-b8c7-658753a8b91d	89b386e8-c6d5-4296-a592-9bb1e2a374d6	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	efafe33a-e133-44de-ac9b-6a10e10efbe8	INTERMEDIATE
d603073f-622f-4f2f-b959-f2f73bf5b647	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	89b386e8-c6d5-4296-a592-9bb1e2a374d6	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
b5a7e94c-6d0d-4452-9418-09b310aacbb1	b20f425c-4304-483e-8076-74af721024d8	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	99336148-5ced-4fc8-ae16-8bbdf09f69f9	INTERMEDIATE
d8a1544b-2ddc-496e-a1cf-7f9bc1ef1f2d	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	b20f425c-4304-483e-8076-74af721024d8	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	229292bf-eea8-4061-8e44-fc98adcea718	INTERMEDIATE
08996435-aabf-4ddf-a431-78e082967750	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
dc6801f3-a60e-4b6e-a19a-0b6bc14cbde5	9926948f-7914-4d01-adf2-9f3a3fc21e31	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
591ff74c-7ee6-4217-8aab-15d24502d67f	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	89b386e8-c6d5-4296-a592-9bb1e2a374d6	INTERMEDIATE
ac342902-6705-4421-9cff-f27504d9e840	efafe33a-e133-44de-ac9b-6a10e10efbe8	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
c7d79859-9002-4069-943f-aed4f43a52eb	b07df9b2-fdfe-43e0-b4b2-4959b3028534	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	87e3d84d-85cf-403f-bb39-49747c1c482e	INTERMEDIATE
1834b356-7339-4ec7-9078-2a46f674d4a7	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	4bbf6e71-7961-41ec-80ab-16e0d94026b6	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
617b2ec9-319d-4312-90ae-fa720d13fbdb	6035e8d3-c435-4e20-802e-05dca7c77989	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
51e45099-5ad4-4b03-bad9-5db5af98a2e8	173e061b-352a-4ae6-93ad-049678677b18	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	229292bf-eea8-4061-8e44-fc98adcea718	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	47388441-c157-4803-ba76-2dded27ad2d1	INTERMEDIATE
1a6a1847-fa6a-4a73-82f9-0c140ca9172f	87e3d84d-85cf-403f-bb39-49747c1c482e	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	efafe33a-e133-44de-ac9b-6a10e10efbe8	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
6a37ea0b-39c8-442f-a4eb-b36e241c276c	cddbfca5-71f4-46c5-84e9-42ef5eb5b65f	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	30bd7001-9922-439f-b937-fd156d7b8dd0	INTERMEDIATE
14f21e56-f343-40a1-b551-4db509af863b	87e3d84d-85cf-403f-bb39-49747c1c482e	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	cddbfca5-71f4-46c5-84e9-42ef5eb5b65f	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
f83d795e-c21f-4e4e-bf20-9f26c37b8434	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	7cd58920-b3ed-44bc-8643-0854c7eed352	INTERMEDIATE
a2de4664-a615-4f5d-b612-c1d45c4fac9d	89b386e8-c6d5-4296-a592-9bb1e2a374d6	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	89b386e8-c6d5-4296-a592-9bb1e2a374d6	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
89e6429d-3c1c-4b41-b950-5da87b23b366	47388441-c157-4803-ba76-2dded27ad2d1	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	173e061b-352a-4ae6-93ad-049678677b18	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	7cd58920-b3ed-44bc-8643-0854c7eed352	INTERMEDIATE
23f1c6db-59e8-4ace-a535-b1ac8e3ce4ef	cddbfca5-71f4-46c5-84e9-42ef5eb5b65f	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	87e3d84d-85cf-403f-bb39-49747c1c482e	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
e74788f5-26fa-49b8-a21d-2d4ed7a8a9af	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	b07df9b2-fdfe-43e0-b4b2-4959b3028534	INTERMEDIATE
1ad783d9-ebb7-4d74-8c28-36c89613396a	efafe33a-e133-44de-ac9b-6a10e10efbe8	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	b20f425c-4304-483e-8076-74af721024d8	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	cddbfca5-71f4-46c5-84e9-42ef5eb5b65f	INTERMEDIATE
d8543ef7-a973-4b55-9580-924c49d70164	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
1d71f921-f884-4c85-a083-e1320e751e8c	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
59ddf75b-e976-476b-adad-ca40b060a0e1	d2d9e7ef-5812-43ce-a8e3-3498f978efbd	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	d2d9e7ef-5812-43ce-a8e3-3498f978efbd	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	4bbf6e71-7961-41ec-80ab-16e0d94026b6	INTERMEDIATE
e2a31507-f0c9-41ad-bed6-c5e8809c20c9	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
0704b660-ccda-41c1-a986-2f1a1c94b11d	b07df9b2-fdfe-43e0-b4b2-4959b3028534	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	47388441-c157-4803-ba76-2dded27ad2d1	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	d2d9e7ef-5812-43ce-a8e3-3498f978efbd	INTERMEDIATE
3fb4413f-f7a1-47b7-87ae-4ab8527f943f	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	b07df9b2-fdfe-43e0-b4b2-4959b3028534	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	4bbf6e71-7961-41ec-80ab-16e0d94026b6	INTERMEDIATE
bedf48ee-d5b7-489f-9871-3e335f57a29f	b07df9b2-fdfe-43e0-b4b2-4959b3028534	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	7cd58920-b3ed-44bc-8643-0854c7eed352	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	INTERMEDIATE
b7627824-f738-462b-add9-edf6cab560ff	89b386e8-c6d5-4296-a592-9bb1e2a374d6	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	173e061b-352a-4ae6-93ad-049678677b18	INTERMEDIATE
912b5130-1e88-43ab-a581-1e0d596ec616	87e3d84d-85cf-403f-bb39-49747c1c482e	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	9926948f-7914-4d01-adf2-9f3a3fc21e31	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	173e061b-352a-4ae6-93ad-049678677b18	INTERMEDIATE
598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	cddbfca5-71f4-46c5-84e9-42ef5eb5b65f	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	b07df9b2-fdfe-43e0-b4b2-4959b3028534	INTERMEDIATE
2974c82e-241d-4f14-81ab-bb8056c02fec	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	b07df9b2-fdfe-43e0-b4b2-4959b3028534	INTERMEDIATE
38fb5d91-81f3-484e-be8e-782a907345bf	9926948f-7914-4d01-adf2-9f3a3fc21e31	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	efafe33a-e133-44de-ac9b-6a10e10efbe8	INTERMEDIATE
bf4a3591-e1ed-4d2e-868a-af6512800329	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	INTERMEDIATE
6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	173e061b-352a-4ae6-93ad-049678677b18	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	3309380a-4a61-400b-8a07-b6082c45f012	INTERMEDIATE
6d7e3226-ba54-46aa-a080-caf7921e26b9	efafe33a-e133-44de-ac9b-6a10e10efbe8	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	173e061b-352a-4ae6-93ad-049678677b18	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	9926948f-7914-4d01-adf2-9f3a3fc21e31	INTERMEDIATE
65da978f-e333-49ec-9fd5-aad7c97fc216	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	b77ef587-0375-414d-85c9-023b917bc831	INTERMEDIATE
64dda8b9-d046-42df-b275-2b18971bdc72	47388441-c157-4803-ba76-2dded27ad2d1	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	b20f425c-4304-483e-8076-74af721024d8	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	fca0b70d-2d48-4ac3-9368-42f47b9b17d1	INTERMEDIATE
0ed0e027-ab78-4389-9da7-252039ef1968	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	229292bf-eea8-4061-8e44-fc98adcea718	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
561a2aa8-b920-4a93-89ba-b92fe907dca3	3f11e3b7-e691-4b89-bfc4-1c9837deec26	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	b77ef587-0375-414d-85c9-023b917bc831	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	99336148-5ced-4fc8-ae16-8bbdf09f69f9	INTERMEDIATE
d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	efafe33a-e133-44de-ac9b-6a10e10efbe8	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	ce51a463-2ec2-40e9-9a82-4902162a4f3c	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	4bbf6e71-7961-41ec-80ab-16e0d94026b6	INTERMEDIATE
84b5cf36-4d7a-42f2-b605-2583d68b4130	99336148-5ced-4fc8-ae16-8bbdf09f69f9	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	173e061b-352a-4ae6-93ad-049678677b18	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	4bbf6e71-7961-41ec-80ab-16e0d94026b6	INTERMEDIATE
5220293c-e122-4908-828a-9fd755e74c64	99336148-5ced-4fc8-ae16-8bbdf09f69f9	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	51072c3c-fabb-485a-8325-c1bed225fbff	INTERMEDIATE
85ed4738-1910-4142-9045-009c38478e4e	9926948f-7914-4d01-adf2-9f3a3fc21e31	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	b20f425c-4304-483e-8076-74af721024d8	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	30bd7001-9922-439f-b937-fd156d7b8dd0	INTERMEDIATE
4f52f6f5-8124-4da2-b106-6521bb232714	23e07b13-3d4b-4899-8337-860c59c2e3b3	INTERMEDIATE
\.


--
-- Data for Name: Job; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Job" (id, client_id, title, budget_min, budget_max, status, deadline, description, "createdAt") FROM stdin;
e0892618-c1b2-4fb3-a0ee-1268a7bda836	f110771f-b8dd-4720-9868-be3c61205ed2	Гар утасны аппликейшний Backend хөгжүүлэлт (Node.js)	4000000	8000000	OPEN	2026-06-10 00:00:00	Fintech стартапт Node.js мэддэг backend хөгжүүлэгч хэрэгтэй байна.	2026-04-16 20:48:02.418
7d6c7313-81aa-4a4b-9a45-da06bb248473	e5d142ab-4e0a-4849-9ef7-51d837a64327	Брендийн танилцуулга хуудасны UI/UX дизайн	1000000	2000000	OPEN	2026-05-15 00:00:00	Шинэ брендийн танилцуулга хуудас хийх гэж байгаа тул UI/UX дизайн хэрэгтэй байна.	2026-04-16 20:50:52.755
75b6667f-9361-4b3a-bcfc-41121ce32bbc	f110771f-b8dd-4720-9868-be3c61205ed2	Гар утасны аппликейшний Backend хөгжүүлэлт (Node.js)	4000000	8000000	OPEN	2026-06-10 00:00:00	Fintech стартапт Node.js мэддэг backend хөгжүүлэгч хэрэгтэй байна.	2026-04-16 20:50:52.758
2f074896-e58b-4525-9f4f-019250b3f8d5	2ce8ef95-a026-439f-95e9-15cfd182d78d	web app hiih	0	0	OPEN	2027-01-01 00:00:00	e commerce	2026-04-20 19:50:32.997
a252be32-b369-49f3-94c6-d0d72227f3c1	a0901ffa-b7a6-464f-8060-fb644499afc9	E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)	3000000	5000000	OPEN	2026-05-30 00:00:00	Манай компанид шинээр e-commerce вебсайт хэрэгтэй байна. Next.js болон Tailwind CSS ашиглаж хийх шаардлагатай.	2026-04-20 20:06:07.695
4fd4bc11-c097-48b2-86b7-ffb56b2ca401	e5d142ab-4e0a-4849-9ef7-51d837a64327	Брендийн танилцуулга хуудасны UI/UX дизайн	1000000	2000000	OPEN	2026-05-15 00:00:00	Шинэ брендийн танилцуулга хуудас хийх гэж байгаа тул UI/UX дизайн хэрэгтэй байна.	2026-04-20 20:06:07.705
0741a6b3-0c78-4ba5-a019-07bfcd70b2b5	f110771f-b8dd-4720-9868-be3c61205ed2	Гар утасны аппликейшний Backend хөгжүүлэлт (Node.js)	4000000	8000000	OPEN	2026-06-10 00:00:00	Fintech стартапт Node.js мэддэг backend хөгжүүлэгч хэрэгтэй байна.	2026-04-20 20:06:07.709
7a419bad-40e0-40e1-85ee-ec1e3f08fd27	a0901ffa-b7a6-464f-8060-fb644499afc9	E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)	3000000	5000000	OPEN	2026-05-30 00:00:00	Манай компанид шинээр e-commerce вебсайт хэрэгтэй байна. Next.js болон Tailwind CSS ашиглаж хийх шаардлагатай.	2026-04-20 20:08:52.657
352e533d-3384-4fc1-8479-d4d7db0b0995	e5d142ab-4e0a-4849-9ef7-51d837a64327	Брендийн танилцуулга хуудасны UI/UX дизайн	1000000	2000000	OPEN	2026-05-15 00:00:00	Шинэ брендийн танилцуулга хуудас хийх гэж байгаа тул UI/UX дизайн хэрэгтэй байна.	2026-04-20 20:08:52.687
8bbf0557-92d3-4daa-8f0e-46e475f8f73a	f110771f-b8dd-4720-9868-be3c61205ed2	Гар утасны аппликейшний Backend хөгжүүлэлт (Node.js)	4000000	8000000	OPEN	2026-06-10 00:00:00	Fintech стартапт Node.js мэддэг backend хөгжүүлэгч хэрэгтэй байна.	2026-04-20 20:08:52.691
b2560402-d017-43ee-9f5c-856dae3c2edd	a0901ffa-b7a6-464f-8060-fb644499afc9	E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)	3000000	5000000	OPEN	2026-05-30 00:00:00	Манай компанид шинээр e-commerce вебсайт хэрэгтэй байна. Next.js болон Tailwind CSS ашиглаж хийх шаардлагатай.	2026-04-20 20:09:55.316
40f7d715-ae0e-4ee4-a0c9-3db945575ff1	e5d142ab-4e0a-4849-9ef7-51d837a64327	Брендийн танилцуулга хуудасны UI/UX дизайн	1000000	2000000	OPEN	2026-05-15 00:00:00	Шинэ брендийн танилцуулга хуудас хийх гэж байгаа тул UI/UX дизайн хэрэгтэй байна.	2026-04-20 20:09:55.328
58a1aa8b-a54e-48e3-bc59-147896bb76a8	f110771f-b8dd-4720-9868-be3c61205ed2	Гар утасны аппликейшний Backend хөгжүүлэлт (Node.js)	4000000	8000000	OPEN	2026-06-10 00:00:00	Fintech стартапт Node.js мэддэг backend хөгжүүлэгч хэрэгтэй байна.	2026-04-20 20:09:55.331
fdb47a53-6aff-461b-a92f-d0e693225ad3	a0901ffa-b7a6-464f-8060-fb644499afc9	E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)	3000000	5000000	OPEN	2026-05-30 00:00:00	Манай компанид шинээр e-commerce вебсайт хэрэгтэй байна. Next.js болон Tailwind CSS ашиглаж хийх шаардлагатай.	2026-04-20 20:11:05.443
5053aee3-391c-4f25-a610-c5cb8462da74	e5d142ab-4e0a-4849-9ef7-51d837a64327	Брендийн танилцуулга хуудасны UI/UX дизайн	1000000	2000000	OPEN	2026-05-15 00:00:00	Шинэ брендийн танилцуулга хуудас хийх гэж байгаа тул UI/UX дизайн хэрэгтэй байна.	2026-04-20 20:11:05.452
bb5cd558-f08f-431f-980b-572869828289	f110771f-b8dd-4720-9868-be3c61205ed2	Гар утасны аппликейшний Backend хөгжүүлэлт (Node.js)	4000000	8000000	OPEN	2026-06-10 00:00:00	Fintech стартапт Node.js мэддэг backend хөгжүүлэгч хэрэгтэй байна.	2026-04-20 20:11:05.455
ca85a991-15bd-489e-850c-c313242585f6	a0901ffa-b7a6-464f-8060-fb644499afc9	Inventory System Backend	2000000	2000000	CLOSED	2025-12-01 00:00:00	Historical project for Bat.	2026-04-22 20:38:51.864
0db2c14e-9068-4610-96a7-fa97f4c49843	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	Initial Brand Strategy	500000	500000	CLOSED	2026-01-01 00:00:00	Historical project for Nara.	2026-04-22 20:38:51.891
9efdca1f-0a98-49de-abd0-e4c9ec985cb8	a0901ffa-b7a6-464f-8060-fb644499afc9	E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)	3000000	5000000	IN_PROGRESS	2026-05-30 00:00:00	Манай компанид шинээр e-commerce вебсайт хэрэгтэй байна. Next.js болон Tailwind CSS ашиглаж хийх шаардлагатай.	2026-04-16 20:50:52.736
38d0557b-46a9-44eb-9f92-a15ec6c78d3c	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	Сошиал медиа маркетингийн ажилтан хайж байна	500000	1500000	IN_PROGRESS	2026-06-01 00:00:00	Манай компанид шинээр гаргаж буй бүтээгдэхүүний сошиал медиа маркетингийг хариуцах ажилтан хэрэгтэй байна.	2026-04-22 20:34:44.268
c7f78df7-d544-499a-b53e-609b58447d71	225b756e-06d2-434b-8928-feb14ecf234c	Англи хэлнээс Монгол хэл рүү орчуулга хийх	200000	800000	IN_PROGRESS	2026-05-10 00:00:00	Техникийн гарын авлагыг Англи хэлнээс Монгол хэл рүү алдаагүй хөрвүүлж өгөх богино хугацааны ажил.	2026-04-22 20:34:44.276
902db69a-b778-43ee-baff-bc08ba510d2b	e5d142ab-4e0a-4849-9ef7-51d837a64327	Брендийн танилцуулга хуудасны UI/UX дизайн	1000000	2000000	IN_PROGRESS	2026-05-15 00:00:00	Шинэ брендийн танилцуулга хуудас хийх гэж байгаа тул UI/UX дизайн хэрэгтэй байна.	2026-04-16 20:48:02.415
5c7b1a44-89a3-45c4-b696-426c4cebc3d5	a0901ffa-b7a6-464f-8060-fb644499afc9	E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)	3000000	5000000	IN_PROGRESS	2026-05-30 00:00:00	Манай компанид шинээр e-commerce вебсайт хэрэгтэй байна. Next.js болон Tailwind CSS ашиглаж хийх шаардлагатай.	2026-04-16 20:48:02.403
d931884a-3bd0-4b15-bada-17709046b436	a0901ffa-b7a6-464f-8060-fb644499afc9	Inventory System Backend	500000	2000000	CLOSED	2026-03-23 20:40:25.766	Historical project for Ахлах Full-Stack хөгжүүлэгч.	2026-04-22 20:40:25.768
f62760be-62cb-4599-8982-f49d9b173342	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	Initial Brand Strategy	500000	2000000	CLOSED	2026-03-23 20:40:25.774	Historical project for Дижитал Маркетинг Мэргэжилтэн.	2026-04-22 20:40:25.774
427ca6ba-da09-4c0a-a8f5-44f8abddedd1	225b756e-06d2-434b-8928-feb14ecf234c	English Content Translation	500000	2000000	CLOSED	2026-03-23 20:40:25.777	Historical project for Контент бичигч & Орчуулагч.	2026-04-22 20:40:25.777
744b8ccf-4064-4f26-8d3a-02fe0be17388	f110771f-b8dd-4720-9868-be3c61205ed2	Market Analysis Report	500000	2000000	CLOSED	2026-03-23 20:40:25.78	Historical project for Бизнес Аналитик.	2026-04-22 20:40:25.781
d5c2d15f-0b06-4aa9-b670-22f22d0f70b6	f110771f-b8dd-4720-9868-be3c61205ed2	Mobile API Integration	500000	2000000	CLOSED	2026-03-23 20:40:25.784	Historical project for Ахлах Full-Stack хөгжүүлэгч.	2026-04-22 20:40:25.784
a22d7947-e926-4672-a7c2-056dd01895eb	e5d142ab-4e0a-4849-9ef7-51d837a64327	Portfolio Website UI	500000	2000000	CLOSED	2026-03-23 20:40:25.787	Historical project for UI/UX Дизайнер.	2026-04-22 20:40:25.787
b62d3a70-f3fb-4e33-b0fb-28464df5c72c	a0901ffa-b7a6-464f-8060-fb644499afc9	Inventory System Backend	500000	2000000	CLOSED	2026-03-23 21:21:20.016	Historical project for Ахлах Full-Stack хөгжүүлэгч.	2026-04-22 21:21:20.018
1408eedf-2609-4a73-b558-ec59b3938bb9	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	Initial Brand Strategy	500000	2000000	CLOSED	2026-03-23 21:21:20.029	Historical project for Дижитал Маркетинг Мэргэжилтэн.	2026-04-22 21:21:20.03
f4a7b5a9-18cf-4090-8e1f-09e0caf64c9f	225b756e-06d2-434b-8928-feb14ecf234c	English Content Translation	500000	2000000	CLOSED	2026-03-23 21:21:20.033	Historical project for Контент бичигч & Орчуулагч.	2026-04-22 21:21:20.033
66051003-1fac-496f-aa14-6e95196ef3a9	f110771f-b8dd-4720-9868-be3c61205ed2	Market Analysis Report	500000	2000000	CLOSED	2026-03-23 21:21:20.036	Historical project for Бизнес Аналитик.	2026-04-22 21:21:20.037
af16cba1-7479-4e11-bca4-13cee0b343cb	f110771f-b8dd-4720-9868-be3c61205ed2	Mobile API Integration	500000	2000000	CLOSED	2026-03-23 21:21:20.04	Historical project for Ахлах Full-Stack хөгжүүлэгч.	2026-04-22 21:21:20.041
93e6846d-fc68-4006-9bf1-d2e503df8b93	e5d142ab-4e0a-4849-9ef7-51d837a64327	Portfolio Website UI	500000	2000000	CLOSED	2026-03-23 21:21:20.044	Historical project for UI/UX Дизайнер.	2026-04-22 21:21:20.045
55fd6cb5-7e22-4b9e-9b05-deae12853f7f	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	Brand stragety	0	2000000	OPEN	2027-01-01 00:00:00	dajgui dundaj hiideg	2026-04-22 21:41:28.997
b7034b7a-0ce5-4faa-a860-fc1932333aab	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	branding 	0	2000000	OPEN	2027-01-01 00:00:00	neg dundaj finance company branding	2026-04-22 21:56:24.11
2adf7ef5-5e28-48ea-af50-3f71dcce1be8	a0901ffa-b7a6-464f-8060-fb644499afc9	Inventory System Backend	500000	2000000	CLOSED	2026-03-23 22:00:56.774	Historical project for Ахлах Full-Stack хөгжүүлэгч.	2026-04-22 22:00:56.776
df2a7a10-1818-444e-a98b-1ba1a421332c	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	Initial Brand Strategy	500000	2000000	CLOSED	2026-03-23 22:00:56.787	Historical project for Дижитал Маркетинг Мэргэжилтэн.	2026-04-22 22:00:56.788
991d8fd1-5cff-438a-87a5-5b4ac7ae1112	225b756e-06d2-434b-8928-feb14ecf234c	English Content Translation	500000	2000000	CLOSED	2026-03-23 22:00:56.792	Historical project for Контент бичигч & Орчуулагч.	2026-04-22 22:00:56.792
37300fda-62ca-42cd-8c46-b146fcaadf29	f110771f-b8dd-4720-9868-be3c61205ed2	Market Analysis Report	500000	2000000	CLOSED	2026-03-23 22:00:56.795	Historical project for Бизнес Аналитик.	2026-04-22 22:00:56.796
dd4f6751-b830-4bee-8e56-22b27797416e	f110771f-b8dd-4720-9868-be3c61205ed2	Mobile API Integration	500000	2000000	CLOSED	2026-03-23 22:00:56.799	Historical project for Ахлах Full-Stack хөгжүүлэгч.	2026-04-22 22:00:56.8
6b58ab60-e8ba-4d53-86fa-1303cba568a3	e5d142ab-4e0a-4849-9ef7-51d837a64327	Portfolio Website UI	500000	2000000	CLOSED	2026-03-23 22:00:56.803	Historical project for UI/UX Дизайнер.	2026-04-22 22:00:56.803
eb1732fc-9260-470d-939c-c3d44118d3f1	29ee7936-ae15-4125-b9d8-72eef95a9ef2	Senior Full-stack Developer (Next.js & Node.js)	5000000	15000000	OPEN	2026-08-30 00:00:00	Манай компанид урт хугацаанд ажиллах туршлагатай Full-stack хөгжүүлэгч хэрэгтэй байна. Бид AI болон Fintech чиглэлээр ажилладаг.	2026-04-22 22:00:57.354
f0d82e85-1b7f-4ddb-828e-63a23cb7d447	a0901ffa-b7a6-464f-8060-fb644499afc9	Inventory System Backend	500000	2000000	CLOSED	2026-03-23 22:02:45.979	Historical project for Ахлах Full-Stack хөгжүүлэгч.	2026-04-22 22:02:45.988
9929fa08-1040-42c5-92da-3a6fe37ca9ba	0194bda8-bba7-4e43-8bb5-f24f1ec8b384	Initial Brand Strategy	500000	2000000	CLOSED	2026-03-23 22:02:45.998	Historical project for Дижитал Маркетинг Мэргэжилтэн.	2026-04-22 22:02:45.999
5bf1af1c-a9eb-4fe4-a2c3-b5201b420b92	225b756e-06d2-434b-8928-feb14ecf234c	English Content Translation	500000	2000000	CLOSED	2026-03-23 22:02:46.004	Historical project for Контент бичигч & Орчуулагч.	2026-04-22 22:02:46.004
e3e91b77-b5e8-4cf9-83b5-b0a5bbb3a3d0	f110771f-b8dd-4720-9868-be3c61205ed2	Market Analysis Report	500000	2000000	CLOSED	2026-03-23 22:02:46.008	Historical project for Бизнес Аналитик.	2026-04-22 22:02:46.008
06dfc947-2326-45e1-8d56-37c530b43284	f110771f-b8dd-4720-9868-be3c61205ed2	Mobile API Integration	500000	2000000	CLOSED	2026-03-23 22:02:46.011	Historical project for Ахлах Full-Stack хөгжүүлэгч.	2026-04-22 22:02:46.011
07080402-6c31-4729-a0f7-19e0d6c1330b	e5d142ab-4e0a-4849-9ef7-51d837a64327	Portfolio Website UI	500000	2000000	CLOSED	2026-03-23 22:02:46.014	Historical project for UI/UX Дизайнер.	2026-04-22 22:02:46.014
4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	29ee7936-ae15-4125-b9d8-72eef95a9ef2	Senior Full-stack Developer (Next.js & Node.js)	5000000	15000000	OPEN	2026-08-30 00:00:00	Манай компанид урт хугацаанд ажиллах туршлагатай Full-stack хөгжүүлэгч хэрэгтэй байна. Бид AI болон Fintech чиглэлээр ажилладаг.	2026-04-22 22:02:46.641
7173b2da-5c28-43ba-a3a8-1f5046932d84	29ee7936-ae15-4125-b9d8-72eef95a9ef2	Middle React Developer (Ongoing)	2000000	4000000	IN_PROGRESS	2026-10-15 00:00:00	Ongoing project support.	2026-04-22 22:02:46.762
d497745f-9bf9-4617-829f-8e8fbea6caf1	29ee7936-ae15-4125-b9d8-72eef95a9ef2	Legacy Bug Fix (Completed)	500000	1000000	CLOSED	2026-04-07 22:02:46.763	Completed bug fixing project.	2026-04-22 22:02:46.764
54b2087d-c93e-4f88-bd0f-8eaac1df8768	29ee7936-ae15-4125-b9d8-72eef95a9ef2	aaaa	0	0	OPEN	2028-02-02 00:00:00	bbbb	2026-04-22 22:04:03.875
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Message" (id, sender_id, receiver_id, job_id, content, is_read, "createdAt") FROM stdin;
d23cb6f8-3167-442e-8879-08f7d1ae69fa	df40c3f7-dd63-462b-b212-6e38f2a062a7	8fc7dd1c-2ca6-4e39-98b0-98d010ab8026	54b2087d-c93e-4f88-bd0f-8eaac1df8768	Сайн байна уу? Би танд өөрийн "aaaa" нэртэй ажилд хамтран ажиллах санал илгээж байна.	f	2026-05-07 19:46:31.264
\.


--
-- Data for Name: Milestone; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Milestone" (id, contract_id, title, amount, status, due_date, "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (id, user_id, type, title, content, is_read, "createdAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payment" (id, contract_id, milestone_id, amount, status, paid_at, "createdAt") FROM stdin;
\.


--
-- Data for Name: Proposal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Proposal" (id, job_id, freelancer_id, bid_amount, status, ai_relevance_score, cover_letter, "createdAt") FROM stdin;
779e25b7-1e7a-49b9-a7e6-02e41bb67a50	eb1732fc-9260-470d-939c-c3d44118d3f1	4f52f6f5-8124-4da2-b106-6521bb232714	9347390.56919791	PENDING	0.9095135490271834	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #1)	2026-04-22 22:00:57.408
8160f1f0-8f15-4d09-9f61-1907f5116744	eb1732fc-9260-470d-939c-c3d44118d3f1	85ed4738-1910-4142-9045-009c38478e4e	6976295.9398019	PENDING	0.4865379760011225	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #2)	2026-04-22 22:00:57.411
2cd8c9fc-1b44-4c19-bcfb-3d6f264abd02	eb1732fc-9260-470d-939c-c3d44118d3f1	5220293c-e122-4908-828a-9fd755e74c64	6072261.610875597	PENDING	0.7852859291467427	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #3)	2026-04-22 22:00:57.413
a98913d2-f358-4f64-bc83-68ce9507d3cb	eb1732fc-9260-470d-939c-c3d44118d3f1	84b5cf36-4d7a-42f2-b605-2583d68b4130	5363319.218444925	PENDING	0.472957348595666	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #4)	2026-04-22 22:00:57.414
60658165-ec46-423f-b042-f8047c6274d2	eb1732fc-9260-470d-939c-c3d44118d3f1	d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	7740338.747288132	PENDING	0.7905409486440376	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #5)	2026-04-22 22:00:57.416
10741936-c698-493d-b928-f264b318bb01	eb1732fc-9260-470d-939c-c3d44118d3f1	561a2aa8-b920-4a93-89ba-b92fe907dca3	5823443.533793416	PENDING	0.6314973066476709	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #6)	2026-04-22 22:00:57.417
7630a5ad-1ffa-49ca-8008-23231484ebcf	eb1732fc-9260-470d-939c-c3d44118d3f1	0ed0e027-ab78-4389-9da7-252039ef1968	9213967.097874038	PENDING	0.6885681251368756	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #7)	2026-04-22 22:00:57.419
18986d45-c40c-4183-8582-ea0ad4452bfc	eb1732fc-9260-470d-939c-c3d44118d3f1	64dda8b9-d046-42df-b275-2b18971bdc72	6544796.162722799	PENDING	0.8667268240370489	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #8)	2026-04-22 22:00:57.42
ee8fd85f-14d1-429d-beb6-1ddfcf818260	eb1732fc-9260-470d-939c-c3d44118d3f1	65da978f-e333-49ec-9fd5-aad7c97fc216	8253886.212313628	PENDING	0.8080345733929539	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #9)	2026-04-22 22:00:57.423
1bdbfd13-fd70-4488-a648-525c58cf1b8b	eb1732fc-9260-470d-939c-c3d44118d3f1	6d7e3226-ba54-46aa-a080-caf7921e26b9	8205334.946086571	PENDING	0.5437477504794295	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #10)	2026-04-22 22:00:57.424
d310c56e-62af-47be-8c75-547408e241dd	eb1732fc-9260-470d-939c-c3d44118d3f1	6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	5216973.168592344	PENDING	0.9815625529060864	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #11)	2026-04-22 22:00:57.426
46425a8f-7ee9-49a4-bc9c-236d7604b6f2	eb1732fc-9260-470d-939c-c3d44118d3f1	bf4a3591-e1ed-4d2e-868a-af6512800329	5078425.926830884	PENDING	0.9744339849351149	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #12)	2026-04-22 22:00:57.427
d7d74102-b140-428e-9824-a64b267618a3	eb1732fc-9260-470d-939c-c3d44118d3f1	38fb5d91-81f3-484e-be8e-782a907345bf	6636959.693532779	PENDING	0.852676229920095	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #13)	2026-04-22 22:00:57.428
cbe73bbd-6339-40e9-8fae-cbd1b8d9b624	eb1732fc-9260-470d-939c-c3d44118d3f1	2974c82e-241d-4f14-81ab-bb8056c02fec	6735448.711999202	PENDING	0.4167971816369823	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #14)	2026-04-22 22:00:57.43
1370c9ab-eecb-45c0-b274-8cecb223552b	eb1732fc-9260-470d-939c-c3d44118d3f1	598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	5828991.805915454	PENDING	0.4411616256918011	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #15)	2026-04-22 22:00:57.431
f3313348-7f5d-4057-a56e-c30263953669	eb1732fc-9260-470d-939c-c3d44118d3f1	912b5130-1e88-43ab-a581-1e0d596ec616	8962468.470262498	PENDING	0.4617063823818808	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #16)	2026-04-22 22:00:57.432
41311927-dbdf-47dd-8560-3e32580b1c5f	eb1732fc-9260-470d-939c-c3d44118d3f1	b7627824-f738-462b-add9-edf6cab560ff	5357224.799167629	PENDING	0.7635884219463371	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #17)	2026-04-22 22:00:57.434
926b83be-9d56-4048-9dbf-98af15bec26e	eb1732fc-9260-470d-939c-c3d44118d3f1	bedf48ee-d5b7-489f-9871-3e335f57a29f	5555591.334357399	PENDING	0.9479623865218889	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #18)	2026-04-22 22:00:57.435
11035ff8-b0bf-40b2-ba6e-374cb15ee35b	eb1732fc-9260-470d-939c-c3d44118d3f1	6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	8316779.947926337	PENDING	0.427499315417075	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #19)	2026-04-22 22:00:57.436
9f5f2575-e0bc-4143-b78f-eb29726bb255	eb1732fc-9260-470d-939c-c3d44118d3f1	3fb4413f-f7a1-47b7-87ae-4ab8527f943f	5359265.022113905	PENDING	0.4628769167835647	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #20)	2026-04-22 22:00:57.438
b24e1c1c-c5c4-42c5-a56f-3db1f1c197e7	eb1732fc-9260-470d-939c-c3d44118d3f1	0704b660-ccda-41c1-a986-2f1a1c94b11d	5629456.733707251	PENDING	0.5723175848150864	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #21)	2026-04-22 22:00:57.439
65159639-8dd5-4449-bef6-ba30b2df8981	eb1732fc-9260-470d-939c-c3d44118d3f1	e2a31507-f0c9-41ad-bed6-c5e8809c20c9	7543628.764143892	PENDING	0.8759825946776976	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #22)	2026-04-22 22:00:57.443
3998482a-f2bb-4b7f-adcb-85177df966a1	eb1732fc-9260-470d-939c-c3d44118d3f1	59ddf75b-e976-476b-adad-ca40b060a0e1	9115497.236131426	PENDING	0.7250465088664823	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #23)	2026-04-22 22:00:57.444
c2727730-3863-4b6e-8964-2993e241c7fd	eb1732fc-9260-470d-939c-c3d44118d3f1	1d71f921-f884-4c85-a083-e1320e751e8c	5274696.55042035	PENDING	0.7382463752106387	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #24)	2026-04-22 22:00:57.445
dc75aaf7-43a5-4a19-b0e5-66b5d3c50304	eb1732fc-9260-470d-939c-c3d44118d3f1	d8543ef7-a973-4b55-9580-924c49d70164	8239103.694421528	PENDING	0.8414072421824768	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #25)	2026-04-22 22:00:57.447
41750f12-0dc5-493c-ac4f-bdc19bf7c39a	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	4f52f6f5-8124-4da2-b106-6521bb232714	5592967.031605611	PENDING	0.8693401706593336	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #1)	2026-04-22 22:02:46.71
5c7e0fbd-5efd-45aa-803c-c27c2bdadc68	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	85ed4738-1910-4142-9045-009c38478e4e	5631558.872499118	PENDING	0.7658165778976753	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #2)	2026-04-22 22:02:46.721
89802f6e-c7e4-484a-a047-005624329b54	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	5220293c-e122-4908-828a-9fd755e74c64	9496882.17250517	PENDING	0.4124248860569148	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #3)	2026-04-22 22:02:46.722
4784f523-f561-49c1-83cb-247caff7348d	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	84b5cf36-4d7a-42f2-b605-2583d68b4130	7044655.410276622	PENDING	0.5729225259682292	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #4)	2026-04-22 22:02:46.724
d3c60a0e-faf1-4dc6-8170-70ead7708c40	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	d19ec00f-d866-4ef7-9dca-5a7ea52e59a4	6107057.393001362	PENDING	0.8267983755391553	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #5)	2026-04-22 22:02:46.725
07cec7f7-b4d9-419a-adf3-dea33bdf9dad	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	561a2aa8-b920-4a93-89ba-b92fe907dca3	9745940.25940022	PENDING	0.8160699814695711	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #6)	2026-04-22 22:02:46.727
ac15bc31-e761-42a1-a603-6aad2533c125	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	0ed0e027-ab78-4389-9da7-252039ef1968	8944933.73695907	PENDING	0.6439610765539305	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #7)	2026-04-22 22:02:46.728
611693a9-7d0c-449b-b972-32f920cf71ae	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	64dda8b9-d046-42df-b275-2b18971bdc72	5995230.421185374	PENDING	0.9636917351879525	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #8)	2026-04-22 22:02:46.73
e85c4916-55e4-437c-be8b-e8830dd67a74	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	65da978f-e333-49ec-9fd5-aad7c97fc216	7845717.267532841	PENDING	0.6278829813130384	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #9)	2026-04-22 22:02:46.731
26d407d7-9364-411f-89f0-b7c52d4ca0b9	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	6d7e3226-ba54-46aa-a080-caf7921e26b9	8873445.51938421	PENDING	0.8985680426882441	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #10)	2026-04-22 22:02:46.733
809c72da-e4a6-48a6-90c3-9cdd719ab174	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	6c5bfed9-e6d9-46c3-ba58-fd4eac6dfa7b	8672879.149451466	PENDING	0.4845828032040259	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #11)	2026-04-22 22:02:46.734
2ed39cca-da38-4557-91ef-3fa27dbb7f91	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	bf4a3591-e1ed-4d2e-868a-af6512800329	8710744.46919634	PENDING	0.6648508961086088	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #12)	2026-04-22 22:02:46.736
ccb8c283-7a70-495f-80b1-84590300d510	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	38fb5d91-81f3-484e-be8e-782a907345bf	7236066.308117036	PENDING	0.9663114511016072	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #13)	2026-04-22 22:02:46.737
b74411a3-a10d-4630-a92b-71a33858cd6c	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	2974c82e-241d-4f14-81ab-bb8056c02fec	8679033.66569675	PENDING	0.5100946941467365	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #14)	2026-04-22 22:02:46.738
5531261e-1bb9-409e-b3c8-833c2f3c181f	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	598b35b9-ecb9-414b-b0fd-97dc1bbd37ce	6440638.218540482	PENDING	0.7845763274972717	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #15)	2026-04-22 22:02:46.74
5c7f527a-3556-4eda-a833-8dd71bd7d54a	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	912b5130-1e88-43ab-a581-1e0d596ec616	8018598.834408412	PENDING	0.857018016762663	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #16)	2026-04-22 22:02:46.742
30b6a15c-03d6-4a1f-93d5-500ebf8a66e7	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	b7627824-f738-462b-add9-edf6cab560ff	5617773.700092015	PENDING	0.6384372035668235	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #17)	2026-04-22 22:02:46.744
f23890ad-73e3-4124-8e87-e80a01668828	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	bedf48ee-d5b7-489f-9871-3e335f57a29f	9593380.4316575	PENDING	0.6473266293502387	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #18)	2026-04-22 22:02:46.749
4d5ca554-f41e-4a68-acd8-eeb8374aadc5	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	6c2a5a1c-dd18-4df4-85b1-336b695b6fbf	5377318.006877889	PENDING	0.7368770092983471	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #19)	2026-04-22 22:02:46.751
5f4f66c3-38a6-4a6b-8e40-a4847d25b51d	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	3fb4413f-f7a1-47b7-87ae-4ab8527f943f	6941100.953920815	PENDING	0.5398792630433538	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #20)	2026-04-22 22:02:46.753
6d6950da-0cda-4cb5-85c5-6f1a57abd7c4	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	0704b660-ccda-41c1-a986-2f1a1c94b11d	7653921.766156824	PENDING	0.9898292980812269	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #21)	2026-04-22 22:02:46.755
9525d3ad-b082-4e72-bfb1-4824b3876693	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	e2a31507-f0c9-41ad-bed6-c5e8809c20c9	6964739.022809322	PENDING	0.7685682065145722	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #22)	2026-04-22 22:02:46.756
6fc2f44a-70c8-491a-adaa-07ba58bfef10	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	59ddf75b-e976-476b-adad-ca40b060a0e1	9531239.341366727	PENDING	0.4970853324486625	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #23)	2026-04-22 22:02:46.757
b6745afe-9ad4-4c94-b323-aa4a19fe21fd	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	1d71f921-f884-4c85-a083-e1320e751e8c	6802024.587091572	PENDING	0.901935408365922	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #24)	2026-04-22 22:02:46.758
23bdcf48-16f4-4dbf-b616-24b50b992f61	4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	d8543ef7-a973-4b55-9580-924c49d70164	8435016.958291795	PENDING	0.8709100502849966	Сайн байна уу? Би энэ ажилд орох туйлын сонирхолтой байна. Миний туршлага танай шаардлагад нийцнэ гэж итгэж байна. (Proposal #25)	2026-04-22 22:02:46.759
f31e5c6b-f342-4c2b-b91b-c4ef8ff711a4	54b2087d-c93e-4f88-bd0f-8eaac1df8768	4f52f6f5-8124-4da2-b106-6521bb232714	0	PENDING	100	h	2026-05-07 19:46:31.247
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Review" (id, contract_id, reviewer_id, rating, comment, "createdAt") FROM stdin;
review-bat-1	6494c484-b5bc-426d-a620-f25682bdc6c2	dfbdc6f0-fde2-4c6a-9885-b7dadc5817fb	5	Great work on the inventory system! Very professional.	2026-04-22 20:38:51.884
review-nara-1	e6054ae0-4870-46c8-9622-a762d7f6cf23	e953a5a5-1724-4593-bcdd-3342953a88af	5	Nara performed exceptionally well with our brand strategy.	2026-04-22 20:38:51.892
review-hist-0	5f3d9f30-845a-43dc-8a84-41e1a7b9e82c	dfbdc6f0-fde2-4c6a-9885-b7dadc5817fb	5	Great work on the inventory system! Very professional.	2026-04-22 20:40:25.771
review-hist-1	513da87d-c425-4790-ac40-61b33b76e898	e953a5a5-1724-4593-bcdd-3342953a88af	5	Nara performed exceptionally well with our brand strategy.	2026-04-22 20:40:25.776
review-hist-2	3a30bd67-1f4c-4375-be41-06a651bfbfbe	32370eeb-812b-462f-b888-a0755f8feecf	4	Good quality translation, delivered on time.	2026-04-22 20:40:25.779
review-hist-3	08606bc4-f1f6-49c0-8ae8-4e7fe4bf7c65	cc6bc3e7-751a-4d11-b6df-b7cfa177e099	5	Very deep analysis, helped us secure funding.	2026-04-22 20:40:25.783
review-hist-4	cdad62b8-0b1d-46d6-bb41-9b0790aefdf9	cc6bc3e7-751a-4d11-b6df-b7cfa177e099	4	Fast developer and very reliable.	2026-04-22 20:40:25.786
review-hist-5	0b35c742-b765-41c9-9ab6-da593f8f19ae	5f125b9e-af60-42e2-9f3b-67c4e48bfee8	5	Incredible designs! Our clients loved it.	2026-04-22 20:40:25.789
5661aa91-ad6c-4fe6-a37c-1d0c4a7971ba	16de1580-a598-4d6b-a4f6-0b8f4984c1d8	df40c3f7-dd63-462b-b212-6e38f2a062a7	5	Perfect job! All bugs were fixed quickly.	2026-04-22 22:02:46.765
\.


--
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Skill" (id, name, category, "createdAt") FROM stdin;
28eaab56-fd32-47c1-b872-7a88390c105f	Node.js	Backend	2026-04-16 20:48:02.25
a924178d-255a-47a3-b63b-2fcada066c5b	Next.js	Frontend	2026-04-16 20:48:02.25
1f022262-9e5f-4ec8-8e29-caae4179d166	React	Frontend	2026-04-16 20:48:02.25
c99750d2-9ea4-4f68-9f5e-14f9e8015bb1	Express	Backend	2026-04-16 20:48:02.25
9f2fa39a-7306-4f22-bf73-14a0b09a7d3a	Figma	Design	2026-04-16 20:48:02.25
656c67b3-a899-469e-8c6f-e2cec4ac37f3	Python	Backend	2026-04-16 20:48:02.25
bc93d903-647f-4039-84c2-42f4892a4b0c	Dart	Mobile	2026-04-16 20:48:02.25
f46f3d3f-0caf-42a2-8f0c-84ceef5e48d7	Tailwind CSS	Frontend	2026-04-16 20:48:02.249
2e0b4e82-f9c2-4ba8-808f-566fd4d1a8a5	Flutter	Mobile	2026-04-16 20:48:02.25
a897c00c-c5c5-4757-810a-6d02f609c12c	UI Design	Design	2026-04-16 20:48:02.25
57a68bdd-a27a-4b8e-82b0-36cb636028a6	TypeScript	Language	2026-04-16 20:48:02.249
8ca522ba-440f-45fc-9c85-b5d4d87d996a	UX Research	Design	2026-04-16 20:48:02.25
48f28d81-256f-4f1e-8f14-89728fb24ca4	Tableau	Data	2026-04-16 20:48:02.25
2a1f6c70-3585-4b7f-8cf8-9b02e3018277	SQL	Database	2026-04-16 20:48:02.25
497020d5-87d6-4bb4-92c9-3386e6c457b8	PostgreSQL	Database	2026-04-16 20:48:02.25
a5d74f2f-785e-4b5e-9923-1560f206e7e6	Social Media Marketing	Marketing	2026-04-22 20:34:43.921
c9477d97-80dd-48d1-b49f-1cf55fd1e644	Translation	Content	2026-04-22 20:34:43.921
58756b23-051b-4edb-827c-0ba43dd9d52d	SEO	Marketing	2026-04-22 20:34:43.921
4c9518d2-e8ab-4e25-9ee2-6efdedfa28c3	Copywriting	Content	2026-04-22 20:34:43.921
b52b1876-54bf-47d3-b500-031d0c7b5c24	React	Frontend	2026-04-22 20:34:43.919
9cc33714-73b9-4b5e-8307-d504fb5a7eb5	Flutter	Mobile	2026-04-22 20:34:43.92
21a2ce91-7380-4389-bc64-3224e4d43ce8	Next.js	Frontend	2026-04-22 20:34:43.919
f1c0407e-d545-467c-b16c-d66940a39b4a	Tableau	Data	2026-04-22 20:34:43.921
0d83473d-8614-4b94-86d4-9de174f9758b	Financial Modeling	Finance	2026-04-22 20:34:43.921
c522adf6-576e-4f82-ad4b-76ac0a407246	Tailwind CSS	Frontend	2026-04-22 20:34:43.919
d7ab5769-ec43-4e01-ab86-2145e980e9b3	SQL	Database	2026-04-22 20:34:43.921
e9ac0d08-b2e3-48ee-8a75-5824942172fe	TypeScript	Language	2026-04-22 20:34:43.92
dcf8b81c-857c-4e58-aadb-d43ef7773f41	UI Design	Design	2026-04-22 20:34:43.919
8882beb8-358a-4a1f-9028-2c4a8520e477	Node.js	Backend	2026-04-22 20:34:43.919
ea7bfe4b-395f-4b3c-9702-db580339c7ca	Firebase	Backend	2026-04-22 20:34:43.92
9eee99af-270d-4605-b01d-d30028490eb2	Market Research	Business	2026-04-22 20:34:43.921
bbe0483b-69d8-4b46-b95e-b2bcc5033cb2	Express	Backend	2026-04-22 20:34:43.921
60aa41ac-c036-43a4-bfa2-07a23ee2c1b6	AWS	DevOps	2026-04-22 20:34:43.919
c0e83862-a30a-48c4-8b22-fa56496eba51	UX Research	Design	2026-04-22 20:34:43.921
afa73a10-a32a-495a-ac5e-af0c9d0cb79d	PostgreSQL	Database	2026-04-22 20:34:43.919
e3ad393e-956d-4d80-b3c6-91678d928792	Figma	Design	2026-04-22 20:34:43.921
c3faa119-f073-4963-aa66-ede4237afe02	React	Frontend	2026-04-22 20:38:51.704
ff5be794-a9e7-48a0-b78e-3d3698fbeb2a	SQL	Database	2026-04-22 20:38:51.706
ae113ad4-745c-48ad-ac35-7fc2e8e91e0c	Python	Backend	2026-04-22 20:38:51.706
ba8836d7-4503-4523-92ff-09663f691796	UX Research	Design	2026-04-22 20:38:51.706
c3189dd6-4f51-43e2-b93a-7fe813e4922b	Translation	Content	2026-04-22 20:38:51.707
81b2881c-95b1-49f4-9a39-e457d171f193	Next.js	Frontend	2026-04-22 20:38:51.703
5d4e6082-a6be-4d9c-a949-cf7b4070c4ea	TypeScript	Language	2026-04-22 20:38:51.703
afb9c92d-38d2-46c1-bb62-f0133e8f969e	Express	Backend	2026-04-22 20:38:51.704
dfdc3e05-0fd5-410a-89ed-18d4fbe6fca9	Tailwind CSS	Frontend	2026-04-22 20:38:51.704
13294670-d674-45f2-b132-b7bc4e6e2650	UI Design	Design	2026-04-22 20:38:51.703
ff930333-279d-49ac-8172-af0809f732c4	Tableau	Data	2026-04-22 20:38:51.706
7d3ae1c0-49a5-4640-8b4d-174d39af4a82	Copywriting	Content	2026-04-22 20:38:51.707
adfd85aa-badc-40e1-8908-91c54ad7e94b	Firebase	Backend	2026-04-22 20:38:51.706
52f00670-0d9e-41e4-96a5-e5280f43c1fe	SEO	Marketing	2026-04-22 20:38:51.706
4395b95f-1829-4ce9-b1c1-b7dcdb3a8d77	Flutter	Mobile	2026-04-22 20:38:51.703
d6535e56-cf6f-43f1-b0c7-4651ba5920f1	Figma	Design	2026-04-22 20:38:51.705
dcb5645b-17c3-4adb-aee9-113ca99b193d	Market Research	Business	2026-04-22 20:38:51.707
4ab6d4c9-3b4c-4420-a6f2-e8a358fe499c	Node.js	Backend	2026-04-22 20:38:51.707
2bfb0097-d209-49aa-afd9-fe641c8bddb2	Social Media Marketing	Marketing	2026-04-22 20:38:51.707
e5a5b69d-4eeb-4016-ac76-9e22a10a054d	PostgreSQL	Database	2026-04-22 20:38:51.707
7882c621-8c4e-4d4d-86a6-5e77e9b04f3f	Financial Modeling	Finance	2026-04-22 20:38:51.707
3035eb4a-5bbb-4f43-8d6f-eb934ea3adbc	Dart	Mobile	2026-04-22 20:38:51.707
34e20ff3-901d-43e9-89ce-34002df678b8	AWS	DevOps	2026-04-22 20:40:25.609
7fe05b5d-ea64-44a9-a1df-c33e8a9061d5	SQL	Database	2026-04-22 20:40:25.61
02e2d45e-7fea-4523-a01b-43485e66a02c	Next.js	Frontend	2026-04-22 20:40:25.609
0427e643-546c-4e9f-9b75-84e4ef3bd90e	Node.js	Backend	2026-04-22 20:40:25.609
12b833b9-8087-4833-8675-b6d2961f07c3	Translation	Content	2026-04-22 20:40:25.61
8b299e84-8e91-4525-96b2-8c4c474fd95e	UI Design	Design	2026-04-22 20:40:25.61
6acc7d76-7a46-4532-ae4d-191f9c34c5fd	SEO	Marketing	2026-04-22 20:40:25.61
f2b526c4-ce15-446e-ac42-a776fa4d3aa5	Figma	Design	2026-04-22 20:40:25.61
80723aee-e63a-4fe0-b91d-3d3f3ef9f68e	Copywriting	Content	2026-04-22 20:40:25.61
7b4d8f2c-9375-4c2c-838b-cd9fc1642f1a	Firebase	Backend	2026-04-22 20:40:25.61
3b3125d6-e415-4719-b5c2-9552c3afc47b	Flutter	Mobile	2026-04-22 20:40:25.61
813b7a53-f605-40b6-a907-e584496c4c19	Tableau	Data	2026-04-22 20:40:25.61
4c9d7184-a9d8-49f5-bc6f-c9649a6ab7c1	Express	Backend	2026-04-22 20:40:25.609
8a2fbf23-3604-4c63-b8e0-619952a0e53a	Python	Backend	2026-04-22 20:40:25.61
fdfffbdd-f655-4645-9eb2-e100f71bc3cc	UX Research	Design	2026-04-22 20:40:25.61
f68e439b-61e0-47e1-967f-4fd94b944a59	Dart	Mobile	2026-04-22 20:40:25.61
93758b00-8168-47df-a9f3-e71110ef475c	React	Frontend	2026-04-22 20:40:25.609
dc2712b2-76c2-4df6-843a-ce1eff419289	Financial Modeling	Finance	2026-04-22 20:40:25.61
402db91d-dca6-4b69-92a4-8f468975e020	Market Research	Business	2026-04-22 20:40:25.61
d5fb211a-7771-4bfa-8209-4e9a51b6191d	Tailwind CSS	Frontend	2026-04-22 20:40:25.609
cb0a6559-dfee-4de4-8bd7-a82fce9c528f	Social Media Marketing	Marketing	2026-04-22 20:40:25.61
cecef57b-c9fb-43a8-90be-efd86103cd3f	PostgreSQL	Database	2026-04-22 20:40:25.61
da683bbe-f4f2-498e-9a5a-6f8bc418d402	TypeScript	Language	2026-04-22 20:40:25.61
c1714667-c86a-4b4d-82d0-2e0a90d543ed	SQL	Database	2026-04-22 21:21:19.714
cda712cc-5f7c-471f-9cd1-224376c49087	SEO	Marketing	2026-04-22 21:21:19.714
f69b05ba-179b-4eab-b842-314672740305	React	Frontend	2026-04-22 21:21:19.709
daa85f50-6e40-4a99-91e6-5bf046745e7e	Python	Backend	2026-04-22 21:21:19.714
be18d06c-ff88-4e1a-843d-367d27c4b7f9	Firebase	Backend	2026-04-22 21:21:19.713
b4566cc1-2a49-430e-8a08-c978d51ea7e9	Translation	Content	2026-04-22 21:21:19.714
d125219d-3352-4b92-8f27-1c642fa86ca3	Flutter	Mobile	2026-04-22 21:21:19.71
21c7022b-9cd9-47b3-a267-f532c0428b59	UI Design	Design	2026-04-22 21:21:19.71
1b88061c-c007-4363-8db6-6f48ea58345f	TypeScript	Language	2026-04-22 21:21:19.71
444a7fac-0b80-45d7-ae04-de96635332d9	Tailwind CSS	Frontend	2026-04-22 21:21:19.712
01a7d8f8-199c-4ddc-8780-7de2b326bfa9	Tableau	Data	2026-04-22 21:21:19.714
c0787ff7-72d0-452c-876b-f42cf369f768	Market Research	Business	2026-04-22 21:21:19.714
0c785f45-95d9-481a-895e-a08237b625e0	Node.js	Backend	2026-04-22 21:21:19.71
4593d31a-56f1-447a-beef-98b5bcf437d7	Copywriting	Content	2026-04-22 21:21:19.714
3dbabd4b-f855-46bc-a336-9f4fb6f1bcc7	Social Media Marketing	Marketing	2026-04-22 21:21:19.714
314ee414-46c0-489a-8be1-9e8b6f437956	PostgreSQL	Database	2026-04-22 21:21:19.71
34275cff-159e-4b57-854e-e87441d8d78a	Next.js	Frontend	2026-04-22 21:21:19.71
04c64ce1-3a99-4054-9a56-1af5a89db8ac	AWS	DevOps	2026-04-16 20:48:02.249
cbff3da6-7074-479d-a047-9500146bdd9a	Firebase	Backend	2026-04-16 20:48:02.25
93e4e4b8-78f4-40e0-9f03-02b1f73bccac	Flutter	Mobile	2026-04-16 20:50:52.588
17a09a3d-cbab-4f1f-aaac-8b6fe10c0515	TypeScript	Language	2026-04-16 20:50:52.587
87c3f5fc-6871-4061-827b-0d1c6c7193d5	Next.js	Frontend	2026-04-16 20:50:52.588
5ad36810-3926-4655-b4a0-1fc6d6037ac2	Figma	Design	2026-04-16 20:50:52.589
7a013cbd-144c-4288-9900-402ea6923b39	UX Research	Design	2026-04-16 20:50:52.588
55175b7f-8f8b-4438-940a-6d42b4835e2d	UI Design	Design	2026-04-16 20:50:52.588
494854c4-9d7e-4c30-87f8-65a889313333	PostgreSQL	Database	2026-04-16 20:50:52.587
d34573b3-f7d0-4250-8e3d-a9746bf4b406	Firebase	Backend	2026-04-16 20:50:52.588
16bf7a71-f1dd-4bc3-badc-ca0a0c9f59a0	Dart	Mobile	2026-04-16 20:50:52.588
7abe5d77-156e-430b-8a75-40c49704eebc	Tailwind CSS	Frontend	2026-04-16 20:50:52.588
192b7b5b-2504-452a-ad47-28f6d22fcc99	SQL	Database	2026-04-16 20:50:52.589
409e8ddf-5ed1-4acc-a203-66996baee3f9	React	Frontend	2026-04-16 20:50:52.587
3a66b4fd-df02-414e-a814-09fe8c14a856	Python	Backend	2026-04-16 20:50:52.588
394a650b-8fd8-4b3d-8712-cf3caa1f7c23	Node.js	Backend	2026-04-16 20:50:52.587
5b3c86dc-4ab2-42f2-ac72-f1aff452b4b4	Express	Backend	2026-04-16 20:50:52.587
f79cd226-18f2-4ae6-9465-001c04333719	AWS	DevOps	2026-04-16 20:50:52.587
709ef2c0-86f4-4d77-b8e0-e324048c3ecb	Tableau	Data	2026-04-16 20:50:52.589
162cd535-37db-40ac-9cdf-e9f6e6cde3e2	Tailwind CSS	Frontend	2026-04-20 20:06:07.511
df1f1cbb-d4ef-4b57-a2f4-c9a3e0b00ee9	UI Design	Design	2026-04-20 20:06:07.511
092e056a-a6d0-423e-857d-2064d074ec93	AWS	DevOps	2026-04-20 20:06:07.512
594e7a56-37da-41bc-8d4d-2ab3486e0477	UX Research	Design	2026-04-20 20:06:07.512
6dd79ef9-28c1-439d-9e38-ae7a4780d6c6	Tableau	Data	2026-04-20 20:06:07.513
b6391643-b40d-4bcd-9e9c-9b3d2e356bc0	React	Frontend	2026-04-20 20:06:07.512
b4f982d6-ca74-42fe-ad93-d1f24912a9d3	Dart	Mobile	2026-04-20 20:06:07.513
9c95c54c-2537-44bc-b13b-ee63eb8e9a24	Flutter	Mobile	2026-04-20 20:06:07.513
ca7e605e-aeac-4575-b3b5-52d6673894fa	Express	Backend	2026-04-20 20:06:07.512
cc2c877a-59d7-4ddc-883d-0c2748c542dc	Python	Backend	2026-04-20 20:06:07.513
f126c619-79bd-4eb7-80c7-bcf9cf49f2e3	PostgreSQL	Database	2026-04-20 20:06:07.512
35952e9b-8522-4f18-ad3a-afdfda7dc35c	Next.js	Frontend	2026-04-20 20:06:07.511
9fdd0c03-586f-4f65-bf5b-78b83c94b8d6	SQL	Database	2026-04-20 20:06:07.513
4471d34b-d6ef-4101-8987-fcf44938f783	Firebase	Backend	2026-04-20 20:06:07.513
2b28dbfc-8ae8-43e3-9450-b429fa0a6dac	Node.js	Backend	2026-04-20 20:06:07.512
6b50e9f5-5548-484d-a529-183701be16cb	Figma	Design	2026-04-20 20:06:07.512
f15cdd72-dfe3-4cfa-8d75-ca66cb4de435	TypeScript	Language	2026-04-20 20:06:07.513
79fec253-6d91-40e5-9c82-6c1b89e7c653	AWS	DevOps	2026-04-20 20:08:52.436
134dc1fb-83d2-4fd0-ba40-db875dde8c2f	Tailwind CSS	Frontend	2026-04-20 20:08:52.441
54e0432c-7d78-462b-9d67-bede4570d1a5	UI Design	Design	2026-04-20 20:08:52.44
8116d10f-042a-49a3-bcde-794181f09461	Firebase	Backend	2026-04-20 20:08:52.44
38088f3a-f6c9-45b4-bce4-069ddad7865e	SQL	Database	2026-04-20 20:08:52.44
b64d706d-5fda-413d-98b2-2d30b384a723	Node.js	Backend	2026-04-20 20:08:52.44
3804f6b1-a186-47f0-8863-3c96c5cfcd74	Dart	Mobile	2026-04-20 20:08:52.436
a5307fe9-4486-4903-a90b-d84f3e0e45ef	TypeScript	Language	2026-04-20 20:08:52.435
1ed05263-8d7a-4cc6-a111-0874e1bf8b3a	Tableau	Data	2026-04-20 20:08:52.44
d6e9c68b-bad6-4b41-a124-a946f3e95a90	PostgreSQL	Database	2026-04-20 20:08:52.44
ccd5b0f2-c163-460b-b566-41d8a992d858	Next.js	Frontend	2026-04-20 20:08:52.436
b76732a8-5cce-4a8d-baf2-c83ef6d327a9	Express	Backend	2026-04-20 20:08:52.436
f3aa8f89-1b03-4704-ba3d-61d723cd2ba3	Figma	Design	2026-04-20 20:08:52.436
9061676e-033a-48f8-b5c7-26f815106f3d	Flutter	Mobile	2026-04-20 20:08:52.436
50b4ebc8-e5e9-43bd-8bc4-0f93338d8bb2	React	Frontend	2026-04-20 20:08:52.44
2dcb1994-9dea-49c2-aea5-0bb006388454	UX Research	Design	2026-04-20 20:08:52.436
4777460b-3cdd-4212-9d0b-e480db4d9356	Python	Backend	2026-04-20 20:08:52.44
1b92c5da-1a14-4f1d-84bb-9cc4ba3f5b3d	Figma	Design	2026-04-20 20:09:55.1
7cd36ad7-6e54-4a19-b4d9-d868380e26b6	Python	Backend	2026-04-20 20:09:55.1
3b20f71b-51ed-454e-8fc4-b4fd77d8dc63	Next.js	Frontend	2026-04-20 20:09:55.099
34b31fdb-f284-41c7-bfd4-9d9bda1168d9	SQL	Database	2026-04-20 20:09:55.101
2d0f364f-1524-4751-bcbf-754b80364614	UX Research	Design	2026-04-20 20:09:55.1
1bca1365-a5fb-4d68-bbac-2546a78786b7	Tableau	Data	2026-04-20 20:09:55.101
dd5cb862-f160-48ac-8402-0972e59d435a	Flutter	Mobile	2026-04-20 20:09:55.1
a3e0d6a0-92b2-4c57-8120-c071681d0f1e	Firebase	Backend	2026-04-20 20:09:55.1
85d17582-485c-4314-9bc7-0e79bd477f28	Tailwind CSS	Frontend	2026-04-20 20:09:55.099
3ee4c7bc-6c33-4d90-aeaa-234b8e4bbb91	PostgreSQL	Database	2026-04-20 20:09:55.101
e858b0be-54d7-44a2-bc33-7e3563177ead	TypeScript	Language	2026-04-20 20:09:55.1
7f484977-f8cc-45c3-b2b1-3137da7579d4	Dart	Mobile	2026-04-20 20:09:55.1
cf4559f9-ae62-496d-9c0e-abb60c78a117	UI Design	Design	2026-04-20 20:09:55.1
b22fee63-a3fe-45e1-9b97-6bd9072a476d	Node.js	Backend	2026-04-20 20:09:55.099
42eb8f6e-1b70-4ab6-8f7c-41828bc24892	AWS	DevOps	2026-04-20 20:09:55.099
283e0451-0d88-4020-a75e-2c3261c7cc61	Express	Backend	2026-04-20 20:09:55.101
c2302bf9-1294-479e-835e-074719494f6f	React	Frontend	2026-04-20 20:09:55.099
ac4987bc-a278-4970-9003-0f89d5d87bf1	UI Design	Design	2026-04-20 20:11:05.253
f2d99f28-efa6-4a72-860c-e038d3fc7ed3	SQL	Database	2026-04-20 20:11:05.253
5b268373-20d4-426b-a7b3-6c6ca6c734c3	AWS	DevOps	2026-04-20 20:11:05.252
58b2f127-f8ad-4da4-a9aa-c9095ea75654	TypeScript	Language	2026-04-20 20:11:05.252
7ed1fcf7-49d2-47b3-9f09-13e495633a40	Tableau	Data	2026-04-20 20:11:05.253
0dff5667-822e-4975-84cb-6a4d896b3807	Next.js	Frontend	2026-04-20 20:11:05.252
14319140-965d-4d8f-b127-a1d4276f5fb3	Tailwind CSS	Frontend	2026-04-20 20:11:05.252
56ffc152-3922-47f9-bc5a-4d14e8c7618b	Flutter	Mobile	2026-04-20 20:11:05.253
9c15895e-5eae-49da-97d3-7ee2405f1562	Python	Backend	2026-04-20 20:11:05.253
bfde4d22-9dbf-4ca2-be69-15c30f5e567c	Firebase	Backend	2026-04-20 20:11:05.253
e6b26b3e-f741-4d0f-9f55-90391b964c94	Dart	Mobile	2026-04-20 20:11:05.253
7eabc923-ade5-4d35-866a-d9f30f404a10	PostgreSQL	Database	2026-04-20 20:11:05.253
abf6a284-934c-4b8e-babb-aeda572f0060	Figma	Design	2026-04-20 20:11:05.253
d70a2749-6f34-4952-a036-51909b30ad83	React	Frontend	2026-04-20 20:11:05.252
af1b5221-14a0-437a-958c-45eec8cbc54a	UX Research	Design	2026-04-20 20:11:05.253
e09ae155-5b4b-48cf-afc6-e9daf5815fc9	Express	Backend	2026-04-20 20:11:05.252
02b43d5f-0352-47cb-9842-5482efafbe5b	Node.js	Backend	2026-04-20 20:11:05.252
ba7cda3d-fa25-4f9b-9ea5-e341ecb11bb0	Dart	Mobile	2026-04-22 20:34:43.92
0568d209-4e8d-4258-b332-d39623130d54	Python	Backend	2026-04-22 20:34:43.92
35b86f09-8061-4486-a482-a912dd01a237	AWS	DevOps	2026-04-22 20:38:51.703
15996ad7-ed2e-43f8-b225-bab09f84b199	Financial Modeling	Finance	2026-04-22 21:21:19.715
2b60fa30-e387-43ca-981d-527424d565f4	Express	Backend	2026-04-22 21:21:19.715
a2e23ce5-f928-4d71-a4b2-6b4ea8d13ef6	Dart	Mobile	2026-04-22 21:21:19.715
060195bb-12b9-4497-be07-af219154f168	Firebase	Backend	2026-04-22 22:00:56.515
94570165-ee15-4229-9e82-fb1f8473df3f	Flutter	Mobile	2026-04-22 22:00:56.514
26acf9e0-32ed-433f-afc8-fea95da3a0e0	Copywriting	Content	2026-04-22 22:00:56.516
a482ed49-73e1-4ec2-9f82-58199e2fe0bb	UX Research	Design	2026-04-22 22:00:56.516
229292bf-eea8-4061-8e44-fc98adcea718	Firebase	Backend	2026-04-22 22:02:45.645
47388441-c157-4803-ba76-2dded27ad2d1	Flutter	Mobile	2026-04-22 22:02:45.645
9926948f-7914-4d01-adf2-9f3a3fc21e31	Express	Backend	2026-04-22 22:02:45.642
87e3d84d-85cf-403f-bb39-49747c1c482e	Tableau	Data	2026-04-22 22:02:45.645
efebb96e-f6df-41d7-a6eb-dfa02b537fe2	UI Design	Design	2026-04-22 22:00:56.513
3602380e-2c13-49ba-9496-998250ff27c1	SQL	Database	2026-04-22 22:00:56.516
173e061b-352a-4ae6-93ad-049678677b18	React	Frontend	2026-04-22 22:02:45.642
b77ef587-0375-414d-85c9-023b917bc831	UX Research	Design	2026-04-22 22:02:45.645
182e491d-e6c9-49f2-b3f3-e939929e0404	AWS	DevOps	2026-04-22 21:21:19.715
8fef30e9-ee6b-42a9-9d43-2258755ba7d2	Node.js	Backend	2026-04-22 22:00:56.513
662e9840-89e7-4269-bdef-ec0dbf2f91ea	Express	Backend	2026-04-22 22:00:56.513
dea1d432-372b-4906-9f3d-364f0a772f0b	Market Research	Business	2026-04-22 22:00:56.516
23e07b13-3d4b-4899-8337-860c59c2e3b3	TypeScript	Language	2026-04-22 22:02:45.642
6035e8d3-c435-4e20-802e-05dca7c77989	Copywriting	Content	2026-04-22 22:02:45.645
cddbfca5-71f4-46c5-84e9-42ef5eb5b65f	Translation	Content	2026-04-22 22:02:45.645
89b386e8-c6d5-4296-a592-9bb1e2a374d6	Financial Modeling	Finance	2026-04-22 22:02:45.645
1e15b1ca-aedb-42e4-9dd5-94042f61c3b1	Tableau	Data	2026-04-22 22:00:56.516
f8359f69-42d5-4517-818f-d59b2c8a6363	React	Frontend	2026-04-22 22:00:56.513
5025c96f-1ef8-46d6-8dcd-267c606b01ee	Figma	Design	2026-04-22 22:00:56.516
fca0b70d-2d48-4ac3-9368-42f47b9b17d1	Figma	Design	2026-04-22 22:02:45.642
d2d9e7ef-5812-43ce-a8e3-3498f978efbd	SEO	Marketing	2026-04-22 22:02:45.645
99336148-5ced-4fc8-ae16-8bbdf09f69f9	Social Media Marketing	Marketing	2026-04-22 22:02:45.645
4bbf6e71-7961-41ec-80ab-16e0d94026b6	UI Design	Design	2026-04-22 22:02:45.645
8f30bd50-7d04-4e02-9639-b4858e023950	UX Research	Design	2026-04-22 21:21:19.715
51b5f9c7-6ae7-4d57-bb22-9c307817c3c3	TypeScript	Language	2026-04-22 22:00:56.513
27fd690b-f139-4373-a567-281caf6d8b54	AWS	DevOps	2026-04-22 22:00:56.513
51072c3c-fabb-485a-8325-c1bed225fbff	Tailwind CSS	Frontend	2026-04-22 22:02:45.642
efafe33a-e133-44de-ac9b-6a10e10efbe8	Dart	Mobile	2026-04-22 22:02:45.645
8481bae6-1b07-4963-9fd7-727320a4b314	Tailwind CSS	Frontend	2026-04-22 22:00:56.515
10cdefd1-2bf9-4b72-8549-66b49723433a	Next.js	Frontend	2026-04-22 22:00:56.513
bbe0ee3a-2dbb-499f-8088-ecd5c305daa4	PostgreSQL	Database	2026-04-22 22:00:56.516
1f815584-d9c4-44fe-b5f6-580fbd656753	Financial Modeling	Finance	2026-04-22 22:00:56.516
7cd58920-b3ed-44bc-8643-0854c7eed352	PostgreSQL	Database	2026-04-22 22:02:45.643
3309380a-4a61-400b-8a07-b6082c45f012	Next.js	Frontend	2026-04-22 22:02:45.643
ae5545f9-ae8c-42cb-a832-28d424d00c58	Figma	Design	2026-04-22 21:21:19.715
02a2a3cd-c8bf-4b85-a4ab-3aa71b1c681e	SEO	Marketing	2026-04-22 22:00:56.516
2f710c1d-3b35-4cd0-99f0-1c9f17852ed9	Python	Backend	2026-04-22 22:00:56.516
bee1ce19-6b8f-4380-93c8-571c7135d440	Social Media Marketing	Marketing	2026-04-22 22:00:56.516
30bd7001-9922-439f-b937-fd156d7b8dd0	Python	Backend	2026-04-22 22:02:45.645
b20f425c-4304-483e-8076-74af721024d8	Node.js	Backend	2026-04-22 22:02:45.644
b07df9b2-fdfe-43e0-b4b2-4959b3028534	Market Research	Business	2026-04-22 22:02:45.645
96ba7d3d-aac4-498a-af32-7006a7ceb277	Dart	Mobile	2026-04-22 22:00:56.516
b7a9afe6-5689-4139-acaf-64834c54acc7	Translation	Content	2026-04-22 22:00:56.516
3f11e3b7-e691-4b89-bfc4-1c9837deec26	AWS	DevOps	2026-04-22 22:02:45.645
ce51a463-2ec2-40e9-9a82-4902162a4f3c	SQL	Database	2026-04-22 22:02:45.645
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, full_name, role, is_verified, "passwordHash", "createdAt", email_verified, phone, phone_verified) FROM stdin;
32370eeb-812b-462f-b888-a0755f8feecf	writer@example.com	WordCraft Solutions	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 20:34:44.202	t	99223344	t
b48cf1ed-5c2f-480b-b108-1efab2e6b5db	bat@example.com	Д. Бат-Эрдэнэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-16 20:48:02.363	t	88001122	t
c9bf3a57-c929-4751-8707-36324aec12e5	zoloo1572@gmail.com	selenge yura	FREELANCER	t	$2b$10$mndIuGRljOj9TfGHckgR8edH3CWrtIoGkAAHxEYHh8njjWKcCdkS6	2026-04-16 20:54:16.818	t	99189217	t
0867486b-b93e-4a04-bd3d-8d1470481295	selenge@example.com	Б. Сэлэнгэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-16 20:48:02.382	t	99001122	t
efbb6ed9-e039-4ad1-a685-2abc35f1af5b	togoldor@example.com	Э. Төгөлдөр	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-16 20:48:02.39	t	77001122	t
33ef48b9-9c68-44a8-93b2-6087dcefa9f4	theyuraz35@gmail.com	yura yura	CLIENT	t	$2b$10$puq7SzzhSQxoSNHJHKkOjuveZpIHm/WZGX0ydtNo/jgYMmg19cH9y	2026-04-16 21:01:06.561	t	99189218	t
822fa309-1ecf-47b4-bb4a-71b31af6aae4	nara@example.com	Г. Нарантуяа	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 20:34:44.242	t	88445566	t
35bd7358-4fa7-48c4-8a50-7928e4a1a3a1	bold@example.com	Т. Болд	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 20:34:44.249	t	99445566	t
b51e7748-282c-4fb3-812f-88a03afed012	zaya@example.com	С. Заяа	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 20:34:44.254	t	77445566	t
5f125b9e-af60-42e2-9f3b-67c4e48bfee8	creative@example.com	Creative Agency	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-16 20:48:02.355	t	99112233	t
be463e06-d274-48e9-9112-63064a9cb18c	user1@example.com	Б. Гэрэл	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.049	t	89000001	t
06515955-961d-496b-9682-c710c4152922	user2@example.com	Г. Наран	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.058	t	89000002	t
294cc26c-d990-427d-9221-921e36ad47e0	user3@example.com	С. Наран	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.062	t	89000003	t
576831d8-03ab-478e-b530-10328578e57f	user15@example.com	Т. Гэрэл	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.155	t	89000015	t
c1dfe898-bd46-4fd3-8d9b-75fedc6b418c	user16@example.com	М. Сүх	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.162	t	89000016	t
ceade6e5-5dc1-44e9-98b4-f2c2ca38354b	user17@example.com	Л. Сүх	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.165	t	89000017	t
483df433-d14c-48ba-bf1b-12b537af67da	user18@example.com	Ж. Наран	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.174	t	89000018	t
07639c23-a1ab-4320-a20b-9b468cb29beb	user19@example.com	У. Цэцэг	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.177	t	89000019	t
81991ca0-cd48-4577-bc48-e8c82462f28e	user4@example.com	А. Баяр	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.071	t	89000004	t
3a973a67-7565-418e-8eb9-cd1d1381a626	user5@example.com	Т. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.075	t	89000005	t
a4c4f060-7e2b-44b7-949e-538025e6b592	user6@example.com	М. Тулга	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.083	t	89000006	t
27c65585-a3b7-4bef-bd0a-1a4c912542bc	user7@example.com	Л. Цэцэг	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.086	t	89000007	t
0d2171e1-e524-4d24-b75c-cf9518bd6f2a	user8@example.com	Ж. Болд	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.092	t	89000008	t
f19f76d4-4fe3-43c6-a9f9-ac0604bc47d5	user9@example.com	У. Болд	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.094	t	89000009	t
3d5d7fe4-33f7-4963-b8fc-b189b86e4b96	user20@example.com	Д. Тулга	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.185	t	89000020	t
c016e9a1-7001-4555-bf79-23e3b2263d29	user21@example.com	Б. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.188	t	89000021	t
68e0425a-1ab2-4c5f-8c7d-c9d60aab8297	user22@example.com	Г. Баяр	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.196	t	89000022	t
142d4748-f6dd-4d84-ba0b-c1d579f0e879	user23@example.com	С. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.2	t	89000023	t
cc6bc3e7-751a-4d11-b6df-b7cfa177e099	fintech@example.com	Fintech Startup	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-16 20:48:02.359	t	77112233	t
e953a5a5-1724-4593-bcdd-3342953a88af	marketing@example.com	Global Reach SEO	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 20:34:44.197	t	88223344	t
ee6e1ace-c4dd-49d8-8d91-c661cdbcfc58	user10@example.com	Д. Болд	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.102	t	89000010	t
7aa4e99c-796a-4c1f-913c-36a3067643ec	user11@example.com	Б. Алтан	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.105	t	89000011	t
bb37e90d-6798-4220-9487-e5fb53148430	user12@example.com	Г. Алтан	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.113	t	89000012	t
503a348f-4796-4ee4-8f7b-d83719ec5f0c	user13@example.com	С. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.116	t	89000013	t
6e889351-bdb9-4992-863a-c4a19c06474b	user14@example.com	А. Сүх	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.152	t	89000014	t
4b329983-44f7-4a74-a4cb-3250ee26eeb7	user24@example.com	А. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.208	t	89000024	t
bcdcc3bb-1f4e-4cc3-90bd-1c48f5e08f71	user25@example.com	Т. Цэцэг	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.211	t	89000025	t
976a7a06-d4fd-48fc-8d7d-8fc92306a20a	user26@example.com	М. Цэцэг	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.219	t	89000026	t
455c15dd-d46b-4a97-9224-54f47305bf5e	user27@example.com	Л. Наран	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.222	t	89000027	t
634ae2f5-d5cb-4fb8-b972-9022d6cbe956	user28@example.com	Ж. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.23	t	89000028	t
db4c3d70-971f-4225-8a31-176c4a85496e	user29@example.com	У. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.235	t	89000029	t
aeadca3f-60ab-472e-8ecd-e075fef2675a	user30@example.com	Д. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.243	t	89000030	t
b87698c0-de4a-4400-9150-04af75011956	user31@example.com	Б. Бат	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.247	t	89000031	t
43d0f4e0-4535-4b6f-a254-0d932f73d61b	user32@example.com	Г. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.254	t	89000032	t
2b2b0b4c-2340-4828-82f3-30b0e1a97c92	user33@example.com	С. Сүх	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.257	t	89000033	t
0b9a37ce-bd78-4d52-80ea-4f8587a15c05	user34@example.com	А. Алтан	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.265	t	89000034	t
c61ed029-dba6-42ce-91da-5289e15bf652	user35@example.com	Т. Болд	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.268	t	89000035	t
63db5351-b4a4-4fbb-a757-3ef076349302	user36@example.com	М. Баяр	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.278	t	89000036	t
39dd86fa-9f8a-4f0a-b3bf-42b4b4475e4a	user37@example.com	Л. Алтан	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.281	t	89000037	t
c4a09a34-d4e5-4cf8-bd6b-9f965b9fb6c2	user38@example.com	Ж. Гэрэл	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.289	t	89000038	t
94f58c35-fe88-4f8b-8a94-5567ebc72bab	user39@example.com	У. Алтан	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.292	t	89000039	t
f49f05f2-c067-469a-b98f-ac455ff64e0f	user40@example.com	Д. Цэцэг	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.305	t	89000040	t
b00be5cf-c184-4d50-9e18-530f5c377dfd	user41@example.com	Б. Гэрэл	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.308	t	89000041	t
2efdd2b8-ea0d-44f8-b892-7633c1bdacbe	user42@example.com	Г. Алтан	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.315	t	89000042	t
84c594db-f9f0-4429-a175-177ac67206c0	user43@example.com	С. Баяр	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.319	t	89000043	t
e0cef59a-b91d-4110-af56-83fee4c8e72c	user44@example.com	А. Сүх	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.327	t	89000044	t
324acbb4-8d37-4d65-bd0d-4ddf4eeee4b2	user45@example.com	Т. Сүх	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.33	t	89000045	t
f380d2df-1e2c-4918-a1ad-91713210e1e5	user46@example.com	М. Болд	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.338	t	89000046	t
c2d73db7-1df4-460e-8537-1b74fb8e224f	user47@example.com	Л. Цэцэг	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.341	t	89000047	t
910186ac-c9ff-42db-8e17-47818a2b1097	user48@example.com	Ж. Сүх	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.348	t	89000048	t
ef1b1d3c-662a-4bb3-ae17-f8e5fc6a15dc	user49@example.com	У. Гэрэл	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.35	t	89000049	t
970e7061-435e-4e56-b2f8-5d866947dfd7	user50@example.com	Д. Наран	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.359	t	89000050	t
d4db6937-3f90-4a43-b709-ce156fe21923	user51@example.com	Б. Эрдэнэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.362	t	89000051	t
81b88d39-1c48-46bb-aff0-ccc813d84c40	user52@example.com	Г. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.371	t	89000052	t
c5ada1e9-5dc5-4c3c-a0df-66eb48b39599	user53@example.com	С. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.374	t	89000053	t
90d3a059-f35e-4d5a-83e9-9b8325ab42f1	user54@example.com	А. Болд	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.382	t	89000054	t
4e6f60fd-7a31-416d-8bf8-440cf7006857	user55@example.com	Т. Баяр	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.385	t	89000055	t
1845349f-d986-4ef7-8bd6-7283eb15034e	user56@example.com	М. Баяр	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.392	t	89000056	t
25b2d246-60b7-4d46-bece-f1e8174bd1d3	user57@example.com	Л. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.396	t	89000057	t
18c75f2f-2162-4d91-9755-3a92bd4c8033	user58@example.com	Ж. Алтан	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.403	t	89000058	t
626e8d3c-2191-4e4f-b961-2ffadb22b601	user59@example.com	У. Сүх	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.407	t	89000059	t
14f94cc4-6114-42bf-b2a6-48d8f1fd903d	user60@example.com	Д. Гэрэл	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.415	t	89000060	t
9565ce7e-8afe-457a-9415-6e570339b07d	user61@example.com	Б. Сүх	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.419	t	89000061	t
2e802997-0d01-4739-98ba-64f0aa5e514f	user62@example.com	Г. Тулга	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.425	t	89000062	t
406d0789-1aa5-425e-81db-4a096174d8b4	user63@example.com	С. Наран	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.428	t	89000063	t
93b5b039-b2d1-40d5-be39-5a651ae44a5a	user64@example.com	А. Цэцэг	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.434	t	89000064	t
2bf21efa-271e-4271-9e9b-1effdbdc358e	user65@example.com	Т. Цэцэг	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.437	t	89000065	t
091a1adf-5b90-433a-a594-2fa291317272	user66@example.com	М. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.445	t	89000066	t
23e564d1-58fb-47bc-b265-9ba4846315f7	user67@example.com	Л. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.449	t	89000067	t
a8a72d5a-4994-4547-bf42-694c7107ce3b	user68@example.com	Ж. Алтан	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.457	t	89000068	t
f4c2d1e4-5b38-4a22-a160-f42e1380096d	user69@example.com	У. Тулга	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.46	t	89000069	t
089103ec-6a7a-4508-a939-88170b301827	user70@example.com	Д. Гэрэл	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.468	t	89000070	t
91b31a28-fde7-4a27-9860-06718c6863d0	user71@example.com	Б. Эрдэнэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.472	t	89000071	t
ef90314d-6a95-4b1c-94d4-20bbcfa0210f	user72@example.com	Г. Гэрэл	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.479	t	89000072	t
6dcc6035-66ac-4de8-907e-b7ab90e08c2e	user73@example.com	С. Баяр	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.483	t	89000073	t
8ced4b58-1c74-40c3-8e56-3c222f2e84c5	user74@example.com	А. Алтан	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.49	t	89000074	t
18062bd8-169e-4dbd-aef9-dbd6406d2b7b	user75@example.com	Т. Цэцэг	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.494	t	89000075	t
ea305993-88f9-49e9-a583-02dd0887b3ee	user76@example.com	М. Эрдэнэ	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.502	t	89000076	t
46ffd2e3-1abf-490c-9acb-ee6a6473bdc8	user77@example.com	Л. Эрдэнэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.506	t	89000077	t
167436b8-067b-4c1d-b97c-f9d2da3836d2	user78@example.com	Ж. Гэрэл	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.514	t	89000078	t
f8ae3f71-1cd6-48d6-a284-7a1fb0c10bbc	user79@example.com	У. Болд	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.517	t	89000079	t
aa8da7ec-2f27-4c30-9922-cd5ba3868a88	user80@example.com	Д. Болд	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.525	t	89000080	t
66b54a53-2df6-45e3-823c-98058f334723	user81@example.com	Б. Баяр	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.528	t	89000081	t
0cc861e9-8265-4c8d-a7d6-a6fc73cc2347	user82@example.com	Г. Тулга	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.535	t	89000082	t
783270c4-592d-4d10-a930-951990b1b5a5	user83@example.com	С. Бат	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.539	t	89000083	t
913ce84a-d1d0-49d7-b6b2-a2068a05baf2	user84@example.com	А. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.547	t	89000084	t
324192c3-c5a5-4642-aa5a-2a6d8ad11353	user85@example.com	Т. Эрдэнэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.552	t	89000085	t
8784dc9e-4718-410b-9917-fa223c021e98	user86@example.com	М. Сүх	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.561	t	89000086	t
79d75ca4-c70b-4235-99ea-f33f7c821e2d	user87@example.com	Л. Цэцэг	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.564	t	89000087	t
91107449-2c70-4994-b589-a0b091750764	user88@example.com	Ж. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.572	t	89000088	t
d04d0171-4ec5-4c2e-8ac7-1b5baf5fe021	user89@example.com	У. Эрдэнэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.576	t	89000089	t
0d2810b1-f34f-4473-9956-640f1835b70b	user90@example.com	Д. Болд	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.584	t	89000090	t
907aa2ad-1432-4689-bc36-7fe49dabe170	user91@example.com	Б. Болд	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.587	t	89000091	t
4a48d314-45a9-4887-bdd8-ce5286f7b972	user92@example.com	Г. Сүх	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.595	t	89000092	t
3716b2a4-202c-4670-bcff-972d9e9103c4	user93@example.com	С. Бат	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.599	t	89000093	t
0e058dfe-f709-4e1f-8a50-2a5da837a615	user94@example.com	А. Алтан	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.607	t	89000094	t
e20de5cf-76f0-47f9-bf8c-c8b544911786	user95@example.com	Т. Эрдэнэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.61	t	89000095	t
f8d8c5b7-a0ee-469e-a2a1-a6a8717ea6f0	user96@example.com	М. Сүх	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.619	t	89000096	t
ac976ac2-7ab4-4f82-89f7-07f8ae4183e9	user97@example.com	Л. Эрдэнэ	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.622	t	89000097	t
794ad7fd-f8ed-46c8-be04-87dc63c0bae4	user98@example.com	Ж. Наран	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.63	t	89000098	t
8fc7dd1c-2ca6-4e39-98b0-98d010ab8026	user99@example.com	У. Бат	FREELANCER	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.633	t	89000099	t
29c63e57-c82a-4ed0-9c29-96b898ac26a4	user100@example.com	Д. Бат	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 21:21:20.641	t	89000100	t
dfbdc6f0-fde2-4c6a-9885-b7dadc5817fb	techstore@example.com	TechStore LLC	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-16 20:48:02.333	t	88112233	t
df40c3f7-dd63-462b-b212-6e38f2a062a7	hr@example.com	HR Manager	CLIENT	t	$2b$10$p7IPkC8np.knIxkeyMI5fe.0.WXpMTnAhCcc7u4sKzxoPtGj6mza.	2026-04-22 22:00:57.349	t	88998899	t
\.


--
-- Data for Name: VerificationCode; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VerificationCode" (id, user_id, code, type, "expiresAt", used, "createdAt") FROM stdin;
a4e64392-43f9-4bfe-bb19-51949930da4f	c9bf3a57-c929-4751-8707-36324aec12e5	540008	EMAIL	2026-04-16 21:04:16.859	t	2026-04-16 20:54:16.879
9483368e-4545-473e-91c0-0d6feb4f2369	c9bf3a57-c929-4751-8707-36324aec12e5	180565	PHONE	2026-04-16 21:04:16.883	t	2026-04-16 20:54:16.886
bea53937-2da4-4aa8-bf7c-bd67de722371	33ef48b9-9c68-44a8-93b2-6087dcefa9f4	868704	EMAIL	2026-04-16 21:11:06.582	t	2026-04-16 21:01:06.592
ad4272ec-554e-4352-b262-2ea0116552fc	33ef48b9-9c68-44a8-93b2-6087dcefa9f4	373829	PHONE	2026-04-16 21:11:06.593	t	2026-04-16 21:01:06.595
\.


--
-- Data for Name: _JobToSkill; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."_JobToSkill" ("A", "B") FROM stdin;
5c7b1a44-89a3-45c4-b696-426c4cebc3d5	a924178d-255a-47a3-b63b-2fcada066c5b
5c7b1a44-89a3-45c4-b696-426c4cebc3d5	1f022262-9e5f-4ec8-8e29-caae4179d166
5c7b1a44-89a3-45c4-b696-426c4cebc3d5	f46f3d3f-0caf-42a2-8f0c-84ceef5e48d7
5c7b1a44-89a3-45c4-b696-426c4cebc3d5	57a68bdd-a27a-4b8e-82b0-36cb636028a6
902db69a-b778-43ee-baff-bc08ba510d2b	9f2fa39a-7306-4f22-bf73-14a0b09a7d3a
902db69a-b778-43ee-baff-bc08ba510d2b	a897c00c-c5c5-4757-810a-6d02f609c12c
e0892618-c1b2-4fb3-a0ee-1268a7bda836	28eaab56-fd32-47c1-b872-7a88390c105f
e0892618-c1b2-4fb3-a0ee-1268a7bda836	497020d5-87d6-4bb4-92c9-3386e6c457b8
e0892618-c1b2-4fb3-a0ee-1268a7bda836	04c64ce1-3a99-4054-9a56-1af5a89db8ac
9efdca1f-0a98-49de-abd0-e4c9ec985cb8	17a09a3d-cbab-4f1f-aaac-8b6fe10c0515
9efdca1f-0a98-49de-abd0-e4c9ec985cb8	87c3f5fc-6871-4061-827b-0d1c6c7193d5
9efdca1f-0a98-49de-abd0-e4c9ec985cb8	7abe5d77-156e-430b-8a75-40c49704eebc
9efdca1f-0a98-49de-abd0-e4c9ec985cb8	409e8ddf-5ed1-4acc-a203-66996baee3f9
7d6c7313-81aa-4a4b-9a45-da06bb248473	5ad36810-3926-4655-b4a0-1fc6d6037ac2
7d6c7313-81aa-4a4b-9a45-da06bb248473	55175b7f-8f8b-4438-940a-6d42b4835e2d
75b6667f-9361-4b3a-bcfc-41121ce32bbc	494854c4-9d7e-4c30-87f8-65a889313333
75b6667f-9361-4b3a-bcfc-41121ce32bbc	394a650b-8fd8-4b3d-8712-cf3caa1f7c23
75b6667f-9361-4b3a-bcfc-41121ce32bbc	f79cd226-18f2-4ae6-9465-001c04333719
a252be32-b369-49f3-94c6-d0d72227f3c1	162cd535-37db-40ac-9cdf-e9f6e6cde3e2
a252be32-b369-49f3-94c6-d0d72227f3c1	b6391643-b40d-4bcd-9e9c-9b3d2e356bc0
a252be32-b369-49f3-94c6-d0d72227f3c1	35952e9b-8522-4f18-ad3a-afdfda7dc35c
a252be32-b369-49f3-94c6-d0d72227f3c1	f15cdd72-dfe3-4cfa-8d75-ca66cb4de435
4fd4bc11-c097-48b2-86b7-ffb56b2ca401	df1f1cbb-d4ef-4b57-a2f4-c9a3e0b00ee9
4fd4bc11-c097-48b2-86b7-ffb56b2ca401	6b50e9f5-5548-484d-a529-183701be16cb
0741a6b3-0c78-4ba5-a019-07bfcd70b2b5	092e056a-a6d0-423e-857d-2064d074ec93
0741a6b3-0c78-4ba5-a019-07bfcd70b2b5	f126c619-79bd-4eb7-80c7-bcf9cf49f2e3
0741a6b3-0c78-4ba5-a019-07bfcd70b2b5	2b28dbfc-8ae8-43e3-9450-b429fa0a6dac
7a419bad-40e0-40e1-85ee-ec1e3f08fd27	134dc1fb-83d2-4fd0-ba40-db875dde8c2f
7a419bad-40e0-40e1-85ee-ec1e3f08fd27	a5307fe9-4486-4903-a90b-d84f3e0e45ef
7a419bad-40e0-40e1-85ee-ec1e3f08fd27	ccd5b0f2-c163-460b-b566-41d8a992d858
7a419bad-40e0-40e1-85ee-ec1e3f08fd27	50b4ebc8-e5e9-43bd-8bc4-0f93338d8bb2
352e533d-3384-4fc1-8479-d4d7db0b0995	54e0432c-7d78-462b-9d67-bede4570d1a5
352e533d-3384-4fc1-8479-d4d7db0b0995	f3aa8f89-1b03-4704-ba3d-61d723cd2ba3
8bbf0557-92d3-4daa-8f0e-46e475f8f73a	79fec253-6d91-40e5-9c82-6c1b89e7c653
8bbf0557-92d3-4daa-8f0e-46e475f8f73a	b64d706d-5fda-413d-98b2-2d30b384a723
8bbf0557-92d3-4daa-8f0e-46e475f8f73a	d6e9c68b-bad6-4b41-a124-a946f3e95a90
b2560402-d017-43ee-9f5c-856dae3c2edd	3b20f71b-51ed-454e-8fc4-b4fd77d8dc63
b2560402-d017-43ee-9f5c-856dae3c2edd	85d17582-485c-4314-9bc7-0e79bd477f28
b2560402-d017-43ee-9f5c-856dae3c2edd	e858b0be-54d7-44a2-bc33-7e3563177ead
b2560402-d017-43ee-9f5c-856dae3c2edd	c2302bf9-1294-479e-835e-074719494f6f
40f7d715-ae0e-4ee4-a0c9-3db945575ff1	1b92c5da-1a14-4f1d-84bb-9cc4ba3f5b3d
40f7d715-ae0e-4ee4-a0c9-3db945575ff1	cf4559f9-ae62-496d-9c0e-abb60c78a117
58a1aa8b-a54e-48e3-bc59-147896bb76a8	3ee4c7bc-6c33-4d90-aeaa-234b8e4bbb91
58a1aa8b-a54e-48e3-bc59-147896bb76a8	b22fee63-a3fe-45e1-9b97-6bd9072a476d
58a1aa8b-a54e-48e3-bc59-147896bb76a8	42eb8f6e-1b70-4ab6-8f7c-41828bc24892
fdb47a53-6aff-461b-a92f-d0e693225ad3	58b2f127-f8ad-4da4-a9aa-c9095ea75654
fdb47a53-6aff-461b-a92f-d0e693225ad3	0dff5667-822e-4975-84cb-6a4d896b3807
fdb47a53-6aff-461b-a92f-d0e693225ad3	14319140-965d-4d8f-b127-a1d4276f5fb3
fdb47a53-6aff-461b-a92f-d0e693225ad3	d70a2749-6f34-4952-a036-51909b30ad83
5053aee3-391c-4f25-a610-c5cb8462da74	ac4987bc-a278-4970-9003-0f89d5d87bf1
5053aee3-391c-4f25-a610-c5cb8462da74	abf6a284-934c-4b8e-babb-aeda572f0060
bb5cd558-f08f-431f-980b-572869828289	5b268373-20d4-426b-a7b3-6c6ca6c734c3
bb5cd558-f08f-431f-980b-572869828289	7eabc923-ade5-4d35-866a-d9f30f404a10
bb5cd558-f08f-431f-980b-572869828289	02b43d5f-0352-47cb-9842-5482efafbe5b
38d0557b-46a9-44eb-9f92-a15ec6c78d3c	a5d74f2f-785e-4b5e-9923-1560f206e7e6
38d0557b-46a9-44eb-9f92-a15ec6c78d3c	58756b23-051b-4edb-827c-0ba43dd9d52d
38d0557b-46a9-44eb-9f92-a15ec6c78d3c	4c9518d2-e8ab-4e25-9ee2-6efdedfa28c3
c7f78df7-d544-499a-b53e-609b58447d71	c9477d97-80dd-48d1-b49f-1cf55fd1e644
c7f78df7-d544-499a-b53e-609b58447d71	4c9518d2-e8ab-4e25-9ee2-6efdedfa28c3
eb1732fc-9260-470d-939c-c3d44118d3f1	8fef30e9-ee6b-42a9-9d43-2258755ba7d2
eb1732fc-9260-470d-939c-c3d44118d3f1	51b5f9c7-6ae7-4d57-bb22-9c307817c3c3
eb1732fc-9260-470d-939c-c3d44118d3f1	10cdefd1-2bf9-4b72-8549-66b49723433a
eb1732fc-9260-470d-939c-c3d44118d3f1	bbe0ee3a-2dbb-499f-8088-ecd5c305daa4
4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	23e07b13-3d4b-4899-8337-860c59c2e3b3
4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	7cd58920-b3ed-44bc-8643-0854c7eed352
4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	3309380a-4a61-400b-8a07-b6082c45f012
4aea54ca-92e6-4fe7-b7c8-2daaf0ee48f4	b20f425c-4304-483e-8076-74af721024d8
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
712a727a-b193-4482-8d40-00e9471492e6	0c3f51cb9f5b5505e67350ff9f4b83fc7e93d25c3a54508668990a21493ee29b	2026-04-17 04:38:11.862328+08	20260416023415_init	\N	\N	2026-04-17 04:38:11.821937+08	1
ed8f30da-bb05-4281-8003-dde2c5601085	3b0dbf7ae4aec58e93d53280e0d6eb0b8b26f7328bff8d935a60d741f7e0c6ce	2026-04-17 04:38:11.8654+08	20260416024006_add_password	\N	\N	2026-04-17 04:38:11.86315+08	1
fc691157-f75e-441e-baed-705b0089f31e	8dff84219d982b6e9f5e8424ca7f27a844c6b136239c1b33fa5e115e1549be7d	2026-04-17 04:38:11.870519+08	20260416074601_add_job_table	\N	\N	2026-04-17 04:38:11.865932+08	1
87e56b6d-301f-47da-ab72-8be10f17b53b	1577db42e57b8009947608d40a9d6cb0653dcd2edea966ba2c7ed2e4ba8f2e98	2026-04-17 04:39:11.843081+08	20260416203911_add_verification_and_phone	\N	\N	2026-04-17 04:39:11.82682+08	1
\.


--
-- Name: AIRecommendation AIRecommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIRecommendation"
    ADD CONSTRAINT "AIRecommendation_pkey" PRIMARY KEY (id);


--
-- Name: ClientProfile ClientProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientProfile"
    ADD CONSTRAINT "ClientProfile_pkey" PRIMARY KEY (id);


--
-- Name: Contract Contract_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_pkey" PRIMARY KEY (id);


--
-- Name: FreelancerProfile FreelancerProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FreelancerProfile"
    ADD CONSTRAINT "FreelancerProfile_pkey" PRIMARY KEY (id);


--
-- Name: FreelancerSkill FreelancerSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FreelancerSkill"
    ADD CONSTRAINT "FreelancerSkill_pkey" PRIMARY KEY (freelancer_id, skill_id);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Milestone Milestone_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Milestone"
    ADD CONSTRAINT "Milestone_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Proposal Proposal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Proposal"
    ADD CONSTRAINT "Proposal_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VerificationCode VerificationCode_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VerificationCode"
    ADD CONSTRAINT "VerificationCode_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AIRecommendation_freelancer_id_match_score_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AIRecommendation_freelancer_id_match_score_idx" ON public."AIRecommendation" USING btree (freelancer_id, match_score);


--
-- Name: AIRecommendation_job_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AIRecommendation_job_id_idx" ON public."AIRecommendation" USING btree (job_id);


--
-- Name: ClientProfile_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ClientProfile_user_id_key" ON public."ClientProfile" USING btree (user_id);


--
-- Name: Contract_client_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Contract_client_id_idx" ON public."Contract" USING btree (client_id);


--
-- Name: Contract_freelancer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Contract_freelancer_id_idx" ON public."Contract" USING btree (freelancer_id);


--
-- Name: Contract_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Contract_status_idx" ON public."Contract" USING btree (status);


--
-- Name: FreelancerProfile_availability_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FreelancerProfile_availability_idx" ON public."FreelancerProfile" USING btree (availability);


--
-- Name: FreelancerProfile_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "FreelancerProfile_user_id_key" ON public."FreelancerProfile" USING btree (user_id);


--
-- Name: Job_client_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Job_client_id_idx" ON public."Job" USING btree (client_id);


--
-- Name: Job_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Job_status_createdAt_idx" ON public."Job" USING btree (status, "createdAt");


--
-- Name: Job_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Job_status_idx" ON public."Job" USING btree (status);


--
-- Name: Notification_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_user_id_idx" ON public."Notification" USING btree (user_id);


--
-- Name: Notification_user_id_is_read_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_user_id_is_read_idx" ON public."Notification" USING btree (user_id, is_read);


--
-- Name: Proposal_freelancer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Proposal_freelancer_id_idx" ON public."Proposal" USING btree (freelancer_id);


--
-- Name: Proposal_job_id_freelancer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Proposal_job_id_freelancer_id_idx" ON public."Proposal" USING btree (job_id, freelancer_id);


--
-- Name: Proposal_job_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Proposal_job_id_idx" ON public."Proposal" USING btree (job_id);


--
-- Name: Proposal_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Proposal_status_idx" ON public."Proposal" USING btree (status);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: VerificationCode_user_id_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "VerificationCode_user_id_type_idx" ON public."VerificationCode" USING btree (user_id, type);


--
-- Name: _JobToSkill_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_JobToSkill_AB_unique" ON public."_JobToSkill" USING btree ("A", "B");


--
-- Name: _JobToSkill_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_JobToSkill_B_index" ON public."_JobToSkill" USING btree ("B");


--
-- Name: AIRecommendation AIRecommendation_freelancer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIRecommendation"
    ADD CONSTRAINT "AIRecommendation_freelancer_id_fkey" FOREIGN KEY (freelancer_id) REFERENCES public."FreelancerProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AIRecommendation AIRecommendation_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIRecommendation"
    ADD CONSTRAINT "AIRecommendation_job_id_fkey" FOREIGN KEY (job_id) REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClientProfile ClientProfile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientProfile"
    ADD CONSTRAINT "ClientProfile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Contract Contract_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public."ClientProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Contract Contract_freelancer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_freelancer_id_fkey" FOREIGN KEY (freelancer_id) REFERENCES public."FreelancerProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Contract Contract_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_job_id_fkey" FOREIGN KEY (job_id) REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FreelancerProfile FreelancerProfile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FreelancerProfile"
    ADD CONSTRAINT "FreelancerProfile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FreelancerSkill FreelancerSkill_freelancer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FreelancerSkill"
    ADD CONSTRAINT "FreelancerSkill_freelancer_id_fkey" FOREIGN KEY (freelancer_id) REFERENCES public."FreelancerProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FreelancerSkill FreelancerSkill_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FreelancerSkill"
    ADD CONSTRAINT "FreelancerSkill_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Job Job_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public."ClientProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_job_id_fkey" FOREIGN KEY (job_id) REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Milestone Milestone_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Milestone"
    ADD CONSTRAINT "Milestone_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_milestone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_milestone_id_fkey" FOREIGN KEY (milestone_id) REFERENCES public."Milestone"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Proposal Proposal_freelancer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Proposal"
    ADD CONSTRAINT "Proposal_freelancer_id_fkey" FOREIGN KEY (freelancer_id) REFERENCES public."FreelancerProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Proposal Proposal_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Proposal"
    ADD CONSTRAINT "Proposal_job_id_fkey" FOREIGN KEY (job_id) REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_reviewer_id_fkey" FOREIGN KEY (reviewer_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VerificationCode VerificationCode_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VerificationCode"
    ADD CONSTRAINT "VerificationCode_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _JobToSkill _JobToSkill_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_JobToSkill"
    ADD CONSTRAINT "_JobToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _JobToSkill _JobToSkill_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_JobToSkill"
    ADD CONSTRAINT "_JobToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict yufuqDqmPMkalNsBzHuZcap01e0XFX4nwJxspTqIfo1HLL8aMWjUe7H6U1RYky7

