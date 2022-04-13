import json
import mysql.connector


mydb=mysql.connector.connect(
    host="localhost",
    user="root",
    password="AbC123456",
    database="taipei_scene",
    auth_plugin="mysql_native_password",
    # port="3400",
    # password="abc123456"
)

mycursor=mydb.cursor()

# with open("taipei-attractions.json", mode="r", encoding="utf-8") as file:
#     data=json.load(file)

# locations=data["result"]["results"]
# loca_keys=list(locations[0].keys())
# print(loca_key)

# -----------------Create Database---------------
# mycursor.execute("CREATE DATABASE Taipei_Scene")
# mycursor.execute("SHOW DATABASES")
# for x in mycursor:
#     print(x)
# ------------------------------------------------
# ----------------Create Tables-------------------
# mycursor.execute("CREATE TABLE scene_info (id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT)")
# mycursor.execute("CREATE TABLE scene_picture (picture_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT)")
# mycursor.execute("CREATE TABLE scene_other (other_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT)")
# other表不符合資料庫第二正規化，各欄位資料皆與主鍵相關聯
# mycursor.execute("DESCRIBE scene_info")#顯示欄位參數
# for x in mycursor:
#     print(x)

# mycursor.execute("DROP TABLE scene_picture")
# mycursor.execute("DROP TABLE scene_info")
# mycursor.execute("DROP TABLE scene_other")

# rename_text={
#     "xbody":"description",
#     "stitle":"name",
#     "CAT2":"category",
#     "info":"transport"
# }

# item_int=[
#     "RowNumber",
#     "REF_WP",
#     "langinfo"
# ]
# item_double=[
#     "longitude",
#     "latitude",
# ]

# # 將欄位引入table
# for key in loca_keys:
#     if key=="file":
#         mycursor.execute("ALTER TABLE scene_picture ADD images VARCHAR(255)")
#     elif key in list(rename_text.keys()):
#         mycursor.execute("ALTER TABLE scene_info ADD %s TEXT(65535)" %rename_text[key])
#     elif key=="_id":
#         mycursor.execute("ALTER TABLE scene_picture ADD id BIGINT")
#         mycursor.execute("ALTER TABLE scene_picture ADD FOREIGN KEY (id) REFERENCES scene_info(id)")
#         # mycursor.execute("ALTER TABLE scene_info ADD %s BIGINT" %key)
#     elif key in item_int:
#         mycursor.execute("ALTER TABLE scene_info ADD %s INT" %key)
#     elif key in item_double:
#         mycursor.execute("ALTER TABLE scene_info ADD %s DOUBLE(10, 5)" %key)
#     elif key=="SERIAL_NO":
#         mycursor.execute("ALTER TABLE scene_info ADD %s BIGINT" %key)
#     elif key=="MEMO_TIME":
#         mycursor.execute("ALTER TABLE scene_info ADD %s TEXT(65535)" %key)
#     else:
#         mycursor.execute("ALTER TABLE scene_info ADD %s VARCHAR(255)" %key)

# mycursor.execute("DESCRIBE scene_picture")#顯示欄位參數
# for x in mycursor:
#     print(x)
# ------------------------------------------------
# ---------------將資料匯入table------------------
# import csv
# infile_info=open("scene_info.csv", encoding="utf-8-sig")
# infile_picture=open("scene_picture.csv", encoding="utf-8-sig")

# csvReader=csv.reader(infile_info)
# next(csvReader)#第一行為欄位名稱需跳過
# for row in csvReader:
#     mycursor.execute(
#             "INSERT INTO scene_info VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
#             [row[17], row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16], row[18], row[19]]
#     )
#     mydb.commit()
 
# print("50%")   
# csvReader=csv.reader(infile_picture)
# next(csvReader)#第一行為欄位名稱需跳過
# for row in csvReader:
#     mycursor.execute(
#             "INSERT INTO scene_picture(id, images) VALUES(%s, %s)", 
#             [row[0], row[1]]
#     )
    # mydb.commit()

# mycursor.execute("DELETE FROM scene_picture")
# mydb.commit()

# print("ok")
        



# ------------------member------------------------------
# mycursor.execute("CREATE TABLE member (id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, time DATETIME NOT NULL DEFAULT NOW())")

# mycursor.execute("DROP TABLE member")
# ------------------order------------------------------
mycursor.execute("CREATE TABLE order_table(id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT, order_number BIGINT NOT NULL, attraction_id BIGINT NOT NULL, user_id BIGINT NOT NULL, time DATETIME NOT NULL DEFAULT NOW())")

mycursor.execute("ALTER TABLE order_table ADD FOREIGN KEY (attraction_id) REFERENCES scene_info(id)")
mycursor.execute("ALTER TABLE order_table ADD FOREIGN KEY (user_id) REFERENCES member(id)")
mycursor.execute("ALTER TABLE order_table ADD price INT NOT NULL")
mycursor.execute("ALTER TABLE order_table ADD order_status INT NOT NULL DEFAULT 0")
mycursor.execute("ALTER TABLE order_table ADD phone VARCHAR(255) NOT NULL")
mycursor.execute("ALTER TABLE order_table ADD trip_date VARCHAR(255) NOT NULL")

# mycursor.execute("DROP TABLE order_table")