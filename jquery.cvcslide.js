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

				active          : true,
				
				debug           : false
			},

			// Now overwrite the default options with the ones passed in
			options = jQuery.extend(defaults, options),
			$items = jQuery(options.cvc_items, main),
			$buttons = jQuery(options.cvc_button, options.cvc_button_dad),
			$cover = jQuery(options.cvc_window, main),

			$play = jQuery(options.cvc_play),
			$pause = jQuery(options.cvc_pause),

			$prev = jQuery(options.cvc_prev),
			$next = jQuery(options.cvc_next),

			item_max = $items.size() - 1;
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
			// Add class to image
			$object_next.addClass( options.cvc_active );
			// Add class to the button
			$buttons.eq( $object_next.index() ).addClass( options.cvc_active );
		}
		// Decisions
		function _decide_goto( index ){
		_llog('Decide Goto');
		        if( index > item_max ) index = item_max;

		        next = index;
		        
		        _llog('---> Next:'+next);
		}
		function _decide_prev(){
		_llog('Decide Previous');
		        if(current == 0){
		        	next = item_max
		        }else{
		                next = current - 1;
		        }
		        _llog('---> Next:'+next);
		}
		function _decide_next(){
		_llog('Decide Next');
		        if(current == item_max){
		        	next = 0
		        }else{
		                next = current + 1;
		        }
		        _llog('---> Next:'+next);
		}

		// Movements
		function _move_to(){

			$object_now = $items.eq( current );
			$object_next = $items.eq( next );

		        eval( '_movement_'+options.move_type+'();' );

		        current = next;
		}

		function _movement_fade(){
			_function_activate();
			$object_now.fadeOut( options.move_speed );
			$object_next.fadeIn( options.move_speed );
		}
		function _movement_slide(){
			_function_activate();
			$cover.animate({
			        	'left' : -imgX[ $object_next.index() ]
				}
				,options.move_speed
			);
		}
		
		// Debug
		function _llog(text){
			if(options.debug) console.info( '[CvCSlider] '+text );
		}

		// Start
		return this.each(function() {
		_llog('Starting on '+main+' found '+item_max+' children');
			jQuery( this ).css({'overflow':'hidden'});
			if( options.move_type == 'fade' ){
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
			}else{
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
		});


	};

})(jQuery);