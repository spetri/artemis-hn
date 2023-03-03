import { createContext } from 'react';
import { defaultPreferences } from '../screens/Settings/useTheme';
import { StoryFilters } from '../types/hn-api';

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

export const PreferencesContext = createContext({
  defaults: defaultPreferences,
  displayLargeThumbnails: defaultPreferences.displayLargeThumbnails,
  setDisplayLargeThumbnails: () => {},
  homeOrderList: listItems,
  setHomeOrderList: () => []
});

// export const PreferencesContextProvider = (value, { children }) => {
//   const [displayLargeThumbnails, setDisplayLargeThumbnails] = useState();

//   return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
// };
