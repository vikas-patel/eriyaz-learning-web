define(['./module'], function(app) {
    var Dial = function(labels) {
        this.labels = labels;
        this.value = 0;

        // var dialParent = ngElement.parent();
        // var parentSize = window.getComputedStyle(dialParent[0]).width;
        // console.log(typeof parentSize);
        // this.size = parseInt(parentSize);
        this.size = 400;
        this.width = this.size;
        this.height = this.size;



        // this.ngElement = ngElement;

        this.canvasLayer1 = document.createElement('canvas');
        this.canvasLayer1.width = this.width;
        this.canvasLayer1.height = this.height;
        this.canvasLayer1.style.zIndex = 0;

        this.canvasLayer2 = document.createElement('canvas');

        this.canvasLayer2.width = this.width;
        this.canvasLayer2.height = this.height;
        this.canvasLayer2.style.zIndex = 1;

        this.canvasLayer3 = document.createElement('canvas');

        this.canvasLayer3.width = this.width;
        this.canvasLayer3.height = this.height;
        this.canvasLayer3.style.zIndex = 0;

        this.canvasLayer4 = document.createElement('canvas');

        this.canvasLayer4.width = this.width;
        this.canvasLayer4.height = this.height;
        this.canvasLayer4.style.zIndex = 2;

        this.canvasLayer1.style.position = "absolute";
        this.canvasLayer2.style.position = "absolute";
        this.canvasLayer3.style.position = "absolute";
        this.canvasLayer4.style.position = "absolute";

        document.getElementById('dial-container').appendChild(this.canvasLayer1);
        document.getElementById('dial-container').appendChild(this.canvasLayer2);
        document.getElementById('dial-container').appendChild(this.canvasLayer3);
        document.getElementById('dial-container').appendChild(this.canvasLayer4);
        var soundCracker = new Audio("er-shell/audio/crackers.mp3"); // buffers automatically when created
        var soundClap = new Audio("er-shell/audio/clap.mp3"); // buffers automatically when created
        var backgroundCelebrate1 = "url('er-shell/images/celebrate1.gif')";
        var backgroundCelebrate2 = "url('er-shell/images/celebrate2.gif')";
        var backgroundCelebrate3 = "url('er-shell/images/celebrate3.gif')";
        var backgroundClap1 = "url('er-shell/images/clap1.gif')";
        var backgroundClap2 = "url('er-shell/images/clap2.gif')";
        var anims = new Array();
        anims.push([backgroundCelebrate1, soundCracker]);
        anims.push([backgroundClap1, soundClap]);
        anims.push([backgroundCelebrate2, soundCracker]);
        anims.push([backgroundClap2, soundClap]);
        anims.push([backgroundCelebrate3, soundCracker]);


        this.setValue = function(value) {
            this.value = value;
            this.drawHand();
        };


        this.setLabels = function(labels) {
            this.labels = labels;
            this.drawLabel();
        };

        this.draw = function() {
            this.drawFrame();
            this.drawLabel();
            this.drawHand();
        };
        var count = 0;
        this.reward = function() {
            if (count >= anims.length) {
                count = 0;
            }
            this.canvasLayer4.style.background = anims[count][0];
            this.canvasLayer4.style.backgroundSize = "100% 100%";
            anims[count][1].play();
            count++;
            local = this;
            setTimeout(function(){
                local.canvasLayer4.style.background = "";
            }, 5000);
        };

        this.drawLabel = function(focusNote) {
            var c2d = this.canvasLayer3.getContext('2d');
            c2d.clearRect(0, 0, this.width, this.height);

            c2d.font = "Normal " + this.size*0.05 + "px Arial";
            c2d.textBaseline = "middle";
            c2d.textAlign = "center";
            c2d.lineWidth = 2;
            c2d.save();

            c2d.translate(this.width / 2, this.height / 2);

            //Markings/Numerals
            for (i = 0; i <= 11; i = i+1) {
                ang = Math.PI / 60 * i * 10;
                sang = Math.sin(ang);
                cang = Math.cos(ang);
                sx = sang * this.width * 0.3;
                sy = cang * -this.height * 0.3;
                ex = sang * this.width * 0.38;
                ey = cang * -this.height * 0.38;
                nx = sang * this.width * 0.44;
                ny = cang * -this.height * 0.44;
                c2d.fillStyle = 'black';
                if (i == focusNote) c2d.fillStyle = "red";
                c2d.fillText(this.labels[(i)], nx, ny);

                c2d.beginPath();
                c2d.moveTo(sx, sy);
                c2d.lineTo(ex, ey);
                c2d.stroke();
            }
            c2d.restore();
        }

        this.drawFrame = function() {
            if (this.canvasLayer1.getContext) {
                var c2d = this.canvasLayer1.getContext('2d');
                c2d.clearRect(0, 0, this.width, this.height);

                c2d.font = "Normal " + this.size*0.05 + "px Arial";
                c2d.textBaseline = "middle";
                c2d.textAlign = "center";
                c2d.lineWidth = 1;
                c2d.save();

                c2d.translate(this.width / 2, this.height / 2);

                //Markings/Numerals
                for (i = 1; i <= 120; i++) {
                    ang = Math.PI / 60 * i;
                    sang = Math.sin(ang);
                    cang = Math.cos(ang);
                    // If modulus of divide by 10 is zero then draw an hour marker/numeral

                    if (i % 10 != 0) {
                        c2d.lineWidth = 1;
                        sx = sang * this.width * 0.35;
                        sy = cang * this.height * 0.35;
                        ex = sang * this.width * 0.38;
                        ey = cang * this.height * 0.38;
                    }

                    c2d.beginPath();
                    c2d.moveTo(sx, sy);
                    c2d.lineTo(ex, ey);
                    c2d.stroke();
                }

                //Additional restore to go back to state before translate
                //Alternative would be to simply reverse the original translate
                c2d.restore();

                //Draw center joining pin.
                c2d.beginPath();
                c2d.arc(this.width / 2, this.height / 2, 5, 0, 2 * Math.PI);
                c2d.stroke();

            }
        };

        this.drawHand = function() {
            if (this.canvasLayer2.getContext) {

                var c2d = this.canvasLayer2.getContext('2d');
                c2d.clearRect(0, 0, this.width, this.height);

                //Draw second hand
                c2d.save();
                var angle = Math.PI / 6 * this.value;
                c2d.translate(this.width / 2, this.height / 2);
                c2d.rotate(angle);
                c2d.lineWidth = 5;
                if (angle >= 0)
                    c2d.strokeStyle = "green";
                else
                    c2d.strokeStyle = "red";
                c2d.beginPath();
                c2d.moveTo(0, this.height * 0.06);
                c2d.lineTo(0, -this.height * 0.35);
                c2d.stroke();
                c2d.restore();
            }
            // setTimeout(drawHand, 1);
        };

    };

    return Dial;

    // app.directive('ngDial2', function(DialModel) {
    //     return {
    //         restrict: 'E',
    //         // scope : false,
    //         // template : '<button>cool1</button>',
    //         link: function(scope, element) {
    //             scope.model = DialModel;

    //             var dial = new Dial(element, labelsHindustani);
    //             dial.draw();

    //             // scope.$watch('model.value', function(newValue, oldValue) {
    //             //     dial.setValue(newValue);
    //             //     console.log(Date.now());
    //             // }, true);

    //             scope.$watch('genre', function(newValue, oldValue) {
    //                 if (newValue == oldValue) return;
    //                 if (newValue == "carnatic") {
    //                     dial.labels = labelsCarnatic;
    //                 } else {
    //                     dial.labels = labelsHindustani;
    //                 }
    //                 dial.drawFrame();
    //           });

    //             setInterval(function(){ dial.setValue(DialModel.value); }, 10);
    //         }
    //     };
    // });
});