import {url_mode} from './package.js';

let url_api_booking=url_mode['url_api_booking'];

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
    })
}