import { styles, useDash } from "../../../dash.config";
import Icon from "react-native-vector-icons/Ionicons";
import { FC, useCallback } from "react";
import {
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

type ListItemType = {
  id: string;
  header: string;
  subheader: string;
  iconName: string;
  filter: StoryFilters;
}[];

export const Home: FC = () => {
  useDash();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const listItems: ListItemType = [
    {
      id: "1",
      header: "All HN",
      subheader: "All HNs Combined",
      iconName: "ios-logo-hackernews",
      filter: "top",
    },
    {
      id: "2",
      header: "Show HN",
      subheader: "Handmade projects",
      iconName: "rocket-outline",
      filter: "show",
    },
    {
      id: "3",
      header: "Ask HN",
      subheader: "Questions and answers",
      iconName: "bulb-outline",
      filter: "ask",
    },
    {
      id: "4",
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
          ItemSeparatorComponent={() => (
            <View style={listItemSeparatorStyle()} />
          )}
          ListHeaderComponent={<LogoHeader title="Select" />}
          sections={[{ title: "Topics", data: listItems }]}
          renderSectionHeader={({ section }) => (
            <Text style={sectionHeaderStyle()}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={imageContainer}>
                <Icon
                  name={item.iconName}
                  color="white"
                  size={25}
                  style={image}
                />
              </View>
              <View style={row()}>
                <Text
                  style={header()}
                  onPress={() =>
                    navigation.navigate("Stories", {
                      filter: item?.filter as StoryFilters,
                    })
                  }
                >
                  {item.header}
                </Text>
                <Text
                  style={subheader()}
                  onPress={() =>
                    navigation.navigate("Stories", {
                      filter: item?.filter as StoryFilters,
                    })
                  }
                >
                  {item.subheader}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: "100%",
  width: "100%",
}));

const row = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  display: "flex",
  width: "100%",
  paddingVertical: 15,
}));

const subheader = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: 12,
}));

const imageContainer: ViewStyle = {
  display: "flex",
  justifyContent: "center",
  alignSelf: "center",
  paddingHorizontal: 10,
};

const image = styles.one<ViewStyle>((t) => ({
  height: "100%",
  width: "100%",
}));

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  justifyContent: "center",
  backgroundColor: t.color.bodyBg,
}));

const sectionHeaderStyle = styles.one<TextStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  fontSize: 15,
  paddingHorizontal: 10,
  paddingTop: 5,
  color: "#fff",
  fontWeight: "800",
  textTransform: "uppercase",
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: 15,
  fontWeight: "500",
  color: t.color.textPrimary,
}));

const listItemSeparatorStyle = styles.one<TextStyle>((t) => ({
  height: 0.3,
  width: "100%",
  backgroundColor: t.color.textAccent,
}));
