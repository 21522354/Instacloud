import { View, Pressable, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  onPress?: () => void;
};

export default function Button({ label, onPress }: Props) {
  return (
    <TouchableOpacity
        className="w-11/12 h-12 bg-sky-500 rounded-lg flex items-center justify-center"
        onPress={onPress}
      >
        <Text className="text-white text-lg font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
