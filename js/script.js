'use strict';

var cvel = document.getElementById("canvas"); //Canvas element
var cv = cvel.getContext("2d"); //2d context
var size = 7; //размерность
var h = cvel.offsetHeight;
var w = cvel.offsetWidth - 40;
var scale = w / (size * 2 + 1);

cv.translate((w + 40) / 2, h / 2);

function drawXAxis() {
    let s;
    cv.lineWidth = 2;
    cv.strokeStyle = "#000";
    cv.fillStyle = "#000";
    cv.font = "16px Calibri Light";
    cv.textAlign = "center";
    cv.beginPath();
    //ось
    cv.moveTo(-w / 2, 0);
    cv.lineTo(w / 2, 0);
    cv.stroke();
    //уголок
    cv.moveTo(w / 2, -5);
    cv.lineTo(w / 2, 5);
    cv.lineTo(w / 2 + 5, 0);
    cv.fill();
    //координаты
    for (var i = 0; i <= size; i++) {
        s = i * scale;
        cv.beginPath();
        cv.moveTo(s, -3);
        cv.lineTo(s, 3);
        cv.fillText(i, s, -11);
        if (i != 0) {
            cv.moveTo(-s, -3);
            cv.lineTo(-s, 3);
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
    var count = 1,
        step = 180 / 20,
        angle = 0,
        animReady = -1;

    cv.strokeStyle = "#999";
    cv.lineWidth = 3;
    cv.font = "16px Calibri Light";
    cv.fillStyle = "white";
    drawCirWN(); //отрисовываем первый номер

    this.animateArc = function () {
        //выходим, если угол становится больше 180 градусов
        if (angle > 180) {
            count++;
            drawCirWN();
            prev.x = curr.x;
            angle = 0;
            animReady = true;
            return 1;
        }
        //скрываем предыдущую дугу
        cv.beginPath();
        cv.save();
        cv.strokeStyle = 'white';
        if (count % 2 == 0)
            cv.arc(prev.x - Math.abs(curr.len), 39, Math.abs(curr.len), (Math.PI / 180) * angle, 0, true);
        else
            cv.arc(prev.x + Math.abs(curr.len), -29, Math.abs(curr.len), -Math.PI, -(Math.PI - (Math.PI / 180) * angle), false);
        cv.stroke();
        cv.restore();

        //рисуем новую дугу
        cv.beginPath();
        if (count % 2 == 0)
            cv.arc(prev.x - Math.abs(curr.len), 39, Math.abs(curr.len), (Math.PI / 180) * angle, 0, true);
        else
            cv.arc(prev.x + Math.abs(curr.len), -29, Math.abs(curr.len), -Math.PI, -(Math.PI - (Math.PI / 180) * angle), false);
        cv.stroke();

        angle += step;

        window.requestAnimationFrame(Arc.animateArc);
    }

    function drawCirWN() {
        cv.save();
        cv.beginPath();
        cv.fillStyle = "#507299";
        cv.arc(curr.x, 21, 12, 0, 2 * Math.PI, true);
        cv.fill();
        cv.restore();
        cv.fillText(count, curr.x, 26);
    }

    this.Next = function () {
        if (count >= size * 2 + 1) return 1;
        if (!animReady) return 1;
        animReady = false;
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

        this.animateArc();
    }
}

function render() {
    Arc.Next();
}

drawXAxis();
var Arc = new arc();

cvel.addEventListener('click', function () {
    render();
});