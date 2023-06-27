#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

import logging

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webgms.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':

    # Configure the logging module to display the name of the logger, the level of the log message, and the message.
    logging.basicConfig(format='%(name)s - %(levelname)s - %(message)s', level=logging.INFO)

    # Get a logger with the name 'myLogger'. Multiple calls to `getLogger('myLogger')` will always return a reference to the same Logger object.
    logger = logging.getLogger('myLogger')

    # Log messages with various importance levels.
    logger.debug('This is a debug message')  # Not shown because the level is set to INFO
    logger.info('This is an info message')
    logger.warning('This is a warning message')
    logger.error('This is an error message')
    logger.critical('This is a critical message')

    main()

