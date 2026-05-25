import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F7F9' }}>
      <View>
        <Text>Profile Screen</Text>
      </View>
    </SafeAreaView>
  );
}