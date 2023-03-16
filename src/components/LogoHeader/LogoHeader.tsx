import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
  Dimensions,
  SafeAreaView,
  Text,
  type TextStyle,
  TouchableHighlight,
  View,
  type ViewStyle
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { styles, useDash } from '../../../dash.config'
import { type StackParamList } from '../../screens/routers'

export type LogoHeaderProps = {
  title: string
}

export const LogoHeader = ({ title }: LogoHeaderProps) => {
  useDash()
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()
  const {
    tokens: { color }
  } = useDash()


  return (
    <SafeAreaView style={headerContainer()}>
      <View style={header()}>
        <View style={logoContainer()}>
          {navigation.canGoBack() && (
            <TouchableHighlight underlayColor={color.accentLight}
              style={icon()}
              onPress={() => { navigation.goBack() }}
            >
              <View>
                <Icon name="chevron-back" color={color.textPrimary} size={18} />
              </View>
            </TouchableHighlight>
          )}
          <Text style={headerText()}>{title}</Text>
          <Text style={rightItem()}></Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const headerContainer = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.headerBg
}))

const header = styles.one<ViewStyle>((t) => ({
  flexDirection: 'row',
  width: Dimensions.get('window').width,
  backgroundColor: t.color.headerBg,
  paddingVertical: t.space.md,
  paddingHorizontal: t.space.lg,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accent
}))

const logoContainer = styles.one<ViewStyle>({
  flexDirection: 'row',
  flexWrap: 'nowrap',
  display: 'flex',
  width: Dimensions.get('window').width - 50
})

const icon = styles.one<ViewStyle>(() => ({
  flex: 1,
  justifyContent: 'center'
}))

const headerText = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size.lg,
  color: t.color.textPrimary,
  fontWeight: '900',
  alignItems: 'center'
}))

const rightItem = styles.one(() => ({ flex: 1 }))
