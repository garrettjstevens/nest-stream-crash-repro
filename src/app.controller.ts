import { Controller, Get, StreamableFile, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"',
    });
    const file = this.appService.getFile();
    return new StreamableFile(file);
  }
}
