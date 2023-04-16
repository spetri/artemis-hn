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
import { usePreferencesStore } from '../../contexts/store';
import { shallow } from 'zustand/shallow';

export type UserScreenProps = NativeStackScreenProps<StackParamList, 'User'>;

export const UserScreen = (props: UserScreenProps) => {
  useDash();
  const id = 'pookieinc';

  const { isLoggedIn, setIsLoggedIn } = usePreferencesStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      setIsLoggedIn: state.setIsLoggedIn
    }),
    shallow
  );

  const user = useSWR<HackerNewsUser>(
    !isLoggedIn ? `${HACKER_NEWS_API}/user/${id}.json` : null,
    async (key) =>
      await fetch(key, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(async (res) => {
          setIsLoggedIn(true);
          return await res.json();
        })
        .catch((error) => {
          setIsLoggedIn(false);
          return error;
        })
  );

  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    if (user.data != null) {
      setDidMount(true);
    }
  }, [user.data, user]);

  const listHeaderComponent = useCallback(() => {
    return (
      <NavigableHeader
        title={id}
        actions={{
          options: {
            options: ['Log Out', 'Cancel']
          },
          callback(index) {
            switch (index) {
              case 0:
                logout();
                setIsLoggedIn(false);
                break;
              case 1:
                break;
            }
          }
        }}
      />
    );
  }, [id, props.navigation]);

  const login = (username, password) => {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    });
    console.log('login', `acct=${username}&pw=${password}&goto=news`);

    return fetch(`${HN}/login`, {
      method: 'POST',
      headers,
      body: `acct=${username}&pw=${password}&goto=news`,
      mode: 'no-cors',
      credentials: 'include'
    })
      .then((response) => {
        return response.text();
      })
      .then((responseText) => {
        const isBadLogin = /Bad Login/i.test(responseText);
        if (isBadLogin) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
        return !isBadLogin;
      });
  };

  const getLogoutUrl = () =>
    fetch(`${HN}/news`, {
      mode: 'no-cors',
      credentials: 'include'
    })
      .then((response) => response.text())
      .then((responseText) => {
        const document = cheerio.load(responseText);
        return document('#logout').attr('href');
      });

  const logout = () =>
    getLogoutUrl()
      .then((logoutUrl) => {
        console.log('url', `${HN}/${logoutUrl}`);
        return fetch(`${HN}/${logoutUrl}`, {
          mode: 'no-cors',
          credentials: 'include'
        });
      })
      .then((response) => response.text())
      .then((responseText) => {
        setIsLoggedIn(false);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

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
    <>
      <SafeAreaView style={container()}>
        {isLoggedIn ? (
          <>
            <Button type="outline" onPress={() => login('pookieinc', 'shasta99')}>
              <Text>Login</Text>
            </Button>
          </>
        ) : (
          <FlashList
            ListHeaderComponent={listHeaderComponent}
            stickyHeaderIndices={[0]}
            estimatedItemSize={94}
            refreshControl={refreshControl}
            data={user.data?.submitted ?? fauxStories}
            keyExtractor={keyExtractor}
            renderItem={renderFlatListItem}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const fauxStories = Array.from<number>({ length: 6 }).fill(-1);

function renderFlatListItem({ item, index }: { item: number; index: number }) {
  return <StoryCard key={item === -1 ? index : item} index={index + 5} id={item} />;
}

const container = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%',
  width: '100%'
}));
