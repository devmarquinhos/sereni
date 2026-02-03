import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly httpService: HttpService) {}

  // @Cron('0 4 * * *') -> Roda todo dia às 04:00 da manhã
  // @Cron(CronExpression.EVERY_30_SECONDS)
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleDailyHealthCheck() {
    this.logger.log('🔍 Iniciando varredura diária de saúde do sistema...');

    const baseUrl = 'http://localhost:3000';
    const start = Date.now();

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/health/ready`),
      );

      const duration = Date.now() - start;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.status === 200 && response.data?.status === 'ok') {
        this.logger.log(
          `✅ Sistema Saudável! Banco de dados conectado. (Latência: ${duration}ms)`,
        );
      } else {
        this.logger.warn(
          `⚠️ Sistema respondeu, mas com status inesperado: ${JSON.stringify(response.data)}`,
        );
      }
    } catch (error) {
      this.logger.error(
        '❌ ALERTA CRÍTICO: Falha na verificação de saúde!',
        error,
      );
    }
  }
}
