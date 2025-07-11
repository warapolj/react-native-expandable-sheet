import ExpandableSheet from 'react-native-expandable-sheet';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';

export default function App() {
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [collapsedItems, setCollapsedItems] = useState(1);
  const [isVisibleCustomHeader, setIsVisibleCustomHeader] = useState(false);
  const [backdropOpacity, setBackdropOpacity] = useState(0.5);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <FlatList
          data={Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item}</Text>
            </View>
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom }]}
        />
        <ExpandableSheet
          renderHeader={
            isVisibleCustomHeader
              ? () => (
                  <View style={styles.customHeader}>
                    <Text style={styles.customHeaderText}>Custom Header</Text>
                  </View>
                )
              : undefined
          }
          renderExpandedSection={() => (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedTitle}>Expanded Section</Text>
              <Text style={styles.expandedDescription}>
                Here are more details about this section. You can add any
                content here, such as images, buttons, or forms.
              </Text>
              <View style={styles.expandedRow}>
                <View style={styles.expandedItem}>
                  <Text style={styles.expandedLabel}>Status</Text>
                  <Text style={styles.expandedValue}>Active</Text>
                </View>
                <View style={styles.expandedItem}>
                  <Text style={styles.expandedLabel}>Items</Text>
                  <Text style={styles.expandedValue}>40</Text>
                </View>
                <View style={styles.expandedItem}>
                  <Text style={styles.expandedLabel}>Owner</Text>
                  <Text style={styles.expandedValue}>John Doe</Text>
                </View>
              </View>
            </View>
          )}
          renderCollapsedSection={({ toggleExpand, isExpanded }) => (
            <View style={styles.collapsedSection}>
              <Text style={styles.collapsedTitle}>Collapsed Section</Text>
              <Text style={styles.collapsedDescription}>
                Tap to expand and see more details.
              </Text>
              <FlatList
                data={Array.from({ length: collapsedItems }, (_, i) => i)}
                keyExtractor={(item) => `collapsed-${item}`}
                renderItem={({ item }) => (
                  <Text style={styles.collapsedItem}>
                    {`Collapsed Item ${item + 1}`}
                  </Text>
                )}
                style={styles.collapsedList}
              />
              <View style={styles.collapsedButtonRow}>
                <Pressable
                  onPress={() => setCollapsedItems(collapsedItems + 1)}
                  style={styles.addButton}
                >
                  <Text style={styles.buttonText}>Add Item</Text>
                </Pressable>
                <Pressable
                  onPress={() => setCollapsedItems(collapsedItems - 1)}
                  style={styles.removeButton}
                >
                  <Text style={styles.buttonText}>Remove Item</Text>
                </Pressable>
                <Pressable style={styles.expandButton} onPress={toggleExpand}>
                  <Text style={styles.buttonText}>
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.changeHeaderButton}
                  onPress={() =>
                    setIsVisibleCustomHeader(!isVisibleCustomHeader)
                  }
                >
                  <Text style={styles.buttonText}>Change Header</Text>
                </Pressable>
              </View>
              <View style={styles.backdropRow}>
                <Pressable
                  onPress={() =>
                    setBackdropOpacity(Math.max(0, backdropOpacity - 0.1))
                  }
                  style={styles.backdropButton}
                >
                  <Text style={styles.buttonText}>-</Text>
                </Pressable>
                <View style={styles.backdropValueContainer}>
                  <Text style={styles.backdropValueText}>
                    Backdrop Opacity: {backdropOpacity.toFixed(2)}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    setBackdropOpacity(Math.min(1, backdropOpacity + 0.1))
                  }
                  style={styles.backdropButton}
                >
                  <Text style={styles.buttonText}>+</Text>
                </Pressable>
              </View>
            </View>
          )}
          onMinHeightChange={setPaddingBottom}
          backdropOpacity={backdropOpacity}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingTop: 16,
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customHeader: {
    backgroundColor: '#4a90e2',
    padding: 16,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  customHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  expandedSection: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expandedDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  expandedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expandedItem: {
    alignItems: 'center',
    flex: 1,
  },
  expandedLabel: {
    fontSize: 12,
    color: '#888',
  },
  expandedValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  collapsedSection: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 32,
  },
  collapsedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  collapsedDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  collapsedList: {
    marginBottom: 12,
  },
  collapsedItem: {
    fontSize: 13,
    color: '#444',
    paddingVertical: 2,
  },
  collapsedButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 8,
    borderRadius: 6,
  },
  removeButton: {
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 6,
  },
  expandButton: {
    backgroundColor: '#2196f3',
    padding: 8,
    borderRadius: 6,
  },
  changeHeaderButton: {
    backgroundColor: '#ff9800',
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  backdropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  backdropButton: {
    backgroundColor: '#607d8b',
    padding: 8,
    borderRadius: 6,
  },
  backdropValueContainer: {
    marginHorizontal: 12,
  },
  backdropValueText: {
    fontSize: 13,
    color: '#333',
  },
});
