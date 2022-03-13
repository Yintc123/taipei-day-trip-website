console.log("hi");
let url="http://3.115.234.130:3000/api/attractions?keyword="
// let url="http://127.0.0.1:3000/api/attractions?keyword="
var nextpage=null;
var keyword="";
let search=document.getElementById("search");
let button=document.getElementById("button");
//-----------------------------------Function--------------------------------------
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
//-------------------------------------Run----------------------------------------
create_content(url).then(() => {
        //IntersectionObserver是「非同步」觸發，「相交與否」為一個瞬間，
        //不會有不斷疊加的狀態，所以也就不會發生連續觸發導致的效能問題，
        //也就是說儘管非常快速的來回捲動，它也不會將事件合併。
        let observer=new IntersectionObserver(entries => {
            if(entries[0].intersectionRatio <= 0 || nextpage==undefined) return;//當目標物出現於螢幕的比例<0就return
            let url1=url+keyword+"&page="+nextpage;//當目標物出現於螢幕上開始執行以下程式碼
            create_content(url1);        
        });
        let footer=document.querySelector(".footer h4");
        observer.observe(footer);
});

button.addEventListener("click", () => {
    attraction=search.value;
    attraction=attraction.replace(/\s*/g, "");// 將多餘的空格去除
    keyword=attraction;
    search.value="";//查詢後清除輸入欄
    create_content_keyword(url, keyword);
})