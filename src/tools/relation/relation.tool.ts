import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TPService } from '../../api/client/tp.service.js';

const relationTypeEnum = z.enum(['Blocker', 'Duplicate', 'Relation', 'Dependency', 'Link']);

const RELATION_TYPE_IDS: Record<string, number> = {
  Dependency: 1,
  Blocker: 2,
  Relation: 3,
  Link: 4,
  Duplicate: 5,
};

export const createRelationSchema = z.object({
  masterId: z.number().describe('ID of the master entity (e.g., the blocking entity)'),
  slaveId: z.number().describe('ID of the slave entity (e.g., the blocked entity)'),
  relationType: relationTypeEnum.describe('Type of relation: Blocker, Duplicate, Relation, Dependency, or Link'),
});

export const deleteRelationSchema = z.object({
  relationId: z.number().describe('ID of the relation to delete'),
});

export const searchRelationsSchema = z.object({
  entityId: z.number().describe('ID of the entity to find relations for'),
});

export type CreateRelationInput = z.infer<typeof createRelationSchema>;
export type DeleteRelationInput = z.infer<typeof deleteRelationSchema>;
export type SearchRelationsInput = z.infer<typeof searchRelationsSchema>;

export class RelationTool {
  constructor(private service: TPService) {}

  async executeCreate(args: unknown) {
    try {
      const { masterId, slaveId, relationType } = createRelationSchema.parse(args);

      const relationTypeId = RELATION_TYPE_IDS[relationType];

      const result = await this.service.createRelation({
        Master: { Id: masterId },
        Slave: { Id: slaveId },
        RelationType: { Id: relationTypeId }
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid relation parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Create relation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async executeDelete(args: unknown) {
    try {
      const { relationId } = deleteRelationSchema.parse(args);

      await this.service.deleteRelation(relationId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ success: true, message: `Relation ${relationId} deleted` }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid delete relation parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Delete relation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async executeSearch(args: unknown) {
    try {
      const { entityId } = searchRelationsSchema.parse(args);

      const result = await this.service.searchRelations(entityId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid search relations parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Search relations failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  static getCreateDefinition() {
    return {
      name: 'create_relation',
      description: 'Create a relation between two Target Process entities (e.g., Bug blocks UserStory, Task duplicates Bug)',
      inputSchema: {
        type: 'object',
        properties: {
          masterId: {
            type: 'number',
            description: 'ID of the master entity (e.g., the entity that blocks/duplicates)',
          },
          slaveId: {
            type: 'number',
            description: 'ID of the slave entity (e.g., the entity that is blocked/duplicated)',
          },
          relationType: {
            type: 'string',
            enum: ['Blocker', 'Duplicate', 'Relation', 'Dependency', 'Link'],
            description: 'Type of relation: Blocker (master blocks slave), Duplicate (master duplicates slave), Relation (generic relation), Dependency, Link',
          },
        },
        required: ['masterId', 'slaveId', 'relationType'],
      },
    } as const;
  }

  static getDeleteDefinition() {
    return {
      name: 'delete_relation',
      description: 'Delete a relation between Target Process entities by relation ID',
      inputSchema: {
        type: 'object',
        properties: {
          relationId: {
            type: 'number',
            description: 'ID of the relation to delete',
          },
        },
        required: ['relationId'],
      },
    } as const;
  }

  static getSearchDefinition() {
    return {
      name: 'search_relations',
      description: 'Search for all relations (blocks, duplicates, relates to) for a specific entity',
      inputSchema: {
        type: 'object',
        properties: {
          entityId: {
            type: 'number',
            description: 'ID of the entity to find relations for',
          },
        },
        required: ['entityId'],
      },
    } as const;
  }
}
