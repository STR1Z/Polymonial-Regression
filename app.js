let input = document.getElementById("in");
let feedback = document.getElementById("fb");

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 480;

document.body.append(canvas);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  render() {
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.ellipse(this.x * canvas.width, this.y * canvas.height, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Graph {
  constructor() {
    this.data = [];
  }

  push(point) {
    this.data.push(point);
  }

  render() {
    for (let point of this.data) {
      point.render();
    }
  }
}

class Line {
  constructor(degree) {
    this.degree = degree;
    this.data = [];
    this.loss = 0;
    for (let i = 0; i < this.degree + 1; i++) {
      this.data[i] = 0;
    }
  }

  getValue(x) {
    let sum = this.data[0];
    for (let i = 1; i < this.data.length; i++) {
      sum += this.data[i] * x ** i;
    }
    return sum;
  }

  render() {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.moveTo(0, this.getValue(0) * canvas.height);
    for (let x = 1; x <= canvas.width; x++) {
      ctx.lineTo(x, this.getValue(x / canvas.width) * canvas.height);
    }
    ctx.stroke();
    this.displayLoss();
  }

  getError(point) {
    return point.y - this.getValue(point.x);
  }

  gradientDescent(points, lr) {
    let loss = 0;
    for (let point of points) {
      let error = this.getError(point);
      loss += error ** 2;

      this.data[0] += error * lr;

      for (let i = 1; i < this.data.length; i++) {
        this.data[i] += error * point.x ** i * lr;
      }
    }

    this.loss = Math.round(loss * 1e8) / 1e8;
  }

  displayLoss() {
    ctx.fillStyle = "white";
    ctx.font = "15px Helvetica";
    let dataText = ""
    for(let i of this.data) dataText += `[${i}] `
    ctx.fillText(`~ loss : ${this.loss}, data : ${dataText}`, 10, canvas.height - 10);
    
  }
}

canvas.addEventListener("click", e => {
  let x = (e.clientX - canvas.offsetLeft + scrollX) / canvas.width;
  let y = (e.clientY - canvas.offsetTop + scrollY) / canvas.height;
  graph.push(new Point(x, y));
});

let graph = new Graph();
let line = new Line(parseInt(prompt("Expression Degree (v1)")));

function render() {
  requestAnimationFrame(render);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  graph.render();
  for (let c = 0; c < input.value ** 2; c++) {
    line.gradientDescent(graph.data, 0.1);
  }
  line.render();
  feedback.innerHTML = "speed : " + input.value;
}

render();
