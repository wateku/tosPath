
var historyManager     = null;
var environmentManager = null;

var sceneManager       = null;
var fieldManager       = null;

var teamManager        = null;
var barManager         = null;
var comboManager       = null;
var dropColorManager   = null;

var gameMode = GAME_MODE.EMPTY;

// =================================================================
// 觸控判定
// =================================================================
var TOUCH_DEVICE = false;
if (navigator.userAgent.indexOf('iPhone') > 0
    || navigator.userAgent.indexOf('iPod') > 0
    || navigator.userAgent.indexOf('iPad') > 0
    || navigator.userAgent.indexOf('Android') > 0) {
    TOUCH_DEVICE = true;
}
// =================================================================

window.requestAnimFrame = (function(callback){
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1);
            };
})();

window.cancelAnimationFrame = (function(callback){
    return  window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame || 
            window.webkitCancelRequestAnimationFrame || 
            window.mozCancelAnimationFrame || 
            window.mozCancelRequestAnimationFrame ||
            function(id) {
                clearTimeout(id);;
            };
})();

/*
(function(){
    var oldLog = console.log;
    console.log = function (message) {
        $('#log').append( '\n'+message );
        oldLog.apply(console, arguments);
    };
})();*/

$(document).ready( function(){

    $("#EditModeButton").hide();
    $("#TeamModeButton").hide();
    $("#RoleModeButton").hide();
    $("#MoveModeButton").hide();
    $("#ReplayModeButton").hide();

    // check device 大小整理
    if( TOUCH_DEVICE ){
        BALL_SIZE    = 60;
        REPLAY_SPEED = BALL_SIZE / MOVE_FRAME;
        SHIFT_BIAS   = BALL_SIZE / 20;
            
        $("#ScrollButton").hide();
        $("#ColorSelector img").addClass('img-btn-sm');
        $("#EditModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");
        $("#MoveModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");
        $('.selectpicker').selectpicker({ style:'btn-default btn-md' });
        $("#ReplayModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");

        var comboDiv = $("#ComboDiv").remove();
        $("#MobileComboDiv").append(comboDiv);
        $('#DragCanvas').css('background-size', (BALL_SIZE*4)+' px '+(BALL_SIZE*4)+' px');
        
    }else{
        $("#ColorSelector img").addClass('img-btn-lg');
        $('.selectpicker').selectpicker({ style:'btn-default btn-lg' });
    }

    //initail autoHidingNavbar
    $(".navbar-fixed-top").autoHidingNavbar();

    // 歷史紀錄和環境設定
    historyManager = new HistoryManager();
    historyManager.initialize();

    environmentManager = new EnvironmentManager();
    environmentManager.initialize();

    // 主畫面和動畫設定
    sceneManager = new SceneManager( $("#DragCanvas"), TOUCH_DEVICE );
    sceneManager.startInterval(false);

    // 其他元件設定
    barManager = new BarManager( $("#BarCanvas"), environmentManager );
    barManager.initialize();
    comboManager = new ComboManager( $('#ComboScrollbar'), $('#ComboInfo'), historyManager );
    comboManager.initialize();
    dropColorManager = new DropColorManager( $("#DropColorSelector"), $("#DropColorScrollbar"), environmentManager );
    dropColorManager.initialize();
    teamManager = new TeamManager( $("#TeamMember") );
    teamManager.initialize();

    // 分析網址
    parseUrl();

    fieldManager = new FieldManager( sceneManager, $("#DragCanvas"), historyManager, environmentManager );
    sceneManager.changeScene(fieldManager);

});

function setEditMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").show();
    $("#TeamModeButton").hide();
    $("#RoleModeButton").hide();
    $("#MoveModeButton").hide();
    $("#ReplayModeButton").hide();

    gameMode = GAME_MODE.EDIT;
    fieldManager.setStrategy(new FieldStrategyEdit(fieldManager));
}
function setTeamMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").hide();
    $("#TeamModeButton").show();
    $("#RoleModeButton").hide();
    $("#MoveModeButton").hide();
    $("#ReplayModeButton").hide();

    gameMode = GAME_MODE.TEAM;
    fieldManager.setStrategy(new FieldStrategyEmpty(fieldManager));
}
function setRoleMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").hide();
    $("#TeamModeButton").hide();
    $("#RoleModeButton").show();
    $("#MoveModeButton").hide();
    $("#ReplayModeButton").hide();

    gameMode = GAME_MODE.ROLE;
    fieldManager.setStrategy(new FieldStrategyEmpty(fieldManager));
}
function setMoveMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").hide();
    $("#TeamModeButton").hide();
    $("#RoleModeButton").hide();
    $("#MoveModeButton").show();
    $("#ReplayModeButton").hide();

    checkPanelLoader();
    gameMode = GAME_MODE.MOVE;
    fieldManager.setStrategy( new FieldStrategyMove(fieldManager, false) );
}
function setReplayMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").hide();
    $("#TeamModeButton").hide();
    $("#RoleModeButton").hide();
    $("#MoveModeButton").hide();
    $("#ReplayModeButton").show();

    gameMode = GAME_MODE.REPLAY;
    fieldManager.setStrategy( new FieldStrategyMove(fieldManager, true) );
}



