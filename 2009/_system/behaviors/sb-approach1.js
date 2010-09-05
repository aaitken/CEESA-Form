$(document).ready(function(){
	$("#tabs").tabs();
});

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
			//if($(this).hasClass('ui-state-active')){
			//	$(this).removeClass('ui-state-active');
			//	return;
			//};
			//fg
			$(this).parents('.fg-buttonset-single:first').find('.fg-button.ui-state-active').removeClass('ui-state-active');
			//if($(this).hasClass('ui-state-active')){window.alert('yes');$(this).removeClass('ui-state-active');}
			if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
			else { $(this).addClass("ui-state-active");}	
	})
	.mouseup(function(){
		//fg
		if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
			$(this).removeClass("ui-state-active");
		}
		//ama
		switch($(this).attr('id')){
			case 'ama-firstNext':$('#ama-tabs span:eq(1)').trigger('click');break;
			case 'ama-secondBack':$('#ama-tabs span:eq(0)').trigger('click');break;
			case 'ama-secondNext':$('#ama-tabs span:eq(2)').trigger('click');break;
			case 'ama-thirdBack':$('#ama-tabs span:eq(1)').trigger('click');break;
			case 'ama-thirdNext':$('#ama-tabs span:eq(3)').trigger('click');break;
			case 'ama-fourthBack':$('#ama-tabs span:eq(2)').trigger('click');break;
			case 'ama-fourthSubmit':$('#ama-tabs span:eq(4)').trigger('click');break;
		}
	});
});
