# react-native-expandable-sheet

A draggable and expandable bottom sheet component for React Native, built with Reanimated and Gesture Handler.

![Showcase of react-native-expandable-sheet](https://raw.githubusercontent.com/warapolj/react-native-expandable-sheet/main/assets/showcase.gif)

## Installation

```sh
npm install react-native-expandable-sheet
```

## Usage

Please check the [example](https://github.com/warapolj/react-native-expandable-sheet/tree/main/example) folder to explore more example codes.

```js
import ExpandableSheet from 'react-native-expandable-sheet';

export default function App() {
  return (
    <ExpandableSheet
      renderExpandedSection={() => <View />}
      renderCollapsedSection={() => <View />}
      renderHeader={() => <View />}
    />
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) for instructions on contributing and setting up the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
