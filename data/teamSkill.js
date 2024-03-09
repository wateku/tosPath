//==============================================================
//==============================================================
// Team Skill Function
//==============================================================
//==============================================================

var BasicTeamSetting = function(leader, friend){}

//==============================================================
// Greek
//==============================================================
var GreekTeamSetting = function(leader, friend){
	this.count = 0;
	this.colorDeleted = [ false, false, false, false, false ];
}
var GreekTeamRandNewItem = function(leader, friend){	
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }

    // 第一波消除=>新回合重新計算
    if ( historyManager.deletedInfo.waveNum == 0 ) { 
		this.variable.count = 0; 
		this.variable.colorDeleted = [ false, false, false, false, false ];
	}
    var num = this.variable.count;

	ELEMENT_COLORS.forEach( (color) => {
		var index = getColorIndex(color);
		if( !this.variable.colorDeleted[index] && deletedWave.colorDeletePairs[index].length > 0 ){
			num += 3;
			this.variable.colorDeleted[index] = true;
		}
	});

    while(num > 0 && environmentManager.isDropSpaceEmpty() ){
    	num -= 1;
		addNewItemRandomPositionIntoDropSpace(leader.color);
    }

    this.variable.count = num;
}
//==============================================================
// BABYLON
//==============================================================
var BabylonTeamNewItem = function( leader, friend ){
    if( historyManager.deletedInfo.waveNum != 0 ){ return; }

    for(var x = 0; x < environmentManager.hNum; x++){
        if( checkFirstStraightByPlace( 5, x ) ){
            var newItemNum = 1;
			while( newItemNum > 0 ){
				newItemNum -= 1;
				var newPointIndex = findLowestPositionIndex(environmentManager.dropSpace.emptyPoints, x);
				if( newPointIndex != null ){
					addNewItemIndexPositionIntoDropSpace( newPointIndex, leader.color );
				}
			}
        }
    }
}
//==============================================================
// OLD_GREEK
//==============================================================
var OldGreekTeamSetting = function(leader, friend){
	this.count = 0;
}
var OldGreekTeamRandNewItem = function(leader, friend){	
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }

    // 首波每串+1, 次波最多+5
    if ( historyManager.deletedInfo.waveNum == 0 ) { 
    	this.variable.count = 0;
    	var num = deletedWave.orderDeletePairs.length;
	    while(num > 0 && environmentManager.isDropSpaceEmpty() ){
	    	num -= 1;
			addNewItemRandomPositionIntoDropSpace(leader.color);
	    }
    } else {
    	var num = deletedWave.orderDeletePairs.length;
    	while( num > 0 && this.variable.count < 5 && environmentManager.isDropSpaceEmpty() ){
    		num -= 1;
    		this.variable.count += 1;
			addNewItemRandomPositionIntoDropSpace(leader.color);
    	}
    }
}
//==============================================================
// FALLEN_HALO
//==============================================================
var FallenHaloBreakColor = function(leader, friend){
    environmentManager.pairSize[ 'h' ] = 1;
    environmentManager.groupSize[ 'h' ] = 1;

    fieldManager.strategy.countDeleteBalls( fieldManager.balls );

    environmentManager.pairSize[ 'h' ] = 3;
    environmentManager.groupSize[ 'h' ] = 3;

    //設定消除珠動畫
    for(var i = 0 ; i < fieldManager.strategy.deletedWave.orderDeletePairs.length ; i++){ 
        var startFrame = DELETE_SPEED;
        for(var j = 0 ; j < fieldManager.strategy.deletedWave.orderDeletePairs[i].balls.length ; j++){
            var ball = fieldManager.strategy.deletedWave.orderDeletePairs[i].balls[j];
            ball.setState( BallState.DELETING );
            ball.frameCountToDelete = startFrame;
        }
    }
}

//==============================================================
// WARLORD
//==============================================================
var WarLordTeamSetting = function(leader, friend){
    environmentManager.colorChangeable = false;
    environmentManager.pairSize[ 'w' ] = 2;
    environmentManager.pairSize[ 'f' ] = 2;
    environmentManager.pairSize[ 'p' ] = 2;
    environmentManager.pairSize[ 'l' ] = 2;
    environmentManager.pairSize[ 'd' ] = 2;
    environmentManager.pairSize[ 'h' ] = 2;
}
//==============================================================
// TABLE_KNIGHT
//==============================================================
var TableKnightBreakColor = function(leader, friend){ 
    environmentManager.pairSize[ leader.color ] = 1;
    environmentManager.groupSize[ leader.color ] = 1;

    fieldManager.strategy.countDeleteBalls( fieldManager.balls );

    environmentManager.pairSize[ leader.color ] = 3;
    environmentManager.groupSize[ leader.color ] = 3;

    //設定消除珠動畫
    for(var i = 0 ; i < fieldManager.strategy.deletedWave.orderDeletePairs.length ; i++){ 
        var startFrame = DELETE_SPEED;
        for(var j = 0 ; j < fieldManager.strategy.deletedWave.orderDeletePairs[i].balls.length ; j++){
            var ball = fieldManager.strategy.deletedWave.orderDeletePairs[i].balls[j];
            ball.setState( BallState.DELETING );
            ball.frameCountToDelete = startFrame;
        }
    }
}
//==============================================================
// DARK_GOLD_MAYA
//==============================================================
var DarkGoldMayaSetting = function(leader, friend){
    environmentManager.colorChangeable = false;
    environmentManager.pairSize[ 'w' ] = 2;
    environmentManager.pairSize[ 'f' ] = 2;
    environmentManager.pairSize[ 'p' ] = 2;
    environmentManager.pairSize[ 'l' ] = 2;
    environmentManager.pairSize[ 'd' ] = 2;
    environmentManager.pairSize[ 'h' ] = 2;
    this.count = 0;
}
var DarkGoldMayaBreakColor = function(leader, friend) {
	if( this.variable.count == 0 ) { 
		this.variable.count += 1;

		var deletedPairs = new BallPair();
		var deletedPosition = [0, 4, 6, 8, 12, 17, 21, 23, 25, 29];
		for(var i = 0; i < deletedPosition.length; i++ ){
			var ballPosition = deletedPosition[i];
			if( ballPosition < fieldManager.balls.length &&
				fieldManager.balls[ ballPosition ] != null ) {
				deletedPairs.addBall( fieldManager.balls[ ballPosition ] );
			}
		}
		fieldManager.strategy.deletedWave.orderDeletePairs.push( deletedPairs );

	    //設定消除珠動畫
	    for(var i = 0 ; i < fieldManager.strategy.deletedWave.orderDeletePairs.length ; i++){ 
	        var startFrame = DELETE_SPEED;
	        for(var j = 0 ; j < fieldManager.strategy.deletedWave.orderDeletePairs[i].balls.length ; j++){
	            var ball = fieldManager.strategy.deletedWave.orderDeletePairs[i].balls[j];
	            ball.setState( BallState.DELETING );
	            ball.frameCountToDelete = startFrame;
	        }
	    }

	}else{
		this.variable.count = 0;
	}
}
//==============================================================
// STAR_BURST_OPHIUCHUS
//==============================================================
var StarBurstOphiuchusTeamLocus = function(leader, friend, paraments){
	if( ! paraments[0] instanceof Point ){ return; }
	var lastPoint = paraments[0];
    var ball = fieldManager.getBallAtPoint( lastPoint );
	 
	if( ball.frozen == null || ball.frozen == 1 ){
		ball.item = ball.color+"+";
	}
}
//==============================================================
// FAIRY_SAKURA
//==============================================================
var FairySakuraTeamSetting = function(leader, friend){
	this.countF = 0;
	this.countH = 0;
	this.wfpNum = 0;
	this.ldhNum = 0;
}
var FairySakuraTeamRandNewItem = function(leader, friend){ 
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }

    // 第一波消除=>新回合重新計算
    if ( historyManager.deletedInfo.waveNum == 0 ) { 
		this.variable.countF = 0; 
		this.variable.countH = 0;
		this.variable.wfpNum = 0; 
		this.variable.ldhNum = 0;

		//首消每串水火木 掉落4火強
		this.variable.wfpNum = 0;
		this.variable.wfpNum += deletedWave.colorDeletePairs[ getColorIndex('w') ].length *4;
		this.variable.wfpNum += deletedWave.colorDeletePairs[ getColorIndex('f') ].length *4;
		this.variable.wfpNum += deletedWave.colorDeletePairs[ getColorIndex('p') ].length *4;

		//首消每串光暗心 掉落4心強
		this.variable.ldhNum = 0;
		this.variable.ldhNum += deletedWave.colorDeletePairs[ getColorIndex('l') ].length *4;
		this.variable.ldhNum += deletedWave.colorDeletePairs[ getColorIndex('d') ].length *4;
		this.variable.ldhNum += deletedWave.colorDeletePairs[ getColorIndex('h') ].length *4;
	}

	while(this.variable.wfpNum > 0 && environmentManager.isDropSpaceEmpty() ){
		this.variable.wfpNum -= 1;
		addNewItemRandomPositionIntoDropSpace('f+');
	}

	while(this.variable.ldhNum > 0 && environmentManager.isDropSpaceEmpty() ){
		this.variable.ldhNum -= 1;
		addNewItemRandomPositionIntoDropSpace('h+');
	}

	//每消除10火 掉落一火強
	var fballs = deletedWave.colorDeletePairs[ getColorIndex('f') ];
	for(var i = 0; i < fballs.length; i++){
		this.variable.countF += fballs[i].balls.length;
	}
	while(this.variable.countF >= 10 && environmentManager.isDropSpaceEmpty() ){
		this.variable.countF -= 10;
		addNewItemRandomPositionIntoDropSpace('f+');
	}

	//每消除10心 掉落一心強
	var hballs = deletedWave.colorDeletePairs[ getColorIndex('h') ];
	for(var i = 0; i < hballs.length; i++){
		this.variable.countH += hballs[i].balls.length;
	}
	while(this.variable.countH >= 10 && environmentManager.isDropSpaceEmpty() ){
		this.variable.countH -= 10;
		addNewItemRandomPositionIntoDropSpace('h+');
	}

}
//==============================================================
// FAIRY_ROZEN
//==============================================================
var FairyRozenTeamRandNewItem = function(leader, friend){ 
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; } 

    // 第一波消除=>新回合重新計算 
    if ( historyManager.deletedInfo.waveNum != 0 ) { return; }

	// 每首消一橫排 掉落5心
	var hCounters = new Array(environmentManager.vNum);
	for(var i = 0; i < environmentManager.vNum; i++){
		hCounters[i] = 0;
	} 
	for(var p = 0; p < deletedWave.orderDeletePairs.length; p++){
		for(var b = 0; b < deletedWave.orderDeletePairs[p].balls.length; b++){
			var ball = deletedWave.orderDeletePairs[p].balls[b];
			var y = ball.point.getGridY();
			hCounters[y] += 1;
		}
	}

	var num = 0;
	for(var i = 0; i < environmentManager.vNum; i++){
		if( hCounters[i] == environmentManager.hNum ){
			num += 5;
		}
	} 
	while(num > 0 && environmentManager.isDropSpaceEmpty() ){
		num -= 1;
		addNewItemRandomPositionIntoDropSpace('h');
	}
}

//==============================================================
// UNIVERSE_DAOLOTH
//==============================================================
var UniverseDaolothTeamLocus = function(leader, friend, paraments){
	if( ! paraments[0] instanceof Point ){ return; }
	var lastPoint = paraments[0];
    var ball = fieldManager.getBallAtPoint( lastPoint );

	if( comboManager.moveNum < 5 ){
		if( ball.frozen == null || ball.frozen == 1 ){
			ball.color = leader.color;
			ball.item = leader.color+"+";
		}
	}
}

//==============================================================
//==============================================================
var TEAM_SKILLS_DATA = {
	findTeamSkills : function(leader, friend){
		var skillArray = new Array();
		if( leader.id == friend.id && leader.id.startsWith("GREEK") ){
			skillArray.push("GREEK_TEAM");
		}
		if( leader.id == friend.id && leader.id.startsWith("BABYLON") ){
			skillArray.push("BABYLON_TEAM");
		}
		if( leader.id == friend.id && leader.id.startsWith("OLD_GREEK") ){
			skillArray.push("OLD_GREEK_TEAM");
		}
		if( leader.id == friend.id && leader.id.startsWith("FALLEN_HALO") ){
			skillArray.push("FALLEN_HALO_TEAM");
		}
		if( leader.id == friend.id && leader.id == "IMPERIAL_WARLORD_W" ){
			skillArray.push("WARLORD_TEAM");
		}
		if( leader.id == friend.id && leader.id == "TABLE_KNIGHT_L" ){
			skillArray.push("TABLE_KNIGHT_TEAM");
		}
		if( leader.id == friend.id && leader.id == "DARK_GOLD_MAYA" ){
			skillArray.push("DARK_GOLD_MAYA_TEAM");
		}
		if( leader.id == friend.id && leader.id == "STAR_BURST_OPHIUCHUS" ){
			skillArray.push("STAR_BURST_OPHIUCHUS_TEAM");
		}
		if( leader.id == friend.id && leader.id == "FAIRY_SAKURA" ){
			skillArray.push("FAIRY_SAKURA_TEAM");
		}
		if( leader.id == friend.id && leader.id == "FAIRY_ROZEN" ){
			skillArray.push("FAIRY_ROZEN_TEAM");
		}
		if( leader.id == friend.id && leader.id == "UNIVERSE_DAOLOTH" ){
			skillArray.push("UNIVERSE_DAOLOTH_TEAM"); 
		}
		return skillArray;
	},

	NONE: {
		id: "NONE",
		init: BasicTeamSetting,
	},
	GREEK_TEAM: {
		id: "GREEK_TEAM",
		init: GreekTeamSetting,
		randNewItem: GreekTeamRandNewItem,
	},
	BABYLON_TEAM: {
		id: "BABYLON_TEAM",
		init: BasicTeamSetting,
		newItem: BabylonTeamNewItem,
	},
	OLD_GREEK_TEAM: {
		id: "OLD_GREEK_TEAM",
		init: OldGreekTeamSetting,
		randNewItem: OldGreekTeamRandNewItem,
	},
	FALLEN_HALO_TEAM: {
		id: "FALLEN_HALO_TEAM",
		init: BasicTeamSetting,
		breakColor: FallenHaloBreakColor,
	},
	WARLORD_TEAM: {
		id: "WARLORD_TEAM",
		init: WarLordTeamSetting,
	},
	TABLE_KNIGHT_TEAM: {
		id: "TABLE_KNIGHT_TEAM",
		init: BasicTeamSetting,
		breakColor: TableKnightBreakColor,
	},
	DARK_GOLD_MAYA_TEAM: {
		id: "DARK_GOLD_MAYA_TEAM",
		init: DarkGoldMayaSetting,
		breakColor: DarkGoldMayaBreakColor,
	},
	STAR_BURST_OPHIUCHUS_TEAM: {
		id: "STAR_BURST_OPHIUCHUS_TEAM",
		init: BasicTeamSetting,
		locus: StarBurstOphiuchusTeamLocus,
	},
	FAIRY_SAKURA_TEAM: {
		id: "FAIRY_SAKURA_TEAM",
		init: FairySakuraTeamSetting,
		randNewItem: FairySakuraTeamRandNewItem,
	},
	FAIRY_ROZEN_TEAM: {
		id: "FAIRY_ROZEN_TEAM",
		init: BasicTeamSetting,
		randNewItem: FairyRozenTeamRandNewItem,
	},
	UNIVERSE_DAOLOTH_TEAM: {
		id: "UNIVERSE_DAOLOTH_TEAM",
		init: BasicTeamSetting,
		locus: UniverseDaolothTeamLocus,
	},
};