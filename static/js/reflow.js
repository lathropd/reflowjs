var timelineRenderer = new marked.Renderer();

timelineRenderer.list = function(body, ordered) {
	var type = ordered ? 'ol' : 'ul';
	if (ordered) {
		return '<' + type + '>\n' + body + '</' + type + '>\n';
	} else {
		return '<' + type + ' class="timeline">\n' + body +'<li class="year long">&nbsp;</li> ' + '</' + type + '>\n';
	}
};

timelineRenderer.listitem = function(text) {
	var dateRegex = /^((January|Jan\.?|February|Feb\.?|March|April|May|June|July|August|Aug\.?|September|Sept\.?|October|Oct\.?|November|Nov\.?|December|Dec\.?) ?(\d{1,2}(rd|nd|st)?\,? ?)?)?(\d{4})?$/,
	yearRegex = /^(\d{4})(\s*\-\s*\d{4})?$/;

	if (yearRegex.test(text)) {
		return '<li class="year">' + text + '</li>\n';
	} else if (dateRegex.test(text)) {
		return '<li class="year long">' + text + '</li>\n';
	} else {
		return '<li class="event">' + text + '</li>\n';
	}
};
marked.setOptions({
	smartypants: true,
});



brightcove.createExperiences();
var obitName = new RegExp(getParameterByName("name"),'i');
var pckry = {};

// responsive slideshow from Mark Lee
// http://themarklee.com/2013/12/26/simple-diy-responsive-slideshow-made-html5-css3-javascript/

//loader
function start() {
	var request = new window.XMLHttpRequest();
	request.open("GET", "https://"+getParameterByName("file"), false);
	request.onload = function(e){
		var obitdata = JSON.parse(this.response);
		init(obitdata);
		var container = document.querySelector('#content');
		pckry = new Packery( container, {
			"column": 320,
			"itemSelector": ".box",
			"gutter": 10,
		});
		pack();
		var i = setInterval(pack, 100);
		setTimeout(function(){clearInterval(i)},120000);
		brightcove.createExperiences();
	}
	request.send();
}


function preview(client) {
	var file = getParameterByName("file");
	client.readFile(file, function (error, results) {
		var obitdata = JSON.parse(results);
		init(obitdata);
		var container = document.querySelector('#content');
		pckry = new Packery( container, {
			"column": 320,
			"itemSelector": ".box",
			"gutter": 10,
		});
		pack();
		var i = setInterval(pack, 100);
		setTimeout(function(){clearInterval(i)},120000);
		brightcove.createExperiences();
	});
}


function brightcovePlayer(id) {
	var html = '<!-- Start of Brightcove Player -->'
	+'<object id="myExperience" class="BrightcoveExperience">'
	+'  <param name="bgcolor" value="#FFFFFF" />'
	+'  <param name="width" value="100%" />'
	+'  <param name="height" value="400px" />'
	+'  <param name="playerID" value="2418610043001" />'
	+'  <param name="playerKey" value="AQ~~,AAACLrx-GiE~,-R5NlQaAplIWhlMPcU5YDN5147VaN70m" />'
	+'  <param name="isVid" value="true" />'
	+'  <param name="isUI" value="true" />'
	+'  <param name="dynamicStreaming" value="true" />'
	+''
	+'  <param name="@videoPlayer" value="'+id+'" /> <!-- replace value with video ID -->'
	+'</object>'
	+ '<script type="text/javascript">brightcove.createExperiences();\<\/script>'

	return html;
}

function swap(id, content) {
	document.getElementById(id).innerHTML = content;
}

function insert(id, content) {
	document.getElementById(id).innerHTML = "<div>"+format(content,id)+"</div>";
}

var boxen = ['bigMultimedia','boxOne','boxTwo','boxThree','boxFour','boxFive','boxSix',
	'boxSeven','boxEight','boxNine','boxTen','boxEleven',"mugshotPhoto",'mugshotBio',];
var strings = ['bigHeadline', "mugshotName", "mugshotDates",];

function swapLoop(id_list, data, fn) {
	for (var i=0; i < id_list.length; i++) {
		var val = id_list[i];
		if (data.hasOwnProperty(val)&data[val]!=""&data[val]!=null){
			fn(val, data[val]);
		} else {
			document.getElementById(val).remove();
		}
	}
}

function bgImage(pagedata) {
	if (img.src) {
		var bigDiv =  document.getElementById('bigPicture');
		bigDiv.style.backgroundImage = 'url(' + pagedata.bigImage + ')';
		if (document.body.clientWidth > img.width) {
			bigDiv.style.backgroundSize = 100 + "%";
		} else {
			bigDiv.style.backgroundSize = "";
		}

		if (img.height >= 500) {
			bigDiv.style.height = "500px";
		} else if (img.height >= 400) {
			bigDiv.style.height = "400px";
		} else if (img.height >= 300) {
			bigDiv.style.height = "300px";
		} else if (img.height >= 250) {
			bigDiv.style.height = "250px";
		} else {
			bigDiv.style.height = "250px";
			bigDiv.style.backgroundSize = 250/img.height * 100 + "%";
		}
	}
}

function init(pagedata) {
	var img = new Image();
	if (pagedata.hasOwnProperty('bigImage')&pagedata.bigImage!="") {
		var bigDiv =  document.getElementById('bigPicture');
		img.onload = function () {bgImage(pagedata)};
		bigDiv.style.backgroundImage = 'url(' + pagedata.bigImage + ')';
		img.src = pagedata.bigImage;
		document.getElementById('bigPicture').innerHTML = "<div>" + document.getElementById('bigPicture').innerHTML + "</div>";
	}
	window.onresize = function () {bgImage(pagedata)};
	swapLoop(strings, pagedata, swap);
	swapLoop(boxen, pagedata, insert);
	reflowSettings.maps.forEach(makeMap);
	document.body.style.display = "";
}
function makeMap(a, b, c) {
	document.getElementById(a.div).style.height = document.getElementById(a.div).parentElement.parentElement.clientWidth + "px";
	var bounds = new google.maps.LatLngBounds();
	var mapOptions = {	zoom: reflowSettings.zoomLevel, };
	var map = new google.maps.Map(document.getElementById(a.div), mapOptions);
	var markers = [];
	var windows = [];
	var infowindow = new google.maps.InfoWindow({ content: ""});

	for (var i in a.points ) {
		windows.push(a.points[i][1]);
		var toGeocode = { address: a.points[i][0], };
		reflowSettings.geocoder.geocode(toGeocode, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
				});
				markers.push(marker);
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(windows[markers.indexOf(this)]);
					infowindow.open(map,this);
				});
				bounds.extend(results[0].geometry.location);
				map.setCenter(bounds.getCenter());
				if (a.points.length > 1) {
					map.fitBounds(bounds);
				}

			} else {
			}
		});
	}
}

function pack() {
	pckry.layout();
}

function format(text, id) {
	var formatted = text;
	var rawImage = /( |\n|^)(\S*\.(jpe?g|png|gif))( |\n|$)/gi;
	var isImage = /^\S*\.(jpe?g|png|gif)$/i;
	var isBrightcove = /http:\/\/bcove.me.*/;
	var brightcoveId = /^(\d{9,})$/mg;
	var isSlideshow = /^slideshow\:?\s*([\s\S]*)\s(http.*)/;
	var isTimeline = /^timeline\:?\n?/;
	var isLink = /^(http)?\:\/\/\S+\.\S+\s*$/;
	var isHTML = /^\<.*\>$/;
	var isMap = /map\:?\s*([\s\S]+)/;
	var newText = "";

	if (isImage.test(text)) {
		formatted = "<img src='"+text+"'>";
	} else if (isSlideshow.test(text)) {
		id = 'slid' + Math.round(Math.random()*10000);
		var slideshowDiv ="<div id='"+id+"' class='"+id+" bss-slides'></div>",
		slideshowSetup = isSlideshow.exec(text)[1],
		link = isSlideshow.exec(text)[2];
		formatted = '<div class="noMargin">' + marked(slideshowSetup) +'</div>' + slideshowDiv;
		slideshow(link, id);
	} else if (isTimeline.test(text)) {
		text = text.replace(rawImage, "<img src='$2'>");
		newText = text.replace(isTimeline,"");
		formatted = marked(newText, {renderer: timelineRenderer});
	} else if (isHTML.test(text)) {
		formatted = text; // leave it as is
	} else if (isMap.test(text)) {
		// build inline google map;
		var regexResult = isMap.exec(text)[1],
		points = regexResult.split(';'),
		resultObj =  {
			div: 'map'+id,
			points: [],
		}
		for (var index in points) {
			var fields = /(.+)\n(.+)/.exec(points[index]),
			mapPoint = [fields[1], fields[2]];
			resultObj.points[index] = mapPoint;
			resultObj.address = fields[1];
			resultObj.bubble = fields[2];
		}
		formatted = "<div class='map' id='map"+id+"'></div>";
		reflowSettings.maps.push(resultObj);
	} else {
		newText = text.replace(rawImage, "<img src='$2'>");
		newText = newText.replace(brightcoveId, brightcovePlayer("$1"));
		formatted = marked(newText);
	}
	return formatted;
}

/* parameter getter from james padolsey                                        */
/* http://james.padolsey.com/javascript/bujs-1-getparameterbyname/             */
function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)')
	.exec(window.location.search);

	return match ?
		decodeURIComponent(match[1].replace(/\+/g, ' '))
		: null;
}

function slideshow(url, div) {
	var new_url = 'http://pipes.yahoo.com/pipes/pipe.run?_id=2FV68p9G3BGVbc7IdLq02Q&_render=json&feedcount=100&feedurl='+encodeURIComponent(url)+'&_callback=';
	var slideds = new Miso.Dataset({
		url:  new_url,
		jsonp: true,
		extract: function(data){ return data.value.items; }
	});

	slideds.fetch({
		success: function() {
			var el = document.getElementById(div),
			text = el.innerHTML,
			a = "",
			images = [],
			i = 0;
			slideds.each(function(row, rowIndex) {
				images[i] = new Image();
				images[i].src = row.enclosure.url;
				i++;
				a +=  "<figure><img  src='"+row.enclosure.url + "'>"
				a +=  "<figcaption>"
				a +=  row.description;
				a +=  "</figcaption></figure>";
			});
			el.innerHTML =  a;
			makeBSS('.'+div, opts);
			pack();
		}
	});
}
