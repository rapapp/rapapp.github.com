{
    onRender: function(target, index) {
		this.parent = target;
		this.index = index;
		var script = "http://rapapp.github.com/samples/codemirror/js/codemirror.js";
		var $this = this;
		this.jsloaded = false;
		if (window._codemirror_css_loaded) {
			
		} else {
			window._codemirror_css_loaded = true;
			$('head').append(
				'<style>' +
				'.activeline {background: #e8f2ff !important;}' +
				'.CodeMirror-gutter {min-width: 2.6em; cursor: pointer;}' +
				'</style>'
			);		
			if (document.createStyleSheet){
		    	document.createStyleSheet('http://rapapp.github.com/samples/codemirror/css/codemirror.css');
			} else {
		    	$("head").append($("<link rel='stylesheet' href='http://rapapp.github.com/samples/codemirror/css/codemirror.css' type='text/css' media='screen' />"));
			}		
		}
		t$.injectScript(script, {onSuccess: function(){
			$this.jsloaded = true;
			$this.setup();
		}});
    },
    setup: function() {
		var $this = this;
		if (this.jsloaded && !this.editor) {
			var w = t$.w();
			CodeMirror = w.CodeMirror;
			if (!this.value) {
				this.value = "";
			}
			if (!this.readonly) {
				this.readonly = false;
			}
		  var foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
			this.editor = CodeMirror($('#' + this.id)[0], {
			  value: this.value,
			  mode: "text/javascript", //"text/x-properties", //"text/html", //"text/css", //"text/x-java",
			  tabSize: 2,
			  lineWrapping: true,
			  gutter: true,
			  lineNumbers: true,
			  matchBrackets: true,
			  readOnly: this.readonly,
			  onFocus: function(){
				$this.dofocus();
			  },
			  onBlur: function(){
				$this.doblur();
			  },
			  onCursorActivity: function() {
			    $this.editor.setLineClass(hlLine, null, null);
			    hlLine = $this.editor.setLineClass($this.editor.getCursor().line, null, "activeline");
			  },
			  onGutterClick: foldFunc
			});
			
			var hlLine = $this.editor.setLineClass(0, "activeline");
			var $id = $('#' + this.id);
			$id.css('background-color', '#fff').css('border', '1px solid #D0D0D0');
			$id.find('div.CodeMirror-scroll').width($id.width()).height($id.height());
			this.editor.refresh();
		}
	},
	onLoad: function() {
		this.setup();
	},
	onUnload: function() {
		$('#' + this.id + ' div.CodeMirror').remove();
		this.editor = null;
	},
    onResize: function(width, height) {
		if (this.editor) {
			$('#' + this.id + ' div.CodeMirror-scroll').css('width', width).css('height', height);
			this.editor.refresh();
		}
    },
	setValue: function(value) {
		this.value = this.getValue();
		if (this.value != value) {
			if (this.editor) {
				this.editor.setValue(value);
			}
			this.value = value;
		}
	},
	getValue: function () {
		if (this.editor) this.value = this.editor.getValue();
		return this.value;
	},
	setReadOnly: function(ro) {
		if (this.readonly && this.readonly != ro && this.editor) {
			this.editor.setOption(readonly, ro);
		}
		this.readonly = ro;
	}
}