import { Injectable } from '@nestjs/common';
import { ChatUserStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoomUser } from './chat-room-user.interface';
import { UpdateChatRoomUserDto } from './dto/update-chat-room-user.dto';

@Injectable()
export class ChatRoomUserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(chatRoomId: string, userId: string): Promise<void> {
    await this.prisma.chatRoomUser.create({
      data: {
        chatRoomId,
        userId,
        status: ChatUserStatus.NORMAL,
      },
    });
  }

  async findAll(chatRoomId: string): Promise<ResponseChatRoomUser[]> {
    const chatRoomUsers = await this.prisma.chatRoomUser.findMany({
      where: {
        chatRoomId,
      },
      select: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatarImageUrl: true,
          },
        },
        status: true,
      },
    });

    return chatRoomUsers;
  }

  async update(
    chatRoomId: string,
    userId: string,
    updateChatRoomUserDto: UpdateChatRoomUserDto,
    loginUserId: string
  ): Promise<void> {
    const status = updateChatRoomUserDto.status;
    // loginUserIdのchatRoomでのステータスを取得
    const loginChatRoomUser = await this.prisma.chatRoomUser.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: loginUserId,
        },
      },
    });
    if (loginChatRoomUser === null) {
      return;
    }
    // ADMIN -> すべての変更を許可
    // PROMOTER -> KICKED, BANED, MUTEDの変更を許可
    // NORMAL -> 何も変更を許可しない
    if (loginChatRoomUser.status === ChatUserStatus.NORMAL) {
      return;
    } else if (loginChatRoomUser.status === ChatUserStatus.MODERATOR) {
      if (
        status === ChatUserStatus.ADMIN ||
        status === ChatUserStatus.MODERATOR
      ) {
        return;
      }
    } else if (
      loginChatRoomUser.status === ChatUserStatus.ADMIN &&
      status === ChatUserStatus.ADMIN
    ) {
      // ADMIN -> ADMINの場合は通常の変更に加えて、自分のステータスをPROMOTERに変更する
      await this.prisma.$transaction([
        this.prisma.chatRoomUser.update({
          where: {
            chatRoomId_userId: {
              chatRoomId,
              userId,
            },
          },
          data: {
            status,
          },
        }),
        this.prisma.chatRoomUser.update({
          where: {
            chatRoomId_userId: {
              chatRoomId,
              userId: loginUserId,
            },
          },
          data: {
            status: ChatUserStatus.MODERATOR,
          },
        }),
      ]);

      return;
    }
    await this.prisma.chatRoomUser.update({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
      },
      data: {
        status: updateChatRoomUserDto.status,
      },
    });
  }

  async remove(chatRoomId: string, userId: string): Promise<void> {
    await this.prisma.chatRoomUser.delete({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
      },
    });
  }
}
