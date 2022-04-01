from flask import Blueprint
from flask import Blueprint, make_response, request, jsonify
import jwt, datetime
from handle_data import Handle_member as handle_user

app3=Blueprint("user_api", __name__)

error={
        "error":True,
        "message":None
}

restful_api="/user"
key="secret"
@app3.route(restful_api, methods=["GET"])
def get_user():
    token_user=request.cookies.get("token_user")
    if token_user==None:
        return jsonify({"data":None})
    else:
        user=jwt.decode(token_user, key, algorithms="HS256")
        user.pop("exp")
        return jsonify(user)

@app3.route(restful_api, methods=["POST"])
def create_user():
    name=request.form["name"]
    email=request.form["email"]
    password=request.form["password"]
    con_user=handle_user()
    result=con_user.create_user(name=name, email=email, password=password)
    if result==0:
        return {"ok":True}
    else:
        fail_message="註冊失敗，此Email已經註冊"
        error["message"]=fail_message
        return error
    
    
@app3.route(restful_api, methods=["PATCH"])
def patch_user():
    user={"data":{
        "id":None,
        "name":None,
        "email":None,
    }}
    print(request.files)
    email=request.form["email"]
    password=request.form["password"]
    if email=="": # 判斷是否輸入帳號，應該給前端去擋
        fail_message="請輸入帳號"
        error["message"]=fail_message
        return error
    con_user=handle_user()
    user_info=con_user.get_user_info(email)
    if user_info==None: # 判斷帳號是否已申請
        fail_message="登入失敗，此mail並未註冊帳號"
        error["message"]=fail_message
        return error
    elif password==user_info["password"]: # 判斷密碼是否正確
        resp=make_response(jsonify({"ok":True}))
        for info in user["data"]:
            user["data"][info]=user_info[info]
        payload=user
        payload["exp"]=datetime.datetime.utcnow()+datetime.timedelta(days=30) #設定token於30天到期
        token_user=jwt.encode(payload, key, algorithm="HS256") #token加密
        resp.set_cookie(
                key="token_user",
                value=token_user,
                expires=datetime.datetime.utcnow()+datetime.timedelta(days=30) #設定cookie於30天到期
            )
        return resp
    else: # 登入失敗
        fail_message="登入失敗，帳號密碼輸入錯誤"
        error["message"]=fail_message
        return error

@app3.route(restful_api, methods=["DELETE"])
def delete_user():
    resp=make_response(jsonify({"ok":True}))
    resp.set_cookie(key="token_user", expires=0) # 將cookie的到期時間設定為0，清除cookie
    return resp