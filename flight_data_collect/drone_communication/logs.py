import logging

def log(s):
  logging.basicConfig(format='%(name)s - %(levelname)s - %(message)s', level=logging.INFO)
  
  logger = logging.getLogger(__name__)
  
  logger.info(s)

