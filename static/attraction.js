console.log("hi");
// let url="http://127.0.0.1:3000/api/attraction/";
let url="http://3.115.234.130:3000/api/attraction/"//EC2
let last=document.getElementById("last_one");
let next=document.getElementById("next_one");
let tour_time=document.getElementsByName("time");
let data=null;
let img_index=0;
let cur_url=window.location.href;
let id=cur_url.split("/")[4];
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){
    let id_url=url+id;
    fetch(id_url).then((response)=>{
        return response.json();
    }).then((result)=>{
        data=result["data"]
        if(data==undefined){//網頁偵錯
            // window.history.go(-1);//回上一頁
            // window.location='http://127.0.0.1:3000/';//回首頁
            window.location='http://3.115.234.130:3000/';//回首頁，EC2
        }
        load_image(data, img_index);
        load_book_info(data);
        load_attraction_info(data);
        tour_cost();
        set_date();
    })
}

function load_image(data, index){
    let image_frame=document.querySelector(".image");
    image_frame.style.backgroundImage="url('"+get_image(data["images"], index)+"')";
    load_img_index(data, index);
}

function load_book_info(data){
    let attraction_name=document.querySelector(".name");
    let attraction_cat=document.querySelector(".cat");
    let attraction_MRT=document.querySelector(".MRT");
    attraction_name.textContent=data["name"];
    attraction_cat.textContent=data["category"];
    attraction_MRT.textContent=data["MRT"];
}

function load_attraction_info(data){
    let attraction_intro=document.querySelector(".intro");
    let attraction_address=document.querySelector(".address");
    let attraction_transport=document.querySelector(".transport");
    attraction_intro.textContent=data["description"];
    attraction_address.textContent=data["address"];
    attraction_transport.textContent=data["transport"];
}

function load_img_index(data, index){
    let index_frame=document.querySelector(".image_index");
    while(index_frame.firstChild){
        index_frame.removeChild(index_frame.firstChild);
    }
    let images=[];
    for(let i=0;i<data["images"].length;i++){
        if(i==index){
            images[i]=document.createElement("img");
            images[i].src="/static/icon/circle_current_b.png";
            index_frame.appendChild(images[i]);
        }else{
            images[i]=document.createElement("img");
            images[i].src="/static/icon/circle_current_w.png";
            index_frame.appendChild(images[i]);
        }
    }
}

function tour_cost(){
    let cost=document.getElementById("cost");
    if(tour_time[0].checked){
        cost.textContent="新台幣 " + tour_time[0].value + " 元";
    }else{
        cost.textContent="新台幣 " + tour_time[1].value + " 元";
    }     
}

function set_date(){
    let calendar=document.getElementById("calendar");
    let date=new Date();
    let day=date.getDate();
    let month=date.getMonth()+1;
    let year=date.getFullYear();
    if(month<10){
        month="0"+month;
    }
    if(date<10){
        day="0"+day;
    }
    calendar.value=year+"-"+month+"-"+day;
    calendar.min=calendar.value;
}
//--------------------------------監聽事件-------------------------------//
tour_time.forEach(time => {//依input的物件創造兩個"change"監聽事件
    time.addEventListener("change", function(){
        tour_cost();
    });
})

last.addEventListener("click", function(){
    img_index--;
    count=data["images"].length;
    if(img_index<0){
        img_index=data["images"].length-1;
    }
    load_image(data, img_index);
});

next.addEventListener("click", function(){
    img_index++;
    count=data["images"].length;
    if(img_index>data["images"].length-1){
        img_index=0;
    }
    load_image(data, img_index);
});
//--------------------------------處理data(M)-------------------------------//
function get_image(image, index){
    return image[index];
}
//-------------------------------------Run----------------------------------------
init();

let timer=setInterval(function(){
    let image_frame=document.querySelector(".image");
    image_frame.addEventListener("change", function(){
        clearInterval(timer);
        timer;
    })
    img_index++;
    count=data["images"].length;
    if(img_index>data["images"].length-1){
        img_index=0;
    }
    load_image(data, img_index);
}, 3000);