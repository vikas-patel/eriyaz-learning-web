define([], function() {
	return [{
			name: "Level 1",
			direction: "asc",
			cents: 100,
			notes: [2, 4, 5, 7, 9, 11, 12],
			total: 10
		}, {
			name: "Level 2",
			direction: "asc",
			cents: 50,
			notes: [2, 4, 5, 7, 9, 11, 12],
			total: 10
		} , {
			name: "Level 3",
			direction: "desc",
			cents: 100,
			notes: [11, 9, 7, 5, 4, 2, 0],
			total: 10
		}, {
			name: "Level 4",
			direction: "desc",
			cents: 50,
			notes: [11, 9, 7, 5, 4, 2, 0],
			total: 10
		}
	];
});