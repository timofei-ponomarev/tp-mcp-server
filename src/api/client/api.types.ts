import { BaseEntityData } from '../../entities/base/base.types.js';

export interface ApiResponse<T> {
  Items?: T[];
  Next?: string;
}

export interface ApiEntityResponse<T extends BaseEntityData> {
  data: T;
}

export interface CreateEntityRequest {
  Name: string;
  Description?: string;
  Project?: {
    Id: number;
  };
  Team?: {
    Id: number;
  };
  AssignedUser?: {
    Id: number;
  };
}

export interface IEntityReference {
  Id: number;
}

export interface UpdateEntityRequest {
  Name?: string;
  Description?: string;
  EntityState?: IEntityReference;
  AssignedUser?: IEntityReference;
  UserStory?: IEntityReference | null;
  Feature?: IEntityReference | null;
  Epic?: IEntityReference | null;
  Bug?: IEntityReference | null;
  Task?: IEntityReference | null;
  Project?: IEntityReference;
  Team?: IEntityReference;
  Release?: IEntityReference | null;
  Iteration?: IEntityReference | null;
  TeamIteration?: IEntityReference | null;
  Effort?: number;
  EffortCompleted?: number;
  EffortToDo?: number;
}

export interface CreateAssignmentRequest {
  Assignable: IEntityReference;
  GeneralUser: IEntityReference;
  Role?: IEntityReference;
}

export interface DeleteAssignmentRequest {
  Id: number;
}

export interface CreateRoleEffortRequest {
  Assignable: IEntityReference;
  Role: IEntityReference;
  Effort?: number;
}

export interface UpdateRoleEffortRequest {
  Effort?: number;
  EffortCompleted?: number;
  EffortToDo?: number;
}

export interface CreateCommentRequest {
  Description: string;
  General: {
    Id: number;
  };
}

export interface CreateRelationRequest {
  Master: IEntityReference;
  Slave: IEntityReference;
  RelationType: IEntityReference;
}

export interface DeleteRelationRequest {
  Id: number;
}
