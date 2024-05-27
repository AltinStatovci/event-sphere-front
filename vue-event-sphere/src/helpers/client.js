import axios from "axios";
import Swal from "sweetalert2";


const instance = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',

    }
})

instance.interceptors.request.use(function (config) {
    // Do something before request is sent

    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : null;
    // console.log(config.headers.Authorization)


    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    await Swal.fire({
        title: "Error!",
        text: error.response.data.error.message,
        icon: "error"
    });

    return Promise.reject(error);
});

export default instance;