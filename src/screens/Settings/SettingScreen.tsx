import { FC } from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, useDash } from "../../../dash.config";
import { ThemeGridList } from "../../components/ThemeGridList/ThemeGridList";
import { SettingsStack } from "../routers";
import { GeneralSettings } from "./GeneralSettings/GeneralSettings";
import { SettingsListView } from "./SettingsListView/SettingsListView";
import { AppColors } from "./SettingsListView/ThemeConfig";

export const SettingScreen = () => {
  const {
    tokens: { color }
  } = useDash();
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: color.primary as string,
        headerStyle: {
          shadowColor: color.accentLight, // this covers iOS
          backgroundColor: color.headerBg as string,
        },
        headerTitleStyle: {
          color: color.textPrimary as string,
        },
        gestureResponseDistance: 100
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsListView} />
      <SettingsStack.Screen name="General" component={GeneralSettings} />
      <SettingsStack.Screen name="ThemeColorSection" component={ThemeColorSection} options={{ title: 'Select Theme' }}
      />
      <SettingsStack.Screen name="AccentColorSection" component={AccentColorSection} options={{ title: 'Select Accent Color' }} />
      <SettingsStack.Screen name="CommentColorSection" component={CommentColorSection} options={{ title: 'Select Comment Color' }} />
    </SettingsStack.Navigator>
  );
}

const ThemeColorSection: FC = () => {
  const appColors = AppColors;

  return (
    <SafeAreaView style={container()}>
      <ThemeGridList sections={[{ title: 'Theme Colors', data: appColors.themeColors }]} />
    </SafeAreaView>
  );
};

const AccentColorSection: FC = () => {
  const appColors = AppColors;

  return (
    <SafeAreaView style={container()}>
      <ThemeGridList sections={[{ title: 'Accent Colors', data: appColors.accentColors }]} />
    </SafeAreaView>
  );
};

const CommentColorSection: FC = () => {
  const appColors = AppColors;

  return (
    <SafeAreaView style={container()}>
      <ThemeGridList sections={[{ title: 'Comment Colors', data: appColors.commentColors }]} />
    </SafeAreaView>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  backgroundColor: t.color.bodyBg
}));