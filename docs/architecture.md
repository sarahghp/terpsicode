# Architecture

This is a dump of how the system works as of November 6, 2020.

## `main.js`

`main.js` is the entrypoint for the electron app. The only important item here is `nodeIntegration: true` in the `BrowserWindow` initializer. This lets us access node libraries and read the number of moves in each folder when the application begins.

## `index.html`
`index.html` is the user's interface, containing the app's HTML and CSS. It loads the `renderer.js` script. 

## `renderer.js`
`renderer.js` is where things start to get interesting. This file is devoted to defining and connecting functions that allow the system to read from and write to the interface. 

On load, this file reads information about the images in the `tagged/` directory and passes that information into the main loop via `startYourEngines`.

It defines what happens when the user types a string into the input: loading the parser and parsing text with the `parse` function and then passing it to the main loop via `chomp`.

It also includes some helper functions for the arrow keys.

## `src/`

The rest of the system is contained within the `src/` directory. The primary files here are `loop.js`, which controls the display loop, plus  `danceGrammar.pegjs` and `createParser.js`, which define the commands grammar and create the parser for them, respectively. Examples of commands can be found in `createParser.spec.js`, which also can be run with `npm test`. The parser is created using [PEG.js](https://pegjs.org/) parser generation.

## `loop.js` and the Main Loop

When an input string is parsed in `renderer.js`, the result is an object that includes all the information the loop needs to display the image. The type of command is defined by the `type` field on this object.

The `chomp` function, loaded in `renderer.js`, takes these objects and dispatches them based on their `type`. 

`MOVE` and `SPECIAL` functions generate move objects, with a `fn` and an `adjustment` property. The `adjustment` property is used for odds calculations and will be addressed later. The move `fn` is a generator, which controls the image paths and order and contains all the local state needed for this. It handles local phrasing commands (such as `retrograde 5 jump`). This action object is added to the `imageDisplayFns` list.

The main loop processes the `imageDisplayFns` list. On each cycle, it increments its frame counter and applies any phrasing changes to the global order. It then calls the current action, as defined by the `currentDisplayFns` and `currentFnIndex`. `currentDisplayFns` start off being equal to the `imageDisplayFns` list but can be modified based on global phrasing commands (such as `scramble`).

The current action function, defined as the `fn` on the action, yields the next image path and an indicator to the loop as to whether it can move on to the next action. The loop passes the function global information for its next call — whether the phrasing status has changed globally and the frame number — and assigns the image to the image element in the HTML. 

Finally, if the loop received an indication that it should move to the next action, it checks the action's `adjustment` function to discover if the next function is the very next or if some should be skipped. This `adjustment` is set by an `odds_expression` like `often` or `sometimes`.

As mentioned previously, `PHRASE` type inputs, which signify global `phrasing` calls, such as `scramble` or `random` can change the order of actions in the `currentDisplayFns`. It should incorporate moves after the phrasing is set, so each function operates on the default-ordered `imageDisplayFns`.  When a new type of global phrasing is called, the previous will be removed.

If a local `phrase` is set, an action will always use this in preference to a global phrase. Otherwise, the global `phrase` will be applied locally. For instance, if an action is `accumulation 4 lunge` and it is part of a list with a global `retrograde`, it will still count up even though its place in the loop will be reversed.

The first image loop is started when `renderer.js` calls `startYourEngines` in the `DOMContentLoaded` listener. How fast each round lasts is controlled by the `interval` variable. This starts at 2500ms (2.5s). A `TIMING` type input will stop the loop interval and start another with the new speed.
