/*Copyright (c) 2012 Joseph Giuffrida(jm(dot)giuffrida(at)gmail(dot)com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/


(function(win) {
	// Use a sweet closure to keep our variables safe
	var breakpoints = [], //An array of all the breakpoints passed in 
		lastCall, // A resize event throttler
		resizeDefer,
		toCall = [],
		resizeThrottle = 30,
		resizeEvent = function() {
			var now = (new Date().getTime());
			//have we called it before? was it more than 30ms ago?
			if(lastCall && now - lastCall < resizeThrottle) {
				// defer defer!
				clearTimeout(resizeDefer);
				resizeDefer = setTimeout(resizeEvent,resizeThrottle);
				return;
			}else{
				lastCall = now;
			}

			fireBreakpoints();
		},
		calculateWidth = function() { // Function to get the true width of the browser including the scrollbar
			return win.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		},
		fireBreakpoints = function() {
			var bpCount = breakpoints.length, // Cache the length of the set breakpoints
				vp = calculateWidth(),
				enters = [], exits = [];
			for(var i=0;i<bpCount;i++) {
				var bp = breakpoints[i];
				if('min' in bp && 'max' in bp && 'enter' in bp && 'exit' in bp) {
					if(vp >= bp.min && vp <= bp.max) {
						if(!bp.active) { // If it isn't already active - call - only want to "enter" once
							enters.push(bp.enter); // put the enter functions to call into an array
							bp.active = true;
						}
					}else{
						if(bp.active) {
							exits.push(bp.exit); // put the exit functions into an array as well
							bp.active = false;
						}
					}
				}
			}

			// finally call finalize passing all the exits and enters
			toCall = exits.concat(enters);
			enters = [];
			exits = [];
			if(toCall.length){
				finalize(toCall,0);
			}
		},
		finalize = function(toCall,idx) {
			toCall[idx]();
			if(idx+1 < toCall.length) {
				finalize(toCall,idx+1);
			}else{
				toCall = [];
			}
		};


	win.breakdance = function(config,update) {
		var update = update || true;
		if(config instanceof Array) { // If we have an array we'll apply all of the breakpoints
			for(var i=0;i<config.length;i++) {
				win.breakdance(config[i],false);
			}
			window.breakdance.update();
		}else{
			config.active = false;
			breakpoints.push(config);
			if(update) {
				window.breakdance.update();
			}
		}

	};


	//expose an update method to fire the states again
	window.breakdance.update = function() {
		resizeEvent();
	};

	// Attach our resize events
	if(win.addEventListener) {
		win.addEventListener('resize',resizeEvent,false);
	}else if(win.attachEvent) {
		win.attachEvent('onresize',resizeEvent);
	}


})(this);
