import {Easing, proc, set} from 'react-native-reanimated';
import {loop, timing} from './RedashUtilities';

const setShimmerProgressWithoutProc = (
  shimmerProgress,
  totalDuration,
  shimmerProgressClock,
  repeatCount,
  repeatDelay,
  boomerangMode,
) => {
  return set(
    shimmerProgress,
    loop({
      duration: totalDuration,
      easing: Easing.linear,
      clock: shimmerProgressClock,
      repeatCount,
      repeatDelay,
      boomerang: boomerangMode,
    }),
  );
};

const setShimmerProgress = proc(
  (
    shimmerProgress,
    totalDuration,
    shimmerProgressClock,
    repeatCount,
    repeatDelay,
    boomerangMode,
  ) => {
    return set(
      shimmerProgress,
      loop({
        duration: totalDuration,
        easing: Easing.linear,
        clock: shimmerProgressClock,
        repeatCount,
        repeatDelay,
        boomerang: boomerangMode,
      }),
    );
  },
);

const setGradientOpacity = proc((gradientOpacity, clock, to) =>
  set(
    gradientOpacity,
    timing({
      from: gradientOpacity,
      to,
      duration: 225,
      clock: clock,
    }),
  ),
);

const setChildOpacity = proc((childOpacity, clock, to, duration) =>
  set(
    childOpacity,
    timing({
      from: childOpacity,
      to,
      duration,
      easing: Easing.bezier(0.23, 0.07, 0.25, 1),
      clock,
    }),
  ),
);

export {
  setShimmerProgress,
  setGradientOpacity,
  setChildOpacity,
  setShimmerProgressWithoutProc,
};
