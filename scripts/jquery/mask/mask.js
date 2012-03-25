(function($) {
	
	$.fn.mask = function(message) {
		
		return this.each(function() {
			
			var pos = $(this).position();
			
			if($(this).is('body'))
				var width = $(document).outerWidth(), height = $(document).outerHeight();
			else 
				var width = $(this).outerWidth(), height = $(this).outerHeight();
			
			$(this).data('mask.overlay', $("<div />").addClass('ci-mask-overlay').css({
				position: 'absolute',
				left: pos.left,
				top: pos.top,
				width: width,
				height: height,
				fontSize: "1.4em"
			}).appendTo('body'));
			
			var mask = $("<div />").appendTo($(this).data('mask.overlay')).addClass('ci-mask').html(message).each(function() {
				$(this).css({
					marginTop: $(this).parent().height() / 2 - $(this).height() / 2
				});	
			});
		});
	}
	
	
	$.fn.unmask = function() {
		$(this).data('mask.overlay').remove();
	}
	
	
}) (jQuery);
