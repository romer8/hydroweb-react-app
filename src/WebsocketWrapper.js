
export var WebSocketWrapper = function () {
    this.startWS = function (websocketServerLocation){
        const notification_ws = new WebSocket(websocketServerLocation);
        notification_ws.onopen = () => {
          console.log("WebSocket is Open");
        };
    
        notification_ws.onmessage = function (e) {
          let data = JSON.parse(e.data);
          let reach_id2 = data['reach_id'];
          let product2 = data['product'];

          console.log(data);
          notification_ws.send(
            JSON.stringify({
              type: "plot_hs_data",
              reach_id:reach_id2,
              product: product2

            })
          );
        };
    
        notification_ws.onclose = function () {
          // Try to reconnect in 1 second
          setTimeout(function () {
            this.startWS(websocketServerLocation).bind(this);
          }, 1000);
          console.log("WebSocket is Closed");
        };
      };
};

