import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function httpReqLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const logger = new Logger('HTTP');

  // get request infos
  const { ip, method, originalUrl } = req;

  const userAgent = req.get('user-agent') || '';

  // after response is sent
  res.on('finish', () => {
    const { statusCode } = res;

    if (originalUrl === '/healthCheck') {
      return;
    }

    // log create
    logger.log(
      `${method} ${statusCode} - ${originalUrl} - ${ip} - ${userAgent}`,
    );
  });

  next();
}
