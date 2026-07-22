import { InMemoryDocumentDriver } from '../../../src/utilities/database/nosql/in_memory_doc_driver';
import { DatabaseDriverFactory } from '../../../src/utilities/database/factory';

describe('NoSQL Document Database Driver Suite', () => {
  let docDriver: InMemoryDocumentDriver;

  beforeEach(async () => {
    docDriver = DatabaseDriverFactory.createDocumentDriver({ type: 'in_memory_doc' }) as InMemoryDocumentDriver;
    await docDriver.connect();
  });

  afterEach(async () => {
    await docDriver.disconnect();
  });

  test('should insert document and retrieve by ID', async () => {
    const docId = await docDriver.insertDocument('users', { name: 'Shreyansh', role: 'Architect' });
    expect(docId).toBeDefined();

    const user = await docDriver.findDocumentById('users', docId);
    expect(user).toBeDefined();
    expect(user.name).toBe('Shreyansh');
    expect(user.role).toBe('Architect');
  });

  test('should query documents with filter and pagination', async () => {
    await docDriver.insertDocument('products', { name: 'Laptop', category: 'Tech' });
    await docDriver.insertDocument('products', { name: 'Phone', category: 'Tech' });
    await docDriver.insertDocument('products', { name: 'Book', category: 'Education' });

    const techItems = await docDriver.findDocuments('products', { category: 'Tech' }, { limit: 1 });
    expect(techItems).toHaveLength(1);
    expect(techItems[0].category).toBe('Tech');
  });

  test('should update and delete documents cleanly', async () => {
    const docId = await docDriver.insertDocument('tasks', { title: 'Initial', status: 'PENDING' });
    const updated = await docDriver.updateDocument('tasks', docId, { status: 'COMPLETED' });
    expect(updated).toBe(true);

    const fetched = await docDriver.findDocumentById('tasks', docId);
    expect(fetched.status).toBe('COMPLETED');

    const deleted = await docDriver.deleteDocument('tasks', docId);
    expect(deleted).toBe(true);

    const missing = await docDriver.findDocumentById('tasks', docId);
    expect(missing).toBeNull();
  });
});
