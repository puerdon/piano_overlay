const CUR = 9;
const ZOOM = 20;
const l = 88;
const lines = l + CUR;
const STEPS = 500;
const GRAIN = 0.05;
let time = 0;
let UNIT;
let midiInput = null;
let firstTime = true;
let keyPressed = new Array(l).fill(false);
var points = m = Array.from({ length: l }, e => Array.from({ length: STEPS }, e => Array.from({ length: 2 }, e => 0)));

function setup() {
    WebMidi
        .enable()
        .then()
        .catch(err => alert(err));

    createCanvas(1350, 800);
    background(0);

    UNIT = height / ZOOM;
    stroke('rgba(255, 255, 255 ,0.4)');
    // fill(125);
    strokeWeight(UNIT * 0.03);
    // noFill();
    fill(0);

    // init
    for (let cur = CUR; cur < lines; cur++) {
        for (let step = 0; step <= STEPS; step++) {
            points[cur - CUR][step] = updateNoise(step, cur);
        }
    }

    drawLine(points, null);

    noLoop();
}


function draw() {

    background(0);

    for (let cur = CUR; cur < lines; cur++) {
        // console.log(cur);
        if (keyPressed[cur - CUR]) {
            for (let step = 0; step <= STEPS; step++) {
                points[cur - CUR][step] = updateNoise(step, cur);
            }
        }
    }
    drawLine(points, null);

}

function updateNoise(step, cur) {
    let x = width * (step / STEPS);
    let y = height * (cur / lines);

    let offset = noise(step * GRAIN + cur * 500 + frameCount / 10) * UNIT * 1;
    offset *= 1;

    let distance = abs(step - STEPS / 2) / (STEPS / 2);
    distance = 1 - distance;
    distance **= 2;

    return [x, y - offset * distance]
}




function drawLine(points, cur) {
    // var counter = 0;
    // console.log(counter)
    push();
    colorMode(HSB, 100);
    // stroke(cur, 25, 100);
    for (let [index, point] of points.entries()) {
        // console.log(index);
        beginShape();
        if (keyPressed[index]) {
            stroke('rgba(255, 255, 255 ,1)');
        } else {
            stroke('rgba(255, 255, 255 ,0.4)');
        }
        for (let s of point) {
            

            vertex(s[0], s[1]);
            

            // counter++;

        }
    endShape();

    }
    pop();
}

function fillLayer(points) {
    push();
    noStroke();
    fill(0);
    beginShape();
    vertex(width / 2 - height / 2, height);
    for (let point of points) {
        vertex(point[0], point[1]);
    }
    vertex(width / 2 + height / 2, height);
    endShape(CLOSE);
    pop();
}

function loadMidiInput(id) {
    midiInput = WebMidi.inputs[id];
    console.log(midiInput);
    console.log('midi input loaded!')
    midiInput.channels[1].addListener("noteon", e => {
        // keyPressed[e.note.number - 21] = true;
        // console.log(-(e.note.number) + 108);
        keyPressed[-(e.note.number) + 108] = true;

        // console.log(`${e.note.number}`);
    });
    midiInput.channels[1].addListener("noteoff", e => {
        // keyPressed[e.note.number - 21] = false;
        keyPressed[-(e.note.number) + 108] = false;

        // console.log(`${e.note.number}`);
    });
}

function mousePressed() {
    loadMidiInput(0);
    loop();
}