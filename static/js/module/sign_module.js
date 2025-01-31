import {url_mode} from './package.js';

let url_api_sign=url_mode['url_api_sign'];
let url_home=url_mode['url_home'];
let url_thanks=url_mode['url_thanks'];

export async function get_user_info(){
    return await fetch(url_api_sign).then((response) => {
        return response.json();
    })
}

export async function create_user(){
    let email_input=document.getElementsByName("email")[0];
    let password_input=document.getElementsByName("password")[0];
    let name_input=document.getElementsByName("name")[0];
    let name=name_input.value.replace(/\s*/g, "");
    let email=email_input.value.replace(/\s*/g, "");
    let password=password_input.value.replace(/\s*/g, "");
    if(name=="" || email=="" || password==""){
        name_input.value="";
        email_input.value="";
        password_input.value="";
        let fail_message=document.getElementById("fail_message");
        fail_message.textContent="所有欄位必須填寫 ";
        fail_message.style.color="red";
        return
    }
    let details = {
        'name':name,
        'email':email,
        'password':password
    };
    let form_body = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      form_body.push(encodedKey + "=" + encodedValue);
    }
    form_body = form_body.join("&");
    return await fetch(url_api_sign,{
        method:"POST",
        body:form_body,
        headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    }).then((response) => {
        return response.json();
    }).then((result) => {
        let fail_message=document.getElementById("fail_message");
        if(result["error"]==true){
            name_input.value="";
            email_input.value="";
            password_input.value="";
            fail_message.textContent=result["message"]+" ";
            fail_message.style.color="red";
        }else{
            fail_message.textContent="註冊成功! ";
            fail_message.style.color="blue";
        }
        return result;
    })
}

export async function delete_sign(){
    return await fetch(url_api_sign, {method:"DELETE"}).then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}

export async function SignIn(flag){
    let email_input=document.getElementsByName("email")[0];
    let password_input=document.getElementsByName("password")[0];
    let email=email_input.value;
    let password=password_input.value;
    let details = {
        'email':email,
        'password':password
    };
    let form_body = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      form_body.push(encodedKey + "=" + encodedValue);
    }
    form_body = form_body.join("&");
    return await fetch(url_api_sign,{
        method:"PATCH",
        body:form_body,
        headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    }).then((response) => {
        return response.json();
    }).then((result) => {
        let fail_message=document.getElementById("fail_message");
        email_input.value="";
        password_input.value="";
        if(result["error"]==true){
            fail_message.textContent=result["message"]+" ";
            fail_message.style.color="red";
        }else{
            if(flag>0){
                return result;
            }
            window.location=window.location.href;//重新整理頁面
        }
        return result;
    })
}

export async function modify_user_info(user_id, user_img_blob){
    let name=document.getElementById('name_input').value;
    let email=document.getElementById('email_input').value;
    let password=document.getElementById('password_input').value;
    let file=user_img_blob==null?"":user_img_blob;
    let url=url_api_sign+"/"+user_id;
    let form=new FormData();
    let user_info=[name, email, password, file];
    let form_body=["name", "email", "password", "img"];
    for (let i=0;i<form_body.length;i++){
            form.append(form_body[i], user_info[i]);
    }
    return await fetch(url, {
        method:"PATCH",
        body:form,
        // headers:{
        //     "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        // }
    }).then(response=>{
        return response.json();
    })
}

export async function get_password(user_id){
    let url=url_api_sign+"/"+user_id;
    let form_body="id="+user_id;
    return await fetch(url, {
        method:"POST",
        body:form_body,
        headers:{
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    }).then(response=>{
        return response.json();
    })
}

export async function get_user_img(user_id){
    let url=url_api_sign+"/"+user_id;
    return await fetch(url).then(response=>{
        return response.json();
    }).then(img=>{
        init_user_img(img["img"]);
    })
}

export function sign_in_view(){
    let taipei_navigation=document.getElementById("taipei");
    let greet=document.getElementById("greet");
    let sign_in_or_up=document.getElementById("sign_in_or_up");
    let fail_message=document.getElementById("fail_message");
    let schedule=document.getElementById("schedule");
    let user_img=document.getElementsByClassName("user_img");
    let a=document.createElement("a");
    let a2=document.createElement("a");
    user_img[0].style.display="block";
    user_img[1].style.display="block";
    a.href=url_home;
    a.textContent="台北一日遊";
    taipei_navigation.appendChild(a);
    a2.href=url_thanks;
    a2.textContent="訂單";
    a2.style.color="#757575";
    // a2.style.fontWeight="700";
    greet.appendChild(a2);
    // sign_in_or_up.textContent="登出系統";
    sign_in_or_up.style.display="none";
    fail_message.textContent="登入成功! ";
    fail_message.style.color="blue";
    schedule.style.color="#757575";
    schedule.textContent="預定行程";
}

export function sign_out_view(){
    let greet=document.getElementById("greet");
    let fail_message=document.getElementById("fail_message");
    let sign_in_or_up=document.getElementById("sign_in_or_up");
    let schedule=document.getElementById("schedule");
    let taipei_navigation=document.getElementById("taipei");
    let user_img=document.getElementsByClassName("user_img");
    let a=document.createElement("a");
    user_img[0].style.display="none";
    user_img[1].style.display="none";
    sign_in_or_up.style.display="block";
    a.href=url_home;
    a.textContent="台北一日遊";
    a.style.color="#448899";
    taipei_navigation.appendChild(a);
    greet.textContent="";
    fail_message.textContent="還沒有帳戶？";
    sign_in_or_up.textContent="登入/註冊";
    schedule.style.fontWeight="700";
    schedule.style.color="#757575";
    schedule.textContent="預定行程";
}

export function init_sign_in(){
    let sign=document.getElementById("sign");
    let name_input=document.getElementsByName("name")[0];
    let fail_message=document.getElementById("fail_message");
    let switch_sign_up=document.getElementById("click_sign_up");
    let sign_button=document.getElementById("sign_button");
    sign.style.height="275px";
    name_input.style.display="none";
    fail_message.textContent="還沒有帳戶？";
    fail_message.style.color="#666666";
    switch_sign_up.textContent="點此註冊";
    sign_button.textContent="登入帳戶"
}

export function init_sign_up(){
    let sign=document.getElementById("sign");
    let name_input=document.getElementsByName("name")[0];
    let fail_message=document.getElementById("fail_message");
    let switch_sign_up=document.getElementById("click_sign_up");
    let sign_button=document.getElementById("sign_button");
    sign.style.height="332px";
    name_input.style.display="block";
    fail_message.textContent="已經有帳戶了？";
    fail_message.style.color="#666666";
    switch_sign_up.textContent="點此登入";
    sign_button.textContent="註冊新帳戶"
}

function init_user_img(img){
    let user_img=document.getElementsByClassName("user_img");
    if(img==null){
        img="/static//icon/default_user.jpg";
    }
    for (let i=0;i<user_img.length;i++){
        user_img[i].style.backgroundImage="url('"+img+"')";
        user_img[i].style.display="block";
    }
}