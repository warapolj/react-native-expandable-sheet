import React, { useState, useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

const DragHandle = React.memo(() => (
  <View style={styles.headerContainer}>
    <View style={styles.dragHandle} />
  </View>
));

interface ExpandableProps {
  isExpanded: boolean;
  toggleExpand: () => void;
}

interface ExpandableSheetProps {
  renderExpandedSection: ({
    isExpanded,
    toggleExpand,
  }: ExpandableProps) => React.ReactElement;
  renderCollapsedSection: ({
    isExpanded,
    toggleExpand,
  }: ExpandableProps) => React.ReactElement;
  renderHeader?: () => React.ReactElement;
  draggableThreshold?: number;
  backdropOpacity?: number;
  onMinHeightChange?: (minHeight: number) => void;
}

const ExpandableSheet = ({
  renderExpandedSection,
  renderCollapsedSection,
  renderHeader,
  draggableThreshold = 50,
  backdropOpacity = 0.5,
  onMinHeightChange,
}: ExpandableSheetProps) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const startY = useSharedValue(0);
  const progress = useSharedValue(0);
  const collapsedSnap = useSharedValue(0);

  useEffect(() => {
    collapsedSnap.value = collapsedHeight;
  }, [collapsedHeight, collapsedSnap]);

  const snapTo = (toExpanded: boolean) => {
    progress.value = withSpring(toExpanded ? 1 : 0, { damping: 20 });
    runOnJS(setExpanded)(toExpanded);
  };

  const panGesture = Gesture.Pan()
    .onStart(function () {
      'worklet';
      startY.value = progress.value;
    })
    .onUpdate(function (event) {
      'worklet';
      const h = expandedHeight > 0 ? expandedHeight : 1;
      let next = startY.value - event.translationY / h;
      if (next < 0) next = 0;
      if (next > 1) next = 1;
      progress.value = next;
    })
    .onEnd(function (event) {
      'worklet';
      if (event.velocityY < -draggableThreshold) {
        // เลื่อนขึ้นเร็ว เปิดเลย
        progress.value = withSpring(1, { damping: 20 });
        runOnJS(setExpanded)(true);
      } else if (event.velocityY > draggableThreshold) {
        // เลื่อนลงเร็ว ปิดเลย
        progress.value = withSpring(0, { damping: 20 });
        runOnJS(setExpanded)(false);
      } else if (progress.value > 0.5) {
        progress.value = withSpring(1, { damping: 20 });
        runOnJS(setExpanded)(true);
      } else {
        progress.value = withSpring(0, { damping: 20 });
        runOnJS(setExpanded)(false);
      }
    });

  const animatedExpandedStyle = useAnimatedStyle(() => ({
    height: expandedHeight * progress.value,
    overflow: 'hidden',
  }));

  // Only backdrop should animate pointerEvents/zIndex
  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * backdropOpacity,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    width: '100%',
    height: '100%',
    pointerEvents: progress.value > 0 ? 'auto' : 'none',
  }));

  // Always render the container, let sheet/gesture always be available
  const animatedContainerStyle = useAnimatedStyle(() => ({
    pointerEvents: 'box-none', // always allow children to receive events
    zIndex: 10, // always above background
  }));

  const onExpandedLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setExpandedHeight(h);
    if (progress.value === 0 && h > 0) {
      progress.value = expanded ? 1 : 0;
    }
  };

  const onCollapsedLayout = (e: LayoutChangeEvent) => {
    setCollapsedHeight(e.nativeEvent.layout.height);
  };

  useEffect(() => {
    if (onMinHeightChange) {
      onMinHeightChange(headerHeight + collapsedHeight);
    }
  }, [headerHeight, collapsedHeight, onMinHeightChange]);

  const handleBackdropPress = () => {
    if (progress.value > 0) {
      progress.value = withSpring(0, { damping: 20 });
      setExpanded(false);
    }
  };

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.View
        style={animatedBackdropStyle}
        onTouchEnd={handleBackdropPress}
      />
      <GestureDetector gesture={panGesture}>
        <View style={styles.gestureContainer}>
          <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
            {renderHeader ? renderHeader() : <DragHandle />}
          </View>
          <View
            style={styles.hiddendExpandedSection}
            onLayout={onExpandedLayout}
          >
            {renderExpandedSection({
              isExpanded: expanded,
              toggleExpand: () => snapTo(!expanded),
            })}
          </View>
          <Animated.View
            style={[styles.expandedSection, animatedExpandedStyle]}
          >
            {renderExpandedSection({
              isExpanded: expanded,
              toggleExpand: () => snapTo(!expanded),
            })}
          </Animated.View>
          <View style={styles.collapsedSection} onLayout={onCollapsedLayout}>
            {renderCollapsedSection({
              isExpanded: expanded,
              toggleExpand: () => snapTo(!expanded),
            })}
          </View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
  gestureContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 10,
  },
  hiddendExpandedSection: {
    position: 'absolute',
    width: '100%',
    zIndex: -1,
    opacity: 0,
  },
  expandedSection: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  collapsedSection: {
    backgroundColor: 'white',
    width: '100%',
  },
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 32,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#C0C0C0',
    borderRadius: 2,
  },
});

export default React.memo(ExpandableSheet);
