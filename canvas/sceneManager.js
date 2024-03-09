
var SceneManager = function(element, touchDevice){

    var self = this;

    this.scene     = null;
    this.nextScene = null;
    this.element   = element;
    this.mouseInfo = new MouseInfo();

    this.startTime = null;
    this.then      = null;
    this.skipMode  = false;

    this.changeScene = function(scene){
	   this.nextScene = scene;
    };
    // 取得相對(canvas)座標XY
    this.updateMousePoint = function(event){
        var rect = event.target.getBoundingClientRect();
        self.mouseInfo.point.x = event.clientX - rect.left;
        self.mouseInfo.point.y = event.clientY - rect.top;
    };

    //=========================================================
    // 電腦版
    //=========================================================
    this.mouseDown = function (event){
        self.updateMousePoint(event);
        self.mouseInfo.pressed = true;
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
    	}
        return false;
    };
    this.mouseUp = function(event){
        self.updateMousePoint(event);
        self.mouseInfo.pressed = false;
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };
    this.mouseMove = function (event){
        self.updateMousePoint(event);
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };
    this.mouseOut = function(event){
        self.updateMousePoint(event);
        self.mouseInfo.pressed = false;
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };

    //=========================================================
    // 觸控板
    //=========================================================
    this.touchStart = function (){
        var e = event.touches[0];
        self.updateMousePoint(e);
        self.mouseInfo.pressed = true;
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };
    this.touchEnd = function(){
        try{
            self.mouseInfo.pressed = false;
    	    if(self.scene){
    		    self.scene.updateMouseInfo(self.mouseInfo);
            }
            if(touchDevice){
                self.click();
            }
        }catch(e){ alert(e); }
        return false;
    };
    this.touchMove = function (){
        var e = event.touches[0];
        self.updateMousePoint(e);
		if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };

    this.click = function(event){
        if(self.onCanvasClick)
            self.onCanvasClick();
    };

    //=========================================================
    // 電腦<->觸控 bind 不同function
    //=========================================================
    if( !touchDevice ){
        this.element[0].onmousemove = this.mouseMove;
        this.element[0].onmousedown = this.mouseDown;
        this.element[0].onmouseup = this.mouseUp;
        this.element[0].onmouseout = this.mouseOut;
    }else{
        this.element[0].ontouchmove = this.touchMove;
        this.element[0].ontouchstart = this.touchStart;
        this.element[0].ontouchend = this.touchEnd;
    }
    this.element[0].onclick = this.click;
    //=========================================================

	//=========================================================
    // 不斷用 timeInterval update
    //=========================================================
    this.setSkipMode = function(skipMode){        
        self.stopInterval();
        self.startInterval(skipMode);
    }
    this.stopInterval = function(){
        if( self.timerId ){
            window.cancelAnimationFrame(self.timerId);
            self.timerId = null;
        }
    };
    this.startInterval = function(skipMode){
        if( !self.timerId ){
            window.cancelAnimationFrame(self.timerId);
            self.timerId = null;
        }
            
        self.skipMode = skipMode;
        self.fpsInterval = self.skipMode ? 1 : 1000 / SECOND_FRAMES;
        
        self.startTime = new Date().getTime();
        self.then = self.startTime;
        self.timerFunc();
    };
    this.timerFunc = function(){
        var now     = new Date().getTime();
        var elapsed = now - self.then;

        if( elapsed > self.fpsInterval ){
            self.then = now - (elapsed % self.fpsInterval);

            self.update();
            self.draw();
            ++ self.frameCount;
        }
        
        self.timerId = window.requestAnimationFrame( self.timerFunc );
    };
    this.update = function(){
        self.mouseInfo.lastPressed = self.mouseInfo.pressed;
        if(self.nextScene){
	        if(self.scene){
		        self.scene.finalize();
		        self.scene = null;
	        }
            self.scene = self.nextScene;
            self.nextScene = null;
            self.scene.initialize();
        }
    	if(self.scene){
            self.scene.update();
    	}
    };
    this.draw = function(){
        if(self.scene){
    		self.scene.draw();
    	}
    };
}


var FieldManager = function(scene, canvas, history, environment){
    var self = this;
    this.sceneManager   = scene;
    this.canvas         = canvas;
    this.historyManager = history;
    this.environment    = environment;

    this.strategy   = new FieldStrategyEmpty(self);
    this.mouseInfo  = new MouseInfo();
    this.frameCount = 0;

    this.movingBall = null;
    this.balls      = new Array();

    this.initialize = function(){
        if( self.historyManager.panel ){
            self.setHistoryPanel();
            setReplayMode( $("#MainButton button").eq(3) );
            self.strategy.replayFrameCount = -1 * SECOND_FRAMES;
        }else{
            var savedStrategy = self.strategy;
            var savedNewDrop  = self.environment.newDrop;
            var deleteFinished = function(){
                barManager.resetTime();
                comboManager.resetBox();
                self.historyManager.savePanel( self.balls );
                self.historyManager.random = RANDOM;
				self.environment.resetTeamComposition();

                self.setStrategy(savedStrategy);
                self.environment.newDrop = savedNewDrop;
                self.sceneManager.setSkipMode(false);
            }

            self.reset();
            self.setStrategy( new FieldStrategyDropDelete(self, deleteFinished, null, true ) );
            self.environment.newDrop = true;
            self.sceneManager.setSkipMode(true);
            self.environment.resetTeamComposition();
        }
        return;
    };
    this.finalize = function(){
        // console.log("FieldScene.finalize");
    };
    this.setStrategy = function(strategy){
        if(self.strategy){
            self.strategy.finalize();
        }
        self.strategy = strategy;
        self.strategy.initialize();
    };

    this.reset = function(){
        self.canvas.attr('width', self.environment.hNum * BALL_SIZE).attr('height', self.environment.vNum * BALL_SIZE);
        self.balls = new Array( self.environment.hNum * self.environment.vNum );
    };
    this.setHistoryPanel = function(){
        if( !self.historyManager.panel ){ return; }

        self.canvas.attr('width', self.environment.hNum * BALL_SIZE).attr('height', self.environment.vNum * BALL_SIZE);
        self.balls = new Array( self.historyManager.panel.length );
        for(var i = 0; i < self.historyManager.panel.length; i++ ){
            var point = new Point( Math.floor(i/self.environment.vNum), Math.floor(i%self.environment.vNum), true);
            var num = Math.floor(i/self.environment.vNum) * self.environment.vNum + Math.floor(i%self.environment.vNum);
            if( self.historyManager.panel[i] ){
                self.balls[num] = new Ball( point, self.historyManager.panel[i], BALL_SIZE );
            }else{
                self.balls[num] = null;
            }
        }
    }
    this.logBalls = function(){
        var ballText = "";
        for(var y = 0 ; y < self.environment.vNum; ++ y){
            for(var x = 0 ; x < self.environment.hNum; ++ x){
                var ball = self.balls[x * self.environment.vNum + y];
                ballText += ball.item+' ';
            }
            ballText += '\n';
        }
        return ballText;
    }

    //=========================================================
    // SceneManager update 時會一直call update, updateMouseInfo, draw
    //=========================================================
    this.update = function(){
      self.strategy.update();
      ++ self.frameCount;
    };
    this.updateMouseInfo = function(mouseInfo){
        self.mouseInfo = mouseInfo.clone();
    };
    this.draw = function(){
        // 背景清空
        var ctx = self.canvas.get(0).getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, self.canvas.width(), self.canvas.height());
        ctx.restore();
        // 先畫一般的珠，再畫移動中的珠
        for(var i = 0 ; i < self.balls.length ; ++ i){
            var ball = self.balls[i];
            if( ball != null && ball.state != BallState.MOVING ){
                ball.drawBall( ctx );
            }
        }
        // 繪製場地障礙(幻界)
        if( self.environment.phantom ){
            self.environment.drawPhantom( ctx );
        }

        // 繪製軌跡效果
        if( self.environment.isRecordLocus() && self.environment.locusShow ){
            self.environment.drawLocus( ctx );
        }
        // 繪製移動中的珠
        if( self.movingBall ){
            self.movingBall.drawBall( ctx );
        }
        // 繪製軌跡路徑
        if( self.environment.showRecord && gameMode == GAME_MODE.REPLAY ){
            self.historyManager.drawRecord( ctx );
        }
    };

    //=========================================================
    // Point 和 ball 的交接
    //=========================================================
    this.checkIllegalPoint = function(point){
        return point.getGridX() < 0 || point.getGridX() >= self.hNum || 
               point.getGridY() < 0 || point.getGridY() >= self.vNum
    }
    this.getBallAtPoint = function(point){
        if( self.checkIllegalPoint(point) ){ return null; }
        return self.balls [point.getGridX() * self.environment.vNum + point.getGridY()];
    };
    this.deleteBallAtPoint = function(point){
        if( self.checkIllegalPoint(point) ){ return null; }
        self.balls[point.getGridX() * self.environment.vNum + point.getGridY()] = null;
    };
    this.setBallAtPoint = function(ball, point){
        if( self.checkIllegalPoint(point) ){ return null; }
        if( ball != null ){
            ball.point = point.clone();
        }
        self.balls[point.getGridX() * self.environment.vNum + point.getGridY()] = ball;
    };
    this.getBallCenterPoint = function(ball){
        return new Point( Math.floor( (ball.point.getX() + BALL_SIZE/2) / BALL_SIZE ),
                          Math.floor( (ball.point.getY() + BALL_SIZE/2) / BALL_SIZE ), true );
    };
};

