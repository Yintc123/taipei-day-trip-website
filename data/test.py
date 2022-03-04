import json
import csv
import copy
import re#正規表示式庫


def pictdata(data):
    http_str="http"
    file=data["file"]
    picturelist=[]
    result = [_.start() for _ in re.finditer(http_str, file)]
    target=[".jpg", ".JPG", ".png", ".PNG"]
    for i in range(len(result)):
        if result[i] != result[-1]:
            if file[result[i+1]-4:result[i+1]] in target:
                # print(file[result[i]:result[i+1]])
                picturelist.append(file[result[i]:result[i+1]])
        else:
            if file[result[i]:] in target:
                # print(file[result[i]:])
                picturelist.append(file[result[i]:])
    return picturelist

with open("taipei-attractions.json", mode="r", encoding="utf-8") as file:
     data=json.load(file)

# print(data["result"]["results"][1].keys())
locations=data["result"]["results"]
key=list(locations[0].keys())
# key.remove("file") #從列表中移除"file"；list.pop(index)
# print(key)

# print(key)

# --------------判斷所有的dict資料是否有相同的key--------------
# # print(key)
# msg=None
# for where in locations:
#     if where.keys()!=key:
#         msg="Their key is not same!"
#         print(msg)
#         break
# if msg==None:
#     print("All keys are same!")
# ---------------------------------------------------------

with open("scene_info.csv", mode="w", encoding="utf-8-sig", newline="") as file:
    # 需加newline=""避免csv檔多跳一行
    FN=key.copy()
    FN.remove("file")
    loc=copy.deepcopy(locations)#python的=為參考，並非複製；使用deepcopy深層複製為複製一份存至變數中
    writer=csv.DictWriter(file, fieldnames=FN)
    writer.writeheader()
    for where in loc:
        where.pop("file")
        writer.writerow(where)        

with open("scene_picture.csv", mode="w", encoding="utf-8-sig", newline="") as file:
    # 需加newline=""避免csv檔多跳一行
    FN=["_id", "file"]
    i=0
    writer=csv.writer(file)
    writer.writerow(FN)
    loc=copy.deepcopy(locations)#python的=為參考，並非複製；使用deepcopy深層複製為複製一份存至變數中
    for where in loc:
        pic=pictdata(where)
        index=where["_id"]
        for i in range(len(pic)):
            piclist=[index, pic[i]]
            writer.writerow(piclist)