# Taipei Day Trip Website 台北一日遊

## 網址
https://message-board.yin888.info/

## 簡介
留下想分享訊息及圖片。

## 功能
*  訪客
    *   匿名
    *   暱稱
*  留言
    *   訊息
    *   圖片 ( 圖片格式 png, jpeg )
    *   刪除留言

## 網頁架構
![pic_web_framework](readme_pictures/mb_web_framework.png)

## 使用工具
*   AWS
    *   EC2
    <br/>可擴展的運算容量，部署網頁應用程式。
    *   RDS
    <br/>雲端關聯式資料庫，此專案使用其中 MySQL 資料庫。
    *   S3
    <br/>雲端物件儲存，用於儲存留言圖片，避免浪費資料庫資源。
    *   CloudFront
    <br/>低延遲內容交付網路 ( CDN ) ，將資料儲存至全球各地的多個伺服器節點。
    *   Amazon Machine Image ( AMI )
    <br/>AWS 提供技術支援並維護的映像，此專案用於複製 EC2 作為 Load Balancer導流的對象。
    *   Application Load Balancer
    <br/>適合處理 HTTP 與 HTTPS 流量的負載平衡，分散流量減輕 EC2 負擔。
*   Python
    *   flask
    <br/>開發網頁應用框架。
    *   dotenv
    <br/>取用.env的資訊，避免洩漏私密資訊。
    *   mysql.connector.pooling
    <br/>使用連線池，有效利用資料庫資源。
*   JavaScript
    <br/>網頁程式撰寫， DOM 控制。
*   Others
    *   Docker
    <br/>輕量級的虛擬化技術，跨平台部屬專案。
    *   nginx
    <br/>網頁伺服器，此專案應用其反向代理 ( Reverse Proxy ) 的功能。
    *   git
    <br/>版本控管工具。

## 問題解決
1. 問題：留言排序由新到舊，最新的留言置頂
    * 尋找真因：
    <br/>新增的留言區塊會自動置底。
    * 解決方案：
    <br/>留言板區塊的 display 設定為 flex ，每次新增留言時將先前留言區塊的 order 增加 1 單位。

2. 問題：垃圾桶能刪除對應的留言區塊
    * 尋找真因：
    <br/>刪除留言區塊後，留言區塊的索引 ( index ) 會變動，故不能依index刪除留言區塊。
    <br/><img src="readme_pictures/example1.png" width="500px">
    * 解決方案：
    <br/>留言板區塊設定無重複的id，利用id刪除特定留言區塊。