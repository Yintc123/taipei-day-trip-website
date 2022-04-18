console.log("hi");

import {url_mode} from './module/package.js';

const url_home=url_mode['url_home'];
const url_api_attraction=url_mode['url_api_attraction'];
const url_attraction=url_mode['url_attraction'];
const url_booking=url_mode['url_booking'];
const url_member=url_mode['url_member'];

const last_img=document.getElementById("last_one");
const next_img=document.getElementById("next_one");
const tour_time=document.getElementsByName("time");
let attraction_data=null;
let img_index=0;
let cur_url=window.location.href;
let id=cur_url.split("/")[4];
let user_status=0;
let booking_flag=0;
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    if(window.location.href.indexOf("?")){//檢查網頁是否有帶query string
        id=id.split("?")[0];
    }
    let url_id=url_api_attraction+id;
    import('./module/attraction_module.js').then(func=>{
        func.get_attraction_data(url_id).then((result)=>{
            attraction_data=result["data"];
            document.title=attraction_data["name"];//網頁標題
            if(attraction_data==undefined){//網頁偵錯
                // window.history.go(-1);//回上一頁
                window.location=url_home;//回首頁
            }
            import("./module/sign_module.js").then(func=>{
                func.get_user_info().then(user => {
                    if(user["data"]!=null){//確認使用者登入狀況
                        user_status=1;
                        func.sign_in_view(user);
                        func.get_user_img(user["data"]["id"]);
                        // show_booking_info(user);
                    }else{
                        func.sign_out_view();
                        user_status=0;
                    }
                    show_booking_info(user);
                    show_image(attraction_data, img_index);
                    show_attraction_title(attraction_data);
                    show_attraction_introduction(attraction_data);
                    complete_init();
                });
            })
        })
    })
}

function show_image(data, index){
    const image_frame=document.querySelector(".image");
    if(data["images"].length==1){//僅有一張照片就不顯示圓點及左右按鈕
        image_frame.style.backgroundImage="url('"+get_image(data["images"], index)+"')";
        while(image_frame.firstChild){
            image_frame.removeChild(image_frame.firstChild);
        }
    }else{
        image_frame.style.backgroundImage="url('"+get_image(data["images"], index)+"')";
        show_image_index(data, index);
    }
}

function show_attraction_title(data){
    const attraction_name=document.querySelector(".name");
    const attraction_cat=document.querySelector(".cat");
    const attraction_MRT=document.querySelector(".MRT");
    attraction_name.textContent=data["name"];
    attraction_cat.textContent=data["category"];
    attraction_MRT.textContent=data["MRT"];
}

function show_attraction_introduction(data){
    const attraction_intro=document.querySelector(".intro");
    const attraction_address=document.querySelector(".address");
    const attraction_transport=document.querySelector(".transport");
    attraction_intro.textContent=data["description"];
    attraction_address.textContent=data["address"];
    attraction_transport.textContent=data["transport"];
}

function show_image_index(data, index){
    const index_frame=document.querySelector(".image_index");
    while(index_frame.firstChild){
        index_frame.removeChild(index_frame.firstChild);
    }
    let images=[];
    for(let i=0;i<data["images"].length;i++){
        images[i]=document.createElement("img");
        if(i==index){
            images[i].src="/static/icon/circle_current_b.png";
        }else{
            images[i].src="/static/icon/circle_current_w.png";
        }
        index_frame.appendChild(images[i]);
    }
}

function show_tour_cost(order_data){
    const cost=document.getElementById("cost");
    if(order_data==null){
        if(tour_time[0].checked){
            cost.textContent="新台幣 " + "2000" + " 元";
        }else{
            cost.textContent="新台幣 " + "2500" + " 元";
        } 
    }else{
        cost.textContent="新台幣 " + order_data["data"]["price"] + " 元";
    }     
}

function show_tour_date(order_data){
    const calendar=document.getElementById("calendar");
    if(order_data==null){
        let date=new Date();
        let day=date.getDate();
        let month=date.getMonth()+1;
        let year=date.getFullYear();
        if(month<10){
            month="0"+month;
        }
        if(day<10){
            day="0"+day;
        }
        calendar.value=year+"-"+month+"-"+day;
        calendar.min=calendar.value;
        calendar.style.display="inline-block";
    }else{
        const order_date=document.getElementById("order_date");
        order_date.textContent=order_data["data"]["trip"]["date"];
        order_date.style.display="inline-block";
    }
}

function show_order_time(order_data){
    const label_tour_time=document.getElementsByClassName("label_tour_time")[0];
    const booking_button=document.getElementById("booking_button");
    const order_time=document.getElementById("order_time");
    if(order_data==null){
        label_tour_time.style.display="inline-block";
        booking_button.style.display="inline-block";
    }else{
        order_time.textContent=order_data["data"]["trip"]["time"];
        order_time.style.display="inline-block";
    }
}

function show_loading_for_booking(swch){
    const booking_button_text=document.getElementById("booking_button_text");
    const loading=document.getElementById("lds-ellipsis");
    if (swch==1){
        booking_button_text.style.display="none";
        loading.style.display="inline-block";
    }else{
        loading.style.display="none";
        booking_button_text.style.display="block";
    }
}

function complete_init(){
    const loading=document.getElementById("loading_for_init");
    const cloth=document.getElementById("cloth");
    loading.style.display="none";
    cloth.style.display="none";
}

function show_rest_order_info(order_data){
    const h5_order=document.getElementsByClassName("h5_order");
    const span_order_number=document.getElementById("span_order_number");
    const span_order_status=document.getElementById("span_order_status");
    const span_order_time=document.getElementById("span_order_time");
    for (let i=0;i<h5_order.length;i++){
        h5_order[i].style.display="block";
    }
    span_order_number.textContent=order_data["data"]["number"];
    span_order_time.textContent=order_data["data"]["order_time"];
    if(order_data["data"]["status"]==1){
        span_order_status.textContent="下單成功";
    }else{
        span_order_status.textContent="下單失敗";
    }
}

function show_booking_info(user){
    const order_number=get_order_number();
    if(order_number!=null){
        import("./module/order_module.js").then(func=>{
            func.get_order_info(order_number).then(result=>{
                if(result["data"]==null || user["data"]["email"]!=result["data"]["contact"]["email"]){
                    window.location=url_attraction+id.split("?")[0];
                }
                show_tour_date(result);
                show_order_time(result);
                show_tour_cost(result);
                show_rest_order_info(result);
            })
        })
    }else{
        show_tour_date(null);
        show_order_time(null);
        show_tour_cost(null);
    }
}

function call_member_page(swch){
    let sign_out_or_member=document.getElementsByClassName("sign_out_or_member")[0];
    if(swch==1){
        sign_out_or_member.style.display="block";
    }else{
        sign_out_or_member.style.display="none";
    }   
}
//--------------------------------監聽事件-------------------------------//
let sign_in_or_up=document.getElementById("sign_in_or_up");
let background=document.getElementById("background");
let close_sign=document.getElementsByClassName("close_sign");
let sign_button=document.getElementById("sign_button");
let switch_sign_up=document.getElementById("click_sign_up");
let booking_button=document.getElementById("booking_button");
let schedule=document.getElementById("schedule");
let sign_in_img=document.getElementById("sign_in_img");
let sign_out=document.getElementById("sign_out");
let member_page=document.getElementById("member_page");

window.addEventListener("keyup", function(e){//放開鍵盤剎那，觸發該事件
    let password=document.getElementsByName("password")[0];
    if(document.activeElement===password && (e.code=="Enter" || e.code=="NumpadEnter")){
        sign_button.click();
    }
});

tour_time.forEach(time => {//依input的物件創造兩個"change"監聽事件
    time.addEventListener("change", function(){
        show_tour_cost(null);
    });
})

booking_button.addEventListener("click", function(){
    show_loading_for_booking(1);
    if(user_status==0){
        booking_flag=1;
        sign_in_or_up.click();
        show_loading_for_booking(0);
    }else{
        if(get_order_number()){//帶有query string的狀態下直接return
            booking_flag=0;
            show_loading_for_booking(0);
            window.location=window.location.href;
            return;
        }
        import("./module/booking_module.js").then(func => {
            func.booking_tour(id).then(result=>{
                window.location=url_booking;
                show_loading_for_booking(0);
                return result;
            })
        });
    }
})

last_img.addEventListener("click", function(){
    timer.reset(5000);
    img_index--;
    let count=attraction_data["images"].length;
    if(img_index<0){
        img_index=count-1;
    }
    show_image(attraction_data, img_index);
});

next_img.addEventListener("click", function(){
    timer.reset(5000);
    img_index++;
    let count=attraction_data["images"].length;
    if(img_index>count-1){
        img_index=0;
    }
    show_image(attraction_data, img_index);
});

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
    booking_flag=0;
    background.style.display="none";
    sign.style.display="none";
    call_member_page(0);
})

for(let i=0;i<close_sign.length;i++){
    close_sign[i].addEventListener("click", function(){
        booking_flag=0;
        background.style.display="none";
        sign.style.display="none";
        call_member_page(0);
    })
}

sign_button.addEventListener("click", function(){
    if(sign_button.textContent=="登入帳戶"){
        import("./module/sign_module.js").then(func => {
            func.SignIn(booking_flag).then((result)=>{
                if(result["error"]==true){
                    return ;
                }else if(booking_flag>0){
                    user_status=1;
                    booking_button.click();
                }
            });
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
function get_image(image, index){
    return image[index];
}

function my_timer(t){
    let timer_obj=setInterval(function(){
        img_index++;
        let count=attraction_data["images"].length;
        if(img_index>count-1){
            img_index=0;
        }
        show_image(attraction_data, img_index);
    }, t)
    this.stop=function(){
        if(timer_obj){
            clearInterval(timer_obj);
            timer_obj=null;
        }
        return this;
    }
    this.start=function(){
        if(!timer_obj){
            this.stop();
            timer_obj=setInterval(function(){
                img_index++;
                let count=attraction_data["images"].length;
                if(img_index>count-1){
                    img_index=0;
                }
                show_image(attraction_data, img_index);
            }, t)
        }
        return this;
    }
    this.reset=function(new_timer){
        t=new_timer;
        return this.stop().start();
    }
}

function get_order_number(){
    let order_number=window.location.href;
    if(window.location.href.indexOf("ordernumber")!=-1){
        order_number=order_number.split("=")[1];
        return order_number;
    }else{
        return null;
    }
}
//-------------------------------------Run----------------------------------------
init();

let timer=new my_timer(5000);