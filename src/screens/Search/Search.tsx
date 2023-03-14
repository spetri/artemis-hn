import useSWR from 'swr'
import { type FC, useMemo, useState } from 'react'
import { Dimensions, SafeAreaView, View, type ViewStyle } from 'react-native'
import { SearchBar } from '@rneui/base'
import { type HackerNewsStory } from '../../types/hn-api'
import { SEARCH_API } from '../../constants/api'
import { MinimalStory } from '../../components/StoryCard/MinimalStory/MinimalStory'
import { styles, useDash } from '../../../dash.config'

export const Search: FC = () => {
  useDash()
  const [search, setSearch] = useState('')
  const {
    tokens: { color }
  } = useDash()
  const query = useSWR(
    `${SEARCH_API}/search?query=${search}`,
    async (key) =>
      await (!!search &&
      fetch(key, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(async (res) => await res.json()))
  )

  const queryData = useMemo(() => query.data, [query.data])

  return (
    <SafeAreaView style={containerBg()}>
      <View>
        <SearchBar
          platform="ios"
          onChangeText={setSearch}
          placeholder="Search HN"
          value={search}
          autoFocus
          showCancel
          containerStyle={{ backgroundColor: color.bodyBg }}
          inputContainerStyle={inputContainerStyle()}
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
            }

            return (
              <MinimalStory
                data={story.data as HackerNewsStory}
                index={story.data.id}
              />
            )
          })}
        </View>
      )}
    </SafeAreaView>
  )
}

const containerBg = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.bodyBg,
  height: '100%',
  width: Dimensions.get('screen').width
}))

const inputContainerStyle = styles.one<ViewStyle>((t) => ({
  backgroundColor: t.color.accent,
  height: 40,
  marginLeft: 20
}))
