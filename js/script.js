'use strict';

var cvel = document.getElementById("canvas"), //Canvas element
    cv = cvel.getContext("2d"), //2d context
    impW = 250,
    elc = document.querySelector("#imp .corner"), //уголок элемента imp
    h, w, //размер canvas
    scale, //масштаб 
    centerY, centerX, //центр холста
    count, //текущий номер 
    config,
    animCir,
    animArc;

var DrawC, DrawArcC, TipC; //классы

const fs = require("fs"); //filesystem lib node.js
const impTip = require(__dirname + '/js/tip');
const impDraw = require(__dirname + '/js/draw');
const impDrawArc = require(__dirname + '/js/drawarc');

class Initialize {
    constructor() {
        DrawC = new impDraw.constructor;
        DrawArcC = new impDrawArc.constructor;
        TipC = new impTip.constructor;
        Initialize.readConfig();
        h = cvel.offsetHeight;
        w = cvel.offsetWidth - 40;
        scale = w / (config.size * 2 + 1)
        centerY = cvel.getBoundingClientRect().top + h / 2;
        centerX = cvel.getBoundingClientRect().left + w / 2 + 20;
        count = 0; //текущий номер 
        imp.style.display = "none";
    }

    static readConfig() {
        config = fs.readFileSync(__dirname + "/config.json", 'utf-8');
        config = JSON.parse(config);
        config.size = Number.parseInt(config.size);
        if (isNaN(config.size)) {
            config.size = 0;
            fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, null, 4));
        } else {
            if (config.size > 8) config.size = 8;
            config.size = Math.abs(config.size);
            fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, null, 4));
        }
        range.value = config.size;
    }

    static initCanvasProps() {
        cv.textAlign = "center"; //центрированике текста по-центру
        DrawC.drawXAxis();
        DrawC.drawCirWN(); //отрисовываем первый номер
        TipC.setTip();
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
        if (s != config.size) {
            if (s > 8) s = 8;
            config.size = Math.abs(s);
            fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, null, 4));
            Initialize.reInit();
        }
});

refresh.addEventListener('click', function () {
    window.cancelAnimationFrame(animCir);
    window.cancelAnimationFrame(animArc);
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