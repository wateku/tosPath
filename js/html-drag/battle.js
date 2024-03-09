
function resetCount(){    
    COUNT_COMBO                = COMBO_TIMES;
    COUNT_COMBO_COEFF          = 0.25;
    COUNT_AMOUNT               = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_AMOUNT_COEFF         = { 'w': 0.25, 'f': 0.25, 'p': 0.25, 'l': 0.25, 'd': 0.25, 'h': 0.25 };
    COUNT_MAX_AMOUNT           = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_STRONG               = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_STRONG_COEFF         = { 'w': 0.15, 'f': 0.15, 'p': 0.15, 'l': 0.15, 'd': 0.15, 'h': 0.15 };
    COUNT_SETS                 = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_SETS_COEFF           = { 'w': 0.25, 'f': 0.25, 'p': 0.25, 'l': 0.25, 'd': 0.25, 'h': 0.25 };
    COUNT_FIRST_SETS           = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_FIRST_AMOUNT         = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };

    COUNT_BELONG_COLOR         = {
        'w': { 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 },
        'f': { 'w': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 },
        'p': { 'w': 0, 'f': 0, 'l': 0, 'd': 0, 'h': 0 },
        'l': { 'w': 0, 'f': 0, 'p': 0, 'd': 0, 'h': 0 },
        'd': { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'h': 0 },
        'h': { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0 } 
    };
    COUNT_BELONG_AMOUNT        = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_BELONG_MAX_AMOUNT    = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_BELONG_STRONG        = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_BELONG_SETS          = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };

    COUNT_FACTOR               = { 'NORMAL': 
        { 
            factor    : function( member ){ return 1; } ,
            prob      : 1,
            condition : function( member ){ return true; } 
        } 
    };

    COUNT_RECOVER_COMBO_COEFF  = 0.25;
    COUNT_RECOVER_AMOUNT_COEFF = 0.25;
    COUNT_RECOVER_STRONG_COEFF = 0.15;
    COUNT_RECOVER_FACTOR       = { 'NORMAL': 
        { 
            factor    : function( member ){ return 1; } ,
            prob      : 1,
            condition : function( member ){ return true; } 
        } 
    };

    COUNT_COLOR_FACTOR          = { 'w': 1, 'f': 1, 'p': 1, 'l': 1, 'd': 1, '_': 1 };
    COUNT_COLOR_TO_COLOR_FACTOR ={
        'w': { 'w': 1,   'f': 1.5, 'p': 0.5, 'l': 1,   'd': 1,   '_': 1 },
        'f': { 'w': 0.5, 'f': 1,   'p': 1.5, 'l': 1,   'd': 1,   '_': 1 },
        'p': { 'w': 1.5, 'f': 0.5, 'p': 1,   'l': 1,   'd': 1,   '_': 1 },
        'l': { 'w': 1,   'f': 1,   'p': 1,   'l': 1,   'd': 1.5, '_': 1 },
        'd': { 'w': 1,   'f': 1,   'p': 1,   'l': 1.5, 'd': 1,   '_': 1 },
        '_': { 'w': 1,   'f': 1,   'p': 1,   'l': 1,   'd': 1,   '_': 1 },
    };

    COUNT_INJURE_REDUCE         = 1;
}
function resetEnemyStatus(){
    $.each(ENEMY, function(e, enemy){
        enemy['variable']['COLOR'] = enemy['color'];
        enemy['variable']['DEFENCE'] = enemy['defence'];
        enemy['variable']['ATTACK'] = enemy['attack'];
        enemy['variable']['HATRED'] = [];
        enemy['variable']['SUFFER'] = 0;
    });
}
function resetShowPersonAtkRec(){
    $("#AttackNumber td").children().remove();
    $("#RecoverNumber td").children().remove();
}

//==============================================================
//  Count Attack/ EnemyAction
//==============================================================
function countAttack(){
    resetShowPersonAtkRec();
    resetAttackRecoverStack();
    resetCount();
    resetEnemyStatus();

    countComboStacks();
    checkAttackRecoverBeforeBattle();
    countBelongColorCombo();    

    $.each(TEAM_MEMBERS, function(membe_place, member){
        makeMemberAttack(membe_place, member);
        makeMemberRecover(membe_place, member);
    });
    countHealthRecover();
    checkAttackRecoverMapping();

    $.each(ATTACK_STACK, function(i, attack){
        mapAttackToEnemy(i, attack);
    });

    checkDamageEndBattle();
}
function countEnemyAction(){
    checkInjureReduce();
    $.each(ENEMY, function(i, enemy){
        enemyActionUpdate(i, enemy);
    });
    healthStatusUpdate();
}

function checkAttackRecoverBeforeBattle(){
    checkLeaderSkillByKey( "attack" );
    checkLeaderSkillByKey( "recover" );
    checkTeamSkillByKey( "attack" );
    checkTeamSkillByKey( "recover" );
    checkWakeByKey( "attack" );
    checkWakeByKey( "recover" );
    checkActiveSkillByKey( "attack" );
    checkActiveSkillByKey( "recover" );
    checkAdditionEffectByKey( "attack" );
    checkAdditionEffectByKey( "recover" );
    checkEnemyEffectByKey("attack");  
}
function checkAttackRecoverMapping(){
    // 共鳴
    checkAdditionEffectByKey( "resonance" );
    // 連擊
    checkAdditionEffectByKey( "extraAttack" );
}
function checkAttackRecoverDamage( attack ){
    // 吸血
    checkLeaderSkillByKeyVar( "damage", attack );
    checkAdditionEffectByKeyVar( "damage", attack );
}
function checkDamageEndBattle(){    
    // 泡沫/擴散
    checkEnemyEffectByKey( "damageEnd" );  
}
function checkRecoverOverflow( overflow ){
    // 溢補
    checkLeaderSkillByKeyVar( "overflow", overflow );
    checkTeamSkillByKeyVar( "overflow", overflow );
}
function checkInjureReduce(){
    // 減傷
    checkLeaderSkillByKey( "injure" );
    checkAdditionEffectByKey( "injure" );
}
function checkWillAfterBattle(){
    // 根性意志
    checkLeaderSkillByKey( "will" );
    checkTeamSkillByKey( "will" );
}
function checkCounterSinAfterBattle( injure ){
    checkLeaderSkillByKeyVar( "counterSin", injure )
}

//==============================================================
// clean combo to count 
//==============================================================
function countComboStacks(){
    for(var obj of COMBO_STACK){
        var c = obj['color'];
        COUNT_AMOUNT[c] += obj['amount'];
        COUNT_MAX_AMOUNT[c] = Math.max( COUNT_MAX_AMOUNT[c], obj['amount'] );
        COUNT_STRONG[c] += obj['strong_amount'];
        COUNT_SETS[c] += 1;

        if( obj['drop_wave'] == 0 ){
            COUNT_FIRST_SETS[c] += 1;
            COUNT_FIRST_AMOUNT[c] += obj['amount'];
        }
    }
}
function countBelongColorCombo(){
    for(var obj of COMBO_STACK){
        var c = obj['color'];
        for(var belong_color in COUNT_BELONG_COLOR[c]){
            if( COUNT_BELONG_COLOR[c][belong_color] > 0 ){
                COUNT_BELONG_AMOUNT[belong_color] += obj['amount'] * COUNT_BELONG_COLOR[c][belong_color];
                COUNT_BELONG_MAX_AMOUNT[c] = Math.max( COUNT_BELONG_MAX_AMOUNT[c], obj['amount'] );
                COUNT_BELONG_STRONG[belong_color] += obj['strong_amount'] * COUNT_BELONG_COLOR[c][belong_color];
                COUNT_BELONG_SETS[belong_color] += 1;
            }
        }
    }
}

//==============================================================
// member attack/recover
//==============================================================
function makeMemberAttack(membe_place, member){
    var color = member["color"];
    var attack = makeNewAttack();
    attack['base']  = member["attack"];
    attack['color'] = color;
    attack['factor']= 1;
    attack['place'] = membe_place;
    attack['style'] = "person";
    attack['type']  = member["type"];
    attack['log']   = member["attack"]+"*1";

    if( COUNT_MAX_AMOUNT[color] >= 5 || COUNT_BELONG_MAX_AMOUNT[color] >= 5 ){
        attack['goal'] = "all";
    }
    if( (COUNT_STRONG[color]+COUNT_BELONG_STRONG[color]) > 0 ){
        attack['strong'] = true;
    }

    var atk       = ( 1+ ( COUNT_COMBO-1 ) * COUNT_COMBO_COEFF ) * 
                    ( ( COUNT_AMOUNT[color] + COUNT_BELONG_AMOUNT[color] ) * COUNT_AMOUNT_COEFF[color] +
                      ( COUNT_SETS[color]   + COUNT_BELONG_SETS[color]   ) * COUNT_SETS_COEFF[color] +
                      ( COUNT_STRONG[color] + COUNT_BELONG_STRONG[color] ) * COUNT_STRONG_COEFF[color] );
    attack['log'] = "(1+("+(COUNT_COMBO-1)+")*"+COUNT_COMBO_COEFF+")*"+
                    "(("+COUNT_AMOUNT[color]+"+"+COUNT_BELONG_AMOUNT[color]+")*"+COUNT_AMOUNT_COEFF[color]+"+"+
                     "("+COUNT_SETS[color]  +"+"+COUNT_BELONG_SETS[color]  +")*"+COUNT_SETS_COEFF[color]+"+"+
                     "("+COUNT_STRONG[color]+"+"+COUNT_BELONG_STRONG[color]+")*"+COUNT_STRONG_COEFF[color]+")";

    for(var key in COUNT_FACTOR){
        if( COUNT_FACTOR[key]["condition"]( member, membe_place ) ){
            if( randomBySeed() < COUNT_FACTOR[key]["prob"] ){
                var factor = COUNT_FACTOR[key]["factor"]( member, membe_place ).toFixed(5);
                atk *= factor;
                attack['log'] += "*"+factor+'('+key+')';
            }
        }
    }

    attack["factor"]  = atk;
    ATTACK_STACK.push( attack );
}
function makeMemberRecover(membe_place, member){
    var recover = makeNewRecover();
    recover['base']  = member["recovery"];
    recover['color'] = member["color"];
    recover['factor']= 1;
    recover['place'] = membe_place;
    recover['style'] = "person";
    recover['type']  = member["type"];
    recover['log']   = member["recovery"]+"*1";

    var rec        = ( 1+ ( COUNT_COMBO-1 ) * COUNT_RECOVER_COMBO_COEFF ) *
                     ( ( COUNT_AMOUNT['h'] + COUNT_BELONG_AMOUNT['h'] +
                        COUNT_SETS['h']   + COUNT_BELONG_SETS['h']     ) * COUNT_RECOVER_AMOUNT_COEFF +
                       ( COUNT_STRONG['h'] + COUNT_BELONG_STRONG['h']   ) * COUNT_RECOVER_STRONG_COEFF );
    recover['log'] = "(1+("+(COUNT_COMBO-1)+")*"+COUNT_RECOVER_COMBO_COEFF+")"+"*"+
                     "(("+COUNT_AMOUNT['h']+"+"+COUNT_BELONG_AMOUNT['h']+"+"+
                          COUNT_SETS['h']  +"+"+COUNT_BELONG_SETS['h']  +")*"+COUNT_RECOVER_AMOUNT_COEFF+"+"+
                      "("+COUNT_STRONG['h']+"+"+COUNT_BELONG_STRONG['h']+")*"+COUNT_RECOVER_STRONG_COEFF+")";
    for(var key in COUNT_RECOVER_FACTOR){
        if( COUNT_RECOVER_FACTOR[key]["condition"]( member, membe_place ) ){
            if( randomBySeed() < COUNT_RECOVER_FACTOR[key]["prob"] ){
                var factor = COUNT_RECOVER_FACTOR[key]["factor"]( member, membe_place ).toFixed(5);
                rec *= factor;
                recover['log'] += "*"+factor+'('+key+')';
            }
        }
    }

    recover["factor"] = rec;
    RECOVER_STACK.push( recover );    
}


//==============================================================
// action 1 : team recover health
//==============================================================
function countHealthRecover(){
    var total_recover = 0;
    $.each(RECOVER_STACK, function(i, recover){
        if( recover['work'] != 'done' ){
            var rec = Math.round( recover["base"] * recover["factor"] );
            total_recover += rec;
            showPersonRecover( recover );
            recover['work'] = 'done';
        }
    });

    HEALTH_POINT = HEALTH_POINT+total_recover;
    var overflow = HEALTH_POINT - TOTAL_HEALTH_POINT;
    if( HEALTH_POINT > TOTAL_HEALTH_POINT ){
        HEALTH_POINT = TOTAL_HEALTH_POINT;
    }
    checkRecoverOverflow( overflow );

    if( total_recover > 0 ){
        showTotalRecover( total_recover );
    }
}
//==============================================================
// action 2 : team attack enemy
//==============================================================
function mapAttackToEnemy( a, attack ){
    if( attack['work'] == 'done' ){ return false; }

    showPersonAttack( attack );

    if( attack['goal'] == "single" ){
        // TODO : enemy priority select
        var target = 0;
        $.each(ENEMY, function(i, enemy){
            if( enemy['variable']['HEALTH'] > 0 ){
                target = i;
                return false;
            }
        });
        attack['target'].push(target);
        countEnemySufferAttack( ENEMY[target], attack );

    }else if( attack['goal'] == "all" ){
        $.each(ENEMY, function(i, enemy){
            attack['target'].push(i);
            countEnemySufferAttack( enemy, attack );
        });

    }else if( attack['goal'] == "enemy" ){
        $.each(attack['target'], function(i, enemy){
            countEnemySufferAttack( enemy, attack );
        });
    }

    attack['work'] = 'done';
    checkAttackRecoverDamage( attack );
    countHealthRecover();
}

function countEnemySufferAttack( enemy, attack ){
    var color = attack['color'];
    var e_color = enemy['variable']['COLOR'];
    attack['factor'] *=     COUNT_COLOR_FACTOR[color] *   COUNT_COLOR_TO_COLOR_FACTOR[color][e_color];
    attack['log']    += '*'+COUNT_COLOR_FACTOR[color]+'*'+COUNT_COLOR_TO_COLOR_FACTOR[color][e_color];

    // check if attack luanch
    var atk = Math.round( attack["base"] * attack["factor"] );
    if( atk > 0 ){

        if( attack['style'] == "directDamage" ){
            // attack without care enemy defense & ability
            attack['damage'] = atk;
            // update enemy suffer
            enemy['variable']['HATRED'].push( attack );
            enemy['variable']['SUFFER'] += atk;
            enemy['variable']['HEALTH'] = Math.max( 0, enemy['variable']['HEALTH']-atk );

        }else if( attack['style'] == "overflow" ){
            // attack not make damage for other function use
            atk = Math.max( 1, atk-enemy['variable']['DEFENCE'] );
            attack['log'] += "_overflowDamage"+atk;
            attack['damage'] = 0;
            // update enemy suffer
            enemy['variable']['HATRED'].push( attack );
            enemy['variable']['SUFFER'] += atk;
            enemy['variable']['HEALTH'] = Math.max( 0, enemy['variable']['HEALTH']-atk );

        }else{
            // attack go throung defence & enemy ability, log the true attack damge
            atk = Math.max( 1, atk-enemy['variable']['DEFENCE'] );
            attack['damage'] = atk;

            // check if effective attack
            if( atk > 1 ){
                enemy['variable']['HATRED'].push( attack );
            }

            // update enemy suffer
            enemy['variable']['SUFFER'] += atk;
            enemy['variable']['HEALTH'] = Math.max( 0, enemy['variable']['HEALTH']-atk );
        }
    }
}


//==============================================================
// action 3 : enemy launch injure
//==============================================================
function enemyActionUpdate(i, enemy){
    if( enemy['variable']['HEALTH'] <= 0 ){ return false; }

    enemy['variable']['COOLDOWN'] -= 1;

    // enemy luanch injure when CD == 0
    if( enemy['variable']['COOLDOWN'] == 0 ){
        enemy['variable']['COOLDOWN'] = enemy['coolDown'];

        var checkBewitchment = false;
        $.each(enemy['variable']['EFFECT'], function(i, effect){
            if( effect['id'] == 'BEWITCHMENT' ){
                checkBewitchment = true;
                return false;
            }
        });

        var injure = makeNewInjure();
        injure['enemy']  = enemy;
        injure['label']  = enemy['label'];
        injure['damage'] = enemy['variable']['ATTACK'];
        injure['color']  = enemy['variable']['COLOR'];

        if( checkBewitchment ){            
            var attack = makeNewAttack();
            var atk  = enemy['variable']['ATTACK'];
            atk = Math.max( 1, atk-enemy['variable']['DEFENCE'] );
            attack['damage'] = atk;
            attack['log']    = 'BEWITCHMENT';

            enemy['variable']['HATRED'].push( attack );
            enemy['variable']['SUFFER'] += atk;
            enemy['variable']['HEALTH'] = Math.max( 0, enemy['variable']['HEALTH']-atk );
            return;
        }

        // consider injure reduce by skill
        if( !("INJURE_REDUCEABLE" in enemy['variable']) || enemy['variable']["INJURE_REDUCEABLE"] ){
            injure['damage'] *= COUNT_INJURE_REDUCE;
        }
        INJURE_STACK.push(injure);
    }
}
function healthStatusUpdate(){
    var UNDEAD_WILL_USED = false;
    $.each(INJURE_STACK, function(i, injure){
        if( injure['work'] != 'done' ){
            UNDEAD_WILL = false;
            checkWillAfterBattle();

            HEALTH_POINT -= injure['damage'];
            if( UNDEAD_WILL && HEALTH_POINT <= 0 && !UNDEAD_WILL_USED ){
                HEALTH_POINT = 1;
                UNDEAD_WILL_USED = true;
            }
            HEALTH_POINT = Math.max( 0, HEALTH_POINT );

            injure['work'] = 'done';
            if( HEALTH_POINT == 0 ){ return false; }

            checkCounterSinAfterBattle( injure );
        }
    });
}


//==============================================================
//  Check Status after Battle
//==============================================================
function checkEnemyStatus(){
    ENEMY = $.map(ENEMY, function(enemy, i){
        if( enemy['variable']['HEALTH'] > 0 ){
            return enemy;
        }else{
            showEnemyDead( enemy, i );
        }
    });

    if( ENEMY.length == 0 ){ 
        return gotoNextLevelEnemy();
    }
    return true;
}
function checkTeamStatus(){
    if( HEALTH_POINT == 0 ){ return false; }
    return true;
}

//==============================================================
// Direct Attack/Recover By Active skill
//==============================================================
function makeDirectAttack( attack ){
    resetCount();
    resetEnemyStatus();

    mapAttackToEnemy( 0, attack );

    $.each(ENEMY, function(i, enemy){
        showEnemySuffer( i, enemy );
    });

    if( ! checkTeamStatus() ){
        showLoseGame();
        endGame();
    }else if( ! checkEnemyStatus() ){
        showWinGame();
        endGame();
    }
}
function makeDirectRecovery( recover ){ 
    var rec = Math.round( recover["base"] * recover["factor"] );
    showPersonRecover( recover );

    HEALTH_POINT = Math.min( TOTAL_HEALTH_POINT, Math.round( HEALTH_POINT+rec ) );
    showTotalRecover( rec );
    showResult();
}
function makeDirectInjure( injure ){ 
    HEALTH_POINT -= injure['damage'];
    HEALTH_POINT = Math.max( 0, HEALTH_POINT );

    showResult();

    if( ! checkTeamStatus() ){
        showLoseGame();
        endGame();
    }
}