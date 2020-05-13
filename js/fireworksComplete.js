var gravity = 0.06;
var negativeGravity = -0.09;
var fading = 0.1; 
var launchNum = 1;
var intervalHandle = 0;
var timer = 4000;

var Fireworks = (function () {

    // declare the variables we need
    var particles = [],
        mainCanvas = null,
        mainContext = null,
        fireworkCanvas = null,
        fireworkContext = null,
        viewportWidth = 0,
        viewportHeight = 0;

    /**
     * Create DOM elements and get your game on
     */
    function initialize() {

        // start by measuring the viewport
        onWindowResize();

        // create a canvas for the fireworks
        mainCanvas = document.createElement('canvas');
        mainContext = mainCanvas.getContext('2d');

        fireworkCanvas = document.createElement('canvas');
        fireworkContext = fireworkCanvas.getContext('2d');

        createFireworkPalette(12)
        // set the dimensions on the canvas
        setMainCanvasDimensions();

        // add the canvas in
        document.body.appendChild(mainCanvas);
        mainCanvas.addEventListener('mouseup', createFirework, true);
        //document.addEventListener('touchend', createFirework, true); -> For mobile devices

        //Adding events for each button on user preference panel
        document.getElementById("gravUp").addEventListener('click', incrementGravity, true);
        document.getElementById("gravDown").addEventListener('click', decrementGravity, true);

        document.getElementById("particleUp").addEventListener('click', incrementParticles, true);
        document.getElementById("particleDown").addEventListener('click', decrementParticles, true);

        document.getElementById("launchUp").addEventListener('click', incrementLaunchNum, true);
        document.getElementById("launchDown").addEventListener('click', decrementLaunchNum, true);

        document.getElementById("timerUp").addEventListener('click', incrementTimer, true);
        document.getElementById("timerDown").addEventListener('click', decrementTimer, true);

        document.getElementById("autoLaunchSwitch").addEventListener('click', autoLaunch, true);

        //intervalHandle = window.setInterval(createFirework, 5000)
        update();
    }

    //Functions to increment global variables to be changed in user preference panel
    function incrementGravity() {
          if (gravity <= 0.84) {
              gravity += 0.03;
          }
          else {
              gravity = 0.9;
          }
      
      }

      function decrementGravity() {
          if (gravity >= 0.03) {
              gravity -= 0.03;
          }
          else {
              gravity = 0;
          }
      }

    function autoLaunch() {
        if (document.getElementById("autoLaunchSwitch").checked == true) {
            intervalHandle = window.setInterval(createFirework, timer);
        }
        else {
            window.clearInterval(intervalHandle); //turn off interval
            intervalHandle = 0;
        }
    }

    function incrementTimer() {
        timer += 1000;
        window.clearInterval(intervalHandle);
        intervalHandle = window.setInterval(createFirework, timer);
    }

    function decrementTimer() {
        if (timer >= 2000) {
            timer -= 1000;
        }
        else {
            timer = 1000;
        }
        window.clearInterval(intervalHandle);
        intervalHandle = window.setInterval(createFirework, timer);
    }

   function incrementParticles() {
              fading -= 0.05;
   }

   function decrementParticles() {
       fading += 0.05;
   }

  function incrementLaunchNum() {
      if (launchNum <= 11) {
          launchNum += 1;
      }
      else {
          launchNum = 12;
      }
  }

 function decrementLaunchNum() {
      if (launchNum >= 2) {
          launchNum -= 1;
      }
      else {
          launchNum = 1;
      }
  }

 function createFirework() {

      if (launchNum % 2 == 0)   // even number
      {
          var separation = viewportWidth / (launchNum + 1);
          var xPos = separation;

          for (var i = 0; i < launchNum; i++) {
              createParticle(
                {
                    x: xPos,
                    y: viewportHeight + 10
                },

                {
                    y: Math.random() * 100 + 150
                },

                {
                    x: Math.random() * 3 - 1.5,
                    y: 0
                },

                0,

                false);
              xPos += separation;
          }
      }
      else {
          // launch the middle one first
          createParticle(
            {
                x: viewportWidth * 0.5,
                y: viewportHeight + 10
            },

            {
                y: (Math.random() - 0.5) * 50 + 175 //150 + Math.random() * 100
            },

            {
                x: Math.random() - 0.5,
                y: 0
            },

            0,

            false);

          var height = 275;
          for (var i=1; i<launchNum; i+=2)
          {
              // goes to the left
              createParticle(
                {
                    x: viewportWidth * 0.5,
                    y: viewportHeight + 10
                },

                {
                    y: (Math.random() - 0.5) * 50 + height
                },

                {
                    x: -2 * (i + 1) + (Math.random() - 0.5),
                    y: 0
                },

                0,

                false);

              // goes to the right
              createParticle(
                {
                    x: viewportWidth * 0.5,
                    y: viewportHeight + 10
                },

                {
                    y: (Math.random() - 0.5) * 50 + height // Math.random() * 30 + height
                },

                {
                    x: 2 * (i + 1)+ (Math.random() - 0.5),
                    y: 0
                },

                0,

                false);

              height += 100;
          }

      }
  }

  /**
   * Creates a block of colours for the
   * fireworks to use as their colouring
   */
  function createFireworkPalette(gridSize) {

    var size = gridSize * 10;
    fireworkCanvas.width = size;
    fireworkCanvas.height = size;
	
	 fireworkContext.globalCompositeOperation = 'source-over';

    //Color Variations for Fireworks
    for(var c = 0; c < 100; c++) {

      var marker = (c * gridSize);
      var gridX = marker % size;
      var gridY = Math.floor(marker / size) * gridSize;

      fireworkContext.fillStyle = "hsl(" + Math.round(c * 3.6) + ",100%,60%)";
      fireworkContext.fillRect(gridX, gridY, gridSize, gridSize);
      fireworkContext.drawImage(
        Library.bigGlow,
        gridX,
        gridY);
    }
  }

  /**
   * Update the canvas based on the
   * detected viewport size
   */
  function setMainCanvasDimensions() {
    mainCanvas.width = viewportWidth*0.9;
    mainCanvas.height = viewportHeight*0.9;
  }

  /**
   * The main loop where everything happens
   */
  function update() {
    clearContext();
    requestAnimFrame(update);
    drawFireworks();
  }

  /**
   * Clears out the canvas with semi transparent
   * black. The bonus of this is the trails effect we get
   */
  function clearContext() {
    mainContext.fillStyle = "rgba(0,0,0,0.2)";
    mainContext.fillRect(0, 0, viewportWidth, viewportHeight);
  }

  /**
   * Passes over all particles particles
   * and draws them
   */
  function drawFireworks() {
    var a = particles.length;

    while(a--) {
      var firework = particles[a];
      // if the update comes back as true
      // then our firework should explode
      if(firework.update()) {

        // kill off the firework, replace it
        // with the particles for the exploded version
        particles.splice(a, 1);

        // if the firework isn't using physics
        // then we know we can safely(!) explode it... yeah.
        if(!firework.usePhysics) {

          //if(Math.random() < 0.8) 
            FireworkExplosions.circle(firework);
          
        }
      }

      // pass the canvas context and the firework
      // colours to the
      firework.render(mainContext, fireworkCanvas);
    }
  }
  
  

  /**
   * Creates a new particle / firework
   */
  function createParticle(pos, target, vel, color, usePhysics) {

    pos = pos || {};
    target = target || {};
    vel = vel || {};

    particles.push(
      new Particle(
        // position
        {
          x: pos.x || viewportWidth * 0.5,
          y: pos.y || viewportHeight + 10
        },

        // target
        {
            y: target.y || 150 + Math.random() * 100
            //y: target.y || viewportHeight * 0.5
        },

        // velocity
        {
          x: vel.x || Math.random() * 3 - 1.5,
          y: vel.y || 0
        },

        color || Math.floor(Math.random() * 100) * 12,

        usePhysics)
    );
  }

  function onWindowResize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  }

  // declare an API
  return {
    initialize: initialize,
    createParticle: createParticle
  };

})();

/**
 * Represents a single point, so the firework being fired up
 * into the air, or a point in the exploded firework
 */
var Particle = function(pos, target, vel, marker, usePhysics) {

    if (document.getElementById("gravitySwitch").checked==true) {
        this.GRAVITY = negativeGravity;
    }
    else {
        this.GRAVITY =  gravity
    }
   
  this.alpha    = 1;
  this.easing   = Math.random() * 0.02;
  this.fade     = fading * Math.random(); 
  this.gridX    = marker % 120;
  this.gridY    = Math.floor(marker / 120) * 12;
  this.color    = marker;

  this.pos = {
    x: pos.x || 0,
    y: pos.y || 0
  };

  this.vel = {
    x: vel.x || 0,
    y: vel.y || 0
  };

  this.lastPos = {
    x: this.pos.x,
    y: this.pos.y
  };

  this.target = {
    y: target.y || 0
  };

  this.usePhysics = usePhysics || false;

};

//Functions available to all fireworks
Particle.prototype = {

  update: function() {

    this.lastPos.x = this.pos.x;
    this.lastPos.y = this.pos.y;

    if(this.usePhysics) {
      this.vel.y += this.GRAVITY;
      this.pos.y += this.vel.y;

      this.alpha -= this.fade;
    } else {

      var distance = (this.target.y - this.pos.y);

      // ease the position
        this.pos.y += distance * (0.03 + this.easing);
        //this.pos.y = this.target.y;

      // cap to 1
        this.alpha = Math.min(distance * distance * 0.00005, 1);
        //this.alpha = 0.004;
    }

    this.pos.x += this.vel.x;

    return (this.alpha < 0.005);
  },

  render: function(context, fireworkCanvas) {

    var x = Math.round(this.pos.x),
        y = Math.round(this.pos.y),
        xVel = (x - this.lastPos.x) * -5,
        yVel = (y - this.lastPos.y) * -5;

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.globalAlpha = Math.random() * this.alpha;

    // draw the line from where we were to where
    // we are now
    context.fillStyle = "rgba(255,255,255,0.3)";
    context.beginPath();
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.pos.x + 1.5, this.pos.y);
    context.lineTo(this.pos.x + xVel, this.pos.y + yVel);
    context.lineTo(this.pos.x - 1.5, this.pos.y);
    context.closePath();
    context.fill();

    // draw in the images
    context.drawImage(fireworkCanvas,
      this.gridX, this.gridY, 12, 12,
      x - 6, y - 6, 12, 12);
    context.drawImage(Library.smallGlow, x - 3, y - 3);

    context.restore();
  }

};

/**
 * Stores references to the images that
 * we want to reference later on
 */
var Library = {
  bigGlow: document.getElementById('big-glow'),
  smallGlow: document.getElementById('small-glow')
};

/**
 * Stores a collection of functions that
 * we can use for the firework explosions. Always
 * takes a firework (Particle) as its parameter
 */
var FireworkExplosions = {

  /**
   * Explodes in a circular fashion
   */
  circle: function(firework) {

    var count = 100;
    var angle = (Math.PI * 2) / count;
    var randomColor = true;
    if (Math.random() < 0.5)
        randomColor = false;

    while(count--) {

      var randomVelocity = 4 + Math.random() * 4;
      var particleAngle = count * angle;
      var color;
      if (randomColor == true)
          color = Math.floor(Math.random() * 100) * 12;
      else
          color = firework.color;

      Fireworks.createParticle(
        firework.pos,
        null,
        {
          x: Math.cos(particleAngle) * randomVelocity,
          y: Math.sin(particleAngle) * randomVelocity
        },

        color,

        true);
    }
  }

};

// Go
window.onload = function() {
  Fireworks.initialize();
};
