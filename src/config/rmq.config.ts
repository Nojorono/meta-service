import { registerAs } from '@nestjs/config';

export default registerAs(
  'rmq',
  (): Record<string, any> => ({
    uri: process.env.RABBITMQ_URL,
    files: process.env.RABBITMQ_FILES_QUEUE,
    auth: process.env.RABBITMQ_AUTH_QUEUE,
    customer: process.env.RABBITMQ_CUSTOMER_QUEUE,
    branch: process.env.RABBITMQ_BRANCH_QUEUE,
    region: process.env.RABBITMQ_REGION_QUEUE,
    salesman: process.env.RABBITMQ_SALESMAN_QUEUE,
    employee: process.env.RABBITMQ_EMPLOYEE_QUEUE,
    geotree: process.env.RABBITMQ_GEOTREE_QUEUE,
  }),
);
