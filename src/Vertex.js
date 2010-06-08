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

