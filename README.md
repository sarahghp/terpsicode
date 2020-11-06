# terpsicode
a live coding language for dance

## How It Works

The core of the language is the `move`, which comprises a number and a move name:

```
5 jump
```

Typing a `move` into the input and hitting <kbd>enter</kbd> adds the `move` to the end of the current cycle. Using the <kbd>↑</kbd> and <kbd>↓</kbd> keys cycles through previous commands. 

### Timing

Each image in a cycle shows by default for 1s. This timing can be changed using the `speed` command:

```
speed 3
```

where the value is the number of seconds for which the image displays. This can also be a decimal:

```
speed 0.3
```

Special speed commands with a default value are also available: `staccato` (.5s), `sudden` (1s), and  `sustain` (5s).

### Commands

Commands can be used to affect the order in which images are displayed and how often they are displayed. Many commands can be run on both a specific `move` or on the list of `move`s as a whole.

#### Global and Local Commands

```
random
random 5 jump
```

|              |   |
|--------------|---|
| accumulation | shows first image, then first and second, then 1, 2, 3, etc.   |
| deceleration | the reverse of accumulation; shows all images, then all but last, all but last two, etc.  |
| rondo        | shows first image + second image, first image + third image, etc. |
| random       | shows a random image from a list  |
| scramble     | shows all images from a list in a random order  |

#### Local-Only Commands

Local-only commands can only be run on a specific `move` or set of options.

```
sometimes 2 jump
abba 2 jump 5 lunge
```

|           |   |   |
|-----------|---|---|
| often     | shows given `move` 50% of the time  | `often 2 lunge`   |
| sometimes | shows given `move` 25% of the time  |  `sometimes 3 run` |
| coin_flip | chooses between two `move`s | `coin_flip 1 reach 2 run` |
| abba      | shows `move`s in the pattern abba  | `abba 2 jump 5 lunge`  |

These can all be combined with elements from the list of global and local commands:

```
often retrograde 5 jump
```


#### Global-Only Commands

Global-only commands can only be run on the list of `move`s as a whole. Only timings are global-only.

### Running the App

To run the app:   
1. Download the code in this repo as a bundle or fork the repo and use your local version.
2. In the root directory, run `npm i` to install the packages.
3. Run `npm start` to launch the app.

---

Want to learn more about how the language is architected? See [the architecture docs](./docs/architecture.md)


Want to make a live coding language? Look here
https://worldmaking.github.io/workshop_nime_2017/
