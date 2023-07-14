import logging

def log(s):
  logging.basicConfig(format='%(name)s - %(levelname)s - %(message)s', level=logging.INFO)
  
  logger = logging.getLogger(__name__)
  
  logger.info(s)
  
"""
reload X
manage.py X
log1.py X
commons.js X
con.py not the last one
views.py not the last one X
"""
