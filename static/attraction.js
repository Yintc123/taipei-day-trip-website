console.log("hi");
let url="http://127.0.0.1:3000/api/attraction/";
let last=document.getElementById("last_one");
let next=document.getElementById("next_one");

function init(){
    let id=1
    fetch(url+id).then((response)=>{
        return response.json();
    }).then((result)=>{
        console.log(result);
        let data=result["data"]
        load_image(data);
        load_book_info(data);
        load_attraction_info(data);
    })
}

function load_image(data){
    let image_frame=document.querySelector(".image");
    let index_frame=document.querySelector(".image_index");
    let current_img=document.createElement("img");
    // let rest_img=document.createElement("img");
    image_frame.style.backgroundImage="url('"+get_image(data["images"], 0)+"')";
    current_img.src="/static/icon/circle_current_b.png";
    index_frame.appendChild(current_img);
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

function get_image(image, index){
    console.log(image[index]);
    return image[index];
}




init();