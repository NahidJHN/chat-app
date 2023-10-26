import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
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
    await this.userService.handleActiveUser(userId, true);

    // Emit the list of connected clients to all clients.
    this.server.emit("onConnection", this.connectedClients);
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

    // Handle active status.
    await this.userService.handleActiveUser(userId, false);

    // Emit the list of connected clients after the disconnect.
    const connectedClientList = Array.from(this.connectedClients);
    this.server.emit("onDisConnection", connectedClientList);
  }

  @SubscribeMessage("chat")
  async create(@MessageBody() createChatDto: CreateChatDto) {
    const socketId = createChatDto.socketId;
    const { message, conversation } = await this.chatService.create(
      createChatDto
    );
    this.server.to(socketId).emit("message", message);
    this.server.emit("conversation", conversation);
    return message;
  }

  @SubscribeMessage("readText")
  async readText(@MessageBody() conversation: Types.ObjectId) {
    const updateConversation = await this.chatService.updateConversation(
      conversation
    );
    this.server.emit("conversation", updateConversation);
  }

  @SubscribeMessage("ice-candidate")
  handleICECandidate(
    _client: any,
    data: { candidate: RTCIceCandidate; to: string; _id: string }
  ): void {
    console.log(data);
    // Forward ICE candidates to the recipient in the room
    this.server.to(data.to).emit("ice-candidate", data);
  }

  @SubscribeMessage("signaling")
  handleOffer(
    _client: any,
    data: {
      offer: RTCSessionDescription;
      to: string;
      _id: string;
    }
  ): void {
    console.log("signaling", data);
    // Forward offers to the recipient in the room
    this.server.to(data.to).emit("signaling", data);
  }

  @SubscribeMessage("answer")
  handleAnswer(
    _client: any,
    data: { answer: RTCSessionDescription; to: string }
  ): void {
    // Forward answers to the caller in the room
    this.server.to(data.to).emit("answer", data);
  }
}
