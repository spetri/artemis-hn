import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { enableScreens } from "react-native-screens";
import * as Sentry from "sentry-expo";
import { SWRConfig } from "swr";
import { DashProvider, styles, useDash } from "./dash.config";
import { Preferences, usePreferences } from "./src/screens/preferences";
import {
  AskStack,
  HomeStack,
  JobsStack,
  SettingsStack,
  ShowStack,
  Tab,
} from "./src/screens/routers";
import { Stories } from "./src/screens/stories";
import { Thread } from "./src/screens/thread";
import { User } from "./src/screens/user";
import { BrowserModal } from "./src/screens/browser-modal";
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

registerRootComponent(App);

Sentry.init({
  dsn: "https://74d59fdf426b4fd1a90f85ef738b23f5@o1049868.ingest.sentry.io/6031164",
  environment: process.env.STAGE ?? "development",
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
  return (
    <StatusBar
      style={theme === "light" ? "dark" : theme === "dark" ? "light" : "auto"}
    />
  );
}

function Tabs() {
  useDash();
  usePreferences();

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
            tabBarLabel: "Home",
            tabBarIcon: () => {
              return <Icon name="logo-snapchat" size={25} />;
            },
          }}
        />
        <Tab.Screen
          name="Show"
          component={ShowScreens}
          options={{
            tabBarLabel: "Show",
            tabBarIcon: () => {
              return <Icon name="logo-snapchat" size={25} />;
            },
          }}
        />
        <Tab.Screen
          name="Ask"
          component={AskScreens}
          options={{
            tabBarLabel: "Ask",
            tabBarIcon: () => {
              return <Icon name="logo-snapchat" size={25} />;
            },
          }}
        />
        <Tab.Screen
          name="Jobs"
          component={JobsScreens}
          options={{
            tabBarLabel: "Jobs",
            tabBarIcon: () => {
              return <Icon name="logo-snapchat" size={25} />;
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreens}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: () => {
              return <Icon name="settings-outline" size={25} />;
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const sceneContainer = styles.one<ViewStyle>((t) => ({
  height: "100%",
  width: "100%",
  backgroundColor: t.color.bodyBg,
}));

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

function HomeScreens() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name="Stories"
        component={Stories}
        initialParams={{ filter: "top" }}
      />
      <HomeStack.Screen name="User" component={User} />
      <HomeStack.Screen name="Thread" component={Thread} />
      <HomeStack.Screen name="Preferences" component={Preferences} />
      <HomeStack.Group
        screenOptions={{ headerShown: false, presentation: "modal" }}
      >
        <HomeStack.Screen name="BrowserModal" component={BrowserModal} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
}

function ShowScreens() {
  return (
    <ShowStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ShowStack.Screen
        name="Stories"
        component={Stories}
        initialParams={{ filter: "show" }}
      />
      <ShowStack.Screen name="User" component={User} />
      <ShowStack.Screen name="Thread" component={Thread} />
      <ShowStack.Screen name="Preferences" component={Preferences} />
      <ShowStack.Group
        screenOptions={{ headerShown: false, presentation: "modal" }}
      >
        <ShowStack.Screen name="BrowserModal" component={BrowserModal} />
      </ShowStack.Group>
    </ShowStack.Navigator>
  );
}

function AskScreens() {
  return (
    <AskStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AskStack.Screen
        name="Stories"
        component={Stories}
        initialParams={{ filter: "ask" }}
      />
      <AskStack.Screen name="User" component={User} />
      <AskStack.Screen name="Thread" component={Thread} />
      <AskStack.Screen name="Preferences" component={Preferences} />
      <AskStack.Group
        screenOptions={{ headerShown: false, presentation: "modal" }}
      >
        <AskStack.Screen name="BrowserModal" component={BrowserModal} />
      </AskStack.Group>
    </AskStack.Navigator>
  );
}

function JobsScreens() {
  return (
    <JobsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <JobsStack.Screen
        name="Stories"
        component={Stories}
        initialParams={{ filter: "job" }}
      />
      <JobsStack.Screen name="User" component={User} />
      <JobsStack.Screen name="Thread" component={Thread} />
      <JobsStack.Screen name="Preferences" component={Preferences} />
      <JobsStack.Group
        screenOptions={{ headerShown: false, presentation: "modal" }}
      >
        <JobsStack.Screen name="BrowserModal" component={BrowserModal} />
      </JobsStack.Group>
    </JobsStack.Navigator>
  );
}

function SettingsScreens() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen name="Preferences" component={Preferences} />
    </SettingsStack.Navigator>
  );
}

const navigationText = styles.one<TextStyle>((t) => ({
  color: t.color.textPrimary,
  fontSize: 11,
  marginTop: 3,
}));
