import { create } from 'zustand';
import { StoryFilters } from '../types/hn-api';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultPreferences } from '../screens/Settings/useTheme';
import { HackerNews } from '../enums/enums';

type ThumbnailSizeType = 55 | 65 | 75;
export type PositionType = 'Left' | 'Right' | 'Middle';

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
    header: 'Front Page',
    subheader: 'All HNs combined',
    iconName: 'ios-logo-hackernews',
    filter: HackerNews.TOP
  },
  {
    id: '2',
    header: 'Popular',
    subheader: 'Best recent stories',
    iconName: 'star-half-outline',
    filter: HackerNews.BEST
  },
  {
    id: '3',
    header: 'New',
    subheader: 'Most recently posted stories',
    iconName: 'ios-time-outline',
    filter: HackerNews.NEW
  },
  {
    id: '4',
    header: 'Show',
    subheader: 'Handmade projects',
    iconName: 'rocket-outline',
    filter: HackerNews.SHOW
  },
  {
    id: '5',
    header: 'Q&A',
    subheader: 'Questions and answers',
    iconName: 'bulb-outline',
    filter: HackerNews.ASK
  },
  {
    id: '6',
    header: 'Jobs Board',
    subheader: "Who's hiring?",
    iconName: 'file-tray-outline',
    filter: HackerNews.JOB
  }
];

type PreferencesState = {
  // STRING TOGGLES
  storyTitle: string;
  setStoryTitle: (storyTitle: string) => void;

  // BOOLEAN TOGGLES
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;

  displayLargeThumbnails: boolean;
  setDisplayLargeThumbnails: (displayLargeThumbnails: boolean) => void;

  displayReplies: string;
  setDisplayReplies: (displayReplies: string) => void;

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

  storyCount: number;
  setStoryCount: (storyCount: number) => void;

  reset: () => void;
};

const preferencesStore = (set) => ({
  storyTitle: defaultPreferences.storyTitle,
  setStoryTitle: (storyTitle) => set(() => ({ storyTitle: storyTitle })),

  storyCount: defaultPreferences.storyCount,
  setStoryCount: (storyCount) => set(() => ({ storyCount: storyCount })),

  isLoggedIn: defaultPreferences.isLoggedIn,
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn: !isLoggedIn })),

  displayLargeThumbnails: defaultPreferences.displayLargeThumbnails,
  setDisplayLargeThumbnails: (displayLargeThumbnails) =>
    set(() => ({ displayLargeThumbnails: !displayLargeThumbnails })),

  displayReplies: defaultPreferences.displayReplies,
  setDisplayReplies: (displayReplies) => set(() => ({ displayReplies: displayReplies })),

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
  setCachedThreadId: (cachedThreadId) => set(() => ({ cachedThreadId: cachedThreadId })),

  reset: () => {
    set(defaultPreferences);
  }
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
