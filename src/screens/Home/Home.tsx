import Icon from 'react-native-vector-icons/Ionicons';
import { type FC, useEffect, useState } from 'react';
import { Animated, Pressable, SafeAreaView, type TextStyle, View, type ViewStyle } from 'react-native';
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

    const animated = new Animated.Value(1);

    const fadeIn = () => {
      Animated.timing(animated, {
        toValue: 0.1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };
    const fadeOut = () => {
      Animated.timing(animated, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    return <ScaleDecorator>
      <Pressable
        onPressIn={fadeIn}
        onPressOut={fadeOut}
        onLongPress={drag}
        onPress={() => {
          navigation.navigate('Stories', item?.filter ? {
            filter: item?.filter
          } : { filter: "home" });
        }}
      >
        <Animated.View style={{ opacity: animated }}>
          <ListItem bottomDivider containerStyle={content()}>
            <Icon name={item.iconName} color={color.textPrimary} size={25} style={image} />
            <ListItemContent>
              <ListItem.Title style={header()}>{item.header}</ListItem.Title>
              <ListItem.Subtitle style={subheader()}>{item.subheader}</ListItem.Subtitle>
            </ListItemContent>
          </ListItem>
        </Animated.View>
      </Pressable>
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
