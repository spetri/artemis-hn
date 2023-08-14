import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import useSWR from 'swr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertIOS,
  Button,
  RefreshControl,
  SafeAreaView,
  Share,
  TextInput,
  View,
  type ViewStyle
} from 'react-native';

import { NavigableHeader } from '../../components/NavigableHeader/NavigableHeader';
import { StoryCard } from '../../components/StoryCard/StoryCard';
import { styles, useDash } from '../../../dash.config';
import { type HackerNewsUser } from '../../types/hn-api';
import { type StackParamList } from '../routers';
import { HN_LOGIN, HN_LOGOUT } from '../../constants/api';
import { keyExtractor } from '../../utils/util';
import { FlashList } from '@shopify/flash-list';
import { usePreferencesStore } from '../../contexts/store';

export type UserScreenProps = NativeStackScreenProps<StackParamList, 'User'>;

export function UserScreen(props: UserScreenProps) {
  useDash();
  const { id } = props.route.params;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn, setIsLoggedIn, reset } = usePreferencesStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    setIsLoggedIn: state.setIsLoggedIn,
    reset: state.reset
  }));

  const [shouldFetch, setShouldFetch] = useState(false);

  const fetcher = (url) => {
    // const headers = new Headers({
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Access-Control-Allow-Origin': '*'
    // });
    // return fetch(HN_LOGIN, {
    //   method: 'POST',
    //   headers,
    //   body: `acct=${username}&pw=${password}&goto=news`,
    //   mode: 'no-cors',
    //   credentials: 'include'
    // })
    //   .then((response) => {
    //     setShouldFetch(false);
    //     return response.text();
    //   })
    //   .then((responseText) => {
    //     const loggedIn = !!responseText.match(/Bad Login/i);
    //     setIsLoggedIn(loggedIn);
    //     return responseText.match(/Bad Login/i);
    //   })
    //   .catch((error) => {
    //     setShouldFetch(false);
    //     console.log('FAILED', error);
    //   });
  };

  const user = useSWR<HackerNewsUser>(`${HN_LOGIN}`, shouldFetch ? fetcher() : null);

  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    if (user.data != null) {
      setDidMount(true);
    }
    console.log('user', user);
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

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={user.data == null && didMount}
        onRefresh={async () => await user.mutate()}
      />
    ),
    [user, didMount]
  );

  const submit = () => {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    });
    return fetch(HN_LOGIN, {
      method: 'POST',
      headers,
      body: `acct=${username}&pw=${password}&goto=news`,
      mode: 'no-cors',
      credentials: 'include'
    })
      .then((response) => {
        setShouldFetch(false);
        return response.text();
      })
      .then((responseText) => {
        const loggedIn = !!responseText.match(/Bad Login/i);
        if (loggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setShouldFetch(false);
        return responseText.match(/Bad Login/i);
      })
      .catch((error) => {
        setShouldFetch(false);
      });
  };

  const onChangeUsername = (val) => {
    setUsername(val);
  };

  const onChangePassword = (val) => {
    setPassword(val);
  };

  const clearCache = (val) => {
    console.log('cache cleared!');
    reset();
  };

  const logout = () => {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    });
    console.log('HERE');
    setIsLoggedIn(false);
    return fetch(HN_LOGOUT, {
      method: 'POST',
      headers,
      body: `auth=16ca9dcfb1205350037a6f6e835561a210d28501&goto=news`,
      mode: 'no-cors',
      credentials: 'include'
    })
      .then((response) => {
        return response.text();
      })
      .then(() => {
        setShouldFetch(false);
        console.log('log out');
        setIsLoggedIn(false);
      })
      .catch((error) => {
        setShouldFetch(false);
        console.log('FAILED', error);
      });
  };

  useEffect(() => {
    console.log('isLoggedin', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <SafeAreaView style={container()}>
      {isLoggedIn ? (
        <FlashList
          ListHeaderComponent={listHeaderComponent}
          stickyHeaderIndices={[0]}
          estimatedItemSize={94}
          refreshControl={refreshControl}
          data={user.data?.submitted ?? fauxStories}
          keyExtractor={keyExtractor}
          renderItem={renderFlatListItem}
        />
      ) : (
        <View>
          <TextInput style={input()} onChangeText={onChangeUsername} placeholder="Username" />
          <TextInput
            style={input()}
            onChangeText={onChangePassword}
            placeholder="Password"
            autoCapitalize="none"
          />

          <Button onPress={submit} title="Login" accessibilityLabel="Login" />
          <Button onPress={logout} title="Logout" accessibilityLabel="Logout" />
          <Button onPress={clearCache} title="Clear Cache" accessibilityLabel="Clear Cache" />
        </View>
      )}
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

const input = styles.one<ViewStyle>(() => ({
  height: 40,
  margin: 12,
  borderWidth: 1,
  padding: 10
}));
