import {url_mode} from './package.js';

let url_api_orders=url_mode['url_api_orders'];
let url_api_order=url_mode['url_api_order'];
let url_api_user_order=url_mode['url_api_user_order'];

export async function make_order(prime){
    let name=document.getElementById("name").value;
    let email=document.getElementById("email").value;
    let phone=document.getElementById("phone").value;
    let form_body=["name=", "email=", "phone=", "prime="];
    form_body[0]=form_body[0]+name;
    form_body[1]=form_body[1]+email;
    form_body[2]=form_body[2]+phone;
    form_body[3]=form_body[3]+prime;
    form_body=form_body.join("&");

    return await fetch(url_api_orders, {
        method:"POST",
        body:form_body,
        headers:{
            "Content-type":"application/x-www-form-urlencoded;charset=utf-8"
        }
    }).then(response=>{
        return response.json();
    })
}

export async function get_order_info(order_number){
    let url_order_number=url_api_order+order_number;
    return await fetch(url_order_number).then(response=>{
        return response.json();
    })
}

export async function get_orders_by_id(user_id){
    let url=url_api_user_order+user_id
    return await fetch(url).then(response=>{
        return response.json();
    })
}