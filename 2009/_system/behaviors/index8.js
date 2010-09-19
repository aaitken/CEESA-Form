var fgButtons,
    dropdown,
    validation,
	wizard,
	shared,
    schoolInfo,
	conferenceAttendees,
	preConfsInst,
	summary;

//Filament Group Buttons
fgButtons={
	init:function(selector){//selector allows for selective init on Attendees page
		$(selector.find('.fg-button:not(.ui-state-disabled)'))
			.hover(
				function(){$(this).addClass("ui-state-hover");},
				function(){$(this).removeClass("ui-state-hover");}
			)
			.mousedown(function(e){
					var field=$(this).parent().next();
					$(this).parents('.fg-buttonset-single:first').find('.fg-button.ui-state-active').removeClass('ui-state-active');
					if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
					else { $(this).addClass("ui-state-active");}
					if($(this).hasClass('ui-corner-left')){field.attr('value','Yes')}
					else{field.attr('value','No')}	
					try{$.validationEngine.closePrompt(field)}//in case there's a validation error bubble currently associated with the toggle (meaning that it hasn't been selected)
					catch(error){}
			})
			.mouseup(function(){
				if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
					$(this).removeClass("ui-state-active");
				}
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
			var field=$(this).parent().parent().parent().prev().find('input')
			field.attr('value',text);
			try{$.validationEngine.closePrompt(field)}//in case there's a validation error bubble currently associated with the dropdown (meaning that it hasn't been selected)
			catch(error){}
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
	initSteps:function(stepID,position){
		if(stepID){
			$(stepID+' input').each(function(){$(this).unbind('blur')});
		}//kills inline validation
		$("#pageForm").validationEngine({
			inlineValidation:false,
			success:false,
			promptPosition:position,
			failure:function(){
				callFailFunction()
			}								
		});	
	},
	initInline:function(position){
		//delete $.validationEngine;
		$("#pageForm").validationEngine({
			inlineValidation:true,
			success:false,
			promptPosition:position,
			failure:function(){
				callFailFunction()
			}								
		});
	},
	validateStep:function(){
		var errorsOnStep,
			errorCount,
			errorTest;
		errorTest=function(){
			if($.validationEngine.isError===true){
				errorCount++;//how many are there
				return errorsOnStep=true;//there are errors
			}
		};
		//Function for validation School Info step
		this.step0=function(){
			errorsOnStep=false;
			errorCount=0;
			$('#step0 input').each(function(){$.validationEngine.loadValidation($(this));errorTest();})								
			if(errorsOnStep===true){
				validation.initInline('topRight');
				return false;
			}
		}
		//Function for validation Attendee step
		this.step1=function(allowBlankLast){
			var step1ValidateAll;
			errorsOnStep=false;
			errorCount=0;
			step1ValidateAll=function(){
				$('#step1 input').each(function(){$.validationEngine.loadValidation($(this));errorTest();})//VALIDATE ALL FIELDS.
			};
			validation.step1LegitBlankLastRowFlag=false;//mutation
			//in the case of validly-added rows with a blank last row, we'll allow this to go through
			if($('#step1 tr').length!==2){//if user has already at least one row
				if(allowBlankLast===true){//if we're goingto allow the user a blank last row - this is only from theNext button
					//window.alert(allowBlankLast);
					if(($('#step1 tr:last input[value=""]').length===4)&&//if first two fields blank and Yes/No toggle hasn't yet filled in this value...
					   ($('#step1 tr:last input[value="Choose one..."]').length===1)){//and dropdown value is still 'Choose One,' last row IS BLANK.
						validation.step1LegitBlankLastRowFlag=true;
						$('#step1 tr').each(function(i){
							if(i!==$('#step1 tr').length-1){//as long as we're not looking at the last row, VALIDATE ALL FIELDS IN ROW.
								$(this).find('input').each(function(){//this = row
									$.validationEngine.loadValidation($(this));//this = input
									errorTest();
								})
							}
						})
					}
					else{//if we have multiple rows, we're allowing a blank last row, but the last row has values
						step1ValidateAll();
					}
				}
				else{//if we have multiple rows but we're not allowing a blank last (Add Next)
						step1ValidateAll();
					}			
			}
			else{//if we only have a single row
				step1ValidateAll();
			}		
			if(errorsOnStep===true){
				validation.initInline('topLeft');
				return false;
			}
		}
		
		return this;//returns the validate Step oblect for chaining
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
		navButtonClick=function(instigator,event){
			if($(instigator).html()!=='Confirm and Send'){event.preventDefault();}
			fieldsets.each(function(i){
				var that=this;
				if($(that).is(':visible')){
					instigator.id==='ama-next'?	
						//Next button functionality
						(function(){
							var newAttendeeConfirmRow,
								newSessionConfirmRow,
								totalCost;
							switch(i){
								case 0://Next button on School Info Page
									$('#step0_email').val(jQuery.trim($('#step0_email').val()));
									if(validation.validateStep().step0()===false){return}; //====>
									validation.initSteps('#step1','topLeft');
									break;
								case 1://Next Button on Attendee Page
									if(validation.validateStep().step1(true)===false){return};  //====>
									//Add Rows to Pre-confs./insts. and re-id attendees and Pre-confs./insts.
									if(validation.step1LegitBlankLastRowFlag===false){
										preConfsInst.addRow($('#step1 tr:last td:eq(0) input').attr('value'));//if last row not legitimately blank, ADD ATTENDEE ROW TO PRE-CONF/INST TABLE
									}
									shared.assignIds('step 1'); //array notation = this is wizard step 2
									shared.assignIds('step 2'); //array notation = this is wizard step 3
									
									//no validation on next step
									break;
								case 2://Next Button on Pre-Conf/Inst Page
									//No validation
									//School Info
									$('#step0 input').each(function(i){
										$('#schoolConfirm td.catcher:eq('+i+')').html($(this).val());							
									})
									//Attendees
									newAttendeeConfirmRow=$(document.createElement('tr')).attr('class','dynamic').html(
										'<td class="first catcher">&nbsp;</td>'+
										'<td class="catcher">&nbsp;</td>'+
										'<td class="catcher jsPresenting">&nbsp;</td>'+
										'<td class="catcher">&nbsp;</td>'+
										'<td class="catcher">&nbsp;</td>');
									$('#step1 tbody tr').each(function(i){
										if($(this).find('input[value=""]').is('input')){return;}//if you run into any blank inputs (because of legit blank last row), break loop
										var newRow=newAttendeeConfirmRow.clone();
										$(this).find('input').each(function(j){//this=row
											newRow.find('.catcher:eq('+j+')').html($(this).val());//this=input		
										})		
										newRow.appendTo($('#attendeeConfirm tbody'));
									})
									//Pre-conf/Inst registrations
									newSessionConfirmRow=$(document.createElement('tr')).attr('class','dynamic').html(
										'<td class="first">&nbsp;</td>'+
										'<td class="catcher">&nbsp;</td>'+
										'<td class="catcher">&nbsp;</td>'+
										'<td class="catcher">&nbsp;</td>'+
										'<td class="catcher">&nbsp;</td>');
									$('#step2 #attendeeChoices tbody tr').each(function(i){
										var newRow=newSessionConfirmRow.clone();
										newRow.find('td:eq(0)').html($(this).find('td:eq(0)').html());
										$(this).find('input').each(function(i){
											newRow.find('.catcher:eq('+i+')').html($(this).val());								
										})
										newRow.appendTo($('#preconfsInstConfirm tbody'));
									});
									totalCost=new summary.SchoolCost();
									totalCost.calculate();
									$('#ama-next').html('Confirm and Send');//rename the Next button
									break;
								case 3://Confirm and Send - this would be on click..
									break;
								default:
									break;
							}
							if(i<3){//if not Confirm and Send or Confirmation
								$('.formError').remove()//to clear its opacity overlay, which interferes with control interactions...
								$(that).hide();//hide current fieldset
								$(stepIndicators[i]).removeClass('current');//remove current step indicator
								$(fieldsets[i]).next().show();
								if(i===1){//Below logic makes all first column tds the same width to handle cases of long names
									$('#step2 table:eq(0) td.first:eq(0)').width($('#attendeeChoices .first:eq(0)').width());
									$('#step2 table:eq(1) td.first:eq(0)').width($('#attendeeChoices .first:eq(0)').width());
								}
								$(stepIndicators[i+1]).addClass('current');
							}
							
							
						})()
						:
						//Back button functionality
						(function(){
							//CLOSE ALL OPEN PROMPTS
							$('input').each(function(){
								$.validationEngine.closePrompt(this);					 
							})
							$('.formError').remove()//to clear its overlay, which interferes with control interactions...
							if(i===1){validation.initSteps('#step0','topRight');}
							if(i===2){validation.initSteps('#step1','topLeft');}
							if(i===3){$('#step3 tr.dynamic').each(function(){$(this).remove()})}//removes dynamicall-created attendee confirm rows
							$('#ama-next').html('Next &raquo;');
							$(that).hide();//hide current fieldset
							$(stepIndicators[i]).removeClass('current');//remove current step indicator
							$(fieldsets[i]).prev().show();
							$(stepIndicators[i-1]).addClass('current');
						})();
					return false;//stop iterating
				}
			})
			//Hide back button if on first step
			$(fieldsets[0]).is(':hidden')?
				backButton.removeClass('hide').addClass('show'):
				backButton.removeClass('show').addClass('hide');
		}
		nextButton.click(function(e){navButtonClick(e.target,e)})
		backButton.click(function(e){navButtonClick(e.target,e)})
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
				if($(this)[0]==$(that).parent().parent()[0]){//this=current field;that=field that changed
					return index=i;
				}
			});
			nextTabIndex=index;
			$('#attendeeChoices tr:eq('+nextTabIndex+') td:eq(0)').html($(that)[0].value);
							 
		});
		emptyAttendeeRow=$('#step1 tr:eq(1)').clone(true);//true = event handler is cloned also
		removeButton=$(document.createElement('span')).attr({
				'class':'ama-remove'													
			})
			.html('<b class="fg-button ui-state-default ui-priority-secondary ui-corner-all">Remove</b>');
		addNextButtonClick=function(instigator){
			
			if(validation.validateStep().step1(false)===false){return};//===>
			
			var row;
			row=$(instigator).parent().parent();//the current row
			preConfsInst.addRow(row.find('td:eq(0) input').attr('value'));//function to add current row's attendee to attendee list on next step
			that.newRow=emptyAttendeeRow.clone(true).insertAfter(row);//new row based off initial added to table
			removeButton.clone().appendTo(that.newRow.find('td:last')).click(function(){that.remove(this)});//place remove button in new row with attached behavior
			that.newRow.find('td:last b:eq(0)').remove();//remove cloned add next button
			if($('#step1 tr').length===3){//if there was only a single attendee row when add next was fired
				removeButton.clone().appendTo($('#step1 tr:eq(1) td:eq(5)')).click(function(){that.remove(this)});//add remove button to first row, which used to just have an add button
				that.newRowInit($('#step1 tr:eq(1)'))//style first row button
			};		
			$(instigator).html('Add Next').appendTo(that.newRow.find('td:last'));//change text from add next attendee to just add next
			that.newRowInit(that.newRow);//attach filament group behaviors to new row buttons
			shared.assignIds('step 1');
			that.newRow.find('input:eq(0)').focus();
		}
		addNextAttendeeButton.click(function(){addNextButtonClick(this)});//attach behavior to initial lone add button
		that.idPrefixes=[$('#step1 input:eq(0)').attr('id'),$('#step1 input:eq(1)').attr('id'),$('#step1 input:eq(2)').attr('id'),$('#step1 input:eq(3)').attr('id'),$('#step1 input:eq(4)').attr('id')]//id prefixes are used by assignIDs function but determined from initial html inline id values
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
		$('.formError').remove()//to clear its overlay, which interferes with control interactions...
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
		preConfsInstToggle.click(function(event){
			event.preventDefault();
			$('#preConfInstDescs').is(':visible')?
				$(this).find('b:eq(0)').html('View'):
				$(this).find('b:eq(0)').html('Hide');
			$('#preConfInstDescs').toggle('fast');//applying jquery animation breaks table...
				
		});
		that.emptyAttendeeRow=$('#attendeeChoices tr:eq(1)').clone(true);//template row	
		that.idPrefixes=[$('#step2 input:eq(0)').attr('id'),$('#step2 input:eq(1)').attr('id'),$('#step2 input:eq(2)').attr('id'),$('#step2 input:eq(3)').attr('id')]//id prefixes are used by assignIDs function but determined from initial html inline id values
		$('#attendeeChoices tr:eq(1)').remove();//
	},
	addRow:function(attendeeName){
		var dupeFlag,
			that;
		dupeFlag=false;	
		that=this;
		$('#step2 td:first-child').each(function(){
			if($(this).html()===attendeeName){return dupeFlag=true;}								 
		})
		if(dupeFlag===false){that.emptyAttendeeRow.clone(true).appendTo($('#attendeeChoices')).find('td:eq(0)').html(attendeeName);} 	
	},
	removeRow:function(attendeeName){
		$('#step2 td:first-child').each(function(i){
			if($(this).html()===attendeeName){$(this).parent().remove()}										 
		})
	}
	
}

summary={
	SchoolCost:function(){
		var that=this;
		this.memberStatus=$('#step0 #step0_member_YN').attr('value');
		this.attendees=$('#step3 #attendeeConfirm tbody tr').length;
		this.presentersAlone=$('#step3 #attendeeConfirm tbody td.jsPresenting:contains("Yes - Alone")').length;
		this.presentersAccompanied=$('#step3 #attendeeConfirm tbody td.jsPresenting:contains("Yes - Accompanied")').length;
		this.preConferences=(function(){
			var i=0;
			$('#step2 input.jsPreconf').each(function(){
				if($(this).val()!==''){i++}									  
			});
			return i;
		})();
		this.calculate=function(){
			var baseCost,
				presentersAloneDiscout,
				presentersAccompaniedDiscount,
				preConferencesSurcharge,
				totalCost;
			that.memberStatus==='Yes'?
				(function(){//member
					baseCost=350;
					preConferencesSurcharge=100})()
				:
				(function(){//non-member
					baseCost=400;
					preConferencesSurcharge=125})();
			presentersAloneDiscout=that.presentersAlone*100;
			presentersAccompaniedDiscout=that.presentersAccompanied*50;
			totalCost=(that.attendees*baseCost)-presentersAloneDiscout-presentersAccompaniedDiscout+(that.preConferences*preConferencesSurcharge);
			$('#cost').val(totalCost);
			$('#step3_attendeeCountCatcher').html(that.attendees);
			$('#step3_totalCostCatcher').html(totalCost);
			
		}
	}
}

$(document).ready(function(){ 
	
	//showing elements hidden for users w/o JS
	$('#main').css('display','block');
	$('#byline').css('display','block');
	//disable enter key submits
	$("#pageForm").bind("keypress",function(e){
	  if(e.keyCode===13){return false;}
	});
	$('#dialog').jqm();
	$('#loader').jqm();
	$('#dialog').jqmShow();
	$('#ama-go').click(function(){$('#dialog').jqmHide();})
	$('.infoFees').click(function(){
		$('#dialog h2:eq(0)').html('Info &amp; Costs');
		$('#dialog button:eq(0)').html('Return')
		$('#dialog').jqmShow();
		$.validationEngine.closePrompt('*');//closes open validation bubbles
	})
	dropdown.init();
	validation.initSteps();
	//schoolInfo.init();
	fgButtons.init($('body'));
	wizard.init();
	conferenceAttendees.init();
	preConfsInst.init();
	
	$('#pageForm').ajaxForm({
		beforeSubmit:function(){
			$('#loader').jqmShow();
			return true;
		},
		target:'#responseTarget',
		success:function(){
			setTimeout(function(){
					$('#step3').hide();//hide current fieldset
					$('#stepDesc3').removeClass('current');//remove current step indicator
					$('#ama-back').hide();
					$('#ama-next').html('Return to ceesa.org').click(function(){window.location.href='http://www.ceesa.org/conference_2010.html'});
					$('#step4').show();
					$('#stepDesc4').addClass('current');
					$('#loader').jqmHide();
				},2000);
		}
	});

	
	
});