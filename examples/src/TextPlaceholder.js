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
import {setGradientOpacity, setShimmerProgress} from './ReanimatedHelpers';

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
    maskedChildrenStyle,
    gradientStyle,
    maskStyle,
    canTriggerAnimationCompletion,
    onAnimationComplete,
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
            setShimmerProgress(
              shimmerProgress,
              totalDuration,
              shimmerProgressClock,
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
          colors={colorShimmer}>
          <Text
            style={[TextPlaceholderStyles.zeroOpacity, textStyle]}
            onLayout={onLayout}>
            {children}
          </Text>
        </AnimatedLinearGradient>
      );
    };

    const renderMaskedChildrenBackground = () => {
      return (
        <View
          style={[
            TextPlaceholderStyles.maskedChildrenStyle,
            maskedChildrenStyle,
          ]}
        />
      );
    };

    const onLayout = useCallback(({nativeEvent: {layout}}) => {
      setWidth(layout.width);
    }, []);

    return (
      <MaskedView
        maskElement={<Text style={[textStyle]}>{children}</Text>}
        style={[TextPlaceholderStyles.maskStyle, maskStyle]}>
        {renderMaskedChildrenBackground()}
        {renderGradientView()}
      </MaskedView>
    );
  },
);

TextPlaceholder.propTypes = {
  baseColor: propTypes.string,
  canTriggerAnimationCompletion: propTypes.bool,
  children: propTypes.string.isRequired,
  end: propTypes.object,
  gradientStyle: propTypes.object,
  highlightColor: propTypes.string,
  locations: propTypes.array,
  maskStyle: propTypes.object,
  maskedChildrenStyle: propTypes.object,
  onAnimationComplete: propTypes.func,
  show: propTypes.bool,
  start: propTypes.object,
  textStyle: propTypes.object,
  totalDuration: propTypes.number,
};

TextPlaceholder.defaultProps = {
  baseColor: 'transparent',
  canTriggerAnimationCompletion: false,
  end: {
    x: 1,
    y: 0,
  },
  gradientStyle: {},
  highlightColor: 'white',
  locations: [0, 0.5, 1],
  maskStyle: {},
  maskedChildrenStyle: {},
  onAnimationComplete: () => {},
  show: true,
  start: {
    x: 0,
    y: 0,
  },
  textStyle: {},
  totalDuration: 1500,
};

const TextPlaceholderStyles = StyleSheet.create({
  container: {},
  maskStyle: {
    flex: 1,
  },
  zeroOpacity: {
    opacity: 0,
  },
  gradientStyle: {
    position: 'absolute',
  },
  maskedChildrenStyle: {
    flex: 1,
    backgroundColor: '#5F717B',
  },
});

export {TextPlaceholder};
