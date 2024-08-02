import { defineStore } from 'pinia';
import client from "../helpers/client";
import {computed, ref} from "vue";
import {jwtDecode} from "jwt-decode";
import CookieHelper from "../helpers/cookie.js";

export const useAuthStore = defineStore('auth', () =>{
    const url ='http://localhost:5220/api/';
    const token = ref(CookieHelper.getCookie('token') || null);

    async function logIn(user){
        const response = await client.post(`${url}Account/authenticate`,user);

        if (response.status === 200) {
            CookieHelper.setCookie('token', response.data, 1); // Set token cookie for 30 days
            token.value = response.data;
        }
        else {
            throw new Error(`Failed to authenticate. Status: ${response.status}`);
          }
    }

    async function signUp(registerUser){
        const response = await client.post(`${url}Account/register`,registerUser);

    }

    function logOut() {
        if (isLoggedIn.value) {
            CookieHelper.deleteCookie('token'); // Delete token cookie
            token.value = null;
        }
    }

    // getters
    const loggedInUser = computed(() => {
        return token.value ? jwtDecode(token.value) : null;
    });

    const isAdmin = computed(() => {

        return loggedInUser.value.Role === '1'
    });
    const isOrganizer = computed(() => {

        return loggedInUser.value.Role === '2'
    });

    const id = computed(() => {
        return loggedInUser.value.ID;
    });

    const email = computed(() => {
        return loggedInUser.value.email;
    });

    const isLoggedIn = computed(() => {
        return !!token.value;
    });
    const userName = computed(() => {
        return loggedInUser.value.Username;
    });
    return { logIn, signUp, logOut , isLoggedIn , loggedInUser , id , email , isAdmin, isOrganizer, token, userName};
});
