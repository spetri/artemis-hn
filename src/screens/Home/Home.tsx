import Icon from 'react-native-vector-icons/Ionicons';
import { shallow } from 'zustand/shallow';
import { type FC, useEffect, useState } from 'react';
import { SafeAreaView, type TextStyle, TouchableHighlight, type ViewStyle } from 'react-native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from '@rneui/themed';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { type StackParamList } from '../routers';
import { styles, useDash } from '../../../dash.config';
import { usePreferences } from '../Settings/usePreferences';
import { listItems, ListItemType, usePreferencesStore } from '../../contexts/store';
import { hackerNewsConverter } from '../../utils/util';

export const Home: FC<ListItemType> = () => {
  useDash();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const [homeOrderList, setHomeOrderList] = usePreferences('homeOrderList', listItems);
  const [homeItems, setHomeItems] = useState(homeOrderList != null ? homeOrderList[0] : listItems);
  const { setStoryTitle } = usePreferencesStore(
    (state) => ({
      setStoryTitle: state.setStoryTitle
    }),
    shallow
  );

  const {
    tokens: { color }
  } = useDash();

  const persistOrder = (itemList) => {
    setHomeItems(itemList);
    setHomeOrderList?.(itemList);
  };

  useEffect(() => {
    if (homeOrderList != null) {
      setHomeItems(homeOrderList);
    }
  }, [homeOrderList]);

  const Item = (item, drag) => {
    return (
      <ScaleDecorator>
        <TouchableHighlight
          underlayColor={color.accentLight}
          onLongPress={drag}
          onPress={() => {
            const filter = hackerNewsConverter(item?.filter);
            setStoryTitle(filter);
            navigation.navigate(
              'Stories',
              item?.filter
                ? {
                    filter: item?.filter
                  }
                : { filter: 'home' }
            );
          }}
        >
          <ListItem containerStyle={content()}>
            <Icon name={item.iconName} color={color.textPrimary} size={30} />
            <ListItemContent>
              <ListItem.Title style={header()}>{item.header}</ListItem.Title>
              <ListItem.Subtitle style={subheader()}>{item.subheader}</ListItem.Subtitle>
            </ListItemContent>
          </ListItem>
        </TouchableHighlight>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={containerBg()}>
      <DraggableFlatList
        data={homeItems}
        style={{ height: '100%' }}
        keyExtractor={(item: ListItemType) => item.id}
        onDragEnd={({ data }) => {
          persistOrder(data);
        }}
        renderItem={({ item, drag }) => Item(item, drag)}
      ></DraggableFlatList>
    </SafeAreaView>
  );
};

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%'
}));

const content = styles.one<ViewStyle>((t) => ({
  padding: t.space.lg,
  backgroundColor: t.color.bodyBg,
  height: 80,
  borderBottomWidth: t.borderWidth.hairline,
  borderBottomColor: t.color.accentLight
}));

const subheader = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size.base,
  fontWeight: '500',
  color: t.color.textPrimary
}));
