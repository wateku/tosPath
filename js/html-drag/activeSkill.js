//==============================================================
//==============================================================
// Active Skill Function
//==============================================================
//==============================================================

var BasicActiveSetting = function( member, place, i ){
    return basicActiveSetting( member, place, i, this );
}
function basicActiveSetting( member, place, i, source ){
    return {
        COLOR    : member['color'],
        TYPE     : member['type'],
        STYLE    : "activeSkill",
        SOURCE   : source,
        COOLDOWN : source.coolDown,
        PLACE    : place,
        i        : i,
    };
}

var BasicActiveCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i );
}
function basicActiveCheck( VAR, place, i ){
    return (MAIN_STATE == MAIN_STATE_ENUM.READY) && (VAR['COOLDOWN'] == 0);
}

//==============================================================
// BrokeBoundary / Start Run Function
//==============================================================
var StartRunSetting = function( member, place, i ){
    var variable = basicActiveSetting( member, place, i, this );
    variable['USING'] = false;
    return variable;
}
var BrokeBoundaryStart = function( place, i ){
    this.variable['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };

    disbalePanelControl( true );
    setStartRunByPlayTypeAndTime( PLAY_TYPE_ENUM.DRAG, 10 );

    $("#dragContainment").attr("td", 6).attr("tr", 8);
    resetHistory();
    resetBase();
    initialTable();

    for(var i = 3; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j++){
            id = (i-3)*TD_NUM+j;
            if( id < INITIAL_PANEL.length && INITIAL_PANEL[id] ){
                var item = INITIAL_PANEL[id];
                if( item ){
                    $("#dragContainment tr td").eq(i*TD_NUM+j).append( newElementByItem(item) );
                }
            }
        }
    }
    for(var i = 0; i < TD_NUM; i++){
        var num = 0;
        for(var j = TR_NUM-1; j >= 0; j--){
            if( $("#dragContainment tr td").eq(j*TD_NUM+i).children().length == 0 ){
                DROP_STACK[i].push( newElementByID(i) );
                num++;
            }else{
                if( num > 0 ){
                    var imgs = $("#dragContainment tr td").eq(j*TD_NUM+i).find("img").remove();
                    $(imgs).attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP+j*HEIGHT);
                    $("#dragContainment tr td").eq((j+num)*TD_NUM+i).append(imgs);
                }
            }
        }
        var length = DROP_STACK[i].length;
        for(var n = 0; n < length; n++){
            var elements = DROP_STACK[i].pop();
            elements[0].attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP-(length-n)*HEIGHT);
            elements[1].attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP-(length-n)*HEIGHT);
            $("#dragContainment tr td").eq( (n+num-length)*TD_NUM+i ).append(elements);
        }
    }    
    var max_drop = 0;
    $("#dragContainment tr td img").each(function(){
        if( $(this).attr("drop") ){
            max_drop = $(this).attr("drop") > max_drop ? $(this).attr("drop") : max_drop;
            $(this).offset({top: $(this).attr("toTop"), left: $(this).attr("toLeft")});
            $(this).animate({"top": "+="+parseInt($(this).attr("drop"))*HEIGHT+"px" },
                            {duration: parseInt($(this).attr("drop"))*DROP_TIME});
            $(this).removeAttr("drop").removeAttr("toTop").removeAttr("toLeft");
        }
    });
    window.scrollTo(0, $("#timeLifeIcon").offset().top );

    setTimeout( function(){
        resetDraggable();
        startDragging();
    }, max_drop*DROP_TIME );
}
var BrokeBoundaryAttack = function( place, i ){    
    if( !this.variable['USING'] ){ return false; }
    COUNT_AMOUNT_COEFF[this.variable['COLOR']] += 0.05;
}
var BrokeBoundaryEnd = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    this.variable['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];

    disbalePanelControl( false );

    $('#clipboard').attr("data-clipboard-text", "null");
    $("#dragContainment").attr("td", 6).attr("tr", 5);
    resetHistory();
    resetBase();
    initialTable();
    for(var i = 0; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j++){
            id = (i+3)*TD_NUM+j;
            if( id < INITIAL_PANEL.length && INITIAL_PANEL[id] ){
                var item = INITIAL_PANEL[id];
                if( item ){
                    $("#dragContainment tr td").eq(i*TD_NUM+j).append( newElementByItem(item) );
                }
            }
        }
    }
    window.scrollTo(0, $("#timeLifeIcon").offset().top-3*HEIGHT);
}
//==============================================================
var OverBeautyStart = function( place, i ){
    this.variable['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };

    disbalePanelControl( true );
    setStartRunByPlayTypeAndTime( PLAY_TYPE_ENUM.FREE, 10 );
    resetHistory();
    resetBase();
}
var OverBeautyAttack = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    COUNT_FACTOR['OverBeautyAttack'] = {
        factor    : function( member, member_place ){ 
            var num = countComboElementsFirstWave();
            return 1 + num*0.03;
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}
var OverBeautyEnd = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    this.variable['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];

    disbalePanelControl( false );
    setPlayType( PLAY_TYPE_ENUM.DRAG );
}
//==============================================================
var DrunkenFootworkStart = function( place, i ){
    this.variable['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };

    disbalePanelControl( true );
    setStartRunByPlayTypeAndTime( PLAY_TYPE_ENUM.FREE, 15 );
    resetHistory();
    resetBase();
}
var DrunkenFootworkAttack = function( place, i ){
    if( !this.variable['USING'] ){ return false; }

    COUNT_FACTOR['DrunkenFootworkAttack'] = {
        factor    : function( member, member_place ){
            if( countComboElementsFirstWave() == TR_NUM*TD_NUM ){ return 2.4; }
            return 1.5;
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}
var DrunkenFootworkEnd = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    this.variable['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];

    disbalePanelControl( false );
    setPlayType( PLAY_TYPE_ENUM.DRAG );
}

//==============================================================
// Transfer function
//==============================================================

var RuneStrengthenCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorWithoutStrong( this.variable['COLOR'] );
}
var RuneStrengthenTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( this.variable['COLOR'] );
    for(var id of stack){
        turnElementToStrongByID(id);
    }
}
//==============================================================
var OffensiveStanceCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColor( 'h' );
}
var OffensiveStanceTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( 'h' );
    for(var id of stack){
        turnElementToColorByID(id, this.variable['COLOR']);
    }
}
var AttackReinforcementTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( 'h' );
    for(var id of stack){
        turnElementToColorByID(id, this.variable['COLOR']+"+" );
    }
    var stack = getStackOfStraight(place);
    for(var id of stack){
        turnElementToColorByID(id, this.variable['COLOR']);
    }
}
//==============================================================
var DeffensiveStanceCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColor( COLOR_EXCLUSIVE[ this.variable['COLOR'] ] );
}
var DeffensiveStanceTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( COLOR_EXCLUSIVE[ this.variable['COLOR'] ] );
    for(var id of stack){
        turnElementToColorByID(id, 'h');
    }
}
var DeffensiveStanceEXTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( COLOR_EXCLUSIVE[ this.variable['COLOR'] ] );
    for(var id of stack){
        turnElementToColorByID(id, 'h+');
    }
}
//==============================================================
var CommandOfLordCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorArr( [ 'h', COLOR_EXCLUSIVE[ this.variable['COLOR'] ] ] );
}
var CommandOfLordTransfer = function( place, i ){
    var stack = getStackOfPanelByColorArr( [ 'h', COLOR_EXCLUSIVE[ this.variable['COLOR'] ] ] );
    for(var id of stack){
        turnElementToColorByID(id, this.variable['COLOR']);
    }
}
//==============================================================
var EnsiformBreathCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorArrWithoutStrong( ['l', 'd'] );
}
var EnsiformBreathTransfer = function( place, i ){
    var stack = getStackOfPanelByColorArr( ['l', 'd'] );
    for(var id of stack){
        turnElementToStrongByID(id);
    }
}
//==============================================================
var NoxiousReplacementHeartTransfer = function( place, i ){
    var probs = { 'h': 0.3, 'w': 0.44, 'f': 0.58, 'p': 0.72, 'l': 0.86, 'd': 1.0 };
    var color = 'h';
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var rand = randomBySeed();
        for( var c in probs ){
            if( rand <= probs[c] ){
                color = c;
                break;
            }
        }
        turnElementToColorByID(i, color);
    }
}
//==============================================================
var SpellOfTornadosTransfer = function( place, i ){
    var stack = [ 'w','w','w','w','w','w','w','w',
                  'f','f','f','f','f','f','f','f',
                  'p','p','p','p','p','p','p','p',
                  'h','h','h','h','h','h' ];
    stack = makeArrayShuffle(stack);
    $.each(stack, function(id, color){
        turnElementToColorByID(id, color);
    });
}
var SpellOfBloodSpiritsCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorArr( ['l', 'd'] );
}
var SpellOfBloodSpiritsTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( 'l' );
    for(var id of stack){
        turnElementToColorByID(id, 'f');
    }
    stack = getStackOfPanelByColor( 'd' );
    for(var id of stack){
        turnElementToColorByID(id, 'h');
    }
}
var SpellOfBloodSpiritsEXTransfer = function( place, i ){
    if( checkHasElementByColorArr( ['l', 'd'] ) ){
        var stack = getStackOfPanelByColor( 'l' );
        for(var id of stack){
            turnElementToColorByID(id, 'f');
        }
        stack = getStackOfPanelByColor( 'd' );
        for(var id of stack){
            turnElementToColorByID(id, 'h');
        }
    }else{
        var effect = NewAdditionalEffect( this.id );
        effect['variable'] = effect['preSet']( place, i, this.variable );
        additionalEffectAdd( effect );
    }
}
//==============================================================
var SongOfEmpathyEvilTransfer = function( place, i ){
    var stack = [ 'd','d','h','h','d','d',
                  'd','h','d','d','h','d',
                  'h','h','d','d','h','h',
                  'd','h','d','d','h','d',
                  'd','d','h','h','d','d' ];
    $.each(stack, function(id, color){
        turnElementToColorByID(id, color);
    });
}
var WaterFairyTransfer = function( place, i ){
    var stack = getStackOfStraight(0);
    for(var id of stack){
        turnElementToColorByID(id, 'h');
    }
    stack = getStackOfHorizontal( TR_NUM-1 );
    for(var id of stack){
        turnElementToColorByID(id, 'w');
    }
}
var MasteryOfElementsTransfer = function( place, i ){
    var colors = [  'w', 'w', 'w', 'w',
                    'f', 'f', 'f', 'f',
                    'p', 'p', 'p', 'p',
                    'l', 'l', 'l', 'l',
                    'd', 'd', 'd', 'd' ];
    colors = makeArrayShuffle(colors);
    var randoms = selectMultiRandomItemFromArrBySeed( getAllPanelStack(), 20 )
    $.each(colors, function(i, color){
        id = randoms[i];
        turnElementToColorByID(id, color);
    });
}
//==============================================================
var FloralCornerTransfer = function( place, i ){
    var corners = selectMultiRandomItemFromArrBySeed( getAllCornersStack(), 2 )
    for(var corner of corners){
        for(var id of corner){
            turnElementToColorByID(id, this.variable['COLOR']);
        }
    }
}

//==============================================================
var TransformationCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorArr( getOtherColorsFromColorArr( this.variable['COLOR'] ) );
}
var TransformationH_Check = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        getStackOfPanelByColorArr( getOtherColorsFromColorArr('h') ).length >= this.variable['COUNT'];
}
var TransformationSetting = function( member, place, i ){
    var variable = basicActiveSetting( member, place, i, this );
    variable['COUNT'] = 0;
    return variable;
}
var TransformationTransfer = function( place, i ){
    if( this.variable['COUNT'] == 0 ){ return false; }
    var otherColors = getOtherColorsFromColorArr(
        [ 'h', COLOR_EXCLUSIVE[ this.variable['COLOR'] ], this.variable['COLOR'] ]
    );
    turnRandomElementToColorByConfig( {
        color          : this.variable['COLOR'],
        num            : this.variable['COUNT']+1,
        priorityColors : [ ['h'], [ COLOR_EXCLUSIVE[this.variable['COLOR']] ], otherColors, [this.variable['COLOR']] ],
    } );
    this.variable['COUNT'] = 0;
}
var TransformationPlusTransfer = function( place, i ){
    if( this.variable['COUNT'] == 0 ){ return false; }
    var color = (this.variable['COUNT'] == 7) ? this.variable['COLOR']+'+' : this.variable['COLOR'];
    var otherColors = getOtherColorsFromColorArr(
        [ 'h', COLOR_EXCLUSIVE[ this.variable['COLOR'] ], this.variable['COLOR'] ]
    );
    turnRandomElementToColorByConfig( {
        color          : color,
        num            : this.variable['COUNT']+1,
        priorityColors : [ ['h'], [ COLOR_EXCLUSIVE[this.variable['COLOR']] ], otherColors, [this.variable['COLOR']] ],
    } );
    this.variable['COUNT'] = 0;
}
var TransformationH_Transfer = function( place, i ){
    if( this.variable['COUNT'] == 0 ){ return false; }

    turnRandomElementToColorByProb( {
        color      : 'h',
        num        : this.variable['COUNT'],
        probColors : {
            'w': 5/18, 'f': 10/18, 'p': 15/18, 'l': 11/12, 'd': 12/12
        },
    } );
    this.variable['COUNT'] = 0;
}
var TransformationEnd = function( place, i ){
    if( COMBO_STACK.length > 0 ){
        this.variable['COUNT'] = Math.min( 7, this.variable['COUNT']+1 );    
    }
}
var TransfigurationEnd = function( place, i ){
    if( COMBO_STACK.length > 0 ){
        this.variable['COUNT'] = Math.min( 5, this.variable['COUNT']+1 );    
    }
}

//==============================================================
// Member Switch function
//==============================================================
var BasicSwitchCheck = function( place, i ){
    if( basicActiveCheck( this.variable, place, i ) && !( this.id in USING_ACTIVE_SKILL_STACK ) ){
        return true;
    }else if( this.id in USING_ACTIVE_SKILL_STACK ){
        var using = USING_ACTIVE_SKILL_STACK[this.id];
        triggerActiveByKey( using['PLACE'], using['i'], "turnOff" );
    }
    return false;
}

var DragonCentralizationDEXSetting = function( member, place, i ){
    var variable = basicActiveSetting( member, place, i, this );
    variable['USING'] = false;
    variable['ORIGIN_ATK'] = [];
    return variable;
}
var DragonCentralizationDEXStart = function( place, i ){
    var VAR = this.variable;

    if( !VAR['USING'] ){
        VAR['USING'] = true;
        USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };

        var total_attack = 0;
        $.each(TEAM_MEMBERS, function(other_place, member){
            if( member['type'] == VAR['TYPE'] ){
                var origin_atk = { PLACE: other_place, ATK: member['attack'] };
                VAR['ORIGIN_ATK'].push(origin_atk);
                if( place != other_place ){
                    total_attack += member['attack'];
                    member['attack'] = 0;
                }
            }
        });
        TEAM_MEMBERS[place]['attack'] += Math.round( total_attack * 1.5 );
    }else{
        triggerActiveByKey( place, i, 'close' );
    }
}
var DragonCentralizationDEXClose = function( place, i ){
    if( !this.variable['USING'] ){ return false; }    
    this.variable['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];

    $.each(this.variable['ORIGIN_ATK'], function(i, origin_atk){
        TEAM_MEMBERS[origin_atk['PLACE']]['attack'] = origin_atk['ATK'];
    });
    this.variable['ORIGIN_ATK'] = [];
}

//==============================================================
// Member Using function
//==============================================================
var BasicUsingSetting = function( member, place, i ){
    var variable = basicActiveSetting( member, place, i, this );
    variable['USING'] = false;
    return variable;
}
var BasicUsingCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) && !( this.id in USING_ACTIVE_SKILL_STACK );
}
var BasicUsingStart = function( place, i ){
    if( this.variable['USING'] ){ return false; }
    this.variable['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };
}

var TraceOfNotionUpdate = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    if( checkComboColorFirstMaxAmountByConfig({
            ID    : [ this.variable['COLOR'] ],
            check : [ '{0}<5' ],
        }) ){
        triggerActiveByKey( place, i, 'close' );
    }
}
var TraceOfNotionClose = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    this.variable['USING'] = false;
    this.variable['COUNT'] = 0;
    this.variable['FACTOR'] = 1.2;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];
}
var TraceOfNotionAttack = function( place, i ){
    if( !this.variable['USING'] ){ return false; }

    var max = 0;
    var num = 0;
    for(var combo of COMBO_STACK){
        if(combo['color'] == this.variable['COLOR']){
            max = Math.max( max, combo['amount'] );
            num += combo['amount'];
        }
    }
    if( num > 0 ){
        num += this.variable['COUNT'];
        this.variable['FACTOR'] = Math.min( 2.2, this.variable['FACTOR']+0.2+( Math.floor(num/20) )*0.2 );
        this.variable['COUNT'] = num%20;
    }

    COUNT_COLOR_FACTOR[ this.variable['COLOR'] ] *= this.variable['FACTOR'];
}
var TraceOfNotionSetting = function( member, place, i ){
    var variable = basicActiveSetting( member, place, i, this );
    variable['USING'] = false;
    variable['COUNT'] = 0;
    variable['FACTOR'] = 1.2;
    return variable;
}

// @@@@@@@@@@@@@@@@@@@@@@@@@
// Creature
var RuneStrongSwitchCheck = function( member, place, i ){
    console.log(basicActiveCheck( this.variable, place, i ));
    console.log(!( this.id in USING_ACTIVE_SKILL_STACK ));
    console.log(!(this.variable['COLOR'] in COLOR_MAP) );
    console.log(!('h' in COLOR_MAP));
    return basicActiveCheck( this.variable, place, i ) && 
        !( this.id in USING_ACTIVE_SKILL_STACK ) &&
        !(this.variable['COLOR'] in COLOR_MAP) && !('h' in COLOR_MAP);
}
var RuneStrongSwitchStart = function( place, i ){
    if( this.variable['USING'] ){ return false; }
    this.variable['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };
    COLOR_MAP[ this.variable['COLOR'] ] = this.variable['COLOR']+"+";
    COLOR_MAP[ 'h' ] = "h+";
}
var RuneStrongSwitchClose = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    this.variable['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];
    delete COLOR_MAP[ this.variable['COLOR'] ];
    delete COLOR_MAP[ 'h' ];
}
var RuneStrongSwitchAttack = function( place, i ){
    if( !this.variable['USING'] ){ return false; }    
    COUNT_STRONG_COEFF[ this.variable['COLOR'] ] += 0.25;
}
// @@@@@@@@@@@@@@@@@@@@@@@@@

//==============================================================
// Attack Effect function
//==============================================================
var AddtionalEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) && basicActiveCheck( this.variable, place, i );
}
function basicAdditionalEffectCheck( effectID ){
    var checkEffect = true;
    $.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
        if( effect['id'] == effectID ){
            checkEffect = false;
            return false;
        }
    });
    return checkEffect;
}
function basicAdditionalEffectCheckByTag( effectTag ){
    var checkEffect = true;
    $.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
        if( effect['tag'].indexOf( effectTag ) >= 0 ){
            checkEffect = false;
            return false;
        }
    });
    return checkEffect;
}
//==============================================================
var InjureReduceAdditionalEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "injureReduce" ) &&
        basicActiveCheck( this.variable, place, i );
}
var DefenceReduceAdditionalEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "defenceReduce" ) &&
        basicActiveCheck( this.variable, place, i );
}
var NewItemAdditionalEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "newItem" ) &&
        basicActiveCheck( this.variable, place, i );
}
var BelongColorAdditionalEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "belongColor" ) &&
        basicActiveCheck( this.variable, place, i );
}
var DamageRecoverAdditionalEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "damageRecover" ) &&
        basicActiveCheck( this.variable, place, i );
}
var HealthAdditionalEffecCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) && 
        basicActiveCheck( this.variable, place, i ) &&
        HEALTH_POINT > 1;
}

var BasicAddtionalEffectAdd = function( place, i ){
    var effect = NewAdditionalEffect( this.id );
    effect['variable'] = effect['preSet']( this.variable );

    additionalEffectAdd( effect );
}

//==============================================================
// Enemy Effect function
//==============================================================
var BasicEnemyEffectCheck = function( place, i ){
    return basicEnemyEffectCheck( this.id ) && basicActiveCheck( this.variable, place, i );
}
function basicEnemyEffectCheck( effectID ){
    var checkEffect = true;
    $.each(ENEMY, function(e, enemy){
        $.each(enemy['variable']['EFFECT'], function(i, effect){
            if( effect['id'] == effectID ){
                checkEffect = false;
                return false;
            }
        });
    });
    return checkEffect;
}
function basicEnemyEffectCheckByTag( effectTag ){
    var checkEffect = true;
    $.each(ENEMY, function(e, enemy){
        $.each(enemy['variable']['EFFECT'], function(i, effect){
            if( effect['tag'].indexOf( effectTag ) >= 0 ){
                checkEffect = false;
                return false;
            }
        });
    });
    return checkEffect;
}
//==============================================================
var BattleFieldCheck = function( place, i ){
    return basicEnemyEffectCheck( this.id ) &&
        basicEnemyEffectCheckByTag( 'changeColor' ) &&
        basicActiveCheck( this.variable, place, i );
}
var BlazingCircleCheck = function( place, i ){
    return basicEnemyEffectCheck( this.id ) &&
        basicEnemyEffectCheckByTag( 'changeColor' ) &&
        basicEnemyEffectCheckByTag( 'addCoolDown' ) &&
        basicActiveCheck( this.variable, place, i );
}

var BasicEnemyEffectAdd = function( place, i ){
    var effectID = this.id;

    $.each(ENEMY, function(e, enemy){
        var effect = NewEnemyEffect( effectID );
        effect['variable'] = effect['preSet']( this.variable, enemy );
        enemy['variable']['EFFECT'].push( effect );
    });
}

//==============================================================
// Launch function
//==============================================================
var ThunderStrikeEXLaunch = function( place, i ){
    var attack = makeNewAttack();
    attack['base']   = 15000;
    attack['color']  = 'l';
    attack['factor'] = 1;
    attack['goal']   = 'all';
    attack['style']  = 'directDamage';
    attack['log']    = 'ThunderStrikeEX';
    makeDirectAttack(attack);
}
var DarknessAssaultEXLaunch = function( place, i ){
    var attack = makeNewAttack();
    attack['base']   = 15000;
    attack['color']  = 'd';
    attack['factor'] = 1;
    attack['goal']   = 'all';
    attack['style']  = 'directDamage';
    attack['log']    = 'DarknessAssaultEX';
    makeDirectAttack(attack);
}
var RevivalOfSpiritLaunch = function( place, i ){
    var base = 0;
    $.each(TEAM_MEMBERS, function(place, member){
        if( member['type'] == 'DRAGON' ){
            base += member['health'];
        }
    });
    var recover = makeNewRecover();
    recover['base']  = base;
    recover['factor']= 1.5;
    recover['style'] = "active";
    recover['log']   = "RevivalOfSpiritLaunch";
    makeDirectRecovery( recover );
}

//==============================================================
//==============================================================
// Active Skill Database
//==============================================================
//==============================================================

var ACTIVE_SKILLS_DATA = {
	NONE : {
		id        : 'NONE',
		label     : '無技能',
		info      : '',
        coolDown  : 0,
        check     : BasicActiveCheck,
        preSet    : BasicActiveSetting,
	},
    BREAK_BOUNDARY_W : {
        id        : 'BREAK_BOUNDARY_W',
        label     : '界線突破 ‧ 水',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升水屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_F : {
        id        : 'BREAK_BOUNDARY_F',
        label     : '界線突破 ‧ 火',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升火屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_P : {
        id        : 'BREAK_BOUNDARY_P',
        label     : '界線突破 ‧ 木',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升木屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_L : {
        id        : 'BREAK_BOUNDARY_L',
        label     : '界線突破 ‧ 光',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升光屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_D : {
        id        : 'BREAK_BOUNDARY_D',
        label     : '界線突破 ‧ 暗',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升暗屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    RUNE_STRENGTHEN_W : {
        id        : 'RUNE_STRENGTHEN_W',
        label     : '符石強化 ‧ 水',
        info      : '水符石轉化為水強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    RUNE_STRENGTHEN_F : {
        id        : 'RUNE_STRENGTHEN_F',
        label     : '符石強化 ‧ 火',
        info      : '火符石轉化為火強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    RUNE_STRENGTHEN_P : {
        id        : 'RUNE_STRENGTHEN_P',
        label     : '符石強化 ‧ 木',
        info      : '木符石轉化為木強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    RUNE_STRENGTHEN_L : {
        id        : 'RUNE_STRENGTHEN_L',
        label     : '符石強化 ‧ 光',
        info      : '光符石轉化為光強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    RUNE_STRENGTHEN_D : {
        id        : 'RUNE_STRENGTHEN_D',
        label     : '符石強化 ‧ 暗',
        info      : '暗符石轉化為暗強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    DESPERATE_ATTACK : {
        id        : 'DESPERATE_ATTACK',
        label     : '拚死一擊',
        info      : '1 回合內，自身生命力愈低，全隊攻擊力愈高，最大 3 倍',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    COMMAND_OF_LORDS : {
        id        : 'COMMAND_OF_LORDS',
        label     : '聖神大號令',
        info      : '暗符石與心符石轉化為光符石',
        coolDown  : 10,
        check     : CommandOfLordCheck,
        transfer  : CommandOfLordTransfer,
        preSet    : BasicActiveSetting,
    },
    COMMAND_OF_DEVILS : {
        id        : 'COMMAND_OF_DEVILS',
        label     : '邪魔大號令',
        info      : '光符石與心符石轉化為暗符石',
        coolDown  : 10,
        check     : CommandOfLordCheck,
        transfer  : CommandOfLordTransfer,
        preSet    : BasicActiveSetting,
    },
    POSS_LIGHT_SPIRIT : {
        id        : 'POSS_LIGHT_SPIRIT',
        label     : '光魂附暗',
        info      : '1 回合內，暗符石兼具光符石效果',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : BelongColorAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    POSS_DARK_SPIRIT : {
        id        : 'POSS_DARK_SPIRIT',
        label     : '暗魂附光',
        info      : '1 回合內，光符石兼具暗符石效果',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : BelongColorAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    OVER_BEAUTY   : {
        id        : 'OVER_BEAUTY',
        label     : '回眸傾城',
        info      : '10 秒內，可任意移動符石而不會發動消除；消除的符石數目愈多，攻擊力提升愈多，最大 1.9 倍 (只計算首批消除的符石數目)',
        coolDown  : 8,
        attack    : OverBeautyAttack,
        check     : BasicActiveCheck,
        end       : OverBeautyEnd,
        preSet    : StartRunSetting,
        startRun  : OverBeautyStart,
    },
    TRACE_OF_NOTION_W : {
        id        : 'TRACE_OF_NOTION_W',
        label     : '印記之念 ‧ 水',
        info      : '水屬性傷害持續提升，直至沒有消除一組 5 粒或以上的水屬性符石 (只計算首批消除的符石)。每累計消除 20 粒水符石，水屬性傷害加快提升。水屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : BasicUsingCheck,
        close     : TraceOfNotionClose,
        preSet    : TraceOfNotionSetting,
        start     : BasicUsingStart,
        update    : TraceOfNotionUpdate,
    },
    TRACE_OF_NOTION_F : {
        id        : 'TRACE_OF_NOTION_F',
        label     : '印記之念 ‧ 火',
        info      : '火屬性傷害持續提升，直至沒有消除一組 5 粒或以上的火屬性符石 (只計算首批消除的符石)。每累計消除 20 粒火符石，火屬性傷害加快提升。火屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : BasicUsingCheck,
        close     : TraceOfNotionClose,
        preSet    : TraceOfNotionSetting,
        start     : BasicUsingStart,
        update    : TraceOfNotionUpdate,
    },
    TRACE_OF_NOTION_P : {
        id        : 'TRACE_OF_NOTION_P',
        label     : '印記之念 ‧ 木',
        info      : '木屬性傷害持續提升，直至沒有消除一組 5 粒或以上的木屬性符石 (只計算首批消除的符石)。每累計消除 20 粒木符石，木屬性傷害加快提升。木屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : BasicUsingCheck,
        close     : TraceOfNotionClose,
        preSet    : TraceOfNotionSetting,
        start     : BasicUsingStart,
        update    : TraceOfNotionUpdate,
    },
    TRACE_OF_NOTION_L : {
        id        : 'TRACE_OF_NOTION_L',
        label     : '印記之念 ‧ 光',
        info      : '光屬性傷害持續提升，直至沒有消除一組 5 粒或以上的光屬性符石 (只計算首批消除的符石)。每累計消除 20 粒光符石，光屬性傷害加快提升。光屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : BasicUsingCheck,
        close     : TraceOfNotionClose,
        preSet    : TraceOfNotionSetting,
        start     : BasicUsingStart,
        update    : TraceOfNotionUpdate,
    },
    TRACE_OF_NOTION_D : {
        id        : 'TRACE_OF_NOTION_D',
        label     : '印記之念 ‧ 暗',
        info      : '暗屬性傷害持續提升，直至沒有消除一組 5 粒或以上的暗屬性符石 (只計算首批消除的符石)。每累計消除 20 粒暗符石，暗屬性傷害加快提升。暗屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : BasicUsingCheck,
        close     : TraceOfNotionClose,
        preSet    : TraceOfNotionSetting,
        start     : BasicUsingStart,
        update    : TraceOfNotionUpdate,
    },
    BIBBLE_BURST : {
        id        : 'BIBBLE_BURST',
        label     : '泡沫爆破',
        info      : '累積 3 回合內敵方所受傷害的 70% 再爆發，此傷害無視屬性及防禦力',
        coolDown  : 10,
        addEffect : BasicEnemyEffectAdd,
        check     : BasicEnemyEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BIBBLE_BURST_EX : {
        id        : 'BIBBLE_BURST_EX',
        label     : '爆裂之幻沫',
        info      : '累積 2 回合內敵方所受傷害的 110% 再爆發，此傷害無視屬性及防禦力',
        coolDown  : 10,
        addEffect : BasicEnemyEffectAdd,
        check     : BasicEnemyEffectCheck,
        preSet    : BasicActiveSetting,
    },
    IGNITION : {
        id        : 'IGNITION',
        label     : '點燃',
        info      : '敵方全體點燃，使受影響目標轉為火屬性並受到自身攻擊力 30 倍火屬性傷害，持續 3 回合',
        coolDown  : 8,
        addEffect : BasicEnemyEffectAdd,
        check     : BasicEnemyEffectCheck,
        preSet    : BasicActiveSetting,
    },
    HARVEST_OF_LIFE : {
        id        : 'HARVEST_OF_LIFE',
        label     : '生命採摘',
        info      : '3 回合內，敵方所受傷害的 20% 轉化為我方生命力',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : DamageRecoverAdditionalEffectCheck,
        preSet    : BasicActiveSetting,        
    },
    HARVEST_OF_LIFE_EX : {
        id        : 'HARVEST_OF_LIFE_EX',
        label     : '生靈採捕',
        info      : '3 回合內，敵方所受傷害的 50% 轉化為我方生命力',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : DamageRecoverAdditionalEffectCheck,
        preSet    : BasicActiveSetting,        
    },
    PREVASION : {
        id        : 'PREVASION',
        label     : '傳播',
        info      : '5 回合內，敵方所受傷害的 50% 分別擴散到其他敵人身上',
        coolDown  : 10,
        addEffect : BasicEnemyEffectAdd,
        check     : BasicEnemyEffectCheck,
        preSet    : BasicActiveSetting,
    },
    PREVASION_EX : {
        id        : 'PREVASION_EX',
        label     : '傳播',
        info      : '5 回合內，敵方所受傷害的 50% 分別擴散到其他敵人身上',
        coolDown  : 10,
        addEffect : BasicEnemyEffectAdd,
        check     : BasicEnemyEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BEWITCHMENT : {
        id        : 'BEWITCHMENT',
        label     : '魅惑',
        info      : '3 回合內，敵方互相或自我進行1次攻擊',
        coolDown  : 15,
        addEffect : BasicEnemyEffectAdd,
        check     : BasicEnemyEffectCheck,
        preSet    : BasicActiveSetting,  
    },
    NOXIOUS_REPLACEMENT_HEART : {
        id        : 'NOXIOUS_REPLACEMENT_HEART',
        label     : '搶天奪日 ‧ 心',
        info      : '所有符石隨機轉換，同時心符石出現率上升，並將心符石以心強化符石代替',
        coolDown  : 8,
        check     : BasicActiveCheck,
        preSet    : BasicActiveSetting,
        transfer  : NoxiousReplacementHeartTransfer,
    },
    PLUNDER_OF_LIFE : {
        id        : 'PLUNDER_OF_LIFE',
        label     : '生命吸取',
        info      : '2 回合內，敵方所受傷害的 20% 轉化為我方生命力',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : DamageRecoverAdditionalEffectCheck,
        preSet    : BasicActiveSetting,  
    },
    OFFENSIVE_STANCE_W : {
        id        : 'OFFENSIVE_STANCE_W',
        label     : '攻擊姿勢 ‧ 水',
        info      : '心符石轉化為水符石',
        coolDown  : 5,
        check     : OffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : OffensiveStanceTransfer,
    },
    OFFENSIVE_STANCE_F : {
        id        : 'OFFENSIVE_STANCE_F',
        label     : '攻擊姿勢 ‧ 火',
        info      : '心符石轉化為火符石',
        coolDown  : 5,
        check     : OffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : OffensiveStanceTransfer,
    },
    OFFENSIVE_STANCE_P : {
        id        : 'OFFENSIVE_STANCE_P',
        label     : '攻擊姿勢 ‧ 木',
        info      : '心符石轉化為木符石',
        coolDown  : 5,
        check     : OffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : OffensiveStanceTransfer,
    },
    OFFENSIVE_STANCE_L : {
        id        : 'OFFENSIVE_STANCE_L',
        label     : '攻擊姿勢 ‧ 光',
        info      : '心符石轉化為光符石',
        coolDown  : 5,
        check     : OffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : OffensiveStanceTransfer,
    },
    OFFENSIVE_STANCE_D : {
        id        : 'OFFENSIVE_STANCE_D',
        label     : '攻擊姿勢 ‧ 暗',
        info      : '心符石轉化為暗符石',
        coolDown  : 5,
        check     : OffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : OffensiveStanceTransfer,
    },
    ATTACK_REINFORCEMENT_F : {
        id        : 'ATTACK_REINFORCEMENT_F',
        label     : '攻勢強化 ‧ 火',
        info      : '心符石轉化為火強化符石，並將自身所在隊伍欄直行的符石轉化為火符石',
        coolDown  : 5,
        check     : OffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : AttackReinforcementTransfer,
    },
    ATTACK_REINFORCEMENT_L : {
        id        : 'ATTACK_REINFORCEMENT_L',
        label     : '攻勢強化 ‧ 光',
        info      : '心符石轉化為光強化符石，並將自身所在隊伍欄直行的符石轉化為光符石',
        coolDown  : 5,
        check     : OffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : AttackReinforcementTransfer,
    },
    DEFENSIVE_STANCE_W : {
        id        : 'DEFENSIVE_STANCE_W',
        label     : '防禦姿勢 ‧ 水',
        info      : '火符石轉化為心符石',
        coolDown  : 5,
        check     : DeffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : DeffensiveStanceTransfer,
    },
    DEFENSIVE_STANCE_F : {
        id        : 'DEFENSIVE_STANCE_F',
        label     : '防禦姿勢 ‧ 火',
        info      : '木符石轉化為心符石',
        coolDown  : 5,
        check     : DeffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : DeffensiveStanceTransfer,
    },
    DEFENSIVE_STANCE_P : {
        id        : 'DEFENSIVE_STANCE_P',
        label     : '防禦姿勢 ‧ 木',
        info      : '水符石轉化為心符石',
        coolDown  : 5,
        check     : DeffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : DeffensiveStanceTransfer,
    },
    DEFENSIVE_STANCE_L : {
        id        : 'DEFENSIVE_STANCE_L',
        label     : '防禦姿勢 ‧ 光',
        info      : '暗符石轉化為心符石',
        coolDown  : 5,
        check     : DeffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : DeffensiveStanceTransfer,
    },
    DEFENSIVE_STANCE_D : {
        id        : 'DEFENSIVE_STANCE_D',
        label     : '防禦姿勢 ‧ 暗',
        info      : '光符石轉化為心符石',
        coolDown  : 5,
        check     : DeffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : DeffensiveStanceTransfer,
    },
    DEFENSIVE_STANCE_EX_F : {
        id        : 'DEFENSIVE_STANCE_EX_F',
        label     : '鐵壁陣勢 ‧ 火',
        info      : '木符石轉化為心強化符石',
        coolDown  : 5,
        check     : DeffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : DeffensiveStanceEXTransfer,
    },
    TRANSFORMATION_W : {
        id        : 'TRANSFORMATION_W',
    },
    TRANSFIGURATION_H : {
        id        : 'TRANSFIGURATION_H', 
        label     : '蓄能傳承 ‧ 心',
        info      : '將與累積戰鬥回合數同等數量的符石轉為心符石，最多 7 粒。發動技能後會將累積戰鬥回合數重置',
        coolDown  : 1,
        check     : TransformationCheck,
        preSet    : TransformationSetting,
        transfer  : TransformationH_Transfer,
        end       : TransformationEnd,
    },
    THUNDER_STRIKE_EX : {
        id        : 'THUNDER_STRIKE_EX',
        label     : '雷光電擊',
        info      : '對全體敵人造成 15,000 點光屬性傷害，此傷害無視防禦力隊長技 名稱  真龍之脈',
        coolDown  : 10,
        check     : BasicActiveCheck,
        launch    : ThunderStrikeEXLaunch,
        preSet    : BasicActiveSetting,
    },
    DARKNESS_ASSAULT_EX : {
        id        : 'DARKNESS_ASSAULT_EX',
        label     : '黑洞瞬擊',
        info      : '對全體敵人造成 15,000 點暗屬性傷害，此傷害無視防禦力',
        coolDown  : 10,
        check     : BasicActiveCheck,
        launch    : DarknessAssaultEXLaunch,
        preSet    : BasicActiveSetting,
    },
    DRAGON_SHIELD : {
        id        : 'DRAGON_SHIELD',
        label     : '群龍壓迫',
        info      : '1 回合內，所受傷害將會以龍類的數量而減少',
        coolDown  : 5,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    DRAGON_RESONANCE : {
        id        : 'DRAGON_RESONANCE',
        label     : '龍魂共鳴',
        info      : '2 回合內，以龍類其中造成的最大傷害轉換為全隊龍類的傷害',
        coolDown  : 8,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    DRAGON_CENTRALIZATION_D_EX : {
        id        : 'DRAGON_CENTRALIZATION_D_EX',
        label     : '龍力招來 ‧ 幽冥',
        info      : '龍類攻擊力減至 0，並將龍類攻擊力的 1.5 倍加入自身攻擊力，消除暗符石才會發動攻擊 (效果會在再次發動此技能或死亡後消失)',
        coolDown  : 8,
        check     : BasicSwitchCheck,
        close     : DragonCentralizationDEXClose,
        preSet    : DragonCentralizationDEXSetting,
        start     : DragonCentralizationDEXStart,
    },
    COURAGE_OF_SACRIFICE : {
        id        : 'COURAGE_OF_SACRIFICE',
        label     : '捨生力敵',
        info      : '消秏現有 75% 生命力；1 回合內，木屬性或龍類攻擊力 2.5 倍',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : HealthAdditionalEffecCheck,
        preSet    : BasicActiveSetting,
    },
    REVIVAL_OF_SPIRIT_DRAGON : {
        id        : 'REVIVAL_OF_SPIRIT_DRAGON',
        label     : '靈之復甦 ‧ 龍',
        info      : '回復相當於龍類成員 1.5 倍的生命力',
        coolDown  : 10,
        check     : BasicActiveCheck,
        launch    : RevivalOfSpiritLaunch,
        preSet    : BasicActiveSetting,
    },
    BATTLEFIELD_P : {
        id        : 'BATTLEFIELD_P',
        label     : '枯朽的戰場',
        info      : '2 回合內，敵方全體轉為水屬性，並提升木屬性對水屬性目標的攻擊力',
        coolDown  : 12,
        addEffect : BasicEnemyEffectAdd,
        check     : BattleFieldCheck,
        preSet    : BasicActiveSetting,
    },
    FIGHT_SAFE : {
        id        : 'FIGHT_SAFE',
        label     : '攻守自如',
        info      : '1 回合內，達成 4 連擊 (Combo) 或以下，回復 20,000 點生命力；反之，所有成員攻擊力 2 倍。連擊 (Combo) 只計算首批消除的符石',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    PLAY_SAFE : {
        id        : 'PLAY_SAFE',
        label     : '進退自如',
        info      : '1 回合內，達成 4 連擊 (Combo) 或以下，所受傷害減少 80%；反之，所有成員攻擊力 2 倍。連擊 (Combo) 只計算首批消除的符石',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : InjureReduceAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    PLAY_WILD : {
        id        : 'PLAY_WILD',
        label     : '攻勢如虹',
        info      : '1 回合內，達成 4 連擊 (Combo) 或以下時，敵方全體防禦力變 0；反之，所有成員攻擊力 2 倍。連擊 (Combo) 只計算首批消除的符石',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : DefenceReduceAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    HUNTING_MODE : {
        id        : 'HUNTING_MODE',
        label     : '狩獵之勢',
        info      : '2 回合內，自身攻擊力 3 倍。若身旁的成員同為獸類，同得此效果',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLAZING_CIRCLE : {
        id        : 'BLAZING_CIRCLE',
        label     : '燄之結界',
        info      : '敵方全體點燃，使受影響目標無法行動並轉為火屬性，持續 3 回合',
        coolDown  : 15,
        addEffect : BasicEnemyEffectAdd,
        check     : BlazingCircleCheck,
        preSet    : BasicActiveSetting,
    },
    SAVAGE_ATTACK : {
        id        : 'SAVAGE_ATTACK',
        label     : '窮兇極怒',
        info      : '1 回合內，自身攻擊力 10 倍。(攻擊力不可與其他成員共享)',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_WATER : {
        id        : 'BLADES_OF_WATER',
        label     : '水刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；消除一組 6 粒或以上的水符石，水屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : basicAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_FLAME : {
        id        : 'BLADES_OF_FLAME',
        label     : '燄刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；消除一組 6 粒或以上的火符石，火屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : basicAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_VINE : {
        id        : 'BLADES_OF_VINE',
        label     : '藤刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；消除一組 6 粒或以上的木符石，木屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : basicAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_LIGHT : {
        id        : 'BLADES_OF_LIGHT',
        label     : '光刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；同時消除心符石、光符石及暗符石，光屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : basicAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_PHANTOM : {
        id        : 'BLADES_OF_PHANTOM',
        label     : '魅刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；同時消除心符石、光符石及暗符石，暗屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : basicAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    ENSIFORM_BREATH : {
        id        : 'ENSIFORM_BREATH',
        label     : '凝氣成劍',
        info      : '光符石轉化為光強化符石，同時將暗符石轉化為暗強化符石',
        coolDown  : 5,
        check     : EnsiformBreathCheck,
        transfer  : EnsiformBreathTransfer,
        preSet    : BasicActiveSetting,
    },
    SPELL_OF_TORNADOS : {
        id        : 'SPELL_OF_TORNADOS',
        label     : '旋風咒',
        info      : '將所有符石轉化為固定數量的水、火、木及心符石',
        coolDown  : 12,
        check     : BasicActiveCheck,
        transfer  : SpellOfTornadosTransfer,
        preSet    : BasicActiveSetting,
    },
    SPELL_OF_BLOOD_SPIRITS : {
        id        : 'SPELL_OF_BLOOD_SPIRITS',
        label     : '靈血咒',
        info      : '光符石轉化為火符石，同時暗符石轉化為心符石',
        coolDown  : 6,
        check     : SpellOfBloodSpiritsCheck,
        transfer  : SpellOfBloodSpiritsTransfer,
        preSet    : BasicActiveSetting,
    },
    SPELL_OF_BLOOD_SPIRITS_EX : {
        id        : 'SPELL_OF_BLOOD_SPIRITS_EX',
        label     : '靈血咒 ‧ 強',
        info      : '若場上沒有光及暗符石時，全隊攻擊力 1.5 倍；反之，若場上有光或暗符石時，光符石轉化為火符石，同時暗符石轉化為心符石',
        coolDown  : 6,
        check     : BasicActiveCheck,
        transfer  : SpellOfBloodSpiritsEXTransfer,
        preSet    : BasicActiveSetting,
    },
    DRUNKEN_FOOTWORK : {
        id        : 'DRUNKEN_FOOTWORK',
        label     : '醉仙望月步',
        info      : '15 秒內，可任意移動符石而不會發動消除，若消除當前所有符石，全隊攻擊力 2.4 倍；反之，全隊攻擊力 1.5 倍',
        coolDown  : 15,
        attack    : DrunkenFootworkAttack,
        check     : BasicActiveCheck,
        end       : DrunkenFootworkEnd,
        preSet    : StartRunSetting,
        startRun  : DrunkenFootworkStart,
    },
    SONG_OF_EMPATHY_EVIL :{
        id        : 'SONG_OF_EMPATHY_EVIL',
        label     : '憐憫惡魔之歌',
        info      : '將場上所有符石轉化為固定數量及位置的暗及心符石，並延長移動符石時間 3 秒',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : basicAdditionalEffectCheck,
        transfer  : SongOfEmpathyEvilTransfer,
        preSet    : BasicActiveSetting,
    },
    WATER_FAIRY : {
        id        : 'WATER_FAIRY',
        label     : '水之仙女',
        info      : '將最底一橫行的符石轉化為水符石，並將最左方一直行的 4 粒符石轉化為心符石',
        coolDown  : 5,
        check     : BasicActiveCheck,
        transfer  : WaterFairyTransfer,
        preSet    : BasicActiveSetting,
    },
    ELEMENTAL_ASSEMBLY_W : {
        id        : 'ELEMENTAL_ASSEMBLY_W',
        label     : '元素歸一 ‧ 水',
        info      : '1 回合內，消除符石的種類愈多，水屬性攻擊力提升愈多，最大提升至 2.2 倍',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    ELEMENTAL_ASSEMBLY_F : {
        id        : 'ELEMENTAL_ASSEMBLY_F',
        label     : '元素歸一 ‧ 火',
        info      : '1 回合內，消除符石的種類愈多，火屬性攻擊力提升愈多，最大提升至 2.2 倍',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    ELEMENTAL_ASSEMBLY_P : {
        id        : 'ELEMENTAL_ASSEMBLY_P',
        label     : '元素歸一 ‧ 木',
        info      : '1 回合內，消除符石的種類愈多，木屬性攻擊力提升愈多，最大提升至 2.2 倍',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    MAGIC_STAGE_BEAM : {
        id        : 'MAGIC_STAGE_BEAM',
        label     : '結界術 ‧ 玄光',
        info      : '1 回合內，每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 2 粒光符石',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : NewItemAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    MAGIC_STAGE_GLOOM : {
        id        : 'MAGIC_STAGE_GLOOM',
        label     : '結界術 ‧ 幽冥',
        info      : '1 回合內，每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 2 粒暗符石',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : NewItemAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    MASTERY_OF_ELEMENTS : {
        id        : "MASTERY_OF_ELEMENTS",
        label     : '元素掌控術',
        info      : '隨機將 20 粒符石轉化為固定數量的水、火、木、光及暗符石；1 回合內，所有屬性符石兼具 80% 所有屬性符石效果',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : BelongColorAdditionalEffectCheck,
        transfer  : MasteryOfElementsTransfer,
        preSet    : BasicActiveSetting,
    },
    FLORAL_CORNER_W : {
        id        : 'FLORAL_CORNER_W',
        label     : '隅角花海 ‧ 水',
        info      : '隨機將 2 個角落共 8 粒符石轉化為水符石',
        coolDown  : 5,
        check     : BasicActiveCheck,
        transfer  : FloralCornerTransfer,
        preSet    : BasicActiveSetting,
    },
    FLORAL_CORNER_D : {
        id        : 'FLORAL_CORNER_D',
        label     : '隅角花海 ‧ 暗',
        info      : '隨機將 2 個角落共 8 粒符石轉化為暗符石',
        coolDown  : 5,
        check     : BasicActiveCheck,
        transfer  : FloralCornerTransfer,
        preSet    : BasicActiveSetting,
    },
    TREATY_OF_OLD_GREEK_F : {
        id        : 'TREATY_OF_OLD_GREEK_F',
        label     : '火影約章',
        info      : '1 回合內，消除一組 5 粒或以上的木屬性符石，火屬性攻擊力 1.5 倍',
        coolDown  : 5,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    TREATY_OF_OLD_GREEK_P : {
        id        : 'TREATY_OF_OLD_GREEK_P',
        label     : '木葉約章',
        info      : '1 回合內，消除一組 5 粒或以上的木屬性符石，木屬性攻擊力 1.5 倍',
        coolDown  : 5,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    QUINTUPLE_COHERENCE : {
        id        : 'QUINTUPLE_COHERENCE',
        label     : '五屬同源',
        info      : '1 回合內，所有符石兼具其他屬性符石 30% 效果',
        coolDown  : 6,
        addEffect : BasicAddtionalEffectAdd,
        check     : BelongColorAdditionalEffectCheck,
        preSet    : BasicActiveSetting,
    },

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    RUNE_STRONG_SWITCH : {
        id        : 'TRUNE_STRONG_SWITCH',
        label     : '元素精煉 ‧ 絕',
        info      : '將掉落的心符石和自身屬性符石以強化符石代替，大幅提升強化符石傷害',
        coolDown  : 10,
        attack    : RuneStrongSwitchAttack,
        check     : RuneStrongSwitchCheck,
        close     : RuneStrongSwitchClose,
        preSet    : BasicUsingSetting,
        start     : RuneStrongSwitchStart,
    },
    DESPERATE_PREPARE : {
        id        : 'DESPERATE_PREPARE',
        label     : '絕境逆襲',
        info      : '消耗所有血量至 1，給予敵方全體消耗血量50倍的自身屬性直接傷害，1 回合內，神族攻擊力 2 倍，回合結束後，回復所有生命值。',
        coolDown  : 8,
        addEffect : BasicAddtionalEffectAdd,
        check     : HealthAdditionalEffecCheck,
        preSet    : BasicActiveSetting,
    },
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
};

function NewActiveSkill( id ){
    var activeObj = $.extend(true, {}, ACTIVE_SKILLS_DATA[id]);
    activeObj['variable'] = {};
    return activeObj;
}
function triggerActive(place, i){
    if( TEAM_ACTIVE_SKILL.length <= place || TEAM_ACTIVE_SKILL[place].length <= i ){
        return false;
    }

    if( TEAM_ACTIVE_SKILL[place][i]['check']( place, i ) ){
console.log("check-true");
        triggerActiveByKey( place, i, "startRun" );
        triggerActiveByKey( place, i, "start" );
        triggerActiveByKey( place, i, "transfer" );
        triggerActiveByKey( place, i, "addEffect" );
        triggerActiveByKey( place, i, "launch" );
        resetActiveSkillCoolDown( place, i );

        for(var w = 0; w < 4; w++){
            checkWakeFromOrderByKey( "transfer", place, w );
        }
    }
    showActiveInfomation();
}
function triggerActiveByKey( place, i, key ){
    if( key in TEAM_ACTIVE_SKILL[place][i] ){
console.log("trigger-"+key);
        TEAM_ACTIVE_SKILL[place][i][ key ]( place, i );
    }
}
function checkActiveSkillByKey( key ){
    $.each(TEAM_ACTIVE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            if( key in active ){
                active[ key ]( place, i );
            }
        });
    });    
}

function resetActiveSkillCoolDown( place, i ){    
    TEAM_ACTIVE_SKILL[place][i]["variable"]["COOLDOWN"] = TEAM_ACTIVE_SKILL[place][i]["coolDown"];
}
function activeCoolDownUpdate(){
    $.each(TEAM_ACTIVE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            if( COMBO_STACK.length > 0 ){
                if( active['variable']['COOLDOWN'] > 0 ){
                    active['variable']['COOLDOWN'] -= 1;
                }
            }
        });
    });
    showActiveInfomation();
}

function usingActiveSkillUpdate(){
    for( var activeID in USING_ACTIVE_SKILL_STACK ){
        var place = USING_ACTIVE_SKILL_STACK[activeID]['PLACE'];
        var i = USING_ACTIVE_SKILL_STACK[activeID]['i'];
        if( TEAM_ACTIVE_SKILL.length > place || TEAM_ACTIVE_SKILL[place].length > i ){
            triggerActiveByKey( place, i, 'update' );
        }
    }
}