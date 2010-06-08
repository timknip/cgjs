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

