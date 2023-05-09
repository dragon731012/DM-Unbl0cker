<p align="center"><img src="/static/img/logo.png" height="200">
</p>

<h1 align="center">Ultraviolet-Node</h1>

<p align="center">The deployable version of Ultraviolet, a highly sophisticated proxy used for evading internet censorship or accessing websites in a controlled sandbox using the power of service-workers and more!<br><br></p>

## Quick Deployments
[![Deploy to Heroku](https://raw.githubusercontent.com/BinBashBanana/deploy-buttons/master/buttons/remade/heroku.svg)](https://heroku.com/deploy/?template=https://github.com/titaniumnetwork-dev/Ultraviolet-Node)
[![Run on Replit](https://raw.githubusercontent.com/BinBashBanana/deploy-buttons/master/buttons/remade/replit.svg)](https://replit.com/github/titaniumnetwork-dev/Ultraviolet-Node)

## Features
- CAPTCHA support along with hCAPTCHA support
- URL encoding settings to further hide activity when using Ultraviolet
- Configuration all done on the client-side via service-workers
- Speed in comparison to other web proxies that fully proxy content
- Blacklist setting and more for easy hosting
- Security in mind and leak prevention
- Frequent updates to improve site support or fix security issues

## Supported Sites
- [Youtube](https://www.youtube.com)
- [CAPTCHA/hCAPTCHA](https://www.captcha.net)
- [Spotify](https://spotify.com)
- [Discord](https://discord.com)
- [Reddit](https://reddit.com)
- [GeForce NOW](https://play.geforcenow.com/) (Partially Supported)
- And more!

## Technologies Used
- Service Workers
- HTML, JS, CSS rewriting
- Parse5
- Acorn.js

## Used by
- [Incognito](https://github.com/caracal-js/Incognito), a popular web proxy service with focus on privacy
- [Holy-Unblocker](https://github.com/titaniumnetwork-dev/Holy-Unblocker), a popular web proxy service focusing on bypassing web filters and more
- [Hypertabs](titaniumnetwork.org/), a web proxy service using a PWA browser as its frontend

## Table of Contents
- [Installation And Setup](#installation-and-setup)
- [Basic Guide](#basic-guide)
- [Replit Setup Guide](#replit-setup-guide)
- [Comprehensive Guide](#comprehensive-guide)
- [Configuration](#configuration)
- [Frontend](#static-files)
- [Core Scripts](#core-scripts)

# Installation and Setup

Installation of Ultraviolet is simple. You can find a Tl;DR of the installation and setup process just below. If you are unfamiliar with the "standard" installation process, look a bit farther down for a more comprehensive installation and setup guide.

## Basic Guide

```sh
$ git clone https://github.com/titaniumnetwork-dev/Ultraviolet-Node --recursive
$ cd Ultraviolet-Node
$ npm install
$ npm start
```

## Replit Setup Guide

To setup on Replit, first click on the "Run on Replit" button. After loading into your repl, click on the green "Run" button. Alternatively, run the following commands:

```sh
$ npm install
$ chmod +x main.sh
$ ./main.sh
```

You will only have to run the second command once. It just allows `main.sh` to be executed. By running `main.sh`, you will update any submodules and will start the app.

**Note**: If you choose not to use `main.sh`, but would rather just run all commands manually, please note that you will have to manually install submodules by running `git update submodules --init`. Without it, `static` will not be installed, and that is a required directory.

## Comprehensive Guide

Below will describe a comprehensive guide to install Ultraviolet on Linux machines.

To clone the repository, simply run the following command:

```sh
$ git clone https://github.com/titaniumnetwork-dev/Ultraviolet-Node --recursive
```

The `--recursive` flag will clone the repository and all submodules.

To begin work on the actual setup, cd into the repository. You can do so by running the following command:

```sh
$ cd Ultraviolet-Node
```

From here, you can update your submodules and install your dependencies. To do so, run the following command:

```sh
$ npm install
```

Finally, to start Ultraviolet, run the following command:

```sh
$ npm start
```

You can then find Ultraviolet on `http://127.0.0.1:8080`. If you would like to change the port UV will be running on, edit the last line in `index.mjs`. 

Please note that UV will not function without HTTPS. If you are hosting on Replit or Heroku, this won't be a problem as they provide you with SSL/TLS by default and will automatically apply it to your instance, however if you are attempting to host UV on a different platform, such as a personal server, you **WILL** need to use HTTPS. 

## Configuration
Configuring Ultraviolet is very simple. Simple descriptions of each configurable option are provided as a comment in the block below. More detailed documentation can be found just below mentioned block.

`uv.config.js`

```javascript
self.__uv$config = {
    prefix: '/sw/', // Proxy url prefix
    bare: '/bare/', // Bare server location
    encodeUrl: Ultraviolet.codec.xor.encode, // URL Encoding function
    decodeUrl: Ultraviolet.codec.xor.decode, // Decode URL function
    handler: '/uv.handler.js', // Handler script
    bundle: '/uv.bundle.js', // Bundled script
    config: '/uv.config.js', // Configuration script
