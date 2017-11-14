'use strict';
var cvel = document.getElementById("canvas");
var cv = cvel.getContext("2d");
var size = 3;
var h = cvel.offsetHeight;
var scale = 860 / (size * 2 + 1);
var count = 1;
cv.translate(450, h / 2);

function drawXAxis() {
    let s;
    cv.lineWidth = 1;
    cv.strokeStyle = "#000";
    cv.fillStyle = "#000";
    cv.font = "14px Calibri";
    cv.textAlign = "center";
    cv.beginPath();
    //ось
    cv.moveTo(-430, 0);
    cv.lineTo(430, 0);
    cv.stroke();
    //уголок
    cv.moveTo(430, -5);
    cv.lineTo(430, 5);
    cv.lineTo(435, 0);
    cv.fill();
    //координаты
    for (var i = 0; i <= size; i++) {
        s = i * scale;
        cv.beginPath();
        cv.moveTo(s, -5);
        cv.lineTo(s, 5);
        cv.fillText(i, s, -10);
        if (i != 0) {
            cv.moveTo(-s, -5);
            cv.lineTo(-s, 5);
            cv.fillText(-i, -s, -10);
        }
        cv.stroke();
    }
}

function arc() {
    var prev = {
        x: 0
    }
    var spr;

    cv.strokeStyle = "#999";
    cv.lineWidth = 2;
    cv.font = "16px Calibri";
    cv.fillStyle = "white";

    cv.save();
    cv.beginPath();
    cv.fillStyle = "#999";
    cv.arc(0, 18, 10, 0, 2 * Math.PI, true);
    cv.fill();
    cv.closePath();
    cv.restore();

    cv.fillText(count, 0, 23);

    this.a = function (pr, x) {

    }

    this.Next = function () {
        if (count >= size * 2 + 1) return 0;
        cv.beginPath();
        //cv.moveTo(prev.x, 0);
        let x, len;
        if (count % 2 == 0) {
            x = -count / 2 * scale;
            len = (x - prev.x) / 2;
            cv.arc(prev.x - Math.abs(len), 0, Math.abs(len), 0, Math.PI, false);
        } else {
            x = (count + 1) / 2 * scale;
            len = (x - prev.x) / 2;
            cv.arc(prev.x + Math.abs(len), 0, Math.abs(len), 0, Math.PI, true);
        }
        cv.stroke();
        cv.closePath();

        cv.save();
        cv.beginPath();
        cv.fillStyle = "#999";
        cv.arc(x, 18, 10, 0, 2 * Math.PI, true);
        cv.fill();
        cv.closePath();
        cv.restore();

        cv.fillText(count + 1, x, 23);
        prev.x = x;
        count++;
    }
}

function render() {
    //cv.fillStyle = 'white';
    //cv.fillRect(-450, -300, 900, 600);
    Arc.Next();
}

//cv.setLineDash([100, 100]);
//cv.lineDashOffset = 90;
drawXAxis();
var Arc = new arc();

cvel.addEventListener('click', function () {
    render();
});