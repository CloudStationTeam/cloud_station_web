import re

def sanitize_text(text_input):
    return re.sub(r'[^a-zA-Z0-9,. ]', '', text_input)

def test(user_input):
    sanitized_text = sanitize_text(user_input)

