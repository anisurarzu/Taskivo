import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TaskSubtask } from '../types';
import { useThemeColors } from '@/hooks';
import { cn } from '@/utils/cn';

interface SubtaskEditorProps {
  value: TaskSubtask[];
  onChange: (value: TaskSubtask[]) => void;
}

function createId() {
  return `st_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function SubtaskEditor({ value, onChange }: SubtaskEditorProps) {
  const colors = useThemeColors();
  const [draft, setDraft] = useState('');

  const addSubtask = () => {
    const title = draft.trim();
    if (!title) return;
    onChange([...value, { id: createId(), title, isCompleted: false }]);
    setDraft('');
  };

  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary">
        Subtasks
      </Text>

      <View className="mb-2 gap-2">
        {value.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center rounded-lg border border-border bg-card px-3 py-2.5 dark:border-border-dark dark:bg-card-dark"
          >
            <Pressable
              hitSlop={8}
              onPress={() =>
                onChange(
                  value.map((sub) =>
                    sub.id === item.id ? { ...sub, isCompleted: !sub.isCompleted } : sub,
                  ),
                )
              }
              className={cn(
                'mr-2.5 h-5 w-5 items-center justify-center rounded-full border-2',
                item.isCompleted ? 'border-success bg-success' : 'border-border dark:border-border-dark',
              )}
            >
              {item.isCompleted ? <Ionicons name="checkmark" size={11} color="#FFFFFF" /> : null}
            </Pressable>
            <Text
              className={cn(
                'flex-1 text-sm text-ink dark:text-ink-dark',
                item.isCompleted && 'line-through opacity-60',
              )}
            >
              {item.title}
            </Text>
            <Pressable
              hitSlop={8}
              onPress={() => onChange(value.filter((sub) => sub.id !== item.id))}
            >
              <Ionicons name="trash-outline" size={15} color={colors.danger} />
            </Pressable>
          </View>
        ))}
      </View>

      <View className="h-11 flex-row items-center rounded-lg border border-border bg-card px-3 dark:border-border-dark dark:bg-card-dark">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a subtask"
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={addSubtask}
          returnKeyType="done"
          className="mr-2 flex-1 text-sm text-ink dark:text-ink-dark"
        />
        <Pressable onPress={addSubtask} hitSlop={8}>
          <Ionicons name="add-circle" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}
