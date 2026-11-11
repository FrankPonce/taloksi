// Stand-in for @expo/vector-icons when the art is rendered on Node (see render_readme_art.js).
// The README pictures draw no icons, so an empty component is enough.
const Empty = () => null;
// Also stands in for react-native's native-only internals, which the web build never calls.
module.exports = Object.assign(() => Empty, { Ionicons: Empty, MaterialCommunityIcons: Empty, default: () => Empty });
