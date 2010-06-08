
function Vertex(x, y, z) {
	this.v = new Pointi(x, y, z);
	this.next = null;
	this.prev = null;
	this.vnum = 0;
	this.duplicate = null;
	this.onhull = false;
	this.mark = false;
	this.ear = false;
}

Vertex.prototype = {
	
	toString: function() {
		return this.v.toString();
	}
}

