import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { API_CONFIG, isMockApi } from '@/services/api';
import { useAuthStore } from '@/features/auth';

type PresenceUser = {
  userId: string;
  name: string;
  email: string;
  teamId: string;
};

type TypingUser = {
  userId: string;
  name: string;
};

type ChatMessage = {
  id: string;
  teamId: string;
  organizationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender?: { id: string; name: string; email: string; avatarUrl?: string };
};

/**
 * Team room realtime (presence, typing, chat) — same events as Taskivo-Web.
 * Ready for a future mobile chat screen; safe to call with undefined teamId.
 */
export function useTeamRealtime(teamId: string | undefined) {
  const accessToken = useAuthStore((s) => s.session?.tokens.accessToken);
  const user = useAuthStore((s) => s.user);
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [online, setOnline] = useState<PresenceUser[]>([]);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    if (isMockApi() || !accessToken || !teamId) return;

    const socket = io(API_CONFIG.baseUrl, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('team:join', { teamId, name: user?.name });
    });
    socket.on('disconnect', () => setConnected(false));

    socket.on('presence:update', (payload: { teamId: string; online: PresenceUser[] }) => {
      if (payload.teamId === teamId) setOnline(payload.online ?? []);
    });

    socket.on('chat:message', (message: ChatMessage) => {
      if (message.teamId !== teamId) return;
      setLiveMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    socket.on(
      'chat:typing',
      (payload: { teamId: string; userId: string; name: string; typing: boolean }) => {
        if (payload.teamId !== teamId || payload.userId === user?.id) return;
        setTypingUsers((prev) => {
          const without = prev.filter((u) => u.userId !== payload.userId);
          if (!payload.typing) return without;
          return [...without, { userId: payload.userId, name: payload.name }];
        });
      },
    );

    return () => {
      socket.emit('team:leave', { teamId });
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
      setOnline([]);
      setTypingUsers([]);
    };
  }, [accessToken, teamId, user?.id, user?.name]);

  const sendMessage = useCallback(
    (body: string) => {
      if (!teamId || !socketRef.current) return;
      socketRef.current.emit('chat:send', { teamId, body });
    },
    [teamId],
  );

  const setTyping = useCallback(
    (typing: boolean) => {
      if (!teamId || !socketRef.current) return;
      socketRef.current.emit('chat:typing', { teamId, typing, name: user?.name });
    },
    [teamId, user?.name],
  );

  return {
    connected,
    online,
    liveMessages,
    typingUsers,
    sendMessage,
    setTyping,
  };
}
