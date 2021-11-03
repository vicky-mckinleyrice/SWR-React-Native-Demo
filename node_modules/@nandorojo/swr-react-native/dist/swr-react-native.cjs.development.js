'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var useSWR = _interopDefault(require('swr'));
var react = require('react');
var reactNative = require('react-native');
var native = require('@react-navigation/native');

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

  var _useNavigation = native.useNavigation(),
      addListener = _useNavigation.addListener;

  var lastFocusedAt = react.useRef(null);
  var fetchRef = react.useRef(mutate);
  react.useEffect(function () {
    fetchRef.current = mutate;
  });
  var focusCount = react.useRef(reactNative.Platform.select({
    // react-navigation fire a focus event on the initial mount, but not on web
    web: 1,
    "default": 0
  }));
  var previousAppState = react.useRef(reactNative.AppState.currentState);
  var previousNetworkState = react.useRef(null);
  react.useEffect(function () {
    var unsubscribeReconnect = null;

    if (revalidateOnReconnect && reactNative.Platform.OS !== 'web') {
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
      reactNative.Platform.OS !== 'web') {
        onFocus();
      }

      previousAppState.current = nextAppState;
    };

    var unsubscribeFocus = null;

    if (revalidateOnFocus) {
      unsubscribeFocus = addListener('focus', onFocus);
      reactNative.AppState.addEventListener('change', onAppStateChange);
    }

    return function () {
      if (revalidateOnFocus) {
        unsubscribeFocus == null ? void 0 : unsubscribeFocus();
        reactNative.AppState.removeEventListener('change', onAppStateChange);
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

exports.default = useSWRNative;
exports.useSWRNativeRevalidate = useSWRNativeRevalidate;
//# sourceMappingURL=swr-react-native.cjs.development.js.map
