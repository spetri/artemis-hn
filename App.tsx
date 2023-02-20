import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { enableScreens } from "react-native-screens";
import * as Sentry from "sentry-expo";
import { SWRConfig } from "swr";
import { DashProvider, styles, useDash } from "./dash.config";
import { defaultPreferences, useTheme } from "./src/screens/Settings/useTheme";
import {
  AllStack,
  Tab,
  HomeStack,
  SearchStack,
  SettingsStack,
} from "./src/screens/routers";
import { Stories } from "./src/screens/Stories/Stories";
import { Thread } from "./src/screens/Thread";
import { User } from "./src/screens/User";
import { BrowserModal } from "./src/screens/BrowserModal/BrowserModal";
import { useLayoutEffect } from "react";
import {
  Text,
  AppState,
  Pressable,
  SafeAreaView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Home } from "./src/screens/Home/Home";
import { SettingsListView } from "./src/screens/Settings/SettingsListView/SettingsListView";
import { Search } from "./src/screens/Search/Search";
import { GeneralSettings } from "./src/screens/Settings/GeneralSettings/GeneralSettings";
import { AppColorSettings } from "./src/screens/Settings/GeneralSettings/AppColorSettings/AppColorSettings";

registerRootComponent(App);

Sentry.init({
  dsn: "https://74d59fdf426b4fd1a90f85ef738b23f5@o1049868.ingest.sentry.io/6031164",
  environment: process.env.STAGE ?? "development",
  enableInExpoDevelopment: true,
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
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          // Subscribe to the app state change events
          const listener = AppState.addEventListener(
            "change",
            onAppStateChange
          );

          return () => {
            listener.remove();
          };
        },
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
  if (theme === "light") {
    appTheme = "dark";
  } else if (theme === "dark") {
    appTheme = "light";
  } else {
    appTheme = "auto";
  }
  return <StatusBar style={appTheme} />;
}

function Tabs() {
  useDash();
  useTheme();

  return (
    <View style={sceneContainer()}>
      <Tab.Navigator
        detachInactiveScreens
        sceneContainerStyle={sceneContainer()}
        screenOptions={{ headerShown: false }}
        tabBar={TabBar}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreens}
          options={{
            tabBarLabel: "Posts",
            tabBarIcon: () => <Icon name="ios-browsers" size={25} />,
          }}
        />
        <Tab.Screen
          name="User"
          component={User}
          initialParams={{ id: "pookieinc" }}
          options={{
            tabBarLabel: "User",
            tabBarIcon: () => <Icon name="person-circle" size={25} />,
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreens}
          options={{
            tabBarLabel: "Search",
            tabBarIcon: () => <Icon name="search" size={25} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreens}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: () => <Icon name="settings-outline" size={25} />,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <TabBarBase
      state={state}
      descriptors={descriptors}
      navigation={navigation}
      insets={insets}
    />
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
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
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
                type: "tabLongPress",
                target: route.key,
              });
            }}
            style={tabBarTab(isFocused)}
          >
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text style={tabBarLabel(isFocused)}>
                {!!options.tabBarIcon &&
                  options.tabBarIcon({
                    focused: true,
                    color: "blue",
                    size: 13,
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
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <HomeStack.Screen
        name="Select"
        component={Home}
        initialParams={{ filter: "home" }}
      />
      <AllStack.Screen
        name="Stories"
        component={Stories}
        initialParams={{ filter: "top" }}
      />
      <HomeStack.Screen name="User" component={User} />
      <HomeStack.Screen name="Thread" component={Thread} />
      <HomeStack.Group screenOptions={{ presentation: "modal" }}>
        <HomeStack.Screen name="BrowserModal" component={BrowserModal} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
}

function SettingsScreens() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsListView} />
      <SettingsStack.Screen name="General" component={GeneralSettings} />
      <SettingsStack.Screen name="App Color" component={AppColorSettings} />
    </SettingsStack.Navigator>
  );
}

function SearchScreens() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
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
  marginTop: 3,
}));

const tabBar = styles.one<ViewStyle>((t) => ({
  flexDirection: "row",
  width: "100%",
  backgroundColor: t.color.headerBg,
  borderTopWidth: t.borderWidth.hairline,
  borderTopColor: t.color.accent,
}));

const tabBarLabel = styles.lazy<boolean, TextStyle>((isFocused) => (t) => ({
  color: isFocused ? t.color.primary : t.color.textAccent,
  fontSize: t.type.size.sm,
  fontWeight: "700",
  margin: 0,
  textAlign: "center",
}));

const tabBarTab = styles.lazy<boolean, ViewStyle>((isFocused) => (t) => ({
  borderTopColor: isFocused ? t.color.primary : t.color.headerBg,
  borderTopWidth: 4,
  flex: 1,
  padding: t.space.md,
  justifyContent: "center",
  alignItems: "center",
}));

const sceneContainer = styles.one<ViewStyle>((t) => ({
  height: "100%",
  width: "100%",
  backgroundColor: t.color.bodyBg,
}));
