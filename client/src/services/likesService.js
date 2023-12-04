const baseUrl = "http://localhost:3030/data/likes";

export const create = async(productId, likes) => {
    const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-Authorization": localStorage.getItem("auth"),
        },
        body: JSON.stringify({
            productId,
            likes
        })
    })

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }

    return result;
}

export const getAllLikesPerProduct = async (productId) => {

    const query = new URLSearchParams({
        where: `productId="${productId}"`
    });
    
    const response = await fetch(`${baseUrl}?${query}`);

    const result = await response.json();
    
    if(!response.ok) {
        throw result;
    }
 
    return result;
};