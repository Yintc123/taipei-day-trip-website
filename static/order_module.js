const url={
    "develop":{
        'url_home':'http://127.0.0.1:3000/',
        'url_attraction':'http://127.0.0.1:3000/attraction/',
        'url_booking':'http://127.0.0.1:3000/booking',
        'url_thanks':'http://127.0.0.1:3000/thankyou',
        'url_api_attraction':'http://127.0.0.1:3000/api/attraction/',
        'url_api_attraction_keyword':'http://127.0.0.1:3000/api/attractions?keyword=',
        'url_api_sign':'http://127.0.0.1:3000/api/user',
        'url_api_orders':'http://127.0.0.1:3000/api/orders',
        'url_api_order':'http://127.0.0.1:3000/api/order/',
        'url_api_user_order':'http://127.0.0.1:3000/api/user_order/'
    },
    "production":{
        'url_home':'http://3.115.234.130:3000/',
        'url_attraction':'http://3.115.234.130:3000/attraction/',
        'url_booking':'http://3.115.234.130:3000/booking',
        'url_thanks':'http://3.115.234.130:3000/thankyou',
        'url_api_attraction':'http://3.115.234.130:3000/api/attraction/',
        'url_api_attraction_keyword':'http://3.115.234.130:3000/api/attractions?keyword=',
        'url_api_sign':'http://3.115.234.130:3000/api/user',
        'url_api_orders':'http://3.115.234.130:3000/api/orders',
        'url_api_order':'http://3.115.234.130:3000/api/order/',
        'url_api_user_order':'http://3.115.234.130:3000/api/user_order/'
    }
}

// const env='develop';
const env='production';

let url_api_orders=url[env]['url_api_orders'];
let url_api_order=url[env]['url_api_order'];
let url_api_user_order=url[env]['url_api_user_order'];

// let url_api_orders="http://127.0.0.1:3000/api/orders";
// let url_api_order="http://127.0.0.1:3000/api/order/";
// let url_api_user_order="http://127.0.0.1:3000/api/user_order/";
// let url_api_orders="http://3.115.234.130:3000/api/orders";//EC2
// let url_api_order="http://3.115.234.130:3000/api/order/";//EC2
// let url_api_user_order="http://3.115.234.130:3000/api/user_order/";//EC2

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
    }).then(result=>{
        return result;
    })
}

export async function get_order_info(order_number){
    let url_order_number=url_api_order+order_number;
    return await fetch(url_order_number).then(response=>{
        return response.json();
    }).then(result=>{
        return result;
    })
}

export async function get_orders_by_id(user_id){
    let url=url_api_user_order+user_id
    return await fetch(url).then(response=>{
        return response.json();
    }).then(result=>{
        return result;
    });
}