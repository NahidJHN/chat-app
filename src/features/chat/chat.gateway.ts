import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { UserService } from "../user/user.service";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // Initialize an array to store connected clients.
  private connectedClients: { _id: Types.ObjectId; socketId: string }[] = [];

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService
  ) {}

  @SubscribeMessage("onConnection")
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as unknown as Types.ObjectId;
    const socketId = client.id;

    // Store the connected client's socket ID.
    this.connectedClients.push({ _id: userId, socketId });

    // Handle active status.
    const user = await this.userService.handleActiveUser(userId, true);
    user["socketId"] = socketId;

    // Emit the list of connected clients to all clients.
    const connectedClientList = Array.from(this.connectedClients);

    this.server.emit("onConnection", connectedClientList);
  }

  @SubscribeMessage("onDisConnection")
  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as unknown as Types.ObjectId;

    // Remove the disconnected client from the connectedClients array.
    const index = this.connectedClients.findIndex(
      (client) => client._id === userId
    );
    if (index !== -1) {
      this.connectedClients.splice(index, 1);
    }
    // Emit the list of connected clients after the disconnect.
    const connectedClientList = Array.from(this.connectedClients);
    this.server.emit("onDisConnection", connectedClientList);
  }

  @SubscribeMessage("chat")
  async create(@MessageBody() createChatDto: CreateChatDto) {
    const message = await this.chatService.create(createChatDto);
    this.server.emit("chat", message);
  }

  @SubscribeMessage("findAllChat")
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage("findOneChat")
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage("updateChat")
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage("removeChat")
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
