import {Component, injectable, ProviderMap} from '@loopback/core';
import {TimestampProvider} from '../providers/timestamp.provider';

@injectable()
export class LoggingComponent implements Component {
  providers: ProviderMap = {
    'providers.timestamp': TimestampProvider,
  };
}
