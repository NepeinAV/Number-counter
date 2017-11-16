'use strict';

var cvel = document.getElementById("canvas"); //Canvas element
var cv = cvel.getContext("2d"); //2d context
var size = 3; //размерность
//размер canvas
var h = cvel.offsetHeight;
var w = cvel.offsetWidth - 40;
var scale = w / (size * 2 + 1); //масштаб оси

cv.translate((w + 40) / 2, h / 2); //помещаем начало координат в середину
cv.textAlign = "center";

function drawXAxis() {
    let s;
    cv.lineWidth = 2;
    cv.strokeStyle = "#000";
    cv.fillStyle = "#000";
    cv.font = "16px Calibri Light";
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
    cv.beginPath();
    cv.moveTo(0, -3);
    cv.lineTo(0, 3);
    cv.fillText(0, 0, -11);
    for (var i = 0; i <= size; i++) {
        s = i * scale;
        cv.moveTo(s, -3);
        cv.lineTo(s, 3);
        cv.fillText(i, s, -11);
        cv.moveTo(-s, -3);
        cv.lineTo(-s, 3);
        cv.fillText(-i, -s, -11);
    }
    cv.stroke();
}

function arc() {
    var speed = {
        opacity: 10,
        angle: 40
    }
    var prev = {
        x: 0
    }
    var curr = {
        x: 0,
        len: 0
    }
    var corner = {
        x: 0,
        y: 0,
        angle: 0,
        newArc: true
    }
    var count = 1, //текущий номер
        step = Math.PI / speed.angle, //шаг движения анимации
        opstep = 1 / speed.opacity, //шаг анимации прозрачности
        angle = 0, //текущий угол кривой
        animReady = -1, //завершилась ли всяя запущенная анимация? -1 ни разу не запускалась 
        opacity = 0;

    cv.strokeStyle = "#999";
    cv.fillStyle = "white";
    cv.lineWidth = 3;
    cv.font = "16px Calibri Light";
    drawCirWN(); //отрисовываем первый номер

    this.animateArc = function () { //рисуем и аниммируем дугу
        //выходим, если угол становится больше 180 градусов
        if (angle > Math.PI) {
            count++;
            drawCirWN(); //отрисовываем номер
            prev.x = curr.x;
            angle = 0;
            return 1;
        }

        //скрываем предыдущую дугу
        cv.beginPath();
        cv.save();
        cv.strokeStyle = 'white';
        if (count % 2 == 0) cv.arc(prev.x - curr.len, 39, curr.len, angle, 0, true);
        else cv.arc(prev.x + curr.len, -29, curr.len, -Math.PI, -Math.PI + angle, false);
        cv.stroke();
        cv.restore();

        drawCorner(angle); //рисуем угол

        //рисуем новую дугу
        cv.beginPath();
        if (count % 2 == 0) cv.arc(prev.x - curr.len, 39, curr.len, angle, 0, true);
        else cv.arc(prev.x + curr.len, -29, curr.len, -Math.PI, -Math.PI + angle, false);
        cv.stroke();

        angle += step; //увеличиваем угол

        window.requestAnimationFrame(Arc.animateArc);
    }

    this.Next = function () {
        if (count >= size * 2 + 1 || !animReady) return 1;
        animReady = 0;
        let x, len;
        if (count % 2 == 0) x = -count / 2 * scale;
        else x = (count + 1) / 2 * scale;
        len = Math.abs((x - prev.x) / 2);
        curr.x = x;
        curr.len = len;
        this.animateArc();
    }

    function setCorner(coordsTop, coordsBottom, fillColor, x, y, angle) {
        cv.translate(x, y);
        cv.rotate(angle);
        cv.fillStyle = fillColor;
        cv.beginPath();
        if (count % 2 == 0) {
            cv.moveTo(coordsBottom[0], coordsBottom[1]);
            cv.lineTo(coordsBottom[2], coordsBottom[3]);
            cv.lineTo(coordsBottom[4], coordsBottom[5]);
        } else {
            cv.moveTo(coordsTop[0], coordsTop[1]);
            cv.lineTo(coordsTop[2], coordsTop[3]);
            cv.lineTo(coordsTop[4], coordsTop[5]);
        }
    }

    function drawCorner(angle) {
        if (angle > Math.PI) return 1;
        //высчитываем координаты нового уголка x0 + r*cos(a)/y0 + r*sin(a)
        if (count % 2 == 0) {
            var x = -(prev.x - curr.len) + curr.len * Math.cos(angle);
            var y = 39 + curr.len * Math.sin(angle);
        } else {
            var x = (curr.x - curr.len) + curr.len * Math.cos(Math.PI - angle);
            var y = -(29 + curr.len * Math.sin(Math.PI - angle));
        }
        //если дуга новая, то устанавливаем сохраняем параметры начального положения уголка
        if (corner.newArc) {
            corner.x = x;
            corner.y = y;
            corner.angle = angle;
            corner.newArc = false;
        } else { //иначе скрываем предыдущий уголок
            cv.save();
            setCorner([-9, 5, 9, 5, 0, -3], [9, -5, -9, -5, 0, 3], "white", corner.x, corner.y, corner.angle);
            cv.fill();
            cv.restore();
        }

        cv.save();
        setCorner([-7, 4, 7, 4, 0, -2], [7, -4, -7, -4, 0, 2], "#999", x, y, angle);
        cv.fill();
        cv.restore();

        corner.x = x;
        corner.y = y;
        corner.angle = angle;

        window.requestAnimationFrame(drawCorner);
    }

    function drawCirWN() {
        if (opacity > 1) {
            opacity = 0;
            animReady = 1;
            corner.newArc = true;
            return 1;
        }
        cv.save();
        //скрываем предыдущий круг
        cv.beginPath();
        cv.fillStyle = "white";
        cv.arc(curr.x, 21, 12, 0, 2 * Math.PI, true);
        cv.fill();
        //рисуем новый с учётом прозрачности
        cv.beginPath();
        cv.fillStyle = "rgba(80, 114, 153, " + opacity + ")";
        cv.arc(curr.x, 21, 12, 0, 2 * Math.PI, true);
        cv.fill();
        cv.restore();
        cv.fillText(count, curr.x, 26); //пишем порядковый номер
        opacity += opstep;
        window.requestAnimationFrame(drawCirWN);
    }
}


drawXAxis();
var Arc = new arc();

document.addEventListener('click', function () {
    Arc.Next();
});