define(['angular', './module'], function(angular, app) {
    var Dial = function(ngElement, labels) {
        this.labels = labels;
        this.value = 0;

        // var dialParent = ngElement.parent();
        // var parentSize = window.getComputedStyle(dialParent[0]).width;
        // console.log(typeof parentSize);
        // this.size = parseInt(parentSize);
        this.size = 400;
        this.width = this.size;
        this.height = this.size;



        this.ngElement = ngElement;
        this.ngCanvasLayer1 = angular.element('<canvas></canvas>');
        this.canvasLayer1 = this.ngCanvasLayer1[0];
        this.canvasLayer1.width = this.width;
        this.canvasLayer1.height = this.height;
        this.canvasLayer1.style.zIndex = 0;

        this.ngCanvasLayer2 = angular.element('<canvas></canvas>');
        this.canvasLayer2 = this.ngCanvasLayer2[0];

        this.canvasLayer2.width = this.width;
        this.canvasLayer2.height = this.height;
        this.canvasLayer2.style.zIndex = 1;

        this.canvasLayer1.style.position = "absolute";
        this.canvasLayer2.style.position = "absolute";


        this.ngElement.append(this.ngCanvasLayer1);
        this.ngElement.append(this.ngCanvasLayer2);

        this.setValue = function(value) {
            this.value = value;
            this.drawHand();
        };


        this.setLabels = function(labels) {
            this.labels = labels;
            this.drawFrame();
        };

        this.draw = function() {
            this.drawFrame();
            this.drawHand();
        };

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

                    if (i % 10 === 0) {
                        c2d.lineWidth = 2;
                        sx = sang * this.width * 0.3;
                        sy = cang * -this.height * 0.3;
                        ex = sang * this.width * 0.38;
                        ey = cang * -this.height * 0.38;
                        nx = sang * this.width * 0.44;
                        ny = cang * -this.height * 0.44;
                        c2d.fillStyle = 'black';
                        c2d.fillText(this.labels[(i / 10)], nx, ny);
                        //else minute marker
                    } else {
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

    app.directive('ngDial', function(DialModel) {
        return {
            restrict: 'E',
            // scope : false,
            // template : '<button>cool1</button>',
            link: function(scope, element) {
                scope.model = DialModel;

                var dial = new Dial(element, DialModel.labels);
                dial.draw();

                // scope.$watch('model.value', function(newValue, oldValue) {
                //     dial.setValue(newValue);
                //     console.log(Date.now());
                // }, true);

                // scope.$on('newvalue',function() {
                //     dial.setValue(DialModel.value);
                // });

                setInterval(function(){ dial.setValue(DialModel.value); }, 5);
            }
        };
    });
});