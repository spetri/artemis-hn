import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { type StoryFilters } from '../types/hn-api';

export const HomeStack = createStackNavigator<StackParamList>();
export const AllStack = createStackNavigator<StackParamList>();
export const ShowStack = createStackNavigator<StackParamList>();
export const AskStack = createStackNavigator<StackParamList>();
export const JobsStack = createStackNavigator<StackParamList>();
export const SettingsStack = createStackNavigator<StackParamList>();
export const SearchStack = createStackNavigator<StackParamList>();
export const Tab = createBottomTabNavigator<ParamListBase>();

export type StackParamList = {
  Stories: { filter: StoryFilters };
  Topics: { filter: StoryFilters };
  User: { id: string };
  Browser: { title: string | undefined; url: string };
  Thread: { id: number };
  Settings: Record<string, never>;
  Home: Record<string, never>;
  Search: Record<string, never>;
  SettingsListView: Record<string, never>;
  General: Record<string, never>;
  Select: Record<string, never>;
  Theme: Record<string, never>;
  ThemeColorSection: Record<string, never>;
  AccentColorSection: Record<string, never>;
  CommentColorSection: Record<string, never>;
};

export type TabParamList = {
  Home: undefined;
  User: undefined;
  Search: undefined;
  Settings: undefined;
}

