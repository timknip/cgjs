
function ConvexHull2D(list) {
	this.list = list;
	this.top = null;
	this.ndelete = 0;
}

ConvexHull2D.prototype = {
	clearHull: function() {
		this.top = new VertexList();
	},
	
	/**
	 * Compare: returns -1,0,+1 if p1 < p2, =, or > respectively;
	 * here "<" means smaller angle.  Follows the conventions of qsort.
	 */
	compare: function(tpi, tpj) {
		var pi = tpi;
		var pj = tpj;
		var myhead = this.list.head;
		var a = myhead.v.areaSign(myhead.v, pi.v, pj.v);
		
		if (a > 0) {
			return -1;
		} else if (a < 0) {
			return 1;
		} else {
			// Collinear with list.head
			var x =  Math.abs(pi.v.x - this.list.head.v.x) - Math.abs(pj.v.x - this.list.head.v.x);
			var y =  Math.abs(pi.v.y - this.list.head.v.y) - Math.abs(pj.v.y - this.list.head.v.y);
			this.ndelete++;
			if ((x < 0) || (y < 0)) {
				pi.mark = true;
				return -1;
			} else if ((x > 0) || (y > 0)) {
				pj.mark = true;
				return 1;
			} else { // points are coincident 
				if (pi.vnum > pj.vnum) {
					pj.mark = true;
				} else { 
					pi.mark = true;
				}
				return 0;
			}
		}
	},
	
	/**
	 * FindLowest finds the rightmost lowest point and swaps with 0-th.
	 * The lowest point has the min y-coord, and amongst those, the
	 * max x-coord: so it is rightmost among the lowest.
	 */
	findLowest: function() { 
		var v1 = this.list.head.next;
		var i;
		
		for (i = 1; i < this.list.n; i++) {
			if ((this.list.head.v.y <  v1.v.y) || 
				((v1.v.y == this.list.head.v.y) && (v1.v.x > this.list.head.v.x))) {
				this.swap(this.list.head, v1); 
			}
			v1 = v1.next;
		}
	},
	
 	/**
	 * Performs the Graham scan on an array of angularly sorted points P.
	 */
	graham: function() {
		// Initialize stack
		var top = new VertexList();
		var v1 = new Vertex(this.list.head.v.x, this.list.head.v.y, 0);
		var v2 = new Vertex(this.list.head.next.v.x, this.list.head.next.v.y, 0);
		
		v1.vnum = this.list.head.vnum;
		v1.mark = this.list.head.mark;
		v2.vnum = this.list.head.next.vnum;
		v2.mark = this.list.head.next.mark;
		
		top.push(v1);
		top.push(v2);
		
		// Bottom two elements will never be removed
		var i = 2;
		
		while (i < this.list.n) {
			var p = this.list.getElement(i);
			var v3 = new Vertex(p.v.x, p.v.y, 0);
			v3.mark = p.mark;
			v3.vnum = p.vnum;
			if (v1.v.left(top.head.prev.v , top.head.prev.prev.v, v3.v)) {
				top.push(v3);
				i++;
			} else {
				if (top.n > 2) {
					top.pop();
				}
			}
		}
		
		return top;
	},
	
	qsort: function(a) {
		this.sort(a, 1, a.n-1);
	},
	
	runHull: function() {
		var v = this.list.head;
		var i;
		for (i = 0; i < this.list.n; i++) {
			v.vnum = i;
			v = v.next;
		}
		this.findLowest();
		this.qsort(this.list);
		if (this.ndelete > 0) {
			this.squash();
		}
		this.top = this.graham();
		return this.top;
	},
	
	sort: function(a, lo0, hi0) {
		if (lo0 >= hi0) {
			return;
		}
		var mid = a.getElement(hi0);
		var lo = lo0;
		var hi = hi0-1;
		while (lo <= hi) {
			while (lo<=hi && ((this.compare(a.getElement(lo), mid) == 1) || 
				  (this.compare(a.getElement(lo), mid) == 0))) {
				lo++;
			}
			while (lo<=hi && ((this.compare(a.getElement(hi), mid) == -1) ||
				   (this.compare(a.getElement(hi), mid)==0))) {
				hi--;
			}
			if (lo < hi) {
				this.swap(a.getElement(lo), a.getElement(hi));
			}
		}
		this.swap(a.getElement(lo),a.getElement(hi0));
		this.sort(a, lo0, lo-1);
		this.sort(a, lo+1, hi0);
	},
	
	squash: function() {
		var v = this.list.head;
		var i;
		for (i = 0; i < this.list.n; i++) {
			if (v.mark) {
				this.list.remove(v);
			}
			v = v.next;
		}
	},
	
	swap: function(first, second) {
		var temp = new Vertex(first.v.x, first.v.y, 0);
		temp.vnum = first.vnum;
		temp.mark = first.mark;
		this.list.resetVertex(first, second.v.x, second.v.y, second.vnum, second.mark);
		this.list.resetVertex(second, temp.v.x, temp.v.y, temp.vnum, temp.mark);
	}
}
