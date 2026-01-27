import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { TPService } from '../../api/client/tp.service.js';

export const createCommentSchema = z.object({
  entityId: z.number().describe('ID of the entity to comment on'),
  description: z.string().describe('Comment text (supports markdown)'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export class CommentTool {
  constructor(private service: TPService) {}

  async execute(args: unknown) {
    try {
      const { entityId, description } = createCommentSchema.parse(args);

      const result = await this.service.createComment({
        Description: description,
        General: { Id: entityId }
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
          `Invalid comment parameters: ${error.message}`
        );
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Create comment failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  static getDefinition() {
    return {
      name: 'create_comment',
      description: 'Create a comment on a Target Process entity (UserStory, Bug, Task, Feature, etc.)',
      inputSchema: {
        type: 'object',
        properties: {
          entityId: {
            type: 'number',
            description: 'ID of the entity to comment on (UserStory, Bug, Task, Feature, etc.)',
          },
          description: {
            type: 'string',
            description: 'Comment text (supports markdown)',
          },
        },
        required: ['entityId', 'description'],
      },
    } as const;
  }
}
