from flask import Blueprint, request, jsonify, redirect, url_for
import db
import math

def get_images(id):
   query_img="SELECT images FROM scene_picture WHERE id=%s"
   conn=db.con_pool.get_connection()
   mycursor=conn.cursor()
   mycursor.execute(query_img %id)
   images=mycursor.fetchall()
   mycursor.close()#cursor.close()釋放從資料庫取得的資源，兩個皆須關閉
   conn.close()#connection.close()方法可關閉對連線池的連線，並釋放相關資源
   img_list=[]
   for url in images:
       img_list.append(url[0])
   return img_list   

def get_data(data):
    data_info={
            "id":None,
            "name":None,
            "category":None,
            "description":None,
            "address":None,
            "transport":None,
            "MRT":None,
            "latitude":None,
            "longitude":None,
            "images":[
                None
            ]
        }
    data_titles=list(data_info.keys())
    for title in data_titles:
        if title=="images":
            data_info[title]=get_images(data_info["id"])
        else:
            data_info[title]=data[title] 
    return data_info

def toatal_column_count():
    conn=db.con_pool.get_connection()
    mycursor=conn.cursor()
    query_total_count="SELECT COUNT(id) FROM scene_info"
    mycursor.execute(query_total_count)
    total_count=mycursor.fetchone()[0]
    mycursor.close()
    conn.close()
    return total_count

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
        page=request.args.get("page") 
        keyword=request.args.get("keyword")
        conn=db.con_pool.get_connection()
        mycursor=conn.cursor(dictionary=True)#dictionary=True使fetchall()的檔案為dict
        query=[]
        if keyword=="" or keyword==None:
            count=toatal_column_count()
            query_locations="SELECT*FROM scene_info LIMIT %s, %s"
        else:
            query_count="SELECT COUNT(id) FROM scene_info WHERE name LIKE %s"
            mycursor.execute(query_count, ("%"+keyword+"%", ))
            count=mycursor.fetchone()["COUNT(id)"]
            query_locations="SELECT*FROM scene_info WHERE name LIKE %s LIMIT %s, %s"
            query.append("%"+keyword+"%")
        if page==None or page=="" or int(page)+1<=0:
            page=0
            nextpage=page+1
        else:
            page=int(page)
            nextpage=page+1
        if nextpage==math.ceil(count/12):
            nextpage=None
        elif nextpage>math.ceil(count/12):
            fail_message="輸入的頁數有誤，資料不足"
            error={
            "error":True,
            "message":fail_message
            }
            return error
        data["nextPage"]=nextpage
        location_starter=page*12
        query.extend([location_starter, 12])
        mycursor.execute(query_locations, query)
        locations=mycursor.fetchall()
        mycursor.close()
        conn.close()
        for where in locations:
            data_detail.append(get_data(where))
        return jsonify(data)
    except:
        error={
            "error":True,
            "message":"伺服器目前當機，請稍後連線"
        }
        return jsonify(error)

@app2.route("/attraction/<attractionId>")
def attraction(attractionId):
    try:
        data={
            "nextPage":None,
            "atPage":None,
            "data":[]
        }
        data_detail=data["data"]
        conn=db.con_pool.get_connection()
        mycursor=conn.cursor(dictionary=True)#dictionary=True使fetchall()的檔案為dict
        query_location="SELECT*FROM scene_info WHERE id=%s"
        query_count="SELECT COUNT(id) FROM scene_info WHERE id<=%s"
        mycursor.execute(query_count %attractionId)
        count=mycursor.fetchone()
        atPage=math.ceil(count["COUNT(id)"]/12)-1
        data["atPage"]=atPage
        if atPage>=math.ceil(toatal_column_count()/12)-1:
            data["nextPage"]=None
        else:
            data["nextPage"]=atPage+1
        mycursor.execute(query_location %attractionId)
        location=mycursor.fetchone()
        if location==None:
            fail_message="您輸入的景點編號不存在，請重新輸入景點編號"
            error={
            "error":True,
            "message":fail_message
            }
            return error
        mycursor.close()
        conn.close()
        data_detail.append(get_data(location))
        return jsonify(data)
    except:
        error={
            "error":True,
            "message":"伺服器目前當機，請稍後連線"
        }
        return jsonify(error)
    
@app2.route("/error")
def error():
    fail_message=request.args.get("fail_message")
    error={
            "error":True,
            "message":fail_message
        }
    return error