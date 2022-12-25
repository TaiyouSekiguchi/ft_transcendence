import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus, ChatRoomMemberStatus } from '@prisma/client';
import {
  ResponseChatRoomMember,
  ResponseChatMessage,
} from 'features/chat/hooks/types';
import { useSocket } from 'hooks/socket/useSocket';
import { axios } from 'lib/axios';
import { useLocation, Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Message } from 'components/molecules/Message';
import { MessageSendForm } from 'components/molecules/MessageSendForm';

type State = {
  chatRoomId: string;
  chatName: string;
  roomStatus: ChatRoomStatus;
};

export const ChatRoom: React.FC = React.memo(() => {
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL, {
    autoConnect: false,
  });
  const location = useLocation();
  const { chatRoomId, chatName, roomStatus } = location.state as State;
  const [messages, setMessages] = React.useState<ResponseChatMessage[]>([]);
  const [loginUser, setLoginUser] = React.useState<ResponseChatRoomMember>();
  const scrollBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    socket.emit('join_room', chatRoomId);
    socket.emit('join_room_member', chatRoomId);
    socket.on('receive_message', (payload: ResponseChatMessage) => {
      // メッセージを受け取ったときに実行される関数を登録
      setMessages((prev) => {
        return [...prev, payload];
      });
    });

    return () => {
      // コンポーネントの寿命が切れるときに実行される
      socket.off('receive_message');
      socket.emit('leave_room', chatRoomId);
      socket.emit('leave_room_member', chatRoomId);
    };
  }, [chatRoomId, socket]);

  async function getAllChatMessage(): Promise<void> {
    const res: { data: ResponseChatMessage[] } = await axios.get(
      `/chat/rooms/${chatRoomId}/messages`
    );
    setMessages(res.data);
  }
  // 送信ボタンを押したときの処理
  function sendMessage(content: string): void {
    if (loginUser == null) return;
    socket.emit('send_message', {
      content,
      senderId: loginUser.user.id,
      chatRoomId,
    });
  }

  async function getLoginUser() {
    const res: { data: ResponseChatRoomMember } = await axios.get(
      `/chat/rooms/${chatRoomId}/members/me`
    );
    setLoginUser(res.data);
  }

  React.useEffect(() => {
    getAllChatMessage().catch((err) => console.error(err));
    getLoginUser().catch((err) => console.error(err));
  }, []);

  // 更新時の自動スクロール
  React.useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <>
      <ContentLayout title={chatName}>
        {/* チャットの設定ボタン */}
        <C.Flex justifyContent="flex-end" mb={4}>
          <C.Link
            as={Link}
            to={`/app/chat/rooms/${chatRoomId}/settings`}
            state={{ chatRoomId, name: chatName, roomStatus }}
          >
            <C.Button colorScheme="blue">Settings</C.Button>
          </C.Link>
        </C.Flex>
        <C.Divider />
        <C.Flex
          flexDir="column"
          alignItems="flex-start"
          padding={4}
          overflowY="auto"
          overflowX="hidden"
          height="70vh"
        >
          {messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              content={message.content}
              createdAt={message.createdAt}
              name={message.sender.name}
              avatarImageUrl={message.sender.avatarImageUrl}
            />
          ))}
          <div ref={scrollBottomRef} />
        </C.Flex>
        <C.Divider />
        {/* メッセージ送信フォーム  loginUserがMUTEDのときは送信できないようにする */}
        {loginUser != null &&
          loginUser.memberStatus === ChatRoomMemberStatus.MUTED && (
            <C.Alert status="warning" mb={4}>
              <C.AlertIcon />
              You are muted.
            </C.Alert>
          )}
        {loginUser != null &&
          loginUser.memberStatus !== ChatRoomMemberStatus.MUTED && (
            <MessageSendForm onSubmit={sendMessage} />
          )}
      </ContentLayout>
    </>
  );
});
