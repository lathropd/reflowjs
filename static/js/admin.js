var directory;
var client;
var skybox = "#skybox";
var form;
var O;
var ul;
var skyboxHTML;

var elementtest;
$(document).ready( function () {
    client = new Dropbox.Client({key: 'adhp94h23c2mapg'});
    client.reset();
    client.authenticate();
    form = $("#adminForm");
    form[0].reset();
    skyboxHTML = $(skybox).html();
    $(skybox).html(skyboxHTML);
    O = admin({client: client, form:form, skybox:skybox, folder: 'AJC-Reflow'});
    $("button.create").click(function(e){O.create();return false;});
    $("button.save").click(function(e){O.save();return false;});
    $("button.rename").click(function(e){O.rename();return false;});
    $("button.reset").click(function(e){O.data.file_name ="";});
    $("textarea#tableGenerator").keyup(function () { textToTable($("textarea#tableGenerator"), $("#tableCode"));});
	$("textarea#tableGenerator").keyup();

});


function textToTable(element, target) {
    contents = element.val();
    rows = contents.trim().split("\n");
    html = "<table>\n";
    html += "<tr><th>";
    html += rows.shift().split("\t").join("</th><th>");
    html += "</th></tr>\n";

    while (rows.length > 0) {
        html += "<tr><td>";
        html += rows.shift().split("\t").join("</td><td>");
        html += "</td><td>\n";
    }
    html +="</table>";
    target.text(html);
}



// create a JS object by having a function return itself
function admin( options ) {

	//set default options
	this.options = {
		client: null,
		form: '#adminForm',
		skybox: '#skyBoxForm',
		folder: '',
		drafts: '/Drafts',
		published: '/Published',
		data: {}
	}
	
	// pass in the actual options
	$.extend(this.options, options);
	
	// create a local variable for the client
	client = this.options.client;
	
	// load initial data (normally blank)
    this.data = this.options.data;
    
    // load the form selector
    this.form = this.options.form;
    
    // start with empty list of entries
    this.entries = [];
    
    
    // define the object's methods
    // (technically these are attributes containing functions)
    
    // load entries
    this.loadEntries = function() {
    	// create a variable we can pass to callbacks
        this_admin = this;
        $(skybox).html(skyboxHTML);
        client.readdir("/AJC-Reflow/Drafts", function (error, entries) {
            this.entries = entries;
            var skyboxList = skybox + " #skyboxList";
            $(skyboxList).html();
            for (entry in entries) {
                if (entries[entry].match(/\.json$/)) {
                    idString  = entries[entry].replace(/\.json$/,'');
                    name = idString.replace(/[\W_]/g, ' ');
                    if ('/AJC-Reflow/Drafts/' + entries[entry] == this.data.file_name) {
                        $(skyboxList).append("<option class='filename' id='"+idString+"' selected='selected'>"+name+"</option>");
                    } else {
                        $(skyboxList).append("<option class='filename' id='"+idString+"'>"+name+"</option>");
                    }
                }
            }
            $("option.filename").on("click", function (event) {this_admin.load(this.id+".json")});
            $("#"+(this.data.file_name||"nothing").replace(/.json/,"")).click();
        });
    };
    
    // create 
    this.create = function() {
        // create a variable we can pass to callbacks
        this_admin = this;
        console.log(1)
            this.data = {};
        this.data.name = window.prompt("Enter name of a new subject","");
        this.data.file_name = '/AJC-Reflow/Drafts/' + this.data.name.toLowerCase().replace(/\W+/g, '_') + '.json';
        if (this.entries.indexOf(this.data.file_name)>-1) {
            //silently fail, keeping the old one
        } else {
            this.write();
        }
    };

    this.load = function (name) {
    	// create a variable we can pass to callbacks
        this_admin = this;
        form.find("input, textarea").val("");
        form.find("a#url, a#webUrl").text("this will populate automatically").prop("href","");
        $("button#reset").click();
        this.data.file_name = '/AJC-Reflow/Drafts/' + name;
        thisFileName = this.data.file_name;
        client.readFile(this.data.file_name, function (error, results) {
            if (error) {
                return error;
            } else {
                //this.data.file_name  = name;
                
                this.data = JSON.parse(results);
                this.data.file_name = thisFileName;
                if (!this.data.url||!this.data.webUrl) {
                    thisObit = this;
                    client.makeUrl(this.data.file_name, {downloadHack: true}, function (error, result) {
                        webUrl = "https://lathropd.github.com/reflowjs/?file="+result.url.replace(/https?\:\/\//,"");
                        $("#url").text(result.url).prop("href", result.url);
                        $("#webUrl").text(webUrl).prop("href",webUrl);
                        thisObit.data.url = result.url;
                        thisObit.data.webUrl = webUrl;
                    });
                } else {
                    $("#url").text(this.data.url).prop("href", this.data.url);
                    $("#webUrl").text(this.data.webUrl).prop("href",this.data.webUrl);
                }

                $("input, textarea").each(function (i, el) {
                    if (this_admin.data.hasOwnProperty(el.id)) {
                        el.value=this_admin.data[el.id];
                    }
                });
                $("textarea.mdhtmlform-md").keyup();
            }
        });
    }

    this.json = function () { return JSON.stringify(this.data);};
    this.write = function() {
    	// create a variable we can pass to callbacks
        this_admin = this;
        
        client.writeFile(this.data.file_name, this.json(), function () {this_admin.loadEntries();});
    }
    this.save = function () {
    	// create a variable we can pass to callbacks
        this_admin = this;
        
        $(form).find("input, textarea").each(function (i, element) {
            if (element.name) {
                if (!element.value&&this_admin.data.hasOwnProperty(element.name)) {
                    this_admin.data[element.name] = "";
                } else if (element.value){
                    console.log(element.value);
                    this_admin.data[element.name] = element.value.trim();
                    this_admin.data[element.id] = element.value.trim();
                }
            }
        });
        this.data.mugshotName = this.data.name;

        this.write();
        alert("Changes saved");

    }
	
	// load the initial set of entries
    this.loadEntries();
    
    // return the function as a JS object
    return this;
}