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

function ConvexHull3D() {
	this.vlist = new VertexList();
	this.elist = new EdgeList();
	this.flist = new FaceList();
}

ConvexHull3D.prototype = {
	
	/**
	 *  AddOne is passed a vertex.  It first determines all faces visible from
	 *  that point.  If none are visible then the point is marked as not 
	 *  onhull.  Next is a loop over edges.  If both faces adjacent to an edge
	 *  are visible, then the edge is marked for deletion.  If just one of the
	 *  adjacent faces is visible then a new face is constructed.
	 */
	addOne: function(p) {
		var f, e, vol;
		var vis = false;
		
		// Mark faces visible form p
		f = this.flist.head;
		do {
  			vol = this.volumeSign(f, p);
  			if (vol < 0) {
				f.visible = true;  
				vis = true;                      
  			}
  			f = f.next;
		} while (f != this.flist.head);
		
		// If no faces are visible from p, then p is inside the hull.
		if (!vis) {
  			p.onhull = false;  
  			return false; 
		}
		
		// Mark edges in interior of visible region for deletion.
   		// Erect a newface based on each border edge.
		e = this.elist.head;
	    do {
	     	var temp = e.next;
	      	if (e.adjface[0].visible && e.adjface[1].visible) {
				// e interior: mark for deletion.
				e.remove = true;
	      	} else if (e.adjface[0].visible || e.adjface[1].visible)  {
				// e border: make a new face.
				e.newface = this.makeConeFace(e, p);
	      	}
	      	e = temp;
	    } while (e != this.elist.head);
	    return true;
	},
	
	/** 
	 * CleanUp goes through each data structure list and clears all
     * flags and NULLs out some pointers.  The order of processing
     * (edges, faces, vertices) is important.
	 */
	clean: function() {
		this.cleanEdges();
		this.cleanFaces();
		this.cleanVertices();
	},
	
  	/**
	 * cleanEdges runs through the edge list and cleans up the structure.
	 * If there is a newface then it will put that face in place of the 
	 * visible face and NULL out newface. It also deletes so marked edges.
	 */
	cleanEdges :function() {
   		var e;	// Primary index into edge list.
		var t;	// Temporary edge pointer.

		// Integrate the newface's into the data structure.
		// Check every edge.
		e = this.elist.head;
		do {
		  	if (e.newface != null) { 
				if (e.adjface[0].visible)
		    		e.adjface[0] = e.newface; 
				else 
					e.adjface[1] = e.newface;
				e.newface = null;
		  	}
		  	e = e.next;
		} while (e != this.elist.head);

		// Delete any edges marked for deletion.
		while (this.elist.head != null && this.elist.head.remove) { 
	     	e = this.elist.head;
	      	this.elist.remove(e);
	    }
   		e = this.elist.head.next;
	    do {
	    	if (e.remove) {
				t = e;
				e = e.next;
				this.elist.remove(t);
	      	} else {
	      		e = e.next;
	      	}
   		} while (e != this.elist.head);
 	},

	/**
	 * cleanFaces runs through the face list and deletes any face marked visible.
	 */
	cleanFaces: function() {
		var f; // Primary pointer into face list.
		var t; // Temporary pointer, for deleting.
		while (this.flist.head != null && this.flist.head.visible) { 
	    	f = this.flist.head;
	    	this.flist.remove(f);
	    }
	    f = this.flist.head.next;
		do {
			if (f.visible) {
				t = f;
				f = f.next;
				this.flist.remove(t);
  			} else {
  				f = f.next;
  			}
		 } while (f != this.flist.head);
	},
	
	/**
	 * cleanVertices runs through the vertex list and deletes the 
	 * vertices that are marked as processed but are not incident to any
	 * undeleted edges. 
	 */
	cleanVertices: function() {
		var e, v, t;
		
		// Mark all vertices incident to some undeleted edge as on the hull.
		e = this.elist.head;
		do {
			e.endpts[0].onhull = e.endpts[1].onhull = true;
			e = e.next;
		} while (e != this.elist.head);
		
		// Delete all vertices that have been processed but
	    // are not on the hull.
	    while (this.vlist.head != null && this.vlist.head.mark && !this.vlist.head.onhull) { 
			v = this.vlist.head;
			this.vlist.remove(v);
	    }
	
		v = this.vlist.head.next;
	    do {
	    	if (v.mark && !v.onhull) {    
				t = v; 
				v = v.next;
				this.vlist.remove(t);
	      	} else {
	      		v = v.next;
	      	}
		} while (v != this.vlist.head);

	    // Reset flags.
	    v = this.vlist.head;
	    do {
	      v.duplicate = null; 
	      v.onhull = false; 
	      v = v.next;
	    } while (v != this.vlist.head);
	},
	
	/**
	 * Collinear checks to see if the three points given are collinear,
     * by checking to see if each element of the cross product is zero.
 	 */
	collinear: function(a, b, c) {
		return (( c.v.z - a.v.z ) * ( b.v.y - a.v.y ) -
		      ( b.v.z - a.v.z ) * ( c.v.y - a.v.y ) == 0
		      && ( b.v.z - a.v.z ) * ( c.v.x - a.v.x ) -
		      ( b.v.x - a.v.x ) * ( c.v.z - a.v.z ) == 0
		      && ( b.v.x - a.v.x ) * ( c.v.y - a.v.y ) -
		      ( b.v.y - a.v.y ) * ( c.v.x - a.v.x ) == 0);	
	},
	
	/**
	 * ConstructHull adds the vertices to the hull one at a time.  The hull
     * vertices are those in the list marked as onhull.
	 */
	constructHull: function() {
		var v = this.vlist.head;
		var vnext;
		do {
			vnext = v.next;
			if (!v.mark) {
				v.mark = true;
				this.addOne(v);
				this.clean();
			}
			v = vnext;
		} while (v != this.vlist.head);
	},
	
	/**
	 * DoubleTriangle builds the initial double triangle.  It first finds 3 
	 * noncollinear points and makes two faces out of them, in opposite order.
	 * It then finds a fourth point that is not coplanar with that face.  The 
	 * vertices are stored in the face structure in counterclockwise order so
	 * that the volume between the face and the point is negative. Lastly, the
	 * 3 newfaces to the fourth point are constructed and the data structure
	 * are cleaned up. 
	 */
	doubleTriangle: function() {
		var v0, v1, v2, v3;
		// Find 3 non-Collinear points.
		v0 = this.vlist.head;
		while (this.collinear(v0, v0.next, v0.next.next)) {
	  		if ((v0 = v0.next) == this.vlist.head) {
				alert("DoubleTriangle:  All points are Collinear!");
				return false;
	  		}
		}
		v1 = v0.next;
		v2 = v1.next;
		// Mark the vertices as processed.
		v0.mark = true;
		v1.mark = true;
		v2.mark = true;
	
		// Create the two "twin" faces.
		var f0 = this.makeFace(v0, v1, v2, f1);
		var f1 = this.makeFace(v2, v1, v0, f0);
	
		// Link adjacent face fields.
		f0.edge[0].adjface[1] = f1;
		f0.edge[1].adjface[1] = f1;
		f0.edge[2].adjface[1] = f1;
		f1.edge[0].adjface[1] = f0;
		f1.edge[1].adjface[1] = f0;
		f1.edge[2].adjface[1] = f0;
		
		// Find a fourth, non-coplanar point to form tetrahedron.
		v3 = v2.next;
		var vol = this.volumeSign(f0, v3);
		while (vol == 0) {
	  		if ((v3 = v3.next) == v0) { 
				alert("DoubleTriangle:  All points are coplanar!");
				return false;
	      	}
	      	vol = this.volumeSign(f0, v3);
	    }
		// Insure that v3 will be the first added.
		this.vlist.head = v3;
	    return true;
	},
	
	/**
	 * MakeCcw puts the vertices in the face structure in counterclock wise 
     * order.  We want to store the vertices in the same 
     * order as in the visible face.  The third vertex is always p.
     */
	makeCCW: function(f, e, p) {
		var fv; // The visible face adjacent to e
		var i;	// Index of e.endpoint[0] in fv.
		var s; 	// Temporary edge, for swapping
		
		if (e.adjface[0].visible) {
			fv = e.adjface[0];
		} else {
			fv = e.adjface[1];
		}
		
		// Set vertex[0] & [1] of f to have the same orientation
   		// as do the corresponding vertices of fv.
		for (i = 0; fv.vertex[i] != e.endpts[0]; ++i);
		
		// Orient f the same as fv.
	    if (fv.vertex[ (i+1) % 3 ] !== e.endpts[1]) {
	      	f.vertex[0] = e.endpts[1];  
	      	f.vertex[1] = e.endpts[0];    
	    } else {                               
	      	f.vertex[0] = e.endpts[0];   
	      	f.vertex[1] = e.endpts[1];     
	      	
	      	s = f.edge[1];
			f.edge[1] = f.edge[2];
			f.edge[2] = s; 
	    }
		// This swap is tricky. e is edge[0]. edge[1] is based on endpt[0],
   		// edge[2] on endpt[1].  So if e is oriented "forwards," we
   		// need to move edge[1] to follow [0], because it precedes. */
		f.vertex[2] = p;
	},
	
	/**
	 * MakeFace creates a new face structure from three vertices (in ccw
     * order).  It returns a pointer to the face.
     */
	makeFace: function(v0, v1, v2, fold) {
		var f, e0, e1, e2;
		// Create edges of the initial triangle.
		if (fold == null) {
			e0 = this.elist.makeNullEdge();
			e1 = this.elist.makeNullEdge();
			e2 = this.elist.makeNullEdge();
		} else {
			// Copy from fold, in reverse order.
			e0 = fold.edge[2];
			e1 = fold.edge[1];
			e2 = fold.edge[0];
		}
		e0.endpts[0] = v0;              
		e0.endpts[1] = v1;
      	e1.endpts[0] = v1;              
		e1.endpts[1] = v2;
      	e2.endpts[0] = v2;              
		e2.endpts[1] = v0;
		// Create face for triangle.
      	f = this.flist.makeNullFace();
      	f.edge[0] = e0;  
		f.edge[1] = e1; 
		f.edge[2] = e2;
      	f.vertex[0] = v0;  
		f.vertex[1] = v1; 
		f.vertex[2] = v2;
		// Link edges to face.
      	e0.adjface[0] = e1.adjface[0] = e2.adjface[0] = f;
  		return f;
	},
	
	/** 
	 * MakeConeFace makes a new face and two new edges between the 
     * edge and the point that are passed to it. It returns a pointer to
     * the new face.
     */
	makeConeFace: function(e, p) {
		var new_edge = new Array(2);
		var new_face;
		var i, j;
		
		for (i = 0; i < 2; i++) {
			// If the edge exists, copy it into new_edge.
			new_edge[i] = e.endpts[i].duplicate;
			if (new_edge[i] == null) {
				new_edge[i] = this.elist.makeNullEdge();
				new_edge[i].endpts[0] = e.endpts[i];
				new_edge[i].endpts[1] = p;
				e.endpts[i].duplicate = new_edge[i];
			}
		}
		
		// Make the new face
		new_face = this.flist.makeNullFace();
		new_face.edge[0] = e;
		new_face.edge[1] = new_edge[0];
		new_face.edge[2] = new_edge[1];
		this.makeCCW(new_face, e, p);
		
		// Set the adjacent face pointers.
		for (i = 0; i < 2; ++i) {
			for (j = 0; j < 2; ++j) {
				// Only one NULL link should be set to new_face.
				if (new_edge[i].adjface[j] == null) {
  					new_edge[i].adjface[j] = new_face;
 					break;
				}
			}
		}
		return new_face;
	},
	
	/**
	 * VolumeSign returns the sign of the volume of the tetrahedron determined 
	 * by f and p.  VolumeSign is +1 iff p is on the negative side of f, 
	 * where the positive side is determined by the rh-rule.  So the volume 
	 * is positive if the ccw normal to f points outside the tetrahedron. 
	 * The final fewer-multiplications form is due to Robert Fraczkiewicz.
	 */
	volumeSign: function(f, p) {
		var ax = f.vertex[0].v.x;
	    var ay = f.vertex[0].v.y;
	    var az = f.vertex[0].v.z;
	    var bx = f.vertex[1].v.x;
	    var by = f.vertex[1].v.y;
	    var bz = f.vertex[1].v.z;
	    var cx = f.vertex[2].v.x;
	    var cy = f.vertex[2].v.y;
	    var cz = f.vertex[2].v.z;
	    var dx = p.v.x;
	    var dy = p.v.y;
	    var dz = p.v.z;
	    var bxdx = bx-dx;
	    var bydy = by-dy;
	    var bzdz = bz-dz;
	    var cxdx = cx-dx;
	    var cydy = cy-dy;
	    var czdz = cz-dz;
	    var vol = (az-dz) * (bxdx*cydy - bydy*cxdx)
	      		+ (ay-dy) * (bzdz*cxdx - bxdx*czdz)
	      		+ (ax-dx) * (bydy*czdz - bzdz*cydy);
		if (vol > 0.5) {
			return 1;
		} else if (vol < -0.5) {
			return -1;
		} else {
			return 0;
		}
	}
}
