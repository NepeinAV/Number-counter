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
        cv.save();
        cv.font = "20px Calibri Light";
        cv.fillText("x", w / 2, 20);
        cv.restore();
        //координаты
        cv.beginPath();
        cv.moveTo(0, -3);
        cv.lineTo(0, 3);
        cv.fillText(0, 0, -11);
        for (var i = 0; i <= config.size; i++) {
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
        if (count >= config.size * 2 + 1 || !this.animReady) return 1;
        this.animReady = 0;
        let x, len;
        if (count % 2 == 0) x = -count / 2 * scale;
        else x = (count + 1) / 2 * scale;
        len = Math.abs((x - this.prev.x) / 2);
        this.curr = {
            x: x,
            len: len
        }
        DrawArcC.animateArc();
        TipC.setTip();
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
        animCir = window.requestAnimationFrame(DrawC.drawCirWN);
    }
}

module.exports = new Draw();