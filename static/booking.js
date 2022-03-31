console.log("hi");
// let url_home='http://127.0.0.1:3000/';
// let url="http://127.0.0.1:3000/api/attraction/";
let url_home='http://3.115.234.130:3000/';//EC2
let url="http://3.115.234.130:3000/api/attraction/";//EC2
let user_status=0;
let last_page=document.referrer != window.location.href ? document.referrer : url_home;

//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    import("./sign_module.js").then(func=>{
        console.log("1");
        func.get_user_info().then(user=>{
            if(user["data"]!=null){
                func.sign_in_view(user);
                load_user(user);
                load_user_info(user);
                user_status=1;
            }else{
                console.log("2");
                user_status=0;
                window.location=last_page;
            }
        })
    });
    import("./booking_module.js").then(func=>{
        console.log("3");
        func.get_booking().then(data=>{
            if(data==null){
                console.log("4");
                console.log(data);
                without_booking();
            }else{
                console.log(data);
                load_booking_info(data);
                load_total_cost(data);
            }
        });
    })
}
function load_user(user){
    let user_name=document.getElementById("user_name");
    user_name.textContent=user["data"]["name"];
}
function load_image(data){
    let img=document.querySelector(".attraction_img");
    img.style.backgroundImage="url('"+data["attraction"]["image"]+"')";
}
function load_booking_info(data){
    let tour_name=document.getElementById("tour_name");
    let tour_date=document.getElementById("tour_date");
    let tour_time=document.getElementById("tour_time");
    let tour_cost=document.getElementById("tour_cost");
    let tour_adrs=document.getElementById("tour_adrs");
    tour_name.textContent=data["attraction"]["name"];
    tour_date.textContent=data["date"];
    tour_cost.textContent=data["price"];
    tour_adrs.textContent=data["attraction"]["address"];
    if(data["time"]=="上半天"){
        tour_time.textContent="早上9點到下午4點";
    }else{
        tour_time.textContent="下午4點到晚上9點";
    }
    load_image(data);
}

function load_user_info(user){
    let user_name=document.getElementById("name");
    let user_email=document.getElementById("email");
    user_name.value=user["data"]["name"];
    user_email.value=user["data"]["email"];
}

function load_total_cost(data){
    let total_cost=document.getElementById("total_cost");
    total_cost.textContent=data["price"];
}

function without_booking(){
    let content_container_1=document.querySelector(".content_container_1");
    let container=document.createElement("div");
    let message=document.createElement("p");
    container.className="p_container";
    message.textContent="目前沒有任何待預定的行程";
    while(content_container_1.firstChild){
        content_container_1.removeChild(content_container_1.firstChild);
    }
    container.appendChild(message);
    content_container_1.appendChild(container);
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
let delete_tour=document.getElementById("delete_tour");

sign_in_or_up.addEventListener("click", function(){
    import("./sign_module.js").then(func => {
        if(sign_in_or_up.textContent=="登出系統"){
            func.delete_sign();
            window.location=document.referrer;//退回上一頁
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
    window.location=window.location.href;
})

delete_tour.addEventListener("click", function(){
    import("./booking_module.js").then(func=>{
        func.delete_booking();
    });
})
//-------------------------------------Run----------------------------------------
init();