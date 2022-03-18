console.log("hi");
let url="http://3.115.234.130:3000/api/attractions?keyword="//EC2
// let url="http://127.0.0.1:3000/api/attractions?keyword="
let nextpage=null;
let keyword="";
let flag=0;//避免重複讀取資料的旗幟；0：可執行程式；1：程式未執行完，不可再執行程式
let button=document.getElementById("button");
//-----------------------------------Function--------------------------------------
//--------------------------------頁面處理(V)-------------------------------//
function init(){//網頁初始化
    let data=get_data(url);//處理data
    data.then(result=> {
        create_content(result);//處理畫面
    }).then(()=>{
        //IntersectionObserver是「非同步」觸發，「相交與否」為一個瞬間，
        //不會有不斷疊加的狀態，所以也就不會發生連續觸發導致的效能問題，
        //也就是說儘管非常快速的來回捲動，它也不會將事件合併。
        let observer=new IntersectionObserver(entries => {
            if(entries[0].intersectionRatio <= 0 || nextpage==undefined || flag==1) return;//當目標物出現於螢幕的比例<0就return
            flag=1;
            let nextpage_url=url+keyword+"&page="+nextpage;//當目標物出現於螢幕上開始執行以下程式碼
            let nextpage_data=get_data(nextpage_url);//處理data
            nextpage_data.then(result => {
                create_content(result);//處理畫面
                flag=0;
            })        
        });
        let footer=document.querySelector(".footer h4");
        observer.observe(footer);
    })
}

function create_oneitem(data){
    let item=document.createElement("div");
    let img=document.createElement("img");
    let attraction=document.createElement("h4");
    let intro=document.createElement("div");
    let mrt=document.createElement("h4");
    let category=document.createElement("h4");
    let id_url=document.createElement("a");
    item.className="item";
    intro.className="intro";
    mrt.className="left";
    category.className="right";
    img.src=get_imge(data["images"]);
    attraction.textContent=data["name"];
    mrt.textContent=data["MRT"];
    category.textContent=data["category"];
    // id_url.href="http://127.0.0.1:3000/attraction/"+data["id"];
    id_url.href="http://3.115.234.130:3000/attraction/"+data["id"];//EC2
    if (attraction.textContent.length>15){
        attraction.style.fontSize="15px";
    }
    id_url.appendChild(img);
    id_url.appendChild(attraction);
    intro.appendChild(mrt);
    intro.appendChild(category);
    item.appendChild(id_url);
    // item.appendChild(img);
    // item.appendChild(attraction);
    item.appendChild(intro);
    return item;
}

async function create_content(data){
    let content=document.querySelector(".content");
    nextpage=data["nextPage"];
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
}

function clean_content(){
    let content=document.querySelector(".content");
    while(content.firstChild){//刪除content的所有子節點
        content.removeChild(content.firstChild);
    }
}

//--------------------------------監聽事件-------------------------------//
window.addEventListener("keydown", function(e){
    console.log("0");
    if(e==13){
        console.log("1");
        button.click();
    }
});

button.addEventListener("click", () => {
    keyword=search_attraction();
    let specific_attraction_url=url+keyword;
    let specific_attraction_data=get_data(specific_attraction_url);
    specific_attraction_data.then(result => {
        nextpage=result["nextPage"];
        clean_content();
        create_content(result);
        flag=0;
    });
})
//--------------------------------處理data(M)-------------------------------//
async function get_data(url){
    return await fetch(url).then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}

function get_imge(images){
    count=images.length;
    index=Math.floor(Math.random()*count);
    return images[index];
}

function search_attraction(){
    let search=document.getElementById("search");
    attraction=search.value;
    attraction=attraction.replace(/\s*/g, "");// 將多餘的空格去除
    search.value="";//查詢後清除輸入欄
    return attraction;
}
//-------------------------------------Run----------------------------------------
init();