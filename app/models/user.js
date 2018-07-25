const db = require(global.include.db);
const timestamp = require(global.include.helper.timestamp);
const async = require('asyncawait/async');
const await = require('asyncawait/await');

var user = function(sql_result){
	//user class definition
	this.id = sql_result.id;
	this.first_name = sql_result.first_name;
	this.last_name = sql_result.last_name;
	this.created_at = timestamp.timestamp_to_date(sql_result.created_date);

	return this;
}

var get_by_id = function(id){
	return new Promise(function(resolve, reject){
		values = [id];
		db.get().query("SELECT * FROM users WHERE id=?", values, function(err,result){
			if(err) reject(err);
			if(result.length == 0) reject('No match');
			resolve(user(result[0]));
		});
	});
}

var create = function(first_name, last_name){
	return new Promise(function(resolve, reject){
		values = [first_name, last_name];
		db.get().query('INSERT INTO users (first_name, last_name) VALUES (?,?)', values, function(err, result){
			if(err) reject(err);
			resolve(get_by_id(result.insertId));
		});
	});
}

module.exports = {
	get_by_id: get_by_id,
	create: create
};
