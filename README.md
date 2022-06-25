# Taipei Day Trip Website 台北一日遊

## 網址
https://tour.yin888.info/

## 簡介
匯集台北的旅遊景點，導覽並深度解析各景點的特色。

## 功能
*  訪客
    *   景點資訊
    *   景點交通
*  會員
    *   景點導覽

## 網頁架構
![pic_web_framework](readme_pictures/web_framework.png)

## 使用工具
*   AWS
    *   EC2
    <br/>可擴展的運算容量，部署網頁應用程式。
    *   RDS
    <br/>雲端關聯式資料庫，此專案使用其中 MySQL 資料庫。
    *   S3
    <br/>雲端物件儲存，用於儲存景點資訊，避免浪費資料庫資源。
    *   CloudFront
    <br/>低延遲內容交付網路 ( CDN ) ，將資料儲存至全球各地的多個伺服器節點。
*   Python
    *   flask
    <br/>開發網頁應用框架。
    *   dotenv
    <br/>取用.env的資訊，避免洩漏私密資訊。
    *   mysql.connector.pooling
    <br/>使用連線池，有效利用資料庫資源。
    *   jwt
    <br/>保存會員登入狀態、身分認證及挾帶非私密的資料。
    *   boto3
    <br/>AWS 開發套件，上傳資料至 AWS S3 。
*   JavaScript
    <br/>網頁程式撰寫， DOM 控制。
*   API
    *   TapPay
    <br/>安全電子商務服務，金流服務API。 ( https://www.tappaysdk.com/zh/ )
*   Others
    *   Docker
    <br/>輕量級的虛擬化技術，跨平台部屬專案。
    *   nginx
    <br/>網頁伺服器，此專案應用其反向代理 ( Reverse Proxy ) 的功能。
    *   git
    <br/>版本控管工具。

## 問題解決
1. 問題：圖片儲存
    * 解決方案：
        - [ ] 123
        - [x] 456

2. 問題：垃圾桶能刪除對應的留言區塊
    * 尋找真因：
    <br/>刪除留言區塊後，留言區塊的索引 ( index ) 會變動，故不能依index刪除留言區塊。
    * 解決方案：
    <br/>留言板區塊設定無重複的id，利用id刪除特定留言區塊。