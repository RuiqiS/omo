import discord
import os
import sys

if not os.path.isfile("config.py"):
        sys.exit("'config.py' not found! Please add it and try again.")

else:
    import config

TOKEN = config.omotoken
PREFIX = ("y-")

client = discord.Client()

@client.event
async def on_ready():
    print("[READY] Logged in as " + client.user.name + " with ID:" + client.user.id)
    print("~ Discord.py API version:", discord.__version__)
    await client.change_presence(game=discord.Game(name="in the kitchen"),status=discord.Status('dnd'))

client.run(TOKEN)