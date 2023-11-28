const baseUrl = "http://localhost:3030/data/products";

const token = localStorage.getItem("auth");

const authHeaders = {
    "content-type": "application/json",
    "X-Authorization": token,
};

export const create = async (productData) => {

    const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(productData)
    })

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }

    return result;

};

export const getAll = async () => {
    const response = await fetch(`${baseUrl}`);

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }
 
    return result;
};

export const getAllByKind = async (productKind) => {
    
    const query = new URLSearchParams({
        where: `kindProduct="${productKind}"`
    });

    const response = await fetch(`${baseUrl}?${query}`);

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }
 
    return result;
};


export const getOne = async (productId) => {
    
    // const query = new URLSearchParams({
    //     where: `kindProduct="${productKind}"`
    // });

    const response = await fetch(`${baseUrl}/${productId}`);

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }
 
    return result;
};