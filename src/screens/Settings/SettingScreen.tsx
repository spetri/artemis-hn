import { FC } from 'react';
import { useDash } from '../../../dash.config';
import { ThemeGridList } from '../../components/ThemeGridList/ThemeGridList';
import { SettingsStack } from '../routers';
import { General } from './General/General';
import { SettingsListView } from './SettingsListView/SettingsListView';
import { AppColors } from './SettingsListView/ThemeConfig';

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
          backgroundColor: color.headerBg as string
        },
        headerTitleStyle: {
          color: color.textPrimary as string
        }
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsListView} />
      <SettingsStack.Screen name="General" component={General} />
      <SettingsStack.Screen
        name="ThemeColorSection"
        component={ThemeColorSection}
        options={{ title: 'Select Theme' }}
      />
      <SettingsStack.Screen
        name="AccentColorSection"
        component={AccentColorSection}
        options={{ title: 'Select Accent Color' }}
      />
      <SettingsStack.Screen
        name="CommentColorSection"
        component={CommentColorSection}
        options={{ title: 'Select Comment Color' }}
      />
    </SettingsStack.Navigator>
  );
};

const ThemeColorSection: FC = () => {
  const appColors = AppColors;

  return <ThemeGridList sections={[{ data: appColors.themeColors }]} />;
};

const AccentColorSection: FC = () => {
  const appColors = AppColors;

  return <ThemeGridList sections={[{ data: appColors.accentColors }]} />;
};

const CommentColorSection: FC = () => {
  const appColors = AppColors;

  return <ThemeGridList sections={[{ data: appColors.commentColors }]} />;
};
