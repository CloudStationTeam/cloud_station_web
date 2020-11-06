from flightmonitor.consumers import send_message_to_clients
import json


def push_log_to_client(log_msg):
    send_message_to_clients(json.dumps({'log_output': log_msg}))
