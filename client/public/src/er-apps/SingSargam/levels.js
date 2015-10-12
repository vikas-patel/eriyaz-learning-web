define([], function() {
	return [{
			name: "Level 1: 4 notes ascending",
			direction: "asc",
			notes: [0, 2, 4, 5],
			total: 10
		}, {
			name: "Level 2: 8 notes ascending",
			direction: "asc",
			notes: [0, 2, 4, 5, 7, 9, 11, 12],
			total: 10
		} ,{
			name: "Level 3: 4 notes descending",
			direction: "directionesc",
			notes: [12, 11, 9, 7],
			total: 10
		} , {
			name: "Level 4: 8 notes descending",
			direction: "desc",
			notes: [12, 11, 9, 7, 5, 4, 2, 0],
			total: 10
		}
	];
});