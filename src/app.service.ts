import { createReadStream } from 'fs';
import { join } from 'path';
import { Transform, pipeline } from 'stream';

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getFile() {
    let chunkCount = 0;
    return pipeline(
      createReadStream(join(process.cwd(), 'package.json'), {
        // make highWaterMark small so that file is processed in multiple chunks
        highWaterMark: 100,
      }),
      new Transform({
        transform: (chunk, encoding, callback) => {
          // Simulate an error thrown during file processing
          // App only crashes if the error is not in the first chunk
          if (chunkCount > 0) {
            callback(new Error('synthetic error'));
          }
          chunkCount += 1;
          callback(null, chunk.toString());
        },
      }),
      (err) => {
        if (err) {
          this.logger.error('Pipeline failed.');
          this.logger.error(err);
        } else {
          this.logger.log('Pipeline succeeded.');
        }
      },
    );
  }
}
