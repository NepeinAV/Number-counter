class Tip {
    constructor() {
        this.count = 0;
    }

    setTip() {
        let pos = (count + 1) % 2;
        pos == 1 ? pos = ~~(-(count + 1) / 2) : pos = ~~((count + 1) / 2);
        if (this.count > config.tips.length - 1 || config.tips[pos] == undefined) {
            imp.style = "display: none";
            imp.className = "";
            return 1;
        }

        imp.style.display = "block";
        imp.querySelector('span').innerHTML = config.tips[pos].text;

        let x, y;
        x = centerX - impW + scale * pos;
        if (config.tips[pos].loc == "b") {
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

module.exports = new Tip();