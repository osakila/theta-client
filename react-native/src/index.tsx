import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package '@osakila/theta-client-private-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ThetaClientReactNative = NativeModules.ThetaClientReactNative
  ? NativeModules.ThetaClientReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/** theta frame event name */
export const THETA_EVENT_NAME = ThetaClientReactNative.DEFAULT_EVENT_NAME;

export * from './theta-repository';
export * from './theta-repository/options';
export * from './capture';
