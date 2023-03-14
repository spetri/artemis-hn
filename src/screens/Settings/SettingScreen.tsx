import { useDash } from "../../../dash.config";
import { SettingsStack } from "../routers";
import { GeneralSettings } from "./GeneralSettings/GeneralSettings";
import { SettingsListView } from "./SettingsListView/SettingsListView";
import { AccentColorSection, CommentColorSection, ThemeColorSection, ThemeSettings } from "./ThemeSettings/ThemeSettings";

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
      <SettingsStack.Screen name="ThemeColorSection" component={ThemeColorSection} options={{ title: 'Select Theme' }}
      />
      <SettingsStack.Screen name="AccentColorSection" component={AccentColorSection} options={{ title: 'Select Accent Color' }} />
      <SettingsStack.Screen name="CommentColorSection" component={CommentColorSection} options={{ title: 'Select Comment Color' }} />
    </SettingsStack.Navigator>
  );
}