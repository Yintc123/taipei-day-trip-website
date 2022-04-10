console.log("hi")
// let booking="http://127.0.0.1:3000/booking";
// let url_thanks="http://127.0.0.1:3000/thankyou";
// let url_home="http://127.0.0.1:3000/";
// let url_attraction="http://127.0.0.1:3000/api/attraction/";
let booking="http://3.115.234.130:3000/booking";//EC2
let url_thanks="http://3.115.234.130:3000/thankyou";//EC2
let url_home='http://3.115.234.130:3000/';//EC2
let url_attraction="http://3.115.234.130:3000/api/attraction/";//EC2

//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    import("./sign_module.js").then(func => {
        func.get_user_info().then(user=>{
            if(user["data"]!=null){
                func.sign_in_view(user);
                show_order_info(user);  
            }else{
                window.location=url_home;
            }
        });

    });
}

function show_order_info(user){
    let order_text=document.getElementById("order_text");
    let order_user=document.getElementById("order_user");
    if(!get_order_number()){
        order_text.textContent="";
        order_user.textContent="以下為您的訂單：";
        import('./order_module.js').then(func=>{
            func.get_orders_by_id(user["data"]["id"]).then(result=>{
                for(index in result){
                    create_table_comp(result[index], index);
                }
                loading_finished(0);
                return result;
            });
        })
        return;
    }else{
        import('./order_module.js').then(func=>{
            func.get_order_info(get_order_number()).then(result=>{
                if(result["data"]["contact"]["email"]==user["data"]["email"]){
                    let order_number=document.getElementById("order_number");
                    order_number.textContent=get_order_number();
                }else{
                    order_user.textContent="查無近期的訂單";
                    order_text.textContent="";
                }
                show_user_name(user);
                loading_finished(1);
            });
        })
    }
}

function show_user_name(user){
    let user_name=document.getElementsByClassName("user_name");
    let greeting=document.getElementById("greeting");
    greeting.href=url_thanks;
    for(index in user_name){
        user_name[index].textContent=user["data"]["name"];
    }
}

function loading_finished(order_flag){
    let order_table=document.getElementById("order_table");
    let loading=document.querySelector(".loading");
    let order_user=document.querySelector("#order_user");
    let order_text=document.querySelector("#order_text");
    let order_text_p2=document.querySelector("#order_text_p2");
    if(order_flag==1){//代表查詢特定訂單頁面(/thankyou?number=)
        loading.style.display="none";
        order_user.style.display="block";
        order_text.style.display="block";
        order_text_p2.style.display="block";
    }else{//所有訂單畫面(/thankyou)
        loading.style.display="none";
        order_user.style.display="block";
        order_table.style.display="table";
    }
    
}

function create_table_comp(e, order_index){
    let order_table=document.getElementById("order_table");
    let tr=document.createElement("tr");
    let order_list=arrange_order_info(e, order_index);
    for(index in order_list){
        let td=document.createElement("td");
        td.textContent=order_list[index];
        tr.appendChild(td);
    }
    order_table.appendChild(tr);
}
//--------------------------------監聽事件-------------------------------//
let sign_in_or_up=document.getElementById("sign_in_or_up");
let background=document.getElementById("background");
let close_sign=document.getElementById("close_sign");
let sign=document.getElementById("sign");
let sign_button=document.getElementById("sign_button");
let switch_sign_up=document.getElementById("click_sign_up");
let schedule=document.getElementById("schedule");

sign_in_or_up.addEventListener("click", function(){
    import("./sign_module.js").then(func => {
        if(sign_in_or_up.textContent=="登出系統"){
            func.delete_sign().then(()=>{
                window.location=document.referrer;//退回上一頁
            });
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
        window.location=booking;
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
    for(index in order_list){
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