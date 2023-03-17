import { create } from 'zustand';
import { StoryFilters } from '../types/hn-api';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultPreferences } from '../screens/Settings/useTheme';

type ThumbnailSizeType = 55 | 65 | 75;
type PositionType = 'left' | 'right';

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
    filter: 'new'
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
  // BOOLEAN TOGGLES
  displayLargeThumbnails: boolean;
  setDisplayLargeThumbnails: (displayLargeThumbnails: boolean) => void;

  displayReplies: boolean;
  setDisplayReplies: (displayReplies: boolean) => void;

  showJumpButton: boolean;
  setShowJumpButton: (showJumpButton: boolean) => void;

  displaySource: boolean;
  setDisplaySource: (displaySource: boolean) => void;

  openLinkInBrowser: boolean;
  setOpenLinkInBrowser: (setOpenLinkInBrowser: boolean) => void;

  // BOTTOM SHEET TOGGLES
  thumbnailSize: ThumbnailSizeType;
  setThumbnailSize: (thumbnailSize: ThumbnailSizeType) => void;

  thumbnailPosition: PositionType;
  setThumbnailPosition: (thumbnailPosition: PositionType) => void;

  jumpButtonPosition: PositionType;
  setJumpButtonPosition: (jumpButtonPosition: PositionType) => void;

  // NUMBER
  cachedThreadId: number | null;
  setCachedThreadId: (cachedThreadId: number) => void;
};

const preferencesStore = (set) => ({
  displayLargeThumbnails: defaultPreferences.displayLargeThumbnails,
  setDisplayLargeThumbnails: (displayLargeThumbnails) =>
    set(() => ({ displayLargeThumbnails: !displayLargeThumbnails })),

  displayReplies: defaultPreferences.displayReplies,
  setDisplayReplies: (displayReplies) => set(() => ({ displayReplies: !displayReplies })),

  showJumpButton: defaultPreferences.showJumpButton,
  setShowJumpButton: (showJumpButton) => set(() => ({ showJumpButton: !showJumpButton })),

  displaySource: defaultPreferences.displaySource,
  setDisplaySource: (displaySource) => set(() => ({ displaySource: !displaySource })),

  thumbnailSize: defaultPreferences.thumbnailSize,
  setThumbnailSize: (thumbnailSize) => set(() => ({ thumbnailSize: thumbnailSize })),

  thumbnailPosition: defaultPreferences.thumbnailPosition,
  setThumbnailPosition: (thumbnailPosition) =>
    set(() => ({ thumbnailPosition: thumbnailPosition })),

  jumpButtonPosition: defaultPreferences.jumpButtonPosition,
  setJumpButtonPosition: (jumpButtonPosition) =>
    set(() => ({ jumpButtonPosition: jumpButtonPosition })),

  openLinkInBrowser: defaultPreferences.openLinkInBrowser,
  setOpenLinkInBrowser: (openLinkInBrowser) =>
    set(() => ({ openLinkInBrowser: !openLinkInBrowser })),

  cachedThreadId: defaultPreferences.cachedThreadId,
  setCachedThreadId: (cachedThreadId) =>
    set(() => ({ cachedThreadId: cachedThreadId }))
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
