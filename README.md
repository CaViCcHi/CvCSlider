CvC Slider
=============

This is a very simple Slider for jQuery, can be used in the page as many times as it is required.

Usage
-------

include the library

        <script type='text/javascript' src='http://www.yourdomain.com/elements/scripts/jquery/cvcslide/jquery.cvcslide.js'></script>
        
add the class *item-slider* to the children (that will have to slide)

	<div class="bottom-slider">
                <div class="bottom-slider-in">
	                <div class="item-slider slider1"></div>
	                <div class="item-slider slider2"></div>
	                <div class="item-slider slider3"></div>
	                <div class="item-slider slider4"></div>
	        </div>
                <div class="item-toolbox">
	                <div class="item-button">1</div>
	                <div class="item-button">2</div>
	                <div class="item-button">3</div>
	                <div class="item-button">4</div>
	        </div>
                <div class="item-prev"></div>
                <div class="item-next"></div>
	</div>
	
and now simply call the method

	$(document).ready(function(){
		$(".bottom-slider").CvCSlide( { ...options... } );
	});
	

Options
-------

There are a few options available so far

* 	*move_interval*: is the interval between each slide (default: 7000) ms
*	*move_type*: is the type of sliding (default: fade) possible values so far are slide, fade
* 	*move_speed*: is the jquery speed for each action (default: slow) refer to jQuery manual about the allowed values
*       *cvc_active*: is the class attributed to the image or button activated (default: active)
*	*cvc_window*: Class of the images container, default '.slider-window'
*	*cvc_items*: Class of the single image, default '.slider-item'
*	*cvc_caption*: Class of the caption for a single image, default '.slider-caption'
*	*cvc_button_dad*: Class of the buttons container (whatever contains the single steps), default '.slider-buttons'
*	*cvc_button*: Class of the single button, default '.slider-button'
*	*cvc_pause*: Class of the pause button, default '.slider-pause'
*	*cvc_play*: Class of the play button, default '.slider-play'
*	*cvc_prev*: Class of the previous button, default '.slider-prev'
*	*cvc_next*: Class of the next button, default '.slider-next'

A small example would be

	$(".bottom-slider").CvCSlide({
	       move_type 	: 'slide',
	       move_speed 	: 1000,
	       move_interval 	: 7000,
	       cvc_window       : '.bottom-slider-in',
	       cvc_items	: '.item-slider',
	       cvc_button_dad	: '.item-toolbox',
	       cvc_button	: '.item-button',
	       cvc_prev	        : '.item-prev',
	       cvc_next	        : '.item-prev'
	});
	
will slide the items every 7 seconds with previous/next or the single slides




Matteo