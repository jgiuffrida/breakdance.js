/*Copyright (c) 2012 Joseph Giuffrida(jm(dot)giuffrida(at)gmail(dot)com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
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
