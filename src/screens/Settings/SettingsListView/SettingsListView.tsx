import { FC } from "react";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
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
        <Text
          style={{
            display: "flex",
            alignSelf: "center",
            color: color.textAccent,
            fontSize: 10,
          }}
        >
          v{Application.nativeBuildVersion}{" "}
          {Updates.updateId && <>&bull; {Updates.updateId}</>}
        </Text>
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

const imageContainer: ViewStyle = {
  display: "flex",
  justifyContent: "center",
  alignSelf: "center",
  paddingHorizontal: 10,
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  justifyContent: "center",
  backgroundColor: t.color.bodyBg,
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
