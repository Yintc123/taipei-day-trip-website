console.log("hi");
// let url_home='http://127.0.0.1:3000/';
// let url_api_attraction="http://127.0.0.1:3000/api/attraction/";
// let booking="http://127.0.0.1:3000/booking";
let url_home='http://3.115.234.130:3000/';//EC2
let url_api_attraction="http://3.115.234.130:3000/api/attraction/";//EC2
let url_attraction="http://3.115.234.130:3000/attraction/";//EC2
let booking="http://3.115.234.130:3000/booking";//EC2
let last=document.getElementById("last_one");
let next=document.getElementById("next_one");
let tour_time=document.getElementsByName("time");
let data=null;
let img_index=0;
let cur_url=window.location.href;
let id=cur_url.split("/")[4];
let user_status=0;
let booking_flag=0;
let order_flag=0;
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    let url_id=url_api_attraction+id;
    fetch(url_id).then((response)=>{
        return response.json();
    }).then((result)=>{
        data=result["data"]
        if(data==undefined){//網頁偵錯
            // window.history.go(-1);//回上一頁
            window.location=url_home;//回首頁
        }
        import("./sign_module.js").then(func=>{
            func.get_user_info().then(user => {
                if(user["data"]!=null){//確認使用者登入狀況
                    func.sign_in_view(user);
                    let order_number=get_order_number();
                    console.log(order_flag);
                    if(order_number!=null){
                        import("./order_module.js").then(func=>{
                            func.get_order_info(order_number).then(result=>{
                                if(result["data"]["contact"]["email"]==user["data"]["email"]){
                                    set_date(result);
                                    get_order_time(result)
                                }else{
                                    window.location=url_attraction+result["data"]["trip"]["attraction"]["id"];
                                }
                            })
                        })
                        tour_cost();
                    }
                    user_status=1;
                }else{
                    func.sign_out_view();
                    user_status=0;
                }
                loading_for_ready(0);
            });
        })
        // get_order_number();
        // console.log(order_flag);
        load_image(data, img_index);
        load_book_info(data);
        load_attraction_info(data);
    })
}

function load_image(data, index){
    let image_frame=document.querySelector(".image");
    if(data["images"].length==1){//僅有一張照片就不顯示圓點及左右按鈕
        image_frame.style.backgroundImage="url('"+get_image(data["images"], index)+"')";
        while(image_frame.firstChild){
            image_frame.removeChild(image_frame.firstChild);
        }
    }else{
        image_frame.style.backgroundImage="url('"+get_image(data["images"], index)+"')";
        load_img_index(data, index);
    }
}

function load_book_info(data){
    let attraction_name=document.querySelector(".name");
    let attraction_cat=document.querySelector(".cat");
    let attraction_MRT=document.querySelector(".MRT");
    attraction_name.textContent=data["name"];
    attraction_cat.textContent=data["category"];
    attraction_MRT.textContent=data["MRT"];
    set_date(null);
    tour_cost(null);
}

function load_attraction_info(data){
    let attraction_intro=document.querySelector(".intro");
    let attraction_address=document.querySelector(".address");
    let attraction_transport=document.querySelector(".transport");
    attraction_intro.textContent=data["description"];
    attraction_address.textContent=data["address"];
    attraction_transport.textContent=data["transport"];
}

function load_img_index(data, index){
    let index_frame=document.querySelector(".image_index");
    while(index_frame.firstChild){
        index_frame.removeChild(index_frame.firstChild);
    }
    let images=[];
    for(let i=0;i<data["images"].length;i++){
        if(i==index){
            images[i]=document.createElement("img");
            images[i].src="/static/icon/circle_current_b.png";
            index_frame.appendChild(images[i]);
        }else{
            images[i]=document.createElement("img");
            images[i].src="/static/icon/circle_current_w.png";
            index_frame.appendChild(images[i]);
        }
    }
}

function tour_cost(data){
    let cost=document.getElementById("cost");
    if(data==null){
        if(tour_time[0].checked){
            cost.textContent="新台幣 " + "2000" + " 元";
        }else{
            cost.textContent="新台幣 " + "2500" + " 元";
        } 
    }else{
        cost.textContent="新台幣 " + data["data"]["price"] + " 元";
    }     
}

function set_date(data){
    let calendar=document.getElementById("calendar");
    if(data==null){
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
    }else{
        console.log("great");
        let order_date=document.getElementById("order_date");
        order_date.textContent=data["data"]["trip"]["date"];
        calendar.style.display="none";
        order_date.style.display="inline-block";
    }
    // let date=new Date();
    // let day=date.getDate();
    // let month=date.getMonth()+1;
    // let year=date.getFullYear();
    // if(month<10){
    //     month="0"+month;
    // }
    // if(day<10){
    //     day="0"+day;
    // }
    // calendar.value=year+"-"+month+"-"+day;
    // calendar.min=calendar.value;
}

function get_order_time(data){
    let label_tour_time=document.getElementsByClassName("label_tour_time");
    let order_time=document.getElementById("order_time");
    label_tour_time.style.display="none";
    order_time.textContent=data["data"]["trip"]["time"];
    order_time.style.display="inline-block";
}

function loading(swch){
    let booking_button_text=document.getElementById("booking_button_text");
    let loading=document.getElementById("lds-ellipsis");
    console.log(loading);
    if (swch==1){
        booking_button_text.style.display="none";
        loading.style.display="inline-block";
    }else{
        loading.style.display="none";
        booking_button_text.style.display="block";
    }
}

function loading_for_ready(swch){
    let loading=document.getElementById("loading_for_ready");
    if(swch==0){
        loading.style.display="none";
    }else{
        loading.style.display="block";
    }
}
//--------------------------------監聽事件-------------------------------//
let sign_in_or_up=document.getElementById("sign_in_or_up");
let background=document.getElementById("background");
let close_sign=document.getElementById("close_sign");
let sign_button=document.getElementById("sign_button");
let switch_sign_up=document.getElementById("click_sign_up");
let booking_button=document.getElementById("booking_button");
let schedule=document.getElementById("schedule");

window.addEventListener("keyup", function(e){//放開鍵盤剎那，觸發該事件
    let password=document.getElementsByName("password")[0];
    if(document.activeElement===password && (e.code=="Enter" || e.code=="NumpadEnter")){
        sign_button.click();
    }
});

tour_time.forEach(time => {//依input的物件創造兩個"change"監聽事件
    time.addEventListener("change", function(){
        tour_cost();
    });
})

booking_button.addEventListener("click", function(){
    loading(1);
    if(user_status==0){
        booking_flag=1;
        sign_in_or_up.click();
        loading(0);
    }
    else{
        import("./booking_module.js").then(func => {
            func.booking_tour(id).then(result=>{
                window.location=func.booking;
                loading(0);
                return result;
            })
        });
    }
})

last.addEventListener("click", function(){
    timer.reset(5000);
    img_index--;
    count=data["images"].length;
    if(img_index<0){
        img_index=data["images"].length-1;
    }
    load_image(data, img_index);
});

next.addEventListener("click", function(){
    timer.reset(5000);
    img_index++;
    count=data["images"].length;
    if(img_index>data["images"].length-1){
        img_index=0;
    }
    load_image(data, img_index);
});

sign_in_or_up.addEventListener("click", function(){
    import("./sign_module.js").then(func => {
        if(sign_in_or_up.textContent=="登出系統"){
            func.delete_sign().then(result=>{
                window.location=window.location.href;
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
    booking_flag=0;
})

close_sign.addEventListener("click", function(){
    background.style.display="none";
    sign.style.display="none";
    booking_flag=0;
})

sign_button.addEventListener("click", function(){
    if(sign_button.textContent=="登入帳戶"){
        import("./sign_module.js").then(func => {
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
        window.location=booking;
    }
})
//--------------------------------處理data(M)-------------------------------//
function get_image(image, index){
    return image[index];
}

function my_timer(t){
    let timer_obj=setInterval(function(){
        img_index++;
        count=data["images"].length;
        if(img_index>data["images"].length-1){
            img_index=0;
        }
        load_image(data, img_index);
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
                count=data["images"].length;
                if(img_index>data["images"].length-1){
                    img_index=0;
                }
                load_image(data, img_index);
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
        order_flag=1;
        return order_number;
    }else{
        return;
    }
}
//-------------------------------------Run----------------------------------------
init();

let timer=new my_timer(5000);