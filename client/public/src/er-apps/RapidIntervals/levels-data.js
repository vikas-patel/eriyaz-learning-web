define([], function() {
	var colors = {
		purple: "#8f6da5",
		blue: "#308ec1",
		green: "#1de2a4",
		red: "#ff6b77"
	};

	var intervals = {
		xlarge: [580, 1220],
		large: [260, 580],
		medium: [150, 260],
		small: [100, 150],
		xsmall: [45, 100],
		xxsmall: [20, 45]
	};

	return [{
		desc: "extra large interval",
		name:"level 1",
		interval: intervals.xlarge,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.blue,
		total: 10
	}, {
		desc: "large interval",
		name:"level 2",
		interval: intervals.large,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.purple,
		total: 20
	}, {
		desc: "large interval between note2 & note3",
		name:"level 3",
		interval: intervals.large,
		numNotes: 3,
		testNotes: [2, 3],
		color: colors.purple,
		total: 10
	}, {
		desc: "large interval between note1 & note2",
		name:"level 4",
		interval: intervals.large,
		numNotes: 3,
		testNotes: [1, 2],
		color: colors.purple,
		total: 10
	}, {
		desc: "large interval between note1 & note3",
		name:"level 5",
		interval: intervals.large,
		numNotes: 3,
		testNotes: [1, 3],
		color: colors.purple,
		total: 10
	}, {
		desc: "medium interval",
		name:"level 6",
		interval: intervals.medium,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.red,
		total: 20
	}, {
		desc: "small interval",
		name:"level 7",
		interval: intervals.small,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.green,
		total: 20
	},  {
		desc: "small interval between note2 & note3",
		name:"level 8",
		interval: intervals.small,
		numNotes: 3,
		testNotes: [2, 3],
		color: colors.green,
		total: 20
	},  {
		desc: "small interval between note1 & note2",
		name:"level 9",
		interval: intervals.small,
		numNotes: 3,
		testNotes: [1, 2],
		color: colors.green,
		total: 20
	},  {
		desc: "small interval between note1 & note3",
		name:"level 10",
		interval: intervals.small,
		numNotes: 3,
		testNotes: [1, 3],
		color: colors.green,
		total: 20
	},  {
		desc: "extra small interval",
		name:"level 11",
		interval: intervals.xsmall,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.blue,
		total: 20
	},  {
		desc: "extra extra small interval",
		name:"level 12",
		interval: intervals.xxsmall,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.purple,
		total: 20
	}];
});