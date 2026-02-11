import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TPService } from '../../api/client/tp.service.js';

const entityReferenceSchema = z.object({
  id: z.number(),
});

const nullableEntityReferenceSchema = z.union([
  entityReferenceSchema,
  z.null(),
]);

// Input schema for update entity tool
export const updateEntitySchema = z.object({
  type: z.enum([
    'UserStory', 'Bug', 'Task', 'Feature',
    'Epic', 'PortfolioEpic', 'Solution',
    'Request', 'Impediment', 'TestCase', 'TestPlan',
    'Project', 'Team', 'Iteration', 'TeamIteration',
    'Release', 'Program'
  ]),
  id: z.number(),
  fields: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    status: entityReferenceSchema.optional(),
    assignedUser: entityReferenceSchema.optional(),
    userStory: nullableEntityReferenceSchema.optional(),
    feature: nullableEntityReferenceSchema.optional(),
    epic: nullableEntityReferenceSchema.optional(),
    bug: nullableEntityReferenceSchema.optional(),
    task: nullableEntityReferenceSchema.optional(),
    project: entityReferenceSchema.optional(),
    team: entityReferenceSchema.optional(),
    release: nullableEntityReferenceSchema.optional(),
    iteration: nullableEntityReferenceSchema.optional(),
    teamIteration: nullableEntityReferenceSchema.optional(),
    effort: z.number().optional(),
    effortCompleted: z.number().optional(),
    effortToDo: z.number().optional(),
  }),
});

export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;

/**
 * Handler for the update entity tool
 */
export class UpdateEntityTool {
  constructor(private service: TPService) {}

  private mapEntityReference(ref: { id: number } | undefined): { Id: number } | undefined {
    if (ref === undefined) {
      return undefined;
    }
    return { Id: ref.id };
  }

  private mapNullableEntityReference(ref: { id: number } | null | undefined): { Id: number } | null | undefined {
    if (ref === null) {
      return null;
    }
    if (ref === undefined) {
      return undefined;
    }
    return { Id: ref.id };
  }

  async execute(args: unknown) {
    try {
      const { type, id, fields } = updateEntitySchema.parse(args);

      const apiRequest = {
        Name: fields.name,
        Description: fields.description,
        EntityState: this.mapEntityReference(fields.status),
        AssignedUser: this.mapEntityReference(fields.assignedUser),
        UserStory: this.mapNullableEntityReference(fields.userStory),
        Feature: this.mapNullableEntityReference(fields.feature),
        Epic: this.mapNullableEntityReference(fields.epic),
        Bug: this.mapNullableEntityReference(fields.bug),
        Task: this.mapNullableEntityReference(fields.task),
        Project: this.mapEntityReference(fields.project),
        Team: this.mapEntityReference(fields.team),
        Release: this.mapNullableEntityReference(fields.release),
        Iteration: this.mapNullableEntityReference(fields.iteration),
        TeamIteration: this.mapNullableEntityReference(fields.teamIteration),
        Effort: fields.effort,
        EffortCompleted: fields.effortCompleted,
        EffortToDo: fields.effortToDo,
      };

      const result = await this.service.updateEntity(
        type,
        id,
        apiRequest
      );

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
          `Invalid update entity parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Update entity failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get tool definition for MCP
   */
  static getDefinition() {
    const entityRefSchema = {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Entity ID',
        },
      },
      required: ['id'],
    };

    const nullableEntityRefSchema = {
      oneOf: [
        entityRefSchema,
        { type: 'null' },
      ],
      description: 'Entity reference (use null to remove relation)',
    };

    return {
      name: 'update_entity',
      description: 'Update an existing Target Process entity. Supports updating relations like userStory, feature, epic, etc. Use null to remove a relation.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: [
              'UserStory', 'Bug', 'Task', 'Feature',
              'Epic', 'PortfolioEpic', 'Solution',
              'Request', 'Impediment', 'TestCase', 'TestPlan',
              'Project', 'Team', 'Iteration', 'TeamIteration',
              'Release', 'Program'
            ],
            description: 'Type of entity to update',
          },
          id: {
            type: 'number',
            description: 'ID of the entity to update',
          },
          fields: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'New name for the entity',
              },
              description: {
                type: 'string',
                description: 'New description for the entity',
              },
              status: {
                ...entityRefSchema,
                description: 'Status ID to set',
              },
              assignedUser: {
                ...entityRefSchema,
                description: 'User ID to assign',
              },
              userStory: {
                ...nullableEntityRefSchema,
                description: 'Link to UserStory (for Bug, Task)',
              },
              feature: {
                ...nullableEntityRefSchema,
                description: 'Link to Feature (for UserStory, Bug)',
              },
              epic: {
                ...nullableEntityRefSchema,
                description: 'Link to Epic (for Feature)',
              },
              bug: {
                ...nullableEntityRefSchema,
                description: 'Link to Bug',
              },
              task: {
                ...nullableEntityRefSchema,
                description: 'Link to Task',
              },
              project: {
                ...entityRefSchema,
                description: 'Project ID to move entity to',
              },
              team: {
                ...entityRefSchema,
                description: 'Team ID to assign',
              },
              release: {
                ...nullableEntityRefSchema,
                description: 'Release ID to assign',
              },
              iteration: {
                ...nullableEntityRefSchema,
                description: 'Iteration ID to assign',
              },
              teamIteration: {
                ...nullableEntityRefSchema,
                description: 'Team Iteration ID to assign',
              },
              effort: {
                type: 'number',
                description: 'Total effort estimate in hours',
              },
              effortCompleted: {
                type: 'number',
                description: 'Completed effort (time spent) in hours',
              },
              effortToDo: {
                type: 'number',
                description: 'Remaining effort in hours',
              },
            },
          },
        },
        required: ['type', 'id', 'fields'],
      },
    } as const;
  }
}
