//==============================================================
//==============================================================
// Combine Skill Function
//==============================================================
//==============================================================

var BasicCombineSkillSetting = function( member, place, i, COMBINE, source ){
	return {
        COLOR    : member['color'],
        TYPE     : member['type'],
        COMBINE  : COMBINE,
        STYLE    : "combineSkill",
        SOURCE   : source,
        PLACE    : place,
        i        : i,
	};
}

var BasicCombineSkillCheck = function( trigger_place, trigger_i ){
	return basicFunctionCombineSkillCheck( this.variable, trigger_place, trigger_i );
}
function basicFunctionCombineSkillCheck( VAR, trigger_place, trigger_i ){
    var useable = checkCombineUseable( VAR['COMBINE'] )
	return useable['check'];
}

//==============================================================
// Enchanted Injunction
//==============================================================
var EnchantedInjunctionSetting = function( member, place, i, COMBINE, source ){
	return {
        COLOR           : member['color'],
        TYPE            : member['type'],
        COMBINE         : COMBINE,
        COLOR_MAIN      : this.config[0],
        COLOR_EXCLUSIVE : this.config[1],
        COLOR_TO_H      : this.config[2],
        SOURCE          : source,
        PLACE           : place,
        i               : i,
	};
}
var EnchantedInjunctionCheck = function( place, i ){
	return basicFunctionCombineSkillCheck( this.variable, place, i ) && 
		checkHasElementByColorArr( [ this.variable['COLOR_TO_H'], this.variable['COLOR_EXCLUSIVE'], 'h' ] ) &&
		checkHasElementByColorWithoutStrong( this.variable['COLOR_MAIN'] );
}
var EnchantedInjunctionTransfer = function( place, i ){
    for(var id of getStackOfPanelByColorArr( [ this.variable['COLOR_MAIN'], this.variable['COLOR_EXCLUSIVE'], 'h' ] ) ){
    	turnElementToColorByID( id, this.variable['COLOR_MAIN']+"+" );
    }
    for(var id of getStackOfPanelByColor( this.variable['COLOR_TO_H'] )){
    	turnElementToColorByID( id, 'h' );
    }
}

var EnchantedInjunctionW_Mapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "NORDIC_W", "BOSS_ODIN", "BOSS_ODIN_CREATURE_1", "BOSS_ODIN_CREATURE_2" ],
            check : [ "{0}>0", "({1}+{2}+{3})>0" ],
        }) ){
		combineSkillMapping(
			'ENCHANTED_INJUNCTION_W', [ 
				{ "NORDIC_W" : "RUNE_STRENGTHEN_W" },
				{ "BOSS_ODIN" : "DESPERATE_ATTACK", 
				  "BOSS_ODIN_CREATURE_1": "DESPERATE_ATTACK", "BOSS_ODIN_CREATURE_2": "DESPERATE_ATTACK" },
			] );
	}
}
var EnchantedInjunctionF_Mapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "NORDIC_F", "BOSS_ODIN", "BOSS_ODIN_CREATURE_1", "BOSS_ODIN_CREATURE_2" ],
            check : [ "{0}>0", "({1}+{2}+{3})>0" ],
        }) ){
		combineSkillMapping(
			'ENCHANTED_INJUNCTION_F', [ 
				{ "NORDIC_F" : "RUNE_STRENGTHEN_F" },
				{ "BOSS_ODIN" : "DESPERATE_ATTACK", 
				  "BOSS_ODIN_CREATURE_1": "DESPERATE_ATTACK", "BOSS_ODIN_CREATURE_2": "DESPERATE_ATTACK" },
			] );
	}
}
var EnchantedInjunctionP_Mapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "NORDIC_P", "BOSS_ODIN", "BOSS_ODIN_CREATURE_1", "BOSS_ODIN_CREATURE_2" ],
            check : [ "{0}>0", "({1}+{2}+{3})>0" ],
        }) ){
		combineSkillMapping(
			'ENCHANTED_INJUNCTION_P', [ 
				{ "NORDIC_P" : "RUNE_STRENGTHEN_P" },
				{ "BOSS_ODIN" : "DESPERATE_ATTACK", 
				  "BOSS_ODIN_CREATURE_1": "DESPERATE_ATTACK", "BOSS_ODIN_CREATURE_2": "DESPERATE_ATTACK" },
			] );
	}
}
var EnchantedInjunctionL_Mapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "NORDIC_L", "BOSS_ODIN", "BOSS_ODIN_CREATURE_1", "BOSS_ODIN_CREATURE_2" ],
            check : [ "{0}>0", "({1}+{2}+{3})>0" ],
        }) ){
		combineSkillMapping(
			'ENCHANTED_INJUNCTION_L', [ 
				{ "NORDIC_L" : "RUNE_STRENGTHEN_L" },
				{ "BOSS_ODIN" : "DESPERATE_ATTACK", 
				  "BOSS_ODIN_CREATURE_1": "DESPERATE_ATTACK", "BOSS_ODIN_CREATURE_2": "DESPERATE_ATTACK" },
			] );
	}
}
var EnchantedInjunctionD_Mapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "NORDIC_D", "BOSS_ODIN", "BOSS_ODIN_CREATURE_1", "BOSS_ODIN_CREATURE_2" ],
            check : [ "{0}>0", "({1}+{2}+{3})>0" ],
        }) ){
		combineSkillMapping(
			'ENCHANTED_INJUNCTION_D', [ 
				{ "NORDIC_D" : "RUNE_STRENGTHEN_D" },
				{ "BOSS_ODIN" : "DESPERATE_ATTACK", 
				  "BOSS_ODIN_CREATURE_1": "DESPERATE_ATTACK", "BOSS_ODIN_CREATURE_2": "DESPERATE_ATTACK" },
			] );
	}
}

//==============================================================
// Diablo
//==============================================================
var SourceOfLifeAddtionalEffectAdd = function( place, i ){
    var effect = NewAdditionalEffect( this.id );
    effect['variable'] = effect['preSet']( this.variable );
    additionalEffectAdd( effect );	
}
var SourceOfLifeCheck = function( trigger_place, trigger_i ){
	return basicFunctionCombineSkillCheck( this.variable, trigger_place, trigger_i ) &&
		basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "belongColor" );
}
var SourceOfLifeMapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "BOSS_DIABLO", "EGG_SPIRIT_W", "EGG_SPIRIT_F", "EGG_SPIRIT_P", "EGG_SPIRIT_L", "EGG_SPIRIT_D" ],
            check : [ "{0}>0", "({1}+{2}+{3}+{4}+{5})>0" ],
        }) ){
		combineSkillMapping(
			'SOURCE_OF_LIFE', [ 
				{ "BOSS_DIABLO" : "NOXIOUS_REPLACEMENT_HEART" },
				{ 
					"EGG_SPIRIT_W" : "BIBBLE_BURST",
					"EGG_SPIRIT_W" : "BIBBLE_BURST_EX",
					"EGG_SPIRIT_F" : "IGNITION",
					"EGG_SPIRIT_P" : "HARVEST_OF_LIFE",
					"EGG_SPIRIT_P" : "HARVEST_OF_LIFE_EX",
					"EGG_SPIRIT_L" : "PREVASION",
					"EGG_SPIRIT_L" : "PREVASION_EX",
					"EGG_SPIRIT_D" : "BEWITCHMENT",
				},
			] );
	}	
}

//==============================================================
// Dragon Servant/ethernal 
//==============================================================
var PearlOfDragonDuosCheck = function( place, i ){
	return basicFunctionCombineSkillCheck( this.variable, place, i ) && 
		checkHasElementByColorArr( [ 'h', this.variable['COLOR'], COLOR_EXCLUSIVE[this.variable['COLOR']] ] );
}
var DragonLashingTailCheck = function( place, i ){
	return basicFunctionCombineSkillCheck( this.variable, place, i ) && 
		checkHasElementByColorArr( [ 'h', COLOR_EXCLUSIVE[this.variable['COLOR']] ] );
}
var PearlOfDragonDuosTransfer = function( place, i ){
    for(var id of getStackOfPanelByColorArr( [ 'h', this.variable['COLOR'], COLOR_EXCLUSIVE[this.variable['COLOR']] ] ) ){
    	turnElementToColorByID( id, this.variable['COLOR']+"+" );
    }    
    var stack = getStackOfStraight(place);
    for(var id of stack){
        turnElementToColorByID(id, this.variable['COLOR']);
    }
}
var DragonLashingTailTransfer = function( place, i ){	
    var base = 0;
    $.each(TEAM_MEMBERS, function(place, member){
        if( member['type'] == 'DRAGON' || member['color'] == 'p' ){
            base += member['health'];
        }
    });
    var recover = makeNewRecover();
    recover['base']  = base;
    recover['factor']= 0.5;
    recover['style'] = "active";
    recover['log']   = "DragonLashingTail";
    makeDirectRecovery( recover );

    for(var id of getStackOfPanelByColorArr( [ 'h', COLOR_EXCLUSIVE[this.variable['COLOR']] ] ) ){
    	turnElementToColorByID( id, this.variable['COLOR'] );
    }
}
var PearlOfDragonDuosF_Mapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "ETHEREAL_DRAGON_F", "DRAGON_SERVANT_F" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping(
			'PEARL_OF_DRAGON_DUOS_F', [ 
				{ "ETHEREAL_DRAGON_F" : "DEFENSIVE_STANCE_F" },
				{ "DRAGON_SERVANT_F" : "ATTACK_REINFORCEMENT_F" },
			] );
	}
}
var PearlOfDragonDuosL_Mapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "ETHEREAL_DRAGON_L", "DRAGON_SERVANT_L" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping(
			'PEARL_OF_DRAGON_DUOS_L', [ 
				{ "ETHEREAL_DRAGON_L" : "THUNDER_STRIKE_EX" },
				{ "DRAGON_SERVANT_L" : "ATTACK_REINFORCEMENT_L" },
			] );
	}
}
var DragonLashingTailMapping = function(){
	if( checkMembersIDByConfig({
            ID    : [ "ETHEREAL_DRAGON_P", "DRAGON_SERVANT_P" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping(
			'DRAGON_LASHING_TAIL', [ 
				{ "ETHEREAL_DRAGON_P" : "DEFENSIVE_STANCE_P" },
				{ "DRAGON_SERVANT_P" : "DRAGON_SHIELD" },
			] );
	}
}

//==============================================================
//==============================================================
// Combine Skill Database
//==============================================================
//==============================================================

var COMBINE_SKILLS_DATA = {
	ENCHANTED_INJUNCTION_W : {
		id       : 'ENCHANTED_INJUNCTION_W',
		label    : '敕令強化 ‧ 水靈',
		info     : '水符石，火符石與心符石轉化為水強化符石；同時木符石轉化為心強化符石',
		config   : [ 'w', 'f', 'p' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionW_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	ENCHANTED_INJUNCTION_F : {
		id       : 'ENCHANTED_INJUNCTION_F',
		label    : '敕令強化 ‧ 火靈',
		info     : '火符石，木符石與心符石轉化為火強化符石；同時水符石轉化為心強化符石',
		config   : [ 'f', 'p', 'w' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionF_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	ENCHANTED_INJUNCTION_P : {
		id       : 'ENCHANTED_INJUNCTION_P',
		label    : '敕令強化 ‧ 木靈',
		info     : '木符石，水符石與心符石轉化為木強化符石；同時火符石轉化為心強化符石',
		config   : [ 'p', 'w', 'f' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionP_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	ENCHANTED_INJUNCTION_L : {
		id       : 'ENCHANTED_INJUNCTION_L',
		label    : '敕令強化 ‧ 光靈',
		info     : '光符石，暗符石與心符石轉化為光強化符石；同時火符石轉化為心強化符石',
		config   : [ 'l', 'd', 'f' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionL_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	ENCHANTED_INJUNCTION_D : {
		id       : 'ENCHANTED_INJUNCTION_D',
		label    : '敕令強化 ‧ 暗靈',
		info     : '暗符石，光符石與心符石轉化為暗強化符石；同時木符石轉化為心強化符石',
		config   : [ 'd', 'l', 'p' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionD_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	SOURCE_OF_LIFE : {
		id       : 'SOURCE_OF_LIFE',
		label    : '靈泉之源',
		info     : '2 回合內，心符石的掉落機率提升，所有屬性符石兼具心符石效果',
        addEffect: SourceOfLifeAddtionalEffectAdd,
		check    : SourceOfLifeCheck,
		mapping  : SourceOfLifeMapping,
		preSet   : BasicCombineSkillSetting,
	},
	PEARL_OF_DRAGON_DUOS_F : {
		id       : 'PEARL_OF_DRAGON_DUOS_F',
		label    : '雙龍探珠 ‧ 火',
		info     : '心符石、木符石及火符石轉化為火強化符石，並將自身所在隊伍欄直行的符石轉化為火符石',
		config   : [],
		check    : PearlOfDragonDuosCheck,
		mapping  : PearlOfDragonDuosF_Mapping,
		preSet   : BasicCombineSkillSetting,
		transfer : PearlOfDragonDuosTransfer,
	},
	PEARL_OF_DRAGON_DUOS_L : {
		id       : 'PEARL_OF_DRAGON_DUOS_L',
		label    : '雙龍探珠 ‧ 光',
		info     : '心符石、暗符石及光符石轉化為光強化符石，並將自身所在隊伍欄直行的符石轉化為光符石',
		config   : [],
		check    : PearlOfDragonDuosCheck,
		mapping  : PearlOfDragonDuosL_Mapping,
		preSet   : BasicCombineSkillSetting,
		transfer : PearlOfDragonDuosTransfer,
	},
	DRAGON_LASHING_TAIL : {
		id       : 'DRAGON_LASHING_TAIL',
		label    : '青龍擺尾',
		info     : '心符石及水符石轉化為木符石；並回復木屬性及龍類成員 50% 生命力',
		config   : [],
		check    : DragonLashingTailCheck,
		mapping  : DragonLashingTailMapping,
		preSet   : BasicCombineSkillSetting,
		transfer : DragonLashingTailTransfer,
	},
};

function NewCombineSkill( id ){
    var activeObj = $.extend(true, {}, COMBINE_SKILLS_DATA[id]);
    activeObj['variable'] = {};
    return activeObj;
}

function combineSkillMapping( combineID, needArr ){
	var combine = {};
	$.each(needArr, function(n, needMembers){
		combine[n] = [];
	});

	$.each(TEAM_MEMBERS, function(trigger_place, member){
		$.each(needArr, function(n, needMembers){
			if( member['id'] in needMembers ){
				$.each(TEAM_ACTIVE_SKILL[trigger_place], function(trigger_i, trigger_active){
					if( trigger_active['id'] == needMembers[ member['id'] ] ){
						combine[n].push( { 
							ID: trigger_active['id'], 
							PLACE: trigger_place,
							i: trigger_i 
						} );
						return false;
					}
				});
			}
		});
	});

	for(var needType in combine){
		for(var location of combine[needType]){
			var id    = location['ID'];
			var place = location['PLACE'];
			var i     = location['i'];
			var check = true;
			var need  = $.extend(true, {}, combine);
			$.each(needArr, function(n, needMembers){
				if( needType == n ){
					need[n] = [ { id: id, PLACE: place, i: i } ];
				}else if( combine[n].length == 0 ){
					check = false;
					return false;
				}
			});
			if( check ){
				var combineSkill = NewCombineSkill( combineID );
				var member = TEAM_MEMBERS[place];
				var combine_i = TEAM_COMBINE_SKILL[place].length;
				combineSkill['variable'] = combineSkill['preSet']( member, place, combine_i, need, combineSkill );
				TEAM_COMBINE_SKILL[place].push( combineSkill );
			}
		}
	}
}

function triggerCombine(place, i){
    if( TEAM_COMBINE_SKILL.length <= place || TEAM_COMBINE_SKILL[place].length <= i ){
        return false;
    }

    if( TEAM_COMBINE_SKILL[place][i]['check']( place, i ) ){
console.log("check-true");
        triggerCombineByKey( place, i, "startRun" );
        triggerCombineByKey( place, i, "start" );
        triggerCombineByKey( place, i, "transfer" );
        triggerCombineByKey( place, i, "addEffect" );
        triggerCombineByKey( place, i, "launch" );
        resetCombineSkillCoolDown( place, i );
    }

    updateActiveCoolDownLabel();
}
function triggerCombineByKey( place, i, key ){
    if( key in TEAM_COMBINE_SKILL[place][i] ){
console.log("trigger-"+key);
        TEAM_COMBINE_SKILL[place][i][ key ]( place, i );
    }
}
function checkCombineSkillByKey( key ){
    $.each(TEAM_COMBINE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            if( key in active ){
                active[ key ]( place, i );
            }
        });
    });    
}

function resetCombineSkillCoolDown( place, i ){
	var VAR = TEAM_COMBINE_SKILL[place][i]['variable'];
    var useable = checkCombineUseable( VAR['COMBINE'] );
    for(var key in useable['locations']){
    	var n = useable['locations'][key];
    	var location = VAR['COMBINE'][key][n];
    	var action = TEAM_ACTIVE_SKILL[ location.PLACE ][ location.i ];
    	action['variable']['COOLDOWN'] = action['coolDown'];
    }	
}
function checkCombineUseable( COMBINE ){
    var combineCheck = true;
    var locations = {};
    for( var key in COMBINE ){
        var check = false;
        $.each(COMBINE[key], function(i, location){
            var active = TEAM_ACTIVE_SKILL[location.PLACE][location.i];
            if( active['variable']['COOLDOWN'] == 0 ){
                check = true;
                locations[key] = i;
                return false;
            }
        });
        if( !check ){
            combineCheck = false;
            break;
        }
    }

    return {
        check    : combineCheck,
        locations: locations,
    };
}
