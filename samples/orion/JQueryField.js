{
    onRender: function(target, index) {
		this.parent = target;
		this.index = index;
		var script = "http://download.eclipse.org/e4/orion/js/org.eclipse.orion.client.editor/orion-editor.js";
		var $this = this;
		t$.injectScript(script, {onSuccess: function(){
			$this.setup();
		}});
    },
    setup: function() {
		if (!this.editor) {
			var w = t$.w();
			eclipse = w.eclipse;
			var parentNode = $('#' + this.id)[0];
			var options = {
			         parent: parentNode, 
			         readonly: false,
			         stylesheet: "http://download.eclipse.org/e4/orion/js/org.eclipse.orion.client.editor/editor.css"
			      };
			this.editor = new eclipse.Editor(options);
			$("#" + this.id).css("background-color", "#fff");

			var lines = new eclipse.LineNumberRuler("left", {styleClass: "ruler_lines"}, {styleClass: "ruler_lines_odd"}, {styleClass: "ruler_lines_even"});

			var styler = null;
			if (styler) {
				styler.destroy();
				styler = null;
			}

			styler = new eclipse.TextStyler(this.editor, "js");	
			this.editor.addRuler(lines);
			$this = this;
			
			this.editor.addEventListener("Focus", function(evt) {
				$this.dofocus();
			});			
			this.editor.addEventListener("Blur", function(evt) {
				$this.doblur();
			});
						
			if (this.readonly) {
				this.editor.setReadOnly(this.readonly);
			}
			if (!this.value) {
				this.value = "Select a Page";
			}
			this.editor.setText(this.value);
		}
	},
	onLoad: function() {
	},
	onUnload: function() {
	},
    onResize: function(width, height) {
	    // resize is automcatically taken care by the editor
    },
	setValue: function(value) {
		this.value = this.getValue();
		if (this.value != value) {
			if (this.editor) {
				this.editor.setText(value);
			}
			this.value = value;
		}
	},
	getValue: function () {
		if (this.editor) return this.editor.getText();
		else return this.value;
	},
	setReadOnly: function(ro) {
		if (this.readonly && this.readonly != ro && this.editor) {
			this.editor.setOptions({readonly: ro});
		}
		this.readonly = ro;
	}
}