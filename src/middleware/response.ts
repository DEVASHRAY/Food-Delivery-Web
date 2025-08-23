import type { Request, Response, NextFunction } from 'express';

/** Reject `{}` (empty object) by requiring at least one key. */
type NonEmptyObject<T extends object> = keyof T extends never ? never : T;
/** Block inference for T from this position (forces explicit <T> when payload is present). */
type NoInfer<T> = [T][T extends any ? 0 : never];

export type SuccessPayload<T extends object> = {
  data: NonEmptyObject<T> | NonEmptyObject<T>[];
  meta?: Record<string, unknown>;
};

export type PaginatedPayload<T extends object> = {
  data: NonEmptyObject<T>[];
  page: number;
  pageSize: number;
  total: number;
  meta?: Record<string, unknown>;
};

declare global {
  namespace Express {
    interface Response {
      /** 200 OK — no payload (returns data.data = []) */
      success(): this;
      /** 200 OK — requires explicit generic when payload is provided */
      success<T extends object>(payload: SuccessPayload<NoInfer<T>>): this;

      /** 201 Created — no payload (returns data.data = []) */
      created(): this;
      /** 201 Created — requires explicit generic when payload is provided */
      created<T extends object>(payload: SuccessPayload<NoInfer<T>>): this;

      /** 204 No Content */
      noContent(): this;

      /** 200 OK — paginated; requires explicit generic */
      paginated<T extends object>(payload: PaginatedPayload<NoInfer<T>>): this;
    }
  }
}

/** Normalize single/array/nullish to array */
function normalizeArray<T>(data: T | T[] | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  if (data == null) return [];
  return [data];
}

export default function responseHelpers(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  // ---- success overloads ----
  function success(this: Response): Response;
  function success<T extends object>(
    this: Response,
    payload: SuccessPayload<NoInfer<T>>
  ): Response;

  function success<T extends object>(
    this: Response,
    payload?: SuccessPayload<NoInfer<T>>
  ): Response {
    return this.status(200).json({
      status: 200,
      success: true,
      data: {
        data: normalizeArray((payload as any)?.data),
        meta: (payload as any)?.meta ?? undefined,
      },
    });
  }

  res.success = success;

  // ---- created overloads ----
  function created(this: Response): Response;
  function created<T extends object>(
    this: Response,
    payload: SuccessPayload<NoInfer<T>>
  ): Response;

  function created<T extends object>(
    this: Response,
    payload?: SuccessPayload<NoInfer<T>>
  ): Response {
    return this.status(201).json({
      status: 201,
      success: true,
      data: {
        data: normalizeArray((payload as any)?.data),
        meta: (payload as any)?.meta ?? undefined,
      },
    });
  }

  res.created = created;

  // ---- noContent ----
  res.noContent = function (this: Response) {
    return this.status(204).end();
  };

  // ---- paginated ----
  res.paginated = function <T extends object>(
    this: Response,
    payload: PaginatedPayload<NoInfer<T>>
  ) {
    const { data, page, pageSize, total, meta } = payload;
    const pages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
    return this.status(200).json({
      status: 200,
      success: true,
      data: {
        data: normalizeArray(data as any),
        meta: { page, pageSize, total, pages, ...meta },
      },
    });
  };

  next();
}
