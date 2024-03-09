//==============================================================
//==============================================================
// ADDITIONAL EFFECT
//==============================================================
//==============================================================

var BasicEffectSetting = function( VAR ){
	return basicEffectSetting( VAR, this.id, 1 );
};
function basicEffectSetting( VAR, ID, duration ){
	return {
		ID       : ID,
		PLACE    : VAR['PLACE'],
		i        : VAR['i'],
		SOURCE   : VAR['SOURCE'],
		COLOR    : VAR['COLOR'],
		TYPE     : VAR['TYPE'],
		DURATION : duration,
	}
};
var Duration2EffectSetting = function( VAR ){
	return basicEffectSetting( VAR, this.id, 2 );
};
var Duration3EffectSetting = function( VAR ){
	return basicEffectSetting( VAR, this.id, 3 );
};

var DesperateAttack = function(){
    COUNT_FACTOR['DesperateAttack'] = {
        factor    : function( member, member_place ){ 
        	factor = 1 + 2* ( 1- (HEALTH_POINT/TOTAL_HEALTH_POINT) );
        	return factor; 
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
};
var DesperatePrepareAttack = function(){
    COUNT_FACTOR['DesperatePrepareAttack'] = {
        factor    : function( member, member_place ){ return 2; },
        prob      : 1,
        condition : function( member, member_place ){ return member['type'] == 'GOD'; },
    };
}
var DesperatePrepareEnd = function(){	
    var recover = makeNewRecover();
    recover['base']  = TOTAL_HEALTH_POINT;
    recover['factor']= 1;
    recover['style'] = "additionalEffect";
    recover['log']   = "DesperatePrepare";
    makeDirectRecovery( recover );
}
var DesperatePrepareSetting = function( VAR ){
    var injure = makeNewInjure();
    var damage = HEALTH_POINT-1;
    injure['label']  = "CourageOfSacrificeEffectAdd";
    injure['damage'] = damage;
    makeDirectInjure( injure );

    var attack = makeNewAttack();
    attack['base']   = damage;
    attack['color']  =  VAR['COLOR'];
    attack['factor'] = 50;
    attack['goal']   = 'all';
    attack['style']  = 'directDamage';
    attack['log']    = 'DesperatePrepare';
    makeDirectAttack(attack);

	return basicEffectSetting( VAR, this.id, 1 );
}
//==============================================================
var HarvestOfLifeDamage = function( attack ){
    var damage = attack['damage'];
    var recover = makeNewRecover();
    recover['base']  = damage;
    recover['factor']= 0.2;
    recover['style'] = "additionalEffect";
    recover['log']   = "HarvestOfLife";
    RECOVER_STACK.push( recover );
}
var HarvestOfLifeEXDamage = function( attack ){
    var damage = attack['damage'];
    var recover = makeNewRecover();
    recover['base']  = damage;
    recover['factor']= 0.5;
    recover['style'] = "additionalEffect";
    recover['log']   = "HarvestOfLifeEX";
    RECOVER_STACK.push( recover );
}
var PlunderOfLifeDamage = function( attack ){
    var damage = attack['damage'];
    var recover = makeNewRecover();
    recover['base']  = damage;
    recover['factor']= 0.2;
    recover['style'] = "additionalEffect";
    recover['log']   = "PlunderOfLife";
    RECOVER_STACK.push( recover );
}
//==============================================================
var SourceOfLifeAttack = function(){
	setColorBelongsByConfig( { 'w': {'h':1}, 'f': {'h':1}, 'p': {'h':1}, 'l': {'h':1}, 'd': {'h':1} } );
}
var SourceOfLifeEndEffect = function(){	
    for(var i = 0; i < TD_NUM; i++){
    	if( this.variable['PROBS'][i] > 0 ){
        	COLOR_PROB[i][ 'h' ] = this.variable['PROBS'][i];
    	}else{
    		delete COLOR_PROB[i][ 'h' ];
    	}
    }
}
var SourceOfLifeSetting = function( VAR ){
	var probs = [];
    for(var td = 0; td < TD_NUM; td++){
    	if( 'h' in COLOR_PROB[td] ){
    		probs.push( COLOR_PROB[td][ 'h' ] );
    	}else{
    		probs.push( 0 );
    	}
        COLOR_PROB[td][ 'h' ] = 0.3;
    }
    var variable = basicEffectSetting( VAR, this.id, 2 );
    variable['PROBS'] = probs;
	return variable;
};
//==============================================================
var PossSpiritAttack = function(){
	var color = this.variable['COLOR'];
	var color_ex = COLOR_EXCLUSIVE[ color ];
	COUNT_BELONG_COLOR[ color_ex ][ color ] = 1;
}
//==============================================================
var DragonShieldInjureReduce = function(){
	var count = countMembrsTypeByArr( ['DRAGON'] );
	COUNT_INJURE_REDUCE *= ( 1 - count*0.1 );
}
var DragonResonance = function(){
	var max_attack_base = 0;
	var max_attack_factor = 0;
	var attack_list = [];
	$.each(ATTACK_STACK, function(i, attack){
		if( attack['type'] == 'DRAGON' ){
			attack_list.push(i);
			if( attack['base']*attack['factor'] > max_attack_base*max_attack_factor ){
				max_attack_base = attack['base'];
				max_attack_factor = attack['factor'];
			}
		}
	});

	for(var i of attack_list){
		ATTACK_STACK[i]['base'] = max_attack_base;
		ATTACK_STACK[i]['factor'] = max_attack_factor;
	}
}  
var CourageOfSacrificeSetting = function( VAR ){
    var injure = makeNewInjure();
    injure['label']  = "CourageOfSacrificeEffectAdd";
    injure['damage'] = Math.round( HEALTH_POINT*0.75 );
    makeDirectInjure( injure );
	return basicEffectSetting( VAR, this.id, 1 );
};
var CourageOfSacrificeAttack = function(){
	COUNT_FACTOR['CourageOfSacrificeAttack'] = {
	    factor    : function( member, member_place ){ return 2; },
	    prob      : 1,
	    condition : function( member, member_place ){ 
	    	return member['type'] == 'DRAGON' || member['color'] == 'p';
	    },
	};
}
//==============================================================
var FightSafeAttack = function(){
	if( countComboAtFirstWave() >= 4 ){
	    COUNT_FACTOR['FightSafeAttack'] = {
	        factor    : function( member, member_place ){ return 2; },
	        prob      : 1,
	        condition : function( member, member_place ){ return true; },
	    };
	}else{
        var recover = makeNewRecover();
        recover['base']  = 20000;
        recover['color'] = member["color"];
        recover['factor']= 1;
        recover['place'] = this.variable['PLACE'];
        recover['style'] = "additionalEffect";
        recover['type']  = member['type'];
        recover['log']   = "FightSafeRecover";

        RECOVER_STACK.push(recover);
	}
}
var PlaySafeAttack = function(){
	if( countComboAtFirstWave() >= 4 ){
	    COUNT_FACTOR['PlaySafeAttack'] = {
	        factor    : function( member, member_place ){ return 2; },
	        prob      : 1,
	        condition : function( member, member_place ){ return true; },
	    };
	}else{
		COUNT_INJURE_REDUCE *= 0.2;
	}
}
var PlayWildAttack = function(){
	if( countComboAtFirstWave() >= 4 ){
	    COUNT_FACTOR['PlayWildAttack'] = {
	        factor    : function( member, member_place ){ return 2; },
	        prob      : 1,
	        condition : function( member, member_place ){ return true; },
	    };
	}else{
	    $.each(ENEMY, function(e, enemy){
	    	enemy['variable']['DEFENCE'] = 0;
	    });
	}
}
//==============================================================
var HuntingModeAttack = function(){
	var VAR = this.variable;
	COUNT_FACTOR['HuntingModeAttack'] = {
	    factor    : function( member, member_place ){
	    	if( member_place == VAR['PLACE'] || 
	    		(Math.abs(member_place-VAR['PLACE']) == 1 && member['type'] == "BEAST" ) ){ 
	    		return 3; 
	    	}
	    	return 1;
	    },
	    prob      : 1,
	    condition : function( member, member_place ){ return true; },
	};
}
var SavageAttack = function(){
	var VAR = this.variable;
	COUNT_FACTOR['SavageAttack'] = {
	    factor    : function( member, member_place ){
	    	if( member_place == VAR['PLACE'] ){ return 10; }
	    	return 1;
	    },
	    prob      : 1,
	    condition : function( member, member_place ){ return true; },
	};
}
//==============================================================
var BladesOfWaterFlameVineAttack = function(){
	var VAR = this.variable;
	if( checkComboColorMaxAmountByConfig({
            ID    : [ VAR['COLOR'] ],
            check : [ '{0}>=6' ],
        }) ){
		COUNT_FACTOR['BladesOf_'+VAR['COLOR']+'_Attack'] = {
		    factor    : function( member, member_place ){ return 1.5; },
		    prob      : 1,
		    condition : function( member, member_place ){ return member['color'] == VAR['COLOR']; },
		};
	}
}
var BladesOfLightPhantomAttack = function(){
	var VAR = this.variable;
	if( checkComboColorAmountByConfig({
            ID    : [ 'l', 'd', 'h' ] ,
            check : [ '{0}>0', '{1}>0', '{2}>0' ],
        }) ){
		COUNT_FACTOR['BladesOf_'+VAR['COLOR']+'_Attack'] = {
		    factor    : function( member, member_place ){ return 1.5; },
		    prob      : 1,
		    condition : function( member, member_place ){ return member['color'] == VAR['COLOR']; },
		};
	}
}
var BladesSetTime = function(){
	TIME_ADD_LIST['Blades'] = 3;
}
//==============================================================
var SpellOfBloodSpiritsEXAttack = function(){
	COUNT_FACTOR['SpellOfBloodSpiritsEXAttack'] = {
		factor    : function( member, member_place ){ return 1.5; },
		prob      : 1,
		condition : function( member, member_place ){ return true; },
	};
}
//==============================================================
var SongOfEmpathyEvilSetTime = function(){
	TIME_ADD_LIST['SongOfEmpathyEvil'] = 3;
};
//==============================================================
var ElementalAssemblyAttack = function(){
	var VAR = this.variable;
	COUNT_FACTOR['ElementalAssembly_'+VAR['COLOR']+'_Attack'] = {
		factor    : function( member, member_place ){
			var variety = 0;
			for(var c in COUNT_AMOUNT){
				if( COUNT_AMOUNT[c] > 0 ){ variety += 1; }
			}
			return 1 + 0.2*variety; 
		},
		prob      : 1,
		condition : function( member, member_place ){ return member['color'] == VAR['COLOR']; },
	};
}
//==============================================================
var MagicStageNewItem = function(){
	if( DROP_WAVES > 0 ){ return; }

    for(var i = 0; i < TD_NUM; i++){
        if( checkFirstStraightByPlace( 4, i ) ){
            for(var id = (TR_NUM-1)*TD_NUM+i; id >= 0; id -= TD_NUM ){
                if( REMOVE_STACK.indexOf(id) >= 0 ){
                    REMOVE_STACK.splice( REMOVE_STACK.indexOf(id), 1 );
                    DROP_STACK[i].push( newElementByItem( this.variable['COLOR'] ) );
                    break;
                }
            }
        }
    }
}
//==============================================================
var MasteryOfElementsAttack = function(){
    setColorBelongsByConfig( { 
    	'w' : { 'f': 0.8, 'p': 0.8, 'l': 0.8, 'd': 0.8 },  
    	'f' : { 'w': 0.8, 'p': 0.8, 'l': 0.8, 'd': 0.8 },
    	'p' : { 'w': 0.8, 'f': 0.8, 'l': 0.8, 'd': 0.8 },
    	'l' : { 'w': 0.8, 'f': 0.8, 'p': 0.8, 'd': 0.8 },
    	'd' : { 'w': 0.8, 'f': 0.8, 'p': 0.8, 'l': 0.8 } 
    } );
}
//==============================================================
var TreatyOfOldGreekAttack  = function(){
	var VAR = this.variable;
	if( COUNT_MAX_AMOUNT[ VAR['COLOR'] ] >= 5 ){
		COUNT_FACTOR['TreatyOfOldGreekAttack'+VAR['COLOR']] = {
			factor    : function( member, member_place ){ return 1.5; },
			prob      : 1,
			condition : function( member, member_place ){ return member['color'] == VAR['COLOR']; },
		};
	}
}
var QuintupleCoherenceAttack = function(){
    setColorBelongsByConfig( { 
    	'w' : { 'f': 0.3, 'p': 0.3, 'l': 0.3, 'd': 0.3 },  
    	'f' : { 'w': 0.3, 'p': 0.3, 'l': 0.3, 'd': 0.3 },
    	'p' : { 'w': 0.3, 'f': 0.3, 'l': 0.3, 'd': 0.3 },
    	'l' : { 'w': 0.3, 'f': 0.3, 'p': 0.3, 'd': 0.3 },
    	'd' : { 'w': 0.3, 'f': 0.3, 'p': 0.3, 'l': 0.3 } 
    } );
}

//==============================================================
//==============================================================
// ENEMY EFFECT
//==============================================================
//==============================================================
var BasicEnemyEffectSetting = function( VAR, enemy ){
	return basicEnemyEffectSetting( VAR, enemy, this.id, duration );
}
function basicEnemyEffectSetting( VAR, enemy, ID, duration ){
	return {
		ID       : ID,
		PLACE    : VAR['PLACE'],
		i        : VAR['i'],
		SOURCE   : VAR['SOURCE'],
		COLOR    : VAR['COLOR'],
		TYPE     : VAR['TYPE'],
		DURATION : duration,
		ENEMY    : enemy,
	};
};
var Duration2EnemyEffectSetting = function( VAR, enemy ){
	return basicEnemyEffectSetting( VAR, enemy, this.id, 2 );
}
var Duration3EnemyEffectSetting = function( VAR, enemy ){
	return basicEnemyEffectSetting( VAR, enemy, this.id, 3 );
}
var Duration5EnemyEffectSetting = function( VAR, enemy ){
	return basicEnemyEffectSetting( VAR, enemy, this.id, 5 );
}

var BubbleBurstDamageEnd = function(){
	var VAR = this.variable;
	var enemy = VAR['ENEMY'];
	$.each(enemy['variable']['HATRED'], function(a, attack){
        VAR['DAMAGE'] += attack['damage'];
    });

    if( VAR['DURATION'] == 1 ){  
        var damage = Math.round( VAR['DAMAGE']*0.7 );
	    var attack = makeNewAttack();
	    attack['base']   = damage;
	    attack['color']  = '_';
        attack['damage'] = damage;
	    attack['factor'] = 1;
	    attack['goal']   = 'enemy';
	    attack['target'] = [enemy];
		attack['style']  = 'directDamage';
	    attack['log']    = 'BubbleBurst';

    	mapAttackToEnemy( 0, attack );
    }
}
var BubbleBurstSetting = function( VAR, enemy ){
	var variable = basicEnemyEffectSetting( VAR, enemy, this.id, 3 );
	variable['DAMAGE'] = 0;
	return variable;
};
var BubbleBurstEXDamageEnd = function(){ 
	var VAR = this.variable;
	var enemy = VAR['ENEMY'];
	$.each(enemy['variable']['HATRED'], function(a, attack){
        VAR['DAMAGE'] += attack['damage'];
    });

    if( VAR['DURATION'] == 1 ){  
        var damage = Math.round( VAR['DAMAGE']*1.1 );
	    var attack = makeNewAttack();
	    attack['base']   = damage;
	    attack['color']  = '_';
	    attack['factor'] = 1;
	    attack['goal']   = 'enemy';
	    attack['target'] = [enemy];
		attack['style']  = 'directDamage';
	    attack['log']    = 'BubbleBurstEX';

    	mapAttackToEnemy( 0, attack );
    }
}
var BubbleBurstEXSetting = function( VAR, enemy ){
	var variable = basicEnemyEffectSetting( VAR, enemy, this.id, 2 );
	variable['DAMAGE'] = 0;
	return variable;
};
//==============================================================
var IgnitionAttack = function(){
	this.variable['ENEMY']['variable']['COLOR'] = 'f';

	var attack = makeNewAttack();
	attack['base']   = this.variable['ENEMY']['variable']['ATTACK'];
	attack['color']  = 'f';
	attack['factor'] = 30;
	attack['goal']   = 'enemy';
	attack['style']  = 'enemyEffect';
	attack['target'] = [ this.variable['ENEMY'] ]
	attack['log']    = 'Ignition';

	ATTACK_STACK.push( attack );
}
//==============================================================
var PrevationDamageEnd = function(){
	var thisEnemy = this.variable['ENEMY'];E
	var damage = 0;
	$.each(thisEnemy['variable']['HATRED'], function(a, attack){
        damage += attack['damage'];
    });
    damage = Math.round( damage*0.5 );

    $.each(ENEMY, function(i, enemy){
    	if( enemy != thisEnemy ){
		    var attack = makeNewAttack();
		    attack['base']   = damage;
		    attack['color']  = '_';
		    attack['factor'] = 1;
		    attack['goal']   = 'enemy';
	    	attack['target'] = [enemy];
		    attack['style']  = 'directDamage';
		    attack['log']    = 'Prevation';

    		mapAttackToEnemy( 0, attack );
    	}
    });
}
//==============================================================
var BattleFieldAttack = function(){
	COUNT_COLOR_FACTOR[ this.variable['COLOR'] ] *= 1.5;
	this.variable['ENEMY']['variable']['COLOR'] = COLOR_EXCLUSIVE[ this.variable['COLOR'] ];
};
//==============================================================
var BlazingCircleSetting = function( VAR, enemy ){
	enemy['variable']['COOLDOWN'] += 3;
	return  basicEnemyEffectSetting( VAR, enemy, this.id, 3 );
};
var BlazingCircleAttack = function(){
	this.variable['ENEMY']['variable']['COLOR'] = COLOR_EXCLUSIVE[ 'f' ];
};

//==============================================================
//==============================================================
// ADDITIONAL EFFECT DATA
//==============================================================
//==============================================================

// tags : attack增傷類 selfAttack自己增傷  defenceReduce破防類 
//        injureReduce減傷類
//        newItem產珠類 belongColor兼屬類
//        addTimeLimit延時類 setTimeLimit設時類 
//        changeColor轉屬性類 addCoolDown控場延長CD

var ADDITIONAL_EFFECT_DATA = {
	DESPERATE_ATTACK : {
		id        : 'DESPERATE_ATTACK',
		attack    : DesperateAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	HARVEST_OF_LIFE : {
		id        : 'HARVEST_OF_LIFE',
		damage    : HarvestOfLifeDamage,
		preSet    : Duration3EffectSetting,
		tag       : ['damageRecover'],
	},
	HARVEST_OF_LIFE_EX : {
		id        : 'HARVEST_OF_LIFE',
		damage    : HarvestOfLifeEXDamage,
		preSet    : Duration3EffectSetting,
		tag       : ['damageRecover'],
	},
	PLUNDER_OF_LIFE : {
		id        : 'PLUNDER_OF_LIFE',
		damage    : PlunderOfLifeDamage,
		preSet    : Duration2EffectSetting,
		tag       : ['damageRecover'],
	},
	SOURCE_OF_LIFE : {
		id        : 'SOURCE_OF_LIFE',
		attack    : SourceOfLifeAttack,
		endEffect : SourceOfLifeEndEffect,
		preSet    : SourceOfLifeSetting,
		tag       : ['belongColor'],
	},
	POSS_LIGHT_SPIRIT : {
		id        : 'POSS_LIGHT_SPIRIT',
		attack    : PossSpiritAttack,
		preSet    : BasicEffectSetting,
		tag       : ['belongColor'],
	},
	POSS_DARK_SPIRIT : {
		id        : 'POSS_DARK_SPIRIT',
		attack    : PossSpiritAttack,
		preSet    : BasicEffectSetting,
		tag       : ['belongColor'],
	},
	DRAGON_SHIELD : {
		id        : 'DRAGON_SHIELD',
		injure    : DragonShieldInjureReduce,
		preSet    : BasicEffectSetting,
		tag       : ['injureReduce'],
	},
	DRAGON_RESONANCE : {
		id        : 'DRAGON_RESONANCE',
		resonance : DragonResonance,
		preSet    : Duration2EffectSetting,
		tag       : ['attack'],
	},
	COURAGE_OF_SACRIFICE : {
		id        : 'COURAGE_OF_SACRIFICE',
		attack    : CourageOfSacrificeAttack,
		preSet    : CourageOfSacrificeSetting,
		tag       : ['attack'],
	},
	FIGHT_SAFE : {
		id        : 'FIGHT_SAFE',
		attack    : FightSafeAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	PLAY_SAFE : {
		id        : 'PLAY_SAFE',
		attack    : PlaySafeAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'injureReduce'],
	},
	PLAY_WILD : {
		id        : 'PLAY_WILD',
		attack    : PlayWildAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'defenceReduce'],
	},
	HUNTING_MODE : {
		id        : 'HUNTING_MODE',
		attack    : HuntingModeAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	SAVAGE_ATTACK : {
		id        : 'SAVAGE_ATTACK',
		attack    : SavageAttack,
		preSet    : BasicEffectSetting,
		tag       : ['selfAttack'],
	},
	BLADES_OF_WATER : {
		id        : 'BLADES_OF_WATER',
		attack    : BladesOfWaterFlameVineAttack,
		setTime   : BladesSetTime,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	BLADES_OF_FLAME : {
		id        : 'BLADES_OF_FLAME',
		attack    : BladesOfWaterFlameVineAttack,
		setTime   : BladesSetTime,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	BLADES_OF_VINE : {
		id        : 'BLADES_OF_VINE',
		attack    : BladesOfWaterFlameVineAttack,
		setTime   : BladesSetTime,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	BLADES_OF_LIGHT : {
		id        : 'BLADES_OF_LIGHT',
		attack    : BladesOfLightPhantomAttack,
		setTime   : BladesSetTime,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	BLADES_OF_PHANTOM : {
		id        : 'BLADES_OF_PHANTOM',
		attack    : BladesOfLightPhantomAttack,
		setTime   : BladesSetTime,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	SPELL_OF_BLOOD_SPIRITS_EX : {
		id        : 'SPELL_OF_BLOOD_SPIRITS_EX',
		attack    : SpellOfBloodSpiritsEXAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	SONG_OF_EMPATHY_EVIL : {
		id        : 'SONG_OF_EMPATHY_EVIL',
		setTime   : SongOfEmpathyEvilSetTime,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	ELEMENTAL_ASSEMBLY_W : {
		id        : 'ELEMENTAL_ASSEMBLY_W',
		attack    : ElementalAssemblyAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	ELEMENTAL_ASSEMBLY_F : {
		id        : 'ELEMENTAL_ASSEMBLY_F',
		attack    : ElementalAssemblyAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	ELEMENTAL_ASSEMBLY_P : {
		id        : 'ELEMENTAL_ASSEMBLY_P',
		attack    : ElementalAssemblyAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	MAGIC_STAGE_BEAM : {
		id        : 'MAGIC_STAGE_BEAM',
        newItem   : MagicStageNewItem,
		preSet    : BasicEffectSetting,
		tag       : ['newItem'],
	},
	MAGIC_STAGE_GLOOM : {
		id        : 'MAGIC_STAGE_GLOOM',
        newItem   : MagicStageNewItem,
		preSet    : BasicEffectSetting,
		tag       : ['newItem'],
	},
	MASTERY_OF_ELEMENTS : {
		id        : "MASTERY_OF_ELEMENTS",
        attack    : MasteryOfElementsAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'belongColor'],
	},
	TREATY_OF_OLD_GREEK_F : {
		id        : 'TREATY_OF_OLD_GREEK_F',
        attack    : TreatyOfOldGreekAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	TREATY_OF_OLD_GREEK_P : {
		id        : 'TREATY_OF_OLD_GREEK_P',
        attack    : TreatyOfOldGreekAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	QUINTUPLE_COHERENCE : {
		id        : 'QUINTUPLE_COHERENCE',
        attack    : QuintupleCoherenceAttack,
		preSet    : BasicEffectSetting,
		tag       : ['belongColor'],
	},

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	DESPERATE_PREPARE : {
		id        : 'DESPERATE_PREPARE',
		attack    : DesperatePrepareAttack,
		end       : DesperatePrepareEnd,
		preSet    : DesperatePrepareSetting,
		tag       : ['attack'],
	},
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
};

var ENEMY_EFFECT_DATA = {
	BIBBLE_BURST : {
		id        : 'BIBBLE_BURST',
		damgeEnd  : BubbleBurstDamageEnd,
		preSet    : BubbleBurstSetting,
		tag       : ['damage'],
	},
	BIBBLE_BURST_EX : {
		id        : 'BIBBLE_BURST_EX',
		damageEnd : BubbleBurstEXDamageEnd,
		preSet    : BubbleBurstEXSetting,
		tag       : ['damage']
	},
	IGNITION : {
		id        : 'IGNITION',
		attack    : IgnitionAttack,
		preSet    : Duration3EnemyEffectSetting,
		tag       : ['changeColor'],
	},
	PREVASION : {
		id        : 'PREVASION',
		damageEnd : PrevationDamageEnd,
		preSet    : Duration3EnemyEffectSetting,
		tag       : ['damage'],
	},
	PREVASION_EX : {
		id        : 'PREVASION_EX',
		damageEnd : PrevationDamageEnd,
		preSet    : Duration5EnemyEffectSetting,
		tag       : ['damage'],
	},
	BEWITCHMENT : {
		id        : 'BEWITCHMENT',
		preSet    : Duration3EnemyEffectSetting,
		tag       : ['bewitchment'],
	},
	BATTLEFIELD_P : {
		id        : 'BATTLEFIELD_P',
		attack    : BattleFieldAttack,
		preSet    : Duration2EnemyEffectSetting,
		tag       : ['changeColor'],
	},
	BLAZING_CIRCLE : {
		id        : 'BLAZING_CIRCLE',
		attack    : BlazingCircleAttack,
		preSet    : BlazingCircleSetting,
		tag       : ['changeColor', 'addCoolDown'],
	},
}

function NewAdditionalEffect( id ){
    var effectObj = $.extend(true, {}, ADDITIONAL_EFFECT_DATA[id]);
    effectObj['variable'] = {};
    return effectObj;
}
function NewEnemyEffect( id ){
    var effectObj = $.extend(true, {}, ENEMY_EFFECT_DATA[id]);
    effectObj['variable'] = {};
    return effectObj;
}

function additionalEffectAdd( effect ){
    ADDITIONAL_EFFECT_STACK.push( effect );
	while( ADDITIONAL_EFFECT_STACK.length > 4 ){
		ADDITIONAL_EFFECT_STACK.splice(0, 1);
	}

    updateAdditionalEffectLabel();
}

function checkAdditionEffectByKey( key ){
    $.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
        if( key in effect ){
            effect[ key ]();
        }
    });    
}
function checkAdditionEffectByKeyVar( key, Var ){
    $.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
        if( key in effect ){
            effect[ key ]( Var );
        }
    });    
}
function checkEnemyEffectByKey( key ){
    $.each(ENEMY, function(e, enemy){
        $.each(enemy['variable']['EFFECT'], function(i, effect){
	        if( key in effect ){
	            effect[ key ]();
	        }
    	});
    });
}
function checkEnemyEffectByKeyVar( key, Var ){
    $.each(ENEMY, function(e, enemy){
        $.each(enemy['variable']['EFFECT'], function(i, effect){
	        if( key in effect ){
	            effect[ key ]( Var );
	        }
    	});
    });
}

function additionalEffectUpdate(){
	var tmp_effect_stack = [];
	$.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
		effect['variable']["DURATION"] -= 1;
		if( effect['variable']["DURATION"] > 0 ){
			tmp_effect_stack.push(effect);
		}else if( 'endEffect' in effect ){
			effect['endEffect']();
		}
	});
	ADDITIONAL_EFFECT_STACK = tmp_effect_stack;
    updateAdditionalEffectLabel();
}
function enemyEffectUpdate(){
    $.each(ENEMY, function(e, enemy){
		var tmp_effect_stack = [];
        $.each(enemy['variable']['EFFECT'], function(i, effect){
			effect['variable']["DURATION"] -= 1;
			if( effect['variable']["DURATION"] > 0 ){
				tmp_effect_stack.push(effect);
			}else if( 'endEffect' in effect ){
				effect['endEffect']();
			}
    	});
    	enemy['variable']['EFFECT'] = tmp_effect_stack;
    });
}