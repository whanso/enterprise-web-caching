#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {
  env: { account: process.env.AWS_ACCOUNT_ID, region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});