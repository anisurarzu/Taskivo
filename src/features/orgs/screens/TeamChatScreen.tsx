import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components/buttons';
import { EmptyState, Loading } from '@/components/ui';
import { useThemeColors } from '@/hooks';
import { useAuthStore } from '@/features/auth';
import { useTeamRealtime } from '@/services/realtime/useTeamRealtime';
import { useTeamMessagesQuery } from '../hooks/useOrgs';
import type { ChatMessage } from '../types';
import { orgsApi } from '@/services/api';

interface TeamChatScreenProps {
  teamId: string;
  onBack: () => void;
}

export function TeamChatScreen({ teamId, onBack }: TeamChatScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const messagesQuery = useTeamMessagesQuery(teamId);
  const { liveMessages, typingUsers, sendMessage, setTyping, connected, online } =
    useTeamRealtime(teamId);
  const [draft, setDraft] = useState('');
  const [teamName, setTeamName] = useState('Team chat');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    void orgsApi.team(teamId).then((res) => {
      const name = (res.data as { name?: string })?.name;
      if (name) setTeamName(name);
    });
  }, [teamId]);

  const messages = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    for (const msg of messagesQuery.data ?? []) map.set(msg.id, msg);
    for (const msg of liveMessages) map.set(msg.id, msg);
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [messagesQuery.data, liveMessages]);

  const onSend = () => {
    const body = draft.trim();
    if (!body) return;
    sendMessage(body);
    setDraft('');
    setTyping(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background dark:bg-background-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center border-b border-border px-3 py-2 dark:border-border-dark">
        <IconButton name="chevron-back" onPress={onBack} />
        <View className="ml-1 min-w-0 flex-1">
          <Text className="text-base font-bold text-ink dark:text-ink-dark">{teamName}</Text>
          <Text className="text-xs text-ink-secondary dark:text-ink-dark-secondary">
            {connected ? `${online.length} online` : 'Connecting…'}
            {typingUsers.length
              ? ` · ${typingUsers.map((u) => u.name).join(', ')} typing`
              : ''}
          </Text>
        </View>
      </View>

      {messagesQuery.isLoading ? <Loading fullScreen label="Loading chat…" /> : null}

      {!messagesQuery.isLoading && messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Say hello to your teammates."
          icon="chatbubble-outline"
        />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const mine = item.senderId === user?.id;
            return (
              <View className={`mb-2.5 ${mine ? 'items-end' : 'items-start'}`}>
                {!mine ? (
                  <Text className="mb-1 text-xs text-ink-muted">
                    {item.sender?.name ?? 'Member'}
                  </Text>
                ) : null}
                <View
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                    mine ? 'bg-primary' : 'bg-card dark:bg-card-dark border border-border dark:border-border-dark'
                  }`}
                >
                  <Text className={`text-[15px] leading-5 ${mine ? 'text-white' : 'text-ink dark:text-ink-dark'}`}>
                    {item.body}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <View
        className="flex-row items-end border-t border-border bg-card px-3 py-2 dark:border-border-dark dark:bg-card-dark"
        style={{ paddingBottom: Math.max(insets.bottom, 10) }}
      >
        <TextInput
          value={draft}
          onChangeText={(text) => {
            setDraft(text);
            setTyping(text.trim().length > 0);
          }}
          placeholder="Message…"
          placeholderTextColor={colors.textMuted}
          multiline
          className="mr-2 max-h-28 min-h-11 flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-base text-ink dark:border-border-dark dark:bg-background-dark dark:text-ink-dark"
        />
        <Pressable
          onPress={onSend}
          className="mb-0.5 h-11 w-11 items-center justify-center rounded-xl bg-primary"
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
