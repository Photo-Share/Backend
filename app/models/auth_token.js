const db = require(global.include.db);
const user = require(global.include.model.user);
const uuid4 = require('uuid/v4');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

var auth_token = function(sql_result){
  this.token = sql_result.token;
  this.user_id = sql_result.user_id;
  this.get_user = async function(){
    return await user.get_by_id(this.user_id);
  }
  return this;
}

var get_by_token = function(token){
  return new Promise(function(resolve, reject){
    values = [token];
    db.get().query("SELECT * FROM auth_tokens WHERE token=?", values, function(err, result){
      if(err) reject(err);
      if(result.length == 0) reject('Invalid auth token');
      resolve(auth_token(result[0]));
    })
  });
}

var create = function(user){
  let token = uuid4();
  return new Promise(function(resolve, reject){
    values = [token, user.id];
    db.get().query("INSERT INTO auth_tokens (token, user_id) VALUES (?,?)", values, function(err,result){
      if(err) reject(err);
      resolve(get_by_token(token));
    });
  });
}

var verify_token = async function(token){
  token = await get_by_token(token);
  return token;
}

module.exports = {
  create: create,
  verify_token: verify_token
};
