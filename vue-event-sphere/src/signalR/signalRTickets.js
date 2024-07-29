import * as signalR from "@microsoft/signalr";
import CookieHelper from "@/helpers/cookie.js";

const ticketConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5220/ticketHub", {
        accessTokenFactory: () => {
            return CookieHelper.getCookie("token");
        }
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

ticketConnection.on("ReceiveTicketCountUpdate", (eventId, availableTickets) => {
    console.log(`Event ID: ${eventId}, Available Tickets: ${availableTickets}`);
    window.dispatchEvent(new CustomEvent('ticketUpdate', { detail: { eventId, availableTickets } }));
});

ticketConnection.start()
    .then(() => console.log("Ticket SignalR Connected"))
    .catch(err => console.error("Ticket SignalR Connection Error: ", err));

export default ticketConnection;
