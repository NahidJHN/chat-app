import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class TasksService {
  constructor(private readonly httpService: HttpService) {}

  @Cron("*/10 * * * *")
  async handleCron() {
    try {
      const data = await this.httpService.axiosRef.get(
        "https://chat-app-sn3m.onrender.com/api/v1/users/health"
      );
    } catch (error) {
      throw error;
    }
  }
}
