from urllib.request import urlopen, Request
import json

url_tappay="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"

headers={
        "Content-Type": "application/json",
        "x-api-key":"partner_B1hrqhVq81G0pohSzqIlpyaRWtqRV5eWjNcBjpoXVmrJkBfrdo1pnv5k"
    }

creditcard_info={
        "prime":"test_3a2fb2b7e892b914a03c95dd4dd5dc7970c908df67a49527c0a648b2bc9",
        "partner_key":"partner_B1hrqhVq81G0pohSzqIlpyaRWtqRV5eWjNcBjpoXVmrJkBfrdo1pnv5k",
        "merchant_id": "yin123_CTBC",
        "details":"TapPay Test",
        "amount": 100,
        "cardholder": {
            "phone_number": "+886923456789",
            "name": "王小明",
            "email": "LittleMing@Wang.com",
            "zip_code": "100",
            "address": "台北市天龍區芝麻街1號1樓",
            "national_id": "A123456789"
        },
        "remember": True
    }

class connect_to_tappay_api():
    def __init__(self, prime):
        global creditcard_info # 使用 global 關鍵字將變數宣告為全域性變數
        creditcard_info.update({"prime":prime})
    
    def load_visa_info(self, amount, phone_number, name, email):
        global creditcard_info # 使用 global 關鍵字將變數宣告為全域性變數
        creditcard_info["amount"]=amount
        creditcard_info["cardholder"]["phone_number"]=phone_number
        creditcard_info["cardholder"]["name"]=name
        creditcard_info["cardholder"]["email"]=email
    
    def calls_api(self, amount, phone_number, name, email):
        global creditcard_info # 使用 global 關鍵字將變數宣告為全域性變數
        self.load_visa_info(amount, phone_number, name, email)
        creditcard=creditcard_info
        creditcard=json.dumps(creditcard)
        CUS_as_bytes=creditcard.encode("utf-8") # needs to be bytes
        req=Request(url_tappay, CUS_as_bytes, headers)
        with urlopen(req) as response:
            resp=json.load(response)
        payment_result={}
        if resp["status"]==0:
            payment_result["status"]=resp["status"]
            payment_result["message"]="付款成功"
        else:
            payment_result["error"]=True
            payment_result["status"]=resp["status"]
            payment_result["message"]=resp["msg"]
        return payment_result