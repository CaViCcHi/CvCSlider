CvC Slider
=============

This is a very simple Slider for jQuery, can be used in the page as many times as it is required.
It is now safe to use it everywhere in conjunction with any other javascript framework (moved from $ to jQuery)

Usage
-------

include the library

        <script type='text/javascript' src='http://www.yourdomain.com/elements/scripts/jquery/cvcslide/jquery.cvcslide.js'></script>
        
add the class *item-slider* to the children (that will have to slide)

	<div class="bottom-slider">
		<div class="bottom-slider-in">
			<div class="item-picture slider1"></div>
			<div class="item-picture slider2"></div>
			<div class="item-picture slider3"></div>
			<div class="item-picture slider4"></div>
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
	
and now simply call the method (this is just an example ( ...options... ) will give you an error :)

	$(document).ready(function(){
		$(".bottom-slider").CvCSlide( { ...options... } );
	});
	

Options
-------

There are a few options available so far

* 	*move_interval*: is the interval between each slide [default: 7000] ms, if 0 the slider won't slide automatically
*	*move_type*: is the type of sliding [default: fade] possible values so far are slide, fade and multislide
* 	*move_speed*: is the jquery speed for each action [default: slow] refer to jQuery manual about the allowed values
* 	*move_stopatlast* : do you want the animation to pause at the end of the slideshow? [default: false]
*	*ms_show*: (Multislide Only) how many frames you want to show at a time? [default: 3]
*	*ms_margin*: (Multislide Only) What is the margin between each frame? in pixels [default: 10]
*	*ms_fullpages*: (Multislide Only) Do you want to show the "ms_show" amount at all times? (when at the end of the film you might have only 2 to show, if true will show the last 2 and the previous 1). [default: true]
*       *cvc_active*: is the class attributed to the image or button activated [default: active]
*	*cvc_window*: Class of the images container, default '.slider-window'
*	*cvc_items*: Class of the single image, default '.slider-item'
*	*cvc_caption*: Class of the caption for a single image, default '.slider-caption'
*	*cvc_button_dad*: Class of the buttons container (whatever contains the single steps), default '.slider-buttons'
*	*cvc_button*: Class of the single button, default '.slider-button'
*	*cvc_pause*: Class of the pause button, default '.slider-pause'
*	*cvc_play*: Class of the play button, default '.slider-play'
*	*cvc_prev*: Class of the previous button, default '.slider-prev'
*	*cvc_next*: Class of the next button, default '.slider-next'
*       *debug*: Do you want to debug the class? everything will be logged in the console (Will work on all browser with a console, no IE7 and lower). [default false]

A small example would be

	$(".bottom-slider").CvCSlide({
	       move_type 	: 'slide',
	       move_speed 	: 1000,
	       move_interval 	: 7000,
	       cvc_window       : '.bottom-slider-in',
	       cvc_items	: '.item-picture',
	       cvc_button_dad	: '.item-toolbox',
	       cvc_button	: '.item-button',
	       cvc_prev	        : '.item-prev',
	       cvc_next	        : '.item-next',
	       debug		: true
	});
	

will slide the items every 7 seconds with previous/next or the single slides

Remember to make sure that the classes you have in your file match then one you are telling the CvCSlider!




Matteo