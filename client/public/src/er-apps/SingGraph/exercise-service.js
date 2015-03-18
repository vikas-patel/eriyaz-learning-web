  define(['./module'],function(app) {
    var base_url="";
    app.factory('ExerciseService', function($http, $window) {
        return {
            findAll: function() {
                //TODO: Append teacherId
                return $http.get(base_url + '/exercises');
            },

            getSubset: function(exercise, partNumber, maxNotes) {
                var sequences = exercise.notes;
                var subSequences = [];
                for (i = partNumber*maxNotes; i < (partNumber+1)*maxNotes && i < sequences.length; i++) {
                    subSequences.push(sequences[i]);
                }
                return subSequences;
            }
        };
    });
});