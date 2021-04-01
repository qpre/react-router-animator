# react-router-animator

`react-router-animator` is a library that helps you in orchestrating animations in your (you can use whatever animation library for this such as [greensock](https://github.com/greensock/GSAP) or [animate.css](https://animate.style) for which you can use [animatecss-helpers](https://github.com/qpre/animatecss-helpers) to apply styles wiith control)

## Install

`yarn add react-router-animator`

peer dependencies:

`yarn add react react-dom react-router-dom react-transition-group`

## Usage

### Animation Routes

The `<Animator>` component takes a `animationRoutes` parameter,
this parameter expects an object for which each key is a path (eg: '/', '/details') and the respective values define the `from` (entering) and `to` (leaving) transition handler functions.

`from` and `to` objects also expect their keys to be paths (respectively: `from` paths allow you to define specific animations based on the transition's origin path, and `to` paths allow you to define specific animations based on the transition's destination path)

```javascript
const animationRoutes = {
  '/': {
    from: {
      // when: '/details' -> '/', for: '/'
      '/details': enterFromDetailsFunction
    },

    to: {
      // when: '/' -> '/details', for: '/'
      '/details': leaveToDetailsFunction
    }
  },

  '/details': {
    from: {
      // when: '/' -> '/details', for: '/details'
      '/': enterFromHomeFunction
    },

    to: {
      // when: '/details' -> '/', for: '/details'
      '/details': leaveToHomeFunction
    }
  }
};
```

#### defaults

Chances are that you'll want to define the same animations for all routes and only set specific ones for specific routes in your application. To do so, `animationRoutes` accepts a 'default' key at its root or in any `from` and `to` object.

```javascript
const animationRoutes = {
  '/': {
    from: {
      // when: '/details' -> '/', for: '/'
      '/details': enterFromDetailsFunction,
      // when: '* except /details' -> '/', for: '/'
      default: enterFromAnyOtherRoute
    },

    to: {
      // when: '/' -> '/details', for: '/'
      '/details': leaveToDetailsFunction,
      // when: '/' -> '* except /details', for: '/'
      default: leaveToAnyOtherRoute
    }
  },

  '/details': {
    from: {
      // when: '/' -> '/details', for: '/details'
      '/': enterFromHomeFunction
    },

    to: {
      // when: '/details' -> '/', for: '/details'
      '/details': leaveToHomeFunction
    }
  },

  default: {
    from: {
      // when: 'any route that has not been matched by previous handlers' -> 'any route that has not been matched by previous handlers', for: 'any route that has not been matched by previous handlers'
      default: enterFromAnyRoute
    },
    to: {
      // when: 'any route that has not been matched by previous handlers' -> 'any route that has not been matched by previous handlers', for: 'any route that has not been matched by previous handlers'
      default: leaveToAnyRoute
    }
  }
};
```

### <Animator> and location

the `<Animator>` component is a React.Context provider, it will allow multiple routes to exist as its children at a certain time to allow for a smooth transition.
For this to happen there are a few limitations to keep in mind:

- statelessness: two children paths are basically two different subtrees rendered at the time of the transition, state that must survive transition in between routes must be stored above <Animator> in your tree or it _will be lost_.
- location: during transition one of the subtrees needs to render a route for a path that is not the one in your URL bar at that time, luckyly, `<Animator>` provides you a reference on the `location` the subtree was generated for initially, you _must_ make sure that its `children` are refering to this `location` (see next example).

```javascript
export const Routes = const Routes = () => (
  <Animator
    animationRoutes={animationRoutes}
  >
    {({ location }) => (
      <Switch location={location}>
        <Route path="/details">
          <DetailsPage />
        </Route>

        <Route exact path="/">
          <HomePage />
        </Route>

        <Route>
          <NotFoundFoundPage />
        </Route>
      </Switch>
    )}
  </Animator>
);
```

## Examples

### Header + Content separated animations using [animatecss-helpers](https://github.com/qpre/animatecss-helpers)

```javascript
export const headerAnimationRoutes = {
  '/': {
    from: {
      default: ({ node, appears }) => {
        const delay = appears ? 0 : 0.25;

        const nodes = prepare_nodes_for_transition(node.querySelectorAll('[data-transition-header] > *'));

        if (appears) {
          fade_in({
            nodes,
            delay,
            duration: 0.3
          });
        } else {
          fade_in_left({
            nodes,
            delay,
            duration: 0.3
          });
        }
      }
    },

    to: {
      default: ({ node }) => {
        fade_out({
          nodes: prepare_nodes_for_transition(node.querySelectorAll('[data-transition-header] > *')),
          duration: 0.3
        });
      }
    }
  },

  default: {
    from: {
      '/': ({ node, appears }) => {
        const delay = appears ? 0 : 0.25;

        const nodes = prepare_nodes_for_transition(node.querySelectorAll('[data-transition-header] > *'));

        if (appears) {
          fade_in({
            nodes,
            delay,
            duration: 0.3
          });
        } else {
          fade_in_right({
            nodes,
            delay,
            duration: 0.3
          });
        }
      },

      default: ({ node, appears }) => {
        const delay = appears ? 0 : 0.25;

        fade_in({
          nodes: prepare_nodes_for_transition(node.querySelectorAll('[data-transition-header] > *')),
          delay,
          duration: 0.3
        });
      }
    },

    to: {
      '/': ({ node }) => {
        fade_out_right({
          nodes: prepare_nodes_for_transition(node.querySelectorAll('[data-transition-header] > *')),
          duration: 0.3
        });
      },

      default: ({ node }) => {
        fade_out({
          nodes: prepare_nodes_for_transition(node.querySelectorAll('[data-transition-header] > *')),
          duration: 0.3
        });
      }
    }
  }
};

export const contentAnimationRoutes = {
  '/': {
    from: {
      default: ({ node, appears }) => {
        const delay = appears ? 0 : 0.25;

        fade_in({
          delay,
          nodes: prepareNodesForTransition(node.querySelectorAll('[data-transition-page-content] > *')),
          node
        });
      }
    },

    to: {
      default: ({ node }) => {
        fade_out({
          delay,
          nodes: prepareNodesForTransition(node.querySelectorAll('[data-transition-page-content] > *')),
          node
        });
      }
    }
  },

  default: {
    from: {
      '/': ({ node, appears }) => {
        const delay = appears ? 0 : 0.25;

        if (!appears) {
          slide_in_right({
            nodes: prepareNodesForTransition(node.querySelectorAll('[data-transition-page-content] > *')),
            delay,
            duration: 0.3
          });
        }

        fade_in({
          nodes: prepareNodesForTransition(node.querySelectorAll('[data-transition-page-content] > *')),
          delay,
          duration: 0.3
        });
      },

      default: ({ node, appears }) => {
        const delay = appears ? 0 : 0.25;

        fade_in({
          nodes: prepareNodesForTransition(node.querySelectorAll('[data-transition-page-content] > *')),
          delay,
          duration: 0.3
        });
      }
    },

    to: {
      '/': ({ node }) => {
        fade_out_right({
          nodes: prepareNodesForTransition(node.querySelectorAll('[data-transition-page-content] > *')),
          duration: 0.3
        });
      },

      default: ({ node }) => {
        fade_out({
          nodes: prepareNodesForTransition(node.querySelectorAll('[data-transition-page-content] > *')),
          duration: 0.3
        });
      }
    }
  }
};
```

```javascript
// router.js
import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Animator } from 'react-router-animator';

import { headerAnimationRoutes, contentAnimationRoutes } from './animation_routes';

export const Routes = const Routes = () => (
  <Suspense
    fallback={
      <div>loading...</div>
    }
  >
    <header>
      <Animator
        animationRoutes={headerAnimationRoutes}
        disabled={!ANIMATIONS_ENABLED}
      >
        {({ location }) => (
          <Switch location={location}>
            <Route path="/details/:product_id">
              <DetailsHeader />
            </Route>

            <Route exact path="/">
              <HomeHeader />
            </Route>

            <Route>
              <DefaultHeader />
            </Route>
          </Switch>
        )}
      </Animator>
    </header>

    <main
      className="relative flex-1 overflow-x-hidden overflow-y-scroll focus:outline-none "
    >
      <Animator
        animationRoutes={contentAnimationRoutes}
        disabled={!ANIMATIONS_ENABLED}
      >
        {({ location }) => (
          <Switch location={location}>
            <Route path="/details/:product_id">
              <DetailsPage />
            </Route>

            <Route exact path="/">
              <HomePage />
            </Route>
          </Switch>
        )}
      </Animator>
    </main>
  </Suspense>
);
```

## TODO

- Remove tailwind references and use css instead
