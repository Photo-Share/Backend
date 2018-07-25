const user = require(global.include.model.user);
const db = require(global.include.db);
const send_request = require(global.include.helper.send_request);
const async = require('asyncawait/async');
const await = require('asyncawait/await');

var facebook_user = function(sql_result){
	this.fb_id = sql_result.fb_id;
	this.user_id = sql_result.user_id;
	this.get_user = async function(){
		return await user.get_by_id(this.user_id);
	}
	return this;
}

var get_by_id = function(id){
	return new Promise(function(resolve, reject){
		values = [id];
		db.get().query('SELECT * FROM fb_users WHERE fb_id=?', values, function(err,result){
			if(err) reject(err);
			if(result.length == 0) reject("No match");
			else resolve(facebook_user(result[0]));
		});
	});
}

var create = function(fb_id, user_id){
	return new Promise(function(resolve, reject){
		values  = [fb_id, user_id];
		db.get().query('INSERT INTO fb_users (fb_id, user_id) VALUES (?,?)', values, function(err, result){
			if(err) reject(err);
			resolve(get_by_id(fb_id));
		});
	});
}

var get_from_response = async function(body){
	try{
		let fb_user = await get_by_id(body.id);
		return fb_user;
	}catch(err){
		if(err === "No match"){
			names = body.name.split(" ");
			let new_user = await user.create(names[0], names[names.length - 1])
			fb_user = await create(body.id, new_user.id);
			return fb_user;
		}
		else{
			throw(err);
		}
	}
}

var get_by_request_token = async function(token){
	try{
		let response = await send_request.get({
			url: 'https://graph.facebook.com/me',
			qs: {'access_token': token}
		});
		let fb_user = await get_from_response(response)
		return fb_user;
	}catch(err){
		throw({"Message": "Invalid facebook token", "Err message": err});
	}
}

module.exports = {
	get_by_request_token: get_by_request_token,
	create: create,
	get_by_id: get_by_id
};
