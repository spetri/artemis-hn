import { useActionSheet } from '@expo/react-native-action-sheet';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import { Dialog, ListItem } from '@rneui/themed';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles, useDash } from './../../../dash.config';
import {
  AllStack,
  HomeStack,
  type StackParamList,
} from './../../../src/screens/routers';
import { Stories } from './../../../src/screens/Stories/Stories';
import { User } from './../../../src/screens/User/User';
import { Browser } from './../../../src/screens/Browser/Browser';
import { Home } from './../../../src/screens/Home/Home';
import { Thread } from './../../../src/screens/Thread/Thread';
import { listItems, usePreferencesStore } from './../../../src/contexts/store';

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [switcher, setSwitcher] = useState(false);
  const displayLargeThumbnails = usePreferencesStore((state) => state.displayLargeThumbnails);
  const setDisplayLargeThumbnails = usePreferencesStore((state) => state.setDisplayLargeThumbnails);

  const actionSheet = useActionSheet();
  const {
    tokens: { color }
  } = useDash();

  const Items = (topic) => {
    return <TouchableHighlight underlayColor={color.accentLight}
      key={topic.id}
      onPress={() => {
        setSwitcher(false);
        navigation.navigate('Stories', topic?.filter ? {
          filter: topic?.filter
        } : { filter: "home" });
      }}
    >
      <View>
        <ListItem style={borderBottom()}>
          <ListItem.Content>
            <ListItem.Title>{topic.header}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    </TouchableHighlight>
  }

  const screenHeader = () => {
    return (
      <>
        <TouchableHighlight underlayColor={color.accentLight}
          onPress={() => {
            setSwitcher(true);
          }}
        >
          <View style={switcherView()}>
            <Text style={switcherText()}>Stories</Text>
            <IoniconIcon
              color={color.textPrimary}
              size={16}
              style={switcherIcon()}
              name="chevron-down-outline"
            />
          </View>
        </TouchableHighlight>
        <Dialog
          isVisible={switcher}
          onBackdropPress={() => {
            setSwitcher(false);
          }}
        >
          <Dialog.Title title="Switch HN" />
          {listItems.map((topic) => Items(topic))}
        </Dialog>
      </>
    );
  };

  const actionSheetOptions = () => {
    const largeThumbnailText = displayLargeThumbnails ? 'Compact Posts' : 'Large Thumbnails';
    actionSheet.showActionSheetWithOptions(
      {
        options: [largeThumbnailText, 'Cancel'],
        userInterfaceStyle: 'dark',
        tintIcons: true
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0: {
            setDisplayLargeThumbnails(!displayLargeThumbnails);
            return;
          }
          case 1: {
            return;
          }
        }
      }
    );
  };

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: color.primary as string,
        headerStyle: {
          backgroundColor: color.headerBg as string,
        },
        headerTitleStyle: {
          color: color.textPrimary as string,
          borderBottomColor: color.amber100,
        }
      }}
    >
      <HomeStack.Screen name="Select" component={Home} initialParams={{ filter: 'home' }} />
      <AllStack.Screen
        name="Stories"
        component={Stories}
        initialParams={{ filter: 'top' }}
        options={{
          headerTitle: () => screenHeader(),
          headerRight: () => (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TouchableHighlight underlayColor={color.accentLight} onPress={actionSheetOptions}>
                <View>
                  <IoniconIcon name="ellipsis-horizontal" style={{ color: color.primary }} size={30} />
                </View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor={color.accentLight} onPress={actionSheetOptions}>
                <View>
                  <IoniconIcon name="chevron-forward" style={{ color: color.primary }} size={30} />
                </View>
              </TouchableHighlight>
            </View>
          )
        }}
      />
      <HomeStack.Screen name="User" component={User} />
      <HomeStack.Screen name="Thread" component={Thread} />
      <HomeStack.Group screenOptions={{ presentation: 'modal' }}>
        <HomeStack.Screen name="Browser" component={Browser} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
}

const switcherView = styles.one<ViewStyle>(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const switcherText = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size.base,
  fontWeight: '600',
  color: t.color.textPrimary
}));

const switcherIcon = styles.one<ViewStyle>(() => ({
  marginLeft: 3
}));

const borderBottom = styles.one<ViewStyle>((t) => ({
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accentLight
}));