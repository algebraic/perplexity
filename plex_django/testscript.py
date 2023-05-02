#!/usr/bin/env python3

import pathlib


# function to send messages
def msg():
    desktop = pathlib.Path("/mnt/torrents/completed/")
    desktop.iterdir()
    print(list(desktop.iterdir()))
    print("hello there")

# msg()