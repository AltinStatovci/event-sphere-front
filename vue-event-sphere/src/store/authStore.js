import { defineStore } from 'pinia'
import client from "../helpers/client";
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () =>{
  const url ='http://localhost:5220/api/';
  const token = ref(localStorage.getItem('token') || null);

  async function logIn(user){
    const response = await client.post(`${url}authenticate`,user);

      if (response.data) {
          localStorage.setItem('token', response.data.idToken)
          token.value = response.data.idToken;
      }
      console.log(response)

  }

    async function signUp(registerUser){
      const  response = await client.post(`${url}register`,registerUser);
    }

    function logOut() {
        if (isLoggedIn.value) {
            localStorage.removeItem('token');
            token.value = null;
            // await client.post(`${url}:signUp?key=${apiKey}`, user)
        }


        // getters
        // const loggedInUser = computed(() => {
        //     // nese ka token dekodoje
        //     return token.value ? jwtDecode(token.value) : null;
        // })
        //
        // const isLoggedIn = computed(() => {
        //     return !!token.value;
        // })
    }


    return { logIn, signUp, logOut}

})
