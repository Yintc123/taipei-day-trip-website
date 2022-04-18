import {url_mode} from './module/package.js';

const url_booking=url_mode['url_booking'];
const url_member=url_mode['url_member'];
const url_home=url_mode['url_home'];

let user_status=0;
let button_flag=0;
let user_data=null;

document.title="會員頁";
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    import('./module/sign_module.js').then(func=>{
        func.get_user_info().then(user=>{
            if(user["data"]!=null){
                user_data=user;
                func.sign_in_view(user);
                init_user_info(user);
                user_status=1;
            }else{
                // func.sign_out_view();
                window.location=url_home;
            }
        }).then(()=>{
            complete_init();
        })
    })
}

function init_user_info(user){
    const name=document.getElementById("member_name");
    const email=document.getElementById("member_email");
    const password=document.getElementById("member_password");
    name.textContent=user["data"]["name"];
    email.textContent=user["data"]["email"];
    password.textContent="******";
    import('./module/sign_module.js').then(func=>{
        func.get_user_img(user_data["data"]["id"]);
    })
}

function switch_user_info_form(swch){
    const input_member=document.getElementsByClassName("input_member");
    const user_msg=document.getElementsByClassName("user_msg");
    const span_member=document.getElementsByClassName("span_member");
    const modifying_info_button=document.getElementById("modifying_info_button");
    const send_modified_info_button=document.getElementById("send_modified_info_button");
    const confirmation=document.getElementById("confirmation");
    let auto_filled=['name', 'email'];
    if (swch==0){
        for (let i=0; i<input_member.length;i++){
            span_member[i].style.display="none";
            input_member[i].style.display="inline-block";
            user_msg[i].style.display="inline-block";
        }
        modifying_info_button.textContent="取消";
        confirmation.style.display="flex";
        send_modified_info_button.style.display="inline-block";
        for (let i=0; i<auto_filled.length;i++){
            input_member[i].value=user_data["data"][auto_filled[i]];
            user_msg[i].style.color="green";
            user_msg[i].textContent="Done!";
        }
    }else{
        for (let i=0; i<input_member.length;i++){
            input_member[i].style.display="none";
            user_msg[i].style.display="none";
            span_member[i].style.display="inline-block";
        }
        modifying_info_button.textContent="修改會員資料";
        send_modified_info_button.style.display="none";
        confirmation.style.display="none";
    }
    switch_eyes_in_form(swch);
}

function switch_eyes_in_form(swch){
    const eye=document.getElementsByClassName("eye")[0];
    const eye_input=document.getElementsByClassName("eye_input");
    if(swch==0){
        eye.style.display="none";
        eye_input[0].style.display="inline-block";
        eye_input[1].style.display="inline-block";
    }else{
        eye.style.display="inline-block";
        eye_input[0].style.display="none";
        eye_input[1].style.display="none";
    }
}

function change_eyes(obj, swch){
    if(swch==0){//text
        obj.src="static//icon/closed_eye.png";
    }else{//password
        obj.src="static//icon/eye.png";
    }
}

function init_input_value(){
    const input_member=document.getElementsByClassName("input_member");
    const user_msg=document.getElementsByClassName("user_msg");
    for (let i=0;i<input_member.length;i++){
        input_member[i].value="";
        user_msg[i].textContent="";
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

function complete_init(){
    const loading=document.getElementsByClassName("loading")[0];
    loading.style.display="none";
}

function switch_typing_and_msg(typing_obj, msg_obj, swch){
    if(swch==1){//打字中
        typing_obj.style.display="block";
        msg_obj.style.display="none";
    }else{//停止打字
        typing_obj.style.display="none";
        msg_obj.style.display="block";
    }
}
//--------------------------------監聽事件-------------------------------//
const sign_in_or_up=document.getElementById("sign_in_or_up");
const background=document.getElementById("background");
const close_sign=document.getElementsByClassName("close_sign");
const schedule=document.getElementById("schedule");
const modifying_info_button=document.getElementById("modifying_info_button");
const send_modified_info_button=document.getElementById("send_modified_info_button");
const name_input=document.getElementById("name_input");
const email_input=document.getElementById("email_input");
const password_input=document.getElementsByName("password_input");
const eye_input=document.getElementsByClassName("eye_input");
const eye=document.getElementsByClassName("eye")[0];
const changing_img=document.getElementById("changing_img");
const img_uploader=document.getElementById("img_uploader");
const sign_in_img=document.getElementById("sign_in_img");
const sign_out=document.getElementById("sign_out");
const member_page=document.getElementById("member_page");

sign_in_img.addEventListener("click", function(){
    background.style.display="block";
    call_member_page(1);
})

sign_out.addEventListener("click", function(){
    import("./module/sign_module.js").then(func => {
        func.delete_sign().then(()=>{
            window.location=url_home;
        })
    })
})

member_page.addEventListener("click", function(){
    window.location=url_member;
})

background.addEventListener("click", function(){
    background.style.display="none";
    call_member_page(0);
})

for(let i=0;i<close_sign.length;i++){
    close_sign[i].addEventListener("click", function(){
        background.style.display="none";
        call_member_page(0);
    })
}

schedule.addEventListener("click", function(){
    if(user_status==0){
        sign_in_or_up.click();
    }else{
        window.location=url_booking;
    }
})

modifying_info_button.addEventListener("click", function(){
    if(button_flag==0){
        switch_user_info_form(button_flag);
        button_flag=1;
    }else{
        switch_user_info_form(button_flag);
        init_input_value();
        button_flag=0;
    }
    
})

name_input.addEventListener("input", function(){
    const typing_name=document.getElementById("typing_name");
    const name_msg=document.getElementById("name_msg");
    switch_typing_and_msg(typing_name, name_msg, 1)//1:打字;0:停止

})

name_input.addEventListener("change", function(){
    const typing_name=document.getElementById("typing_name");
    const name_msg=document.getElementById("name_msg");
    switch_typing_and_msg(typing_name, name_msg, 0)//1:打字;0:停止
    if(name_input.value==""){
        name_msg.style.color="red";
        name_msg.textContent="此欄有誤";
    }else{
        name_msg.style.color="green";
        name_msg.textContent="Done!";
    }
})

email_input.addEventListener("input", function(){
    const typing_email=document.getElementById("typing_email");
    const email_msg=document.getElementById("email_msg");
    switch_typing_and_msg(typing_email, email_msg, 1)//1:打字;0:停止
})

email_input.addEventListener("change", function(){
    const typing_email=document.getElementById("typing_email");
    const email_msg=document.getElementById("email_msg");
    switch_typing_and_msg(typing_email, email_msg, 0)//1:打字;0:停止
    if(email_input.value==""){
        email_msg.style.color="red";
        email_msg.textContent="此欄有誤";
    }else if (email_input.value.indexOf("@")==-1){
        email_msg.style.color="red";
        email_msg.textContent="格式有誤";
    }else{
        email_msg.style.color="green";
        email_msg.textContent="Done!";
    }
})

for (let i=0;i<password_input.length;i++){
    password_input[i].addEventListener("input", function(){
        const typing_password=document.getElementsByName("typing_password")[i];
        const password_msg=document.getElementsByName("password_msg")[i];
        switch_typing_and_msg(typing_password, password_msg, 1)//1:打字;0:停止
    })
}

for (let i=0;i<password_input.length;i++){
    password_input[i].addEventListener("change", function(){
        const typing_password=document.getElementsByName("typing_password")[i];
        const password_msg=document.getElementsByName("password_msg")[i];
        switch_typing_and_msg(typing_password, password_msg, 0)//1:打字;0:停止
        if(password_input[i].value==""){
            password_msg.style.color="red";
            password_msg.textContent="此欄有誤";
        }else{
            if(i==1){
                if(password_input[1].value!=password_input[0].value){
                    password_msg.style.color="red";
                    password_msg.textContent="此欄有誤";
                    return;
                }
            }else{
                if(password_input[0].value==password_input[1].value){
                    document.getElementsByName("password_msg")[1].style.color="green";
                    document.getElementsByName("password_msg")[1].textContent="Done!";
                }else{
                    document.getElementsByName("password_msg")[1].style.color="red";
                    document.getElementsByName("password_msg")[1].textContent="此欄有誤";
                }
            }
            password_msg.style.color="green";
            password_msg.textContent="Done!";
        }
    })
}

let eye_input_flag=[0, 0];
for (let i=0;i<eye_input.length;i++){
    eye_input[i].addEventListener("click", function(){
        change_eyes(eye_input[i], eye_input_flag[i])
        if(eye_input_flag[i]==0){
            password_input[i].type="text";
            eye_input_flag[i]=1;
        }else{
            password_input[i].type="password";
            eye_input_flag[i]=0;
        }
    })
}

let eye_flag=0;
eye.addEventListener("click", function(){
    if(eye_flag==0){
        get_member_password();
        change_eyes(eye, eye_flag);
        eye_flag=1;
    }else{
        let member_password=document.getElementById("member_password");
        member_password.textContent="******";
        change_eyes(eye, eye_flag);
        eye_flag=0;
    }
    
})

send_modified_info_button.addEventListener("click", function(){
    if(!check_all_done()) return;
    import('./module/sign_module.js').then(func=>{
        func.modify_user_info(user_data["data"]["id"], null).then(result=>{
            if(result["error"]){
                let email_msg=document.getElementById("email_msg");
                email_msg.style.color="red";
                email_msg.textContent=result["message"];
            }else{
                window.location=window.location.href;
            }
        });
    })
})

changing_img.addEventListener("click", function(){
    img_uploader.click();
})

img_uploader.addEventListener("change", function(e){
    console.log(e.target.files);
    const reader=new FileReader();
    reader.addEventListener("load", function(){
        let image=new Image();
        image.src=reader.result;
        image.onload=function(){
            compress_img(image);//壓縮圖片
        }
    })
    reader.readAsDataURL(this.files[0]);
})
//------------------------------------data---------------------------------------
function check_data_done(msg_obj){
    if (msg_obj.textContent=="Done!"){
        return 0;
    }else{
        return 1;
    }
}

function check_all_done(){
    const user_msg=document.getElementsByClassName("user_msg");
    let fail_input_value=0;
    for (let i=0;i<user_msg.length;i++){ // 前端阻擋資訊錯誤
        if(check_data_done(user_msg[i])!=0){
            user_msg[i].style.color="red";
            user_msg[i].textContent="此欄有誤";
            fail_input_value++;
        }
    }
    if(fail_input_value>0){
        return false;
    }
    return true;
}

function get_member_password(){
    const member_password=document.getElementById("member_password");
    import('./module/sign_module.js').then(func=>{
        func.get_password(user_data["data"]["id"]).then(result=>{
            member_password.textContent=result;
        });
    })
}

function compress_img(img){
    const canvas=document.createElement("canvas");
    canvas.width=200;
    canvas.height=200;
    let ctx=canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 200, 200);
    canvas.toBlob((blob)=>{
        const fail_upload_msg=document.getElementById("fail_upload_msg");
        console.log(blob["size"]);
        if (blob["size"]>15000000){//MEDIUM BLOB最大儲存16Mb
            fail_upload_msg.style.display="block";
            return;
        }
        fail_upload_msg.style.display="none";
        blob_to_data_url(blob, (data_url)=>{
            upload_img(data_url);
        });
        import('./module/sign_module.js').then(func=>{
        func.modify_user_info(user_data["data"]["id"], blob).then(()=>{
            window.location=window.location.href;
            })
        })
    },"image/jpeg", 0.8);//以canvas繪圖後儲存為jpeg格式並壓縮比例為0.8
}

function upload_img(img_blob){
    const member_img=document.getElementById("member_img");
    member_img.style.backgroundImage="url('"+img_blob+"')";
}

function blob_to_data_url(blob, callback){
    const reader=new FileReader();
    reader.addEventListener("load",function(e){
        callback(e.target.result);
    })
    reader.readAsDataURL(blob);
}
//-------------------------------------Run----------------------------------------
init();