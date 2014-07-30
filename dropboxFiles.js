var directory;
var client;
var skybox;
var form;
var O;
var ul;

$(document).ready( function () {


 	client = new Dropbox.Client({key: 'phovkvef0jhkx4i'});


	client.onError.addListener(function(error) { alert("there's been an error. please reload the page.\n\n"+error); client.reset();});


	client.authenticate();
	//client.makeUrl('hello_world.txt', {downloadHack: true}, function(a,b) { console.log(a); console.log(b);});
	form = $("#adminForm");
	skybox = "#skybox";
	$(skybox).html('<select style="height: 50px; width: 200px;" id="skyboxList" multiple="true"></select><div id="skyboxMessage"></div>');
	O = obit(client, form, skybox);	
});


function obit(client, form, skybox) {
	this.data = {};
	//this.user = client.
	this.entries = [];
	this.loadEntries = function() {
		client.readdir("/", function (error, entries) {
			this.entries = entries;
			var skyboxList = skybox + " #skyboxList";
			$(skyboxList).html();
			for (entry in entries) {
				if (entries[entry].match(/\.json$/)) {
					$(skyboxList).append("<option class='filename' id='"+entries[entry]+"'>"+entries[entry]+"</option>");
					
				}				
			}
			$("option.filename").click(function (el) {console.log(el)});

		});
	};
	this.create = function() {
		this.data = {};
		this.data.name = window.prompt("Enter name of a new subject","J. Random Dead Guy");
		this.data.file_name = this.data.name.toLowerCase().replace(/\W+/g, '_') + '.json';
		if (this.entries.indexOf(this.data.file_name)>-1) {
			this.write();
		} else {
			//silently fail, keeping the old one
			
		}
		this.populate_form();
	};
	
	
	
	this.populate_form = function () {
		this_obit = this;
		
		$(form.children).each(function (i, el) {
				if (this_obit.data.hasOwnProperty(el.id)) {
					$(el).val(this_obit.data[el.id]);
				}
		});
	};
	this.download = function(json) {
		$.extend(this.data, json);
	};
	this.json = function () { return JSON.stringify(this.data);};
	this.write = function() {
		this.client.write(this.data.file_name, this.json());
	}
	this.loadEntries();
	return this;
}

	
	




