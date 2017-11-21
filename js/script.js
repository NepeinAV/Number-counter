'use strict';

var cvel = document.getElementById("canvas"), //Canvas element
    cv = cvel.getContext("2d"), //2d context
    impW = 250,
    elc = document.querySelector("#imp .corner"), //уголок элемента imp
    size, //размерность
    h, w, //размер canvas
    scale, //масштаб 
    centerY, centerX, //центр холста
    count, //текущий номер 
    config;

var DrawC, DrawArcC, TitleC; //классы

const fs = require("fs"); //filesystem lib node.js

class Title {
    constructor() {
        this.tips = new Object();
        this.count = 0;
    }

    setTitle() {
        let pos = (count + 1) % 2;
        pos == 1 ? pos = ~~(-(count + 1) / 2) : pos = ~~((count + 1) / 2);
        if (this.count > this.tips.length - 1 || this.tips[pos] == undefined) {
            imp.style = "display: none";
            imp.className = "";
            return 1;
        }

        //imp.className = "";
        imp.style.display = "block";
        imp.querySelector('span').innerHTML = this.tips[pos].text;

        let x, y;
        x = centerX - impW + scale * pos;
        if (this.tips[pos].loc == "b") {
            if (x < 0) {
                x += impW;
                elc.style = "bottom: auto; right:auto; transform: scaleX(-1) rotateZ(45deg); top: -16px; left: -16px";
            } else
                elc.style = "bottom: auto; transform: rotateZ(45deg); top: -16px; ";

            y = centerY + 35 + 32;
        } else {
            if (x < 0) {
                x += impW;
                elc.style = "bottom: -16px; transform: scaleX(-1) rotateZ(-45deg); left: -16px; top: auto; right: auto ";
            } else
                elc.style = "bottom: -16px; transform: rotateZ(-45deg); top: auto; ";

            y = centerY - imp.offsetHeight - 16 - 38;
        }
        imp.style = "top: " + y + "px; " + "left: " + x + "px";
        imp.className = "anim";
        this.count++;
    }
}

class Draw {
    constructor() {
        this.speed = {
            opacity: 10,
            angle: 20
        }
        this.prev = {
            x: 0
        }
        this.curr = {
            x: 0,
            len: 0
        }
        this.corner = {
            x: 0,
            y: 0,
            angle: 0,
            newArc: true
        }
        this.step = Math.PI / this.speed.angle; //шаг движения анимации
        this.opstep = 1 / this.speed.opacity; //шаг анимации прозрачности
        this.angle = 0; //текущий угол кривой
        this.animReady = -1; //завершилась ли вся запущенная анимация? -1 ни разу не запускалась 
        this.opacity = 0;
    }

    drawXAxis() {
        let s;
        cv.lineWidth = 2;
        cv.strokeStyle = "#000";
        cv.fillStyle = "#000";
        cv.font = "16px Calibri";
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
        cv.save();
        cv.font = "20px Calibri Light";
        cv.fillText("x", w / 2, 20);
        cv.restore();
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

    Next() {
        if (count >= size * 2 + 1 || !this.animReady) return 1;
        this.animReady = 0;
        let x, len;
        if (count % 2 == 0) x = -count / 2 * scale;
        else x = (count + 1) / 2 * scale;
        len = Math.abs((x - this.prev.x) / 2);
        this.curr.x = x;
        this.curr.len = len;
        DrawArcC.animateArc();
        TitleC.setTitle();
    }

    drawCirWN() {
        if (DrawC.opacity > 1) {
            DrawC.opacity = 0;
            DrawC.animReady = 1;
            DrawC.corner.newArc = true;
            return 1;
        }
        cv.save();
        //скрываем предыдущий круг
        cv.beginPath();
        cv.fillStyle = "white";
        cv.arc(DrawC.curr.x, 21, 13, 0, 2 * Math.PI, true);
        cv.fill();
        //рисуем новый с учётом прозрачности
        cv.beginPath();
        cv.fillStyle = "rgba(80, 114, 153, " + DrawC.opacity + ")";
        cv.arc(DrawC.curr.x, 21, 12, 0, 2 * Math.PI, true);
        cv.fill();
        cv.fillStyle = "white";
        cv.fillText(count, DrawC.curr.x, 26); //пишем порядковый номер
        cv.restore();
        DrawC.opacity += DrawC.opstep;
        window.requestAnimationFrame(DrawC.drawCirWN);
    }
}

//класс с методами для отрисовки дуги
class DrawArc {
    animateArc() { //рисуем и аниммируем дугу
        //выходим, если угол становится больше 180 градусов
        if (DrawC.angle > Math.PI) {
            count++;
            DrawC.drawCirWN(); //отрисовываем номер
            DrawC.prev.x = DrawC.curr.x;
            DrawC.angle = 0;
            return 1;
        }

        //скрываем предыдущую дугу
        cv.beginPath();
        cv.save();
        cv.strokeStyle = 'white';
        if (count % 2 == 0) cv.arc(DrawC.prev.x - DrawC.curr.len, 39, DrawC.curr.len, DrawC.angle, 0, true);
        else cv.arc(DrawC.prev.x + DrawC.curr.len, -29, DrawC.curr.len, -Math.PI, -Math.PI + DrawC.angle, false);
        cv.stroke();
        cv.restore();

        DrawArcC.drawCorner(DrawC.angle); //рисуем угол

        //рисуем новую дугу
        cv.beginPath();
        cv.strokeStyle = "#999";
        if (count % 2 == 0) cv.arc(DrawC.prev.x - DrawC.curr.len, 39, DrawC.curr.len, DrawC.angle, 0, true);
        else cv.arc(DrawC.prev.x + DrawC.curr.len, -29, DrawC.curr.len, -Math.PI, -Math.PI + DrawC.angle, false);
        cv.stroke();

        DrawC.angle += DrawC.step; //увеличиваем угол

        window.requestAnimationFrame(DrawArcC.animateArc);
    }

    setCorner(coordsTop, coordsBottom, fillColor, x, y, angle) {
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

    drawCorner(angle) {
        //высчитываем координаты нового уголка x0 + r*cos(a)/y0 + r*sin(a)
        if (count % 2 == 0) {
            var x = -(DrawC.prev.x - DrawC.curr.len) + DrawC.curr.len * Math.cos(angle);
            var y = 39 + DrawC.curr.len * Math.sin(angle);
        } else {
            var x = (DrawC.curr.x - DrawC.curr.len) + DrawC.curr.len * Math.cos(Math.PI - angle);
            var y = -(29 + DrawC.curr.len * Math.sin(Math.PI - angle));
        }
        //если дуга новая, то сохраняем параметры начального положения уголка
        if (DrawC.corner.newArc) {
            DrawC.corner.x = x;
            DrawC.corner.y = y;
            DrawC.corner.angle = angle;
            DrawC.corner.newArc = false;
        } else { //иначе скрываем предыдущий уголок
            cv.save();
            this.setCorner([-9, 5, 9, 5, 0, -3], [9, -5, -9, -5, 0, 3], "white", DrawC.corner.x, DrawC.corner.y, DrawC.corner.angle);
            cv.fill();
            cv.restore();
        }

        cv.save();
        this.setCorner([-7, 4, 7, 4, 0, -2], [7, -4, -7, -4, 0, 2], "#999", x, y, angle);
        cv.fill();
        cv.restore();

        DrawC.corner.x = x;
        DrawC.corner.y = y;
        DrawC.corner.angle = angle;
    }
}

class Initialize {
    constructor() {
        DrawC = new Draw();
        DrawArcC = new DrawArc();
        TitleC = new Title();
        Initialize.readConfig();
        h = cvel.offsetHeight;
        w = cvel.offsetWidth - 40;
        scale = w / (size * 2 + 1)
        centerY = cvel.getBoundingClientRect().top + h / 2;
        centerX = cvel.getBoundingClientRect().left + w / 2 + 20;
        count = 0; //текущий номер 
        imp.style.display = "none";
    }

    static readConfig() {
        config = fs.readFileSync("./config.json", 'utf-8');
        config = JSON.parse(config);
        TitleC.tips = config.tips;
        size = config.size;
        range.value = size;
    }

    static initCanvasProps() {
        cv.textAlign = "center"; //центрированике текста по-центру
        DrawC.drawXAxis();
        DrawC.drawCirWN(); //отрисовываем первый номер
        TitleC.setTitle();
        count = 1; //текущий номер   
    }

    static reInit() {
        cv.clearRect(-w / 2 - 20, -h / 2, w + 40, h);
        new Initialize();
        Initialize.initCanvasProps();
    }
}

//инициализация стандартных значений и свойств, отрисовка
new Initialize();
cv.translate((w + 40) / 2, h / 2); //помещаем начало координат в середину
Initialize.initCanvasProps();

range.addEventListener('input', function () {
    let s = Number.parseInt(range.value);
    if (!isNaN(s))
        if (s != size) {
            if (s > 8) s = 8;
            config.size = Math.abs(s);
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
            Initialize.reInit();
        }
});

refresh.addEventListener('click', function () {
    Initialize.reInit();
});

document.addEventListener('click', function (e) {
    let el = e.target;
    while (el.tagName != "HTML") {
        if (el.tagName == "CANVAS" || el.id == "imp") {
            DrawC.Next();
            document.getElementById("open").checked = false;
            break;
        } else {
            el = el.parentNode;
        }
    }
});