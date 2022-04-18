console.log("hi")
import {url_mode} from './module/package.js';

const url_booking=url_mode['url_booking'];
const url_thanks=url_mode['url_thanks'];
const url_home=url_mode['url_home'];
const url_attraction=url_mode['url_attraction'];
const url_member=url_mode['url_member'];

document.title="";
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    import("./module/sign_module.js").then(func => {
        func.get_user_info().then(user=>{
            if(user["data"]!=null){
                func.sign_in_view(user);
                func.get_user_img(user["data"]["id"]);
                show_order_info(user);  
            }else{
                window.location=url_home;
            }
        });

    });
}

function show_order_info(user){
    const order_text=document.getElementById("order_text");
    const order_user=document.getElementById("order_user");
    if(!get_order_number()){//query string沒帶order number，畫面顯示歷史訂單
        document.title="歷史訂單";
        order_text.textContent="";
        order_user.textContent="以下為您的訂單：";
        import('./module/order_module.js').then(func=>{
            func.get_orders_by_id(user["data"]["id"]).then(result=>{
                const order_text_p2=document.querySelector("#order_text_p2");
                order_text_p2.textContent="點擊訂單編號查詢訂單詳細內容";
                for(let index in result){
                    create_table_comp(result[index], index);
                }
                show_order_history_or_current_order(0);
                return result;
            });
        })
        return;
    }else{
        import('./module/order_module.js').then(func=>{
            func.get_order_info(get_order_number()).then(result=>{
                if(result["data"] && result["data"]["contact"]["email"]==user["data"]["email"]){
                    const order_number=document.getElementById("order_number");
                    order_number.textContent=get_order_number();
                    show_user_name(user);
                }else{
                    order_user.textContent="查無近期的訂單";
                    order_text.textContent="";
                }
                document.title="此次訂單";
                show_order_history_or_current_order(1);
                show_order_text();
            });
        })
    }
}

function show_user_name(user){
    const user_name=document.getElementsByClassName("user_name")[0];
    user_name.textContent=user["data"]["name"];
}

function show_order_text(){
    const greeting=document.getElementById("greeting");
    greeting.textContent="訂單";
    greeting.href=url_thanks;
}

function show_order_history_or_current_order(order_flag){
    const order_table=document.getElementById("order_table");
    const loading=document.querySelector(".loading");
    const order_user=document.querySelector("#order_user");
    const order_text=document.querySelector("#order_text");
    const order_text_p2=document.querySelector("#order_text_p2");
    if(order_flag==1){//代表查詢特定訂單頁面(/thankyou?number=)
        order_text.style.display="block";
    }else{//所有訂單畫面(/thankyou)
        order_table.style.display="table";
    }
    order_user.style.display="block";
    order_text_p2.style.display="block";
    loading.style.display="none";
}

function create_table_comp(e, order_index){
    const order_table=document.getElementById("order_table");
    const tr=document.createElement("tr");
    const order_list=arrange_order_info(e, order_index);
    let hidden=["2", "4", "6", "7"];// hide columns in phones mode
    for(let index in order_list){
        const td=document.createElement("td");
        if(index==1){
            let query_order_number="?ordernumber=";
            const a=document.createElement("a");
            a.textContent=order_list[index];
            a.href=url_attraction+e["attraction_id"]+query_order_number+order_list[index];
            td.appendChild(a);
        }else{
            td.textContent=order_list[index];
        }
        if(hidden.indexOf(index)!=-1){ // list的index型別與list內元素相同
            td.className="order_hidden";
        }
        tr.appendChild(td);
    }
    order_table.appendChild(tr);
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
const background=document.getElementById("background");
const close_sign=document.getElementsByClassName("close_sign");
const sign=document.getElementById("sign");
const sign_button=document.getElementById("sign_button");
const switch_sign_up=document.getElementById("click_sign_up");
const schedule=document.getElementById("schedule");
const sign_in_img=document.getElementById("sign_in_img");
const sign_out=document.getElementById("sign_out");
const member_page=document.getElementById("member_page");

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
        window.location=url_booking;
})
//--------------------------------處理data(M)-------------------------------//
function get_order_number(){
    let order_number=window.location.href;
    if(window.location.href==url_thanks){
        return;
    }
    order_number=order_number.split("=")[1];
    return order_number;
}

function arrange_order_info(order_json, order_index){
    let order_list=["id", "order_number", "attraction", "trip_date", "trip_time", "price", "order_status", "time"];
    for(let index in order_list){
        if(index==0){
            order_index++;
            order_list[index]=order_index;
            continue;
        }
        order_list[index]=order_json[order_list[index]];
    }
    if(order_json["price"]==2000){
        order_list[4]="早上9點到下午4點";
    }else{
        order_list[4]="下午4點到晚上9點";
    }
    return order_list;
}
//-------------------------------------Run----------------------------------------
init();