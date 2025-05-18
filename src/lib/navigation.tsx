import React from 'react';

type Screen = {
  name: string;
  component: JSX.Element | (() => JSX.Element);
  options: any;
};

export function createNavigator(
  {Navigator, Screen}: {Navigator: any; Screen: any},
  defaultScreens: Screen[] = [],
  defaultProps = {},
) {
  return function ANavigator({screens = defaultScreens as any, ...props}) {
    return (
      <Navigator
        initialRouteName={screens[0].name}
        {...defaultProps}
        {...props}>
        {screens.map((screen: any) => (
          <Screen key={screen.name} {...screen} />
        ))}
      </Navigator>
    );
  };
}
