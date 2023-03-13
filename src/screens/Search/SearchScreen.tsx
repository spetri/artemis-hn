import { useDash } from "../../../dash.config";
import { Browser } from "../Browser/Browser";
import { SearchStack } from "../routers";
import { Thread } from "../Thread/Thread";
import { Search } from "./Search";

export const SearchScreen = () => {
  const {
    tokens: { color }
  } = useDash();

  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: color.primary as string,
        headerStyle: {
          backgroundColor: color.headerBg as string
        },
        headerTitleStyle: {
          color: color.textPrimary as string
        }
      }}
    >
      <SearchStack.Screen name="Search" component={Search} />
      <SearchStack.Screen name="Thread" component={Thread} />
      <SearchStack.Screen name="Browser" component={Browser} />
    </SearchStack.Navigator>
  );
}