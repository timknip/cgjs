
function Face() {
	this.next = null;
	this.prev = null;
	// edges which compose the face
	this.edge = new Array(3);
	// vertices which bound the face
	this.vertex = new Array(3);
	// T iff face visible from new point
	this.visible = false;
	// T iff on the lower hull
	this.lower = false;
	
	for (var i = 0; i < 3; i++) {
		this.edge[i] = null;
		this.vertex[i] = null;
	}
}

