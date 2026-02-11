import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TPService } from '../../api/client/tp.service.js';

export const createAssignmentSchema = z.object({
  entityId: z.number().describe('ID of the entity (UserStory, Bug, Task, etc.) to assign user to'),
  userId: z.number().describe('ID of the user to assign'),
  roleId: z.number().optional().describe('ID of the role (optional)'),
});

export const deleteAssignmentSchema = z.object({
  assignmentId: z.number().describe('ID of the assignment to delete'),
});

export const searchAssignmentsSchema = z.object({
  entityId: z.number().describe('ID of the entity to find assignments for'),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type DeleteAssignmentInput = z.infer<typeof deleteAssignmentSchema>;
export type SearchAssignmentsInput = z.infer<typeof searchAssignmentsSchema>;

export class AssignmentTool {
  constructor(private service: TPService) {}

  async executeCreate(args: unknown) {
    try {
      const { entityId, userId, roleId } = createAssignmentSchema.parse(args);

      const requestData: {
        Assignable: { Id: number };
        GeneralUser: { Id: number };
        Role?: { Id: number };
      } = {
        Assignable: { Id: entityId },
        GeneralUser: { Id: userId },
      };

      if (roleId !== undefined) {
        requestData.Role = { Id: roleId };
      }

      const result = await this.service.createAssignment(requestData);

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
          `Invalid assignment parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Create assignment failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async executeDelete(args: unknown) {
    try {
      const { assignmentId } = deleteAssignmentSchema.parse(args);

      await this.service.deleteAssignment(assignmentId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ success: true, message: `Assignment ${assignmentId} deleted` }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid delete assignment parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Delete assignment failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async executeSearch(args: unknown) {
    try {
      const { entityId } = searchAssignmentsSchema.parse(args);

      const result = await this.service.searchAssignments(entityId);

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
          `Invalid search assignments parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Search assignments failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  static getCreateDefinition() {
    return {
      name: 'add_assignment',
      description: 'Add a person (user) to a Target Process entity (UserStory, Bug, Task, Feature, etc.)',
      inputSchema: {
        type: 'object',
        properties: {
          entityId: {
            type: 'number',
            description: 'ID of the entity (UserStory, Bug, Task, etc.) to assign user to',
          },
          userId: {
            type: 'number',
            description: 'ID of the user to assign',
          },
          roleId: {
            type: 'number',
            description: 'ID of the role (optional, e.g., Developer, QA, etc.)',
          },
        },
        required: ['entityId', 'userId'],
      },
    } as const;
  }

  static getDeleteDefinition() {
    return {
      name: 'remove_assignment',
      description: 'Remove a person from a Target Process entity by assignment ID',
      inputSchema: {
        type: 'object',
        properties: {
          assignmentId: {
            type: 'number',
            description: 'ID of the assignment to remove',
          },
        },
        required: ['assignmentId'],
      },
    } as const;
  }

  static getSearchDefinition() {
    return {
      name: 'get_assignments',
      description: 'Get all people assigned to a Target Process entity',
      inputSchema: {
        type: 'object',
        properties: {
          entityId: {
            type: 'number',
            description: 'ID of the entity to get assignments for',
          },
        },
        required: ['entityId'],
      },
    } as const;
  }
}
