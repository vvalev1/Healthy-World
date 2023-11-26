const baseUrl = "http://localhost:3030/users";

const token = localStorage.getItem("auth");

const authHeaders = {
    
     "content-type": "application/json",
     "X-Authorization": token
}

export const login = async (email, password) => {

    const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const result = await response.json();


    return result;
};

export const register = async (email, password) => {
    const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    
    const result = await response.json();

    if(!response.ok) {
        throw result;
    }

    return result;
}

export const logout = async () => {
    return await fetch(`${baseUrl}/logout`, {
        method: "GET",
        headers: authHeaders
    });
};
