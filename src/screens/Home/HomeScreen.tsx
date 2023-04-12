import IoniconIcon from 'react-native-vector-icons/Ionicons';
import { shallow } from 'zustand/shallow';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Text, TextStyle, TouchableHighlight, View, ViewStyle } from 'react-native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles, useDash } from './../../../dash.config';
import { HomeStack, type StackParamList } from './../../../src/screens/routers';
import { listItems, usePreferencesStore } from './../../../src/contexts/store';
import { HackerNews } from '../../enums/enums';
import { Thread } from '../Thread/Thread';
import { Stories } from '../Stories/Stories';
import { Home } from './Home';
import { UserScreen } from '../User/UserScreen';
import { Browser } from '../Browser/Browser';
import { useActionSheet } from '@expo/react-native-action-sheet';

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [filter, setFilter] = useState('');
  const { cachedThreadId, storyTitle } = usePreferencesStore(
    (state) => ({
      cachedThreadId: state.cachedThreadId,
      storyTitle: state.storyTitle
    }),
    shallow
  );
  const {
    tokens: { color }
  } = useDash();

  const navigateBackToThread = () => navigation.navigate('Thread', { id: cachedThreadId ?? 0 });

  const screenHeader = () => {
    const actionSheet = useActionSheet();

    const actionSheetOptions = () => {
      actionSheet.showActionSheetWithOptions(
        {
          options: listItems.map((topic) => topic.header),
          userInterfaceStyle: 'dark',
          tintIcons: true
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0: {
              navigation.navigate('Stories', { filter: HackerNews.HOME });
              setFilter('Front Page');
              return;
            }
            case 1: {
              navigation.navigate('Stories', { filter: HackerNews.BEST });
              setFilter('Popular');
              return;
            }
            case 2: {
              navigation.navigate('Stories', { filter: HackerNews.NEW });
              setFilter('New');
              return;
            }
            case 3: {
              navigation.navigate('Stories', { filter: HackerNews.SHOW });
              setFilter('Show');
              return;
            }
            case 4: {
              navigation.navigate('Stories', { filter: HackerNews.ASK });
              setFilter('Ask');
              return;
            }
            case 5: {
              navigation.navigate('Stories', { filter: HackerNews.JOB });
              setFilter('Jobs');
              return;
            }
            case 6: {
              return;
            }
          }
        }
      );
    };

    return (
      <TouchableHighlight underlayColor={color.accentLight} onPress={actionSheetOptions}>
        <View style={switcherView()}>
          <IoniconIcon
            color={color.textPrimary}
            size={32}
            style={filterIcon()}
            name="ios-filter-outline"
          />
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: color.primary as string,
        headerStyle: {
          shadowColor: color.accentLight, // this covers iOS
          backgroundColor: color.headerBg as string
        },
        headerTitleStyle: {
          color: color.textPrimary as string
        },
        gestureResponseDistance: 100
      }}
    >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen
        name="Stories"
        component={Stories}
        initialParams={{ filter: HackerNews.TOP }}
        options={{
          headerTitle: () => <Text style={switcherText()}>{filter ? filter : storyTitle}</Text>,
          headerRight: () => (
            <View style={rightIcons()}>
              {screenHeader()}
              {!!cachedThreadId && (
                <TouchableHighlight
                  underlayColor={color.accentLight}
                  onPress={navigateBackToThread}
                >
                  <View style={switcherView()}>
                    <IoniconIcon
                      name="chevron-forward"
                      style={{ color: color.primary }}
                      size={32}
                    />
                  </View>
                </TouchableHighlight>
              )}
            </View>
          )
        }}
      />
      <HomeStack.Screen name="User" component={UserScreen} />
      <HomeStack.Screen name="Thread" component={Thread} />
      <HomeStack.Group screenOptions={{ presentation: 'modal' }}>
        <HomeStack.Screen name="Browser" component={Browser} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
};

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

const rightIcons = styles.one<ViewStyle>(() => ({
  display: 'flex',
  flexDirection: 'row'
}));

const filterIcon = styles.one<ViewStyle>((t) => ({
  color: t.color.primary,
  marginHorizontal: 6
}));
