'use strict';
var cvel = document.getElementById("canvas");
var cv = cvel.getContext("2d");
var size = 4;
var h = cvel.offsetHeight;
var scale = 860 / (size * 2 + 1);
var count = 1;
var angle;

cv.translate(450, h / 2);

function drawXAxis() {
    let s;
    cv.lineWidth = 1;
    cv.strokeStyle = "#000";
    cv.fillStyle = "#000";
    cv.font = "16px Calibri";
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
        cv.fillText(i, s, -11);
        if (i != 0) {
            cv.moveTo(-s, -5);
            cv.lineTo(-s, 5);
            cv.fillText(-i, -s, -11);
        }
        cv.stroke();
    }
}

function arc() {
    var prev = {
        x: 0
    }
    var curr = {
        x: 0,
        len: 0
    }

    cv.strokeStyle = "#999";
    cv.lineWidth = 2;
    cv.font = "16px Calibri";
    cv.fillStyle = "white";
    drawCirWN();
    // cv.save();
    // cv.beginPath();
    // cv.fillStyle = "#999";
    // cv.arc(0, 18, 10, 0, 2 * Math.PI, true);
    // cv.fill();
    // cv.closePath();
    // cv.restore();

    // cv.fillText(count, 0, 23);

    this.animateArc = function () {
        if (angle > 180) {
            count++;
            drawCirWN();
            prev.x = curr.x;
            angle = 0;
            animReady = true;
            return 1;
        }
        cv.beginPath();
        if (count % 2 == 0) {
            cv.arc(prev.x - Math.abs(curr.len), 39, Math.abs(curr.len), (Math.PI / 180) * angle, 0, true);
            console.log("1", angle);
        } else {
            cv.arc(prev.x + Math.abs(curr.len), -29, Math.abs(curr.len), -Math.PI, -(Math.PI - (Math.PI / 180) * angle), false);
            console.log("-1", angle);
        }
        angle += 180 / 30;
        cv.stroke();
        cv.closePath();
        window.requestAnimationFrame(Arc.animateArc);
    }

    function drawCirWN() {
        cv.save();
        cv.beginPath();
        cv.fillStyle = "#999";
        cv.arc(curr.x, 21, 12, 0, 2 * Math.PI, true);
        cv.fill();
        cv.closePath();
        cv.restore();
        cv.fillText(count, curr.x, 26);
    }

    this.Next = function () {
        if (count >= size * 2 + 1) return 1;
        let x, len;
        if (count % 2 == 0) {
            x = -count / 2 * scale;
            len = (x - prev.x) / 2;
        } else {
            x = (count + 1) / 2 * scale;
            len = (x - prev.x) / 2;
        }
        curr.x = x;
        curr.len = len;

        angle = 0;
        this.animateArc();
    }
}

function render() {
    //cv.fillStyle = 'white';
    //cv.fillRect(-450, -h / 2, 900, h);
    //drawXAxis();
    Arc.Next();
}

//cv.setLineDash([100, 100]);
//cv.lineDashOffset = 90;
drawXAxis();
var Arc = new arc();

cvel.addEventListener('click', function () {
    render();
});