import { LogLevel, Logger } from './src/Logging';

Logger.getOutputConfig()[LogLevel.Trace.level] = [];
Logger.getOutputConfig()[LogLevel.Debug.level] = [];
Logger.getOutputConfig()[LogLevel.Info.level] = [];
Logger.getOutputConfig()[LogLevel.Warn.level] = [];
Logger.getOutputConfig()[LogLevel.Error.level] = [];
Logger.getOutputConfig()[LogLevel.Fatal.level] = [];
