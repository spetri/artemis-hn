import { type FC } from 'react';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import {
  Animated,
  Pressable,
  SafeAreaView,
  SectionList,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { type StackParamList } from '../../routers';
import { styles, useDash } from '../../../../dash.config';
import { useAnimateFade } from '../../../hooks/use-animate-fade';

type ListItemType = Array<{
  id: string;
  header: string;
  iconName: string;
  navigate: () => void;
}>;

export const SettingsListView: FC = () => {
  useDash();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const {
    tokens: { color }
  } = useDash();
  const listItems: ListItemType = [
    {
      id: '1',
      header: 'General',
      iconName: 'ios-settings-outline',
      navigate: () => {
        navigation.navigate('General');
      }
    },
    {
      id: '2',
      header: 'Theme',
      iconName: 'ios-moon-outline',
      navigate: () => {
        navigation.navigate('Theme');
      }
    },
    {
      id: '3',
      header: 'App Icon',
      iconName: 'ios-logo-hackernews',
      navigate: () => {
        navigation.navigate('General');
      }
    }
  ];

  const items = (item) => {
    const { fadeIn, fadeOut, animated } = useAnimateFade();

    return <Pressable
      onPressIn={fadeIn}
      onPressOut={fadeOut}
      onPress={item.navigate}
    >
      <Animated.View style={[{ display: 'flex', flexDirection: 'row' }, { opacity: animated }]}>
        <Text style={imageContainer}>
          <Icon name={item.iconName} color={color.textPrimary} size={18} />
        </Text>
        <View style={row()}>
          <Text style={header()}>{item.header}</Text>
        </View>
      </Animated.View>
    </Pressable>
  }

  return (
    <SafeAreaView style={containerBg()}>
      <View style={container()}>
        <SectionList
          ItemSeparatorComponent={() => <View style={listItemSeparatorStyle()} />}
          sections={[{ title: 'Topics', data: listItems }]}
          renderItem={({ item }) => items(item)}
        />
        <Text
          style={version()}
        >
          v{Application.nativeBuildVersion} {Updates.updateId && <>&bull; {Updates.updateId}</>}
        </Text>
      </View>
    </SafeAreaView>
  );
};


const version = styles.one<ViewStyle>((t) => ({
  display: 'flex',
  alignSelf: 'center',
  color: t.color.textAccent,
  fontSize: t.type.size['3xs'],
}));

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%',
  width: '100%'
}));

const row = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  display: 'flex',
  width: '100%',
  paddingVertical: 18
}));

const imageContainer: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignSelf: 'center',
  paddingHorizontal: 10
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  justifyContent: 'center',
  backgroundColor: t.color.bodyBg
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size.sm,
  fontWeight: '500',
  color: t.color.textPrimary
}));

const listItemSeparatorStyle = styles.one<TextStyle>((t) => ({
  height: 0.3,
  width: '100%',
  backgroundColor: t.color.textAccent
}));
