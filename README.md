# Angular Snake Game

This is my attempt to create a very basic snake game fully in Angular 2 (Angular 17).

The games is implemented simply with Angular components, no fancy Canvas API, WebGL or anything. Basically you can
think of it as a normal SPA that manipulates DOM.

Please note, that I created it more as a proof of concept in my free time after work to experiment and get more practice with Angular. This is in no way an actual completed game and probably will never be.

## Playable demo in your browser

The latest version of the game is deployed to GitHub Pages and you are very welcome to take a look at it over [here](https://ipasechnikov.github.io/angular-snake-game/).

Game's layout and controls are optimized both for desktop and mobile devices.

## Game controls

There are 2 different sets of controls depending whether you are on desktop or mobile.

### Desktop

| Action   | Controls           |
| -------- | ------------------ |
| Movement | WASD or arrow keys |
| Pause    | Space              |

### Mobile

| Action   | Controls |
| -------- | -------- |
| Movement | Swipe    |

## Build and run

Being a standard Angular app, the same well-established build and run process is used. Just run the following command to start dev server:

```shell
npm run start
```

Navigate to `http://localhost:4200/` where you can find and play the game.

## TODO

A list of features I would like to implement in the future. Again, I am not sure if I ever will implement them. So I guess it is mostly some sort of a note or reminder to myself in case I will decide to continue my work on it.

- [ ] Snake collision detection with its own body
- [ ] Score counter
- [ ] Dynamic and manual speed adjustment
