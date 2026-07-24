import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { TaskCard } from '@/components/cards';
import { SearchInput } from '@/components/inputs';
import { IconButton } from '@/components/buttons';
import { EmptyState, Loading } from '@/components/ui';
import {
  searchTasks,
  useTasksQuery,
  useToggleTaskMutation,
  useTaskUiStore,
} from '@/features/tasks';

interface SearchScreenProps {
  onBack: () => void;
  onTaskPress: (id: string) => void;
}

export function SearchScreen({ onBack, onTaskPress }: SearchScreenProps) {
  const searchQuery = useTaskUiStore((s) => s.searchQuery);
  const setSearchQuery = useTaskUiStore((s) => s.setSearchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const { data: tasks = [], isLoading, isError, refetch } = useTasksQuery();
  const toggleTask = useToggleTaskMutation();

  const results = useMemo(() => searchTasks(tasks, localQuery), [tasks, localQuery]);

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-4 flex-row items-center">
          <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
          <Text className="ml-1 text-2xl font-bold text-ink dark:text-ink-dark">Search</Text>
        </View>

        <SearchInput
          value={localQuery}
          onChangeText={(value) => {
            setLocalQuery(value);
            setSearchQuery(value);
          }}
          autoFocus
        />

        <Text className="mb-3 mt-6 text-sm font-medium text-ink-secondary dark:text-ink-dark-secondary">
          {localQuery ? `${results.length} results` : 'All tasks'}
        </Text>

        {isLoading ? <Loading label="Searching..." /> : null}
        {isError ? (
          <EmptyState
            title="Search failed"
            description="Something went wrong while loading tasks."
            actionLabel="Retry"
            onAction={() => void refetch()}
            icon="alert-circle-outline"
          />
        ) : null}
        {!isLoading && !isError && results.length === 0 ? (
          <EmptyState
            title="No matches"
            description="Try a different keyword or browse all tasks."
            icon="search-outline"
          />
        ) : null}
        {!isLoading &&
          !isError &&
          results.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onTaskPress(task.id)}
              onToggle={() => toggleTask.mutate(task.id)}
            />
          ))}
      </Animated.View>
    </Screen>
  );
}
