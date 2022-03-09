console.log("hi");
let url="http://127.0.0.1:3000/api/attractions?keyword="
var nextpage=null;
var keyword=null;
let search=document.getElementById("search");
let button=document.getElementById("button");

function get_imge(images){
    count=images.length;
    index=Math.floor(Math.random()*count);
    return images[index];
}

function create_oneitem(data){
    let item=document.createElement("div");
    let img=document.createElement("img");
    let attraction=document.createElement("h4");
    let intro=document.createElement("div");
    let mrt=document.createElement("h4");
    let category=document.createElement("h4");
    item.className="item";
    intro.className="intro";
    mrt.className="left";
    category.className="right";
    img.src=get_imge(data["images"]);
    attraction.textContent=data["name"];
    mrt.textContent=data["MRT"];
    category.textContent=data["category"];
    if (attraction.textContent.length>15){
        attraction.style.fontSize="15px";
    }
    intro.appendChild(mrt);
    intro.appendChild(category);
    item.appendChild(img);
    item.appendChild(attraction);
    item.appendChild(intro);
    return item;
}

async function create_content(url){
    let content=document.querySelector(".content");
    return await fetch(url).then(response => {
        return response.json();
    }).then(data => {
        nextpage=data["nextPage"];
        for(let i=0;i<data["data"].length;i++){
            content.appendChild(create_oneitem(data["data"][i])); 
        }
    })
}

async function create_content_keyword(url, keyword){
    let content=document.querySelector(".content");
    let url1=url+keyword;
    return await fetch(url1).then(response => {
        return response.json();
    }).then(data => {
        nextpage=data["nextPage"];
        while(content.firstChild){//刪除content的所有子節點
            content.removeChild(content.firstChild);
        }
        if(data["error"]!=null){
            let error=document.createElement("h4");
            error.textContent=data["message"];
            error.style.color="red";
            content.appendChild(error);
        }else{
            for(let i=0;i<data["data"].length;i++){
                content.appendChild(create_oneitem(data["data"][i])); 
            }
        }  
    })
}

create_content(url).then(() => {
        let observer=new IntersectionObserver(entries => {
            if(entries[0].intersectionRatio <= 0 || nextpage==undefined) return;//當目標物出現於螢幕的比例<0就return
            let url1=url+"&page="+nextpage;//當目標物出現於螢幕上開始執行以下程式碼
            create_content(url1);        
        });
        let footer=document.querySelector(".footer h4");
        observer.observe(footer);
});

button.addEventListener("click", () => {
    attraction=search.value;
    create_content_keyword(url, attraction);
})