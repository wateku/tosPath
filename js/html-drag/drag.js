
//==============================================================
// drag item analysis
//==============================================================
function resetDraggable(){
    $("#dragContainment tr td img").removeAttr("style");
    $("img.draggable").draggable({
        containment: "#dragContainment",
        zIndex: 2500,
        start: function(event, ui){
            countGridPositon(this);
            if( MAIN_STATE == MAIN_STATE_ENUM.READY ){
                initialMoveWave();
            }
        },
        drag: function(event, ui) {
            if( MAIN_STATE == MAIN_STATE_ENUM.READY ||
                MAIN_STATE == MAIN_STATE_ENUM.TIME_TO_MOVE ||
                MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
                dragPosition(this);
            }else{ return false; }
        },
        stop: function(){
            resetLocus();
            closeCanvas();
            if( MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
                endPosition(this);
            }
            if( PLAY_TYPE == PLAY_TYPE_ENUM.FREE && MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
                HISTORY.push(null);
                resetDraggable();
                startDragging();
            }else if( PLAY_TYPE == PLAY_TYPE_ENUM.DRAG && MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
                endMoveWave();
            }else{
                resetDraggable();
                startDragging();
            }
        },
    });
}

function stopDragging(){
    MOVE_OUT_OF_TIME = true;
    $("#dragContainment tr td img").removeAttr("style");
    $("img.draggable").draggable({ disabled: true });
}
function startDragging(){
    MOVE_OUT_OF_TIME = false;
    $("img.draggable").draggable({ disabled: false });
}

function countGridPositon(e){
    TD_INDEX = $(e).closest("td").index();
    TR_INDEX = $(e).closest("tr").index();
}

function endPosition(e){
    dragPosition(e);

    var over = $(e).clone();
    $("#dragContainment tr td").eq(TR_INDEX*TD_NUM+TD_INDEX).prepend(over);
    $(e).remove();
}

function dragPosition(e){
    $("#dragContainment tr td img").each( function(){
        if ( !$(this).is('.ui-draggable-dragging') && $(this).attr("animate") != "busy" ) {
            $(this).removeAttr('style');
        }
    } );

    var left = Math.max( 0, Math.min( $(e).offset().left - BASE_LEFT, WIDTH*(TD_NUM-1) ) );
    var top  = Math.max( 0, Math.min( $(e).offset().top  - BASE_TOP, HEIGHT*(TR_NUM-1) ) );
    var left_index = TD_INDEX;
    var top_index  = TR_INDEX;
    var left_vector = (left - (TD_INDEX*WIDTH) )/WIDTH;
    var top_vector  = (top  - (TR_INDEX*HEIGHT))/HEIGHT;
    var abs_left = Math.abs(left_vector);
    var abs_top = Math.abs(top_vector);

    if( abs_left > ACCURACY && abs_top > ACCURACY ){
        left_index += abs_left/left_vector;
        top_index  += abs_top/top_vector;
    }else if( abs_left - Math.max(abs_top-0.25,0) > ACCURACY ){
        left_index += abs_left/left_vector;
    }else if( abs_top - Math.max(abs_left-0.25,0) > ACCURACY ){
        top_index  += abs_top/top_vector;
    }

    if( left_index != TD_INDEX || top_index != TR_INDEX  ){
        if( ( MAIN_STATE == MAIN_STATE_ENUM.READY || MAIN_STATE == MAIN_STATE_ENUM.TIME_TO_MOVE )
            && !MOVE_OUT_OF_TIME ){
            //Maybe used in end attack effect
            newMoveWave();
            MAIN_STATE = MAIN_STATE_ENUM.MOVING;
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );

            // start timer
            if( TIME_IS_LIMIT && !TIME_RUNNING ){
                startToRunTimer();
            }

            // start locus
            if( LOCUS ){
                resetLocus();
                LOCUS_STACK.push( TR_INDEX*TD_NUM+TD_INDEX );
            }
        }
        if( PLAY_TYPE == PLAY_TYPE_ENUM.FREE && MAIN_STATE == MAIN_STATE_ENUM.MOVING && 
            HISTORY.slice(-1)[0] == null ){
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );   
            // start locus
            if( LOCUS ){
                resetLocus();
                LOCUS_STACK.push( TR_INDEX*TD_NUM+TD_INDEX );
            }         
        }

        var td_base = $("#dragContainment tr td").eq(TR_INDEX*TD_NUM+TD_INDEX);
        var td_goal = $("#dragContainment tr td").eq(top_index*TD_NUM+left_index);
        var items = $(td_base).find("img");
        var item_base = $(td_base).find("img.under");
        var item_goal = $(td_goal).find("img");

        if( $(td_goal).children().length > 0 ){
            var offset_base = $(item_base).offset();
            var offset_goal = $(item_goal).offset();
            var top_vector = (offset_base.top - offset_goal.top);
            var left_vector = (offset_base.left - offset_goal.left);

            items.remove();
            item_goal.remove();
            $(td_base).append(item_goal);
            $(td_goal).append(items);

            $(item_base).offset(offset_goal);
            $(item_goal).offset(offset_goal);
            $(item_goal).attr("animate","busy");
            $(item_goal).animate( { top: "+="+top_vector+"px",left: "+="+left_vector+"px"},
                                  { duration: DRAG_ANIMATE_TIME,
                                        complete: function(){
                                            $(this).removeAttr("animate");
                                        } } );
        }else{
            items.remove();
            $(td_goal).append(items);
            $(item_base).offset(offset_goal);
        }
        
        TD_INDEX = left_index;
        TR_INDEX = top_index;
        HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );
        HISTORY_SHOW += 1;
        setHistoryShow();

        locusUpdate( TR_INDEX*TD_NUM+TD_INDEX );
        checkInhibit(td_goal, item_base, item_goal);
    }
}

//==============================================================
// inhibit frozen locus
//==============================================================
function checkInhibit(td_goal, item_base, item_goal){
    if( $(td_goal).children().length > 0 ){
        //檢查風化
        if( $(item_base).attr("inhibit") || $(item_goal).attr("inhibit") ){
            $("#dragContainment tr td img").removeAttr("style");      
            playAudioWrong();
            MOVE_OUT_OF_TIME = true;
            if( !TIME_IS_LIMIT ){
                TIME_RUNNING = false;
                endMoveWave();
            }
        }else if( LOCUS && LOCUS_TYPE == "rot" ){
            var index = LOCUS_STACK.indexOf( HISTORY.slice(-1)[0] );
            if( index >= 0 && index < LOCUS_STACK.length-1 ){
                $("#dragContainment tr td img").removeAttr("style");      
                playAudioWrong();
                MOVE_OUT_OF_TIME = true;
                if( !TIME_IS_LIMIT ){
                    TIME_RUNNING = false;
                    endMoveWave();
                }
            }
        }
    }
}

function frozenUpdate(){
    $("#dragContainment tr td img").each( function() {
        if( $(this).attr("frozen") ){
            var next_frozen = parseInt( $(this).attr("frozen") )+1;
            var item = $(this).attr("item");
            if( next_frozen > 3 ){
                $(this).removeAttr("frozen");
                item = item.substr(0, item.indexOf("i"))+item.substr(item.indexOf("i")+2);
            }else{
                $(this).attr("frozen", next_frozen);
                item = item.substr(0, item.indexOf("i")+1)+next_frozen+item.substr(item.indexOf("i")+2);
            }
            $(this).attr("item", item);
            $(this).attr("src", mapImgSrc(item) );
        }
    });
}

function resetLocus(){
    LOCUS_STACK = [];
    for( var i = 0; i < TR_NUM*TD_NUM; i++ ){
        if( $("#dragContainment tr td").eq(i).children().length > 0 ){
            var imgs = $("#dragContainment tr td").eq(i).find("img");
            imgs.attr('src', mapImgSrc( imgs.attr("item") ) );
        }
    }
    
    if( LOCUS_TYPE == 'fire' || LOCUS_TYPE == 'rot' ){
        resetCanvas();
    }
}

function locusUpdate( id ){
    if( !LOCUS || LOCUS_STACK.length == 0 ){ return; }

    var last = LOCUS_STACK.slice(-1)[0];
    if( LOCUS_TYPE == '_' || LOCUS_TYPE == 'q' ){
        var imgs = $("#dragContainment tr td").eq(last).find("img");
        imgs.attr('src', mapImgSrc( imgs.attr("item")+LOCUS_TYPE ) );

    }else if( LOCUS_TYPE == 'rot' && LOCUS_STACK.length ){
        var startX = parseInt( id%TD_NUM )*WIDTH +WIDTH/2;
        var startY = parseInt( id/TD_NUM )*HEIGHT+HEIGHT/2;
        var goalX  = parseInt( last%TD_NUM ) *WIDTH +WIDTH/2;
        var goalY  = parseInt( last/TD_NUM ) *HEIGHT+HEIGHT/2;

        $('#dragCanvas').drawLine({
            strokeStyle: 'rgba(50, 200, 50, 0.8)',
            strokeWidth: 30,         rounded: true,
            layer: true,
            x1: startX,             y1: startY,
            x2: goalX,              y2: goalY
        });
    }else if( LOCUS_TYPE == 'fire' && LOCUS_STACK.length ){
        var startX = parseInt( id%TD_NUM )*WIDTH +WIDTH/2;
        var startY = parseInt( id/TD_NUM )*HEIGHT+HEIGHT/2;
        var goalX  = parseInt( last%TD_NUM ) *WIDTH +WIDTH/2;
        var goalY  = parseInt( last/TD_NUM ) *HEIGHT+HEIGHT/2;

        $('#dragCanvas').drawLine({
            strokeStyle: 'rgba(200, 0, 50, 0.8)',
            strokeWidth: 30,         rounded: true,
            layer: true,
            x1: startX,             y1: startY,
            x2: goalX,              y2: goalY
        });
    }

    LOCUS_STACK.push(id);
    while( LOCUS_STACK.length > LOCUS_LENGTH ){
        var pop = LOCUS_STACK.shift();

        if( LOCUS_TYPE == '_' || LOCUS_TYPE == 'q' ){
            var imgs = $("#dragContainment tr td").eq(pop).find("img");
            imgs.attr('src', mapImgSrc( imgs.attr("item") ) );
        }else if( LOCUS_TYPE == 'fire' || LOCUS_TYPE == "rot" ){
            $('#dragCanvas').removeLayer(0).drawLayers();
        }
    }

}

//==============================================================
// timer
//==============================================================
function countTimeLimit(){
    if( !TIME_IS_LIMIT ){ return false; }
    TIME_LIMIT = 5;
    if( TIME_FIXED ){
        if( TIME_FIX_LIST.length > 0 ){
            TIME_LIMIT = TIME_FIX_LIST[ TIME_FIX_LIST.length-1 ];
            TIME_FIX_LIST = [];
        }
    }else{
        for( var key in TIME_ADD_LIST ){
            TIME_LIMIT += TIME_ADD_LIST[key];
        }
        for( var key in TIME_MULTI_LIST ){
            TIME_LIMIT *= TIME_MULTI_LIST[key];
        }
    }
    TIME_LIMIT = Math.max( 1, TIME_LIMIT );
    setTimeLimit(TIME_LIMIT);
}
function startToRunTimer(){
    checkAdditionEffectByKey( 'setTime' );
    countTimeLimit();

    START_TIME = new Date().getTime() / 1000;
    TIME_RUNNING = true;
    TIME_INTERVAL = setInterval( function(){ dragTimer(); }, 10);
    switchTimeLifeToTime();
}
function dragTimer(){
    showTime();

    var now = new Date().getTime() / 1000;  
    if( TIME_IS_LIMIT && ( (now - START_TIME) > TIME_LIMIT || MOVE_OUT_OF_TIME )  ){
        MOVE_OUT_OF_TIME = true;
        TIME_RUNNING = false;

        if( MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
            endMoveWave();
        }else{
            checkActiveSkillByKey("end");
            restartMoveWave();
        }
    }
}

//==============================================================
// table color group analysis
//==============================================================
function countColor(){
    //count for straight
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j ++){
            var set = new Set();
            var now = j*TD_NUM+i;
            var color = $("#dragContainment tr td").eq(now).find("img.over").attr("color");
            var frozen = $("#dragContainment tr td").eq(now).find("img.over").attr("frozen");
            if( frozen ){
                if( parseInt(frozen) > 0 ){ continue; }
            }

            set.add(now);
            while( j < TR_NUM-1 ){
                var next = (j+1)*TD_NUM+i;
                var next_color = $("#dragContainment tr td").eq(next).find("img.over").attr("color");
                var next_frozen = $("#dragContainment tr td").eq(next).find("img.over").attr("frozen");
                if( next_frozen ){
                    if( parseInt(next_frozen) > 0 ){
                        break;
                    }
                }

                if( color && color == next_color ){
                    set.add(next);
                    j++;
                }else{
                    break;
                }
            }
            if( set.size >= SET_SIZE[color] ){
                COLOR_SETS[color].push(new Set(set));
                COLOR_SETS_PREPARE[color].push( new Set(set) );
                STRAIGHT_SETS[i].push(new Set(set));
            }
        }
    }
    //count for horizontal
    for(var i = 0; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j ++){
            var set = new Set();
            var now = i*TD_NUM+j;
            var color = $("#dragContainment tr td").eq(now).find("img.over").attr("color");
            var frozen = $("#dragContainment tr td").eq(now).find("img.over").attr("frozen");
            if( frozen ){
                if( parseInt(frozen) > 0 ){ continue; }
            }

            set.add(now);
            while( j < TD_NUM-1 ){
                var next = i*TD_NUM+j+1;
                var next_color = $("#dragContainment tr td").eq(next).find("img.over").attr("color");
                var next_frozen = $("#dragContainment tr td").eq(next).find("img.over").attr("frozen");
                if( next_frozen ){
                    if( parseInt(next_frozen) > 0 ){
                        break;
                    }
                }

                if( color && color == next_color ){
                    set.add(next);
                    j++;
                }else{
                    break;
                }
            }
            if( set.size >= SET_SIZE[color] ){
                COLOR_SETS[color].push(new Set(set));
                COLOR_SETS_PREPARE[color].push(new Set(set));
                HORIZONTAL_SETS[i].push(new Set(set));
            }
        }
    }
}

function countGroup(){
    for(var key in COLOR_SETS_PREPARE){        
        while( COLOR_SETS_PREPARE[ key ].length > 0 ){
            var set = COLOR_SETS_PREPARE[ key ].pop();
            var setArr = Array.from(set);
            for(var id of setArr){
                for(var already_set of GROUP_SETS_PREPARE[ key ] ){
                    if(   already_set.has(id)                                           ||
                        ( already_set.has(id+1)      && id%TD_NUM < TD_NUM-1          ) ||
                        ( already_set.has(id-1)      && id%TD_NUM > 0                 ) ||
                        ( already_set.has(id+TD_NUM) && id        < TD_NUM*(TR_NUM-1) ) ||
                        ( already_set.has(id-TD_NUM) && id        >= TD_NUM           ) ){
                        for(var already_i of already_set){
                            set.add(already_i);
                        }
                        GROUP_SETS_PREPARE[ key ].splice( GROUP_SETS_PREPARE[ key ].indexOf( already_set ), 1);
                    }
                }
            }

            GROUP_SETS_PREPARE[ key ].push(set);
        }
    }

    for( var key in GROUP_SETS_PREPARE ){
        for( var set of GROUP_SETS_PREPARE[ key ] ){
            if( set.size >= GROUP_SIZE[key] ){
                GROUP_SETS[ key ].push(set);
            }
        }
    }

    ALL_GROUP_SET_STACK.push({
        'GROUP_SETS'        : GROUP_SETS,
        'STRAIGHT_SETS'     : STRAIGHT_SETS,
        'HORIZONTAL_SETS'   : HORIZONTAL_SETS
    });
}

function countComboStack(){
    var num = 0;
    for(var color in GROUP_SETS){
        num += GROUP_SETS[color].length;
        for(var set of GROUP_SETS[color]){
            var strong_amount = 0;
            for(var i of set){
                if( parseInt( $("#dragContainment tr td img.over ").eq(i).attr('strong') ) > 0 ){
                    strong_amount += 1;
                }
            }

            var combo = {
                color         : color,
                drop_wave     : DROP_WAVES,
                amount        : set.size,
                strong_amount : strong_amount,
                set           : set,
            }; 

            COMBO_STACK.push(combo);
            COMBO_TIMES += 1;
        }
    }
    return num;
}

//==============================================================
// remove & new group
//==============================================================
function removeGroups(next){
    var i = next;
    for( ; i >= 0; i--){
        if( REMOVE_STACK.indexOf(i) >= 0 ){ continue; }
        var isSet = inGroup(i);
        if( isSet ){
            setTimeout( function(){
                removePeriod(isSet, i-1);
            }, REMOVE_TIME );
            break;
        }
    }
    if( i < 0 ){
        newGroups();
    }
}
function removePeriod(set, next){
    var setArr = Array.from(set);
    var comboSet = makeComboSet( Array.from(set) );
    for(var id of setArr){
        REMOVE_STACK.push(id);
        $("#dragContainment tr td").eq(id).find("img").fadeOut( FADEOUT_TIME, function (){
            $(this).remove();
        });
    }
    COMBO_SHOW += 1;
    setComboShow();
    addComboSet(comboSet);
    playAudioRemove();

    // greek skill extracombo
    checkTeamSkillByKey( 'extraCombo' );

    setTimeout( function(){
        removeGroups(next-1);
    }, FADEOUT_TIME );
}
function inGroup(id){
    for(var key in GROUP_SETS){
        for(var set of GROUP_SETS[key]){
            if( set.has(id) ){
                return set;
            }
        }
    }
    return false;
}

function newGroups(){

    REMOVE_STACK.sort(function(a, b){return a-b});

    //  希臘/巴比隊長技使用
    checkLeaderSkillByKey( 'newItem' );
    checkTeamSkillByKey( 'newItem' );
    checkAdditionEffectByKey( 'newItem' );

    for(var color in GROUP_SETS){
        for(var set of GROUP_SETS[color]){
            if( set.size >= 5 ){
                var rand_i = Math.floor( randomBySeed() * REMOVE_STACK.length );
                var id = REMOVE_STACK[rand_i];
                REMOVE_STACK.splice(rand_i,1);
                STRONG_STACK[id] = color+'+';
            }
        }
    }
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        if( REMOVE_STACK.indexOf(i) >= 0 ){
            if( DROPABLE ){
                var elements = newElementByID(i);
                if( elements ){
                    DROP_STACK[i%TD_NUM].push( elements );
                }
            }
        }else if( i in STRONG_STACK ){
            if( DROPABLE ){
                var elements = newElementByItem(STRONG_STACK[i]);
                if( elements ){
                    DROP_STACK[i%TD_NUM].push( elements );
                }
            }
        }
    }

    setTimeout( function(){
        DROP_WAVES += 1;
        dropGroups();
    }, REMOVE_TIME);
}

//==============================================================
// drop new element from stack
//==============================================================
function dropGroups(){

    for(var i = 0; i < TD_NUM; i++){
        var num = 0;
        var length = DROP_STACK[i].length;
        for(var j = TR_NUM-1; j >= 0; j--){
            if( $("#dragContainment tr td").eq(j*TD_NUM+i).children().length == 0 ){
                num++;
            }else{
                if( num > 0 ){
                    var imgs = $("#dragContainment tr td").eq(j*TD_NUM+i).find("img").remove();
                    $(imgs).attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP+j*HEIGHT);
                    $("#dragContainment tr td").eq((j+num)*TD_NUM+i).append(imgs);
                }
            }
        }
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
            max_drop = Math.max( $(this).attr("drop"), max_drop );
            $(this).offset({top: $(this).attr("toTop"), left: $(this).attr("toLeft")});
            $(this).animate({"top": "+="+parseInt($(this).attr("drop"))*HEIGHT+"px" },
                            {duration: parseInt($(this).attr("drop"))*DROP_TIME});
            $(this).removeAttr("drop").removeAttr("toTop").removeAttr("toLeft");
        }
    });

    setTimeout( function(){
        checkGroups();
    }, max_drop*DROP_TIME );
}
