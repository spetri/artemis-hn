import { useActionSheet } from "@expo/react-native-action-sheet";
import type { ActionSheetProps } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon } from "../Icon";
import { styles, useDash } from "../../../dash.config";
import { StackParamList } from "../../screens/routers";
import {
  Text,
  SafeAreaView,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export function NavigableHeader({ title, actions }: NavigableHeaderProps) {
  useDash();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const actionSheet = useActionSheet();

  return (
    <SafeAreaView style={headerContainer()}>
      <View style={header()}>
        <TouchableOpacity
          style={navButton("visible")}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" color="textAccent" size={18} />
        </TouchableOpacity>

        <Text style={titleStyle()} ellipsizeMode="tail">
          {title}
        </Text>

        {actions ? (
          <TouchableOpacity
            style={navButton("visible")}
            onPress={() => {
              actionSheet.showActionSheetWithOptions(
                actions.options,
                actions.callback
              );
            }}
          >
            <Icon name="more-horizontal" color="textAccent" size={18} />
          </TouchableOpacity>
        ) : (
          <View style={navButton("hidden")} />
        )}
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
  alignItems: "center",
  backgroundColor: t.color.headerBg,
  paddingTop: t.space.md,
  paddingBottom: t.space.md,
  paddingRight: t.space.lg,
  paddingLeft: t.space.lg,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accent,
}));

const navButton = styles.lazy<"hidden" | "visible", ViewStyle>(
  (visibilty) => (t) => ({
    alignItems: "center",
    justifyContent: "center",
    width: 18 * (t.type.size.base / 16) + t.space.sm * 2,
    height: 18 * (t.type.size.base / 16) + t.space.sm * 2,
    borderRadius: t.radius.full,
    backgroundColor: t.color.accentLight,
    opacity: visibilty === "visible" ? 1 : 0,
  })
);

const titleStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.sm,
  fontWeight: "700",
  flex: 1,
  textAlign: "center",
}));

export interface NavigableHeaderProps {
  title: string;
  actions: {
    options: Parameters<ActionSheetProps["showActionSheetWithOptions"]>[0];
    callback: Parameters<ActionSheetProps["showActionSheetWithOptions"]>[1];
  };
}
