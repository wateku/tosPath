//==============================================================
//==============================================================
// Skill Function
//==============================================================
//==============================================================

var BasicLeaderSetting = function( member ){}

//==============================================================
// GREEK
//==============================================================
var GreekSetting = function( member ){
    this.count = 0;
}
var GreekRandNewItem = function( member, direct ){
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }
	
    var num = this.variable.count;
    if( historyManager.deletedInfo.waveNum == 0 ){
		num = deletedWave.orderDeletePairs.length * 3;
	}

    for(var i = 0; i < deletedWave.colorDeletePairs[ getColorIndex(member.color) ].length; i++){
        num += deletedWave.colorDeletePairs[ getColorIndex(member.color) ][i].balls.length;
    }
    while( num >= 3 && environmentManager.isDropSpaceEmpty() ){
        num -= 3;
		addNewItemRandomPositionIntoDropSpace(member.color+'+');
    }

    this.variable.count = num;
}

//==============================================================
// COUPLE
//==============================================================
var CoupleSetting = function( member ){
    environmentManager.colorChangeable = false;
    environmentManager.pairSize[ member.color ] = 2;
    environmentManager.pairSize[ 'h' ] = 2;
    environmentManager.groupSize[ member.color ] = 2;
    environmentManager.groupSize[ 'h' ] = 2;
    this.count = 0;
}
var CoupleEndSkill = function( member, direct ){
    turnRandomElementToColorByConfig( {
        color          : VAR['COLOR'],
        num            : 2,
        priorityColors : [ ['l', 'd'], ['w', 'h'], ['f', 'p'] ],
    } );
}

//==============================================================
// BABYLON
//==============================================================
var BabylonNewItem = function( member, direct ){
    if( historyManager.deletedInfo.waveNum != 0 ){ return; }

    for(var x = 0; x < environmentManager.hNum; x++){
        if( checkFirstStraightByPlace( 4, x ) ){
            var newItemNum = 1;
			while( newItemNum > 0 ){
				newItemNum -= 1;
				var newPointIndex = findLowestPositionIndex(environmentManager.dropSpace.emptyPoints, x);
				if( newPointIndex != null ){
					addNewItemIndexPositionIntoDropSpace( newPointIndex, member.color );
				}
			}
        }
    }
}
//==============================================================
// OLD GREEK
//==============================================================
var BoundaryRevolutionSetting = function( member ){
    environmentManager.colorChangeable = false;
    environmentManager.pairSize[ 'w' ] = 2;
    environmentManager.pairSize[ 'f' ] = 2;
    environmentManager.pairSize[ 'p' ] = 2;
    environmentManager.pairSize[ 'l' ] = 2;
    environmentManager.pairSize[ 'd' ] = 2;
    environmentManager.pairSize[ 'h' ] = 2;
    this.count = 0;
}

//==============================================================
// UNIVERSE AZATHOTH
//==============================================================
var AzathothSetting = function( member ){
    this.count = 0;
}
var AzathothNewItem = function( member, direct ){
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }
	
    if( historyManager.deletedInfo.waveNum == 0 ){
		this.variable.count = deletedWave.orderDeletePairs.length;
	}
    var num = this.variable.count;
	 
	var newPointIndex = findLowestPositionIndex(environmentManager.dropSpace.emptyPoints, member.xIndex);
	while( num > 0 && newPointIndex != null ){
		num -= 1;
		addNewItemIndexPositionIntoDropSpace( newPointIndex, member.color+"+" );
	    newPointIndex = findLowestPositionIndex(environmentManager.dropSpace.emptyPoints, member.xIndex);
	}
	
    this.variable.count= num;
}

//==============================================================
// WARLORD
//==============================================================
var FourGroupSetting = function( member ){
	COLORS.forEach( (color) => {
		environmentManager.pairSize[ color ] = 2;
		environmentManager.groupSize[ color ] = 4;
	}); 
}

//==============================================================
//==============================================================
// Skill Database
//==============================================================
//==============================================================

var LEADER_SKILLS_DATA = {
    NONE : {
        id			: "NONE",
        label		: "靈魂收割 ‧ 結",
        info		: "當敵方生命力 40% 以下，無視防禦力和屬性，每回合以自身攻擊力 6 倍追打 1 次",
        init		: BasicLeaderSetting,
    },
    GREEK_W : {
        id			: "GREEK_W",
        label		: "浪濤連動",
        info		: "每累計消除 3 粒水符石 ，將產生 1 粒水強化符石",
        randNewItem	: GreekRandNewItem,
        init		: GreekSetting,
    },
    GREEK_F : {
        id			: "GREEK_F",
        label		: "熾燄連動",
        info		: "每累計消除 3 粒火符石 ，將產生 1 粒火強化符石",
        randNewItem	: GreekRandNewItem,
        init		: GreekSetting,
    },
    GREEK_P : {
        id			: "GREEK_P",
        label		: "藤木連動",
        info		: "每累計消除 3 粒木符石 ，將產生 1 粒木強化符石",
        randNewItem	: GreekRandNewItem,
        init		: GreekSetting,
    },
    GREEK_L : {
        id			: "GREEK_L",
        label		: "玄光連動",
        info		: "每累計消除 3 粒光符石 ，將產生 1 粒光強化符石",
        randNewItem	: GreekRandNewItem,
        init		: GreekSetting,
    },
    GREEK_D : {
        id			: "GREEK_D",
        label		: "幽冥連動",
        info		: "每累計消除 3 粒暗符石 ，將產生 1 粒暗強化符石",
        randNewItem	: GreekRandNewItem,
        init		: GreekSetting,
    },
    COUPLE_F : {
        id			: "COUPLE_F",
        label		: "火靈符籙",
        info		: "2 粒火符石或心符石相連，即可發動消除，所有符石掉落機率不受其他技能影響 (包括改變掉落符石屬性的技能)。回合結束時，將 2 粒符石轉化為火符石 (光及暗符石優先轉換)",
        end			: CoupleEndSkill,
        init		: CoupleSetting,
    },
    COUPLE_P : {
        id			: "COUPLE_P",
        label		: "木靈符籙",
        info		: "2 粒木符石或心符石相連，即可發動消除，所有符石掉落機率不受其他技能影響 (包括改變掉落符石屬性的技能)。回合結束時，將 2 粒符石轉化為木符石 (光及暗符石優先轉換)",
        end			: CoupleEndSkill,
        init		: CoupleSetting,
    },
    BABYLON_W : {
        id			: "BABYLON_W",
        label		: "穹蒼之賜 ‧ 水",
        info		: "水屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒水符石",
        newItem		: BabylonNewItem,
        init		: BasicLeaderSetting,
    },
    BABYLON_F : {
        id			: "BABYLON_F",
        label		: "穹蒼之賜 ‧ 火",
        info		: "火屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒火符石",
        newItem		: BabylonNewItem,
        init		: BasicLeaderSetting,
    },
    BABYLON_P : {
        id			: "BABYLON_P",
        label		: "穹蒼之賜 ‧ 木",
        info		: "木屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒木符石",
        newItem		: BabylonNewItem,
        init		: BasicLeaderSetting,
    },
    BABYLON_L : {
        id			: "BABYLON_L",
        label		: "穹蒼之賜 ‧ 光",
        info		: "光屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒光符石",
        newItem		: BabylonNewItem,
        init		: BasicLeaderSetting,
    },
    BABYLON_D : {
        id			: "BABYLON_D",
        label		: "穹蒼之賜 ‧ 暗",
        info		: "暗屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒暗符石",
        newItem		: BabylonNewItem,
        init		: BasicLeaderSetting,
    },
    BOUNDARY_REVOLUTION: {
        id			: "OLD_GREEK_WD",
        label		: "界限變革",
        info		: "所有符石只要同屬性 3 粒相連即可消除",
        init		: BoundaryRevolutionSetting,
    },
    RAIN_OF_SAKURA: {
        id			: "RAIN_OF_SAKURA",
        label		: "櫻之花雨",
        info		: "2 粒火或心符石相連，即可發動消除，所有符石掉落機率不受其他技能影響（包括改變掉落符石屬性的技能）",
        init		: CoupleSetting,
    },
    VIOLENCE_OF_DARK_DRAGONS: {
        id			: "VIOLENCE_OF_DARK_DRAGONS",
        label		: "暗龍暴",
        info		: "每首批消除 1 連擊 (Combo)，自身直行掉落 1 粒暗強化符石。",
		newItem		: AzathothNewItem,
        init		: AzathothSetting,
    },
    GREATNESS_OF_WARLORD: {
        id			: "GREATNESS_OF_WARLORD",
        label		: "霸者盛勢",
        info		: "符石需 4 粒或以上相連才可發動消除",
        init		: FourGroupSetting,
    },
};
