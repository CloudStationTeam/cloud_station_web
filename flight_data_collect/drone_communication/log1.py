import logging

def log11():
  # Configure the logging module to display the name of the logger, the level of the log message, and the message.
  #logging.basicConfig(format='%(name)s - %(levelname)s - %(message)s', level=logging.INFO)
  
  # Get a logger with the name 'myLogger'. Multiple calls to `getLogger('myLogger')` will always return a reference to the same Logger object.
  #logger = logging.getLogger('myLogger')
  #logger = logging.getLogger(__name__)
  logger = logging.getLogger("log111")
  
  # Log messages with various importance levels.
  logger.debug('1 This is a debug message')  # Not shown because the level is set to INFO
  logger.info('1 This is an info message')
  logger.warning('1 This is a warning message')
  logger.error('1 This is an error message')
  logger.critical('1 This is a critical message')

  return "Log."

def print1(s):
  logging.basicConfig(format='%(name)s - %(levelname)s - %(message)s', level=logging.INFO)
  logger = logging.getLogger("log whatever")

  logger.info(s)
  
"""
reload
manage.py
log1.py x
commons.js
con.py not the last one
"""
