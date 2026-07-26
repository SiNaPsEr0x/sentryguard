import {
  Controller,
  Post,
  Param,
  Req,
  Res,
  ForbiddenException,
  NotFoundException,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { TelegramBotService } from './telegram-bot.service';

@Controller('telegram')
export class TelegramWebhookController {
  private readonly logger = new Logger(TelegramWebhookController.name);

  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Post('webhook/:secret')
  @HttpCode(200)
  async handleWebhook(
    @Param('secret') secret: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const expectedSecret = this.telegramBotService.getWebhookSecretPath();
    try {
      const isPathMatch = crypto.timingSafeEqual(
        Buffer.from(secret),
        Buffer.from(expectedSecret)
      );
      if (!isPathMatch) throw new Error();
    } catch {
      this.logger.warn(`Tentative webhook avec secret invalide`);
      throw new NotFoundException();
    }

    const headerSecret = this.telegramBotService.getWebhookSecretToken();
    if (headerSecret) {
      const provided = req.headers['x-telegram-bot-api-secret-token'];
      if (!provided || typeof provided !== 'string') {
        this.logger.warn('Tentative webhook avec secret token manquant ou invalide');
        throw new ForbiddenException();
      }

      try {
        const isHeaderMatch = crypto.timingSafeEqual(
          Buffer.from(provided),
          Buffer.from(headerSecret)
        );
        if (!isHeaderMatch) throw new Error();
      } catch {
        this.logger.warn('Tentative webhook avec secret token invalide');
        throw new ForbiddenException();
      }
    }

    return this.telegramBotService.handleUpdate(req, res);
  }
}


