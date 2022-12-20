import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseChatMessage } from './chat-message.interface';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Controller('chat/rooms/:chatRoomId/messages')
@Sw.ApiTags('chat-message')
@UseGuards(JwtOtpAuthGuard)
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  // create
  @Post()
  async create(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Body() createChatMessageDto: CreateChatMessageDto,
    @GetUser() user: User
  ): Promise<ResponseChatMessage> {
    Logger.debug(
      `createChatMessageDto: ${JSON.stringify(createChatMessageDto)}`
    );

    return await this.chatMessageService.create(
      createChatMessageDto,
      chatRoomId,
      user.id
    );
  }

  @Get()
  async findAllNotBlocked(
    @Param('chatRoomId') chatRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseChatMessage[]> {
    return await this.chatMessageService.findAllNotBlocked(chatRoomId, user.id);
  }
}
