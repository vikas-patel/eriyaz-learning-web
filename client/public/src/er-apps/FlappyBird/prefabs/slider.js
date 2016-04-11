define([], function () {

	var Slider = function(game, SLIDE_X0, SLIDE_Y0, SLIDE_LENGTH) {
		this.game = game;
		this.SLIDE_LENGTH = SLIDE_LENGTH;
  	var SLIDE_WIDTH = 2;
  	var SLIDE_COL = 0xD6D6D6;
  	var DEFAULT_VAL = 5;
    this.WIDTH = 20;
  	this.SLIDE_X0 = SLIDE_X0;
  	this.SLIDE_Y0 = SLIDE_Y0;

  	var KNOB_COL = 0xaaaaaa;
  	var KNOB_RAD = 10;

    var volumeGph = game.add.graphics();
    volumeGph.lineStyle(0);
    volumeGph.beginFill(0x00A848, 1);
    // volumeGph.beginFill(0xffffff, 1);
    volumeGph.drawRect(0, 0, this.WIDTH, 1);
    this.volumeBar = game.add.sprite(SLIDE_X0, SLIDE_Y0 + SLIDE_LENGTH, volumeGph.generateTexture());
    this.volumeBar.anchor.setTo(0, 1);
    volumeGph.destroy();

  	this.slide = game.add.graphics();

    // set a fill and line style
    // slide.beginFill(0xFF3300);
    if (!this.game.noise) this.game.noise = DEFAULT_VAL;
    this.slide.lineStyle(SLIDE_WIDTH, SLIDE_COL, 1);
    // Equivalent to volume intensity scale of 0-25
    this.slide.drawRect(SLIDE_X0, SLIDE_Y0, this.WIDTH, SLIDE_LENGTH);

    var knobGph = game.add.graphics();
    knobGph.lineStyle(SLIDE_WIDTH*2, SLIDE_COL, 1);
    knobGph.moveTo(0, 0);
    knobGph.lineTo(this.WIDTH, 0);
    // knobGph.moveTo(SLIDE_X0, SLIDE_Y0 - DEFAULT_VAL*100/25 + SLIDE_LENGTH);

    this.knob = game.add.sprite(SLIDE_X0-2, SLIDE_Y0 - this.game.noise*100/25 + SLIDE_LENGTH, knobGph.generateTexture());
    knobGph.destroy();
    // draw a shape
    // slide.moveTo(SLIDE_X0, SLIDE_Y0);
    // slide.lineTo(SLIDE_X0+SLIDE_LENGTH,SLIDE_Y0);

    // var style = { font: "18px Snap ITC", fill: "#D6D6D6", align: "center"};
    // var label = game.add.text(SLIDE_X0 - 75, SLIDE_Y0+1, "Noise Filter", style);

    // this.knob = game.add.sprite(SLIDE_X0 + DEFAULT_VAL*100/25, SLIDE_Y0,'knob');
    this.knob.anchor.setTo(0, 0.5);
    this.knob.inputEnabled = true;

    this.knob.input.enableDrag();
    this.knob.events.onDragUpdate.add(this.onDragUpdate, this);
	};

	Slider.prototype.onDragUpdate = function(sprite, pointer) {
        if (pointer.y < this.SLIDE_Y0) {
            this.knob.y = this.SLIDE_Y0;
        } else if (pointer.y > this.SLIDE_Y0 + this.SLIDE_LENGTH) {
            this.knob.y = this.SLIDE_Y0 + this.SLIDE_LENGTH;
        } else {
            this.knob.y = pointer.y;
        }
        this.game.noise = this.getValue();
        this.knob.x = this.SLIDE_X0;
	};

  Slider.prototype.setVolume = function(value) {
      value = Math.min(value, 0.25);
      var h = value*this.SLIDE_LENGTH*100/25;
      this.volumeBar.height = h;
  };

	Slider.prototype.getValue = function() {
	    return parseInt((this.knob.position.y - this.SLIDE_Y0)/(this.SLIDE_LENGTH)*25);
	};

  Slider.prototype.destroy = function() {
      this.knob.destroy();
      this.volumeBar.destroy();
      this.slide.destroy();
  };

	return Slider;
});