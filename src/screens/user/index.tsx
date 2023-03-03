import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import useSWR from 'swr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, Share, type ViewStyle } from 'react-native';
import { NavigableHeader } from '../../components/NavigableHeader/NavigableHeader';
import { StoryCard } from '../../components/StoryCard/StoryCard';
import { styles, useDash } from '../../../dash.config';
import { type HackerNewsUser } from '../../types/hn-api';
import { type StackParamList } from '../routers';
import { HACKER_NEWS_API } from '../../constants/api';
import { keyExtractor } from '../../utils/util';

export function User(props: UserProps) {
  useDash();
  const { id } = props.route.params;

  const user = useSWR<HackerNewsUser>(
    `${HACKER_NEWS_API}/user/${id}.json`,
    async (key) =>
      await fetch(key, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(async (res) => await res.json())
  );
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    if (user.data != null) {
      setDidMount(true);
    }
  }, [user.data]);

  const listHeaderComponent = useCallback(() => {
    return (
      <NavigableHeader
        title={id}
        actions={{
          options: {
            options: ['Share', 'Open in Browser', 'cancel']
          },
          callback(index) {
            switch (index) {
              case 0:
                Share.share({
                  title: id,
                  url: `https://news.ycombinator.com/user?id=${id}`
                });
                break;
              case 1:
                props.navigation.push('BrowserModal', {
                  title: id,
                  url: `https://news.ycombinator.com/user?id=${id}`
                });
                break;
            }
          }
        }}
      />
    );
  }, [id, props.navigation]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={user.data == null && didMount}
        onRefresh={async () => await user.mutate()}
      />
    ),
    [user, didMount]
  );

  return (
    <SafeAreaView style={container()}>
      <FlatList
        ListHeaderComponent={listHeaderComponent}
        stickyHeaderIndices={[0]}
        refreshControl={refreshControl}
        data={user.data?.submitted ?? fauxStories}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={3}
        renderItem={renderFlatListItem}
        style={container()}
      />
    </SafeAreaView>
  );
}

const fauxStories = Array.from<number>({ length: 6 }).fill(-1);

function renderFlatListItem({ item, index }: { item: number; index: number }) {
  return <StoryCard key={item === -1 ? index : item} index={index + 5} id={item} />;
}

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%',
  width: '100%'
}));

export type UserProps = NativeStackScreenProps<StackParamList, 'User'>;
