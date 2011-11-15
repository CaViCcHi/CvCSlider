/*
	CaViCcHi CvCSlide: Copyright 2011 - NOW()

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/
(function(jQuery) {

	/**
	* Initialize and setup plugin
	* @param {Object} options The set of options to pass to over-write the defaults
	*/
	jQuery.fn.cvcslide = jQuery.fn.CvCSlide = function(options){

		// General
		var main = this,
			interval = false,
			captions = false,
			buttons = false,
			current = 0,
			next = 0,
			fluidW = 0,
			father = this,
			playing = false,
			$object_now = null,
			$object_next = null,
			ms_lastindex = null,
			ms_pages = null,
			ms_off = null,
			ms_pageIndex = Array(),
			imgX = Array(),
			imgW = Array(),

			// Set up the default options
			defaults = {
				cvc_window      : '.slider-window',
				cvc_items	: '.slider-item',
				cvc_caption	: '.slider-caption',

				cvc_button_dad  : '.slider-buttons',
				cvc_button      : '.slider-button',

				cvc_pause       : '.slider-pause',
				cvc_play	: '.slider-play',

				cvc_prev        : '.slider-prev',
				cvc_next        : '.slider-next',

				cvc_active      : 'active',

				move_interval   : 7000,
				move_type       : 'fade',
				move_speed      : 'slow',
				move_fluid      : true,
				move_stopatlast : false,

				ms_show 	: 3,
				ms_margin	: 10,
				ms_fullpages	: true,

				active          : true,

				touch           : false,
				touch_snapgrid  : false,

				action_start	: '',
				action_complete	: '',

				debug           : false
			},

			// Now overwrite the default options with the ones passed in
			options = jQuery.extend(defaults, options),
			$items = jQuery(options.cvc_items, main),
			$buttons = jQuery(options.cvc_button, options.cvc_button_dad),
			$cover = jQuery(options.cvc_window, main),
			whitespace = main.width() - $cover.width(),

			$play = jQuery(options.cvc_play),
			$pause = jQuery(options.cvc_pause),

			$prev = jQuery(options.cvc_prev),
			$next = jQuery(options.cvc_next),

			item_max = $items.size() - 1;
			item_avail = $items.size();
/* General */
		jQuery(window).blur(function(){
		_llog('Unloading Action');
			clearInterval(interval);
			interval=false;
			jQuery( main ).dequeue();
		}).focus(function(){
		_llog('Reloading Action');
			jQuery( main ).dequeue();
			_function_unqueue();
		});
/* Public */
		// Actions
		function action_play(){
		clearInterval( interval );
		        interval = setInterval(
		                function(){
                        		action_auto();
		                }
		        , options.move_interval);
		        playing = true;
		}
		function action_pause(){
			playing = false;
		        clearInterval( interval );
		}

		function action_auto(){
			_decide_next();
			_move_to();
		}
		function action_next(){
			_function_unqueue();
			_decide_next();
			_move_to();
		}
		function action_prev(){
			_function_unqueue();
			_decide_prev();
			_move_to();
		}
		function action_index( index ){
			_function_unqueue();
			_decide_goto( index );
			_move_to();
		}
/* Base Callback */
		function _callbackStart(indexOld, indexNew){
		        _llog('Starting Action');
			if(typeof options.action_start == 'function'){
				options.action_start.call(this, indexOld, indexNew, item_max);
			}

		}
		function _callbackEnd(indexOld, indexNew){
		        _llog('Ending Action');
			if(typeof options.action_complete == 'function'){
				options.action_complete.call(this, indexOld, indexNew, item_max);
			}
		}
/* Privates */
		$buttons.click(function( event ){
		if( jQuery( this ).attr('id') ){
   			var id = jQuery( this ).attr('id').split('-');
		        var index = ( id[1] != undefined ) ? id[1] : jQuery( this ).index();
		}else{
			var index = jQuery( this ).index();
		}
		        action_index( parseInt( index ) );
		})
		$play.click(function( event ){
			if( !playing ){
				action_play();
			}
		})
		$pause.click(function( event ){
		        action_pause();
		})
		$next.click(function( event ){
		        action_next();
		})
		$prev.click(function( event ){
		        action_prev();
		})
		// Functions
		function _function_unqueue(){
			if( playing ){
				action_play();
			}
		}
		function _function_activate(){
		        // Remove Class from Buttons
			jQuery(options.cvc_button+'.'+options.cvc_active, options.cvc_button_dad).removeClass( options.cvc_active );
		        // Remove Class from image
			$items.removeClass( options.cvc_active );
			// Add class to image
			$object_next.addClass( options.cvc_active );
			// Add class to the button
			$buttons.eq( $object_next.index() ).addClass( options.cvc_active );
		}
		function _enableTouch(){
			if ('ontouchstart' in document.documentElement) {
				$cover.bind("touchstart", function(event){
				var e = event.originalEvent;
					_llog('Start Touching '+e.targetTouches[0].toSource());
				});
				$cover.bind("touchmove", function(event){
				var e = event.originalEvent;
					event.preventDefault();
				        tempX = e.targetTouches[0].pageX - parseInt($cover.width()/2);

				        //if(tempX < 0) tempX=0;
				        //if(tempX > whitespace) tempX=whitespace;

		                        $cover.css({'left' : tempX});

		                        _llog('Moving left:'+tempX);

				});
				$cover.bind("touchend", function(event){
					_llog('Done Touching');
				});
			}else{
				_llog('Touch NOT supported');
			}
		}
		// Decisions
		function _decide_goto( index ){
		_llog('Decide Goto');
			switch( options.move_type ){
				case 'multislide':
				        if( index > ( ms_pages - 1 ) ) index = ( ms_pages - 1 );
				break;
				case 'slide':
				case 'fade':
				        if( index > item_max ) index = item_max;
				break;
			}
		        next = index;

		        _llog('---> Next:'+next);
		}
		function _decide_prev(){
		_llog('Decide Previous');
			switch( options.move_type ){
				case 'multislide':
				        if(current == 0){
				        	next =  ( ms_pages - 1 )
				        }else{
				                next = current - 1;
				        }
				break;
				case 'slide':
				case 'fade':
				        if(current == 0){
				        	next = item_max
				        }else{
				                next = current - 1;
				        }
				break;
			}
		        _llog('---> Next:'+next);
		}
		function _decide_next(){
		_llog('Decide Next');
			switch( options.move_type ){
				case 'multislide':
				        if( current == ( ms_pages - 1 ) ){
				        	next = 0
				        }else{
				                next = current + 1;
				        }
				break;
				case 'slide':
				case 'fade':
				        if(current == item_max){
				        	next = 0
				        }else{
				                next = current + 1;
				        }
				break;
			}
		        _llog('---> Next:'+next);
		}

		// Movements
		function _move_to(){
			switch( options.move_type ){
				case 'multislide':
					$object_now = $items.eq( ms_pageIndex[ current ] );
					$object_next = $items.eq( ms_pageIndex[ next ] );
				break;
				case 'slide':
				case 'fade':
					$object_now = $items.eq( current );
					$object_next = $items.eq( next );
				break;
			}

		        eval( '_movement_'+options.move_type+'();' );
			if(playing && options.move_stopatlast && next == item_max) action_pause();

		        current = next;
		}

		function _movement_fade(){
		_callbackStart($object_now, $object_next);
			_function_activate();
			$object_now.fadeOut( options.move_speed );
			$object_next.fadeIn( options.move_speed );

		_callbackEnd($object_now, $object_next);
		}
		function _movement_slide(){
		_callbackStart($object_now, $object_next);
			_function_activate();
			$cover.animate({
			        	'left' : -imgX[ $object_next.index() ]
				}
				,options.move_speed
				,function(){
					_callbackEnd($object_now, $object_next);
				}
			);
		}
		function _movement_multislide(){
		_callbackStart($object_now, $object_next);
			_function_activate();
			$cover.animate({
			        	'left' : -imgX[ $object_next.index() ]
				}
				,options.move_speed
				,function(){
					_callbackEnd($object_now, $object_next);
				}
			);
		}

		// Debug
		function _llog(text){
			if(!options.debug) return false;
		        switch( true ){
		                case ( jQuery.browser.msie && jQuery.browser.version <= 7.00 ):
		                        alert( '[CvCSlider] '+text );
		                break;
		                default:
					console.info( '[CvCSlider] '+text );
				break;
			}
		}

		// Start
		return this.each(function() {
		_llog('Starting: found '+item_avail+' children');
		//alert( jQuery.browser.msie );
			jQuery( this ).css({'overflow':'hidden'});
			switch( options.move_type ){
			        case 'fade':
					_llog('Movement: Fade');
					jQuery(options.cvc_items, this).each(function(index, element){
						jQuery(element).css({
					                'position'	: 'absolute',
					                'top'           : 0,
					                'left'          : 0
						});
					        if( index > 0 ){
					                jQuery(element).css({
					                        'display'       : 'none'
							});
					        }
					});
			        break;
			        case 'slide':
					_llog('Movement: Slide');
				        if( jQuery(options.cvc_window, this).css('position') != 'absolute' ){
				        	_llog('Absolute already set on '+main+'; I suppose you\'re taking care of its css');
						jQuery(options.cvc_window, this).css({'overflow':'hidden','position':'absolute','top':0,'left':0});
					}
					jQuery(options.cvc_items, this).each(function(index, element){
						var myW = parseInt( jQuery(element).width() );
						imgW[ index ] = myW;
						var myX = ( index > 0 ) ? parseInt( imgX[ (index - 1) ] + imgW[ (index - 1) ] ) : 0;
						imgX[ index ] = myX;
						fluidW += myW;
						jQuery(element).css({
					                'position'	: 'absolute',
					                'top'           : 0 ,
					                'left'          : myX
						});
						_llog('Slide '+index+': Width:'+myW+' Xpos:'+myX);
					});
					$cover.width( fluidW );
					_llog('Film width: '+fluidW);

					if(options.touch) _enableTouch();
			        break;
				case 'multislide':
				        _llog('Movement: Multislide');
				        if( jQuery(options.cvc_window, this).css('position') != undefined ){
				        	_llog('Position already set on '+main+'; I suppose you\'re taking care of its css');
						jQuery(options.cvc_window, this).css({'overflow':'hidden','position':'absolute','top':0,'left':0});
					}
					jQuery(options.cvc_items, this).each(function(index, element){
						var myW = parseInt( jQuery(element).width() + options.ms_margin );
						imgW[ index ] = myW;
						var myX = ( index > 0 ) ? parseInt( imgX[ (index - 1) ] + imgW[ (index - 1) ] ) : 0;
						imgX[ index ] = myX;
						fluidW += myW;
						jQuery(element).css({
					                'position'	: 'absolute',
					                'top'           : 0 ,
					                'left'          : myX
						});
						_llog('MultiSlide '+index+': Width:'+myW+' Xpos:'+myX);
					});
					ms_off = parseInt( item_avail % options.ms_show );
					ms_pages = ( ms_off == 0 ) ? parseInt( item_avail / options.ms_show ) : ( parseInt( item_avail / options.ms_show ) + 1 );
					_llog('Pages: '+ms_pages);
					// First Page
					ms_pageIndex[ 0 ] = 0;
					for( var j=1; j < ( ms_pages - 1 ); j++ ){
						ms_pageIndex[ j ] = j * options.ms_show;
					}
					// Last Page
					if( ms_off > 0 ){
						_llog('There are '+ms_off+' elements in a single page at the end!');
					        if( options.ms_fullpages ){
					        	// Show always full pages
					        	ms_lastindex = ( ( ms_pages - 1 ) * options.ms_show ) - ( options.ms_show - ms_off );
					        }else{
					        	// Show a partial page
                                                	ms_lastindex = ( ( ms_pages - 1 ) * options.ms_show );
					        }
					}else{
                                        	ms_lastindex = ( ( ms_pages - 1 ) * options.ms_show );
					}
					_llog('Last Index: '+ms_lastindex);
					ms_pageIndex[ ( ms_pages - 1 ) ] = ms_lastindex;

					$cover.width( fluidW );
					_llog('Film width: '+$cover.width());

					if(options.touch) _enableTouch();
				break;
			        default:
					alert('Dude you have to tell me what kind of movement you want! '+options.move_type+' doesn\'t exist!');
			        break;
			}

			$object_next = $items.eq( 0 );
			_function_activate();
			if( jQuery(options.cvc_caption, this) ) captions = true;
			if( jQuery(options.cvc_button, this) ) buttons = true;

			if( options.move_interval > 0 && item_max > 0 ){
				_llog('Automatic Play');
			        action_play();
			}
			_llog('init Complete');
			_llog('Film width: '+$cover.width());
		});


	};

})(jQuery);