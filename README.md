# react-native-js-shimmer-placeholder

Shimmering effect using [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated), [react-native-linear-gradient](https://github.com/react-native-community/react-native-linear-gradient) and [react-native-masked-view](https://github.com/react-native-community/react-native-masked-view)

## Demo
![Demo of React Native JS Shimmer Placeholder](https://github.com/Ashwin-Mothilal/react-native-js-shimmer-placeholder/blob/master/example.gif)

## Installation

```
npm install react-native-js-shimmer-placeholder
```

## Usage
To use shimmering effect for View

```javascript
import { ViewPlaceholder } from "react-native-js-shimmer-placeholder";

<ViewPlaceholder show={true} width={100}>
  <View style={{ height: 100, width: 100, backgroundColor: "blue"}} />
</ViewPlaceholder>;
```

To use shimmering effect for Text

```javascript
import { TextPlaceholder } from "react-native-js-shimmer-placeholder";

<TextPlaceholder show={true} textStyle={{marginStart: 10, fontWeight: 'bold',}} maskStyle={{height: 30, flex: 0}}>
  {`${item.first_name} ${item.last_name}`}
</TextPlaceholder>;
```

## Properties

#### Common props for both ViewPlaceholder and TextPlaceholder

| Prop                                | Description                                                      | Default               | 
| :---------------------------------- | ---------------------------------------------------------------- | --------------------: |
| **`baseColor`**                     | The base color of the linear gradient                            | `white`
| **`canTriggerAnimationCompletion`** | Conditional trigger of Animation completion `(useful for lists)` | `true`
| **`end`**                           | Same as the prop used in Linear Gradient                         | `{ x: 1, y:0 }`
| **`gradientStyle`**                 | Style for the Linear Gradient itself                             | `{}`
| **`highlightColor`**                | The highlight color for the shimmer                              | `rgba(211,211,211,0.5)`
| **`locations`**                     | Same as the prop used in Linear Gradient                         | `[0, 0.5, 1]`
| **`onAnimationComplete`**           | Triggers on animation completion                                 | `emptyFn`
| **`show`**                          | Whether to show the shimmer effect                               | `true`
| **`start`**                         | Same as the prop used in Linear Gradient                         | `{ x: 0, y:0 }`
| **`totalDuration`**                 | Duration of the single shimmer cycle                             | `1500`


#### Props only for ViewPlaceholder

| Prop                         | Description                                                                           | Default    |
| :--------------------------- | ------------------------------------------------------------------------------------- | ---------: |
| **`children`**               | Child to render inside placeholder                                                    | `null`
| **`childrenWrapperStyle`**   | Wrapper style for the children                                                        | `{}`
| **`containerStyle`**         | Container style for shimmer which wraps the Linear Gradient and the children you pass | `{}`
| **`gradientContainerStyle`** | Container style for gradient                                                          | `{}`
| **`height`**                 | Height of the shimmer                                                                 | `100%`
| **`width`**                  | Width of the Shimmer                                                                  | `Required`

#### Props only for TextPlaceholder

| Prop                      | Description                                                      | Default |
| :------------------------ | ---------------------------------------------------------------- | ------: |
| **`children`**            | Text to be shimmered                                             | `undefined`
| **`maskStyle`**           | Style for the MaskedView                                         | `{ flex:1 }`
| **`maskedChildrenStyle`** | Children of MaskedView which gives the actual color for the Text | `{ flex:1, backgroundColor:"#5F717B" }`
| **`textStyle`**           | Style for Text to be rendered                                    | `{}`
 

#### Limitation
1. Do not use for more than 5 number of list item because of this react-native-reanimated limitation https://github.com/software-mansion/react-native-reanimated/issues/782

#### TODO List
- [ ] Adding support for Reanimated 2 which will solve the above mentioned limitation

#### Contribution 
Any help to improve the module is appreciated

#### LICENSE
react-native-js-shimmer-placeholder is licensed under [The MIT License](https://github.com/Ashwin-Mothilal/react-native-js-shimmer-placeholder/blob/master/LICENSE)
