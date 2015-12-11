define(['./problem'], function(Problem) {
    var ProblemGen = function() {
        var middleC = 60;
        var allowedIntervals = [1,2,3,4];

        this.getNewProblem = function(level) {
            var problem = new Problem();
            var lastNote = middleC;
            for (var i = 0; i < 4; i++) {
                var inflection = Math.random() < 0.5 ? 1 : -1;
                var interval = allowedIntervals[Math.floor(Math.random() * allowedIntervals.length)];
                var currNote = lastNote + inflection * interval;
                problem.notes.push(currNote);
                if(i>0)
                    problem.inflections.push(inflection);
                lastNote = currNote;
            }
            return problem;
        };
    };

    return new ProblemGen();
});