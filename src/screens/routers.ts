import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StoryFilters } from "../types/hn-api";

export const HomeStack = createNativeStackNavigator<StackParamList>();
export const AllStack = createNativeStackNavigator<StackParamList>();
export const ShowStack = createNativeStackNavigator<StackParamList>();
export const AskStack = createNativeStackNavigator<StackParamList>();
export const JobsStack = createNativeStackNavigator<StackParamList>();
export const SettingsStack = createNativeStackNavigator<StackParamList>();
export const SearchStack = createNativeStackNavigator<StackParamList>();
export const Tab = createBottomTabNavigator<TabParamList>();

export type StackParamList = {
  Stories: { filter: StoryFilters };
  Topics: { filter: StoryFilters };
  User: { id: string };
  BrowserModal: { title: string | undefined; url: string };
  Thread: { id: number };
  Settings: {};
  Home: {};
  Search: {};
  SettingsListView: {};
  General: {};
  "App Color": {};
  Select: {};
};

export type TabParamList = {
  Home: undefined;
  User: undefined;
  Search: undefined;
  Settings: undefined;
};
