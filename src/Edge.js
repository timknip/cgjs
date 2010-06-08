
function Edge() {
	this.next = null;
	this.prev = null;
	// endpoints
	this.endpts = new Array(2);
	// adjacent faces
	this.adjface = new Array(2);
	// pointer to incident cone face
	this.newface = null;
	// iff edge should be deleted
	this.remove = false;
}

