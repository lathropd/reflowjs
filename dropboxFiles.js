var directory;
var client;
var skybox = "#skybox";
var form;
var O;
var ul;
var skyboxHTML;

var elementtest;
$(document).ready( function () {


 	client = new Dropbox.Client({key: 'phovkvef0jhkx4i', token:'zy9Bs1eG-scAAAAAAAABQywH6g14oaZPKxItX9tMUbQ-D7ca2fJ3_9p6iEBwOY-g'});


	//client.onError.addListener(function(error) { alert("there's been an error. please reload the page.\n\n"+error); client.reset();});


	client.authenticate();
	//client.makeUrl('hello_world.txt', {downloadHack: true}, function(a,b) { console.log(a); console.log(b);});
	form = $("#adminForm");
	form[0].reset();
	skyboxHTML =$(skybox).html();
	
	$(skybox).html(skyboxHTML);
	O = obit(client, form, skybox);	
	$("button.create").click(function(e){O.create();return false;});
	$("button.save").click(function(e){O.save();return false;});
	$("button.reset").click(function(e){O.data.file_name ="";});
	
});


function obit(client, form, skybox) {
	this.data = {};
	this.form = form;
	//this.user = client.
	this.entries = [];
	this.loadEntries = function() {
		this_obit = this;
		$(skybox).html(skyboxHTML);
		client.readdir("/", function (error, entries) {
			this.entries = entries;
			var skyboxList = skybox + " #skyboxList";
			$(skyboxList).html();
			for (entry in entries) {
				if (entries[entry].match(/\.json$/)) {
					idString  = entries[entry].replace(/\.json$/,'');
					name = idString.replace(/[\W_]/g, ' ');
					if (entries[entry] == this.data.file_name) {
						$(skyboxList).append("<option class='filename' id='"+idString+"' selected='selected'>"+name+"</option>");
					} else {
						$(skyboxList).append("<option class='filename' id='"+idString+"'>"+name+"</option>");
					}
				}				
			}
			$("option.filename").click(function (event) {this_obit.load(this.id+".json")});
			$("#"+(this.data.file_name||"nothing").replace(/.json/,"")).attr('selected','selected');

		});
	};
	this.create = function() {
		console.log(1)
		this.data = {};
		this.data.name = window.prompt("Enter name of a new subject","J. Random Dead Guy");
		this.data.file_name = this.data.name.toLowerCase().replace(/\W+/g, '_') + '.json';
		if (this.entries.indexOf(this.data.file_name)>-1) {
			//silently fail, keeping the old one
		} else {
			this.write();
			
		}
		
		
	};
	
	
	
	this.load = function (name) {
		this_obit = this;
		$("input, textarea").val("");
		$("button#reset").click();
		this.data.file_name = name;
		client.readFile(name, function (error, results) {
			if (error) {
				return error;
			} else {
				this.data.file_name  = name;
				this.data = JSON.parse(results);
				console.log(results);
				if (!this.data.url||!this.data.webUrl) {
					client.makeUrl(name, {downloadHack: true}, function (error, result) {
						$("#url").val(result.url);
						$("#webUrl").val("https://lathropd.github.com/reflowjs/?"+result.url.replace(/https?\:\/\/dl.dropboxusercontent.com/,""));
					});
				
				}
				
		
				$("input, textarea").each(function (i, el) {
						
						if (this_obit.data.hasOwnProperty(el.id)) {
							el.value=this_obit.data[el.id];
						} 
				});
				

			}
		});
		
	}

	this.json = function () { return JSON.stringify(this.data);};
	this.write = function() {
			client.writeFile(this.data.file_name, this.json());
			
			this.loadEntries();
			//this.load(this.data.file_name); 	
			
		
	}
	this.save = function () {
		this_obit = this;
		$(form).find("input, textarea").each(function (i, element) {
			if (element.name) {
				if (!element.value&&this_obit.data.hasOwnProperty(element.name)) {
					this_obit.data[element.name] = "";
				} else if (element.value){
					console.log(element.value);
					this_obit.data[element.name] = element.value;
					this_obit.data[element.id] = element.value;
					
				}
			}
		});
		
		this.write();
	}
	
	this.loadEntries();
	return this;
}

	
	




