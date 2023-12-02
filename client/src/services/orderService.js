const baseUrl = "http://localhost:3030/data/orders";

export const create = async (productId, data) => {
    const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-Authorization": localStorage.getItem("auth"),
        },
        body: JSON.stringify({
            productId,
            user: data
        })
    })

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }

    return result;
}