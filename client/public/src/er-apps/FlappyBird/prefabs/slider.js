define([], function () {

	var Slider = function(game, parent, SLIDE_X0, SLIDE_Y0, SLIDE_LENGTH) {
		this.game = game;
		this.SLIDE_LENGTH = SLIDE_LENGTH;
      	var SLIDE_WIDTH = 10;
      	var SLIDE_COL = 0xD6D6D6;
      	var DEFAULT_VAL = 5;
      	this.SLIDE_X0 = SLIDE_X0;
      	this.SLIDE_Y0 = SLIDE_Y0;

      	var KNOB_COL = 0xaaaaaa;
      	var KNOB_RAD = 10;

      	var slide = game.add.graphics();

        // set a fill and line style
        // slide.beginFill(0xFF3300);
        slide.lineStyle(SLIDE_WIDTH, SLIDE_COL, 1);
        
        // draw a shape
        slide.moveTo(SLIDE_X0, SLIDE_Y0);
        slide.lineTo(SLIDE_X0+SLIDE_LENGTH,SLIDE_Y0);

        var style = { font: "18px Snap ITC", fill: "#D6D6D6", align: "center"};
        var label = game.add.text(SLIDE_X0 - 75, SLIDE_Y0+1, "Noise Filter", style);
        parent.add(label);

        parent.add(slide);

        this.knob = game.add.sprite(SLIDE_X0 + DEFAULT_VAL*100/25, SLIDE_Y0,'knob');
        this.knob.anchor.setTo(0.5, 0.5);
        this.knob.inputEnabled = true;

        this.knob.input.enableDrag();
        this.knob.events.onDragUpdate.add(this.onDragUpdate, this);
        parent.add(this.knob);
        if (!this.game.noise) this.game.noise = DEFAULT_VAL;
	};

	Slider.prototype.onDragUpdate = function(sprite, pointer) {
        if (pointer.x < this.SLIDE_X0) {
            this.knob.x = this.SLIDE_X0;
        } else if (pointer.x > this.SLIDE_X0 + this.SLIDE_LENGTH) {
            this.knob.x = this.SLIDE_X0 + this.SLIDE_LENGTH;
        } else {
            this.knob.x = pointer.x;
        }
        this.game.noise = this.getValue();
        console.log(this.game.noise);
        this.knob.y = this.SLIDE_Y0;
	};

	Slider.prototype.getValue = function() {
	    return parseInt((this.knob.position.x - this.SLIDE_X0)/(this.SLIDE_LENGTH)*25);
	};

	return Slider;
});