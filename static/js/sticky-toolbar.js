/* 
http://www.backslash.gr/content/blog/webdevelopment/6-navigation-menu-that-stays-on-top-with-jquery
*/

$(function() {

	// grab the initial top offset of the navigation 
	var sticky_navigation_offset_top = $('#sticky_toolbar').offset().top;
	var sticky_navigation_offset_left = $('#sticky_toolbar').offset().left;
	var sticky_navigation_width = $('#sticky_toolbar').width()
	
	
	// our function that decides weather the navigation bar should have "fixed" css position or not.
	var sticky_navigation = function(){
		var scroll_top = $(window).scrollTop(); // our current vertical position from the top
		
		// if we've scrolled more than the navigation, change its position to fixed to stick to top, otherwise change it back to relative
		if (scroll_top > sticky_navigation_offset_top  ) { 
			$('#sticky_toolbar').css({ 'position': 'fixed', 'top':0, 'padding-top': 5, 'width': sticky_navigation_width });
		} else {
			$('#sticky_toolbar').css({ 'position': 'relative', 'padding-top': 0,  }); 
			$('#sticky_toolbar hr').css({  });

		}   
	};
	
	// run our function on load
	sticky_navigation();
	
	// and run it again every time you scroll
	$(window).scroll(function() {
		 sticky_navigation();
	});
	
	// NOT required:
	// for this demo disable all links that point to "#"
	$('a[href="#"]').click(function(event){ 
		event.preventDefault(); 
	});
	
});

