var fs = require('fs');



var Persist = function(path){
	this.path = path ||  'persist.json';
	this.load();
	this.__defineGetter__('length', function(){
		var c = 0;
		for(var i in this.map){
			c++;
		}
		return c;
	});
}


Persist.prototype = {

	constructor: Persist,

	load: function(){
		var content;
		try{
			content = fs.readFileSync(this.path, 'utf-8');
			this.map = JSON.parse(content);
		}catch(err){
			this.map = {};
		}
	},

	save: function(){
		var content = JSON.stringify(this.map, null, 4);
		fs.writeFileSync(this.path, content, 'utf-8');
	},

	getItem: function(key){
		this.load();
		return this.map[key];
	},

	setItem: function(key, value){
		this.load();
		this.map[key] = value;
		this.save();
	},

	removeItem: function(key, value){
		this.load();
		delete this.map[key];
		this.save();
	},

	clear: function(){
		this.map = {};
		this.save();
	},


	each : function(callback){
		for(var i in this.map){
			callback(i, this.map[i]);
		}
	}
};

exports.Persist = Persist;
exports.persist = new Persist();