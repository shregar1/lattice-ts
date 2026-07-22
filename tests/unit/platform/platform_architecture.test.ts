import { BaseController } from '../../../src/abstractions/controller';
import { BaseOrchestrator } from '../../../src/abstractions/orchestrator';
import { BaseService } from '../../../src/abstractions/service';
import { BaseRepository } from '../../../src/repositories/abstraction';
import { GenericLookupRepository } from '../../../src/repositories/lookups/abstraction';
import { ResponseEnvelopeFactory } from '../../../src/factories/response_envelope';
import { FileStorageStreamUtility } from '../../../src/utilities/file_storage';
import { InMemoryCacheClient } from '../../../src/utilities/cache';
import { LocalStorageClient } from '../../../src/utilities/storage';
import { BaseValidator } from '../../../src/utilities/validator';
import { BaseMapper } from '../../../src/utilities/mapper';
import { GenericPagedResponseDTO, SingleResourceResponseDTO, CollectionResponseDTO } from '../../../src/dto/common/paged_response_dto';
import { PaginationRequestDTO, GenericSearchRequestDTO } from '../../../src/dto/common/pagination_dto';

describe('Platform Base Infrastructure Unit Tests', () => {
  test('BaseController should generate success envelope DTO', async () => {
    class TestController extends BaseController {
      public async testSuccess<T>(data: T) {
        return this.success(data, 'Success msg', 'SUCCESS_KEY');
      }
    }
    const controller = new TestController();
    const res = await controller.testSuccess({ foo: 'bar' });

    const envelope: any = res.data;
    expect(envelope.data).toEqual({ foo: 'bar' });
    expect(envelope.status).toBe('SUCCESS');
    expect(envelope.responseMessage).toBe('Success msg');
  });

  test('BaseOrchestrator should execute in transaction boundary', async () => {
    const mockUow = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      executeInTransaction: jest.fn().mockImplementation((fn) => fn()),
    };

    class TestOrchestrator extends BaseOrchestrator {}
    const orchestrator = new TestOrchestrator(mockUow);

    const result = await (orchestrator as any).executeInTransaction(async () => 'ok', 'test_action');
    expect(result).toBe('ok');
    expect(mockUow.executeInTransaction).toHaveBeenCalled();
  });

  test('BaseRepository should perform CRUD operations', async () => {
    const dbModel = {
      findById: jest.fn().mockResolvedValue({ id: '1', name: 'item1' }),
      create: jest.fn().mockResolvedValue({ id: '2', name: 'item2' }),
      delete: jest.fn().mockResolvedValue(true),
      count: jest.fn().mockResolvedValue(1),
      find: jest.fn().mockResolvedValue([{ id: '1', name: 'item1' }]),
    };

    class TestRepo extends BaseRepository<any, any, string> {
      constructor() {
        super(dbModel);
      }
      protected mapToEntity(m: any) {
        return m;
      }
      protected mapToModel(e: any) {
        return e;
      }
    }

    const repo = new TestRepo();
    expect(await repo.findById('1')).toEqual({ id: '1', name: 'item1' });
    expect(await repo.create({ name: 'item2' })).toEqual({ id: '2', name: 'item2' });
    expect(await repo.delete('1')).toBe(true);
  });

  test('FileStorageStreamUtility should validate, upload and download files', async () => {
    const storage = new LocalStorageClient();
    const fileUtil = new FileStorageStreamUtility(storage, 1024 * 1024, ['text/plain']);

    const buffer = Buffer.from('hello world');
    const metadata = await fileUtil.uploadStream('file_1', 'test.txt', 'text/plain', buffer);

    expect(metadata.fileId).toBe('file_1');
    expect(metadata.mimeType).toBe('text/plain');

    const downloaded = await fileUtil.downloadStream(metadata.storagePath);
    expect(downloaded.toString()).toBe('hello world');
  });

  test('Pagination and GenericPagedResponseDTO should format correctly', () => {
    const pagination = new PaginationRequestDTO(1, 10);
    const pagedRes = new GenericPagedResponseDTO<string>(['item1', 'item2'], 2, 1, 10, 1);

    expect(pagination.page).toBe(1);
    expect(pagination.limit).toBe(10);
    expect(pagedRes.total).toBe(2);
    expect(pagedRes.totalPages).toBe(1);
  });
});
