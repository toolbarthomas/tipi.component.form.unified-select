function setUnifiedSelect()
{
	var data = {
		elements : {
			root 		: 'select',
			value		: 'select-value',
			select		: 'select',
			option		: 'option',
			form 		: 'form'
		},
		states: {
			ready 		: '__select--ready',
			focus 		: '__select--focus',
			checked 	: '__select--checked',
			disabled 	: '__select--disabled',
			placeholder : '__select--placeholder'
		},
		attributes: {
			disabled: 'disabled',
			selected : 'select-selected',
			placeholder  : 'select-placeholder'
		}
	}

	var unified_select = $('.' + data.elements.root).not('.' + data.states.ready);
	if(unified_select.length == 0)
	{
		return;
	}

	unified_select.on({
		'tipi.unified-select.reset' : function(event, unified_select) {
			setUnifiedSelectDefaultSelectedOption(unified_select, data);
			setUnifiedSelectDisabledState(unified_select, data);
			setUnifiedSelectPlaceholder(unified_select, data);
		},
		'tipi.unified-select.change' : function(event, unified_select) {
			changeUnifiedSelectValue(unified_select, data);
		}
	});

	unified_select.each(function() {
		var unified_select = $(this);
		var unified_select_value = getUnifiedSelectElement(unified_select, 'select-value', data);
		var select = getUnifiedSelectElement(unified_select, 'select', data);
		var option = getUnifiedSelectElement(select, 'option', data);
		var form = getUnifiedSelectElement(unified_select, 'form', data);

		if(unified_select_value.length == 0) {
			return;
		}

		if(select.length == 0) {
			return;
		}

		if(option.length == 0) {
			return;
		}

		form.on({
			reset : function() {
				unified_select.trigger('tipi.unified-select.reset', [unified_select]);
			}
		});

		select.on({
			focus : function() {
				var unified_select = getUnifiedSelectElement($(this), 'root', data);
				unified_select.addClass(data.states.focus);
			},
			blur : function() {
				var unified_select = getUnifiedSelectElement($(this), 'root', data);
				unified_select.removeClass(data.states.focus);
			},
			keyup: function() {
				$(this).blur().focus();
			},
			change: function() {
				var unified_select = getUnifiedSelectElement($(this), 'root', data);
				unified_select.trigger('tipi.unified-select.change', [unified_select]);
			}
		});

		unified_select.trigger('tipi.unified-select.reset', [unified_select]);

		unified_select.addClass(data.states.ready);
	});
}

//Set the selected option for the select
function setUnifiedSelectDefaultSelectedOption(unified_select, data)
{
	var selected_option = unified_select.data(data.attributes.selected);
	var option = getUnifiedSelectElement(unified_select, 'option', data);

	if(typeof selected_option == 'undefined')
	{
		selected_option = option.not(':disabled').index();
	}

	option.prop('selected', false).eq(selected_option).prop('selected', true);
}

//Toggle the Disabled classname on the container element
function setUnifiedSelectDisabledState(unified_select, data)
{
	var select = getUnifiedSelectElement(unified_select, 'select', data);
	if(typeof select == 'undefined')
	{
		return;
	}

	if(select.prop(data.attributes.disabled))
	{
		unified_select.addClass(data.states.disabled);
	}
	else
	{
		unified_select.removeClass(data.states.disabled);
	}
}

//Set the placeholder to the select
function setUnifiedSelectPlaceholder(unified_select, data)
{
	var placeholder = unified_select.data(data.attributes.placeholder);

	var unified_select_value = getUnifiedSelectElement(unified_select, 'select-value', data);
	var select = getUnifiedSelectElement(unified_select, 'select', data);
	var option = getUnifiedSelectElement(select, 'option', data);

	//Use the value of the first option as placeholder fallback
	if(typeof placeholder == 'undefined') {
		placeholder = option.filter(':selected').first().text();
	}

	unified_select_value.html(placeholder);
}

//Change innerHtml of the the value container
function changeUnifiedSelectValue(unified_select, data)
{
	var unified_select_value = getUnifiedSelectElement(unified_select, 'select-value', data);
	var select = getUnifiedSelectElement(unified_select, 'select', data);
	var option = getUnifiedSelectElement(select, 'option', data);
	var selected = option.filter(':selected').first();

	if(selected.length == 0)
	{
		return;
	}

	unified_select_value.html(selected.text());
}

function getUnifiedSelectElement(origin, type, data)
{
	if(typeof origin == 'undefined')
	{
		return;
	}

	if(origin.length == 0)
	{
		return;
	}

	if(typeof data.elements == 'undefined')
	{
		return;
	}

	var element;

	switch(type) {
		case 'root':
			element = origin.parents('.' + data.elements.root).first();
		break;
		case 'select-value':
			element = origin.find('.' + data.elements.value).first();
		break;
		case 'select':
			element = origin.find(data.elements.select).first();
		break;
		case 'option':
			element = origin.find(data.elements.option);
		break;
		case 'form':
			element = origin.parents(data.elements.form).first();
		break;
		default:
			element = null;
	}

	return element;
}