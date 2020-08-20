/**
 * Not importing [react-native-redash] [https://github.com/wcandillon/react-native-redash]
 * because it required you react-native-gesture-handler to use these functions
 * Thanks to William Candillion for this beautiful code
 */

import Animated, {
  add,
  Easing,
  greaterThan,
  lessThan,
  Value,
} from "react-native-reanimated";
import { useRef } from "react";

const {
  Clock,
  block,
  cond,
  stopClock,
  set,
  startClock,
  clockRunning,
  not,
  timing: reTiming,
} = Animated;

const useConst = (initialValue) => {
  const ref = useRef();
  if (ref.current === undefined) {
    // Box the value in an object so we can tell if it's initialized even if the initializer
    // returns/is undefined
    ref.current = {
      value: typeof initialValue === "function" ? initialValue() : initialValue,
    };
  }
  return ref.current.value;
};

const useValues = (values) => useConst(() => values.map((v) => new Value(v)));

const useClocks = (numberOfClocks) =>
  useConst(() => new Array(numberOfClocks).fill(0).map(() => new Clock()));

const animate = ({ fn, clock, state, config, from }) =>
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

const delay = (node, duration) => {
  const clock = new Clock();
  return block([
    timing({ clock, from: 0, to: 1, duration }),
    cond(not(clockRunning(clock)), node),
  ]);
};

const loop = ({
  clock = new Clock(),
  easing = Easing.linear,
  duration = 250,
  boomerang = false,
  repeatCount = new Value(-1),
  repeatDelay = 0,
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
  const currentRepeatCount = new Value(0);

  const runLoopAnimation = block([
    cond(not(clockRunning(clock)), startClock(clock)),
    reTiming(clock, state, config),
    cond(state.finished, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      delay(
        block([
          set(currentRepeatCount, add(currentRepeatCount, 1)),
          cond(
            boomerang,
            [set(config.toValue, cond(config.toValue, 0, 1))],
            [set(state.position, 0)]
          ),
        ]),
        repeatDelay
      ),
    ]),
    state.position,
  ]);

  return cond(
    greaterThan(repeatCount, -1),
    [
      cond(
        lessThan(currentRepeatCount, repeatCount),
        [runLoopAnimation],
        [stopClock(clock), 0]
      ),
    ],
    [runLoopAnimation]
  );
};

const bInterpolateOverShimmerProgress = (progress, value) => {
  return progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-value, value],
  });
};

export { loop, timing, useClocks, useValues, bInterpolateOverShimmerProgress };
