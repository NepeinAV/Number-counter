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
        if (count % 2 == 0)
            cv.arc(DrawC.prev.x - DrawC.curr.len, 39, DrawC.curr.len, DrawC.angle, 0, true);
        else
            cv.arc(DrawC.prev.x + DrawC.curr.len, -29, DrawC.curr.len, -Math.PI, -Math.PI + DrawC.angle, false);
        cv.stroke();
        cv.restore();

        DrawArcC.drawCorner(); //рисуем угол

        //рисуем новую дугу
        cv.beginPath();
        cv.strokeStyle = "#999";
        if (count % 2 == 0)
            cv.arc(DrawC.prev.x - DrawC.curr.len, 39, DrawC.curr.len, DrawC.angle, 0, true);
        else
            cv.arc(DrawC.prev.x + DrawC.curr.len, -29, DrawC.curr.len, -Math.PI, -Math.PI + DrawC.angle, false);
        cv.stroke();

        DrawC.angle += DrawC.step; //увеличиваем угол

        animArc = window.requestAnimationFrame(DrawArcC.animateArc);
    }

    setCorner(coords, fillColor, x, y, angle) {
        cv.translate(x, y);
        cv.rotate(angle);
        cv.fillStyle = fillColor;
        cv.beginPath();
        if (count % 2 == 0) coords = [-coords[0], -coords[1], -coords[2], -coords[3], coords[4], -coords[5]];
        cv.moveTo(coords[0], coords[1]);
        cv.lineTo(coords[2], coords[3]);
        cv.lineTo(coords[4], coords[5]);
    }

    drawCorner() {
        //высчитываем координаты нового уголка x0 + r*cos(a)/y0 + r*sin(a)
        if (count % 2 == 0) {
            var x = -(DrawC.prev.x - DrawC.curr.len) + DrawC.curr.len * Math.cos(DrawC.angle);
            var y = 39 + DrawC.curr.len * Math.sin(DrawC.angle);
        } else {
            var x = (DrawC.curr.x - DrawC.curr.len) + DrawC.curr.len * Math.cos(Math.PI - DrawC.angle);
            var y = -(29 + DrawC.curr.len * Math.sin(Math.PI - DrawC.angle));
        }
        //если дуга новая, то сохраняем параметры начального положения уголка
        if (DrawC.corner.newArc) {
            DrawC.corner = {
                x: x,
                y: y,
                angle: DrawC.angle,
                newArc: false
            }
        } else { //иначе скрываем предыдущий уголок
            cv.save();
            this.setCorner([-9, 5, 9, 5, 0, -3], "white", DrawC.corner.x, DrawC.corner.y, DrawC.corner.angle);
            cv.fill();
            cv.restore();
        }

        cv.save();
        this.setCorner([-7, 4, 7, 4, 0, -2], "#999", x, y, DrawC.angle);
        cv.fill();
        cv.restore();

        DrawC.corner = {
            x: x,
            y: y,
            angle: DrawC.angle
        }
    }
}

module.exports = new DrawArc();