import { useNavigation } from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import * as htmlEntities from 'html-entities';
import stripTags from 'striptags';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, type TextStyle, TouchableHighlight, View, type ViewStyle } from 'react-native';
import { type FC } from 'react';
import { type StackParamList } from '../../../screens/routers';
import { ago } from '../../../utils/ago';
import { styles, useDash } from '../../../../dash.config';
import { pluralize } from '../../../utils/pluralize';
import { type HackerNewsAsk } from '../../../types/hn-api';

type AskStoryProps = {
  data: HackerNewsAsk;
  index: number;
};

export const AskStory: FC<AskStoryProps> = ({ data, index }) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const {
    tokens: { color }
  } = useDash();

  return (
    <View style={storyContainer(index)}>
      <TouchableHighlight underlayColor={color.accentLight}
        onPress={() => {
          navigation.push('Thread', {
            id: data.id
          });
        }}
      >
        <View>
          <Text style={storyTitle(index)} adjustsFontSizeToFit numberOfLines={index === 0 ? 5 : 7}>
            {data.title}
          </Text>
        </View>
      </TouchableHighlight>

      {data.text && (
        <TouchableHighlight underlayColor={color.accentLight}
          onPress={() => {
            navigation.push('Thread', {
              id: data.id
            });
          }}
        >
          <View>
            <Text ellipsizeMode="tail" style={storyText()} numberOfLines={4}>
              {stripTags(htmlEntities.decode(data.text), [], ' ')}
            </Text>
          </View>
        </TouchableHighlight>
      )
      }

      <View>
        <View style={byLine}>
          <TouchableHighlight underlayColor={color.accentLight}
            onPress={() => {
              navigation.push('User', { id: data.by });
            }}
          >
            <View>
              <Text style={byStyle()}>{data.by}</Text>
            </View>
          </TouchableHighlight>
          <Text style={agoStyle()}>{ago.format(new Date(data.time * 1000), 'mini')}</Text>
        </View>

        <TouchableHighlight underlayColor={color.accentLight}
          onPress={() => {
            navigation.push('Thread', { id: data.id });
          }}
        >
          <View style={footerText()}>
            <AntDesignIcon size={13} name="arrowup" color={color.primary} />
            <Text style={score()}>{data.score}&bull;{' '}</Text>
            <Text style={commentsStyle()}>{pluralize(data.descendants, 'comment')}</Text>
          </View>
        </TouchableHighlight>
      </View >
    </View >
  );
};

const storyContainer = styles.lazy<number, ViewStyle>((index) => (t) => ({
  width: index === 0 || index > 4 ? '100%' : '50%',
  padding: t.space.lg,
  paddingTop: index === 0 ? t.space.xl : index < 5 ? t.space.md : t.space.lg,
  paddingBottom: index === 0 ? t.space.xl : index < 5 ? t.space.lg : t.space.lg
}));

const score = styles.one<TextStyle>((t) => ({
  color: t.color.primary,
  fontWeight: '700'
}));

const storyTitle = styles.lazy<number, TextStyle>((index: number) => (t) => ({
  color: t.color.textPrimary,
  fontSize: t.type.size[index === 0 ? '4xl' : index < 5 ? 'base' : 'sm'],
  fontWeight: index === 0 ? '700' : index < 5 ? '600' : '700',
  letterSpacing: index < 4 ? t.type.tracking.tighter : t.type.tracking.tight,
  paddingTop: t.space.sm,
  paddingBottom: t.space.sm
}));

const storyText = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.sm,
  fontWeight: '400',
  paddingTop: t.space.sm,
  paddingBottom: t.space.sm
}));

const byLine: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between'
};

const byStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '300',
  padding: t.space.sm,
  paddingTop: 0,
  paddingLeft: 0
}));

const agoStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  fontWeight: '300'
}));

const footerText = styles.one<TextStyle>((t) => ({
  fontWeight: '600',
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
  display: "flex",
  flexDirection: "row"
}));

const commentsStyle = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontWeight: '300',
}));
