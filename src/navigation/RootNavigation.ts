// src/navigation/RootNavigation.ts
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn('Navigation not ready');
  }
}

export function reset(args: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.reset(args));
  } else {
    console.warn('Navigation not ready');
  }
}
