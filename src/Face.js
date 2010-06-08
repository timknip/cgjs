/**
 * C code written by Joseph O'Rourke.
 * Java code written by Irena Pashchenko, Octavia Petrovici, Lilla Zollei,
 * and Joseph O'Rourke.
 * Last modified: June 1998
 * Questions to orourke@cs.smith.edu.
 * --------------------------------------------------------------------
 * This code is Copyright 1998 by Joseph O'Rourke.  It may be freely
 * redistributed in its entirety provided that this copyright notice is
 * not removed.
 * 
 * JS port by:
 *
 * @author Tim Knip (tim at floorplanner.com)
 *
 * June 2010
 */

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

