
//==============================================================
// BASIC LENGTH
//==============================================================
var WIDTH = 80;
var HEIGHT = 80;

var TR_INDEX = 5;
var TD_INDEX = 6;
var BASE_LEFT;
var BASE_TOP;
var TR_NUM = parseInt( $("#dragContainment").attr("tr") );
var TD_NUM = parseInt( $("#dragContainment").attr("td") );

var ACCURACY = 0.6;
var MIN_SHIFT = 8;
var MAX_SHIFT = 35;
var MAX_AUTO_DROP_TIMES = 100;

//==============================================================
// GLOBAL VARIABLE
//==============================================================
var COLORS = ['w', 'f', 'p', 'l', 'd', 'h'];
var TEAM_COLORS = [];
var COLOR_MAP = {};
var COLOR_PROB = [ {}, {}, {}, {}, {}, {} ];
var TEAM_COLORS_CHANGEABLE = true;

var STRAIGHT_SETS      = [];
var HORIZONTAL_SETS    = [];
var COLOR_SETS         = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var COLOR_SETS_PREPARE = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var SET_SIZE           = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};
var GROUP_SIZE         = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};
var GROUP_SETS         = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var GROUP_SETS_PREPARE = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};

var REMOVE_STACK = [];
var STRONG_STACK = {};
var DROP_STACK = [];

var ALL_GROUP_SET_STACK = [];
var COMBO_STACK = [];
var DROP_WAVES = 0;
var COMBO_TIMES = 0;
var COMBO_SHOW = 0;

var DRAG_ANIMATE_TIME = 100;
var REMOVE_TIME = 100;
var FADEOUT_TIME = 200;
var DROP_TIME = 150;
var ATTACK_INFO_TIME = 500;
var GAME_READY_TIME = 1000;

var MOVE_OUT_OF_TIME = false;
var START_TIME = 0;
var TIME_INTERVAL;
var TIME_RUNNING = false;
var TIME_GRADIENT;
var TIME_RECT;

//==============================================================
// HISTORY
//==============================================================
var HISTORY = [];
var INITIAL_PANEL = [];
var FINAL_PANEL = [];
var HISTORY_SHOW = 0;
var COLOR_RANDOM = Math.floor( Math.random() * 1000 );
var HISTORY_RANDOM = COLOR_RANDOM;
var HISTORY_SKILL_VARIABLE;
var HISTORY_TEAM_MEMBER;
var CLIPBOARD;

//==============================================================
// ENEMY
//==============================================================
var LOCUS_LENGTH = 6;
var LOCUS = true;
var LOCUS_TYPE = null;
var LOCUS_STACK = [];

//==============================================================
// BATTLE
//==============================================================
var HEALTH_POINT = 0;
var TOTAL_HEALTH_POINT = 0;

var COUNT_COMBO                 = 0;
var COUNT_COMBO_COEFF           = 0.25;
var COUNT_AMOUNT                = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_MAX_AMOUNT            = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_AMOUNT_COEFF          = 0.25;
var COUNT_STRONG                = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_STRONG_COEFF          = 0.15;
var COUNT_SETS                  = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_FIRST_SETS            = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_FIRST_AMOUNT          = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_BELONG_COLOR          = { };
var COUNT_BELONG_AMOUNT         = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_BELONG_MAX_AMOUNT     = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_BELONG_STRONG         = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_BELONG_SETS           = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
var COUNT_FACTOR                = {};
var COUNT_RECOVER_COMBO_COEFF   = 0.25;
var COUNT_RECOVER_AMOUNT_COEFF  = 0.25;
var COUNT_RECOVER_STRONG_COEFF  = 0.15;
var COUNT_RECOVER_FACTOR        = {};
var COUNT_COLOR_FACTOR          = { 'w': 1, 'f': 1, 'p': 1, 'l': 1, 'd': 1, '': 1 };
var COUNT_COLOR_TO_COLOR_FACTOR = { 'w': {}, 'f': {}, 'p': {}, 'l': {}, 'd': {}, '_': {} };
var COUNT_INJURE_REDUCE         = 1;

var ATTACK_STACK  = [];
var RECOVER_STACK = [];
var INJURE_STACK  = [];

var UNDEAD_WILL = false;

//==============================================================
// CONTROL PARAMETER
//==============================================================
var FREE_DRAGABLE = false;
var DROPABLE = false;
var AUDIO = true;

var TIME_IS_LIMIT = true;
var TIME_LIMIT = 5;
var TIME_FIXED = false;
var TIME_ADD_LIST = {};
var TIME_MULTI_LIST = {};
var TIME_FIX_LIST = [];

var REPLAY_SPEED = 300;
var REVIEW_PATH = false;
var CREATE_COLOR = null;

var GAME_MODE = null;

//==============================================================
// TEAM MEMBER
//==============================================================
var TEAM_MEMBERS = [];
var TEAM_LEADER  = null;
var MEMBER_1     = null;
var MEMBER_2     = null;
var MEMBER_3     = null;
var MEMBER_4     = null;
var TEAM_FRIEND  = null;

var TEAM_LEADER_SKILL = null;
var TEAM_FRIEND_SKILL = null;
var TEAM_SKILL        = [];

var TEAM_ACTIVE_SKILL     = [];
var TEAM_COMBINE_SKILL    = [];

var ADDITIONAL_EFFECT_STACK  = [];
var USING_ACTIVE_SKILL_STACK = {};

var TEAM_WAKES            = [];

//==============================================================
// STATUS
//==============================================================

var ENEMY = null;
var GAME_WAVES = [];
var GAME_PROGRESS = 0;

var PLAY_TURN = 0;
var PLAY_TYPE = null;
var MAIN_STATE = null;


//==============================================================
// reset functions
//==============================================================

function resetBase(){
    TR_NUM = parseInt( $("#dragContainment").attr("tr") );
    TD_NUM = parseInt( $("#dragContainment").attr("td") );
    BASE_LEFT = $("#dragContainment td").eq(0).offset().left;
    BASE_TOP = $("#dragContainment td").eq(0).offset().top;
}

function resetMoveTime(){
    START_TIME = new Date().getTime() / 1000;
    TIME_RUNNING = false;
    clearInterval(TIME_INTERVAL);
}
function resetTimeCondition(){
    TIME_IS_LIMIT = true;
    TIME_LIMIT = 5;
    TIME_FIXED = false;
    TIME_ADD_LIST = {};
    TIME_MULTI_LIST = {};
    TIME_FIX_LIST = [];
}

function cleanColors(){
    COLORS = ['w', 'f', 'p', 'l', 'd', 'h'];
    COLOR_MAP = {};
    COLOR_PROB = [];
    for(var i = 0; i < TD_NUM; i++){
        COLOR_PROB.push( {} );
    }
}
function resetColors(){
    TEAM_COLORS = []; 
    for(var i = 0; i < TD_NUM; i++){
        if( TEAM_COLORS_CHANGEABLE ){
            var team_colors = {};
            var tmp_colors = {};
            var prob = 0;
            var color_len = 0;

            for( var c of COLORS ){
                if( !(c in COLOR_PROB[i]) ){
                    tmp_colors[c] = ( c in tmp_colors ) ? tmp_colors[c]+1 : 1;
                    color_len++;
                }
            }

            for( var c in COLOR_PROB[i] ){
                team_colors[c] = prob + COLOR_PROB[i][c];
                prob += COLOR_PROB[i][c];
            }

            var else_prob = 1 - prob;
            for( var c in tmp_colors ){
                var c_prob = tmp_colors[c] * ( else_prob / color_len ) ;
                team_colors[c] = prob + c_prob;
                prob += c_prob;
            }

            TEAM_COLORS.push( team_colors );
        }else{
            TEAM_COLORS.push( { 'w': 1/6, 'f': 2/6, 'p': 3/6, 
                                'l': 4/6, 'd': 5/6, 'h': 6/6 } );
        }
    }
}

function resetColorGroupSet(){
    STRAIGHT_SETS = [];
    for(var i = 0; i < TD_NUM; i++){ STRAIGHT_SETS.push([]); }
    HORIZONTAL_SETS = [];
    for(var i = 0; i < TR_NUM; i++){ HORIZONTAL_SETS.push([]); }
    COLOR_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
    COLOR_SETS_PREPARE = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};

    GROUP_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
    GROUP_SETS_PREPARE = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
}
function resetSetGroupSize(){    
    TEAM_COLORS_CHANGEABLE = true;
    SET_SIZE = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};
    GROUP_SIZE = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};
}
function resetDropStack(){
    REMOVE_STACK = [];
    STRONG_STACK = {};
    DROP_STACK = [];
    for(var i = 0; i < TD_NUM; i++){
        DROP_STACK.push([]);
    }
}
function resetComboStack(){ 
    COMBO_STACK = [];
    ALL_GROUP_SET_STACK = [];   
    DROP_WAVES = 0;
    COMBO_TIMES = 0;
    COMBO_SHOW = 0;
    setComboShow();
    setExtraComboShow(0);
    resetComboBox();

    // TeamGreek reset extraCombo
    checkTeamSkillByKey( 'extraReset' );
}
function resetAttackRecoverStack(){
    ATTACK_STACK = [];
    RECOVER_STACK = [];
    INJURE_STACK = [];
}
function resetAdditionalStack(){
    ADDITIONAL_EFFECT_STACK = [];
    updateAdditionalEffectLabel();

    $.each(TEAM_ACTIVE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            triggerActiveByKey( place, i, 'close' );
        });
    });
    showActiveInfomation();
}

function resetCanvas(){
    $('#dragCanvas').show();
    $('#dragCanvas').clearCanvas();
    $('#dragCanvas').removeLayers();
    $('#dragCanvas').offset( $("#dragContainment").offset() );
    $('#dragCanvas').attr("width",TD_NUM*WIDTH).attr("height",TR_NUM*HEIGHT);   
}
function closeCanvas(){
    $('#dragCanvas').hide();
    $('#dragCanvas').clearCanvas();
    $('#dragCanvas').removeLayers();
    $('#dragCanvas').offset( $("#dragContainment").offset() );
    $('#dragCanvas').attr("width",TD_NUM*WIDTH).attr("height",TR_NUM*HEIGHT);
}
function resetTimeLifeDiv(){
    $("#timeLifeIcon").offset( { 
        top  : $("#dragContainment").offset().top-$("#timeLifeIcon").height(),
        left : $("#dragContainment").offset().left
    } );
    $("#timeLifeBack").css( "width", TD_NUM*WIDTH-($("#timeLifeIcon").width()/2) );
    $("#timeLifeBack").css( "height", $("#timeLifeIcon").height()/2 );
    $("#timeLifeBack").offset( { 
        top  : $("#timeLifeIcon").offset().top+($("#timeLifeIcon").height()/4),
        left : $("#timeLifeIcon").offset().left+($("#timeLifeIcon").width()/2) 
    } );
    $("#timeLifeRect").css( "width", TD_NUM*WIDTH-($("#timeLifeIcon").width()/2) );
    $("#timeLifeRect").css( "height", $("#timeLifeIcon").height()/2 );
    $("#timeLifeRect").offset( {
        top  : $("#timeLifeIcon").offset().top+($("#timeLifeIcon").height()/4),
        left : $("#timeLifeIcon").offset().left+($("#timeLifeIcon").width()/2) 
    } );
}
function renewTimeLifeDiv(){
    resetTimeLifeDiv();
    $("#timeLifeRect").css( "clip", "rect(0px, "+
        parseInt($("#timeLifeBack").css("width"))+"px,"+
        parseInt($("#timeLifeBack").css("height"))+"px, 0px)" );
}
function switchTimeLifeToTime(){
    renewTimeLifeDiv();
    $("#timeLifeIcon").attr('src', 'img/UI/clock.png');
    $("#timeLifeRect").css('background-image', 'url("img/UI/timeclip.png")');
}
function switchTimeLifeToLife(){
    renewTimeLifeDiv();
    $("#timeLifeIcon").attr('src', 'img/UI/heart.png');
    $("#timeLifeRect").css('background-image', 'url("img/UI/lifeclip.png")');
    showLife();
}
function resetTeamMemberSelectDiv(){    
    $("#TeamMember div.characterSelect").each(function(i){
        $(this).offset({
            top  : $('#MemberSelectTD').offset().top,
        });
    });
}


function playAudioRemove(){
    if( !AUDIO ){ return; }
    if( COMBO_SHOW < 10 ){
        var mp3 = "sound/combo"+COMBO_SHOW+".mp3";
    }else{
        var mp3 = "sound/combo10.mp3";
    }
    var audio = new Audio(mp3);
    audio.volume = 0.5;
    audio.play();
}
function playAudioWrong(){
    if( !AUDIO ){ return; }
    var audio = new Audio('sound/wrong.mp3');
    audio.volume = 0.8;
    audio.play();
}
//==============================================================
// Game Start/End
//==============================================================
function startGame(){
    PLAY_TURN  = 0;
    HEALTH_POINT = TOTAL_HEALTH_POINT;
    gotoNextLevelEnemy();
    nextMoveWave();
}
function endGame(){
    showEndGame();
    if( GAME_MODE == GAME_MODE_ENUM.REPEAT ){
        restartGame();
    }
}
function restartGame(){
    resetAttackRecoverStack();
    resetCount();
    resetAdditionalStack();

    setTimeout( function(){
        resetGameWaves();
        startGame();
    }, GAME_READY_TIME );  
}
function gotoNextLevelEnemy(){
    GAME_PROGRESS += 1;
    if( GAME_PROGRESS < GAME_WAVES.length ){
        showNextLevel();
        ENEMY = [];
        game_wave = GAME_WAVES[GAME_PROGRESS];
        $.each(game_wave, function(i, enemyID){
            ENEMY.push( NewEnemy(enemyID) );
        });
    }else{
        return false;
    }
    return true;
}

//==============================================================
//  stage define 
//==============================================================
function initialMoveWave(){    
    resetBase();
    resetMoveTime();
}
function endMoveWave(){
    MAIN_STATE = MAIN_STATE_ENUM.COUNT_GROUP;

    resetLocus();
    closeCanvas();
    resetMoveTime();
    switchTimeLifeToLife();
    stopDragging();
    recordFinal();    
    checkGroups();
}
function nextMoveWave(){
    MAIN_STATE = MAIN_STATE_ENUM.READY;
    switchTimeLifeToLife();
    resetDraggable();
    startDragging();
    showPlayTurnLevel();
    resetTimeCondition();

    checkLeaderSkillByKey('findMaxC');
    checkTeamSkillByKey( 'setTime' );
    checkLeaderSkillByKey( 'setTime' );
    countTimeLimit();
}
function restartMoveWave(){
    resetLocus();
    closeCanvas();
    resetMoveTime();
    stopDragging();
    recordFinal();    
    nextMoveWave();
}
function newMoveWave(){
    //Maybe used in end attack effect
    resetComboStack();
    resetHistory();
    renewTimeLifeDiv();
}

function checkGroups(){
    resetBase();
    resetColorGroupSet();
    resetDropStack();

    countColor();
    countGroup();

    if( countComboStack() == 0 ){
        checkAttack();
    }else{
        setTimeout( function(){
            removeGroups(TD_NUM*TR_NUM-1);
        }, REMOVE_TIME);        
    }
}

function checkAttack(){
    MAIN_STATE = MAIN_STATE_ENUM.COUNT_ATK;
    $("#dragContainment img.over").addClass("img-gray");

    countAttack();

    setTimeout( function(){
        checkInjure();
    }, ATTACK_INFO_TIME);
}
function checkInjure(){
    MAIN_STATE = MAIN_STATE_ENUM.BATTLE_INFO;

    countEnemyAction();

    setTimeout( function(){
        endPlayTurn();
    }, ATTACK_INFO_TIME );

}
function endPlayTurn(){
    checkLeaderSkillByKey( 'end' );
    checkTeamSkillByKey( 'end' );
    checkActiveSkillByKey( 'end' );
    checkAdditionEffectByKey( 'end' );
    checkEnemyEffectByKey( 'end' );
    
    showEnemySuffer();
    showTeamInjure();
    showResult();

    setTimeout( function(){
        $("#dragContainment img.over").removeClass("img-gray");
        checkGameStatus();
    }, ATTACK_INFO_TIME );
}
function checkGameStatus(){
    if( ! checkTeamStatus() ){
        showLoseGame();
        endGame();
    }else if( ! checkEnemyStatus() ){
        showWinGame();
        endGame();
    }else{
        PLAY_TURN += 1;
        frozenUpdate();
        activeCoolDownUpdate();
        additionalEffectUpdate();
        enemyEffectUpdate();
        usingActiveSkillUpdate();
        showActiveInfomation();
        nextMoveWave();
    }
}

//==============================================================
// make element
//==============================================================
function initialTable(){
    $("#dragContainment tr").remove();
    for(var i = 0; i < TR_NUM; i++){
        var tr = $("<tr></tr>");
        for(var j = 0; j < TD_NUM; j++){
            $(tr).append($("<td></td>"));
        }
        $("#dragContainment").append(tr);
    }    
}

function initialColor(){
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j ++){
            var target = $("#dragContainment tr td").eq(j*TD_NUM+i);
            if( $(target).children().length == 0 ){
                $(target).append( newElementByID(j*TD_NUM+i) );
            }
        }
    }
}

function mapColor(color){
    if( color ){
        return color[0];
    }else{
        return null;
    }
}
function mapImgSrc(item){
    var c    = mapColor(item);
    var plus = ( item.indexOf('+') >= 0 ) ? '+' : '';
    var _    = ( item.indexOf('_') >= 0 ) ? '_' : '';
    var x    = ( item.indexOf('x') >= 0 ) ? 'x' : '';
    var i    = ( item.indexOf('i') >= 0 ) ? item.substr( item.indexOf('i'), 2 ) : '';

    if( item.indexOf('X') >= 0 ){
        item = 'x'+i ;
    }else if( item.indexOf('q') >= 0 ){
        item = 'q'+i+x ;
    }else if( item.indexOf('k') >= 0 ){
        item = c+'k'+i+x ;
    }else{
        item = c+plus+_+i+x ;
    }

    return "img/Icon/"+item+".png";
}
function randomBySeed(){    
    var rand = Math.sin(COLOR_RANDOM++) * 10000;
    return rand - Math.floor(rand);
}

function newElementByID(id){
    var td_seat = id%TD_NUM;
    var colors = TEAM_COLORS[td_seat];
    var rand = randomBySeed();
    var color = 'w';

    for( var c in colors ){
        if( rand <= colors[c] ){
            color = c;
            break;
        }
    }
    if( color in COLOR_MAP ){
        color = COLOR_MAP[color];
    }

    return newElementByItem(color);
}
function newElementByItem(item){
    var color = mapColor(item);
    if( color ){
        var src_path = mapImgSrc(item);
        var strong = item.indexOf('+') >= 0 ? 1 : undefined;
        var inhibit = ( item.indexOf('x') >= 0 || item.indexOf('X') >= 0 ) ? 1 : undefined;
        var locking = item.indexOf('k') >= 0 ? 1 : undefined;

        var frozen = item.indexOf('i') >= 0 ? 0 : undefined;
        if( item.indexOf('i') >= 0 ){
            frozen = parseInt( item[ item.indexOf('i') + 1 ] );
        }

        var img = $("<img></img>").attr("src",src_path).attr("color",color).attr("item",item);
        img.attr("strong",strong).attr("inhibit",inhibit).attr("frozen",frozen).attr("locking",locking);

        var over = img.clone().addClass("draggable over");
        var under = img.clone().addClass("draggable under");
        return [over, under];
    }else{
        return null;
    }
}