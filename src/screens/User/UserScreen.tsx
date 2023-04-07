import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import cheerio from 'react-native-cheerio';
import useSWR from 'swr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, Share, type ViewStyle } from 'react-native';
import { NavigableHeader } from '../../components/NavigableHeader/NavigableHeader';
import { StoryCard } from '../../components/StoryCard/StoryCard';
import { styles, useDash } from '../../../dash.config';
import { type HackerNewsUser } from '../../types/hn-api';
import { type StackParamList } from '../routers';
import { HACKER_NEWS_API, HN, HN_LOGIN } from '../../constants/api';
import { keyExtractor } from '../../utils/util';
import { FlashList } from '@shopify/flash-list';
import { Button, Text } from '@rneui/themed';
import parse from 'node-html-parser';
import { usePreferencesStore } from '../../contexts/store';
import { shallow } from 'zustand/shallow';

export type UserScreenProps = NativeStackScreenProps<StackParamList, 'User'>;

export function UserScreen(props: UserScreenProps) {
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
  const { isLoggedIn, setIsLoggedIn } = usePreferencesStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      setIsLoggedIn: state.setIsLoggedIn
    }),
    shallow
  );

  useEffect(() => {
    if (user.data != null) {
      setDidMount(true);
    }
    console.log('isLoggedIn:', isLoggedIn);
  }, [user.data, isLoggedIn]);

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
                props.navigation.push('Browser', {
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

  // const getUser = (username) =>
  //   fetch(`${HN}/user/${username}.json`)
  //     .then((response) => response.json())
  //     .then((responseJson) => responseJson)
  //     .catch((error) => null);

  // const login = (username, password) => {
  //   const headers = new Headers({
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'Access-Control-Allow-Origin': '*'
  //   });

  //   return fetch(HN_LOGIN, {
  //     method: 'POST',
  //     headers,
  //     body: `acct=${username}&pw=${password}&goto=news`,
  //     mode: 'no-cors',
  //     credentials: 'include'
  //   })
  //     .then((response) => {
  //       return response.text();
  //     })
  //     .then((responseText) => {
  //       const document = parse(responseText).querySelector('#logout');
  //       if (document) {
  //         setIsLoggedIn(true);
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //       if (!/Bad Login/i.test(responseText)) {
  //         setIsLoggedIn(false);
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //     });
  // const login = (username, password) => {
  //   const headers = new Headers({
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'Access-Control-Allow-Origin': '*'
  //   });
  //   console.log('login', `acct=${username}&pw=${password}&goto=news`);

  //   return fetch(`${HN}/login`, {
  //     method: 'POST',
  //     headers,
  //     body: `acct=${username}&pw=${password}&goto=news`,
  //     mode: 'no-cors',
  //     credentials: 'include'
  //   })
  //     .then((response) => {
  //       return response.text();
  //     })
  //     .then((responseText) => {
  //       console.log('awdwad', responseText);
  //       console.log(!/Bad Login/i.test(responseText));
  //       return !/Bad Login/i.test(responseText);
  //     });
  // };

  // const getLogoutUrl = () =>
  //   fetch(`${HN}/news`, {
  //     mode: 'no-cors',
  //     credentials: 'include'
  //   })
  //     .then((response) => response.text())
  //     .then((responseText) => {
  //       const document = cheerio.load(responseText);
  //       const test = document('#logout').attr('href');
  //       console.log(test);
  //     });

  // const logout = () =>
  //   getLogoutUrl()
  //     .then((logoutUrl) => {
  //       console.log('url', `${HN}/${logoutUrl}`);
  //       return fetch(`${HN}/${logoutUrl}`, {
  //         mode: 'no-cors',
  //         credentials: 'include'
  //       });
  //     })
  //     .then((response) => response.text())
  //     .then((responseText) => {
  //       setIsLoggedIn(false);
  //       return true;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return false;
  //     });

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
      {/* <Button type="outline" onPress={() => login('pookieinc', 'shasta99')}>
        <Text>Login</Text>
      </Button>
      <Button type="outline" onPress={() => logout()}>
        <Text>Logout</Text>
      </Button> */}
      <FlashList
        ListHeaderComponent={listHeaderComponent}
        stickyHeaderIndices={[0]}
        estimatedItemSize={94}
        refreshControl={refreshControl}
        data={user.data?.submitted ?? fauxStories}
        keyExtractor={keyExtractor}
        renderItem={renderFlatListItem}
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
