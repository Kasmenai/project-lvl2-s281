#!/usr/bin/env node
import program from 'commander';
import { version, description } from '../../package.json';

program
  .version(version)
  .description(description)
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  // .action(function (firstConfig, secondConfig) {
// cmdValue = firstConfig;
// envValue = secondConfig;
  // })
  .parse(process.argv);
