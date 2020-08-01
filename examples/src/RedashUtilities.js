/**
 * Not importing [react-native-redash] [https://github.com/wcandillon/react-native-redash]
 * because it required you react-native-gesture-handler to use these functions
 * Thanks to William Candillion for this beautiful code
 */

import Animated, {Easing, Value} from 'react-native-reanimated';
import {useRef} from 'react';

const {
  Clock,
  block,
  cond,
  stopClock,
  set,
  startClock,
  clockRunning,
  not,
  and,
  timing: reTiming,
} = Animated;

const useConst = (initialValue) => {
  const ref = useRef();
  if (ref.current === undefined) {
    // Box the value in an object so we can tell if it's initialized even if the initializer
    // returns/is undefined
    ref.current = {
      value: typeof initialValue === 'function' ? initialValue() : initialValue,
    };
  }
  return ref.current.value;
};

const useValues = (values) => useConst(() => values.map((v) => new Value(v)));

const useClocks = (numberOfClocks) =>
  useConst(() => new Array(numberOfClocks).fill(0).map(() => new Clock()));

const animate = ({fn, clock, state, config, from}) =>
  block([
    cond(not(clockRunning(clock)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, from),
      startClock(clock),
    ]),
    fn(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);

const timing = ({
  clock = new Clock(),
  from = 0,
  to = 1,
  duration = 250,
  easing = Easing.linear,
}) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    toValue: new Value(0),
    duration,
    easing,
  };

  return block([
    cond(not(clockRunning(clock)), [
      set(config.toValue, to),
      set(state.frameTime, 0),
    ]),
    animate({
      clock,
      fn: reTiming,
      state,
      config,
      from,
    }),
  ]);
};

const loop = ({
  clock = new Clock(),
  easing = Easing.linear,
  duration = 250,
  boomerang = false,
  autoStart = true,
}) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    toValue: new Value(1),
    duration,
    easing,
  };

  return block([
    cond(and(not(clockRunning(clock)), autoStart ? 1 : 0), startClock(clock)),
    reTiming(clock, state, config),
    cond(state.finished, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      boomerang
        ? set(config.toValue, cond(config.toValue, 0, 1))
        : set(state.position, 0),
    ]),
    state.position,
  ]);
};

export {loop, timing, useClocks, useValues};
