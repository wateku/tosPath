

var EnvironmentManager = function(){
    // 落珠判定
    var DropSpace = function(){
        this.newColors   = new Object();
        this.emptyPoints = new Array();
        this.fillPoints  = new Array();
        this.dropStack   = new Array();
        for(var i = 0; i < self.hNum; i++){
            this.dropStack.push( new Array() );
        }
    }
    // 軌跡模式
    var LocusMode = {
        none    : 0,
        reverse : 1,
        unknown : 2,
        burn    : 3,
        inhibit : 4
    };
    // 版面幻界
    var Phantom = function(){
        this.phantomPoints = new Object();
        this.pointsArray = new Array();
    }

    var self = this;

    this.hNum = 0;
    this.vNum = 0;

    // 落珠分布 消珠模式 設定
    this.teamColors      = null;
    this.colorDrop       = null;
    this.colorProb       = null;
    this.colorMap        = null;
    this.colorChangeable = true;
    this.pairSize        = null;
    this.groupSize       = null;

    // 新落珠種類判定
    this.newDrop      = false;
    this.dropSpace    = null;

    // 軌跡模式設定
    this.locusMode    = null;
    this.locusInf     = false;
    this.locusShow    = false; 
    this.locusPoints  = null;

    // 版面幻界設定
    this.phantom    = null;

    this.freeMove   = false;
    this.timeLimit  = 30;

    // 紀錄模式
    this.stopReplay   = false;
    this.showRecord   = false;
    this.replaySpeed  = 5;

    this.initialize = function(){
        self.hNum = 6;
        self.vNum = 5;

        self.resetColorSetting();
        self.setTeamColorProb();
    };

    // 重設新珠機率
    this.resetColorSetting = function(){
        self.teamColors      = new Array(self.hNum);
        self.colorDrop       = ['w', 'f', 'p', 'l', 'd', 'h'];
        self.colorProb       = new Array(self.hNum);
        self.colorMap        = {};
        self.colorChangeable = true;
        self.pairSize        = {w:3, f:3, p:3, l:3, d:3, h:3};
        self.groupSize       = {w:3, f:3, p:3, l:3, d:3, h:3};
        for(var i = 0; i < self.hNum; i++){
            self.colorProb[i] = {};
        }
    };
    // 設定落珠機率流程 
    this.resetTeamComposition = function(){
        self.resetColorSetting();

        //檢查落珠設定
        dropColorManager.setColor();
        //檢查隊伍技能
        teamManager.setTeamAbility();

        self.setTeamColorProb();
    }
    // 從落珠、禁珠、技能等統整 落珠機率
    this.setTeamColorProb = function(){
        for(var i = 0; i < self.hNum; i++){
            if( self.colorChangeable ){
                var team_colors = {}, tmp_colors = {};
                var prob = 0;
                var color_len = 0;

                // 計算出現過哪幾種屬性(有在colorProb直接設定的不用計算)
                for( var c of self.colorDrop ){
                    if( !(c in self.colorProb[i]) ){
                        tmp_colors[c] = ( c in tmp_colors ) ? tmp_colors[c]+1 : 1;
                        color_len++;
                    }
                }
                // 像昇華4直接設定落珠率的直接使用
                for( var c in self.colorProb[i] ){
                    team_colors[c] = prob + self.colorProb[i][c];
                    prob += self.colorProb[i][c];
                }
                // 最終的機率是累加
                var elseProb = 1 - prob;
                for( var c in tmp_colors ){
                    var c_prob = tmp_colors[c] * ( elseProb / color_len ) ;
                    team_colors[c] = prob + c_prob;
                    prob += c_prob;
                }

                self.teamColors[i] = ( team_colors );
            }else{
                self.teamColors[i] = ( {'w': 1/6, 'f': 2/6, 'p': 3/6, 
                                        'l': 4/6, 'd': 5/6, 'h': 6/6 } );
            }
        }
    };

    // 設定新機率環境
    this.setColorDrop = function( colors ){
        self.colorDrop = colors;
    };
    this.setColorMap = function( map ){
        for(var key in map){
            self.colorMap[key] = map[key];
        }
    };
    this.setColorProb = function( prob, n ){
        for(var key in prob){
            self.colorProb[n][key] = prob[key];
        }
    };

    // 取得新珠的隨機顏色
    this.resetDropSpace = function(){
        self.dropSpace = new DropSpace();
        for(var i = 0; i < self.hNum; i++){
            for(var j = 0; j < self.vNum; j++){
                if( !fieldManager.balls[ i * self.vNum + j ] ){
                    var point = new Point( i, j, true );
                    self.dropSpace.newColors[ point.toText() ] = null;
                    self.dropSpace.emptyPoints.push( point );
                }
            }
        }
    }
    this.fillEmptySpace = function(){
        while( self.dropSpace.emptyPoints.length > 0 ){
            var point = self.dropSpace.emptyPoints.pop();
            if( !self.dropSpace.newColors[ point.toText() ] ){
                self.dropSpace.fillPoints.push( point );
                self.dropSpace.newColors[ point.toText() ] = self.nextColorAtX( point.getGridX() );
            }
        }
    }
    this.pushIntoDropStack = function(){
        for(var i = 0; i < self.dropSpace.fillPoints.length; i++){
            var point = self.dropSpace.fillPoints[i];
            if( self.dropSpace.newColors[ point.toText() ] ){
                self.dropSpace.dropStack[ point.getGridX() ].push( self.dropSpace.newColors[ point.toText() ] );
            }
        }
    }
    this.nextColorAtX = function(x){
        var colors = self.teamColors[x];
        var rand = randomNext();
        var color = 'w';

        for( var c in colors ){
            if( rand <= colors[c] ){
                color = c;
                break;
            }
        }
        if( color in self.colorMap ){
            color = self.colorMap[color];
        }
        return color;
    };
	this.isDropSpaceEmpty = function(){
		return self.dropSpace.emptyPoints.length > 0;
	}

    // 設定軌跡模式
    this.setLocusMode = function(mode){
        self.locusMode = mode;
    };
    this.hasLocus = function(){
        return self.locusMode != LocusMode.none;
    };
    this.isBallLocus = function(){
        return self.locusMode == LocusMode.reverse || self.locusMode == LocusMode.unknown;
    };
    this.isRecordLocus = function(){
        return self.locusMode == LocusMode.burn || self.locusMode == LocusMode.inhibit;
    };
    this.mapLocusItem = function(){
        if( self.locusMode == LocusMode.reverse ){ return "_"; }
        if( self.locusMode == LocusMode.unknown ){ return "q"; }
    };
    this.mapLocusColor = function(){
        if( self.locusMode == LocusMode.burn ){ return "red"; }
        if( self.locusMode == LocusMode.inhibit ){ return "green"; }
    };
    this.prepareDrawLocus = function(points){
        self.locusShow = true;
        self.locusPoints = points;
    };
    this.drawLocus = function(ctx){
        var point = self.locusPoints[0];
        ctx.save();
        ctx.beginPath();
        if( self.locusPoints.length > 1 ){
            ctx.moveTo( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2 );
            for(var i = 1; i < self.locusPoints.length; i++){
                point = self.locusPoints[i];
                ctx.lineTo( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2 );
            }
            ctx.lineWidth = BALL_SIZE/2;
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = self.mapLocusColor();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }else{
            ctx.arc( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2, BALL_SIZE/4, 0, 2*Math.PI );
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = 'rgba(0,0,0,0.0)';
            ctx.fillStyle   = self.mapLocusColor();
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    };
    this.checkLocusInhibit = function(point){
        if( self.locusMode != LocusMode.inhibit ){ return false; }
        for(var i = 0; i < self.locusPoints.length; i++){
            if( point.getGridX() == self.locusPoints[i].getGridX() &&
                point.getGridY() == self.locusPoints[i].getGridY() ){
                return true;
            }
        }
        return false;
    }

    // 設定版面幻界
    this.addPhantom = function(point, color){
        if( !self.phantom ){ self.phantom = new Phantom(); }
        if( self.phantom.phantomPoints.hasOwnProperty( point.toText() ) ){
            delete self.phantom.phantomPoints[ point.toText() ];
            id = self.phantom.pointsArray.indexOf( point.toText() );
            if( id > -1 ){
                self.phantom.pointsArray.splice( id, 1 );
            }
        }
        self.phantom.phantomPoints[ point.toText() ] = color;
        self.phantom.pointsArray.push( point.toText() );
    }
    this.deletePhantom = function(point){
        if( self.phantom ){
            if( self.phantom.phantomPoints.hasOwnProperty( point.toText() ) ) {
                delete self.phantom.phantomPoints[ point.toText() ];
                id = self.phantom.pointsArray.indexOf( point.toText() );
                if( id > -1 ){
                    self.phantom.pointsArray.splice( id, 1 );
                }
                if( self.phantom.pointsArray.length < 1 ) {
                    delete self.phantom;
                }
            }
        }
    }
    this.checkPhantomPoint = function(point) {
        if( self.phantom ){
            return self.phantom.phantomPoints.hasOwnProperty( point.toGrid().toText() );
        }
        return false;
    }
    this.getPhantomPointColor = function(point) {
        if( self.phantom ){
            if ( self.phantom.phantomPoints.hasOwnProperty( point.toGrid().toText() ) ) {
                return self.phantom.phantomPoints[ point.toGrid().toText() ];
            }
        }
    }
    this.drawPhantom = function(ctx) {
        if( !self.phantom ){ return; }

        ctx.save();
        for(var i = 0; i < self.phantom.pointsArray.length; i++ ){
            var pointKey = self.phantom.pointsArray[i];
            var point = new Point().buildFromText(pointKey);
            var color = self.phantom.phantomPoints[pointKey];
            var image = new Image();
            image.src = "img/Icon/"+color+"Tobe.png";
            ctx.drawImage(image, point.getX(), point.getY(), BALL_SIZE, BALL_SIZE);
        }

        ctx.restore();
    }

    // 設定重播速度
    this.resetReplaySpeed = function(){
        MOVE_FRAME    = 12-this.replaySpeed;
        REPLAY_SPEED  = BALL_SIZE / MOVE_FRAME;
    };

};