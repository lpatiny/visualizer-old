var help={};
var helpFiles = ["ChemCalc","String"];
for (var i=0; i<helpFiles.length; i++) {
	$.getJSON("http://script.epfl.ch/servletScript/javascript/help/"+helpFiles[i]+".help.json", {}, function(data) {
		for (property in data) {
			help[property]=data[property];
		}
	});
}

var url='JavaScriptServlet';

function openVisualizer() {
	// do we have a data and view ?
	var viewURL="";
	var dataURL="";
	var saveViewURL="";
	if (! result.url) {
		alert("No results are available");
		return;
	} else {
		dataURL=escape(result.url);
	}
	if ($('#viewList').val() && $('#viewList').val()!="") {
		viewURL=escape($('#viewList').val());
		saveViewURL=escape($('#viewList').val().replace("action=LoadFile","action=SaveFile"));
	} else {
		alert("The view is not specified");
		return;
	}
	
	window.open("http://lpatiny.github.com/visualizer/index.html?viewURL="+viewURL+"&dataURL="+dataURL+"&saveViewURL="+saveViewURL);
}

function saveScript() {
	if ($('#name').val()=="") {
		alert("You need to specifiy the name of the script you want to save.");
		return false;
	}
	
	$('#name').val($('#name').val().replace(/\.js/,"")+".js");
	
	editor.save();
	$.post(url,
		{
			action: "SaveScript",
			name:$('#name').val(),
			script:$('#script').val()
		},
		function(data) {
			refreshScript();
	  });
}

function saveView() {
	if ($('#name').val()=="") {
		alert("You need to specifiy the name of the view you want to save.");
		return false;
	}
	
	$('#name').val($('#name').val().replace(/\.view/,"")+".view");
	
	editor.save();
	$.post(url,
		{
			action: "SaveScript",
			name:$('#name').val(),
			script:$('#script').val()
		},
		function(data) {
			refreshScript();
	  });
}

function deleteScript() {
	if ($('#name').val()=="") {
		alert("You need to specifiy the name of the file you want to delete.");
		return false;
	}
	if (confirm('Are you sure you want to delete this file?')) {
		$.get(url,
				{
					action: "DeleteScript",
					name:$('#name').val()
				},
				function(data) {
					refreshScript();
			  });
	} else {
		return false;
	}

}

var result;
function runScript() {
	editor.save();
	$('#result').val("Running ...");
	hideButtons();
	$.post(url,
			{
				script: $('#script').val()
			},
			function(data) {
				result=data;
				$('#result').val(JSON.stringify(data));
				for (var metaVar in result){
					if (result[metaVar].type == 'matrix'){
						$('#matdraw').css('visibility','visible');
						$('#report').css('visibility','visible');
					}
					if(result[metaVar].type == 'dendrogram')
						$('#dendrogram').css('visibility','visible');
					if(result[metaVar].type == 'jcamp')
						$('#jcamp').css('visibility','visible');
					if(result[metaVar].type == 'googleChart')
						$('#googleChart').css('visibility','visible');
				}
		  });
	
}


function hideButtons(){
	$('#matdraw').css('visibility','hidden');
	$('#report').css('visibility','hidden');
	$('#dendrogram').css('visibility','hidden');
	$('#jcamp').css('visibility','hidden');
	$('#googleChart').css('visibility','hidden');
}

function loadScript(scriptName) {
	$('#name').val(scriptName);
	$.get(url,
		{
			action: "LoadScript",
			name:scriptName
		},
		function(data) {
			editor.toTextArea();
			$('#script').val(data);
			addEditor();
	  });
}

function refreshView() {
	$.get(url,
		{
			action: "ListView"
		},
		function(data) {
			var lines=data.split(/[\r\n]+/);
			$('#viewList').html("");
			for (var i=0; i<lines.length; i++) {
				if (lines[i]!="") {
					var fields=lines[i].split("\t");
					if (fields.length==2) {
						var option = document.createElement('option');
						option.value=fields[0];
						option.appendChild(document.createTextNode(fields[1]));
						$('#viewList').append(option);
					}
				}
			}
	  });
}

function refreshScript() {
	$.get(url,
		{
			action: "ListScript"
		},
		function(data) {
			var lines=data.split(/[\r\n]+/);
			$('#scriptList').html("");
			for (var i=0; i<lines.length; i++) {
				if (lines[i]!="") {
					var option = document.createElement('option');
					option.value=lines[i];
					option.appendChild(document.createTextNode(lines[i]));
					$('#scriptList').append(option);
				}
			}
	  });
	refreshView();
}

var editor;
var hints;

function addEditor() {
      hints = $("#hints");
  
      editor = CodeMirror.fromTextArea($("#script")[0], {
        mode: "javascript",
        onCursorActivity: function(cm) {HELP.showHints(cm, hints);},
        extraKeys: {"Ctrl-Space": function(cm) {CodeMirror.simpleHint(cm, HELP.javascriptHint);}},
        lineNumbers: true,
        matchBrackets: true,
        tabMode: "indent",
        autofocus: true
      });
}


$(document).ready(function() {
	refreshScript();
	addEditor();
	
	FileBrowser.initialize();
});