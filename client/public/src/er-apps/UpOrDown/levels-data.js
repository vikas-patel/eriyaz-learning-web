define([],function() {
	var purple = "#8f6da5";
	var blue = "#308ec1";
	var green = "#1de2a4";
	var red = "#ff6b77";
	return {
		interval : {
			XL : [900,1500],
			L : [400,900],
			M : [100,400],
			S : [20,100]
		},
		levels : [
			{
				desc : "extra large interval",
				interval : "XL",
				numNotes : 2,
				testNotes : [1,2],
				color:blue
			},
			{
				desc : "large interval",
				interval : "L",
				numNotes : 2,
				testNotes : [1,2],
				color:purple
			},
			{
				desc : "medium interval",
				interval : "M",
				numNotes : 2,
				testNotes : [1,2],
				color : red
			},
			{
				desc : "small interval",
				interval : "S",
				numNotes : 2,
				testNotes : [1,2],
				color: green
			},
			{
				desc : "medium interval between note2 & note3",
				interval : "M",
				numNotes : 3,
				testNotes : [2,3],
				color: red
			},
			{
				desc : "small interval between note2 & note3",
				interval : "S",
				numNotes : 3,
				testNotes : [2,3],
				color : green
			},
			{
				desc : "medium interval between note1 & note2",
				interval : "M",
				numNotes : 3,
				testNotes : [1,2],
				color: red
			},
			{
				desc : "small interval between note1 & note2",
				interval : "S",
				numNotes : 3,
				testNotes : [1,2],
				color: green
			},
			{
				desc : "medium interval between note1 & note3",
				interval : "M",
				numNotes : 3,
				testNotes : [1,3],
				color : red
			},
			{
				desc : "small interval between note1 & note3",
				interval : "S",
				numNotes : 3,
				testNotes : [1,3],
				color: green
			}
		]
	};
});