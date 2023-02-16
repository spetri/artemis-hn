import { styles, useDash } from "../../../dash.config";
import Icon from "react-native-vector-icons/Ionicons";
import { FC } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  SectionList,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { LogoHeader } from "../../components/LogoHeader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../routers";
import { useNavigation } from "@react-navigation/native";
import { StoryFilters } from "../../types/hn-api";
import { ListItem } from "@rneui/themed";
import { ListItemContent } from "@rneui/base/dist/ListItem/ListItem.Content";

type ListItemType = {
  id: string;
  header: string;
  subheader: string;
  iconName: string;
  filter: StoryFilters;
}[];

export const Home: FC<ListItemType> = () => {
  useDash();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const {
    tokens: { color },
  } = useDash();
  const listItems: ListItemType = [
    {
      id: "1",
      header: "All HN",
      subheader: "All HNs combined",
      iconName: "ios-logo-hackernews",
      filter: "top",
    },
    {
      id: "2",
      header: "Best HN",
      subheader: "Best recent stories",
      iconName: "star-half-outline",
      filter: "best",
    },
    {
      id: "3",
      header: "New HN",
      subheader: "Newest posts",
      iconName: "ios-time-outline",
      filter: "best",
    },
    {
      id: "4",
      header: "Show HN",
      subheader: "Handmade projects",
      iconName: "rocket-outline",
      filter: "show",
    },
    {
      id: "5",
      header: "Ask HN",
      subheader: "Questions and answers",
      iconName: "bulb-outline",
      filter: "ask",
    },
    {
      id: "6",
      header: "Jobs HN",
      subheader: "Who's hiring?",
      iconName: "file-tray-outline",
      filter: "job",
    },
  ];

  return (
    <SafeAreaView style={containerBg()}>
      <View style={container()}>
        <SectionList
          ListHeaderComponent={<LogoHeader title="Select" />}
          sections={[{ title: "Topics", data: listItems }]}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("Stories", {
                  filter: item?.filter as StoryFilters,
                })
              }
            >
              <ListItem bottomDivider containerStyle={content()}>
                <Icon
                  name={item.iconName}
                  color={color.textPrimary}
                  size={25}
                  style={image}
                />
                <ListItemContent>
                  <ListItem.Title style={header()}>
                    {item.header}
                  </ListItem.Title>
                  <ListItem.Subtitle style={subheader()}>
                    {item.subheader}
                  </ListItem.Subtitle>
                </ListItemContent>
              </ListItem>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: "100%",
  width: "100%",
}));

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
}));

const content = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: 65,
}));

const subheader = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: 12,
}));

const image = styles.one<ViewStyle>((t) => ({
  height: "100%",
  width: "100%",
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: 16,
  fontWeight: "500",
  color: t.color.textPrimary,
}));
