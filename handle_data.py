import db

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
            print("successful access to the connection")
        except:
            print("error in the connection")
            
    def close(self):
        try:
            self.cur.close()#cursor.close()釋放從資料庫取得的資源，兩個皆須關閉
            self.conn.close()#connection.close()方法可關閉對連線池的連線，並釋放相關資源
            print("close the connection successfully")
        except:
            print("error in closing the connection")
    
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
            print("error in get_images")
            
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
            print("error in get_needs")
            
    def get_total_column_count(self):
        try:
            self.connection()
            query_total_count="SELECT COUNT(id) FROM scene_info WHERE name LIKE %s"
            self.cur.execute(query_total_count, ("%"+self.keyword+"%", ))#不輸入keyword，計算總資料欄數
            total_count=self.cur.fetchone()["COUNT(id)"]
            self.close()
            return total_count
        except:
            print("error in get_total_column_count")
            
    def get_all_data(self):
        try:
            self.connection()
            query_locations="SELECT*FROM scene_info WHERE name LIKE %s LIMIT %s, %s"
            self.cur.execute(query_locations, (("%"+self.keyword+"%"), self.page*12, 12))
            locations=self.cur.fetchall()
            self.close()
            return locations
        except:
            print("error in get_all_data")
            
    def get_data_by_id(self, id):
        try:
            self.connection()
            query_location_by_id="SELECT*FROM scene_info WHERE id=%s"
            self.cur.execute(query_location_by_id %id)
            location=self.cur.fetchone()
            self.close()
            return location
        except:
           print("error in get_data_by_id") 
        
    def get_count_by_id(self, id):
        try:
            self.connection()
            query_count="SELECT COUNT(id) FROM scene_info WHERE id<=%s"
            self.cur.execute(query_count %id)
            count=self.cur.fetchone()["COUNT(id)"]
            print(count)
            self.close()
            return count
        except:
           print("error in get_count_by_id")