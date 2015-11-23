var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var RADIUS = 70;
var COLORS = ["red", "crimson", "darkred", "firebrick", "maroon", "orangered", "tomato"];
var COLORSTWO = ["whitesmoke", "aqua", "blue", "yellow", "cyan", "white"];
var COLORSTHREE = ["darkgray", "dimgray", "gainsboro", "ghostwhite", "lightslategray", "silver"];

var RADIUS_SCALE = 1;
var RADIUS_SCALE_MIN = .5;
var RADIUS_SCALE_MAX = 3;

var QUANTITY = 1000;

var canvas;
var context;
var particles;

var mouseX = SCREEN_WIDTH * 0.5;
var mouseY = SCREEN_HEIGHT * 0.5;
var mouseIsDown = false;

var step = 5;
var steps = 50;
var delay = 20;

var aPressed = false;
var dPressed = false;

function init() {

  canvas = document.getElementById('lost');

  if (canvas && canvas.getContext) {
    context = canvas.getContext('2d');
    
    context.fillStyle = "tomato";
    context.font = "10pt Helvetica";
    context.textAlign = "center";
    context.textBaseline = "middle";
    textSmallToBig();

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    window.addEventListener('mousemove', documentMouseMoveHandler, false);
    window.addEventListener('mousedown', documentMouseDownHandler, false);
    window.addEventListener('mouseup', documentMouseUpHandler, false);
    document.addEventListener('touchstart', documentTouchStartHandler, false);
    document.addEventListener('touchmove', documentTouchMoveHandler, false);
    window.addEventListener('resize', windowResizeHandler, false);

    createParticles();

    windowResizeHandler();

    setInterval(loop, 1000 / 60);
  }
}

function textSmallToBig() {
  step++;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = step + "pt Helvetica";
  context.fillText("CLICK TO GET LOST", 0, 0);
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

function keyDownHandler(e) {
        if(e.keyCode == 65) {
            aPressed = true;
        }
        else if(e.keyCode == 68) {
            dPressed = true;
        }
    }
function keyUpHandler(e) {
        if(e.keyCode == 65) {
            aPressed = false;
        }
        else if(e.keyCode == 68) {
            dPressed = false;
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

   if(aPressed) {
     particle.fillColor = COLOURSTWO[Math.floor(Math.random() * COLORSTWO.length)];
   } else if(dPressed) {
     particle.fillColor = COLOURSTHREE[Math.floor(Math.random() * COLORSTHREE.length)];
   }

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
    particle.position.x = Math.max(Math.min(particle.position.x, SCREEN_WIDTH), 0);
    particle.position.y = Math.max(Math.min(particle.position.y, SCREEN_HEIGHT), 0);

    particle.size += (particle.targetSize - particle.size) * 0.05;

    if (Math.round(particle.size) == Math.round(particle.targetSize)) {
      particle.targetSize = 5;
    }

    context.beginPath();
    context.fillStyle = particle.fillColor;
    context.strokeStyle = particle.fillColor;
    context.lineWidth = particle.size;
    context.moveTo(lp.x, lp.y);
    context.lineTo(particle.position.x, particle.position.y);
//context.stroke();
    context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
    context.fill();

  }
}


window.onload = init;