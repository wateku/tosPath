//==============================================================
// Skill Variable
//==============================================================
var COUPLE_RAND_STACK = [];

function saveSkillVariable(){
    var json = 
    [
        TEAM_LEADER_SKILL.variable,
        TEAM_FRIEND_SKILL.variable,
        $.map(TEAM_SKILL, function(team_skill, i){
            return team_skill.variable;
        }),
    ];
    return JSON.stringify(json);
}
function loadSkillVariable(msg){
    var json = JSON.parse(msg);
    TEAM_LEADER_SKILL.variable   = json[0];
    TEAM_FRIEND_SKILL.variable   = json[1];
    $.each(json[2], function(i, team_skill_var){
        TEAM_SKILL[i].variable = team_skill_var;
    });
}

//==============================================================
//==============================================================
// Base Skill
//==============================================================
//==============================================================
var None = function(){}
var NoneSetting = function(){ return {}; }
var NoneMapping = function(){
    return 0;
}


//==============================================================
// utility function
//==============================================================
function randomBySeed(){    
    var rand = Math.sin(COLOR_RANDOM++) * 10000;
    return rand - Math.floor(rand);
}
function randomBySepcialSeed(seed){
    var rand = Math.sin(seed) * 10000;
    return rand - Math.floor(rand);
}
function selectRandomItemFromArrBySeed( array, seed = 'COLOR_RANDOM' ){
    var rand = ( seed == 'COLOR_RANDOM' ) ? randomBySeed() : randomBySepcialSeed( seed );
    return array[ Math.floor( rand * array.length ) ];
}
function selectAndRemoveRandomItemFromArrBySeed( array, seed = 'COLOR_RANDOM' ){
    var rand = ( seed == 'COLOR_RANDOM' ) ? randomBySeed() : randomBySepcialSeed( seed );
    var rand_i = Math.floor( rand * array.length );
    var item = array[rand_i];
    array.splice(rand_i, 1);
    return item;
}
function selectMultiRandomItemFromArrBySeed(  array, num, seed = 'COLOR_RANDOM' ){
    selects = []
    for( var i = 0; i < num; i++ ){
        var rand = ( seed == 'COLOR_RANDOM' ) ? randomBySeed() : randomBySepcialSeed( seed );
        var rand_i = Math.floor( rand * array.length );
        var item = array[rand_i];
        array.splice(rand_i, 1);
        selects.push( item );
    }
    return selects
}

function getOtherColorsFromColorArr( colorArr ){
    var colors = [ 'w', 'f', 'p', 'l', 'd', 'h' ];
    for(var c of colorArr){
        if( colors.indexOf(c) >= 0 ){
            colors.splice(colors.indexOf(c), 1);
        }
    }
    return colors;
}

//==============================================================
// Panel Element function
//==============================================================
function checkHasElementByColorWithoutStrong(color){
    var color_stack = getStackOfPanelByColorWithoutStrong(color);
    return color_stack.length > 0;
}
function checkHasElementByColorArrWithoutStrong(colorArr){
    var color_stack = getStackOfPanelByColorArrWithoutStrong(colorArr);
    return color_stack.length > 0;
}
function checkHasElementByColor(color){
    var color_stack = getStackOfPanelByColor(color);
    return color_stack.length > 0;
}
function checkHasElementByColorArr(colorArr){
    var color_stack = getStackOfPanelByColorArr(colorArr);
    return color_stack.length > 0;
}
function getStackOfPanelByColor(color){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        if( c == color ){
            stack.push(i);
        }
    }
    return stack;
}
function getStackOfPanelByColorArr(colorArr){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        if( colorArr.indexOf(c) >= 0 ){
            stack.push(i);
        }
    }
    return stack;
}
function getStackOfPanelByColorWithoutStrong(color){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        var strong = parseInt( $("#dragContainment tr td").eq(i).find("img.over").attr("strong") );
        if( c == color && !(strong > 0) ){
            stack.push(i);
        }
    }
    return stack;
}
function getStackOfPanelByColorArrWithoutStrong(colorArr){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        var strong = parseInt( $("#dragContainment tr td").eq(i).find("img.over").attr("strong") );
        if( colorArr.indexOf(c) >= 0 && !(strong > 0) ){
            stack.push(i);
        }
    }
    return stack;
}
function getStackOfPanelByColorWithStrong(color){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        var strong = parseInt( $("#dragContainment tr td").eq(i).find("img.over").attr("strong") );
        if( c == color && (strong > 0) ){
            stack.push(i);
        }
    }
    return stack;
}
function getStackOfPanelByColorArrWithStrong(colorArr){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        var strong = parseInt( $("#dragContainment tr td").eq(i).find("img.over").attr("strong") );
        if( colorArr.indexOf(c) >= 0 && (strong > 0) ){
            stack.push(i);
        }
    }
    return stack;
}
function getStackOfStraight(place){
    var stack = [];
    for(var i = 0; i < TR_NUM; i++){
        stack.push(i*TD_NUM+place);
    }
    return stack;
}
function getStackOfStraightByColor(place, color){
    var stack = [];
    for(var i = 0; i < TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i*TD_NUM+place).find("img.over").attr("color");
        if( c == color ){
            stack.push(i*TD_NUM+place);
        }
    }
    return stack;
}
function getStackOfStraightByColorArr(place, colorArr){
    var stack = [];
    for(var i = 0; i < TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i*TD_NUM+place).find("img.over").attr("color");
        if( colorArr.indexOf(c) >= 0 ){
            stack.push(i*TD_NUM+place);
        }
    }
    return stack;
}
function getStackOfHorizontal(i){
    var stack = [];
    for(var j = 0; j < TD_NUM; j++){
        stack.push(i*TD_NUM+j);
    }
    return stack;
}
function getStackOfHorizontalByColor(i, color){
    var stack = [];
    for(var j = 0; j < TD_NUM; j++){
        var c = $("#dragContainment tr td").eq(i*TD_NUM+j).find("img.over").attr("color");
        if( c == color ){
            stack.push(i*TD_NUM+j);
        }
    }
    return stack;
}
function getStackOfHorizontalByColorArr(i, colorArr){
    var stack = [];
    for(var j = 0; j < TD_NUM; j++){
        var c = $("#dragContainment tr td").eq(i*TD_NUM+j).find("img.over").attr("color");
        if( colorArr.indexOf(c) >= 0 ){
            stack.push(i*TD_NUM+j);
        }
    }
    return stack;
}
function getStackNearbyID(id){
    var stack = [];
    if( id+1 <  TD_NUM*TR_NUM && id%TD_NUM < TD_NUM-1          ){ stack.push(id+1); }
    if( id-1 >= 0             && id%TD_NUM > 0                 ){ stack.push(id-1); }
    if( id+6 <  TD_NUM*TR_NUM && id        < TD_NUM*(TR_NUM-1) ){ stack.push(id+6); }
    if( id-6 >= 0             && id        >= TD_NUM           ){ stack.push(id-6); }
    return stack;
}
function getAllCornersStack(){
    rightUpCorner   = [ 0, 1, TD_NUM, TD_NUM+1 ];
    leftUpCorner    = [ TD_NUM-2, TD_NUM-1, 2*TD_NUM-2, 2*TD_NUM-1 ];
    rightDownCorner = [ (TR_NUM-2)*TD_NUM, (TR_NUM-2)*TD_NUM+1, (TR_NUM-1)*TD_NUM, (TR_NUM-1)*TD_NUM+1 ];
    leftDownCorner  = [ (TR_NUM-1)*TD_NUM-2, (TR_NUM-1)*TD_NUM-1, TR_NUM*TD_NUM-2, TR_NUM*TD_NUM-1 ];
    return [ rightUpCorner, leftUpCorner, rightDownCorner, leftDownCorner ]
}
function getAllPanelStack(){
    var stack = [];
    for( var i = 0; i < TD_NUM*TR_NUM-1; i++ ){
        stack.push( i );
    }
    return stack;
}

function findMaxColorOfColorArr( colorArr ){
    var colors = {};
    var max = 0;
    var tmp_colors = [];
    for( var i = 0; i < TD_NUM*TR_NUM; i++ ){
        var c = $("#dragContainment tr td img.over ").eq(i).attr("color");
        if( colorArr.indexOf(c) >= 0 ){
            colors[c] = ( c in colors ) ? colors[c]+1 : 0;
        }
    }
    for(var c in colors){
        if( colors[c] > max ){
            max = colors[c];
            tmp_colors = [ c ];
        }else if( colors[c] == max && max > 0 ){
            tmp_colors.push(c);
        }
    }
    return { colors: tmp_colors, num: max };
}

//==============================================================
// change Element
//==============================================================
function turnElementToColorByID(id, color){
    var imgs = $("#dragContainment tr td").eq(id).find("img");
    if( imgs.length == 0 ){
        var hide_items = newElementByItem(color);
        $("#dragContainment tr td").eq(id).append( hide_items );
        $(hide_items[0]).hide().delay( FADEOUT_TIME ).fadeIn( FADEOUT_TIME );
        $(hide_items[1]).hide().delay( FADEOUT_TIME ).fadeIn( FADEOUT_TIME, function(){
            resetDraggable();
            startDragging();
        } );
        return;
    }

    imgs.attr('color', color[0] );
    var item = imgs.attr('item');
    item = color + item.substr(1);
    imgs.attr('item', item);
    var hide_items = newElementByItem( item.replace('q','').replace('k','') );

    $(hide_items[0]).hide();
    $(hide_items[1]).hide();
    $("#dragContainment tr td").eq(id).find("img").stop().fadeOut( FADEOUT_TIME, function(){
        $(this).remove();
        $("#dragContainment tr td").eq(id).append( hide_items );
        $("#dragContainment tr td").eq(id).find("img").fadeIn( FADEOUT_TIME );
        resetDraggable();
        startDragging();
    });
}
function turnElementToStrongByID(id){
    var imgs = $("#dragContainment tr td").eq(id).find("img");
    if( imgs.length == 0 ){
        return;
    }

    var item = imgs.attr("item");
    item = item + "+";
    imgs.attr('item', item);
    var hide_items = newElementByItem( item.replace('q','').replace('k','') );

    $(hide_items[0]).hide();
    $(hide_items[1]).hide();
    $("#dragContainment tr td").eq(id).find("img").stop().fadeOut( FADEOUT_TIME, function(){
        $(this).remove();
        $("#dragContainment tr td").eq(id).append( hide_items );
        $("#dragContainment tr td").eq(id).find("img").fadeIn( FADEOUT_TIME );
        resetDraggable();
        startDragging();
    });
}
function turnRandomElementToColorByConfig( config ){
    // config: color, num, priorityColors
    var color = config['color'];
    for( var num = config['num']; num > 0; num-- ){
        for( var colors of config['priorityColors'] ){
            var stack = getStackOfPanelByColorArr( colors );
            if( stack.length > 0 ){
                var id = selectAndRemoveRandomItemFromArrBySeed( stack );
                turnElementToColorByID(id, color);
                break;
            }
        }
    }
}
function turnRandomElementToColorByProb( config ){
    // config: color, num, probColors
    var color = config['color'];
    var probs = config['probColors'];
    for( var num = config['num']; num > 0; ){
        var rand = randomBySeed();
        for( var c in probs ){
            if( rand <= probs[c] ){
                color = c;
                break;
            }
        }
        var stack = getStackOfPanelByColor( color );
        if( stack.length > 0 ){
            var id = selectAndRemoveRandomItemFromArrBySeed( stack );
            turnElementToColorByID(id, config['color']);
            num--;
        }
    }    
}

//==============================================================
// color belongs function
//==============================================================
function addColorBelongsByConfig( config ){
    for( var c in config ){
        for( var belong_color in config[c] ){
            if( c in COUNT_BELONG_COLOR && belong_color in COUNT_BELONG_COLOR[c] ){
                COUNT_BELONG_COLOR[c][belong_color] += config[c][belong_color];
            }
        }
    }
}
function setColorBelongsByConfig( config ){
    for( var c in config ){
        for( var belong_color in config[c] ){
            if( c in COUNT_BELONG_COLOR && belong_color in COUNT_BELONG_COLOR[c] ){
                COUNT_BELONG_COLOR[c][belong_color] = config[c][belong_color];
            }
        }
    }
}

//==============================================================
// count First Straight/Horizental function
//==============================================================
function countFirstStraightNum( length ){
    var straight = 0;
    for(var i = 0; i < TD_NUM; i++ ){
        if( checkFirstStraightByPlace( length, i ) ){
            straight += 1;
        }
    }
    return straight;
}
function checkFirstStraightByPlace( length, place ){
    for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][place] ){
        if( set.size >= length ){
            return true;
        }
    }
    return false;
}
function checkFirstHorizentalClearByPlace( place ){
    var base_line = [];
    for(var i = TD_NUM*( place ); i < TD_NUM*( place+1 ); i++){
        base_line.push( i );
    }
    for(var obj of COMBO_STACK){
        if( obj['drop_wave'] == 0 ){
            for(var i of obj['set']){
                if( base_line.indexOf(i) >= 0 ){
                    base_line.splice( base_line.indexOf(i), 1 );
                }
            }
        }
    }
    return base_line.length == 0;
}

//==============================================================
// check Combo color
//==============================================================
function countComboAtFirstWave(){
    var combos = 0;
    for(var c in COUNT_FIRST_SETS){
        combos += COUNT_FIRST_SETS[c];
    }
    return combos;
}
function countComboElementsFirstWave(){
    var num = 0;
    for(var c in COUNT_FIRST_AMOUNT){
        num += COUNT_FIRST_AMOUNT[c];
    }
    return num;
}
function checkComboColorAmountByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = (id in COUNT_AMOUNT) ? COUNT_AMOUNT[id] : 0;
    }

    var countArr = getArrayOfObjectValue(countId);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkComboColorMaxAmountByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = (id in COUNT_MAX_AMOUNT) ? COUNT_MAX_AMOUNT[id] : 0;
    }

    var countArr = getArrayOfObjectValue(countId);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkComboColorFirstMaxAmountByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = 0;
    }

    $.each(COMBO_STACK, function(i, combo){
        if(combo['color'] in countId && combo['drop_wave'] == 0 ){
            if( combo['amount'] > countId[ combo['color'] ] ){
                countId[ combo['color'] ] = combo['amount'];
            }
        }
    });
    var countArr = getArrayOfObjectValue(countId);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkComboColorStrongByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = (id in COUNT_STRONG) ? COUNT_STRONG[id] : 0;
    }

    var countArr = getArrayOfObjectValue(countId);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}

//==============================================================
// check Team members 
//==============================================================
function checkMembersColorByConfig( config ){
    var countColor = {};
    var check = true;
    for(var c of config['colors'] ){
        countColor[c] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['color'] in countColor ){
            countColor[ member['color'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countColor ){
            countColor[ 'OTHER' ] += 1;
        }
    });
    var countArr = getArrayOfObjectValue(countColor);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkMembersColorVarietyByConfig(config){
    var countColor = {};
    var check = 0;
    for(var c of config['colors'] ){
        countColor[c] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['color'] in countColor ){
            countColor[ member['color'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countColor ){
            countColor[ 'OTHER' ] += 1;
        }
    });
    for(var c of config['colors']){
        if( countColor[c] >= 1 ){
            check +=1;
        }
    }
    return check >= config['check'];
}
function checkMembersTypeByConfig( config ){
    var countType = {};
    var check = true;
    for(var type of config['types']){
        countType[type] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['type'] in countType ){
            countType[ member['type'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countType ){
            countType[ 'OTHER' ] += 1;
        }
    });
    var countArr = getArrayOfObjectValue(countType);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkMembersTypeVarietyByConfig(config){
    var countType = {};
    var check = 0;
    for(var type of config['types']){
        countType[type] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['type'] in countType ){
            countType[ member['type'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countType ){
            countType[ 'OTHER' ] += 1;
        }
    });
    for(var type of config['types']){
        if( countType[type] >= 1 ){
            check +=1;
        }
    }
    return check >= config['check'];
}
function checkMembersIDByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['id'] in countId ){
            countId[ member['id'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countId ){
            countId[ 'OTHER' ] += 1;
        }
    });
    var countArr = getArrayOfObjectValue(countId);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkMembersIDVarietyByConfig(config){
    var countId = {};
    var check = 0;
    for(var id of config['ID']){
        countId[id] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['id'] in countId ){
            countId[ member['id'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countId ){
            countId[ 'OTHER' ] += 1;
        }
    });
    for(var id of config['ID']){
        if( countId[id] >= 1 ){
            check +=1;
        }
    }
    return check >= config['check'];
}
function checkActiveSkillIDByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = 0;
    }

    $.each(TEAM_ACTIVE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            if( active['id'] in countId ){
                countId[ active['id'] ] += 1;
            }else if( active['id'] == 'NONE' ){
            }else if( 'OTHER' in countId ){
                countId[ 'OTHER' ] += 1;
            }
        });
    });
    var countArr = getArrayOfObjectValue(countId);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkActiveCoolDownByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = 0;
    }
    
    return check;
}

function countMembrsTypeByArr( typeArr ){
    var count = 0;
    $.each(TEAM_MEMBERS, function(i, member){
        if( typeArr.indexOf( member['type'] ) >= 0 ){
            count += 1;
        }
    });
    return count;
}
function countMembrsIDByArr( typeArr ){
    var count = 0;
    $.each(TEAM_MEMBERS, function(i, member){
        if( typeArr.indexOf( member['id'] ) >= 0 ){
            count += 1;
        }
    });
    return count;
}


//==============================================================
// LastMember
//==============================================================
function increaseHARByLastMember( memberID, healthFactor, attackFactor, recoverYFactor ){
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['id'] == memberID ){
            member['health']   = Math.round( healthFactor*member['health'] );
            member['attack']   = Math.round( attackFactor*member['attack'] );
            member['recovery'] = Math.round( recoverYFactor*member['recovery'] );
            return false;
        }
    });
}
function reduceCoolDownByLastMember( memberID, activeID, coolDown ){
    $.each(TEAM_MEMBERS, function(place, member){
        if( member['id'] == memberID ){
            $.each(TEAM_ACTIVE_SKILL[place], function(i, active){
                if( active['id'] == activeID ){
                    active['variable']['COOLDOWN'] -= coolDown;
                    active['coolDown'] -= coolDown;
                    return false;
                }
            });
            return false;
        }
    });
}

//==============================================================
// StartRun function
//==============================================================
function setStartRunByPlayTypeAndTime( play_type, time ){
    setTimeLimit( time );
    setPlayType( play_type );

    MAIN_STATE = MAIN_STATE_ENUM.TIME_TO_MOVE;    
    startToRunTimer();   
}