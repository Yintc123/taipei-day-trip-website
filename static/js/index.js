console.log("hi!");
import {url_mode} from './module/package.js';

const url_api_attraction_keyword=url_mode["url_api_attraction_keyword"];
const url_booking=url_mode["url_booking"];
const url_attraction=url_mode["url_attraction"];
const url_member=url_mode['url_member'];

let nextpage=null;
let keyword="";
let flag=0;//避免重複讀取資料的旗幟；0：可執行程式；1：程式未執行完，不可再執行程式
let user_status=0;
document.title="台北一日遊";
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){//網頁初始化
    import('./module/attraction_module.js').then(func=>{
        func.get_attraction_data(url_api_attraction_keyword).then(result=> {
            create_content(result);//處理畫面
            import("./module/sign_module.js").then(func=>{
                func.get_user_info().then(user=>{
                    if(user["data"]!=null){//確認使用者登入狀況
                        func.sign_in_view(user);
                        func.get_user_img(user["data"]["id"]);
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
                func.get_attraction_data(nextpage_url).then(attraction_data => {
                    create_content(attraction_data);//處理畫面
                    flag=0;
                })        
            });
            let footer=document.querySelector(".footer h4");
            observer.observe(footer);
        });
    })
}

function create_oneitem(data){
    const item=document.createElement("div");
    const img=document.createElement("img");
    const attraction=document.createElement("h4");
    const intro=document.createElement("div");
    const mrt=document.createElement("h4");
    const category=document.createElement("h4");
    const id_url=document.createElement("a");
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

function create_content(data){
    const content=document.querySelector(".content");
    nextpage=data["nextPage"];
    if(data["error"]!=null){
        const error=document.createElement("h4");
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
    const content=document.querySelector(".content");
    while(content.firstChild){//刪除content的所有子節點
        content.removeChild(content.firstChild);
    }
}

function call_member_page(swch){
    const sign_out_or_member=document.getElementsByClassName("sign_out_or_member")[0];
    if(swch==1){
        sign_out_or_member.style.display="block";
    }else{
        sign_out_or_member.style.display="none";
    }   
}
//--------------------------------監聽事件-------------------------------//
const search_keyword_button=document.getElementById("search_keyword_button");
const sign_in_or_up=document.getElementById("sign_in_or_up");
const background=document.getElementById("background");
const close_sign=document.getElementsByClassName("close_sign");
const sign=document.getElementById("sign");
const sign_button=document.getElementById("sign_button");
const switch_sign_up=document.getElementById("click_sign_up");
const schedule=document.getElementById("schedule");
const sign_in_img=document.getElementById("sign_in_img");
const sign_out=document.getElementById("sign_out");
const member_page=document.getElementById("member_page");

window.addEventListener("keyup", function(e){//放開鍵盤剎那，觸發該事件
    const search=document.getElementById("search");
    const password=document.getElementsByName("password")[0];
    let isFocused=document.activeElement===search;//判斷游標是否在輸入框
    if(isFocused && (e.code=="Enter" || e.code=="NumpadEnter")){
        search_keyword_button.click();
    }else if(document.activeElement===password && (e.code=="Enter" || e.code=="NumpadEnter")){
        sign_button.click();
    }
});

search_keyword_button.addEventListener("click", () => {
    keyword=search_attraction();
    let specific_attraction_url=url_api_attraction_keyword+keyword;
    import('./module/attraction_module.js').then(func=>{
        func.get_attraction_data(specific_attraction_url).then(attraction_data => {
            nextpage=attraction_data["nextPage"];
            clean_content();
            create_content(attraction_data);
            flag=0;
        });
    })
})


sign_in_or_up.addEventListener("click", function(){
    import("./module/sign_module.js").then(func => {
        func.init_sign_in()
        background.style.display="block";
        sign.style.display="block";
    })
    
});

sign_in_img.addEventListener("click", function(){
    background.style.display="block";
    call_member_page(1);
})

sign_out.addEventListener("click", function(){
    import("./module/sign_module.js").then(func => {
        func.delete_sign().then(result=>{
            window.location=window.location.href;
        })
    })
})

member_page.addEventListener("click", function(){
    window.location=url_member;
})


background.addEventListener("click", function(){
    background.style.display="none";
    sign.style.display="none";
    call_member_page(0);
})

for(let i=0;i<close_sign.length;i++){
    close_sign[i].addEventListener("click", function(){
        background.style.display="none";
        sign.style.display="none";
        call_member_page(0);
    })
}

sign_button.addEventListener("click", function(){
    if(sign_button.textContent=="登入帳戶"){
        import("./module/sign_module.js").then(func => {
            func.SignIn();
        })
    }else{
        import("./module/sign_module.js").then(func => {
            func.create_user();
        })
    } 
})

switch_sign_up.addEventListener("click", function(){
    import("./module/sign_module.js").then(func => {
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
function get_imge(images){
    let count_img=images.length;
    let index_img=Math.floor(Math.random()*count_img);
    return images[index_img];
}

function search_attraction(){
    const search=document.getElementById("search");
    let attraction=search.value;
    attraction=attraction.replace(/\s*/g, "");// 將多餘的空格去除
    search.value="";//查詢後清除輸入欄
    return attraction;
}
//-------------------------------------Run----------------------------------------
init();