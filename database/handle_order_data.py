import database.db as db
from datetime import datetime

class Handle_order():
    def __init__(self, user_id=1, attraction_id=1, price=1, phone=1, trip_date=1, order_status=0):
        self.user_id=user_id
        self.attraction_id=attraction_id
        self.price=price
        self.phone=phone
        self.trip_date=trip_date
        self.order_status=order_status
        self.conn=None
        self.cur=None
        
    def connection(self):
        try:
            self.conn=db.con_pool.get_connection()
            self.cur=self.conn.cursor(dictionary=True)
            # print("successful access to the connection")
        except Exception as e:
            # print("error in the connection")
            return e
            
    def close(self):
        try:
            self.cur.close()#cursor.close()釋放從資料庫取得的資源，兩個皆須關閉
            self.conn.close()#connection.close()方法可關閉對連線池的連線，並釋放相關資源
            # print("close the connection successfully")
        except Exception as e:
            # print("error in closing the connection")
            return e
    
    def create_order_number(self, time):
        try:
            query="SELECT order_number FROM order_table WHERE order_number LIKE %s"
            self.connection()
            self.cur.execute(query, (("%"+time+"%"), ))
            result=self.cur.fetchall()
            self.close()
            if not result: # 空list
                order_number=int(str(time)+"0001")
            else:
                order_number=result[len(result)-1]["order_number"]+1
                
            return order_number
        except Exception as e:
            self.close()
            return e
        
    def create_order(self):
        try:
            query="INSERT INTO order_table (order_number, attraction_id, user_id, price, phone, trip_date, order_status) VALUES(%s, %s, %s, %s, %s, %s, %s)"
            time=datetime.now().strftime('%Y%m%d')
            order_number=self.create_order_number(time)
            self.connection()
            self.cur.execute(query, (order_number, self.attraction_id, self.user_id, self.price, self.phone, self.trip_date, self.order_status))
            self.conn.commit()
            self.close()
            return order_number
        except Exception as e:
            self.close()
            return e
    
    def check_order(self, order_number):
        try:
            query="SELECT*FROM order_table WHERE order_number=%s"
            self.connection()
            self.cur.execute(query %order_number)
            order_info=self.cur.fetchone()
            self.close()
            return order_info
        except Exception as e:
            self.close()
            return e
    
    def check_order_by_user_id(self):
        try:
            query="SELECT*FROM order_table WHERE user_id=%s"
            self.connection()
            self.cur.execute(query %self.user_id)
            order_info=self.cur.fetchall()
            self.close()
            return order_info
        except Exception as e:
            self.close()
            return e