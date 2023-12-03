const baseUrl = "http://localhost:3030/data/products";

export const create = async (productData) => {

    const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-Authorization": localStorage.getItem("auth"),
        },
        body: JSON.stringify(productData)
    })

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }

    return result;

};

export const update = async (productData, productId) => {

    const response = await fetch(`${baseUrl}/${productId}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "X-Authorization": localStorage.getItem("auth"),
        },
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

export const getAllByName = async (productName) => {

    // if no name has entered
    if(productName === "") {
        return [];
    }
    
    const response = await fetch(`${baseUrl}?where=name LIKE ${encodeURIComponent(`"${productName}"`)}`);

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }
 
    return result;
};


export const getOne = async (productId) => {
    
    const response = await fetch(`${baseUrl}/${productId}`);

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }
 
    return result;
};

export const remove = async (productId) => {

    const response = await fetch(`${baseUrl}/${productId}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "X-Authorization": localStorage.getItem("auth"),
        }
    })

    const result = await response.json();

    if(!response.ok) {
        throw result;
    }

    return result;

};