var fgButtons,
	wizard,
	shared,
	conferenceAttendees,
	preConfsInst,
	validation;

//Filament Group Buttons
fgButtons={
	init:function(selector){//selector allows for selective init on Attendees page
		$(selector.find('.fg-button:not(.ui-state-disabled)'))
			.hover(
				function(){$(this).addClass("ui-state-hover");},
				function(){$(this).removeClass("ui-state-hover");}
			)
			.mousedown(function(e){
					$(this).parents('.fg-buttonset-single:first').find('.fg-button.ui-state-active').removeClass('ui-state-active');
					if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
					else { $(this).addClass("ui-state-active");}	
			})
			.mouseup(function(){
				if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
					$(this).removeClass("ui-state-active");
				}
			})
			.click(function(){//this=instigator
				var field=$(this).parent().next();
				if($(this).hasClass('ui-corner-left')){field.attr('value','Yes')}
				else{field.attr('value','No')}				
			})
		
	}
}
dropdown={
	init:function(){
		$(".dropdown dt a").each(function(){
			$(this).click(function(){
				//window.alert('yo');
				$(".dropdown dd ul").hide();//hide other open ones
				$(this).parent().next().find('ul').toggle();//toggle the relevant one in context
			});  							  
		})       
		$(".dropdown dd ul li a").click(function() {
			var text = $(this).html().split('<')[0];
			$(this).parent().parent().parent().prev().find('input').attr('value',text);
			$(".dropdown dd ul").hide();
		});        
		function getSelectedValue(id) {
			return $("#" + id).find("dt a span.value").html();
		}
		$(document).bind('click', function(e) {
			var $clicked = $(e.target);
			if (! $clicked.parents().hasClass("dropdown"))
				$(".dropdown dd ul").hide();
		});
	}
}

validation={
	initSteps:function(stepID){
		if(stepID){
			$(stepID+' input').each(function(){$(this).unbind('blur')});
			$(stepID+' select').each(function(){$(this).unbind('blur')});
		}//kills inline validation
		$("#pageForm").validationEngine({
			inlineValidation:false,
			success:false,
			failure:function(){
				callFailFunction()
			}								
		});	
	},
	initInline:function(){
		//delete $.validationEngine;
		$("#pageForm").validationEngine({
			inlineValidation:true,
			success:false,
			failure:function(){
				callFailFunction()
			}								
		});
	}
}
wizard={
	init:function(){
		var fieldsets,
			nextButton,
			backButton,
			stepIndicators,
			navButtonClick;
		fieldsets=$('fieldset');
		nextButton=$('#ama-next');
		backButton=$('#ama-back');
		stepIndicators=$('#steps li')
		navButtonClick=function(instigator){
			fieldsets.each(function(i){
				var that=this;
				if($(that).is(':visible')){
					instigator.id==='ama-next'?	
						//Next button functionality
						(function(){
							var errorsOnStep,
								errorCount,
								errorTest,
								step1ValidateAll,
								step1LegitBlankLastRowFlag;
							errorCount=0;
							errorsOnStep=false;
							errorTest=function(){
								if($.validationEngine.isError===true){
									errorCount++;//how many are there
									return errorsOnStep=true;//there are errors
								}
							}
							switch(i){
								case 0://Next button on School Info Page
									$('#step0 input').each(function(){$.validationEngine.loadValidation($(this));errorTest();})								
									if(errorsOnStep===true){
										validation.initInline();
										return;
									}//===============================================================>
									break;
								case 1://Next Button on Attendee Page
									step1ValidateAll=function(){
										$('#step1 input').each(function(){$.validationEngine.loadValidation($(this));errorTest();})//VALIDATE ALL FIELDS.
									};
									step1LegitBlankLastRowFlag=false;
									//in the case of validly-added rows with a blank last row, we'll allow this to go through
									if($('#step1 tr').length!==2){//if user has already at least one row
										if(($('#step1 tr:last input[value=""]').length===3)&&//if first two fields blank and Yes/No toggle hasn't yet filled in this value...
										   ($('#step1 tr:last input[value="Choose one..."]').length===1)){//and dropdown value is still 'Choose One,' last row IS BLANK.
											step1LegitBlankLastRowFlag=true;
											$('#step1 tr').each(function(i){
												if(i!==$('#step1 tr').length-1){//as long as we're not looking at the last row, VALIDATE ALL FIELDS IN ROW.
													$(this).find('input').each(function(){//this = row
														$.validationEngine.loadValidation($(this));//this = input
														errorTest();
													})
												}
											})
										}
										else{
											step1ValidateAll();	
										}
									}
									else{
										step1ValidateAll();	
									}		
									if(errorsOnStep===true){
										validation.initInline();
										return;
									}//===============================================================>
									//Add Rows to Pre-confs./insts. and re-id attendees and Pre-confs./insts.
									if(step1LegitBlankLastRowFlag===false){
										preConfsInst.addRow($('#step1 tr:last td:eq(0) input').attr('value'));//if last row not legitimately blank, ADD ATTENDEE ROW TO PRE-CONF/INST TABLE
									}
									shared.assignIds('step 1'); //array notation = this is wizard step 2
									shared.assignIds('step 2'); //array notation = this is wizard step 3
									break;
								
								default:
									break;
							}
							$(that).hide();//hide current fieldset
							$(stepIndicators[i]).removeClass('current');//remove current step indicator
							$(fieldsets[i]).next().show();
							$(stepIndicators[i+1]).addClass('current');
							validation.initSteps('#step'+(i+1));
						})()
						:
						//Back button functionality
						(function(){
							//CLOSE ALL OPEN PROMPTS
							$('input').each(function(){
								$.validationEngine.closePrompt(this);					 
							})
							$(that).hide();//hide current fieldset
							$(stepIndicators[i]).removeClass('current');//remove current step indicator
							$(fieldsets[i]).prev().show();
							$(stepIndicators[i-1]).addClass('current');
							validation.initSteps('#step'+(i-1));
						})();
					return false;//stop iterating
				}
			})
			//Hide back button if on first step
			$(fieldsets[0]).is(':hidden')?
				backButton.removeClass('hide').addClass('show'):
				backButton.removeClass('show').addClass('hide');
		}
		nextButton.click(function(e){navButtonClick(e.target)})
		backButton.click(function(e){navButtonClick(e.target)})
	}
}
shared={
	assignIds:function(step){//assign sequential IDs to form elements under Attendees and PreConf./Inst. tabs
		var rowIterator=function(rows,columnPrefixes){
			var element, //form element
				beginRowCounting, //
				i, //element row counter
				j; //element column counter
			beginRowCounting=false, //we want to start the index counter at first data row, and use this to know once we've iterated past header rows
			i=0; 
			rows.each(function(){
				j=0;//using this j counter lets us know when we're in an input/select-containing cell
				$(this).find('td').each(function(){//for this row's tds..
					if($(this).find('input').is('input')){element=$(this).find('input')}//probably a better syntax for this...
					else{element=false}
					if(element!=false){//if this row contains an input element...
						beginRowCounting=true;
						$(element).attr('id',columnPrefixes[j]+i);
						$(element).attr('name',columnPrefixes[j]+i);
						j++;
					}
				})
				if(beginRowCounting===true){i++}
			})
		}
		switch(step){
			case 'step 1':rowIterator($('#step1 tr'),conferenceAttendees.idPrefixes);break;
			case 'step 2':rowIterator($('#step2 tr'),preConfsInst.idPrefixes);break;
		}
	}
}
schoolInfo={

}
conferenceAttendees={
	newRow:{}, //cloned first row of virgin Conf. Attendees table, used and modified in Add Next functions
	init:function(){}, //initiation function for the AAttendees tab
	newRowInit:function(){}, //initiation function for newly added rows
	remove:function(){}, //function attached to and fired from Remove buttons
	nameFields:{},
	idPrefixes:[],
	/*=====================================================================================================*/
	init:function(){
		var addNextAttendeeButton,
			emptyAttendeeRow,
			addNextButtonClick,
			nameField,
			removeButton,
			that;
		that=this;
		addNextAttendeeButton=$('#ama-addNextAttendee');
		nameField=$('#step1 input:eq(0)');
		nameField.bind('change',function(){//this function applies updates made on step1 fields to step2 also - fires before next button updates
			var index,
				nextTabIndex,
				that;
			that=this;
			$('#step1 tr').each(function(i){
				if($(this)[0]==$(that).parent().parent()[0]){
					return index=i;
				}
			});
			nextTabIndex=index+parseInt(5);
			$('#step2 tr:eq('+nextTabIndex+') td:eq(0)').html($(that)[0].value);
							 
		});
		emptyAttendeeRow=$('#step1 tr:eq(1)').clone(true);//true = event handler is cloned also
		removeButton=$(document.createElement('span')).attr({
				'class':'ama-remove'													
			})
			.html('<b class="fg-button ui-state-default ui-priority-secondary ui-corner-all">Remove</b>');
		addNextButtonClick=function(instigator){
			//validate here..?
			var row;
			row=$(instigator).parent().parent();//the current row
			preConfsInst.addRow(row.find('td:eq(0) input').attr('value'));//function to add current row's attendee to attendee list on next step
			that.newRow=emptyAttendeeRow.clone(true).insertAfter(row);//new row based off initial added to table
			removeButton.clone().appendTo(that.newRow.find('td:last')).click(function(){that.remove(this)});//place remove button in new row with attached behavior
			that.newRow.find('td:last b:eq(0)').remove();//remove cloned add next button
			if($('#step1 tr').length===3){//if there was only a single attendee row when add next was fired
				removeButton.clone().appendTo($('#step1 tr:eq(1) td:eq(4)')).click(function(){that.remove(this)});//add remove button to first row, which used to just have an add button
				that.newRowInit($('#step1 tr:eq(1)'))//style first row button
			};		
			$(instigator).html('Add Next').appendTo(that.newRow.find('td:last'));//change text from add next attendee to just add next
			that.newRowInit(that.newRow);//attach filament group behaviors to new row buttons
			shared.assignIds()
		}
		addNextAttendeeButton.click(function(){addNextButtonClick(this)});//attach behavior to initial lone add button
		that.idPrefixes=[$('#step1 input:eq(0)').attr('id'),$('#step1 input:eq(1)').attr('id'),$('#step1 input:eq(2)').attr('id'),$('#step1 input:eq(3)').attr('id')]//id prefixes are used by assignIDs function but determined from initial html inline id values
		//name prefix is same as id prefix...
	},
	newRowInit:function(row){
		fgButtons.init($(row));
	},
	remove:function(instigator){
		var row;
		row=$(instigator).parent().parent();
		preConfsInst.removeRow(row.find('input:eq(0)').attr('value'));//remove row from preconfs/institutes table
		if($(instigator).next().html()!==null){//if this is the last row, which has an addNext button
			$(instigator).next().appendTo(row.prev().find('td:last'));//tack add next button onto end of previous row
		};
		row.remove();
		if($('#step1 tr').length===2){//if after removing row there's only one data row left
			$('#step1 tr:eq(1) td:last span').remove();//remove remove button
			$('#step1 tr:eq(1) td:last b').html('Add Next Attendee')//modify text for if only Add Next button is showing
			
		};
	}
}
preConfsInst={
	addRow:function(){}, //function called from conferenceAttendees that adds attendee row to Pre-conf table on attendee add under step 2
	emptyAttendeeRow:{},
	init:function(){},
	idPrefixes:[],
	/*=====================================================================================================*/
	init:function(){
		var preConfsInstToggle,
			emptyRegistrationRow,
			that;
		that=this;
		preConfsInstToggle=$('#preConfsInstToggle');
		//toggle display of session details
		preConfsInstToggle
			.hover(
				function(){$(this).addClass("hover");},
				function(){$(this).removeClass("hover");}
			)
			.click(function(){
				$('#preConfInstDescs').toggle();//applying jquery animation breaks table...
				$('#preConfInstDescs').is(':visible')?
					$(this).html('Hide Full Listing').addClass('visible'):
					$(this).html('View Full Listing').removeClass('visible')
			});
		that.emptyAttendeeRow=$('#step2 tr:eq(6)').clone(true);//template row	
		that.idPrefixes=[$('#step2 input:eq(0)').attr('id'),$('#step2 input:eq(1)').attr('id'),$('#step2 input:eq(2)').attr('id'),$('#step2 input:eq(3)').attr('id')]//id prefixes are used by assignIDs function but determined from initial html inline id values
		$('#step2 tr:eq(6)').remove();//
	},
	addRow:function(attendeeName){
		var dupeFlag,
			that;
		dupeFlag=false;	
		that=this;
		$('#step2 td:first-child').each(function(){
			if($(this).html()===attendeeName){return dupeFlag=true;}								 
		})
		if(dupeFlag===false){that.emptyAttendeeRow.clone(true).appendTo($('#step2 table')).find('td:eq(0)').html(attendeeName);} 	
	},
	removeRow:function(attendeeName){
		$('#step2 td:first-child').each(function(i){
			if($(this).html()===attendeeName){$(this).parent().remove()}										 
		})
	}
	
}

$(document).ready(function(){ 
	dropdown.init();
	validation.initSteps();
	//schoolInfo.init();
	fgButtons.init($('body'));
	wizard.init();
	conferenceAttendees.init();
	preConfsInst.init();
});