//==============================================================
//==============================================================
// WAKE SKILL
//==============================================================
//==============================================================
var BasicWakeSetting = function(){};

var HealthAttackRecoveryIncrease = function( member, wakeVar ){
}

var DropIncrease = function( member, wakeVar ){
    // wakeVar = "[color,prob]"
    environmentManager.colorProb[ member.xIndex ][ wakeVar[0] ] = wakeVar[1];
}

var ActiveCoolDownForever = function( member, wakeVar ){
}
var ActiveCoolDownBegining = function(member, wakeVar ){
}

var ChangeActiveSkillBegining = function(member, wakeVar ){ 
}
var ChangeLeaderSkillBegining = function(member, wakeVar ){ 
}

//==============================================================
var StraightAttack = function( wakeVar, i ){
}

var StraightRecover = function( wakeVar, i ){
}

var StraightHeal = function( wakeVar, i ){
}

var StraightEncirclementTransfer = function( wakeVar, i ){
}
var StraightEnchantmentTransfer = function( wakeVar, i ){
}

//==============================================================
//==============================================================
// Wake Database
//==============================================================
//==============================================================
var WAKES_DATA = {
    NONE : {
        id        : "NONE",
        init      : BasicWakeSetting,
    },
    H_A_R_INCREASE : {
        id        : "H_A_R_INCREASE",
        init      : HealthAttackRecoveryIncrease,
        // wakeVar = "[+health,+attack,+recovery]"
    },
    DROP_INCREASE : {
        id        : "DROP_INCREASE",
        init      : DropIncrease,
        // wakeVar = "[color,prob]"
    },
    STRAIGHT_ATTACK : {
        id        : "STRAIGHT_ATTACK",
        init      : BasicWakeSetting,
        attack    : StraightAttack,
        // wakeVar = "[factor,straightSize]"
    },
    STRAIGHT_RECOVER : {
        id        : "STRAIGHT_RECOVER",
        init      : BasicWakeSetting,
        recover   : StraightRecover,
        // wakeVar = "[factor,straightSize]"
    },
    STRAIGHT_HEAL : {
        id        : "STRAIGHT_HEAL",
        init      : BasicWakeSetting,
        recover   : StraightHeal,
        // wakeVar = "[factor,straightSize]"
    },
    ACTIVE_COOLDOWN_FOREVER : {
        id        : "ACTIVE_COOLDOWN_FOREVER",
        init      : BasicWakeSetting,
        changeCD  : ActiveCoolDownForever,
        // wakeVar = "turn"
    },
    ACTIVE_COOLDOWN_BEGINING : {
        id        : "ACTIVE_COOLDOWN_BEGINING",  
        init      : BasicWakeSetting,
        changeCD  : ActiveCoolDownBegining,  
        // wakeVar = "turn"    
    },
    STRAIGHT_ENCIRCLEMENT : {
        id        : "STRAIGHT_ENCIRCLEMENT",
        init      : BasicWakeSetting,
        transfer  : StraightEncirclementTransfer,
    },
    STRAIGHT_ENCHANTMENT : {
        id        : "STRAIGHT_ENCHANTMENT",
        init      : BasicWakeSetting,
        transfer  : StraightEnchantmentTransfer,
    },
    CHANGE_ACTIVE_SKILL : {
        id        : "CHANGE_ACTIVE_SKILL",
        init      : ChangeActiveSkillBegining,
        // wakeVar = [i, "skill_ID"]
    },
    CHANGE_LEADER_SKILL : {
        id        : "CHANGE_LEADER_SKILL",
        init      : ChangeLeaderSkillBegining,
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