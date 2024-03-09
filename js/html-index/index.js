
$(document).ready( function(){
    //initail autoHidingNavbar
    $(".navbar-fixed-top").autoHidingNavbar();
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

function fadeToTable(){
	$("#menuOption1").offset( $("#menuOption1").offset() );
	$("#menuOption1").animate({
		top: "-=50px",
		left: "-=50px",
		width: "+=100px",
		opacity: 0
	}, 800, function(){
		location.href = 'table.html';
	});
}
function fadeToDrag(){
	$("#menuOption2").offset( $("#menuOption2").offset() );
	$("#menuOption2").animate({
		top: "-=50px",
		left: "-=50px",
		width: "+=100px",
		opacity: 0
	}, 800, function(){
		location.href = 'drag.html';
	});
}