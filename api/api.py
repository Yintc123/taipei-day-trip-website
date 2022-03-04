from flask import Blueprint, request, jsonify
import db
import math

def put_images(id):
   queryforimg="SELECT images FROM scene_picture WHERE id=%s"
   conn=db.con_pool.get_connection()
   mycursor=conn.cursor()
   mycursor.execute(queryforimg %id)
   result=mycursor.fetchall()
   mycursor.close()
   conn.close()
   img_list=[]
   for i in result:
       img_list.append(i[0])
   return img_list   

def put_api(data1):
    api={
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
    api_key=list(api.keys())
    for key in api_key:
        if key=="images":
            api[key]=put_images(api["id"])
        else:
            api[key]=data1[key] 
    return api

def calcutate_data_toatal_count():
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
        api_data=data["data"]
        page=request.args.get("page") 
        keyword=request.args.get("keyword")
        conn=db.con_pool.get_connection()
        mycursor=conn.cursor(dictionary=True)#dictionary=True使fetchall()的檔案為dict
        query=[]
        if keyword=="" or keyword==None:
            count=calcutate_data_toatal_count()
            query_place="SELECT*FROM scene_info LIMIT %s, %s"
        else:
            query_count="SELECT COUNT(id) FROM scene_info WHERE name LIKE %s"
            mycursor.execute(query_count, ("%"+keyword+"%", ))
            count=mycursor.fetchone()["COUNT(id)"]
            query_place="SELECT*FROM scene_info WHERE name LIKE %s LIMIT %s, %s"
            query.append("%"+keyword+"%")
        if page==None or page=="" or int(page)+1<=0:
            page=0
            nextpage=page+1
        else:
            page=int(page)
        if page+1==math.ceil(count/12):
            nextpage=None
        elif page+1>math.ceil(count/12):
            return jsonify(data)
        else:
            nextpage=page+1
        data["nextPage"]=nextpage
        # query_place="SELECT*FROM scene_info LIMIT %s, %s"
        start=page*12
        query.extend([start, 12])
        mycursor.execute(query_place, query)
        locations=mycursor.fetchall()
        mycursor.close()
        conn.close()
        for where in locations:
            api_data.append(put_api(where))
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
            "curPage":None,
            "data":[]
        }
        api_data=data["data"]
        conn=db.con_pool.get_connection()
        mycursor=conn.cursor(dictionary=True)#dictionary=True使fetchall()的檔案為dict
        query_place="SELECT*FROM scene_info WHERE id=%s"
        query_count="SELECT COUNT(id) FROM scene_info WHERE id<=%s"
        mycursor.execute(query_count %attractionId)
        count=mycursor.fetchone()
        curPage=math.ceil(count["COUNT(id)"]/12)-1
        data["curPage"]=curPage
        if curPage>=math.ceil(calcutate_data_toatal_count()/12)-1:
            data["nextPage"]=None
        else:
            data["nextPage"]=curPage+1
        mycursor.execute(query_place %attractionId)
        location=mycursor.fetchone()
        if location==None:
            data["nextPage"]=None
            data["curPage"]=None
            return jsonify(data)
        mycursor.close()
        conn.close()
        api_data.append(put_api(location))
        return jsonify(data)
    except:
        error={
            "error":True,
            "message":"request.header的content type請改為application/json"
        }
        return jsonify(error)