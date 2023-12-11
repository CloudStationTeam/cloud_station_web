import logging

def log(*args, **kwargs): # logs.log(1, 2, 3, a=4, b=5) 
  
  s = ""
  for item in args:
    s += str(item) + ", " 
  for item in kwargs.items():
    s += str(item) + ", " 

  logging.basicConfig(format='%(name)s - %(levelname)s - %(message)s', level=logging.INFO)
  
  logger = logging.getLogger(__name__)
  
  logger.info(s)

