<p align="center">
<img src="https://raw.githubusercontent.com/viri-space/brand/master/XYZ/logo.png" width="350">
</p>

***

XYZ is my own personal design language and framework. I've designed it to be fully modular and fit most use cases. XYZ is constantly evolving, changing and improving as I learn more about designing software. I'm primarily creating this framework for use in my own work so I can have stylistic consistency across all of the sites that I work on, but I plan for it to be customisable and approachable enough for others to use in their own creations.

I wanted XYZ to be super simple to setup and get started with. All you need to do to start using it is add a link to the main style sheet in the head of your HTML file. This will instantly give you access to all of the different classes and stylings that XYZ provides.

<h2 align="center">xyz_config.css</h2>

If you would then like to customise your XYZ setup you can add the xyz_config.css template file locally and make changes to customise how XYZ looks. This file is designed to let you make big changes easily without having to edit large parts of your HTML. It makes use of CSS variables that will override the default variables that the theme comes with. It is highly recommended that you use this file alongside XYZ to get the most out of it.

***

<h2 align="center">The Pillars</h2>

| <h4 align="center">Responsiveness | <h4 align="center">Contextuality | <h4 align="center">Presentation |
|:--------------:|:-------------:|:------------:|
| A site built with XYZ should work across all devices and all browsers. Everything should have fallbacks available in case fonts or certain stylings are unavailable. | Not every part of a style should need to be applied manually. XYZ will apply certain stylings for you automatically based on the context of what you're writing. | Not only do I want XYZ to function well, I want it to look good too. Using XYZ it should be easy to build a site that works as well as it looks. |

***

<h2 align="center">Branches</h2>

This repo contains all files for the XYZ style. Each branch of this repo represents a different application and is updated seperately.


<h5 align="center">Master</h5>

This is the main version of XYZ. Other branches of XYZ are built from this one.

<h5 align="center" href="tree/jekyll">Jekyll</h5>

This is designed to work with Jekyll powered webpages. More information on setting this theme can be found on the README for that branch

***

<h2 align="center">Style Rules</h2>

<h5 align="center">Grid System</h5>

Each site should begin by splitting the page up into segments using the XYZ grid system, this allows contextual styling to work properly and keeps your site looking clean.
Working with the grid system is easy to do, simply create div elements with class for each section you want, then wrap that all in a div with the "xyz" class.

    <div class="xyz">

      <div class="xyz__header">
        {{HEADER HERE}}
      </div>

      <div class="xyz__main">
        {{MAIN CONTENT HERE}}
      </div>

      <div class="xyz__footer">
        {{FOOTER HERE}}
      </div>

    </div>

You now have the basic structure of your website setup!

<h5 align="center">Fonts</h5>

fonts are automatically applied based on context using the default html elements

<h5 align="center">Colors</h5>

the primary theme for your website consists of a primary, secondary and tertiary color which can be customised in the config file.

<h5 align="center">Borders</h5>

borders are used in XYZ to separate areas up so they are easily distinguishable

<h5 align="center">Flexbox</h5>

XYZ uses flexbox for properly sorting your content on the page. It allows content to be shown in a more interesting fashion and have a great level of responsiveness as it automatically changes to work with smaller viewports.

***

<h2 align="center">Installation</h2>

1. Add a link to the main stylesheet in the HEAD of your file
2. Download a copy of `xyz_config.ccs` and place it in your project folder
3. Change the contents of the config file to suit your needs
4. Add a local link to the config file in the HEAD of your file
