class CookieHelper {
    // Set a cookie
    static setCookie(name, value, days, expiresDate) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        } else if (expiresDate) {
            expires = "; expires=" + expiresDate.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Get a cookie by name
    static getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    // Delete a cookie by name
    static deleteCookie(name) {
        document.cookie = name + "=; Max-Age=-99999999; path=/";
    }
}

export default CookieHelper;
