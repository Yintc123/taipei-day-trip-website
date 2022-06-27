import database.db as db

class Handle_DB():
    def __init__(self, keyword="", page=0):
        self.page=page
        self.keyword=keyword
        self.conn=None
        self.cur=None
        
    def connection(self):
        try:
            self.conn=db.con_pool.get_connection()
            self.cur=self.conn.cursor(dictionary=True)
            # print("successful access to the connection")
        except:
            # print("error in the connection")
            return 0
            
    def close(self):
        try:
            self.cur.close()#cursor.close()釋放從資料庫取得的資源，兩個皆須關閉
            self.conn.close()#connection.close()方法可關閉對連線池的連線，並釋放相關資源
            # print("close the connection successfully")
        except:
            # print("error in closing the connection")
            return 0
    
    def get_images(self, id):
        try:
            query_img="SELECT images FROM scene_picture WHERE id=%s"
            self.connection()
            self.cur.execute(query_img %id)
            images=self.cur.fetchall()
            self.close()
            img_list=[]
            for url in images:
                img_list.append(url["images"])
            return img_list
        except:
            self.close()
            # print("error in get_images")
            return  0
            
    def get_needs(self, data):
        try:
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
                    data_info[title]=self.get_images(data_info["id"])
                else:
                    data_info[title]=data[title]
            return data_info
        except:
            self.close()
            # print("error in get_needs")
            return 0
            
    def get_total_column_count(self):
        try:
            self.connection()
            query_total_count="SELECT COUNT(id) FROM scene_info WHERE name LIKE %s"
            self.cur.execute(query_total_count, ("%"+self.keyword+"%", ))#不輸入keyword，計算總資料欄數
            total_count=self.cur.fetchone()["COUNT(id)"]
            self.close()
            return total_count
        except:
            self.close()
            # print("error in get_total_column_count")
            return 0
            
    def get_all_data(self):
        try:
            self.connection()
            query_locations="SELECT*FROM scene_info WHERE name LIKE %s LIMIT %s, %s"
            self.cur.execute(query_locations, (("%"+self.keyword+"%"), self.page*12, 12))
            locations=self.cur.fetchall()
            self.close()
            return locations
        except:
            self.close()
            # print("error in get_all_data")
            return 0
            
    def get_data_by_id(self, id):
        try:
            self.connection()
            query_location_by_id="SELECT*FROM scene_info WHERE id=%s"
            self.cur.execute(query_location_by_id %id)
            location=self.cur.fetchone()
            self.close()
            return location
        except:
            self.close()
        #    print("error in get_data_by_id")
            return 0
        
    def get_count_by_id(self, id):
        try:
            self.connection()
            query_count="SELECT COUNT(id) FROM scene_info WHERE id<=%s"
            self.cur.execute(query_count %id)
            count=self.cur.fetchone()["COUNT(id)"]
            self.close()
            return count
        except:
            self.close()
        #    print("error in get_count_by_id")
            return 0
           
    def get_needed_info_for_order(self, attraction_id):
        output={}
        attraction_info=self.get_data_by_id(attraction_id)
        output["id"]=attraction_info["id"]
        output["name"]=attraction_info["name"]
        output["address"]=attraction_info["address"]
        output["image"]=self.get_images(attraction_id)[0]
        return output
        
        
        
        