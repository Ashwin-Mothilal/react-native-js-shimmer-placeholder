import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import propTypes from 'prop-types';
import Animated, {
  and,
  call,
  cond,
  eq,
  stopClock,
  useCode,
} from 'react-native-reanimated';
import {useClocks, useValues} from './RedashUtilities';
import {
  setChildOpacity,
  setGradientOpacity,
  setShimmerProgress,
} from './ReanimatedHelpers';

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
    style,
    gradientStyle,
    childrenWrapperStyle,
    totalDuration,
    gradientContainerStyle,
    start,
    end,
    onAnimationComplete,
    canTriggerAnimationCompletion,
    rest,
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
            setShimmerProgress(
              shimmerProgress,
              totalDuration,
              shimmerProgressClock,
            ),
            setChildOpacity(childOpacity, childHideOpacityClock, 0, 225),
            setGradientOpacity(gradientOpacity, gradientShowClock, 1),
          ],
          [
            stopClock(childHideOpacityClock),
            stopClock(gradientShowClock),
            setChildOpacity(childOpacity, childShowOpacityClock, 1, 500),
            setGradientOpacity(gradientOpacity, gradientHideClock, 0),
            stopClock(shimmerProgressClock),
          ],
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
      ],
    );

    useCode(
      () =>
        cond(
          and(eq(show, SHIMMER.HIDE), eq(1, canTriggerAnimationCompletion)),
          call([], onAnimationComplete),
        ),
      [onAnimationComplete, show, canTriggerAnimationCompletion],
    );

    return (
      <View
        style={[
          {
            height,
            width,
          },
          style,
        ]}
        pointerEvents={'box-none'}>
        <View
          style={[
            ViewPlaceholderStyles.gradientContainer,
            StyleSheet.absoluteFill,
            gradientContainerStyle,
          ]}
          pointerEvents={'box-none'}>
          <AnimatedLinearGradient
            colors={colorShimmer}
            style={[
              ViewPlaceholderStyles.flexOne,
              {
                transform: [{translateX}],
                backgroundColor: baseColor,
                opacity: gradientOpacity,
                width,
              },
              gradientStyle,
            ]}
            locations={locations}
            start={start}
            end={end}
            pointerEvents={'none'}
          />
        </View>
        <Animated.View
          style={[{opacity: childOpacity}, childrenWrapperStyle]}
          {...rest}>
          {children}
        </Animated.View>
      </View>
    );
  },
);

ViewPlaceholder.propTypes = {
  baseColor: propTypes.string,
  canTriggerAnimationCompletion: propTypes.bool,
  children: propTypes.any,
  childrenWrapperStyle: propTypes.object,
  style: propTypes.object,
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
  baseColor: 'white',
  canTriggerAnimationCompletion: true,
  end: {
    x: 1,
    y: 0,
  },
  height: '100%',
  highlightColor: 'rgba(211,211,211,0.5)',
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
    overflow: 'hidden',
  },
});

export {ViewPlaceholder};
