import Icon from 'react-native-vector-icons/Ionicons';
import { type FC, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, type TextStyle, View, type ViewStyle } from 'react-native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from '@rneui/themed';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { type StackParamList } from '../routers';
import { styles, useDash } from '../../../dash.config';
import { usePreferences } from '../Settings/usePreferences';
import { listItems, type ListItemType } from './HomeList';

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
    setHomeOrderList(itemList);
  };

  useEffect(() => {
    if (homeOrderList != null) {
      setHomeItems(homeOrderList);
    }
  }, [homeOrderList]);

  return (
    <SafeAreaView style={containerBg()}>
      <View style={container()}>
        <DraggableFlatList
          data={homeItems}
          keyExtractor={(item: ListItemType) => item.id}
          onDragEnd={({ data }) => {
            persistOrder(data);
          }}
          renderItem={({ item, drag }) => (
            <ScaleDecorator>
              <Pressable
                onLongPress={drag}
                onPress={() => {
                  navigation.navigate('Stories', {
                    filter: item?.filter
                  });
                }}
              >
                <ListItem bottomDivider containerStyle={content()}>
                  <Icon name={item.iconName} color={color.textPrimary} size={25} style={image} />
                  <ListItemContent>
                    <ListItem.Title style={header()}>{item.header}</ListItem.Title>
                    <ListItem.Subtitle style={subheader()}>{item.subheader}</ListItem.Subtitle>
                  </ListItemContent>
                </ListItem>
              </Pressable>
            </ScaleDecorator>
          )}
        ></DraggableFlatList>
      </View>
    </SafeAreaView>
  );
};

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%',
  width: '100%'
}));

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg
}));

const content = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: 65
}));

const subheader = styles.one<TextStyle>((t) => ({
  color: t.color.textAccent,
  fontSize: 12
}));

const image = styles.one<ViewStyle>(() => ({
  height: '100%',
  width: '100%'
}));

const header = styles.one<TextStyle>((t) => ({
  fontSize: 16,
  fontWeight: '500',
  color: t.color.textPrimary
}));
