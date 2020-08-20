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
  setShimmerProgressWithoutProc,
} from './ReanimatedHelpers';
import {DIRECTION, SHIMMER} from './Constants';
import {getPropsForTheDirection} from './Helpers';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
    onAnimationComplete,
    canTriggerAnimationCompletion,
    repeatCount,
    repeatDelay,
    boomerangMode,
    canUseProc,
    direction,
    ...rest
  }) => {
    const [shimmerProgress, childOpacity, gradientOpacity] = useValues([
      0,
      !show ? SHIMMER.SHOW : SHIMMER.HIDE,
      show ? SHIMMER.SHOW : SHIMMER.HIDE,
    ]);
    const {translateX, translateY, start, end} = getPropsForTheDirection(
      shimmerProgress,
      direction,
      width,
      height,
    );
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
            canUseProc
              ? setShimmerProgress(
                  shimmerProgress,
                  totalDuration,
                  shimmerProgressClock,
                  repeatCount,
                  repeatDelay,
                  boomerangMode,
                )
              : setShimmerProgressWithoutProc(
                  shimmerProgress,
                  totalDuration,
                  shimmerProgressClock,
                  repeatCount,
                  repeatDelay,
                  boomerangMode,
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
          pointerEvents={'none'}>
          <AnimatedLinearGradient
            colors={colorShimmer}
            style={[
              ViewPlaceholderStyles.flexOne,
              {
                transform: [{translateY}, {translateX}],
                backgroundColor: baseColor,
                opacity: gradientOpacity,
                width,
              },
              gradientStyle,
            ]}
            locations={locations}
            start={start}
            end={end}
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
  boomerangMode: propTypes.bool,
  canTriggerAnimationCompletion: propTypes.bool,
  canUseProc: propTypes.bool,
  children: propTypes.any,
  childrenWrapperStyle: propTypes.object,
  direction: propTypes.string,
  end: propTypes.object,
  gradientContainerStyle: propTypes.object,
  gradientStyle: propTypes.object,
  height: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
  highlightColor: propTypes.string,
  locations: propTypes.array,
  onAnimationComplete: propTypes.func,
  repeatCount: propTypes.number,
  repeatDelay: propTypes.number,
  show: propTypes.bool,
  start: propTypes.object,
  style: propTypes.object,
  totalDuration: propTypes.number,
  width: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
};

ViewPlaceholder.defaultProps = {
  baseColor: 'white',
  boomerangMode: false,
  canTriggerAnimationCompletion: true,
  canUseProc: true,
  childrenWrapperStyle: {},
  direction: DIRECTION.RIGHT,
  gradientContainerStyle: {},
  gradientStyle: {},
  height: '100%',
  highlightColor: 'rgba(211,211,211,0.5)',
  locations: [0, 0.5, 1],
  onAnimationComplete: () => {},
  repeatCount: -1,
  repeatDelay: 0,
  show: true,
  style: {},
  totalDuration: 1500,
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
