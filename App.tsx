import { ActionSheetProvider } from '@expo/react-native-action-sheet';
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
  Pressable,
  SafeAreaView,
  Text,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native';
import { DashProvider, styles, useDash } from './dash.config';
import { useTheme } from './src/screens/Settings/useTheme';
import {
  Tab
} from './src/screens/routers';
import { User } from './src/screens/User/User';
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { SearchScreen } from './src/screens/Search/SearchScreen';
import { SettingScreen } from './src/screens/Settings/SettingScreen';

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
  if (theme === 'light') {
    appTheme = 'dark';
  } else if (theme === 'dark') {
    appTheme = 'light';
  } else {
    appTheme = 'auto';
  }
  return <StatusBar style={appTheme} />;
}

const Tabs = () => {
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
          headerTintColor: color.primary as string,
          headerTitleStyle: {
            color: color.textPrimary as string
          }
        }}
        tabBar={({ state, descriptors, navigation, insets }: BottomTabBarProps) => <TabBarBase state={state} descriptors={descriptors} navigation={navigation} insets={insets} />}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Posts',
            tabBarIcon: () => <IoniconIcon name="ios-browsers" size={25} />
          }}
        />
        <Tab.Screen
          name="User"
          component={User}
          initialParams={{ id: 'pookieinc' }}
          options={{
            tabBarLabel: 'User',
            tabBarIcon: () => <IoniconIcon name="person-circle" size={25} />
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: () => <IoniconIcon name="search" size={25} />
          }}
        />
        <Tab.Screen
          name="MainSettings"
          component={SettingScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: () => <IoniconIcon name="settings-outline" size={25} />
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const TabBarBase = ({ state, descriptors, navigation }: BottomTabBarProps) => {
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
            <View style={flexColumn()}>
              <Text style={tabBarLabel(isFocused)}>
                {!(options.tabBarIcon == null) &&
                  options.tabBarIcon({
                    focused: true,
                    color: 'blue',
                    size: 13
                  })}
              </Text>
              <Text style={navigationText()}>{label}</Text>
            </View>
          </Pressable>
        )
      })}
    </SafeAreaView>
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

const flexColumn = styles.one<ViewStyle>(() => ({
  display: 'flex',
  flexDirection: 'column'
}))