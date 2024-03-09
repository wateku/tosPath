

var FieldStrategyEmpty = function(field){
    var self = this;
    this.field = field;
    this.initialize = function(){};
    this.finalize = function(){};
    this.update = function(){};
}

//=========================================================
// 編輯盤面
//=========================================================
var FieldStrategyEdit = function(field){
    var self = this;
    this.field = field;
    this.lastSetPoint = null;
    this.lastSetColor = null;
    this.initialize = function(){
        barManager.resetTime();
        comboManager.resetBox();
        self.field.setHistoryPanel();
    };
    this.finalize = function(){
        self.field.historyManager.savePanel( self.field.balls );
    };

    //=========================================================
    // 當點下時 -> 被點位置的珠變色
    //=========================================================
    this.update = function(){
        var handleSelectedColor = function(){

        }

        if( self.field.mouseInfo.pressed ){
            var point = self.field.mouseInfo.point.clone();
            var selectedColor = CREATE_COLOR.color;

            // 感覺沒必要做這個防呆處理
            if( self.lastSetPoint != null ){
                if( self.lastSetPoint.getGridX() == point.getGridX() && 
                    self.lastSetPoint.getGridY() == point.getGridY() && 
                    self.lastSetColor            == selectedColor ){
                    return;
                }
            }

            // 設定版面幻界(優先)
            if( CREATE_COLOR.phantom ){
                if( !selectedColor ){
                    environmentManager.deletePhantom( point.toGrid() );
                }else{
                    environmentManager.addPhantom( point.toGrid(), selectedColor );
                }
                return;
            }

            // 整理color item
            if( !selectedColor ){
                var selectedBall = self.field.getBallAtPoint(point);
                if( !selectedBall ){ return; }
                selectedColor = selectedBall.color;
            }
            if( CREATE_COLOR.strong  ){ selectedColor += "+"; }
            if( CREATE_COLOR.inhibit ){ selectedColor += "x"; }
            if( CREATE_COLOR.weather ){ selectedColor += "*"; }
            if( CREATE_COLOR.frozen  ){ selectedColor += "i"+CREATE_COLOR.frozen; }
            if( CREATE_COLOR.locking ){ selectedColor += "k"; }
            if( CREATE_COLOR.unknown ){ selectedColor += "q"; }
            if( CREATE_COLOR.reverse ){ selectedColor += "_"; }

            self.field.deleteBallAtPoint(point);
            var ball = new Ball(point.toGrid(), selectedColor, BALL_SIZE);
            self.field.setBallAtPoint(ball, point);
            self.lastSetPoint = point;
            self.lastSetColor = selectedColor;

        }
    };
};


var FieldStrategyDropDelete = function(field, deleteFinished, dropFinished, hasSpace){
    var Mode = {
        WAITING    :0,
        TRY_DELETE :1,
        DELETING   :2,
        TRY_DROP   :3,
        DROPPING   :4
    };

    var self = this;
    this.field      = field;
    this.frameCount = 0;
    this.mode       = hasSpace ? Mode.TRY_DROP : Mode.TRY_DELETE;

    this.deletedWave = null;
    this.deleteFinished = deleteFinished;
    this.dropFinished   = dropFinished;

    this.initialize = function(){
        self.field.historyManager.resetDeletedInfo();
        self.deletedWave = self.field.historyManager.startDeleted();
    };
    this.finalize = function(){};
    this.update = function(){        
        for(var i = 0; i < self.field.balls.length; ++ i){
            if( self.field.balls[i] ){
                self.field.balls[i].update();
            }
        }
        switch(self.mode){
            case Mode.WAITING    :break;
            case Mode.TRY_DELETE :self.updateTryDelete(); break;
            case Mode.DELETING   :self.updateDeleting();  break;
            case Mode.TRY_DROP   :self.updateTryDrop();   break;
            case Mode.DROPPING   :self.updateDropping();  break;
        }
        ++ self.frameCount;
    };

    this.updateTryDelete = function(){
        // 被消除名單
        self.countDeleteBalls( self.field.balls ); 

        // 以防當機 設定消珠上限
        if( self.field.historyManager.deletedInfo.waveNum > 100 ){
            self.mode = Mode.WAITING;
            self.frameCount = 0;
            if( self.deleteFinished ){ self.deleteFinished(); }
        }

        if( self.deletedWave.orderDeletePairs.length == 0 ){
            // 裂心技能判定
            teamManager.checkTeamSkill("breakColor");
            if( self.deletedWave.orderDeletePairs.length > 0 ){
                self.deletedWave = self.field.historyManager.startDeleted();
                self.mode = Mode.DELETING;
                self.frameCount = 0;
            }else{
                // 落珠結束 進入下一階段
                self.mode = Mode.WAITING;
                self.frameCount = 0;
                if( self.deleteFinished ){ self.deleteFinished(); }
            }
        }else{
            wave1stballs = 0

            // 設定消除珠動畫
            for(var i = 0 ; i < self.deletedWave.orderDeletePairs.length ; i++){
                self.deletedWave.orderDeletePairs[i].balls[0].deletedPair = self.deletedWave.orderDeletePairs[i].balls;

                if (self.frameCount == 0)
                    wave1stballs += self.deletedWave.orderDeletePairs[i].balls.length

                var startFrame = DELETE_SPEED * (i + 1);
                for(var j = 0 ; j < self.deletedWave.orderDeletePairs[i].balls.length ; j++){
                    var ball = self.deletedWave.orderDeletePairs[i].balls[j];
                    ball.setState( BallState.DELETING );
                    ball.frameCountToDelete = startFrame;
                }
            }
            //紀錄落珠
            self.field.historyManager.addDeletedWave( self.deletedWave );
            self.deletedWave = self.field.historyManager.startDeleted();
            comboManager.addWave( self.field.historyManager.getWaveNum(), wave1stballs );

            self.mode = Mode.DELETING;
            self.frameCount = 0;
        }
    };
    this.updateDeleting = function(){
        var isAllDeleted = function(){
            for(var i = 0; i < self.field.balls.length; i++){
                if( self.field.balls[i] != null && self.field.balls[i].state == BallState.DELETING ){
                    return false;
                }
            }
            return true;
        };

        if( isAllDeleted() ){
            for(var i = 0; i < self.field.balls.length; i++){
                if( self.field.balls[i] != null && self.field.balls[i].state == BallState.DELETED){
                    self.field.balls[i] = null;
                }
            }
            self.mode = Mode.TRY_DROP;
            self.frameCount = 0;
        }
    };
    this.updateTryDrop = function(){

        self.field.environment.resetDropSpace();

		// 落珠技能判定
        teamManager.checkTeamSkill("newItem");
        teamManager.checkLeaderSkill("newItem");

        if( self.field.environment.newDrop ){
			// 隨機落珠技能判定
			teamManager.checkTeamSkill("randNewItem");
			teamManager.checkLeaderSkill("randNewItem");

			self.makeNewStrong();
            self.field.environment.fillEmptySpace();
        }
        self.field.environment.pushIntoDropStack();

        // 計算落下距離
        for(var i = 0; i < self.field.environment.hNum; i++){
            var dropGrid = 0;
            var spacePoints = new Array();
            for(var j = self.field.environment.vNum-1; j >= 0; j--){
                var ball = self.field.balls[ i * self.field.environment.vNum + j ];
                if( !ball ){
                    dropGrid += 1;
                    spacePoints.push( new Point( i, j, true ) );
                }else if( dropGrid > 0 ){
                    ball.dropGrid = dropGrid;
                    ball.setState(BallState.DROPPING);
                    ball.frameCountToDropEnd = dropGrid * DROP_SPEED;
                    self.field.balls[ i * self.field.environment.vNum + (j+dropGrid) ] = ball;
                    self.field.balls[ i * self.field.environment.vNum + j ] = null;
                }
            }

        // 新增珠落下
            for(var j = 1; j <= dropGrid; j++){
                if( j <= self.field.environment.dropSpace.dropStack[i].length ){
                    var color = self.field.environment.dropSpace.dropStack[i][j-1];
                    var ball = new Ball( new Point(i, -1 * j, true), color, BALL_SIZE );

                    ball.dropGrid = dropGrid;
                    ball.setState( BallState.DROPPING );
                    ball.frameCountToDropEnd = dropGrid * DROP_SPEED;
                    self.field.balls[ i * self.field.environment.vNum + (dropGrid-j) ] = ball;                        
                }
            }
        }
        
        self.mode = Mode.DROPPING;
        self.frameCount = 0;
    };
    this.updateDropping = function(){        
        var isAllDroped = function(){
            for(var i = 0; i < self.field.balls.length; i++){
                if( self.field.balls[i] != null && self.field.balls[i].state == BallState.DROPPING ){
                    return false;
                }
            }
            return true;
        };

        if( isAllDroped() ){
            self.mode = Mode.TRY_DELETE;
            self.frameCount = 0;
        }
    };

    this.makeNewStrong = function(){
        var deletedWave = historyManager.deletedInfo.getCurrentWave();
        if( !deletedWave ){ return; }
        for(var i = 0; i < deletedWave.orderDeletePairs.length; i++){
            var pair = deletedWave.orderDeletePairs[i];
            if( pair.balls.length >= 5 && environmentManager.dropSpace.emptyPoints.length > 0 ){                
                var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
                var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0];
                environmentManager.dropSpace.fillPoints.push( point );
                environmentManager.dropSpace.newColors[ point.toText() ] = pair.color+'+';
            }
        }
    };
    this.countDeleteBalls = function( balls ){
        var checkBall = function(ball){
            if( !ball || !ball.color ){ return false; }
            if( ball.frozen && ball.frozen > 1 ){ return false; }
            return true;
        }
        var checkConnect = function(ballPair, ball){
            if( !ball || !ball.color || !ballPair.color ){ return false; }
            return ball.color == ballPair.color;
        }
        var checkDeletePair = function(ballPair, list){
            if( ballPair.balls.length >= self.field.environment.pairSize[ ballPair.color ] ){
                list.push(ballPair);
            }
        }
        var mergePair = function(pair1, pair2){
            for(var i = 0; i < pair2.points.length; i++){
                var check = false;
                for(var j = 0; j < pair1.points.length; j++){
                    if( pair2.points[i].getX() == pair1.points[j].getX() &&
                        pair2.points[i].getY() == pair1.points[j].getY() ){
                        check = true;
                        break;
                    }
                }
                if( !check ){
                    pair1.addBall( pair2.balls[i] );
                }
            }
            pair2.reset();
        }
        var checkOverlap = function(pair1, pair2){
            for(var i = 0; i < pair1.points.length; i++){
                for(var j = 0; j < pair2.points.length; j++){
                    if( ( Math.abs( pair1.points[i].getGridX() - pair2.points[j].getGridX() ) <= 1 &&
                          pair1.points[i].getGridY() == pair2.points[j].getGridY()                    ) ||
                        ( Math.abs( pair1.points[i].getGridY() - pair2.points[j].getGridY() ) <= 1 &&
                          pair1.points[i].getGridX() == pair2.points[j].getGridX()                    ) ){
                        return true;
                    }
                }
            }
            return false;
        }       

        // vertical
        for(var i =0; i < self.field.environment.hNum; i++ ){
            var pair = new BallPair();

            for(var j =0; j < self.field.environment.vNum; j++ ){
                var ball = balls[i * self.field.environment.vNum + j];

                if( checkBall(ball) ){
                    if( pair.empty() ){
                        pair.addBall( ball );
                        pair.color = ball.color;
                    }else if( checkConnect( pair, ball ) ){
                        pair.addBall( ball );
                    }else{
                        checkDeletePair(pair, self.deletedWave.vDeletePairs[i]);
                        pair = new BallPair();
                        pair.addBall( ball );
                        pair.color = ball.color;
                    }
                }else{
                    checkDeletePair(pair, self.deletedWave.vDeletePairs[i]);
                    pair = new BallPair();
                }
            }
            checkDeletePair(pair, self.deletedWave.vDeletePairs[i]);
        }
        // horizontal
        for(var i =0; i < self.field.environment.vNum; i++ ){
            var pair = new BallPair();

            for(var j =0; j < self.field.environment.hNum; j++ ){
                var ball = balls[j * self.field.environment.vNum + i];

                if( checkBall(ball) ){
                    if( pair.empty() ){
                        pair.addBall( ball );
                        pair.color = ball.color;
                    }else if( checkConnect( pair, ball ) ){
                        pair.addBall( ball );
                    }else{
                        checkDeletePair(pair, self.deletedWave.hDeletePairs[i]);
                        pair = new BallPair();
                        pair.addBall( ball );
                        pair.color = ball.color;
                    }
                }else{
                    checkDeletePair(pair, self.deletedWave.hDeletePairs[i]);
                    pair = new BallPair();
                }
            }
            checkDeletePair(pair, self.deletedWave.hDeletePairs[i]);
        }

        // merge Pairs in color
        for(var i = 0; i < self.field.environment.hNum; i++ ){
            for(var j = 0; j < self.deletedWave.vDeletePairs[i].length; j++){
                self.deletedWave.orderDeletePairs.push( self.deletedWave.vDeletePairs[i][j] );
            }
        }
        for(var i =0; i < self.field.environment.vNum; i++ ){
            for(var j = 0; j < self.deletedWave.hDeletePairs[i].length; j++){
                self.deletedWave.orderDeletePairs.push( self.deletedWave.hDeletePairs[i][j] );
            }
        }
        for(var i = 0; i < self.deletedWave.orderDeletePairs.length; i++){
            var pair = self.deletedWave.orderDeletePairs[i];
            var colorIndex = getColorIndex( pair.color );
            for(var j = 0; j < self.deletedWave.colorDeletePairs[colorIndex].length; j++ ){
                var savedPair = self.deletedWave.colorDeletePairs[colorIndex][j];
                if( checkOverlap(pair, savedPair) ){
                    mergePair(pair, savedPair);
                }
            }
            self.deletedWave.colorDeletePairs[colorIndex].push(pair);
        }

        // remove empty pair
        var tmpArray = new Array();
        for(var i = 0; i < self.deletedWave.orderDeletePairs.length; i++){
            var pair = self.deletedWave.orderDeletePairs[i];
            if( !pair.empty() ){
                // check ball pair group size
                if( pair.balls.length >= self.field.environment.groupSize[ pair.color ] ){
                    tmpArray.push( pair );
                }else{
                    pair.reset();
                }
            }
        }
        self.deletedWave.orderDeletePairs = tmpArray;
        for(var i = 0; i < self.deletedWave.colorDeletePairs.length; i++){
            var tmpArray = new Array();
            for(var j = 0; j < self.deletedWave.colorDeletePairs[i].length; j++ ){
                if( !self.deletedWave.colorDeletePairs[i][j].empty() ){
                    tmpArray.push( self.deletedWave.colorDeletePairs[i][j] );
                }
            }
            self.deletedWave.colorDeletePairs[i] = tmpArray;
        }
    };

}

var FieldStrategyMove = function(field, replay){
    var Mode = {
        WAITING :0,
        MOVING  :1
    };
    var MovingInfo = function( mouseInfo ){
        this.lastMousePoint = mouseInfo.point.clone();
    };

    var self = this;
    this.field = field;
    this.replay = replay;
    this.mode = Mode.WAITING;
    this.modeFrameCount = 0;

    this.replayFrameCount = 0;
    this.replayRouteInfo = null;
    this.replayMouseInfo = null;

    this.lastPoint  = null;

    this.timerStart      = null;
    this.timerFrameCount = 0;
    this.timeOver        = false;
    this.forceStop       = false;

    this.initialize = function(){
        barManager.resetTime();
        comboManager.resetBox();

        self.field.setHistoryPanel();
        self.field.historyManager.resetRouteInfo();
        self.field.historyManager.resetDeletedInfo();
        self.field.historyManager.parseRecordLines();
        self.field.historyManager.resetRandom();

        self.field.environment.resetReplaySpeed();
        self.field.environment.resetTeamComposition();

        self.field.timerStart = false;
    };
    this.finalize = function(){
        self.field.movingBall = null;        
    };
    this.update = function(){
        for(var i = 0 ; i < self.field.balls.length ; ++ i){
            if( self.field.balls[i] != null ){
                self.field.balls[i].update();
            }
        }
        if( self.replay ){
            self.updateReplayMouseInfo();
        }

        switch(self.mode){
            case Mode.WAITING : self.updateWaiting(); break;
            case Mode.MOVING  : self.updateMoving();  break;
        }

        if( self.timerStart && !self.replay ){ 
            self.updateTimerBar();
            ++ self.timerFrameCount;
        }
        self.timeOver = self.timerStart && self.timerFrameCount >= (self.field.environment.timeLimit * SECOND_FRAMES);
        ++ self.modeFrameCount;
    };

    //===========================================================
    // 更新重播滑鼠
    //===========================================================
    this.updateReplayMouseInfo = function(){
        if( self.replayFrameCount == null || self.field.environment.stopReplay ){ return; }
        // 路徑設定
        if( self.replayFrameCount == 1 ){
            self.replayMovePrepare();
        }
        if( self.replayFrameCount == SECOND_FRAMES-1 ){
            self.replayMoveStart();
        }

        // 移動開始
        if( self.replayFrameCount >= SECOND_FRAMES ){
            var routeIndex = Math.floor( (self.replayFrameCount - SECOND_FRAMES) / MOVE_FRAME);

            if( routeIndex < self.replayRoute.record.length ){
                self.replayMouseInfo.lastPressed = true;
                self.replayMouseInfo.pressed = true;
                // 依照方向移動虛擬滑鼠位置
                self.updateReplayMouseMoveVector( self.replayRoute.record[routeIndex] ); 
            }else{
                self.replayMouseInfo.lastPressed = true;
                self.replayMouseInfo.pressed = false;
                // 設置下一段路徑
                if( self.replayRouteInfo.nextRoute() ){
                    self.replayFrameCount = -1;
                }
            }             
        }

        ++ self.replayFrameCount;
    };
    this.updateWaiting = function(){
        var mouseInfo = self.replay ? self.replayMouseInfo : self.field.mouseInfo;

        if( mouseInfo && mouseInfo.pressed ){
            self.mode = Mode.MOVING;
            self.modeFrameCount = 0;

            // 取得按下位置的珠 設為移動珠
            self.movingInfo = new MovingInfo( mouseInfo );
            self.field.movingBall = self.field.getBallAtPoint( mouseInfo.point );
            self.field.movingBall.setState( BallState.MOVING );
            self.field.deleteBallAtPoint( mouseInfo.point );
            self.lastPoint = self.field.getBallCenterPoint( self.field.movingBall );

            // 記録
            if( !self.replay ){
                self.field.historyManager.startNewRoute( mouseInfo.point );
            }

        }

        // 自由移動時間內判定
        if( !self.replay && self.field.environment.freeMove && self.timeOver ){
            self.field.historyManager.saveRouteInfo();
            self.setDropStrategy();
        }
    };
    this.updateMoving = function(){

        var mouseInfo     = self.replay ? self.replayMouseInfo : self.field.mouseInfo;
        var mouseMoved    = mouseInfo && 
                            ( mouseInfo.point.getX() != self.movingInfo.lastMousePoint.getX() || 
                              mouseInfo.point.getY() != self.movingInfo.lastMousePoint.getY()    );
        var mouseReleased = mouseInfo && !mouseInfo.pressed;

        // 時間判定優先
        if( !self.replay && ( self.timeOver || self.forceStop ) ){
            mouseMoved = false;
            mouseReleased = true;
        }

        if( mouseMoved ){
            self.updateMouseMoved( mouseInfo );
        }
        if( mouseReleased ){
            self.updateMouseReleased();
        }
    };
    this.updateMouseMoved = function( mouseInfo ){
        // 1. 計算滑鼠移動量
        // 2. 以移動量更動移動珠位置
        // 3. 計算移動珠所在格
        var newPoint  = self.field.getBallCenterPoint( self.field.movingBall );
        var direction = getDirectionByPoints( self.lastPoint, newPoint );
        var angle         = getAngleByPoints( self.lastPoint, self.field.movingBall.point );
        var angleIsSlant  = (angle > (90 * 0) + 45 - 15 && angle < (90 * 0) + 45 + 15) ||
                            (angle > (90 * 1) + 45 - 15 && angle < (90 * 1) + 45 + 15) ||
                            (angle > (90 * 2) + 45 - 15 && angle < (90 * 2) + 45 + 15) ||
                            (angle > (90 * 3) + 45 - 15 && angle < (90 * 3) + 45 + 15);
        var slantMove     = (direction == Direction8.TENKEY_1) || 
                            (direction == Direction8.TENKEY_3) || 
                            (direction == Direction8.TENKEY_7) || 
                            (direction == Direction8.TENKEY_9); 

        self.updateMovingBall( mouseInfo );
        if( self.checkMoveVector( newPoint, direction, angle, angleIsSlant, slantMove ) ){
            self.exchangeBall( newPoint, direction );

            // 時間開始記錄
            if( !self.timerStart ){
                self.timerStart = true;
                self.timerFrameCount = 0;
            }
        }
    };
    this.updateMouseReleased = function(){
        self.returnMovingBall();

        self.movingInfo      = null;
        self.lastPoint       = null;
        self.mode            = Mode.WAITING;
        self.modeFrameCount  = 0;
            
        // 記録
        if( !self.replay ){
            if( self.timerStart ){
                if( self.field.environment.hasLocus() ){
                    self.cleanLocus();
                }

                self.field.historyManager.saveRouteInfo();
                if( !self.field.environment.freeMove || self.timeOver ){
                    self.setDropStrategy();      
                }
            }else{
                // 還沒開始，重新記錄下個路徑
                self.field.historyManager.resetRouteInfo();
            }
        }else{
            // 走完最後一個route
            if( !self.replayRouteInfo.index ){ 
                self.setDropStrategy();
            }
        }
    };
    this.exchangeBall = function( newPoint, direction ){
        var ball = self.field.getBallAtPoint( newPoint );
		var lastPoint = self.lastPoint;
        self.field.deleteBallAtPoint( newPoint );
        self.field.setBallAtPoint( ball, self.lastPoint );
        self.lastPoint = newPoint.clone();
        
		//軌跡技能判定
        teamManager.checkTeamSkill("locus", lastPoint);
        teamManager.checkLeaderSkill("locus", lastPoint);

        comboManager.addMove();

        // 幻界檢查
        if( self.field.environment.phantom ){
            if( self.field.environment.checkPhantomPoint( newPoint ) ){
                var phantomColor = self.field.environment.getPhantomPointColor( newPoint );
                self.field.movingBall.color = phantomColor;
                self.field.movingBall.item[0] = phantomColor;
            }
        }

        // 記録
        if( !self.replay ){
            // 繪製軌跡特效
            if( self.field.environment.hasLocus() ){
                self.updateLocus( ball );
            }

            // 檢查風化腐蝕等
            if( ball.checkInhibit() || self.field.environment.checkLocusInhibit(newPoint) ){
                self.forceStop = true;
            }

            self.field.historyManager.addRecord( direction );
        }
    };
    this.updateLocus = function(ball){
        // 將軌跡轉化為點路徑
        var route = self.field.historyManager.routeInfo.getCurrentRoute();
        var points = new Array();
        var point = route.startPoint.clone();
        points.push(point);
        for(var i = 0; i < route.record.length; i++){
            point = countGoalPoint( point.clone(), route.record[i] );
            points.push(point);
        }

        var locusLength = self.field.environment.locusInf ? Infinity : 6;
        var locusItem = self.field.environment.mapLocusItem();
        if( self.field.environment.isBallLocus() ){
            for(var i = 0; i < points.length; i++){
                var ball = self.field.getBallAtPoint( points[i] );
                if( ball ){
                    if( i < points.length - locusLength ){
                        ball.locusMode = null;
                    }else{
                        ball.locusMode = locusItem;
                    }
                }
            }
        }else if( self.field.environment.isRecordLocus() ){
            var drawPoints = new Array();
            for(var i = 0; i < points.length; i++){
                if( i >= points.length - locusLength ){
                    drawPoints.push( points[i] );
                }
            }
            self.field.environment.prepareDrawLocus( drawPoints );
        }
    }
    this.cleanLocus = function(){
        for(var i = 0; i < self.field.balls.length; i++){
            var ball = self.field.balls[i];
            if( ball ){ ball.locusMode = null; }
        }
        self.field.environment.locusShow = false;
        self.field.environment.locusPoints = null;
    };

    //===========================================================
    // 計算用
    //===========================================================
    this.replayMovePrepare = function(){
        if( !self.replayRouteInfo ){
            self.replayRouteInfo = self.field.historyManager.getRouteInfo();
            if( self.replayRouteInfo.routes.length == 0 ){
                self.replayFrameCount = -1 * Infinity;
                self.replayMouseInfo = new MouseInfo();
                return;
            }
        }
        self.replayRoute = self.replayRouteInfo.getCurrentRoute();
    };
    this.replayMoveStart = function(){
        if( !self.replayRoute ){ return; }

        self.replayMouseInfo = new MouseInfo();
        self.replayMouseInfo.point = new Point(
            self.replayRoute.startPoint.getX() + BALL_SIZE / 2, 
            self.replayRoute.startPoint.getY() + BALL_SIZE / 2 );
        self.replayMouseInfo.lastPressed = false;
        self.replayMouseInfo.pressed = true;
    };
    this.updateReplayMouseMoveVector = function( direction ){
        switch(direction){
            case Direction8.TENKEY_4: self.replayMouseInfo.point.x -= REPLAY_SPEED; break;
            case Direction8.TENKEY_8: self.replayMouseInfo.point.y -= REPLAY_SPEED; break;
            case Direction8.TENKEY_6: self.replayMouseInfo.point.x += REPLAY_SPEED; break;
            case Direction8.TENKEY_2: self.replayMouseInfo.point.y += REPLAY_SPEED; break;
            case Direction8.TENKEY_1: self.replayMouseInfo.point.x -= REPLAY_SPEED;
                                      self.replayMouseInfo.point.y += REPLAY_SPEED; break;
            case Direction8.TENKEY_3: self.replayMouseInfo.point.x += REPLAY_SPEED;
                                      self.replayMouseInfo.point.y += REPLAY_SPEED; break;
            case Direction8.TENKEY_7: self.replayMouseInfo.point.x -= REPLAY_SPEED;
                                      self.replayMouseInfo.point.y -= REPLAY_SPEED; break;
            case Direction8.TENKEY_9: self.replayMouseInfo.point.x += REPLAY_SPEED;
                                      self.replayMouseInfo.point.y -= REPLAY_SPEED; break;
        }
    };
    this.checkMoveVector = function( newPoint, direction, angle, angleIsSlant, slantMove ){
        if( self.lastPoint.getGridX() != newPoint.getGridX() || 
            self.lastPoint.getGridY() != newPoint.getGridY() ){
            if( !slantMove && angleIsSlant ){ return false; }
            return true;
        }
        return false; 
    };

    //===========================================================
    // 移動細節
    //===========================================================
    this.updateMovingBall = function(mouseInfo){
        var moveVector = new Point( mouseInfo.point.getX() - self.movingInfo.lastMousePoint.getX(), 
                                    mouseInfo.point.getY() - self.movingInfo.lastMousePoint.getY(), false );
        self.movingInfo.lastMousePoint = mouseInfo.point.clone();

        self.field.movingBall.point.x += moveVector.getX();
        self.field.movingBall.point.y += moveVector.getY();
        //範圍限制
        self.field.movingBall.point.x = Math.min( Math.max( self.field.movingBall.point.getX(), 0 ), BALL_SIZE * (self.field.environment.hNum-1) );
        self.field.movingBall.point.y = Math.min( Math.max( self.field.movingBall.point.getY(), 0 ), BALL_SIZE * (self.field.environment.vNum-1) );
    };
    this.returnMovingBall = function(){
        var movingPoint = self.field.getBallCenterPoint( self.field.movingBall );
        if( self.field.getBallAtPoint( movingPoint ) ){
            movingPoint = self.lastPoint;
        }
        self.field.setBallAtPoint( self.field.movingBall, movingPoint );
        self.field.movingBall.setState( BallState.NORMAL );
        self.field.movingBall = null;
    };
    this.setDropStrategy = function(){
        var deleteFinished = function(){
            self.field.setStrategy(new FieldStrategyEmpty(self.field));
        }
        self.field.setStrategy( new FieldStrategyDropDelete(self.field, deleteFinished, null, false) ); 
    };
    this.updateTimerBar = function(){
        var timeFraction = self.timerFrameCount / (self.field.environment.timeLimit * SECOND_FRAMES);
        barManager.drawTimeBar( 1-timeFraction );
    };

}