//==============================================================
//==============================================================
// Team Composition
//==============================================================
//==============================================================

function resetTeamComposition(){ 

    TEAM_MEMBERS = [
        TEAM_LEADER,
        MEMBER_1,
        MEMBER_2,
        MEMBER_3,
        MEMBER_4,
        TEAM_FRIEND,
    ];  
    cleanColors();
    resetDropColors();
    resetSetGroupSize();

    // wake & teamSkill may change the active/leader
    resetMemberWakes();
    checkTeamSkill();

    resetTeamLeaderSkill();
    resetMemberActiveSkill();
    checkCombineSkill();
    checkActiveCoolDownByWake();
    
    resetColors();
    resetHealthPoint();
    resetBattleStack();
}

function resetMemberWakes(){
    TEAM_WAKES = [];
    $.each(TEAM_MEMBERS, function(place, member){
        var wakes = [];
        $.each(member["wake"], function(i, wakeId){
            var wake = WAKES_DATA[ wakeId ];
            if( "preSet" in wake ){
                wake["preSet"](  member, place, member['wake_var'][i] );
            }
            wakes.push( wake );
        });
        TEAM_WAKES.push( wakes );
    });
}
function checkActiveCoolDownByWake(){
    $.each(TEAM_MEMBERS, function(place, member){
        $.each(TEAM_WAKES[place], function(i, wake){
            if( "changeCD" in wake ){
                wake["changeCD"](  member, place, member['wake_var'][i] );
            }
        });
    });
}

function resetMemberActiveSkill(){
    TEAM_ACTIVE_SKILL     = [];
    $.each(TEAM_MEMBERS, function(place, member){
        var actives = [];
        $.each(member['active'], function(i, activeId){
            var active = NewActiveSkill( activeId );
            active['variable'] = active['preSet']( member, place, i );
            actives.push( active );
        });
        TEAM_ACTIVE_SKILL.push( actives );
    });
}
function checkCombineSkill(){
    TEAM_COMBINE_SKILL = [];
    $.each(TEAM_MEMBERS, function(place, member){
        var actives = [];
        TEAM_COMBINE_SKILL.push( actives );
    });
    for( var combineSkillKey in COMBINE_SKILLS_DATA ){
        COMBINE_SKILLS_DATA[combineSkillKey]["mapping"]();
    }
}

function resetTeamLeaderSkill(){
    TEAM_LEADER_SKILL = NewLeaderSkill( TEAM_LEADER['leader'] );
    TEAM_FRIEND_SKILL = NewLeaderSkill( TEAM_FRIEND['leader'] );

    TEAM_LEADER_SKILL["variable"] = TEAM_LEADER_SKILL['preSet']( TEAM_LEADER );
    TEAM_FRIEND_SKILL["variable"] = TEAM_FRIEND_SKILL['preSet']( TEAM_FRIEND );
}
function checkTeamSkill(){
    TEAM_SKILL = [];
    for( var teamSkillKey in TEAM_SKILLS_DATA ){
        TEAM_SKILLS_DATA[teamSkillKey]["mapping"]();
    }
}

function resetHealthPoint(){
    TOTAL_HEALTH_POINT = 0;
    HEALTH_POINT = 0;
    $.each(TEAM_MEMBERS, function(place, member){
        var health = member['health'];
        if( 'setHP' in TEAM_LEADER_SKILL ){
            health = TEAM_LEADER_SKILL['setHP']( member, health );
        }
        if( 'setHP' in TEAM_FRIEND_SKILL ){
            health = TEAM_FRIEND_SKILL['setHP']( member, health );
        }
        TOTAL_HEALTH_POINT += health;
    });
    TOTAL_HEALTH_POINT = Math.round(TOTAL_HEALTH_POINT);
    HEALTH_POINT = TOTAL_HEALTH_POINT;
}
function resetBattleStack(){
    ADDITIONAL_EFFECT_STACK  = [];
    USING_ACTIVE_SKILL_STACK = {};
    ATTACK_STACK  = [];
    RECOVER_STACK = [];
    INJURE_STACK  = [];
}
//==============================================================
//==============================================================
// Enemy
//==============================================================
//==============================================================

function resetGameWaves(){
    GAME_PROGRESS = -1;
    GAME_WAVES = [ ["EMPTY"] ];
}