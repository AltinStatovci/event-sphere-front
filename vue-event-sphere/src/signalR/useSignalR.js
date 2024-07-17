import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5220/notificationHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("ReceiveNotification", (message) => {
    console.log("Notification received: ", message);

});

connection.start()
    .then(() => console.log("SignalR Connected"))
    .catch(err => console.error("SignalR Connection Error: ", err));

export default connection;