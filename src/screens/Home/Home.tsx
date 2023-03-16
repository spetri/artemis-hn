import Icon from 'react-native-vector-icons/Ionicons';
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
import { listItems, ListItemType } from '../../contexts/store';

export const Home: FC<ListItemType> = () => {
  useDash();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const [homeOrderList, setHomeOrderList] = usePreferences('homeOrderList', listItems);
  const [homeItems, setHomeItems] = useState(homeOrderList != null ? homeOrderList[0] : listItems);
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

    return <ScaleDecorator>
      <TouchableHighlight underlayColor={color.accentLight}
        onLongPress={drag}
        onPress={() => {
          navigation.navigate('Stories', item?.filter ? {
            filter: item?.filter
          } : { filter: "home" });
        }}
      >
        <ListItem bottomDivider containerStyle={content()}>
          <Icon name={item.iconName} color={color.textPrimary} size={25} style={image} />
          <ListItemContent>
            <ListItem.Title style={header()}>{item.header}</ListItem.Title>
            <ListItem.Subtitle style={subheader()}>{item.subheader}</ListItem.Subtitle>
          </ListItemContent>
        </ListItem>
      </TouchableHighlight>
    </ScaleDecorator>
  }

  return (
    <SafeAreaView style={containerBg()}>
      <DraggableFlatList
        data={homeItems}
        style={{ height: '100%' }}
        keyExtractor={(item: ListItemType) => item.id}
        onDragEnd={({ data }) => {
          persistOrder(data);
        }}
        renderItem={({ item, drag }) => (Item(item, drag))}
      ></DraggableFlatList>
    </SafeAreaView>
  );
};

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%'
}));

const content = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: 65
}));

const subheader = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: t.type.size.xs,
}));

const image = styles.one<ViewStyle>(() => ({
  height: '100%',
  width: '100%'
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: t.type.size.sm,
  fontWeight: '500',
  color: t.color.textPrimary
}));
