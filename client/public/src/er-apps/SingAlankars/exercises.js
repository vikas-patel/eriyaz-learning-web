define([], function() {
	return [
		// -100 for break & -101 for midBreak.
		// {
		// 		"name": "test",
		// 		"desc": "test",
		// 		"notes": [0, -100,2,-100, 4, -100,5, -100,7,-100, 9,-100, 11, -100,12, -101, 12,-100,11,-100, 9, -100,7, -100,5,-100, -100,4, -100,2, -100,0],
		// 		"noteDuration": 500,
		// 		"breakDuration": 500,
		// 		"midBreakDuration": 1000
		// 	}, 
		{
			"name": "1. Sa,Re,Ga,..",
			"desc": "Sa,Re,Ga,.. up and reverse",
			"notes": [0, 2, 4, 5, 7, 9, 11, 12, -101, 12, 11, 9, 7, 5, 4, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "2. SaSa,ReRe,..",
			"desc": "SaSa,ReRe,.. up and reverse",
			"notes": [0, 0, -100, 2, 2, -100, 4, 4, -100, 5, 5, -100, 7, 7, -100, 9, 9, -100, 11, 11, -100, 12, 12, -101,
				12, 12, -100, 11, 11, -100, 9, 9, -100, 7, 7, -100, 5, 5, -100, 4, 4, -100, 2, 2, -100, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "3. SaSaSa,ReReRe,..",
			"desc": "SaSaSa,ReReRe,.. up and reverse",
			"notes": [0, 0, 0, -100, 2, 2, 2, -100, 4, 4, 4, -100, 5, 5, 5, -100, 7, 7, 7, -100, 9, 9, 9, -100, 11, 11, 11, -100, 12, 12, 12, -101,
				12, 12, 12, -100, 11, 11, 11, -100, 9, 9, 9, -100, 7, 7, 7, -100, 5, 5, 5, -100, 4, 4, 4, -100, 2, 2, 2, -100, 0, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "4. SaRe,ReGa,GaMa,..",
			"desc": "SaRe,ReGa,GaMa,.. up and reverse",
			"notes": [0, 2, -100, 2, 4, -100, 4, 5, -100, 5, 7, -100, 7, 9, -100, 9, 11, -100, 11, 12, -101, 12, 11, -100, 11, 9, -100, 9, 7, -100, 7, 5, -100, 5, 4, -100, 4, 2, -100, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "5. SaReSa,ReGaRe,..",
			"desc": "SaReSa,ReGaRe,.. up and reverse",
			"notes": [0, 2, 0, -100, 2, 4, 2, -100, 4, 5, 4, -100, 5, 7, 5, -100, 7, 9, 7, -100, 9, 11, 9, -100, 11, 12, 11, -100, 12, 14, 12, -101,
				12, 14, 12, -100, 11, 12, 11, -100, 9, 11, 9, -100, 7, 9, 7, -100, 5, 7, 5, -100, 4, 5, 4, -100, 2, 4, 2, -100, 0, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "6. SaSaReReSaSa,ReReGaGaReRe,..",
			"desc": "SaSaReReSaSa,ReReGaGaReRe,.. up and reverse",
			"notes": [0, 0, 2, 2, 0, 0, -100, 2, 2, 4, 4, 2, 2, -100, 4, 4, 5, 5, 4, 4, -100, 5, 5, 7, 7, 5, 5, -100, 7, 7, 9, 9, 7, 7, -100, 9, 9, 11, 11, 9, 9, -100, 11, 11, 12, 12, 11, 11, -100, 12, 12, 14, 14, 12, 12, -101,
				12, 12, 14, 14, 12, 12, -100, 11, 11, 12, 12, 11, 11, -100, 9, 9, 11, 11, 9, 9, -100, 7, 7, 9, 9, 7, 7, -100, 5, 5, 7, 7, 5, 5, -100, 4, 4, 5, 5, 4, 4, -100, 2, 2, 4, 4, 2, 2, -100, 0, 0, 2, 2, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "7. SaReGa,ReGaMa,..",
			"desc": "SaReGa,ReGaMa,.. up and reverse",
			"notes": [0, 2, 4, -100, 2, 4, 5, -100, 4, 5, 7, -100, 5, 7, 9, -100, 7, 9, 11, -100, 9, 11, 12, -101, 12, 11, 9, -100, 11, 9, 7, -100,
				9, 7, 5, -100, 7, 5, 4, -100, 5, 4, 2, -100, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "8. SaReGaMa,ReGaMaPa,..",
			"desc": "SaReGaMa,ReGaMaPa,.. up and reverse",
			"notes": [0, 2, 4, 5, -100, 2, 4, 5, 7, -100, 4, 5, 7, 9, -100, 5, 7, 9, 11, -100, 7, 9, 11, 12, -101, 12, 11, 9, 7, -100, 11, 9, 7, 5, -100,
				9, 7, 5, 4, -100, 7, 5, 4, 2, -100, 5, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "9. SaGa,ReMa,..",
			"desc": "SaGa,ReMa,.. up and reverse",
			"notes": [0, 4, -100, 2, 5, -100, 4, 7, -100, 5, 9, -100, 7, 11, -100, 9, 12, -101, 12, 9, -100, 11, 7, -100,
				9, 5, -100, 7, 4, -100, 5, 2, -100, 4, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "10. SaSaGaGa,ReReMaMa,..",
			"desc": "SaSaGaGa,ReReMaMa,.. up and reverse",
			"notes": [0, 0, 4, 4, -100, 2, 2, 5, 5, -100, 4, 4, 7, 7, -100, 5, 5, 9, 9, -100, 7, 7, 11, 11, -100, 9, 9, 12, 12, -101, 12, 12, 9, 9, -100, 11, 11, 7, 7, -100,
				9, 9, 5, 5, -100, 7, 7, 4, 4, -100, 5, 5, 2, 2, -100, 4, 4, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "11. SaMa,RePa,..",
			"desc": "SaMa,RePa,.. up and reverse",
			"notes": [0, 5, -100, 2, 7, -100, 4, 9, -100, 5, 11, -100, 7, 12, -101, 12, 7, -100, 11, 5, -100,
				9, 4, -100, 7, 2, -100, 5, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "12. SaSaMaMa,ReRePaPa,..",
			"desc": "SaSaMaMa,ReRePaPa,.. up and reverse",
			"notes": [0, 0, 5, 5, -100, 2, 2, 7, 7, -100, 4, 4, 9, 9, -100, 5, 5, 11, 11, -100, 7, 7, 12, 12, -101, 12, 12, 7, 7, -100, 11, 11, 5, 5, -100,
				9, 9, 4, 4, -100, 7, 7, 2, 2, -100, 5, 5, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "13. SaPa,ReDha,..",
			"desc": "SaPa,ReDha,.. up and reverse",
			"notes": [0, 7, -100, 2, 9, -100, 4, 11, -100, 5, 12, -101, 12, 5, -100, 11, 4, -100,
				9, 2, -100, 7, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "14. SaSaPaPa,ReReDhaDha,..",
			"desc": "SaSaPaPa,ReReDhaDha,.. up and reverse",
			"notes": [0, 0, 7, 7, -100, 2, 2, 9, 9, -100, 4, 4, 11, 11, -100, 5, 5, 12, 12, -101, 12, 12, 5, 5, -100, 11, 11, 4, 4, -100,
				9, 9, 2, 2, -100, 7, 7, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "15. Sa'Sa'NiDha,NiNiDhaPa,..",
			"desc": "Sa'Sa'NiDha,NiNiDhaPa,..",
			"notes": [12, 12, 11, 9, -100, 11, 11, 9, 7, -100, 9, 9, 7, 5, -100, 7, 7, 5, 4, -100, 5, 5, 4, 2, -100,
				4, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "16. SaReGaGaGa,ReGaMaMaMa,..",
			"desc": "SaReGaGaGa,ReGaMaMaMa,.. up and reverse",
			"notes": [0, 2, 4, 4, 4, -100, 2, 4, 5, 5, 5, -100, 4, 5, 7, 7, 7, -100, 5, 7, 9, 9, 9, -100, 7, 9, 11, 11, 11, -100, 9, 11, 12, 12, 12, - 2, 12, 11, 9, 9, 9, -100, 11, 9, 7, 7, 7, -100,
				9, 7, 5, 5, 5, -100, 7, 5, 4, 4, 4, -100, 5, 4, 2, 2, 2, -100, 4, 2, 0, 0, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "17. SaReSaReGa,ReGaReGaMa,..",
			"desc": "SaReSaReGa,ReGaReGaMa,.. up and reverse",
			"notes": [0, 2, 0, 2, 4, -100, 2, 4, 2, 4, 5, -100, 4, 5, 4, 5, 7, -100, 5, 7, 5, 7, 9, -100, 7, 9, 7, 9, 11, -100, 9, 11, 9, 11, 12, -101, 12, 11, 12, 11, 9, -100, 11, 9, 11, 9, 7, -100,
				9, 7, 9, 7, 5, -100, 7, 5, 7, 5, 4, -100, 5, 4, 5, 4, 2, -100, 4, 2, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "18. SaReGaSaReGaMa,ReGaMaReGaMaPa,..",
			"desc": "SaReGaSaReGaMa,ReGaMaReGaMaPa,.. up and reverse",
			"notes": [0, 2, 4, 0, 2, 4, 5, -100, 2, 4, 5, 2, 4, 5, 7, -100, 4, 5, 4, 5, 7, -100, 5, 7, 9, 5, 7, 9, 11, -100, 7, 9, 11, 7, 9, 11, 12, -100, -101, 12, 11, 9, 12, 11, 9, 7, -100, 11, 9, 7, 11, 9, 7, 5, -100,
				9, 7, 5, 9, 7, 5, 4, -100, 7, 5, 4, 7, 5, 4, 2, -100, 5, 4, 2, 5, 4, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "19. Sa..Ni..Sa,Sa..Dha..Sa,.... SaReSa",
			"desc": "Sa..Ni..Sa,Sa..Dha..Sa,.... SaReSa",
			"notes": [
				0, 2, 4, 5, 7, 9, 11, 9, 7, 5, 4, 2, 0, -100,
				0, 2, 4, 5, 7, 9, 7, 5, 4, 2, 0, -100,
				0, 2, 4, 5, 7, 5, 4, 2, 0, -100,
				0, 2, 4, 5, 4, 2, 0, -100,
				0, 2, 4, 2, 0, -100,
				0, 2, 0
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "20. SaReSa, SaReGaReSa,...,Sa..Ni..Sa",
			"desc": "SaReSa, SaReGaReSa,...,Sa..Ni..Sa",
			"notes": [
				0, 2, 0, -100,
				0, 2, 4, 2, 0, -100,
				0, 2, 4, 5, 4, 2, 0, -100,
				0, 2, 4, 5, 7, 5, 4, 2, 0, -100,
				0, 2, 4, 5, 7, 9, 7, 5, 4, 2, 0, -100,
				0, 2, 4, 5, 7, 9, 11, 9, 7, 5, 4, 2, 0, -100
			],
			"noteDuration": 1000,
			"breakDuration": 1000,
			"midBreakDuration": 1000
		}, {
			"name": "That Bilawal",
			"desc": "That Bilawal up and reverse",
			"notes": [0, 2, 4, 5, 7, 9, 11, 12, -101, 12, 11, 9, 7, 5, 4, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Kafi",
			"desc": "That Kafi up and reverse",
			"notes": [0, 2, 3, 5, 7, 9, 10, 12, -101, 12, 10, 9, 7, 5, 3, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Bairavi",
			"desc": "That Bairavi up and reverse",
			"notes": [0, 1, 3, 5, 7, 8, 10, 12, -101, 12, 10, 8, 7, 5, 3, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Kalyan",
			"desc": "That Kalyan up and reverse",
			"notes": [0, 2, 4, 6, 7, 9, 11, 12, -101, 12, 11, 9, 7, 6, 4, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Khamaj",
			"desc": "That Khamaj up and reverse",
			"notes": [0, 2, 4, 5, 7, 9, 10, 12, -101, 12, 10, 9, 7, 5, 4, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Asavari",
			"desc": "That Asavari up and reverse",
			"notes": [0, 2, 3, 5, 7, 8, 10, 12, -101, 12, 10, 8, 7, 5, 3, 2, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Bhairav",
			"desc": "That Bhairav up and reverse",
			"notes": [0, 1, 4, 5, 7, 8, 11, 12, -101, 12, 11, 8, 7, 5, 4, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Marva",
			"desc": "That Marva up and reverse",
			"notes": [0, 1, 4, 6, 7, 9, 11, 12, -101, 12, 11, 9, 7, 6, 4, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Purvi",
			"desc": "That Purvi up and reverse",
			"notes": [0, 1, 4, 6, 7, 8, 11, 12, -101, 12, 11, 8, 7, 6, 4, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}, {
			"name": "That Todi",
			"desc": "That Todi up and reverse",
			"notes": [0, 1, 3, 6, 7, 8, 11, 12, -101, 12, 11, 8, 7, 6, 3, 1, 0],
			"noteDuration": 1000,
			"breakDuration": 0,
			"midBreakDuration": 1000
		}
	];
});