from http import cookies
from flask import Blueprint, make_response, request, jsonify, Response
import math, jwt, datetime
from handle_data import Handle_DB as handle, Handle_member as handle_user

error={
        "error":True,
        "message":None
}

app2=Blueprint("api",__name__)

@app2.route("/")
def api_index():
    return "api"

@app2.route("/attractions")
def api_attractions():
    try:
        data={
            "nextPage":None,
            "data":[]
        }
        data_detail=data["data"]
        page=int(request.args.get("page")) if request.args.get("page")!=None and request.args.get("page")!="" else 0
        keyword=request.args.get("keyword") if request.args.get("keyword")!=None else ""
        con_db=handle(page=page, keyword=keyword)
        count=con_db.get_total_column_count()
        if count==0:#資料庫未找到資料，count會顯示為0而不是None
            fail_message="您輸入的關鍵字查詢無果，請重新輸入其他關鍵字"
            error["message"]=fail_message
            return jsonify(error)
        if page<0:
            page=0
            con_db.page=page
        nextpage=page+1
        if nextpage==math.ceil(count/12):
            nextpage=None
        elif nextpage>math.ceil(count/12):
            fail_message="輸入的頁數有誤，資料不足"
            error["message"]=fail_message
            return jsonify(error)
        data["nextPage"]=nextpage
        locations=con_db.get_all_data()
        for where in locations:
            data_detail.append(con_db.get_needs(where))
        return jsonify(data)
    except:
        fail_message="伺服器目前當機，請稍後連線"
        error["message"]=fail_message
        return jsonify(error)

@app2.route("/attraction/<attractionId>")
def attraction(attractionId):
    try:
        data={
            "nextPage":None,
            "data":None
        }
        con_db=handle()
        count=con_db.get_count_by_id(attractionId)
        atPage=math.ceil(count/12)-1
        if atPage>=math.ceil(con_db.get_total_column_count()/12)-1:
            data["nextPage"]=None
        else:
            data["nextPage"]=atPage+1
        location=con_db.get_data_by_id(attractionId)
        if location==None:
            fail_message="您輸入的景點編號不存在，請重新輸入景點編號"
            error["message"]=fail_message
            return jsonify(error)
        data["data"]=con_db.get_needs(location)
        return jsonify(data)
    except:
        fail_message="伺服器目前當機，請稍後連線"
        error["message"]=fail_message
        return jsonify(error)

# -----------------------------user----------------------------------    
restful_api="/user"
key="secret"
@app2.route(restful_api, methods=["GET"])
def get_user():
    token=request.cookies.get("token")
    if token==None:
        return jsonify({"data":None})
    else:
        user=jwt.decode(token, key, algorithms="HS256")
        user.pop("exp")
        return jsonify(user)

@app2.route(restful_api, methods=["POST"])
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
    
    
@app2.route(restful_api, methods=["PATCH"])
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
        token=jwt.encode(payload, key, algorithm="HS256") #token加密
        resp.set_cookie(
                key="token",
                value=token,
                expires=datetime.datetime.utcnow()+datetime.timedelta(days=30) #設定cookie於30天到期
            )
        return resp
    else: # 登入失敗
        fail_message="登入失敗，帳號密碼輸入錯誤"
        error["message"]=fail_message
        return error

@app2.route(restful_api, methods=["DELETE"])
def delete_user():
    resp=make_response(jsonify({"ok":True}))
    resp.set_cookie(key="token", expires=0) # 將cookie的到期時間設定為0，清除cookie
    return resp