
var Point = function(x, y, grid){
    var self = this;
    if(grid){
        this.x = x * BALL_SIZE;
        this.y = y * BALL_SIZE;
    }else{
        this.x = x;
        this.y = y;
    }

    this.getX = function(){
        return self.x;
    };
    this.getY = function(){
        return self.y;
    };
    this.getGridX = function(){
        return Math.floor( self.x / BALL_SIZE);
    };
    this.getGridY = function(){
        return Math.floor( self.y / BALL_SIZE);
    };
    this.toGrid = function(){
        this.x = Math.floor( self.x / BALL_SIZE) * BALL_SIZE;
        this.y = Math.floor( self.y / BALL_SIZE) * BALL_SIZE;
        return this;
    };
    this.toText = function(){
        return self.x+','+self.y;
    };
    this.buildFromText = function(text){
        return new Point(
            parseInt( text.split(',')[0] ), parseInt( text.split(',')[1] ), false );
    }
    this.clone = function(){
        return new Point(self.x, self.y, false);
    };
};

var MouseInfo = function(){
    var self = this;
    this.point = new Point();
    this.lastPressed = false;
    this.pressed = false;
    this.clone = function(){
        var ret = new MouseInfo();
        ret.point = self.point.clone();
        ret.pressed = self.pressed;
        ret.lastPressed = self.lastPressed;
        return ret;
    };
};


// =================================================================
// =================================================================

var RANDOM = new Date().getTime();
function randomNext(){    
    var rand = Math.sin(RANDOM++) * 10000;
    return rand - Math.floor(rand);
}
function randomBySeed(seed){    
    var rand = Math.sin(seed) * 10000;
    return rand - Math.floor(rand);
}

// =================================================================
// =================================================================


var Direction8 = {
    TENKEY_1 :1, // </
    TENKEY_2 :2, // ↓
    TENKEY_3 :3, // \>
    TENKEY_4 :4, // ←
    TENKEY_5 :5, // x
    TENKEY_6 :6, // →
    TENKEY_7 :7, // <\
    TENKEY_8 :8, // ↑
    TENKEY_9 :9  // />
};
function getDirectionByPoints(lastPoint, newPoint){
    if( newPoint.getGridX() > lastPoint.getGridX() ){
        if( newPoint.getGridY() > lastPoint.getGridY() ){ return Direction8.TENKEY_3; }
        else if( newPoint.getGridY() < lastPoint.getGridY() ){ return Direction8.TENKEY_9; }
        else if( newPoint.getGridY() == lastPoint.getGridY() ){ return Direction8.TENKEY_6; }
    }else if( newPoint.getGridX() < lastPoint.getGridX() ){
        if( newPoint.getGridY() > lastPoint.getGridY() ){ return Direction8.TENKEY_1; }
        else if( newPoint.getGridY() < lastPoint.getGridY() ){ return Direction8.TENKEY_7; }
        else if( newPoint.getGridY() == lastPoint.getGridY() ){ return Direction8.TENKEY_4; }
    }else{
        if( newPoint.getGridY() > lastPoint.getGridY() ){ return Direction8.TENKEY_2; }
        else if( newPoint.getGridY() < lastPoint.getGridY() ){ return Direction8.TENKEY_8; }
        else{ return Direction8.TENKEY_5; }
    }
}
function getAngleByPoints(lastPoint, newPoint){
    var offsetX = newPoint.getX() - lastPoint.getX();
    var offsetY = newPoint.getY() - lastPoint.getY();
    var angle = Math.atan2(offsetY, offsetX) * ( 180.0 / Math.PI ) ;
    angle = (angle + 360) % 360;
    return angle;
}
function countGoalPoint(point, direction){
    switch(direction){
        case Direction8.TENKEY_4: point.x -= BALL_SIZE; break;
        case Direction8.TENKEY_8: point.y -= BALL_SIZE; break;
        case Direction8.TENKEY_6: point.x += BALL_SIZE; break;
        case Direction8.TENKEY_2: point.y += BALL_SIZE; break;
        case Direction8.TENKEY_1: point.x -= BALL_SIZE;
                                  point.y += BALL_SIZE; break;
        case Direction8.TENKEY_3: point.x += BALL_SIZE;
                                  point.y += BALL_SIZE; break;
        case Direction8.TENKEY_7: point.x -= BALL_SIZE;
                                  point.y -= BALL_SIZE; break;
        case Direction8.TENKEY_9: point.x += BALL_SIZE;
                                  point.y -= BALL_SIZE; break;
    }
    point.x = Math.min( Math.max( point.x, 0 ), (environmentManager.hNum-1) * BALL_SIZE );
    point.y = Math.min( Math.max( point.y, 0 ), (environmentManager.vNum-1) * BALL_SIZE );
    return point;
}; 
function isOpposite(direction, nextDirection){
    return (direction + nextDirection) == 10;
};
function getVeritcalDirection(direction){
    var verticalDirection;
    switch(direction){
        case Direction8.TENKEY_4: verticalDirection = Direction8.TENKEY_6; break;
        case Direction8.TENKEY_8: verticalDirection = Direction8.TENKEY_2; break;
        case Direction8.TENKEY_6: verticalDirection = Direction8.TENKEY_4; break;
        case Direction8.TENKEY_2: verticalDirection = Direction8.TENKEY_8; break;
    }
    return verticalDirection;
};

var LineSlope = {
    HORIZENTAL : 1,
    VERTICAL   : 2,
    NEGATIVE   : 3,
    POSITVE    : 4,
};
function mapDirectionLineSlope(direction){
    switch(direction){
        case Direction8.TENKEY_4: return LineSlope.HORIZENTAL;
        case Direction8.TENKEY_6: return LineSlope.HORIZENTAL;
        case Direction8.TENKEY_2: return LineSlope.VERTICAL;
        case Direction8.TENKEY_8: return LineSlope.VERTICAL;
        case Direction8.TENKEY_1: return LineSlope.POSITVE;
        case Direction8.TENKEY_9: return LineSlope.POSITVE;
        case Direction8.TENKEY_3: return LineSlope.NEGATIVE;
        case Direction8.TENKEY_7: return LineSlope.NEGATIVE;
    }
};
function mapDirectionVerticalLineSlope(direction){
    switch(direction){
        case Direction8.TENKEY_2: return LineSlope.HORIZENTAL;
        case Direction8.TENKEY_8: return LineSlope.HORIZENTAL;
        case Direction8.TENKEY_4: return LineSlope.VERTICAL;
        case Direction8.TENKEY_6: return LineSlope.VERTICAL;
    }
};

// =================================================================
// =================================================================

var GAME_MODE = {
    EMPTY  : 1,
    EDIT   : 2,
    TEAM   : 3,
    MOVE   : 4,
    REPLAY : 5,
};

var COLORS = ['w', 'f', 'p', 'l', 'd', 'h'];
var ELEMENT_COLORS = ['w', 'f', 'p', 'l', 'd'];
var getColorIndex = function(color){        
    for(var i = 0; i < COLORS.length; i++){
        if( COLORS[i] == color ){ return i; }
    }
    return null;
}

// =================================================================
// =================================================================

var ICON_SIZE     = 50;
var BALL_SIZE     = 80;

var DELETE_SPEED  = 10;
var DROP_SPEED    = 5;

var SECOND_FRAMES = 40;

var MOVE_FRAME    = 5;
var REPLAY_SPEED  = BALL_SIZE / MOVE_FRAME;

var SHIFT_BIAS    = BALL_SIZE / 20;


// =================================================================
// utility function for checking
// =================================================================
function checkFirstStraightByPlace( length, x ){
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }

    for(var i = 0; i < deletedWave.vDeletePairs[x].length; i++){
        if( deletedWave.vDeletePairs[x][i].balls.length >= length ){ return true; }
    }
    return false;
}

// =================================================================
// utility function for add newItem
// =================================================================
function addNewItemRandomPositionIntoDropSpace(item){
	if( !environmentManager.isDropSpaceEmpty() ) return;

	var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
    var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0];
    environmentManager.dropSpace.fillPoints.push( point );
    environmentManager.dropSpace.newColors[ point.toText() ] = item;
}
function addNewItemIndexPositionIntoDropSpace(index, item){
	if( !environmentManager.isDropSpaceEmpty() ) return;
	if( !(environmentManager.dropSpace.emptyPoints.length > index) ) return; 

    var point = environmentManager.dropSpace.emptyPoints.splice(index, 1)[0];
    environmentManager.dropSpace.fillPoints.push( point );
    environmentManager.dropSpace.newColors[ point.toText() ] = item;
}
function findLowestPositionIndex(emptyPoints, x){
	var index = -1;
	for(var i = 0; i < emptyPoints.length; i++){
		var point = emptyPoints[i];
		if(point.getGridX() == x){
			if(index == -1 || point.getGridY() < emptyPoints[index].getGridY()){
				index = i;
			}
		}
	}
	if( index != -1 ){ return index; }
	return null;
}