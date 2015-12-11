define(['music-calc','underscore'], function(MusicCalc,_) {
     var Problem = function() {
        this.inflections = [];
        this.notes = [];

        this.getShape = function() {
            if(_.isEqual(this.inflections,[1,1,1])) {
                return 0;
            } else if (_.isEqual(this.inflections,[-1,-1,-1])) {
                return 1;
            } else if (_.isEqual(this.inflections,[1,-1,-1]) || _.isEqual(this.inflections,[1,1,-1]) ) {
                return 2;
            } else if (_.isEqual(this.inflections,[-1,1,1]) || _.isEqual(this.inflections,[-1,-1,1])) {
                return 3;
            } else if (_.isEqual(this.inflections,[1,-1,1])) {
                return 4;
            } else if (_.isEqual(this.inflections,[-1,1,-1])) {
                return 5;
            } 
        };

        
    };

    return Problem;

});