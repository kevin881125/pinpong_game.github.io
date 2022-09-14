var GameObject = function(position,size,selector){
  this.$el = $(selector)
  this.position = position
  this.size = size
  this.$el.css("position","absolute")
  this.UpdataCss()
}
GameObject.prototype.UpdataCss=function(){
  this.$el.css("left",this.position.x)
  this.$el.css("top",this.position.y)
  this.$el.css("width",this.size.width)
  this.$el.css("height",this.size.height)
}
GameObject.prototype.collide = function(other){
  var rangex=this.position.x<other.position.x&&this.position.x+this.size.width>other.position.x
  var rangey=this.position.y<other.position.y&&this.position.y+this.size.height>other.position.y
    return rangex && rangey
}
var Ball=function(){
  this.size={width:15,height:15}
  this.position={x:250,y:250}
  this.velocity={x:-5,y:5}
  GameObject.call(this,this.position,this.size,".ball")
}
Ball.prototype = Object.create(GameObject.prototype)
Ball.prototype.constructor=Ball.constructor
Ball.prototype.updata=function(){
  this.position.x+=this.velocity.x
  this.position.y+=this.velocity.y
  this.UpdataCss()
  if(this.position.x>500||this.position.x<0){
    this.velocity.x = -this.velocity.x
  }
  if(this.position.y>500||this.position.y<0){
    this.velocity.y = -this.velocity.y
  }
    
}
Ball.prototype.init=function(){
  this.position={x:250,y:250}
  var speed = 1
  var angle = Math.random()*Math.PI*2
  this.velocity={x: speed*Math.cos(angle)
                ,y: speed*Math.sin(angle)}
  this.updata()
}

var ball = new Ball()

var Board=function(position,size,selector){
  this.size= size
  GameObject.call(this,position,this.size,selector)
}
Board.prototype = Object.create(GameObject.prototype)
Board.prototype.constuctor = Board.constuctor
Board.prototype.updata = function(){
  if(this.position.x<0){
    this.position.x=0
  }
  if(this.position.x+this.size.width>500){
    this.position.x=500-this.size.width
  }
  this.UpdataCss()
}

var board1 = new Board(
{x:0,y:30},{width:100,height:15},".b1"
)
var board2 = new Board(
{x:0,y:440},{width:200,height:35},".b2"
)

var Game = function(){
  this.timer = null
  this.grade = 0
  this.initControl()
  this.control={}
}
Game.prototype.initControl=function(){
  let _this = this
  $(window).keydown(function(evt){
     _this.control[evt.key]=true
    console.log(_this.control)
  })
   $(window).keyup(function(evt){
     _this.control[evt.key]=false
     console.log(_this.control) 
  })
}
Game.prototype.starGame = function(){
  var time = 3
  var _this=this
  this.grade = 0
  board2.size.width = 100
  board1.size.width = 100
  ball.init()
  $("button").hide()
  var timer_cunt =setInterval(function(){
    $(".infoText").text(time)
    time--
    if(time<0){
      clearInterval(timer_cunt)
      $(".info").hide()
      _this.starGameMain()
    }
  },1000)
}
Game.prototype.starGameMain=function(){
  let _this = this
  this.timer = setInterval(function(){
    if(board1.collide(ball)){
      ball.velocity.y=-ball.velocity.y
      ball.velocity.y *=1.05
      ball.velocity.x *=1.05
      ball.velocity.y +=0.5 - Math.random()
      ball.velocity.x +=0.5 - Math.random()
      
    }
     if(board2.collide(ball)){
      ball.velocity.y=-(ball.velocity.y+0.3)
       _this.grade+=10
    }
    if(ball.position.y<0){
      _this.endGame("電腦輸了")
    }
    if(ball.position.y>500){
      _this.endGame("你輸了")
    }
    if(_this.control["ArrowLeft"]){
      board2.position.x-=4
    }
    if(_this.control["ArrowRight"]){
      board2.position.x+=4
    }
    if(_this.grade>30){
      board2.size.width = 500
    }
    if(_this.grade>1000){
      board1.size.width = 500
    }
   board1.position.x+= ball.position.x > board1.position.x+board1.size.width/2 ? 30: 0
   board1.position.x+= ball.position.x < board1.position.x+board1.size.width/2 ? -30:0
      board1.updata()
      board2.updata()
      $(".grade").text(_this.grade)
    
      ball.updata()
  },1)
}
Game.prototype.endGame=function(res){
  clearInterval(this.timer)
  $(".info").show()
  $("button").show()
  $(".infoText").html(res+"<br>Score:"+this.grade)
}
var game =new Game()
// game.starGame()