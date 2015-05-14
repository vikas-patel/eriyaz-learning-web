define([], function() {
	var colors = {
		purple: "#8f6da5",
		blue: "#308ec1",
		green: "#1de2a4",
		red: "#ff6b77"
	};

	var intervals = {
		xlarge: [900, 1500],
		large: [400, 900],
		medium: [100, 400],
		small: [20, 100]
	};

	return [{
		desc: "extra large interval",
		interval: intervals.xlarge,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.blue,
		total: 10
	}, {
		desc: "large interval",
		interval: intervals.large,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.purple,
		total: 20
	}, {
		desc: "medium interval",
		interval: intervals.medium,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.red,
		total: 20
	}, {
		desc: "small interval",
		interval: intervals.small,
		numNotes: 2,
		testNotes: [1, 2],
		color: colors.green,
		total: 20
	}, {
		desc: "medium interval between note2 & note3",
		interval: intervals.medium,
		numNotes: 3,
		testNotes: [2, 3],
		color: colors.red,
		total: 10
	}, {
		desc: "small interval between note2 & note3",
		interval: intervals.small,
		numNotes: 3,
		testNotes: [2, 3],
		color: colors.green,
		total: 20
	}, {
		desc: "medium interval between note1 & note2",
		interval: intervals.medium,
		numNotes: 3,
		testNotes: [1, 2],
		color: colors.red,
		total: 10
	}, {
		desc: "small interval between note1 & note2",
		interval: intervals.small,
		numNotes: 3,
		testNotes: [1, 2],
		color: colors.green,
		total: 20
	}, {
		desc: "medium interval between note1 & note3",
		interval: intervals.medium,
		numNotes: 3,
		testNotes: [1, 3],
		color: colors.red,
		total: 10
	}, {
		desc: "small interval between note1 & note3",
		interval: intervals.small,
		numNotes: 3,
		testNotes: [1, 3],
		color: colors.green,
		total: 20
	}];
});