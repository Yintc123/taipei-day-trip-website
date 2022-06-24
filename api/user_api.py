import base64
from flask import Blueprint
from flask import Blueprint, make_response, request, jsonify
from dotenv import load_dotenv, dotenv_values
# from flask_cors import CORS
import jwt, datetime
from database.handle_user_data import Handle_user as handle_user

env='.env' # 執行環境
load_dotenv(override=True)

user_key=dotenv_values(env)["user_key"] # jwt_key

app3=Blueprint("user_api", __name__)
# CORS(app3)

error={
        "error":True,
        "message":None
}

restful_api="/user"
@app3.route(restful_api, methods=["GET"])
def get_user():
    token_user=request.cookies.get("token_user")
    if token_user==None:
        return jsonify({"data":None})
    else:
        user=jwt.decode(token_user, user_key, algorithms="HS256")
        user.pop("exp")
        return jsonify(user)

@app3.route(restful_api, methods=["POST"])
def create_user():
    name=request.form["name"]
    email=request.form["email"]
    password=request.form["password"]
    if "@" not in email:
        fail_message="註冊失敗，Email格式有誤"
        error["message"]=fail_message
        return error
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
        # "img":None
    }}
    print(request.files)
    email=request.form["email"]
    password=request.form["password"]
    if email=="": # 判斷是否輸入帳號，應該給前端去擋
        fail_message="請輸入帳號"
        error["message"]=fail_message
        return error
    elif "@" not in email:
        fail_message="登入失敗，Email格式有誤"
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
        print(user)
        payload=user
        payload["exp"]=datetime.datetime.utcnow()+datetime.timedelta(days=30) #設定token於30天到期
        token_user=jwt.encode(payload, user_key, algorithm="HS256") #token加密
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

url=restful_api+'/<user_id>'
@app3.route(url, methods=["POST"])
def get_password(user_id):
    token_user=request.cookies.get("token_user")
    user_info=jwt.decode(token_user, user_key, algorithms="HS256")
    if user_info==None or user_info["data"]["id"]!=int(user_id):
        error["message"]="密碼查詢錯誤，不得查詢他人密碼"
        return jsonify(error)
    con_user=handle_user()
    result=con_user.get_user_info_by_id(user_id)
    return jsonify(result["password"])

@app3.route(url, methods=["GET"])
def get_user_img(user_id):
    user_img={
        "img":None
    }
    token_user=request.cookies.get("token_user")
    user_info=jwt.decode(token_user, user_key, algorithms="HS256")
    if user_info==None or user_info["data"]["id"]!=int(user_id):
        error["message"]="查詢錯誤，不得查詢他人資料"
        return jsonify(error)
    con_user=handle_user()
    result=con_user.get_user_info_by_id(user_id)
    if(result["img"]!=None):
        img_data=base64.b64encode(result["img"]) # 將blob轉為base64
        user_img["img"]="data:image/jpeg;charset=utf-8;base64,"+img_data.decode("utf-8")
    return jsonify(user_img)


@app3.route(url, methods=["PATCH"])
def modify_user_info(user_id):
    user_info={
        "name":None,
        "email":None,
        "password":None,
        "img":None
    }
    
    token_user=request.cookies.get("token_user")
    payload=jwt.decode(token_user, user_key, algorithms="HS256")
    if payload==None or payload["data"]["id"]!=int(user_id):
        error["message"]="資料修改錯誤，不得修改他人資料"
        return jsonify(error)
    
    for info in user_info:
        if info=="img":
            # request.files.get(info).read()轉成blob以儲存於mysql
            user_info[info]=None if request.files.get(info)=="" else request.files.get(info)
            if user_info[info]==None:
                continue
            user_info[info]=user_info[info].read()
        else:
            user_info[info]=request.form.get(info) if request.form.get(info)!="" else None
    con_user=handle_user()
    result=con_user.modify_user_info(user_id,
                                     user_info["name"],
                                     user_info["email"],
                                     user_info["password"],
                                     user_info["img"]
                                     )
    if result==1:
        error["message"]="此帳號已被使用"
        return jsonify(error)
    
    payload["data"]["name"]=user_info["name"] if user_info["name"]!=None else payload["data"]["name"]
    payload["data"]["email"]=user_info["email"] if user_info["email"]!=None else payload["data"]["email"]
    token_user=jwt.encode(payload, user_key, algorithm="HS256") #token加密
    resp=make_response(jsonify({"ok":True}))
    resp.set_cookie(
            key="token_user",
            value=token_user,
    )
    return resp