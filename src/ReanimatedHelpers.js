import { Easing, proc, set } from "react-native-reanimated";
import { loop, timing } from "./RedashUtilities";

const setShimmerProgress = proc(
  (shimmerProgress, totalDuration, shimmerProgressClock) => {
    return set(
      shimmerProgress,
      loop({
        duration: totalDuration,
        easing: Easing.linear,
        clock: shimmerProgressClock,
      })
    );
  }
);

const setGradientOpacity = proc((gradientOpacity, clock, to) => {
  return set(
    gradientOpacity,
    timing({
      from: gradientOpacity,
      to,
      duration: 225,
      clock: clock,
    })
  );
});

const setChildOpacity = proc((childOpacity, clock, to, duration) => {
  return set(
    childOpacity,
    timing({
      from: childOpacity,
      to,
      duration,
      easing: Easing.bezier(0.23, 0.07, 0.25, 1),
      clock,
    })
  );
});

export { setShimmerProgress, setGradientOpacity, setChildOpacity };
