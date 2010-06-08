
function Pointi(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Pointi.prototype = {
	area2: function(a, b, c) {
		return ((c.x - b.x)*(a.y - b.y)) - ((a.x - b.x)*(c.y - b.y));
	},
	
	areaSign: function(a, b, c) {
		var area = this.area2(a, b, c);
		if (area > 0.5) {
			return 1;
		} else if (area < -0.5) {
			return -1;
		} else {
			return 0;
		}
	},

	between: function(a, b, c) {
		if (!this.collinear(a, b, c)) {
	      	return  false;
	    }
	    // If ab not vertical, check betweenness on x; else on y.
	    if (a.x != b.x) {
	      	return ((a.x <= c.x) && (c.x <= b.x)) || ((a.x >= c.x) && (c.x >= b.x));
	    } else {
	      	return ((a.y <= c.y) && (c.y <= b.y)) || ((a.y >= c.y) && (c.y >= b.y));
	    }
	},
	
	collinear: function(a, b, c) {
		return (this.areaSign(a, b, c) == 0);
	},
	
	intersect: function(a, b, c, d) {
		if (this.intersectProp(a, b, c, d)) {
			return true;
		} else if (this.between(a, b, c) || this.between(a, b, d) || 
				   this.between(c, d, a) || this.between(c, d, b)) {
			return true;
		} else {
			return false;
		}
	},
	
	intersectProp: function(a, b, c, d) {
		// Eliminate improper cases.
		if (this.collinear(a,b,c) || this.collinear(a,b,d) ||
			this.collinear(c,d,a) || this.collinear(c,d,b)) {
			return false;
		}
		return (this.xor(left(a,b,c), this.left(a,b,d)) && 
		    	this.xor(left(c,d,a), this.left(c,d,b)));
	},
	
	left: function(a, b, c) {
		return (this.areaSign(a, b, c) > 0);
	},
	
	leftOn: function(a, b, c) {
		return (this.areaSign(a, b, c) >= 0);
	},
		
	toString: function() {
		return "[" + this.x + ", " + this.y + ", " + this.z + "]";
	},
	
	xor: function(a, b) {
		var ia = a ? 0 : 1;
		var ib = b ? 0 : 1;
		return ((ia ^ ib) != 0 ? true : false);
	}
}
