import { DIRECTION, END, START } from "./Constants";
import { bInterpolateOverShimmerProgress } from "./RedashUtilities";
import Animated from "react-native-reanimated";

const getPropsForTheDirection = (shimmerProgress, direction, width, height) => {
  let translateX = 0,
    translateY = 0,
    start,
    end;
  switch (direction) {
    case DIRECTION.RIGHT:
      if (typeof width === "number") {
        translateX = bInterpolateOverShimmerProgress(shimmerProgress, width);
      } else {
        console.warn("Required width props for horizontal direction");
      }
      start = START.HORIZONTAL;
      end = END.HORIZONTAL;
      break;
    case DIRECTION.LEFT:
      if (typeof width === "number") {
        translateX = Animated.multiply(
          bInterpolateOverShimmerProgress(shimmerProgress, width),
          -1
        );
      } else {
        console.warn("Required width props for horizontal direction");
      }
      start = START.HORIZONTAL;
      end = END.HORIZONTAL;
      break;
    case DIRECTION.UP:
      if (typeof height === "number") {
        translateY = Animated.multiply(
          bInterpolateOverShimmerProgress(shimmerProgress, height),
          -1
        );
      } else {
        console.warn("Required height props for vertical direction");
      }
      start = START.VERTICAL;
      end = END.VERTICAL;
      break;
    case DIRECTION.DOWN:
      if (typeof height === "number") {
        translateY = bInterpolateOverShimmerProgress(shimmerProgress, height);
      } else {
        console.warn("Required height props for vertical direction");
      }
      start = START.VERTICAL;
      end = END.VERTICAL;
      break;
    default:
      console.warn(
        `Invalid direction ${direction} supplied to ViewPlaceholder must be one of ${Object.keys(
          DIRECTION
        )
          .join(", ")
          .toLowerCase()}`
      );
  }
  return {
    translateX,
    translateY,
    start,
    end,
  };
};

export { getPropsForTheDirection };
