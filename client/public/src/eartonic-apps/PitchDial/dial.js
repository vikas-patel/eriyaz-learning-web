define(function() {
    var Dial = function(id, labels) {
        this.labels = labels;
        this.value = 0;

        this.width = 310;
        this.height = 310;



        this.parent = document.getElementById(id);

        this.canvasLayer1 = document.createElement('canvas');
        this.canvasLayer1.width = this.width;
        this.canvasLayer1.height = this.height;
        this.canvasLayer1.style.zIndex = 0;

        this.canvasLayer2 = document.createElement('canvas');
        this.canvasLayer2.width = this.width;
        this.canvasLayer2.height = this.height;
        this.canvasLayer2.style.zIndex = 1;

        this.canvasLayer1.style.position = "absolute";
        this.canvasLayer2.style.position = "absolute";


        this.parent.appendChild(this.canvasLayer1);
        this.parent.appendChild(this.canvasLayer2);

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
                c2d.clearRect(0, 0, 310, 310);
                //Define gradients for 3D / shadow effect
                var grad1 = c2d.createLinearGradient(0, 0, 310, 310);
                grad1.addColorStop(0, "#D83040");
                grad1.addColorStop(1, "#801020");
                var grad2 = c2d.createLinearGradient(0, 0, 310, 310);
                grad2.addColorStop(0, "#801020");
                grad2.addColorStop(1, "#D83040");
                c2d.font = "Bold 20px Arial";
                c2d.textBaseline = "middle";
                c2d.textAlign = "center";
                c2d.lineWidth = 1;
                c2d.save();

                //Outer bezel
                c2d.strokeStyle = grad1;
                c2d.lineWidth = 10;
                c2d.beginPath();
                //        c2d.arc(150,150,138,0,Math.PI*2,true);
                c2d.shadowOffsetX = 4;
                c2d.shadowOffsetY = 4;
                c2d.shadowColor = "rgba(0,0,0,0.6)";
                c2d.shadowBlur = 6;
                c2d.stroke();

                //Inner bezel
                c2d.restore();
                c2d.strokeStyle = grad2;
                c2d.lineWidth = 10;
                c2d.beginPath();
                //        c2d.arc(150,150,129,0,Math.PI*2,true);
                c2d.stroke();
                c2d.strokeStyle = "#222";
                c2d.save();
                c2d.translate(155, 155);

                //Markings/Numerals
                for (i = 1; i <= 120; i++) {
                    ang = Math.PI / 60 * i;
                    sang = Math.sin(ang);
                    cang = Math.cos(ang);
                    //If modulus of divide by 10 is zero then draw an hour marker/numeral
                    if (i % 10 === 0) {
                        c2d.lineWidth = 2;
                        sx = sang * 95;
                        sy = cang * -95;
                        ex = sang * 120;
                        ey = cang * -120;
                        nx = sang * 80;
                        ny = cang * -80;
                        c2d.fillStyle = 'black';
                        c2d.fillText(this.labels[(i / 10)], nx * 1.7, ny * 1.7);
                        //else minute marker
                    } else {
                        c2d.lineWidth = 1;
                        sx = sang * 110;
                        sy = cang * 110;
                        ex = sang * 120;
                        ey = cang * 120;
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
                c2d.arc(155, 155, 1, 0, 2 * Math.PI);
                c2d.stroke();

            }
        };

        this.drawHand = function() {
            if (this.canvasLayer2.getContext) {

                var c2d = this.canvasLayer2.getContext('2d');
                c2d.clearRect(0, 0, 310, 310);

                //Draw second hand
                c2d.save();
                var angle = Math.PI / 6 * this.value;
                c2d.translate(155, 155);
                c2d.rotate(angle);
                c2d.lineWidth = 3;
                if (angle >= 0)
                    c2d.strokeStyle = "green";
                else
                    c2d.strokeStyle = "red";
                c2d.beginPath();
                c2d.moveTo(0, 20);
                c2d.lineTo(0, -110);
                c2d.stroke();
                c2d.restore();
            }
            // setTimeout(drawHand, 1);
        };

    };
    return {
        getDial: function(id, labels) {
            return new Dial(id, labels);
        }
    };
});