import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/constants';
import type { Priority, TaskCategory } from '@/types';
import { cn } from '@/utils/cn';

interface CreateTaskForm {
  title: string;
  description: string;
}

interface CreateTaskScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

const priorities = Object.keys(PRIORITY_LABELS) as Priority[];
const categories = Object.keys(CATEGORY_LABELS) as TaskCategory[];

export function CreateTaskScreen({ onBack, onSubmit }: CreateTaskScreenProps) {
  const { control, handleSubmit } = useForm<CreateTaskForm>({
    defaultValues: { title: '', description: '' },
  });
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>('work');

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <IconButton name="close" onPress={onBack} className="-ml-2" />
            <Text className="ml-1 text-2xl font-bold text-ink dark:text-ink-dark">New task</Text>
          </View>
        </View>

        <View className="mb-5 gap-4">
          <Controller
            control={control}
            name="title"
            rules={{ required: 'Title is required' }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                label="Title"
                placeholder="What needs to be done?"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                label="Description"
                placeholder="Add a few details..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                className="min-h-[88px] py-3"
              />
            )}
          />
        </View>

        <Text className="mb-3 text-sm font-medium text-ink dark:text-ink-dark">Priority</Text>
        <View className="mb-5 flex-row flex-wrap gap-2">
          {priorities.map((item) => (
            <Pressable
              key={item}
              onPress={() => setPriority(item)}
              className={cn(
                'rounded-full px-3.5 py-2',
                priority === item
                  ? 'bg-primary'
                  : 'bg-surface-elevated dark:bg-surface-elevated-dark',
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  priority === item ? 'text-white' : 'text-ink dark:text-ink-dark',
                )}
              >
                {PRIORITY_LABELS[item]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mb-3 text-sm font-medium text-ink dark:text-ink-dark">Category</Text>
        <View className="mb-8 flex-row flex-wrap gap-2">
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              className={cn(
                'rounded-full px-3.5 py-2',
                category === item
                  ? 'bg-secondary'
                  : 'bg-surface-elevated dark:bg-surface-elevated-dark',
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  category === item ? 'text-white' : 'text-ink dark:text-ink-dark',
                )}
              >
                {CATEGORY_LABELS[item]}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="gap-3">
          <PrimaryButton label="Create task" onPress={handleSubmit(onSubmit)} />
          <SecondaryButton label="Cancel" onPress={onBack} />
        </View>
      </Animated.View>
    </Screen>
  );
}
