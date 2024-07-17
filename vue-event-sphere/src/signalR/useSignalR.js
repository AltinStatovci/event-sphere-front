import * as signalR from "@microsoft/signalr";
import CookieHelper from "@/helpers/cookie.js";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5220/notificationHub", {
        accessTokenFactory: () => {
            // Retrieve the JWT token from the cookie using CookieHelper
            return CookieHelper.getCookie("token");
        }
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("ReceiveNotification", (message) => {
    console.log("Notification received: ", message);

});

connection.start()
    .then(() => console.log("SignalR Connected"))
    .catch(err => console.error("SignalR Connection Error: ", err));

export default connection;