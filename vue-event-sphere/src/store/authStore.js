import { defineStore } from 'pinia'
import client from "../helpers/client";
import {computed, ref} from "vue";
import {jwtDecode} from "jwt-decode";
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', () =>{
  const url ='http://localhost:5220/api/';
  const token = ref(localStorage.getItem('token') || null);

  async function logIn(user) {
    try {
      const response = await client.post(`${url}Account/authenticate`, user);
  
      if (response.status === 200) {
        localStorage.setItem('token', response.data);
        token.value = response.data;
      } else {
        throw new Error(response.data || 'Wrong credentials, try again!.');
      }
    } catch (error) {
      let errorMessage = error.message || 'Wrong credentials, try again!';
  
      if (error.response && error.response.status === 401) {
        errorMessage = 'Incorrect email or password. Please try again.';
      }
  
      await Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error"
      });
    }
  }

    async function signUp(registerUser){
      const  response = await client.post(`${url}Account/register`,registerUser);
    }

    function logOut() {
        if (isLoggedIn.value) {
            localStorage.removeItem('token');
            token.value = null;
            // await client.post(`${url}:signUp?key=${apiKey}`, user)
        }

    }
        // getters
        const loggedInUser = computed(() => {
            // nese ka token dekodoje
            return token.value ? jwtDecode(token.value) : null;
        })

        const isLoggedIn = computed(() => {
            return !!token.value;
        })



    return { logIn, signUp, logOut , isLoggedIn , loggedInUser }

})
