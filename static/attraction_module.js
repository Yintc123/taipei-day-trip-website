
export async function get_data(url){
    return await fetch(url).then((response) => {
        return response.json();
    }).then((result) => {
        return result;
    })
}