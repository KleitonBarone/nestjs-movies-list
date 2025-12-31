import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  it('validate returns user payload mapping', () => {
    const config = {
      get: jest.fn().mockReturnValue('secretKey'),
    } as unknown as ConfigService;
    const strategy = new JwtStrategy(config);
    const res = strategy.validate({ sub: 1, email: 'test@example.com' });
    expect(res).toEqual({ userId: 1, email: 'test@example.com' });
  });
});
