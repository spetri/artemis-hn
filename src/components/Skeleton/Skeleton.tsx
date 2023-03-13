import { type FC, useLayoutEffect, useState } from 'react'
import { Animated, type ViewStyle } from 'react-native'
import { styles, useDash } from '../../../dash.config'

type SkeletonProps = {
  variant?: SkeletonVariant
  style?: ViewStyle
}

export type SkeletonVariant = 'text' | 'rect' | 'circle'

export const Skeleton: FC<SkeletonProps> = (props) => {
  useDash()
  const [fadeAnim] = useState(() => new Animated.Value(0))

  useLayoutEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 670,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 670,
          useNativeDriver: true
        })
      ])
    )
    animation.start()
  }, [fadeAnim])

  return (
    <Animated.View
      {...props}
      style={[
        skeleton(props.variant ?? 'rect'),
        (props as any).style,
        { opacity: fadeAnim }
      ]}
    />
  )
}

const skeleton = styles.lazy<SkeletonVariant, ViewStyle>(
  (variant = 'rect') =>
    (t) => ({
      backgroundColor: t.color.accent,
      height: variant === 'text' ? t.type.size.sm : undefined,
      borderRadius: variant === 'circle' ? t.radius.full : t.radius.secondary
    })
)
