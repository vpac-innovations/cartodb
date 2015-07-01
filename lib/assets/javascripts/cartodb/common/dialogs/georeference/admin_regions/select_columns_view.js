var $ = require('jquery');
var _ = require('underscore');
var cdb = require('cartodb.js');

/**
 * Select the columns to use for admin. regions georeference.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initViews();
    this._initBinds();
  },

  render: function() {
    var $el = $(
        this.getTemplate('common/dialogs/georeference/admin_regions/select_columns')({
      })
    );
    $el.find('.js-column-name').append(this._columnNameView.render().el);
    $el.find('.js-location').append(this._locationView.render().el);
    this.$el.html($el);
    return this;
  },

  _initViews: function() {
    this._columnNameView = this._createSelectView(cdb.forms.Combo, {
      property: 'columnName',
      placeholder: 'Select column',
      extra: this.model.get('columnsNames')
    });
    this._locationView = this._createSelectView(cdb.forms.CustomTextCombo, {
      property: 'location',
      text: 'isLocationFreeText',
      extra: this.model.get('columns')
    });
  },

  _createSelectView: function(ComboView, data) {
    var view = new ComboView(
      _.extend({
        model: this.model,
        className: 'Select',
        width: '100%',
        placeholder: 'Select column or type it'
      }, data)
    );
    // Simulate a initial selection to update model to be in sync with the view
    view.render()._changeSelection();
    this.addView(view);
    return view;
  },

  _initBinds: function() {
    this.model.bind('change', this.model.assertIfCanContinue, this.model);
  }

});