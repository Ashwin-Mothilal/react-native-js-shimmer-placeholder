import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import propTypes from "prop-types";
import Animated, {
  and,
  call,
  cond,
  Easing,
  eq,
  set,
  stopClock,
  useCode,
} from "react-native-reanimated";
import { useClocks, useValues, loop, timing } from "./RedashUtilities";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SHIMMER = {
  SHOW: 1,
  HIDE: 0,
};

const ViewPlaceholder = memo(
  ({
    width,
    height,
    locations,
    children,
    show,
    baseColor,
    highlightColor,
    containerStyle,
    gradientStyle,
    childrenWrapperStyle,
    totalDuration,
    gradientContainerStyle,
    start,
    end,
    onAnimationComplete,
    canTriggerAnimationCompletion,
  }) => {
    const [shimmerProgress, childOpacity, gradientOpacity] = useValues([
      0,
      !show ? SHIMMER.SHOW : SHIMMER.HIDE,
      show ? SHIMMER.SHOW : SHIMMER.HIDE,
    ]);
    const translateX = shimmerProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });
    const [
      gradientShowClock,
      shimmerProgressClock,
      childHideOpacityClock,
      childShowOpacityClock,
      gradientHideClock,
    ] = useClocks(5);
    const colorShimmer = [baseColor, highlightColor, baseColor];

    useCode(
      () =>
        cond(
          eq(show, SHIMMER.SHOW),
          [
            stopClock(childShowOpacityClock),
            stopClock(gradientHideClock),
            set(
              shimmerProgress,
              loop({
                duration: totalDuration,
                easing: Easing.linear,
                clock: shimmerProgressClock,
              })
            ),
            set(
              childOpacity,
              timing({
                from: childOpacity,
                to: 0,
                duration: 225,
                easing: Easing.bezier(0.23, 0.07, 0.25, 1),
                clock: childHideOpacityClock,
              })
            ),
            set(
              gradientOpacity,
              timing({
                from: gradientOpacity,
                to: 1,
                duration: 225,
                clock: gradientShowClock,
              })
            ),
          ],
          [
            stopClock(childHideOpacityClock),
            stopClock(gradientShowClock),
            set(
              childOpacity,
              timing({
                from: childOpacity,
                to: 1,
                duration: 500,
                easing: Easing.bezier(0.23, 0.07, 0.25, 1),
                clock: childShowOpacityClock,
              })
            ),
            set(
              gradientOpacity,
              timing({
                from: gradientOpacity,
                to: 0,
                duration: 225,
                clock: gradientHideClock,
              })
            ),
            stopClock(shimmerProgressClock),
          ]
        ),
      [
        totalDuration,
        show,
        shimmerProgress,
        shimmerProgressClock,
        childOpacity,
        gradientOpacity,
        childHideOpacityClock,
        childShowOpacityClock,
        gradientHideClock,
        gradientShowClock,
      ]
    );

    useCode(
      () =>
        cond(
          and(eq(show, SHIMMER.HIDE), eq(1, canTriggerAnimationCompletion)),
          call([], onAnimationComplete)
        ),
      [onAnimationComplete, show, canTriggerAnimationCompletion]
    );

    return (
      <View
        style={[
          {
            height,
            width,
          },
          containerStyle,
        ]}
      >
        <View
          style={[
            ViewPlaceholderStyles.gradientContainer,
            StyleSheet.absoluteFill,
            gradientContainerStyle,
          ]}
        >
          <AnimatedLinearGradient
            colors={colorShimmer}
            style={[
              ViewPlaceholderStyles.flexOne,
              {
                transform: [{ translateX }],
                backgroundColor: baseColor,
                opacity: gradientOpacity,
                width,
              },
              gradientStyle,
            ]}
            locations={locations}
            start={start}
            end={end}
            pointerEvents={"none"}
          />
        </View>
        <Animated.View
          style={[{ opacity: childOpacity }, childrenWrapperStyle]}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
);

ViewPlaceholder.propTypes = {
  baseColor: propTypes.string,
  canTriggerAnimationCompletion: propTypes.bool,
  children: propTypes.any,
  childrenWrapperStyle: propTypes.object,
  containerStyle: propTypes.object,
  end: propTypes.object,
  gradientContainerStyle: propTypes.object,
  gradientStyle: propTypes.object,
  height: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
  highlightColor: propTypes.string,
  locations: propTypes.array,
  onAnimationComplete: propTypes.func,
  show: propTypes.bool,
  start: propTypes.object,
  totalDuration: propTypes.number,
  width: propTypes.number.isRequired,

  // TODO: items
  /*repeatCount: propTypes.number,
  repeatDelay: propTypes.number,
  repeatMode: propTypes.string,
  shimmerAnimationConfig: propTypes.object,*/
};

ViewPlaceholder.defaultProps = {
  baseColor: "white",
  canTriggerAnimationCompletion: true,
  children: null,
  childrenWrapperStyle: {},
  containerStyle: {},
  end: {
    x: 1,
    y: 0,
  },
  gradientContainerStyle: {},
  gradientStyle: {},
  height: "100%",
  highlightColor: "rgba(211,211,211,0.5)",
  locations: [0, 0.5, 1],
  onAnimationComplete: () => {},
  show: true,
  start: {
    x: 0,
    y: 0,
  },
  totalDuration: 1500,

  // TODO: items
  /*repeatCount: -1,
  repeatDelay: 0,
  shimmerAnimationConfig: {},*/
};

const ViewPlaceholderStyles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  gradientContainer: {
    overflow: "hidden",
  },
});

export { ViewPlaceholder };
