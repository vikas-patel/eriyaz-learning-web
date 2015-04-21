define([], function() {
	return [
		// {
		// 		"name": "test",
		// 		"desc": "test",
		// 		"notes": [0, -1,2,-1, 4, -1,5, -1,7,-1, 9,-1, 11, -1,12, -2, 12,-1,11,-1, 9, -1,7, -1,5,-1, -1,4, -1,2, -1,0],
		// 		"noteDuration": 500,
		// 		"breakDuration": 500,
		// 		"midBreakDuration": 1000
		// 	}, 
		{
			"name": "Sa,Re,Ga,..",
			"desc": "Sa,Re,Ga,.. up and reverse",
			"notes": [0, 2, 4, 5, 7, 9, 11, 12, -2, 12, 11, 9, 7, 5, 4, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaSa,ReRe,..",
			"desc": "SaSa,ReRe,.. up and reverse",
			"notes": [0, 0, -1, 2, 2, -1, 4, 4, -1, 5, 5, -1, 7, 7, -1, 9, 9, -1, 11, 11, -1, 12, 12, -2,
				12, 12, -1, 11, 11, -1, 9, 9, -1, 7, 7, -1, 5, 5, -1, 4, 4, -1, 2, 2, -1, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaSaSa,ReReRe,..",
			"desc": "SaSaSa,ReReRe,.. up and reverse",
			"notes": [0, 0, 0, -1, 2, 2, 2, -1, 4, 4, 4, -1, 5, 5, 5, -1, 7, 7, 7, -1, 9, 9, 9, -1, 11, 11, 11, -1, 12, 12, 12, -2,
				12, 12, 12, -1, 11, 11, 11, -1, 9, 9, 9, -1, 7, 7, 7, -1, 5, 5, 5, -1, 4, 4, 4, -1, 2, 2, 2, -1, 0, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "SaRe,ReGa,GaMa,..",
			"desc": "SaRe,ReGa,GaMa,.. up and reverse",
			"notes": [0, 2, -1, 2, 4, -1, 4, 5, -1, 5, 7, -1, 7, 9, -1, 9, 11, -1, 11, 12, -2, 12, 11, -1, 11, 9, -1, 9, 7, -1, 7, 5, -1, 5, 4, -1, 4, 2, -1, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaReSa,ReGaRe,..",
			"desc": "SaReSa,ReGaRe,.. up and reverse",
			"notes": [0, 2, 0, -1, 2, 4, 2, -1, 4, 5, 4, -1, 5, 7, 5, -1, 7, 9, 7, -1, 9, 11, 9, -1, 11, 12, 11, -1, 12, 14, 12, -2,
				12, 14, 12, -1, 11, 12, 11, -1, 9, 11, 9, -1, 7, 9, 7, -1, 5, 7, 5, -1, 4, 5, 4, -1, 2, 4, 2, -1, 0, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "SaSaReReSaSa,ReReGaGaReRe,..",
			"desc": "SaSaReReSaSa,ReReGaGaReRe,.. up and reverse",
			"notes": [0, 0, 2, 2, 0, 0, -1, 2, 2, 4, 4, 2, 2, -1, 4, 4, 5, 5, 4, 4, -1, 5, 5, 7, 7, 5, 5, -1, 7, 7, 9, 9, 7, 7, -1, 9, 9, 11, 11, 9, 9, -1, 11, 11, 12, 12, 11, 11, -1, 12, 12, 14, 14, 12, 12, -2,
				12, 12, 14, 14, 12, 12, -1, 11, 11, 12, 12, 11, 11, -1, 9, 9, 11, 11, 9, 9, -1, 7, 7, 9, 9, 7, 7, -1, 5, 5, 7, 7, 5, 5, -1, 4, 4, 5, 5, 4, 4, -1, 2, 2, 4, 4, 2, 2, -1, 0, 0, 2, 2, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "SaReGa,ReGaMa,..",
			"desc": "SaReGa,ReGaMa,.. up and reverse",
			"notes": [0, 2, 4, -1, 2, 4, 5, -1, 4, 5, 7, -1, 5, 7, 9, -1, 7, 9, 11, -1, 9, 11, 12, -2, 12, 11, 9, -1, 11, 9, 7, -1,
				9, 7, 5, -1, 7, 5, 4, -1, 5, 4, 2, -1, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "SaReGaMa,ReGaMaPa,..",
			"desc": "SaReGaMa,ReGaMaPa,.. up and reverse",
			"notes": [0, 2, 4, 5, -1, 2, 4, 5, 7, -1, 4, 5, 7, 9, -1, 5, 7, 9, 11, -1, 7, 9, 11, 12, -2, 12, 11, 9, 7, -1, 11, 9, 7, 5, -1,
				9, 7, 5, 4, -1, 7, 5, 4, 2, -1, 5, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaGa,ReMa,..",
			"desc": "SaGa,ReMa,.. up and reverse",
			"notes": [0, 4, -1, 2, 5, -1, 4, 7, -1, 5, 9, -1, 7, 11, -1, 9, 12, -2, 12, 9, -1, 11, 7, -1,
				9, 5, -1, 7, 4, -1, 5, 2, -1, 4, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaSaGaGa,ReReMaMa,..",
			"desc": "SaSaGaGa,ReReMaMa,.. up and reverse",
			"notes": [0, 0, 4, 4, -1, 2, 2, 5, 5, -1, 4, 4, 7, 7, -1, 5, 5, 9, 9, -1, 7, 7, 11, 11, -1, 9, 9, 12, 12, -2, 12, 12, 9, 9, -1, 11, 11, 7, 7, -1,
				9, 9, 5, 5, -1, 7, 7, 4, 4, -1, 5, 5, 2, 2, -1, 4, 4, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaMa,RePa,..",
			"desc": "SaMa,RePa,.. up and reverse",
			"notes": [0, 5, -1, 2, 7, -1, 4, 9, -1, 5, 11, -1, 7, 12, -2, 12, 7, -1, 11, 5, -1,
				9, 4, -1, 7, 2, -1, 5, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaSaMaMa,ReRePaPa,..",
			"desc": "SaSaMaMa,ReRePaPa,.. up and reverse",
			"notes": [0, 0, 5, 5, -1, 2, 2, 7, 7, -1, 4, 4, 9, 9, -1, 5, 5, 11, 11, -1, 7, 7, 12, 12, -2, 12, 12, 7, 7, -1, 11, 11, 5, 5, -1,
				9, 9, 4, 4, -1, 7, 7, 2, 2, -1, 5, 5, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaPa,ReDha,..",
			"desc": "SaPa,ReDha,.. up and reverse",
			"notes": [0, 7, -1, 2, 9, -1, 4, 11, -1, 5, 12, -2, 12, 5, -1, 11, 4, -1,
				9, 2, -1, 7, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaSaPaPa,ReReDhaDha,..",
			"desc": "SaSaPaPa,ReReDhaDha,.. up and reverse",
			"notes": [0, 0, 7, 7, -1, 2, 2, 9, 9, -1, 4, 4, 11, 11, -1, 5, 5, 12, 12, -2, 12, 12, 5, 5, -1, 11, 11, 4, 4, -1,
				9, 9, 2, 2, -1, 7, 7, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "Sa'Sa'NiDha,NiNiDhaPa,..",
			"desc": "Sa'Sa'NiDha,NiNiDhaPa,..",
			"notes": [12, 12, 11, 9, -1, 11, 11, 9, 7, -1, 9, 9, 7, 5, -1, 7, 7, 5, 4, -1, 5, 5, 4, 2, -1,
				4, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "SaReGaGaGa,ReGaMaMaMa,..",
			"desc": "SaReGaGaGa,ReGaMaMaMa,.. up and reverse",
			"notes": [0, 2, 4, 4, 4, -1, 2, 4, 5, 5, 5, -1, 4, 5, 7, 7, 7, -1, 5, 7, 9, 9, 9, -1, 7, 9, 11, 11, 11, -1, 9, 11, 12, 12, 12, - 2, 12, 11, 9, 9, 9, -1, 11, 9, 7, 7, 7, -1,
				9, 7, 5, 5, 5, -1, 7, 5, 4, 4, 4, -1, 5, 4, 2, 2, 2, -1, 4, 2, 0, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "SaReSaReGa,ReGaReGaMa,..",
			"desc": "SaReSaReGa,ReGaReGaMa,.. up and reverse",
			"notes": [0, 2, 0, 2, 4, -1, 2, 4, 2, 4, 5, -1, 4, 5, 4, 5, 7, -1, 5, 7, 5, 7, 9, -1, 7, 9, 7, 9, 11, -1, 9, 11, 9, 11, 12, -2, 12, 11, 12, 11, 9, -1, 11, 9, 11, 9, 7, -1,
				9, 7, 9, 7, 5, -1, 7, 5, 7, 5, 4, -1, 5, 4, 5, 4, 2, -1, 4, 2, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "SaReGaSaReGaMa,ReGaMaReGaMaPa,..",
			"desc": "SaReGaSaReGaMa,ReGaMaReGaMaPa,.. up and reverse",
			"notes": [0, 2, 4, 0, 2, 4, 5, -1, 2, 4, 5, 2, 4, 5, 7, -1, 4, 5, 4, 5, 7, -1, 5, 7, 9, 5, 7, 9, 11, -1, 7, 9, 11, 7, 9, 11, 12, -1, -2, 12, 11, 9, 12, 11, 9, 7, -1, 11, 9, 7, 11, 9, 7, 5, -1,
				9, 7, 5, 9, 7, 5, 4, -1, 7, 5, 4, 7, 5, 4, 2, -1, 5, 4, 2, 5, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "Sa..Ni..Sa,Sa..Dha..Sa,.... SaReSa",
			"desc": "Sa..Ni..Sa,Sa..Dha..Sa,.... SaReSa",
			"notes": [
				0, 2, 4, 5, 7, 9, 11, 9, 7, 5, 4, 2, 0, -1,
				0, 2, 4, 5, 7, 9, 7, 5, 4, 2, 0, -1,
				0, 2, 4, 5, 7, 5, 4, 2, 0, -1,
				0, 2, 4, 5, 4, 2, 0, -1,
				0, 2, 4, 2, 0, -1,
				0, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "SaReSa, SaReGaReSa,...,Sa..Ni..Sa",
			"desc": "SaReSa, SaReGaReSa,...,Sa..Ni..Sa",
			"notes": [
				0, 2, 0, -1,
				0, 2, 4, 2, 0, -1,
				0, 2, 4, 5, 4, 2, 0, -1,
				0, 2, 4, 5, 7, 5, 4, 2, 0, -1,
				0, 2, 4, 5, 7, 9, 7, 5, 4, 2, 0, -1,
				0, 2, 4, 5, 7, 9, 11, 9, 7, 5, 4, 2, 0, -1
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "That Bilawal",
			"desc": "That Bilawal up and reverse",
			"notes": [0, 2, 4, 5, 7, 9, 11, 12, -2, 12, 11, 9, 7, 5, 4, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Kafi",
			"desc": "That Kafi up and reverse",
			"notes": [0, 2, 3, 5, 7, 9, 10, 12, -2, 12, 10, 9, 7, 5, 3, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Bairavi",
			"desc": "That Bairavi up and reverse",
			"notes": [0, 1, 3, 5, 7, 8, 10, 12, -2, 12, 10, 8, 7, 5, 3, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Kalyan",
			"desc": "That Kalyan up and reverse",
			"notes": [0, 2, 4, 6, 7, 9, 11, 12, -2, 12, 11, 9, 7, 6, 4, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Khamaj",
			"desc": "That Khamaj up and reverse",
			"notes": [0, 2, 4, 5, 7, 9, 10, 12, -2, 12, 10, 9, 7, 5, 4, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Asavari",
			"desc": "That Asavari up and reverse",
			"notes": [0, 2, 3, 5, 7, 8, 10, 12, -2, 12, 10, 8, 7, 5, 3, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Bhairav",
			"desc": "That Bhairav up and reverse",
			"notes": [0, 1, 4, 5, 7, 8, 11, 12, -2, 12, 11, 8, 7, 5, 4, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Marva",
			"desc": "That Marva up and reverse",
			"notes": [0, 1, 4, 6, 7, 9, 11, 12, -2, 12, 11, 9, 7, 6, 4, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Purvi",
			"desc": "That Purvi up and reverse",
			"notes": [0, 1, 4, 6, 7, 8, 11, 12, -2, 12, 11, 8, 7, 6, 4, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Todi",
			"desc": "That Todi up and reverse",
			"notes": [0, 1, 3, 6, 7, 8, 11, 12, -2, 12, 11, 8, 7, 6, 3, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}
	];
});