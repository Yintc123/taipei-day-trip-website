export async function get_attraction_data(url){
    return await fetch(url).then((response) => {
        return response.json();
    })
}