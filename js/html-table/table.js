//==============================================================================
// add jquery function
//==============================================================================
$.fn.extend({ 
  moveRow: function(oldPosition, newPosition) { 
    return this.each(function(){ 

        var old_rowspan = parseInt( $(this).find('tr').eq(oldPosition).attr('maxSpan') );
        var new_rowspan = parseInt( $(this).find('tr').eq(newPosition).attr('maxSpan') );
        //console.log(old_rowspan+'>'+new_rowspan);

        if( oldPosition > newPosition ){
            for(var i = 0; i < old_rowspan; i++){
                //console.log((oldPosition+i)+'>'+(newPosition+i));
                var row = $(this).find('tr').eq(oldPosition+i).remove(); 
                $(this).find('tr').eq(newPosition+i).before(row);  
            }
        }else{
            for(var i = 0; i < old_rowspan; i++){
                //console.log(oldPosition+'>'+(newPosition-1+new_rowspan-1+i));
                var row = $(this).find('tr').eq(oldPosition).remove(); 
                $(this).find('tr').eq(newPosition-1+new_rowspan-1).after(row); 
            }
        }        
    }); 
   } 
 });
$.fn.extend({ 
  moveOption: function(oldPosition, newPosition) { 
    return this.each(function(){ 
        if( oldPosition > newPosition ){
            var row = $(this).find('option').eq(oldPosition).remove(); 
            $(this).find('option').eq(newPosition).before(row); 
        }else{
            var row = $(this).find('option').eq(oldPosition).remove(); 
            $(this).find('option').eq(newPosition-1).after(row); 
        }        
    }); 
   } 
 }); 
jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

jQuery.fn.visibilityToggle = function() {
    return this.css('visibility', function(i, visibility) {
        return (visibility == 'visible') ? 'hidden' : 'visible';
    });
};

$("#trSelect").change(function() {
    if( $("#"+$(this).find(':selected').val()).is(":visible") ){
        show_tr_button();
    }else{
        hide_tr_button();
    }
});
$("#trSelect1").change(function() {
    if( $("#"+$(this).find(':selected').val()).is(":visible") ){
        show_tr1_button();
    }else{
        hide_tr1_button();
    }
});
$("#trSelect2").change(function() {
    if( $("#"+$(this).find(':selected').val()).is(":visible") ){
        show_tr2_button();
    }else{
        hide_tr2_button();
    }
});
$("#file").change(function () {
    if( $(this).val() !== '' ){
        upload();
    }
});
$("#levelSelect").change(function () {
    $("table img").each(function(){
        if( !$(this).attr("src") ){ return; }
        var src_split = $(this).attr("src").split("/");
        switch( $("#levelSelect").val() ) {
            case "0":
                $(this).attr("level", 1);
                break;
            case "1":
                $(this).attr("level", $(this).attr("maxLv"));
                break;
            case "2":
            default:
                break;
        }
        src_split[src_split.length-1] = $(this).attr("element")+$(this).attr("level")+$(this).attr("row")+".png";
        $(this).attr("src",src_split.join("/"));
    });
});

function scroll_top(){
    $("html, body").animate({ scrollTop: 0 }, "fast");
};
function scroll_bottom(){
    $("html, body").animate({ scrollTop: $(document).height() }, "fast");
};
function hide_navbar(){
    $('.navbar-fixed-top').autoHidingNavbar('hide');
}

//==============================================================================
// $( document ).ready
//==============================================================================
$( document ).ready(function() {
    console.log( "ready!" );
    $(".navbar-fixed-top").autoHidingNavbar();
    load_table();
    load_select();
});

//==============================================================================
// load table
//==============================================================================
function load_table(){
    for(var i = 0; i < data.length; i++){
        add_tr( $("#table"), data[ i ], i );
    }
}
function add_tr(table, trData, index){
    var rowspan = trData["maxLv"].length;
    for( var i = 0; i < rowspan; i++ ){
        var id = "tr"+trData["rarity"]+trData["id"];
        var tr =  $("<tr></tr>").attr("maxSpan", rowspan).attr("nowSpan",i).attr("name",id);
        tr.attr("order", trData["id"]).attr("rarity", trData["rarity"]).attr("type",trData["type"]);
        if( i == 0 ){            
            tr.attr("id",id);
            var fst_td = $("<td></td>").attr("rowspan",rowspan).attr("class","fst-td");
            var name = $("<h3></h3>").text(trData["name"]);
            if( !trData["label"] ){
                fst_td.hide();
            }
            tr.append( fst_td.append(name) );
        }
        if( !trData["trDisplay"] ){
            tr.hide();
        }
        for(var n = 0; n < 5; n++ ){
            var maxlv = trData["maxLv"][i][n];
            var img = $("<img></img>").attr("onclick","toggle_gray(this)");
            if( maxlv ){
                if( trData["level"] ){
                    img.attr("level", trData["level"][i][n]);  
                }else{
                    img.attr("level",1);                
                }
                var row = rowspan > 1 ? "-"+(i+1) : "" ;
                var element = "wfpld"[n];
                var src = "img/"+trData["rarity"]+"/"+trData["id"]+"/"+element+img.attr("level")+row+".png";
                img.attr("maxLv",maxlv).attr("row",row).attr("element",element).attr("src", src);

            }
            if( !trData["color"][i][n] ){
                img.addClass("img-gray");
            }
            var td = $("<td></td>").append(img)
            if( !trData["tdDisplay"][i][n] ){
                td.hide();
            }
            tr.append(td);
        }
        table.append(tr);
    }
}

//==============================================================================
// basic img toggle
//==============================================================================
function toggle_gray(element){
    if( $(element).hasClass("img-gray") ){
        $(element).removeClass("img-gray");
    }else{
        switch( $("#levelSelect").val() ){
            case "0":
            case "1":
            default:
                $(element).addClass("img-gray");
                break;
            case "2":
                if( $(element).attr("level") < $(element).attr("maxLv") ){
                    $(element).attr("level", parseInt( $(element).attr("level"))+1);
                }else{
                    $(element).attr("level", 1);
                    $(element).addClass("img-gray");
                }
                var src_split = $(element).attr("src").split("/");
                src_split[src_split.length-1] = $(element).attr("element")+$(element).attr("level")+$(element).attr("row")+".png";
                $(element).attr("src",src_split.join("/"));
                break;
        }
    }    
}

//==============================================================================
// button control 1 table or 2 table
//==============================================================================
function two_col(){
    $("#twoColForm").show();
    $("#oneColForm").hide();
    $("#twoCol").hide();
    $("#oneCol").show().after($("#twoCol"));
    $("#twoColRow").show();
    $("#oneColRow").hide();

    var half = Math.ceil( $('#table tr').length/2 );
    if( $('#table').find('tr').eq(half).attr("maxSpan") > 1 ){
        half += $('#table').find('tr').eq(half).attr("maxSpan") - $('#table').find('tr').eq(half).attr("nowSpan");
    }
    $("#table").find("tr").each(function(index){
        if( index < half ){
            $('#table1').find("tbody").append($(this));
        }else{
            $('#table2').find("tbody").append($(this));
        }
    });
    $("#table tr").remove();
    load_select1();
    load_select2();
}
function one_col(){    
    $("#twoColForm").hide();
    $("#oneColForm").show();
    $("#twoCol").show().after($("#oneCol"));
    $("#oneCol").hide();
    $("#twoColRow").hide();
    $("#oneColRow").show();

    $("table.card-collect tr").each(function(){
        $(this).remove();
        $('#table').find("tbody").append($(this));        
    });
    load_select();
}

//==============================================================================
// all gray/color
//==============================================================================
function all_color(){
    $('#allColor').hide();
    $('#allGray').show();
    $("table.card-collect img").each( function(){
        $(this).removeClass( "img-gray" );
    });
}
function all_gray(){
    $('#allColor').show();
    $('#allGray').hide();
    $("table.card-collect img").each( function(){
        $(this).addClass( "img-gray" );
    });
}
function select_color(){
    $("table.card-collect tr").each(function(){
        if( $("#raritySelect").val() == undefined && $("#typeSelect").val() == undefined ){
            return;
        }else if( $("#raritySelect").val() == undefined ){
            if( jQuery.inArray( $(this).attr("type"), $("#typeSelect").val() ) >=0 ){
                $(this).find("img").removeClass( "img-gray" );
            }
        }else if( $("#typeSelect").val() == undefined ){
            if( jQuery.inArray( $(this).attr("rarity"), $("#raritySelect").val() ) >=0 ){
                $(this).find("img").removeClass( "img-gray" );
            }
        }else{
            if( jQuery.inArray( $(this).attr("rarity"), $("#raritySelect").val() ) >=0 &&
                jQuery.inArray( $(this).attr("type"), $("#typeSelect").val() ) >=0 ){
                $(this).find("img").removeClass( "img-gray" );
            }
        }
    });
}
function select_gray(){
    $("table.card-collect tr").each(function(){
        if( $("#raritySelect").val() == undefined && $("#typeSelect").val() == undefined ){
            return;
        }else if( $("#raritySelect").val() == undefined ){
            if( jQuery.inArray( $(this).attr("type"), $("#typeSelect").val() ) >=0 ){
                $(this).find("img").addClass( "img-gray" );
            }
        }else if( $("#typeSelect").val() == undefined ){
            if( jQuery.inArray( $(this).attr("rarity"), $("#raritySelect").val() ) >=0 ){
                $(this).find("img").addClass( "img-gray" );
            }
        }else{
            if( jQuery.inArray( $(this).attr("rarity"), $("#raritySelect").val() ) >=0 &&
                jQuery.inArray( $(this).attr("type"), $("#typeSelect").val() ) >=0 ){
                $(this).find("img").addClass( "img-gray" );
            }
        }
    });
}

//==============================================================================
// all hide/show
//==============================================================================
function all_hide(){
    $('#allHide').hide();
    $('#allShow').show();
    $('table.card-collect tr').each(function(){
        $(this).hide();
    });
    hide_tr_button();
    hide_tr1_button();
    hide_tr2_button();
}
function all_show(){
    $('#allHide').show();
    $('#allShow').hide();
    $("table.card-collect td").each( function(){
        $(this).show();
    });
    $('table.card-collect tr').each(function(){
        $(this).show();
    });
    show_tr_button();
    show_tr1_button();
    show_tr2_button();
}
function select_hide(){    
    $("table.card-collect tr").each(function(){
        if( $("#raritySelect").val() == undefined && $("#typeSelect").val() == undefined ){
            return;
        }else if( $("#raritySelect").val() == undefined ){
            if( jQuery.inArray( $(this).attr("type"), $("#typeSelect").val() ) >= 0 ){
                $(this).hide();
            }
        }else if( $("#typeSelect").val() == undefined ){
            if( jQuery.inArray( $(this).attr("rarity"), $("#raritySelect").val() ) >= 0 ){
                $(this).hide();
            }
        }else{
            if( jQuery.inArray( $(this).attr("rarity"), $("#raritySelect").val() ) >= 0 &&
                jQuery.inArray( $(this).attr("type"), $("#typeSelect").val() ) >= 0 ){
                $(this).hide();
            }
        }
    });
}
function select_show(){
    $("table.card-collect tr").each(function(){
        if( $("#raritySelect").val() == undefined && $("#typeSelect").val() == undefined ){
            return;
        }else if( $("#raritySelect").val() == undefined ){
            if( jQuery.inArray( $(this).attr("type"), $("#typeSelect").val() ) >= 0 ){
                $(this).find("td").show();
                $(this).show();
            }
        }else if( $("#typeSelect").val() == undefined ){
            if( jQuery.inArray( $(this).attr("rarity"), $("#raritySelect").val() ) >= 0 ){
                $(this).find("td").show();
                $(this).show();
            }
        }else{
            if( jQuery.inArray( $(this).attr("rarity"), $("#raritySelect").val() ) >= 0 &&
                jQuery.inArray( $(this).attr("type"), $("#typeSelect").val() ) >= 0 ){
                $(this).find("td").show();
                $(this).show();
            }
        }
    });
}

//==============================================================================
// remove gray img and tr with all gray img
//==============================================================================
function remove_gray(){
    $("#removeGray").hide();
    $("#showGray").show();
    $("table.card-collect img").each( function(){
        if($(this).hasClass( "img-gray" )){
            $(this).closest('td').hide();
        }
    });
    removeGray('#table', '#trSelect', hide_tr_button);
    removeGray('#table1', '#trSelect1', hide_tr1_button);
    removeGray('#table2', '#trSelect2', hide_tr2_button);
}
function removeGray(table, select, func){
    //if the tr has no colored img, then hide this tr
    $(table).find('tr').each(function(){
        if( $(this).attr('nowSpan') > 0 ){
            return; 
        }else {
            var rowspan = parseInt( $(this).attr('maxSpan') );
            var img = 0; var gray = 0;
            var tr = $(this);
            for(var i = 0; i < rowspan; i++){
                img += tr.find('img').length;
                gray +=  tr.find('img.img-gray').length;
                tr = tr.next('tr');
            }
            if( img == gray ){
                tr = $(this);
                for(var i = 0; i < rowspan; i++){
                    tr.hide();
                    tr = tr.next('tr');
                }
            }
        }
    });
    //check form need to change or not
    if( !$("#"+$(select).find(":selected").val()).is(":visible") ){
        func();
    }
}

//==============================================================================
// show all img and form button
//==============================================================================
function show_gray(){
    $("#removeGray").show();
    $("#showGray").hide();
    $("img").each( function(){
        $(this).closest('td').show();
    });
    show_tr("#table", "#trSelect", show_tr_button);
    show_tr("#table1", "#trSelect1", show_tr1_button);
    show_tr("#table2", "#trSelect2", show_tr2_button);
}
function show_tr(table, select, func){
    //if the tr has no colored img, then hide this tr
    $(table).find('tr').each(function(){
        if( $(this).attr('nowSpan') > 0 ){
            return; 
        }else{
            var rowspan = parseInt( $(this).attr('maxSpan') );
            var img = 0; var gray = 0;
            var tr = $(this);
            for(var i = 0; i < rowspan; i++){
                img += tr.find('img').length;
                gray +=  tr.find('img.img-gray').length;
                tr = tr.next('tr');
            }
            if( img !== gray && gray !== 0 ){
                tr = $(this);
                for(var i = 0; i < rowspan; i++){
                    tr.show();
                    tr = tr.next('tr');
                }
            }
        }
    });
    //check form need to change or not
    if( $("#"+$(select).find(":selected").val()).is(":visible") ){
        func();
    }
}

//==============================================================================
// label show hide
//==============================================================================
function remove_label(){
    $('#removeLabel').hide();
    $('#showLabel').show();
    $('td.fst-td').each(function(){
        $(this).hide();
    });
}
function show_label(){
    $('#removeLabel').show();
    $('#showLabel').hide();
    $('td.fst-td').each(function(){
        $(this).show();
    });
}

//==============================================================================
// hide a tr
//==============================================================================
function hide_tr(){
    toggle_tr('#trSelect', '#table', show_tr_button, hide_tr_button);
}
function hide_tr1(){
    toggle_tr('#trSelect1', '#table1', show_tr1_button, hide_tr1_button);
}
function hide_tr2(){
    toggle_tr('#trSelect2', '#table2', show_tr2_button, hide_tr2_button);
}
function toggle_tr(select, table, show, hide){
    var index = $( "#"+$(select).find(":selected").val() ).index();
    var name = $( "#"+$(select).find(":selected").val() ).attr("name");
    $("table.card-collect [name='"+name+"']").each(function(){
        $(this).toggle();
    });
    if( $(table).find('tr').eq(index).is(":visible") ){
        show();
    }else{
        hide();
    }
}

//==============================================================================
// moveup a tr
//==============================================================================
function moveUp_tr(){
    moveUp("#trSelect", "#table");
}
function moveUp_tr1(){
    moveUp("#trSelect1", "#table1");
}
function moveUp_tr2(){
    moveUp("#trSelect2", "#table2");
}
function moveUp(select, table){
    var index_from = $( '#'+$(select).find(":selected").val() ).index();
    var index_to = index_from-1;
    for( ; index_to >= 0; index_to--){
        if( $(table).find('tr').eq(index_to).is(":visible") &&
            $(table).find('tr').eq(index_to).attr("nowSpan") == 0 ){
            break;
        }
    }
    if( index_to < 0 ){ return; }
    var select_from = $(select).find(":selected").index();
    var select_to = $(select+" option[value='"+$(table).find('tr').eq(index_to).attr('id')+"']").index();

    $(table).moveRow(index_from, index_to);
    $(select).moveOption(select_from, select_to);

}

//==============================================================================
// movedown a tr
//==============================================================================
function moveDown_tr(){
    moveDown('#trSelect', '#table');
}
function moveDown_tr1(){
    moveDown('#trSelect1', '#table1');
}
function moveDown_tr2(){
    moveDown('#trSelect2', '#table2');
}
function moveDown(select, table){    
    var index_from = $( '#'+$(select).find(":selected").val() ).index();
    var length = $(table+' tr').length;
    var index_to = index_from+1;
    for( ; index_to < length; index_to++){
        if( $(table).find('tr').eq(index_to).is(":visible") &&
            $(table).find('tr').eq(index_to).attr("nowSpan") == 0 ){
            break;
        }
    }
    if( index_to >= length ){ return; }
    var select_from = $(select).find(":selected").index();
    var select_to = $(select+" option[value='"+$(table).find('tr').eq(index_to).attr('id')+"']").index();

    $(table).moveRow(index_from, index_to);
    $(select).moveOption(select_from, select_to);
}


//==============================================================================
// move right/left a tr
//==============================================================================
function moveRight_tr(){
    move_tr("#trSelect1", "#trSelect2", '#table1', '#table2', hide_tr1_button);
}
function moveLeft_tr(){
    move_tr("#trSelect2", "#trSelect1", '#table2', '#table1', hide_tr2_button);
}
function move_tr( select_from, select_to, table_from, table_to, hide_func ){
    var index = $(select_from).find(":selected").index();
    var index2 = $(select_to).find(":selected").index();
    var oldPosition = $( '#'+$(select_from).find(":selected").val() ).index();
    var newPosition =  oldPosition;
    var rowspan = parseInt( $(table_from).find('tr').eq(oldPosition).attr('maxSpan') );
    for( ; newPosition < $(table_to+' tr').length; newPosition++ ){
        if( $(table_to).find('tr').eq(newPosition).is(":visible") &&
            $(table_to).find('tr').eq(newPosition).attr("nowSpan") == 0 ){
            break;
        }
    }
    if( newPosition < $(table_to+' tr').length ){
        for(var i = 0; i < rowspan; i++){
            var row = $(table_from).find('tr').eq(oldPosition).remove();
            $(table_to).find('tr').eq(newPosition+i).before(row);
        }
        var option = $(select_from).find(":selected").remove();
        $(select_to+" option[value='"+ $(table_to).find('tr').eq(newPosition+rowspan).attr('id')+"']").before(option);
    }else{
        for(var i = 0; i < rowspan; i++){
            var row = $(table_from).find('tr').eq(oldPosition).remove();
            $(table_to).find('tr').last().after(row);
        }
        var option = $(select_from).find(":selected").remove();
        $(select_to).find('option').last().after(option);
    }

    // check trSelect2 value
    if(index <= index2){
        $(select_to+' option').get(index2+1).selected = true;
    }else{
        $(select_to+' option').get(index2).selected = true;
    }
    // check trSelect1 value
    if ($(select_from+' option').get(index) != null) {
        $(select_from+' option').get(index).selected = true;
    }
    else {
        if ($(select_from+' option').length > 0) {
            $(select_from+' option').get(index - 1).selected = true;
        }else{
            one_col();
        }
    }
    // check trSelect1 btn
    if( !$("#"+$(select_from).find(":selected").val()).is(":visible") ){
        hide_func();
    }    
}

//==============================================================================
// load_select
//==============================================================================
function load_select(){
    base_load_select('#trSelect', '#table', show_tr_button, hide_tr_button );
}
function load_select1(){
    base_load_select('#trSelect1', '#table1', show_tr1_button, hide_tr1_button );
}
function load_select2(){
    base_load_select('#trSelect2', '#table2', show_tr2_button, hide_tr2_button );
}
function base_load_select(select, table, show_tr, hide_tr){
    $(select).find('option').remove();
    $(table).find('td.fst-td').find('h3').each( function(){
        $(select).append($("<option></option>").attr("value", $(this).closest('tr').attr('id')).text( $(this).text() ))
    });
    $(select+' option').first().prop('selected', true);
    if( $(table).find('tr').first().is(":visible") ){
        show_tr();
    }else{
        hide_tr();
    }
}

//==============================================================================
// toggle function
//==============================================================================
function hide_tr_button(){
    $('#hideTr').val('顯示');
    $('#upTr').invisible();
    $('#downTr').invisible();
}
function hide_tr1_button(){
    $('#hideTr1').val('顯示');
    $('#upTr1').invisible();
    $('#downTr1').invisible();
    $('#rightTr').invisible();
}
function hide_tr2_button(){
    $('#hideTr2').val('顯示');
    $('#upTr2').invisible();
    $('#downTr2').invisible();
    $('#leftTr').invisible();
}
function show_tr_button(){
    $('#hideTr').val('隱藏');
    $('#upTr').visible();
    $('#downTr').visible();
}
function show_tr1_button(){
    $('#hideTr1').val('隱藏');
    $('#upTr1').visible();
    $('#downTr1').visible();
    $('#rightTr').visible();
}
function show_tr2_button(){
    $('#hideTr2').val('隱藏');
    $('#upTr2').visible();
    $('#downTr2').visible();
    $('#leftTr').visible();
}

//==============================================================================
// save load file
//==============================================================================
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

//==============================================================================
// parse upload/download json
//==============================================================================
function parseUploadJson(msg){
    try{
        var json = JSON.parse(msg);
        $("#table").find("tr").remove();
        for(var i = 0; i < json["table"][0].length; i++){
            add_tr( $("#table"), json["table"][0][ i ], json["table"][0][i]["order"] );
        }
        $("#table1").find("tr").remove();
        for(var i = 0; i < json["table"][1].length; i++){
            add_tr( $("#table1"), json["table"][1][ i ], json["table"][1][i]["order"] );
        }
        $("#table2").find("tr").remove();
        for(var i = 0; i < json["table"][2].length; i++){
            add_tr( $("#table2"), json["table"][2][ i ], json["table"][2][i]["order"] );
        }
        if( json["visible"][0] ){
            one_col();
        }else if( json["visible"][1] ){
            two_col();
        }
    }catch(e){
        alert("檔案讀取失敗！！\n"+e);
    }
}

function parseDownloadJson(){
    var visible = [ $("#oneColRow").is(":visible"), $("#twoColRow").is(":visible") ];
    var table = [ [], [], [] ];
    $("#table").find("tr").each(function(){
        if( $(this).attr("nowSpan") == 0 ){
            table[0].push( parseTr($(this)) );
        }
    });
    $("#table1").find("tr").each(function(){
        if( $(this).attr("nowSpan") == 0 ){
            table[1].push( parseTr($(this)) );
        }
    });
    $("#table2").find("tr").each(function(){
        if( $(this).attr("nowSpan") == 0 ){
            table[2].push( parseTr($(this)) );
        }
    });
    var json = { "visible": visible, "table": table };
    return JSON.stringify(json);
}
function parseTr(tr){
    var obj = {};
    obj['name'] = tr.find('td.fst-td h3').text();
    obj['rarity'] = tr.attr('rarity');
    obj['type'] = tr.attr('type');
    obj['id'] = tr.attr('order');
    obj['trDisplay'] = tr.is(":visible");
    obj['label'] = tr.find('td.fst-td').is(":visible");
    obj['level'] = [];
    obj['maxLv'] = [];
    obj['color'] = [];
    obj['tdDisplay'] = [];

    var rowspan = parseInt( tr.attr('maxSpan') );
    for(var r = 0; r < rowspan; r++){
        var level = []; var maxlv = [], color = [], tdplay = [];
        for(var i = 0; i < 5; i++){
            var td = (r == 0) ? tr.find('td').eq(i+1) : tr.find('td').eq(i);
            var img = td.find('img');
            if( img.attr('src') ){
                level[i] = parseInt( img.attr('level') );
                maxlv[i] = parseInt( img.attr('maxLv') );
            }else{
                level[i] = 0;
                maxlv[i] = 0;
            }
            color[i] = img.hasClass('img-gray') ? 0 : 1;
            tdplay[i] = td.is(":visible") ? 1 : 0;
        }
        obj['level'].push(level);
        obj['maxLv'].push(maxlv);
        obj['color'].push(color);
        obj['tdDisplay'].push(tdplay);
        tr = tr.next('tr');
    }
    return obj;
}