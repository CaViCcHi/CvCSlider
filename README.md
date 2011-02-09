CvC Slider
=============

This is a very simple Slider for jQuery, can be used in the page as many times as it is required.

Usage
-------

include the library

        <script type='text/javascript' src='http://www.yourdomain.com/elements/scripts/jquery/cvcslide/jquery.cvcslide.js'></script>
        
add the class *item-slider* to the children (that will have to slide)

	<div class="bottom-slider">
	        <div class="item-slider slider1"></div>
	        <div class="item-slider slider2"></div>
	        <div class="item-slider slider3"></div>
	        <div class="item-slider slider4"></div>
	</div>
	
and now simply call the method

	$(document).ready(function(){
		$(".bottom-slider").CvCSlide();
	});
	

Options
-------

There are a few options available so far

* 	*interval*: is the interval between each slide (default: 3000) ms
*	*type*: is the type of sliding (default: fade) possible values so far are slide, fade
* 	*speed*: is the jquery speed for each action (default: slow) refer to jQuery manual about the allowed values

A small example would be

	$(".bottom-slider").CvCSlide({
		'interval' : 7000,
		'type' : 'slide'
	});
	
will slide the items every 7 seconds




Matteo