
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




