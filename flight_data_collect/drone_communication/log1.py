import logging

def log11():
  # Configure the logging module to display the name of the logger, the level of the log message, and the message.
  #logging.basicConfig(format='%(name)s - %(levelname)s - %(message)s', level=logging.INFO)
  
  # Get a logger with the name 'myLogger'. Multiple calls to `getLogger('myLogger')` will always return a reference to the same Logger object.
  #logger = logging.getLogger('myLogger')
  logger = logging.getLogger(__name__)
  
  # Log messages with various importance levels.
  logger.debug('This is a debug message')  # Not shown because the level is set to INFO
  logger.info('This is an info message')
  logger.warning('This is a warning message')
  logger.error('This is an error message')
  logger.critical('This is a critical message')

  return "Log."

