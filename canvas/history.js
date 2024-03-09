
var HistoryManager = function(){
    var DeletedWave = function(){
        var self = this;
		this.info              = "normal";
        this.vDeletePairs      = new Array( environmentManager.hNum );
        this.hDeletePairs      = new Array( environmentManager.vNum );
        this.orderDeletePairs  = new Array();       
        this.colorDeletePairs  = new Array( COLORS.length );
        for(var i = 0; i < environmentManager.hNum; i++){ self.vDeletePairs[i] = new Array(); }
        for(var i = 0; i < environmentManager.vNum; i++){ self.hDeletePairs[i] = new Array(); }
        for(var i = 0; i < COLORS.length; i++){ self.colorDeletePairs[i] = new Array(); }
    }
    var DeletedInfo = function(){
        var self = this;
        this.waves = new Array();
        this.waveNum = null;
        this.getCurrentWave = function(){
            if( self.waveNum != null && self.waveNum < self.waves.length ){
                return self.waves[self.waveNum];
            }
            return null;
        };
    }
    var Route = function(){
        this.record     = new Array();
        this.startPoint = new Point();
    }
    var RouteInfo = function(){
        var self = this;
        this.routes = new Array();
        this.index    = null;
        this.getCurrentRoute = function(){
            if( self.index != null && self.index < self.routes.length ){
                return self.routes[self.index];
            }
            return null;
        };
        this.nextRoute = function(){
            if( self.index != null && self.index < self.routes.length-1 ){
                ++ self.index;
                return true;
            }
            self.index = null;
            return false;
        }
    }
    var SettingInfo = function(){
        this.panel     = null;
        this.route     = null;
        this.random    = null;
        this.newDrop   = null;
        this.dropMode  = null;
        this.optional  = null;
        this.team      = null;
    }

    var self = this;

    this.panel = null;
    this.random = 0;

    // 路徑紀錄
    this.routeInfo       = null;
    this.routeInfoString = "";
    this.lines           = null;

    // 消珠紀錄
    this.deletedInfo = null;

    // 版面儲存紀錄
    this.settingInfo1 = null; 
    this.settingInfo2 = null; 
    this.settingInfo3 = null;    

    this.initialize = function(){
        self.random = RANDOM;
    };
    this.resetRandom = function(){
        RANDOM = self.random;
    };

    // 階段進度完成，紀錄版面、路徑
    this.savePanel = function( balls ){
        self.panel = new Array();
        for(var i = 0; i < balls.length; i++){
            var ball = balls[i];
            if( ball ){ self.panel.push( ball.item ); }
            else{ self.panel.push( null ); }
        }
    };
    this.saveRouteInfo = function(){
        self.routeInfoString = "";
        for(var i = 0; i < self.routeInfo.routes.length; i++){
            if( i>0 ){ self.routeInfoString += ";"; }
            self.routeInfoString += self.routeInfo.routes[i].startPoint.getGridX();
            self.routeInfoString += ",";
            self.routeInfoString += self.routeInfo.routes[i].startPoint.getGridY();
            self.routeInfoString += ":";
            for(var j = 0; j < self.routeInfo.routes[i].record.length; j++){
                self.routeInfoString += self.routeInfo.routes[i].record[j];
            }
        }
    };

    // 紀錄路徑
    this.resetRouteInfo = function(){
        self.routeInfo = new RouteInfo();
    };
    this.startNewRoute = function(point){
        var route = new Route();
        route.startPoint = point.clone().toGrid();
        self.routeInfo.routes.push( route );
        self.routeInfo.index = self.routeInfo.routes.length-1;
    };
    this.addRecord = function(direction){
        self.routeInfo.getCurrentRoute().record.push( direction );
    };
    this.getRouteInfo = function(){
        var routeInfo = new RouteInfo();
        var routesText = self.routeInfoString.split(";");
        for(var i = 0 ; i < routesText.length ; ++ i){
            if( !routesText[i] ){ break; }

            var pointText = routesText[i].split(':')[0].split(',');
            var routeText = routesText[i].split(':')[1];
            var route = new Route();
            route.startPoint = new Point( Number( pointText[0] ), Number( pointText[1] ), true );
            for(var j = 0; j < routeText.length; j++){
      		      route.record.push( Number( routeText.charAt(j) ) );
            }
            routeInfo.routes.push( route );
        }
        routeInfo.index = 0;
        return routeInfo;
    };
    this.cleanRouteInfo = function(){
        self.routeInfo = new RouteInfo();
        self.routeInfoString = "";
    }

    // 繪製路徑
    this.drawRecord = function(ctx){     
        var drawCircle = function(ctx, point, color){  
            ctx.save();
            ctx.beginPath();
            ctx.arc( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2, 6, 0, 2*Math.PI );
            ctx.lineWidth   = 3;
            ctx.fillStyle   = color;
            ctx.strokeStyle = 'black';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        for(var i = 0; i < self.lines.length; i++){   
            ctx.save();
            var point = self.lines[i][0];
            ctx.beginPath();
            ctx.moveTo( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2 );
            for(var j = 1; j < self.lines[i].length; j++){
                point = self.lines[i][j];
                ctx.lineTo( point.getX()+BALL_SIZE/2 , point.getY()+BALL_SIZE/2 );
            }
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'white';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.stroke();
            ctx.restore();

            drawCircle( ctx, self.lines[i][0].clone(), 'SpringGreen' );
            drawCircle( ctx, self.lines[i][ self.lines[i].length-1 ].clone(), 'red' );
        }

    };
    this.parseRecordLines = function(){
        var ShiftAnalysis = function(){
            var self = this;
            this.dictionary = new Object();

            this.findEmptyShift = function( points, slope ){
                var shiftCollects = new Set();
                for(var i = 0; i < points.length; i++){
                    var id = points[i].toText()
                    if( id in self.dictionary && slope in self.dictionary[id] ){
                        for(var s = 0; s < self.dictionary[id][slope].length; s++){
                            shiftCollects.add(s);
                        }
                    }
                }
                var minShift = 0;
                while( shiftCollects.has(minShift) ){ ++minShift; }
                return minShift;
            };
            this.saveShiftDictionary = function(points, slope, shift){
                for(var i = 0; i < points.length; i++){
                    var id = points[i].toText();
                    if( id in self.dictionary && slope in self.dictionary[id] ){
                        self.dictionary[id][slope].push(shift);
                    }else if( id in self.dictionary ){
                        self.dictionary[id][slope] = new Array();
                        self.dictionary[id][slope].push(shift);
                    }else{
                        self.dictionary[id] = new Object();
                        self.dictionary[id][slope] = new Array();
                        self.dictionary[id][slope].push(shift);
                    }
                }
            };
            this.makeShiftBias = function(points, slope, shift){
                var maxShift = 0;
                for(var i = 0; i < points.length; i++){
                    var id = points[i].toText();
                    for(var j = 0; j < self.dictionary[id][slope].length; j++ ){
                        maxShift = Math.max( self.dictionary[id][slope][j], maxShift );
                    }
                }
                var shiftGrid = 2*shift - maxShift;
                var shiftBias = Math.min( SHIFT_BIAS , BALL_SIZE / 2*maxShift );
                return shiftGrid * shiftBias;
            };
        };
        var Line = function(direction){
            var self = this;
            this.direction = direction;
            this.slope     = mapDirectionLineSlope(direction);
            this.points    = new Array();
            this.preLine   = null;
            this.nextLine  = null;
            this.shift     = null;
            this.extend = function(){
                var end = self.getEnd();
                self.points.push( countGoalPoint(end, self.direction) );
            }
            this.getEnd = function(){
                return self.points[ self.points.length-1 ].clone();
            }
        };

        var linesList     = new Array();
        var shiftAnalysis = new ShiftAnalysis();
        var routeInfo     = self.getRouteInfo()

        for(var i = 0; i < routeInfo.routes.length; i++){
            var route     = routeInfo.routes[i];
            var lines     = new Array();

            var direction = route.record[0];
            var line      = new Line(direction);
            line.points.push( route.startPoint );
            line.extend();
 
            for(var j = 1; j < route.record.length; j++){
                var nextDirection = route.record[j];
                if( direction == nextDirection ){
                    line.extend();
                }else{
                    // 若方向不同，將上一個line收尾，再記錄下一個line
                    shift = shiftAnalysis.findEmptyShift( line.points, line.slope );
                    shiftAnalysis.saveShiftDictionary( line.points, line.slope, shift );
                    line.shift = shift;                              
                    lines.push( line );
                    var nextStart = line.getEnd();
                    var preLine = line;

                    // 折返線要額外畫出
                    if( isOpposite(direction, nextDirection) ){
                        line = new Line(direction);
                        line.slope = mapDirectionVerticalLineSlope(direction);
                        line.preLine = preLine;
                        preLine.nextLine = line;
                        line.points.push( nextStart );

                        shift = shiftAnalysis.findEmptyShift( line.points, line.slope );
                        shiftAnalysis.saveShiftDictionary( line.points, line.slope, shift ); 
                        line.shift = shift;
                        lines.push( line );
                        preLine = line;
                    }

                    // 開始記錄下個line
                    direction = nextDirection;
                    line = new Line(direction);
                    line.preLine = preLine;
                    preLine.nextLine = line;
                    line.points.push(nextStart);
                    line.extend();
                }
            }
            // record走完，紀錄下此line
            shift = shiftAnalysis.findEmptyShift( line.points, line.slope );
            shiftAnalysis.saveShiftDictionary( line.points, line.slope, shift ); 
            line.shift = shift;
            lines.push( line );
 
            linesList.push( lines );
        }

        // 將每個line的 頭尾點加上偏差值 記錄下來
        self.lines = new Array();
        for(var i = 0; i < linesList.length; i++){
            var lines = linesList[i];
            var linePoints = new Array();

            var line = lines[0];
            var point = line.points[0].clone();
            var shift = shiftAnalysis.makeShiftBias( line.points, line.slope, line.shift );
            if( line.slope == LineSlope.VERTICAL )       { point.x += shift; }
            else if( line.slope == LineSlope.HORIZENTAL ){ point.y += shift; }
            linePoints.push(point);

            for(var j = 0; j < lines.length; j++){
                line  = lines[j];
                point = line.getEnd().clone();

                var shift = shiftAnalysis.makeShiftBias( line.points, line.slope, line.shift );
                if( line.slope == LineSlope.VERTICAL )       { point.x  += shift; }
                else if( line.slope == LineSlope.HORIZENTAL ){ point.y  += shift; }

                if( line.nextLine ){
                    var nextShift = shiftAnalysis.makeShiftBias( 
                        line.nextLine.points, line.nextLine.slope, line.nextLine.shift );
                    if( line.nextLine.slope == LineSlope.VERTICAL ){
                        point.x += nextShift;
                    }else if( line.nextLine.slope == LineSlope.HORIZENTAL ){
                        point.y += nextShift;
                    }
                }
                linePoints.push(point);
            }
            self.lines.push(linePoints);
        }
    };

    // 紀錄消除珠
    this.resetDeletedInfo = function(){
        self.deletedInfo = new DeletedInfo();
    };
    this.startDeleted = function(){
        return new DeletedWave();
    };
    this.addDeletedWave = function( deletedWave ){
        self.deletedInfo.waves.push( deletedWave );
        self.deletedInfo.waveNum = self.deletedInfo.waves.length-1;
    };
    this.getWaveNum = function(){
        return self.deletedInfo.waveNum;
    };

    // 儲存版面設定
    this.getSettingInfo = function(saveNum){
        switch(saveNum){
            case 1: return self.settingInfo1; break;
            case 2: return self.settingInfo2; break;
            case 3: return self.settingInfo3; break;
        }
    };
    this.newSettingInfo = function(saveNum){
        switch(saveNum){
            case 0:
                return new SettingInfo();
            case 1: 
                self.settingInfo1 = new SettingInfo(); 
                return self.settingInfo1;
            case 2:
                self.settingInfo2 = new SettingInfo(); 
                return self.settingInfo2;
            case 3:
                self.settingInfo3 = new SettingInfo(); 
                return self.settingInfo3;
        }
    };
    this.removeSettingInfo = function(saveNum){
        switch(saveNum){
            case 1: self.settingInfo1 = null; break;
            case 2: self.settingInfo2 = null; break;
            case 3: self.settingInfo3 = null; break;
        }
    };

};