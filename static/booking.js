console.log("hi");

const url={
    "develop":{
        'url_home':'http://127.0.0.1:3000/',
        'url_attraction':'http://127.0.0.1:3000/attraction/',
        'url_booking':'http://127.0.0.1:3000/booking',
        'url_thanks':'http://127.0.0.1:3000/thankyou',
        'url_api_attraction':'http://127.0.0.1:3000/api/attraction/'
    },
    "production":{
        'url_home':'http://3.115.234.130:3000/',
        'url_attraction':'http://3.115.234.130:3000/attraction/',
        'url_booking':'http://3.115.234.130:3000/booking',
        'url_thanks':'http://3.115.234.130:3000/thankyou',
        'url_api_attraction':'http://3.115.234.130:3000/api/attraction/'
    }
}

// const env='develop';
const env='production';

let url_home=url[env]['url_home'];
let url_api_attraction=url[env]['url_api_attraction'];
let url_thanks=url[env]['url_thanks'];

// let url_home='http://127.0.0.1:3000/';
// let url_api_attraction="http://127.0.0.1:3000/api/attraction/";
// let url_thanks="http://127.0.0.1:3000/thankyou";
// let url_home='http://3.115.234.130:3000/';//EC2
// let url_api_attraction="http://3.115.234.130:3000/api/attraction/";//EC2
// let url_thanks="http://3.115.234.130:3000/thankyou";//EC2
let user_status=0;
// ------------------------------使用Tappay的SDK-----------------------------------
let confirmation_button=document.getElementById("confirmation_button");
// TPDirect.setupSDK 設定參數
app_key="app_K64GfXE4Bm18CcyVETTYS0e9PTZmjpVyBhGh6sHQaHiImNYSoJcGjvjM1OhT";
TPDirect.setupSDK(123996, app_key, 'sandbox');
// TPDirect.card.setup 設定外觀
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: '後三碼'
    }
}

let styles={
    // Style all elements
    'input': {
        'color': 'gray',
        'border': '1px solid'
    },
    // Styling ccv field
    'input.ccv': {
        // 'font-size': '16px'
    },
    // Styling expiration-date field
    'input.expiration-date': {
        // 'font-size': '16px'
    },
    // Styling card-number field
    'input.card-number': {
        // 'font-size': '16px'
    },
    // style focus state
    ':focus': {
        // 'color': 'black'
    },
    // style valid state
    '.valid': {
        'color': 'green'
    },
    // style invalid state
    '.invalid': {
        'color': 'red'
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    '@media screen and (max-width: 400px)': {
        'input': {
            'color': 'orange'
        }
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: styles
});
// TPDirect.card.onUpdate，得知目前卡片資訊的輸入狀態
TPDirect.card.onUpdate((update) => {
    let num_msg=document.getElementById("num_msg");
    let date_msg=document.getElementById("date_msg");
    let ccv_msg=document.getElementById("ccv_msg");
    let typing_num=document.getElementById("typing_num");
    let typing_exp=document.getElementById("typing_exp");
    let typing_ccv=document.getElementById("typing_ccv");

    if(update.canGetPrime){
        
    }

    if (update.status.number === 2) {
        // setNumberFormGroupToError()
        typing_num.style.display="none";
        num_msg.style.color="red";
        num_msg.textContent="信用卡的卡號有誤";
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
        typing_num.style.display="none";
        num_msg.style.color="green";
        num_msg.textContent="Done!";
    } else if (update.status.number === 3){
        // setNumberFormGroupToNormal()
        num_msg.textContent="";
        typing_num.style.display="block";
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
        typing_exp.style.display="none";
        date_msg.style.color="red";
        date_msg.textContent="信用卡的到期日有誤";
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
        typing_exp.style.display="none";
        date_msg.style.color="green";
        date_msg.textContent="Done!";
    } else if (update.status.expiry === 3){
        // setNumberFormGroupToNormal()
        date_msg.textContent="";
        typing_exp.style.display="block";
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
        typing_ccv.style.display="none";
        ccv_msg.style.color="red";
        ccv_msg.textContent="信用卡的驗證碼有誤";
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
        typing_ccv.style.display="none";
        ccv_msg.style.color="green";
        ccv_msg.textContent="Done!";
    } else if (update.status.ccv === 3){
        // setNumberFormGroupToNormal()
        ccv_msg.textContent="";
        typing_ccv.style.display="block";
    }

});
// TPDirect.card.getPrime 取得 Prime
confirmation_button.addEventListener("click", function(){
    control_confirmation_btn_loading(1);
    TPDirect.card.getPrime((result)=>{
        if (result.status !== 0 || !check_filled_user_info()) {
            check_filled_card_info();
            control_confirmation_btn_loading(0);
            // alert('get prime error ' + result.msg);
            return;
        } 
        // alert('get prime 成功，prime: ' + result.card.prime);
        import('./order_module.js').then(func=>{
            func.make_order(result.card.prime).then(result=>{
                if (result["error"]){
                    alert("Error: "+result["message"]+"\n請重新提交訂單!")
                }else{
                    import("./booking_module.js").then(func_booking=>{
                        func_booking.delete_booking().then(()=>{
                            window.location=url_thanks+"?number="+result["data"]["number"];
                        });
                    });
                }
                control_confirmation_btn_loading(0);
            });
        })
    });
})
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    import("./sign_module.js").then(func=>{
        func.get_user_info().then(user=>{
            if(user["data"]!=null){
                func.sign_in_view(user);
                load_user(user);
                load_user_info(user);
                user_status=1;
            }else{
                user_status=0;
                window.location=url_home;
            }
        })
    });
    import("./booking_module.js").then(func=>{
        func.get_booking().then(data=>{
            if(data==null){
                without_booking();
            }else{
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
    let content=document.querySelector(".content_container_1");
    let loading=document.querySelector(".loading");
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
    content.style.display="block";
    loading.style.display="none";
}

function load_user_info(user){
    let user_name=document.getElementById("name");
    let user_email=document.getElementById("email");
    let name_msg=document.getElementById("name_msg");
    let email_msg=document.getElementById("email_msg");
    if(user["data"]==null){
        return ;
    }
    user_name.value=user["data"]["name"];
    user_email.value=user["data"]["email"];
    name_msg.style.color="green";
    email_msg.style.color="green";
    name_msg.textContent="Done!";
    email_msg.textContent="Done!";
}

function load_total_cost(data){
    let total_cost=document.getElementById("total_cost");
    total_cost.textContent=data["price"];
}

function without_booking(){
    let loading=document.querySelector(".loading");
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
    content_container_1.style.display="block";
    loading.style.display="none";
}

function control_confirmation_btn_loading(swch){
    let lds_ellipsis=document.getElementById("lds-ellipsis");
    let cfm_btn_txt=document.getElementById("cfm_btn_txt");
    if(swch==1){
        cfm_btn_txt.style.display="none";
        lds_ellipsis.style.display="inline-block";
    }else{
        lds_ellipsis.style.display="none";
        cfm_btn_txt.style.display="block";
    }
    loading_for_confirmation(swch);
}

function loading_for_confirmation(swch){
    let loading_confirmation=document.getElementById("loading_for_confirmation");
    if(swch==0){
        loading_confirmation.style.display="none";
    }else{
        loading_confirmation.style.display="block";
    }
}
//--------------------------------監聽事件-------------------------------//

let sign_in_or_up=document.getElementById("sign_in_or_up");
let background=document.getElementById("background");
let close_sign=document.getElementById("close_sign");
let sign=document.getElementById("sign");
let sign_button=document.getElementById("sign_button");
let switch_sign_up=document.getElementById("click_sign_up");
let schedule=document.getElementById("schedule");
let delete_tour=document.getElementById("delete_tour");
let phone_input=document.getElementById("phone");
let name_input=document.getElementById("name");
let email_input=document.getElementById("email");

window.addEventListener("keyup", function(e){//放開鍵盤剎那，觸發該事件
    let card_number=document.getElementById("card-number");
    let card_expiration_date=document.getElementById("card-expiration-date");
    let card_ccv=document.getElementById("card-ccv");
    input_list=[phone_input, name_input, email_input, card_number, card_expiration_date, card_ccv]

    for(index in input_list){
        if(document.activeElement===input_list[index] && (e.code=="Enter" || e.code=="NumpadEnter")){
            confirmation_button.click();
        }
    }
});

sign_in_or_up.addEventListener("click", function(){
    import("./sign_module.js").then(func => {
        if(sign_in_or_up.textContent=="登出系統"){
            func.delete_sign().then(result=>{
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
    window.location=window.location.href;
})

delete_tour.addEventListener("click", function(){
    import("./booking_module.js").then(func=>{
        func.delete_booking().then(()=>{
            window.location=window.location.href;
        });
    });
})

phone_input.addEventListener("input", function(){
    let typing_phone=document.getElementById("typing_phone");
    let phone_msg=document.getElementById("phone_msg");
    phone_msg.style.display="none";
    typing_phone.style.display="block";
    if(phone_input.value.length==10){
        typing_phone.style.display="none";
        phone_msg.style.display="block";
        if(phone_input.value[0]!=0 || phone_input.value[1]!=9){
            phone_msg.style.color="red";
            phone_msg.textContent="請填寫正確的手機號碼";
        }else{
            phone_msg.style.color="green";
            phone_msg.textContent="Done!";
        } 
    }else{
        phone_msg.style.color="red";
        phone_msg.textContent="請填寫正確的手機號碼";
    }
})

name_input.addEventListener("input", function(){
    let typing_name=document.getElementById("typing_name");
    let name_msg=document.getElementById("name_msg");
    name_msg.style.display="none";
    typing_name.style.display="block";
})

name_input.addEventListener("change", function(){
    let typing_name=document.getElementById("typing_name");
    let name_msg=document.getElementById("name_msg");
    typing_name.style.display="none";
    name_msg.style.display="block";
    if(name_input.value==""){
        name_msg.style.color="red";
        name_msg.textContent="請輸入此欄位!";
    }else{
        name_msg.style.color="green";
        name_msg.textContent="Done!";
    }
})

email_input.addEventListener("input", function(){
    let typing_email=document.getElementById("typing_email");
    let email_msg=document.getElementById("email_msg");
    email_msg.style.display="none";
    typing_email.style.display="block";
})

email_input.addEventListener("change", function(){
    let typing_email=document.getElementById("typing_email");
    let email_msg=document.getElementById("email_msg");
    typing_email.style.display="none";
    email_msg.style.display="block";
    if(email_input.value==""){
        email_msg.style.color="red";
        email_msg.textContent="請輸入此欄位!";
    }else if (email_input.value.indexOf("@")==-1){
        email_msg.style.color="red";
        email_msg.textContent="請輸入正確的email!";
    }else{
        email_msg.style.color="green";
        email_msg.textContent="Done!";
    }
})
//------------------------------------data---------------------------------------
function check_filled_user_info(){
    let name=document.getElementById("name");
    let email=document.getElementById("email");
    let phone=document.getElementById("phone");
    let name_msg=document.getElementById("name_msg");
    let email_msg=document.getElementById("email_msg");
    let phone_msg=document.getElementById("phone_msg");
    if(name_msg.textContent=="Done!" && email_msg.textContent=="Done!" && phone_msg.textContent=="Done!"){
        return true;
    }else{
        if (name.value=="" || email.value=="" || phone.value==""){
            input=[name, email, phone]
            for(index in input){
                if(input[index].value==""){
                    console.log(input[index]);
                    input[index].focus();
                    return false;
                }
            }
        }
        return false;
    }
}

function check_filled_card_info(){
    let num_msg=document.getElementById("num_msg");
    let date_msg=document.getElementById("date_msg");
    let ccv_msg=document.getElementById("ccv_msg");
    msg=[num_msg, date_msg, ccv_msg];
    for(index in msg){
        if(msg[index].textContent!="Done!" && msg[index].textContent!="信用卡的卡號有誤"){
            msg[index].style.color="red";
            msg[index].textContent="請填寫此欄位!";

        }
    }
}
//-------------------------------------Run----------------------------------------
init();