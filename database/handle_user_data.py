import database.db as db
import mysql.connector

def escape_column_name(name): # 去除字串的''
    # This is meant to mostly do the same thing as the _process_params method
    # of mysql.connector.MySQLCursor, but instead of the final quoting step,
    # we escape any previously existing backticks and quote with backticks.
    converter = mysql.connector.conversion.MySQLConverter()
    return "`" + converter.escape(converter.to_mysql(name)).decode().replace('`', '``') + "`"

class Handle_user():
    def __init__(self):
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
        
    def get_user_info(self, email):
        try:
            self.connection()
            query_user="SELECT*FROM member WHERE email=\'%s\'"#email為VARCHAR(255)，需要跳脫'\'
            self.cur.execute(query_user %email)
            user=self.cur.fetchone()
            self.close()
            return user
        except:
            # print("error in get_user_info")
            return 0
    
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
            # print("error in create_user")
            return 0
            
    def get_user_info_by_id(self, user_id):
        self.connection()
        query_user="SELECT*FROM member WHERE id=%s"
        self.cur.execute(query_user %user_id)
        user_info=self.cur.fetchone()
        self.close()
        return user_info
    
    def modify_user_info(self, user_id, name, email, password, img):
        v={
            "name":name,
            "email":email,
            "password":password,
            "img":img
        }
        query="UPDATE member SET {}=%s WHERE id="+user_id
        self.connection()
        for var in v:
            if(v[var]!=None):
                if var=="email":
                    result=self.get_user_info(email)
                    self.connection() # 前一個function會將所有connection和cursor關閉
                    if (result!=None and result["id"]!=int(user_id)):
                        return 1
                self.cur.execute(query.format(escape_column_name(var)),(v[var], ))
        self.conn.commit()
        self.close()
        return 0