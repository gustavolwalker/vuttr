export const TOKEN_KEY = "tools_token";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUserName = () => {
    if (isAuthenticated()){
        var payload = getToken()!.split('.')[1].replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(payload)).userName;
    } else {
        return null;
    }
}

export const login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
}

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
}
