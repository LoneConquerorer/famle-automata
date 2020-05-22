import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:4001");

function subscribeToTimer(interval, callback) {}
export { subscribeToTimer };
