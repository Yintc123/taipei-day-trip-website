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

// export let url_api_booking="http://127.0.0.1:3000/api/booking";
// export let booking="http://127.0.0.1:3000/booking";
export let url_api_booking="http://3.115.234.130:3000/api/booking";//EC2
// export let booking="http://3.115.234.130:3000/booking";//EC2

export async function booking_tour(attraction_id){
    let calendar=document.getElementById("calendar").value;
    let tour_time=document.querySelector("#tour_time:checked").value;
    let form_body=["attraction_id=", "date=", "time="];
    form_body[0]=form_body[0]+attraction_id;
    form_body[1]=form_body[1]+calendar;
    form_body[2]=form_body[2]+tour_time;
    form_body=form_body.join("&");
    console.log(form_body)

    return await fetch(url_api_booking, {
        method:"POST",
        body:form_body,
        headers:{
            "Content-type":"application/x-www-form-urlencoded;charset=utf-8"
        }
    }).then(response => {
        return response.json();
    }).then(result => {
        console.log(result);
    })
}

export async function get_booking(){
    return await fetch(url_api_booking).then(response=>{
        return response.json();
    }).then(data=>{
        return data["data"];
    })
}

export async function delete_booking(){
    return await fetch(url_api_booking, {
        method:"DELETE"
    }).then(response=>{
        return response.json();
    }).then(result=>{
        return result;
    })
}