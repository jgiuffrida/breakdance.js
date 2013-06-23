# breakdance.js 
### Make that browser dance...

 - Copyright 2012: Joe Giuffrida, http://www.josephgiuffrida.com
 - Named by Jason Rhodes: https://github.com/jasonrhodes
 - Dual licensed under the MIT or GPL Version 2 licenses. 

The goal of this script is provide a way to execute different pieces of javascript at resolution breakpoints, effectively turning the browser into a resolution based state machine. Each breakpoint specified has an user defined enter and exit function which will run once when the min/max width range is met.

Features
======

1. Library Independent
2. Crossbrowser support - Actual version statistics coming soon, IE6+ Support is confirmed.
3. Run different javascript at various resolutions

Usage
======
1. Include breakdance.js on page
2. Create move or moves - breakdance excepts either option.
<pre>
    var moves = [
    	{
    		min:0,
    		max:479,
    		enter: function() {
    			console.log('Enter 0-479');
    		},
    		exit: function() {
    			console.log('Exit 0-479');
    		}
    	},
    	{
    		min:480,
    		max:9999,
    		enter: function() {
    			console.log('Enter 480 and beyond');
    		},
    		exit: function() {
    			console.log('Exit 480 and beyond');
    		}
    	},
    ];
</pre>
3. Pass moves to breakdance
<pre>
    breakdance(moves);
</pre>
4. $$$$


Coming Soon
======
1. Min/Max only support
2. More Crossbrowser testing/support/statistics
3. Performance Improvements
4. More Awesome
