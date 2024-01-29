import json
import asyncio
import websockets

async def send_data_via_websocket():
    uri = "ws://your_websocket_server_address"  # Replace with your WebSocket server address

    # Assuming mavlinkconnection is your MAVLink connection object
    # Replace the following line with the actual MAVLink connection setup
    # mavlinkconnection = setup_mavlink_connection()

    # Assuming msg is received using mavlinkconnection.recv_match()
    msg = mavlinkconnection.recv_match(blocking=True)

    # Get the port information from mavlinkconnection
    port = mavlinkconnection.get_port()

    # Create a dictionary containing msg and port information
    data = {
        'msg': msg.to_dict(),  # Assuming msg has a to_dict() method to convert it to a dictionary
        'port': port
    }

    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps(data))

# Run the WebSocket sending function
asyncio.get_event_loop().run_until_complete(send_data_via_websocket())
