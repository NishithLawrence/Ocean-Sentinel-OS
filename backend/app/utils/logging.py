"""Central logging configuration entry point for later use."""
import logging


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
