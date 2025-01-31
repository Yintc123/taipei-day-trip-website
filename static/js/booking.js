console.log("hi");
import {url_mode} from './module/package.js';

const url_home=url_mode['url_home'];
const url_thanks=url_mode['url_thanks'];
const url_member=url_mode['url_member'];

let user_status=0;
document.title="預定行程";
// ------------------------------使用Tappay的SDK-----------------------------------
const confirmation_button=document.getElementById("confirmation_button");
// TPDirect.setupSDK 設定參數
const app_key="app_K64GfXE4Bm18CcyVETTYS0e9PTZmjpVyBhGh6sHQaHiImNYSoJcGjvjM1OhT";
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
    const num_msg=document.getElementById("num_msg");
    const date_msg=document.getElementById("date_msg");
    const ccv_msg=document.getElementById("ccv_msg");
    const typing_num=document.getElementById("typing_num");
    const typing_exp=document.getElementById("typing_exp");
    const typing_ccv=document.getElementById("typing_ccv");

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
    switch_loading_status(1);
    TPDirect.card.getPrime((result)=>{
        if (result.status !== 0 || !check_filled_user_info()) {
            show_fail_creditcard_msg();
            switch_loading_status(0);
            // alert('get prime error ' + result.msg);
            return;
        } 
        // alert('get prime 成功，prime: ' + result.card.prime);
        import('./module/order_module.js').then(func=>{
            func.make_order(result.card.prime).then(result=>{
                if (result["error"]){
                    alert("Error: "+result["message"]+"\n請重新提交訂單!")
                }else{
                    import("./module/booking_module.js").then(func_booking=>{
                        func_booking.delete_booking().then(()=>{
                            window.location=url_thanks+"?number="+result["data"]["number"];
                        });
                    });
                }
                switch_loading_status(0);
            });
        })
    });
})
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    import("./module/sign_module.js").then(func=>{
        func.get_user_info().then(user=>{
            if(user["data"]!=null){
                func.sign_in_view(user);
                func.get_user_img(user["data"]["id"]);
                show_user_name(user);
                load_user_info(user);
                user_status=1;
            }else{
                user_status=0;
                window.location=url_home;
            }
        })
    });
    import("./module/booking_module.js").then(func=>{
        func.get_booking().then(data=>{
            if(data==null){
                show_without_booking_page();
            }else{
                show_booking_info(data);
            }
        });
    })
}
function show_user_name(user){
    const user_name=document.getElementById("user_name");
    user_name.textContent=user["data"]["name"];
}
function show_attraction_image(data){
    const img=document.querySelector(".attraction_img");
    img.style.backgroundImage="url('"+data["attraction"]["image"]+"')";
}
function show_booking_info(data){
    const content=document.querySelector(".content_container_1");
    const loading=document.querySelector(".loading");
    const tour_name=document.getElementById("tour_name");
    const tour_date=document.getElementById("tour_date");
    const tour_time=document.getElementById("tour_time");
    const tour_cost=document.getElementById("tour_cost");
    const tour_adrs=document.getElementById("tour_adrs");
    tour_name.textContent=data["attraction"]["name"];
    tour_date.textContent=data["date"];
    tour_cost.textContent=data["price"];
    tour_adrs.textContent=data["attraction"]["address"];
    if(data["time"]=="上半天"){
        tour_time.textContent="早上9點到下午4點";
    }else{
        tour_time.textContent="下午4點到晚上9點";
    }
    show_attraction_image(data);
    content.style.display="block";
    loading.style.display="none";
    show_total_cost(data);
}

function load_user_info(user){
    const user_name=document.getElementById("name");
    const user_email=document.getElementById("email");
    const name_msg=document.getElementById("name_msg");
    const email_msg=document.getElementById("email_msg");
    if(user["data"]==null || user_name==null){
        return ;
    }
    user_name.value=user["data"]["name"];
    user_email.value=user["data"]["email"];
    name_msg.style.color="green";
    email_msg.style.color="green";
    name_msg.textContent="Done!";
    email_msg.textContent="Done!";
}

function show_total_cost(data){
    const total_cost=document.getElementById("total_cost");
    total_cost.textContent=data["price"];
}

function show_without_booking_page(){
    const loading=document.querySelector(".loading");
    const content_container_1=document.querySelector(".content_container_1");
    const container=document.createElement("div");
    const message=document.createElement("p");
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

function switch_loading_status(swch){
    const lds_ellipsis=document.getElementById("lds-ellipsis");
    const cfm_btn_txt=document.getElementById("cfm_btn_txt");
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
    const loading_confirmation=document.getElementById("loading_for_confirmation");
    if(swch==0){
        loading_confirmation.style.display="none";
    }else{
        loading_confirmation.style.display="block";
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

function show_fail_creditcard_msg(){
    const num_msg=document.getElementById("num_msg");
    const date_msg=document.getElementById("date_msg");
    const ccv_msg=document.getElementById("ccv_msg");
    let msg=[num_msg, date_msg, ccv_msg];
    for(let index in msg){
        if(msg[index].textContent!="Done!" && msg[index].textContent!="信用卡的卡號有誤"){
            msg[index].style.color="red";
            msg[index].textContent="請填寫此欄位!";

        }
    }
}
//--------------------------------監聽事件-------------------------------//
const background=document.getElementById("background");
const close_sign=document.getElementsByClassName("close_sign");
const sign=document.getElementById("sign");
const sign_button=document.getElementById("sign_button");
const switch_sign_up=document.getElementById("click_sign_up");
const schedule=document.getElementById("schedule");
const delete_tour=document.getElementById("delete_tour");
const phone_input=document.getElementById("phone");
const name_input=document.getElementById("name");
const email_input=document.getElementById("email");
const sign_in_img=document.getElementById("sign_in_img");
const sign_out=document.getElementById("sign_out");
const member_page=document.getElementById("member_page");

window.addEventListener("keyup", function(e){//放開鍵盤剎那，觸發該事件
    const card_number=document.getElementById("card-number");
    const card_expiration_date=document.getElementById("card-expiration-date");
    const card_ccv=document.getElementById("card-ccv");
    let input_list=[phone_input, name_input, email_input, card_number, card_expiration_date, card_ccv]
    for(let index in input_list){
        if(document.activeElement===input_list[index] && (e.code=="Enter" || e.code=="NumpadEnter")){
            confirmation_button.click();
        }
    }
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
    window.location=window.location.href;
})

delete_tour.addEventListener("click", function(){
    import("./module/booking_module.js").then(func=>{
        func.delete_booking().then(()=>{
            window.location=window.location.href;
        });
    });
})

phone_input.addEventListener("input", function(){
    const typing_phone=document.getElementById("typing_phone");
    const phone_msg=document.getElementById("phone_msg");
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
    const typing_name=document.getElementById("typing_name");
    const name_msg=document.getElementById("name_msg");
    name_msg.style.display="none";
    typing_name.style.display="block";
})

name_input.addEventListener("change", function(){
    const typing_name=document.getElementById("typing_name");
    const name_msg=document.getElementById("name_msg");
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
    const typing_email=document.getElementById("typing_email");
    const email_msg=document.getElementById("email_msg");
    email_msg.style.display="none";
    typing_email.style.display="block";
})

email_input.addEventListener("change", function(){
    const typing_email=document.getElementById("typing_email");
    const email_msg=document.getElementById("email_msg");
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
    const name=document.getElementById("name");
    const email=document.getElementById("email");
    const phone=document.getElementById("phone");
    const name_msg=document.getElementById("name_msg");
    const email_msg=document.getElementById("email_msg");
    const phone_msg=document.getElementById("phone_msg");
    if(name_msg.textContent=="Done!" && email_msg.textContent=="Done!" && phone_msg.textContent=="Done!"){
        return true;
    }else{
        if (name.value=="" || email.value=="" || phone.value==""){
            let input=[name, email, phone]
            for(let index in input){
                if(input[index].value==""){
                    input[index].focus();
                    return false;
                }
            }
        }
        return false;
    }
}
//-------------------------------------Run----------------------------------------
init();