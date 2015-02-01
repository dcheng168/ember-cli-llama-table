import Em from 'ember';
import LlamaBodyCell from '../views/llama-body-cell';
import LlamaNumberCell from '../views/llama-number-cell';
var get = Em.get;
var Sortable = Em.ArrayProxy.extend(Em.SortableMixin);

var LlamaTable = Em.Component.extend({
	classNames: 'llama-table-component',

	// column definitions
	columns: null,

	sortedColumns: function () {
		return Sortable.create({
			sortProperties: ['order'],
			sortAscending: true,
			content: this.get('columns')
		});
	}.on('init').property(),

	// table data
	rows: null,

	sortedRows: function () {
		return Sortable.create({
			sortProperties: [],
			sortAscending: true,
			content: this.get('rows')
		});
	}.on('init').property(),

	columngroups: function () {
		var columns = this.get('sortedColumns');
		// single group for now
		return [columns];
	}.property('sortedColumns'),

	findCellAtPosition: function (row, col) {
		var $columns = this.$('.llama-body-column');
		var $column = $columns.eq(col);
		var $cells = $column.find('.llama-body-cell');
		var $cell = $cells.eq(row);
		return $cell;
	},

	// component configuration
	config: null,

	getCellType: function (name) {
		return this.getConfigCellType(name) || this.getDefaultCellType(name);
	},

	getConfigCellType: function (name) {
		var types = this.get('config.types');
		if (Em.isBlank(types)) return null;
		var type = types.findBy('name', name);
		if (Em.isBlank(type)) return null;
		return get(type, 'view');
	},

	getDefaultCellType: function (name) {
		switch (name) {
			case 'number':
				return LlamaNumberCell;
			default:
				return LlamaBodyCell;
		}
	},

	actions: {
		scrollX: function (pos) {
			this.$('.llama-header').css('marginLeft', -pos);
		},
		focusLeft: function (row, col) {
			var $cell = this.findCellAtPosition(row, col - 1);
			$cell.focus();
		},
		focusUp: function (row, col) {
			var $cell = this.findCellAtPosition(row - 1, col);
			$cell.focus();
		},
		focusRight: function (row, col) {
			var $cell = this.findCellAtPosition(row, col + 1);
			$cell.focus();
		},
		focusDown: function (row, col) {
			var $cell = this.findCellAtPosition(row + 1, col);
			$cell.focus();
		},
		sortBy: function (column) {
			var sortedRows = this.get('sortedRows');
			var sortProperties = sortedRows.get('sortProperties');
			if (column === sortProperties[0]) {
				sortedRows.setProperties({
					sortAscending: !sortedRows.get('sortAscending')
				});
			}
			else {
				sortedRows.setProperties({
					sortProperties: [column],
					sortAscending: true
				});
			}
		}
	}
});

export default LlamaTable;