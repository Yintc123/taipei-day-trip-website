with open('env', mode='w', encoding='utf-8') as file:
    file.write("# mode\nMODE='production'\n\n")
    file.write("# tappay\ntappay_url='https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'\ntappay_partnerKey='partner_B1hrqhVq81G0pohSzqIlpyaRWtqRV5eWjNcBjpoXVmrJkBfrdo1pnv5k'\ntappay_merchantId='yin123_CTBC'\n\n")
    file.write("# jwt_key\nbooking_key='secret_key_for_booking'\nuser_key='secret_key_for_user'\n")
    
with open('env.develop', mode='w', encoding='utf-8') as file:
    file.write("# app\napp_host='127.0.0.1'\n\n")
    file.write("# mysql\nmysql_password='abc123456'\nmysql_port='3400'\n\n")
    file.write("# static\nhome_url='http://127.0.0.1:3000/'\n")
  
with open('env.production', mode='w', encoding='utf-8') as file:
    file.write("# app\napp_host='0.0.0.0'\n\n")
    file.write("# mysql\nmysql_password='AbC123456'\nmysql_port='3306'\n\n")
    file.write("# static\nhome_url='http://3.115.234.130:3000/'\n")
  