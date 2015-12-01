var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var RADIUS = 70;
var COLORS = ["red", "crimson", "darkred", "firebrick", "maroon", "orangered", "tomato"];

var RADIUS_SCALE = 1;
var RADIUS_SCALE_MIN = .5;
var RADIUS_SCALE_MAX = 3;

var QUANTITY = 500;

var canvas;
var context;
var particles;

var mouseX = SCREEN_WIDTH * 0.5;
var mouseY = SCREEN_HEIGHT * 0.5;
var mouseIsDown = false;

var step = 5;
var steps = 50;
var delay = 20;

var timer;
var timerTwo;

function init() {

  canvas = document.getElementById('lost');

  if (canvas && canvas.getContext) {
    context = canvas.getContext('2d');
    
    context.fillStyle = "white";
    context.font = "10pt Helvetica";
    context.textAlign = "center";
    context.textBaseline = "middle";

    //textSmallToBig();


    window.addEventListener('mousemove', documentMouseMoveHandler, false);
    window.addEventListener('mousedown', documentMouseDownHandler, false);
    window.addEventListener('mouseup', documentMouseUpHandler, false);
    document.addEventListener('touchstart', documentTouchStartHandler, false);
    document.addEventListener('touchmove', documentTouchMoveHandler, false);
    window.addEventListener('resize', windowResizeHandler, false);


    createParticles();

    windowResizeHandler();

    setInterval(loop, 1000 / 60);
    timer = setInterval(resizeCanvas, 20);
    timerTwo = setInterval(newShape, 200);
  }
}

function textSmallToBig() {
  step++;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = step;
  context.fillText("CLICK TO WARP", 0, 0);
  context.restore();
  if (step < steps)
    var t = setTimeout('textSmallToBig()', 20);
}

function createParticles() {
  particles = [];

  for (var i = 0; i < QUANTITY; i++) {

    var particle = {
      size: 1,
      position: {
        x: mouseX,
        y: mouseY
      },
      offset: {
        x: 0,
        y: 0
      },
      shift: {
        x: mouseX,
        y: mouseY
      },
      speed: 0.001 + Math.random() * 0.001,
      targetSize: 6 * Math.random(),
      fillColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      orbit: RADIUS + (RADIUS * Math.random()*50)
    };

    particles.push(particle);
  }
}

function documentMouseMoveHandler(event) {
  mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
  mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
}

function documentMouseDownHandler(event) {
  mouseIsDown = true;
}

function documentMouseUpHandler(event) {
  mouseIsDown = false;
}

function documentTouchStartHandler(event) {
  if (event.touches.length == 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;;
    mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
  }
}

function documentTouchMoveHandler(event) {
  if (event.touches.length == 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;;
    mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
  }
}

function windowResizeHandler() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
}


function loop() {

  if (mouseIsDown) {
    RADIUS_SCALE += (RADIUS_SCALE_MAX / 500);
  } else {
    RADIUS_SCALE -= (RADIUS_SCALE - RADIUS_SCALE_MIN) * (0.5);
  }

  RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);

  context.fillStyle = 'rgba(0,0,0,100)';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  for (i = 0, len = particles.length; i < len; i++) {
    var particle = particles[i];

    var lp = {
      x: particle.position.x,
      y: particle.position.y
    };

    //rotation
    particle.offset.x += particle.speed;
    particle.offset.y += particle.speed;

    //lag
    particle.shift.x += (mouseX - particle.shift.x) * (particle.speed) * 3;
    particle.shift.y += (mouseY - particle.shift.y) * (particle.speed) * 3;

    //position
    particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * (particle.orbit * RADIUS_SCALE);
    particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * (particle.orbit * RADIUS_SCALE);

    //bounds
    particle.position.x = Math.max(Math.min(particle.position.x));
    particle.position.y = Math.max(Math.min(particle.position.y));

    particle.size += (particle.targetSize - particle.size) * 0.05;

    if (Math.round(particle.size) == Math.round(particle.targetSize)) {
      particle.targetSize = 5;
    }

    context.beginPath();
    context.fillStyle = "ghostwhite";
    context.strokeStyle = particle.fillColor;
    context.lineWidth = particle.size;
    context.moveTo(lp.x, lp.y);
    context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
    context.fill();

    context.beginPath();
    context.fillStyle = "red";
    context.strokeStyle = particle.fillColor;
    context.lineWidth = particle.size;
    context.moveTo(lp.x / 2, lp.y / 4);
    context.arc(particle.position.x / 4, particle.position.y / 4, particle.size / 4, 0, .05, true);
    context.fill();

    context.beginPath();
    context.fillStyle = "silver";
    context.strokeStyle = particle.fillColor;
    context.lineWidth = particle.size;
    context.moveTo(lp.x * 2, lp.y * 2);
    context.rect(particle.position.x * 2, particle.position.y * 2 , 10, 10);
    context.fill();

    context.beginPath();
    context.fillStyle = "darkslategray";
    context.strokeStyle = particle.fillColor;
    context.lineWidth = particle.size;
    context.moveTo(lp.x * 3 + 10, lp.y * 3 + 70);
    context.lineTo(lp.x * 3 + 10, lp.y * 3 + 30);
    context.lineTo(lp.x * 3 + 30, lp.y * 3 + 30);
    context.lineTo(lp.x * 3 + 30, lp.y * 3 + 50);
    context.lineTo(lp.x * 3 + 50, lp.y * 3 + 50);
    context.lineTo(lp.x * 3 + 50, lp.y * 3 + 70);
    context.lineTo(lp.x * 3 + 10, lp.y * 3 + 70);
    context.lineTo(lp.x * 3 + 10, lp.y * 3 + 70);
    context.closePath();
    context.fill();

    context.beginPath();
    context.fillStyle = "slategray";
    context.strokeStyle = particle.fillColor;
    context.lineWidth = particle.size;     
    context.moveTo(lp.x * 4 + 20, lp.y * 4 + 20);
    context.lineTo(lp.x * 4 + 20, lp.y * 4 + 40);
    context.lineTo(lp.x * 4 + 40, lp.y * 4 + 40);
    context.lineTo(lp.x * 4 + 40, lp.y * 4 + 60);
    context.lineTo(lp.x * 4 + 60, lp.y * 4 + 60);
    context.lineTo(lp.x * 4 + 60, lp.y * 4 + 80);
    context.lineTo(lp.x * 4 + 80, lp.y * 4 + 80);
    context.lineTo(lp.x * 4 + 80, lp.y * 4 + 40);
    context.lineTo(lp.x * 4 + 60, lp.y * 4 + 40);
    context.lineTo(lp.x * 4 + 60, lp.y * 4 + 20);
    context.lineTo(lp.x * 4 + 20, lp.y * 4 + 20);
    context.closePath();
    context.fill();


  }
}

  function degreesToRadians(degrees) {
    //converts from degrees to radians and returns
    return (degrees * Math.PI)/180;
  }

window.onload = init;