
var Ball = function(point, item, size){
    var self = this;
    this.state  = BallState.NORMAL;
    this.point  = point;
    this.item   = item;
    this.color  = item[0];
    this.size   = size;

    this.alpha               = 1.0;
    this.dropGrid            = 0;
    this.stateFrameCount     = 0;
    this.frameCountToDelete  = DELETE_SPEED;
    this.frameCountToDropEnd = DROP_SPEED;

    this.strong  = item.indexOf('+') >= 0 ? 1 : null;
    this.inhibit = item.indexOf('x') >= 0 ? 1 : null;
    this.locking = item.indexOf('k') >= 0 ? 1 : null;
    this.frozen  = item.indexOf('i') >= 0 ? parseInt( item[ item.indexOf('i') + 1 ] ) : null;
    this.weather = item.indexOf('*') >= 0 ? 1 : null;
    this.reverse = item.indexOf('_') >= 0 ? 1 : null;
    this.unknown = item.indexOf('q') >= 0 ? 1 : null;

    this.deletedPair  = null;
    this.locusMode    = null;

    this.setState = function(state){
        self.state = state;
        self.stateFrameCount = 0;
        if(self.state == BallState.MOVING){
            self.alpha = 0.5;
        }else if(self.state == BallState.DELETED){
            self.alpha = 0.0;
        }else{
            self.alpha = 1.0;
        }
    };
    this.update = function(){
        if( self.state == BallState.DELETING ){
            if( self.stateFrameCount >= self.frameCountToDelete - DELETE_SPEED ){
                self.alpha = 1.0 * (self.frameCountToDelete - self.stateFrameCount) / DELETE_SPEED;
            }
            if( self.stateFrameCount >= self.frameCountToDelete ){
                self.setState(BallState.DELETED);
                if( self.deletedPair ){
                    comboManager.addComboSet( self.deletedPair );
                    self.deletedPair = null;
                }
            }
        }
        else if( self.state == BallState.DROPPING ){
            self.point.y = self.point.y + (self.size / self.frameCountToDropEnd) * self.dropGrid;
            if( self.stateFrameCount == self.frameCountToDropEnd - 1){
                self.setState(BallState.NORMAL);
            }
        }
        ++ self.stateFrameCount;
    };

    this.checkInhibit = function(){
        if( self.inhibit || self.weather ){ return true; }
        return false;
    }

    this.drawBall = function(ctx){
        var image = new Image();
        if( self.locusMode ){ image.src = self.mapImgSrc( self.item + self.locusMode ); }
        else{ image.src = self.mapImgSrc( self.item ); }

        ctx.save();
        ctx.globalAlpha = self.alpha;
        ctx.drawImage(image, self.point.getX(), self.point.getY(), BALL_SIZE, BALL_SIZE);

        if(self.frozen){
            var frozenImage = new Image();
            frozenImage.src = "img/Icon/i"+self.frozen+".png";
            ctx.drawImage(frozenImage, self.point.getX(), self.point.getY(), BALL_SIZE, BALL_SIZE);
        }
        if(self.weather){
            var weatherImage = new Image();
            weatherImage.src = "img/Icon/+.png";
            ctx.drawImage(weatherImage, self.point.getX(), self.point.getY(), BALL_SIZE, BALL_SIZE);
        }
        
        ctx.restore();
    };

    this.mapImgSrc = function(item){
        if( !item ){ item = self.item; }
        var plus     = item.indexOf('+') >= 0 ? '+' : '';
        var reverse  = item.indexOf('_') >= 0 ? '_' : '';

        var itemSrc = '';
        if( item.indexOf('x') >= 0 ){
            itemSrc = 'x';
        }else if( item.indexOf('q') >= 0 ){
            itemSrc = 'q';
        }else if( item.indexOf('k') >= 0 ){
            itemSrc = self.color+'k';
        }else{
            itemSrc = self.color+plus+reverse ;
        }
        return "img/Icon/"+itemSrc+".png";
    };
    this.mapColorSrc = function(item){
        if( !item ){ item = self.item; }
        var plus     = item.indexOf('+') >= 0 ? '+' : '';
        var reverse  = item.indexOf('_') >= 0 ? '_' : '';

        var itemSrc = '';
        if( item.indexOf('k') >= 0 ){
            itemSrc = self.color+'k';
        }else{
            itemSrc = self.color+plus+reverse ;
        }
        return "img/Icon/"+itemSrc+".png";
    };
    this.itemInfomation = function(){
        var info = '';
        if( self.inhibit ){ info += "隱藏風化\n"; }
        if( self.frozen  ){ info += "冰凍"+self.frozen+'\n'; }
        if( self.unknown ){ info += "問號\n"; }
        if( self.weather ){ info += "風化\n"; }
        return info;
    }

};

var BallPair = function(){
    var self = this;
    this.points = new Array();
    this.balls  = new Array();
    this.color  = null;

    this.empty = function(){
        return this.balls.length == 0;
    }
    this.addBall = function(ball){
        self.points.push( ball.point.clone() );
        self.balls.push( ball );
    }
    this.reset = function(){
        self.points = new Array();
        self.balls  = new Array();
        self.color  = null;
    }
};

var BallState = {
    NORMAL   :0,
    MOVING   :1,
    DELETING :2,
    DELETED  :3,
    DROPPING :4
};
