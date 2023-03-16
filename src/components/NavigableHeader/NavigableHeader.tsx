import { ActionSheetProps, useActionSheet } from '@expo/react-native-action-sheet'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Ionicons'
import {
  SafeAreaView,
  Text,
  type TextStyle,
  TouchableHighlight,
  View,
  type ViewStyle
} from 'react-native'
import { type FC } from 'react'
import { styles, useDash } from '../../../dash.config'
import { type StackParamList } from '../../screens/routers'

export type NavigableHeaderProps = {
  title: string
  actions?: {
    options: Parameters<ActionSheetProps['showActionSheetWithOptions']>[0]
    callback: Parameters<ActionSheetProps['showActionSheetWithOptions']>[1]
  }
}

export const NavigableHeader: FC<NavigableHeaderProps> = ({
  title,
  actions
}) => {
  useDash()
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const actionSheet = useActionSheet();
  const {
    tokens: { color }
  } = useDash();

  return (
    <SafeAreaView style={headerContainer()}>
      <View style={header()}>
        {navigation.canGoBack() && (
          <TouchableHighlight underlayColor={color.accentLight}
            style={navButton('visible')}
            onPress={() => { navigation.goBack() }}
          >
            <View>
              <Icon name="ios-chevron-back-sharp" style={icon()} size={18} />
            </View>
          </TouchableHighlight>
        )}
        <Text style={titleStyle()} ellipsizeMode="tail">
          {title}
        </Text>

        {(actions != null)
          ? (
            <TouchableHighlight underlayColor={color.accentLight}
              style={navButton('visible')}
              onPress={() => {
                actionSheet.showActionSheetWithOptions(
                  actions.options,
                  actions.callback
                )
              }}
            >
              <View>
                <Icon name="ellipsis-horizontal" style={icon()} size={18} />
              </View>
            </TouchableHighlight>
          )
          : (
            <View style={navButton('hidden')} />
          )}
      </View>
    </SafeAreaView>
  )
}

const headerContainer = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.headerBg
}))

const header = styles.one<ViewStyle>((t) => ({
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: t.color.headerBg,
  paddingTop: t.space.md,
  paddingBottom: t.space.md,
  paddingRight: t.space.lg,
  paddingLeft: t.space.lg,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accent
}))

const navButton = styles.lazy<'hidden' | 'visible', ViewStyle>(
  (visibilty) => (t) => ({
    alignItems: 'center',
    justifyContent: 'center',
    width: 18 * (t.type.size.base / 16) + t.space.sm * 2,
    height: 18 * (t.type.size.base / 16) + t.space.sm * 2,
    borderRadius: t.radius.full,
    color: t.color.accentLight,
    opacity: visibilty === 'visible' ? 1 : 0
  })
)

const titleStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.sm,
  fontWeight: '700',
  flex: 1,
  textAlign: 'center'
}))

const icon = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent
}))
