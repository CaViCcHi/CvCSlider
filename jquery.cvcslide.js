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
jQuery.fn.CvCSlide = function(cvc_options, callback) {
	var cvc_defaults = {
	        len : $(".item-slider", this).length - 1,
	        now : 0,
		dad : this
	};
	$(".item-slider", this).each(function(index, element){
		$(element).css({
                        'position'	: 'absolute',
                        'top'           : 0,
                        'left'          : 0
		});
	        if( index > 0 ){
	                $(element).css({
	                        'display'       : 'none'
			});
	        }
	});
	// Options
	if(!eval(cvc_options)) cvc_options = {};
	if(cvc_options.interval == undefined) cvc_options.interval = 3000;
	if(cvc_options.type == undefined) cvc_options.type = 'fade';
	if(cvc_options.speed == undefined) cvc_options.speed = 'slow';

	$(this).css({'overflow':'hidden'});

	if(cvc_defaults.len>0){
		setInterval(function(){
		        if(cvc_defaults.now == cvc_defaults.len){
		        	var next = 0
		        }else{
		                var next = cvc_defaults.now + 1;
		        }
			var objNow = $(".item-slider:eq("+cvc_defaults.now+")", cvc_defaults.dad);
			var objNext = $(".item-slider:eq("+next+")", cvc_defaults.dad);

		        switch(cvc_options.type){
		                case 'fade':
					objNow.fadeOut( cvc_options.speed );
					objNext.fadeIn( cvc_options.speed );
			        break;
		                case 'slide':
                                objNext.css({ 'left' : objNow.width(), 'display' : 'block' })
					objNow.animate({'left' : -objNow.width() }, cvc_options.speed, function(){ $(this).hide() });
					objNext.animate({'left' : 0 }, cvc_options.speed);
			        break;
			}
			cvc_defaults.now = next;
		},cvc_options.interval);
	}
};