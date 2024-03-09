//==============================================================
//==============================================================
// WAKE SKILL
//==============================================================
//==============================================================
var HealthAttackRecoveryIncrease = function( MEMBER, place, wakeVar ){
    // wakeVar = "[+health,+attack,+recovery]"
    MEMBER['health']   += wakeVar[0];
    MEMBER['attack']   += wakeVar[1];
    MEMBER['recovery'] += wakeVar[2];
}

var DropIncrease = function( MEMBER, place, wakeVar ){
    // wakeVar = "[color,prob]"
    var color = wakeVar[0];
    if( COLORS.indexOf(color) >= 0 ){
        COLOR_PROB[ place ][ color ] = wakeVar[1];
    }
}

var ActiveCoolDownForever = function( MEMBER, place, wakeVar ){
    TEAM_ACTIVE_SKILL[place][0]['coolDown'] -= wakeVar;
    TEAM_ACTIVE_SKILL[place][0]['variable']['COOLDOWN'] -= wakeVar;
}
var ActiveCoolDownBegining = function(MEMBER, place, wakeVar ){
    TEAM_ACTIVE_SKILL[place][0]['variable']['COOLDOWN'] -= wakeVar;
}

var ChangeActiveSkillBegining = function(MEMBER, place, wakeVar ){ 
    // wakeVar = [i, "skill_ID"]
    MEMBER['active'][ wakeVar[0] ] = wakeVar[1];
}
var ChangeLeaderSkillBegining = function(MEMBER, place, wakeVar ){ 
    // wakeVar = "skill_ID"
    MEMBER['leader'] = wakeVar;
}

//==============================================================
var StraightAttack = function( wakeVar, place, i ){
    // wakeVar = "[factor,straightSize]"
    if( checkFirstStraightByPlace( wakeVar[1], place ) ){
        COUNT_FACTOR['StraightAttack_'+place+'_'+i] = {
            factor    : function( member, member_place ){
                return wakeVar[0];
            },
            prob      : 1,
            condition : function( member, member_place ){
                return true;
            },
        };  
    }  
}

var StraightRecover = function( wakeVar, place, i ){
    // wakeVar = "[factor,straightSize]"
    if( checkFirstStraightByPlace( wakeVar[1], place ) ){
        COUNT_RECOVER_FACTOR['StraightRecover_'+place+'_'+i] = {
            factor    : function( member, member_place ){
                return wakeVar[0];
            },
            prob      : 1,
            condition : function( member, member_place ){
                return true;
            },
        };  
    }
}

var StraightHeal = function( wakeVar, place, i ){
    // wakeVar = "[factor,straightSize]"
    if( checkFirstStraightByPlace( wakeVar[1], place ) ){

        var recover = makeNewRecover();
        recover['base']  = TEAM_MEMBERS[place]["recovery"];
        recover['factor']= wakeVar[0];
        recover['place'] = place;
        recover['style'] = "wake";
        recover['log']   = "StraightHeal_from_"+place;
        
        RECOVER_STACK.push(recover);
    }
}

var StraightEncirclementTransfer = function( wakeVar, place, i ){
    var stack = getStackOfStraight(place);
    for(var id of stack){
        turnElementToColorByID(id, wakeVar);
    }
}
var StraightEnchantmentTransfer = function( wakeVar, place, i ){
    var stack = getStackOfStraightByColor( place, wakeVar );
    for(var id of stack){
        turnElementToStrongByID(id);
    }
}

//==============================================================
//==============================================================
// Wake Database
//==============================================================
//==============================================================
var WAKES_DATA = {
    NONE : {
        id        : "NONE",
    },
    H_A_R_INCREASE : {
        id        : "H_A_R_INCREASE",
        preSet    : HealthAttackRecoveryIncrease,
        // wakeVar = "[+health,+attack,+recovery]"
    },
    DROP_INCREASE : {
        id        : "DROP_INCREASE",
        preSet    : DropIncrease,
        // wakeVar = "[color,prob]"
    },
    STRAIGHT_ATTACK : {
        id        : "STRAIGHT_ATTACK",
        attack    : StraightAttack,
        // wakeVar = "[factor,straightSize]"
    },
    STRAIGHT_RECOVER : {
        id        : "STRAIGHT_RECOVER",
        recover   : StraightRecover,
        // wakeVar = "[factor,straightSize]"
    },
    STRAIGHT_HEAL : {
        id        : "STRAIGHT_HEAL",
        recover   : StraightHeal,
        // wakeVar = "[factor,straightSize]"
    },
    ACTIVE_COOLDOWN_FOREVER : {
        id        : "ACTIVE_COOLDOWN_FOREVER",
        changeCD  : ActiveCoolDownForever,
        // wakeVar = "turn"
    },
    ACTIVE_COOLDOWN_BEGINING : {
        id        : "ACTIVE_COOLDOWN_BEGINING",  
        changeCD  : ActiveCoolDownBegining,  
        // wakeVar = "turn"    
    },
    STRAIGHT_ENCIRCLEMENT : {
        id        : "STRAIGHT_ENCIRCLEMENT",
        transfer  : StraightEncirclementTransfer,
    },
    STRAIGHT_ENCHANTMENT : {
        id        : "STRAIGHT_ENCHANTMENT",
        transfer  : StraightEnchantmentTransfer,
    },
    CHANGE_ACTIVE_SKILL : {
        id        : "CHANGE_ACTIVE_SKILL",
        preSet    : ChangeActiveSkillBegining,
        // wakeVar = [i, "skill_ID"]
    },
    CHANGE_LEADER_SKILL : {
        id        : "CHANGE_LEADER_SKILL",
        preSet    : ChangeLeaderSkillBegining,
        // wakeVar = [i, "skill_ID"]
    },
}


function checkWakeByKey( key ){
    $.each(TEAM_WAKES, function(place, wakes){
        $.each(wakes, function(i, wake){
            if( key in wake ){
                wake[ key ]( TEAM_MEMBERS[place]['wake_var'][i], place, i );
            }
        });
    });
}

function checkWakeFromOrderByKey( key, place, i ){
    if( TEAM_WAKES[place].length > i && key in TEAM_WAKES[place][i] ){
        TEAM_WAKES[place][i][ key ]( TEAM_MEMBERS[place]['wake_var'][i], place, i );
    }
}