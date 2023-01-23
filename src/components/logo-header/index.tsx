import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, SafeAreaView, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { styles, useDash } from "../../../dash.config";
import { StackParamList } from "../../screens/routers";
import { Icon } from "../icon";

export function LogoHeader({ title }: LogoHeaderProps) {
  useDash();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <SafeAreaView style={headerContainer()}>
      <View style={header()}>
        <View>
          <TouchableWithoutFeedback>
            <View style={logoContainer()}>
              <View style={logoMark()} />
              <Text style={logoType()}>{title}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={currentDate()}>{date}</Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => navigation.push("Preferences", {})}
        >
          <View style={settingsButton()}>
            <Icon name="settings" color="textAccent" size={18} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const headerContainer = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.headerBg,
}));

const header = styles.one<ViewStyle>((t) => ({
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between",
  alignItems: "flex-start",
  backgroundColor: t.color.headerBg,
  paddingTop: t.space.md,
  paddingBottom: t.space.md,
  paddingRight: t.space.lg,
  paddingLeft: t.space.lg,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accent,
}));

const logoContainer = styles.one<ViewStyle>({
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
});

const logoMark = styles.one<ViewStyle>((t) => ({
  width: t.type.size.lg,
  height: t.type.size.lg,
  borderRadius: t.radius.md * (t.type.size.base / 16),
  marginRight: t.space.sm,
  borderColor: t.color.primary,
  borderWidth: 4 * (t.type.size.base / 16),
}));

const logoType = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size.lg,
  color: t.color.textPrimary,
  fontWeight: "900",
}));

const currentDate = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.headerBg,
  fontSize: t.type.size["lg"],
  lineHeight: t.type.size["lg"] * 1.15,
  fontWeight: "900",
  color: t.color.textAccent,
}));

const settingsButton = styles.one<ViewStyle>((t) => ({
  padding: t.space.sm,
  paddingRight: 0,
}));

export interface LogoHeaderProps {
  title: string;
}
