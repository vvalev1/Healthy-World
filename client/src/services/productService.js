const baseUrl = "http://localhost:3030/jsonstore";

export const create = async (productData) => {

    const response = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(productData)
    })

    const result = await response.json();
    return result;

};

export const getAll = async () => {
    const response = await fetch(`${baseUrl}/products`);

    const result = await response.json();
    console.log(result)
    return result;
};