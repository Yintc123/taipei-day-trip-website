// let url_sign="http://127.0.0.1:3000/api/user";
let url_sign="http://3.115.234.130:3000/api/user";//EC2

export async function get_user_info(){
    return await fetch(url_sign).then((response) => {
        return response.json();
    }).then((result) => {
        return result;
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
    return await fetch(url_sign,{
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
    return await fetch(url_sign, {method:"DELETE"}).then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}

export async function SignIn(){
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
    return await fetch(url_sign,{
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
            window.location=window.location.href;//重新整理頁面
        }
        return result;
    })
}

export function sign_in_view(user){
    let greet=document.getElementById("greet");
    let sign_in_or_up=document.getElementById("sign_in_or_up");
    let fail_message=document.getElementById("fail_message");
    let schedule=document.getElementById("schedule");
    greet.textContent="Hi ~ "+user["data"]["name"];
    greet.style.color="blue";
    greet.style.fontWeight="700";
    sign_in_or_up.textContent="登出系統";
    fail_message.textContent="登入成功! ";
    fail_message.style.color="blue";
    schedule.textContent="預定行程";
}

export function sign_out_view(){
    let greet=document.getElementById("greet");
    let fail_message=document.getElementById("fail_message");
    let sign_in_or_up=document.getElementById("sign_in_or_up");
    let schedule=document.getElementById("schedule");
    greet.textContent="";
    fail_message.textContent="還沒有帳戶？";
    sign_in_or_up.textContent="登入/註冊";
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