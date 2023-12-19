const baseUrl = "http://localhost:3030/users";

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

    if(!response.ok) {
        throw result;
    }


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

    const token = JSON.parse(localStorage.getItem("auth")).accessToken;

    console.log(token);

    return await fetch(`${baseUrl}/logout`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "X-Authorization": token
       }
    });
};
