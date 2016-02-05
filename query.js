var Manager;
(function($) {
	$(function() {
		Manager = new AjaxSolr.Manager({
			solrUrl : 'http://ambit.uni-plovdiv.bg:8983/solr/enm_shard1_replica1/'
		});
		Manager.addWidget(new AjaxSolr.ResultWidget({
			id : 'result',
			target : '#docs'
		}));

		Manager.addWidget(new AjaxSolr.PagerWidget({
			id : 'pager',
			target : '#pager',
			prevLabel : '&lt;',
			nextLabel : '&gt;',
			innerWindow : 1,
			renderHeader : function(perPage, offset, total) {
				$('#pager-header').html(
						$('<span></span>').text(
								'displaying ' + Math.min(total, offset + 1)
										+ ' to '
										+ Math.min(total, offset + perPage)
										+ ' of ' + total));
			}
		}));

		var fields = [ 'endpointcategory', 'substanceType', 'effectendpoint',
				'owner_name', 'reference', 'guidance',
				'interpretation_result', '_childDocuments_.params.Species','_childDocuments_.params.Cell_line',
				'_childDocuments_.params.DATA_GATHERING_INSTRUMENTS'];
		var divs = [ 'endpointcategory', 'substanceType', 'effectendpoint',
				'owner_name', 'reference', 'protocol',
				'interpretation_result', 'species', 'cell_line','instruments']; 
		for (var i = 0, l = fields.length; i < l; i++) {
			if ("xxx" == divs[i])
				Manager.addWidget(new AjaxSolr.TagcloudWidget({
					id : divs[i],
					target : '#' + divs[i],
					field : fields[i]
				}));
			else
				Manager.addWidget(new AjaxSolr.TagWidget({
					id : divs[i],
					target : '#' + divs[i],
					field : fields[i]
				}));
		}

		Manager.addWidget(new AjaxSolr.PivotWidget({
				id : "P-CHEM_endpointcategory",
				target : '#P-CHEM_endpointcategory',
				field : "endpointcategory"
		}));	
		
		Manager.addWidget(new AjaxSolr.PivotWidget({
			id : "TOX_endpointcategory",
			target : '#TOX_endpointcategory',
			field : "endpointcategory"
		}));		
		
		Manager.addWidget(new AjaxSolr.PivotWidget({
			id : "P-CHEM_effectendpoint",
			target : '#P-CHEM_effectendpoint',
			field : "effectendpoint"
		}));	
		
		Manager.addWidget(new AjaxSolr.PivotWidget({
			id : "TOX_effectendpoint",
			target : '#TOX_effectendpoint',
			field : "effectendpoint"
		}));	
	
		Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
			id : 'currentsearch',
			target : '#selection'
		}));
		/*
		 * Manager.addWidget(new AjaxSolr.TextWidget({ id: 'text', target:
		 * '#search' }));
		 */
		Manager.addWidget(new AjaxSolr.AutocompleteWidget({
			id : 'text',
			target : '#search',
			fields : [ 'substanceType', 'effectendpoint', 'endpointcategory',
					'name', 'guidance', 'interpretation_result',
					'_childDocuments_.params.Species', '_childDocuments_.params.Cell_line', 'reference',
					'_text_' ]
		}));

		Manager.init();
			
		var purl = $.url();
		var searchValue = purl.param('search');
		if (searchValue!=undefined) {
			Manager.store.addByValue('q', searchValue);
		}	else
			Manager.store.addByValue('q', '*:*');

		var params = {
			facet : true,
			'facet.field' : [ 'endpointcategory', 'substanceType',
					'effectendpoint', 'reference',
					'_childDocuments_.params.Species',
					'_childDocuments_.params.Cell_line',
					'guidance',
					'_childDocuments_.params.DATA_GATHERING_INSTRUMENTS',
					'interpretation_result', 'owner_name' ,'unit'],
			'facet.limit' : -1,
			'facet.mincount' : 1,
			// 'f.topcategory.facet.limit': 50,
			// 'f.countryCodes.facet.limit': -1,
			// 'facet.date': 'date',
			// 'facet.date.start': '1987-02-26T00:00:00.000Z/DAY',
			// 'facet.date.end': '1987-10-20T00:00:00.000Z/DAY+1DAY',
			// 'facet.date.gap': '+1DAY',
			'f.reference.facet.mincount' : 2,
			'f.endpointcategory.facet.limit' : -1,
			'f.substanceType.facet.limit' : -1,
			'f.s_uuid.facet.limit' : -1,
			'f.doc_uuid.facet.limit' : -1,
			'f.e_hash.facet.limit' : -1,
			'facet.pivot' : 'topcategory,endpointcategory,effectendpoint,unit',
			'stats':true,
			'stats.field':'{!tag=piv1 min=true max=true}loValue',
			'facet.pivot': '{!stats=piv1}topcategory,endpointcategory,effectendpoint,unit',
			'json.nl' : 'map',
			'rows' : 20,
			'fq' : 'sType=study',
			// https://cwiki.apache.org/confluence/display/solr/Collapse+and+Expand+Results
			'fq' : '{!collapse field=s_uuid}',
			'expand' : true,
			'expand.rows' : 20,
			'fl' : 'id,type_s,s_uuid,doc_uuid,loValue,upValue,topcategory,endpointcategory,effectendpoint,unit,guidance,substanceType,name,publicname,reference,reference_owner,e_hash,err,interpretation_result,textValue'
		};
		for ( var name in params) {
			Manager.store.addByValue(name, params[name]);
		}

		Manager.doRequest();
	});
})(jQuery);
