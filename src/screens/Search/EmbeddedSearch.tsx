import useSWR from 'swr';
import { type FC, useMemo, useState } from 'react';
import { TextStyle, View, type ViewStyle } from 'react-native';
import { type HackerNewsStory } from '../../types/hn-api';
import { SEARCH_API } from '../../constants/api';
import { styles, useDash } from '../../../dash.config';
import { MinimalStory } from '../../components/StoryCard/MinimalStory/MinimalStory';
import { SearchBar } from '@rneui/themed';

export const EmbeddedSearch: FC = () => {
  useDash();
  const [search, setSearch] = useState('');
  const {
    tokens: { color }
  } = useDash();
  const query = useSWR(
    `${SEARCH_API}/search?query=${search}`,
    async (key) =>
      await (!!search &&
        fetch(key, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).then(async (res) => await res.json()))
  );

  const queryData = useMemo(() => query.data, [query.data]);

  return (
    <>
      <View>
        <SearchBar
          platform="ios"
          onChangeText={setSearch}
          placeholder="Search HN"
          value={search}
          containerStyle={{ backgroundColor: color.bodyBg }}
          inputContainerStyle={inputContainerStyle()}
          inputStyle={inputStyle()}
        />
      </View>
      {!!search && (
        <View>
          {queryData?.hits?.map((query) => {
            const story = {
              data: {
                id: Number(query.objectID),
                title: query.title,
                by: query.author,
                time: query.created_at_i,
                score: query.points,
                descendants: query.num_comments,
                url: query.url ?? 'http://www.notaurl.com',
                deleted: false,
                dead: false
              }
            };

            return <MinimalStory data={story.data as HackerNewsStory} index={story.data.id} />;
          })}
        </View>
      )}
    </>
  );
};

const inputContainerStyle = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.accent,
  height: 40,
  color: t.color.accentLight
}));

const inputStyle = styles.one<TextStyle>((t) => ({
  color: t.color.primary
}));
