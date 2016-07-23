(function ($) {  

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,
  fieldRegExp: /^([\w\.]+):/,
  
  scanBuildPrefix: function (facet, arr) {
    var q = facet.field + ":" + facet.value,
        res = null,
        idx = -1;

    if (!facet.parent)
      res = [];
    else if ((idx = arr.indexOf(q)) >= 0)
      res = this.scanBuildPrefix(facet.parent, arr);
      
    if (res != null) {
      if (facet.field != AjaxSolr.PivotWidget.topField)
        res.push(facet.value);
      
      for(;idx >= 0;idx = arr.indexOf(q))
        arr.splice(idx, 1);
    }
    
    return res;
  },

  afterRequest: function () {
    var self = this,
        links = [],
        q = this.manager.store.get('q').val(),
        fq = this.manager.store.values('fq').sort(function (a, b) {
          var am = a.match(self.fieldRegExp) || ["1"],
              bm = b.match(self.fieldRegExp) || ["2"];
              
          return AjaxSolr.PivotWidget.fieldList.indexOf(bm[1]) - AjaxSolr.PivotWidget.fieldList.indexOf(am[1]);
        });
        
    // add the free text search as a tag
    if (q != '*:*') {
        links.push(self.tagRenderer(q, "x", function () {
          self.manager.store.get('q').val('*:*');
          self.doRequest();
          return false;
        }));
    }

    // now add the facets
    for (var i = 0; i < fq.length; ++i) {
	    var f = fq[i], fcat, fval, el, map, ffull, fpre;
    	if (f.indexOf("!collapse field=s_uuid") < 0) {
        fcat = f.match(self.fieldRegExp)[1];
        fval = f.replace(self.fieldRegExp, "");
        
        map = self.pivotMap[fval];
        fpre = [];
        
        if (map != null) {
          for (var j = 0;j < map.length; ++j)
            if (!!(fpre = self.scanBuildPrefix(map[j].parent, fq)))
              break;
        }

        fpre.push(fval);
        
    		links.push(el = self.tagRenderer(fpre, "x", self.rangeToggle(f)).addClass('tag_selected'));
    		$("span", el[0]).on("click", self.removeFacet(f));
    		el.addClass(self.colorMap[fcat]);
      }
    }
    
    if (links.length) {
      links.push(self.tagRenderer("Clear", "x", function () {
        self.manager.store.get('q').val('*:*');
        self.manager.store.removeByValue('fq', self.fieldRegExp);
        self.doRequest();
        return false;
      }).addClass('tag_selected tag_clear'));
      
      this.target.empty().addClass('tags').append(links);
    }
    else
      this.target.removeClass('tags').html('<li>No filters selected!</li>');
  },

  rangeToggle: function (facet) {
    var self = this;
    return function () {
	    alert("Select ranges for: " + facet);
      return false;
    };
  },

  removeFacet: function (facet) {
    var self = this;
    return function () {
      if (self.manager.store.removeByValue('fq', facet)) {
        self.doRequest();
      }
      return false;
    };
  }
});

})(jQuery);
