import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { shallow } from 'zustand/shallow';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { enableScreens } from 'react-native-screens';
import * as Sentry from 'sentry-expo';
import { SWRConfig } from 'swr';
import { useLayoutEffect } from 'react';
import {
  AppState,
  SafeAreaView,
  Text,
  type TextStyle,
  TouchableHighlight,
  View,
  type ViewStyle
} from 'react-native';
import { DashProvider, styles, useDash } from './dash.config';
import { useTheme } from './src/screens/Settings/useTheme';
import { Tab } from './src/screens/routers';
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { SearchScreen } from './src/screens/Search/SearchScreen';
import { SettingScreen } from './src/screens/Settings/SettingScreen';
import { Theme } from './src/enums/enums';
import { usePreferencesStore } from './src/contexts/store';
import { UserScreen } from './src/screens/User/UserScreen';

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

const AppStatusBar = () => {
  const { theme } = useDash();
  let appTheme;
  if (theme === Theme.LIGHT) {
    appTheme = Theme.DARK;
  } else if (theme === Theme.DARK) {
    appTheme = Theme.LIGHT;
  } else {
    appTheme = Theme.AUTO;
  }
  return <StatusBar style={appTheme} />;
};

const Tabs = () => {
  useDash();
  useTheme();
  const {
    tokens: { color }
  } = useDash();
  const { isLoggedIn, setIsLoggedIn } = usePreferencesStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      setIsLoggedIn: state.setIsLoggedIn
    }),
    shallow
  );

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
          headerTintColor: color.primary as string,
          headerTitleStyle: {
            color: color.textPrimary as string
          }
        }}
        tabBar={({ state, descriptors, navigation, insets }: BottomTabBarProps) => (
          <TabBarBase
            state={state}
            descriptors={descriptors}
            navigation={navigation}
            insets={insets}
          />
        )}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Hacker News',
            tabBarIcon: () => <IoniconIcon name="ios-browsers" size={30} />
          }}
        />
        {/* <Tab.Screen
          name="User"
          component={UserScreen}
          initialParams={{ id: isLoggedIn ? 'pookieinc' : '' }}
          options={{
            tabBarLabel: 'User',
            tabBarIcon: () => <IoniconIcon name="person-circle" size={30} />
          }}
        /> */}
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: () => <IoniconIcon name="search" size={30} />
          }}
        />
        <Tab.Screen
          name="MainSettings"
          component={SettingScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: () => <IoniconIcon name="settings-outline" size={30} />
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const TabBarBase = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const {
    tokens: { color }
  } = useDash();

  return (
    <SafeAreaView style={tabBar()}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <TouchableHighlight
            underlayColor={color.bodyBg}
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
            <View style={flexColumn()}>
              <Text style={tabBarLabel(isFocused)}>
                {!(options.tabBarIcon == null) &&
                  options.tabBarIcon({
                    focused: true,
                    color: 'blue',
                    size: 0
                  })}
              </Text>
            </View>
          </TouchableHighlight>
        );
      })}
    </SafeAreaView>
  );
};

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
  borderTopWidth: 1,
  flex: 1,
  padding: t.space.md,
  justifyContent: 'center',
  alignItems: 'center',
  height: 50
}));

const sceneContainer = styles.one<ViewStyle>((t) => ({
  height: '100%',
  width: '100%',
  backgroundColor: t.color.bodyBg
}));

const flexColumn = styles.one<ViewStyle>(() => ({
  display: 'flex',
  flexDirection: 'column'
}));
