console.log("hi");

import {url} from './package.js';

const url={
    "develop":{
        'url_home':'http://127.0.0.1:3000/',
        'url_attraction':'http://127.0.0.1:3000/attraction/',
        'url_booking':'http://127.0.0.1:3000/booking',
        'url_thanks':'http://127.0.0.1:3000/thankyou',
        'url_api_attraction':'http://127.0.0.1:3000/api/attraction/',
        'url_api_attraction_keyword':'http://127.0.0.1:3000/api/attractions?keyword='
    },
    "production":{
        'url_home':'http://3.115.234.130:3000/',
        'url_attraction':'http://3.115.234.130:3000/attraction/',
        'url_booking':'http://3.115.234.130:3000/booking',
        'url_thanks':'http://3.115.234.130:3000/thankyou',
        'url_api_attraction':'http://3.115.234.130:3000/api/attraction/',
        'url_api_attraction_keyword':'http://3.115.234.130:3000/api/attractions?keyword='
    }
}

// const env='develop';
const env='production';

let url_api_attraction_keyword=url[env]["url_api_attraction_keyword"];
let url_booking=url[env]["url_booking"];
let url_attraction=url[env]["url_attraction"];

let nextpage=null;
let keyword="";
let flag=0;//避免重複讀取資料的旗幟；0：可執行程式；1：程式未執行完，不可再執行程式
let user_status=0;

//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){//網頁初始化
    import('./attraction_module.js').then(func=>{
        func.get_data(url_api_attraction_keyword).then(result=> {
            create_content(result);//處理畫面
            import("./sign_module.js").then(func=>{
                func.get_user_info().then(user=>{
                    if(user["data"]!=null){//確認使用者登入狀況
                        func.sign_in_view(user);
                        user_status=1;
                    }else{
                        func.sign_out_view();
                        user_status=0;
                    }
                })
            })
        }).then(()=>{
            //IntersectionObserver是「非同步」觸發，「相交與否」為一個瞬間，
            //不會有不斷疊加的狀態，所以也就不會發生連續觸發導致的效能問題，
            //也就是說儘管非常快速的來回捲動，它也不會將事件合併。
            let observer=new IntersectionObserver(entries => {
                if(entries[0].intersectionRatio <= 0 || nextpage==undefined || flag==1) return;//當目標物出現於螢幕的比例<0就return
                flag=1;
                let nextpage_url=url_api_attraction_keyword+keyword+"&page="+nextpage;//當目標物出現於螢幕上開始執行以下程式碼
                func.get_data(nextpage_url).then(result => {
                    create_content(result);//處理畫面
                    flag=0;
                })        
            });
            let footer=document.querySelector(".footer h4");
            observer.observe(footer);
        });
    })
}

function create_oneitem(data){
    let item=document.createElement("div");
    let img=document.createElement("img");
    let attraction=document.createElement("h4");
    let intro=document.createElement("div");
    let mrt=document.createElement("h4");
    let category=document.createElement("h4");
    let id_url=document.createElement("a");
    item.className="item";
    intro.className="intro";
    mrt.className="left";
    category.className="right";
    attraction.className="attraction_intro";
    img.src=get_imge(data["images"]);
    attraction.textContent=data["name"];
    mrt.textContent=data["MRT"];
    category.textContent=data["category"];
    id_url.href=url_attraction+data["id"];
    if (attraction.textContent.length>15){
        attraction.style.fontSize="15px";
    }
    id_url.appendChild(img);
    id_url.appendChild(attraction);
    intro.appendChild(mrt);
    intro.appendChild(category);
    item.appendChild(id_url);
    item.appendChild(intro);
    return item;
}

async function create_content(data){
    let content=document.querySelector(".content");
    nextpage=data["nextPage"];
    if(data["error"]!=null){
        let error=document.createElement("h4");
        error.textContent=data["message"];
        error.style.color="red";
        content.appendChild(error);
    }else{
        for(let i=0;i<data["data"].length;i++){
            content.appendChild(create_oneitem(data["data"][i])); 
        }
    }
}

function clean_content(){
    let content=document.querySelector(".content");
    while(content.firstChild){//刪除content的所有子節點
        content.removeChild(content.firstChild);
    }
}
//--------------------------------監聽事件-------------------------------//
let button=document.getElementById("button");
let sign_in_or_up=document.getElementById("sign_in_or_up");
let background=document.getElementById("background");
let close_sign=document.getElementById("close_sign");
let sign=document.getElementById("sign");
let sign_button=document.getElementById("sign_button");
let switch_sign_up=document.getElementById("click_sign_up");
let schedule=document.getElementById("schedule");

window.addEventListener("keyup", function(e){//放開鍵盤剎那，觸發該事件
    let search=document.getElementById("search");
    let password=document.getElementsByName("password")[0];
    let isFocused=document.activeElement===search;//判斷游標是否在輸入框
    if(isFocused && (e.code=="Enter" || e.code=="NumpadEnter")){
        button.click();
    }else if(document.activeElement===password && (e.code=="Enter" || e.code=="NumpadEnter")){
        sign_button.click();
    }
});

button.addEventListener("click", () => {
    keyword=search_attraction();
    let specific_attraction_url=url_api_attraction_keyword+keyword;
    import('./attraction_module.js').then(func=>{
        func.get_data(specific_attraction_url).then(result => {
            nextpage=result["nextPage"];
            clean_content();
            create_content(result);
            flag=0;
        });
    })
    // let specific_attraction_data=get_data(specific_attraction_url);
    // specific_attraction_data.then(result => {
    //     nextpage=result["nextPage"];
    //     clean_content();
    //     create_content(result);
    //     flag=0;
    // });
})


sign_in_or_up.addEventListener("click", function(){
        import("./sign_module.js").then(func => {
            if(sign_in_or_up.textContent=="登出系統"){
                func.delete_sign().then(result=>{
                    window.location=window.location.href;
                })
            }else{
                func.init_sign_in()
                background.style.display="block";
                sign.style.display="block";
            } 
        })
        
});

background.addEventListener("click", function(){
    background.style.display="none";
    sign.style.display="none";
})

close_sign.addEventListener("click", function(){
    background.style.display="none";
    sign.style.display="none";
})

sign_button.addEventListener("click", function(){
    if(sign_button.textContent=="登入帳戶"){
        import("./sign_module.js").then(func => {
            func.SignIn();
        })
    }else{
        import("./sign_module.js").then(func => {
            func.create_user();
        })
    } 
})

switch_sign_up.addEventListener("click", function(){
    import("./sign_module.js").then(func => {
        if(switch_sign_up.textContent=="點此註冊"){
            func.init_sign_up()
        }else{
            func.init_sign_in()
        }
    })
})

schedule.addEventListener("click", function(){
    if(user_status==0){
        sign_in_or_up.click();
    }else{
        window.location=url_booking;
    }
})
//--------------------------------處理data(M)-------------------------------//
// async function get_data(url_api_attraction_keyword){
//     return await fetch(url_api_attraction_keyword).then((response) => {
//         return response.json();
//     }).then((result) => {
//         return result;
//     })
// }

function get_imge(images){
    count=images.length;
    index=Math.floor(Math.random()*count);
    return images[index];
}

function search_attraction(){
    let search=document.getElementById("search");
    attraction=search.value;
    attraction=attraction.replace(/\s*/g, "");// 將多餘的空格去除
    search.value="";//查詢後清除輸入欄
    return attraction;
}
//-------------------------------------Run----------------------------------------
init();