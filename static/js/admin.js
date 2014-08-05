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

$("textarea#tableGenerator").keyup(function () { textToTable($("textarea#tableGenerator"), $("#tableCode"));});
$("textarea#tableGenerator").keyup();


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
            $("option.filename").on("click", function (event) {this_obit.load(this.id+".json")});
            $("#"+(this.data.file_name||"nothing").replace(/.json/,"")).click();
        });
    };
    this.create = function() {
        console.log(1)
            this.data = {};
        this.data.name = window.prompt("Enter name of a new subject","");
        this.data.file_name = this.data.name.toLowerCase().replace(/\W+/g, '_') + '.json';
        if (this.entries.indexOf(this.data.file_name)>-1) {
            //silently fail, keeping the old one
        } else {
            this.write();
        }
    };

    this.load = function (name) {
        this_obit = this;
        form.find("input, textarea").val("");
        form.find("a#url, a#webUrl").text("this will populate automatically").prop("href","");
        $("button#reset").click();
        this.data.file_name = name;
        client.readFile(name, function (error, results) {
            if (error) {
                return error;
            } else {
                this.data.file_name  = name;
                this.data = JSON.parse(results);
                if (!this.data.url||!this.data.webUrl) {
                    thisObit = this;
                    client.makeUrl(name, {downloadHack: true}, function (error, result) {
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
                    if (this_obit.data.hasOwnProperty(el.id)) {
                        el.value=this_obit.data[el.id];
                    }
                });
                $("textarea.mdhtmlform-md").keyup();
            }
        });
    }

    this.json = function () { return JSON.stringify(this.data);};
    this.write = function() {
        this_obit = this;
        client.writeFile(this.data.file_name, this.json(), function () {this_obit.loadEntries();});
    }
    this.save = function () {
        this_obit = this;

        $(form).find("input, textarea").each(function (i, element) {
            if (element.name) {
                if (!element.value&&this_obit.data.hasOwnProperty(element.name)) {
                    this_obit.data[element.name] = "";
                } else if (element.value){
                    console.log(element.value);
                    this_obit.data[element.name] = element.value.trim();
                    this_obit.data[element.id] = element.value.trim();
                }
            }
        });
        this.data.mugshotName = this.data.name;

        this.write();
    }

    this.loadEntries();
    return this;
}