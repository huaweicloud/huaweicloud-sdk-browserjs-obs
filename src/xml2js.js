(function (root, factory) {
  'use strict';
  if(typeof define === 'function' && define.amd){
	  define('xml2js', [], factory);
  }else{
	  root['xml2js'] = factory();
  }
})(this ? this : window, function() {
	'use strict';
	function XmltoJson() {
		var me = this; 

		me.parseString = function(xml, rstr) {
			var xmlDoc;
			if (window.DOMParser) {
				var getxml = new window.DOMParser();
				xmlDoc = getxml.parseFromString(xml, 'text/xml');
			} else {
				xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
				xmlDoc.async = 'false';
			}

			var json_str = jsontoStr(setJsonObj(xmlDoc));

			return (rstr === undefined) ? JSON.parse(json_str)
					: json_str;
		};

		var setJsonObj = function(xml) {
			var js_obj = {};
			if (xml.nodeType === 1) {
				if (xml.attributes.length > 0) {
					js_obj['@attributes'] = {};
					for (var j = 0; j < xml.attributes.length; j++) {
						var attribute = xml.attributes.item(j);
						js_obj['@attributes'][attribute.nodeName] = attribute.value;
					}
				}
			} else if (xml.nodeType === 3) {
				js_obj = xml.nodeValue;
			}
			if (xml.hasChildNodes()) {
				for (var i = 0; i < xml.childNodes.length; i++) {
					var item = xml.childNodes.item(i);
					var nodeName = item.nodeName;
					if (js_obj[nodeName] === undefined) {
						js_obj[nodeName] = setJsonObj(item);
					} else {
						if (js_obj[nodeName].push  === undefined) {
							var old = js_obj[nodeName];
							js_obj[nodeName] = [];
							js_obj[nodeName].push(old);
						}
						js_obj[nodeName].push(setJsonObj(item));
					}
				}
			}
			return js_obj;
		};

		var jsontoStr = function(js_obj) {
			var rejsn = JSON.stringify(js_obj, undefined, 2).replace(
					/(\\t|\\r|\\n)/g, '').replace(/"",[\n\t\r\s]+""[,]*/g, '')
					.replace(/(\n[\t\s\r]*\n)/g, '').replace(
							/[\s\t]{2,}""[,]{0,1}/g, '').replace(
							/"[\s\t]{1,}"[,]{0,1}/g, '').replace(
							/\[[\t\s]*\]/g, '""');
			return (rejsn.indexOf('"parsererror": {') === -1) ? rejsn
					: 'Invalid XML format';
		};
	}

	return new XmltoJson();
});
