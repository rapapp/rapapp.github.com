$(document).ready(function(){
	var value = $('#itemid').html();
	$('#itemid').empty();
	this.editor = CodeMirror($('#itemid')[0], {
	  value: value,
	  mode: "text/javascript", // "text/x-properties", //"text/html", //"text/css", //"text/x-java",
	  tabSize: 2,
	  lineNumbers: true,
	  matchBrackets: true,
	  readOnly: false
	});
	var $id = $('#itemid');
	$id.css('background-color', '#fff').css('border', '1px solid #D0D0D0');
	$id.find('div.CodeMirror-scroll').width($(document).width()-20).height($(document).height()-20);
	this.editor.refresh();
});

