const baseUrl = "http://localhost:3030/data";

const token = localStorage.getItem("auth");

const authHeaders = {
    "content-type": "application/json",
    "X-Authorization": token,
};

export const create = async (productData) => {

    const response = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(productData)
    })

    const result = await response.json();
    return result;

};

export const getAll = async () => {
    const response = await fetch(`${baseUrl}/products`);

    const result = await response.json();
 
    return result;
};