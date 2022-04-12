from flask import Blueprint, jsonify, make_response, request
import jwt
from conn_to_tappay_api import connect_to_tappay_api as tappay
from database.handle_order_data import Handle_order as handle_order
from database.handle_attraction_data import Handle_DB as handle_attraction
from database.handle_user_data import Handle_member as handle_user

error={
        "error":True,
        "message":None
}

key_booking="secret_key" # jwt_key
key_user="secret" # jwt_key
# prime="test_3a2fb2b7e892b914a03c95dd4dd5dc7970c908df67a49527c0a648b2bc9" #測試用

app5=Blueprint("order_api", __name__)

orders_url="/orders"
@app5.route(orders_url, methods=["POST"])
def order_tour():
    order={
        "prime":None,
        "order":{
            "price":None,
            "trip":{}
        },
        "contact":{
            "name":None,
            "email":None,
            "phone":None
        }
    }
    order_status=0
    prime=request.form["prime"]
    user_name=request.form["name"]
    user_email=request.form["email"]
    user_phone=request.form["phone"]
    order["prime"]=prime
    order["contact"]["name"]=user_name
    order["contact"]["email"]=user_email
    order["contact"]["phone"]=user_phone
    token_user=request.cookies.get("token_user")
    if token_user==None:
        error["message"]="請登入後，再申請訂單"
        return jsonify(error)
    user_info=jwt.decode(token_user, key_user, algorithms="HS256")
    token_booking=request.cookies.get("token_booking")
    booking_info=jwt.decode(token_booking, key_booking, algorithms="HS256")["data"]
    order["order"]["price"]=booking_info["price"]
    booking_info.pop("price")
    order["order"]["trip"]=booking_info
    
    # prime="test_3a2fb2b7e892b914a03c95dd4dd5dc7970c908df67a49527c0a648b2bc9" #測試用
    
    result={"data":{"payment":{None}}}
    t=tappay(prime)
    payment_result=t.calls_api(order["order"]["price"], user_phone, user_name, user_email)
    result["data"]["payment"]=payment_result
    con_order=handle_order(user_id=user_info["data"]["id"],
                      attraction_id=booking_info["attraction"]["id"],
                      price=order["order"]["price"],
                      phone=user_phone,
                      trip_date=booking_info["date"], 
                      order_status=order_status)
    if payment_result["status"]==0:
        order_status=1
        con_order.order_status=order_status
        order_number=con_order.create_order()
        result["data"]["number"]=order_number
        
        return jsonify(result)
    else:
        order_status=0
        con_order.order_status=order_status
        order_number=con_order.create_order()
        error["message"]=payment_result["message"]
        return jsonify(error)

@app5.route("/order/<orderNumber>", methods=["GET"])
def get_order(orderNumber):
    output={
        "data":{
            "number":None,
            "price":None,
            "trip":{
                "attraction":{},
                "date":None,
                "time":None
            },
            "contact":{
                "name":None,
                "email":None,
                "phone":None
            },
            "status":None,
            "order_time":None
        }
    }
    token_user=request.cookies.get("token_user")
    if token_user==None:
        error["message"]="請登入後，再查詢訂單"
        return jsonify(error)
    order=handle_order()
    attraction=handle_attraction()
    user=handle_user()
    order_info=order.check_order(orderNumber)
    if not order_info:
        return {"data":None}
    attraction_info=attraction.get_needed_info_for_order(order_info["attraction_id"])
    user_info=user.get_user_info_by_id(order_info["user_id"])
    output["data"]["number"]=order_info["order_number"]
    output["data"]["price"]=order_info["price"]
    output["data"]["status"]=order_info["order_status"]
    output["data"]["trip"]["attraction"]=attraction_info
    output["data"]["trip"]["date"]=order_info["trip_date"]
    output["data"]["contact"]["name"]=user_info["name"]
    output["data"]["contact"]["email"]=user_info["email"]
    output["data"]["contact"]["phone"]=order_info["phone"]
    output["data"]["order_time"]=order_info["time"]
    if order_info["price"]==2000:
        output["data"]["trip"]["time"]="早上9點到下午4點"
    else:
        output["data"]["trip"]["time"]="下午4點到晚上9點"
    return jsonify(output)

@app5.route("/user_order/<user_id>", methods=["GET"])
def get_orders_by_user(user_id):
    orders=handle_order()
    attraction=handle_attraction()
    orders.user_id=user_id
    # orders.user_id=1
    order_info_list=orders.check_order_by_user_id()
    for order_info in order_info_list:
        at=attraction.get_data_by_id(order_info["attraction_id"])["name"]
        order_info["attraction"]=at
        
    # attraction.get_data_by_id(self, order_info["data"]["trip"])
    # print(order_info)
    return jsonify(order_info_list)