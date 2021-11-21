import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withTiming
} from 'react-native-reanimated';
import { PinchGestureHandler } from 'react-native-gesture-handler';

import { ColorPicker } from './components/ColorPicker';

const COLORS = [
  'red',
  'purple',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'black',
  'white',
]

const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)'

const { width } = Dimensions.get('window');

const CIRCLE_SIZE = width * 0.8;
const PICKER_WIDTH = width * 0.9;


export default function App() {
  const pickedColor = useSharedValue(COLORS[0]);
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withTiming(1);
    },
  });

  const onColorChanged = useCallback((color) => {
    'worklet';
    pickedColor.value = color;
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
      transform: [
        { scale: scale.value },
      ],
    };
  });

  return (
    <>
      <PinchGestureHandler
        onGestureEvent={pinchHandler}
      >
        <Animated.View style={styles.topContainer}>
          <Animated.View style={[styles.circle, rStyle]} />
        </Animated.View>
      </PinchGestureHandler>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
          maxWidth={PICKER_WIDTH}
          onColorChanged={onColorChanged}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  gradient: { height: 40, width: PICKER_WIDTH, borderRadius: 20 },
});
