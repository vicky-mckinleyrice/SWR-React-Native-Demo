import useSWR from 'swr';
import { useRef, useEffect } from 'react';
import { Platform, AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * swr-react-native
 *
 * This helps you revalidate your SWR calls, based on navigation actions in `react-navigation`.
 */

function useSWRNativeRevalidate(props) {
  var mutate = props.mutate,
      _props$revalidateOnFo = props.revalidateOnFocus,
      revalidateOnFocus = _props$revalidateOnFo === void 0 ? true : _props$revalidateOnFo,
      _props$revalidateOnRe = props.revalidateOnReconnect,
      revalidateOnReconnect = _props$revalidateOnRe === void 0 ? true : _props$revalidateOnRe,
      _props$focusThrottleI = props.focusThrottleInterval,
      focusThrottleInterval = _props$focusThrottleI === void 0 ? 5000 : _props$focusThrottleI;

  var _useNavigation = useNavigation(),
      addListener = _useNavigation.addListener;

  var lastFocusedAt = useRef(null);
  var fetchRef = useRef(mutate);
  useEffect(function () {
    fetchRef.current = mutate;
  });
  var focusCount = useRef(Platform.select({
    // react-navigation fire a focus event on the initial mount, but not on web
    web: 1,
    "default": 0
  }));
  var previousAppState = useRef(AppState.currentState);
  var previousNetworkState = useRef(null);
  useEffect(function () {
    var unsubscribeReconnect = null;

    if (revalidateOnReconnect && Platform.OS !== 'web') {
      // inline require to avoid breaking SSR when window doesn't exist
      var Network = require('@react-native-community/netinfo')["default"]; // SWR does all of this on web.


      unsubscribeReconnect = Network.addEventListener(function (state) {
        var _previousNetworkState;

        if (((_previousNetworkState = previousNetworkState.current) == null ? void 0 : _previousNetworkState.isInternetReachable) === false && state.isConnected && state.isInternetReachable) {
          fetchRef.current();
        }

        previousNetworkState.current = state;
      });
    }

    var onFocus = function onFocus() {
      if (focusCount.current < 1) {
        focusCount.current++;
        return;
      }

      var isThrottled = focusThrottleInterval && lastFocusedAt.current && Date.now() - lastFocusedAt.current <= focusThrottleInterval;

      if (!isThrottled) {
        lastFocusedAt.current = Date.now();
        fetchRef.current();
      }
    };

    var onAppStateChange = function onAppStateChange(nextAppState) {
      if (previousAppState.current.match(/inactive|background/) && nextAppState === 'active' && // swr handles this on web.
      Platform.OS !== 'web') {
        onFocus();
      }

      previousAppState.current = nextAppState;
    };

    var unsubscribeFocus = null;

    if (revalidateOnFocus) {
      unsubscribeFocus = addListener('focus', onFocus);
      AppState.addEventListener('change', onAppStateChange);
    }

    return function () {
      if (revalidateOnFocus) {
        unsubscribeFocus == null ? void 0 : unsubscribeFocus();
        AppState.removeEventListener('change', onAppStateChange);
      }

      if (revalidateOnReconnect) {
        unsubscribeReconnect == null ? void 0 : unsubscribeReconnect();
      }
    };
  }, [addListener, focusThrottleInterval, revalidateOnFocus, revalidateOnReconnect]);
}

var useSWRNative = function useSWRNative(key, fn, config) {
  if (fn === void 0) {
    fn = null;
  }

  var swr = useSWR(key, fn, config);
  useSWRNativeRevalidate({
    mutate: swr.mutate,
    revalidateOnFocus: config == null ? void 0 : config.revalidateOnFocus,
    revalidateOnReconnect: config == null ? void 0 : config.revalidateOnReconnect,
    focusThrottleInterval: config == null ? void 0 : config.focusThrottleInterval
  });
  return swr;
};

export default useSWRNative;
export { useSWRNativeRevalidate };
//# sourceMappingURL=swr-react-native.esm.js.map
