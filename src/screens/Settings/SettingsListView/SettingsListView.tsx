import { FC } from "react";
import {
  SafeAreaView,
  SectionList,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { StoryFilters } from "../../../types/hn-api";
import { StackParamList } from "../../routers";
import { styles, useDash } from "../../../../dash.config";
import { LogoHeader } from "../../../components/LogoHeader";
import Icon from "react-native-vector-icons/Ionicons";

type ListItemType = {
  id: string;
  header: string;
  iconName: string;
}[];

export const SettingsListView: FC = () => {
  useDash();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const {
    tokens: { color },
  } = useDash();
  const listItems: ListItemType = [
    {
      id: "1",
      header: "General",
      iconName: "ios-settings-outline",
    },
    {
      id: "2",
      header: "Theme",
      iconName: "ios-moon-outline",
    },
    {
      id: "3",
      header: "App Icon",
      iconName: "ios-logo-hackernews",
    },
    {
      id: "4",
      header: "About",
      iconName: "at-circle-outline",
    },
    {
      id: "5",
      header: "Email",
      iconName: "file-tray-full-outline",
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
          renderItem={({ item }) => (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={imageContainer}>
                <Icon
                  name={item.iconName}
                  color={color.textPrimary}
                  size={18}
                />
              </Text>
              <View style={row()}>
                <Text
                  style={header()}
                  onPress={() => navigation.navigate("GeneralSettings")}
                >
                  {item.header}
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
