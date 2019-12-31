let trail_count = 50;
let floor;
let pillars = [];
let frame_counter;
let gap_size = 170;
let img;
let game_over = false;
let touching = false;
let score = 0;
var old_gap = 300;
function preload() {
  img = loadImage('assets/crabman.png');
}

function setup() {
  score = 0;
  frame_counter = 0;
  pillars = [];
  // put setup code here
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  floor = 3 * height / 4;
  player = new Player();
  global_x = 0;
  loop();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  frame_counter += 1;
  if(frame_counter > 100){
    frame_counter = 0;
    score += 1;
    var a = new obstacle(old_gap)
    old_gap = a.gap_bottom;
    pillars.push(a);
  }
  // put drawing code here


  background(204, 226, 225);
  player.update();
  player.draw_trail();
  fill(150, 200, 150, 255);
  rect(0, floor, width * 2,  height - floor);
  fill(255);
  player.display();

  for (var i = 0; i < pillars.length; i++) {
    pillars[i].update();
    pillars[i].draw();
    if(pillars[i].x < -100){
      pillars.splice(i, 1);
    }
    if(pillars[i].x < player.x + 100 && pillars[i].x >= player.x){
      if(player.y > pillars[i].gap_bottom - 100 || player.y < pillars[i].gap_bottom - gap_size){
        fill(0, 0, 0, 230);
        rect(0, 0, width, height);
        textSize(height/14);
        textAlign(CENTER);
        fill(255, 0, 0)
        text("You got too close to a super spooky wall and had a heart attack, killing you instantly.", width/6, height/6, 4*width/6, 4*height/6)
        game_over = true;
        noLoop();
        break;
      }
      //noLoop();
    }

  }

  textSize(height/10);
  textAlign(CENTER);
  fill(100, 100, 100)
  text("Score", 2*width/6, floor + height/7);
  text(score, 4 * width/6, floor + height/7);


  //global_x += 5;

}

function keyPressed() {
  if (keyCode === 32) {
    if(player.in_air != true){
      player.in_air = true;
      this.y_v = 1;
    }
    if(game_over == true){
      game_over = false;
      setup();
    }
  }
  if (keyCode === ENTER) {
    if(game_over == true){
      game_over = false;
      setup();
    }
  }
}

function touchStarted(){
  if(game_over == true){
    game_over = false;
    setup();
  }
  if(player.in_air != true){
    player.in_air = true;
    this.y_v = 1;
  }
  touching = true;
}

function touchEnded(){
  touching = false;
}
class Player {
  constructor() {
    this.x = width / 4;
    this.y = floor - 50;
    this.y_v = 0;
    //this.y_a = 0;
    this.in_air = false;
    this.diameter = 100;
    this.trail = [];
    for (let i = 0; i < trail_count ; i += 1) {
      this.trail[i] = new trail_info(-100, -100);
    }
    this.trail_pointer = 0;

  }
  update(){
    this.y_v += .1;
    if (keyIsDown(32) || touching) {
      if(player.in_air == true){
        player.y_v -= .2;
        this.trail[this.trail_pointer % trail_count] = new trail_info(this.x + (this.diameter/2.9), (this.y + this.diameter/1.75) );
      }else {
        this.trail[this.trail_pointer % trail_count] = new trail_info(-100, -100);
      }
    }else{
      this.trail[this.trail_pointer % trail_count] = new trail_info(-100, -100);
    }
    this.trail_pointer = (this.trail_pointer + 1) % trail_count;
    if(this.y_v > 7){
      this.y_v = 7;
    }
    if(this.y_v < -7){
      this.y_v = -7;
    }
    this.y += this.y_v;
    if (this.y > floor - this.diameter){
      this.y = floor - this.diameter;
      this.y_v = 0;
      player.in_air == false;
    }
    if (this.y < 0 ){
      this.y = 0;
      this.y_v = 0;
    }

  }

  draw_trail(){

    for (let i = 0; i < trail_count ; i += 1) {
      var trail_i = this.trail[(i + this.trail_pointer) % trail_count];
      if(trail_i.y != -100){
        trail_i.draw_trail();
        trail_i.update();
      }
    }

  }

  display() {
    image(img, this.x, this.y,  this.diameter, this.diameter);
  }
}

class trail_info {
  constructor(x_i, y_i){
    this.x = x_i;
    this.y = y_i;
    this.oc = 230;
    this.w = 20;
    this.h = 10;
  }
  update(){
    this.x -= 5;
    this.y += 5;
    this.oc *= .9;
    this.w *= 1.07;
    this.h *= 1.05;
  }
  draw_trail(){
    strokeWeight(0);
    fill(0, 255, 0, this.oc);
    ellipse(this.x, this.y, this.w, this.h);
    fill(255);
    strokeWeight(1);
  }
}

class obstacle{
  constructor(old){
    this.gap_bottom = random(0 + gap_size, floor);
    while(this.gap_bottom - old > 350 || old - this.gap_bottom > 350){
      this.gap_bottom = random(0 + gap_size, floor);
    }
    this.x = width;
    this.r = random(100, 255);
    this.g = random(100);
    this.b = random(100);
  }
  update(){
    this.x -= 5;
  }
  draw(){
    fill(this.r, this.g, this.b);
    rect(this.x, 0, 100, this.gap_bottom - gap_size);

    rect(this.x, this.gap_bottom, 100, floor - this.gap_bottom);
  }
}


//function windowResized() {
//  resizeCanvas(windowWidth, windowHeight);
//  background(255, 0, 200);
//}
