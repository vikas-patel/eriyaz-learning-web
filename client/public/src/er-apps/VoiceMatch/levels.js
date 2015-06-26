define([], function() {
	return [{
			name: "Level 1",
			isBeepPersistent: true,
			notes: [0, 2, 4],
			total: 10
		}, {
			name: "Level 2",
			isBeepPersistent: true,
			notes: [0, 2, 4, 5, 7, 9, 11, 12],
			total: 10
		},{
			name: "Level 3",
			isBeepPersistent: true,
			notes: [-5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12],
			total: 10
		},{
			name: "Level 4",
			isBeepPersistent: false,
			notes: [0, 2, 4],
			total: 10
		}, {
			name: "Level 5",
			isBeepPersistent: false,
			notes: [0, 2, 4, 5, 7, 9, 11, 12],
			total: 10
		},{
			name: "Level 6",
			isBeepPersistent: false,
			notes: [-5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12],
			total: 10
		}
	];
});