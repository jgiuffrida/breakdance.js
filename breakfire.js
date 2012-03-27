(function(win) {
	
	var breakpoints = [],
		lastCall,
		resizeDefer,
		resizeThrottle = 30,
		resizeEvent = function() {
			var now = (new Date().getTime());

			if(lastCall && now - lastCall < resizeThrottle) {
				clearTimeout(resizeDefer);
				resizeDefer = setTimeout(resizeEvent,resizeThrottle);
				return;
			}else{
				lastCall = now;
			}

			fireBreakpoints();
		},
		calculateWidth = function() {
			return win.innerWidth || (function() {
				return document.documentElement.clientWidth || document.body.clientWidth;
			})();
		},
		fireBreakpoints = function() {
			var bpCount = breakpoints.length,
				vp = calculateWidth();

			for(var i=0;i<bpCount;i++) {
				var bp = breakpoints[i];
				if('min' in bp && 'max' in bp && 'enter' in bp && 'exit' in bp) {
					if(vp >= bp.min && vp <= bp.max) {
						if(!bp.active) {
							bp.enter();
							bp.active = true;
						}
					}else{
						if(bp.active) {
							bp.exit();
							bp.active = false;
						}
					}
				}
			}
		};


	win.breakfire = function(config) {
		
		if(config instanceof Array) {
			for(var i=0;i<config.length;i++) {
				win.breakfire(config[i]);
			}
		}else{
			config.active = false;
			breakpoints.push(config);
		}

		window.breakfire.update();
	};

	window.breakfire.update = function() {
		resizeEvent();
	};

	if(win.addEventListener) {
		win.addEventListener('resize',resizeEvent,false);
	}else if(win.attachEvent) {
		win.attachEvent('onresize',resizeEvent);
	}


})(this);
