from dotenv import dotenv_values, load_dotenv
from flask import Blueprint, request, jsonify
import math
import requests
from database.handle_attraction_data import Handle_DB as handle
from .api_aws import Aws_s3_api
# from flask_cors import CORS

env=".env"
load_dotenv(override=True)

error={
        "error":True,
        "message":None
}

app2=Blueprint("attractions_api",__name__)
# CORS(app2)

cdn_url=dotenv_values(env)["url_cdn"]

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

        json_filename=str(page)+"-"+keyword+".json"
        cdn_stock_data=requests.get(cdn_url+json_filename) # 確認cdn上有無資料
        if cdn_stock_data:
            return cdn_stock_data.json()

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
        
        s3=Aws_s3_api()
        s3.upload_json_data(data, json_filename) # 將資料上傳至s3

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