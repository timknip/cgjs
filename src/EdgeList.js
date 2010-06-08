
function EdgeList() {
	this.head = null;
	this.n = 0;
}

EdgeList.prototype = {
	clear: function() {
		this.head = null;
		this.n = 0;
	},
	
	clone: function() {
		var list = new EdgeList();
		var item = this.head;

		do {
			var n = new Edge();
			n.v1 = item.v1;
			n.v2 = item.v2;
			n.f1 = item.f1;
			n.f2 = item.f2;
			list.push(n);
			item = item.next;
		} while (item != this.head);

		return list;
	},
	
	insertBefore: function(item, before) {
		if (this.head == null) {
			this.head = item;
			this.head.next = this.head;
			this.head.prev = this.head;
			this.n = 1;	
		} else {
			before.prev.next = item;
			item.prev = before.prev;
			item.next = before;
			before.prev = item;
			this.n++;
		}
	},
	
	makeNullEdge: function() {
		var e = new Edge();
		this.push(e);
		return e;
	},
	
	pop: function() {
		if (this.head != null) {
			this.remove(this.head.prev);
		}
	},
			
	push: function(item) {
		if (this.head == null) {
			this.head = item;
			this.head.next = this.head;
			this.head.prev = this.head;
			this.n = 1;
		} else {
			this.insertBefore(item, this.head);
		}
	},
	
	remove: function(item) {
		if (this.head == this.head.next) {
			this.head = null;
		} else if (item == this.head) {
			this.head = this.head.next;
		}
		item.prev.next = item.next;
		item.next.prev = item.prev;
		this.n--;
	},
	
	reverse: function() {
		var listCopy = this.clone();
		var item = listCopy.head;
		
		this.clear();
	
		do {
			var n = new Edge();
			n.v1 = item.v1;
			n.v2 = item.v2;
			n.f1 = item.f1;
			n.f2 = item.f2;
			this.push(n);
			item = item.prev;
		} while (item != listCopy.head);
	},
	
	reverseCompletely: function() {
		var listCopy = this.clone();
		var item = listCopy.head.prev;
		
		this.clear();
	
		do {
			var n = new Edge();
			n.v1 = item.v1;
			n.v2 = item.v2;
			n.f1 = item.f1;
			n.f2 = item.f2;
			this.push(n);
			item = item.prev;
		} while (item != listCopy.head.prev);
	},
	
	toArray: function() {
		var result = [];
		var item = this.head;
		do {
			result.push(item);
			item = item.next;
		} while (item != this.head);
		return result;
	}
}
