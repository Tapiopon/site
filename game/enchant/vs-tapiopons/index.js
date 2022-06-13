let sc_x = window.innerWidth;
let sc_y = window.innerHeight;
enchant();
window.onload = function () {
  const game = new Game(sc_x,sc_y);
  let fps = 0;
  game.fps=120;
  
  game.preload({
    "title_icon":"file/title_icon.png",
    "star":"file/star.png",
    "player_img":"file/player.png",
    "bullet":"file/bullet.png",
    "enemy_a":"file/enemy_1.png",
    "enemy_b":"file/enemy_2.png",
    "enemy_c":"file/enemy_3.png",
    "enemy_bullet_a":"file/enemy_bullet_1.png",
    "sound_bullet":"file/bullet.mp3",
    "kill":"file/bom.mp3",
    "sound_pong":"file/pong.mp3"
  });
  
  game.onload = function () {
    
    //スクリーン
    const start = new Scene();
    const home = new Scene();
    const stage = new Scene();
  　stage.backgroundColor = '#000';
  　const gameover = new Scene();
  　gameover.backgroundColor = '#000';
    
    //Obj
    let start_text = new Label();
    start_text.font = sc_x/10+"px Dela Gothic One";
    start_text.text = "タピオポン無双";
    start_text.moveTo((sc_x - start_text._boundWidth)/2,sc_y/8);
    
    let touch_text = new Label();
    touch_text.font = sc_x/12+"px Dela Gothic One";
    touch_text.text = "タップしてスタート";
    touch_text.moveTo((sc_x - touch_text._boundWidth)/2,sc_y/1.2);
    
    let version = new Label();
    version.font = sc_x/12+"px Dela Gothic One";
    version.text = "BETA";
    version.moveTo((sc_x - version._boundWidth)/2,sc_y-sc_x/12);
    
    let title_icon = new Sprite(512,512);
    title_icon.image = game.assets['title_icon'];
    title_icon.scale(sc_x/512*1.1,sc_x/512*1.1);
    title_icon.moveTo(sc_x/2-512/2,sc_y/2-512/2);
    
    let home_st_text = new Label();
    home_st_text.font = sc_x/10+"px Dela Gothic One";
    home_st_text.text = "スタート";
    home_st_text.moveTo((sc_x - home_st_text._boundWidth)/2,sc_y/1.2);
    
    let start_button = new Sprite(home_st_text._boundWidth,sc_x/10);
    let start_button_surface = new Surface(home_st_text._boundWidth,sc_x/10);
    start_button_surface.context.fillStyle = '#c7dc68';
    start_button_surface.context.fillRect(0,0,sc_x,sc_x/10);
    start_button.image = start_button_surface;
    start_button.moveTo(home_st_text.x,home_st_text.y);
    
    let player = new Sprite(500,500);
    player.image = game.assets['player_img'];
    player.scale(sc_x/500/8,sc_x/500/8);
    player.moveTo(sc_x/2-500/2,sc_y/2-500/2);
    
    let player_sprite = new Sprite(sc_x/500/8,sc_x/500/8);
    
    let now_level = new Label();
    now_level.font = sc_x/10+"px Dela Gothic One";
    now_level.color = '#fff';
    
    let fps_time = 0;
    let fps_count = 0;
    let star_time = 0;
    let star_count = 0;
    let stars = [];
    let bullet_count = 0;
    let bullets = [];
    let enemys = [];
    let enemy_count = 0;
    let enemys_bullet = [];
    let enemy_bullet_count = 0;
    let x_touch = 0;
    let y_touch = 0;
    
    
    let star_obj = Class.create(Sprite,{
      initialize: function(x,y) {
        Sprite.call(this, 512, 512);
        this.image = game.assets["star"];
        this.x = x;
        this.y = y;
        this.scale(sc_x/512/32,sc_x/512/32);
        this.onenterframe = function () {
          if(this.y>sc_y){
            stage.removeChild(this)
          }else{
            this.y += 60/game.actualFps;
          }
        }
      }
    });
    
    let bullet_obj = Class.create(Sprite,{
      initialize: function(x,y) {
        Sprite.call(this, 256, 512);
        this.image = game.assets["bullet"];
        this.x = x;
        this.y = y;
        this.scale(sc_x/512/64,sc_x/512/64);
        this.onenterframe = function () {
          if(this.y<-512){
            this.parentNode.removeChild(this);
          }else{
            this.y -= 800/game.actualFps;
          }
        }
      }
    });
    
    let enemy_obj = Class.create(Sprite,{
      initialize: function(x,y,img,speed,angle,hp){
        Sprite.call(this, 512, 512);
        this.image = img;
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.scale(sc_x/512/8,sc_x/512/8);
        this.rad = Math.atan2(y_touch-this.y,x_touch-this.x)+angle;
        this.onenterframe = function () {
          this.x += Math.cos(this.rad) * speed/game.actualFps;
          this.y += Math.sin(this.rad) * speed/game.actualFps;
          if(this.within(player_sprite,sc_x/16)){
            alert('とむあほ')
          }
          for(let i=0;i<bullet_count;i++){
            if(this.within(bullets[i],sc_x/16)){
              bullets[i].y = -400;
              this.hp --;
              if(this.hp<=0){
                game.assets['kill'].play();
                this.parentNode.removeChild(this);
              }
            }
          }
        }
      }
    });
    
    let enemy_bullet_obj = Class.create(Sprite,{
      initialize: function(x,y,img,speed,angle){
        Sprite.call(this, 512, 512);
        this.image = img;
        this.x = x;
        this.y = y;
        this.scale(sc_x/512/16,sc_x/512/16);
        this.rad = Math.atan2(y_touch-this.y,x_touch-this.x)+angle;
        this.onenterframe = function (){
          this.x += Math.cos(this.rad) * speed/game.actualFps;
          this.y += Math.sin(this.rad) * speed/game.actualFps;
          if(this.within(player_sprite,sc_x/32)){
            alert('とむあほ')
          }
        }
      }
    });
    
    //動作
    game.pushScene(start);
    start.addChild(start_text);
    start.addChild(touch_text);
    start.addChild(title_icon);
    start.addChild(version);
    
    home.addChild(start_button);
    home.addChild(home_st_text);
    
    stage.addChild(player);
    stage.addChild(player_sprite);
    
    start.ontouchend = function () {
      game.replaceScene(home);
    };
    
    home_st_text.ontouchend = function () {
      game.pushScene(stage);
    }
    
    stage.ontouchmove = function (e) {
      player.moveTo(e.x-250,e.y-250);
      x_touch = e.x-250;
      y_touch = e.y-250;
    }
    
    stage.onenterframe = function () {
      fps_time++;
      player_sprite.moveTo(x_touch+256-sc_x/500/8/2,y_touch+256-sc_x/500/8/2)
      if(game.actualFps/10<fps_time){
        star_time++;
        if(2<star_time) {
          stars[star_count] = new star_obj(Math.random()*sc_x-sc_x/512/4-256,-256);
          stage.addChild(stars[star_count]);
          stage.insertBefore(stars[star_count],player)
          star_count++;
          star_time = 0;
        }
        bullets[bullet_count] = new bullet_obj(player.x+124,player.y);
        stage.addChild(bullets[bullet_count]);
        game.assets['sound_pong'].clone().play();
        bullet_count++;
        switch (fps_count){
          case 1:
            now_level.text = "Level 1"
            now_level.moveTo((sc_x - now_level._boundWidth)/2,sc_y/2);
            stage.addChild(now_level);
            break;
          case 31:
            stage.removeChild(now_level);
            break;
          case 40:
            enemys[enemy_count] = new enemy_obj(-256,-256,game.assets['enemy_a'],200,0,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case 45:
            enemys[enemy_count] = new enemy_obj(-256,-256,game.assets['enemy_a'],200,0,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case 50:
            enemys[enemy_count] = new enemy_obj(-256,-256,game.assets['enemy_a'],200,0,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case 55:
            enemys[enemy_count] = new enemy_obj(-256,-256,game.assets['enemy_a'],200,0,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case 200:
            now_level.text = "Level 2"
            now_level.moveTo((sc_x - now_level._boundWidth)/2,sc_y/2);
            stage.addChild(now_level);
            break;
          case 231:
            stage.removeChild(now_level);
            break;
          case 400:
            now_level.text = "Level 3"
            now_level.moveTo((sc_x - now_level._boundWidth)/2,sc_y/2);
            stage.addChild(now_level);
            break;
          case 431:
            stage.removeChild(now_level);
            break;
          case 600:
            now_level.text = "Level 4"
            now_level.moveTo((sc_x - now_level._boundWidth)/2,sc_y/2);
            stage.addChild(now_level);
            break;
          case 631:
            stage.removeChild(now_level);
            break;
          case 800:
            now_level.text = "Level 5"
            now_level.moveTo((sc_x - now_level._boundWidth)/2,sc_y/2);
            stage.addChild(now_level);
            break;
          case 831:
            stage.removeChild(now_level);
            break;
          case 1000:
            now_level.text = "Level 6"
            now_level.moveTo((sc_x - now_level._boundWidth)/2,sc_y/2);
            stage.addChild(now_level);
            break;
          case 1031:
            stage.removeChild(now_level);
            break;
        }
        switch (true){
          case fps_count >= 60 && fps_count < 80:
            enemys[enemy_count] = new enemy_obj(-256,-256,game.assets['enemy_a'],200,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 80 && fps_count < 100:
            enemys[enemy_count] = new enemy_obj(sc_x-256,-256,game.assets['enemy_a'],200,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 100 && fps_count < 125:
            enemys[enemy_count] = new enemy_obj(-256,-256,game.assets['enemy_a'],200,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 125 && fps_count < 150:
            enemys[enemy_count] = new enemy_obj(sc_x-256,-256,game.assets['enemy_a'],200,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 150 && fps_count < 180:
            enemys[enemy_count] = new enemy_obj(-256,-256,game.assets['enemy_a'],200,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            enemys[enemy_count] = new enemy_obj(sc_x-256,-256,game.assets['enemy_a'],200,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 240 && fps_count < 260:
            enemys[enemy_count] = new enemy_obj(-256,-256,game.assets['enemy_b'],400,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 260 && fps_count < 280:
            enemys[enemy_count] = new enemy_obj(-256+sc_x/2,-256,game.assets['enemy_b'],400,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 280 && fps_count < 300:
            enemys[enemy_count] = new enemy_obj(-256+sc_x,-256,game.assets['enemy_b'],400,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 300 && fps_count < 340:
            enemys[enemy_count] = new enemy_obj(-256+Math.random()*sc_x,-256,game.assets['enemy_a'],250,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            enemys[enemy_count] = new enemy_obj(-256+Math.random()*sc_x,-256,game.assets['enemy_a'],250,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 360 && fps_count < 380:
            enemys[enemy_count] = new enemy_obj(-256+sc_x/2,-256,game.assets['enemy_b'],400,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 440 && fps_count < 460:
            enemys_bullet[enemy_bullet_count] = new enemy_bullet_obj(-256+Math.random()*sc_x,-256,game.assets['enemy_bullet_a'],300,0);
            stage.addChild(enemys_bullet[enemy_bullet_count]);
            game.assets['sound_bullet'].clone().play();
            enemy_bullet_count++;
            break;
          case fps_count >= 465 && fps_count < 480:
            enemys_bullet[enemy_bullet_count] = new enemy_bullet_obj(-256+Math.random()*sc_x,-256,game.assets['enemy_bullet_a'],300,0);
            stage.addChild(enemys_bullet[enemy_bullet_count]);
            game.assets['sound_bullet'].clone().play();
            enemy_bullet_count++;
            break;
          case fps_count >= 500 && fps_count < 580:
            game.assets['sound_bullet'].clone().play();
            enemys_bullet[enemy_bullet_count] = new enemy_bullet_obj(-256,-256,game.assets['enemy_bullet_a'],300,(Math.random()-0.5)*Math.PI*1/6);
            stage.addChild(enemys_bullet[enemy_bullet_count]);
            enemy_bullet_count++;
            break;
          case fps_count >= 640 && fps_count < 700:
            enemys[enemy_count] = new enemy_obj(-256+sc_x/2,-256,game.assets['enemy_b'],Math.random()*800,(Math.random()-0.5)*Math.PI*3/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            enemys[enemy_count] = new enemy_obj(-256+sc_x/2,-256,game.assets['enemy_b'],Math.random()*800,(Math.random()-0.5)*Math.PI*3/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 720 && fps_count < 780:
            enemys[enemy_count] = new enemy_obj(-256+sc_x/2,-256,game.assets['enemy_b'],Math.random()*900,(Math.random()-0.5)*Math.PI*3/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            enemys[enemy_count] = new enemy_obj(-256+sc_x/2,-256,game.assets['enemy_b'],Math.random()*900,(Math.random()-0.5)*Math.PI*3/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 840 && fps_count < 860 || fps_count >= 880 && fps_count < 900 || fps_count >= 920 && fps_count < 960 || fps_count >= 970 && fps_count < 990 :
            enemys_bullet[enemy_bullet_count] = new enemy_bullet_obj(-256+Math.random()*sc_x,-256,game.assets['enemy_bullet_a'],400,0);
            stage.addChild(enemys_bullet[enemy_bullet_count]);
            game.assets['sound_bullet'].clone().play();
            enemy_bullet_count++;
            break;
          case fps_count >= 1040 && fps_count < 1080:
            enemys[enemy_count] = new enemy_obj(-256+sc_x/2,-256,game.assets['enemy_a'],300,(Math.random()-0.5)*Math.PI*1/6,2);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
          case fps_count >= 1100 && fps_count < 1120:
            enemys[enemy_count] = new enemy_obj(-256+sc_x/2,-256,game.assets['enemy_a'],300,(Math.random()-0.5)*Math.PI*1/6,1);
            stage.addChild(enemys[enemy_count]);
            enemy_count++;
            break;
        }
        fps_count++;
        fps_time = 0;
      }
    }
    
  };
  game.start();
}
