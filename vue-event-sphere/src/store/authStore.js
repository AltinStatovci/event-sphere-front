import { defineStore } from 'pinia'
import client from "../helpers/client";
import {computed, ref} from "vue";
import {jwtDecode} from "jwt-decode";

export const useAuthStore = defineStore('auth', () =>{
  const url ='http://localhost:5220/api/';
  const token = ref(localStorage.getItem('token') || null);

  async function logIn(user){
    const response = await client.post(`${url}Account/authenticate`,user);

      if (response.status === 200) {
          localStorage.setItem('token', response.data)
          token.value = response.data;
      }
      console.log(response)
      console.log("test")
      console.log(response)

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
            // Check if token exists and is valid
            if (token.value) {
                const decodedToken = jwtDecode(token.value);
                // Check if name is available in decoded token
                if (decodedToken.name) {
                    return decodedToken;
                } else {
                    // Handle case where name is not available
                    return { email: decodedToken.email, name: null }; 
                }
            } else {
                return null;
            }
        });
        const isLoggedIn = computed(() => {
            return !!token.value;
        })

        



    return { logIn, signUp, logOut , isLoggedIn , loggedInUser }

})
