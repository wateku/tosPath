
//==============================================================
// reset
//==============================================================
function resetHistory(){
    HISTORY_SHOW = 0;
    HISTORY_RANDOM =  COLOR_RANDOM;
    HISTORY_SKILL_VARIABLE = saveSkillVariable();
    HISTORY_TEAM_MEMBER = saveTeamMembers();
    HISTORY = [];
    INITIAL_PANEL = [];
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        if( $("#dragContainment tr td").eq(i).find("img") == 0 ){
            INITIAL_PANEL.push( undefined );
        }else{
            try{
                var item = $("#dragContainment tr td").eq(i).find("img.over").attr("item");
                INITIAL_PANEL.push( item );
            }catch(e){
                INITIAL_PANEL.push( undefined );
            }
        }
    }
    FINAL_PANEL = [];
}
function recordFinal(){
    FINAL_PANEL = [];
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        if( $("#dragContainment tr td").eq(i).find("img") == 0 ){
            INITIAL_PANEL.push( undefined );
        }else{
            try{
                var item = $("#dragContainment tr td").eq(i).find("img.under").attr("item");
                FINAL_PANEL.push( item );
            }catch(e){
                FINAL_PANEL.push( undefined );
            }
        }
    }

    var record = LZString.compressToEncodedURIComponent( parseDownloadJson() );
    var url = $.url("hostname")+$.url("path")+"?record="+record;
    $('#clipboard').attr("data-clipboard-text", url);
}

//==============================================================
// show history path
//==============================================================
function backInitColor(){
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        $("#dragContainment tr td").eq(i).children().remove();
        if( i < INITIAL_PANEL.length && INITIAL_PANEL[i] ){
            var item = INITIAL_PANEL[i];
            if( item ){
                $("#dragContainment tr td").eq(i).append( newElementByItem(item) );
            }
        }
    }
}
function backFinalColor(){
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        $("#dragContainment tr td").eq(i).children().remove();
        if( i < FINAL_PANEL.length && FINAL_PANEL[i] ){
            var item = FINAL_PANEL[i];
            if( item ){
                $("#dragContainment tr td").eq(i).append( newElementByItem(item) );
            }
        }
    }
}
    

function drawPath(){
    //clean prepare
    var line_history = [];
    var shift_analysis = {};
    var i = 0;
    var line_index = 0;
    while( i < HISTORY.length-1 && HISTORY[i] != null && HISTORY[i+1] != null ){
        var start = HISTORY[i];
        var goal = HISTORY[i+1];
        var vector = goal - start;
        var line_stack = [];
        if( i > 0 ){
            var pre_line = ( HISTORY[i-1] == null ) ? 'null' :'connectLine';
        }else{
            var pre_line = 'null';
        }

        line_stack.push( HISTORY[i] );
        line_stack.push( HISTORY[i+1] );

        var next_line = 'null';
        for(var j = ++i; j < HISTORY.length-1; j++ ){
            if( HISTORY[j+1] == null ){
                i = j+2;
                next_line = 'null';
                break;
            }
            var next_vector = HISTORY[j+1] - HISTORY[j];
            if( next_vector != vector ){
                if( next_vector == vector*(-1) ){
                    next_line = 'returnLine';
                }else{
                    next_line = 'connectLine';
                }
                break;
            }else{
                line_stack.push( HISTORY[j+1] );
                goal = HISTORY[j+1];
                i = j+1;
            }
        }

        var shift = findEmptyShift( shift_analysis, line_stack, mapVector(vector) );
        for(var id of line_stack){
            saveShiftTotal( shift_analysis, id, mapVector(vector), shift );
        }

        line_history.push({ 
            'start' : start,
            'goal'  : goal,
            'vector': mapVector(vector),
            'shift' : shift,
            'line_index': line_index,
            'pre_line'  : pre_line,
            'next_line' : next_line,
            'array' : line_stack
        });
        line_index++;
        if( next_line == 'returnLine' ){
            var self_stack = [ goal, goal ];
            var shift = findEmptyShift( shift_analysis, self_stack, mapReverseVector(vector) );
            saveShiftTotal( shift_analysis, goal, mapReverseVector(vector), shift );
            line_history.push({
                'start' : goal,
                'goal'  : goal,
                'vector': mapReverseVector(vector),
                'shift' : shift,
                'line_index': line_index,
                'pre_line'  : 'connectLine',
                'next_line' : 'connectLine',
                'array' : self_stack
            });
            line_index++;
        }
    }

    for(var l = 0; l < line_history.length; l++ ){
        var line = line_history[l];
        var start = line['start'];
        var goal = line['goal'];
        var vector = line['vector'];

        var startX = parseInt( line['start']%TD_NUM )*WIDTH +WIDTH/2;
        var startY = parseInt( line['start']/TD_NUM )*HEIGHT+HEIGHT/2;
        var goalX  = parseInt( line['goal']%TD_NUM ) *WIDTH +WIDTH/2;
        var goalY  = parseInt( line['goal']/TD_NUM ) *HEIGHT+HEIGHT/2;

        var start_shift = makeShiftBias(shift_analysis, line, vector);

        if(vector == "STRAIGHT"){
            startX += start_shift;
            goalX  += start_shift;
        }else if(vector == "HORIZONTAL"){
            startY += start_shift;
            goalY  += start_shift;
        }
        
        if( line['pre_line'] != 'null' ){
            var pre_line = line_history[l-1];
            var pre_vector = pre_line['vector'];
            var pre_shift = makeShiftBias(shift_analysis, pre_line, pre_vector);

            if(pre_vector == "STRAIGHT"){
                startX += pre_shift;
            }else if(pre_vector == "HORIZONTAL"){
                startY += pre_shift;
            }
        }

        if( line['next_line'] != 'null' ){
            var next_line = line_history[l+1];
            var next_vector = next_line['vector'];
            var goal_shift = makeShiftBias(shift_analysis, next_line, next_vector);

            if(next_vector == "STRAIGHT"){
                goalX  += goal_shift;
            }else if(next_vector == "HORIZONTAL"){
                goalY  += goal_shift;
            }
        }

        $('#dragCanvas').drawLine({
            strokeStyle: 'black',  fillStyle: 'black',
            strokeWidth: 5,         rounded: true,
            x1: startX,             y1: startY,
            x2: goalX,              y2: goalY
        }).drawLine({
            strokeStyle: 'white',
            strokeWidth: 3,         rounded: true,
            x1: startX,             y1: startY,
            x2: goalX,              y2: goalY
        });
    }

    if( line_history.length > 1 ){
        drawTerminalCircle( shift_analysis, line_history[0], 'start' );
        drawTerminalCircle( shift_analysis, line_history[ line_history.length-1 ], 'goal' );
    }
}
function findEmptyShift( shift_analysis, array, vector ){
    var total_shift = new Set();
    for(var id of array){
        if( id in shift_analysis ){
            if( vector in shift_analysis[ id ] ){
                for(var shift of shift_analysis[ id ][vector] ){
                    if( !(shift in total_shift) ){
                        total_shift.add(shift);
                    }
                }
            }
        }
    }
    var max_shift = 0;
    while( total_shift.has(max_shift) ){
        max_shift++;
    }
    return max_shift;
}
function saveShiftTotal( shift_analysis, id, vector, shift ){
    if( id in shift_analysis ){
        if( vector in shift_analysis[ id ] ){
            shift_analysis[ id ][vector].push(shift);            
            shift_analysis[ id ][vector].sort();
        }else{
            shift_analysis[ id ][vector] = [ shift ];
        }
    }else{
        shift_analysis[ id ] = {};
        shift_analysis[ id ][vector] = [ shift ];
    }
}
function mapVector(vector){
    if( vector == 6 || vector == -6 ){ return 'STRAIGHT'; }
    if( vector == 1 || vector == -1 ){ return 'HORIZONTAL'; }
    if( vector == 7 || vector == -7 ){ return 'NEGATIVE'; }
    if( vector == 5 || vector == -5 ){ return 'POSITIVE'; }
}
function mapReverseVector(vector){
    if( vector == 6 || vector == -6 ){ return 'HORIZONTAL'; }
    if( vector == 1 || vector == -1 ){ return 'STRAIGHT'; }
    if( vector == 7 || vector == -7 ){ return 'POSITIVE'; }
    if( vector == 5 || vector == -5 ){ return 'NEGATIVE'; }
}
function makeShiftBias(shift_analysis, line, vector){
    var max_shift = 0;
    for(var id of line['array']){
        var arr = shift_analysis[id][vector];
        max_shift = Math.max( arr[ arr.length-1 ], max_shift );
    }
    var shift = 2*line['shift'] - max_shift;
    var shift_bias = Math.min( MAX_SHIFT, max_shift*MIN_SHIFT ) / (max_shift+1);
    return shift * shift_bias;
}
function drawTerminalCircle(shift_analysis, line, terminal){    
    var point = line[terminal];
    var vector = line['vector'];
    var pointX = parseInt(point%TD_NUM)*WIDTH +WIDTH/2;
    var pointY = parseInt(point/TD_NUM)*HEIGHT+HEIGHT/2;
    var shift = makeShiftBias(shift_analysis, line, vector);

    if(vector == "STRAIGHT"){
        pointX += shift;
    }else if(vector == "HORIZONTAL"){
        pointY += shift;
    }

    color = (terminal == 'start') ? 'SpringGreen' : 'red';
    $('#dragCanvas').drawArc({
        fillStyle: color,
        strokeStyle: 'black',   strokeWidth: 3,
        x: pointX,              y: pointY,
        radius: 6,
    });
}

//==============================================================
//  replay history
//==============================================================
function replayHistory(){
    var i = 0;
    hafStartMove(i);
}
function hafStartMove(i){
    if( i < HISTORY.length-1 && HISTORY[i] != null && HISTORY[i+1] != null ){
        var id_start = HISTORY[i];
        var id_goal = HISTORY[i+1];
        var imgs_start = $("#dragContainment tr td").eq(id_start).find("img.over");
        var imgs_goal = $("#dragContainment tr td").eq(id_goal).find("img");
        if( $("#dragContainment tr td").eq(id_goal).children().length == 0 ){
            var imgs_goal = $("#dragContainment tr td").eq(id_goal);
        }
        var offset_start = $(imgs_start).offset();
        var offset_goal = $(imgs_goal).offset();
        var top_vector = offset_goal.top - offset_start.top;
        var left_vector = offset_goal.left - offset_start.left;
        $(imgs_start).offset(offset_start).zIndex(5);
        $(imgs_start).animate({top: "+="+top_vector+"px", left: "+="+left_vector+"px"},
                            {duration: REPLAY_SPEED} );

        setTimeout( function(){
            hafGoalMove(i);
        }, REPLAY_SPEED/2);
    }else{
        endReplayHistory();
    }
}
function hafGoalMove(i){
    if( i < HISTORY.length-1 && HISTORY[i] != null && HISTORY[i+1] != null ){
        var id_base = HISTORY[i];
        var id_goal = HISTORY[i+1];
        var imgs_base = $("#dragContainment tr td").eq(id_base).find("img.under");
        var imgs_goal = $("#dragContainment tr td").eq(id_goal).find("img");
        if( $("#dragContainment tr td").eq(id_goal).children().length == 0 ){
            var imgs_goal = $("#dragContainment tr td").eq(id_goal);
        }
        var offset_base = $(imgs_base).offset();
        var offset_goal = $(imgs_goal).offset();
        var top_vector = (offset_base.top - offset_goal.top);
        var left_vector = (offset_base.left - offset_goal.left);

        var imgs = $("#dragContainment tr td").eq(id_base).find("img").remove();
        var imgs2 = $("#dragContainment tr td").eq(id_goal).find("img").remove();
        $("#dragContainment tr td").eq(id_base).append(imgs2);
        $("#dragContainment tr td").eq(id_goal).append(imgs);

        $(imgs_base).offset(offset_goal);
        if( $("#dragContainment tr td").eq(id_goal).children().length == 0 ){
            $(imgs_goal).offset(offset_goal);
            $(imgs_goal).animate({top: "+="+top_vector+"px",left: "+="+left_vector+"px"},
                                {duration: REPLAY_SPEED/3} );
        }

        setTimeout( function(){
            var next = i+1;
            while( next < HISTORY.length-1 && ( HISTORY[next] == null || HISTORY[next+1] == null ) ){
                next++;
            }
            hafStartMove(next);
        }, REPLAY_SPEED/2);
    }
}

//==============================================================
// download & upload
//==============================================================
function download()
{
    var textToWrite = parseDownloadJson();
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = "data";
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        downloadLink.click();
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}
function parseDownloadJson(){
    var json = [
        TD_NUM,
        TR_NUM,

        HISTORY,
        HISTORY_SHOW, 
        INITIAL_PANEL,
        FINAL_PANEL,
        HISTORY_RANDOM,

        DROPABLE,

        COLORS,
        COLOR_PROB,
        COLOR_MAP,
        GROUP_SIZE,

        HISTORY_TEAM_MEMBER,
        HISTORY_SKILL_VARIABLE,
    ];
    return JSON.stringify(json);
}

function upload()
{
    var fileToLoad = $("#file")[0].files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        parseUploadJson(textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}
function parseUploadJson(msg){

    try{
        var json = JSON.parse(msg);
        TD_NUM                 = json[0];
        TR_NUM                 = json[1];
        $("#dragContainment").attr("td", TD_NUM).attr("tr", TR_NUM);

        HISTORY                = json[2];
        HISTORY_SHOW           = json[3];
        INITIAL_PANEL          = json[4];
        FINAL_PANEL            = json[5];
        HISTORY_RANDOM         = json[6];
        COLOR_RANDOM = HISTORY_RANDOM;

        DROPABLE               = json[7];        
        if( DROPABLE ){
            $("#dropable").text("隨機落珠");
        }

        COLORS                 = json[8];
        COLOR_PROB             = json[9];
        COLOR_MAP              = json[10];
        GROUP_SIZE             = json[11];

        HISTORY_TEAM_MEMBER    = json[12];
        HISTORY_SKILL_VARIABLE = json[13];
        loadTeamMembers(HISTORY_TEAM_MEMBER);
        resetMemberSelect();
        resetTeamMembers();
        loadSkillVariable(HISTORY_SKILL_VARIABLE);

        if( INITIAL_PANEL.length > 0 ){
            initialTable();
            resetBase();
            backInitColor();
            nextMoveWave();
            setHistoryShow();
        }

    }catch(e){
       alert("檔案讀取失敗！！\n"+e);
        newRandomPlain();
    }
}