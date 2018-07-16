const db = require(global.include.db);
const timestamp = require(global.include.helper.timestamp);

var user = function(sql_result){
	//user class definition
	this.id = sql_result.id;
	this.first_name = sql_result.first_name;
	this.last_name = sql_result.last_name;
	this.created_at = timestamp.timestamp_to_date(sql_result.created_date);
	this.auth_token = null;

	this.get_auth_token = function(resp){
		return this.auth_token;
	}

	return this;
}

exports.get_user_by_id = function(id, resp){
	values = [id];
	db.get().query("SELECT * FROM users WHERE id=?", values, function(err,result){
		if(err) resp(err);
		resp(null, user(result[0]));
	});
}

exports.create = function(first_name, last_name, resp){
	values = [first_name, last_name];
	db.get().query('INSERT INTO users (first_name, last_name) VALUES (?,?)', values, function(err, result){
		if(err){
			resp(err);
			return;
		}
		resp(null, result.insertId);
	});
}
