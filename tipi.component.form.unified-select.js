(function (win, doc, $){

	$(window).on({
		// All function needed on the first init
		'tipi.unified-select.init' : function(event, unified_select) {
			setUnifiedSelectReadyState(unified_select)
			setUnifiedSelectDisabledState(unified_select);
			setUnifiedSelectEvents(unified_select);
			setUnifiedSelectValue(unified_select);
			setUnifiedSelectNativeState(unified_select);
			unsetUnifiedSelectDropdown(unified_select);
			setUnifiedSelectDropdown(unified_select);
			setUnifiedSelectFilter(unified_select);
			setUnifiedSelectDropdownItemEvents(unified_select);

			setUnifiedSelectDropdownEvents(unified_select);
		},
		'tipi.unified-select.focus': function (event, unified_select) {
			focusUnifiedSelect(unified_select);
		},
		'tipi.unified-select.blur': function (event, unified_select) {
			blurUnifiedSelect(unified_select);
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
	
	// Add the ready state and show it to the world
	function setUnifiedSelectReadyState(unified_select) {
		unified_select.addClass('js__select--ready');		
	}

	// Add the disabled state if our select is disabled
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
		select.off('focus blur keyup change').on({
			focus: function () {
				$(document).trigger('tipi.unified-select.focus', [unified_select]);
			},
			blur: function () {
				$(document).trigger('tipi.unified-select.blur', [unified_select]);
			},
			keyup: function () {
				select.blur().focus();
			},
			change: function () {
				$(document).trigger('tipi.unified-select.setValue', [unified_select]);
			}
		});
	}

	// Append the dropdown and items for our select
	function setUnifiedSelectValue(unified_select) {
		var unified_select_field_value = unified_select.find('.select-field-value');

		var select = unified_select.find('select');

		var selected_index = select.get(0).selectedIndex;
		var option = select.find('option').eq(selected_index);

		if (option.length === 0) {
			return;
		}

		var label = getUnifiedSelectOptionLabelAttribute(option);
		
		// Set the actual selected value!
		unified_select_field_value.html(label);
	}

	// Setup our unified select so it uses the native browser controls
	function setUnifiedSelectNativeState(unified_select) {
		if(!unified_select.hasClass('select--native')) {
			unsetUnifiedSelectNativeState(unified_select);
			return;
		}

		// Make sure our unified select has no tab-index so we can focus the select directly
		unified_select.removeAttr('tabindex');

		// Remove any events we've added in the native state
		unified_select.off('focus blur');
	}

	function unsetUnifiedSelectNativeState(unified_select) {
		// Enable support for tabbing the selectbox
		unified_select.attr('tabindex', '0');

		unified_select.off('focus blur').on({
			focus: function () {
				$(document).trigger('tipi.unified-select.focus', [unified_select]);
			},
			blur: function () {
				$(document).trigger('tipi.unified-select.blur', [unified_select]);				
			}
		});

		var select = unified_select.find('select');
		// Disable support for tabbing in the actual select element
		select.attr('tabindex', '-1');
		
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
		// Don't append the dropdown if we wan't to use the native select
		if (unified_select.hasClass('select--native')) {
			return;
		}

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

		var json_data = [];

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

			json_data.push(label);

			unified_select_dropdown_items.append('<div class="select-dropdown-item' + disabled + '">' + label + '</div>');			
		});

		unified_select.data('json_data', json_data);
	}

	// Append the Filter input
	function setUnifiedSelectFilter(unified_select) {
		// Don't append the dropdown if we wan't to use the native select
		if (unified_select.hasClass('select--native')) {
			return;
		}

		// Cancel if we have no json data to filter
		if (typeof unified_select.data('json_data') === 'undefined') {
			return;
		}

		var unified_select_dropdown = unified_select.find('.select-dropdown');
		if (unified_select_dropdown.length === 0) {
			return;
		}

		unified_select_dropdown.prepend('<div class="select-filter"><input type="text" class="select-filter-input" /></div>');
		var unified_select_filter_input = unified_select_dropdown.find('.select-filter-input');

		var select = unified_select.find('select');
		var attributes = {
			name: select.attr('name'),
			placeholder: unified_select.data('select-filter-placeholder')
		};

		// Append each attribute to the filter input
		for (var key in attributes) {			
			if (typeof attributes[key] === 'undefined' || attributes[key] === '') {
				continue;
			}

			unified_select_filter_input.attr(key, attributes[key]);
		}

		var timeout;
		unified_select_filter_input.on({
			'keyup keydown':function(event) {
				var filter = $(this);

				if (event.keyCode == 13) {
					event.preventDefault();
					return false;
				}

				if(event.keyCode === 38 || event.keyCode === 40) {
					filter.blur();
					focusUnifiedSelectItem(unified_select, event.keyCode);
					return;
				}


				clearTimeout(timeout);
				timeout = setTimeout(function () {
					filterUnifiedSelect(filter);

				}, 100);
			},
			'keyup': function (event) {
				event.preventDefault();
				
			}
		});
	}

	// Filter the input
	function filterUnifiedSelect(input) {
		var unified_select = input.closest('.select');
		if (unified_select.length === 0) {
			return;
		}

		var json_data = unified_select.data('json_data');
		if (typeof json_data === 'undefined') {
			return;
		}

		if (json_data.length === 0) {
			return;
		}

		var term = String(input.val());
		var query = term.toUpperCase();

		var found_indexes = [];

		var results = $.grep(json_data, function (value, index) {
			if (String(value).toUpperCase().indexOf(query) >= 0 ) {
				found_indexes.push(index);
				return;
			}
		});

		var unified_select_dropdown_item = unified_select.find('.select-dropdown-item');
		//Hide all 
		unified_select_dropdown_item.removeClass('js__select-dropdown-item--hide');

		if(found_indexes.length === 0){
			return;
		}

		// Remove the found items from the array
		for (var i = found_indexes.length - 1; i >= 0; i--) {
			unified_select_dropdown_item.splice(found_indexes[i], 1);
		}

		unified_select_dropdown_item.addClass('js__select-dropdown-item--hide');
	}

	function focusUnifiedSelectItem(unified_select, key) {
		//@todo focus items with keyboard
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
		// Don't append the dropdown if we wan't to use the native select
		if (unified_select.hasClass('select--native')) {
			return;
		}

		var unified_select_dropdown_item = unified_select.find('.select-dropdown-item');
		var select = unified_select.find('select');

		unified_select_dropdown_item.on({
			click : function(event) {
				event.preventDefault();
				
				var item = $(this);
				var index = item.index();

				// Fire the callback and update our select
				$(document).trigger('tipi.unified-select.change', [unified_select, index]);
				$(document).trigger('tipi.unified-select.close', [unified_select]);
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
		// Don't append the dropdown if we wan't to use the native select
		if (unified_select.hasClass('select--native')) {
			return;
		}

		var unified_select_field = unified_select.find('.select-field');

		unified_select_field.off('click').on({
			click : function(event) {
				event.preventDefault();

				var dropdown_is_open = unified_select.hasClass('js__select--active');
				if (dropdown_is_open) {
					$(document).trigger('tipi.unified-select.close', [unified_select]);
				}
				else {
					$(document).trigger('tipi.unified-select.open', [unified_select]);
				}
			}
		})
	}

	
	function focusUnifiedSelect(unified_select) {
		var disabled = getUnifiedSelectDisabledState(unified_select);
		if (disabled) {
			return;
		}

		unified_select.addClass('js__select--focus');
	}
	
	function blurUnifiedSelect(unified_select) {
		unified_select.removeClass('js__select--focus');
	}

	function openUnifiedSelectDropdown(unified_select) {
		var disabled = getUnifiedSelectDisabledState(unified_select);
		if(disabled) {
			return;
		}

		unified_select.addClass('js__select--active');

		// Bind body
		setTimeout(function() {
			$('body').one('click', function (event) {
				if (isTarget($(event.target), '.select')) {
					return;
				}

				$(document).trigger('tipi.unified-select.close', [unified_select])
			});
		}, 1)
	}

	function closeUnifiedSelectDropdown(unified_select) {
		unified_select.removeClass('js__select--active')
	}

	function isTarget(target, filter) {
		var is_target = false;

		if (target.hasClass((filter.replace('.','')))) {
			is_target = true;
		}

		if (target.parents(filter).length > 0) {
			is_target = true;
		}

		return is_target;
	}

})(window.jQuery(window), window.jQuery(document), window.jQuery);