//==============================================================
//==============================================================
// Skill Function
//==============================================================
//==============================================================

var BasicLeaderSetting = function( MEMBER ){
    return {
        COLOR    : MEMBER['color'],
        TYPE     : MEMBER['type'],
    }
}

//==============================================================
// ElementFactor
//==============================================================

var ElementFactor2Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor2'+direct] = {
        factor    : function( member, member_place ){ return 2; },
        prob      : 1,
        condition : function( member, member_place ){ return member['color'] == color; },
    };
}
var ElementFactor3Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor3'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){ return member['color'] == color; },
    };
}
var ElementFactor3_5Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor3_5'+direct] = {
        factor    : function( member, member_place ){ return 3.5; },
        prob      : 1,
        condition : function( member, member_place ){ return member['color'] == color; },
    };
}
var ElementFactor4Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor4'+direct] = {
        factor    : function( member, member_place ){ return 4; },
        prob      : 1,
        condition : function( member, member_place ){ return member['color'] == color; },
    };
}

var SpiritFactor2Attack = function( VAR, direct ){
    COUNT_FACTOR['SpiritFactor2'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){ return member['type'] == 'SPIRIT'; },
    };
}
var SpiritFactor2Recover  = function( VAR, direct ){
    COUNT_RECOVER_FACTOR['SpiritFactor2'+direct] = {
        factor    : function( member, member_place ){ return 2; },
        prob      : 1,
        condition : function( member, member_place ){ return member['type'] == 'SPIRIT'; },
    };  
}
var SpiritFactor2SetHP = function( MEMBER, health ){
    if( MEMBER['type'] == 'SPIRIT' ){
        health *= 2;
    }
    return health;
}

//==============================================================
// WillSurvive
//==============================================================
var WillSurviveInjure = function( VAR, direct ){
    if( ( HEALTH_POINT/TOTAL_HEALTH_POINT ) >= 0.5 ){
        UNDEAD_WILL = true;
    }else{
        UNDEAD_WILL = false;
    }
}
//==============================================================
// Counter Sin
//==============================================================
var CastigationOfSinCounter = function( VAR, direct, injure ){
    var enemy = injure['enemy'];
    var attack = makeNewAttack();
    attack['base']   = enemy['variable']['ATTACK'];
    attack['color']  = COLOR_ANTI_EXCLUSIVE[ enemy['variable']['COLOR'] ];
    attack['factor'] = 3;
    attack['goal']   = 'enemy';
    attack['target'] = [enemy];
    attack['style']  = 'leader';
    attack['log']    = 'CastigationOfSin';

    mapAttackToEnemy(0, attack);
}

//==============================================================
// Strong Will
//==============================================================
var StrongWillSetTime = function( VAR, direct ){
    TIME_MULTI_LIST['StrongWill'+direct] = 0.5;
}
var StrongWillAttack = function( VAR, direct ){
    COUNT_FACTOR['StrongWill'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}

//==============================================================
// Greek
//==============================================================
var GreekSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
        COUNT : 0,
    };
}
var GreekSkill = function( VAR, direct ){
    var color = VAR['COLOR'];
    var check_straight = 0;
    var check_horizontal = 0;
    for(var i = 0; i < TD_NUM; i++ ){ check_straight += STRAIGHT_SETS[i].length; }
    for(var i = 0; i < TR_NUM; i++ ){ check_horizontal += HORIZONTAL_SETS[i].length; }

    var num = 0;
    num += VAR['COUNT'];
    for(var set of GROUP_SETS[color]){
        num += set.size;
    }

    while( num >= 3 ){
        num -= 3;
        var rand_i;
        if( COMBO_TIMES == 1 && check_straight == 1 ||
            COMBO_TIMES == 1 && check_horizontal == 1 ){
            console.log(REMOVE_STACK);
            rand_i = Math.floor( randomBySeed() * ( REMOVE_STACK.length-1 ) );
        }else{
            rand_i = Math.floor( randomBySeed() *REMOVE_STACK.length );
        }
        var id = REMOVE_STACK[rand_i];
        REMOVE_STACK.splice(rand_i,1);
        STRONG_STACK[id] = color+'+';
    }

    VAR['COUNT'] = num;
}

//==============================================================
// Ethernal Dragon
//==============================================================
var DragonOffenseAttack = function( VAR, direct ){
    $.each(TEAM_MEMBERS, function(place, member){
        if( member['type'] == 'DRAGON' ){
            member['attack'] += member['recovery'];
            member['recovery'] = 0;
        }
    });

    COUNT_FACTOR['DragonOffense'+direct] = {
        factor    : function( member, member_place ){ return 2; },
        prob      : 1,
        condition : function( member, member_place ){ return member['type'] == "DRAGON"; },
    };
}
var DragonOffenseRecover = function( VAR, direct ){
    var dragons = countMembrsTypeByArr( ['DRAGON'] );
    var num = COUNT_AMOUNT['h'];
    var recover_hp = 0.02*dragons*num*( TOTAL_HEALTH_POINT - HEALTH_POINT );

    var check = true;
    for(var obj of RECOVER_STACK){
        if( obj['log'] == "DragonOffenseRecover" ){ 
            check = false;
            break;
        }
    }
    if( check ){
        var recover = {
            type   : "leaderSkill",
            place  : 10,
            color  : "h",
            base   : recover_hp,
            factor : 1,
            log    : "DragonOffenseRecover",
        };
        RECOVER_STACK.push(recover);
    }
}

var DragonRecoverAddSetting = function( MEMBER ){
    $.each(TEAM_MEMBERS, function(place, member){
        if( member['type'] == 'DRAGON' ){
            member['recovery'] += 200;
        }
    });
    return {};
}
var PulseOfDragonAttack = function( VAR, direct ){
    COUNT_FACTOR['PulseOfDragon'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){ return member['type'] == "DRAGON"; },
    };
}
var DragonDefenseAttack = function( VAR, direct ){
    addColorBelongsByConfig( { 'h': { 'd': 0.5 } } );

    COUNT_FACTOR['PulseOfDragon'+direct] = {
        factor    : function( member, member_place ){ return 2; },
        prob      : 1,
        condition : function( member, member_place ){ return member['type'] == "DRAGON"; },
    };
}

//==============================================================
// Dragon Servant
//==============================================================
var BloodThirstyDragonEXAttack = function( VAR, direct ){
    COUNT_FACTOR['BloodThirstyDragonEX'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){ return member['type'] == "DRAGON"; },
    };
}
var BloodThirstyDragonEXDamage = function( VAR, direct, attack ){
    if( attack['type'] != 'DRAGON' ){ return false; }
    var max_recover = TOTAL_HEALTH_POINT/2 ;
    var last_recover = 0;
    for(var obj of RECOVER_STACK){
        if( obj['log'] == "BloodThirstyDragonEX" ){ 
            last_recover += obj['base']*obj['factor'];
        }
    }

    var damage = attack['damage'];
    var recover_hp = Math.min( max_recover-last_recover, Math.round( damage*0.1 ) );

    var recover = makeNewRecover();
    recover['base']  = recover_hp;
    recover['factor']= 1;
    recover['style'] = "leader";
    recover['log']   = "BloodThirstyDragonEX";
    RECOVER_STACK.push( recover );
}
var FangsOfDragonAttack = function( VAR, direct ){
    if( checkComboColorMaxAmountByConfig({
            ID    : [ 'w', 'f', 'p', 'l', 'd' ],
            check : [ '{0}>=6||{1}>=6||{2}>=6||{3}>=6||{4}>=6' ],
        }) ){
        COUNT_FACTOR['FangsOfDragon'+direct] = {
            factor    : function( member, member_place ){ return 3; },
            prob      : 1,
            condition : function( member, member_place ){ return member['type'] == "DRAGON"; },
        };
    }else{
        COUNT_FACTOR['FangsOfDragon'+direct] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 1,
            condition : function( member, member_place ){ return member['type'] == "DRAGON"; },
        };
    }
}
var ClawsOfDragonAttack = function( VAR, direct ){
    if( checkComboColorMaxAmountByConfig({
            ID    : [ 'w', 'f', 'p', 'l', 'd', 'h' ],
            check : [ '{0}>=6||{1}>=6||{2}>=6||{3}>=6||{4}>=6||{5}>=6' ],
        }) ){
        COUNT_FACTOR['ClawsOfDragon'+direct] = {
            factor    : function( member, member_place ){ return 3; },
            prob      : 1,
            condition : function( member, member_place ){ return member['type'] == "DRAGON"; },
        };
    }
}

//==============================================================
// Dragon Nidhogg
//==============================================================
var OathOfBloodSetHP = function( MEMBER, health ){
    if( MEMBER['type'] == 'DRAGON' ){
        health *= 2;
    }
    return health;
}
var OathOfBloodAttack = function( VAR, direct ){
    COUNT_FACTOR['ClawsOfDragon'+direct] = {
        factor    : function( member, member_place ){ return 3.5; },
        prob      : 1,
        condition : function( member, member_place ){ return member['type'] == "DRAGON"; },
    };
}
var OathOfBloodEnd = function( VAR, direct ){
    var injure = makeNewInjure();
    injure['label']  = "OathOfBloodEnd";
    injure['damage'] = Math.round( TOTAL_HEALTH_POINT/10 );
    makeDirectInjure( injure );
}
//==============================================================
// Dragon Beast Plant
//==============================================================
var DragonBeastPlantSetHP = function( MEMBER, health ){
    if( MEMBER['type'] == 'DRAGON' || MEMBER['type'] == "BEAST" ){
        health *= 1.5;
    }
    return health;
}
var DragonBeastPlantAttack = function( VAR, direct ){
    COUNT_FACTOR['DragonBeastPlant'+direct] = {
        factor    : function( member, member_place ){ return 3.5; },
        prob      : 1,
        condition : function( member, member_place ){ 
            return member['type'] == "DRAGON" || member['type'] == "BEAST";
        },
    };
}
var DragonBeastPlantEnd = function( VAR, direct ){
    var injure = makeNewInjure();
    injure['label']  = "DragonBeastPlantEnd";
    injure['damage'] = Math.round( TOTAL_HEALTH_POINT/20 );
    makeDirectInjure( injure );
}
var DragonBeastPlantDamage = function( VAR, direct, attack ){
    if( attack['type'] != 'DRAGON' && attack['type'] != 'BEAST' ){ return false; }
    var max_recover = TOTAL_HEALTH_POINT/2 ;
    var last_recover = 0;
    for(var obj of RECOVER_STACK){
        if( obj['log'] == "DragonBeastPlant" ){ 
            last_recover += obj['base']*obj['factor'];
        }
    }

    var damage = attack['damage'];
    var recover_hp = Math.min( max_recover-last_recover, Math.round( damage*0.1 ) );

    var recover = makeNewRecover();
    recover['base']  = recover_hp;
    recover['factor']= 1;
    recover['style'] = "leader";
    recover['log']   = "DragonBeastPlant";
    RECOVER_STACK.push( recover );
}

//==============================================================
// Couple
//==============================================================
var CoupleSetting = function( MEMBER ){
    TEAM_COLORS_CHANGEABLE = false;
    SET_SIZE[ MEMBER['color'] ] = 2;
    SET_SIZE['h'] = 2;
    GROUP_SIZE[ MEMBER['color'] ] = 2;
    GROUP_SIZE['h'] = 2;
    return {
        COLOR : MEMBER['color'],
        COUNT : 0,
    };
}
var CoupleEndSkill = function( VAR, direct ){
    turnRandomElementToColorByConfig( {
        color          : VAR['COLOR'],
        num            : 2,
        priorityColors : [ ['l', 'd'], ['w', 'h'], ['f', 'p'] ],
    } );
}

//==============================================================
// Doll
//==============================================================
var DollHumanDragonAttack = function( VAR, direct ){
    if( checkMembersTypeByConfig( { 
            types : [ 'HUMAN', 'DRAGON', 'OTHER' ],
            check : [ '{0}>=1', '{1}>=2', '{2}==0' ],
        } ) ){
        COUNT_FACTOR['DollHumanDragon'+direct] = {
            factor    : function( member, member_place ){
                if( member['type'] == "DRAGON" ){ return 2; }
                else if( member['type'] == "HUMAN" ){ return 3.5; }
                else{ return 1; }
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}
var DollHumanBeastSpiritAttack = function( VAR, direct ){
    if( checkMembersTypeByConfig( { 
            types : [ 'HUMAN', 'BEAST', 'SPIRIT', 'OTHER' ],
            check : [ '{0}>=1', '({1}+{2})>=2', '{3}==0' ],
        } ) ){
        COUNT_FACTOR['DollHumanBeastSpirit'+direct] = {
            factor    : function( member, member_place ){
                if( member['type'] == "BEAST" || member['type'] == "SPIRIT" ){ return 2.5; }
                else if( member['type'] == "HUMAN" ){ return 3.5; }
                else{ return 1; }            
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}
var DollHumanDevilSpiritAttack = function( VAR, direct ){
    if( checkMembersTypeByConfig( { 
            types : [ 'HUMAN', 'DEVIL', 'SPIRIT', 'OTHER' ],
            check : [ '{0}>=1', '({1}+{2})>=2', '{3}==0' ],
        } ) ){
        COUNT_FACTOR['DollHumanDevilSpirit'+direct] = {
            factor    : function( member, member_place ){
                if( member['type'] == "DEVIL" || member['type'] == "SPIRIT" ){ return 2.5; }
                else if( member['type'] == "HUMAN" ){ return 3.5; }
                else{ return 1; }            
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}
var DollHumanGodAttack = function( VAR, direct ){
    if( checkMembersTypeByConfig( { 
            types : [ 'HUMAN', 'GOD', 'OTHER' ],
            check : [ '{0}>=1', '{1}>=2', '{2}==0' ],
        } ) ){
        COUNT_FACTOR['DollHumanGod'+direct] = {
            factor    : function( member, member_place ){
                if( member['type'] == "GOD" ){ return 2; }
                else if( member['type'] == "HUMAN" ){ return 3.5; }
                else{ return 1; }            
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}

//==============================================================
// Tribe Beast
//==============================================================
var TribeBeastAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var colorArr = ['w', 'f', 'p', 'l', 'd'];
    colorArr.splice( colorArr.indexOf(color), 1 );
    var belong_factor = 0;
    for( var member of TEAM_MEMBERS ){
        if( member['type'] == 'BEAST' ){
            belong_factor += 0.1;
        }
    }
    belong_factor = Math.min( belong_factor, 0.5 );
    for(var c of colorArr){
        COUNT_BELONG_COLOR[ color ][ c ] += belong_factor;
    }

    COUNT_FACTOR['TribeBeast'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['type'] == 'BEAST' ){  return true; }
            return false;
        },
    };
}

//==============================================================
// Sword
//==============================================================
var SwordBrotherAttack = function( VAR, direct ){
    COUNT_FACTOR['SwordBrother'+direct] = {
        factor    : function( member, member_place ){ return 2; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == 'l' ||  member['color'] == 'd' ){ return true; }
            return false;
        },
    };
    COUNT_FACTOR['SwordBrotherBoth'+direct] = {
        factor    : function( member, member_place ){ 
            if( COUNT_AMOUNT['l'] > 0 && COUNT_AMOUNT['d'] > 0 ){ return 1.5; }
            return 1;
        },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == 'l' ||  member['color'] == 'd' ){ return true; }
            return false;
        },
    };
}
var SwordBrotherEXAttack = function( VAR, direct ){
    addColorBelongsByConfig( { 'l': { 'd': 0.5 }, 'd': { 'l': 0.5 } } );
    COUNT_FACTOR['SwordBrotherEX'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == 'l' ||  member['color'] == 'd' ){ return true; }
            return false;
        },
    };
    COUNT_FACTOR['SwordBrotherBoth'+direct] = {
        factor    : function( member, member_place ){ 
            if( COUNT_AMOUNT['l'] > 0 && COUNT_AMOUNT['d'] > 0 ){ return 1.5; }
            return 1;
        },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == 'l' ||  member['color'] == 'd' ){ return true; }
            return false;
        },
    };
}

//==============================================================
// Babylon
//==============================================================
var BabylonSkill = function( VAR, direct ){
    if( DROP_WAVES > 0 ){ return; }

    for(var i = 0; i < TD_NUM; i++){
        if( checkFirstStraightByPlace( 4, i ) ){
            for(var id = (TR_NUM-1)*TD_NUM+i; id >= 0; id -= TD_NUM ){
                if( REMOVE_STACK.indexOf(id) >= 0 ){
                    REMOVE_STACK.splice( REMOVE_STACK.indexOf(id), 1 );
                    DROP_STACK[i].push( newElementByItem( VAR['COLOR'] ) );
                    break;
                }
            }
        }
    }
}
var BabylonAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['Babylon'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}
var BabylonAttackPlus = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['BabylonPlus'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}

//==============================================================
// Chinese Paladin
//==============================================================
var LIXIAOYAOAttack = function( VAR, direct ){
    if( 'HeartProb' in COUNT_FACTOR ){
        COUNT_FACTOR['HeartProb']['prob'] += 0.5;
    }else{
        COUNT_FACTOR['HeartProb'] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 0.5,
            condition : function( member, member_place ){
                if( COUNT_AMOUNT['h'] > 0 ){
                    return checkMembersColorByConfig( { 
                        colors : [ 'w', 'f', 'p', 'OTHER' ],
                        check  : [ '{0}>=1', '{1}>=1', '{2}>=1', '{3}==0' ]
                    } );
                }
                return false;
            },
        };
    }

    COUNT_FACTOR['LIXIAOYAOAttack'+direct] = {
        factor    : function( member, member_place ){            
            var num = 0;
            for( var key in COUNT_AMOUNT ){
                num += COUNT_AMOUNT[key];
            }
            var factor = 1.8;
            var rate = 0.15;
            while( num > 0 && rate > 0 ){
                if( num >= 5 ){
                    factor += 5*rate;
                    rate -= 0.02;
                    num -= 5;
                }else{
                    factor += num*rate;
                    rate -= 0.02;
                    num -= num;
                }
            }
            return factor;
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}
var CommonSourceAttack = function( VAR, direct ){
    if( checkMembersColorByConfig( { 
            colors : [ 'w', 'f', 'p', 'OTHER' ],
            check  : [ '{0}>=1', '{1}>=1', '{2}>=1', '{3}==0' ]
        } ) ){
        setColorBelongsByConfig( { 'w' : { 'f': 1, 'p': 1 },  'f': { 'w': 1, 'p': 1 },  'p': { 'w': 1, 'f': 1 } } );
    }
    
    if( 'HeartProb' in COUNT_FACTOR ){
        COUNT_FACTOR['HeartProb']['prob'] += 0.5;
    }else{
        COUNT_FACTOR['HeartProb'] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 0.5,
            condition : function( member, member_place ){
                if( COUNT_AMOUNT['h'] > 0 ){ 
                    return checkMembersColorByConfig( { 
                        colors : [ 'w', 'f', 'p', 'OTHER' ],
                        check  : [ '{0}>=1', '{1}>=1', '{2}>=1', '{3}==0' ]
                    } );
                }
                return false;
            },
        };
    }
}
var CommonSourceEXAttack = function( VAR, direct ){
    CommonSourceAttack( VAR, direct );
    COUNT_FACTOR['CommonSourceEX'+direct] = {
        factor    : function( member, member_place ){ return 1.5; },
        prob      : 1,
        condition : function( member, member_place ){ 
            return COUNT_AMOUNT['w'] > 0 && COUNT_AMOUNT['f'] > 0 && COUNT_AMOUNT['p'] > 0;
        },
    };
}

//==============================================================
// DarkLucifer
//==============================================================
var WaterFairyAttack = function( VAR, direct ){
    COUNT_FACTOR['WaterFairy'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == VAR['COLOR'] ){ return true; }
            return false;
        },
    };

    if( checkFirstHorizentalClearByPlace( TR_NUM-1 ) ){
        COUNT_FACTOR['WaterFairyBaseLine'+direct] = {
            factor    : function( member, member_place ){
                if( TEAM_MEMBERS[member_place]['id'] == 'WATER_FAIRY' && 
                    ( member_place == 0 || member_place == (TD_NUM-1) ) ){
                    return 3;
                }
                return 1;
            },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}
var DarkLuciferSetting = function( MEMBER ){
    return {
        COLOR : 'h',
    };
}
var DarkLuciferAttack = function( VAR, direct ){
    COUNT_FACTOR['DarkLucifer'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}

//==============================================================
// DevilIllusion
//==============================================================
var DevilIllusionSetting = function( MEMBER ){
    return {
        COLOR     : MEMBER['color'],
        MAX_COLOR : '',
    };
}
var DevilIllusionFindMaxColor = function( VAR, direct ){
    var max_color = findMaxColorOfColorArr( [ 'w', 'f', 'p', 'l', 'd' ] );

    VAR['MAX_COLOR'] = '';
    if( max_color['num'] > 0 ){
        if( max_color['colors'].indexOf( VAR['COLOR'] ) >= 0 ){
            VAR['MAX_COLOR'] = VAR['COLOR'];
        }else{
            VAR['MAX_COLOR'] = selectRandomItemFromArrBySeed( max_color['colors'], max_color['num'] );
        }
    }

    $("#BattleInfomation").append( 
        $("<span></span>").text( "判定最多粒符石屬性為 : "+COLOR_LETTERS[0][ VAR['MAX_COLOR'] ] ) 
    ).append("<br>");    
}
var DevilIllusionAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var max_color = VAR['MAX_COLOR'];
    COUNT_FACTOR['DevilIllusion'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    if( max_color == color ){
        COUNT_FACTOR['DevilIllusionBelong'+direct] = {
            factor    : function( member, member_place ){ return 1.4; },
            prob      : 1,
            condition : function( member, member_place ){
                if( member['color'] == color ){ return true; }
                return false;
            },
        };
    }else{
        if( max_color in COUNT_BELONG_COLOR ){
            COUNT_BELONG_COLOR[max_color][color] += 0.5;
        }
    }
}
var DevilIllusionPlusAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var max_color = VAR['MAX_COLOR'];
    COUNT_FACTOR['DevilIllusion'+direct] = {
        factor    : function( member, member_place ){ return 3.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    if( max_color == color ){
        COUNT_FACTOR['DevilIllusionBelong'+direct] = {
            factor    : function( member, member_place ){ return 1.4; },
            prob      : 1,
            condition : function( member, member_place ){
                if( member['color'] == color ){ return true; }
                return false;
            },
        };
    }else{
        if( max_color in COUNT_BELONG_COLOR ){
            COUNT_BELONG_COLOR[max_color][color] += 0.5;
        }
    }
}

//==============================================================
// DevilCircle
//==============================================================
var DevilCircleSetTime = function( VAR, direct ){
    TIME_ADD_LIST['DevilCircle'+direct] = 1 ;
}
var DevilCircleAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['DevilCircle'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    COUNT_FACTOR['DevilCircle5Set'+direct] = {
        factor    : function( member, member_place ){ return 1.5; },
        prob      : 1,
        condition : function( member, member_place ){
            for(var obj of COMBO_STACK){
                if( obj['color'] == color && obj['amount'] >= 5 ){
                    return true;
                }
            }
            return false;
        },
    };
}

//==============================================================
// ChinaGod
//==============================================================
var ChinaDAttack = function( VAR, direct ){
    COUNT_COMBO_COEFF += 1.25;
}

//==============================================================
// HeartQueen
//==============================================================
var HeartQueenSetting = function( MEMBER ){
    return {
        COLOR : 'h',
        COUNT : 0,
    };
}

//==============================================================
// BOSS_YOG_SOTHOTH
//==============================================================
var elementalAggressionAttack = function( VAR, direct ){
    colorVariety = 0;
    for( var c of [ 'w', 'f', 'p', 'l', 'd' ] ){
        if( COUNT_AMOUNT[c] > 0 ){ colorVariety += 1; }
    }
    attackFactor = 3 + ( ( colorVariety-3 ) / 2 );
    if( colorVariety >= 3 ){
        COUNT_FACTOR['ElementalAggression'+direct] = {
            factor    : function( member, member_place ){ return attackFactor; },
            prob      : 1,
            condition : function( member, member_place ){ return true; }
        };
    }
}
var elementalAggressionSetting = function( MEMBER ){    
    TEAM_COLORS_CHANGEABLE = false;
    return {
        COLOR : MEMBER['color'],
        COUNT : 0,
    };
}

//==============================================================
// Old Greek
//==============================================================
var OldGreekSetting = function( MEMBER ){
    TEAM_COLORS_CHANGEABLE = false;
    for( var c of [ 'w', 'f', 'p', 'l', 'd', 'h' ] ){
        SET_SIZE[c] = 2;
        GROUP_SIZE[c] = 3;
    }
    return {
        COLOR : MEMBER['color'],
        COUNT : 0,
    };
}
var OldGreekLAttack = function( VAR, direct ){
    if( checkMembersTypeVarietyByConfig( {
            types : [ "GOD", "HUMAN", "SPIRIT", "BEAST", "DRAGON", "DEVIL" ],
            check : 5,
        } ) ){
        COUNT_FACTOR['OldGreekL5Type'+direct] = {
            factor    : function( member, member_place ){ return 2; },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
    if( checkMembersColorVarietyByConfig( {
            colors : [ "w", "f", "p", "l", "d" ],
            check  : 5,
        } ) ){
        COUNT_FACTOR['OldGreekL5Color'+direct] = {
            factor    : function( member, member_place ){ return 2; },
            prob      : 1,
            condition : function( member, member_place ){ return true; },
        };
    }
}


//==============================================================
//==============================================================
// Skill Database
//==============================================================
//==============================================================

var LEADER_SKILLS_DATA = {
    NONE : {
        id        : "NONE",
        label     : "靈魂收割 ‧ 結",
        info      : "當敵方生命力 40% 以下，無視防禦力和屬性，每回合以自身攻擊力 6 倍追打 1 次",
        preSet    : BasicLeaderSetting,
    },
    WILL_SURVIVE : {
        id        : "WILL_SURVIVE",
        label     : "絕境意志",
        info      : "當前生命力大於 50% 時，下一次所受傷害不會使你死亡 (同一回合只會發動一次）",
        preSet    : BasicLeaderSetting,
        will      : WillSurviveInjure,
    },
    ELEMENT_FACTOR2_W : {
        id        : "ELEMENT_FACTOR2_W",
        label     : "水之怒",
        info      : "水屬性攻擊力 2 倍",
        attack    : ElementFactor2Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR2_F : {
        id        : "ELEMENT_FACTOR2_F",
        label     : "火之怒",
        info      : "火屬性攻擊力 2 倍",
        attack    : ElementFactor2Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR2_P : {
        id        : "ELEMENT_FACTOR2_P",
        label     : "木之怒",
        info      : "木屬性攻擊力 2 倍",
        attack    : ElementFactor2Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR2_L : {
        id        : "ELEMENT_FACTOR2_L",
        label     : "光之怒",
        info      : "光屬性攻擊力 2 倍",
        attack    : ElementFactor2Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR2_D : {
        id        : "ELEMENT_FACTOR2_D",
        label     : "暗之怒",
        info      : "暗屬性攻擊力 2 倍",
        attack    : ElementFactor2Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_W : {
        id        : "ELEMENT_FACTOR3_W",
        label     : "水之震怒",
        info      : "水屬性攻擊力 3 倍",
        attack    : ElementFactor3Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_F : {
        id        : "ELEMENT_FACTOR3_F",
        label     : "火之震怒",
        info      : "火屬性攻擊力 3 倍",
        attack    : ElementFactor3Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_P : {
        id        : "ELEMENT_FACTOR3_P",
        label     : "木之震怒",
        info      : "木屬性攻擊力 3 倍",
        attack    : ElementFactor3Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_L : {
        id        : "ELEMENT_FACTOR3_L",
        label     : "光之震怒",
        info      : "光屬性攻擊力 3 倍",
        attack    : ElementFactor3Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_D : {
        id        : "ELEMENT_FACTOR3_D",
        label     : "暗之震怒",
        info      : "暗屬性攻擊力 3 倍",
        attack    : ElementFactor3Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_5_W : {
        id        : "ELEMENT_FACTOR3_5_W",
        label     : "浪濤怒嘯",
        info      : "水屬性攻擊力 3.5 倍",
        attack    : ElementFactor3_5Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_5_F : {
        id        : "ELEMENT_FACTOR3_5_F",
        label     : "熾燄怒嘯",
        info      : "火屬性攻擊力 3.5 倍",
        attack    : ElementFactor3_5Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_5_P : {
        id        : "ELEMENT_FACTOR3_5_P",
        label     : "藤木怒嘯",
        info      : "木屬性攻擊力 3.5 倍",
        attack    : ElementFactor3_5Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_5_L : {
        id        : "ELEMENT_FACTOR3_5_L",
        label     : "玄光怒嘯",
        info      : "光屬性攻擊力 3.5 倍",
        attack    : ElementFactor3_5Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR3_5_D : {
        id        : "ELEMENT_FACTOR3_5_D",
        label     : "幽冥怒嘯",
        info      : "暗屬性攻擊力 3.5 倍",
        attack    : ElementFactor3_5Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR4_W : {
        id        : "ELEMENT_FACTOR4_W",
        label     : "浪濤萬鈞之怒",
        info      : "水屬性攻擊力 4 倍",
        attack    : ElementFactor4Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR4_F : {
        id        : "ELEMENT_FACTOR4_F",
        label     : "熾燄萬鈞之怒",
        info      : "火屬性攻擊力 4 倍",
        attack    : ElementFactor4Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR4_P : {
        id        : "ELEMENT_FACTOR4_P",
        label     : "藤木萬鈞之怒",
        info      : "木屬性攻擊力 4 倍",
        attack    : ElementFactor4Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR4_L : {
        id        : "ELEMENT_FACTOR4_L",
        label     : "玄光萬鈞之怒",
        info      : "光屬性攻擊力 4 倍",
        attack    : ElementFactor4Attack,
        preSet    : BasicLeaderSetting,
    },
    ELEMENT_FACTOR4_D : {
        id        : "ELEMENT_FACTOR4_D",
        label     : "幽冥萬鈞之怒",
        info      : "暗屬性攻擊力 4 倍",
        attack    : ElementFactor4Attack,
        preSet    : BasicLeaderSetting,
    },
    SPIRIT_FACTOR_2 : {
        id        : "SPIRIT_FACTOR_2",
        label     : "妖精之怒",
        info      : "妖精類攻擊力 2 倍",
        attack    : SpiritFactor2Attack,
        preSet    : BasicLeaderSetting,
    },
    SPIRIT_RECOVER_FACTOR_2 : {
        id        : "SPIRIT_RECOVER_FACTOR_2",
        label     : "妖精領域",
        info      : "妖精類回復力 2 倍",
        recover   : SpiritFactor2Recover,
        preSet    : BasicLeaderSetting,
    },
    SPIRIT_HEALTH_FACTOR_2 : {
        id        : "SPIRIT_HEALTH_FACTOR_2",
        label     : "妖精之血",
        info      : "妖精類生命力 2 倍",
        setHP     : SpiritFactor2SetHP,
        preSet    : BasicLeaderSetting,
    },
    CASTIGATION_OF_SIN : {
        id        : "CASTIGATION_OF_SIN",
        label     : "罪之罰則",
        info      : "以所受傷害 3 倍對敵方攻擊者進行相剋屬性反擊",
        counterSin: CastigationOfSinCounter,
        preSet    : BasicLeaderSetting,
    },
    STRONG_WILL_LIGHT : {
        id        : "STRONG_WILL_LIGHT",
        label     : "念之強勢 ‧ 光",
        info      : "減少 50% 移動符石時間，全隊攻擊力 3 倍",
        attack    : StrongWillAttack,
        setTime   : StrongWillSetTime,
        preSet    : BasicLeaderSetting,
    },
    STRONG_WILL_DARK : {
        id        : "STRONG_WILL_DARK",
        label     : "念之強勢 ‧ 暗",
        info      : "減少 50% 移動符石時間，全隊攻擊力 3 倍",
        attack    : StrongWillAttack,
        setTime   : StrongWillSetTime,
        preSet    : BasicLeaderSetting,
    },
    CHINA_D : {
        id        : "CHINA_D",
        label     : "傾世絕色",
        info      : "連擊 (Combo) 時攻擊力大幅提升 125%",
        attack    : ChinaDAttack,
        preSet    : BasicLeaderSetting,
    },
    GREEK_W : {
        id        : "GREEK_W",
        label     : "水之連動",
        info      : "每累計消除 3 粒水符石 ，將產生 1 粒水強化符石",
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    GREEK_F : {
        id        : "GREEK_F",
        label     : "火之連動",
        info      : "每累計消除 3 粒火符石 ，將產生 1 粒火強化符石",
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    GREEK_P : {
        id        : "GREEK_P",
        label     : "木之連動",
        info      : "每累計消除 3 粒木符石 ，將產生 1 粒木強化符石",
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    GREEK_L : {
        id        : "GREEK_L",
        label     : "光之連動",
        info      : "每累計消除 3 粒光符石 ，將產生 1 粒光強化符石",
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    GREEK_D : {
        id        : "GREEK_D",
        label     : "暗之連動",
        info      : "每累計消除 3 粒暗符石 ，將產生 1 粒暗強化符石",
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    HEART_QUEEN : {
        id        : "HEART_QUEEN",
        label     : "心之連動",
        info      : "每累計消除 3 粒心符石 ，將產生 1 粒心強化符石",
        newItem   : GreekSkill,
        preSet    : HeartQueenSetting,
    },
    DRAGON_OFFENSE : {
        id        : "DRAGON_OFFENSE",
        label     : "龍攻代守",
        info      : "龍類攻擊力 2 倍，我方龍類的回復力加入自身攻擊力；消除心符石可回復固定百分比的已損失生命力 ( 每粒心符石回復百分比相等於隊伍龍類數量的兩倍 )",
        attack    : DragonOffenseAttack,
        recover   : DragonOffenseRecover,
        preSet    : BasicLeaderSetting,
    },
    PULSE_OF_DRAGON : {
        id        : "PULSE_OF_DRAGON",
        label     : "真龍之脈",
        info      : "龍類攻擊力 2.5 倍及增加 200 點回復力",
        attack    : PulseOfDragonAttack,
        preSet    : DragonRecoverAddSetting,
    },
    DRAGON_DEFENSE : {
        id        : "DRAGON_DEFENSE",
        label     : "龍之持守",
        info      : "龍類攻擊力 2 倍及增加 200 點回復力，消除心符石時，等同消除暗符石，達 50% 暗符石效果",
        attack    : DragonDefenseAttack,
        preSet    : DragonRecoverAddSetting,
    },
    BLOOD_THIRSTY_DRAGON_EX : {
        id        : "BLOOD_THIRSTY_DRAGON_EX",
        label     : "噬血龍王 ‧ 強",
        info      : "龍類攻擊力 2.5 倍，將龍類對敵方造成傷害的 10% 轉化為生命力 (不計算主動及隊長技傷害)，最大為生命力等值的 50% (不能疊加)",
        attack    : BloodThirstyDragonEXAttack,
        damage    : BloodThirstyDragonEXDamage,
        preSet    : BasicLeaderSetting,
    },
    FANGS_OF_DRAGON : {
        id        : "FANGS_OF_DRAGON",
        label     : "幻龍利牙",
        info      : "龍類攻擊力 1.5 倍；消除一組 6 粒或以上的相同屬性符石，龍類攻擊力 3 倍",
        attack    : FangsOfDragonAttack,
        preSet    : BasicLeaderSetting,
    },
    CLAWS_OF_DRAGON : {
        id        : "CLAWS_OF_DRAGON",
        label     : "幻龍利爪",
        info      : "消除一組 6 粒或以上的相同符石，龍類攻擊力 3 倍",
        attack    : ClawsOfDragonAttack,
        preSet    : BasicLeaderSetting,
    },
    OATH_OF_BLOOD : {
        id        : "OATH_OF_BLOOD",
        label     : "歃血之盟誓",
        info      : "龍類攻擊力 3.5 倍及生命力 2 倍，每回合扣自身總生命力 10%",
        attack    : OathOfBloodAttack,
        end       : OathOfBloodEnd,
        preSet    : BasicLeaderSetting,
        setHP     : OathOfBloodSetHP,
    },
    DRAGON_BEAST_PLANT : {
        id        : "DRAGON_BEAST_PLANT",
        label     : "噬血移魂",
        info      : "木屬性的龍類及獸類攻擊力 3.5 倍，及生命力 1.5 倍；並於每回合扣除自身總生命力 5%。此外，將龍類及獸類對敵方造成傷害的 10% 轉化為生命力 (不計算主動技傷害)，最大為生命力等值的 50% (不能疊加)；若轉化的生命力超出總生命力的上限時，每超出 12% 的生命力，回合結束時隨機將 1 粒符石轉化為木符石，最多可轉化 4 粒 (效果不能疊加)",
        attack    : DragonBeastPlantAttack,
        damage    : DragonBeastPlantDamage,
        end       : DragonBeastPlantEnd,
        preSet    : BasicLeaderSetting,
        setHP     : DragonBeastPlantSetHP,
    },
    COUPLE_F : {
        id        : "COUPLE_F",
        label     : "火靈符籙",
        info      : "2 粒火符石或心符石相連，即可發動消除，所有符石掉落機率不受其他技能影響 (包括改變掉落符石屬性的技能)。回合結束時，將 2 粒符石轉化為火符石 (光及暗符石優先轉換)",
        end       : CoupleEndSkill,
        preSet    : CoupleSetting,
    },
    COUPLE_P : {
        id        : "COUPLE_P",
        label     : "木靈符籙",
        info      : "2 粒木符石或心符石相連，即可發動消除，所有符石掉落機率不受其他技能影響 (包括改變掉落符石屬性的技能)。回合結束時，將 2 粒符石轉化為木符石 (光及暗符石優先轉換)",
        end       : CoupleEndSkill,
        preSet    : CoupleSetting,
    },
    DOLL_HUMAN_DRAGON : {
        id        : "DOLL_HUMAN_DRAGON",
        label     : "龍魂輔主",
        info      : "當隊伍中只有人類及 2 個或以上龍類成員時，人類攻擊力 3.5 倍，龍類攻擊力 2 倍",
        attack    : DollHumanDragonAttack,
        preSet    : BasicLeaderSetting,
    },
    DOLL_HUMAN_BEAST_SPIRIT : {
        id        : "DOLL_HUMAN_BEAST_SPIRIT",
        label     : "幻獸輔主",
        info      : "當隊伍中只有人類、2 個或以上獸類或妖精類成員時，人類攻擊力 3.5 倍，獸類及妖精類攻擊力 2.5 倍",
        attack    : DollHumanBeastSpiritAttack,
        preSet    : BasicLeaderSetting,
    },
    DOLL_HUMAN_DEVIL_SPIRIT : {
        id        : "DOLL_HUMAN_DEVIL_SPIRIT",
        label     : "妖魔輔主",
        info      : "當隊伍中只有人類、2 個或以上魔族或妖精類成員時，人類攻擊力 3.5 倍，魔族及妖精類攻擊力 2.5 倍",
        attack    : DollHumanDevilSpiritAttack,
        preSet    : BasicLeaderSetting,
    },
    DOLL_HUMAN_GOD : {
        id        : "DOLL_HUMAN_GOD",
        label     : "神靈輔主",
        info      : "當隊伍中只有人類及 2 個或以上神族成員時，人類攻擊力 3.5 倍，神族攻擊力 2 倍",
        attack    : DollHumanGodAttack,
        preSet    : BasicLeaderSetting,
    },
    TRIBE_BEAST_W : {
        id        : "TRIBE_BEAST_W",
        label     : "水影世界 ‧ 獸",
        info      : "獸類攻擊力 2.5 倍；水符石兼具所有屬性符石效果，每個獸類成員提升 10% 效果，最高 50% (效果可以疊加)",
        attack    : TribeBeastAttack,
        preSet    : BasicLeaderSetting,
    },
    TRIBE_BEAST_F : {
        id        : "TRIBE_BEAST_F",
        label     : "焰影世界 ‧ 獸",
        info      : "獸類攻擊力 2.5 倍；火符石兼具所有屬性符石效果，每個獸類成員提升 10% 效果，最高 50% (效果可以疊加)",
        attack    : TribeBeastAttack,
        preSet    : BasicLeaderSetting,
    },
    TRIBE_BEAST_P : {
        id        : "TRIBE_BEAST_P",
        label     : "森影世界 ‧ 獸",
        info      : "獸類攻擊力 2.5 倍；木符石兼具所有屬性符石效果，每個獸類成員提升 10% 效果，最高 50% (效果可以疊加)",
        attack    : TribeBeastAttack,
        preSet    : BasicLeaderSetting,
    },
    TRIBE_BEAST_L : {
        id        : "TRIBE_BEAST_L",
        label     : "光影世界 ‧ 獸",
        info      : "獸類攻擊力 2.5 倍；光符石兼具所有屬性符石效果，每個獸類成員提升 10% 效果，最高 50% (效果可以疊加)",
        attack    : TribeBeastAttack,
        preSet    : BasicLeaderSetting,
    },
    TRIBE_BEAST_D : {
        id        : "TRIBE_BEAST",
        label     : "魅影世界 ‧ 獸",
        info      : "獸類攻擊力 2.5 倍；暗符石兼具所有屬性符石效果，每個獸類成員提升 10% 效果，最高 50% (效果可以疊加)",
        attack    : TribeBeastAttack,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_W : {
        id        : "BABYLON_W",
        label     : "穹蒼之賜 ‧ 水",
        info      : "水屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒水符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttack,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_F : {
        id        : "BABYLON_F",
        label     : "穹蒼之賜 ‧ 火",
        info      : "火屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒火符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttack,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_P : {
        id        : "BABYLON_P",
        label     : "穹蒼之賜 ‧ 木",
        info      : "木屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒木符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttack,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_L : {
        id        : "BABYLON_L",
        label     : "穹蒼之賜 ‧ 光",
        info      : "光屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒光符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttack,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_D : {
        id        : "BABYLON_D",
        label     : "穹蒼之賜 ‧ 暗",
        info      : "暗屬性攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒暗符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttack,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_PLUS_W : {
        id        : "BABYLON_PLUS_W",
        label     : "穹蒼之賜 ‧ 浪濤",
        info      : "水屬性攻擊力 3 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒水符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttackPlus,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_PLUS_F : {
        id        : "BABYLON_PLUS_F",
        label     : "穹蒼之賜 ‧ 熾燄",
        info      : "火屬性攻擊力 3 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒火符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttackPlus,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_PLUS_P : {
        id        : "BABYLON_PLUS_P",
        label     : "穹蒼之賜 ‧ 藤木",
        info      : "木屬性攻擊力 3 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒木符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttackPlus,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_PLUS_L : {
        id        : "BABYLON_PLUS_L",
        label     : "穹蒼之賜 ‧ 玄光",
        info      : "光屬性攻擊力 3 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒光符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttackPlus,
        preSet    : BasicLeaderSetting,
    },
    BABYLON_PLUS_D : {
        id        : "BABYLON_PLUS",
        label     : "穹蒼之賜 ‧ 幽冥",
        info      : "暗屬性攻擊力 3 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒暗符石",
        newItem   : BabylonSkill,
        attack    : BabylonAttackPlus,
        preSet    : BasicLeaderSetting,
    },
    SWORD_BROTHER : {
        id        : "SWORD_BROTHER",
        label     : "陰陽煞陣",
        info      : "光和暗屬性攻擊力 2 倍；同時消除光符石及暗符石，光和暗屬性攻擊力額外提升 1.5 倍 (效果可以疊加)",
        attack    : SwordBrotherAttack,
        preSet    : BasicLeaderSetting,
    },
    SWORD_BROTHER_EX : {
        id        : "SWORD_BROTHER_EX",
        label     : "陰陽煞陣 ‧ 強",
        info      : "光和暗屬性攻擊力 2.5 倍；光符石兼具 50% 暗符石效果，暗符石兼具 50% 光符石效果 (效果可以疊加)；同時消除光符石及暗符石，光和暗屬性攻擊力額外提升 1.5 倍 (效果可以疊加)",
        attack    : SwordBrotherEXAttack,
        preSet    : BasicLeaderSetting,
    },
    COMMON_SOURCE : {
        id        : "COMMON_SOURCE",
        label     : "仙劍同源",
        info      : "隊伍中只有水、火及木屬性的成員時，水符石兼具火及木符石效果、火符石兼具水及木符石效果，同時木符石兼具水及火符石效果 (不能疊加)；消除心符石時攻擊力有 50% 機會額外提升 1.5 倍 (機率可以疊加)",
        attack    : CommonSourceAttack,
        preSet    : BasicLeaderSetting,
    },
    COMMON_SOURCE_EX : {
        id        : "COMMON_SOURCE_EX",
        label     : "仙劍同源 ‧ 強",
        info      : "隊伍中只有水、火及木屬性的成員時，水符石兼具火及木符石效果、火符石兼具水及木符石效果，同時木符石兼具水及火符石效果 (不能疊加)；消除心符石時攻擊力有 50% 機會額外提升 1.5 倍 (機率可以疊加)。同時消除水、火及木符石時，全隊攻擊力額外提升 1.5 倍",
        attack    : CommonSourceEXAttack,
        preSet    : BasicLeaderSetting,
    },
    LIXIAOYAO : {
        id        : "LIXIAOYAO",
        label     : "逍遙神劍",
        info      : "全隊攻擊力 1.8 倍；消除的符石數量愈多 (主動技能除外)，全隊攻擊力額外提升愈多 (不能疊加)。隊伍中只有水、火及木屬性的成員時，消除心符石時攻擊力有 50% 機會額外提升 1.5 倍 (機率可以疊加)",
        attack    : LIXIAOYAOAttack,
        preSet    : BasicLeaderSetting,
    },
    WATER_FAIRY : {
        id        : "WATER_FAIRY",
        label     : "流雲雙刃斬",
        info      : "水屬性攻擊力 2.5 倍；消除最底一橫行內的所有符石時，自身攻擊力額外提升 3 倍，若使用相同的隊長及戰友時，自身攻擊力額外提升至 9 倍",
        attack    : WaterFairyAttack,
        preSet    : BasicLeaderSetting,
    },
    DARK_LUCIFER : {
        id        : "DARK_LUCIFER",
        label     : "穹蒼之賜 ‧ 護心",
        info      : "全隊攻擊力 2.5 倍；每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 1 粒心符石。生命力全滿時，所受傷害減少 20%",
        newItem   : BabylonSkill,
        attack    : DarkLuciferAttack,
        preSet    : DarkLuciferSetting,        
    },
    DEVIL_ILLUSION_W : {
        id        : "DEVIL_ILLUSION_W",
        label     : "無影幻像 ‧ 浪濤",
        info      : "水屬性攻擊力 3 倍，每回合場上數量最多的 1 種屬性符石兼具 50% 水符石效果 (可疊加)，如場上數量最多的 1 種屬性符石為水屬性符石時，則兼具效果變為水屬性攻擊力提升 1.4 倍 (可疊加)",
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_ILLUSION_F : {
        id        : "DEVIL_ILLUSION_F",
        label     : "無影幻像 ‧ 熾燄",
        info      : "火屬性攻擊力 3 倍，每回合場上數量最多的 1 種屬性符石兼具 50% 火符石效果 (可疊加)，如場上數量最多的 1 種屬性符石為火屬性符石時，則兼具效果變為火屬性攻擊力提升 1.4 倍 (可疊加)",
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_ILLUSION_P : {
        id        : "DEVIL_ILLUSION_P",
        label     : "無影幻像 ‧ 藤木",
        info      : "木屬性攻擊力 3 倍，每回合場上數量最多的 1 種屬性符石兼具 50% 木符石效果 (可疊加)，如場上數量最多的 1 種屬性符石為木屬性符石時，則兼具效果變為木屬性攻擊力提升 1.4 倍 (可疊加)",
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_ILLUSION_PLUS_W : {
        id        : "DEVIL_ILLUSION_PLUS_W",
        label     : "無垠幻像 ‧ 浪濤",
        info      : "水屬性攻擊力 3.5 倍，每回合場上數量最多的 1 種屬性符石兼具 50% 水符石效果 (可疊加)，如場上數量最多的 1 種屬性符石為水屬性符石時，則兼具效果變為水屬性攻擊力提升 1.4 倍 (可疊加)",
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionPlusAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_ILLUSION_PLUS_F : {
        id        : "DEVIL_ILLUSION_PLUS_F",
        label     : "無垠幻像 ‧ 熾燄",
        info      : "火屬性攻擊力 3.5 倍，每回合場上數量最多的 1 種屬性符石兼具 50% 火符石效果 (可疊加)，如場上數量最多的 1 種屬性符石為火屬性符石時，則兼具效果變為火屬性攻擊力提升 1.4 倍 (可疊加)",
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionPlusAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_ILLUSION_PLUS_P : {
        id        : "DEVIL_ILLUSION_PLUS_P",
        label     : "無垠幻像 ‧ 藤木",
        info      : "木屬性攻擊力 3.5 倍，每回合場上數量最多的 1 種屬性符石兼具 50% 木符石效果 (可疊加)，如場上數量最多的 1 種屬性符石為木屬性符石時，則兼具效果變為木屬性攻擊力提升 1.4 倍 (可疊加)",
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionPlusAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_CIRCLE_L : {
        id        : "DEVIL_CIRCLE_L",
        label     : "流螢結陣 ‧ 繼",
        info      : "光屬性攻擊力 3 倍，並延長移動符石時間 1 秒；消除一組 5 粒或以上的光符石時，光屬性攻擊力額外提升 1.5 倍 (可疊加)",
        attack    : DevilCircleAttack,
        setTime   : DevilCircleSetTime,
        preSet    : BasicLeaderSetting,
    },
    DEVIL_CIRCLE_D : {
        id        : "DEVIL_CIRCLE_D",
        label     : "幽冥結陣 ‧ 繼",
        info      : "暗屬性攻擊力 3 倍，並延長移動符石時間 1 秒；消除一組 5 粒或以上的暗符石時，暗屬性攻擊力額外提升 1.5 倍 (可疊加)",
        attack    : DevilCircleAttack,
        setTime   : DevilCircleSetTime,
        preSet    : BasicLeaderSetting,
    },
    ELEMENTAL_AGGRESSION : {
        id        : "ELEMENTAL_AGGRESSION",
        label     : "元素逼力",
        info      : "消除符石的屬性愈多，全隊攻擊力愈高：最少消除 3 種屬性符石，全隊攻擊力 3 倍，消除 5 種屬性符石可達至最高 4 倍。所有符石掉落機率不受其他技能影響 (包括改變掉落符石屬性的技能)",
        attack    : elementalAggressionAttack,
        preSet    : elementalAggressionSetting,
    },
    OLD_GREEK_WD : {
        id        : "OLD_GREEK_WD",
        label     : "界限變革",
        info      : "所有符石只要同屬性 3 粒相連即可消除",
        preSet    : OldGreekSetting,
    },
    OLD_GREEK_L : {
        id        : "OLD_GREEK_L",
        label     : "五念凝匯 ‧ 極",
        info      : "隊員有 5 種屬性，全隊攻擊力 2 倍；隊員有 5 種種族，全隊額外 2 倍攻擊力。",
        attack    : OldGreekLAttack,
        preSet    : BasicLeaderSetting,
    },
};

function NewLeaderSkill( id ){
    var leaderSkillObj = $.extend(true, {}, LEADER_SKILLS_DATA[id]);
    leaderSkillObj["variable"] = {};
    return leaderSkillObj;
}

function checkLeaderSkillByKey( key ){
    if( key in TEAM_LEADER_SKILL ){
        TEAM_LEADER_SKILL[ key ]( TEAM_LEADER_SKILL["variable"], "leader" );
    }
    if( key in TEAM_FRIEND_SKILL ){
        TEAM_FRIEND_SKILL[ key ]( TEAM_FRIEND_SKILL["variable"], "friend" );
    }
}
function checkLeaderSkillByKeyVar( key, Var ){
    if( key in TEAM_LEADER_SKILL ){
        TEAM_LEADER_SKILL[ key ]( TEAM_LEADER_SKILL["variable"], "leader", Var );
    }
    if( key in TEAM_FRIEND_SKILL ){
        TEAM_FRIEND_SKILL[ key ]( TEAM_FRIEND_SKILL["variable"], "friend", Var );
    }
}