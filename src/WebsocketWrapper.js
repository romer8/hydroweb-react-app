
export var WebSocketWrapper = function () {
    this.startWS = function (websocketServerLocation){
        const notification_ws = new WebSocket(websocketServerLocation);
        notification_ws.onopen = () => {
          console.log("WebSocket is Open");
        };
    
        notification_ws.onmessage = function (e) {
          let data = JSON.parse(e.data);
          console.log(data);
        };
    
        notification_ws.onclose = function () {
          // Try to reconnect in 1 second
          setTimeout(function () {
            this.startWS(websocketServerLocation);
          }, 1000);
          console.log("WebSocket is Closed");
        };
      };
};

