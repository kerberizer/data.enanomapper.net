(function (Solr, a$, $, jT) {

jT.ResultWidgeting = function (settings) {
  a$.extend(this, settings);
};

jT.ResultWidgeting.prototype = {
  __expects: [ jT.ItemListWidget ],

  init: function (manager) {
    a$.act(this, jT.ItemListWidget.prototype.init, manager);
    this.manager = manager;
  },
  
	beforeRequest : function() {
		$(this.target).html(
				$('<img>').attr('src', 'images/ajax-loader.gif'));
	},

	afterRequest : function() {
		$(this.target).empty();
		this.populate(this.manager.response.response.docs, this.manager.response.expanded);
	}
};

jT.ResultWidget = a$(jT.ResultWidgeting);

})(Solr, asSys, jQuery, jToxKit);
