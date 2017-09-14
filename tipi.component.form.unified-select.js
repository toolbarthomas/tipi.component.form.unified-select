(function (win, doc, $){

	$(window).on({
		// All function needed on the first init
		'tipi.unified-select.init' : function(event, unified_select) {
			setUnifiedSelectReadyState(unified_select)
			setUnifiedSelectDisabledState(unified_select);
			setUnifiedSelectEvents(unified_select);
			setUnifiedSelectValue(unified_select);

			unsetUnifiedSelectDropdown(unified_select);
			setUnifiedSelectDropdown(unified_select);
			setUnifiedSelectDropdownItemEvents(unified_select);

			setUnifiedSelectDropdownEvents(unified_select);
		},
		'tipi.unified-select.open': function (event, unified_select) {
			openUnifiedSelectDropdown(unified_select);
		},
		'tipi.unified-select.close': function (event, unified_select) {
			closeUnifiedSelectDropdown(unified_select);
		},
		// All function needed when we changed the value of the select
		'tipi.unified-select.change': function (event, unified_select, index) {
			setUnifiedSelectSelectedIndex(unified_select, index);
		},
		// Function to init when we wan't to update our select
		'tipi.unified-select.setValue' : function(event, unified_select) {
			setUnifiedSelectValue(unified_select);
		}
	});
	
	window.setUnifiedSelect = function() {
		var unified_selects = $('.select').not('js__select--ready');

		if (unified_selects.length === 0) {
			return;
		}

		unified_selects.each(function() {
			var unified_select = $(this);
			var select = unified_select.find('select');

			if(select.length === 0) {
				return;
			}

			$(window).trigger('tipi.unified-select.init', [unified_select]);
		});
	}

	function setUnifiedSelectReadyState(unified_select) {
		unified_select.addClass('js__select--ready');		
	}

	function setUnifiedSelectDisabledState(unified_select) {
		var disabled = getUnifiedSelectDisabledState(unified_select);

		if (disabled) {
			unified_select.addClass('js__select--disabled');
		}
		else {
			unified_select.removeClass('js__select--disabled');
		}
	}

	function getUnifiedSelectDisabledState(unified_select) {
		var select = unified_select.find('select');

		// Try to define the disabled from the disabled attribute
		var disabled = select.attr('disabled');

		// Check if the disabled state has been set as DOM property
		if (typeof disabled === 'undefined') {
			disabled = select.prop('disabled');
		} else {
			disabled = true;
		}

		return disabled;
	}

	function setUnifiedSelectEvents(unified_select) {
		var select = unified_select.find('select');
		select.on({
			focus: function () {
				unified_select.addClass('js__select--focus');
			},
			blur: function () {
				unified_select.removeClass('js__select--focus');
			},
			keyup: function () {
				select.blur().focus();
			},
			change: function () {
				$(document).trigger('tipi.unified-select.setValue', [unified_select]);
				console.log('update');
			}
		});
	}

	// Append the dropdown and items for our select
	function setUnifiedSelectValue(unified_select) {
		var unified_select_value = unified_select.find('.select-value');

		var select = unified_select.find('select');

		var selected_index = select.get(0).selectedIndex;
		var option = select.find('option').eq(selected_index);

		console.log(selected_index);

		if (option.length === 0) {
			return;
		}

		var label = getUnifiedSelectOptionLabelAttribute(option);
		
		// Set the actual selected value!
		unified_select_value.html(label);
	}
	

	// Remove the dropdown and items for our select
	function unsetUnifiedSelectDropdown(unified_select) {
		var unified_select_dropdown = unified_select.find('.select-dropdown');

		// Cancel unset if we don't have a dropdown defined.
		if (unified_select_dropdown.length === 0) {
			return;
		}

		// Remove the unified_select_dropdown
		unified_select_dropdown.remove();
	}

	// Append the dropdown and items for our select
	function setUnifiedSelectDropdown(unified_select) {
		var unified_select_dropdown = unified_select.find('.select-dropdown');
		var unified_select_dropdown_items = unified_select_dropdown.find('.select-dropdown-items');
		var unified_select_dropdown_item = unified_select_dropdown_items.find('.select-dropdown-item');

		// Cancel set if we have a dropdown defined
		if (unified_select_dropdown_item.length > 0) {
			return;
		}

		var select = unified_select.find('select');
		var options = select.find('option');

		// Cancel set if we have no options defined.
		if(options.length === 0) {
			return;
		}

		// Append the dropdown
		unified_select.append('<div class="select-dropdown"></div>');
		unified_select_dropdown = unified_select.find('.select-dropdown');

		// Append the dropdown items
		unified_select_dropdown.append('<div class="select-dropdown-items"></div>');
		unified_select_dropdown_items = unified_select_dropdown.find('.select-dropdown-items');

		// Loop through each select option and set it's attribute
		options.each(function(index) {
			var option = $(this);
			
			var label = getUnifiedSelectOptionLabelAttribute(option);
			var disabled = getUnifiedSelectOptionDisabledAttribute(option);
			if(disabled) {
				disabled = ' js__select-dropdown-item--disabled';
			} else {
				disabled = '';
			}

			unified_select_dropdown_items.append('<div class="select-dropdown-item' + disabled + '">' + label + '</div>');			
		});
	}

	// Define the label for our dropdown item
	function getUnifiedSelectOptionLabelAttribute(option) {
		// Try to define the label from the label attribute
		var label = option.attr('label');
		
		// Fallback to the actual option text
		if (typeof label === 'undefined') {
			label = option.text();
		}

		return label;
	}

	// Define the disabled state for our dropdown item
	function getUnifiedSelectOptionDisabledAttribute(option) {
		// Try to define the disabled from the disabled attribute
		var disabled = option.attr('disabled');

		// Check if the disabled state has been set as DOM property
		if(typeof disabled === 'undefined') {
			disabled = option.prop('disabled');
		} else {
			disabled = true;
		}

		return disabled;
	}

	// Bind the event needed to change the select
	function setUnifiedSelectDropdownItemEvents(unified_select) {
		var unified_select_dropdown_item = unified_select.find('.select-dropdown-item');
		var select = unified_select.find('select');

		unified_select_dropdown_item.on({
			click : function(event) {
				event.preventDefault();
				
				var item = $(this);
				var index = item.index();

				console.log(index);

				// Fire the callback and update our select
				$(document).trigger('tipi.unified-select.change', [unified_select, index]);
			}
		});
	}

	// Set the new selected index defined from our selected item
	function setUnifiedSelectSelectedIndex(unified_select, index) {
		var select = unified_select.find('select');

		// Don't init any callbacks when our index is the same value as the selectedIndex
		if (select.get(0).selectedIndex === index) {
			return;
		}

		var option = select.find('option').eq(index);
		var disabled = getUnifiedSelectOptionDisabledAttribute(option)
		if(disabled) {
			return;
		}

		select.get(0).selectedIndex = index;
		
		select.trigger('change');
	}

	function setUnifiedSelectDropdownEvents(unified_select) {
		var unified_select_value = unified_select.find('.select-value');

		unified_select_value.on({
			click : function(event) {
				event.preventDefault();

				var dropdown_is_open = unified_select.hasClass('js__select--dropdown-open');;
				if (dropdown_is_open) {
					$(document).trigger('tipi.unified-select.open', [unified_select]);
				}
				else {
					$(document).trigger('tipi.unified-select.close', [unified_select]);
				}
			}
		})
	}

	function openUnifiedSelectDropdown(unified_select) {
		var disabled = getUnifiedSelectDisabledState(unified_select);
		if(disabled) {
			return;
		}

		unified_select.addClass('js__select--dropdown-open')
	}

	function closeUnifiedSelectDropdown(unified_select) {
		unified_select.removeClass('js__select--dropdown-open')
	}

	// disabled	disabled	Specifies that an option should be disabled
	// label	text	Specifies a shorter label for an option
	// selected	selected	Specifies that an option should be pre- selected when the page loads
	// value

})(window.jQuery(window), window.jQuery(document), window.jQuery);
