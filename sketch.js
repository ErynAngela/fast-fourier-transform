var song
var fft
var particles = []

function preload(){
  song = loadSound('asd.mp3') //loads the song
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  fft = new p5.FFT()
}

function draw() {
  background(30);

  c1 = color(166, 96, 139);
  c2 = color(52, 83, 105);
  for(let y = 0; y < height; y++){ //background
    n = map(y, 0, height, 0, 1);
    var bg = lerpColor(c2,c1,n);
    stroke(bg);
    line(0,y,width, y);
  }

  stroke(255)
  noFill()

  var spectrum = fft.analyze() //getting the array of frequency amplitude values
  amp = fft.getEnergy(20, 200) //getting the frequency
  var wave = fft.waveform() //getting the array of waveform amplitude values 

  translate(width/2, height/2)
  for(var t = -1; t <= 1; t += 2){ //circle wave
    beginShape()
    strokeWeight(2)
    for(var i = 0; i <= 140; i += 1.5){
      var index = floor(map(i, 40, 140, 0, wave.length))
      
      var r = map(wave[index], -1, 1, 200, 420)
      
      var x = r * sin(i) * t
      var y = r * cos(i) * t
      vertex(x,y)
    }
    endShape()
  }

  translate(0, -(height/2))
  stroke(255, 100)
  strokeWeight(1)
  for(j = 0; j < 2; j++){ //line in the middle
    for(i = 2; i < height+100; i+=5){
      fill(i-30, 200, spectrum[i]+100)
      rect(i, height/2, 0.6, max(0, (spectrum[i]-120)))
      rectMode(CENTER)
    }
    translate(0, height)
    rotate(180)
  }
  
  translate(0, height/2)
  var p = new Particle()
  particles.push(p)

  for(var i = particles.length - 1; i >= 0; i--){
    if(!particles[i].edges()){
      particles[i].update(amp > 225)
      particles[i].show()
    }else{
      particles.splice(i, 1)
    }
  }

}

function mouseClicked(){
  if (song.isPlaying()){
    song.pause()
    // noLoop()
  }else{
    song.loop()
    // song.play()
    // loop()
  }
}

class Particle{ //particles
  constructor(){
    this.pos = p5.Vector.random2D().mult(310)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.0001))

    this.w = random(2, 15)
    this.color = [random(200, 255), random(200, 255), random(200, 255), random(20, 200)]
  }
  update(cond){ //updating the particles position
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if(cond){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  edges(){ //remove particles
    if(this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2){
      return true
    }else{
      return false
    }
  }
  show(){
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}