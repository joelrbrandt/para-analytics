para-analytics
==============

This repo contains a simple node script that:

1. connects to the Para redis server
2. reads all the data
3. formats it more reasonably
4. dumps the re-formatted into `output.json` in the same directory as `main.js`

setup
-----

Note: you probably don't actually want to set this up, because it's already set up on the server in `/data/para/para-analytics`

1. Clone the repo
2. Install dependencies with `npm install`
3. Copy `config.example.js` to `config.js` and edit to contain correct redis server parameters

running
-------

1. make sure you have write permission to the directory where `main.js` lives. You might need to employ `sudo chmod -R [username]` to the directory
2. make sure you don't have an `output.json` in the directory that you want to keep
3. run `node main`
4. obseve your fancy new `output.json` file

viewing data
------------

There is an _incredibly simple_ data viewer in `client.html`. Unfortunately, due to Chrome security restrictions, it only works if it's served via http. An easy way to do this is to install [serf](https://github.com/joelrbrandt/serf).

1. Clone this repo, if you haven't already.
1. Install serf (if you haven't already) with `npm install -g serf`. Depending on your node install, you may have to `sudo npm install -g serf`
2. Make sure you've got the data you want to view in `output.json` in the same place as `client.html`, because that's what `client.html` reads from.
3. run `serf -o`.
4. browse to `client.html`.
5. open up the console and observe that all your data is a.) logged to the console, and b.) available at `window.paraData`.
