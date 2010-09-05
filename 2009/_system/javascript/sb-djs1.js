//fg button interactions
$(function(){
	//all hover and click logic for buttons
	$(".fg-button:not(.ui-state-disabled)")
	.hover(
		function(){ 
			$(this).addClass("ui-state-hover"); 
		},
		function(){ 
			$(this).removeClass("ui-state-hover"); 
		}
	)
	.mousedown(function(e){
			//ama
			if($(this).hasClass('ui-state-active')){
				$(this).removeClass('ui-state-active');
				return;
			};
			//fg
			$(this).parents('.fg-buttonset-single:first').find('.fg-button.ui-state-active').removeClass('ui-state-active');
			if($(this).hasClass('ui-state-active')){window.alert('yes');$(this).removeClass('ui-state-active');}
			if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
			else { $(this).addClass("ui-state-active");}	
	})
	.mouseup(function(){
		if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
			$(this).removeClass("ui-state-active");
		}
	});
});
