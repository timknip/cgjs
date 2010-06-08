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

Polygon.prototype = new VertexList();
Polygon.prototype.constructor = Polygon;
function Polygon() {
	
}

Polygon.prototype.area2 = function() {
	var vertices = this.toArray();
	var a, b, i, j;
	var ar = 0;
	for (i = 0; i < vertices.length; i++) {
		j = (i+1) % vertices.length;
		a = vertices[i];
		b = vertices[j];
		ar += a.v.x * b.v.y;
		ar -= b.v.x * a.v.y;
	}
	return (ar / 2);
}

Polygon.prototype.centroid = function() {
	var vertices = this.toArray();
	var a, b, i, j;
	var ar = this.area2();
	var cx = 0;
	var cy = 0;
	var factor = 0;
	for (i = 0; i < vertices.length; i++) {
		j = (i+1) % vertices.length;
		a = vertices[i];
		b = vertices[j];
		factor = (a.v.x*b.v.y - b.v.x*a.v.y);
		cx += (a.v.x + b.v.x)*factor;
		cy += (a.v.y + b.v.y)*factor;
	}
	ar *= 6.0;
	factor = 1/ar;
	cx *= factor;
	cy *= factor;
	return new Pointi(cx, cy, 0);
}

Polygon.prototype.isCcw = function() {
	return (this.area2() > 0);
}

Polygon.prototype.isConvex = function() {
	var v = this.head;
	var flag = true;

	do {
		if (!v.v.leftOn( v.v, v.next.v, v.next.next.v)) {
			flag = false;
			break;
		}
		v = v.next;
	} while (v != this.head);
	
	return flag;
}

Polygon.prototype.pointInPolygon = function(point) {
	var vertices = this.toArray();
	var x = point.x;
	var y = point.y;
	var a, b, i, j;
	var xpi, ypi, xpj, ypj;
	var c = false;
	for (i = 0; i < vertices.length; i++) {
		j = (i+1) % vertices.length;
		a = vertices[i];
		b = vertices[j];
		xpi = a.v.x;
		ypi = a.v.y;
		xpj = b.v.x;
		ypj = b.v.y;
		if ((((ypi<=y) && (y<ypj)) || ((ypj<=y) && (y<ypi))) && 
		    (x < (xpj-xpi)*(y-ypi)/(ypj-ypi)+xpi)) {
			c = !c;    
		}
	}
	return c;
}




