import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { enableScreens } from 'react-native-screens';
import * as Sentry from 'sentry-expo';
import { SWRConfig } from 'swr';
import { useLayoutEffect, useState } from 'react';
import {
  AppState,
  Pressable,
  SafeAreaView,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dialog, ListItem } from '@rneui/themed';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DashProvider, styles, useDash } from './dash.config';
import { useTheme } from './src/screens/Settings/useTheme';
import {
  AllStack,
  HomeStack,
  SearchStack,
  SettingsStack,
  type StackParamList,
  Tab
} from './src/screens/routers';
import { Stories } from './src/screens/Stories/Stories';
import { Thread } from './src/screens/Thread';
import { User } from './src/screens/User';
import { BrowserModal } from './src/screens/BrowserModal/BrowserModal';
import { Home } from './src/screens/Home/Home';
import { SettingsListView } from './src/screens/Settings/SettingsListView/SettingsListView';
import { Search } from './src/screens/Search/Search';
import { GeneralSettings } from './src/screens/Settings/GeneralSettings/GeneralSettings';
import { AppColorSettings } from './src/screens/Settings/GeneralSettings/AppColorSettings/AppColorSettings';
import { listItems } from './src/screens/Home/HomeList';
import { type StoryFilters } from './src/types/hn-api';
import { ThemeSettings } from './src/screens/Settings/ThemeSettings/ThemeSettings';

registerRootComponent(App);

Sentry.init({
  dsn: 'https://74d59fdf426b4fd1a90f85ef738b23f5@o1049868.ingest.sentry.io/6031164',
  environment: process.env.STAGE ?? 'development',
  enableInExpoDevelopment: true
});

function App() {
  enableScreens(true);

  // Enables OTA updates
  useLayoutEffect(() => {
    const listener = Updates.addListener(async (update) => {
      if (update.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: typeof appState) => {
            /* If it's resuming from background or inactive mode to active one */
            if (appState.match(/inactive|background/) != null && nextAppState === 'active') {
              callback();
            }
            appState = nextAppState;
          };

          // Subscribe to the app state change events
          const listener = AppState.addEventListener('change', onAppStateChange);

          return () => {
            listener.remove();
          };
        }
      }}
    >
      <ActionSheetProvider>
        <DashProvider disableAutoThemeChange>
          <AppStatusBar />
          <NavigationContainer>
            <Tabs />
          </NavigationContainer>
        </DashProvider>
      </ActionSheetProvider>
    </SWRConfig>
  );
}

function AppStatusBar() {
  const { theme } = useDash();
  let appTheme;
  if (theme === 'light') {
    appTheme = 'dark';
  } else if (theme === 'dark') {
    appTheme = 'light';
  } else {
    appTheme = 'auto';
  }
  return <StatusBar style={appTheme} />;
}

function Tabs() {
  useDash();
  useTheme();
  const {
    tokens: { color }
  } = useDash();

  return (
    <View style={sceneContainer()}>
      <Tab.Navigator
        detachInactiveScreens
        sceneContainerStyle={sceneContainer()}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: color.headerBg as string
          },
          headerTintColor: color.primary,
          headerTitleStyle: {
            color: color.textPrimary as string
          }
        }}
        tabBar={TabBar}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreens}
          options={{
            tabBarLabel: 'Posts',
            tabBarIcon: () => <Icon name="ios-browsers" size={25} />
          }}
        />
        <Tab.Screen
          name="User"
          component={User}
          initialParams={{ id: 'pookieinc' }}
          options={{
            tabBarLabel: 'User',
            tabBarIcon: () => <Icon name="person-circle" size={25} />
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreens}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: () => <Icon name="search" size={25} />
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreens}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: () => <Icon name="settings-outline" size={25} />
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <TabBarBase state={state} descriptors={descriptors} navigation={navigation} insets={insets} />
  );
}

function TabBarBase({ state, descriptors, navigation }: BottomTabBarProps) {
  useDash();

  return (
    <SafeAreaView style={tabBar()}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        return (
          <Pressable
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true
              });

              if (!isFocused && !event.defaultPrevented) {
                // The `merge: true` option makes sure that the params inside
                // the tab screen are preserved
                // @ts-expect-error: TODO
                navigation.navigate({ name: route.name, merge: true });
              }
            }}
            onLongPress={() => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key
              });
            }}
            style={tabBarTab(isFocused)}
          >
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={tabBarLabel(isFocused)}>
                {!(options.tabBarIcon == null) &&
                  options.tabBarIcon({
                    focused: true,
                    color: 'blue',
                    size: 13
                  })}
              </Text>
              <Text style={navigationText()}>{label as any}</Text>
            </View>
          </Pressable>
        );
      })}
    </SafeAreaView>
  );
}

function HomeScreens() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [switcher, setSwitcher] = useState(false);
  const {
    tokens: { color }
  } = useDash();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: color.primary,
        headerStyle: {
          backgroundColor: color.headerBg as string
        },
        headerTitleStyle: {
          color: color.textPrimary as string
        }
      }}
    >
      <HomeStack.Screen name="Select" component={Home} initialParams={{ filter: 'home' }} />
      <AllStack.Screen
        name="Stories"
        component={Stories}
        initialParams={{ filter: 'top' }}
        options={{
          headerTitle: () => {
            return (
              <>
                <Pressable
                  onPress={() => {
                    setSwitcher(true);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: color.textPrimary
                    }}
                  >
                    Stories
                  </Text>
                  <IoniconIcon
                    color={color.textPrimary}
                    size={16}
                    style={{ marginLeft: 3 }}
                    name="chevron-down-outline"
                  />
                </Pressable>
                <Dialog
                  isVisible={switcher}
                  onBackdropPress={() => {
                    setSwitcher(false);
                  }}
                >
                  <Dialog.Title title="Switch HN" />
                  {listItems.map((topic) => (
                    <Pressable
                      key={topic.id}
                      onPress={() => {
                        setSwitcher(false);
                        navigation.navigate('Stories', {
                          filter: topic?.filter
                        });
                      }}
                    >
                      <ListItem bottomDivider>
                        <ListItem.Content>
                          <ListItem.Title>{topic.header}</ListItem.Title>
                        </ListItem.Content>
                      </ListItem>
                    </Pressable>
                  ))}
                </Dialog>
              </>
            );
          }
        }}
      />
      <HomeStack.Screen name="User" component={User} />
      <HomeStack.Screen name="Thread" component={Thread} />
      <HomeStack.Group screenOptions={{ presentation: 'modal' }}>
        <HomeStack.Screen name="BrowserModal" component={BrowserModal} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
}

function SettingsScreens() {
  const {
    tokens: { color }
  } = useDash();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: color.primary,
        headerStyle: {
          backgroundColor: color.headerBg as string
        },
        headerTitleStyle: {
          color: color.textPrimary as string
        }
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsListView} />
      <SettingsStack.Screen name="General" component={GeneralSettings} />
      <SettingsStack.Screen name="Theme" component={ThemeSettings} />
      <SettingsStack.Screen name="App Color" component={AppColorSettings} />
    </SettingsStack.Navigator>
  );
}

function SearchScreens() {
  const {
    tokens: { color }
  } = useDash();

  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: color.primary,
        headerStyle: {
          backgroundColor: color.headerBg as string
        },
        headerTitleStyle: {
          color: color.textPrimary as string
        }
      }}
    >
      <SearchStack.Screen name="Search" component={Search} />
      <SearchStack.Screen name="Thread" component={Thread} />
      <SearchStack.Screen name="BrowserModal" component={BrowserModal} />
    </SearchStack.Navigator>
  );
}

const navigationText = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: 11,
  marginTop: 3
}));

const tabBar = styles.one<ViewStyle>((t) => ({
  flexDirection: 'row',
  width: '100%',
  backgroundColor: t.color.headerBg,
  borderTopWidth: t.borderWidth.hairline,
  borderTopColor: t.color.accent
}));

const tabBarLabel = styles.lazy<boolean, TextStyle>((isFocused) => (t) => ({
  color: isFocused ? t.color.primary : t.color.textAccent,
  fontSize: t.type.size.sm,
  fontWeight: '700',
  margin: 0,
  textAlign: 'center'
}));

const tabBarTab = styles.lazy<boolean, ViewStyle>((isFocused) => (t) => ({
  borderTopColor: isFocused ? t.color.primary : t.color.headerBg,
  borderTopWidth: 4,
  flex: 1,
  padding: t.space.md,
  justifyContent: 'center',
  alignItems: 'center'
}));

const sceneContainer = styles.one<ViewStyle>((t) => ({
  height: '100%',
  width: '100%',
  backgroundColor: t.color.bodyBg
}));
