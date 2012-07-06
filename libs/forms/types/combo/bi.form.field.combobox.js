

BI.Forms.Fields.Combo = function(main) {
	
	this.main = main;
	this.treeLoaded = false;
	this.optionsIndexed = [];
	this.options;
	
	
	this._loadedCallback = [];
}

BI.Forms.Fields.Combo.prototype = {

	buildHtml: BI.Forms.FieldGeneric.buildHtml,
	
	setText: function(index, text) {
		this.main.fieldContainer.children().eq(index).html(text);
	},
	
	setOptions: function(options, index) {
		
		if(index !== undefined) {
			this.optionsIndexed[index] = options;
		} else
			this.options = options;
		
		this.loadTree(index);
	},
	
	setOptionsUrl: function(url, index) {
		
		var field = this;
		$.ajax({
			url: url + "&init=1",
			dataType: 'xml',
			type: 'get',
			success: function(dataXml) {
				var xml = $($.parseXML(data)).children();
				var json = field.parseLazyRead(dom);
				field.options = json;
				field.loadTree();
			}
		});
	},
	
	loadTree: function(index) {
		
		var field = this;
		/*
		if(this.treeLoaded) {
			
		      
		      var rootNode = this.main.domExpander.dynatree("getRoot");
		      rootNode.deactivate()
		      rootNode.removeChildren();
		      rootNode.addChild(((index !== undefined && this.optionsIndexed[index] !== undefined) ? this.optionsIndexed[index] : this.options));
		      rootNode.activate()
		      
		      return;
		}
		*/
		if(!this.main.isInit || (this.options == undefined && this.optionsIndexed[index] == undefined))
			return;
		
		this.treeLoaded = true;
		
		
		this.main.domExpander.empty().html('<div />').children().dynatree({
			
			children: ((index !== undefined && this.optionsIndexed[index] !== undefined) ? this.optionsIndexed[index] : this.options),
			imagePath: '',
			onLazyRead: function(node) {
				
				if(!node.data.isFolder)
					return;
				
				$.ajax({
					url: this.treeUrl + "&root=" + noda.data.key,
					data: field.main.form.getSerializedForm(),
					type: 'post',
					dataType: 'xml',
					timeout: 120000, // 2 minutes timeout
					success: function(data) {
						var xml = $($.parseXML(data)).children();
						var json = field.parseLazyRead(dom);
						node.removeChildren(false, true, true);
						node.setLazyNodeStatus(DTNodeStatus_Ok);
						node.addChild(json);
					}
				});
			},

			onActivate: function(node, event) {
					
				//event.stopPropagation();
				
				if(field.currentIndex !== undefined)
					var index = field.currentIndex;
				
				if(index == undefined)
					var index = field.main.findExpandedElement().index;
				
				var id = node.data.key;
				var icon = node.data.icon;
				var title = node.data.title;
				// If we click on a folder, do nothing.
				if(node.data.isFolder)
					return;
					
			//	field.main.setIcon(index, icon);
				field.main.changeValue(index, id);
				field.setText(index, title);
				
				field.main.hideExpander();
			},
			
			onClick: function() {
				field._loadedCallback = [];
			},
			
			onPostInit: function() {
				
				field.doValCallback();
			},
			
			debugLevel: 0
		});
	},
	
	
	doValCallback: function() {
		
		if(this._loadedCallback) {
			for(var i = 0; i < this._loadedCallback.length; i++) {
				this._loadedCallback[i].call(this);
			}
		}
	},
	
	
	setValue: function(index, value) {
		var index2 = index;
		var field = this;
		
		this._loadedCallback.push(function() {
			field.currentIndex = index2;
			var tree, node;
			tree = field.main.domExpander.children().dynatree("getTree");
			
			if(tree.getNodeByKey && (node = tree.getNodeByKey(value))) {
				node.activate();
				node.deactivate();
			}
		});
		
		this.doValCallback();
	},
	
	
	parseLazyRead: function(dom) {
	
		var json = [];
		var child = $(dom).children();
		for(var i = 0; i < child.length; i++) {
			
			var node = child[i];
			if(child[i].nodeType == 3)
				continue;
			json.push({
				key: node.getAttribute('value'),
				title: node.getAttribute('text'),
				children: BI.form._IMPL.fieldComboBox.parseRecursive(node),
				isLazy: node.getAttribute('leaf') == 1 ? false : true,
				isFolder: node.getAttribute('folder') == 1 ? true : false,
				icon: BI.icons.iconToUrl(node.getAttribute('icon'))
			});
		}
		
		return json;	
	},
	
	
	addField: BI.Forms.FieldGeneric.addField,
	removeField: BI.Forms.FieldGeneric.removeField
	
}