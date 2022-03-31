--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-03-31 19:46:23

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 16419)
-- Name: containers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.containers (
    "ID" integer NOT NULL,
    "Type" character varying NOT NULL,
    "Capacity" integer NOT NULL,
    "Part1" character varying NOT NULL,
    "Part2" character varying NOT NULL,
    "Part3" character varying NOT NULL,
    "Part4" character varying NOT NULL,
    "Stock" integer NOT NULL,
    "Monetary_value" double precision NOT NULL,
    "Last_updated" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.containers OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16596)
-- Name: containers_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.containers ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."containers_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 213 (class 1259 OID 16552)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    "ID" integer NOT NULL,
    "Name" character varying NOT NULL,
    "Address" character varying NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16620)
-- Name: customers_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customers ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."customers_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 211 (class 1259 OID 16450)
-- Name: delivery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery (
    "ID" integer NOT NULL,
    "Customer_ID" integer NOT NULL,
    "Release_date" date NOT NULL,
    "Container_type" integer NOT NULL,
    "Seal" character varying NOT NULL,
    "Serial_number" numeric NOT NULL,
    "Document_number" numeric NOT NULL,
    "Production_date" date NOT NULL,
    "Valid" date NOT NULL,
    "Comment" character varying
);


ALTER TABLE public.delivery OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16598)
-- Name: delivery_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.delivery ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."delivery_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 214 (class 1259 OID 16578)
-- Name: freight; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.freight (
    "ID" integer NOT NULL,
    "Order_date" date NOT NULL,
    "Transport_date" date NOT NULL
);


ALTER TABLE public.freight OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16599)
-- Name: freight_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.freight ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."freight_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 210 (class 1259 OID 16436)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    "ID" integer NOT NULL,
    "Containers_ID" integer NOT NULL,
    "Ordered_quantity" integer NOT NULL,
    "Revenue_quantity" integer NOT NULL,
    "Monetary_value" double precision NOT NULL,
    "Status" character varying NOT NULL,
    "Freight_ID" integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16600)
-- Name: orders_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.orders ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."orders_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 212 (class 1259 OID 16466)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    "ID" integer NOT NULL,
    "Name" character varying NOT NULL,
    "Email" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "Status" character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16594)
-- Name: users_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."users_ID_seq"
    START WITH 3
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3349 (class 0 OID 16419)
-- Dependencies: 209
-- Data for Name: containers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.containers ("ID", "Type", "Capacity", "Part1", "Part2", "Part3", "Part4", "Stock", "Monetary_value", "Last_updated") FROM stdin;
1	S	1000	PE	N/A	150	F50	67	127	2022-03-31 15:14:53.757577
2	S	1000	PE	N/A	150	A50	0	129	2022-03-31 15:15:50.471842
6	UN	1000	PE	DAE	150	F50	44	139	2022-03-31 15:30:45.638254
7	UN	1000	PE	DAE	150	A50	23	144	2022-03-31 15:30:54.875479
10	UN EX	1000	PE	DAE	150	F50	94	170	2022-03-31 15:31:19.995849
11	UN EX	1000	PE	DAE	150	A50	0	174	2022-03-31 15:31:35.855291
12	UN EX	1000	PE	DAE	225	F50	0	169	2022-03-31 15:31:45.483293
13	UN EX	1000	PE	DAE	225	A50	0	174	2022-03-31 15:31:52.729575
14	S	800	PE	N/A	150	F50	0	126	2022-03-31 15:32:01.760752
15	UN	800	PE	N/A	150	F50	1	126	2022-03-31 15:32:10.812448
16	S	600	PE	N/A	150	F50	0	116	2022-03-31 15:32:19.626282
17	S	600	PE	N/A	150	A50	0	122	2022-03-31 15:32:26.663425
18	S	600	PE	N/A	225	F50	30	118	2022-03-31 15:32:33.764364
19	S	600	PE	N/A	225	A50	0	122	2022-03-31 15:32:40.520875
20	UN	600	PE	N/A	150	F50	10	124	2022-03-31 15:32:47.152287
21	UN	600	PE	N/A	150	A50	15	129	2022-03-31 15:32:54.894849
22	S	300	PE	N/A	150	F50	0	74	2022-03-31 15:33:00.912984
23	UN	300	PE	N/A	150	F50	27	74	2022-03-31 15:33:07.19545
3	S	1000	PE	N/A	225	F50	0	126.5	2022-03-31 15:45:09.364339
4	S	1000	PE	N/A	225	A50	0	131.5	2022-03-31 15:45:58.631491
8	UN	1000	PE	DAE	225	F50	0	147.4	2022-03-31 15:46:42.663555
9	UN	1000	PE	DAE	225	A50	10	152.4	2022-03-31 15:47:05.07724
5	S	1000	PE	N/A	400	F50	20	138.5	2022-03-31 15:49:01.667947
\.


--
-- TOC entry 3353 (class 0 OID 16552)
-- Dependencies: 213
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers ("ID", "Name", "Address") FROM stdin;
1	6 aN Kft.	2141 Csömör, Mező utca 29.
2	ÁGO-Team Szövetkezet	3013 Ecséd, Akácfa utca 91.
3	Akker-Plus Kft.	6200 Kiskőrös, Dózsa György út 67.
4	Alcufer Kft.	9023 Győr, Mészáros Lázár u. 13.
5	Alina Tent Kft.	8360 Keszthely, Deák Ferenc u. 63/B.
6	Álom-Kép Kft.	2230 Gyömrő, Eskü utca 1.
7	Aqualic Bt.	2220 Vecsés, Széchenyi utca 43/2.
8	Aranykapu Zrt.	6413 Kunfehértó, IV. körzet 6.
9	ARBURG Hungaria Kft.	1097 Budapest, Illatos utca 38.
10	Assisi Szent Ferenc Cserkész Alapítvány	1142 Bp., Szőnyi út 29.
11	Atlox Pack Kft.	1097 Bp., Illatos utca
12	ATTIK Építőipari Kft.	1172 Bp., Ananász u. 28.
13	Autó-Mobil Vegyi Kft.	6727 Szeged, Acél utca 27/C.
14	Axiál Kft.	6500 Baja, Szegedi út 147.
15	Bábolna Brojler Kft.	2943 Bábolna, Radnóti Miklós utca 16.
16	Bachus International Transport Kft.	1078 Budapest, Rottenbiller u. 44.
17	Bajavíz Kft.	6500 Baja, Mártonszállási út 81.
18	Bekomold kft.	1037. Bp. Bojtár u. 74.
19	BIO-VET Kft.	1045 Bp., Berlini út 47-49.
20	BM OKF GEK	1149 Budapest, Mogyoródi út 43.
21	Bomarket Kft.	6000 Kecskemét, Talfája utca 304.
22	Brainaction Kft.	2085 Pilisvörösvár, Mandula utca 39.
23	BVN Növényvédő Kft.	1097 Bp., Illatos út 19-23.
24	Capriovus Kft.	2317 Szigetcsép, Dunasor hrsz 073/72.
25	Cembrit Kft.	2536 Nyegesújfalu, Bécsi út 7.
26	CEVA-Phylaxia Zrt.	1107. Bp. Szállás u. 5.
27	Chinoin Zrt.	1045 Budapest, Tó utca 1-5.
28	Cloud Network Technology Kft.	2900. Komárom, Bánki Donát u. 1.
29	CNI Kft.	3580 Tiszaújváros, 2092/3Hrsz.
30	Columbus Mckinnon Hungary Kft.	8000 Székesfehérvár, Vásárhelyi u.5.
31	Compact Car Kft.	1063. Bp. Szinnyei M. u. 10.
32	Cosminfinity S.R.O.	945 01 Szlovákia Komárno, Senny trh 3116/7.
33	CSC Jáklekémia Hungária Kft.	8111 Seregélyes, Jánosmajor hrsz 025/58/A.
34	Csókási Nándor Őstermelő	6913 Csanádpalota, Délibáb utca 23.
35	Derby-Túr Kft.	5400 Mezőtúr, Széchenyi út 24.
36	Derigo Kft.	6725 Szeged, Moszkvai körút 23.
37	DHJ Építő Kft.	3526 Miskolc, Mechatronicai park 14.
38	Donauchem Kft.	1225 Budapest, Bányalég utca 37-43.
39	Döhler Hungary Kft.	4562 Vaja,Rohodi út 2.
40	Dr. Gönczi Bertalan E.V.	1165 Bp., Aranyfűrt utca 4.
41	Duna Aszfalt Zrt.	6060 Tiszakécske, Béke utca 150.
42	Dunamenti Erőmű Zrt.	2440 Százhalombatta, Erőmű út 2.
43	Duomax Kft.	1032 Bp., Ágoston utca 6.
44	ECHO-Sprint Kft.	7300 Komló, Tröszt utca 4.
45	EGIS Gyógyszergyár Zrt.	1106 Budapest, Keresztúri út 30-38.
46	Elek Tibor	6136 Tank, Kiszsombosdülő tanya 75.
47	Elszer Bt.	4400 Nyíregyháza, Váczi Mihály u.14.
48	Energo Film Kft.	1151 Budapest, Lenvirág u. 19.
49	ENEXIO Hungary Zrt.	1117 Bp., Irinyi János u. 4-20.
50	Ermico Kft.	1152 Budapest, Szentmihályi utca 137.
51	EUROAPI Hungary Kft.	1045 Budapest, Tó utca 1-5.
52	Fa-Forg-Tech Hungária Kft.	3989 Mikóháza, Rákóczi utca 2.
53	Farkas Szerviztechnika Kft	8600 Siófok, Kele u. 116.
54	Farmnetwork.hu Kft.	1011 Budapest, Hunyadi János út 11.
55	Filmbusz Kft.	1194 Bp., Pákozd utca 9.
56	FLAVORCHEM Europe Kft.	2144 Kerepes, Vasút u. 42
57	F-Team 2001 Kft.	5100 Jászberény, Jókai Mór utca 18/A.
58	Fugro Consult Kft.	1115 Budapest, Kelenföldi utca 2.
59	Garden-System Kft.	2143 Kistarcsa, Móra Ferenc utca 87.
60	Geoinform Kft.	5000 Szolnok, Kőrösi út 43.
61	GEOVOL Kft.	8451 Ajka, Padragi utca 280.
62	G-Híd Kft.	1138 Bp., Karikás Frigyes utca 20.
63	Gia Hungária Kft.	1165 Bp., Újszász utca 45/B/z.
64	Gropad Food Kft.	1164 Budapest, Takács utca 13.
65	GST Generál Kft.	1223 Bp., Nagytétényi út 190.
66	GSZ Minőség Kft.	1033 Budapest, Miklós utca 13.
67	Gyógynövénykutató Intézet Kft.	2011 Budakalász, Lupaszigeti út 4.
68	Gyurcsikné Molnár Noémi E.V.	6725 Szeged, Bem u. 13.
69	Halimbár Kft.	8452 Halimba, Dózsa György u. 45.
70	Hans Pausch Hungária Kft.	8718 Tapsony, Zrínyi utca 20.
71	HGA Biomed Gyógyszergyártó Kft.	7400 Kaposvár, Jutai út 50.
72	HGD FOOD Kft.	2100 Gödöllő, Galamb utca 1.
73	Holofon Zrt.	2086 Tinnye, Perbáli út 2.
74	Hungaro Chemicals Kft.	4445 Nagycserkesz, Halmos bokor 6.
75	Hungaro Invest Group Kft.	1149 Bp., Fogarasi u. 17/B.
76	Hungaro Mobiltank Kft.	1013 Budapest, Attila út 2.
77	Hungary Musashi Paint Kft.	2840 Oroszlány, Bokodi út 11.
78	Hunitech Trade Kft.	1141 Bp., Bonyhádi u. 50/B.
79	Hydrocomp Mélyépítő Kft.	8900 Zalaegerszeg, Köztársaság u. 1/A.
80	Ibiden Hungary Kft.	2336 Dunavarsány, Neumann János út 1.
81	Industor Kft.	2051. Biatorbágy, Jókai u. 6.
82	JAGD Hungary Kft.	4031 Debrecen, Szotyori u. 64/5.
83	JO-KÓ PETROL Kft.	6320 SOLT Bokros utca 35.
84	K&P Chem Kft.	1085 Budapest, Kálvin tér 12-13.
85	K&V 94 Bt.	8073 Csákberény, Bajcsy-Zsilinszky utca 6.
86	KALL Ingredients Kft.	5211 Tiszapüspöki, Fehértó part 1.
87	Kárai Trans Kft.	2310 Szigetszentmiklós, Massányi Károly utca 2.
88	Kiss Design BAU Kft.	2315 Szigethalom, Fenyő utca 12.
89	Kludi Szerelvények Kft.	2049 Diósd, Homokbánya út 75.
90	Knipl Kft.	1037 Bp., Remetehegyi út 25.
91	KNOTT-Technik-flex Kft.	2700 Cegléd, Ipari Park 11.
92	Kompel Kft.	1105 Bp., Vaspálya út 20.
93	Kompken Hungary Kft.	1223 Bp., Gyep tér 2.
94	Konténerkút Kft.	1068 Bp., Király utca 80.
95	Kostyál Pálné	2840 Oroszlány, Rákóczi Ferenc u. 73/9.
96	Kovács Imre	6060 Tiszakécske, Hétvezér utca 27.
97	Környezetminőség Kft.	1027 Bp., Bem rakpart 54.
98	Leier Hungária Kft.	3246 Mátraderecske, Baross Gábor u. 51.
99	Lesaffre Magyarország Kft.	1222 Budapest, Gyár utca 5-9.
100	Loacker Hulladékhasznosító Kft.	1095 Budapest, Hídépítő u. 15.
101	Lövőház 2010 Kft.	1022 Budapest, Alvinci út 54.
102	MA-HARD Kft.	6722 Szeged, Gutenberg utca 25-27.
103	MAHART Container Center Szolgáltató Kft.	1211 Budapest, Weiss Manfréd út 5-7.
104	Majoros Kft.	6000 Kecskemét, Halasi utca 29.
105	Manutan Hungária Kft	2040 Budaörs Szabadság utca 117
106	MEDIMPEX Zrt.	1134 Bp. Lehel u. 11.
107	Merkapt Zrt.	1106 Bp., Maglódi út 14/b.
108	Metra Kft.	2310  Szigetszentmiklós, Leshegy u. 10.
109	Millenium-Centrum Kft.	7400 Kaposvár, Dombóvári út 3.
110	Miskolci Sportcentrum Kft.	3515 Miskolc, Egyetem út 2.
111	Monokert Kft.	3794 Boldva, Széchenyi út 12.
112	MVM EGI Zrt.	1117 Bp., Irinyi János u. 4-20.
113	MVM Paksi Atomerőmű Zrt.	7030 Paks, hrsz 8803/17.
114	Naturland Magyarország Kft.	1106 Bp., Csillagvirág út 8.
115	Nemzeti Adó és Vámhivatal	1054 Budapest, Széchenyi utca 2.
116	Neo Szerviz Kft.	1237 Budapest, Meddőhányó utca 1.
117	Neryon Enterprises Kft.	1053 Budapest, Veres Pálné utca 9.
118	Nilfisk Production Kft.	2313 Szigetszentmiklós, hrsz. 12001/76-77.
119	Novochem Kft.	1089 Budapest, Orczy út 6.
120	NT Kft.	6100 Kiskunfélegyháza, VIII.ker 04/94 hrsz.
121	Olajker Kft.	2890 Tata, Zsigmond utca 7.
122	Partner-KOM Bt.	1052 Budapest, Váci utca 23.
123	Pátriapharma Kft.	1097 Budapest, Kén utca 5.
124	Penta Clean Care Kft.	2049 Diósd, Vadrózsa u. 13.
125	Penta Familia Szövetkezet	4445 Nagycserkesz, Vasvári Pál út 2/A.
126	Penta Trade 2003 Kft.	9012 Győr, Öreg utca 16/B.
127	Pro Naturalis Kft.	1147 Bp., Huszt utca 8.
128	Prochema Magyarország Kft.	1092 Bp., Ráday utca 42-44.
129	Profi Lemon Kft.	1112 Bp., Cirmos utca 6.
130	Profirent Gépkölcsönző Kft.	1106 Budapest, Jászberényi út 82/A.
131	PURECO Kft.	1118 Budapest, Rétköz utca 5.
132	Reflex Kft.	1107 Budapest, Száva utca 13-15.
133	Richter Gedeon Nyrt.	1103 Bp., Gyömrői út 19-21.
134	Rockdairy Kft.	5811 Végegyháza, hrsz. 103/4.
135	Salgo Metal Works Kft.	1037 Bp., Kékfestő köz 3.
136	Sanzon Borház Kft.	2161 Csomád, Napsugár utca 4.
137	Scháffer László	5600 Békéscsaba, Hold utca 30.
138	Silvestris & Szilas Kft.	2144 Kerepes Vasút u.42.
139	Silye és Társa LTD.	3368 Boconád, Külterület 069/3 hrsz.
140	Simea Doors Kft.	2051 Biatorbágy, Dámvad utca 50.
141	Soneas Vegyipari Kft.	1225 Budapest, Bányalég utca 47-59.
142	Sóstó-Gyógyfürdők Zrt.	4431 Nyíregyháza-Sóstógyógyfürdő, Szódaház u. 18.
143	Station Film Kft.	1087 Budapest, Kerepesi utca 15.
144	STEEL-VENT Eger Kft.	3300 Eger, Kistályai út 12/b.
145	Strabag AG Magyarországi Fióktelep	1117 Bp., Gábor Dénes utca 2.
146	Számel Zoltán E.V.	3532 Miskolc, Budai Nagy Antal utca 3/1.
147	Szász Belsőépítész Kft.	2045 Törökbálint, Széles utca 17/A.
148	Szendrei Mónika	2030 Érd, Mester utca 58.
149	Szilvási András méhész	Tiszaújváros
150	Szombathelyi Péter  E.V.	6646 Tömörkény, Kossuth Lajos utca 42/1.
151	Takács Lajos őstermelő  E.V.	9722 Perenye, Béke utca 84.
152	Télizöld Kegyeleti Szolgálat Zrt.	1024 Bp., Retek utca 29.
153	Teljes Kör Pincészet Kft.	1024 Bp., Keleti Károly utca 33/B.
154	TEVA Gyógyszergyár Zrt.	4042 Debrecen, Pallagi út 13.
155	Thermo Épgép Kft.	1205 Budapest, Mártirok utca 75.
156	Torna Öko Kft.	8451 Ajka, Padragi utca 280.
157	Trans-Uni Kft.	1024 Bp., Fény utca 15.
158	TRIGO Kft.	6500 Baja, Szabadság út 150.
159	Ultragel Hungary 2000 Kft.	1023 Budapest, Bécsi út 4.
160	Várda-Drink Zrt.	4600 Kisvárda, Temesvári utca 4.
161	Variachem Kft.	1097 Budapest, Kén utca 8.
162	Városgazda XVIII. Ker. Nonprofit Zrt.	1181 Bp., Üllői út 423.
163	Vectigal kft.	1202. Bp. Vécsey u . 31.
164	Verecundus Kft.	2600 Vác, Sirály utca 10.
165	Vishay Hungary Kft.	1047 Budapest, Fóti út 56.
166	Vithalm Tamás	8253 Révfülöp, Fülőpi szőlő 11.
167	VÍZTEC Zrt.	2363 Felsőpakony, Külterület hrsz 013/68
168	Volumix Kft.	7200 Dombóvár, Radnóti utca 3.
169	Vudmaszka Balázs	2800 Tatabánya, Réti út 27.3/2.
170	Webcat Design Bt.	1204 Budapest, Knézits utca 30.
171	Wewalka Kft.	9500 Celldömölk, Pápai út 27.
172	Wirth László Családi gazdálkodó	9740 Szentlőrinc, Mikszáth Kálmán u. 12.
173	Xellia Gyógyszervegyészeti Kft.	1107 Bp., Szállás utca 1-3.
174	Zalakerámia Zrt.	8946 Tófej, Rákóczi u. 44.
175	Zalapack 96 Kft.	8900 Zalaegerszeg, Gazdaság utca 32.
\.


--
-- TOC entry 3351 (class 0 OID 16450)
-- Dependencies: 211
-- Data for Name: delivery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery ("ID", "Customer_ID", "Release_date", "Container_type", "Seal", "Serial_number", "Document_number", "Production_date", "Valid", "Comment") FROM stdin;
1	133	2022-03-28	21	PCP	22006494	1842	2022-01-01	2024-07-01	
2	129	2022-03-28	18	PCP	22006713	1832	2022-01-01	2024-07-01	
3	5	2022-04-28	1	PCP	22004974	1835	2022-01-01	2024-07-01	
\.


--
-- TOC entry 3354 (class 0 OID 16578)
-- Dependencies: 214
-- Data for Name: freight; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.freight ("ID", "Order_date", "Transport_date") FROM stdin;
1	2022-03-31	2022-04-01
2	2022-03-31	2022-04-04
3	2022-03-31	2022-04-06
4	2022-03-27	2022-03-29
5	2022-03-31	2022-06-28
6	2022-03-31	2022-04-13
7	2022-03-31	2022-06-07
8	2022-03-31	2022-04-28
9	2022-03-31	2022-05-16
10	2022-03-31	2022-06-01
\.


--
-- TOC entry 3350 (class 0 OID 16436)
-- Dependencies: 210
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders ("ID", "Containers_ID", "Ordered_quantity", "Revenue_quantity", "Monetary_value", "Status", "Freight_ID") FROM stdin;
1	6	30	0	139	Nyitott	1
10	6	20	0	139	Nyitott	5
19	6	30	0	139	Nyitott	10
17	6	30	0	139	Nyitott	9
2	7	20	0	144	Nyitott	1
11	7	40	0	144	Nyitott	5
18	7	30	0	144	Nyitott	9
20	7	30	0	144	Nyitott	10
3	8	10	0	147.4	Nyitott	1
4	1	60	0	127	Nyitott	2
16	1	60	0	127	Nyitott	8
5	3	12	0	126.5	Nyitott	3
6	10	24	0	170	Nyitott	3
8	10	20	0	170	Nyitott	4
12	10	30	0	170	Nyitott	6
14	10	52	0	170	Nyitott	7
7	11	28	0	174	Nyitott	3
13	11	30	0	174	Nyitott	6
9	21	15	0	129	Nyitott	4
15	21	15	0	129	Nyitott	7
\.


--
-- TOC entry 3352 (class 0 OID 16466)
-- Dependencies: 212
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users ("ID", "Name", "Email", "Password", "Status") FROM stdin;
1	Jakab László	laszlo.jakab@sunstone-rtls.com	probajelszo	Aktív
2	Hajnal Róbert Dávid	trizax350@gmail.com	\\x833ef52cd7d7c92a200ccefb2366b0366de4db404c3110015b54af7c93214922	Aktív
\.


--
-- TOC entry 3366 (class 0 OID 0)
-- Dependencies: 216
-- Name: containers_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."containers_ID_seq"', 23, true);


--
-- TOC entry 3367 (class 0 OID 0)
-- Dependencies: 220
-- Name: customers_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."customers_ID_seq"', 175, true);


--
-- TOC entry 3368 (class 0 OID 0)
-- Dependencies: 217
-- Name: delivery_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."delivery_ID_seq"', 3, true);


--
-- TOC entry 3369 (class 0 OID 0)
-- Dependencies: 218
-- Name: freight_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."freight_ID_seq"', 10, true);


--
-- TOC entry 3370 (class 0 OID 0)
-- Dependencies: 219
-- Name: orders_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."orders_ID_seq"', 20, true);


--
-- TOC entry 3371 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users_ID_seq"', 3, false);


--
-- TOC entry 3191 (class 2606 OID 16425)
-- Name: containers containers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.containers
    ADD CONSTRAINT containers_pkey PRIMARY KEY ("ID");


--
-- TOC entry 3203 (class 2606 OID 16558)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY ("ID");


--
-- TOC entry 3197 (class 2606 OID 16456)
-- Name: delivery delivery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT delivery_pkey PRIMARY KEY ("ID");


--
-- TOC entry 3205 (class 2606 OID 16582)
-- Name: freight freight_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.freight
    ADD CONSTRAINT freight_pkey PRIMARY KEY ("ID");


--
-- TOC entry 3195 (class 2606 OID 16442)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY ("ID");


--
-- TOC entry 3201 (class 2606 OID 16472)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("ID");


--
-- TOC entry 3198 (class 1259 OID 16515)
-- Name: fki_container_type_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_container_type_fkey ON public.delivery USING btree ("Container_type");


--
-- TOC entry 3192 (class 1259 OID 16449)
-- Name: fki_containers_id_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_containers_id_fkey ON public.orders USING btree ("Containers_ID");


--
-- TOC entry 3199 (class 1259 OID 16577)
-- Name: fki_customer_id_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_customer_id_fkey ON public.delivery USING btree ("Customer_ID");


--
-- TOC entry 3193 (class 1259 OID 16590)
-- Name: fki_freight_id_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_freight_id_fkey ON public.orders USING btree ("Freight_ID");


--
-- TOC entry 3208 (class 2606 OID 16510)
-- Name: delivery container_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT container_type_fkey FOREIGN KEY ("Container_type") REFERENCES public.containers("ID") NOT VALID;


--
-- TOC entry 3206 (class 2606 OID 16444)
-- Name: orders containers_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT containers_id_fkey FOREIGN KEY ("Containers_ID") REFERENCES public.containers("ID") NOT VALID;


--
-- TOC entry 3209 (class 2606 OID 16572)
-- Name: delivery customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT customer_id_fkey FOREIGN KEY ("Customer_ID") REFERENCES public.customers("ID") NOT VALID;


--
-- TOC entry 3207 (class 2606 OID 16585)
-- Name: orders freight_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT freight_id_fkey FOREIGN KEY ("Freight_ID") REFERENCES public.freight("ID") NOT VALID;


-- Completed on 2022-03-31 19:46:24

--
-- PostgreSQL database dump complete
--

