import * as fs from 'fs';
import * as path from 'path';

/**
 * Lattice CLI Module Generator
 * Usage: npx ts-node scripts/create-module.ts <ModuleName>
 * Example: npx ts-node scripts/create-module.ts Product
 */

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Error: Please provide a module name.');
  console.error('Example: npx ts-node scripts/create-module.ts Product');
  process.exit(1);
}

const pascal = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const camel = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);
const snake = camel.replace(/([A-Z])/g, '_$1').toLowerCase();
const kebab = camel.replace(/([A-Z])/g, '-$1').toLowerCase();

const rootDir = path.resolve(__dirname, '..');

console.log(`🚀 Scaffolding Lattice Clean-Architecture Module for: ${pascal}...\n`);

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath: string, content: string) {
  if (fs.existsSync(filePath)) {
    console.log(`  ⚠️ File already exists, skipping: ${path.relative(rootDir, filePath)}`);
    return;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`  ✓ Created: ${path.relative(rootDir, filePath)}`);
}

// 1. Model
writeFile(
  path.join(rootDir, `src/models/${snake}.ts`),
  `
import { IModuleModel } from './abstraction';

export interface I${pascal}Model extends IModuleModel {
  id: string;
  urn: string;
  name: string;
  description?: string;
  ownerId: string;
  tenantId: string;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
`
);

// 2. DTO Requests
writeFile(
  path.join(rootDir, `src/dto/controller/requests/${snake}.ts`),
  `
import { z } from 'zod';
import { ModuleBaseDTO } from '../../abstraction';

export const Create${pascal}Schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
});

export type Create${pascal}Input = z.infer<typeof Create${pascal}Schema>;

export class Create${pascal}RequestDTO extends ModuleBaseDTO {
  public readonly schema = Create${pascal}Schema;
  constructor(
    public readonly name: string,
    public readonly description?: string
  ) {
    super();
  }
}
`
);

// 3. DTO Responses
writeFile(
  path.join(rootDir, `src/dto/controller/responses/${snake}.ts`),
  `
import { ModuleBaseDTO } from '../../abstraction';

export class ${pascal}ResponseDTO extends ModuleBaseDTO {
  constructor(
    public readonly id: string,
    public readonly urn: string,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly ownerId: string,
    public readonly tenantId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    super();
  }
}
`
);

// 4. Repository Interface & Implementation
writeFile(
  path.join(rootDir, `src/repositories/${snake}.ts`),
  `
import { BaseRepository, IBaseRepository, IQueryCriteria, IQueryResult } from './abstraction';
import { I${pascal}Model } from '../models/${snake}';

export interface I${pascal}Repository extends IBaseRepository<I${pascal}Model, string> {
  findByName(name: string): Promise<I${pascal}Model | null>;
}

export class ${pascal}Repository extends BaseRepository<any, I${pascal}Model, string> implements I${pascal}Repository {
  constructor(dbModel: any) {
    super(dbModel);
  }

  public async findByName(name: string): Promise<I${pascal}Model | null> {
    return this.findOne({
      conditions: [{ field: 'name', operator: 'eq', value: name }],
    });
  }

  protected mapToEntity(model: any): I${pascal}Model {
    return {
      id: model.id,
      urn: model.urn,
      name: model.name,
      description: model.description,
      ownerId: model.owner_id || model.ownerId,
      tenantId: model.tenant_id || model.tenantId,
      is_deleted: model.is_deleted ?? false,
      createdAt: model.created_at || model.createdAt || new Date(),
      updatedAt: model.updated_at || model.updatedAt || new Date(),
    };
  }

  protected mapToModel(entity: Partial<I${pascal}Model>): any {
    return {
      id: entity.id,
      urn: entity.urn,
      name: entity.name,
      description: entity.description,
      owner_id: entity.ownerId,
      tenant_id: entity.tenantId,
      is_deleted: entity.is_deleted,
    };
  }
}
`
);

// 5. Service Interface & Implementation
writeFile(
  path.join(rootDir, `src/services/interfaces/${snake}.ts`),
  `
import { ${pascal}ResponseDTO } from '../../dto/controller/responses/${snake}';
import { Create${pascal}Input } from '../../dto/controller/requests/${snake}';

export interface I${pascal}Service {
  getByUrn(urn: string): Promise<${pascal}ResponseDTO>;
  create(input: Create${pascal}Input, ownerId: string, tenantId: string): Promise<${pascal}ResponseDTO>;
}
`
);

writeFile(
  path.join(rootDir, `src/services/${snake}.ts`),
  `
import { BaseService } from '../abstractions/service';
import { I${pascal}Service } from './interfaces/${snake}';
import { I${pascal}Repository } from '../repositories/${snake}';
import { ${pascal}ResponseDTO } from '../dto/controller/responses/${snake}';
import { Create${pascal}Input } from '../dto/controller/requests/${snake}';
import { NotFoundException } from '../exceptions/not_found';
import { MeasurePerformance } from '../utilities/performance_decorator';

export class ${pascal}Service extends BaseService implements I${pascal}Service {
  constructor(private readonly ${camel}Repository: I${pascal}Repository) {
    super();
  }

  @MeasurePerformance('service')
  public async getByUrn(urn: string): Promise<${pascal}ResponseDTO> {
    const item = await this.${camel}Repository.findByUrn(urn);
    if (!item || item.is_deleted) {
      throw new NotFoundException(\`${pascal} with URN '\${urn}' not found\`);
    }
    return new ${pascal}ResponseDTO(item.id, item.urn, item.name, item.description, item.ownerId, item.tenantId, item.createdAt, item.updatedAt);
  }

  @MeasurePerformance('service')
  public async create(input: Create${pascal}Input, ownerId: string, tenantId: string): Promise<${pascal}ResponseDTO> {
    const urn = \`${snake}:\${Date.now()}:\${Math.random().toString(36).substring(2, 9)}\`;
    const item = await this.${camel}Repository.create({
      ...input,
      urn,
      ownerId,
      tenantId,
      is_deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return new ${pascal}ResponseDTO(item.id, item.urn, item.name, item.description, item.ownerId, item.tenantId, item.createdAt, item.updatedAt);
  }
}
`
);

// 6. Orchestrator Implementation
writeFile(
  path.join(rootDir, `src/services/orchestrators/${snake}.ts`),
  `
import { BaseOrchestrator } from '../../abstractions/orchestrator';
import { IUnitOfWork } from '../../utilities/unit_of_work';
import { I${pascal}Service } from '../interfaces/${snake}';
import { ${pascal}ResponseDTO } from '../../dto/controller/responses/${snake}';
import { Create${pascal}Input } from '../../dto/controller/requests/${snake}';
import { MeasurePerformance } from '../../utilities/performance_decorator';

export class ${pascal}Orchestrator extends BaseOrchestrator {
  constructor(
    unitOfWork: IUnitOfWork,
    private readonly ${camel}Service: I${pascal}Service
  ) {
    super(unitOfWork);
  }

  @MeasurePerformance('orchestrator')
  public async create${pascal}(input: Create${pascal}Input, ownerId: string, tenantId: string): Promise<${pascal}ResponseDTO> {
    return this.executeInTransaction(
      () => this.${camel}Service.create(input, ownerId, tenantId),
      '${pascal}Orchestrator.create${pascal}'
    );
  }

  @MeasurePerformance('orchestrator')
  public async get${pascal}ByUrn(urn: string): Promise<${pascal}ResponseDTO> {
    return this.${camel}Service.getByUrn(urn);
  }
}
`
);

// 7. Controllers & Feature Router
writeFile(
  path.join(rootDir, `src/controllers/api/v1/${kebab}/create.ts`),
  `
import { BaseController } from '../../../../abstractions/controller';
import { IHttpRequest, IHttpResponse } from '../../../../utilities/http';
import { BaseResponseEnvelopeDTO } from '../../../../dto/controller/responses/base_envelope';
import { ${pascal}Orchestrator } from '../../../../services/orchestrators/${snake}';
import { Create${pascal}Input } from '../../../../dto/controller/requests/${snake}';

export class Create${pascal}Controller extends BaseController {
  constructor(private readonly orchestrator: ${pascal}Orchestrator) {
    super();
  }

  public async handle(req: IHttpRequest<Create${pascal}Input>): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    const ownerId = req.context?.userId ?? 'anonymous';
    const tenantId = req.context?.tenantId ?? 'default';
    const result = await this.orchestrator.create${pascal}(req.body, ownerId, tenantId);
    return this.created(result, '${pascal} created successfully', '${snake.toUpperCase()}_CREATED', req.context);
  }
}
`
);

writeFile(
  path.join(rootDir, `src/controllers/api/v1/${kebab}/fetch.ts`),
  `
import { BaseController } from '../../../../abstractions/controller';
import { IHttpRequest, IHttpResponse } from '../../../../utilities/http';
import { BaseResponseEnvelopeDTO } from '../../../../dto/controller/responses/base_envelope';
import { ${pascal}Orchestrator } from '../../../../services/orchestrators/${snake}';

export class Fetch${pascal}Controller extends BaseController {
  constructor(private readonly orchestrator: ${pascal}Orchestrator) {
    super();
  }

  public async handle(req: IHttpRequest<void, { urn: string }>): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    const result = await this.orchestrator.get${pascal}ByUrn(req.params.urn);
    return this.success(result, '${pascal} retrieved successfully', '${snake.toUpperCase()}_FOUND', req.context);
  }
}
`
);

writeFile(
  path.join(rootDir, `src/controllers/api/v1/${kebab}/routes.ts`),
  `
import { Router } from '../../../../utilities/router';
import { Container, DI_TOKENS } from '../../../../dependencies/container';
import { Create${pascal}Controller } from './create';
import { Fetch${pascal}Controller } from './fetch';
import { Create${pascal}Schema } from '../../../../dto/controller/requests/${snake}';

export function create${pascal}Router(container: Container): Router {
  const router = new Router('${pascal}Router');

  const createController = container.resolve<Create${pascal}Controller>(DI_TOKENS.Create${pascal}Controller);
  const fetchController = container.resolve<Fetch${pascal}Controller>(DI_TOKENS.Fetch${pascal}Controller);

  router.post('/', createController, Create${pascal}Schema);
  router.get('/:urn', fetchController);

  return router;
}
`
);

console.log(`\n✨ Successfully generated Lattice module for '${pascal}'!`);
console.log(`\nNext steps:`);
console.log(` 1. Add DI_TOKENS in src/dependencies/container.ts`);
console.log(` 2. Register factories in src/dependencies/index.ts`);
console.log(` 3. Mount router in src/controllers/api/v1/routes.ts: v1Router.use('/${kebab}', create${pascal}Router(container));\n`);
