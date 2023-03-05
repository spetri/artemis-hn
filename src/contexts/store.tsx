import { create } from 'zustand';
import { defaultPreferences } from '../screens/Settings/useTheme';
import { StoryFilters } from '../types/hn-api';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ListItemType = {
  id: string;
  header: string;
  subheader?: string;
  iconName: string;
  filter?: StoryFilters;
  navigate?: () => void;
};

export const listItems: ListItemType[] = [
  {
    id: '1',
    header: 'All HN',
    subheader: 'All HNs combined',
    iconName: 'ios-logo-hackernews',
    filter: 'top'
  },
  {
    id: '2',
    header: 'Best HN',
    subheader: 'Best recent stories',
    iconName: 'star-half-outline',
    filter: 'best'
  },
  {
    id: '3',
    header: 'New HN',
    subheader: 'Newest posts',
    iconName: 'ios-time-outline',
    filter: 'best'
  },
  {
    id: '4',
    header: 'Show HN',
    subheader: 'Handmade projects',
    iconName: 'rocket-outline',
    filter: 'show'
  },
  {
    id: '5',
    header: 'Ask HN',
    subheader: 'Questions and answers',
    iconName: 'bulb-outline',
    filter: 'ask'
  },
  {
    id: '6',
    header: 'Jobs HN',
    subheader: "Who's hiring?",
    iconName: 'file-tray-outline',
    filter: 'job'
  }
];

type PreferencesState = {
  displayLargeThumbnails: boolean;
  setDisplayLargeThumbnails: (displayLargeThumbnails: boolean) => void;
  displayReplies: boolean;
  setDisplayReplies: (displayReplies: boolean) => void;
  showJumpButton: boolean;
  setShowJumpButton: (showJumpButton: boolean) => void;
  displaySource: boolean;
  setDisplaySource: (displaySource: boolean) => void;

  // TODO
  jumpButtonPosition: 'left' | 'right';
  setJumpButtonPosition: (jumpButtonPosition: 'left' | 'right') => void;
};

const preferencesStore = (set) => ({
  displayLargeThumbnails: defaultPreferences.displayLargeThumbnails,
  setDisplayLargeThumbnails: () =>
    set((state) => ({ displayLargeThumbnails: !state.displayLargeThumbnails })),
  displayReplies: defaultPreferences.displayReplies,
  setDisplayReplies: () => set((state) => ({ displayReplies: !state.displayReplies })),
  showJumpButton: defaultPreferences.showJumpButton,
  setShowJumpButton: () => set((state) => ({ showJumpButton: !state.showJumpButton })),
  displaySource: defaultPreferences.displaySource,
  setDisplaySource: () => set((state) => ({ displaySource: !state.displaySource })),

  // TODO
  jumpButtonPosition: defaultPreferences.jumpButtonPosition,
  setJumpButtonPosition: () => set((state) => ({ jumpButtonPosition: state.jumpButtonPosition }))
});

export const usePreferencesStore = create(
  persist<PreferencesState>(preferencesStore, {
    name: 'preferences',
    storage: createJSONStorage(() => AsyncStorage)
  })
);

export function useMulti(useFunc, ...items) {
  return items.reduce(
    (carry, item) => ({
      ...carry,
      [item]: useFunc((state) => state[item])
    }),
    {}
  );
}
