var app = function() {
	var pub = {};
	
	pub.init = function() {
		$('#content').append('<iframe id="shuffle" width="600" height="600" src="http://z0r.de/L/z0r-de_3714.swf" title="Go! Go! Go! Go! Go!" frameborder="0" class="k-content-frame"></iframe>');
	}
	
	pub.video = function() {
		$("#shuffle").remove();
		navigator.webkitGetUserMedia("video",
		   	function(stream) {
				var video = $(".video");
				$(video).show();	
		       	video.attr('src', window.webkitURL.createObjectURL(stream));
		   },
	       function(err) {
	           console.log("Your thing is not a thing.");
	       }
	   );
	}
	
	pub.go = function() {
		var video = $(".video");
		$(video).animate({ 
			width: 0, 
			height: 0 
		}, 5000, "swing").delay(2000).animate({
			width: 600,
			height: 600,
		}, 5000, "swing");
	}
	
	pub.shrink = function() {
		shrink($(".video"));
	}
	
	grow = function(el) {
		$(el).animate({ width: 600, height: 600 }, 5000, "linear");
	}

	shrink = function(el) {	
		$(el).animate({ width: 0, height: 0 }, 5000, "swing", function(){
			grow(el);
		});
	}
	
	return pub;
}();