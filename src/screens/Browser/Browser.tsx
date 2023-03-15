import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { responsiveSize, styles, useDash } from '../../../dash.config';
import { type StackParamList } from '../routers';
import {
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  Share,
  Text,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle
} from 'react-native';
import { createElement, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon } from '../../components/Icon/Icon';
import { useAnimateFade } from '../../hooks/use-animate-fade';

export type BrowserProps = NativeStackScreenProps<StackParamList, 'Browser'>;

export const Browser = ({ navigation, route }: BrowserProps) => {
  const {
    tokens: { color }
  } = useDash();
  const dimensions = useWindowDimensions();
  const ref = useRef<WebView>(null);
  const [navigationState, setNavigationState] = useState<WebViewNavigation | null>(null);
  const { fadeIn, fadeOut, animated } = useAnimateFade();

  return (
    <View style={container()}>
      <View style={modalHeader()}>
        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          style={closeButton()}
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Animated.View style={{ opacity: animated }}>
            <Icon name="x" size={14} color="textAccent" />
          </Animated.View>
        </Pressable>

        <Text style={title()} numberOfLines={1} ellipsizeMode="tail">
          {route.params.title || ''}
        </Text>
      </View>

      <WebView
        ref={ref}
        originWhitelist={['*']}
        allowsLinkPreview
        allowsInlineMediaPlayback
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled
        enableApplePay
        onNavigationStateChange={setNavigationState}
        source={{ uri: route.params.url }}
        style={browser(dimensions.width)}
      />

      <SafeAreaView style={footer()}>
        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          style={footerButton()}
          onPress={() => {
            ref.current?.goBack();
          }}
        >
          <Animated.View style={{ opacity: animated }}>
            <Feather
              name="chevron-left"
              size={responsiveSize(24)}
              color={navigationState?.canGoBack ? color.textPrimary : color.textAccent}
            />
          </Animated.View>
        </Pressable>

        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          style={footerButton()}
          onPress={() => {
            ref.current?.goForward();
          }}
        >
          <Animated.View style={{ opacity: animated }}>
            <Feather
              name="chevron-right"
              size={responsiveSize(24)}
              color={navigationState?.canGoBack ? color.textPrimary : color.textAccent}
            />
          </Animated.View>
        </Pressable>

        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          style={footerButton()}
          onPress={async () =>
            await Share.share({
              title: navigationState?.title ?? route.params.title,
              url: navigationState?.url ?? route.params.url
            })
          }
        >
          <Animated.View style={{ opacity: animated }}>
            {createElement((Platform.OS === 'ios' ? Feather : MaterialCommunityIcons) as any, {
              name: 'share',
              size: responsiveSize(20),
              color: color.textPrimary
            })}
          </Animated.View>
        </Pressable>

        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          style={footerButton()}
          onPress={async () => await Linking.openURL(navigationState?.url ?? route.params.url)}
        >
          <Animated.View style={{ opacity: animated }}>
            <FontAwesome5
              name={Platform.OS === 'ios' ? 'safari' : 'chrome'}
              size={responsiveSize(20)}
              color={color.textPrimary}
            />
          </Animated.View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: t.color.bodyBg
}));

const modalHeader = styles.one<ViewStyle>((t) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  padding: t.space.md,
  borderBottomColor: t.color.accent,
  borderBottomWidth: t.borderWidth.hairline
}));

const closeButton = styles.one<ViewStyle>((t) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: 18 * (t.type.size.base / 16) + t.space.sm * 2,
  height: 18 * (t.type.size.base / 16) + t.space.sm * 2,
  borderRadius: t.radius.full,
  marginRight: t.space.md,
  backgroundColor: t.color.accentLight
}));

const title = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '700',
  flex: 1
}));

const browser = styles.lazy<number, ViewStyle>((width) => ({
  width,
  height: '100%'
}));

const footer = styles.one<ViewStyle>((t) => ({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTopColor: t.color.accent,
  borderTopWidth: t.borderWidth.hairline
}));

const footerButton = styles.one<ViewStyle>((t) => ({
  padding: t.space.lg,
  paddingTop: t.space.md
}));
