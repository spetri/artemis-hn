import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ParamListBase } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { type StoryFilters } from '../types/hn-api'

export const HomeStack = createNativeStackNavigator<StackParamList>()
export const AllStack = createNativeStackNavigator<StackParamList>()
export const ShowStack = createNativeStackNavigator<StackParamList>()
export const AskStack = createNativeStackNavigator<StackParamList>()
export const JobsStack = createNativeStackNavigator<StackParamList>()
export const SettingsStack = createNativeStackNavigator<StackParamList>()
export const SearchStack = createNativeStackNavigator<StackParamList>()
export const Tab = createBottomTabNavigator<ParamListBase>()

export type StackParamList = {
  Stories: { filter: StoryFilters };
  Topics: { filter: StoryFilters };
  User: { id: string };
  BrowserModal: { title: string | undefined; url: string };
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

export interface TabParamList {
  Home: undefined
  User: undefined
  Search: undefined
  Settings: undefined
}
