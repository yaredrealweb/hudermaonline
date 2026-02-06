import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { pusherClient } from "@/lib/pusher-client";

export function useConversations() {
  return trpc.messages.getConversations.useQuery();
}

export function useConversationMessages(conversationId: string, limit = 50) {
  const utils = trpc.useUtils();

  const query = trpc.messages.getMessages.useInfiniteQuery(
    { conversationId, limit },
    {
      getNextPageParam: (last) => last?.nextCursor,
    }
  );

  useEffect(() => {
    const channel = pusherClient.subscribe(`conversation-${conversationId}`);

    const handleNewMessage = (newMessage: any) => {
      utils.messages.getMessages.setInfiniteData(
        { conversationId, limit },
        (oldData) => {
          if (!oldData) return oldData;

          // Check if message already exists to prevent duplicates
          const alreadyExists = oldData.pages.some((page) =>
            page.items.some((msg: any) => msg.id === newMessage.id)
          );

          if (alreadyExists) return oldData;

          const lastPage = oldData.pages[oldData.pages.length - 1];
          const newPages = [...oldData.pages];
          newPages[oldData.pages.length - 1] = {
            ...lastPage,
            items: [...lastPage.items, newMessage],
          };

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );
    };

    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(`conversation-${conversationId}`);
    };
  }, [conversationId, limit, utils]);

  return query;
}

export function useGetOrCreateConversation() {
  return trpc.messages.getOrCreateConversation.useMutation();
}

export function useGetConversations() {
  const utils = trpc.useUtils();
  const { data: currentUser } = trpc.auth.getProfile.useQuery();

  const query = trpc.messages.getConversations.useQuery();

  useEffect(() => {
    if (!currentUser?.id) return;

    const channel = pusherClient.subscribe(`user-${currentUser.id}`);

    channel.bind("conversation-update", () => {
      utils.messages.getConversations.invalidate();
    });

    return () => {
      channel.unbind("conversation-update");
      pusherClient.unsubscribe(`user-${currentUser.id}`);
    };
  }, [currentUser?.id, utils]);

  return query;
}

export function useSendMessage() {
  return trpc.messages.sendMessage.useMutation();
}

export function useMarkMessagesRead() {
  return trpc.messages.markAsRead.useMutation();
}

export function useTogglePin() {
  return trpc.messages.togglePin.useMutation();
}

export function useDeleteMessage() {
  return trpc.messages.deleteMessage.useMutation();
}
