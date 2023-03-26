class Auth {
  static storeToken(token: string): void {
    localStorage.setItem("token", token);
  }

  static deleteToken(): void {
    localStorage.removeItem("token");
  }

  static getToken(): string | null {
    const token = localStorage.getItem("token");

    if (token !== null && localStorage.getItem("token") !== "undefined") {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      if (decodedToken.exp * 1000 < Date.now()) {
        return null;
      } else {
        return token;
      }
    }

    return token;
  }
}

export default Auth;
