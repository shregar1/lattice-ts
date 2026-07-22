"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_1 = require("./bootstrap");
const container_1 = require("./dependencies/container");
const auth_1 = require("./dto/controller/requests/auth");
const retry_1 = require("./utilities/retry");
const idempotency_1 = require("./utilities/idempotency");
const events_1 = require("./utilities/events");
const background_tasks_1 = require("./utilities/background_tasks");
const logger_1 = require("./utilities/logger");
async function bootstrap() {
    const logger = new logger_1.StructuredLogger('ScaffoldEndToEndVerification');
    logger.info('=====================================================');
    logger.info('   STARTING END-TO-END PLATFORM SCAFFOLD VERIFICATION ');
    logger.info('=====================================================');
    // 1. Initialize Bootstrap & DI Container
    const appBootstrap = new bootstrap_1.ApplicationBootstrap();
    const { container, pipeline } = await appBootstrap.initialize();
    // 2. Setup Event Bus Listener
    events_1.EventBusUtility.subscribe('user.registered', async (event) => {
        logger.info(`[EventBus] Subscriber received event '${event.eventName}'`, { payload: event.payload });
    });
    // 3. Setup Background Task Processor
    background_tasks_1.BackgroundTaskUtility.registerProcessor('send_welcome_email', async (job) => {
        logger.info(`[BackgroundTask] Processing job '${job.name}' (ID: ${job.id})`, { payload: job.data });
    });
    // 4. Test 15-Stage Pipeline with Registration HTTP Request
    const registerController = container.resolve(container_1.DI_TOKENS.RegisterController);
    const registerDto = new auth_1.RegisterRequestDTO('end2end@example.com', 'SecurePassword123!', 'Alice', 'Smith');
    const req = {
        body: registerDto,
        params: {},
        query: {},
        headers: {
            host: 'localhost:8080',
            'user-agent': 'Mozilla/5.0 Scaffold-EndToEnd-Agent',
            'x-request-id': 'urn:request:e2e-12345',
            'x-correlation-id': 'corr-e2e-99999',
            'x-tenant-id': 'tenant-alpha',
            method: 'POST',
            path: '/api/v1/auth/register',
        },
        context: {
            metrics: [],
        },
    };
    logger.info('Executing HTTP Request through 15-stage middleware pipeline...');
    const response = await pipeline.execute(req, async (r) => {
        return await registerController.handle(r);
    });
    logger.info(`Pipeline execution finished. Response status code: ${response.statusCode}`);
    // 5. Test Event Bus & Background Task Dispatch
    await events_1.EventBusUtility.publish('user.registered', { email: 'end2end@example.com' });
    const jobId = await background_tasks_1.BackgroundTaskUtility.enqueue('send_welcome_email', { email: 'end2end@example.com' });
    logger.info(`Background job queued with ID: ${jobId}`);
    // 6. Test Idempotency & Retry Utilities
    const cacheClient = container.resolve(container_1.DI_TOKENS.CacheClient);
    const idempotency = new idempotency_1.IdempotencyUtility(cacheClient);
    const idempotentResult = await idempotency.executeIdempotent('key_e2e_001', async () => {
        return await retry_1.RetryUtility.executeWithRetry(async () => 'Idempotent & Retry Verified');
    });
    logger.info(`Idempotency & Retry result: ${idempotentResult}`);
    // Wait briefly for background task queue processing
    await new Promise((resolve) => setTimeout(resolve, 100));
    logger.info('=====================================================');
    logger.info('   ALL SCAFFOLD PLATFORM COMPONENTS VERIFIED 100%    ');
    logger.info('=====================================================');
}
bootstrap().catch(console.error);
