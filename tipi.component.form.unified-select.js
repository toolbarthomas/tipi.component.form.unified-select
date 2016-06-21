function setUnifiedSelect() {
	var unifiedSelectElements = {
		root 		: 'select',
		value		: 'select-value',
		select		: 'select',
		option		: 'option',
		form 		: 'form'
	};

	var unifiedSelectStates = {
		ready 		: '__select--ready',
		focus 		: '__select--focus',
		checked 	: '__select--checked',
		disabled 	: '__select--disabled',
		placeholder : '__select--placeholder'
	};


	var unifiedSelectDataAttributes = {
		defaultIndex : 'select-selected-index',
		placeholder  : 'select-placeholder'
	};

	var unifiedSelect = $('.' + unifiedSelectElements.root).not('.' + unifiedSelectStates.ready);
	if(unifiedSelect.length > 0 ) {
		unifiedSelect.each(function() {
			var unifiedSelectEach = $(this);
			var unifiedSelectValue = getUnifiedSelectElement(unifiedSelectEach, 'value', unifiedSelectElements);
			var unifiedSelectSelect = getUnifiedSelectElement(unifiedSelectEach, 'select', unifiedSelectElements);
			var unifiedSelectOption = getUnifiedSelectElement(unifiedSelectEach, 'option', unifiedSelectElements);
			var unifiedSelectForm = getUnifiedSelectElement(unifiedSelectEach, 'form', unifiedSelectElements);

			if(unifiedSelectValue.length > 0 && unifiedSelectSelect.length > 0 && unifiedSelectOption.length > 0) {
				//Set the disabled state on the .select container.
				if(unifiedSelectSelect.prop('disabled') === true) {
					unifiedSelectEach.addClass(unifiedSelectStates.disabled);
				} else {
					unifiedSelectEach.removeClass(unifiedSelectStates.disabled);
				}

				//Store the default selected option so we can reset it to the correct value
				var unifiedSelectOption_selected = unifiedSelectOption.filter(':selected').first();
				if(unifiedSelectOption_selected.length === 0 ) {
					unifiedSelectOption_selected = unifiedSelectOption.first();
				}

				unifiedSelectEach.data(unifiedSelectDataAttributes.defaultIndex, unifiedSelectOption_selected.index());

				if(typeof unifiedSelectForm != 'undefined') {
					unifiedSelectForm.on({
						reset : function() {

							var resetValue = unifiedSelectEach.data(unifiedSelectDataAttributes.defaultIndex);
							if(typeof resetValue === 'undefined') {
								resetValue = 0;
							}

							unifiedSelectOption.prop('selected', false).eq(resetValue).prop('selected', true);
							// unifiedSelectSelect.trigger('change');

							setUnifiedSelectValue(unifiedSelectEach, unifiedSelectElements, unifiedSelectStates, unifiedSelectDataAttributes);
						}
					});
				}

				unifiedSelectSelect.on({
					focus : function() {
						var unifiedSelect = getUnifiedSelectElement($(this), 'root', unifiedSelectElements);
						unifiedSelect.addClass(unifiedSelectStates.focus);
					},
					blur : function() {
						var unifiedSelect = getUnifiedSelectElement($(this), 'root', unifiedSelectElements);
						unifiedSelect.removeClass(unifiedSelectStates.focus);
					},
					keyup: function() {
						$(this).blur().focus();
					},
					change: function() {
						var unifiedSelect = getUnifiedSelectElement($(this), 'root', unifiedSelectElements);
						unifiedSelect.trigger('tipi.ui.unified.select.change', [$(this)]);
					}
				});

				unifiedSelectEach.on({
					'tipi.ui.unified.select.change' : function(event, select) {
						changeUnifiedSelect(select, unifiedSelectElements, unifiedSelectStates);
					}
				});

				//Trigger the checkbox on the first run!
				unifiedSelectEach.addClass(unifiedSelectStates.ready);
				setUnifiedSelectValue(unifiedSelectEach, unifiedSelectElements, unifiedSelectStates, unifiedSelectDataAttributes);
			}
		});
	}
}

function setUnifiedSelectValue(unifiedSelect, unifiedSelectElements, unifiedSelectStates, unifiedSelectDataAttributes) {
	var unifiedSelectOption = getUnifiedSelectElement(unifiedSelect, 'option', unifiedSelectElements);
	var unifiedSelectValue = getUnifiedSelectElement(unifiedSelect, 'value', unifiedSelectElements);
	var unifiedSelectSelect = getUnifiedSelectElement(unifiedSelect, 'select', unifiedSelectElements);

	//Check if the first selected option is disabled so we can ad the placeholder class
	if(unifiedSelectOption.eq(unifiedSelect.data(unifiedSelectDataAttributes.defaultIndex)).prop('disabled') === true) {
		//Set the placeholder class on the .select container
		unifiedSelect.addClass(unifiedSelectStates.placeholder);

		//Try to get the placeholder value from the .select container
		if(typeof unifiedSelect.data(unifiedSelectDataAttributes.placeholder) !== 'undefined') {
			unifiedSelectValue.html(unifiedSelect.data(unifiedSelectDataAttributes.placeholder));
		} else {
			unifiedSelectValue.html(unifiedSelectOption.eq(unifiedSelect.data(unifiedSelectDataAttributes.defaultIndex)).html());
		}
	} else {
		unifiedSelectSelect.trigger('change');
	}
}

function changeUnifiedSelect(unifiedSelectSelect, unifiedSelectElements, unifiedSelectStates) {
	var unifiedSelect = getUnifiedSelectElement(unifiedSelectSelect, 'root', unifiedSelectElements);
	var unifiedSelectValue = getUnifiedSelectElement(unifiedSelect, 'value', unifiedSelectElements);
	var unifiedSelectOption = getUnifiedSelectElement(unifiedSelect, 'option', unifiedSelectElements);

	var selectedOption = unifiedSelectOption.filter(':selected').first();
	if(selectedOption.length > 0) {
		unifiedSelectValue.html(selectedOption.html());
		unifiedSelect.removeClass(unifiedSelectStates.placeholder);
	}
}

function getUnifiedSelectElement(origin, unifiedSelectType, unifiedSelectElements) {
	if(typeof origin != 'undefined' && typeof unifiedSelectType != 'undefined') {
		var element;

		switch(unifiedSelectType) {
			case 'root':
				element = origin.parents('.' + unifiedSelectElements.root).first();
			break;
			case 'value':
				element = origin.find('.' + unifiedSelectElements.value).first();
			break;
			case 'select':
				element = origin.find(unifiedSelectElements.select).first();
			break;
			case 'option':
				element = origin.find(unifiedSelectElements.option);
			break;
			case 'form':
				element = origin.parents(unifiedSelectElements.form).first();
			break;
			default:
				element = undefined;
		}

		return element;
	}
}