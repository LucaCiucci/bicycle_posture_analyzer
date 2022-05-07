"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawAngleBetweenKeypoints = exports.intersection2LinesFromPoints = exports.vFromXY = exports.Vector = void 0;
class Vector {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    add(v) {
        let r = new Vector;
        r.x = this.x + v.x;
        r.y = this.y + v.y;
        return r;
    }
    opposite() {
        let r = new Vector;
        r.x = -this.x;
        r.y = -this.y;
        return r;
    }
    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}
exports.Vector = Vector;
function vFromXY(x, y) {
    let r = new Vector;
    r.x = x;
    r.y = y;
    return r;
}
exports.vFromXY = vFromXY;
function dist(a, b) {
    return a.add(b.opposite()).norm();
}
// ax + bx + c = 0
class ImplicitLine {
    constructor() {
        this.a = 0;
        this.b = 0;
        this.c = 0;
    }
}
function lineForm2Points(p0, p1) {
    /*
     x  - x0     y  - y0
    --------- = ---------    =>    (y1 - y0) x + (x0 - x1) y + ((y0 - y1) x0 + (x1 - x0) y0) = 0
     x1 - x0     y1 - y0
    */
    let l = new ImplicitLine;
    l.a = p1.y - p0.y;
    l.b = p0.x - p1.x;
    l.c = (p0.y - p1.y) * p0.x + (p1.x - p0.x) * p0.y;
    return l;
}
function intersection2Lines(l1, l2) {
    // simplified formula from here:
    // https://www.cuemath.com/geometry/intersection-of-two-lines/
    let r = new Vector;
    r.x = (l1.b * l2.c - l2.b * l1.c) / (l1.a * l2.b - l2.a * l1.b);
    r.y = (l1.c * l2.a - l2.c * l1.a) / (l1.a * l2.b - l2.a * l1.b);
    return r;
}
function intersection2LinesFromPoints(a0, a1, b0, b1) {
    return intersection2Lines(lineForm2Points(a0, a1), lineForm2Points(b0, b1));
}
exports.intersection2LinesFromPoints = intersection2LinesFromPoints;
function drawAngleBetweenKeypoints(canvas, ctx, results, idx_a0, idx_a1, idx_b0, idx_b1) {
    if (!results)
        return;
    if (!results.poseLandmarks)
        return;
    let _a0 = results.poseLandmarks[idx_a0];
    let _a1 = results.poseLandmarks[idx_a1];
    let _b0 = results.poseLandmarks[idx_b0];
    let _b1 = results.poseLandmarks[idx_b1];
    function makePositive(alpha) {
        if (alpha < 0)
            return Math.PI * 2 + alpha;
        return alpha;
    }
    if (_a0 && _a1 && _b0 && _b1) {
        let a0 = vFromXY(_a0.x * canvas.width, _a0.y * canvas.height);
        let a1 = vFromXY(_a1.x * canvas.width, _a1.y * canvas.height);
        let b0 = vFromXY(_b0.x * canvas.width, _b0.y * canvas.height);
        let b1 = vFromXY(_b1.x * canvas.width, _b1.y * canvas.height);
        let d1 = a1.add(a0.opposite());
        let d2 = b1.add(b0.opposite());
        let v = intersection2LinesFromPoints(a0, a1, b0, b1);
        /*ctx.fillStyle = "#00FF00";
        ctx.beginPath();
        ctx.arc(v.x, v.y, 5, 0, 2 * Math.PI);
        ctx.fill();*/
        let alpha1 = makePositive(Math.atan2(d1.y, d1.x));
        let alpha2 = makePositive(Math.atan2(d2.y, d2.x));
        if (alpha1 > alpha2)
            [alpha1, alpha2] = [alpha2, alpha1];
        let ccw = (alpha2 - alpha1) > Math.PI;
        ctx.fillStyle = "#0088FF88";
        ctx.beginPath();
        ctx.arc(v.x, v.y, 50, alpha1, alpha2, ccw);
        ctx.arc(v.x, v.y, 25, alpha2, alpha1, !ccw);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#000000";
        ctx.font = "30px Arial";
        let txt = ((ccw ? alpha1 - alpha2 + Math.PI * 2 : alpha2 - alpha1) * 180 / Math.PI).toFixed(1) + "°";
        ctx.fillText(txt, v.x + 25, v.y);
        ctx.strokeText(txt, v.x + 25, v.y);
    }
}
exports.drawAngleBetweenKeypoints = drawAngleBetweenKeypoints;
