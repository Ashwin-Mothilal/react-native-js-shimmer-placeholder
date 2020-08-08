import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
  setGradientOpacity,
  setShimmerProgress,
  setShimmerProgressWithoutProc,
} from './ReanimatedHelpers';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SHIMMER = {
  SHOW: 1,
  HIDE: 0,
};

const TextPlaceholder = memo(
  ({
    children,
    start,
    end,
    locations,
    baseColor,
    highlightColor,
    show,
    totalDuration,
    textStyle,
    viewBehindMaskStyle,
    gradientStyle,
    style,
    canTriggerAnimationCompletion,
    onAnimationComplete,
    textColor,
    repeatCount,
    repeatDelay,
    boomerangMode,
    canUseProc,
    ...rest
  }) => {
    const [width, setWidth] = useState(0);
    const MaskedView = require('@react-native-community/masked-view').default;
    const [shimmerProgress, gradientOpacity] = useValues([
      0,
      show ? SHIMMER.SHOW : SHIMMER.HIDE,
    ]);
    const translateX = shimmerProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });
    const [
      shimmerProgressClock,
      gradientShowClock,
      gradientHideClock,
    ] = useClocks(3);
    const colorShimmer = [baseColor, highlightColor, baseColor];

    useCode(
      () => [
        cond(
          eq(show, SHIMMER.SHOW),
          [
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
            setGradientOpacity(gradientOpacity, gradientShowClock, 1),
          ],
          [
            stopClock(shimmerProgressClock),
            stopClock(gradientShowClock),
            setGradientOpacity(gradientOpacity, gradientHideClock, 0),
          ],
        ),
      ],
      [
        show,
        shimmerProgressClock,
        shimmerProgress,
        totalDuration,
        gradientOpacity,
        gradientShowClock,
        gradientHideClock,
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

    const renderGradientView = () => {
      return (
        <AnimatedLinearGradient
          start={start}
          end={end}
          locations={locations}
          style={[
            {
              transform: [{translateX}],
              opacity: gradientOpacity,
            },
            TextPlaceholderStyles.gradientStyle,
            gradientStyle,
          ]}
          colors={colorShimmer}
          pointerEvents={'none'}>
          <View style={[TextPlaceholderStyles.maskElementContainer, style]}>
            <Text
              style={[TextPlaceholderStyles.zeroOpacity, textStyle]}
              onLayout={onLayout}
              {...rest}>
              {children}
            </Text>
          </View>
        </AnimatedLinearGradient>
      );
    };

    const renderViewBehindMask = () => {
      return (
        <View
          style={[
            TextPlaceholderStyles.viewBehindMaskStyle,
            {backgroundColor: textColor},
            viewBehindMaskStyle,
          ]}
          pointerEvents={'none'}
        />
      );
    };

    const onLayout = useCallback(({nativeEvent: {layout}}) => {
      setWidth(layout.width);
    }, []);

    return (
      <MaskedView
        maskElement={
          <View style={[TextPlaceholderStyles.maskElementContainer, style]}>
            <Text style={[textStyle]} {...rest}>
              {children}
            </Text>
          </View>
        }
        style={[TextPlaceholderStyles.maskStyle, style]}>
        {renderViewBehindMask()}
        {renderGradientView()}
      </MaskedView>
    );
  },
);

TextPlaceholder.propTypes = {
  baseColor: propTypes.string,
  boomerangMode: propTypes.bool,
  canTriggerAnimationCompletion: propTypes.bool,
  canUseProc: propTypes.bool,
  children: propTypes.string.isRequired,
  end: propTypes.object,
  gradientStyle: propTypes.object,
  highlightColor: propTypes.string,
  locations: propTypes.array,
  onAnimationComplete: propTypes.func,
  repeatCount: propTypes.number,
  repeatDelay: propTypes.number,
  show: propTypes.bool,
  start: propTypes.object,
  style: propTypes.object,
  textColor: propTypes.string,
  textStyle: propTypes.object,
  totalDuration: propTypes.number,
  viewBehindMaskStyle: propTypes.object,
};

TextPlaceholder.defaultProps = {
  baseColor: 'transparent',
  boomerangMode: false,
  canTriggerAnimationCompletion: false,
  canUseProc: true,
  end: {
    x: 1,
    y: 0,
  },
  gradientStyle: {},
  highlightColor: 'white',
  locations: [0, 0.5, 1],
  onAnimationComplete: () => {},
  repeatCount: -1,
  repeatDelay: 0,
  show: true,
  start: {
    x: 0,
    y: 0,
  },
  style: {},
  textColor: '#5F717B',
  textStyle: {},
  totalDuration: 1500,
  viewBehindMaskStyle: {},
};

const TextPlaceholderStyles = StyleSheet.create({
  maskStyle: {
    flex: 1,
  },
  zeroOpacity: {
    opacity: 0,
  },
  gradientStyle: {
    position: 'absolute',
  },
  viewBehindMaskStyle: {
    flex: 1,
    width: '100%',
  },
  maskElementContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export {TextPlaceholder};
