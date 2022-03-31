import datetime
from flask import Blueprint, make_response, request, jsonify
import jwt
from handle_data import Handle_DB as handle

key_booking="secret_key" # jwt_key
key_user="secret" # jwt_key

app4=Blueprint("tour_api", __name__)

error={
        "error":True,
        "message":None
}

booking_url="/booking"
@app4.route(booking_url, methods=["GET"])
def get_booking():
    token_booking=request.cookies.get("token_booking")
    token_user=request.cookies.get("token_user")
    if token_booking==None:
        return {"data":None}
    if token_user==None:
        fail_message="未登入系統，拒絕存取"
        error["message"]=fail_message
        return error
    else:
        booking_info=jwt.decode(token_booking, key_booking, algorithms="HS256")
        user_info=jwt.decode(token_user, key_user, algorithms="HS256")
        if user_info["data"]["email"]==booking_info["email"]:
            booking_info.pop("email")
            booking_info.pop("exp")
            return jsonify(booking_info)
        else:
            fail_message="您並未預約的行程"
            error["message"]=fail_message
            return error

@app4.route(booking_url, methods=["POST"])
def booking():
    booking_info={
        "data":{
            "attraction":{},
            "date":None,
            "time":None,
            "price":None
        }}
    token_user=request.cookies.get("token_user")
    user_info=jwt.decode(token_user, key_user, algorithms="HS256")
    booking=booking_info["data"]
    attraction_id=request.form["attraction_id"]
    date=request.form["date"]
    time=request.form["time"]
    con_db=handle()
    
    if time=="上半天":
        cost="2000"
    else:
        cost="2500"
    attraction_data=con_db.get_data_by_id(attraction_id)
    booking["attraction"]["id"]=attraction_id
    booking["attraction"]["name"]=attraction_data["name"]
    booking["attraction"]["address"]=attraction_data["address"]
    booking["attraction"]["image"]=con_db.get_images(attraction_id)[0]
    booking["date"]=date
    booking["time"]=time
    booking["price"]=cost
    
    resp=make_response(jsonify({"ok":True}))
    payload=booking_info
    payload["email"]=user_info["data"]["email"] # 使用者認證
    payload["exp"]=datetime.datetime.utcnow()+datetime.timedelta(days=30) # 設定token於30天到期
    token_booking=jwt.encode(payload, key_booking, algorithm="HS256") # token加密
    resp.set_cookie(
        key="token_booking",
        value=token_booking,
        expires=datetime.datetime.utcnow()+datetime.timedelta(days=30) # 設定cookie於30天到期
    )
    return resp

@app4.route(booking_url, methods=["DELETE"])
def delete_booking():
    resp=make_response({"ok":True})
    resp.delete_cookie(key="token_booking") # 清除cookie
    return resp