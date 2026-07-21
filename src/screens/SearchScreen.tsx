import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { TaskCard } from '@/components/cards';
import { SearchInput } from '@/components/inputs';
import { IconButton } from '@/components/buttons';
import { EmptyState } from '@/components/ui';
import { mockTasks } from '@/data/mock';

interface SearchScreenProps {
  onBack: () => void;
  onTaskPress: (id: string) => void;
}

export function SearchScreen({ onBack, onTaskPress }: SearchScreenProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockTasks;
    return mockTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        task.category.toLowerCase().includes(q) ||
        task.description?.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-4 flex-row items-center">
          <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
          <Text className="ml-1 text-2xl font-bold text-ink dark:text-ink-dark">Search</Text>
        </View>

        <SearchInput value={query} onChangeText={setQuery} autoFocus />

        <Text className="mb-3 mt-6 text-sm font-medium text-ink-secondary dark:text-ink-dark-secondary">
          {query ? `${results.length} results` : 'Suggested'}
        </Text>

        {results.length === 0 ? (
          <EmptyState
            title="No matches"
            description="Try a different keyword or browse all tasks."
            icon="search-outline"
          />
        ) : (
          results.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onPress={() => onTaskPress(task.id)}
            />
          ))
        )}
      </Animated.View>
    </Screen>
  );
}
