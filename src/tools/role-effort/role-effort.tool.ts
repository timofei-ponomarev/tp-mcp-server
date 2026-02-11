import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TPService } from '../../api/client/tp.service.js';

export const createRoleEffortSchema = z.object({
  entityId: z.number().describe('ID of the entity (UserStory, Bug, Task, etc.)'),
  roleId: z.number().describe('ID of the role'),
  effort: z.number().optional().describe('Initial effort estimate in hours'),
});

export const updateRoleEffortSchema = z.object({
  roleEffortId: z.number().describe('ID of the RoleEffort entry to update'),
  effort: z.number().optional().describe('Total effort estimate in hours'),
  effortCompleted: z.number().optional().describe('Completed effort in hours'),
  effortToDo: z.number().optional().describe('Remaining effort in hours'),
});

export const deleteRoleEffortSchema = z.object({
  roleEffortId: z.number().describe('ID of the RoleEffort entry to delete'),
});

export const searchRoleEffortsSchema = z.object({
  entityId: z.number().describe('ID of the entity to find role efforts for'),
});

export class RoleEffortTool {
  constructor(private service: TPService) {}

  async executeCreate(args: unknown) {
    try {
      const { entityId, roleId, effort } = createRoleEffortSchema.parse(args);

      const requestData: {
        Assignable: { Id: number };
        Role: { Id: number };
        Effort?: number;
      } = {
        Assignable: { Id: entityId },
        Role: { Id: roleId },
      };

      if (effort !== undefined) {
        requestData.Effort = effort;
      }

      const result = await this.service.createRoleEffort(requestData);

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
          `Invalid role effort parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Create role effort failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async executeUpdate(args: unknown) {
    try {
      const { roleEffortId, effort, effortCompleted, effortToDo } = updateRoleEffortSchema.parse(args);

      const requestData: {
        Effort?: number;
        EffortCompleted?: number;
        EffortToDo?: number;
      } = {};

      if (effort !== undefined) {
        requestData.Effort = effort;
      }
      if (effortCompleted !== undefined) {
        requestData.EffortCompleted = effortCompleted;
      }
      if (effortToDo !== undefined) {
        requestData.EffortToDo = effortToDo;
      }

      const result = await this.service.updateRoleEffort(roleEffortId, requestData);

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
          `Invalid update role effort parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Update role effort failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async executeDelete(args: unknown) {
    try {
      const { roleEffortId } = deleteRoleEffortSchema.parse(args);

      await this.service.deleteRoleEffort(roleEffortId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ success: true, message: `RoleEffort ${roleEffortId} deleted` }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid delete role effort parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Delete role effort failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async executeSearch(args: unknown) {
    try {
      const { entityId } = searchRoleEffortsSchema.parse(args);

      const result = await this.service.searchRoleEfforts(entityId);

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
          `Invalid search role efforts parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Search role efforts failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  static getCreateDefinition() {
    return {
      name: 'create_role_effort',
      description: 'Create a role effort entry for a Target Process entity (effort by role)',
      inputSchema: {
        type: 'object',
        properties: {
          entityId: {
            type: 'number',
            description: 'ID of the entity (UserStory, Bug, Task, etc.)',
          },
          roleId: {
            type: 'number',
            description: 'ID of the role (e.g., Developer, QA, Designer)',
          },
          effort: {
            type: 'number',
            description: 'Initial effort estimate in hours (optional)',
          },
        },
        required: ['entityId', 'roleId'],
      },
    } as const;
  }

  static getUpdateDefinition() {
    return {
      name: 'update_role_effort',
      description: 'Update a role effort entry (effort, effortCompleted, effortToDo)',
      inputSchema: {
        type: 'object',
        properties: {
          roleEffortId: {
            type: 'number',
            description: 'ID of the RoleEffort entry to update',
          },
          effort: {
            type: 'number',
            description: 'Total effort estimate in hours',
          },
          effortCompleted: {
            type: 'number',
            description: 'Completed effort in hours',
          },
          effortToDo: {
            type: 'number',
            description: 'Remaining effort in hours',
          },
        },
        required: ['roleEffortId'],
      },
    } as const;
  }

  static getDeleteDefinition() {
    return {
      name: 'delete_role_effort',
      description: 'Delete a role effort entry',
      inputSchema: {
        type: 'object',
        properties: {
          roleEffortId: {
            type: 'number',
            description: 'ID of the RoleEffort entry to delete',
          },
        },
        required: ['roleEffortId'],
      },
    } as const;
  }

  static getSearchDefinition() {
    return {
      name: 'get_role_efforts',
      description: 'Get all role effort entries for a Target Process entity',
      inputSchema: {
        type: 'object',
        properties: {
          entityId: {
            type: 'number',
            description: 'ID of the entity to get role efforts for',
          },
        },
        required: ['entityId'],
      },
    } as const;
  }
}
