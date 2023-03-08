import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import * as Linking from 'expo-linking';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { responsiveSize, styles, useDash } from '../../../dash.config';

import { type StackParamList } from '../routers';
import {
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
import Icon from 'react-native-vector-icons/Ionicons';

export type BrowserModalProps = NativeStackScreenProps<StackParamList, 'BrowserModal'>;

export const BrowserModal = ({ navigation, route }: BrowserModalProps) => {
  const {
    tokens: { color }
  } = useDash();
  const dimensions = useWindowDimensions();
  const ref = useRef<WebView>(null);
  const [navigationState, setNavigationState] = useState<WebViewNavigation | null>(null);

  return (
    <View style={container()}>
      <View style={modalHeader()}>
        <Pressable
          style={closeButton()}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="x" size={14} color="textAccent" />
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
          style={footerButton()}
          onPress={() => {
            ref.current?.goBack();
          }}
        >
          <Feather
            name="chevron-left"
            size={responsiveSize(24)}
            color={navigationState?.canGoBack ? color.textPrimary : color.textAccent}
          />
        </Pressable>

        <Pressable
          style={footerButton()}
          onPress={() => {
            ref.current?.goForward();
          }}
        >
          <Feather
            name="chevron-right"
            size={responsiveSize(24)}
            color={navigationState?.canGoBack ? color.textPrimary : color.textAccent}
          />
        </Pressable>

        <Pressable
          style={footerButton()}
          onPress={async () =>
            await Share.share({
              title: navigationState?.title ?? route.params.title,
              url: navigationState?.url ?? route.params.url
            })
          }
        >
          {createElement((Platform.OS === 'ios' ? Feather : MaterialCommunityIcons) as any, {
            name: 'share',
            size: responsiveSize(20),
            color: color.textPrimary
          })}
        </Pressable>

        <Pressable
          style={footerButton()}
          onPress={async () => await Linking.openURL(navigationState?.url ?? route.params.url)}
        >
          <FontAwesome5
            name={Platform.OS === 'ios' ? 'safari' : 'chrome'}
            size={responsiveSize(20)}
            color={color.textPrimary}
          />
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
