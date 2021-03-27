import React, { useEffect, useState } from "react";
import { Route, useHistory, useLocation } from "react-router-dom";
import { Transition, TransitionGroup } from "react-transition-group";

const log_transition = ({ direction, from, to }) => {
  console.log("ANIMATE", direction, "from ", from, "->", to);
};

const Animator = ({
  animationRoutes = {},
  children,
  timeout_in = 1000,
  timeout_out = 1000,
  disabled = false,
}) => {
  const history = useHistory();
  const { pathname: new_pathname } = useLocation();
  const [previous_pathname, set_previous_pathname] = useState();

  useEffect(() => {
    if (previous_pathname !== new_pathname) {
      set_previous_pathname(new_pathname);
    }
  }, [new_pathname, previous_pathname]);

  const animateIn = ({ location, node, appears }) => {
    const { pathname } = location;

    // log_transition({
    //   direction: 'IN',
    //   from: previous_pathname,
    //   to: pathname,
    // });

    const animateFunction = (() => {
      const fromPathname = previous_pathname;
      const animator =
        animationRoutes[pathname]?.from?.[fromPathname] ||
        animationRoutes[pathname]?.from?.default ||
        animationRoutes.default?.from?.[fromPathname] ||
        animationRoutes.default?.from?.default;

      return animator;
    })();

    if (!animateFunction) {
      return;
    }

    animateFunction({ node, appears });
  };

  const animateOut = ({ location, node, appears }) => {
    const { pathname } = location;

    // log_transition({
    //   direction: 'OUT',
    //   from: pathname,
    //   to: history?.location?.pathname,
    // });

    const animateFunction = (() => {
      const toPathname = history?.location?.pathname;
      const animator =
        animationRoutes[pathname]?.to?.[toPathname] ||
        animationRoutes[pathname]?.to?.default ||
        animationRoutes.default?.to?.[toPathname] ||
        animationRoutes.default?.to?.default;

      return animator;
    })();

    if (!animateFunction) {
      return;
    }

    animateFunction({ node, appears });
  };

  return (
    <Route
      // here we make a closure keeping the 'location' attribute from the route's render
      render={({ location }) => {
        const { key } = location;

        return disabled ? (
          <div className="absolute inset-x-0">{children(location)}</div>
        ) : (
          <TransitionGroup component={null}>
            <Transition
              key={key}
              appear={true}
              onEnter={(node, appears) =>
                animateIn({ location, node, appears })
              }
              onExit={(node, appears) =>
                animateOut({ location, node, appears })
              }
              timeout={{ enter: timeout_in, exit: timeout_out }}
            >
              <div className={`absolute inset-x-0`}>
                {children({ location })}
              </div>
            </Transition>
          </TransitionGroup>
        );
      }}
    />
  );
};

export default Animator;
