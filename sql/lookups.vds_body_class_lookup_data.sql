--
-- PostgreSQL database dump
--

-- Dumped from database version 9.1.14
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = lookups, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: vds_body_class_lookup; Type: TABLE; Schema: lookups; Owner: arbtrucks
--

CREATE TABLE vds_body_class_lookup (
    tier1_class character varying(4),
    body_class_name character varying(64),
    body_class_id integer NOT NULL,
    body_class_group character varying(32),
    body_class_group_id integer,
    tier2_class character varying(32)
);


--
-- Data for Name: vds_body_class_lookup; Type: TABLE DATA; Schema: lookups; Owner: arbtrucks
--

COPY vds_body_class_lookup (tier1_class, body_class_name, body_class_id, body_class_group, body_class_group_id, tier2_class) FROM stdin;
MU	Dump_Small_Basic Platform	82	Dump w/Trailer	206	Single
MU	Pickup/Utility_Small_Basic Platform	70	Pickup/Utility  w/Trailer	201	Single
MU	Pass Vehicle_Small_RV Trailer	77	Passerger Vehicle w/Trailer	200	Single
SU	20ft Bus	2	20ft Bus	102	SU
SU	Platform_2	20	Van/Platform	106	SU
MU	Pickup/Utility_Small_Livestock	71	Pickup/Utility  w/Trailer	201	Single
MU	Service_Small_Small Trailer	86	Service w/Trailer	210	Single
MU	Pickup/Utility_Small_Towed Vehicle	72	Pickup/Utility  w/Trailer	201	Single
MU	Service_Small_Towed Vehicle	89	Service w/Trailer	210	Single
MU	Pickup/Utility_Small_RV Trailer	69	Pickup/Utility  w/Trailer	201	Single
SU	Bobtail	5	Bobtail	105	SU
MU	Platform_Single_Basic Platform	73	Platform w/Trailer	202	Single
MU	Platform_Small_Basic Platform	85	Platform w/Trailer	202	Single
SU	Concrete	7	Concrete	107	SU
SU	Conv. Van	8	Van/Platform	106	SU
SU	Crane/Winch	9	Utility/Service	108	SU
SU	Dump_Single	10	Dump/Tank	109	SU
MU	Curtainside Van	32	Platform/Tank	402	Multi
MU	End Dump	35	End Dump	406	Multi
MU	Tank	40	Platform/Tank	402	Multi
SU	Firetruck	14	Utility/Service	108	SU
SU	Dumpster Transport	13	Dump/Tank	109	SU
SU	Garbage	15	Utility/Service	108	SU
SU	Tow Truck	24	Utility/Service	108	SU
SU	Multi-stop van	17	Multi Stop Van/RV	111	SU
SU	Light Van	16	Van/Platform	106	SU
MU	Pass Vehicle_Small_Small Trailer	76	Passerger Vehicle w/Trailer	200	Single
MU	Platform_Small_Small Trailer	79	Platform w/Trailer	202	Single
MU	Tow Truck_Small_Towed Vehicle	87	Service w/Trailer	210	Single
MU	Tank_Single_Tank	83	Tank w/Trailer	208	Single
MU	Livestock_Single_Livestock	92	Livestock w/Trailer	212	Single
MU	20ft Box Container_Semi	41	20ft Container	301	Semi
MU	Agricultural Van	29	Agricultural Van	401	Multi
MU	Pneumatic Tank	39	Platform/Tank	402	Multi
MU	Hopper	36	Hopper	407	Multi
MU	Low Boy Platform	37	Van/Platform (Low Chassis)	404	Multi
MU	Drop Frame Van	33	Van/Platform (Low Chassis)	404	Multi
MU	20ft Container on 40ft Chassis_Semi	42	20ft Container	301	Semi
MU	40ft Box Container_Semi	44	40ft Container 	302	Semi
SU	Utility_0	25	Utility/Service	108	SU
SU	Platform_0	18	Van/Platform	106	SU
SU	Platform_1	19	Van/Platform	106	SU
SU	RV	21	Multi Stop Van/RV	111	SU
SU	Street Sweeper	22	Street Sweeper	112	SU
SU	Tank	23	Dump/Tank	109	SU
SU	Passenger Vehicle	1	Passenger Vehicle	101	PC
SU	Utility_1	26	Utility/Service	108	SU
SU	Utility_2	27	Utility/Service	108	SU
SU	Wrecker	28	Utility/Service	108	SU
MU	Pickup/Utility_Small_Small Trailer	68	Pickup/Utility  w/Trailer	201	Single
SU	Dump_Tandem	11	Dump/Tank	109	SU
SU	Cab Over Van	6	Van/Platform	106	SU
SU	30ft Bus	3	30ft Bus	103	SU
MU	Dump_Single_End Dump	75	Dump 	204	Single
MU	Dump_Small_Lift Axle	78	Dump w/Lift Axle	205	Single
MU	Automotive Transport_Semi	47	Auto	306	Semi
MU	Dumpster Transport_Single_End Dump	81	Dump w/Trailer	206	Single
MU	Concrete_Small_lift axle	74	Concrete w/Lift Axle	203	Single
MU	Van_Single_Towed Vehicle	91	Van w/Trailer	207	Single
MU	Van_Small_Small Trailer	80	Van w/Trailer	207	Single
MU	53ft Box Container_Semi	45	53ft Container 	304	Semi
MU	40ft Box Container Reefer_Semi	43	40ft Container Reefer	303	Semi
MU	Agricultural Van_Semi	46	Agriculture	305	Semi
MU	Basic Platform_Semi	48	Platform	307	Semi
MU	Basic Platform_SemiSingle	49	Platform	307	Semi
MU	Beverage_Semi	50	Beverage	308	Semi
MU	Beverage_SemiSingle	51	Beverage	308	Semi
MU	Bulk Waste Transport_Semi	52	Bulk Waste	309	Semi
MU	End Dump_Semi	61	Dump	316	Semi
MU	Enclosed Van_SemiSingle	60	Enclosed Van (FHWA 8)	315	Semi
MU	Livestock_Semi	62	Livestock	317	Semi
MU	Enclosed Van Reefer_SemiSingle	58	Enclosed Van Reefer (FHWA 8)	313	Semi
MU	Enclosed Van_Semi	59	Enclosed Van (FHWA 9)	314	Semi
MU	Enclosed Van Reefer_Semi	57	Enclosed Van Reefer (FHWA 9)	312	Semi
MU	Drop Frame Van_SemiSingle	56	Drop Frame Van	311	Semi
MU	Open Top Van	38	Van/Platform (Low Chassis)	404	Multi
MU	Enclosed Van	34	Enclosed Van	405	Multi
MU	Low Boy Platform_Semi	63	Low Boy Platform	318	Semi
MU	Open Top Van_Semi	64	Open Top Van	319	Semi
MU	Pneumatic Tank_Semi	65	Tank	320	Semi
MU	Tank_Semi	67	Tank	320	Semi
MU	Pole/ Logging/ Pipe_Semi	66	Logging	321	Semi
MU	Drop Frame Van_Semi	55	Drop Frame Van	311	Semi
MU	Curtainside Van_Semi	54	Platform	307	Semi
MU	Container Chassis_Semi	53	Container Chassis	310	Semi
SU	Beverage	4	Beverage	104	SU
MU	Basic Platform	30	Platform/Tank	402	Multi
SU	Dump_Triple	12	Dump Triple Rear	110	SU
MU	Bottom/Belly Dump	31	Bottom/Belly Dump	403	Multi
MU	RV_Single_Towed Vehicle	84	RV w/Towed Vehicle	209	Single
MU	RV_Small_Small Trailer	88	RV w/Small Trailer	211	Single
\.


--
-- Name: vds_body_class_lookup vds_body_class_lookup_pkey; Type: CONSTRAINT; Schema: lookups; Owner: arbtrucks
--

ALTER TABLE ONLY vds_body_class_lookup
    ADD CONSTRAINT vds_body_class_lookup_pkey PRIMARY KEY (body_class_id);


--
-- PostgreSQL database dump complete
--
