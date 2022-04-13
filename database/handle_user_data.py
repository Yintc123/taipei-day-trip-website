import database.db as db

class Handle_member():
    def __init__(self):
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
        
    def get_user_info(self, email):
        try:
            self.connection()
            query_user="SELECT*FROM member WHERE email=\'%s\'"#email為VARCHAR(255)，需要跳脫'\'
            self.cur.execute(query_user %email)
            user=self.cur.fetchone()
            self.close()
            return user
        except:
            print("error in get_user_info")
    
    def create_user(self, name, email, password):
        try:
            user_info=self.get_user_info(email)
            if(user_info==None):
                self.connection()
                query_create_user="INSERT INTO member (name, email, password) VALUES(%s, %s, %s)"
                self.cur.execute(query_create_user, (name, email, password))
                self.conn.commit()
                self.close()
                return 0 #註冊成功
            else:
                return 1 #註冊失敗，重複的 Email 或其他原因
        except:
            print("error in create_user")
            
    def get_user_info_by_id(self, user_id):
        self.connection()
        query_user="SELECT*FROM member WHERE id=%s"
        self.cur.execute(query_user %user_id)
        user_info=self.cur.fetchone()
        self.close()
        return user_info