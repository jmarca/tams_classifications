const PC = 'PC'
const HHDT = 'HHDT'
const NHHDT = 'NHHDT'



const class_to_hh_nhh = new Map([

    // tier1_class, body_class_name, body_class_id, body_class_group, body_class_group_id, tier2_class
    // MU	20ft Box Container_Semi	41	20ft Container	301	Semi
    [41,HHDT],
    // MU	20ft Container on 40ft Chassis_Semi	42	20ft Container	301	Semi
    [42,HHDT],
    // MU	40ft Box Container Reefer_Semi	43	40ft Container Reefer	303	Semi
    [43,HHDT],
    // MU	40ft Box Container_Semi	44	40ft Container 	302	Semi
    [44,HHDT],
    // MU	53ft Box Container_Semi	45	53ft Container 	304	Semi
    [45,HHDT],
    // MU	Agricultural Van	29	Agricultural Van	401	Multi
    [29,HHDT],
    // MU	Agricultural Van_Semi	46	Agriculture	305	Semi
    [46,HHDT],
    // MU	Automotive Transport_Semi	47	Auto	306	Semi
    [47,HHDT],
    // MU	Basic Platform	30	Platform/Tank	402	Multi
    [30,HHDT],
    // MU	Basic Platform_Semi	48	Platform	307	Semi
    [48,HHDT],
    // MU	Basic Platform_SemiSingle	49	Platform	307	Semi
    [49,HHDT],
    // MU	Beverage_Semi	50	Beverage	308	Semi
    [50,HHDT],
    // MU	Beverage_SemiSingle	51	Beverage	308	Semi
    [51,HHDT],
    // MU	Bottom/Belly Dump	31	Bottom/Belly Dump	403	Multi
    [31,HHDT],
    // MU	Bulk Waste Transport_Semi	52	Bulk Waste	309	Semi
    [52,HHDT],
    // MU	Concrete_Small_lift axle	74	Concrete w/Lift Axle	203	Single
    [74,HHDT],
    // MU	Container Chassis_Semi	53	Container Chassis	310	Semi
    [53,HHDT],
    // MU	Curtainside Van	32	Platform/Tank	402	Multi
    [32,HHDT],
    // MU	Curtainside Van_Semi	54	Platform	307	Semi
    [54,HHDT],
    // MU	Drop Frame Van	33	Van/Platform (Low Chassis)	404	Multi
    [33,HHDT],
    // MU	Drop Frame Van_Semi	55	Drop Frame Van	311	Semi
    [55,HHDT],
    // MU	Drop Frame Van_SemiSingle	56	Drop Frame Van	311	Semi
    [56,HHDT],
    // MU	Dump_Single_End Dump	75	Dump 	204	Single
    [75,HHDT],
    // MU	Dump_Small_Basic Platform	82	Dump w/Trailer	206	Single
    [82,HHDT],
    // MU	Dump_Small_Lift Axle	78	Dump w/Lift Axle	205	Single
    [78,HHDT],
    // MU	Dumpster Transport_Single_End Dump	81	Dump w/Trailer	206	Single
    [81,HHDT],
    // MU	Enclosed Van	34	Enclosed Van	405	Multi
    [34,HHDT],
    // MU	Enclosed Van Reefer_Semi	57	Enclosed Van Reefer (FHWA 9)	312	Semi
    [57,HHDT],
    // MU	Enclosed Van Reefer_SemiSingle	58	Enclosed Van Reefer (FHWA 8)	313	Semi
    [58,HHDT],
    // MU	Enclosed Van_Semi	59	Enclosed Van (FHWA 9)	314	Semi
    [59,HHDT],
    // MU	Enclosed Van_SemiSingle	60	Enclosed Van (FHWA 8)	315	Semi
    [60,HHDT],
    // MU	End Dump	35	End Dump	406	Multi
    [35,HHDT],
    // MU	End Dump_Semi	61	Dump	316	Semi
    [61,HHDT],
    // MU	Hopper	36	Hopper	407	Multi
    [36,HHDT],
    // MU	Livestock_Semi	62	Livestock	317	Semi
    [62,HHDT],
    // MU	Livestock_Single_Livestock	92	Livestock w/Trailer	212	Single
    [92,HHDT],
    // MU	Low Boy Platform	37	Van/Platform (Low Chassis)	404	Multi
    [37,HHDT],
    // MU	Low Boy Platform_Semi	63	Low Boy Platform	318	Semi
    [63,HHDT],
    // MU	Open Top Van	38	Van/Platform (Low Chassis)	404	Multi
    [38,HHDT],
    // MU	Open Top Van_Semi	64	Open Top Van	319	Semi
    [64,HHDT],
    // MU	Pass Vehicle_Small_RV Trailer	77	Passerger Vehicle w/Trailer	200	Single
    [77,HHDT],
    // MU	Pass Vehicle_Small_Small Trailer	76	Passerger Vehicle w/Trailer	200	Single
    [76,HHDT],
    // MU	Pickup/Utility_Small_Basic Platform	70	Pickup/Utility  w/Trailer	201	Single
    [70,HHDT],
    // MU	Pickup/Utility_Small_Livestock	71	Pickup/Utility  w/Trailer	201	Single
    [71,HHDT],
    // MU	Pickup/Utility_Small_RV Trailer	69	Pickup/Utility  w/Trailer	201	Single
    [69,HHDT],
    // MU	Pickup/Utility_Small_Small Trailer	68	Pickup/Utility  w/Trailer	201	Single
    [68,HHDT],
    // MU	Pickup/Utility_Small_Towed Vehicle	72	Pickup/Utility  w/Trailer	201	Single
    [72,HHDT],
    // MU	Platform_Single_Basic Platform	73	Platform w/Trailer	202	Single
    [73,HHDT],
    // MU	Platform_Small_Basic Platform	85	Platform w/Trailer	202	Single
    [85,HHDT],
    // MU	Platform_Small_Small Trailer	79	Platform w/Trailer	202	Single
    [79,HHDT],
    // MU	Pneumatic Tank	39	Platform/Tank	402	Multi
    [39,HHDT],
    // MU	Pneumatic Tank_Semi	65	Tank	320	Semi
    [65,HHDT],
    // MU	Pole/ Logging/ Pipe_Semi	66	Logging	321	Semi
    [66,HHDT],
    // MU	RV_Single_Towed Vehicle	84	RV w/Towed Vehicle	209	Single
    [84,HHDT],
    // MU	RV_Small_Small Trailer	88	RV w/Small Trailer	211	Single
    [88,HHDT],
    // MU	Service_Small_Small Trailer	86	Service w/Trailer	210	Single
    [86,HHDT],
    // MU	Service_Small_Towed Vehicle	89	Service w/Trailer	210	Single
    [89,HHDT],
    // MU	Tank	40	Platform/Tank	402	Multi
    [40,HHDT],
    // MU	Tank_Semi	67	Tank	320	Semi
    [67,HHDT],
    // MU	Tank_Single_Tank	83	Tank w/Trailer	208	Single
    [83,HHDT],
    // MU	Tow Truck_Small_Towed Vehicle	87	Service w/Trailer	210	Single
    [87,HHDT],
    // MU	Van_Single_Towed Vehicle	91	Van w/Trailer	207	Single
    [91,HHDT],
    // MU	Van_Small_Small Trailer	80	Van w/Trailer	207	Single
    [80,HHDT],
    // SU	20ft Bus	2	20ft Bus	102	SU
    [2,NHHDT],
    // SU	30ft Bus	3	30ft Bus	103	SU
    [3,NHHDT],
    // SU	Beverage	4	Beverage	104	SU
    [4,NHHDT],
    // SU	Bobtail	5	Bobtail	105	SU
    [5,NHHDT],
    // SU	Cab Over Van	6	Van/Platform	106	SU
    [6,NHHDT],
    // SU	Concrete	7	Concrete	107	SU
    [7,HHDT],
    // SU	Conv. Van	8	Van/Platform	106	SU
    [8,NHHDT],
    // SU	Crane/Winch	9	Utility/Service	108	SU
    [9,HHDT],
    // SU	Dump_Single	10	Dump/Tank	109	SU
    [10,HHDT],
    // SU	Dump_Tandem	11	Dump/Tank	109	SU
    [11,HHDT],
    // SU	Dump_Triple	12	Dump Triple Rear	110	SU
    [12,HHDT],
    // SU	Dumpster Transport	13	Dump/Tank	109	SU
    [13,HHDT],
    // SU	Firetruck	14	Utility/Service	108	SU
    [14,NHHDT],
    // SU	Garbage	15	Utility/Service	108	SU
    [15,NHHDT],
    // SU	Light Van	16	Van/Platform	106	SU
    [16,NHHDT],
    // SU	Multi-stop van	17	Multi Stop Van/RV	111	SU
    [17,NHHDT],
    // SU	Passenger Vehicle	1	Passenger Vehicle	101	PC
    [1,PC],
    // SU	Platform_0	18	Van/Platform	106	SU
    [18,NHHDT],
    // SU	Platform_1	19	Van/Platform	106	SU
    [19,NHHDT],
    // SU	Platform_2	20	Van/Platform	106	SU
    [20,NHHDT],
    // SU	RV	21	Multi Stop Van/RV	111	SU
    [21,NHHDT],
    // SU	Street Sweeper	22	Street Sweeper	112	SU
    [22,NHHDT],
    // SU	Tank	23	Dump/Tank	109	SU
    [23,HHDT],
    // SU	Tow Truck	24	Utility/Service	108	SU
    [24,NHHDT],
    // SU	Utility_0	25	Utility/Service	108	SU
    [25,NHHDT],
    // SU	Utility_1	26	Utility/Service	108	SU
    [26,NHHDT],
    // SU	Utility_2	27	Utility/Service	108	SU
    [27,NHHDT],
    // SU	Wrecker	28	Utility/Service	108	SU
    [28,HHDT]

])


/**
 * classifier
 *
 * classify the tams body class into heavy heavy, not heavy heavy, and
 * passenger car
 *
 * @param {Object} tams_body_class : object containing results of TAMS
 * classification
 * @param {string} tams_body_class.bc_id : the body class id
 */
function classifier(tams_body_class){
    let result
    if (tams_body_class.bc_id === undefined || tams_body_class.bc_id === null){
        result = PC
    }else{
        result = class_to_hh_nhh.get(tams_body_class.bc_id)
    }
    if(result === undefined){
        throw new Error('undefined body class id: '+tams_body_class.bc_id)
    }
    return result
}

module.exports = classifier
